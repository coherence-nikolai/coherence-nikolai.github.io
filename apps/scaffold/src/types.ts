export type BlockType =
  | "ambiguous_start"
  | "overwhelm"
  | "shame_fear"
  | "boredom"
  | "missing_information"
  | "low_energy"
  | "time_blindness"
  | "perfectionism"
  | "task_too_large"
  | "avoidance_loop"
  | "transition_difficulty"
  | "unknown";

export type RescueMode =
  | "start_tiny"
  | "make_it_ugly"
  | "repair"
  | "body_double"
  | "unblock"
  | "exit_responsibly";

export type TaskType =
  | "email"
  | "tax"
  | "essay"
  | "cleaning"
  | "appointment"
  | "money"
  | "health"
  | "admin"
  | "work"
  | "study"
  | "unknown";

export type MissingItemType =
  | "information"
  | "material"
  | "decision"
  | "energy"
  | "courage"
  | "time"
  | "permission"
  | "unknown";

export type ExitResponsibilityStatus =
  | "not_chosen"
  | "renegotiate"
  | "defer"
  | "delegate"
  | "abandon";

export type Status =
  | "rescue_now"
  | "in_progress"
  | "waiting"
  | "repaired"
  | "done_enough"
  | "exited_responsibly"
  | "archived";

export type SupportLevel =
  | "full_scaffold"
  | "guided_scaffold"
  | "light_nudge"
  | "self_led";

export type SprintOutcome =
  | "started"
  | "tiny_progress"
  | "blocked"
  | "repair"
  | "stop_responsibly"
  | "done_enough";

export type ReentryState =
  | "fresh"
  | "recently_touched"
  | "return_after_gap";

export type ReentryActionType =
  | "resume_first_move"
  | "repair_this"
  | "unblock_missing_piece"
  | "exit_responsibly";

export type QualitySignalChoice =
  | "local_better"
  | "deep_better"
  | "both_useful"
  | "neither_clear";

export type QualitySignalDimension =
  | "next_action"
  | "block"
  | "plan"
  | "repair"
  | "overall";

export type QualityRepairExpectation = "needed" | "not_needed";

export interface QualityFixture {
  id: string;
  title: string;
  messyInput: string;
  whyItMatters: string;
  expected: {
    taskType: TaskType;
    blockType: BlockType;
    rescueMode?: RescueMode;
    repair: QualityRepairExpectation;
    firstActionIncludes: string[];
    planIncludes?: string[];
  };
  source: "starter" | "custom";
  createdAt: string;
  updatedAt: string;
}

export interface QualityThresholds {
  nextActionMustBePhysical: boolean;
  repairMustBeRelevant: boolean;
  planMustBeBounded: boolean;
  minimumProgressMustBeVisible: boolean;
  forbidVagueVerbs: boolean;
}

export interface QualityBaseline {
  fixtureId: string;
  score: number;
  capturedAt: string;
}

export interface Sprint {
  id: string;
  packetId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  outcome?: SprintOutcome;
  notes?: string;
}

export interface ReentryEvent {
  id: string;
  packetId: string;
  actionType: ReentryActionType;
  createdAt: string;
  note?: string;
}

export interface ReentryAction {
  actionType: ReentryActionType;
  label: string;
  body: string;
  priority: number;
}

export interface RescuePacket {
  id: string;
  title: string;
  originalText: string;
  realTask: string;
  taskType: TaskType;
  blockType: BlockType;
  blockConfidence: number;
  emotionalLoad: 1 | 2 | 3 | 4 | 5;
  urgency: 1 | 2 | 3 | 4 | 5;
  consequence: 1 | 2 | 3 | 4 | 5;
  effort: 1 | 2 | 3 | 4 | 5;
  firstPhysicalAction: string;
  tenMinutePlan: string[];
  minimumViableProgress: string;
  repairScript: string;
  missingItem: MissingItemType;
  exitScript: string;
  exitStatus: ExitResponsibilityStatus;
  rescueMode: RescueMode;
  supportLevel: SupportLevel;
  status: Status;
  createdAt: string;
  updatedAt: string;
  lastTouchedAt: string;
  sprintHistory: Sprint[];
  reentryHistory: ReentryEvent[];
  notes: string;
}

export interface PatternMap {
  commonBlocks: Array<{ type: BlockType; label: string; count: number }>;
  commonRescueModes: Array<{ mode: RescueMode; label: string; count: number }>;
  commonTaskTypes: Array<{ type: TaskType; label: string; count: number }>;
  commonMissingItems: Array<{ type: MissingItemType; label: string; count: number }>;
  exitChoices: Array<{
    status: ExitResponsibilityStatus;
    label: string;
    count: number;
  }>;
  successfulRescuePatterns: Array<{ label: string; count: number; total: number }>;
  actionSuggestions: PatternActionSuggestion[];
  tasksMostOftenAvoided: Array<{ task: string; count: number }>;
  timesOfDayStarts: Array<{ label: string; count: number }>;
  successfulStarts: number;
  repairs: number;
  reentries: number;
  responsibleExits: number;
  supportFadingEvents: number;
}

