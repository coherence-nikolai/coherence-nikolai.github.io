import Dexie, { type Table } from "dexie";
import {
  exitStatusLabels,
  missingItemLabels,
  blockLabels,
  rescueModeLabels,
  statusLabels,
  supportLabels,
  taskTypeLabels,
  type AppMeta,
  type BlockType,
  type ExitResponsibilityStatus,
  type LlmConsentState,
  type MissingItemType,
  type QualitySignal,
  type QualitySignalChoice,
  type QualitySignalDimension,
  type RescueMode,
  type ReentryEvent,
  type RescuePacket,
  type Sprint,
  type SprintOutcome,
  type Status,
  type SupportLevel
} from "../types";
import {
  classifyBlock,
  classifyBlockWithConfidence,
  classifyTaskType,
  detectMissingItem,
  generateExitResponsiblyScript
} from "../engine/rescueEngine";

export interface ScaffoldExport {
  version: 1;
  exportedAt: string;
  packets: RescuePacket[];
  meta: AppMeta;
}

class ScaffoldDatabase extends Dexie {
  packets!: Table<RescuePacket, string>;
  meta!: Table<AppMeta, string>;

  constructor() {
    super("scaffold-rescue-db");
    this.version(1).stores({
      packets: "id,status,blockType,rescueMode,updatedAt,lastTouchedAt",
      meta: "id"
    });
  }
}

export const db = new ScaffoldDatabase();

export function defaultMeta(): AppMeta {
  return {
    id: "default",
    reentries: 0,
    repairs: 0,
    supportFadingEvents: 0,
    qualitySignals: [],
    llmConsent: defaultLlmConsent(),
    updatedAt: new Date().toISOString()
  };
}

export function defaultLlmConsent(): LlmConsentState {
  return {
    externalLlmEnabled: false,
    providerLabel: "No external LLM adapter connected"
  };
}

export async function ensureMeta(): Promise<AppMeta> {
  const existing = await db.meta.get("default");
  if (existing) {
    const meta = normalizeMeta(existing);
    if (!isLlmConsentState(existing.llmConsent)) {
      await db.meta.put(meta);
    }
    return meta;
  }

  const meta = defaultMeta();
  await db.meta.put(meta);
  return meta;
}

export async function loadLocalData(): Promise<{
  packets: RescuePacket[];
  meta: AppMeta;
}> {
  const [packets, meta] = await Promise.all([
    db.packets.toArray(),
    ensureMeta()
  ]);

  return {
    packets: packets.map(normalizePacket).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
    meta
  };
}

export async function savePacket(packet: RescuePacket): Promise<void> {
  await db.packets.put(packet);
}

export async function saveMeta(meta: AppMeta): Promise<void> {
  await db.meta.put({ ...meta, updatedAt: new Date().toISOString() });
}

export async function buildExport(): Promise<ScaffoldExport> {
  const { packets, meta } = await loadLocalData();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    packets,
    meta
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const sprintOutcomes: SprintOutcome[] = [
  "started",
  "tiny_progress",
  "blocked",
  "repair",
  "stop_responsibly",
  "done_enough"
];

const reentryActions = [
  "resume_first_move",
  "repair_this",
  "unblock_missing_piece",
  "exit_responsibly"
] as const;

const qualitySignalChoices = [
  "local_better",
  "deep_better",
  "both_useful",
  "neither_clear"
] as const;

const qualitySignalDimensions = [
  "next_action",
  "block",
  "plan",
  "repair",
  "overall"
] as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isEstimate(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

function isBlockType(value: unknown): value is BlockType {
  return typeof value === "string" && value in blockLabels;
}

function isRescueMode(value: unknown): value is RescueMode {
  return typeof value === "string" && value in rescueModeLabels;
}

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && value in statusLabels;
}

function isSupportLevel(value: unknown): value is SupportLevel {
  return typeof value === "string" && value in supportLabels;
}

function isTaskType(value: unknown): value is RescuePacket["taskType"] {
  return typeof value === "string" && value in taskTypeLabels;
}

function isMissingItem(value: unknown): value is MissingItemType {
  return typeof value === "string" && value in missingItemLabels;
}

function isExitStatus(value: unknown): value is ExitResponsibilityStatus {
  return typeof value === "string" && value in exitStatusLabels;
}

function isSprintOutcome(value: unknown): value is SprintOutcome {
  return typeof value === "string" && sprintOutcomes.includes(value as SprintOutcome);
}

function isIsoDateLike(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function isSprint(value: unknown): value is Sprint {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.packetId === "string" &&
    isIsoDateLike(value.startedAt) &&
    (value.endedAt === undefined || isIsoDateLike(value.endedAt)) &&
    typeof value.durationMinutes === "number" &&
    Number.isFinite(value.durationMinutes) &&
    value.durationMinutes > 0 &&
    (value.outcome === undefined || isSprintOutcome(value.outcome)) &&
    (value.notes === undefined || typeof value.notes === "string")
  );
}

function isReentryEvent(value: unknown): value is ReentryEvent {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.packetId === "string" &&
    typeof value.actionType === "string" &&
    reentryActions.includes(value.actionType as (typeof reentryActions)[number]) &&
    isIsoDateLike(value.createdAt) &&
    (value.note === undefined || typeof value.note === "string")
  );
}

