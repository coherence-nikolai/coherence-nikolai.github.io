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

const durationOptions = [30, 60, 90];

const state = {
  view: "observatory",
  stage: 0,
  location: "",
  textures: new Set(),
  duration: 60,
  changes: new Set(),
  thresholds: new Set(),
  perceptions: new Set(),
  note: "",
  observeEndsAt: 0,
  observeTimer: null,
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
  state.location = "";
  state.textures = new Set();
  state.duration = 60;
  state.changes = new Set();
  state.thresholds = new Set();
  state.perceptions = new Set();
  state.note = "";
  state.observeEndsAt = 0;
  render();
}

function setView(view) {
  state.view = view;
  els.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.viewTarget === view);
  });
  Object.entries(els.views).forEach(([name, element]) => {
    element.classList.toggle("is-active", name === view);
  });
  if (view === "notes") renderNotes();
  if (view === "patterns") renderPatterns();
}

function setStage(stage) {
  state.stage = Math.max(0, Math.min(stage, stageOrder.length - 1));
  render();
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

function renderSteps() {
  els.stepList.innerHTML = stageOrder.map((step, index) => {
    const className = index < state.stage ? "is-complete" : index === state.stage ? "is-current" : "";
    return `<li class="${className}">${step}</li>`;
  }).join("");
}

function updateStageChrome() {
  const key = stageKeys[state.stage] || "arrive";
  document.documentElement.dataset.stage = key;
  document.documentElement.classList.toggle("is-observing", state.stage === 3 && Boolean(state.observeTimer));
}

function renderSummary() {
  const lines = [];
  lines.push(`<div><strong>Location</strong>${state.location || "not observed yet"}</div>`);
  lines.push(`<div><strong>Texture</strong>${joinOrNone(selectedArray(state.textures))}</div>`);
  lines.push(`<div><strong>Duration</strong>${state.duration} seconds</div>`);
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
    "No belief is required. No conclusion is supplied. Look directly. Record your own result.",
    `<div class="arrival-instrument">
      ${renderSignalMark("signal-mark")}
      <div class="choice-row" aria-label="Experiment stance">
        ${["locate", "observe", "record"].map((label) => `<span class="chip-button quiet-chip">${label}</span>`).join("")}
      </div>
    </div>`,
    `<button class="primary-button" type="button" data-action="begin">Begin experiment</button>
     <button class="secondary-button" type="button" data-action="view-notes">View notes</button>`
  );
}

function renderLocate() {
  const choices = locationOptions.map((option) => {
    const selected = state.location === option ? "is-selected" : "";
    return `<button class="choice-button ${selected}" type="button" data-location="${option}">${option}</button>`;
  }).join("");

  setStageContent(
    "locate",
    "Where does \"me\" seem to be felt?",
    "Choose the closest report. No location and no clear location are valid observations.",
    `<div class="body-map">
      <div class="body-figure" aria-hidden="true">
        <span class="body-point eyes"></span>
        <span class="body-point throat"></span>
        <span class="body-point chest"></span>
        <span class="body-point abdomen"></span>
      </div>
      <div class="choice-grid">${choices}</div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next" ${state.location ? "" : "disabled"}>Continue</button>`
  );
}

function renderTexture() {
  setStageContent(
    "texture",
    "What is its felt texture?",
    "Select any qualities that fit the immediate felt sense.",
    `<div class="choice-row">${renderChipButtons(textureOptions, state.textures, "texture")}</div>
     <div class="choice-row" style="margin-top:18px" aria-label="Observation duration">
       ${durationOptions.map((seconds) => `<button class="chip-button ${state.duration === seconds ? "is-selected" : ""}" type="button" data-duration="${seconds}">${seconds}s</button>`).join("")}
     </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="next">Observe</button>`
  );
}

