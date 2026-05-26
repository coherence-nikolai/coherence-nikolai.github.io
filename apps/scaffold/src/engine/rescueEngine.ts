import type {
  BlockType,
  ExitResponsibilityStatus,
  MissingItemType,
  RescueMode,
  RescuePacket,
  SprintOutcome,
  Status,
  SupportLevel,
  TaskType
} from "../types";

export interface BlockClassification {
  blockType: BlockType;
  confidence: number;
  matchedPhrases: string[];
}

const blockKeywordMap: Array<{ block: BlockType; phrases: string[] }> = [
  {
    block: "shame_fear",
    phrases: [
      "ashamed",
      "shame",
      "embarrassed",
      "humiliated",
      "guilty",
      "late",
      "overdue",
      "avoid replying",
      "afraid",
      "scared",
      "dread"
    ]
  },
  {
    block: "perfectionism",
    phrases: [
      "perfect",
      "not good enough",
      "has to be good",
      "mess it up",
      "ruin it",
      "bad first draft",
      "can't be wrong",
      "cannot be wrong"
    ]
  },
  {
    block: "ambiguous_start",
    phrases: [
      "don't know where to start",
      "do not know where to start",
      "where to start",
      "how to start",
      "no idea where",
      "blank page",
      "can't start",
      "cannot start",
      "stuck at the start"
    ]
  },
  {
    block: "overwhelm",
    phrases: [
      "too much",
      "too many",
      "everything",
      "overwhelmed",
      "overwhelming",
      "frozen",
      "paralyzed",
      "drowning",
      "all of it",
      "so much"
    ]
  },
  {
    block: "missing_information",
    phrases: [
      "missing information",
      "don't know what",
      "do not know what",
      "need details",
      "need info",
      "unclear",
      "confused",
      "what they want",
      "don't understand",
      "do not understand"
    ]
  },
  {
    block: "low_energy",
    phrases: [
      "tired",
      "exhausted",
      "drained",
      "burned out",
      "burnt out",
      "no energy",
      "low energy",
      "can't get up",
      "cannot get up"
    ]
  },
  {
    block: "time_blindness",
    phrases: [
      "lost track",
      "how long",
      "time got away",
      "deadline",
      "due",
      "forgot the time",
      "no sense of time"
    ]
  },
  {
    block: "boredom",
    phrases: [
      "boring",
      "bored",
      "understimulated",
      "scrolling",
      "keep scrolling",
      "can't make myself care",
      "cannot make myself care"
    ]
  },
  {
    block: "task_too_large",
    phrases: [
      "huge",
      "massive",
      "big project",
      "whole project",
      "too large",
      "too big",
      "entire house",
      "all the admin"
    ]
  },
  {
    block: "transition_difficulty",
    phrases: [
      "can't switch",
      "cannot switch",
      "transition",
      "get started after",
      "leave the house",
      "getting out the door",
      "stuck on the couch"
    ]
  },
  {
    block: "avoidance_loop",
    phrases: [
      "avoiding",
      "avoidance",
      "procrastinating",
      "putting it off",
      "keep avoiding",
      "keep delaying",
      "can't face it",
      "cannot face it"
    ]
  }
];

