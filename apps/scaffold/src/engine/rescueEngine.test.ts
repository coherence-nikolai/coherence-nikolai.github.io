import { describe, expect, it } from "vitest";
import type { RescuePacket } from "../types";
import {
  calculateRescuePriority,
  classifyBlock,
  generateReentryList,
  generateRepairScript,
  generateRescuePacket,
  updateSupportLevel
} from "./rescueEngine";

function packet(overrides: Partial<RescuePacket> = {}): RescuePacket {
  return {
    ...generateRescuePacket("I need to reply to this email but it is late"),
    ...overrides
  };
}

describe("rescue rules engine", () => {
  it("classifies shame and fear from late or ashamed language", () => {
    expect(classifyBlock("I need to reply to this email but I feel ashamed it is late")).toBe(
      "shame_fear"
    );
  });

  it("classifies overwhelm from too much and frozen language", () => {
    expect(classifyBlock("I have too many things and I am frozen")).toBe("overwhelm");
  });

  it("classifies ambiguous start from start uncertainty", () => {
    expect(classifyBlock("I have an essay due and I don't know where to start")).toBe(
      "ambiguous_start"
    );
  });

  it("classifies perfectionism from not good enough language", () => {
    expect(classifyBlock("The draft is not good enough and it has to be perfect")).toBe(
      "perfectionism"
    );
  });

  it("generates a brief adult repair script without shame language", () => {
    const script = generateRepairScript("late email reply", "shame_fear");

    expect(script).toContain("I'm sorry for the delay");
    expect(script).not.toMatch(/failed|lazy|should have|try harder/i);
  });

  it("prioritizes urgent high-consequence packets", () => {
    const low = packet({
      urgency: 2,
      consequence: 2,
      emotionalLoad: 2,
      effort: 5,
      status: "rescue_now"
    });
    const high = packet({
      urgency: 5,
      consequence: 5,
      emotionalLoad: 4,
      effort: 2,
      status: "rescue_now"
    });

    expect(calculateRescuePriority(high)).toBeGreaterThan(
      calculateRescuePriority(low)
    );
  });

  it("fades support after repeated successful starts", () => {
    const existing = packet({
      supportLevel: "full_scaffold",
      sprintHistory: [
        {
          id: "sprint-1",
          packetId: "packet-1",
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          durationMinutes: 4,
          outcome: "started"
        }
      ]
    });

    expect(updateSupportLevel(existing, "tiny_progress")).toBe("guided_scaffold");
    expect(updateSupportLevel(existing, "blocked")).toBe("full_scaffold");
  });

  it("generates a top-three re-entry list and filters completed work", () => {
    const oldDate = new Date(Date.now() - 5 * 86_400_000).toISOString();
    const urgent = packet({
      id: "urgent",
      title: "Urgent tax",
      urgency: 5,
      consequence: 5,
      effort: 2,
      status: "rescue_now",
      lastTouchedAt: oldDate
    });
    const low = packet({
      id: "low",
      title: "Low stakes",
      urgency: 1,
      consequence: 1,
      status: "in_progress"
    });
    const done = packet({
      id: "done",
      title: "Done",
      urgency: 5,
      consequence: 5,
      status: "done_enough"
    });

    const list = generateReentryList([low, done, urgent]);

    expect(list).toHaveLength(2);
    expect(list[0].id).toBe("urgent");
    expect(list.some((item) => item.id === "done")).toBe(false);
  });
});
