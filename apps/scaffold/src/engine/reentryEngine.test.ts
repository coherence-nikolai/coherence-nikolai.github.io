import { describe, expect, it } from "vitest";
import type { RescuePacket } from "../types";
import {
  detectReentryState,
  generateReentryActions,
  generateSmartReentryList
} from "./reentryEngine";
import { generateRescuePacket } from "./rescueEngine";

const nowMs = new Date("2026-05-26T12:00:00.000Z").getTime();

function hoursAgo(hours: number): string {
  return new Date(nowMs - hours * 3_600_000).toISOString();
}

function packet(
  input = "I need to reply to this email but I feel ashamed it is late.",
  overrides: Partial<RescuePacket> = {}
): RescuePacket {
  return {
    ...generateRescuePacket(input),
    ...overrides
  };
}

describe("re-entry intelligence", () => {
  it("detects meaningful gaps without marking completed packets", () => {
    expect(
      detectReentryState(
        packet("I need to do my tax but I keep avoiding it.", {
          status: "in_progress",
          lastTouchedAt: hoursAgo(26)
        }),
        nowMs
      )
    ).toBe("return_after_gap");

    expect(
      detectReentryState(
        packet("I need to book the appointment.", {
          status: "waiting",
          lastTouchedAt: hoursAgo(3)
        }),
        nowMs
      )
    ).toBe("recently_touched");

    expect(
      detectReentryState(
        packet("I need to reply to the email.", {
          status: "done_enough",
          lastTouchedAt: hoursAgo(48)
        }),
        nowMs
      )
    ).toBe("fresh");
  });

  it("ranks re-entry by gap, responsibility, and prior successful patterns", () => {
    const successSeed = packet(undefined, {
      id: "success-seed",
      status: "done_enough",
      sprintHistory: [
        {
          id: "sprint-success",
          packetId: "success-seed",
          startedAt: hoursAgo(50),
          endedAt: hoursAgo(49),
          durationMinutes: 10,
          outcome: "started"
        }
      ]
    });
    const target = packet(undefined, {
      id: "target",
      status: "rescue_now",
      lastTouchedAt: hoursAgo(30),
      missingItem: "courage",
      exitStatus: "renegotiate",
      urgency: 4,
      consequence: 4,
      effort: 2
    });
    const low = packet("I should clean a shelf someday.", {
      id: "low",
      status: "rescue_now",
      lastTouchedAt: hoursAgo(1),
      urgency: 1,
      consequence: 1,
      emotionalLoad: 1,
      effort: 5
    });

    const list = generateSmartReentryList([low, successSeed, target], nowMs);

    expect(list.map((item) => item.id)).toEqual(["target", "low"]);
  });

  it("prioritizes one-tap re-entry actions for shame and missing pieces", () => {
    const shamePacket = packet(undefined, {
      status: "rescue_now",
      lastTouchedAt: hoursAgo(28),
      missingItem: "courage"
    });
    const actions = generateReentryActions(shamePacket, [shamePacket], nowMs);

    expect(actions[0].actionType).toBe("repair_this");
    expect(actions.map((action) => action.actionType)).toEqual([
      "repair_this",
      "unblock_missing_piece",
      "resume_first_move",
      "exit_responsibly"
    ]);
    expect(actions[0].body).toMatch(/accountable script/i);
  });
});