function renderObserveIntro() {
  stopObserveTimer();
  setStageContent(
    "observe",
    "Rest attention on the felt sense.",
    "Do not analyze it. Observe whether it stays, shifts, softens, drops away, or re-forms.",
    `<div class="observe-field">
      <div class="timer-disc is-ready" style="--angle:0deg">
        ${renderSignalMark("timer-mark")}
        <strong>${state.duration}</strong>
        <span>seconds</span>
      </div>
    </div>`,
    `<button class="secondary-button" type="button" data-action="back">Back</button>
     <button class="primary-button" type="button" data-action="start-observe">Start ${state.duration}s</button>`
  );
}

function startObservation() {
  stopObserveTimer();
  state.observeEndsAt = Date.now() + state.duration * 1000;
  state.observeTimer = window.setInterval(renderObserveActive, 250);
  renderObserveActive();
}

function renderObserveActive() {
  const remainingMs = Math.max(0, state.observeEndsAt - Date.now());
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const elapsed = state.duration - remainingMs / 1000;
  const progress = Math.max(0, Math.min(1, elapsed / state.duration));
  const angle = Math.round(progress * 360);

  const activeDisc = els.body.querySelector(".timer-disc.is-active");
  if (activeDisc) {
    activeDisc.style.setProperty("--angle", `${angle}deg`);
    const number = activeDisc.querySelector("strong");
    if (number) number.textContent = String(remainingSeconds);
  } else {
    setStageContent(
      "observing",
      "Observe directly.",
      "Let the felt sense be seen. If nothing changes, record that.",
      `<div class="observe-field">
        <div class="timer-disc is-active" style="--angle:${angle}deg">
          ${renderSignalMark("timer-mark")}
          <strong>${remainingSeconds}</strong>
          <span>remaining</span>
        </div>
      </div>`,
      `<button class="secondary-button" type="button" data-action="end-observe">End early</button>`
    );
  }
  updateFieldIntensity();

  if (remainingMs <= 0) {
    stopObserveTimer();
    setStage(4);
  }
}

