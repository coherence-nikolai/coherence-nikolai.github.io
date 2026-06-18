const storageKey = "i-sense-observatory.sessions.v1";

const stageOrder = [
  "Arrive",
  "Locate",
  "Texture",
  "Observe",
  "Report",
  "Threshold",
  "Note"
];

const stageKeys = [
  "arrive",
  "locate",
  "texture",
  "observe",
  "report",
  "threshold",
  "note"
];

const locationOptions = [
  "behind the eyes",
  "face",
  "head",
  "throat",
  "chest",
  "abdomen",
  "whole body",
  "around the body",
  "no clear location",
  "not present"
];

const textureOptions = [
  "pressure",
  "center",
  "boundary",
  "contraction",
  "watcher",
  "density",
  "warmth",
  "vibration",
  "image",
  "spaciousness",
  "unclear",
  "absent"
];

const changeOptions = [
  "stayed the same",
  "shifted",
  "softened",
  "intensified",
  "moved",
  "expanded",
  "became unclear",
  "dropped away briefly",
  "re-formed",
  "not sure"
];

const thresholdChangeMarkers = new Set([
  "expanded",
  "became unclear",
  "dropped away briefly",
  "re-formed"
]);

const thresholdOptions = [
  "awareness present",
  "sensation present",
  "sound present",
  "space present",
  "center absent",
  "wide perception",
  "peripheral clarity",
  "body included in a larger field",
  "fear",
  "peace",
  "nothing clear",
  "cannot say"
];

const perceptionOptions = [
  "centered",
  "wide",
  "peripheral",
  "ordinary",
  "spacious",
  "unclear"
];

const locateQuestions = [
  "Where do you sense your self?",
  "Where do you feel located in the body?",
  "Where is the felt sense of existing as you?",
  "Where are you mainly located right now?",
  "If me-ness had a center, where would it seem to be?",
  "Where does the sense of being the observer appear from?"
];

const textureQuestions = [
  "How are you experiencing the sense of self?",
  "How is me-ness felt in the body?",
  "What type of experience seems to explain the sense of me?",
  "Is it pressure, image, center, boundary, watcher, warmth, or something else?",
  "Does it feel solid, vague, spacious, contracted, moving, or absent?",
  "What is directly felt before any story about it?"
];

const state = {
  view: "observatory",
  stage: 0,
  locateQuestionIndex: 0,
  textureQuestionIndex: 0,
  location: "",
  textures: new Set(),
  changes: new Set(),
  thresholds: new Set(),
  perceptions: new Set(),
  note: "",
  observeEndsAt: 0,
  prepareEndsAt: 0,
  observeTimer: null,
  isPreparingObservation: false,
  isObservingDirectly: false,
  observationStartedAt: 0,
  sessions: loadSessions()
};

let lastStageAnimationKey = "";

const els = {
  documentBody: document.body,
  tabs: Array.from(document.querySelectorAll("[data-view-target]")),
  views: {
    observatory: document.getElementById("view-observatory"),
    notes: document.getElementById("view-notes"),
    patterns: document.getElementById("view-patterns"),
    about: document.getElementById("view-about")
  },
  stepList: document.getElementById("step-list"),
  surface: document.querySelector(".experiment-surface"),
  kicker: document.getElementById("stage-kicker"),
  title: document.getElementById("observatory-title"),
  prompt: document.getElementById("stage-prompt"),
  body: document.getElementById("stage-body"),
  actions: document.getElementById("stage-actions"),
  summary: document.getElementById("current-summary"),
  notesList: document.getElementById("notes-list"),
  patternGrid: document.getElementById("pattern-grid"),
  exportNotes: document.getElementById("export-notes"),
  clearNotes: document.getElementById("clear-notes"),
  canvas: document.getElementById("field-canvas")
};