const taskKeywordMap: Array<{ taskType: TaskType; phrases: string[] }> = [
  {
    taskType: "email",
    phrases: [
      "email",
      "reply",
      "message",
      "inbox",
      "dm",
      "text back",
      "slack",
      "send them",
      "write back"
    ]
  },
  {
    taskType: "tax",
    phrases: ["tax", "taxes", "irs", "ato", "payg", "return", "deduction", "receipt"]
  },
  {
    taskType: "essay",
    phrases: ["essay", "paper", "report", "draft", "thesis", "writing", "article"]
  },
  {
    taskType: "cleaning",
    phrases: [
      "clean",
      "laundry",
      "dishes",
      "kitchen",
      "bathroom",
      "tidy",
      "mess",
      "room"
    ]
  },
  {
    taskType: "appointment",
    phrases: [
      "appointment",
      "meeting",
      "doctor",
      "dentist",
      "call",
      "booking",
      "reschedule"
    ]
  },
  {
    taskType: "money",
    phrases: ["bill", "invoice", "rent", "budget", "bank", "payment", "fine", "debt"]
  },
  {
    taskType: "health",
    phrases: [
      "medication",
      "medicine",
      "refill",
      "prescription",
      "health",
      "therapy",
      "symptom",
      "doctor"
    ]
  },
  {
    taskType: "admin",
    phrases: [
      "admin",
      "form",
      "paperwork",
      "application",
      "document",
      "portal",
      "account",
      "insurance"
    ]
  },
  {
    taskType: "work",
    phrases: [
      "work",
      "boss",
      "client",
      "manager",
      "coworker",
      "project",
      "presentation",
      "proposal"
    ]
  },
  {
    taskType: "study",
    phrases: [
      "study",
      "exam",
      "class",
      "course",
      "lecture",
      "notes",
      "assignment",
      "homework"
    ]
  }
];

const supportOrder: SupportLevel[] = [
  "full_scaffold",
  "guided_scaffold",
  "light_nudge",
  "self_led"
];

const activeStatuses: Status[] = ["rescue_now", "in_progress", "waiting"];

const successfulOutcomes: SprintOutcome[] = [
  "started",
  "tiny_progress",
  "done_enough"
];

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(input: string, phrases: string[]): boolean {
  return phrases.some((phrase) => input.includes(phrase));
}

function matchingPhrases(input: string, phrases: string[]): string[] {
  return phrases.filter((phrase) => input.includes(phrase));
}

function clampEstimate(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
}

function hasTask(input: string, terms: string[]): boolean {
  const normalized = normalize(input);
  return terms.some((term) => normalized.includes(term));
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Untitled rescue";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `scaffold-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function classifyBlock(input: string): BlockType {
  return classifyBlockWithConfidence(input).blockType;
}

export function classifyBlockWithConfidence(input: string): BlockClassification {
  const normalized = normalize(input);
  if (!normalized) {
    return {
      blockType: "unknown",
      confidence: 0.1,
      matchedPhrases: []
    };
  }

  const scored = blockKeywordMap
    .map(({ block, phrases }) => {
      const matches = matchingPhrases(normalized, phrases);
      const hasLongSpecificPhrase = matches.some((phrase) => phrase.includes(" "));
      const confidence = matches.length
        ? Math.min(0.95, 0.52 + matches.length * 0.12 + (hasLongSpecificPhrase ? 0.14 : 0))
        : 0;

      return { block, matches, confidence };
    })
    .filter((item) => item.matches.length > 0)
    .sort((a, b) => b.confidence - a.confidence);

  const best = scored[0];
  if (!best) {
    return {
      blockType: "unknown",
      confidence: 0.25,
      matchedPhrases: []
    };
  }

  return {
    blockType: best.block,
    confidence: Number(best.confidence.toFixed(2)),
    matchedPhrases: best.matches
  };
}

export function classifyTaskType(input: string): TaskType {
  const normalized = normalize(input);
  if (!normalized) return "unknown";

  const scored = taskKeywordMap
    .map(({ taskType, phrases }) => ({
      taskType,
      matches: matchingPhrases(normalized, phrases)
    }))
    .filter((item) => item.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length);

  return scored[0]?.taskType ?? "unknown";
}

export function detectMissingItem(input: string): MissingItemType {
  const normalized = normalize(input);

  if (
    includesAny(normalized, [
      "need info",
      "need information",
      "details",
      "clarify",
      "unclear",
      "don't understand",
      "do not understand",
      "what they want"
    ])
  ) {
    return "information";
  }

  if (includesAny(normalized, ["materials", "supplies", "document", "file", "receipt"])) {
    return "material";
  }

  if (includesAny(normalized, ["decide", "decision", "choose", "which one"])) {
    return "decision";
  }

  if (includesAny(normalized, ["tired", "exhausted", "energy", "burned out", "burnt out"])) {
    return "energy";
  }

  if (includesAny(normalized, ["afraid", "scared", "ashamed", "courage", "dread"])) {
    return "courage";
  }

  if (includesAny(normalized, ["time", "deadline", "due", "schedule", "when"])) {
    return "time";
  }

  if (includesAny(normalized, ["allowed", "permission", "can i", "is it ok"])) {
    return "permission";
  }

  return "unknown";
}

