import { describe, expect, it, vi } from "vitest";
import type { LlmConsentState } from "../types";
import { generateRescuePacket } from "../engine/rescueEngine";
import {
  ExternalLlmConsentRequiredError,
  canUseExternalLlm,
  createExternalLlmRescueAdapter,
  generateRescuePacketWithAdapter,
  localRulesRescueAdapter
} from "./rescueAdapter";

const noConsent: LlmConsentState = {
  externalLlmEnabled: false,
  providerLabel: "No external LLM adapter connected"
};

const explicitConsent: LlmConsentState = {
  externalLlmEnabled: true,
  providerLabel: "External LLM",
  consentedAt: "2026-05-26T12:00:00.000Z"
};

describe("LLM adapter consent boundary", () => {
  it("uses local rules without external consent", async () => {
    const result = await generateRescuePacketWithAdapter(
      "I need to reply to this email but I feel ashamed it is late.",
      noConsent,
      localRulesRescueAdapter
    );

    expect(result.adapterKind).toBe("local_rules");
    expect(result.usedExternalProcessing).toBe(false);
    expect(result.packet.blockType).toBe("shame_fear");
  });

  it("does not call an external adapter without explicit consent", async () => {
    const externalGenerate = vi.fn(async () =>
      generateRescuePacket("I need to do my tax but I keep avoiding it.")
    );
    const adapter = createExternalLlmRescueAdapter(externalGenerate);

    await expect(
      generateRescuePacketWithAdapter("send this text outside", noConsent, adapter)
    ).rejects.toBeInstanceOf(ExternalLlmConsentRequiredError);
    expect(externalGenerate).not.toHaveBeenCalled();
  });

  it("allows an external adapter only after consent is recorded", async () => {
    const externalGenerate = vi.fn(async () =>
      generateRescuePacket("I need to do my tax but I keep avoiding it.")
    );
    const adapter = createExternalLlmRescueAdapter(externalGenerate);

    const result = await generateRescuePacketWithAdapter(
      "I need to do my tax but I keep avoiding it.",
      explicitConsent,
      adapter
    );

    expect(canUseExternalLlm(explicitConsent)).toBe(true);
    expect(externalGenerate).toHaveBeenCalledOnce();
    expect(result.adapterKind).toBe("external_llm");
    expect(result.usedExternalProcessing).toBe(true);
  });
});
