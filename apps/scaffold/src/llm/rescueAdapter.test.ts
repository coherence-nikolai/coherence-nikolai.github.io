import { describe, expect, it, vi } from "vitest";
import type { LlmConsentState } from "../types";
import { generateRescuePacket } from "../engine/rescueEngine";
import {
  ByokConfigurationError,
  ExternalLlmConsentRequiredError,
  canUseExternalLlm,
  createByokRescueAdapter,
  createExternalLlmRescueAdapter,
  generateRescuePacketWithAdapter,
  localRulesRescueAdapter,
  validateDeepRescuePacket
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

  it("validates Deep Rescue output without replacing packet identity", () => {
    const packet = generateRescuePacket("I need to start my assignment.");
    const nextPacket = validateDeepRescuePacket(
      {
        title: "Assignment first move",
        realTask: "Start the assignment",
        taskType: "study",
        blockType: "ambiguous_start",
        blockConfidence: 0.92,
        emotionalLoad: 3,
        urgency: 4,
        consequence: 4,
        effort: 2,
        firstPhysicalAction: "Open the assignment brief and copy the question into a document.",
        tenMinutePlan: [
          "Minute 0-1: Open the assignment brief.",
          "Minute 1-3: Copy the question into a document.",
          "Minute 3-7: Write one ugly bullet.",
          "Minute 7-9: Save the file.",
          "Minute 9-10: Choose the next tiny move."
        ],
        minimumViableProgress: "The document is open with one ugly bullet.",
        repairScript: "Hi [Name], this should not be here.",
        rescueMode: "start_tiny",
        missingItem: "unknown",
        exitScript: "Hi [Name], I need to exit this responsibly.",
        exitStatus: "not_chosen"
      },
      packet.originalText,
      packet
    );

    expect(nextPacket.id).toBe(packet.id);
    expect(nextPacket.firstPhysicalAction).toContain("Open the assignment brief");
    expect(nextPacket.repairScript).toMatch(/^No repair needed yet/);
  });

  it("falls back when Deep Rescue returns a vague first action", () => {
    const packet = generateRescuePacket("I need to do my tax but I keep avoiding it.");
    const nextPacket = validateDeepRescuePacket(
      {
        firstPhysicalAction: "Work on tax.",
        tenMinutePlan: ["One", "Two", "Three"]
      },
      packet.originalText,
      packet
    );

    expect(nextPacket.firstPhysicalAction).toBe(packet.firstPhysicalAction);
  });

  it("requires a local BYOK key before calling the provider", async () => {
    const adapter = createByokRescueAdapter({
      provider: "openai",
      apiKey: "",
      model: "gpt-4.1-mini",
      endpoint: "https://api.openai.com/v1/chat/completions"
    });

    await expect(
      generateRescuePacketWithAdapter("send this outside", explicitConsent, adapter)
    ).rejects.toBeInstanceOf(ByokConfigurationError);
  });

  it("can parse OpenAI-compatible BYOK JSON into a validated packet", async () => {
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: "Reply without shame",
                  realTask: "Reply to the late email",
                  taskType: "email",
                  blockType: "shame_fear",
                  blockConfidence: 0.9,
                  emotionalLoad: 5,
                  urgency: 5,
                  consequence: 3,
                  effort: 2,
                  firstPhysicalAction:
                    "Open the email thread and draft two accountable sentences.",
                  tenMinutePlan: [
                    "Minute 0-1: Open the email thread.",
                    "Minute 1-3: Draft two accountable sentences.",
                    "Minute 3-7: Remove overexplaining.",
                    "Minute 7-9: Send or save the reply.",
                    "Minute 9-10: Write the next concrete step."
                  ],
                  minimumViableProgress: "A two-sentence reply exists.",
                  repairScript:
                    "Hi [Name], I'm sorry for the delay. I can send [specific thing] by [time/date].",
                  rescueMode: "repair",
                  missingItem: "courage",
                  exitScript: "Hi [Name], I need to exit this responsibly.",
                  exitStatus: "not_chosen"
                })
              }
            }
          ]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    ) as typeof fetch;
    vi.stubGlobal("fetch", fetchMock);

    const adapter = createByokRescueAdapter({
      provider: "openai",
      apiKey: "test-key",
      model: "gpt-4.1-mini",
      endpoint: "https://api.openai.com/v1/chat/completions"
    });

    const result = await generateRescuePacketWithAdapter(
      "I need to reply to this email but I feel ashamed it is late.",
      explicitConsent,
      adapter
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.usedExternalProcessing).toBe(true);
    expect(result.packet.title).toBe("Reply without shame");
    expect(result.packet.firstPhysicalAction).toContain("Open the email thread");

    vi.stubGlobal("fetch", originalFetch);
  });
});