export function estimateUrgency(input: string): 1 | 2 | 3 | 4 | 5 {
  const normalized = normalize(input);
  let score = 2;

  if (
    includesAny(normalized, [
      "right now",
      "urgent",
      "asap",
      "today",
      "tonight",
      "due today",
      "overdue",
      "late"
    ])
  ) {
    score = 5;
  } else if (
    includesAny(normalized, ["tomorrow", "this week", "soon", "deadline"])
  ) {
    score = 4;
  } else if (includesAny(normalized, ["due", "appointment", "meeting"])) {
    score = 3;
  }

  if (includesAny(normalized, ["whenever", "eventually", "sometime"])) {
    score -= 1;
  }

  return clampEstimate(score);
}

export function estimateConsequence(input: string): 1 | 2 | 3 | 4 | 5 {
  const normalized = normalize(input);
  let score = 2;

  if (
    includesAny(normalized, [
      "tax",
      "legal",
      "rent",
      "eviction",
      "visa",
      "job",
      "boss",
      "client",
      "bill",
      "fine"
    ])
  ) {
    score = 5;
  } else if (
    includesAny(normalized, [
      "assignment",
      "essay",
      "exam",
      "grade",
      "appointment",
      "doctor",
      "deadline",
      "invoice"
    ])
  ) {
    score = 4;
  } else if (includesAny(normalized, ["email", "reply", "message", "call"])) {
    score = 3;
  }

  return clampEstimate(score);
}

export function estimateEffort(input: string): 1 | 2 | 3 | 4 | 5 {
  const normalized = normalize(input);
  let score = 3;

  if (
    includesAny(normalized, [
      "huge",
      "massive",
      "all day",
      "everything",
      "tax",
      "essay",
      "project",
      "move house"
    ])
  ) {
    score = 5;
  } else if (
    includesAny(normalized, ["admin", "clean", "study", "application"])
  ) {
    score = 4;
  } else if (includesAny(normalized, ["email", "reply", "text", "call"])) {
    score = 2;
  }

  if (includesAny(normalized, ["tiny", "small", "quick"])) {
    score -= 1;
  }

  return clampEstimate(score);
}

export function estimateEmotionalLoad(input: string): 1 | 2 | 3 | 4 | 5 {
  const normalized = normalize(input);
  let score = 2;

  if (
    includesAny(normalized, [
      "ashamed",
      "shame",
      "panic",
      "terrified",
      "dread",
      "frozen",
      "crying",
      "humiliated"
    ])
  ) {
    score = 5;
  } else if (
    includesAny(normalized, [
      "anxious",
      "overwhelmed",
      "embarrassed",
      "scared",
      "afraid",
      "stressed"
    ])
  ) {
    score = 4;
  } else if (includesAny(normalized, ["bored", "tired", "annoyed"])) {
    score = 3;
  }

  return clampEstimate(score);
}

export function chooseRescueMode(blockType: BlockType): RescueMode {
  switch (blockType) {
    case "perfectionism":
      return "make_it_ugly";
    case "shame_fear":
      return "repair";
    case "missing_information":
      return "unblock";
    case "boredom":
    case "avoidance_loop":
      return "body_double";
    case "task_too_large":
    case "overwhelm":
    case "ambiguous_start":
    case "low_energy":
    case "time_blindness":
    case "transition_difficulty":
    case "unknown":
      return "start_tiny";
  }
}

