import {
  blockLabels,
  exitStatusLabels,
  missingItemLabels,
  rescueModeLabels,
  taskTypeLabels,
  type AppMeta,
  type BlockType,
  type ExitResponsibilityStatus,
  type LlmConsentState,
  type MissingItemType,
  type RescueMode,
  type RescuePacket,
  type TaskType
} from "../types";
import { generateRescuePacket } from "../engine/rescueEngine";
import type { ByokSettings } from "./byokSettings";

export type RescueAdapterKind = "local_rules" | "external_llm";

export interface RescueAdapterRequest {
  input: string;
  consent: LlmConsentState;
  existingPacket?: RescuePacket;
}

export interface RescueAdapterResult {
  packet: RescuePacket;
  adapterKind: RescueAdapterKind;
  usedExternalProcessing: boolean;
}

export interface RescueGenerationAdapter {
  id: string;
  label: string;
  requiresExternalProcessing: boolean;
  generate(request: RescueAdapterRequest): Promise<RescueAdapterResult>;
}

export class ExternalLlmConsentRequiredError extends Error {
  code = "external_llm_consent_required" as const;

  constructor() {
    super(
      "External LLM processing requires explicit consent before task text leaves this browser."
    );
    this.name = "ExternalLlmConsentRequiredError";
  }
}

export class ByokConfigurationError extends Error {
  code = "byok_configuration_required" as const;

  constructor(message = "Deep Rescue needs a local BYOK provider and API key first.") {
    super(message);
    this.name = "ByokConfigurationError";
  }
}

export class ExternalLlmRequestError extends Error {
  code = "external_llm_request_failed" as const;

  constructor(message = "Deep Rescue could not complete. The local rescue is still available.") {
    super(message);
    this.name = "ExternalLlmRequestError";
  }
}

interface DeepRescueDraft {
  title?: unknown;
  realTask?: unknown;
  taskType?: unknown;
  blockType?: unknown;
  blockConfidence?: unknown;
  emotionalLoad?: unknown;
  urgency?: unknown;
  consequence?: unknown;
  effort?: unknown;
  firstPhysicalAction?: unknown;
  tenMinutePlan?: unknown;
  minimumViableProgress?: unknown;
  repairScript?: unknown;
  rescueMode?: unknown;
  missingItem?: unknown;
  exitScript?: unknown;
  exitStatus?: unknown;
}

const vagueActionFragments = [
  "work on",
  "do admin",
  "get organized",
  "get organised",
  "try harder",
  "focus",
  "be productive",
  "make progress",
  "start the task"
];