function isLlmConsentState(value: unknown): value is LlmConsentState {
  if (!isRecord(value)) return false;

  return (
    typeof value.externalLlmEnabled === "boolean" &&
    typeof value.providerLabel === "string" &&
    (value.consentedAt === undefined || isIsoDateLike(value.consentedAt)) &&
    (value.revokedAt === undefined || isIsoDateLike(value.revokedAt))
  );
}

function isQualitySignalChoice(value: unknown): value is QualitySignalChoice {
  return (
    typeof value === "string" &&
    qualitySignalChoices.includes(value as (typeof qualitySignalChoices)[number])
  );
}

function isQualitySignalDimension(value: unknown): value is QualitySignalDimension {
  return (
    typeof value === "string" &&
    qualitySignalDimensions.includes(value as (typeof qualitySignalDimensions)[number])
  );
}

function isQualityScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

function isQualitySignal(value: unknown): value is QualitySignal {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    (value.fixtureId === undefined || typeof value.fixtureId === "string") &&
    typeof value.input === "string" &&
    isQualitySignalChoice(value.choice) &&
    isQualitySignalDimension(value.dimension) &&
    isQualityScore(value.localScore) &&
    (value.deepScore === undefined || isQualityScore(value.deepScore)) &&
    (value.note === undefined || typeof value.note === "string") &&
    isIsoDateLike(value.createdAt)
  );
}

export function isPacket(value: unknown): value is RescuePacket {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.originalText === "string" &&
    typeof value.realTask === "string" &&
    isTaskType(value.taskType) &&
    isBlockType(value.blockType) &&
    typeof value.blockConfidence === "number" &&
    Number.isFinite(value.blockConfidence) &&
    value.blockConfidence >= 0 &&
    value.blockConfidence <= 1 &&
    isEstimate(value.emotionalLoad) &&
    isEstimate(value.urgency) &&
    isEstimate(value.consequence) &&
    isEstimate(value.effort) &&
    typeof value.firstPhysicalAction === "string" &&
    isStringArray(value.tenMinutePlan) &&
    typeof value.minimumViableProgress === "string" &&
    typeof value.repairScript === "string" &&
    isMissingItem(value.missingItem) &&
    typeof value.exitScript === "string" &&
    isExitStatus(value.exitStatus) &&
    isRescueMode(value.rescueMode) &&
    isSupportLevel(value.supportLevel) &&
    isStatus(value.status) &&
    isIsoDateLike(value.createdAt) &&
    isIsoDateLike(value.updatedAt) &&
    isIsoDateLike(value.lastTouchedAt) &&
    Array.isArray(value.sprintHistory) &&
    value.sprintHistory.every(isSprint) &&
    typeof value.notes === "string" &&
    Array.isArray(value.reentryHistory) &&
    value.reentryHistory.every(isReentryEvent)
  );
}