const canvasState = {
  context: els.canvas.getContext("2d"),
  width: 0,
  height: 0,
  pixelRatio: 1,
  startedAt: performance.now()
};

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const motionProfiles = {
  arrive: { field: 0.18, aperture: 0.92, peripheral: 0.14, rays: 0 },
  locate: { field: 0.24, aperture: 0.98, peripheral: 0.2, rays: 0 },
  texture: { field: 0.28, aperture: 1, peripheral: 0.24, rays: 0 },
  stillness: { field: 0.3, aperture: 1.03, peripheral: 0.28, rays: 0 },
  observe: { field: 0.68, aperture: 1.18, peripheral: 0.88, rays: 0.46 },
  report: { field: 0.36, aperture: 1.05, peripheral: 0.42, rays: 0 },
  threshold: { field: 0.82, aperture: 1.34, peripheral: 1, rays: 0.54 },
  note: { field: 0.4, aperture: 1.08, peripheral: 0.48, rays: 0 }
};

const motionState = {
  current: { ...motionProfiles.arrive },
  target: { ...motionProfiles.arrive },
  reducedMotion: reduceMotionQuery.matches,
  lastFrameAt: performance.now(),
  renderedReducedFrame: false
};

function loadSessions() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveSessions() {
  localStorage.setItem(storageKey, JSON.stringify(state.sessions));
}

function resetSession() {
  stopObserveTimer();
  state.stage = 0;
  state.locateQuestionIndex = 0;
  state.textureQuestionIndex = 0;
  state.location = "";
  state.textures = new Set();
  state.changes = new Set();
  state.thresholds = new Set();
  state.perceptions = new Set();
  state.note = "";
  state.observeEndsAt = 0;
  state.prepareEndsAt = 0;
  state.isPreparingObservation = false;
  state.isObservingDirectly = false;
  state.observationStartedAt = 0;
  renderWithTransition();
}

function setView(view) {
  mutateWithTransition(() => {
    const previousView = state.view;
    state.view = view;
    if (previousView === "observatory" && view !== "observatory") stopObserveTimer();
    els.tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.viewTarget === view);
    });
    Object.entries(els.views).forEach(([name, element]) => {
      element.classList.toggle("is-active", name === view);
    });
    updateStageChrome();
    setMotionTarget();
    if (view === "notes") renderNotes();
    if (view === "patterns") renderPatterns();
  });
}

function setStage(stage) {
  const nextStage = Math.max(0, Math.min(stage, stageOrder.length - 1));
  mutateWithTransition(() => {
    if (state.stage === 3 && nextStage !== 3) stopObserveTimer();
    state.stage = nextStage;
    render();
  });
}

function selectedArray(set) {
  return Array.from(set);
}

function render() {
  updateStageChrome();
  renderSteps();
  renderSummary();

  const renderer = [
    renderArrive,
    renderLocate,
    renderTexture,
    renderObserveIntro,
    renderReport,
    renderThreshold,
    renderNote
  ][state.stage];

  renderer();
  updateFieldIntensity();
}

function renderWithTransition() {
  mutateWithTransition(render);
}

function mutateWithTransition(mutate) {
  const canTransition = !motionState.reducedMotion
    && typeof document.startViewTransition === "function";

  if (!canTransition) {
    mutate();
    return;
  }

  document.startViewTransition(() => {
    mutate();
  });
}

function renderSteps() {
  els.stepList.innerHTML = stageOrder.map((step, index) => {
    const className = index < state.stage ? "is-complete" : index === state.stage ? "is-current" : "";
    return `<li class="${className}">${step}</li>`;
  }).join("");
}

function updateStageChrome() {
  const key = getChromeStage();
  document.documentElement.dataset.stage = key;
  document.documentElement.classList.toggle("is-observing", state.view === "observatory" && state.stage === 3 && (Boolean(state.observeTimer) || state.isObservingDirectly));
  document.documentElement.classList.toggle("is-preparing", state.view === "observatory" && state.isPreparingObservation);
}

function renderSummary() {
  const lines = [];
  lines.push(`<div><strong>Location</strong>${state.location || "not observed yet"}</div>`);
  lines.push(`<div><strong>Texture</strong>${joinOrNone(selectedArray(state.textures))}</div>`);
  lines.push(`<div><strong>Observation</strong>${state.isObservingDirectly ? "open now" : "untimed"}</div>`);
  lines.push(`<div><strong>Change</strong>${joinOrNone(selectedArray(state.changes))}</div>`);
  lines.push(`<div><strong>Threshold</strong>${joinOrNone(selectedArray(state.thresholds))}</div>`);
  els.summary.innerHTML = lines.join("");
}