const deepRescueSystemPrompt = `You are the Deep Rescue adapter for Scaffold, a local-first executive-function rescue app.

Return only valid JSON. Do not use markdown.

Scaffold is not a clinical tool and must not diagnose or treat anything.
Use adult, brief, non-shaming language.
Always identify the next physical action.
Never use streak, guilt, discipline, lazy, failed, or try-harder language.
Do not generate an email-style repair script unless the task involves another person, lateness, a missed appointment, clarification, help, renegotiating scope, apology, or an extension request.
If repair is not needed, use "No repair needed yet." and point back to the first physical action.

JSON shape:
{
  "title": "short title",
  "realTask": "actual task",
  "taskType": "email|tax|essay|cleaning|appointment|money|health|admin|work|study|unknown",
  "blockType": "ambiguous_start|overwhelm|shame_fear|boredom|missing_information|low_energy|time_blindness|perfectionism|task_too_large|avoidance_loop|transition_difficulty|unknown",
  "blockConfidence": 0.0,
  "emotionalLoad": 1,
  "urgency": 1,
  "consequence": 1,
  "effort": 1,
  "firstPhysicalAction": "concrete physical action, no vague verbs",
  "tenMinutePlan": ["Minute 0-1: ...", "Minute 1-3: ...", "Minute 3-7: ...", "Minute 7-9: ...", "Minute 9-10: ..."],
  "minimumViableProgress": "what counts as done enough",
  "repairScript": "contextual repair option or No repair needed yet.",
  "rescueMode": "start_tiny|make_it_ugly|repair|body_double|unblock|exit_responsibly",
  "missingItem": "information|material|decision|energy|courage|time|permission|unknown",
  "exitScript": "responsible exit script",
  "exitStatus": "not_chosen|renegotiate|defer|delegate|abandon"
}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArrayValue(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const strings = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, 7);

  return strings.length >= 3 ? strings : fallback;
}

function estimateValue(value: unknown, fallback: 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 | 5 {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(5, Math.round(Number(value)))) as 1 | 2 | 3 | 4 | 5;
}

function confidenceValue(value: unknown, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(1, Number(value)));
}

function unionValue<T extends string>(
  value: unknown,
  labels: Record<T, string>,
  fallback: T
): T {
  return typeof value === "string" && value in labels ? (value as T) : fallback;
}

function isConcretePhysicalAction(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  if (normalized.length < 8) return false;
  return !vagueActionFragments.some((fragment) => normalized.includes(fragment));
}

function isContextualRepair(input: string, fallback: string, candidate: string): boolean {
  if (!fallback.startsWith("No repair needed yet.")) return true;
  const normalizedInput = input.toLowerCase();
  const taskHasRepairContext = [
    "late",
    "delay",
    "missed",
    "appointment",
    "extension",
    "clarify",
    "help",
    "scope",
    "reply",
    "email",
    "message",
    "sorry",
    "apolog"
  ].some((term) => normalizedInput.includes(term));

  if (taskHasRepairContext) return true;
  return !candidate.trim().startsWith("Hi [Name]");
}

function preservePacketIdentity(
  fallback: RescuePacket,
  existingPacket?: RescuePacket
): RescuePacket {
  if (!existingPacket) return fallback;

  return {
    ...fallback,
    id: existingPacket.id,
    originalText: existingPacket.originalText,
    supportLevel: existingPacket.supportLevel,
    status: existingPacket.status,
    createdAt: existingPacket.createdAt,
    sprintHistory: existingPacket.sprintHistory,
    reentryHistory: existingPacket.reentryHistory,
    notes: existingPacket.notes
  };
}

export function validateDeepRescuePacket(
  raw: unknown,
  input: string,
  existingPacket?: RescuePacket
): RescuePacket {
  const fallback = preservePacketIdentity(generateRescuePacket(input), existingPacket);
  const draft: DeepRescueDraft = isRecord(raw) ? raw : {};
  const now = new Date().toISOString();
  const firstPhysicalAction = stringValue(
    draft.firstPhysicalAction,
    fallback.firstPhysicalAction
  );
  const repairScript = stringValue(draft.repairScript, fallback.repairScript);

  return {
    ...fallback,
    title: stringValue(draft.title, fallback.title),
    realTask: stringValue(draft.realTask, fallback.realTask),
    taskType: unionValue<TaskType>(draft.taskType, taskTypeLabels, fallback.taskType),
    blockType: unionValue<BlockType>(draft.blockType, blockLabels, fallback.blockType),
    blockConfidence: confidenceValue(draft.blockConfidence, fallback.blockConfidence),
    emotionalLoad: estimateValue(draft.emotionalLoad, fallback.emotionalLoad),
    urgency: estimateValue(draft.urgency, fallback.urgency),
    consequence: estimateValue(draft.consequence, fallback.consequence),
    effort: estimateValue(draft.effort, fallback.effort),
    firstPhysicalAction: isConcretePhysicalAction(firstPhysicalAction)
      ? firstPhysicalAction
      : fallback.firstPhysicalAction,
    tenMinutePlan: stringArrayValue(draft.tenMinutePlan, fallback.tenMinutePlan),
    minimumViableProgress: stringValue(
      draft.minimumViableProgress,
      fallback.minimumViableProgress
    ),
    repairScript: isContextualRepair(input, fallback.repairScript, repairScript)
      ? repairScript
      : fallback.repairScript,
    rescueMode: unionValue<RescueMode>(draft.rescueMode, rescueModeLabels, fallback.rescueMode),
    missingItem: unionValue<MissingItemType>(
      draft.missingItem,
      missingItemLabels,
      fallback.missingItem
    ),
    exitScript: stringValue(draft.exitScript, fallback.exitScript),
    exitStatus: unionValue<ExitResponsibilityStatus>(
      draft.exitStatus,
      exitStatusLabels,
      fallback.exitStatus
    ),
    updatedAt: now,
    lastTouchedAt: now
  };
}

export function canUseExternalLlm(consent: LlmConsentState): boolean {
  return consent.externalLlmEnabled && Boolean(consent.consentedAt);
}

export const localRulesRescueAdapter: RescueGenerationAdapter = {
  id: "local_rules",
  label: "Local rules",
  requiresExternalProcessing: false,
  async generate({ input }) {
    return {
      packet: generateRescuePacket(input),
      adapterKind: "local_rules",
      usedExternalProcessing: false
    };
  }
};

export function createExternalLlmRescueAdapter(
  generateWithExternalLlm: (
    input: string,
    existingPacket?: RescuePacket
  ) => Promise<RescuePacket>
): RescueGenerationAdapter {
  return {
    id: "external_llm",
    label: "External LLM",
    requiresExternalProcessing: true,
    async generate({ input, consent, existingPacket }) {
      if (!canUseExternalLlm(consent)) {
        throw new ExternalLlmConsentRequiredError();
      }

      return {
        packet: await generateWithExternalLlm(input, existingPacket),
        adapterKind: "external_llm",
        usedExternalProcessing: true
      };
    }
  };
}

function buildDeepRescueUserPrompt(input: string, existingPacket?: RescuePacket): string {
  return JSON.stringify(
    {
      taskText: input,
      currentPacket: existingPacket
        ? {
            title: existingPacket.title,
            realTask: existingPacket.realTask,
            taskType: existingPacket.taskType,
            blockType: existingPacket.blockType,
            firstPhysicalAction: existingPacket.firstPhysicalAction,
            rescueMode: existingPacket.rescueMode,
            repairScript: existingPacket.repairScript
          }
        : undefined
    },
    null,
    2
  );
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new ExternalLlmRequestError("Deep Rescue returned a response that was not JSON.");
  }

  return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
}

async function parseResponse(response: Response): Promise<unknown> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ExternalLlmRequestError("Deep Rescue returned an unreadable response.");
  }

  if (!response.ok) {
    throw new ExternalLlmRequestError(
      `Deep Rescue request failed with status ${response.status}. Check the local provider settings.`
    );
  }

  return payload;
}

function extractOpenAiText(payload: unknown): string {
  if (!isRecord(payload)) {
    throw new ExternalLlmRequestError("OpenAI returned an unexpected response.");
  }

  const choices = payload.choices;
  if (!Array.isArray(choices) || !isRecord(choices[0])) {
    throw new ExternalLlmRequestError("OpenAI response did not include a message.");
  }

  const message = choices[0].message;
  if (!isRecord(message) || typeof message.content !== "string") {
    throw new ExternalLlmRequestError("OpenAI response did not include JSON content.");
  }

  return message.content;
}

function extractAnthropicText(payload: unknown): string {
  if (!isRecord(payload) || !Array.isArray(payload.content)) {
    throw new ExternalLlmRequestError("Anthropic returned an unexpected response.");
  }

  const textBlock = payload.content.find(
    (block) => isRecord(block) && block.type === "text" && typeof block.text === "string"
  );

  if (!isRecord(textBlock) || typeof textBlock.text !== "string") {
    throw new ExternalLlmRequestError("Anthropic response did not include JSON content.");
  }

  return textBlock.text;
}

async function callOpenAiCompatible(
  settings: ByokSettings,
  input: string,
  existingPacket?: RescuePacket
): Promise<unknown> {
  const endpoint = settings.endpoint.trim();
  if (!endpoint) {
    throw new ByokConfigurationError("Add an OpenAI-compatible endpoint first.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey.trim()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: settings.model.trim(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: deepRescueSystemPrompt },
        { role: "user", content: buildDeepRescueUserPrompt(input, existingPacket) }
      ]
    })
  });

  return parseJsonObject(extractOpenAiText(await parseResponse(response)));
}

async function callAnthropic(
  settings: ByokSettings,
  input: string,
  existingPacket?: RescuePacket
): Promise<unknown> {
  const response = await fetch(settings.endpoint.trim(), {
    method: "POST",
    headers: {
      "x-api-key": settings.apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: settings.model.trim(),
      max_tokens: 1800,
      temperature: 0.2,
      system: deepRescueSystemPrompt,
      messages: [
        { role: "user", content: buildDeepRescueUserPrompt(input, existingPacket) }
      ]
    })
  });

  return parseJsonObject(extractAnthropicText(await parseResponse(response)));
}

export function createByokRescueAdapter(settings: ByokSettings): RescueGenerationAdapter {
  return createExternalLlmRescueAdapter(async (input, existingPacket) => {
    if (!settings.apiKey.trim()) {
      throw new ByokConfigurationError();
    }

    const rawDraft =
      settings.provider === "anthropic"
        ? await callAnthropic(settings, input, existingPacket)
        : await callOpenAiCompatible(settings, input, existingPacket);

    return validateDeepRescuePacket(rawDraft, input, existingPacket);
  });
}

export async function generateRescuePacketWithAdapter(
  input: string,
  consent: AppMeta["llmConsent"],
  adapter: RescueGenerationAdapter = localRulesRescueAdapter,
  existingPacket?: RescuePacket
): Promise<RescueAdapterResult> {
  if (adapter.requiresExternalProcessing && !canUseExternalLlm(consent)) {
    throw new ExternalLlmConsentRequiredError();
  }

  return adapter.generate({ input, consent, existingPacket });
}