function isImportablePacket(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.originalText === "string" &&
    typeof value.realTask === "string" &&
    isBlockType(value.blockType) &&
    isEstimate(value.emotionalLoad) &&
    isEstimate(value.urgency) &&
    isEstimate(value.consequence) &&
    isEstimate(value.effort) &&
    typeof value.firstPhysicalAction === "string" &&
    isStringArray(value.tenMinutePlan) &&
    typeof value.minimumViableProgress === "string" &&
    typeof value.repairScript === "string" &&
    isRescueMode(value.rescueMode) &&
    isSupportLevel(value.supportLevel) &&
    isStatus(value.status) &&
    isIsoDateLike(value.createdAt) &&
    isIsoDateLike(value.updatedAt) &&
    isIsoDateLike(value.lastTouchedAt) &&
    Array.isArray(value.sprintHistory) &&
    value.sprintHistory.every(isSprint) &&
    typeof value.notes === "string"
  );
}

function normalizePacket(packet: RescuePacket | Record<string, unknown>): RescuePacket {
  const originalText =
    typeof packet.originalText === "string" ? packet.originalText : "";
  const taskType = isTaskType(packet.taskType)
    ? packet.taskType
    : classifyTaskType(originalText);
  const blockType = isBlockType(packet.blockType)
    ? packet.blockType
    : classifyBlock(originalText);
  const confidence =
    typeof packet.blockConfidence === "number" &&
    Number.isFinite(packet.blockConfidence) &&
    packet.blockConfidence >= 0 &&
    packet.blockConfidence <= 1
      ? packet.blockConfidence
      : classifyBlockWithConfidence(originalText).confidence;
  const missingItem = isMissingItem(packet.missingItem)
    ? packet.missingItem
    : detectMissingItem(originalText);
  const exitStatus = isExitStatus(packet.exitStatus)
    ? packet.exitStatus
    : "not_chosen";

  return {
    ...(packet as RescuePacket),
    taskType,
    blockType,
    blockConfidence: confidence,
    missingItem,
    exitScript:
      typeof packet.exitScript === "string"
        ? packet.exitScript
        : generateExitResponsiblyScript(originalText, taskType, exitStatus),
    exitStatus,
    reentryHistory:
      Array.isArray(packet.reentryHistory) && packet.reentryHistory.every(isReentryEvent)
        ? packet.reentryHistory
        : []
  };
}

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function normalizeMeta(value: unknown): AppMeta {
  const metaRaw = isRecord(value) ? value : defaultMeta();
  const llmConsent = isLlmConsentState(metaRaw.llmConsent)
    ? metaRaw.llmConsent
    : defaultLlmConsent();

  return {
    id: "default",
    reentries: safeCount(metaRaw.reentries),
    repairs: safeCount(metaRaw.repairs),
    supportFadingEvents: safeCount(metaRaw.supportFadingEvents),
    qualitySignals:
      Array.isArray(metaRaw.qualitySignals) &&
      metaRaw.qualitySignals.every(isQualitySignal)
        ? metaRaw.qualitySignals.slice(-200)
        : [],
    llmConsent,
    updatedAt:
      typeof metaRaw.updatedAt === "string"
        ? metaRaw.updatedAt
        : new Date().toISOString()
  };
}

export function parseImportPayload(raw: unknown): ScaffoldExport {
  if (!isRecord(raw)) {
    throw new Error("Import file is not a Scaffold JSON export.");
  }

  if (raw.version !== 1) {
    throw new Error("Import file version is not supported.");
  }

  const packetsRaw = raw.packets;
  if (!Array.isArray(packetsRaw) || !packetsRaw.every(isImportablePacket)) {
    throw new Error("Import file does not contain valid rescue packets.");
  }

  const meta = normalizeMeta(raw.meta);

  return {
    version: 1,
    exportedAt:
      typeof raw.exportedAt === "string"
        ? raw.exportedAt
        : new Date().toISOString(),
    packets: packetsRaw.map(normalizePacket),
    meta
  };
}

export async function replaceLocalData(raw: unknown): Promise<ScaffoldExport> {
  const payload = parseImportPayload(raw);

  await db.transaction("rw", db.packets, db.meta, async () => {
    await db.packets.clear();
    await db.meta.clear();
    await db.packets.bulkPut(payload.packets);
    await db.meta.put(payload.meta);
  });

  return payload;
}
