import {
  BLOCKERS,
  FINISH_ITEMS,
  NOTE_BLOCK_TYPES,
  PROFILE_QUESTIONS,
  PROFILE_TAG_CONTENT,
  ROUTE_LIBRARY,
  STUDY_STATES,
  SUPPORT_RESOURCES,
  TASK_VERBS
} from "./data/content.js";
import {
  clearNamespace,
  copyText,
  formatRelativeDue,
  friendlyTime,
  loadState,
  saveState,
  stampNow
} from "./state.js";

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const PANEL_LABELS = {
  dashboard: "Today",
  "dashboard-options": "Tune Today",
  regulate: "Regulate",
  planner: "Plan",
  focus: "Focus",
  unpack: "Unpack",
  notes: "Notes",
  profile: "Profile",
  finish: "Finish",
  "mobile-result": "Result"
};

const PANEL_THEME_COLORS = {
  dashboard: "#efe9df",
  "dashboard-options": "#efe9df",
  regulate: "#e8eee4",
  planner: "#f1e7e0",
  focus: "#f1ecdf",
  unpack: "#e8eee4",
  notes: "#e6edf3",
  profile: "#f1e7e2",
  finish: "#f1ecdf",
  "mobile-result": "#efe9df"
};

const PRIMARY_PANELS = new Set(["dashboard", "regulate", "planner", "focus", "unpack", "notes", "profile", "finish"]);

const SUPPORT_STATES = {
  low: {
    label: "Low energy",
    hint: "Show the lightest possible structure first, keep the path narrow, and avoid unnecessary decisions.",
    calloutTitle: "Low-energy support",
    calloutCopy: "Northstar will bias toward the smallest useful move, shorter copy, and simpler choices."
  },
  standard: {
    label: "Standard",
    hint: "Balanced guidance with one clear next move and optional detail when you want it.",
    calloutTitle: "Standard support",
    calloutCopy: "Northstar will keep the path clear while leaving room for context and planning."
  },
  detailed: {
    label: "Detailed",
    hint: "Show more structure, more context, and a fuller planning view while you have the capacity for it.",
    calloutTitle: "Detailed support",
    calloutCopy: "Northstar will surface more planning detail, more context, and a fuller check-in."
  }
};

