import {
  blockLabels,
  qualitySignalChoiceLabels,
  qualitySignalDimensionLabels,
  rescueModeLabels,
  taskTypeLabels,
  type BlockType,
  type QualitySignal,
  type QualitySignalChoice,
  type QualitySignalDimension,
  type RescueMode,
  type RescuePacket,
  type TaskType
} from "../types";

export interface GoldenRescueFixture {
  id: string;
  title: string;
  messyInput: string;
  whyItMatters: string;
  expected: {
    taskType: TaskType;
    blockType: BlockType;
    rescueMode?: RescueMode;
    repair: "needed" | "not_needed";
    firstActionIncludes: string[];
    planIncludes?: string[];
  };
}

export interface QualityCriterion {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
  detail: string;
}

export interface PacketQualityScore {
  score: number;
  label: "strong" | "usable" | "needs_work";
  summary: string;
  criteria: QualityCriterion[];
}

export interface PacketComparisonRow {
  label: string;
  local: string;
  candidate: string;
  winner: "local" | "candidate" | "tie";
}

export interface PacketQualityComparison {
  local: PacketQualityScore;
  candidate: PacketQualityScore;
  rows: PacketComparisonRow[];
  recommendation: "local" | "candidate" | "tie";
}

export interface QualitySignalSummary {
  total: number;
  byChoice: Array<{ choice: QualitySignalChoice; label: string; count: number }>;
  byDimension: Array<{
    dimension: QualitySignalDimension;
    label: string;
    count: number;
  }>;
  recentSignals: QualitySignal[];
}

export const goldenRescueFixtures: GoldenRescueFixture[] = [
  {
    id: "late-email-shame",
    title: "Late email with shame",
    messyInput: "I need to reply to this email but I feel ashamed it is late.",
    whyItMatters: "Repair should be relevant, brief, and not self-shaming.",
    expected: {
      taskType: "email",
      blockType: "shame_fear",
      rescueMode: "repair",
      repair: "needed",
      firstActionIncludes: ["thread", "reply"],
      planIncludes: ["overexplain"]
    }
  },
  {
    id: "assignment-ambiguous-start",
    title: "Assignment blank start",
    messyInput: "I need to start my assignment and I don't know where to start.",
    whyItMatters: "Private initiation tasks should not invent an email repair.",
    expected: {
      taskType: "study",
      blockType: "ambiguous_start",
      rescueMode: "start_tiny",
      repair: "not_needed",
      firstActionIncludes: ["course", "question"]
    }
  },
  {
    id: "tax-overwhelm",
    title: "Tax overwhelm",
    messyInput: "I need to do my tax but there are too many receipts and I keep avoiding it.",
    whyItMatters: "The packet should reduce the tax surface to one document.",
    expected: {
      taskType: "tax",
      blockType: "overwhelm",
      rescueMode: "start_tiny",
      repair: "not_needed",
      firstActionIncludes: ["receipt"],
      planIncludes: ["sorting every document"]
    }
  },
  {
    id: "cleaning-too-big",
    title: "Room feels too big",
    messyInput: "I need to clean but the room feels too big and everything is too much.",
    whyItMatters: "Cleaning rescue should create one visible surface change.",
    expected: {
      taskType: "cleaning",
      blockType: "overwhelm",
      rescueMode: "start_tiny",
      repair: "not_needed",
      firstActionIncludes: ["visible"],
      planIncludes: ["whole room"]
    }
  },
  {
    id: "missed-appointment",
    title: "Missed appointment",
    messyInput: "I missed a dentist appointment and I feel embarrassed about calling.",
    whyItMatters: "Appointment repair should support a clear reschedule action.",
    expected: {
      taskType: "appointment",
      blockType: "shame_fear",
      rescueMode: "repair",
      repair: "needed",
      firstActionIncludes: ["calendar", "message"],
      planIncludes: ["accountable"]
    }
  },
  {
    id: "money-bill-avoidance",
    title: "Bill avoidance",
    messyInput: "I need to pay this bill but I keep avoiding looking at my bank account.",
    whyItMatters: "Money rescue should ask for one exact next money action.",
    expected: {
      taskType: "money",
      blockType: "avoidance_loop",
      rescueMode: "start_tiny",
      repair: "not_needed",
      firstActionIncludes: ["bill"]
    }
  },
  {
    id: "health-low-energy",
    title: "Health low energy",
    messyInput: "I need to refill my medication but I am exhausted and can't get up.",
    whyItMatters: "Low-energy rescue should lower physical setup cost.",
    expected: {
      taskType: "health",
      blockType: "low_energy",
      rescueMode: "start_tiny",
      repair: "not_needed",
      firstActionIncludes: ["medication"]
    }
  },
  {
    id: "admin-missing-info",
    title: "Admin missing info",
    messyInput: "I need to fill in this insurance form but I don't understand what they want.",
    whyItMatters: "Missing information should name the missing field, not force completion.",
    expected: {
      taskType: "admin",
      blockType: "missing_information",
      rescueMode: "unblock",
      repair: "not_needed",
      firstActionIncludes: ["form", "field"]
    }
  },
  {
    id: "work-scope-renegotiate",
    title: "Work scope too large",
    messyInput: "I need to finish the client proposal but the scope is too much.",
    whyItMatters: "Work scope should make renegotiation available without drama.",
    expected: {
      taskType: "work",
      blockType: "overwhelm",
      rescueMode: "start_tiny",
      repair: "needed",
      firstActionIncludes: ["work"],
      planIncludes: ["scope"]
    }
  },
  {
    id: "essay-perfectionism",
    title: "Essay perfectionism",
    messyInput: "My essay draft is not good enough and I keep trying to make it perfect.",
    whyItMatters: "Perfectionism should produce an intentionally rough next move.",
    expected: {
      taskType: "essay",
      blockType: "perfectionism",
      rescueMode: "make_it_ugly",
      repair: "not_needed",
      firstActionIncludes: ["document"],
      planIncludes: ["polishing"]
    }
  }
];

