import type {
  AppMeta,
  BlockType,
  ExitResponsibilityStatus,
  MissingItemType,
  PatternActionSuggestion,
  PatternMap,
  RescueMode,
  RescuePacket,
  TaskType
} from "../types";
import {
  blockLabels,
  exitStatusLabels,
  missingItemLabels,
  rescueModeLabels,
  taskTypeLabels
} from "../types";
import { isSuccessfulOutcome } from "./rescueEngine";

function countBy<T extends string>(items: T[]): Array<{ key: T; count: number }> {
  const counts = items.reduce<Map<T, number>>((map, item) => {
    map.set(item, (map.get(item) ?? 0) + 1);
    return map;
  }, new Map<T, number>());

  return Array.from(counts, ([key, count]) => ({ key, count })).sort(
    (a, b) => b.count - a.count
  );
}

function timeBucket(isoDate: string): string {
  const hour = new Date(isoDate).getHours();

  if (hour < 6) return "Late night";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Late night";
}

function successfulSprintCount(packet: RescuePacket): number {
  return packet.sprintHistory.filter((sprint) =>
    sprint.outcome ? isSuccessfulOutcome(sprint.outcome) : false
  ).length;
}

function rescuePatternLabel(packet: RescuePacket): string {
  return `${taskTypeLabels[packet.taskType]} + ${blockLabels[packet.blockType]} -> ${
    rescueModeLabels[packet.rescueMode]
  }`;
}

function lowerLabel(label: string): string {
  return label.toLowerCase();
}

function articleFor(label: string): string {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}

function exitVerb(status: ExitResponsibilityStatus): string {
  switch (status) {
    case "renegotiate":
      return "renegotiating";
    case "defer":
      return "deferring";
    case "delegate":
      return "delegating";
    case "abandon":
      return "closing";
    case "not_chosen":
      return "choosing a responsible exit for";
  }
}

function buildActionSuggestions(packets: RescuePacket[]): PatternActionSuggestion[] {
  const successfulPatterns = Array.from(
    packets.reduce<
      Map<
        string,
        {
          taskType: TaskType;
          blockType: BlockType;
          rescueMode: RescueMode;
          count: number;
        }
      >
    >((map, packet) => {
      const count = successfulSprintCount(packet);
      if (count === 0) return map;

      const key = `${packet.taskType}|${packet.blockType}|${packet.rescueMode}`;
      const current = map.get(key) ?? {
        taskType: packet.taskType,
        blockType: packet.blockType,
        rescueMode: packet.rescueMode,
        count: 0
      };
      map.set(key, { ...current, count: current.count + count });
      return map;
    }, new Map()),
    ([key, value]) => ({ key, ...value })
  ).sort((a, b) => b.count - a.count);

  const fromSuccess = successfulPatterns.slice(0, 2).map((pattern) => {
    const taskLabel = taskTypeLabels[pattern.taskType];
    const blockLabel = blockLabels[pattern.blockType];
    const modeLabel = rescueModeLabels[pattern.rescueMode];

    return {
      id: `success-${pattern.key}`,
      title: `${taskLabel} often starts with ${modeLabel}.`,
      body: `${blockLabel} has started before with this rescue mode. Use it as a starting scaffold, then edit the task in your own words.`,
      ctaLabel: "Use starter",
      draftText: `I need to rescue ${articleFor(taskLabel)} ${lowerLabel(taskLabel)} task. The likely block is ${lowerLabel(
        blockLabel
      )}. Start me with ${modeLabel}.`,
      taskType: pattern.taskType,
      blockType: pattern.blockType,
      rescueMode: pattern.rescueMode
    } satisfies PatternActionSuggestion;
  });

  const missingItems = countBy(
    packets
      .map((packet) => packet.missingItem)
      .filter((missingItem) => missingItem !== "unknown")
  );
  const fromMissing = missingItems.slice(0, 1).map(({ key }) => {
    const missingLabel = missingItemLabels[key as MissingItemType];

    return {
      id: `missing-${key}`,
      title: `${missingLabel} is often the missing piece.`,
      body: "Try Unblock before planning the whole task. Name the missing piece, then find or request only that.",
      ctaLabel: "Start unblock",
      draftText: `I need to rescue a task. What is missing is ${lowerLabel(
        missingLabel
      )}. Help me find only that first.`,
      rescueMode: "unblock",
      missingItem: key as MissingItemType
    } satisfies PatternActionSuggestion;
  });

  const exits = countBy(
    packets
      .map((packet) => packet.exitStatus)
      .filter((exitStatus) => exitStatus !== "not_chosen")
  );
  const fromExit = exits.slice(0, 1).map(({ key }) => {
    const exitLabel = exitStatusLabels[key as ExitResponsibilityStatus];

    return {
      id: `exit-${key}`,
      title: `${exitLabel} has been a responsible exit.`,
      body: "Use this when the task should be renegotiated, deferred, delegated, or closed clearly.",
      ctaLabel: "Draft exit",
      draftText: `I need to exit responsibly by ${exitVerb(
        key as ExitResponsibilityStatus
      )} this task. Help me write the next accountable step.`,
      rescueMode: "exit_responsibly",
      exitStatus: key as ExitResponsibilityStatus
    } satisfies PatternActionSuggestion;
  });

  return [...fromSuccess, ...fromMissing, ...fromExit].slice(0, 4);
}