export function generateFirstPhysicalAction(
  input: string,
  blockType: BlockType,
  taskType: TaskType = classifyTaskType(input)
): string {
  if (hasTask(input, ["scrolling", "phone", "social media"])) {
    return "Put the phone face down and open a 7-minute timer.";
  }

  if (taskType === "email") {
    if (blockType === "shame_fear") {
      return "Open the thread and write a two-sentence holding reply. Do not overexplain.";
    }
    if (blockType === "missing_information") {
      return "Open the thread and find the one question you need answered.";
    }
    if (blockType === "perfectionism") {
      return "Open a blank reply and write the rough two-sentence version first.";
    }
    return "Open the message thread. Do not reply yet.";
  }

  if (taskType === "tax") {
    if (blockType === "overwhelm" || blockType === "task_too_large") {
      return "Find one tax document only: one receipt, form, or income statement.";
    }
    if (blockType === "missing_information") {
      return "Write the name of one missing tax document, then search for that exact item.";
    }
    return "Search email or files for one relevant tax document, then stop.";
  }

  if (taskType === "essay") {
    if (blockType === "perfectionism") {
      return "Open the document and write three ugly bullets under the heading.";
    }
    if (blockType === "ambiguous_start") {
      return "Open a document and paste the assignment question or prompt at the top.";
    }
    return "Open the essay document and write the heading only.";
  }

  if (taskType === "cleaning") {
    if (blockType === "overwhelm" || blockType === "task_too_large") {
      return "Pick up five visible items and put them in one obvious place.";
    }
    if (blockType === "low_energy") {
      return "Stay seated and clear only the surface within arm's reach.";
    }
    return "Stand up and put one visible item where it belongs.";
  }

  if (taskType === "appointment") {
    if (blockType === "shame_fear") {
      return "Open the calendar or message and draft one reschedule sentence.";
    }
    return "Open your calendar or messages and find the exact appointment details.";
  }

  if (taskType === "money") {
    if (blockType === "shame_fear") {
      return "Open the bill or account page and read only the amount due.";
    }
    return "Open one bill, bank page, or invoice and write the exact next money action.";
  }

  if (taskType === "health") {
    if (blockType === "low_energy") {
      return "Put the medication, health note, or booking page within reach.";
    }
    return "Open the health app, portal, or note and find the next required detail.";
  }

  if (taskType === "admin") {
    if (blockType === "missing_information") {
      return "Open the form and circle or write the first field you cannot answer.";
    }
    return "Open the form, portal, or document and fill one known field.";
  }

  if (taskType === "work") {
    if (blockType === "overwhelm") {
      return "Open a note and write the three work pieces competing for attention.";
    }
    return "Open the work surface and write the next deliverable in one sentence.";
  }

  if (taskType === "study") {
    if (blockType === "boredom") {
      return "Open the notes and set a 7-minute timer for one tiny pass.";
    }
    return "Open the course material and copy one question or heading into a note.";
  }

  switch (blockType) {
    case "ambiguous_start":
      return "Open the relevant document, note, email, or webpage. Do not edit yet.";
    case "overwhelm":
      return "Write down only the top three loose items. Pick one.";
    case "shame_fear":
      return "Write a two-sentence holding message. Do not overexplain.";
    case "boredom":
      return "Set a 7-minute timer and make the task deliberately tiny.";
    case "missing_information":
      return "Find one missing item. Do not solve the whole task.";
    case "low_energy":
      return "Do a seated version for three minutes.";
    case "time_blindness":
      return "Check the actual deadline and set a visible countdown.";
    case "perfectionism":
      return "Create an intentionally bad first draft.";
    case "task_too_large":
      return "Write the smallest visible piece on one line.";
    case "avoidance_loop":
      return "Put the task surface in front of you and touch the first tool for ten seconds.";
    case "transition_difficulty":
      return "Stand up, put one needed item in your hand, and move to the task location.";
    case "unknown":
      return "Name the next physical object you need to touch, then touch it.";
  }
}

