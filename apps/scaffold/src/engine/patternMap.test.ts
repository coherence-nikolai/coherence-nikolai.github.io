import { describe, expect, it } from "vitest";
import { generateRescuePacket } from "./rescueEngine";
import { generatePatternMap } from "./patternMap";
import { defaultQualityThresholds } from "./qualityLab";
import type { AppMeta, RescuePacket } from "../types";

const meta: AppMeta = {
  id: "default",
  reentries: 2,
  repairs: 0,
  supportFadingEvents: 1,
  qualityFixtures: [],
  qualityThresholds: defaultQualityThresholds,
  qualityBaselines: [],
  qualitySignals: [],
  llmConsent: {
    externalLlmEnabled: false,
    providerLabel: "No external LLM adapter connected"
  },
  updatedAt: new Date().toISOString()
};

function withSprint(packet: RescuePacket, outcome: "started" | "tiny_progress"): RescuePacket {
  return {
    ...packet,
    status: outcome === "started" ? "in_progress" : "done_enough",
    sprintHistory: [
      {
        id: `${packet.id}-sprint`,
        packetId: packet.id,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: 3,
        outcome
      }
    ]
  };
}

describe("pattern map", () => {
  it("summarizes task types, missing items, exits, and successful rescue patterns", () => {
    const email = withSprint(
      generateRescuePacket("I need to reply to this email but I feel ashamed it is late."),
      "started"
    );
    const tax = generateRescuePacket(
      "I need to do my tax today but there are too many receipts and I am frozen."
    );
    const workExit = {
      ...generateRescuePacket("I need to finish the work proposal but the scope is too much."),
      status: "exited_responsibly",
      exitStatus: "renegotiate",
      rescueMode: "exit_responsibly"
    } satisfies RescuePacket;

    const map = generatePatternMap([email, tax, workExit], meta);

    expect(map.commonTaskTypes.map((item) => item.label)).toContain("Email / message");
    expect(map.commonTaskTypes.map((item) => item.label)).toContain("Tax");
    expect(map.commonMissingItems.map((item) => item.label)).toContain("Courage");
    expect(map.commonMissingItems.map((item) => item.label)).toContain("Material");
    expect(map.exitChoices).toEqual([
      {
        status: "renegotiate",
        label: "Renegotiate",
        count: 1
      }
    ]);
    expect(map.responsibleExits).toBe(1);
    expect(map.successfulRescuePatterns[0].label).toContain("Email / message");
    expect(map.successfulRescuePatterns[0].count).toBe(1);
    expect(map.actionSuggestions[0].title).toContain("Email / message");
    expect(map.actionSuggestions[0].draftText).toContain("Start me with Repair");
    expect(map.actionSuggestions.some((item) => item.ctaLabel === "Start unblock")).toBe(
      true
    );
    expect(map.actionSuggestions.some((item) => item.ctaLabel === "Draft exit")).toBe(
      true
    );
    expect(map.successfulStarts).toBe(1);
  });
});
