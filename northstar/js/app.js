import {
  BLOCKERS,
  FINISH_ITEMS,
  NOTE_BLOCK_TYPES,
  PROFILE_QUESTIONS,
  PROFILE_TAG_CONTENT,
  ROUTE_LIBRARY,
  STUDY_STATES,
  TASK_VERBS
} from "./data/content.js?v=20260528a";
import {
  clearNamespace,
  copyText,
  formatRelativeDue,
  friendlyTime,
  loadState,
  saveState,
  stampNow
} from "./state.js?v=20260528a";

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const PANEL_LABELS = {
  dashboard: "Guide",
  "dashboard-options": "Tune Today",
  regulate: "Regulate",
  planner: "Plan",
  calendar: "Calendar",
  focus: "Focus",
  unpack: "Unpack",
  notes: "Notes",
  profile: "Profile",
  finish: "Finish",
  "mobile-result": "Result"
};

const PANEL_THEME_COLORS = {
  dashboard: "#dfece8",
  "dashboard-options": "#dfece8",
  regulate: "#e8edd9",
  planner: "#f2e1d8",
  calendar: "#e9e7f2",
  focus: "#f3ead5",
  unpack: "#deedf0",
  notes: "#e3ebf4",
  profile: "#f1dfe3",
  finish: "#e9e2ef",
  "mobile-result": "#dfece8"
};

const PRIMARY_PANELS = new Set(["dashboard", "regulate", "planner", "calendar", "focus", "unpack", "notes", "profile", "finish"]);
const MOBILE_BOTTOM_PANELS = new Set(["dashboard", "calendar"]);

const DELIVERABLE_GUIDANCE = {
  essay: {
    label: "Essay, report, or literature review",
    pattern: /\b(essay|report|literature review|lit review|paper|written assignment|critical review|article review)\b/,
    essentials: [
      "A clear position or line of thinking",
      "Evidence that supports each main point",
      "A structure that answers the task directly"
    ]
  },
  discussion: {
    label: "Discussion post, forum reply, or short response",
    pattern: /\b(discussion|forum|post|reply|response|short answer|short response|online contribution)\b/,
    essentials: [
      "A concise response to the question",
      "At least one supported point",
      "A clear link back to the topic or weekly material"
    ]
  },
  reflection: {
    label: "Reflection, journal, or portfolio",
    pattern: /\b(reflection|reflective|journal|portfolio|learning log|placement journal)\b/,
    essentials: [
      "A real experience, example, or observation",
      "A link between that experience and the course ideas",
      "A clear note on what changed, what you learnt, or what comes next"
    ]
  },
  caseStudy: {
    label: "Case study, scenario, or client response",
    pattern: /\b(case study|case|scenario|client|patient|vignette|problem case)\b/,
    essentials: [
      "The key facts from the case or scenario",
      "The main issue, need, or decision point",
      "A supported response, recommendation, or explanation"
    ]
  },
  practical: {
    label: "Lab, practical, clinical, or field report",
    pattern: /\b(lab|laboratory|practical|clinical|field report|experiment|data|observation|placement report)\b/,
    essentials: [
      "The method, process, or setting",
      "The result, finding, or observation",
      "A short explanation of what the result means"
    ]
  },
  bibliography: {
    label: "Annotated bibliography or source review",
    pattern: /\b(annotated bibliography|bibliography|source review|source analysis|reference list|literature table)\b/,
    essentials: [
      "The source details",
      "Why the source is useful or credible",
      "How it connects to the assignment question"
    ]
  },
  proposal: {
    label: "Research proposal or project plan",
    pattern: /\b(proposal|project plan|research plan|ethics|methodology|research question)\b/,
    essentials: [
      "The topic, question, or problem",
      "The planned method or approach",
      "A realistic scope for the time and word limit"
    ]
  },
  presentation: {
    label: "Presentation, poster, or slides",
    pattern: /\b(presentation|slides|powerpoint|keynote|poster|oral|seminar|talk)\b/,
    essentials: [
      "A clear main message",
      "A sequence the audience can follow",
      "Visuals or examples that support rather than replace the spoken point"
    ]
  },
  creative: {
    label: "Creative project, design, media, or artefact",
    pattern: /\b(creative|design|media|video|podcast|artefact|artifact|prototype|campaign|website|visual)\b/,
    essentials: [
      "The brief requirements or criteria",
      "The concept or choice you are making",
      "A short rationale that explains why it fits the task"
    ]
  },
  group: {
    label: "Group work, placement, or professional task",
    pattern: /\b(group|team|placement|professional|workplace|role play|simulation|peer)\b/,
    essentials: [
      "The shared goal or task",
      "The part you are responsible for",
      "The next handover, message, or checkpoint"
    ]
  },
  exam: {
    label: "Quiz, test, or exam preparation",
    pattern: /\b(exam|quiz|test|revision|study guide|practice questions)\b/,
    essentials: [
      "A focused list of likely concepts or questions",
      "Condensed notes or cues",
      "Evidence that you can recall or explain the material under time pressure"
    ]
  }
};

const DELIVERABLE_MATCH_ORDER = [
  "practical",
  "caseStudy",
  "bibliography",
  "proposal",
  "presentation",
  "creative",
  "group",
  "exam",
  "reflection",
  "discussion",
  "essay"
];

const SUPPORT_STATES = {
  low: {
    label: "Gentle",
    hint: "One clear next move first. Extra detail can wait.",
    calloutTitle: "Gentle support",
    calloutCopy: "Start with one small move. That is enough for now."
  },
  standard: {
    label: "Balanced",
    hint: "One clear next move, with optional detail when you want it.",
    calloutTitle: "Balanced support",
    calloutCopy: "Northstar will keep the path clear and leave room for a little planning."
  },
  detailed: {
    label: "More detail",
    hint: "Show more structure only when you have room for it.",
    calloutTitle: "More detailed support",
    calloutCopy: "Northstar will show more planning detail and a fuller check-in."
  }
};

const defaultSettings = {
  fontScale: "standard",
  fontFamily: "standard",
  contrast: "soft",
  motion: "normal",
  supportState: "low",
  focusMode: false,
  introDismissed: false
};

const defaultCheckin = {
  battery: 3,
  timeAvailable: 30,
  supportMode: "gentle",
  intent: "",
  blockers: [],
  studyState: ""
};

const defaultRegulateState = {
  signal: "overwhelmed",
  anchor: "sensory",
  load: "",
  strategy: "sensory"
};

const defaultNotesState = {
  title: "",
  context: "",
  reviewGoal: "",
  blocks: []
};

const defaultProfileUi = {
  activeIndex: 0
};

const defaultCalibration = {
  completed: false,
  supportState: "low",
  startPoint: "overwhelmed",
  timerPreset: "gentle",
  updatedAt: null
};

const defaultSessionMemory = {
  worked: "",
  avoid: "",
  nextCue: "",
  updatedAt: null,
  focusRounds: 0,
  lastPanel: "dashboard"
};

const defaultSupportContacts = [
  {
    id: "support_contact_1",
    supportName: "",
    contactName: "",
    email: "",
    phone: "",
    link: "",
    notes: ""
  }
];

const CALENDAR_ITEM_TYPES = {
  assignment: "Assignment",
  quiz: "Quiz or test",
  exam: "Exam",
  presentation: "Presentation",
  reading: "Reading or prep",
  placement: "Placement",
  admin: "Admin",
  other: "Other"
};

const CALENDAR_STATUS_LABELS = {
  "not-started": "Not started",
  underway: "Underway",
  waiting: "Waiting",
  done: "Done"
};

const CALENDAR_PERIOD_TYPES = {
  trimester: {
    label: "Trimester",
    lower: "trimester",
    defaultName: "My trimester"
  },
  semester: {
    label: "Semester",
    lower: "semester",
    defaultName: "My semester"
  },
  term: {
    label: "Term",
    lower: "term",
    defaultName: "My term"
  }
};

const defaultCalendarState = {
  termType: "trimester",
  termName: "",
  termStart: "",
  termEnd: "",
  items: []
};

const FOCUS_PRESETS = {
  gentle: {
    label: "Gentle start",
    focusMinutes: 10,
    breakMinutes: 3,
    hint: "One small block. Enough contact with the task counts."
  },
  classic: {
    label: "Classic",
    focusMinutes: 25,
    breakMinutes: 5,
    hint: "A steady timer block without turning the session into a sprint."
  },
  deep: {
    label: "Longer block",
    focusMinutes: 40,
    breakMinutes: 10,
    hint: "Use this only when you already have momentum and a clear stopping cue."
  }
};

const defaultFocusState = {
  preset: "gentle",
  phase: "focus",
  intention: "",
  returnCue: "",
  completedRounds: 0,
  lastCompletedAt: null,
  timerEndsAt: null,
  alertPermission: "unknown",
  alertPreference: false
};

const FOCUS_NOTIFICATION_ID = 401;

const DEFAULT_NOTE_BLOCK_SEQUENCE = ["idea", "question", "task"];

