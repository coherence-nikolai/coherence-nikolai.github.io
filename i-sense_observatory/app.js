import {
  createEmptyFirstRead,
  firstReadQuestions,
  getLensById,
  lensLibrary,
  remainsMarkers as remainsOptions,
  resultMarkers as resultOptions,
  suggestLensIds,
  summarizePatterns
} from "./lens-model.mjs?v=20260618-phone-layout";

const storageKey = "i-sense-observatory.sessions.v1";

const stageOrder = [
  "Arrive",
  "First Read",
  "Route",
  "Lens",
  "Observe",
  "Result",
  "Note"
];

const stageKeys = [
  "arrive",
  "calibrate",
  "route",
  "lens",
  "observe",
  "result",
  "note"
];

const state = {
  view: "observatory",
  stage: 0,
  calibrationIndex: 0,
  firstRead: createEmptyFirstRead(),
  selectedLensId: "",
  lensPromptIndex: 0,
  lensMarkers: new Set(),
  resultMarkers: new Set(),
  remainsMarkers: new Set(),
  note: "",
  isObservingDirectly: false,
  observationStartedAt: 0,
  sessions: loadSessions()
};

let lastStageAnimationKey = "";

const els = {
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
  calibrate: { field: 0.28, aperture: 1.02, peripheral: 0.24, rays: 0.08 },
  route: { field: 0.32, aperture: 1.08, peripheral: 0.32, rays: 0.1 },
  lens: { field: 0.42, aperture: 1.12, peripheral: 0.46, rays: 0.18 },
  observe: { field: 0.72, aperture: 1.26, peripheral: 0.9, rays: 0.48 },
  result: { field: 0.44, aperture: 1.12, peripheral: 0.5, rays: 0.12 },
  note: { field: 0.38, aperture: 1.08, peripheral: 0.42, rays: 0.08 },
  notes: { field: 0.36, aperture: 1.04, peripheral: 0.36, rays: 0 },
  patterns: { field: 0.46, aperture: 1.14, peripheral: 0.56, rays: 0.08 },
  about: { field: 0.34, aperture: 1.06, peripheral: 0.34, rays: 0 }
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
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map(normalizeSession);
  } catch {
    return [];
  }
}

function normalizeSession(session) {
  if (session.firstRead) return session;
  const lens = getLensById(session.lensId || "location");
  return {
    ...session,
    lensId: lens.id,
    lensTitle: lens.title,
    firstRead: {
      location: session.location || "",
      textures: session.textureMarkers || [],
      stability: "",
      observer: "",
      agency: "",
      tone: ""
    },
    lensMarkers: session.textureMarkers || [],
    resultMarkers: session.observedChangeMarkers || [],
    remainsMarkers: [
      ...(session.thresholdMarkers || []),
      ...(session.perceptionMarkers || [])
    ],
    userNote: session.userNote || ""
  };
}

function saveSessions() {
  localStorage.setItem(storageKey, JSON.stringify(state.sessions));
}

function resetDraft() {
  stopObservation();
  state.calibrationIndex = 0;
  state.firstRead = createEmptyFirstRead();
  state.selectedLensId = "";
  state.lensPromptIndex = 0;
  state.lensMarkers = new Set();
  state.resultMarkers = new Set();
  state.remainsMarkers = new Set();
  state.note = "";
}

function resetSession() {
  resetDraft();
  state.stage = 1;
  renderWithTransition();
}

function setView(view) {
  mutateWithTransition(() => {
    const previousView = state.view;
    state.view = view;
    if (previousView === "observatory" && view !== "observatory") stopObservation();
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
    if (state.stage === 4 && nextStage !== 4) stopObservation();
    if (nextStage === 3 && !state.selectedLensId) chooseLens(suggestLensIds(state.firstRead)[0], false);
    state.stage = nextStage;
    render();
  });
}

function goBack() {
  if (state.stage === 1 && state.calibrationIndex > 0) {
    state.calibrationIndex -= 1;
    renderWithTransition();
    return;
  }
  setStage(state.stage - 1);
}

function render() {
  updateStageChrome();
  renderSteps();
  renderSummary();

  const renderer = [
    renderArrive,
    renderFirstRead,
    renderRoute,
    renderLens,
    renderObserve,
    renderResult,
    renderNote
  ][state.stage];

  renderer();
  updateFieldIntensity();
}