export function generateTenMinutePlan(
  input: string,
  blockType: BlockType,
  taskType: TaskType = classifyTaskType(input)
): string[] {
  const firstAction = generateFirstPhysicalAction(input, blockType, taskType);

  switch (blockType) {
    case "shame_fear":
      return [
        `Minute 0-1: ${firstAction}`,
        "Minute 1-3: Write the factual part only: what you can send and when.",
        "Minute 3-6: Remove excuses, extra apology, and self-punishing language.",
        "Minute 6-8: Send the holding reply or save it as a draft.",
        "Minute 8-10: Write the next concrete step beside it."
      ];
    case "perfectionism":
      return [
        `Minute 0-1: ${firstAction}`,
        "Minute 1-4: Add ugly bullets, placeholders, or rough fragments.",
        "Minute 4-7: Mark one section as good enough for now.",
        "Minute 7-9: Choose the next rough piece, not the best piece.",
        "Minute 9-10: Stop and name the minimum viable progress."
      ];
    case "missing_information":
      return [
        `Minute 0-2: ${firstAction}`,
        "Minute 2-4: Choose whether the gap is information, materials, decision, energy, courage, time, or permission.",
        "Minute 4-7: Find or request one missing thing.",
        "Minute 7-9: Park every other unknown in a short note.",
        "Minute 9-10: Decide the next action after the missing thing arrives."
      ];
    case "boredom":
    case "avoidance_loop":
      return [
        `Minute 0-1: ${firstAction}`,
        "Minute 1-2: Make the task smaller than feels reasonable.",
        "Minute 2-7: Work beside the on-screen timer without improving the plan.",
        "Minute 7-9: Capture what moved, even if it is tiny.",
        "Minute 9-10: Choose done enough or one more tiny pass."
      ];
    case "low_energy":
      return [
        `Minute 0-1: ${firstAction}`,
        "Minute 1-3: Remove one friction point from the task setup.",
        "Minute 3-6: Do the seated or lowest-energy version.",
        "Minute 6-8: Save visible evidence of progress.",
        "Minute 8-10: Decide whether to continue, repair, or exit responsibly."
      ];
    default:
      return [
        `Minute 0-1: ${firstAction}`,
        "Minute 1-3: Keep only the next visible piece in front of you.",
        "Minute 3-7: Do the smallest version without expanding scope.",
        "Minute 7-9: Mark what changed in one sentence.",
        "Minute 9-10: Choose one next action or stop responsibly."
      ];
  }
}

export function generateMinimumViableProgress(
  input: string,
  blockType: BlockType,
  taskType: TaskType = classifyTaskType(input)
): string {
  if (taskType === "email") {
    return "A draft or sent two-sentence reply counts.";
  }

  if (taskType === "essay") {
    return "The document is open with the prompt pasted and one ugly bullet written.";
  }

  if (taskType === "tax") {
    return "One tax document is found or one missing document is named.";
  }

  if (taskType === "cleaning") {
    return "Five items moved or one surface is visibly clearer.";
  }

  if (taskType === "appointment") {
    return "The exact appointment detail is found or one reschedule draft exists.";
  }

  if (blockType === "missing_information") {
    return "One missing thing is identified or requested.";
  }

  if (blockType === "perfectionism") {
    return "One intentionally rough sentence, bullet, or placeholder exists.";
  }

  return "One visible piece moved forward. Done enough counts.";
}