const defaultSettings = {
  fontScale: "standard",
  fontFamily: "standard",
  contrast: "soft",
  motion: "normal",
  supportState: "standard",
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
  signal: "body",
  anchor: "touch",
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
    hint: "A steady Pomodoro container without turning the session into a sprint."
  },
  deep: {
    label: "Deep but safe",
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
    nextCue: String(raw.nextCue || ""),
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
  calibration: normalizeCalibrationState(loadState("calibration", defaultCalibration)),
  sessionMemory: normalizeSessionMemory(loadState("sessionMemory", defaultSessionMemory)),
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
let focusTimerRemaining = null;
let focusTimerRunning = false;
let focusTimerIntervalId = null;

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
    state.outputs.finish ||
    state.planner.task ||
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
  renderCurrentPanelLabel(panelName);
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
  copyText: nextCopyText = ""
} = {}) {
  if (!shouldUseMobileResult()) return;

  mobileResultSourcePanel = sourcePanel;
  mobileResultPrimaryTarget = primaryTarget;
  mobileResultCopyText = nextCopyText;

  const icon = $("#mobileResultIcon");
  if (icon) icon.dataset.resultType = resultType;
  $("#mobileResultKicker").textContent = kicker;
  $("#mobileResultTitle").textContent = title;
  $("#mobileResultSummary").textContent = summary;
  $("#mobileResultPrimaryBtn").textContent = primaryLabel;

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

function renderResources() {
  $("#resourceList").innerHTML = SUPPORT_RESOURCES.map(
    (item) => `
      <div class="resource-item">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.text)}</p>
      </div>
    `
  ).join("");
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
      <strong>Pick the closest state, not the perfect label.</strong>
      <p>Northstar uses this to lower friction, not to put you in a box.</p>
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

  $("#regulateSignalSelect").value = state.regulate.signal;
  $("#regulateAnchorSelect").value = state.regulate.anchor;
  $("#regulateLoadInput").value = state.regulate.load;

  $("#promptInput").value = state.unpack.prompt;
  $("#promptDueInput").value = state.unpack.dueDate;
  $("#unclearInput").value = state.unpack.unclear;
  $("#deliverableSelect").value = state.unpack.deliverable;

  $("#focusIntentionInput").value = state.focus.intention;
  $("#focusReturnCueInput").value = state.focus.returnCue;

  $("#notesTitleInput").value = state.notes.title;
  $("#notesContextInput").value = state.notes.context;
  $("#notesGoalInput").value = state.notes.reviewGoal;

  $("#nextTimeInput").value = state.finish.nextTime;
  $("#workedInput").value = state.sessionMemory.worked;
  $("#avoidInput").value = state.sessionMemory.avoid;
}

const REGULATION_SIGNALS = {
  body: "Your body is carrying the stress first.",
  thoughts: "The thought loop is loud right now.",
  sensory: "The environment is adding load before the task even starts.",
  avoidance: "Avoidance is information, not a character flaw.",
  fog: "Working memory is overloaded, so the task needs less noise around it."
};

const REGULATION_ANCHORS = {
  touch: "Hold one texture or press your feet into the floor for 30 seconds.",
  movement: "Do one small movement: stretch, pace, wall push-up, or posture shift.",
  sound: "Choose one steady sound and let attention return there when it wanders.",
  sight: "Pick one colour or visual point and let your eyes rest there.",
  breath: "Use breath only if it feels safe: one slower exhale is enough.",
  object: "Hold or look at one familiar object that helps your body orient."
};

const REGULATION_STRATEGIES = {
  sensory: {
    label: "Sensory anchor",
    step: "Choose one sensory anchor and stay with it for 30-60 seconds.",
    bridge: "Then make the task visible without starting it yet."
  },
  movement: {
    label: "Small movement",
    step: "Move pressure through your body with one tiny movement set.",
    bridge: "Then return and do only the first setup action."
  },
  label: {
    label: "Name the feeling",
    step: "Say: \"I am noticing worry, shame, avoidance, or overload.\"",
    bridge: "Then ask what barrier is present, not why you are like this."
  },
  needs: {
    label: "Basic care",
    step: "Check water, food, temperature, device pull, and noise before effort.",
    bridge: "Then use a 10-minute Focus block or a one-step Plan."
  }
};

function setRegulationStrategy(strategy) {
  if (!REGULATION_STRATEGIES[strategy]) return;
  state.regulate.strategy = strategy;
  saveState("regulate", state.regulate);

  $$("#regulationMenu .regulation-option").forEach((button) => {
    const isSelected = button.dataset.regulationStrategy === strategy;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function buildRegulationResult() {
  captureForms();

  const strategy = REGULATION_STRATEGIES[state.regulate.strategy] || REGULATION_STRATEGIES.sensory;
  const signal = REGULATION_SIGNALS[state.regulate.signal] || REGULATION_SIGNALS.body;
  const anchor = REGULATION_ANCHORS[state.regulate.anchor] || REGULATION_ANCHORS.touch;
  const loadStep = state.regulate.load || "Reduce one demand: close a tab, dim light, use headphones, move rooms, or get water.";

  return {
    signal,
    anchor,
    strategyLabel: strategy.label,
    regulationStep: strategy.step,
    loadStep,
    bridge: strategy.bridge,
    experiment: "Afterward, notice what helped, what did not, and what needs adjusting."
  };
}

function renderRegulation({ openResult = false, remember = true } = {}) {
  const result = buildRegulationResult();
  state.outputs.regulate = result;
  saveState("outputs", state.outputs);

  $("#regulateOutput").classList.remove("empty");
  $("#regulateOutput").innerHTML = `
    <div class="output-block">
      <h4>What is happening</h4>
      <p>${escapeHtml(result.signal)}</p>
    </div>

    <div class="output-block">
      <h4>Do this before study</h4>
      <ul class="summary-list">
        ${toListItems([
          result.regulationStep,
          result.anchor,
          result.loadStep
        ])}
      </ul>
    </div>

    <div class="output-block">
      <h4>Bridge back gently</h4>
      <p>${escapeHtml(result.bridge)}</p>
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
      kicker: "Regulation first",
      title: "Do this before the task",
      summary: result.regulationStep,
      items: [result.anchor, result.loadStep, result.bridge],
      primaryLabel: "Open Focus",
      primaryTarget: "focus",
      copyText: [
        "NORTHSTAR REGULATION STEP",
        "",
        result.signal,
        result.regulationStep,
        result.anchor,
        result.loadStep,
        result.bridge
      ].join("\n")
    });
  }
}

function syncRegulationSelection() {
  setRegulationStrategy(state.regulate.strategy || "sensory");
}

function focusNotificationCopy(phase = state.focus.phase) {
  return phase === "break"
    ? {
      title: "Northstar break complete",
      body: "Choose whether another focus block would actually help."
    }
    : {
      title: "Northstar focus block complete",
      body: "Stop first. Add a return cue before deciding what comes next."
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
  card.hidden = !hasMemory;
  if (!hasMemory) return;

  const title = worked || nextCue || `${focusRounds} focus block${focusRounds === 1 ? "" : "s"} completed`;
  const copyParts = [
    nextCue ? `Return cue: ${nextCue}` : "",
    avoid ? `Avoid next time: ${avoid}` : "",
    focusRounds ? `Focus evidence: ${focusRounds} timer block${focusRounds === 1 ? "" : "s"} completed.` : ""
  ].filter(Boolean);

  $("#sessionMemoryTitle").textContent = title;
  $("#sessionMemoryCopy").textContent = copyParts.join(" ");
  $("#sessionMemoryMeta").textContent = updatedAt
    ? `${panelLabel(lastPanel || "dashboard")} · saved ${new Date(updatedAt).toLocaleString()}`
    : "";
}

function renderCalibration() {
  const card = $("#calibrationCard");
  if (!card) return;
  card.hidden = Boolean(state.calibration.completed);

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
      intent: state.checkin.intent || "use a timer container before starting"
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
  saveState("calibration", state.calibration);
  renderCalibration();
}

function showCalibration() {
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
    output.textContent = "Pick a focus container, name what this block is for, then start. Northstar will keep the instruction narrow and help you stop cleanly.";
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

  if (startBtn) startBtn.textContent = focusTimerRunning ? "Focus block running" : state.focus.phase === "break" ? "Start break" : "Start focus block";
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

  state.regulate = {
    signal: $("#regulateSignalSelect").value,
    anchor: $("#regulateAnchorSelect").value,
    load: $("#regulateLoadInput").value.trim(),
    strategy: state.regulate.strategy || "sensory"
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
    nextCue: $("#nextTimeInput").value.trim() || state.sessionMemory.nextCue
  };

  saveState("checkin", state.checkin);
  saveState("planner", state.planner);
  saveState("regulate", state.regulate);
  saveState("unpack", state.unpack);
  saveState("notes", state.notes);
  saveState("focus", state.focus);
  saveState("finish", state.finish);
  saveState("sessionMemory", state.sessionMemory);
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
    button.classList.toggle("is-selected", button.dataset.routeTarget === section);
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
  return section === "dashboard" ? "Stay in Today" : `Open ${panelLabel(section)}`;
}

function renderTodayEmpty() {
  const routeCard = $(".today-route-card");
  $("#todayRouteLabel").textContent = "Pick one start above";
  $("#todayOutput").classList.add("empty");
  $("#todayOutput").innerHTML = "Choose one quick start above. If none of them fit, open More ways to tune this for study states, other spaces, or a more tailored suggestion.";
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

  const shouldShow = !state.settings.introDismissed && !hasMeaningfulThread();
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
        <span>Best next space</span>
        <strong>${escapeHtml(routeName)}</strong>
      </div>
      <div class="summary-cell">
        <span>Capacity</span>
        <strong>Battery ${escapeHtml(result.battery)} · ${escapeHtml(friendlyTime(result.timeAvailable))}</strong>
      </div>
      ${studyStateMeta ? `
        <div class="summary-cell">
          <span>Study state</span>
          <strong>${escapeHtml(studyStateMeta.label)}</strong>
          <p>${escapeHtml(studyStateMeta.routeNote)}</p>
        </div>
      ` : ""}
    </div>

    <div class="output-block">
      <h4>${escapeHtml(result.title)}</h4>
      <p>${escapeHtml(result.reason)}</p>
    </div>

    ${studyStateMeta ? `
      <div class="output-block">
        <h4>State-aware adjustment</h4>
        <p>${escapeHtml(studyStateMeta.brief)}</p>
        <p class="output-subtle">${escapeHtml(studyStateMeta.prompt)}</p>
      </div>
    ` : ""}

    <div class="output-block">
      <h4>What to do now</h4>
      <p>${escapeHtml(result.action)}</p>
      <p class="output-subtle">${escapeHtml(result.lowEnergyMove)}</p>
    </div>

    <div class="output-block">
      <h4>Why this fits this moment</h4>
      <ul class="summary-list">
        ${toListItems([
          result.blockers.length
            ? `Current friction: ${result.blockers.join(", ")}`
            : "No blockers selected, so Northstar is using the path choice, time, and capacity to keep the next move simple.",
          SUPPORT_STATES[result.supportState || "standard"].hint,
          result.followUp
        ])}
      </ul>
    </div>
  `;

  $("#openRouteBtn").disabled = false;
  $("#openRouteBtn").textContent = routeButtonLabel(result.section);
  setQuickRouteSelection(["dashboard", "regulate", "planner", "focus", "unpack"].includes(result.section) ? result.section : null);
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
          : "If the task swells again, shrink it back to one visible action before asking more of yourself.",
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
    kicker: isPressureRoute ? "Pressure lowered" : isRegulationRoute ? "Regulation first" : "Route ready",
    title: isPressureRoute ? "Do this first" : isRegulationRoute ? "Ready-enough comes first" : result.title,
    summary: isPressureRoute
      ? "One setup action, one sentence, or one question is enough."
      : isRegulationRoute
        ? "Lower the nervous-system load before asking for output."
      : result.lowEnergyMove || result.action,
    items: isPressureRoute
      ? [
        "Choose one tiny action that lowers pressure.",
        "If it is still foggy, move to Unpack."
      ]
      : isRegulationRoute
        ? [
          "Name what is loudest: body, thoughts, sensory load, avoidance, or fog.",
          "Use one concrete anchor or movement.",
          "Bridge into Focus only when you are ready enough."
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
  setTodayInlineFeedbackVisible(Boolean(options.revealInline && isPhoneLayout() && result.section === "dashboard"));
  state.outputs.route = result;
  saveState("outputs", state.outputs);
  renderTodayRoute(result);
  renderSnapshotPreview();
  renderStatus();

  if (options.autoOpen && shouldUseMobileResult()) {
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

  if (options.autoOpen && shouldUseMobileResult() && result.section !== "dashboard") {
    showPanel(result.section);
  } else if (options.autoOpen && shouldUseMobileResult() && todayInlineFeedbackVisible) {
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
    <div class="summary-grid">
      <div class="summary-cell">
        <span>Task type</span>
        <strong>${escapeHtml(result.type)}</strong>
      </div>
      <div class="summary-cell">
        <span>Deadline</span>
        <strong>${escapeHtml(result.dueLabel)}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Visible first step</h4>
      <p>${escapeHtml(result.firstStep)}</p>
    </div>

    <div class="output-block">
      <h4>Micro-plan</h4>
      <ul class="summary-list">${toListItems(result.steps)}</ul>
    </div>

    <div class="output-block">
      <h4>What counts as enough</h4>
      <p>${escapeHtml(result.successDefinition)}</p>
    </div>

    <div class="output-block">
      <h4>If you get stuck again</h4>
      <ul class="summary-list">${toListItems(result.stuckAgain)}</ul>
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

function buildUnpackResult() {
  captureForms();

  const { prompt, verb, dueDate, unclear, deliverable } = state.unpack;
  if (!prompt) return null;

  const resolvedVerb = verb === "auto" ? detectVerb(prompt) : verb;
  const verbData = TASK_VERBS[resolvedVerb] || TASK_VERBS.discuss;
  const dueLabel = formatRelativeDue(dueDate);

  const deliverables = {
    essay: [
      "A clear position or line of thinking",
      "Evidence that supports each main point",
      "A structure that answers the task directly"
    ],
    discussion: [
      "A concise response to the question",
      "At least one supported point",
      "A contribution that clearly connects to the topic"
    ],
    reflection: [
      "A real experience or observation",
      "A link between that experience and the course ideas",
      "A clear explanation of what changed in your thinking"
    ],
    presentation: [
      "A clear narrative arc",
      "Slides that support rather than replace the spoken point",
      "Examples or evidence that keep the audience oriented"
    ],
    exam: [
      "A focused list of likely concepts or questions",
      "Condensed notes or cues",
      "Evidence that you can recall or explain the material under time pressure"
    ]
  };

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
    essentials: deliverables[deliverable],
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
    </div>

    <div class="output-block">
      <h4>Plain-language brief</h4>
      <p>${escapeHtml(result.meaning)}</p>
    </div>

    <div class="output-block">
      <h4>What this deliverable probably needs</h4>
      <ul class="summary-list">${toListItems(result.essentials)}</ul>
    </div>

    <div class="output-block">
      <h4>Questions to bring to an advisor or tutor</h4>
      <ul class="summary-list">${toListItems(result.openQuestions)}</ul>
    </div>

    <div class="output-block">
      <h4>Next moves</h4>
      <ul class="summary-list">${toListItems(result.nextMoves)}</ul>
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
        `It probably needs: ${result.essentials[0]}`,
        `Ask: ${result.openQuestions[0]}`,
        result.nextMoves[2]
      ],
      primaryLabel: "Make first step",
      primaryTarget: "planner",
      copyText: [
        `Command word: ${TASK_VERBS[result.verb].label}`,
        `Meaning: ${result.meaning}`,
        "What the task needs:",
        ...result.essentials.map((item) => `- ${item}`),
        "Questions:",
        ...result.openQuestions.map((item) => `- ${item}`)
      ].join("\n")
    });
  }
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
      <h4>Session readout</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Review deck</h4>
      <div class="review-card-list">
        ${(result.reviewCards.length
          ? result.reviewCards
          : [{ prompt: "Add an idea or quote block", answer: "Northstar will turn it into a review card here." }])
          .map((card) => `
            <div class="review-card">
              <span>${escapeHtml(card.prompt)}</span>
              <strong>${escapeHtml(card.answer)}</strong>
            </div>
          `)
          .join("")}
      </div>
    </div>

    <div class="output-block">
      <h4>Open loops and next tasks</h4>
      <ul class="summary-list">${toListItems(result.openLoops.length ? result.openLoops : [result.nextReview])}</ul>
    </div>

    <div class="output-block">
      <h4>Sources and re-entry cues</h4>
      <ul class="summary-list">${toListItems([
        result.sourceHighlights.length
          ? `Keep nearby: ${result.sourceHighlights.join(" | ")}`
          : "No evidence or quote blocks captured yet.",
        `Next review move: ${result.nextReview}`,
        `Re-entry cue: ${result.reentryNote}`
      ])}</ul>
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
        : `Your study pattern currently suggests that ${topContent.map((item) => item.label.toLowerCase()).join(", ")} would make academic work more accessible and sustainable right now.`
      : "Your profile is still emerging. Answer a few more prompts to sharpen the output.",
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
    $("#profileOutput").textContent = "Your support profile will appear here with patterns, strategies, and advising language as you answer the prompts.";
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
        <span>Profile state</span>
        <strong>${result.answeredCount === result.totalQuestions ? "Ready to share" : "Still emerging"}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Study pattern summary</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Support needs showing up most strongly</h4>
      <div class="tag-list">
        ${result.content
          .map((item, index) => `<span class="tag ${index === 1 ? "warm" : index === 2 ? "sage" : ""}">${escapeHtml(item.label)}</span>`)
          .join("")}
      </div>
    </div>

    <div class="output-block">
      <h4>What to build into study</h4>
      <ul class="summary-list">${toListItems(result.content.map((item) => item.summary))}</ul>
    </div>

    <div class="output-block">
      <h4>Try first</h4>
      <ul class="summary-list">${toListItems(result.strategies)}</ul>
    </div>

    <div class="output-block">
      <h4>Language to use in advising</h4>
      <ul class="summary-list">${toListItems(result.advisorAsks)}</ul>
    </div>

    <div class="output-block">
      <h4>Patterns you have already named</h4>
      <ul class="summary-list">${toListItems(result.answeredPrompts)}</ul>
    </div>
  `;

  renderSnapshotPreview();

  if (openResult) {
    openMobileResult({
      sourcePanel: "profile",
      resultType: "profile",
      kicker: "Pattern saved",
      title: "Your study pattern is visible",
      summary: result.summary,
      items: [
        `${result.answeredCount} of ${result.totalQuestions} prompts answered.`,
        result.strategies[0] ? `Try first: ${result.strategies[0]}` : "",
        result.strategies[1] ? `Also useful: ${result.strategies[1]}` : "",
        result.advisorAsks[0] ? `Advisor language: ${result.advisorAsks[0]}` : ""
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
        "Advising language:",
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
        ? "You have closed this session in a way that should make re-entry easier."
        : "You do not need a perfect finish. Aim for a clear stopping point and one memory cue.",
    nextTime: state.finish.nextTime || "No re-entry note saved yet.",
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
        <span>Checklist progress</span>
        <strong>${completed} of ${total}</strong>
      </div>
      <div class="summary-cell">
        <span>Session close</span>
        <strong>${completed >= 4 ? "Strong" : "Good enough is valid"}</strong>
      </div>
    </div>

    <div class="output-block">
      <h4>Finish reflection</h4>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="output-block">
      <h4>Remember next time</h4>
      <p>${escapeHtml(result.nextTime)}</p>
    </div>

    ${result.worked || result.avoid ? `
      <div class="output-block">
        <h4>What Northstar will remember</h4>
        <ul class="summary-list">
          ${toListItems([
            result.worked ? `Worked: ${result.worked}` : "",
            result.avoid ? `Avoid: ${result.avoid}` : ""
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
      title: completed >= 4 ? "You left a clean return point" : "Good enough is enough",
      summary: result.summary,
      items: [
        `${completed} of ${total} finish checks are complete.`,
        result.nextTime ? `Remember next time: ${result.nextTime}` : "Add one memory cue if you want an easier restart.",
        "You can stop here without carrying the whole task in your head."
      ],
      primaryLabel: "Back to Home",
      primaryTarget: "dashboard",
      copyText: [
        `Finish progress: ${result.completed} of ${result.total}`,
        result.summary,
        `Next time: ${result.nextTime}`,
        result.worked ? `Worked: ${result.worked}` : "",
        result.avoid ? `Avoid: ${result.avoid}` : ""
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
    regulate ? `Regulation bridge: ${regulate.bridge}` : "",
    planner ? `Task: ${planner.task}` : "",
    planner ? `First step: ${planner.firstStep}` : "",
    focus ? `Focus container: ${focus.presetLabel} · ${focus.phaseLabel}` : "",
    state.focus.intention ? `Focus intention: ${state.focus.intention}` : "",
    state.focus.returnCue ? `Focus return cue: ${state.focus.returnCue}` : "",
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

  if (!state.outputs.route && !state.outputs.regulate && !state.outputs.planner && !state.outputs.focus && !state.outputs.unpack && !state.outputs.notes && !state.outputs.profile) {
    preview.classList.add("empty");
    preview.textContent = "Your snapshot will appear here after you use Regulate, Plan, Focus, Unpack, Notes, or Profile.";
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

  if (panelName === "regulate" && state.outputs.regulate?.bridge) {
    return state.outputs.regulate.bridge;
  }

  if (panelName === "unpack" && state.outputs.unpack?.nextMoves?.[0]) {
    return state.outputs.unpack.nextMoves[0];
  }

  if (panelName === "focus" && (state.focus.returnCue || state.focus.intention || state.outputs.focus?.next)) {
    return state.focus.returnCue || state.focus.intention || state.outputs.focus.next;
  }

  if (panelName === "notes" && (state.outputs.notes?.reentryNote || state.outputs.notes?.nextReview)) {
    return state.outputs.notes.reentryNote || state.outputs.notes.nextReview;
  }

  if (panelName === "profile" && state.outputs.profile?.advisorAsks?.[0]) {
    return state.outputs.profile.advisorAsks[0];
  }

  if (panelName === "finish" && state.outputs.finish?.nextTime) {
    return state.outputs.finish.nextTime;
  }

  if (state.outputs.route?.action) {
    return state.outputs.route.action;
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

  resumeBanner.hidden = !hasSavedThread;
  resumeThreadBtn.hidden = !hasSavedThread;
  if (quickResumeBtn) quickResumeBtn.hidden = !hasSavedThread;
  if (todayDesktopResumeBtn) todayDesktopResumeBtn.hidden = !hasSavedThread;

  if (!hasSavedThread) {
    resumeBanner.classList.add("is-slim");
    saveThreadBtn.hidden = true;
    resumeNowBtn.textContent = "Open Today";
    return;
  }

  $("#resumePanelLabel").textContent = `Return to ${nextPanelLabel}`;
  $("#resumePanelCopy").textContent = `Next useful step: ${currentResumeHint()}`;
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
    resumeSummary.textContent = `If you stop now, Northstar will reopen on ${$("#statusResume").textContent} and keep your current notes, task, and reflection drafts.`;
  }
  renderResumeBanner();
  renderFirstMinuteGuide();
  renderSessionMemory();
  renderCalibration();
}

function bindEvents() {
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
    const cue = state.sessionMemory.nextCue || state.sessionMemory.worked;
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
  $("#firstMinuteStartBtn").addEventListener("click", () => {
    state.settings.introDismissed = true;
    saveState("settings", state.settings);
    applyStudyStatePreset("overwhelmed", { autoOpen: true, revealInline: true });
  });
  $("#firstMinuteChooseBtn").addEventListener("click", focusQuickStartChoices);
  $("#firstMinuteDismissBtn").addEventListener("click", () => {
    state.settings.introDismissed = true;
    saveState("settings", state.settings);
    renderFirstMinuteGuide();
    focusQuickStartChoices();
  });
  $("#showMoreTodayBtn").addEventListener("click", () => showPanel("dashboard-options"));
  $("#backToTodayBtn").addEventListener("click", () => showPanel("dashboard"));
  $("#mobileHomeBtn").addEventListener("click", () => showPanel("dashboard"));
  $("#mobileResultBackBtn").addEventListener("click", () => showPanel(mobileResultSourcePanel || "dashboard"));
  $("#mobileResultPrimaryBtn").addEventListener("click", () => showPanel(mobileResultPrimaryTarget || "dashboard"));
  $("#mobileResultCopyBtn").addEventListener("click", async () => {
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
    applyStudyStatePreset("overwhelmed", { autoOpen: true, revealInline: true });
  });

  $$("#studyStateButtons .state-card").forEach((button) => {
    button.addEventListener("click", () => applyStudyStatePreset(button.dataset.studyState, { autoOpen: true, revealInline: true }));
  });

  $$("#quickRouteButtons .quick-route-button").forEach((button) => {
    button.addEventListener("click", () => {
      nudgeHaptic();
      if (button.dataset.routeTarget === "dashboard") {
        applyStudyStatePreset("overwhelmed", { autoOpen: true, revealInline: true });
        return;
      }

      chooseTriageRoute(button.dataset.routeTarget, {}, { autoOpen: true, revealInline: true });
    });
  });

  $$("#triageButtons .path-card").forEach((button) => {
    button.addEventListener("click", () => {
      nudgeHaptic();
      chooseTriageRoute(button.dataset.routeTarget, {}, { autoOpen: true, revealInline: true });
    });
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

  $$("#regulationMenu .regulation-option").forEach((button) => {
    button.addEventListener("click", () => setRegulationStrategy(button.dataset.regulationStrategy));
  });
  $("#buildRegulationBtn").addEventListener("click", () => renderRegulation({ openResult: true }));
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
        `Meaning: ${unpack.meaning}`,
        "What the task needs:",
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
    if (event.target.matches("#focusIntentionInput, #focusReturnCueInput")) {
      saveFocusOutput("edited");
      renderFocusTimer();
      renderSnapshotPreview();
    }
    renderStatus();
  });

  document.addEventListener("click", (event) => {
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