const vagueFragments = [
  "work on",
  "do admin",
  "get organized",
  "get organised",
  "try harder",
  "focus",
  "be productive",
  "make progress",
  "start the task",
  "deal with",
  "sort it out"
];

const physicalVerbs = [
  "open",
  "write",
  "search",
  "put",
  "stand",
  "paste",
  "type",
  "find",
  "copy",
  "move",
  "read",
  "set",
  "draft",
  "clear",
  "touch",
  "send"
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesEvery(value: string, fragments: string[]): boolean {
  const normalized = normalize(value);
  return fragments.every((fragment) => normalized.includes(fragment.toLowerCase()));
}

function includesSome(value: string, fragments: string[]): boolean {
  const normalized = normalize(value);
  return fragments.some((fragment) => normalized.includes(fragment.toLowerCase()));
}

function isVague(value: string): boolean {
  const normalized = normalize(value);
  return vagueFragments.some((fragment) => normalized.includes(fragment));
}

function hasPhysicalVerb(value: string): boolean {
  const normalized = normalize(value);
  return physicalVerbs.some(
    (verb) => normalized.startsWith(`${verb} `) || normalized.includes(` ${verb} `)
  );
}

function criterion(
  id: string,
  label: string,
  weight: number,
  passed: boolean,
  detail: string
): QualityCriterion {
  return { id, label, passed, weight, detail };
}

export function isConcreteNextAction(action: string): boolean {
  const normalized = normalize(action);

  return (
    normalized.length >= 16 &&
    normalized.split(" ").length >= 4 &&
    hasPhysicalVerb(normalized) &&
    !isVague(normalized)
  );
}

function labelForScore(score: number): PacketQualityScore["label"] {
  if (score >= 82) return "strong";
  if (score >= 64) return "usable";
  return "needs_work";
}

function repairMatches(packet: RescuePacket, fixture?: GoldenRescueFixture): boolean {
  const repair = normalize(packet.repairScript);
  const saysNoRepair = repair.startsWith("no repair needed yet");

  if (!fixture) return repair.length > 0;
  if (fixture.expected.repair === "needed") return !saysNoRepair;
  return saysNoRepair && !repair.startsWith("hi [name]");
}

function planIsConcrete(packet: RescuePacket, fixture?: GoldenRescueFixture): boolean {
  const joined = packet.tenMinutePlan.join(" ");
  const planHasShape = packet.tenMinutePlan.length >= 5;
  const planAvoidsVagueLanguage = !isVague(joined);
  const fixtureFragments = fixture?.expected.planIncludes ?? [];
  const matchesFixture =
    fixtureFragments.length === 0 || includesSome(joined, fixtureFragments);

  return planHasShape && planAvoidsVagueLanguage && matchesFixture;
}

export function scorePacketQuality(
  packet: RescuePacket,
  fixture?: GoldenRescueFixture
): PacketQualityScore {
  const criteria: QualityCriterion[] = [
    criterion(
      "next_action_concrete",
      "Concrete next physical action",
      24,
      isConcreteNextAction(packet.firstPhysicalAction),
      "The first move names a physical or on-screen action instead of vague effort."
    ),
    criterion(
      "next_action_matches_fixture",
      "Next action touches the expected object",
      12,
      fixture
        ? includesEvery(packet.firstPhysicalAction, fixture.expected.firstActionIncludes)
        : true,
      fixture
        ? `Expected: ${fixture.expected.firstActionIncludes.join(", ")}.`
        : "No fixture target selected."
    ),
    criterion(
      "task_type",
      "Task type match",
      10,
      fixture ? packet.taskType === fixture.expected.taskType : packet.taskType !== "unknown",
      fixture
        ? `Expected ${taskTypeLabels[fixture.expected.taskType]}.`
        : "A known task type gives the rescue more shape."
    ),
    criterion(
      "block_type",
      "Block match",
      10,
      fixture ? packet.blockType === fixture.expected.blockType : packet.blockType !== "unknown",
      fixture
        ? `Expected ${blockLabels[fixture.expected.blockType]}.`
        : "A named block makes the plan more specific."
    ),
    criterion(
      "rescue_mode",
      "Rescue mode fit",
      8,
      fixture?.expected.rescueMode
        ? packet.rescueMode === fixture.expected.rescueMode
        : true,
      fixture?.expected.rescueMode
        ? `Expected ${rescueModeLabels[fixture.expected.rescueMode]}.`
        : "No mode expectation for this input."
    ),
    criterion(
      "plan_shape",
      "Plan is bounded and concrete",
      16,
      planIsConcrete(packet, fixture),
      "The 10-minute plan should be small, bounded, and task-specific."
    ),
    criterion(
      "repair_relevance",
      "Repair relevance",
      12,
      repairMatches(packet, fixture),
      "Repair appears only when another person, lateness, help, clarification, or scope needs it."
    ),
    criterion(
      "minimum_progress",
      "Minimum viable progress is visible",
      8,
      packet.minimumViableProgress.length >= 16 && !isVague(packet.minimumViableProgress),
      "Done enough should describe a visible change, not a mood or score."
    )
  ];

  const score = Math.round(
    criteria.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0)
  );
  const label = labelForScore(score);

  return {
    score,
    label,
    summary:
      label === "strong"
        ? "Strong rescue packet. The first move is concrete and the support stays bounded."
        : label === "usable"
          ? "Usable packet. One or two areas need tightening before it feels premium."
          : "Needs work. The packet risks vague support or misplaced repair.",
    criteria
  };
}

