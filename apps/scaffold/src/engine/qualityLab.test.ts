import { describe, expect, it } from "vitest";
import type { RescuePacket } from "../types";
import { generateRescuePacket } from "./rescueEngine";
import {
  comparePacketQuality,
  goldenRescueFixtures,
  isConcreteNextAction,
  scorePacketQuality,
  summarizeQualitySignals
} from "./qualityLab";

describe("rescue quality lab", () => {
  it("scores golden local packets without requiring external processing", () => {
    const fixture = goldenRescueFixtures.find(
      (item) => item.id === "assignment-ambiguous-start"
    );
    expect(fixture).toBeDefined();

    const packet = generateRescuePacket(fixture!.messyInput);
    const score = scorePacketQuality(packet, fixture);

    expect(score.score).toBeGreaterThanOrEqual(82);
    expect(score.criteria.find((item) => item.id === "repair_relevance")?.passed).toBe(
      true
    );
    expect(packet.repairScript).toMatch(/^No repair needed yet/);
  });

  it("penalizes vague next actions and misplaced repair", () => {
    const fixture = goldenRescueFixtures.find(
      (item) => item.id === "assignment-ambiguous-start"
    )!;
    const vaguePacket: RescuePacket = {
      ...generateRescuePacket(fixture.messyInput),
      firstPhysicalAction: "Work on the assignment and focus.",
      repairScript:
        "Hi [Name], I'm sorry for the delay. I can send [specific thing] by [time/date]."
    };

    const score = scorePacketQuality(vaguePacket, fixture);

    expect(isConcreteNextAction(vaguePacket.firstPhysicalAction)).toBe(false);
    expect(score.score).toBeLessThan(82);
    expect(score.criteria.find((item) => item.id === "repair_relevance")?.passed).toBe(
      false
    );
  });

  it("compares a candidate packet against local rules", () => {
    const fixture = goldenRescueFixtures.find((item) => item.id === "late-email-shame")!;
    const local = generateRescuePacket(fixture.messyInput);
    const candidate: RescuePacket = {
      ...local,
      firstPhysicalAction:
        "Open the email thread and type one factual holding reply sentence.",
      blockConfidence: 0.96
    };

    const comparison = comparePacketQuality(local, candidate, fixture);

    expect(comparison.candidate.score).toBeGreaterThanOrEqual(
      comparison.local.score
    );
    expect(comparison.rows.map((row) => row.label)).toContain(
      "Next physical action"
    );
  });

  it("summarizes local feedback signals without producing a score", () => {
    const summary = summarizeQualitySignals([
      {
        id: "quality-1",
        fixtureId: "late-email-shame",
        input: "late email",
        choice: "local_better",
        dimension: "next_action",
        localScore: 90,
        deepScore: 82,
        createdAt: new Date().toISOString()
      },
      {
        id: "quality-2",
        input: "tax",
        choice: "both_useful",
        dimension: "repair",
        localScore: 88,
        createdAt: new Date().toISOString()
      }
    ]);

    expect(summary.total).toBe(2);
    expect(summary.byChoice.map((item) => item.label)).toContain("Local better");
    expect(summary.byDimension.map((item) => item.label)).toContain("Repair");
  });
});