export function generateRepairScript(
  input: string,
  blockType: BlockType,
  taskType: TaskType = classifyTaskType(input)
): string {
  const normalized = normalize(input);

  if (taskType === "email" && includesAny(normalized, ["late", "delay", "ashamed", "overdue"])) {
    return "Hi [Name], I'm sorry for the delay. I'm working on this now and can send you [specific thing] by [time/date]. Thanks for your patience.";
  }

  if (includesAny(normalized, ["extension", "more time", "deadline", "due"])) {
    return "Hi [Name], I'm sorry for the late notice. I need a little more time to finish [specific thing]. Could I send it by [date/time]?";
  }

  if (
    includesAny(normalized, ["missed appointment", "missed our meeting", "appointment"])
  ) {
    return "Hi [Name], I'm sorry I missed our appointment. I'd like to reschedule if possible. I can do [option 1] or [option 2].";
  }

  if (includesAny(normalized, ["clarify", "unclear", "confused", "what they want"])) {
    return "Hi [Name], I want to make sure I handle this correctly. Could you clarify [specific question]? Once I have that, I can move on [next step].";
  }

  if (includesAny(normalized, ["help", "stuck", "support"])) {
    return "Hi [Name], I'm stuck on [specific part]. Could you help me identify the next step or point me to the right information?";
  }

  if (
    includesAny(normalized, ["scope", "too much", "renegotiate", "can't do all", "cannot do all"])
  ) {
    return "Hi [Name], I can complete [specific smaller part] by [time/date]. The full scope needs more time, so I'd like to agree on what matters most first.";
  }

  if (includesAny(normalized, ["sorry", "apologize", "apologise"])) {
    return "Hi [Name], I'm sorry for my part in this. I can take responsibility for [specific part] and my next step is [specific action].";
  }

  if (
    blockType === "shame_fear" ||
    includesAny(normalized, ["late", "delay", "email", "reply"])
  ) {
    return "Hi [Name], I'm sorry for the delay. I'm working on this now and can send you [specific thing] by [time/date]. Thanks for your patience.";
  }

  return "Hi [Name], thanks for your patience. I can take the next step on [specific thing] by [time/date], or I can suggest a smaller option if that works better.";
}

export function inferExitStatus(input: string): ExitResponsibilityStatus {
  const normalized = normalize(input);

  if (includesAny(normalized, ["delegate", "ask someone else", "hand off", "handoff"])) {
    return "delegate";
  }

  if (includesAny(normalized, ["defer", "later", "not today", "postpone", "reschedule"])) {
    return "defer";
  }

  if (includesAny(normalized, ["abandon", "drop it", "not worth", "cancel", "stop doing"])) {
    return "abandon";
  }

  if (
    includesAny(normalized, [
      "renegotiate",
      "scope",
      "too much",
      "can't do all",
      "cannot do all",
      "smaller"
    ])
  ) {
    return "renegotiate";
  }

  return "not_chosen";
}

export function generateExitResponsiblyScript(
  input: string,
  taskType: TaskType = classifyTaskType(input),
  exitStatus: ExitResponsibilityStatus = inferExitStatus(input)
): string {
  switch (exitStatus) {
    case "renegotiate":
      return "Hi [Name], I can do [smaller specific part] by [time/date]. The current scope is larger than I can responsibly complete as-is. Can we agree on the most important piece?";
    case "defer":
      return "Hi [Name], I need to move this to [specific date/time]. If that creates a problem, I can offer [smaller interim step] now.";
    case "delegate":
      return "Hi [Name], I am not the best person to complete this by [time/date]. I can hand off [specific context] to [person/team] so it keeps moving.";
    case "abandon":
      return "Hi [Name], I am going to stop this rather than let it stay vague. I will close out [specific part] and let [person affected] know today.";
    case "not_chosen":
      break;
  }

  if (taskType === "appointment") {
    return "Hi [Name], I need to reschedule or cancel this appointment. I can do [option 1] or [option 2], or I can confirm cancellation today.";
  }

  if (taskType === "email") {
    return "Hi [Name], I cannot give this the full response it needs right now. I can send [smaller specific thing] by [time/date], or close the loop if this is no longer needed.";
  }

  return "Hi [Name], I need to exit this responsibly. I can [renegotiate/defer/delegate/close] it by doing [specific next step] today.";
}

export function deriveRealTask(input: string): string {
  const cleaned = input
    .trim()
    .replace(/^i\s+(need|have|got)\s+to\s+/i, "")
    .replace(/^i\s+need\s+/i, "")
    .replace(/\s+but\s+.+$/i, "")
    .replace(/\s+and\s+i\s+(do not|don't|cant|can't|cannot).+$/i, "")
    .trim();

  return sentenceCase(cleaned || "Choose one next action");
}

export function deriveTitle(input: string): string {
  const realTask = deriveRealTask(input);
  const words = realTask.split(/\s+/).slice(0, 7).join(" ");
  return sentenceCase(words);
}