function joinOrNone(items) {
  return items.length ? items.join(", ") : "not observed yet";
}

function setStageContent(kicker, title, prompt, bodyHtml, actionsHtml) {
  const animationKey = `${state.stage}:${kicker}:${title}`;
  els.kicker.textContent = kicker;
  els.title.textContent = title;
  els.prompt.textContent = prompt;
  els.body.innerHTML = bodyHtml;
  els.actions.innerHTML = actionsHtml;
  if (animationKey !== lastStageAnimationKey) {
    lastStageAnimationKey = animationKey;
    els.surface.classList.remove("is-entering");
    void els.surface.offsetWidth;
    els.surface.classList.add("is-entering");
  }
}

function renderArrive() {
  setStageContent(
    "direct observation",
    "I-Sense Observatory",
    "Look directly. Record your own result.",
    `<div class="arrival-instrument">
      <div class="arrival-starfield" aria-hidden="true"></div>
      ${renderSignalMark("signal-mark")}
      <div class="arrival-constellation" aria-hidden="true"></div>
      <div class="arrival-ground" aria-hidden="true"></div>
    </div>`,
    `<button class="primary-button ceremonial-button" type="button" data-action="begin"><span class="button-sigil" aria-hidden="true"></span><span>Begin experiment</span><span class="button-arrow" aria-hidden="true"></span></button>
     <div class="arrival-control-row" aria-label="Experiment stance">
        ${[
          ["locate", "target"],
          ["observe", "eye"],
          ["record", "circle"]
        ].map(([label, icon]) => `<span class="instrument-control ${icon}"><span></span><b>${label}</b></span>`).join("")}
      </div>
     <button class="secondary-button archive-button" type="button" data-action="view-notes"><span class="archive-icon" aria-hidden="true"></span><span>Notes</span><span class="button-arrow small" aria-hidden="true"></span></button>
     <div class="arrival-footer-ornament" aria-hidden="true"></div>`
  );
}

function renderLocate() {
  const choices = locationOptions.map((option) => {
    const selected = state.location === option ? "is-selected" : "";
    const pressed = state.location === option ? "true" : "false";
    return `<button class="choice-button ${selected}" type="button" data-location="${option}" aria-pressed="${pressed}">${option}</button>`;
  }).join("");

  setStageContent(
    "locate",
    "Find the felt center of me.",
    "Let each question angle the attention slightly differently. Choose the closest direct report.",
    `<div class="body-map">
      <div class="body-figure" aria-hidden="true">
        <span class="body-point eyes"></span>
        <span class="body-point throat"></span>
        <span class="body-point chest"></span>
        <span class="body-point abdomen"></span>
      </div>
      <div class="inquiry-stack">
        ${renderQuestionLens(locateQuestions, state.locateQuestionIndex, "next-locate-question")}
        <div class="choice-grid">${choices}</div>
      </div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next" ${state.location ? "" : "disabled"}>Continue</button>`
  );
}

function renderTexture() {
  setStageContent(
    "texture",
    "Describe how self is appearing.",
    "Use several angles. Select any qualities that fit the immediate felt experience.",
    `<div class="texture-inquiry">
       ${renderQuestionLens(textureQuestions, state.textureQuestionIndex, "next-texture-question")}
       <div class="choice-row">${renderChipButtons(textureOptions, state.textures, "texture")}</div>
     </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next">Direct observe</button>`
  );
}

function renderObserveIntro() {
  stopObserveTimer();
  setStageContent(
    "observe",
    "Observe the felt sense directly.",
    "No timer. No performance. Let the sense of me be known directly and notice whether it stays, shifts, softens, drops away, or re-forms.",
    `<div class="observe-field">
      <div class="timer-disc untimed-disc is-ready" style="--angle:0deg">
        ${renderSignalMark("timer-mark")}
        <strong>open</strong>
        <span>untimed</span>
      </div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="start-observe">Begin observing</button>`
  );
}

function startObservation() {
  stopObserveTimer();
  state.isObservingDirectly = true;
  state.observationStartedAt = Date.now();
  renderUntimedObserveActive();
}

