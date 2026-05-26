import type { LlmConsentState, RescuePacket } from "../types";
import { generateRescuePacket } from "../engine/rescueEngine";

export type RescueAdapterKind = "local_rules" | "external_llm";

export interface RescueAdapterRequest {
  input: string;
  consent: LlmConsentState;
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
  generateWithExternalLlm: (input: string) => Promise<RescuePacket>
): RescueGenerationAdapter {
  return {
    id: "external_llm",
    label: "External LLM",
    requiresExternalProcessing: true,
    async generate({ input, consent }) {
      if (!canUseExternalLlm(consent)) {
        throw new ExternalLlmConsentRequiredError();
      }

      return {
        packet: await generateWithExternalLlm(input),
        adapterKind: "external_llm",
        usedExternalProcessing: true
      };
    }
  };
}

export async function generateRescuePacketWithAdapter(
  input: string,
  consent: LlmConsentState,
  adapter: RescueGenerationAdapter = localRulesRescueAdapter
): Promise<RescueAdapterResult> {
  if (adapter.requiresExternalProcessing && !canUseExternalLlm(consent)) {
    throw new ExternalLlmConsentRequiredError();
  }

  return adapter.generate({ input, consent });
}