export interface PatternActionSuggestion {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  draftText: string;
  taskType?: TaskType;
  blockType?: BlockType;
  rescueMode?: RescueMode;
  missingItem?: MissingItemType;
  exitStatus?: ExitResponsibilityStatus;
}

export interface QualitySignal {
  id: string;
  fixtureId?: string;
  input: string;
  choice: QualitySignalChoice;
  dimension: QualitySignalDimension;
  localScore: number;
  deepScore?: number;
  note?: string;
  createdAt: string;
}

export interface LlmConsentState {
  externalLlmEnabled: boolean;
  providerLabel: string;
  consentedAt?: string;
  revokedAt?: string;
}

export interface AppMeta {
  id: "default";
  reentries: number;
  repairs: number;
  supportFadingEvents: number;
  qualityFixtures: QualityFixture[];
  qualityThresholds: QualityThresholds;
  qualityBaselines: QualityBaseline[];
  qualitySignals: QualitySignal[];
  llmConsent: LlmConsentState;
  updatedAt: string;
}

export const blockLabels: Record<BlockType, string> = {
  ambiguous_start: "Ambiguous start",
  overwhelm: "Overwhelm",
  shame_fear: "Shame or fear",
  boredom: "Understimulation",
  missing_information: "Missing information",
  low_energy: "Low energy",
  time_blindness: "Time blindness",
  perfectionism: "Perfectionism",
  task_too_large: "Task too large",
  avoidance_loop: "Avoidance loop",
  transition_difficulty: "Transition difficulty",
  unknown: "Unknown block"
};

export const rescueModeLabels: Record<RescueMode, string> = {
  start_tiny: "Start Tiny",
  make_it_ugly: "Make It Ugly",
  repair: "Repair",
  body_double: "Body Double",
  unblock: "Unblock",
  exit_responsibly: "Exit Responsibly"
};

export const taskTypeLabels: Record<TaskType, string> = {
  email: "Email / message",
  tax: "Tax",
  essay: "Essay / writing",
  cleaning: "Cleaning",
  appointment: "Appointment",
  money: "Money",
  health: "Health",
  admin: "Admin",
  work: "Work",
  study: "Study",
  unknown: "Unclear task"
};

export const missingItemLabels: Record<MissingItemType, string> = {
  information: "Information",
  material: "Material",
  decision: "Decision",
  energy: "Energy",
  courage: "Courage",
  time: "Time",
  permission: "Permission",
  unknown: "Not chosen"
};

export const exitStatusLabels: Record<ExitResponsibilityStatus, string> = {
  not_chosen: "Not chosen",
  renegotiate: "Renegotiate",
  defer: "Defer",
  delegate: "Delegate",
  abandon: "Abandon"
};

export const statusLabels: Record<Status, string> = {
  rescue_now: "Rescue now",
  in_progress: "In progress",
  waiting: "Waiting / needs info",
  repaired: "Repaired",
  done_enough: "Done enough",
  exited_responsibly: "Exited responsibly",
  archived: "Archived"
};

export const supportLabels: Record<SupportLevel, string> = {
  full_scaffold: "Full scaffold",
  guided_scaffold: "Guided scaffold",
  light_nudge: "Light nudge",
  self_led: "Self-led"
};

export const reentryStateLabels: Record<ReentryState, string> = {
  fresh: "Fresh",
  recently_touched: "Recently touched",
  return_after_gap: "Return after gap"
};

export const reentryActionLabels: Record<ReentryActionType, string> = {
  resume_first_move: "Resume first move",
  repair_this: "Repair this",
  unblock_missing_piece: "Unblock missing piece",
  exit_responsibly: "Exit responsibly"
};

export const qualitySignalChoiceLabels: Record<QualitySignalChoice, string> = {
  local_better: "Local better",
  deep_better: "Deep better",
  both_useful: "Both useful",
  neither_clear: "Neither clear"
};

export const qualitySignalDimensionLabels: Record<QualitySignalDimension, string> = {
  next_action: "Next action",
  block: "Block",
  plan: "Plan",
  repair: "Repair",
  overall: "Overall"
};

export const qualityRepairExpectationLabels: Record<QualityRepairExpectation, string> = {
  needed: "Repair needed",
  not_needed: "No repair needed"
};