function stopObserveTimer() {
  if (state.observeTimer) {
    window.clearInterval(state.observeTimer);
    state.observeTimer = null;
  }
  state.isPreparingObservation = false;
  state.isObservingDirectly = false;
  state.prepareEndsAt = 0;
  setMotionTarget();
}

function renderUntimedObserveActive() {
  updateStageChrome();
  setMotionTarget();
  setStageContent(
    "observing",
    "Stay with what is actually here.",
    "When something is clear enough, record it. If nothing changes, record that too.",
    `<div class="observe-field">
      <div class="timer-disc untimed-disc is-active" style="--angle:0deg">
        ${renderSignalMark("timer-mark")}
        <strong>now</strong>
        <span>directly</span>
      </div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="end-observe">Record what happened</button>`
  );
}

function renderReport() {
  setStageContent(
    "report",
    "What happened when it was observed?",
    "Select everything that actually fits. This is not a score.",
    `<div class="choice-row">${renderChipButtons(changeOptions, state.changes, "change")}</div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="after-report">Continue</button>`
  );
}

function renderThreshold() {
  setStageContent(
    "threshold",
    "What was present around the shift?",
    "Record the perceptual field without deciding what it means.",
    `<div class="choice-row">${renderChipButtons(thresholdOptions, state.thresholds, "threshold")}</div>
     <p class="stage-prompt" style="margin:24px 0 14px;font-size:1.08rem">Perception felt:</p>
     <div class="choice-row">${renderChipButtons(perceptionOptions, state.perceptions, "perception")}</div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next">Continue</button>`
  );
}

function renderNote() {
  const value = escapeHtml(state.note);
  setStageContent(
    "field note",
    "What did you directly notice?",
    "Write only what was observed. No interpretation is required.",
    `<div class="textarea-wrap">
      <textarea id="note-input" placeholder="Example: the center behind the eyes softened, then returned.">${value}</textarea>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="save-note">Save field note</button>`
  );
  const input = document.getElementById("note-input");
  input.addEventListener("input", (event) => {
    state.note = event.target.value;
  });
}

function renderSaved() {
  setStageContent(
    "saved",
    "Field note saved.",
    "The result is your own observation.",
    `<div class="choice-row">
      <span class="chip-button">local only</span>
      <span class="chip-button">no conclusion supplied</span>
    </div>`,
    `<button class="primary-button" type="button" data-action="new-session">Begin again</button>
     <button class="secondary-button" type="button" data-action="view-notes">Notes</button>
     <button class="secondary-button" type="button" data-action="view-patterns">Patterns</button>`
  );
}

function renderSignalMark(className) {
  return `<svg class="${className}" viewBox="0 0 640 640" role="img" aria-label="Side profile with five rays">
    <circle class="mark-ripple" cx="320" cy="246" r="36"></circle>
    <g class="mark-rays">
      <path class="mark-ray" pathLength="1" d="M248 248L112 184"></path>
      <path class="mark-ray" pathLength="1" d="M282 230L178 86"></path>
      <path class="mark-ray" pathLength="1" d="M321 226L321 58"></path>
      <path class="mark-ray" pathLength="1" d="M352 232L462 86"></path>
      <path class="mark-ray" pathLength="1" d="M382 248L530 184"></path>
      <circle class="mark-ray-node" cx="112" cy="184" r="6"></circle>
      <circle class="mark-ray-node" cx="178" cy="86" r="6"></circle>
      <circle class="mark-ray-node" cx="321" cy="58" r="6"></circle>
      <circle class="mark-ray-node" cx="462" cy="86" r="6"></circle>
      <circle class="mark-ray-node" cx="530" cy="184" r="6"></circle>
    </g>
    <g class="mark-figure">
      <image class="mark-head-image" href="/i-sense_observatory/logo-head-reference.png" x="0" y="0" width="640" height="640" preserveAspectRatio="none"></image>
    </g>
  </svg>`;
}