export function generatePatternMap(
  packets: RescuePacket[],
  meta: AppMeta
): PatternMap {
  const commonBlocks = countBy(packets.map((packet) => packet.blockType)).map(
    ({ key, count }) => ({
      type: key as BlockType,
      label: blockLabels[key as BlockType],
      count
    })
  );

  const commonRescueModes = countBy(packets.map((packet) => packet.rescueMode)).map(
    ({ key, count }) => ({
      mode: key as RescueMode,
      label: rescueModeLabels[key as RescueMode],
      count
    })
  );

  const commonTaskTypes = countBy(packets.map((packet) => packet.taskType)).map(
    ({ key, count }) => ({
      type: key as TaskType,
      label: taskTypeLabels[key as TaskType],
      count
    })
  );

  const commonMissingItems = countBy(
    packets
      .map((packet) => packet.missingItem)
      .filter((missingItem) => missingItem !== "unknown")
  ).map(({ key, count }) => ({
    type: key as MissingItemType,
    label: missingItemLabels[key as MissingItemType],
    count
  }));

  const exitChoices = countBy(
    packets
      .map((packet) => packet.exitStatus)
      .filter((exitStatus) => exitStatus !== "not_chosen")
  ).map(({ key, count }) => ({
    status: key as ExitResponsibilityStatus,
    label: exitStatusLabels[key as ExitResponsibilityStatus],
    count
  }));

  const tasksMostOftenAvoided = countBy(
    packets
      .filter((packet) => packet.status !== "done_enough" && packet.status !== "archived")
      .filter((packet) => packet.status !== "exited_responsibly")
      .map((packet) => packet.realTask)
  )
    .slice(0, 5)
    .map(({ key, count }) => ({ task: key, count }));

  const allSprints = packets.flatMap((packet) => packet.sprintHistory);
  const timesOfDayStarts = countBy(allSprints.map((sprint) => timeBucket(sprint.startedAt)))
    .slice(0, 4)
    .map(({ key, count }) => ({ label: key, count }));

  const successfulStarts = allSprints.filter((sprint) =>
    sprint.outcome ? isSuccessfulOutcome(sprint.outcome) : false
  ).length;

  const successfulRescuePatterns = Array.from(
    packets.reduce<Map<string, { count: number; total: number }>>((map, packet) => {
      const label = rescuePatternLabel(packet);
      const current = map.get(label) ?? { count: 0, total: 0 };
      map.set(label, {
        count: current.count + successfulSprintCount(packet),
        total: current.total + packet.sprintHistory.length
      });
      return map;
    }, new Map<string, { count: number; total: number }>()),
    ([label, values]) => ({ label, ...values })
  )
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || b.total - a.total)
    .slice(0, 5);

  const repairs =
    meta.repairs +
    packets.filter((packet) => packet.status === "repaired").length +
    allSprints.filter((sprint) => sprint.outcome === "repair").length;

  return {
    commonBlocks,
    commonRescueModes,
    commonTaskTypes,
    commonMissingItems,
    exitChoices,
    successfulRescuePatterns,
    actionSuggestions: buildActionSuggestions(packets),
    tasksMostOftenAvoided,
    timesOfDayStarts,
    successfulStarts,
    repairs,
    reentries: meta.reentries,
    responsibleExits:
      packets.filter((packet) => packet.status === "exited_responsibly").length +
      allSprints.filter((sprint) => sprint.outcome === "stop_responsibly").length,
    supportFadingEvents: meta.supportFadingEvents
  };
}