function rowWinner(
  localPassed: boolean,
  candidatePassed: boolean
): PacketComparisonRow["winner"] {
  if (localPassed === candidatePassed) return "tie";
  return candidatePassed ? "candidate" : "local";
}

export function comparePacketQuality(
  localPacket: RescuePacket,
  candidatePacket: RescuePacket,
  fixture?: GoldenRescueFixture
): PacketQualityComparison {
  const local = scorePacketQuality(localPacket, fixture);
  const candidate = scorePacketQuality(candidatePacket, fixture);
  const localCriteria = new Map(local.criteria.map((item) => [item.id, item]));
  const candidateCriteria = new Map(candidate.criteria.map((item) => [item.id, item]));

  const rows: PacketComparisonRow[] = [
    {
      label: "Next physical action",
      local: localPacket.firstPhysicalAction,
      candidate: candidatePacket.firstPhysicalAction,
      winner: rowWinner(
        Boolean(localCriteria.get("next_action_concrete")?.passed),
        Boolean(candidateCriteria.get("next_action_concrete")?.passed)
      )
    },
    {
      label: "Task and block",
      local: `${taskTypeLabels[localPacket.taskType]} / ${blockLabels[localPacket.blockType]}`,
      candidate: `${taskTypeLabels[candidatePacket.taskType]} / ${blockLabels[candidatePacket.blockType]}`,
      winner: rowWinner(
        Boolean(localCriteria.get("task_type")?.passed) &&
          Boolean(localCriteria.get("block_type")?.passed),
        Boolean(candidateCriteria.get("task_type")?.passed) &&
          Boolean(candidateCriteria.get("block_type")?.passed)
      )
    },
    {
      label: "10-minute plan",
      local: localPacket.tenMinutePlan.join(" "),
      candidate: candidatePacket.tenMinutePlan.join(" "),
      winner: rowWinner(
        Boolean(localCriteria.get("plan_shape")?.passed),
        Boolean(candidateCriteria.get("plan_shape")?.passed)
      )
    },
    {
      label: "Repair",
      local: localPacket.repairScript,
      candidate: candidatePacket.repairScript,
      winner: rowWinner(
        Boolean(localCriteria.get("repair_relevance")?.passed),
        Boolean(candidateCriteria.get("repair_relevance")?.passed)
      )
    }
  ];

  return {
    local,
    candidate,
    rows,
    recommendation:
      candidate.score > local.score + 4
        ? "candidate"
        : local.score > candidate.score + 4
          ? "local"
          : "tie"
  };
}

function countBy<T extends string>(items: T[], order: readonly T[]) {
  return order.map((item) => ({
    item,
    count: items.filter((value) => value === item).length
  }));
}

export function summarizeQualitySignals(
  signals: QualitySignal[]
): QualitySignalSummary {
  const recentSignals = [...signals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    total: signals.length,
    byChoice: countBy(
      signals.map((signal) => signal.choice),
      Object.keys(qualitySignalChoiceLabels) as QualitySignalChoice[]
    )
      .filter((item) => item.count > 0)
      .map(({ item, count }) => ({
        choice: item,
        label: qualitySignalChoiceLabels[item],
        count
      })),
    byDimension: countBy(
      signals.map((signal) => signal.dimension),
      Object.keys(qualitySignalDimensionLabels) as QualitySignalDimension[]
    )
      .filter((item) => item.count > 0)
      .map(({ item, count }) => ({
        dimension: item,
        label: qualitySignalDimensionLabels[item],
        count
      })),
    recentSignals
  };
}