function renderQuestionLens(questions, activeIndex, action) {
  const count = questions.length;
  const normalizedIndex = ((activeIndex % count) + count) % count;
  const dots = questions.map((_, index) => (
    `<span class="${index === normalizedIndex ? "is-active" : ""}"></span>`
  )).join("");

  return `<section class="question-lens" aria-label="Inquiry angle">
    <span class="lens-label">angle ${normalizedIndex + 1} / ${count}</span>
    <p>${escapeHtml(questions[normalizedIndex])}</p>
    <button class="quiet-button lens-next" type="button" data-action="${action}">Another angle</button>
    <div class="lens-dots" aria-hidden="true">${dots}</div>
  </section>`;
}

function renderChipButtons(options, set, key) {
  return options.map((option) => {
    const selected = set.has(option) ? "is-selected" : "";
    const pressed = set.has(option) ? "true" : "false";
    return `<button class="chip-button ${selected}" type="button" data-toggle="${key}" data-value="${option}" aria-pressed="${pressed}">${option}</button>`;
  }).join("");
}

function afterReport() {
  const needsThreshold = selectedArray(state.changes).some((change) => thresholdChangeMarkers.has(change))
    || state.location === "no clear location"
    || state.location === "not present";

  setStage(needsThreshold ? 5 : 6);
}

function saveCurrentSession() {
  const session = {
    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    observationMode: "untimed",
    durationSeconds: null,
    location: state.location,
    textureMarkers: selectedArray(state.textures),
    observedChangeMarkers: selectedArray(state.changes),
    thresholdMarkers: selectedArray(state.thresholds),
    perceptionMarkers: selectedArray(state.perceptions),
    userNote: state.note.trim()
  };
  state.sessions.unshift(session);
  saveSessions();
  mutateWithTransition(() => {
    renderSaved();
    renderNotes();
    renderPatterns();
  });
}

function renderNotes() {
  if (!state.sessions.length) {
    const template = document.getElementById("empty-note-template");
    els.notesList.innerHTML = template.innerHTML;
    return;
  }

  els.notesList.innerHTML = state.sessions.map((session) => {
    const date = new Date(session.createdAt);
    const title = session.location || "unlocated";
    const tags = [
      ...session.textureMarkers,
      ...session.observedChangeMarkers,
      ...session.thresholdMarkers,
      ...session.perceptionMarkers
    ];
    return `<article class="note-item">
      <header>
        <div>
          <h3>${escapeHtml(title)}</h3>
          <time datetime="${session.createdAt}">${date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time>
        </div>
        <button class="quiet-button danger" type="button" data-delete-session="${session.id}">Delete</button>
      </header>
      <div class="note-meta">${session.durationSeconds ? `${session.durationSeconds}s observation` : "untimed observation"}</div>
      <div class="note-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || "<span>no markers</span>"}</div>
      <p>${escapeHtml(session.userNote || "No written note.")}</p>
    </article>`;
  }).join("");
}

function renderPatterns() {
  const total = state.sessions.length;
  if (!total) {
    const template = document.getElementById("empty-note-template");
    els.patternGrid.innerHTML = template.innerHTML;
    return;
  }

  const locationCounts = countBy(state.sessions.map((session) => session.location).filter(Boolean));
  const changeCounts = countBy(state.sessions.flatMap((session) => session.observedChangeMarkers));
  const thresholdCounts = countBy(state.sessions.flatMap((session) => session.thresholdMarkers));
  const perceptionCounts = countBy(state.sessions.flatMap((session) => session.perceptionMarkers));

  const droppedAway = changeCounts["dropped away briefly"] || 0;
  const reformed = changeCounts["re-formed"] || 0;
  const wide = (thresholdCounts["wide perception"] || 0) + (perceptionCounts.wide || 0);

  const patterns = [
    ["Sessions recorded", "Total local field notes.", total],
    ["Most common location", "Where me most often seemed to appear.", topCount(locationCounts)],
    ["Most common change", "What most often happened under observation.", topCount(changeCounts)],
    ["Dropped away", "Reported as a possible observation.", droppedAway],
    ["Re-forming", "Reported after observation or threshold.", reformed],
    ["Wide perception", "Wide or peripheral field reports.", wide]
  ];

  els.patternGrid.innerHTML = patterns.map(([title, description, value]) => `
    <div class="pattern-item">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
      <b>${escapeHtml(String(value || "none yet"))}</b>
    </div>
  `).join("");
}