function noteBlockId() {
  return `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function supportContactId() {
  return `support_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function calendarItemId() {
  return `due_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeDateInput(value) {
  const date = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function normalizeCalendarItem(rawItem, index = 0) {
  const raw = rawItem && typeof rawItem === "object" ? rawItem : {};
  const type = CALENDAR_ITEM_TYPES[raw.type] ? raw.type : "assignment";
  const status = CALENDAR_STATUS_LABELS[raw.status] ? raw.status : "not-started";

  return {
    id: String(raw.id || `due_${index + 1}`),
    title: String(raw.title || ""),
    course: String(raw.course || ""),
    dueDate: normalizeDateInput(raw.dueDate),
    type,
    weight: String(raw.weight || ""),
    status,
    firstStep: String(raw.firstStep || ""),
    notes: String(raw.notes || ""),
    createdAt: raw.createdAt || stampNow(),
    updatedAt: raw.updatedAt || null
  };
}

function normalizeCalendarState(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  const items = Array.isArray(raw.items)
    ? raw.items.map((item, index) => normalizeCalendarItem(item, index))
    : [];

  return {
    termType: CALENDAR_PERIOD_TYPES[raw.termType] ? raw.termType : defaultCalendarState.termType,
    termName: String(raw.termName || ""),
    termStart: normalizeDateInput(raw.termStart),
    termEnd: normalizeDateInput(raw.termEnd),
    items
  };
}

function createSupportContact(overrides = {}) {
  return {
    id: supportContactId(),
    supportName: "",
    contactName: "",
    email: "",
    phone: "",
    link: "",
    notes: "",
    ...overrides
  };
}

function normalizeSupportContact(rawContact, index = 0) {
  const raw = rawContact && typeof rawContact === "object" ? rawContact : {};

  return {
    id: String(raw.id || `support_contact_${index + 1}`),
    supportName: String(raw.supportName || ""),
    contactName: String(raw.contactName || ""),
    email: String(raw.email || ""),
    phone: String(raw.phone || ""),
    link: String(raw.link || ""),
    notes: String(raw.notes || "")
  };
}

function normalizeSupportContacts(rawState) {
  const contacts = Array.isArray(rawState)
    ? rawState.map((contact, index) => normalizeSupportContact(contact, index))
    : [];

  return contacts.length
    ? contacts
    : defaultSupportContacts.map((contact, index) => normalizeSupportContact(contact, index));
}

function normalizeNoteBlockType(type) {
  return NOTE_BLOCK_TYPES[type] ? type : "idea";
}

function createNoteBlock(type = "idea", text = "") {
  return {
    id: noteBlockId(),
    type: normalizeNoteBlockType(type),
    text: String(text || "")
  };
}

function seedNoteBlocks() {
  return DEFAULT_NOTE_BLOCK_SEQUENCE.map((type) => createNoteBlock(type));
}

function normalizeNotesState(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  const toLines = (value) =>
    String(value || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

  const normalizedBlocks = Array.isArray(raw.blocks)
    ? raw.blocks.map((block) => ({
      id: block?.id || noteBlockId(),
      type: normalizeNoteBlockType(block?.type),
      text: String(block?.text || "")
    }))
    : [];

  const legacyBlocks = normalizedBlocks.length
    ? []
    : [
      ...toLines(raw.keyIdeas).map((text) => createNoteBlock("idea", text)),
      ...toLines(raw.confusions).map((text) => createNoteBlock("question", text)),
      ...toLines(raw.sources).map((text) => createNoteBlock("evidence", text))
    ];

  return {
    title: String(raw.title || ""),
    context: String(raw.context || ""),
    reviewGoal: String(raw.reviewGoal || ""),
    blocks: (normalizedBlocks.length ? normalizedBlocks : legacyBlocks).length
      ? (normalizedBlocks.length ? normalizedBlocks : legacyBlocks)
      : seedNoteBlocks()
  };
}

function normalizeProfileUi(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  const activeIndex = Number.isInteger(raw.activeIndex) ? raw.activeIndex : 0;

  return {
    activeIndex: Math.min(Math.max(activeIndex, 0), Math.max(PROFILE_QUESTIONS.length - 1, 0))
  };
}

function normalizeFocusState(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  const preset = FOCUS_PRESETS[raw.preset] ? raw.preset : defaultFocusState.preset;
  const phase = raw.phase === "break" ? "break" : "focus";
  const completedRounds = Number.isInteger(raw.completedRounds)
    ? Math.max(raw.completedRounds, 0)
    : 0;

  return {
    preset,
    phase,
    intention: String(raw.intention || ""),
    returnCue: String(raw.returnCue || ""),
    completedRounds,
    lastCompletedAt: raw.lastCompletedAt || null,
    timerEndsAt: Number.isFinite(raw.timerEndsAt) ? raw.timerEndsAt : null,
    alertPermission: String(raw.alertPermission || "unknown"),
    alertPreference: Boolean(raw.alertPreference)
  };
}

function normalizeCalibrationState(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  return {
    completed: Boolean(raw.completed),
    supportState: SUPPORT_STATES[raw.supportState] ? raw.supportState : defaultCalibration.supportState,
    startPoint: raw.startPoint || defaultCalibration.startPoint,
    timerPreset: FOCUS_PRESETS[raw.timerPreset] ? raw.timerPreset : defaultCalibration.timerPreset,
    updatedAt: raw.updatedAt || null
  };
}

function normalizeSessionMemory(rawState) {
  const raw = rawState && typeof rawState === "object" ? rawState : {};
  return {
    worked: String(raw.worked || ""),
    avoid: String(raw.avoid || ""),
    nextCue: normalizeReturnCue(raw.nextCue),
    updatedAt: raw.updatedAt || null,
    focusRounds: Number.isInteger(raw.focusRounds) ? Math.max(raw.focusRounds, 0) : 0,
    lastPanel: PANEL_LABELS[raw.lastPanel] ? raw.lastPanel : "dashboard"
  };
}

const state = {
  settings: loadState("settings", defaultSettings),
  checkin: {
    ...defaultCheckin,
    ...loadState("checkin", defaultCheckin)
  },
  planner: loadState("planner", {
    task: "",
    dueDate: "",
    energy: "medium",
    blockers: []
  }),
  regulate: {
    ...defaultRegulateState,
    ...loadState("regulate", defaultRegulateState)
  },
  unpack: loadState("unpack", {
    prompt: "",
    verb: "auto",
    dueDate: "",
    unclear: "",
    deliverable: "essay"
  }),
  notes: normalizeNotesState(loadState("notes", defaultNotesState)),
  notesHistory: loadState("notesHistory", []),
  profileAnswers: loadState("profileAnswers", {}),
  profileUi: normalizeProfileUi(loadState("profileUi", defaultProfileUi)),
  focus: normalizeFocusState(loadState("focus", defaultFocusState)),
  calendar: normalizeCalendarState(loadState("calendar", defaultCalendarState)),
  calibration: normalizeCalibrationState(loadState("calibration", defaultCalibration)),
  sessionMemory: normalizeSessionMemory(loadState("sessionMemory", defaultSessionMemory)),
  supportContacts: normalizeSupportContacts(loadState("supportContacts", defaultSupportContacts)),
  finish: loadState("finish", {
    items: FINISH_ITEMS.map(() => false),
    nextTime: ""
  }),
  outputs: loadState("outputs", {}),
  session: loadState("session", {
    lastPanel: "dashboard",
    updatedAt: null
  })
};

let todayInlineFeedbackVisible = false;
let mobileResultSourcePanel = "dashboard";
let mobileResultPrimaryTarget = "dashboard";
let mobileResultCopyText = "";
let mobileResultSecondaryAction = "copy";
let focusTimerRemaining = null;
let focusTimerRunning = false;
let focusTimerIntervalId = null;
let calibrationManuallyOpened = false;

const MOBILE_DOCK_ACTIONS = {
  regulate: {
    label: "Show one step",
    target: "#buildRegulationBtn"
  },
  planner: {
    label: "Make first step",
    target: "#buildPlanBtn"
  },
  calendar: {
    label: "Save due date",
    target: "#saveCalendarItemBtn"
  },
  focus: {
    label: "Start the block",
    target: "#focusStartBtn"
  },
  unpack: {
    label: "Make it clearer",
    target: "#unpackBtn"
  },
  notes: {
    label: "Catch the thread",
    target: "#buildNotesBtn"
  },
  profile: {
    label: "Next prompt",
    target: "#profileNextBtn"
  },
  finish: {
    label: "Save return point",
    target: "#saveFinishBtn"
  }
};

function isNativeShell() {
  const hasCapacitorPlatform = typeof window.Capacitor?.isNativePlatform === "function"
    ? window.Capacitor.isNativePlatform()
    : false;
  const hasCapacitorIOS = typeof window.Capacitor?.getPlatform === "function"
    ? window.Capacitor.getPlatform() === "ios"
    : false;

  return hasCapacitorPlatform || hasCapacitorIOS;
}

function nativePlugin(name) {
  return window.Capacitor?.Plugins?.[name] || null;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeReturnCue(value) {
  const cue = String(value || "").trim();
  if (!cue) return "";

  const lowerCue = cue.toLowerCase();
  if (lowerCue.includes("why you are like this") || lowerCue.includes("what barrier is present")) {
    return "Name the barrier. Choose the smallest next move.";
  }

  const standaloneCue = cue
    .replace(/^then\s+/i, "")
    .replace(/^go to\s+(today|regulate|plan|calendar|focus|unpack|notes|profile|finish)\s+and\s+/i, "")
    .replace(/^use\s+the\s+today\s+panel\s+to\s+/i, "")
    .replace(/^use\s+(today|regulate|plan|calendar|focus|unpack|notes|profile|finish)\s+to\s+/i, "")
    .replace(/^ask\s+what\s+barrier\s+is\s+present[,.]?\s*/i, "Name the barrier. ")
    .replace(/\bbefore asking for output\b/gi, "before starting")
    .trim();

  return standaloneCue.charAt(0).toUpperCase() + standaloneCue.slice(1);
}

function toListItems(items) {
  return items
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function panelLabel(panelName) {
  return PANEL_LABELS[panelName] || "Today";
}

function supportModeFromState() {
  return state.settings.supportState === "detailed" ? "structured" : "gentle";
}

function navPanelTarget(panelName) {
  if (panelName === "dashboard-options") return "dashboard";
  if (panelName === "mobile-result") return navPanelTarget(mobileResultSourcePanel || "dashboard");
  return panelName;
}

function isPhoneLayout() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function shouldUseMobileResult() {
  return isNativeShell() || isPhoneLayout();
}

function nudgeHaptic(pattern = 8) {
  if (!shouldUseMobileResult() || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}

function updateMobileActionDock(panelName = document.documentElement.dataset.activePanel || "dashboard") {
  const dock = $("#mobileActionDock");
  const primary = $("#mobileDockPrimaryBtn");
  if (!dock || !primary) return;

  const action = MOBILE_DOCK_ACTIONS[panelName];
  const shouldShow = Boolean(action && shouldUseMobileResult());
  dock.hidden = !shouldShow;
  document.documentElement.dataset.mobileDock = shouldShow ? "on" : "off";
  if (!shouldShow) return;

  primary.textContent = action.label;
  primary.dataset.actionTarget = action.target;
}

function triggerMobileDockAction() {
  const primary = $("#mobileDockPrimaryBtn");
  const targetSelector = primary?.dataset.actionTarget;
  const target = targetSelector ? $(targetSelector) : null;
  if (!target) return;

  nudgeHaptic();
  target.click();
}

function setMobileMoreSheetOpen(open) {
  const sheet = $("#mobileMoreSheet");
  const backdrop = $("#mobileMoreBackdrop");
  const trigger = $("#mobileMoreBtn");
  if (!sheet || !backdrop || !trigger) return;

  sheet.hidden = !open;
  backdrop.hidden = !open;
  trigger.setAttribute("aria-expanded", String(open));
  document.documentElement.dataset.mobileMore = open ? "open" : "closed";

  if (open) {
    nudgeHaptic(5);
    requestAnimationFrame(() => $(".mobile-more-tool", sheet)?.focus());
  }
}

function openMobileMoreSheet() {
  document.documentElement.dataset.mobileSupport = "closed";
  document.documentElement.dataset.mobileSettings = "closed";
  setMobileMoreSheetOpen(true);
}

function closeMobileMoreSheet() {
  setMobileMoreSheetOpen(false);
}

function syncMobileBottomNav(panelName) {
  const moreButton = $("#mobileMoreBtn");
  if (!moreButton) return;

  const activePanel = navPanelTarget(panelName);
  const isMorePanel = !MOBILE_BOTTOM_PANELS.has(activePanel);
  moreButton.classList.toggle("is-active", isMorePanel);
  moreButton.setAttribute("aria-current", isMorePanel ? "page" : "false");
}

function openMobileSupportDirectory() {
  closeMobileMoreSheet();
  document.documentElement.dataset.mobileSettings = "closed";
  document.documentElement.dataset.mobileSupport = "open";
  $(".resource-card")?.setAttribute("open", "");
  $(".resource-card")?.scrollIntoView({ block: "start", behavior: "smooth" });
}

function openMobileAccessSettings() {
  closeMobileMoreSheet();
  document.documentElement.dataset.mobileSupport = "closed";
  showPanel("dashboard");
  document.documentElement.dataset.mobileSettings = "open";
  $(".settings-panel")?.setAttribute("open", "");
  requestAnimationFrame(() => $(".settings-panel")?.scrollIntoView({ block: "start", behavior: "smooth" }));
}

function setTodayExpanded(expanded) {
  document.documentElement.dataset.todayExpanded = expanded ? "on" : "off";

  const showMoreBtn = $("#showMoreTodayBtn");
  if (showMoreBtn) {
    showMoreBtn.textContent = expanded ? "Back to quick start" : "More tools";
    showMoreBtn.setAttribute("aria-expanded", String(expanded));
  }
}

function setTodayInlineFeedbackVisible(visible) {
  todayInlineFeedbackVisible = Boolean(visible);
}

function hasMeaningfulThread() {
  const hasNotesDraft = Boolean(
    state.notes.title ||
    state.notes.context ||
    state.notes.reviewGoal ||
    state.notes.blocks.some((block) => block.text.trim())
  );
  const hasFocusThread = Boolean(
    state.focus.intention ||
    state.focus.returnCue ||
    state.focus.completedRounds ||
    state.outputs.focus
  );

  return Boolean(
    state.notesHistory.length ||
    state.outputs.route ||
    state.outputs.regulate ||
    state.outputs.planner ||
    state.outputs.unpack ||
    state.outputs.notes ||
    state.outputs.profile ||
    state.outputs.focus ||
    state.outputs.calendar ||
    state.outputs.finish ||
    state.planner.task ||
    state.calendar.items.length ||
    state.regulate.load ||
    state.unpack.prompt ||
    hasFocusThread ||
    hasNotesDraft ||
    Object.keys(state.profileAnswers).length ||
    state.finish.items.some(Boolean) ||
    state.finish.nextTime
  );
}

function applySettings() {
  const supportState = SUPPORT_STATES[state.settings.supportState]
    ? state.settings.supportState
    : "standard";
  const supportMeta = SUPPORT_STATES[supportState];

  document.documentElement.dataset.fontScale = state.settings.fontScale;
  document.documentElement.dataset.fontFamily = state.settings.fontFamily;
  document.documentElement.dataset.contrast = state.settings.contrast;
  document.documentElement.dataset.motion = state.settings.motion;
  document.documentElement.dataset.supportState = supportState;
  document.documentElement.dataset.focusMode = state.settings.focusMode ? "on" : "off";

  $("#fontScaleSelect").value = state.settings.fontScale;
  $("#fontFamilySelect").value = state.settings.fontFamily;
  $("#contrastSelect").value = state.settings.contrast;
  $("#motionSelect").value = state.settings.motion;

  $$(".support-state-button").forEach((button) => {
    const isSelected = button.dataset.supportState === supportState;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  const supportStateHint = $("#supportStateHint");
  if (supportStateHint) supportStateHint.textContent = supportMeta.hint;
  const supportStateSummaryTitle = $("#supportStateSummaryTitle");
  if (supportStateSummaryTitle) supportStateSummaryTitle.textContent = `${supportMeta.label} support`;

  const supportStateCalloutTitle = $("#supportStateCalloutTitle");
  const supportStateCalloutCopy = $("#supportStateCalloutCopy");
  if (supportStateCalloutTitle) supportStateCalloutTitle.textContent = supportMeta.calloutTitle;
  if (supportStateCalloutCopy) supportStateCalloutCopy.textContent = supportMeta.calloutCopy;

  const supportStatePanel = $("#supportStatePanel");
  if (supportStatePanel && supportState === "detailed") {
    supportStatePanel.open = true;
  }

  const focusModeBtn = $("#focusModeBtn");
  if (focusModeBtn) {
    focusModeBtn.setAttribute("aria-pressed", String(Boolean(state.settings.focusMode)));
    focusModeBtn.textContent = state.settings.focusMode ? "Focus mode on" : "Focus mode off";
  }

  const todayCheckin = $("#todayCheckin");
  if (todayCheckin) {
    todayCheckin.open = supportState === "detailed";
  }
}

function showPanel(panelName) {
  document.documentElement.dataset.activePanel = panelName;
  closeMobileMoreSheet();
  document.documentElement.dataset.mobileSupport = "closed";
  if (panelName !== "dashboard") {
    document.documentElement.dataset.mobileSettings = "closed";
  }
  renderCurrentPanelLabel(panelName);
  updateMobileActionDock(panelName);
  if (panelName !== "dashboard") {
    setTodayExpanded(false);
    setTodayInlineFeedbackVisible(false);
    renderTodayInlineFeedback(null);
  } else if (!todayInlineFeedbackVisible) {
    renderTodayInlineFeedback(null);
  } else if (state.outputs.route) {
    renderTodayInlineFeedback(state.outputs.route);
  }

  const themeColorMeta = document.querySelector("meta[name='theme-color']");
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", PANEL_THEME_COLORS[panelName] || PANEL_THEME_COLORS.dashboard);
  }

  $$(".panel").forEach((panel) => {
    const isActive = panel.id === `panel-${panelName}`;
    panel.classList.toggle("is-active", isActive);
    panel.toggleAttribute("hidden", !isActive);
  });

  $$(".nav-link").forEach((button) => {
    const isActive = button.dataset.panelTarget === navPanelTarget(panelName);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("tabindex", isActive ? "0" : "-1");
  });
  syncMobileBottomNav(panelName);

  if (PRIMARY_PANELS.has(panelName)) {
    state.session.lastPanel = panelName;
    state.session.updatedAt = stampNow();
    saveState("session", state.session);
  }
  renderStatus();

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function openMobileResult({
  sourcePanel = "dashboard",
  resultType = sourcePanel,
  kicker = "Result ready",
  title = "Your next step",
  summary = "Northstar has narrowed this down to one usable move.",
  items = [],
  primaryLabel = "Back to Home",
  primaryTarget = "dashboard",
  copyText: nextCopyText = "",
  secondaryLabel = "Copy",
  secondaryAction = "copy"
} = {}) {
  if (!shouldUseMobileResult()) return;

  mobileResultSourcePanel = sourcePanel;
  mobileResultPrimaryTarget = primaryTarget;
  mobileResultCopyText = nextCopyText;
  mobileResultSecondaryAction = secondaryAction;

  const icon = $("#mobileResultIcon");
  if (icon) icon.dataset.resultType = resultType;
  $("#mobileResultKicker").textContent = kicker;
  $("#mobileResultTitle").textContent = title;
  $("#mobileResultSummary").textContent = summary;
  $("#mobileResultPrimaryBtn").textContent = primaryLabel;
  $("#mobileResultCopyBtn").textContent = secondaryLabel;

  const visibleItems = items.filter(Boolean).slice(0, 4);
  $("#mobileResultBody").innerHTML = visibleItems.length
    ? visibleItems
      .map((item, index) => `
        <article class="mobile-result-item">
          <span>${index + 1}</span>
          <p>${escapeHtml(item)}</p>
        </article>
      `)
      .join("")
    : `
      <article class="mobile-result-item">
        <span>1</span>
        <p>${escapeHtml(summary)}</p>
      </article>
    `;

  nudgeHaptic([8, 20, 8]);
  showPanel("mobile-result");
}

function saveSupportContacts() {
  state.supportContacts = normalizeSupportContacts(state.supportContacts);
  saveState("supportContacts", state.supportContacts);

  const status = $("#supportContactsStatus");
  if (status) {
    status.textContent = "Saved privately on this device.";
  }
}

function supportContactTitle(contact, index) {
  return contact.supportName.trim() || contact.contactName.trim() || `Support contact ${index + 1}`;
}

function updateSupportContact(contactId, field, value) {
  const contact = state.supportContacts.find((item) => item.id === contactId);
  if (!contact || !(field in contact)) return;

  contact[field] = value;
  saveSupportContacts();
}

function addSupportContact() {
  const contact = createSupportContact();
  state.supportContacts.push(contact);
  saveSupportContacts();
  renderResources();

  requestAnimationFrame(() => {
    $(`[data-support-contact="${contact.id}"] input`)?.focus();
  });
}

function removeSupportContact(contactId) {
  if (state.supportContacts.length <= 1) {
    state.supportContacts = defaultSupportContacts.map((contact, index) => normalizeSupportContact(contact, index));
  } else {
    state.supportContacts = state.supportContacts.filter((contact) => contact.id !== contactId);
  }

  saveSupportContacts();
  renderResources();
}

function renderResources() {
  const contacts = normalizeSupportContacts(state.supportContacts);
  state.supportContacts = contacts;

  $("#resourceList").innerHTML = `
    <div class="support-directory">
      ${contacts.map((contact, index) => `
        <article class="support-contact-card" data-support-contact="${escapeHtml(contact.id)}">
          <div class="support-contact-head">
            <strong data-support-contact-title>${escapeHtml(supportContactTitle(contact, index))}</strong>
            <button
              type="button"
              class="button subtle support-contact-remove"
              data-support-contact-remove="${escapeHtml(contact.id)}"
            >
              ${contacts.length > 1 ? "Remove" : "Clear"}
            </button>
          </div>
          <div class="support-contact-grid">
            <label class="field compact-field">
              <span>Support or service</span>
              <input
                type="text"
                value="${escapeHtml(contact.supportName)}"
                placeholder="Academic skills, mentor, course office"
                autocomplete="organization"
                data-support-contact-field="supportName"
              >
            </label>
            <label class="field compact-field">
              <span>Person or desk</span>
              <input
                type="text"
                value="${escapeHtml(contact.contactName)}"
                placeholder="Name or team"
                autocomplete="name"
                data-support-contact-field="contactName"
              >
            </label>
            <label class="field compact-field">
              <span>Email</span>
              <input
                type="email"
                value="${escapeHtml(contact.email)}"
                placeholder="name@example.edu"
                autocomplete="email"
                data-support-contact-field="email"
              >
            </label>
            <label class="field compact-field">
              <span>Phone</span>
              <input
                type="tel"
                value="${escapeHtml(contact.phone)}"
                placeholder="Phone number"
                autocomplete="tel"
                data-support-contact-field="phone"
              >
            </label>
            <label class="field compact-field">
              <span>Link</span>
              <input
                type="url"
                value="${escapeHtml(contact.link)}"
                placeholder="Booking link or website"
                autocomplete="url"
                data-support-contact-field="link"
              >
            </label>
            <label class="field compact-field">
              <span>Notes</span>
              <textarea
                rows="3"
                placeholder="What they help with, when to contact, next booking step"
                data-support-contact-field="notes"
              >${escapeHtml(contact.notes)}</textarea>
            </label>
          </div>
        </article>
      `).join("")}
    </div>
    <button type="button" class="button subtle support-add-button" id="addSupportContactBtn">
      Add another support
    </button>
    <p class="support-save-status" id="supportContactsStatus" aria-live="polite">Saved privately on this device.</p>
  `;

  $$("#resourceList [data-support-contact-field]").forEach((field) => {
    field.addEventListener("input", () => {
      const card = field.closest("[data-support-contact]");
      if (!card) return;

      updateSupportContact(card.dataset.supportContact, field.dataset.supportContactField, field.value);

      if (["supportName", "contactName"].includes(field.dataset.supportContactField)) {
        const index = state.supportContacts.findIndex((contact) => contact.id === card.dataset.supportContact);
        const contact = state.supportContacts[index];
        const title = $("[data-support-contact-title]", card);
        if (contact && title) title.textContent = supportContactTitle(contact, index);
      }
    });
  });

  $$("#resourceList [data-support-contact-remove]").forEach((button) => {
    button.addEventListener("click", () => removeSupportContact(button.dataset.supportContactRemove));
  });

  $("#addSupportContactBtn")?.addEventListener("click", addSupportContact);
}

function renderBlockers(containerId, selected = [], name = "blocker") {
  const container = $(`#${containerId}`);
  container.innerHTML = BLOCKERS.map(
    (blocker) => `
      <label class="option-card ${selected.includes(blocker.id) ? "is-selected" : ""}">
        <input
          type="checkbox"
          name="${name}"
          value="${blocker.id}"
          ${selected.includes(blocker.id) ? "checked" : ""}
        >
        <span>${escapeHtml(blocker.label)}</span>
      </label>
    `
  ).join("");
}

function renderVerbOptions() {
  $("#verbSelect").innerHTML = Object.entries(TASK_VERBS)
    .map(
      ([key, data]) => `
        <option value="${escapeHtml(key)}">${escapeHtml(data.label)}</option>
      `
    )
    .join("");
  $("#verbSelect").value = state.unpack.verb;
}

function profileAnsweredCount() {
  return PROFILE_QUESTIONS.filter((question) => Number.isInteger(state.profileAnswers[question.id])).length;
}

function firstUnansweredProfileIndex() {
  return PROFILE_QUESTIONS.findIndex((question) => !Number.isInteger(state.profileAnswers[question.id]));
}

function clampProfileIndex(index) {
  return Math.min(Math.max(index, 0), Math.max(PROFILE_QUESTIONS.length - 1, 0));
}

function setProfileStep(index) {
  state.profileUi.activeIndex = clampProfileIndex(index);
  saveState("profileUi", state.profileUi);
  renderProfileStepper();
}

function renderProfileProgress() {
  const answered = profileAnsweredCount();
  const total = PROFILE_QUESTIONS.length;
  const currentIndex = clampProfileIndex(state.profileUi.activeIndex || 0);
  const currentLabel = answered === total
    ? "All prompts answered"
    : `Question ${currentIndex + 1} of ${total}`;

  $("#profileProgressLabel").textContent = currentLabel;
  $("#profileProgressCount").textContent = `${answered} / ${total}`;
  $("#profileProgressFill").style.width = `${(answered / total) * 100}%`;

  const nextUnansweredIndex = firstUnansweredProfileIndex();
  $("#profileProgressCopy").textContent = nextUnansweredIndex === -1
    ? "Your support profile is complete enough to use in advising, planning, or self-advocacy."
    : "Northstar remembers where you paused, so you can answer one question now and return later.";
}

function renderProfileQuestionCard() {
  const currentIndex = clampProfileIndex(state.profileUi.activeIndex || 0);
  const question = PROFILE_QUESTIONS[currentIndex];
  const selected = state.profileAnswers[question.id];

  $("#profileQuestionCard").innerHTML = `
    <article class="profile-step-card">
      <p class="eyebrow">Question ${currentIndex + 1}</p>
      <h3>${escapeHtml(question.prompt)}</h3>
      <p class="microcopy">${escapeHtml(question.supportText || "Choose what tends to feel most true in practice.")}</p>
      <div class="profile-option-grid">
        ${question.options
          .map((option, index) => `
            <button
              class="profile-option-button ${selected === index ? "is-selected" : ""}"
              type="button"
              data-profile-question="${escapeHtml(question.id)}"
              data-profile-option="${index}"
              aria-pressed="${String(selected === index)}"
            >
              <strong>${escapeHtml(option.label)}</strong>
            </button>
          `)
          .join("")}
      </div>
    </article>
  `;

  $("#profileBackBtn").disabled = currentIndex === 0;
  $("#profileNextBtn").disabled = !Number.isInteger(selected);
  $("#profileNextBtn").textContent = currentIndex === PROFILE_QUESTIONS.length - 1
    ? "Finish prompts"
    : "Next prompt";
}

function renderProfileAnswerTrail() {
  const answeredItems = PROFILE_QUESTIONS
    .map((question) => {
      const selected = state.profileAnswers[question.id];
      if (!Number.isInteger(selected)) return null;

      return {
        prompt: question.prompt,
        answer: question.options[selected]?.label || ""
      };
    })
    .filter(Boolean);

  const container = $("#profileAnswerTrail");

  if (!answeredItems.length) {
    container.classList.add("empty");
    container.textContent = "No pattern answers saved yet. Start with the question above and Northstar will build the trail as you go.";
    return;
  }

  container.classList.remove("empty");
  container.innerHTML = answeredItems
    .map((item) => `
      <div class="trail-item">
        <strong>${escapeHtml(item.prompt)}</strong>
        <p>${escapeHtml(item.answer)}</p>
      </div>
    `)
    .join("");
}

function renderProfileQuestions() {
  renderProfileStepper();
}

function renderProfileStepper() {
  renderProfileProgress();
  renderProfileQuestionCard();
  renderProfileAnswerTrail();
}

function setProfileAnswer(questionId, optionIndex) {
  state.profileAnswers[questionId] = optionIndex;
  saveState("profileAnswers", state.profileAnswers);
  renderProfileStepper();
  renderProfile({ openResult: false });
  renderSnapshotPreview();
  renderStatus();
}

function goToNextProfileQuestion() {
  const currentIndex = clampProfileIndex(state.profileUi.activeIndex || 0);
  if (currentIndex >= PROFILE_QUESTIONS.length - 1) {
    renderProfile({ openResult: true });
    return;
  }

  setProfileStep(currentIndex + 1);
}

function goToPreviousProfileQuestion() {
  const currentIndex = clampProfileIndex(state.profileUi.activeIndex || 0);
  setProfileStep(currentIndex - 1);
}

function skipProfileQuestion() {
  const currentIndex = clampProfileIndex(state.profileUi.activeIndex || 0);
  const nextUnansweredIndex = firstUnansweredProfileIndex();

  if (currentIndex >= PROFILE_QUESTIONS.length - 1) {
    renderProfile({ openResult: true });
    return;
  }

  if (nextUnansweredIndex > currentIndex) {
    setProfileStep(nextUnansweredIndex);
    return;
  }

  setProfileStep(currentIndex + 1);
}

function renderFinishChecklist() {
  $("#finishChecklist").innerHTML = FINISH_ITEMS.map((item, index) => `
    <label class="finish-item">
      <input
        type="checkbox"
        data-finish-index="${index}"
        ${state.finish.items[index] ? "checked" : ""}
      >
      <span class="finish-copy">${escapeHtml(item)}</span>
    </label>
  `).join("");
}

function renderStudyStateSelection() {
  const activeState = STUDY_STATES[state.checkin.studyState] ? state.checkin.studyState : "";
  const stateMeta = STUDY_STATES[activeState];

  $$("#studyStateButtons .state-card").forEach((button) => {
    const isSelected = button.dataset.studyState === activeState;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  const brief = $("#todayStateBrief");
  if (!brief) return;

  if (!stateMeta) {
    brief.classList.add("is-empty");
    brief.innerHTML = `
      <strong>Pick the closest fit, not the perfect label.</strong>
      <p>Northstar uses this to choose a gentler first step.</p>
    `;
    return;
  }

  brief.classList.remove("is-empty");
  brief.innerHTML = `
    <strong>${escapeHtml(stateMeta.label)}</strong>
    <p>${escapeHtml(stateMeta.brief)}</p>
    <p class="today-state-meta">Northstar will start in ${escapeHtml(panelLabel(stateMeta.route))}, use ${escapeHtml(friendlyTime(stateMeta.timeAvailable))}, and switch to ${escapeHtml(SUPPORT_STATES[stateMeta.supportState].label.toLowerCase())} support.</p>
  `;
}

function syncTodayInputs() {
  $("#timeAvailableSelect").value = String(state.checkin.timeAvailable);
  const supportModeSelect = $("#supportModeSelect");
  if (supportModeSelect) supportModeSelect.value = state.checkin.supportMode;
  $("#todayIntentInput").value = state.checkin.intent;
  renderBlockers("blockerCheckboxes", state.checkin.blockers, "today-blocker");
  renderStudyStateSelection();
  selectBattery(state.checkin.battery);
}

function setInitialFormValues() {
  syncTodayInputs();

  $("#taskInput").value = state.planner.task;
  $("#taskDueInput").value = state.planner.dueDate;
  $("#taskEnergySelect").value = state.planner.energy;

  updateCalendarTermInputs();

  state.regulate.signal = normalizeRegulationSignal(state.regulate.signal);
  state.regulate.anchor = normalizeRegulationAnchor(state.regulate.anchor);
  state.regulate.strategy = normalizeRegulationStrategy(state.regulate.strategy);
  $("#regulateSignalSelect").value = state.regulate.signal;
  $("#regulateAnchorSelect").value = state.regulate.anchor;
  $("#regulateLoadInput").value = state.regulate.load;

  $("#promptInput").value = state.unpack.prompt;
  $("#promptDueInput").value = state.unpack.dueDate;
  $("#unclearInput").value = state.unpack.unclear;
  $("#deliverableSelect").value = getDeliverableGuidance(state.unpack.deliverable).label;

  $("#focusIntentionInput").value = state.focus.intention;
  $("#focusReturnCueInput").value = state.focus.returnCue;

  $("#notesTitleInput").value = state.notes.title;
  $("#notesContextInput").value = state.notes.context;
  $("#notesGoalInput").value = state.notes.reviewGoal;

  $("#nextTimeInput").value = state.finish.nextTime;
  $("#workedInput").value = state.sessionMemory.worked;
  $("#avoidInput").value = state.sessionMemory.avoid;
}

const REGULATION_SIGNAL_ALIASES = {
  body: "agitated",
  thoughts: "emotional",
  sensory: "overwhelmed",
  avoidance: "avoiding",
  fog: "tired"
};

const REGULATION_ANCHOR_ALIASES = {
  touch: "pressure",
  sound: "sensory",
  sight: "grounding",
  breath: "breathing",
  object: "grounding"
};

const REGULATION_STRATEGY_ALIASES = {
  label: "grounding",
  needs: "body"
};

const REGULATION_SIGNALS = {
  overwhelmed: {
    label: "Too much",
    copy: "Everything feels big, loud, or sharp."
  },
  frozen: {
    label: "Frozen",
    copy: "Starting feels locked."
  },
  agitated: {
    label: "Agitated",
    copy: "There is too much charge."
  },
  tired: {
    label: "Tired",
    copy: "Energy is low."
  },
  avoiding: {
    label: "Avoiding",
    copy: "The task is hard to touch."
  },
  emotional: {
    label: "Emotionally loaded",
    copy: "This has feelings attached."
  }
};

const REGULATION_ANCHORS = {
  pressure: "Press your feet into the floor, hold a weighted item, or push gently into a wall.",
  movement: "Pace, stretch, shake out your hands, or change posture.",
  sensory: "Dim light, reduce sound, close one tab, or clear one small patch.",
  grounding: "Pick one object. Notice its colour, edge, texture, or weight.",
  breathing: "Try one slower exhale only if breath feels safe.",
  body: "Check water, food, bathroom, meds, temperature, or pain."
};

const REGULATION_BRIDGES = {
  overwhelmed: "Then sit near the work. You do not have to start yet.",
  frozen: "Then open the task and write one messy line.",
  agitated: "Then choose one tiny move and stop there.",
  tired: "Then decide if one tiny step is possible. If not, save where to come back.",
  avoiding: "Then make the task visible for one minute.",
  emotional: "Then name one feeling and lower the pressure before deciding."
};

const REGULATION_STRATEGIES = {
  pressure: {
    label: "Add pressure",
    step: "Use steady pressure for 30 seconds. Feet down, weighted item, or wall push.",
    bridge: "Then sit near the work. You do not have to start yet."
  },
  movement: {
    label: "Move a little",
    step: "Move a little for 30 seconds. Pace, stretch, shake out, or change posture.",
    bridge: "Then open only the thing you need next."
  },
  sensory: {
    label: "Lower input",
    step: "Lower one input. Dim light, reduce sound, close one tab, or clear one small patch.",
    bridge: "Then make the work visible without starting it yet."
  },
  grounding: {
    label: "Find one object",
    step: "Find one object. Notice its colour, edge, texture, or weight.",
    bridge: "Then write one plain sentence about what is here."
  },
  breathing: {
    label: "Use breath gently",
    step: "Try one slower exhale. Stop if breath feels wrong.",
    bridge: "Then choose the smallest possible contact with the task."
  },
  body: {
    label: "Check body needs",
    step: "Check one body need: water, food, bathroom, meds, temperature, or pain.",
    bridge: "Then use a 10-minute timer or make one first step."
  }
};

const REGULATION_SIGNAL_STRATEGIES = {
  overwhelmed: "sensory",
  frozen: "movement",
  agitated: "pressure",
  tired: "body",
  avoiding: "grounding",
  emotional: "breathing"
};

const REGULATION_SIGNAL_SEQUENCE = [
  "overwhelmed",
  "frozen",
  "agitated",
  "tired",
  "avoiding",
  "emotional"
];

function normalizeRegulationSignal(signal) {
  return REGULATION_SIGNALS[signal] ? signal : REGULATION_SIGNAL_ALIASES[signal] || "overwhelmed";
}

function normalizeRegulationAnchor(anchor) {
  return REGULATION_ANCHORS[anchor] ? anchor : REGULATION_ANCHOR_ALIASES[anchor] || "pressure";
}

function normalizeRegulationStrategy(strategy) {
  return REGULATION_STRATEGIES[strategy] ? strategy : REGULATION_STRATEGY_ALIASES[strategy] || "pressure";
}

function setRegulationStrategy(strategy, { feedback = true } = {}) {
  strategy = normalizeRegulationStrategy(strategy);
  if (!REGULATION_STRATEGIES[strategy]) return;
  if (feedback) nudgeHaptic(5);
  state.regulate.strategy = strategy;
  saveState("regulate", state.regulate);

  $$("#regulationMenu .regulation-option").forEach((button) => {
    const isSelected = button.dataset.regulationStrategy === strategy;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  renderRegulationStarterPreview();
}

function syncRegulationStateButtons() {
  const signal = normalizeRegulationSignal(state.regulate.signal);
  $$("#regulationStateButtons .regulation-state-button").forEach((button) => {
    const isSelected = button.dataset.regulationSignal === signal;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function renderRegulationStarterPreview() {
  const signalKey = normalizeRegulationSignal(state.regulate.signal);
  const strategyKey = normalizeRegulationStrategy(state.regulate.strategy || REGULATION_SIGNAL_STRATEGIES[signalKey]);
  const signal = REGULATION_SIGNALS[signalKey] || REGULATION_SIGNALS.overwhelmed;
  const strategy = REGULATION_STRATEGIES[strategyKey] || REGULATION_STRATEGIES.sensory;
  const bridge = REGULATION_BRIDGES[signalKey] || strategy.bridge;

  const title = $("#regulationStepTitle");
  const step = $("#regulationStepCopy");
  const bridgeCopy = $("#regulationBridgeCopy");
  if (title) title.textContent = strategy.label;
  if (step) step.textContent = strategy.step;
  if (bridgeCopy) bridgeCopy.textContent = bridge;

  const signalSelect = $("#regulateSignalSelect");
  const anchorSelect = $("#regulateAnchorSelect");
  if (signalSelect) signalSelect.value = signalKey;
  if (anchorSelect) anchorSelect.value = strategyKey;

  syncRegulationStateButtons();
  return { signal, strategy, bridge };
}

function setRegulationSignal(signal, { feedback = true, chooseDefaultStrategy = true } = {}) {
  signal = normalizeRegulationSignal(signal);
  if (feedback) nudgeHaptic(5);
  state.regulate.signal = signal;

  if (chooseDefaultStrategy) {
    state.regulate.strategy = REGULATION_SIGNAL_STRATEGIES[signal] || "sensory";
    state.regulate.anchor = state.regulate.strategy;
  }

  saveState("regulate", state.regulate);
  renderRegulationStarterPreview();
}

function tryAnotherRegulationStep() {
  const currentSignal = normalizeRegulationSignal(state.regulate.signal);
  const currentIndex = REGULATION_SIGNAL_SEQUENCE.indexOf(currentSignal);
  const nextSignal = REGULATION_SIGNAL_SEQUENCE[(currentIndex + 1) % REGULATION_SIGNAL_SEQUENCE.length] || "overwhelmed";
  setRegulationSignal(nextSignal, { feedback: true, chooseDefaultStrategy: true });
  renderRegulation({ openResult: shouldUseMobileResult(), remember: false });
}

function showOneSmallMove() {
  state.regulate = {
    ...state.regulate,
    signal: "overwhelmed",
    anchor: "sensory",
    strategy: "sensory",
    load: state.regulate.load || ""
  };
  saveState("regulate", state.regulate);
  renderRegulationStarterPreview();
  renderRegulation({ openResult: shouldUseMobileResult(), remember: true });

  if (!shouldUseMobileResult()) {
    showPanel("regulate");
    const output = $("#regulateOutput");
    requestAnimationFrame(() => output?.focus?.({ preventScroll: true }));
  }
}

function buildRegulationResult() {
  captureForms();

  const strategyKey = normalizeRegulationStrategy(state.regulate.strategy);
  const strategy = REGULATION_STRATEGIES[strategyKey] || REGULATION_STRATEGIES.sensory;
  const signalKey = normalizeRegulationSignal(state.regulate.signal);
  const anchorKey = normalizeRegulationAnchor(state.regulate.anchor);
  const signal = REGULATION_SIGNALS[signalKey] || REGULATION_SIGNALS.overwhelmed;
  const anchor = REGULATION_ANCHORS[anchorKey] || REGULATION_ANCHORS.pressure;
  const loadStep = state.regulate.load;
  const bridge = REGULATION_BRIDGES[signalKey] || strategy.bridge;

  return {
    signal: `${signal.label}: ${signal.copy}`,
    anchor,
    strategyLabel: strategy.label,
    regulationStep: strategy.step,
    loadStep,
    bridge: normalizeReturnCue(bridge),
    experiment: "You can stop after this. One small move is enough."
  };
}

function renderRegulation({ openResult = false, remember = true } = {}) {
  const result = buildRegulationResult();
  state.outputs.regulate = result;
  saveState("outputs", state.outputs);

  $("#regulateOutput").classList.remove("empty");
  renderRegulationStarterPreview();

  $("#regulateOutput").innerHTML = `
    <div class="output-block">
      <h4>What feels closest</h4>
      <p>${escapeHtml(result.signal)}</p>
    </div>

    <div class="output-block">
      <h4>Try this for 30 seconds</h4>
      <p>${escapeHtml(result.regulationStep)}</p>
    </div>

    <div class="output-block">
      <h4>Then</h4>
      <p>${escapeHtml(result.bridge)}</p>
      ${result.loadStep ? `<p class="output-subtle">${escapeHtml(result.loadStep)}</p>` : ""}
      <p class="output-subtle">${escapeHtml(result.experiment)}</p>
    </div>
  `;

  if (remember) {
    updateSessionMemory({
      worked: state.sessionMemory.worked,
      nextCue: result.bridge,
      lastPanel: "regulate"
    });
  }
  renderSnapshotPreview();
  renderStatus();

  if (openResult) {
    openMobileResult({
      sourcePanel: "regulate",
      resultType: "regulate",
      kicker: "No rush",
      title: "Try this first",
      summary: result.regulationStep,
      items: [result.bridge, result.experiment],
      primaryLabel: "I can do one tiny work step",
      primaryTarget: "planner",
      secondaryLabel: "Not yet, try another",
      secondaryAction: "try-regulation",
      copyText: [
        "NORTHSTAR REGULATION STEP",
        "",
        result.signal,
        result.regulationStep,
        result.loadStep || "",
        result.bridge
      ].join("\n")
    });
  }
}

function syncRegulationSelection() {
  state.regulate.signal = normalizeRegulationSignal(state.regulate.signal);
  state.regulate.anchor = normalizeRegulationAnchor(state.regulate.anchor);
  state.regulate.strategy = normalizeRegulationStrategy(state.regulate.strategy || REGULATION_SIGNAL_STRATEGIES[state.regulate.signal]);
  state.regulate.anchor = state.regulate.strategy;
  setRegulationStrategy(state.regulate.strategy, { feedback: false });
  renderRegulationStarterPreview();
}

function focusNotificationCopy(phase = state.focus.phase) {
  return phase === "break"
    ? {
      title: "Northstar break complete",
      body: "Choose whether another focus block would actually help."
    }
    : {
      title: "Northstar focus block complete",
      body: "Stop first. Save where to come back before deciding what comes next."
    };
}

async function cancelFocusNotification() {
  const localNotifications = nativePlugin("LocalNotifications");
  if (!localNotifications?.cancel) return;

  try {
    await localNotifications.cancel({
      notifications: [{ id: FOCUS_NOTIFICATION_ID }]
    });
  } catch {
    // Notification cancellation is best-effort; the timer itself remains reliable.
  }
}

async function requestTimerAlerts() {
  const localNotifications = nativePlugin("LocalNotifications");

  if (localNotifications?.checkPermissions && localNotifications?.requestPermissions) {
    try {
      const current = await localNotifications.checkPermissions();
      const permission = current.display === "granted"
        ? current
        : await localNotifications.requestPermissions();
      state.focus.alertPermission = permission.display || "unknown";
      state.focus.alertPreference = permission.display === "granted";
      saveState("focus", state.focus);
      renderFocusTimer();
      return state.focus.alertPreference;
    } catch {
      state.focus.alertPermission = "unavailable";
      state.focus.alertPreference = false;
      saveState("focus", state.focus);
      renderFocusTimer();
      return false;
    }
  }

  if ("Notification" in window) {
    try {
      const permission = Notification.permission === "default"
        ? await Notification.requestPermission()
        : Notification.permission;
      state.focus.alertPermission = permission;
      state.focus.alertPreference = permission === "granted";
      saveState("focus", state.focus);
      renderFocusTimer();
      return state.focus.alertPreference;
    } catch {
      state.focus.alertPermission = "unavailable";
      state.focus.alertPreference = false;
      saveState("focus", state.focus);
      renderFocusTimer();
      return false;
    }
  }

  state.focus.alertPermission = "unavailable";
  state.focus.alertPreference = false;
  saveState("focus", state.focus);
  renderFocusTimer();
  return false;
}

async function scheduleFocusNotification(delaySeconds) {
  await cancelFocusNotification();
  if (!state.focus.alertPreference || delaySeconds <= 0) return;

  const copy = focusNotificationCopy();
  const localNotifications = nativePlugin("LocalNotifications");

  if (localNotifications?.schedule) {
    try {
      await localNotifications.schedule({
        notifications: [
          {
            id: FOCUS_NOTIFICATION_ID,
            title: copy.title,
            body: copy.body,
            schedule: { at: new Date(Date.now() + delaySeconds * 1000) }
          }
        ]
      });
      return;
    } catch {
      // Fall through to foreground/browser notification if native scheduling fails.
    }
  }
}

function notifyFocusTimerComplete(phase = state.focus.phase) {
  const copy = focusNotificationCopy(phase);
  if (!state.focus.alertPreference || !("Notification" in window) || Notification.permission !== "granted") return;

  try {
    new Notification(copy.title, { body: copy.body });
  } catch {
    // Browsers may reject notifications in embedded shells; ignore gracefully.
  }
}

function currentFocusPreset() {
  return FOCUS_PRESETS[state.focus.preset] || FOCUS_PRESETS.gentle;
}

function focusDurationSeconds(phase = state.focus.phase) {
  const preset = currentFocusPreset();
  const minutes = phase === "break" ? preset.breakMinutes : preset.focusMinutes;
  return minutes * 60;
}

function ensureFocusRemaining() {
  if (!Number.isFinite(focusTimerRemaining)) {
    focusTimerRemaining = focusDurationSeconds();
  }

  return focusTimerRemaining;
}

function formatFocusTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateSessionMemory(patch = {}) {
  state.sessionMemory = {
    ...state.sessionMemory,
    ...patch,
    nextCue: normalizeReturnCue(patch.nextCue ?? state.sessionMemory.nextCue),
    updatedAt: stampNow()
  };
  saveState("sessionMemory", state.sessionMemory);
  renderSessionMemory();
}

function renderSessionMemory() {
  const card = $("#sessionMemoryCard");
  if (!card) return;

  const { worked, avoid, nextCue, updatedAt, focusRounds, lastPanel } = state.sessionMemory;
  const hasMemory = Boolean(worked || avoid || nextCue || focusRounds);
  const activePanel = document.documentElement.dataset.activePanel || "dashboard";
  card.hidden = !hasMemory || (state.settings.supportState === "low" && activePanel !== "dashboard");
  if (!hasMemory) return;

  const safeNextCue = normalizeReturnCue(nextCue);
  const title = safeNextCue || worked || `${focusRounds} focus block${focusRounds === 1 ? "" : "s"} completed`;
  const helper = avoid ? `Make lighter: ${avoid}` : worked && safeNextCue ? `Helpful: ${worked}` : "";
  const copyParts = [
    helper,
    focusRounds ? `${focusRounds} focus block${focusRounds === 1 ? "" : "s"} completed.` : ""
  ].filter(Boolean);

  $("#sessionMemoryTitle").textContent = title;
  $("#sessionMemoryCopy").textContent = copyParts.join(" · ") || "Use this as the next starting point.";
  $("#sessionMemoryMeta").textContent = updatedAt
    ? `Saved from ${panelLabel(lastPanel || "dashboard")}`
    : "";
}

function renderCalibration() {
  const card = $("#calibrationCard");
  if (!card) return;
  const activePanel = document.documentElement.dataset.activePanel || "dashboard";
  card.hidden = !calibrationManuallyOpened || Boolean(state.calibration.completed) || activePanel !== "dashboard";

  $$("#calibrationCard [data-calibration-support]").forEach((button) => {
    const isSelected = button.dataset.calibrationSupport === state.calibration.supportState;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  $$("#calibrationCard [data-calibration-start]").forEach((button) => {
    const isSelected = button.dataset.calibrationStart === state.calibration.startPoint;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  $$("#calibrationCard [data-calibration-timer]").forEach((button) => {
    const isSelected = button.dataset.calibrationTimer === state.calibration.timerPreset;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });
}

function setCalibrationValue(key, value) {
  state.calibration[key] = value;
  state.calibration.updatedAt = stampNow();
  saveState("calibration", state.calibration);
  renderCalibration();
}

function applyCalibration() {
  const startPoint = state.calibration.startPoint;
  const studyState = STUDY_STATES[startPoint] ? startPoint : "overwhelmed";
  const studyStateMeta = STUDY_STATES[studyState];
  let targetSection = studyStateMeta.route;
  let routeOverrides = {
    studyState,
    battery: studyStateMeta.battery,
    timeAvailable: studyStateMeta.timeAvailable,
    blockers: [...studyStateMeta.blockers],
    intent: state.checkin.intent || studyStateMeta.intent
  };

  state.settings.supportState = state.calibration.supportState;
  state.focus.preset = state.calibration.timerPreset;
  focusTimerRemaining = null;

  if (startPoint === "focus") {
    targetSection = "focus";
    state.checkin = {
      ...state.checkin,
      timeAvailable: 10,
      blockers: ["time", "starting"],
      intent: state.checkin.intent || "use a timer block before starting"
    };
    routeOverrides = {
      timeAvailable: 10,
      blockers: ["time", "starting"],
      intent: state.checkin.intent
    };
  } else {
    state.checkin = {
      ...state.checkin,
      studyState,
      battery: studyStateMeta.battery,
      timeAvailable: studyStateMeta.timeAvailable,
      blockers: [...studyStateMeta.blockers],
      intent: state.checkin.intent || studyStateMeta.intent
    };
  }

  state.calibration.completed = true;
  state.calibration.updatedAt = stampNow();
  calibrationManuallyOpened = false;
  saveState("settings", state.settings);
  saveState("focus", state.focus);
  saveState("checkin", state.checkin);
  saveState("calibration", state.calibration);

  syncTodayInputs();
  applySettings();
  renderFocusTimer();
  chooseTriageRoute(targetSection, routeOverrides);
  renderCalibration();
  renderSnapshotPreview();
  renderStatus();
  showPanel(targetSection || "dashboard");
}

function skipCalibration() {
  state.calibration.completed = true;
  state.calibration.updatedAt = stampNow();
  calibrationManuallyOpened = false;
  saveState("calibration", state.calibration);
  renderCalibration();
}

function showCalibration() {
  calibrationManuallyOpened = true;
  state.calibration.completed = false;
  state.calibration.updatedAt = stampNow();
  saveState("calibration", state.calibration);
  renderCalibration();
  showPanel("dashboard");
}

function stopFocusInterval() {
  if (focusTimerIntervalId) {
    clearInterval(focusTimerIntervalId);
    focusTimerIntervalId = null;
  }
  focusTimerRunning = false;
}

function focusPhaseCopy() {
  return state.focus.phase === "break"
    ? {
      label: "Recovery break",
      action: "Step away, unclench, drink water, or look somewhere further than the screen.",
      next: "When the break ends, choose whether one more block would actually help."
    }
    : {
      label: "Focus block",
      action: state.focus.intention || "Do one visible part of the task, not the whole task.",
      next: state.focus.returnCue || "When the timer ends, write one line about where to restart."
    };
}

function buildFocusOutput(status = "ready") {
  const preset = currentFocusPreset();
  const phaseCopy = focusPhaseCopy();

  return {
    status,
    preset: state.focus.preset,
    presetLabel: preset.label,
    phase: state.focus.phase,
    phaseLabel: phaseCopy.label,
    intention: state.focus.intention,
    returnCue: state.focus.returnCue,
    completedRounds: state.focus.completedRounds,
    lastCompletedAt: state.focus.lastCompletedAt,
    action: phaseCopy.action,
    next: phaseCopy.next
  };
}

function saveFocusOutput(status = "ready") {
  state.outputs.focus = buildFocusOutput(status);
  saveState("outputs", state.outputs);
  saveState("focus", state.focus);
}

function renderFocusOutput() {
  const output = $("#focusOutput");
  if (!output) return;

  const focus = state.outputs.focus;
  const preset = currentFocusPreset();
  const phaseCopy = focusPhaseCopy();
  const phaseHint = state.focus.phase === "break"
    ? "Breaks are part of the work here. They protect re-entry instead of rewarding overextension."
    : preset.hint;
  const hasFocusContent = Boolean(
    focus ||
    state.focus.intention ||
    state.focus.returnCue ||
    state.focus.completedRounds
  );

  if (!hasFocusContent) {
    output.classList.add("empty");
    output.textContent = "Pick a timer, name what this block is for, then start. Northstar will keep the instruction narrow and help you stop cleanly.";
    return;
  }

  output.classList.remove("empty");
  output.innerHTML = `
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Container</span>
        <strong>${escapeHtml(preset.label)}</strong>
        <p>${escapeHtml(preset.focusMinutes)} min focus · ${escapeHtml(preset.breakMinutes)} min break</p>
      </div>
      <div class="summary-cell">
        <span>Rounds complete</span>
        <strong>${escapeHtml(String(state.focus.completedRounds))}</strong>
        <p>${state.focus.lastCompletedAt ? `Last saved ${escapeHtml(new Date(state.focus.lastCompletedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))}` : "No completed block yet."}</p>
      </div>
    </div>

    <div class="output-block">
      <h4>${escapeHtml(phaseCopy.label)}</h4>
      <p>${escapeHtml(phaseCopy.action)}</p>
      <p class="output-subtle">${escapeHtml(phaseHint)}</p>
    </div>

    <div class="output-block">
      <h4>When this block ends</h4>
      <ul class="summary-list">
        ${toListItems([
          phaseCopy.next,
          "Stop first, then decide. Do not let the timer secretly become an obligation to continue.",
          "If you are still stuck, move to Plan or Unpack instead of forcing attention."
        ])}
      </ul>
    </div>
  `;
}

function renderFocusTimer() {
  const preset = currentFocusPreset();
  const remaining = ensureFocusRemaining();
  const phaseCopy = focusPhaseCopy();
  const display = $("#focusTimerDisplay");
  const label = $("#focusPhaseLabel");
  const hint = $("#focusTimerHint");
  const timerShell = $(".focus-timer-display");
  const startBtn = $("#focusStartBtn");
  const pauseBtn = $("#focusPauseBtn");
  const alertStatus = $("#focusNotificationStatus");
  const alertBtn = $("#enableTimerAlertsBtn");

  if (!display || !label || !hint || !timerShell) return;

  display.textContent = formatFocusTime(remaining);
  label.textContent = phaseCopy.label;
  hint.textContent = state.focus.phase === "break" ? phaseCopy.action : preset.hint;
  timerShell.classList.toggle("is-break", state.focus.phase === "break");

  if (startBtn) startBtn.textContent = focusTimerRunning ? "Block running" : state.focus.phase === "break" ? "Start break" : "Start the block";
  if (pauseBtn) pauseBtn.disabled = !focusTimerRunning;
  if (alertStatus) {
    alertStatus.textContent = state.focus.alertPreference
      ? "Alerts are on. Northstar will schedule a phone reminder for the end of the active block."
      : state.focus.alertPermission === "denied"
        ? "Alerts are blocked in system settings. The timer will still recover when you reopen Northstar."
        : "Alerts are off. You can still use the timer without them.";
  }
  if (alertBtn) {
    alertBtn.textContent = state.focus.alertPreference ? "Alerts enabled" : "Enable alerts";
    alertBtn.disabled = state.focus.alertPreference;
  }

  $$("#focusPresetButtons .focus-preset").forEach((button) => {
    const isSelected = button.dataset.focusPreset === state.focus.preset;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  renderFocusOutput();
}

function setFocusPreset(presetKey) {
  if (!FOCUS_PRESETS[presetKey]) return;
  nudgeHaptic(5);

  stopFocusInterval();
  cancelFocusNotification();
  state.focus.preset = presetKey;
  state.focus.phase = "focus";
  state.focus.timerEndsAt = null;
  focusTimerRemaining = null;
  saveFocusOutput("preset-changed");
  renderFocusTimer();
  renderSnapshotPreview();
  renderStatus();
}

function startFocusTimer() {
  captureForms();
  ensureFocusRemaining();
  if (focusTimerRunning) return;

  focusTimerRunning = true;
  state.focus.timerEndsAt = Date.now() + ensureFocusRemaining() * 1000;
  saveFocusOutput("running");
  scheduleFocusNotification(ensureFocusRemaining());
  renderFocusTimer();

  focusTimerIntervalId = window.setInterval(() => {
    focusTimerRemaining = Math.max(0, ensureFocusRemaining() - 1);

    if (focusTimerRemaining <= 0) {
      completeFocusPhase("timer-ended");
      return;
    }

    renderFocusTimer();
  }, 1000);
}

function syncFocusTimerFromClock() {
  if (!focusTimerRunning || !state.focus.timerEndsAt) return;

  const remaining = Math.ceil((state.focus.timerEndsAt - Date.now()) / 1000);
  focusTimerRemaining = Math.max(0, remaining);

  if (focusTimerRemaining <= 0) {
    completeFocusPhase("timer-ended");
    return;
  }

  renderFocusTimer();
}

function pauseFocusTimer() {
  captureForms();
  stopFocusInterval();
  cancelFocusNotification();
  state.focus.timerEndsAt = null;
  saveFocusOutput("paused");
  renderFocusTimer();
  renderSnapshotPreview();
  renderStatus();
}

function resetFocusTimer() {
  captureForms();
  stopFocusInterval();
  cancelFocusNotification();
  state.focus.phase = "focus";
  state.focus.timerEndsAt = null;
  focusTimerRemaining = null;
  saveFocusOutput("reset");
  renderFocusTimer();
  renderSnapshotPreview();
  renderStatus();
}

function completeFocusPhase(status = "marked-done") {
  captureForms();
  const completedFocusBlock = state.focus.phase === "focus";
  const completedPhase = state.focus.phase;
  stopFocusInterval();
  cancelFocusNotification();

  if (completedFocusBlock) {
    state.focus.completedRounds += 1;
    state.focus.lastCompletedAt = stampNow();
    state.focus.phase = "break";
    updateSessionMemory({
      worked: state.sessionMemory.worked || `${currentFocusPreset().label} focus block`,
      nextCue: state.focus.returnCue || state.sessionMemory.nextCue,
      focusRounds: state.focus.completedRounds,
      lastPanel: "focus"
    });
  } else {
    state.focus.phase = "focus";
  }

  notifyFocusTimerComplete(completedPhase);
  state.focus.timerEndsAt = null;
  focusTimerRemaining = focusDurationSeconds(state.focus.phase);
  saveFocusOutput(status);
  renderFocusTimer();
  renderSnapshotPreview();
  renderStatus();
  nudgeHaptic([8, 24, 8]);
}

function collectNoteBlocks() {
  return $$("#notesBlocks [data-note-block]").map((element) => ({
    id: element.dataset.noteBlock,
    type: normalizeNoteBlockType($(".note-block-type", element)?.value),
    text: String($(".note-block-text", element)?.value || "").trim()
  }));
}

function readCheckboxValues(containerId) {
  return $$(`#${containerId} input[type="checkbox"]:checked`).map((input) => input.value);
}

function captureForms() {
  const supportModeSelect = $("#supportModeSelect");

  state.checkin = {
    battery: state.checkin.battery || 3,
    timeAvailable: Number($("#timeAvailableSelect").value),
    supportMode: supportModeSelect ? supportModeSelect.value : supportModeFromState(),
    intent: $("#todayIntentInput").value.trim(),
    blockers: readCheckboxValues("blockerCheckboxes"),
    studyState: state.checkin.studyState || ""
  };

  state.planner = {
    task: $("#taskInput").value.trim(),
    dueDate: $("#taskDueInput").value,
    energy: $("#taskEnergySelect").value,
    blockers: readCheckboxValues("plannerBlockers")
  };

  state.calendar = {
    ...state.calendar,
    termType: $("#termTypeSelect").value,
    termName: $("#termNameInput").value.trim(),
    termStart: normalizeDateInput($("#termStartInput").value),
    termEnd: normalizeDateInput($("#termEndInput").value)
  };

  state.regulate = {
    signal: normalizeRegulationSignal($("#regulateSignalSelect").value),
    anchor: normalizeRegulationAnchor($("#regulateAnchorSelect").value),
    load: $("#regulateLoadInput").value.trim(),
    strategy: normalizeRegulationStrategy(state.regulate.strategy)
  };

  state.unpack = {
    prompt: $("#promptInput").value.trim(),
    verb: $("#verbSelect").value,
    dueDate: $("#promptDueInput").value,
    unclear: $("#unclearInput").value.trim(),
    deliverable: $("#deliverableSelect").value
  };

  state.notes = {
    title: $("#notesTitleInput").value.trim(),
    context: $("#notesContextInput").value.trim(),
    reviewGoal: $("#notesGoalInput").value.trim(),
    blocks: collectNoteBlocks()
  };

  state.focus = {
    ...state.focus,
    intention: $("#focusIntentionInput").value.trim(),
    returnCue: $("#focusReturnCueInput").value.trim()
  };

  state.finish.nextTime = $("#nextTimeInput").value.trim();
  state.finish.items = $$("[data-finish-index]").map((box) => box.checked);
  state.sessionMemory = {
    ...state.sessionMemory,
    worked: $("#workedInput").value.trim(),
    avoid: $("#avoidInput").value.trim(),
    nextCue: normalizeReturnCue($("#nextTimeInput").value.trim() || state.sessionMemory.nextCue)
  };

  saveState("checkin", state.checkin);
  saveState("planner", state.planner);
  saveState("calendar", state.calendar);
  saveState("regulate", state.regulate);
  saveState("unpack", state.unpack);
  saveState("notes", state.notes);
  saveState("focus", state.focus);
  saveState("finish", state.finish);
  saveState("sessionMemory", state.sessionMemory);
  saveState("supportContacts", normalizeSupportContacts(state.supportContacts));
  saveState("profileAnswers", state.profileAnswers);
  saveState("profileUi", state.profileUi);
}

function selectBattery(value) {
  state.checkin.battery = Number(value);
  saveState("checkin", state.checkin);

  $$("#batteryButtons .choice-pill").forEach((button) => {
    const isSelected = Number(button.dataset.battery) === Number(value);
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });
}

function setSupportState(nextState) {
  if (!SUPPORT_STATES[nextState]) return;
  state.settings.supportState = nextState;
  saveState("settings", state.settings);
  applySettings();

  if (state.outputs.route) {
    chooseTriageRoute(state.outputs.route.section, {
      studyState: state.outputs.route.studyState,
      timeAvailable: state.outputs.route.timeAvailable,
      battery: state.outputs.route.battery,
      blockers: state.outputs.route.blockers,
      intent: state.outputs.route.intent
    });
  } else {
    renderTodayEmpty();
  }
}

function applyStudyStatePreset(studyStateId, options = {}) {
  const preset = STUDY_STATES[studyStateId];
  if (!preset) return;

  captureForms();

  state.checkin = {
    ...state.checkin,
    studyState: studyStateId,
    battery: preset.battery,
    timeAvailable: preset.timeAvailable,
    supportMode: preset.supportState === "detailed" ? "structured" : "gentle",
    intent: state.checkin.intent || preset.intent,
    blockers: [...preset.blockers]
  };
  state.settings.supportState = preset.supportState;

  saveState("checkin", state.checkin);
  saveState("settings", state.settings);

  syncTodayInputs();
  applySettings();

  chooseTriageRoute(preset.route, {
    studyState: studyStateId,
    battery: preset.battery,
    timeAvailable: preset.timeAvailable,
    blockers: [...preset.blockers],
    intent: state.checkin.intent
  }, options);
}

function setTriageSelection(section) {
  $$("#triageButtons .path-card").forEach((button) => {
    const isSelected = button.dataset.routeTarget === section;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function setQuickRouteSelection(section) {
  $$("#quickRouteButtons .quick-route-button").forEach((button) => {
    const isSelected = button.dataset.routeTarget === section;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function renderTodayInlineFeedback(result) {
  const feedback = $("#todayInlineFeedback");
  if (!feedback) return;

  if (!result || !isPhoneLayout() || !todayInlineFeedbackVisible) {
    feedback.hidden = true;
    feedback.innerHTML = "";
    return;
  }

  const routeName = panelLabel(result.section);
  const studyStateMeta = STUDY_STATES[result.studyState];
  const title = result.section === "dashboard" ? "Gentle next step" : `${routeName} is ready`;
  const summary = result.section === "dashboard"
    ? result.lowEnergyMove
    : `Northstar will open ${routeName} so you can act instead of reading more setup copy here.`;
  const meta = studyStateMeta
    ? `${studyStateMeta.label} · ${friendlyTime(result.timeAvailable)} · Battery ${result.battery}`
    : `${friendlyTime(result.timeAvailable)} · Battery ${result.battery}`;

  feedback.hidden = false;
  feedback.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(summary)}</p>
    <p class="today-inline-meta">${escapeHtml(meta)}</p>
  `;
}

function routeButtonLabel(section) {
  return section === "dashboard" ? "Stay in Guide" : `Open ${panelLabel(section)}`;
}

function renderTodayEmpty() {
  const routeCard = $(".today-route-card");
  $("#todayRouteLabel").textContent = "Pick one start above";
  $("#todayOutput").classList.add("empty");
  $("#todayOutput").innerHTML = "Choose one quick start above. That is enough to begin.";
  $("#openRouteBtn").disabled = true;
  $("#openRouteBtn").textContent = "Open this space";
  if (routeCard) routeCard.hidden = isPhoneLayout();
  setQuickRouteSelection(null);
  setTriageSelection(null);
  setTodayInlineFeedbackVisible(false);
  renderTodayInlineFeedback(null);
  setTodayExpanded(false);
  renderStudyStateSelection();
}

function renderFirstMinuteGuide() {
  const guide = $("#firstMinuteGuide");
  if (!guide) return;

  const shouldShow = false;
  guide.hidden = !shouldShow;
  document.documentElement.dataset.firstMinuteGuide = shouldShow ? "on" : "off";
}

function focusQuickStartChoices() {
  const firstChoice = $("#quickRouteButtons .quick-route-button");
  if (!firstChoice) return;

  firstChoice.scrollIntoView({
    block: "center",
    behavior: state.settings.motion === "normal" ? "smooth" : "auto"
  });
  requestAnimationFrame(() => firstChoice.focus({ preventScroll: true }));
}

function returnToGuide() {
  closeMobileMoreSheet();
  setTodayExpanded(false);
  showPanel("dashboard");
  requestAnimationFrame(() => $("#quickRouteButtons .quick-route-button")?.focus?.({ preventScroll: true }));
}

function activateRouteChoice(button) {
  const target = button?.dataset?.routeTarget;
  if (!target || button.disabled) return;

  nudgeHaptic();

  if (target === "dashboard" || target === "pressure") {
    applyStudyStatePreset("overwhelmed", { autoOpen: true, revealInline: true });
    return;
  }

  if (!ROUTE_LIBRARY[target]) {
    showPanel(target);
    return;
  }

  chooseTriageRoute(target, {}, { autoOpen: true, revealInline: true });
}

function activateStudyStateChoice(button) {
  const studyState = button?.dataset?.studyState;
  if (!studyState || button.disabled) return;

  nudgeHaptic();
  applyStudyStatePreset(studyState, { autoOpen: true, revealInline: true });
}

function bindPrimaryDelegatedActions() {
  document.addEventListener("click", (event) => {
    const navButton = event.target.closest(".nav-link[data-panel-target]");
    if (navButton) {
      event.preventDefault();
      event.stopPropagation();
      showPanel(navButton.dataset.panelTarget);
      return;
    }

    const studyStateButton = event.target.closest("#studyStateButtons .state-card[data-study-state]");
    if (studyStateButton) {
      event.preventDefault();
      event.stopPropagation();
      activateStudyStateChoice(studyStateButton);
      return;
    }

    const routeButton = event.target.closest("#quickRouteButtons [data-route-target], #triageButtons [data-route-target]");
    if (routeButton) {
      event.preventDefault();
      event.stopPropagation();
      activateRouteChoice(routeButton);
    }
  }, true);
}

function renderTodayRoute(result) {
  const routeCard = $(".today-route-card");
  const routeName = panelLabel(result.section);
  const studyStateMeta = STUDY_STATES[result.studyState];
  const compactPhone = isPhoneLayout();

  if (routeCard) {
    routeCard.hidden = compactPhone;
  }

  renderTodayInlineFeedback(result);
  $("#todayRouteLabel").textContent = result.section === "dashboard"
    ? "Lower the pressure first"
    : `Best next space: ${routeName}`;

  $("#todayOutput").classList.remove("empty");
  $("#todayOutput").innerHTML = compactPhone ? `
    <div class="output-block">
      <h4>${escapeHtml(result.title)}</h4>
      <p>${escapeHtml(result.lowEnergyMove)}</p>
    </div>
  ` : `
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Open next</span>
        <strong>${escapeHtml(routeName)}</strong>
      </div>
      <div class="summary-cell">
        <span>Capacity</span>
        <strong>Battery ${escapeHtml(result.battery)} · ${escapeHtml(friendlyTime(result.timeAvailable))}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Start here</h4>
      <p>${escapeHtml(result.action)}</p>
      <p class="output-subtle">${escapeHtml(result.lowEnergyMove)}</p>
    </div>

    <div class="output-block">
      <h4>If it still feels too much</h4>
      <ul class="summary-list">
        ${toListItems([
          studyStateMeta ? studyStateMeta.routeNote : result.reason,
          result.followUp
        ])}
      </ul>
    </div>
  `;

  $("#openRouteBtn").disabled = false;
  $("#openRouteBtn").textContent = routeButtonLabel(result.section);
  setQuickRouteSelection(["dashboard", "regulate", "planner", "calendar", "focus", "unpack"].includes(result.section) ? result.section : null);
  setTriageSelection(result.section);
  renderStudyStateSelection();
}

function routeResultForSection(section, overrides = {}) {
  captureForms();

  const library = ROUTE_LIBRARY[section];
  const supportState = state.settings.supportState || "standard";
  const battery = overrides.battery ?? state.checkin.battery ?? 3;
  const timeAvailable = overrides.timeAvailable ?? Number(state.checkin.timeAvailable || 30);
  const blockers = overrides.blockers ?? state.checkin.blockers ?? [];
  const intent = overrides.intent ?? state.checkin.intent ?? "";
  const studyState = overrides.studyState ?? state.checkin.studyState ?? "";
  const supportMode = supportModeFromState();

  return {
    section,
    title: library.title,
    reason: library.reason,
    action: library.action,
    followUp: library.followUp,
    lowEnergyMove:
      supportState === "low"
        ? "Keep the thread alive only. A setup action, one sentence, or one question is enough for now."
        : timeAvailable <= 5 || battery <= 2
          ? "If this still feels heavy, shrink it again. Opening the file or naming the next step still counts."
          : "If the task swells again, shrink it back to one visible action before doing more.",
    supportMode,
    supportState,
    timeAvailable,
    battery,
    blockers,
    intent,
    studyState
  };
}

function openRouteMobileResult(result) {
  const isPressureRoute = result.section === "dashboard";
  const isRegulationRoute = result.section === "regulate";

  openMobileResult({
    sourcePanel: "dashboard",
    resultType: result.section,
    kicker: isPressureRoute ? "Pressure lowered" : isRegulationRoute ? "Not ready yet" : "Route ready",
    title: isPressureRoute ? "Do this first" : isRegulationRoute ? "Start by settling" : result.title,
      summary: isPressureRoute
        ? "One setup action, one sentence, or one question is enough."
        : isRegulationRoute
        ? "Lower the pressure before starting."
      : result.lowEnergyMove || result.action,
    items: isPressureRoute
      ? [
        "Choose one tiny action that lowers pressure.",
        "If it is still foggy, move to Unpack."
      ]
      : isRegulationRoute
        ? [
          "Pick what feels closest.",
          "Try one body-first step for 30 seconds.",
          "Move into work only when it feels possible."
        ]
      : [
        result.action,
        result.followUp,
        result.reason
      ],
    primaryLabel: isPressureRoute ? "Back to Home" : routeButtonLabel(result.section),
    primaryTarget: isPressureRoute ? "dashboard" : result.section,
    copyText: [
      result.title,
      "",
      result.action,
      result.followUp,
      "",
      result.reason
    ].join("\n")
  });
}

function chooseTriageRoute(section, overrides = {}, options = {}) {
  const result = routeResultForSection(section, overrides);
  if (result.section === "regulate" && options.autoOpen) {
    const signal = overrides.studyState === "avoiding" ? "avoiding" : "overwhelmed";
    setRegulationSignal(signal, { feedback: false, chooseDefaultStrategy: true });
  }
  setTodayInlineFeedbackVisible(Boolean(options.revealInline && isPhoneLayout() && result.section === "dashboard"));
  state.outputs.route = result;
  saveState("outputs", state.outputs);
  renderTodayRoute(result);
  renderSnapshotPreview();
  renderStatus();

  if (options.autoOpen) {
    if (result.section === "dashboard") {
      setTodayExpanded(false);
      openRouteMobileResult(result);
      return;
    }

    showPanel(result.section);
  }
}

function detectVerb(prompt) {
  const lower = prompt.toLowerCase();
  return Object.keys(TASK_VERBS).find((key) => key !== "auto" && lower.includes(key)) || "discuss";
}

function recommendRoute(options = {}) {
  captureForms();

  const { battery, timeAvailable, blockers, intent } = state.checkin;
  const supportMode = supportModeFromState();
  const supportState = state.settings.supportState || "standard";
  const blockerSet = new Set(blockers);
  const studyState = state.checkin.studyState || "";
  const studyStateMeta = STUDY_STATES[studyState];
  let section = "planner";

  if (studyStateMeta) {
    section = studyStateMeta.route;
  } else if (supportState === "low") {
    if (blockerSet.has("unclear")) {
      section = "unpack";
    } else if (blockerSet.has("overwhelmed") || blockerSet.has("sensory") || blockerSet.has("energy")) {
      section = "regulate";
    } else if (/calendar|trimester|semester|term|due date|deadline|assessment schedule/i.test(intent)) {
      section = "calendar";
    } else if (blockerSet.has("time") || /timer|pomodoro|focus|time.?box|timebox/i.test(intent)) {
      section = "focus";
    } else if (blockerSet.has("memory") || /read|lecture|notes|article|chapter/i.test(intent)) {
      section = "notes";
    } else {
      section = "dashboard";
    }
  } else if (timeAvailable <= 5 || battery <= 2 || blockerSet.has("energy") || blockerSet.has("sensory")) {
    section = "regulate";
  } else if (blockerSet.has("unclear")) {
    section = "unpack";
  } else if (blockerSet.has("overwhelmed")) {
    section = "regulate";
  } else if (/calendar|trimester|semester|term|due date|deadline|assessment schedule/i.test(intent)) {
    section = "calendar";
  } else if (blockerSet.has("memory")) {
    section = "notes";
  } else if (blockerSet.has("time") || /timer|pomodoro|focus|time.?box|timebox/i.test(intent)) {
    section = "focus";
  } else if (blockerSet.has("starting") || blockerSet.has("perfectionism") || blockerSet.has("overwhelmed")) {
    section = "planner";
  } else if (/read|lecture|notes|article|chapter/i.test(intent)) {
    section = "notes";
  }

  const library = ROUTE_LIBRARY[section];
  const lowEnergyMove =
    timeAvailable <= 5 || battery <= 2
      ? "Open the task, name the file, or write one question. Keeping the thread alive counts."
      : "Set up the task environment first, then do one visible action only.";

  const result = {
    section,
    title: library.title,
    reason: library.reason,
    action: library.action,
    followUp: library.followUp,
    lowEnergyMove,
    supportMode,
    supportState,
    timeAvailable,
    battery,
    blockers,
    studyState
  };

  setTodayInlineFeedbackVisible(Boolean(options.revealInline && isPhoneLayout() && result.section === "dashboard"));
  state.outputs.route = result;
  saveState("outputs", state.outputs);
  renderTodayRoute(result);
  renderSnapshotPreview();
  renderStatus();

  if (options.autoOpen && result.section !== "dashboard") {
    showPanel(result.section);
  } else if (options.autoOpen && shouldUseMobileResult()) {
    openRouteMobileResult(result);
  }
}

function inferTaskType(task) {
  const lower = task.toLowerCase();
  if (/essay|report|paragraph|reflection|draft|paper/.test(lower)) return "writing";
  if (/read|chapter|article|textbook|journal/.test(lower)) return "reading";
  if (/email|message|reply|contact|lecturer|tutor/.test(lower)) return "communication";
  if (/presentation|slides|powerpoint|keynote/.test(lower)) return "presentation";
  if (/research|find|source|reference|literature/.test(lower)) return "research";
  return "general";
}

function buildPlannerResult() {
  captureForms();

  const { task, dueDate, energy, blockers } = state.planner;
  if (!task) return null;

  const type = inferTaskType(task);
  const dueLabel = formatRelativeDue(dueDate);

  const templates = {
    writing: {
      firstStep: "Open the document and paste the exact task at the top.",
      steps: [
        "Write one rough sentence about the point you think you want to make.",
        "Turn that into three bullet points or headings.",
        "Draft only the opening section or first paragraph.",
        "Mark one thing you need to check later instead of stopping to solve everything now."
      ]
    },
    reading: {
      firstStep: "Open the reading and look only at the title, headings, and abstract or first paragraph.",
      steps: [
        "Write one line for what the text seems to be about.",
        "Capture three key ideas, one per line.",
        "Write down one confusion instead of trying to solve it immediately.",
        "Stop once you have a review trail you can return to."
      ]
    },
    communication: {
      firstStep: "Open the email and write the greeting plus one sentence saying why you are writing.",
      steps: [
        "Add the one thing you need or need clarified.",
        "Keep the message plain and short.",
        "Check the tone once, not five times.",
        "Add a subject line and send or draft it."
      ]
    },
    presentation: {
      firstStep: "Open the slide deck and create the title slide.",
      steps: [
        "List the 3 main points before styling anything.",
        "Create one slide per main point.",
        "Add evidence or examples under each point.",
        "Leave visual polishing until the structure exists."
      ]
    },
    research: {
      firstStep: "Open one tab and search for one source type only.",
      steps: [
        "Save the first promising source with a clear label.",
        "Write what question that source may help answer.",
        "Find one more source instead of trying to finish the literature search.",
        "Capture where you stopped so re-entry is easy."
      ]
    },
    general: {
      firstStep: "Open the task materials and make the task visible.",
      steps: [
        "Write the smallest meaningful action you can do next.",
        "Do that action before planning the rest.",
        "Capture what comes after while it is fresh.",
        "Stop at a clean checkpoint, not at collapse."
      ]
    }
  };

  const selected = templates[type];
  const blockerSet = new Set(blockers);
  const successDefinition =
    energy === "low"
      ? "Success today means keeping the thread alive, not finishing the whole task."
      : blockerSet.has("perfectionism")
        ? "Success today means producing a rough version you can return to later."
        : "Success today means finishing the first meaningful chunk and leaving a clear re-entry note.";

  const stuckAgain = [];
  if (blockerSet.has("unclear")) stuckAgain.push("Move into Unpack and translate the task before you continue.");
  if (blockerSet.has("perfectionism")) stuckAgain.push("Switch from polished writing to ugly bullet points.");
  if (blockerSet.has("overwhelmed")) stuckAgain.push("Shrink the target to the setup action only.");
  if (blockerSet.has("memory")) stuckAgain.push("Leave yourself a one-line breadcrumb before changing tasks.");
  if (!stuckAgain.length) stuckAgain.push("Return to the first step and make it smaller.");

  const result = {
    task,
    type,
    dueLabel,
    firstStep: selected.firstStep,
    steps: selected.steps,
    successDefinition,
    stuckAgain
  };

  state.outputs.planner = result;
  saveState("outputs", state.outputs);
  return result;
}

function renderPlanner({ openResult = true } = {}) {
  const result = buildPlannerResult();
  if (!result) return;

  $("#plannerOutput").classList.remove("empty");
  $("#plannerOutput").innerHTML = `
    <div class="output-block">
      <h4>Start here</h4>
      <p>${escapeHtml(result.firstStep)}</p>
      <p class="output-subtle">${escapeHtml(result.successDefinition)}</p>
    </div>

    <div class="output-block">
      <h4>Then do these</h4>
      <ul class="summary-list">${toListItems(result.steps.slice(0, 3))}</ul>
    </div>

    <div class="output-block">
      <h4>If you get stuck</h4>
      <p>${escapeHtml(result.stuckAgain[0])}</p>
    </div>
  `;

  renderSnapshotPreview();

  if (openResult) {
    openMobileResult({
      sourcePanel: "planner",
      resultType: "planner",
      kicker: "Plan ready",
      title: "Start with this",
      summary: result.firstStep,
      items: [
        result.steps[0],
        result.successDefinition,
        result.stuckAgain[0]
      ],
      primaryLabel: "Back to Home",
      primaryTarget: "dashboard",
      copyText: [
        `Task: ${result.task}`,
        `First step: ${result.firstStep}`,
        "Micro-plan:",
        ...result.steps.map((step, index) => `${index + 1}. ${step}`),
        `Enough for today: ${result.successDefinition}`
      ].join("\n")
    });
  }
}

function parseCalendarDate(value) {
  const date = normalizeDateInput(value);
  if (!date) return null;
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function calendarDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

function startOfCalendarWeek(date) {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
}

function addCalendarDays(date, count) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + count);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function addCalendarMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1, 12, 0, 0, 0);
}

function formatCalendarMonth(date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatCalendarDate(value) {
  const date = parseCalendarDate(value);
  if (!date) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);
}

function daysUntil(value) {
  const date = parseCalendarDate(value);
  if (!date) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86400000);
}

function calendarDuePhrase(value) {
  const distance = daysUntil(value);
  if (distance === null) return "No due date yet";
  if (distance === 0) return "Due today";
  if (distance === 1) return "Due tomorrow";
  if (distance === -1) return "Overdue by 1 day";
  if (distance < 0) return `Overdue by ${Math.abs(distance)} days`;
  return `Due in ${distance} days`;
}

function calendarTermRange(items = state.calendar.items) {
  const termStart = parseCalendarDate(state.calendar.termStart);
  const termEnd = parseCalendarDate(state.calendar.termEnd);
  const dueDates = items
    .map((item) => parseCalendarDate(item.dueDate))
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime());

  if (termStart && termEnd && termStart <= termEnd) {
    return { start: termStart, end: termEnd, isStarter: false };
  }

  if (termStart) {
    return { start: termStart, end: addCalendarDays(termStart, 90), isStarter: false };
  }

  if (termEnd) {
    return { start: addCalendarDays(termEnd, -90), end: termEnd, isStarter: false };
  }

  if (dueDates.length) {
    const start = startOfCalendarWeek(dueDates[0]);
    return { start, end: addCalendarDays(start, 90), isStarter: true };
  }

  const start = startOfCalendarWeek(new Date());
  return { start, end: addCalendarDays(start, 90), isStarter: true };
}

function calendarRangeWeeks(range) {
  const inclusiveDays = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000) + 1);
  return Math.max(1, Math.ceil(inclusiveDays / 7));
}

function calendarPeriodType() {
  return CALENDAR_PERIOD_TYPES[state.calendar.termType] || CALENDAR_PERIOD_TYPES.trimester;
}

function sortCalendarItems(items = state.calendar.items) {
  return [...items].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (a.status !== "done" && b.status === "done") return -1;
    const aTime = parseCalendarDate(a.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = parseCalendarDate(b.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (aTime !== bTime) return aTime - bTime;
    return a.title.localeCompare(b.title);
  });
}

function calendarTermLabel() {
  const name = state.calendar.termName || calendarPeriodType().defaultName;
  const start = state.calendar.termStart ? formatCalendarDate(state.calendar.termStart) : "";
  const end = state.calendar.termEnd ? formatCalendarDate(state.calendar.termEnd) : "";
  if (start && end) return `${name} · ${start} to ${end}`;
  return name;
}

function hasCalendarContent() {
  return Boolean(
    state.calendar.termName ||
    state.calendar.termStart ||
    state.calendar.termEnd ||
    state.calendar.items.length
  );
}

function saveCalendar() {
  state.calendar = normalizeCalendarState(state.calendar);
  saveState("calendar", state.calendar);
}

function updateCalendarTermInputs() {
  const termTypeSelect = $("#termTypeSelect");
  const termNameInput = $("#termNameInput");
  const termStartInput = $("#termStartInput");
  const termEndInput = $("#termEndInput");
  if (termTypeSelect) termTypeSelect.value = state.calendar.termType;
  if (termNameInput) termNameInput.value = state.calendar.termName;
  if (termStartInput) termStartInput.value = state.calendar.termStart;
  if (termEndInput) termEndInput.value = state.calendar.termEnd;
}

function setCalendarTermDates(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) return;

  state.calendar = normalizeCalendarState({
    ...state.calendar,
    termStart: calendarDateKey(start),
    termEnd: calendarDateKey(end)
  });
  updateCalendarTermInputs();
  saveCalendar();
  renderCalendar();
  renderSnapshotPreview();
  renderStatus();
}

function setCalendarToThirteenWeeksFrom(startDate) {
  const start = startDate instanceof Date && !Number.isNaN(startDate.getTime())
    ? startDate
    : calendarTermRange().start;
  setCalendarTermDates(start, addCalendarDays(start, 90));
}

function shiftCalendarTerm(direction) {
  const range = calendarTermRange();
  const weekCount = Math.max(calendarRangeWeeks(range), 13);
  const start = addCalendarDays(range.start, direction * weekCount * 7);
  setCalendarToThirteenWeeksFrom(start);
}

function buildCalendarResult() {
  const sorted = sortCalendarItems();
  const active = sorted.filter((item) => item.status !== "done");
  const done = sorted.filter((item) => item.status === "done");
  const nextDue = active[0] || null;

  const result = {
    termType: state.calendar.termType,
    termName: state.calendar.termName,
    termLabel: calendarTermLabel(),
    termStart: state.calendar.termStart,
    termEnd: state.calendar.termEnd,
    total: state.calendar.items.length,
    activeCount: active.length,
    doneCount: done.length,
    nextDue,
    upcoming: active.slice(0, 5),
    updatedAt: stampNow()
  };

  if (hasCalendarContent()) {
    state.outputs.calendar = result;
  } else {
    delete state.outputs.calendar;
  }
  saveState("outputs", state.outputs);
  return result;
}

function calendarSummaryText() {
  const sorted = sortCalendarItems();
  const lines = [
    "NORTHSTAR STUDY PERIOD PLAN",
    "",
    `${calendarPeriodType().label}: ${calendarTermLabel()}`,
    `Saved due dates: ${state.calendar.items.length}`,
    ""
  ];

  if (!sorted.length) {
    lines.push("No due dates saved yet.");
  } else {
    lines.push("Due dates:");
    sorted.forEach((item) => {
      lines.push(
        `- ${formatCalendarDate(item.dueDate)}: ${item.title}${item.course ? ` (${item.course})` : ""} · ${CALENDAR_ITEM_TYPES[item.type]} · ${CALENDAR_STATUS_LABELS[item.status]}`
      );
      if (item.firstStep) lines.push(`  First move: ${item.firstStep}`);
      if (item.notes) lines.push(`  Note: ${item.notes}`);
    });
  }

  return lines.join("\n");
}

function clearCalendarForm({ keepStatus = false } = {}) {
  $("#calendarEditId").value = "";
  $("#calendarTitleInput").value = "";
  $("#calendarCourseInput").value = "";
  $("#calendarDueInput").value = "";
  $("#calendarTypeSelect").value = "assignment";
  $("#calendarWeightInput").value = "";
  $("#calendarStatusSelect").value = "not-started";
  $("#calendarFirstStepInput").value = "";
  $("#calendarNotesInput").value = "";
  $("#saveCalendarItemBtn").textContent = "Save due date";
  if (!keepStatus) $("#calendarSaveStatus").textContent = "";
}

function readCalendarItemForm() {
  const title = $("#calendarTitleInput").value.trim();
  const dueDate = normalizeDateInput($("#calendarDueInput").value);
  if (!title || !dueDate) {
    $("#calendarSaveStatus").textContent = !title
      ? "Add what is due first."
      : "Add the due date, then save.";
    return null;
  }

  return normalizeCalendarItem({
    id: $("#calendarEditId").value || calendarItemId(),
    title,
    course: $("#calendarCourseInput").value.trim(),
    dueDate,
    type: $("#calendarTypeSelect").value,
    weight: $("#calendarWeightInput").value.trim(),
    status: $("#calendarStatusSelect").value,
    firstStep: $("#calendarFirstStepInput").value.trim(),
    notes: $("#calendarNotesInput").value.trim()
  });
}

function saveCalendarItem({ openResult = true } = {}) {
  captureForms();
  const formItem = readCalendarItemForm();
  if (!formItem) return;

  const existingIndex = state.calendar.items.findIndex((item) => item.id === formItem.id);
  const previous = existingIndex === -1 ? null : state.calendar.items[existingIndex];
  const item = normalizeCalendarItem({
    ...previous,
    ...formItem,
    createdAt: previous?.createdAt || stampNow(),
    updatedAt: stampNow()
  });

  if (existingIndex === -1) {
    state.calendar.items.push(item);
  } else {
    state.calendar.items[existingIndex] = item;
  }

  saveCalendar();
  clearCalendarForm({ keepStatus: true });
  $("#calendarSaveStatus").textContent = existingIndex === -1
    ? "Saved privately on this device."
    : "Updated privately on this device.";
  const result = renderCalendar();
  renderSnapshotPreview();
  renderStatus();

  if (openResult) {
    openMobileResult({
      sourcePanel: "calendar",
      resultType: "calendar",
      kicker: "Due date saved",
      title: "You made it visible",
      summary: `${item.title} · ${calendarDuePhrase(item.dueDate)}`,
      items: [
        `${formatCalendarDate(item.dueDate)}: ${item.title}`,
        item.firstStep || "First move: open the brief and name the next tiny action.",
        result?.nextDue ? `Next visible date: ${result.nextDue.title}` : "Add another date only if it helps."
      ],
      primaryLabel: "Back to Calendar",
      primaryTarget: "calendar",
      copyText: calendarSummaryText()
    });
  }
}

function editCalendarItem(itemId) {
  const item = state.calendar.items.find((calendarItem) => calendarItem.id === itemId);
  if (!item) return;

  $("#calendarEditId").value = item.id;
  $("#calendarTitleInput").value = item.title;
  $("#calendarCourseInput").value = item.course;
  $("#calendarDueInput").value = item.dueDate;
  $("#calendarTypeSelect").value = item.type;
  $("#calendarWeightInput").value = item.weight;
  $("#calendarStatusSelect").value = item.status;
  $("#calendarFirstStepInput").value = item.firstStep;
  $("#calendarNotesInput").value = item.notes;
  $("#saveCalendarItemBtn").textContent = "Save changes";
  $("#calendarSaveStatus").textContent = "Editing this due date.";
  $("#calendarTitleInput").focus({ preventScroll: true });
  $("#panel-calendar .calendar-start-card").scrollIntoView({
    block: "start",
    behavior: state.settings.motion === "normal" ? "smooth" : "auto"
  });
}

function removeCalendarItem(itemId) {
  state.calendar.items = state.calendar.items.filter((item) => item.id !== itemId);
  saveCalendar();
  renderCalendar();
  renderSnapshotPreview();
  renderStatus();
}

function toggleCalendarDone(itemId) {
  const item = state.calendar.items.find((calendarItem) => calendarItem.id === itemId);
  if (!item) return;
  item.status = item.status === "done" ? "not-started" : "done";
  item.updatedAt = stampNow();
  saveCalendar();
  renderCalendar();
  renderSnapshotPreview();
  renderStatus();
}

function renderCalendarTimeline() {
  const timeline = $("#calendarTimeline");
  if (!timeline) return;

  const { start, end } = calendarTermRange();

  const weeks = [];
  const cursor = new Date(start);
  let guard = 0;
  while (cursor <= end && guard < 26) {
    const weekStart = new Date(cursor);
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weeks.push({ weekStart, weekEnd: weekEnd > end ? new Date(end) : weekEnd });
    cursor.setDate(cursor.getDate() + 7);
    guard += 1;
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const items = state.calendar.items.filter((item) => item.dueDate);

  timeline.innerHTML = weeks.map((week, index) => {
    const weekItems = items.filter((item) => {
      const due = parseCalendarDate(item.dueDate);
      return due && due >= week.weekStart && due <= week.weekEnd;
    });
    const isNow = today >= week.weekStart && today <= week.weekEnd;
    return `
      <article class="calendar-week${isNow ? " is-now" : ""}${weekItems.length ? " has-items" : ""}">
        <span class="calendar-week-label">Week ${index + 1}</span>
        <strong>${escapeHtml(formatCalendarDate(week.weekStart))}</strong>
        <span>${escapeHtml(weekItems.length ? `${weekItems.length} due` : "Clear")}</span>
      </article>
    `;
  }).join("");
}

function calendarVisualRange(items) {
  const range = calendarTermRange(items);
  return {
    ...range,
    monthStart: monthStart(range.start),
    monthEnd: monthStart(range.end)
  };
}

function calendarItemsByDate(items) {
  return items.reduce((map, item) => {
    const key = item.dueDate;
    if (!key) return map;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
    return map;
  }, new Map());
}

function renderCalendarBoard() {
  const board = $("#calendarBoard");
  if (!board) return;

  const items = sortCalendarItems().filter((item) => item.dueDate);
  const range = calendarVisualRange(items);
  const byDate = calendarItemsByDate(items);
  const todayKey = calendarDateKey(new Date());
  const months = [];
  let cursor = range.monthStart;
  let guard = 0;

  while (cursor <= range.monthEnd && guard < 8) {
    months.push(cursor);
    cursor = addCalendarMonths(cursor, 1);
    guard += 1;
  }

  const summary = $("#calendarBoardSummary");
  const mapEyebrow = $("#calendarMapEyebrow");
  const periodType = calendarPeriodType();
  if (mapEyebrow) {
    mapEyebrow.textContent = `${periodType.label} map`;
  }
  if (summary) {
    const starter = range.isStarter ? `Starter ${periodType.lower} map` : `${periodType.label} map`;
    summary.textContent = `${starter}: ${calendarRangeWeeks(range)} weeks, ${formatCalendarDate(calendarDateKey(range.start))} to ${formatCalendarDate(calendarDateKey(range.end))}.`;
  }

  board.innerHTML = months.map((monthDate) => {
    const firstDay = monthStart(monthDate);
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0, 12).getDate();
    const leadingBlanks = (firstDay.getDay() + 6) % 7;
    const monthItems = items.filter((item) => {
      const due = parseCalendarDate(item.dueDate);
      return due && due.getFullYear() === firstDay.getFullYear() && due.getMonth() === firstDay.getMonth();
    });

    const cells = [
      ...Array.from({ length: leadingBlanks }, (_, index) => `<span class="calendar-day is-blank" aria-hidden="true" data-blank="${index}"></span>`),
      ...Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), dayIndex + 1, 12);
        const key = calendarDateKey(date);
        const dayItems = byDate.get(key) || [];
        const visibleItems = dayItems.slice(0, 3);
        const isOutsideTerm = date < range.start || date > range.end;
        return `
          <article class="calendar-day${key === todayKey ? " is-today" : ""}${dayItems.length ? " has-due" : ""}${isOutsideTerm ? " is-outside-term" : ""}" data-calendar-day="${key}">
            <div class="calendar-day-top">
              <span class="calendar-day-number">${dayIndex + 1}</span>
              <button class="calendar-day-add" type="button" data-calendar-day="${key}" aria-label="Add due date on ${escapeHtml(formatCalendarDate(key))}">+</button>
            </div>
            <div class="calendar-day-items">
              ${visibleItems.map((item) => `
                <button
                  class="calendar-due-chip${item.status === "done" ? " is-done" : ""}"
                  type="button"
                  data-calendar-edit="${escapeHtml(item.id)}"
                  data-calendar-type="${escapeHtml(item.type)}"
                  title="${escapeHtml(`${item.title} · ${CALENDAR_ITEM_TYPES[item.type]}`)}"
                >
                  <span>${escapeHtml(item.title)}</span>
                </button>
              `).join("")}
              ${dayItems.length > visibleItems.length ? `<span class="calendar-more-chip">+${dayItems.length - visibleItems.length} more</span>` : ""}
            </div>
          </article>
        `;
      })
    ];

    return `
      <section class="calendar-month" aria-label="${escapeHtml(formatCalendarMonth(firstDay))}">
        <div class="calendar-month-head">
          <h4>${escapeHtml(formatCalendarMonth(firstDay))}</h4>
          <span>${escapeHtml(monthItems.length ? `${monthItems.length} due` : "No due dates")}</span>
        </div>
        <div class="calendar-weekdays" aria-hidden="true">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div class="calendar-month-grid">
          ${cells.join("")}
        </div>
      </section>
    `;
  }).join("");
}

function startCalendarItemOnDate(dateKey) {
  const dueDate = normalizeDateInput(dateKey);
  if (!dueDate) return;

  $("#calendarDueInput").value = dueDate;
  $("#calendarSaveStatus").textContent = `Date chosen: ${formatCalendarDate(dueDate)}. Add what is due, then save.`;

  if (!$("#calendarTitleInput").value.trim()) {
    $("#calendarTitleInput").focus({ preventScroll: true });
  }

  $("#panel-calendar .calendar-start-card").scrollIntoView({
    block: "start",
    behavior: state.settings.motion === "normal" ? "smooth" : "auto"
  });
}

function renderCalendar() {
  saveCalendar();
  renderCalendarTimeline();
  renderCalendarBoard();

  const output = $("#calendarOutput");
  if (!output) return null;
  const result = buildCalendarResult();
  const sorted = sortCalendarItems();

  if (!sorted.length) {
    output.classList.add("empty");
    output.innerHTML = "Add one due date. Northstar will build a calm term map here.";
    return result;
  }

  const nextDue = result.nextDue;
  output.classList.remove("empty");
  output.innerHTML = `
    ${nextDue ? `
      <div class="output-block calendar-next-block">
        <h4>Next visible date</h4>
        <p><strong>${escapeHtml(nextDue.title)}</strong></p>
        <p>${escapeHtml(formatCalendarDate(nextDue.dueDate))} · ${escapeHtml(calendarDuePhrase(nextDue.dueDate))}</p>
        <p class="output-subtle">${escapeHtml(nextDue.firstStep || "First move: open the brief and choose one small starting action.")}</p>
      </div>
    ` : `
      <div class="output-block calendar-next-block">
        <h4>Nothing active is due</h4>
        <p>All saved items are marked done.</p>
      </div>
    `}

    <div class="calendar-item-list" aria-label="Saved due dates">
      ${sorted.map((item) => `
        <article class="calendar-item-card${item.status === "done" ? " is-done" : ""}">
          <div class="calendar-item-main">
            <span class="calendar-item-kicker">${escapeHtml(CALENDAR_ITEM_TYPES[item.type])}${item.weight ? ` · ${escapeHtml(item.weight)}` : ""}</span>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(formatCalendarDate(item.dueDate))} · ${escapeHtml(calendarDuePhrase(item.dueDate))}</p>
            ${item.course || item.firstStep || item.notes ? `
              <p class="calendar-item-detail">${escapeHtml([
                item.course ? item.course : "",
                item.firstStep ? `First move: ${item.firstStep}` : "",
                item.notes
              ].filter(Boolean).join(" · "))}</p>
            ` : ""}
          </div>
          <div class="calendar-item-actions">
            <button class="button subtle" type="button" data-calendar-toggle="${escapeHtml(item.id)}">${item.status === "done" ? "Mark active" : "Done"}</button>
            <button class="button subtle" type="button" data-calendar-edit="${escapeHtml(item.id)}">Edit</button>
            <button class="button subtle" type="button" data-calendar-remove="${escapeHtml(item.id)}">Remove</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  return result;
}

function buildUnpackResult() {
  captureForms();

  const { prompt, verb, dueDate, unclear, deliverable } = state.unpack;
  if (!prompt) return null;

  const resolvedVerb = verb === "auto" ? detectVerb(prompt) : verb;
  const verbData = TASK_VERBS[resolvedVerb] || TASK_VERBS.discuss;
  const dueLabel = formatRelativeDue(dueDate);
  const deliverableGuidance = getDeliverableGuidance(deliverable);

  const openQuestions = unclear
    ? [
        `What does "${unclear}" mean in the context of this task?`,
        "What would a good-enough example of this look like?",
        "What should I prioritise first so I do not overwork the wrong part?"
      ]
    : [
        "What is the marker likely looking for most strongly here?",
        "What evidence or examples will do the heaviest lifting?",
        "What is the smallest useful starting point?"
      ];

  const result = {
    prompt,
    verb: resolvedVerb,
    dueLabel,
    meaning: verbData.meaning,
    deliverable,
    deliverableLabel: deliverableGuidance.label,
    essentials: deliverableGuidance.essentials,
    openQuestions,
    nextMoves: [
      "Highlight the command word and write its plain-language meaning in your own words.",
      "List the 2 or 3 ideas or sections the task probably needs.",
      "Move into Plan and build a first-step plan for the earliest section."
    ]
  };

  state.outputs.unpack = result;
  saveState("outputs", state.outputs);
  return result;
}

function renderUnpack({ openResult = true } = {}) {
  const result = buildUnpackResult();
  if (!result) return;

  $("#unpackOutput").classList.remove("empty");
  $("#unpackOutput").innerHTML = `
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Command word</span>
        <strong>${escapeHtml(TASK_VERBS[result.verb].label)}</strong>
      </div>
      <div class="summary-cell">
        <span>Timeline</span>
        <strong>${escapeHtml(result.dueLabel)}</strong>
      </div>
      <div class="summary-cell">
        <span>Task kind</span>
        <strong>${escapeHtml(result.deliverableLabel)}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>In plain language</h4>
      <p>${escapeHtml(result.meaning)}</p>
    </div>

    <div class="output-block">
      <h4>This task may need</h4>
      <ul class="summary-list">${toListItems(result.essentials.slice(0, 3))}</ul>
    </div>

    <div class="output-block">
      <h4>Ask if unclear</h4>
      <p>${escapeHtml(result.openQuestions[0])}</p>
    </div>

    <div class="output-block">
      <h4>Next</h4>
      <p>${escapeHtml(result.nextMoves[2])}</p>
    </div>
  `;

  renderSnapshotPreview();

  if (openResult) {
    openMobileResult({
      sourcePanel: "unpack",
      resultType: "unpack",
      kicker: "Brief translated",
      title: "This is what the task wants",
      summary: result.meaning,
      items: [
        `Task kind: ${result.deliverableLabel}`,
        `May need: ${result.essentials[0]}`,
        `Ask: ${result.openQuestions[0]}`,
        result.nextMoves[2]
      ],
      primaryLabel: "Make first step",
      primaryTarget: "planner",
      copyText: [
        `Command word: ${TASK_VERBS[result.verb].label}`,
        `Task kind: ${result.deliverableLabel}`,
        `Meaning: ${result.meaning}`,
        "What the task may need:",
        ...result.essentials.map((item) => `- ${item}`),
        "Questions:",
        ...result.openQuestions.map((item) => `- ${item}`)
      ].join("\n")
    });
  }
}

function getDeliverableGuidance(value) {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();
  const direct = DELIVERABLE_GUIDANCE[raw] || DELIVERABLE_GUIDANCE[lower];
  if (direct) return direct;

  const matchedKey = DELIVERABLE_MATCH_ORDER.find((key) => DELIVERABLE_GUIDANCE[key].pattern.test(lower));
  if (matchedKey) {
    const matched = DELIVERABLE_GUIDANCE[matchedKey];
    return {
      ...matched,
      label: raw || matched.label
    };
  }

  return {
    label: raw || "Something else",
    essentials: [
      "The final thing you need to hand in or prepare",
      "The marking criteria, instructions, or example you can compare it with",
      "The smallest useful version you can make first"
    ]
  };
}

function splitLines(text) {
  return String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function cueFromIdea(idea) {
  const trimmed = idea.replace(/[.?!]+$/, "");
  if (/^how /i.test(trimmed) || /^why /i.test(trimmed)) return trimmed + "?";
  return `What is important about: ${trimmed}?`;
}

function noteBlockMeta(type) {
  return NOTE_BLOCK_TYPES[normalizeNoteBlockType(type)];
}

function ensureNoteBlocks() {
  if (state.notes.blocks.length) return;
  state.notes.blocks = seedNoteBlocks();
  saveState("notes", state.notes);
}

function renderNoteBlocks() {
  ensureNoteBlocks();

  $("#notesBlocks").innerHTML = state.notes.blocks.map((block, index) => {
    const meta = noteBlockMeta(block.type);
    const rows = block.type === "quote" ? 4 : 3;

    return `
      <article class="note-block" data-note-block="${escapeHtml(block.id)}">
        <div class="note-block-head">
          <div class="note-block-copy">
            <p class="eyebrow">Block ${index + 1}</p>
            <strong>${escapeHtml(meta.label)}</strong>
          </div>
          <button class="button subtle note-block-remove" type="button" data-note-remove="${escapeHtml(block.id)}">Remove</button>
        </div>

        <label class="field">
          <span>Block type</span>
          <select class="note-block-type">
            ${Object.entries(NOTE_BLOCK_TYPES)
              .map(([type, option]) => `
                <option value="${escapeHtml(type)}" ${block.type === type ? "selected" : ""}>${escapeHtml(option.label)}</option>
              `)
              .join("")}
          </select>
        </label>

        <label class="field">
          <span>Capture</span>
          <textarea class="note-block-text" rows="${rows}" placeholder="${escapeHtml(meta.placeholder)}">${escapeHtml(block.text)}</textarea>
        </label>
      </article>
    `;
  }).join("");
}

function addNoteBlock(type = "idea", text = "") {
  captureForms();
  nudgeHaptic(5);
  const nextBlock = createNoteBlock(type, text);
  state.notes.blocks = [...state.notes.blocks, nextBlock];
  saveState("notes", state.notes);
  renderNoteBlocks();
  renderStatus();

  const field = $(`[data-note-block="${nextBlock.id}"] .note-block-text`);
  field?.focus();
}

function removeNoteBlock(blockId) {
  captureForms();
  const remaining = state.notes.blocks.filter((block) => block.id !== blockId);
  state.notes.blocks = remaining.length ? remaining : [createNoteBlock("idea", "")];
  saveState("notes", state.notes);
  renderNoteBlocks();
  renderStatus();
}

function buildNotesResult() {
  captureForms();

  const { title, context, reviewGoal, blocks } = state.notes;
  const meaningfulBlocks = blocks
    .map((block) => ({
      type: normalizeNoteBlockType(block.type),
      text: String(block.text || "").trim()
    }))
    .filter((block) => block.text);

  if (!title && !context && !reviewGoal && !meaningfulBlocks.length) return null;

  const grouped = Object.keys(NOTE_BLOCK_TYPES).reduce((accumulator, type) => {
    accumulator[type] = [];
    return accumulator;
  }, {});

  meaningfulBlocks.forEach((block) => {
    grouped[block.type].push(block.text);
  });

  const ideas = grouped.idea;
  const questions = grouped.question;
  const evidence = grouped.evidence;
  const quotes = grouped.quote;
  const tasks = grouped.task;
  const cues = grouped.cue;
  const sessionTitle = title || context || "Untitled study session";
  const cueQuestions = questions.length
    ? questions.slice(0, 4)
    : ideas.slice(0, 4).map(cueFromIdea);
  const reviewCards = (ideas.length ? ideas : [...quotes, ...evidence]).slice(0, 4).map((answer, index) => ({
    prompt: cueQuestions[index] || cueFromIdea(answer),
    answer
  }));
  const sourceHighlights = [...quotes, ...evidence].slice(0, 4);
  const openLoops = [...questions, ...tasks];
  const summaryParts = ideas.slice(0, 3);
  const purposeLine = reviewGoal ? ` Use these notes next when you want to ${reviewGoal.toLowerCase()}.` : "";

  const result = {
    title: sessionTitle,
    context,
    reviewGoal,
    blockCount: meaningfulBlocks.length,
    summary: summaryParts.length
      ? `${sessionTitle} is centring ${summaryParts.map((item) => item.replace(/[.?!]+$/, "").toLowerCase()).join(", ")}.${purposeLine}`
      : `${sessionTitle} is preserving questions, evidence, or re-entry breadcrumbs for later.${purposeLine}`,
    ideas,
    cueQuestions,
    questions,
    evidence,
    quotes,
    tasks,
    cues,
    reviewCards,
    openLoops,
    sourceHighlights,
    reentryNote:
      cues[0] ||
      tasks[0] ||
      (ideas[0] ? `Reopen this session and start with: ${ideas[0]}` : "Reopen this session and keep the thread alive with one small next move."),
    nextReview:
      tasks[0] ||
      (questions[0]
        ? `Turn this question into your next check-in: ${questions[0]}`
        : "Return later and test yourself from the review deck before rereading passively.")
  };

  state.outputs.notes = result;
  saveState("outputs", state.outputs);
  return result;
}

function renderNotes({ openResult = true } = {}) {
  const result = buildNotesResult();
  if (!result) return;

  $("#notesOutput").classList.remove("empty");
  $("#notesOutput").innerHTML = `
    <div class="summary-grid notes-summary-grid">
      <div class="summary-cell">
        <span>Captured</span>
        <strong>${escapeHtml(String(result.blockCount))} block${result.blockCount === 1 ? "" : "s"}</strong>
      </div>
      <div class="summary-cell">
        <span>Open loops</span>
        <strong>${escapeHtml(String(result.openLoops.length))}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>What you caught</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Use this next</h4>
      <p>${escapeHtml(result.nextReview)}</p>
    </div>

    <div class="output-block">
      <h4>Return point</h4>
      <p>${escapeHtml(result.reentryNote)}</p>
    </div>
  `;

  renderSnapshotPreview();

  if (openResult) {
    const firstReviewCard = result.reviewCards[0];

    openMobileResult({
      sourcePanel: "notes",
      resultType: "notes",
      kicker: "Review pack ready",
      title: "You caught the thread",
      summary: result.summary,
      items: [
        `Captured ${result.blockCount} block${result.blockCount === 1 ? "" : "s"}.`,
        firstReviewCard ? `Review cue: ${firstReviewCard.prompt}` : result.nextReview,
        result.openLoops[0] ? `Open loop: ${result.openLoops[0]}` : result.nextReview,
        `Return point: ${result.reentryNote}`
      ],
      primaryLabel: "Back to Home",
      primaryTarget: "dashboard",
      copyText: [
        result.title,
        "",
        result.summary,
        "",
        "Review deck:",
        ...result.reviewCards.map((item) => `- ${item.prompt} -> ${item.answer}`),
        "",
        "Open loops:",
        ...(result.openLoops.length ? result.openLoops.map((item) => `- ${item}`) : [`- ${result.nextReview}`]),
        "",
        `Re-entry cue: ${result.reentryNote}`
      ].join("\n")
    });
  }
}

function saveNotesSession() {
  const result = buildNotesResult();
  if (!result) return;

  const entry = {
    id: noteBlockId(),
    title: result.title,
    context: result.context,
    reviewGoal: result.reviewGoal,
    blocks: state.notes.blocks,
    savedAt: stampNow(),
    summary: result.summary,
    openLoops: result.openLoops.length,
    blockCount: result.blockCount,
    reentryNote: result.reentryNote
  };

  state.notesHistory = [entry, ...state.notesHistory].slice(0, 6);
  saveState("notesHistory", state.notesHistory);
  renderNotesHistory();
  renderStatus();
}

function renderNotesHistory() {
  const container = $("#notesHistory");

  if (!state.notesHistory.length) {
    container.classList.add("empty");
    container.textContent = "No saved sessions yet.";
    return;
  }

  container.classList.remove("empty");
  container.innerHTML = state.notesHistory.map((item) => `
    <div class="history-item">
      <div class="history-head">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.context || item.reviewGoal || "Saved study session")}</p>
        </div>
        <button class="button subtle history-action" type="button" data-note-session="${escapeHtml(item.id)}">Reload</button>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <p class="history-meta">${new Date(item.savedAt).toLocaleString()} · ${item.blockCount} captured · ${item.openLoops} open loop${item.openLoops === 1 ? "" : "s"}</p>
      <p class="history-meta">${escapeHtml(item.reentryNote)}</p>
    </div>
  `).join("");
}

function restoreNotesSession(sessionId) {
  const entry = state.notesHistory.find((item) => item.id === sessionId);
  if (!entry) return;

  state.notes = normalizeNotesState({
    title: entry.title,
    context: entry.context,
    reviewGoal: entry.reviewGoal,
    blocks: entry.blocks
  });
  saveState("notes", state.notes);

  $("#notesTitleInput").value = state.notes.title;
  $("#notesContextInput").value = state.notes.context;
  $("#notesGoalInput").value = state.notes.reviewGoal;
  renderNoteBlocks();
  renderNotes({ openResult: false });
  showPanel("notes");
  renderSnapshotPreview();
  renderStatus();
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function buildProfileResult() {
  captureForms();

  const answers = PROFILE_QUESTIONS.map((question) => {
    const selectedIndex = state.profileAnswers[question.id];
    return Number.isInteger(selectedIndex)
      ? {
          question,
          option: question.options[selectedIndex]
        }
      : null;
  }).filter(Boolean);

  if (!answers.length) return null;

  const tagCounts = {};
  answers.forEach((answer) => {
    answer.option.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag)
    .filter((tag) => PROFILE_TAG_CONTENT[tag]);

  const topContent = topTags.map((tag) => PROFILE_TAG_CONTENT[tag]);
  const answeredCount = answers.length;
  const totalQuestions = PROFILE_QUESTIONS.length;
  const strategyPool = uniqueItems(topContent.flatMap((item) => item.strategies)).slice(0, 6);
  const advisorAsks = uniqueItems(topContent.map((item) => item.advisorAsk)).slice(0, 3);
  const answeredPrompts = answers.map(({ question, option }) => `${question.prompt} ${option.label}`);

  const result = {
    answeredCount,
    totalQuestions,
    topTags,
    summary: topContent.length
      ? answeredCount < 3
        ? `Early pattern: ${topContent.map((item) => item.label.toLowerCase()).join(", ")} are already showing up in how you study.`
        : `Your answers suggest that ${topContent.map((item) => item.label.toLowerCase()).join(", ")} may help study feel more doable right now.`
      : "Answer a few more prompts to make this clearer.",
    content: topContent,
    strategies: strategyPool,
    advisorAsks,
    answeredPrompts
  };

  state.outputs.profile = result;
  saveState("outputs", state.outputs);
  return result;
}

function renderProfile({ openResult = false } = {}) {
  const result = buildProfileResult();
  if (!result) {
    $("#profileOutput").classList.add("empty");
    $("#profileOutput").textContent = "What helps you study will appear here as you answer the prompts.";
    return;
  }

  $("#profileOutput").classList.remove("empty");
  $("#profileOutput").innerHTML = `
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Answered</span>
        <strong>${result.answeredCount} of ${result.totalQuestions}</strong>
      </div>
      <div class="summary-cell">
        <span>Status</span>
        <strong>${result.answeredCount === result.totalQuestions ? "Ready to share" : "Still building"}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Useful pattern</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Showing up</h4>
      <div class="tag-list">
        ${result.content
          .map((item, index) => `<span class="tag ${index === 1 ? "warm" : index === 2 ? "sage" : ""}">${escapeHtml(item.label)}</span>`)
          .join("")}
      </div>
    </div>

    <div class="output-block">
      <h4>Try first</h4>
      <ul class="summary-list">${toListItems(result.strategies.slice(0, 3))}</ul>
    </div>

    <div class="output-block">
      <h4>Words for support</h4>
      <p>${escapeHtml(result.advisorAsks[0] || "I study better when the first step is concrete and visible.")}</p>
    </div>
  `;

  renderSnapshotPreview();

  if (openResult) {
    openMobileResult({
      sourcePanel: "profile",
      resultType: "profile",
      kicker: "Pattern saved",
      title: "What helps is visible",
      summary: result.summary,
      items: [
        `${result.answeredCount} of ${result.totalQuestions} prompts answered.`,
        result.strategies[0] ? `Try first: ${result.strategies[0]}` : "",
        result.strategies[1] ? `Also useful: ${result.strategies[1]}` : "",
        result.advisorAsks[0] ? `Words for support: ${result.advisorAsks[0]}` : ""
      ],
      primaryLabel: "Back to Home",
      primaryTarget: "dashboard",
      copyText: [
        "NORTHSTAR STUDY PROFILE",
        "",
        result.summary,
        "",
        "Support needs:",
        ...result.content.map((item) => `- ${item.label}: ${item.summary}`),
        "",
        "Try first:",
        ...result.strategies.map((item) => `- ${item}`),
        "",
        "Words for support:",
        ...result.advisorAsks.map((item) => `- ${item}`)
      ].join("\n")
    });
  }
}

function renderFinishSummary({ openResult = false } = {}) {
  captureForms();

  const completed = state.finish.items.filter(Boolean).length;
  const total = state.finish.items.length;
  const result = {
    completed,
    total,
    summary:
      completed >= 4
        ? "You left a clear return point."
        : "Good enough is enough. Leave one clear next step if you can.",
    nextTime: state.finish.nextTime || "No saved place yet.",
    worked: state.sessionMemory.worked,
    avoid: state.sessionMemory.avoid
  };

  state.outputs.finish = result;
  saveState("outputs", state.outputs);
  updateSessionMemory({
    worked: state.sessionMemory.worked,
    avoid: state.sessionMemory.avoid,
    nextCue: state.finish.nextTime || state.sessionMemory.nextCue,
    focusRounds: state.focus.completedRounds,
    lastPanel: "finish"
  });

  $("#finishOutput").classList.remove("empty");
  $("#finishOutput").innerHTML = `
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Progress</span>
        <strong>${completed} of ${total}</strong>
      </div>
      <div class="summary-cell">
        <span>Close</span>
        <strong>${completed >= 4 ? "Clear" : "Good enough"}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Close point</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Start here next time</h4>
      <p>${escapeHtml(result.nextTime)}</p>
    </div>

    ${result.worked || result.avoid ? `
      <div class="output-block">
        <h4>Keep visible</h4>
        <ul class="summary-list">
          ${toListItems([
            result.worked ? `Helpful: ${result.worked}` : "",
            result.avoid ? `Make lighter: ${result.avoid}` : ""
          ])}
        </ul>
      </div>
    ` : ""}
  `;

  renderSnapshotPreview();
  renderStatus();

  if (openResult) {
    openMobileResult({
      sourcePanel: "finish",
      resultType: "finish",
      kicker: "Session closed",
      title: completed >= 4 ? "You left a clear return point" : "Good enough is enough",
      summary: result.summary,
      items: [
        `${completed} of ${total} finish checks are complete.`,
        result.nextTime ? `Start here next time: ${result.nextTime}` : "Save one place to come back to if you want an easier restart.",
        "You can stop here without carrying the whole task in your head."
      ],
      primaryLabel: "Back to Home",
      primaryTarget: "dashboard",
      copyText: [
        `Finish progress: ${result.completed} of ${result.total}`,
        result.summary,
        `Start here next time: ${result.nextTime}`,
        result.worked ? `Helpful: ${result.worked}` : "",
        result.avoid ? `Make lighter: ${result.avoid}` : ""
      ].join("\n")
    });
  }
}

function setSnapshotExportStatus(message) {
  const status = $("#snapshotExportStatus");
  if (!status) return;
  status.textContent = message;
}

function snapshotFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `northstar-snapshot-${date}.txt`;
}

async function shareSnapshot() {
  const text = snapshotText();
  const title = "Northstar advisor snapshot";
  const share = nativePlugin("Share");

  try {
    if (share?.share) {
      await share.share({
        title,
        text,
        dialogTitle: "Share Northstar snapshot"
      });
      setSnapshotExportStatus("Share sheet opened.");
      return;
    }

    if (navigator.share) {
      await navigator.share({ title, text });
      setSnapshotExportStatus("Share sheet opened.");
      return;
    }
  } catch {
    // Fall back to copy if a share sheet is cancelled or unavailable.
  }

  await copyText(text);
  setSnapshotExportStatus("Sharing was unavailable, so the snapshot was copied.");
}

function downloadSnapshot() {
  const blob = new Blob([snapshotText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = snapshotFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setSnapshotExportStatus("Snapshot downloaded as a text file.");
}

function snapshotText() {
  const route = state.outputs.route;
  const regulate = state.outputs.regulate;
  const planner = state.outputs.planner;
  const calendar = state.outputs.calendar;
  const focus = state.outputs.focus;
  const unpack = state.outputs.unpack;
  const notes = state.outputs.notes;
  const profile = state.outputs.profile;
  const finish = state.outputs.finish;
  const studyStateMeta = STUDY_STATES[state.checkin.studyState];

  return [
    "NORTHSTAR SNAPSHOT",
    "",
    `Intent: ${state.checkin.intent || "Not set"}`,
    `Study state: ${studyStateMeta ? studyStateMeta.label : "Not set"}`,
    `Battery: ${state.checkin.battery || "Not set"} / 5`,
    `Time available: ${friendlyTime(Number(state.checkin.timeAvailable || 30))}`,
    `Blockers: ${state.checkin.blockers.length ? state.checkin.blockers.join(", ") : "Not specified"}`,
    "",
    `Suggested route: ${route ? panelLabel(route.section) : "Not generated yet"}`,
    route ? `Why: ${route.reason}` : "",
    "",
    regulate ? `Regulation step: ${regulate.regulationStep}` : "",
    regulate ? `Regulation next step: ${normalizeReturnCue(regulate.bridge)}` : "",
    planner ? `Task: ${planner.task}` : "",
    planner ? `First step: ${planner.firstStep}` : "",
    calendar ? `Calendar: ${calendar.termLabel}` : "",
    calendar?.nextDue ? `Next due date: ${calendar.nextDue.title} · ${formatCalendarDate(calendar.nextDue.dueDate)}` : "",
    focus ? `Focus timer: ${focus.presetLabel} · ${focus.phaseLabel}` : "",
    state.focus.intention ? `Focus intention: ${state.focus.intention}` : "",
    state.focus.returnCue ? `Focus saved place: ${state.focus.returnCue}` : "",
    unpack ? `Assignment focus: ${TASK_VERBS[unpack.verb].label} · ${unpack.dueLabel}` : "",
    notes ? `Notes summary: ${notes.summary}` : "",
    profile ? `Support needs: ${profile.content.map((item) => item.label).join(", ")}` : "",
    finish ? `Finish status: ${finish.completed} of ${finish.total}` : "",
    state.sessionMemory.worked ? `What helped last time: ${state.sessionMemory.worked}` : "",
    state.sessionMemory.avoid ? `Avoid next time: ${state.sessionMemory.avoid}` : "",
    state.finish.nextTime ? `Next time note: ${state.finish.nextTime}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function renderSnapshotPreview() {
  const preview = $("#snapshotPreview");

  if (!state.outputs.route && !state.outputs.regulate && !state.outputs.planner && !state.outputs.calendar && !state.outputs.focus && !state.outputs.unpack && !state.outputs.notes && !state.outputs.profile) {
    preview.classList.add("empty");
    preview.textContent = "Your snapshot will appear here after you use Regulate, Plan, Calendar, Focus, Unpack, Notes, or Profile.";
    return;
  }

  preview.classList.remove("empty");
  preview.textContent = snapshotText().split("\n").slice(0, 8).join(" · ");
}

function currentResumeHint() {
  const panelName = state.session.lastPanel || "dashboard";

  if (panelName === "planner" && state.outputs.planner?.firstStep) {
    return state.outputs.planner.firstStep;
  }

  if (panelName === "calendar" && state.outputs.calendar?.nextDue) {
    const item = state.outputs.calendar.nextDue;
    return `${item.title} is ${calendarDuePhrase(item.dueDate).toLowerCase()}. ${item.firstStep || "Open it and choose one small starting action."}`;
  }

  if (panelName === "regulate" && state.outputs.regulate?.bridge) {
    return normalizeReturnCue(state.outputs.regulate.bridge);
  }

  if (panelName === "unpack" && state.outputs.unpack?.nextMoves?.[0]) {
    return state.outputs.unpack.nextMoves[0];
  }

  if (panelName === "focus" && (state.focus.returnCue || state.focus.intention || state.outputs.focus?.next)) {
    return normalizeReturnCue(state.focus.returnCue || state.focus.intention || state.outputs.focus.next);
  }

  if (panelName === "notes" && (state.outputs.notes?.reentryNote || state.outputs.notes?.nextReview)) {
    return normalizeReturnCue(state.outputs.notes.reentryNote || state.outputs.notes.nextReview);
  }

  if (panelName === "profile" && state.outputs.profile?.advisorAsks?.[0]) {
    return state.outputs.profile.advisorAsks[0];
  }

  if (panelName === "finish" && state.outputs.finish?.nextTime) {
    return normalizeReturnCue(state.outputs.finish.nextTime);
  }

  if (state.outputs.route?.action) {
    return normalizeReturnCue(state.outputs.route.action);
  }

  return "Open the task, make the next step visible, and keep the thread alive.";
}

function renderCurrentPanelLabel(panelName) {
  const currentPanelLabel = $("#currentPanelLabel");
  if (!currentPanelLabel) return;
  currentPanelLabel.textContent = panelLabel(panelName);
}

function renderResumeBanner() {
  const hasSavedThread = hasMeaningfulThread();
  const panelName = state.session.lastPanel || "dashboard";
  const nextPanelLabel = panelLabel(panelName);
  const updatedAt = state.session.updatedAt
    ? new Date(state.session.updatedAt).toLocaleString()
    : null;
  const resumeBanner = $(".resume-banner");
  const saveThreadBtn = $("#saveThreadBtn");
  const resumeNowBtn = $("#resumeNowBtn");
  const resumeThreadBtn = $("#resumeThreadBtn");
  const quickResumeBtn = $("#quickResumeBtn");
  const todayDesktopResumeBtn = $("#todayDesktopResumeBtn");
  const activePanel = document.documentElement.dataset.activePanel || "dashboard";

  resumeBanner.hidden = !hasSavedThread;
  resumeThreadBtn.hidden = !hasSavedThread;
  if (quickResumeBtn) quickResumeBtn.hidden = !hasSavedThread;
  if (todayDesktopResumeBtn) todayDesktopResumeBtn.hidden = !hasSavedThread;

  if (state.settings.supportState === "low" && activePanel !== "dashboard") {
    resumeBanner.hidden = true;
    return;
  }

  if (!hasSavedThread) {
    resumeBanner.classList.add("is-slim");
    saveThreadBtn.hidden = true;
    resumeNowBtn.textContent = "Open Today";
    return;
  }

  const lowSupport = state.settings.supportState === "low";
  $("#resumePanelLabel").textContent = lowSupport
    ? `Start here: ${nextPanelLabel}`
    : `Return to ${nextPanelLabel}`;
  $("#resumePanelCopy").textContent = lowSupport
    ? currentResumeHint()
    : `Next useful step: ${currentResumeHint()}`;
  $("#resumePanelMeta").textContent = updatedAt
    ? `Last saved ${updatedAt}`
    : "Progress saved on this device.";

  resumeBanner.classList.remove("is-slim");
  saveThreadBtn.hidden = false;
  resumeNowBtn.textContent = "Resume now";
}

function renderStatus() {
  $("#statusRoute").textContent = state.outputs.route ? panelLabel(state.outputs.route.section) : "Not set yet";
  $("#statusNotes").textContent = `${state.notesHistory.length} session${state.notesHistory.length === 1 ? "" : "s"}`;

  const done = state.finish.items.filter(Boolean).length;
  $("#statusFinish").textContent = `${done} of ${state.finish.items.length}`;

  const panelName = state.session.lastPanel || "dashboard";
  $("#statusResume").textContent = panelLabel(panelName);
  const resumeSummary = $("#resumeSummary");
  if (resumeSummary) {
    resumeSummary.textContent = `If you stop now, Northstar will reopen on ${$("#statusResume").textContent} and keep your current notes, task, and drafts.`;
  }
  renderResumeBanner();
  renderFirstMinuteGuide();
  renderSessionMemory();
  renderCalibration();
}

function bindEvents() {
  bindPrimaryDelegatedActions();

  $$(".nav-link").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.panelTarget));
    button.addEventListener("keydown", (event) => {
      const tabs = $$(".nav-link");
      const currentIndex = tabs.indexOf(button);
      if (currentIndex === -1) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        const next = tabs[(currentIndex + 1) % tabs.length];
        next.focus();
        showPanel(next.dataset.panelTarget);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        const previous = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        previous.focus();
        showPanel(previous.dataset.panelTarget);
      }
    });
  });

  $("#jumpToProfileBtn").addEventListener("click", () => showPanel("profile"));
  $("#recalibrateBtn").addEventListener("click", showCalibration);
  $$("#calibrationCard [data-calibration-support]").forEach((button) => {
    button.addEventListener("click", () => setCalibrationValue("supportState", button.dataset.calibrationSupport));
  });
  $$("#calibrationCard [data-calibration-start]").forEach((button) => {
    button.addEventListener("click", () => setCalibrationValue("startPoint", button.dataset.calibrationStart));
  });
  $$("#calibrationCard [data-calibration-timer]").forEach((button) => {
    button.addEventListener("click", () => setCalibrationValue("timerPreset", button.dataset.calibrationTimer));
  });
  $("#applyCalibrationBtn").addEventListener("click", applyCalibration);
  $("#skipCalibrationBtn").addEventListener("click", skipCalibration);
  $("#useMemoryCueBtn").addEventListener("click", () => {
    const cue = normalizeReturnCue(state.sessionMemory.nextCue || state.sessionMemory.worked);
    if (!cue) return;
    $("#todayIntentInput").value = cue;
    captureForms();
    renderStatus();
    showPanel("dashboard-options");
  });
  $("#resumeNowBtn").addEventListener("click", () => showPanel(state.session.lastPanel || "dashboard"));
  $("#saveThreadBtn").addEventListener("click", () => {
    captureForms();
    state.session.updatedAt = stampNow();
    saveState("session", state.session);
    renderStatus();
  });

  $("#resumeThreadBtn").addEventListener("click", () => showPanel(state.session.lastPanel || "dashboard"));
  $("#quickResumeBtn").addEventListener("click", () => showPanel(state.session.lastPanel || "dashboard"));
  const todayDesktopResumeBtn = $("#todayDesktopResumeBtn");
  if (todayDesktopResumeBtn) {
    todayDesktopResumeBtn.addEventListener("click", () => showPanel(state.session.lastPanel || "dashboard"));
  }
  $("#lostButton").addEventListener("click", returnToGuide);
  $("#firstMinuteStartBtn").addEventListener("click", () => {
    state.settings.introDismissed = true;
    saveState("settings", state.settings);
    showOneSmallMove();
  });
  $("#firstMinuteChooseBtn").addEventListener("click", focusQuickStartChoices);
  $("#firstMinuteDismissBtn").addEventListener("click", () => {
    state.settings.introDismissed = true;
    saveState("settings", state.settings);
    renderFirstMinuteGuide();
    focusQuickStartChoices();
  });
  $("#showMoreTodayBtn").addEventListener("click", () => {
    if (shouldUseMobileResult()) {
      openMobileMoreSheet();
      return;
    }
    showPanel("dashboard-options");
  });
  $("#backToTodayBtn").addEventListener("click", () => showPanel("dashboard"));
  $("#mobileHomeBtn").addEventListener("click", returnToGuide);
  $("#mobileDockHomeBtn").addEventListener("click", returnToGuide);
  $("#mobileDockPrimaryBtn").addEventListener("click", triggerMobileDockAction);
  $("#mobileMoreBtn").addEventListener("click", openMobileMoreSheet);
  $("#mobileMoreCloseBtn").addEventListener("click", closeMobileMoreSheet);
  $("#mobileMoreBackdrop").addEventListener("click", closeMobileMoreSheet);
  $$("#mobileMoreSheet [data-mobile-more-target]").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.mobileMoreTarget));
  });
  $$("#mobileMoreSheet [data-mobile-more-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mobileMoreAction === "support") {
        openMobileSupportDirectory();
        return;
      }
      if (button.dataset.mobileMoreAction === "settings") {
        openMobileAccessSettings();
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMoreSheet();
  });
  $("#mobileResultBackBtn").addEventListener("click", () => showPanel(mobileResultSourcePanel || "dashboard"));
  $("#mobileResultPrimaryBtn").addEventListener("click", () => showPanel(mobileResultPrimaryTarget || "dashboard"));
  $("#mobileResultCopyBtn").addEventListener("click", async () => {
    if (mobileResultSecondaryAction === "try-regulation") {
      tryAnotherRegulationStep();
      return;
    }
    await copyText(mobileResultCopyText || snapshotText());
    nudgeHaptic([6, 16, 6]);
  });

  $("#focusModeBtn").addEventListener("click", () => {
    state.settings.focusMode = !state.settings.focusMode;
    saveState("settings", state.settings);
    applySettings();
  });

  $$(".support-state-button").forEach((button) => {
    button.addEventListener("click", () => setSupportState(button.dataset.supportState));
  });

  $("#fontScaleSelect").addEventListener("change", (event) => {
    state.settings.fontScale = event.target.value;
    saveState("settings", state.settings);
    applySettings();
  });

  $("#fontFamilySelect").addEventListener("change", (event) => {
    state.settings.fontFamily = event.target.value;
    saveState("settings", state.settings);
    applySettings();
  });

  $("#contrastSelect").addEventListener("change", (event) => {
    state.settings.contrast = event.target.value;
    saveState("settings", state.settings);
    applySettings();
  });

  $("#motionSelect").addEventListener("change", (event) => {
    state.settings.motion = event.target.value;
    saveState("settings", state.settings);
    applySettings();
  });

  $$("#batteryButtons .choice-pill").forEach((button) => {
    button.addEventListener("click", () => {
      selectBattery(button.dataset.battery);
      captureForms();
      renderStatus();
    });
  });

  $("#generateRouteBtn").addEventListener("click", () => recommendRoute({ autoOpen: true, revealInline: true }));
  $("#fiveMinuteBtn").addEventListener("click", () => {
    $("#timeAvailableSelect").value = "5";
    selectBattery(Math.min(state.checkin.battery || 3, 2));
    recommendRoute({ autoOpen: true, revealInline: true });
  });

  $("#lowEnergyAssistBtn").addEventListener("click", () => {
    showOneSmallMove();
  });

  $$("#studyStateButtons .state-card").forEach((button) => {
    button.addEventListener("click", () => activateStudyStateChoice(button));
  });

  $$("#quickRouteButtons .quick-route-button").forEach((button) => {
    button.addEventListener("click", () => activateRouteChoice(button));
  });

  $$("#triageButtons .path-card").forEach((button) => {
    button.addEventListener("click", () => activateRouteChoice(button));
  });

  $("#openRouteBtn").addEventListener("click", () => {
    const section = state.outputs.route?.section;
    if (!section) return;
    showPanel(section);
  });

  $("#resetTodayBtn").addEventListener("click", () => {
    state.checkin = { ...defaultCheckin };
    state.settings.supportState = defaultSettings.supportState;
    delete state.outputs.route;
    saveState("checkin", state.checkin);
    saveState("settings", state.settings);
    saveState("outputs", state.outputs);
    syncTodayInputs();
    applySettings();
    renderTodayEmpty();
    renderSnapshotPreview();
    renderStatus();
  });

  $("#buildPlanBtn").addEventListener("click", renderPlanner);
  $("#copyPlanBtn").addEventListener("click", async () => {
    const planner = state.outputs.planner;
    if (!planner) return;
    await copyText(
      [
        `Task: ${planner.task}`,
        `First step: ${planner.firstStep}`,
        "Micro-plan:",
        ...planner.steps.map((step, index) => `${index + 1}. ${step}`),
        `Enough for today: ${planner.successDefinition}`
      ].join("\n")
    );
  });

  $("#saveCalendarItemBtn").addEventListener("click", () => saveCalendarItem({ openResult: true }));
  $("#clearCalendarFormBtn").addEventListener("click", () => clearCalendarForm());
  $("#calendarPrevTermBtn").addEventListener("click", () => shiftCalendarTerm(-1));
  $("#calendarMake13WeeksBtn").addEventListener("click", () => {
    const chosenStart = parseCalendarDate($("#termStartInput").value) || calendarTermRange().start;
    setCalendarToThirteenWeeksFrom(chosenStart);
  });
  $("#calendarNextTermBtn").addEventListener("click", () => shiftCalendarTerm(1));
  $("#copyCalendarBtn").addEventListener("click", async () => {
    await copyText(calendarSummaryText());
    $("#calendarSaveStatus").textContent = "Term plan copied.";
  });

  $$("#regulationMenu .regulation-option").forEach((button) => {
    button.addEventListener("click", () => setRegulationStrategy(button.dataset.regulationStrategy));
  });
  $$("#regulationStateButtons .regulation-state-button").forEach((button) => {
    button.addEventListener("click", () => {
      setRegulationSignal(button.dataset.regulationSignal, { feedback: true, chooseDefaultStrategy: true });
      renderRegulation({ openResult: false, remember: false });
    });
  });
  $("#buildRegulationBtn").addEventListener("click", () => renderRegulation({ openResult: shouldUseMobileResult() }));
  $("#tryAnotherRegulationBtn").addEventListener("click", tryAnotherRegulationStep);
  $("#regulateToPlanBtn").addEventListener("click", () => {
    renderRegulation({ openResult: false });
    showPanel("planner");
  });
  $("#regulateSaveCueBtn").addEventListener("click", () => {
    renderRegulation({ openResult: false });
    showPanel("finish");
  });
  $("#copyRegulationBtn").addEventListener("click", async () => {
    const regulation = state.outputs.regulate;
    if (!regulation) return;
    await copyText(
      [
        "NORTHSTAR REGULATION STEP",
        "",
        regulation.signal,
        regulation.regulationStep,
        regulation.anchor,
        regulation.loadStep,
        regulation.bridge
      ].join("\n")
    );
  });

  $$("#focusPresetButtons .focus-preset").forEach((button) => {
    button.addEventListener("click", () => setFocusPreset(button.dataset.focusPreset));
  });
  $("#focusStartBtn").addEventListener("click", startFocusTimer);
  $("#focusPauseBtn").addEventListener("click", pauseFocusTimer);
  $("#focusResetBtn").addEventListener("click", resetFocusTimer);
  $("#focusCompleteBtn").addEventListener("click", () => completeFocusPhase("marked-done"));
  $("#enableTimerAlertsBtn").addEventListener("click", requestTimerAlerts);

  $("#unpackBtn").addEventListener("click", renderUnpack);
  $("#copyUnpackBtn").addEventListener("click", async () => {
    const unpack = state.outputs.unpack;
    if (!unpack) return;
    await copyText(
      [
        `Command word: ${TASK_VERBS[unpack.verb].label}`,
        `Task kind: ${unpack.deliverableLabel || getDeliverableGuidance(unpack.deliverable).label}`,
        `Meaning: ${unpack.meaning}`,
        "What the task may need:",
        ...unpack.essentials.map((item) => `- ${item}`),
        "Questions:",
        ...unpack.openQuestions.map((item) => `- ${item}`)
      ].join("\n")
    );
  });

  $("#buildNotesBtn").addEventListener("click", renderNotes);
  $("#saveNotesBtn").addEventListener("click", saveNotesSession);
  $$("#notesPalette [data-note-add]").forEach((button) => {
    button.addEventListener("click", () => addNoteBlock(button.dataset.noteAdd));
  });
  $("#copyNotesBtn").addEventListener("click", async () => {
    const notes = state.outputs.notes;
    if (!notes) return;
    await copyText(
      [
        notes.title,
        "",
        notes.summary,
        "",
        "Review deck:",
        ...notes.reviewCards.map((item) => `- ${item.prompt} -> ${item.answer}`),
        "",
        "Open loops:",
        ...(notes.openLoops.length ? notes.openLoops.map((item) => `- ${item}`) : [`- ${notes.nextReview}`]),
        "",
        `Re-entry cue: ${notes.reentryNote}`
      ].join("\n")
    );
  });

  $("#buildProfileBtn").addEventListener("click", () => renderProfile({ openResult: true }));
  $("#profileBackBtn").addEventListener("click", goToPreviousProfileQuestion);
  $("#profileSkipBtn").addEventListener("click", skipProfileQuestion);
  $("#profileNextBtn").addEventListener("click", goToNextProfileQuestion);
  $("#copyProfileBtn").addEventListener("click", async () => {
    const profile = state.outputs.profile;
    if (!profile) return;
    await copyText(
      [
        "NORTHSTAR STUDY PROFILE",
        "",
        profile.summary,
        "",
        "Support needs:",
        ...profile.content.map((item) => `- ${item.label}: ${item.summary}`),
        "",
        "Try first:",
        ...profile.strategies.map((item) => `- ${item}`),
        "",
        "Advising language:",
        ...profile.advisorAsks.map((item) => `- ${item}`)
      ].join("\n")
    );
  });

  $("#saveFinishBtn").addEventListener("click", () => renderFinishSummary({ openResult: true }));
  $("#copyFinishBtn").addEventListener("click", async () => {
    const finish = state.outputs.finish;
    if (!finish) return;
    await copyText(
      [
        `Finish progress: ${finish.completed} of ${finish.total}`,
        finish.summary,
        `Next time: ${finish.nextTime}`,
        finish.worked ? `Worked: ${finish.worked}` : "",
        finish.avoid ? `Avoid next time: ${finish.avoid}` : ""
      ].join("\n")
    );
  });

  $("#copySnapshotBtn").addEventListener("click", async () => {
    await copyText(snapshotText());
    setSnapshotExportStatus("Snapshot copied.");
  });
  $("#shareSnapshotBtn").addEventListener("click", shareSnapshot);
  $("#downloadSnapshotBtn").addEventListener("click", downloadSnapshot);

  $("#resetDataBtn").addEventListener("click", () => {
    const confirmed = window.confirm("Reset only Northstar data stored in this browser?");
    if (!confirmed) return;
    clearNamespace();
    window.location.reload();
  });

  document.addEventListener("input", (event) => {
    captureForms();
    if (event.target.matches("#termTypeSelect, #termNameInput, #termStartInput, #termEndInput")) {
      renderCalendar();
    }
    if (event.target.matches("#focusIntentionInput, #focusReturnCueInput")) {
      saveFocusOutput("edited");
      renderFocusTimer();
      renderSnapshotPreview();
    }
    renderStatus();
  });

  document.addEventListener("click", (event) => {
    const calendarToggle = event.target.closest("[data-calendar-toggle]");
    if (calendarToggle) {
      toggleCalendarDone(calendarToggle.dataset.calendarToggle);
      return;
    }

    const calendarEdit = event.target.closest("[data-calendar-edit]");
    if (calendarEdit) {
      editCalendarItem(calendarEdit.dataset.calendarEdit);
      return;
    }

    const calendarRemove = event.target.closest("[data-calendar-remove]");
    if (calendarRemove) {
      removeCalendarItem(calendarRemove.dataset.calendarRemove);
      return;
    }

    const calendarDay = event.target.closest("[data-calendar-day]");
    if (calendarDay) {
      startCalendarItemOnDate(calendarDay.dataset.calendarDay);
      return;
    }

    const noteRemove = event.target.closest("[data-note-remove]");
    if (noteRemove) {
      removeNoteBlock(noteRemove.dataset.noteRemove);
      return;
    }

    const savedSession = event.target.closest("[data-note-session]");
    if (savedSession) {
      restoreNotesSession(savedSession.dataset.noteSession);
      return;
    }

    const profileOption = event.target.closest("[data-profile-question][data-profile-option]");
    if (profileOption) {
      setProfileAnswer(
        profileOption.dataset.profileQuestion,
        Number(profileOption.dataset.profileOption)
      );
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches(".option-card input[type='checkbox']")) {
      event.target.closest(".option-card")?.classList.toggle("is-selected", event.target.checked);
    }

    if (event.target.matches(".note-block-type")) {
      captureForms();
      renderNoteBlocks();
    }

    if (event.target.matches("[data-finish-index]")) {
      renderFinishSummary({ openResult: false });
    }

    captureForms();
    renderStatus();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncFocusTimerFromClock();
  });
  window.addEventListener("focus", syncFocusTimerFromClock);
  window.addEventListener("pageshow", syncFocusTimerFromClock);
  window.addEventListener("resize", () => {
    renderFirstMinuteGuide();
    updateMobileActionDock(document.documentElement.dataset.activePanel || "dashboard");
  });
}

function renderStoredOutputs() {
  if (state.outputs.route) {
    chooseTriageRoute(state.outputs.route.section, {
      studyState: state.outputs.route.studyState,
      timeAvailable: state.outputs.route.timeAvailable,
      battery: state.outputs.route.battery,
      blockers: state.outputs.route.blockers,
      intent: state.outputs.route.intent
    });
  }

  if (state.outputs.regulate) renderRegulation({ openResult: false, remember: false });
  if (state.outputs.planner && state.planner.task) renderPlanner({ openResult: false });
  renderCalendar();
  renderFocusTimer();
  if (state.outputs.unpack && state.unpack.prompt) renderUnpack({ openResult: false });
  if (state.outputs.notes && (state.notes.title || state.notes.context || state.notes.blocks.some((block) => block.text.trim()))) renderNotes({ openResult: false });
  if (state.outputs.profile && Object.keys(state.profileAnswers).length) renderProfile({ openResult: false });
  if (state.outputs.finish && (state.finish.items.some(Boolean) || state.finish.nextTime)) renderFinishSummary({ openResult: false });
}

function init() {
  document.documentElement.dataset.runtime = isNativeShell() ? "native" : "browser";
  setTodayExpanded(false);
  renderResources();
  renderBlockers("blockerCheckboxes", state.checkin.blockers, "today-blocker");
  renderBlockers("plannerBlockers", state.planner.blockers, "planner-blocker");
  renderVerbOptions();
  renderNoteBlocks();
  const nextProfileIndex = firstUnansweredProfileIndex();
  state.profileUi.activeIndex = nextProfileIndex === -1
    ? clampProfileIndex(state.profileUi.activeIndex || 0)
    : nextProfileIndex;
  saveState("profileUi", state.profileUi);
  renderProfileQuestions();
  renderFinishChecklist();
  setInitialFormValues();
  renderCalendar();
  syncRegulationSelection();
  applySettings();
  bindEvents();
  renderNotesHistory();
  renderTodayEmpty();
  renderSnapshotPreview();
  renderStatus();
  const shouldOpenHome = isNativeShell() || isPhoneLayout();
  showPanel(shouldOpenHome ? "dashboard" : hasMeaningfulThread() ? (state.session.lastPanel || "dashboard") : "dashboard");
  renderStoredOutputs();

  const canRegisterServiceWorker =
    !isNativeShell() &&
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost");

  if (canRegisterServiceWorker) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignore registration errors so the app still works as a normal website.
    });
  }
}

init();
