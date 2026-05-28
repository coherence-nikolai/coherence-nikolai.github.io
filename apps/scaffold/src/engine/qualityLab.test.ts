import { describe, expect, it } from "vitest";
import type { RescuePacket } from "../types";
import { generateRescuePacket } from "./rescueEngine";
import {
  buildQualityExport,
  buildQualityRegressionWatch,
  comparePacketQuality,
  defaultQualityThresholds,
  goldenRescueFixtures,
  makeQualityBaselines,
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

    expect(score.score).toBeGreaterThanOrEqual(78);
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

  it("respects active quality thresholds", () => {
    const fixture = goldenRescueFixtures.find(
      (item) => item.id === "assignment-ambiguous-start"
    )!;
    const vaguePacket: RescuePacket = {
      ...generateRescuePacket(fixture.messyInput),
      firstPhysicalAction: "Work on the assignment and focus."
    };

    const strict = scorePacketQuality(vaguePacket, fixture);
    const relaxed = scorePacketQuality(vaguePacket, fixture, {
      ...defaultQualityThresholds,
      nextActionMustBePhysical: false,
      forbidVagueVerbs: false
    });

    expect(relaxed.score).toBeGreaterThan(strict.score);
  });

  it("builds regression watch items from local baselines", () => {
    const fixture = goldenRescueFixtures[0];
    const baselines = makeQualityBaselines([
      {
        fixtureId: fixture.id,
        score: 70
      }
    ], "2026-05-28T00:00:00.000Z");
    const watch = buildQualityRegressionWatch(
      [fixture],
      [{ fixtureId: fixture.id, score: 84 }],
      baselines
    );

    expect(watch[0].state).toBe("improved");
    expect(watch[0].delta).toBe(14);
  });

  it("exports fixtures, thresholds, signals, and local scores as an eval corpus", () => {
    const fixture = goldenRescueFixtures[0];
    const packet = generateRescuePacket(fixture.messyInput);
    const score = scorePacketQuality(packet, fixture);
    const payload = buildQualityExport(
      [fixture],
      defaultQualityThresholds,
      [],
      [],
      [{ fixtureId: fixture.id, title: fixture.title, score }]
    );

    expect(payload.version).toBe(1);
    expect(payload.fixtures[0].id).toBe(fixture.id);
    expect(payload.thresholds.nextActionMustBePhysical).toBe(true);
    expect(payload.localScores[0].suggestions.length).toBeGreaterThan(0);
  });
});