function countBy(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

function topCount(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries[0] ? entries[0][0] : "none yet";
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(state.sessions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `i-sense-observatory-field-notes-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function clearNotes() {
  const confirmed = window.confirm("Clear all local I-Sense Observatory field notes from this browser?");
  if (!confirmed) return;
  state.sessions = [];
  saveSessions();
  renderNotes();
  renderPatterns();
}

function deleteSession(id) {
  state.sessions = state.sessions.filter((session) => session.id !== id);
  saveSessions();
  renderNotes();
  renderPatterns();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateFieldIntensity() {
  updateStageChrome();
  setMotionTarget();
}

function getChromeStage() {
  return state.view === "observatory" ? stageKeys[state.stage] || "arrive" : state.view;
}

function setMotionTarget() {
  const stage = getChromeStage();
  const profileKey = state.isPreparingObservation ? "stillness" : stage;
  const profile = state.stage === 3 && (state.observeTimer || state.isObservingDirectly) && !state.isPreparingObservation
    ? motionProfiles.observe
    : motionProfiles[profileKey] || motionProfiles.arrive;

  motionState.target = { ...profile };
  document.documentElement.style.setProperty("--field-intensity", String(profile.field));
  document.documentElement.style.setProperty("--field-aperture", String(profile.aperture));
  document.documentElement.style.setProperty("--field-peripheral", String(profile.peripheral));
  document.documentElement.style.setProperty("--field-rays", String(profile.rays));
}

function resizeCanvas() {
  canvasState.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvasState.width = window.innerWidth;
  canvasState.height = window.innerHeight;
  els.canvas.width = Math.floor(canvasState.width * canvasState.pixelRatio);
  els.canvas.height = Math.floor(canvasState.height * canvasState.pixelRatio);
  els.canvas.style.width = `${canvasState.width}px`;
  els.canvas.style.height = `${canvasState.height}px`;
  canvasState.context.setTransform(canvasState.pixelRatio, 0, 0, canvasState.pixelRatio, 0, 0);
}

function drawField(now) {
  if (document.hidden) return;

  const ctx = canvasState.context;
  const width = canvasState.width;
  const height = canvasState.height;
  const t = (now - canvasState.startedAt) / 1000;
  const delta = Math.min(0.08, Math.max(0.001, (now - motionState.lastFrameAt) / 1000));
  motionState.lastFrameAt = now;
  const ease = motionState.reducedMotion ? 1 : Math.min(1, delta * 4.4);

  Object.keys(motionState.current).forEach((key) => {
    motionState.current[key] += (motionState.target[key] - motionState.current[key]) * ease;
  });

  const intensity = motionState.current.field;
  const aperture = motionState.current.aperture;
  const peripheral = motionState.current.peripheral;
  const rayPower = motionState.current.rays;
  const stage = document.documentElement.dataset.stage || "arrive";
  ctx.clearRect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * (stage === "arrive" ? 0.48 : 0.46);
  const maxRadius = Math.max(width, height) * (0.44 + aperture * 0.23 + peripheral * 0.17);

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
  gradient.addColorStop(0, `rgba(255, 250, 240, ${0.36 + intensity * 0.24})`);
  gradient.addColorStop(0.15, `rgba(255, 250, 240, ${0.18 + intensity * 0.16})`);
  gradient.addColorStop(0.48, `rgba(188, 211, 203, ${0.08 + peripheral * 0.16})`);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  const rings = 7;
  for (let i = 0; i < rings; i += 1) {
    const phase = (t * (motionState.reducedMotion ? 0 : 0.018 + peripheral * 0.026) + i / rings) % 1;
    const radius = maxRadius * (0.08 + phase * 0.9);
    const alpha = Math.max(0, (1 - phase) * (0.055 + peripheral * 0.16));
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 250, 240, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const points = 58;
  for (let i = 0; i < points; i += 1) {
    const angle = (Math.PI * 2 * i) / points + Math.sin(t * 0.07 + i) * (motionState.reducedMotion ? 0 : 0.026);
    const spread = 0.34 + peripheral * 0.42;
    const distance = maxRadius * (0.16 + ((i * 37) % 100) / 100 * spread);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * (0.66 + peripheral * 0.12);
    ctx.beginPath();
    ctx.arc(x, y, 0.62 + peripheral * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 250, 240, ${0.08 + peripheral * 0.2})`;
    ctx.fill();
  }
  ctx.restore();

  if (rayPower > 0.08) {
    const rayBaseX = cx + Math.sin(t * 0.11) * 8;
    const rayBaseY = cy - maxRadius * 0.06;
    const rayAngles = [-2.03, -1.72, -1.42, -1.11];
    ctx.save();
    ctx.lineCap = "round";
    rayAngles.forEach((angle, index) => {
      const length = maxRadius * (stage === "threshold" ? 0.68 : 0.48) * (0.86 + index * 0.045);
      const wobble = Math.sin(t * 0.25 + index) * (motionState.reducedMotion ? 0 : 0.014);
      const endX = rayBaseX + Math.cos(angle + wobble) * length;
      const endY = rayBaseY + Math.sin(angle + wobble) * length;
      const gradientLine = ctx.createLinearGradient(rayBaseX, rayBaseY, endX, endY);
      gradientLine.addColorStop(0, `rgba(255, 250, 238, ${0.08 + rayPower * 0.26})`);
      gradientLine.addColorStop(1, "rgba(255, 250, 238, 0)");
      ctx.beginPath();
      ctx.moveTo(rayBaseX, rayBaseY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradientLine;
      ctx.lineWidth = 0.8 + rayPower * 1.2;
      ctx.stroke();
    });
    ctx.restore();
  }

  if (!motionState.reducedMotion || !motionState.renderedReducedFrame) {
    motionState.renderedReducedFrame = motionState.reducedMotion;
    requestAnimationFrame(drawField);
  }
}

function handleBodyClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) {
    const action = actionTarget.dataset.action;
    if (action === "begin") setStage(1);
    if (action === "back") setStage(state.stage - 1);
    if (action === "next") setStage(state.stage + 1);
    if (action === "after-report") afterReport();
    if (action === "start-observe") startObservation();
    if (action === "end-observe") {
      stopObserveTimer();
      setStage(4);
    }
    if (action === "next-locate-question") {
      state.locateQuestionIndex = (state.locateQuestionIndex + 1) % locateQuestions.length;
      renderWithTransition();
    }
    if (action === "next-texture-question") {
      state.textureQuestionIndex = (state.textureQuestionIndex + 1) % textureQuestions.length;
      renderWithTransition();
    }
    if (action === "save-note") saveCurrentSession();
    if (action === "new-session") resetSession();
    if (action === "view-notes") setView("notes");
    if (action === "view-patterns") setView("patterns");
    return;
  }

  const locationTarget = event.target.closest("[data-location]");
  if (locationTarget) {
    state.location = locationTarget.dataset.location;
    renderWithTransition();
    return;
  }

  const toggleTarget = event.target.closest("[data-toggle]");
  if (toggleTarget) {
    const key = toggleTarget.dataset.toggle;
    const value = toggleTarget.dataset.value;
    const map = {
      texture: state.textures,
      change: state.changes,
      threshold: state.thresholds,
      perception: state.perceptions
    };
    const set = map[key];
    if (set.has(value)) set.delete(value);
    else set.add(value);
    renderWithTransition();
    return;
  }

  const deleteTarget = event.target.closest("[data-delete-session]");
  if (deleteTarget) {
    deleteSession(deleteTarget.dataset.deleteSession);
  }
}

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.viewTarget));
});
els.exportNotes.addEventListener("click", exportNotes);
els.clearNotes.addEventListener("click", clearNotes);
document.addEventListener("click", handleBodyClick);
window.addEventListener("resize", resizeCanvas);
reduceMotionQuery.addEventListener("change", (event) => {
  motionState.reducedMotion = event.matches;
  motionState.renderedReducedFrame = false;
  requestAnimationFrame(drawField);
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !motionState.reducedMotion) {
    motionState.lastFrameAt = performance.now();
    requestAnimationFrame(drawField);
  }
});

resizeCanvas();
render();
renderNotes();
renderPatterns();
requestAnimationFrame(drawField);