function renderWithTransition() {
  mutateWithTransition(render);
}

function mutateWithTransition(mutate) {
  mutate();
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
  document.documentElement.classList.toggle("is-observing", state.view === "observatory" && state.stage === 4 && state.isObservingDirectly);
}

function renderSummary() {
  const lens = getSelectedLens();
  const lines = [
    ["Location", state.firstRead.location || "not observed yet"],
    ["Texture", joinOrNone(state.firstRead.textures)],
    ["Lens", state.selectedLensId ? lens.shortTitle : "not chosen yet"],
    ["Lens markers", joinOrNone(selectedArray(state.lensMarkers))],
    ["Result", joinOrNone(selectedArray(state.resultMarkers))],
    ["Remains", joinOrNone(selectedArray(state.remainsMarkers))]
  ];

  els.summary.innerHTML = lines.map(([label, value]) => `<div><strong>${label}</strong>${escapeHtml(value)}</div>`).join("");
}

function selectedArray(set) {
  return Array.from(set);
}

function joinOrNone(items) {
  return items && items.length ? items.join(", ") : "not observed yet";
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

function renderFirstRead() {
  const question = firstReadQuestions[state.calibrationIndex];
  const isLast = state.calibrationIndex === firstReadQuestions.length - 1;
  const canAdvance = firstReadHasAnswer(question);
  const progressDots = firstReadQuestions.map((_, index) => (
    `<span class="${index === state.calibrationIndex ? "is-active" : ""}"></span>`
  )).join("");
  const choices = question.options.map((option) => renderFirstReadChoice(question, option)).join("");

  setStageContent(
    "first read",
    "Tune the instrument.",
    "A few direct reports find the door that is alive now. No lens is primary.",
    `<div class="calibration-chamber">
      <section class="question-lens calibration-lens" aria-label="First read question">
        <span class="lens-label">${escapeHtml(question.title)} ${state.calibrationIndex + 1} / ${firstReadQuestions.length}</span>
        <p>${escapeHtml(question.question)}</p>
        <small>${escapeHtml(question.help)}</small>
        <div class="lens-dots" aria-hidden="true">${progressDots}</div>
      </section>
      <div class="choice-grid calibration-grid ${question.mode === "multi" ? "is-multi" : ""}">
        ${choices}
      </div>
      <div class="first-read-summary">${renderFirstReadSummary()}</div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next-calibration" ${canAdvance ? "" : "disabled"}>${isLast ? "Suggest lenses" : "Continue"}</button>`
  );
}

function renderFirstReadChoice(question, option) {
  const escaped = escapeHtml(option);
  if (question.mode === "multi") {
    const selected = state.firstRead[question.id].includes(option);
    return `<button class="choice-button ${selected ? "is-selected" : ""}" type="button" data-first-read-toggle="${question.id}" data-value="${escaped}" aria-pressed="${selected ? "true" : "false"}">${escaped}</button>`;
  }
  const selected = state.firstRead[question.id] === option;
  return `<button class="choice-button ${selected ? "is-selected" : ""}" type="button" data-first-read-single="${question.id}" data-value="${escaped}" aria-pressed="${selected ? "true" : "false"}">${escaped}</button>`;
}

function firstReadHasAnswer(question) {
  const value = state.firstRead[question.id];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function renderFirstReadSummary() {
  const items = [
    ["location", state.firstRead.location],
    ["texture", joinOrNone(state.firstRead.textures)],
    ["stability", state.firstRead.stability],
    ["observer", state.firstRead.observer],
    ["agency", state.firstRead.agency],
    ["tone", state.firstRead.tone]
  ];
  return items
    .filter(([, value]) => value && value !== "not observed yet")
    .map(([label, value]) => `<span><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`)
    .join("") || `<span><b>first read</b>waiting for direct markers</span>`;
}

function renderRoute() {
  const suggestedIds = suggestLensIds(state.firstRead);
  const suggestedCards = suggestedIds.slice(0, 3).map((id, index) => renderLensCard(getLensById(id), index === 0, "suggested")).join("");
  const libraryCards = lensLibrary.map((lens) => renderLensCard(lens, false, "library")).join("");

  setStageContent(
    "route",
    "Choose the next lens.",
    "The app can suggest from your First Read, or you can choose freely.",
    `<div class="route-shell">
      <section class="readout-panel">
        <span class="lens-label">calibration readout</span>
        <div class="first-read-summary is-large">${renderFirstReadSummary()}</div>
      </section>
      <section class="lens-rack">
        <div class="rack-head">
          <span class="lens-label">suggested doors</span>
          <p>Suggestion is only routing, not a conclusion.</p>
        </div>
        <div class="lens-card-grid is-suggested">${suggestedCards}</div>
      </section>
      <section class="lens-rack">
        <div class="rack-head">
          <span class="lens-label">all lenses</span>
          <p>Every route remains available.</p>
        </div>
        <div class="lens-card-grid">${libraryCards}</div>
      </section>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="choose-suggested">Use first suggestion</button>`
  );
}

function renderLensCard(lens, recommended, context) {
  return `<button class="lens-card ${recommended ? "is-recommended" : ""}" type="button" data-lens-id="${lens.id}" data-context="${context}">
    <span>${escapeHtml(lens.lineage)}</span>
    <strong>${escapeHtml(lens.shortTitle)}</strong>
    <small>${escapeHtml(lens.aim)}</small>
  </button>`;
}

function renderLens() {
  const lens = getSelectedLens();
  const promptIndex = state.lensPromptIndex % lens.prompts.length;
  const markers = renderChipButtons(lens.markers, state.lensMarkers, "lens");
  const dots = lens.prompts.map((_, index) => `<span class="${index === promptIndex ? "is-active" : ""}"></span>`).join("");

  setStageContent(
    lens.lineage,
    lens.title,
    lens.aim,
    `<div class="lens-chamber">
      <div class="lens-compass" aria-hidden="true"><span></span></div>
      <section class="question-lens">
        <span class="lens-label">inquiry ${promptIndex + 1} / ${lens.prompts.length}</span>
        <p>${escapeHtml(lens.prompts[promptIndex])}</p>
        <div class="lens-dots" aria-hidden="true">${dots}</div>
      </section>
      <div class="marker-field">
        <span class="lens-label">direct markers</span>
        <div class="choice-row">${markers}</div>
      </div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Lenses</button>
     <button class="secondary-button" type="button" data-action="next-lens-prompt">Another prompt</button>
     <button class="primary-button" type="button" data-action="next">Direct observe</button>`
  );
}

function renderObserve() {
  const lens = getSelectedLens();
  const observing = state.isObservingDirectly;

  setStageContent(
    observing ? "observing" : "observe",
    observing ? "Stay with what is actually here." : "Observe through the lens.",
    observing ? "When something is clear enough, record it. If nothing changes, record that too." : "No timer. Let the lens point attention, then watch what happens directly.",
    `<div class="observe-field">
      <div class="timer-disc untimed-disc ${observing ? "is-active" : "is-ready"}" style="--angle:0deg">
        ${renderSignalMark("timer-mark")}
        <strong>${observing ? "now" : "open"}</strong>
        <span>${escapeHtml(lens.shortTitle)}</span>
      </div>
      <div class="observe-readout">
        <span>${escapeHtml(lens.title)}</span>
        <b>${escapeHtml(joinOrNone(selectedArray(state.lensMarkers)))}</b>
      </div>
    </div>`,
    observing
      ? `<button class="secondary-button" type="button" data-action="back">Back</button>
         <button class="primary-button" type="button" data-action="end-observe">Record what happened</button>`
      : `<button class="secondary-button" type="button" data-action="back">Back</button>
         <button class="primary-button" type="button" data-action="start-observe">Begin observing</button>`
  );
}

function startObservation() {
  state.isObservingDirectly = true;
  state.observationStartedAt = Date.now();
  renderWithTransition();
}

function stopObservation() {
  state.isObservingDirectly = false;
  state.observationStartedAt = 0;
  setMotionTarget();
}

function renderResult() {
  setStageContent(
    "result",
    "What changed?",
    "Record what happened under observation without deciding what it means.",
    `<div class="result-chamber">
      <section class="marker-field">
        <span class="lens-label">self-sense</span>
        <div class="choice-row">${renderChipButtons(resultOptions, state.resultMarkers, "result")}</div>
      </section>
      <section class="marker-field">
        <span class="lens-label">what remained present</span>
        <div class="choice-row">${renderChipButtons(remainsOptions, state.remainsMarkers, "remains")}</div>
      </section>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next">Continue to note</button>`
  );
}

function renderNote() {
  const lens = getSelectedLens();
  const value = escapeHtml(state.note);
  setStageContent(
    "field note",
    "What did you directly notice?",
    "Write only what was observed. No interpretation is required.",
    `<div class="note-chamber">
      <div class="structured-note">
        <span><b>Lens</b>${escapeHtml(lens.shortTitle)}</span>
        <span><b>First read</b>${escapeHtml(state.firstRead.location || "unlocated")} / ${escapeHtml(joinOrNone(state.firstRead.textures))}</span>
        <span><b>Result</b>${escapeHtml(joinOrNone(selectedArray(state.resultMarkers)))}</span>
      </div>
      <div class="textarea-wrap">
        <textarea id="note-input" placeholder="Example: watcher behind the eyes became pressure and image, then softened.">${value}</textarea>
      </div>
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
  const lens = getSelectedLens();
  setStageContent(
    "saved",
    "Field note saved.",
    `${lens.shortTitle} recorded. The result is your own observation.`,
    `<div class="choice-row">
      <span class="chip-button">local only</span>
      <span class="chip-button">no conclusion supplied</span>
      <span class="chip-button">${escapeHtml(lens.shortTitle)}</span>
    </div>`,
    `<button class="primary-button" type="button" data-action="new-session">Begin again</button>
     <button class="secondary-button" type="button" data-action="view-notes">Notes</button>
     <button class="secondary-button" type="button" data-action="view-patterns">Patterns</button>`
  );
}

function renderChipButtons(options, set, key) {
  return options.map((option) => {
    const selected = set.has(option);
    const escaped = escapeHtml(option);
    return `<button class="chip-button ${selected ? "is-selected" : ""}" type="button" data-toggle="${key}" data-value="${escaped}" aria-pressed="${selected ? "true" : "false"}">${escaped}</button>`;
  }).join("");
}

function chooseLens(id, rerender = true) {
  state.selectedLensId = id;
  state.lensPromptIndex = 0;
  state.lensMarkers = new Set();
  if (rerender) setStage(3);
}

function getSelectedLens() {
  return getLensById(state.selectedLensId || suggestLensIds(state.firstRead)[0]);
}

function saveCurrentSession() {
  const lens = getSelectedLens();
  const session = {
    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    lensId: lens.id,
    lensTitle: lens.title,
    firstRead: {
      ...state.firstRead,
      textures: [...state.firstRead.textures]
    },
    lensMarkers: selectedArray(state.lensMarkers),
    resultMarkers: selectedArray(state.resultMarkers),
    remainsMarkers: selectedArray(state.remainsMarkers),
    observationMode: "untimed",
    durationSeconds: null,
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
    const lens = getLensById(session.lensId);
    const firstRead = session.firstRead || createEmptyFirstRead();
    const tags = [
      ...(firstRead.textures || []),
      ...(session.lensMarkers || []),
      ...(session.resultMarkers || []),
      ...(session.remainsMarkers || [])
    ];
    return `<article class="note-item">
      <header>
        <div>
          <h3>${escapeHtml(lens.shortTitle)} / ${escapeHtml(firstRead.location || "unlocated")}</h3>
          <time datetime="${session.createdAt}">${date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</time>
        </div>
        <button class="quiet-button danger" type="button" data-delete-session="${session.id}">Delete</button>
      </header>
      <div class="note-meta">${escapeHtml(lens.title)} / untimed observation</div>
      <div class="note-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || "<span>no markers</span>"}</div>
      <p>${escapeHtml(session.userNote || "No written note.")}</p>
    </article>`;
  }).join("");
}

function renderPatterns() {
  const summary = summarizePatterns(state.sessions);
  if (!summary.total) {
    const template = document.getElementById("empty-note-template");
    els.patternGrid.innerHTML = template.innerHTML;
    return;
  }

  const patterns = [
    ["Sessions", "Total local field notes.", summary.total],
    ["Most used lens", "The lens most often explored.", labelLens(summary.topLens)],
    ["Common location", "Where me most often seemed to gather.", summary.topLocation],
    ["Common texture", "What the self-sense most often seemed made of.", summary.topTexture],
    ["Common result", "Most repeated observation result.", summary.topResult],
    ["Dropped away", "Reported as a possible observation.", summary.droppedAway],
    ["Became unclear", "Reported when self-sense lost definition.", summary.becameUnclear],
    ["Re-formed", "Reported after softening or absence.", summary.reformed],
    ["Widened / space", "Wide field or space reports.", summary.widened]
  ];

  els.patternGrid.innerHTML = patterns.map(([title, description, value]) => `
    <div class="pattern-item">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
      <b>${escapeHtml(String(value || "none yet"))}</b>
    </div>
  `).join("");
}

function labelLens(id) {
  if (id === "none yet") return id;
  return getLensById(id).shortTitle;
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

function updateFieldIntensity() {
  updateStageChrome();
  setMotionTarget();
}

function getChromeStage() {
  return state.view === "observatory" ? stageKeys[state.stage] || "arrive" : state.view;
}

function setMotionTarget() {
  const stage = getChromeStage();
  const profile = state.stage === 4 && state.isObservingDirectly
    ? motionProfiles.observe
    : motionProfiles[stage] || motionProfiles.arrive;

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

  const points = 62;
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
    const rayAngles = [-2.15, -1.86, -1.57, -1.28, -0.99];
    ctx.save();
    ctx.lineCap = "round";
    rayAngles.forEach((angle, index) => {
      const length = maxRadius * (stage === "result" ? 0.5 : 0.58) * (0.86 + index * 0.035);
      const wobble = Math.sin(t * 0.25 + index) * (motionState.reducedMotion ? 0 : 0.012);
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
  const lensTarget = event.target.closest("[data-lens-id]");
  if (lensTarget) {
    chooseLens(lensTarget.dataset.lensId);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) {
    const action = actionTarget.dataset.action;
    if (action === "begin") {
      resetDraft();
      setStage(1);
    }
    if (action === "back") goBack();
    if (action === "next") setStage(state.stage + 1);
    if (action === "next-calibration") advanceCalibration();
    if (action === "choose-suggested") chooseLens(suggestLensIds(state.firstRead)[0]);
    if (action === "next-lens-prompt") {
      const lens = getSelectedLens();
      state.lensPromptIndex = (state.lensPromptIndex + 1) % lens.prompts.length;
      renderWithTransition();
    }
    if (action === "start-observe") startObservation();
    if (action === "end-observe") {
      stopObservation();
      setStage(5);
    }
    if (action === "save-note") saveCurrentSession();
    if (action === "new-session") resetSession();
    if (action === "view-notes") setView("notes");
    if (action === "view-patterns") setView("patterns");
    return;
  }

  const singleTarget = event.target.closest("[data-first-read-single]");
  if (singleTarget) {
    state.firstRead[singleTarget.dataset.firstReadSingle] = singleTarget.dataset.value;
    renderWithTransition();
    return;
  }

  const firstReadToggle = event.target.closest("[data-first-read-toggle]");
  if (firstReadToggle) {
    const key = firstReadToggle.dataset.firstReadToggle;
    const value = firstReadToggle.dataset.value;
    const values = state.firstRead[key];
    if (values.includes(value)) state.firstRead[key] = values.filter((item) => item !== value);
    else state.firstRead[key] = [...values, value];
    renderWithTransition();
    return;
  }

  const toggleTarget = event.target.closest("[data-toggle]");
  if (toggleTarget) {
    const key = toggleTarget.dataset.toggle;
    const value = toggleTarget.dataset.value;
    const map = {
      lens: state.lensMarkers,
      result: state.resultMarkers,
      remains: state.remainsMarkers
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

function advanceCalibration() {
  if (state.calibrationIndex < firstReadQuestions.length - 1) {
    state.calibrationIndex += 1;
    renderWithTransition();
    return;
  }
  setStage(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