function stopObserveTimer() {
  if (state.observeTimer) {
    window.clearInterval(state.observeTimer);
    state.observeTimer = null;
  }
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
     <button class="secondary-button" type="button" data-action="view-notes">View notes</button>
     <button class="secondary-button" type="button" data-action="view-patterns">View patterns</button>`
  );
}

function renderSignalMark(className) {
  return `<svg class="${className}" viewBox="0 0 220 220" role="img" aria-label="Side profile with four rays">
    <path class="mark-ray" d="M83 66L63 18"></path>
    <path class="mark-ray" d="M97 57L95 8"></path>
    <path class="mark-ray" d="M111 56L126 9"></path>
    <path class="mark-ray" d="M124 63L158 21"></path>
    <path class="mark-head" d="M45 199c9-28 27-39 42-55 9-10 11-23 4-34-10-15-9-33 2-48 12-16 32-24 51-19 20 5 34 21 37 42 1 7 5 12 11 15l16 9-17 6c-4 2-6 6-6 10l2 13-18-3c-8-1-16 4-18 12l-4 20"></path>
    <path class="mark-face" d="M137 82c8-6 17-6 25-1M160 98c6 2 9 6 9 12M133 105c8-4 17-3 24 2M117 128c12 7 25 8 37 4M86 169c18-9 36-10 55-1"></path>
    <path class="mark-eye" d="M146 90c6 5 13 4 19-1"></path>
  </svg>`;
}

function renderChipButtons(options, set, key) {
  return options.map((option) => {
    const selected = set.has(option) ? "is-selected" : "";
    return `<button class="chip-button ${selected}" type="button" data-toggle="${key}" data-value="${option}">${option}</button>`;
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
    durationSeconds: state.duration,
    location: state.location,
    textureMarkers: selectedArray(state.textures),
    observedChangeMarkers: selectedArray(state.changes),
    thresholdMarkers: selectedArray(state.thresholds),
    perceptionMarkers: selectedArray(state.perceptions),
    userNote: state.note.trim()
  };
  state.sessions.unshift(session);
  saveSessions();
  renderSaved();
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
      <div class="note-meta">${session.durationSeconds}s observation</div>
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
  const observing = state.stage === 3 && state.observeTimer;
  const threshold = state.stage === 5;
  const intensity = observing ? 1 : threshold ? 0.72 : state.stage >= 4 ? 0.42 : 0.18;
  document.documentElement.style.setProperty("--field-intensity", String(intensity));
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
  const ctx = canvasState.context;
  const width = canvasState.width;
  const height = canvasState.height;
  const t = (now - canvasState.startedAt) / 1000;
  const intensity = Number(getComputedStyle(document.documentElement).getPropertyValue("--field-intensity")) || 0.18;
  const stage = document.documentElement.dataset.stage || "arrive";
  ctx.clearRect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * 0.46;
  const maxRadius = Math.max(width, height) * (0.48 + intensity * 0.34);

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${0.88 + intensity * 0.1})`);
  gradient.addColorStop(0.18, `rgba(255, 255, 255, ${0.38 + intensity * 0.24})`);
  gradient.addColorStop(0.52, `rgba(196, 205, 201, ${0.16 + intensity * 0.14})`);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  const rings = 7;
  for (let i = 0; i < rings; i += 1) {
    const phase = (t * 0.035 + i / rings) % 1;
    const radius = maxRadius * (0.08 + phase * 0.9);
    const alpha = Math.max(0, (1 - phase) * (0.12 + intensity * 0.18));
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const points = 44;
  for (let i = 0; i < points; i += 1) {
    const angle = (Math.PI * 2 * i) / points + Math.sin(t * 0.12 + i) * 0.04;
    const distance = maxRadius * (0.12 + ((i * 37) % 100) / 100 * (0.42 + intensity * 0.26));
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * 0.72;
    ctx.beginPath();
    ctx.arc(x, y, 1.1 + intensity * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.14 + intensity * 0.22})`;
    ctx.fill();
  }
  ctx.restore();

  if (intensity > 0.38) {
    const rayBaseX = cx + Math.sin(t * 0.11) * 8;
    const rayBaseY = cy - maxRadius * 0.06;
    const rayAngles = [-2.03, -1.72, -1.42, -1.11];
    ctx.save();
    ctx.lineCap = "round";
    rayAngles.forEach((angle, index) => {
      const length = maxRadius * (stage === "threshold" ? 0.74 : 0.56) * (0.86 + index * 0.045);
      const wobble = Math.sin(t * 0.38 + index) * 0.018;
      const endX = rayBaseX + Math.cos(angle + wobble) * length;
      const endY = rayBaseY + Math.sin(angle + wobble) * length;
      const gradientLine = ctx.createLinearGradient(rayBaseX, rayBaseY, endX, endY);
      gradientLine.addColorStop(0, `rgba(255, 250, 238, ${0.12 + intensity * 0.28})`);
      gradientLine.addColorStop(1, "rgba(255, 250, 238, 0)");
      ctx.beginPath();
      ctx.moveTo(rayBaseX, rayBaseY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradientLine;
      ctx.lineWidth = 1.2 + intensity * 1.2;
      ctx.stroke();
    });
    ctx.restore();
  }

  requestAnimationFrame(drawField);
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
    if (action === "save-note") saveCurrentSession();
    if (action === "new-session") resetSession();
    if (action === "view-notes") setView("notes");
    if (action === "view-patterns") setView("patterns");
    return;
  }

  const locationTarget = event.target.closest("[data-location]");
  if (locationTarget) {
    state.location = locationTarget.dataset.location;
    render();
    return;
  }

  const durationTarget = event.target.closest("[data-duration]");
  if (durationTarget) {
    state.duration = Number(durationTarget.dataset.duration);
    render();
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
    render();
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

resizeCanvas();
render();
renderNotes();
renderPatterns();
requestAnimationFrame(drawField);
