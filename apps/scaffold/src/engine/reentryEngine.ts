import type {
  ReentryAction,
  ReentryState,
  RescuePacket
} from "../types";
import { calculateRescuePriority, isSuccessfulOutcome } from "./rescueEngine";

const meaningfulGapHours = 24;
const activeStatuses = ["rescue_now", "in_progress", "waiting"] as const;

function hoursSince(value: string, nowMs: number): number {
  const touchedMs = new Date(value).getTime();
  if (!Number.isFinite(touchedMs)) return 0;

  return Math.max(0, (nowMs - touchedMs) / 3_600_000);
}

function activePacket(packet: RescuePacket): boolean {
  return activeStatuses.includes(packet.status as (typeof activeStatuses)[number]);
}

function matchingSuccessfulPatternCount(
  packet: RescuePacket,
  packets: RescuePacket[]
): number {
  return packets
    .filter(
      (candidate) =>
        candidate.id !== packet.id &&
        candidate.taskType === packet.taskType &&
        candidate.blockType === packet.blockType
    )
    .flatMap((candidate) => candidate.sprintHistory)
    .filter((sprint) => (sprint.outcome ? isSuccessfulOutcome(sprint.outcome) : false))
    .length;
}

export function detectReentryState(
  packet: RescuePacket,
  nowMs = Date.now()
): ReentryState {
  if (!activePacket(packet)) return "fresh";

  const gapHours = hoursSince(packet.lastTouchedAt, nowMs);
  if (gapHours >= meaningfulGapHours) return "return_after_gap";
  if (gapHours > 2) return "recently_touched";

  return "fresh";
}

export function calculateSmartReentryPriority(
  packet: RescuePacket,
  packets: RescuePacket[],
  nowMs = Date.now()
): number {
  if (!activePacket(packet)) return 0;

  const base = calculateRescuePriority(packet, nowMs);
  const state = detectReentryState(packet, nowMs);
  const gapBoost = state === "return_after_gap" ? 5 : state === "recently_touched" ? 1 : 0;
  const missingBoost = packet.missingItem !== "unknown" ? 1.7 : 0;
  const repairBoost =
    packet.blockType === "shame_fear" || packet.rescueMode === "repair" ? 2 : 0;
  const exitClarityBoost = packet.exitStatus !== "not_chosen" ? 1 : 0;
  const successPatternBoost = Math.min(3, matchingSuccessfulPatternCount(packet, packets));
  const reentryFatiguePenalty = Math.min(3, packet.reentryHistory.length * 0.75);

  return (
    base +
    gapBoost +
    missingBoost +
    repairBoost +
    exitClarityBoost +
    successPatternBoost -
    reentryFatiguePenalty
  );
}

export function generateSmartReentryList(
  packets: RescuePacket[],
  nowMs = Date.now()
): RescuePacket[] {
  return packets
    .filter(activePacket)
    .sort(
      (a, b) =>
        calculateSmartReentryPriority(b, packets, nowMs) -
        calculateSmartReentryPriority(a, packets, nowMs)
    )
    .slice(0, 3);
}

export function generateReentryActions(
  packet: RescuePacket,
  packets: RescuePacket[],
  nowMs = Date.now()
): ReentryAction[] {
  const state = detectReentryState(packet, nowMs);
  const successfulPatternCount = matchingSuccessfulPatternCount(packet, packets);
  const gapText =
    state === "return_after_gap"
      ? "No explanation needed. Pick up the first physical action again."
      : "Use the first physical action without rebuilding the whole plan.";

  const actions: ReentryAction[] = [
    {
      actionType: "resume_first_move",
      label: "Resume first move",
      body:
        successfulPatternCount > 0
          ? "This kind of rescue has started before. Use the first move again."
          : gapText,
      priority: 6 + successfulPatternCount
    },
    {
      actionType: "repair_this",
      label: "Repair this",
      body: "Use the brief accountable script and make the next step visible.",
      priority:
        packet.blockType === "shame_fear" || packet.rescueMode === "repair" ? 8 : 3
    },
    {
      actionType: "unblock_missing_piece",
      label: "Unblock missing piece",
      body:
        packet.missingItem === "unknown"
          ? "Name what is missing: information, material, decision, energy, courage, time, or permission."
          : "Start with the missing piece instead of the whole task.",
      priority: packet.missingItem === "unknown" ? 4 : 7
    },
    {
      actionType: "exit_responsibly",
      label: "Exit responsibly",
      body: "Renegotiate, defer, delegate, or close this clearly.",
      priority:
        packet.exitStatus !== "not_chosen" || packet.effort >= 4 || packet.consequence >= 4
          ? 6
          : 2
    }
  ];

  return actions.sort((a, b) => b.priority - a.priority);
}