export function generateRescuePacket(input: string): RescuePacket {
  const classification = classifyBlockWithConfidence(input);
  const blockType = classification.blockType;
  const taskType = classifyTaskType(input);
  const exitStatus = inferExitStatus(input);
  const now = new Date().toISOString();

  return {
    id: makeId(),
    title: deriveTitle(input),
    originalText: input.trim(),
    realTask: deriveRealTask(input),
    taskType,
    blockType,
    blockConfidence: classification.confidence,
    emotionalLoad: estimateEmotionalLoad(input),
    urgency: estimateUrgency(input),
    consequence: estimateConsequence(input),
    effort: estimateEffort(input),
    firstPhysicalAction: generateFirstPhysicalAction(input, blockType, taskType),
    tenMinutePlan: generateTenMinutePlan(input, blockType, taskType),
    minimumViableProgress: generateMinimumViableProgress(input, blockType, taskType),
    repairScript: generateRepairScript(input, blockType, taskType),
    missingItem: detectMissingItem(input),
    exitScript: generateExitResponsiblyScript(input, taskType, exitStatus),
    exitStatus,
    rescueMode: exitStatus === "not_chosen" ? chooseRescueMode(blockType) : "exit_responsibly",
    supportLevel: "full_scaffold",
    status: "rescue_now",
    createdAt: now,
    updatedAt: now,
    lastTouchedAt: now,
    sprintHistory: [],
    reentryHistory: [],
    notes: ""
  };
}

export function calculateRescuePriority(
  packet: RescuePacket,
  nowMs = Date.now()
): number {
  if (!activeStatuses.includes(packet.status)) return 0;

  const lastTouchedMs = new Date(packet.lastTouchedAt).getTime();
  const ageDays = Number.isFinite(lastTouchedMs)
    ? Math.max(0, (nowMs - lastTouchedMs) / 86_400_000)
    : 0;
  const staleness = Math.min(5, ageDays * 0.7);
  const effortAccessibility = 6 - packet.effort;
  const waitingPenalty = packet.status === "waiting" ? 1.5 : 0;

  return (
    packet.urgency * 3 +
    packet.consequence * 2.4 +
    packet.emotionalLoad * 1.2 +
    effortAccessibility * 0.8 +
    staleness -
    waitingPenalty
  );
}

export function updateSupportLevel(
  packet: RescuePacket,
  sprintOutcome: SprintOutcome
): SupportLevel {
  if (!successfulOutcomes.includes(sprintOutcome)) {
    return packet.supportLevel;
  }

  const previousSuccessfulStarts = packet.sprintHistory.filter((sprint) =>
    sprint.outcome ? successfulOutcomes.includes(sprint.outcome) : false
  ).length;
  const successfulStartsIncludingCurrent = previousSuccessfulStarts + 1;

  if (successfulStartsIncludingCurrent < 2 || successfulStartsIncludingCurrent % 2 !== 0) {
    return packet.supportLevel;
  }

  const currentIndex = supportOrder.indexOf(packet.supportLevel);
  const nextIndex = Math.min(supportOrder.length - 1, currentIndex + 1);
  return supportOrder[nextIndex];
}

export function increaseSupportLevel(level: SupportLevel): SupportLevel {
  const currentIndex = supportOrder.indexOf(level);
  const nextIndex = Math.max(0, currentIndex - 1);
  return supportOrder[nextIndex];
}

export function generateReentryList(packets: RescuePacket[]): RescuePacket[] {
  return packets
    .filter((packet) => activeStatuses.includes(packet.status))
    .sort((a, b) => calculateRescuePriority(b) - calculateRescuePriority(a))
    .slice(0, 3);
}

export function statusForOutcome(outcome: SprintOutcome): Status {
  switch (outcome) {
    case "started":
    case "tiny_progress":
      return "in_progress";
    case "blocked":
      return "rescue_now";
    case "repair":
      return "repaired";
    case "stop_responsibly":
      return "exited_responsibly";
    case "done_enough":
      return "done_enough";
  }
}

export function isSuccessfulOutcome(outcome: SprintOutcome): boolean {
  return successfulOutcomes.includes(outcome);
}
