const steps = [
  { id: "notice", label: "Notice", title: "What has authority?", body: "Name the pressure, fear, story, or demand that has been steering attention." },
  { id: "revoke", label: "Revoke", title: "Strip it of authority.", body: "Let the old governor lose its right to command the field." },
  { id: "choose", label: "Choose", title: "Choose your new orientation.", body: "Select a tone that still feels like you, only clearer." },
  { id: "hold", label: "Hold", title: "Hold the new tone.", body: "Breathe with the field until the statement has weight." },
  { id: "integrate", label: "Integrate", title: "Reflect and anchor.", body: "Save what changed so the tone can return." }
];

const authorityOptions = [
  "Self-doubt",
  "Fear",
  "Regret",
  "Pressure",
  "Old story",
  "Someone else's urgency",
  "Comparison",
  "Other"
];

const tones = [
  { id: "clarity", label: "Clarity", statement: "I choose the clear line inside me.", hz: 741, color: "#82b5d2" },
  { id: "courage", label: "Courage", statement: "I choose the strength to meet this directly.", hz: 396, color: "#ca825a" },
  { id: "stillness", label: "Stillness", statement: "I choose stillness before reaction.", hz: 285, color: "#a4b8c6" },
  { id: "trust", label: "Trust", statement: "I choose the ground that does not rush.", hz: 507, color: "#83b79a" },
  { id: "forgiveness", label: "Forgiveness", statement: "I release the hook and keep my center.", hz: 417, color: "#bfa76a" },
  { id: "strength", label: "Strength", statement: "I choose the spine of my own yes.", hz: 852, color: "#7f8ae7" },
  { id: "compassion", label: "Compassion", statement: "I choose warmth without surrendering myself.", hz: 594, color: "#c68daf" },
  { id: "wonder", label: "Wonder", statement: "I choose the wider field.", hz: 963, color: "#7e92e8" }
];

const reflections = [
  "Lighter",
  "Clearer",
  "Steadier",
  "Wider",
  "Warmer",
  "Unmoved"
];

const storageKey = "tone-sovereign.sessions.v1";
const app = document.querySelector("#app");
const canvas = document.querySelector("#field-canvas");
const context = canvas.getContext("2d", { alpha: true });
const template = document.querySelector("#session-template");

const state = {
  step: 0,
  authority: "",
  customAuthority: "",
  selectedToneId: "clarity",
  customStatement: "",
  holdDuration: 60,
  holdStartedAt: 0,
  holdElapsed: 0,
  reflection: "",
  note: "",
  sessions: loadSessions(),
  status: ""
};

let animationFrame = 0;
let holdTimer = 0;
let audio = null;

function selectedTone() {
  return tones.find(tone => tone.id === state.selectedToneId) || tones[0];
}

function currentAuthority() {
  return state.authority === "Other" ? state.customAuthority.trim() : state.authority;
}

function currentStatement() {
  return state.customStatement.trim() || selectedTone().statement;
}

function canContinue() {
  switch (steps[state.step].id) {
    case "notice":
      return currentAuthority().length > 1;
    case "choose":
      return Boolean(state.selectedToneId);
    case "integrate":
      return state.reflection.length > 0;
    default:
      return true;
  }
}

function loadSessions() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions() {
  localStorage.setItem(storageKey, JSON.stringify(state.sessions));
}

function resetRitual() {
  stopHold();
  state.step = 0;
  state.authority = "";
  state.customAuthority = "";
  state.selectedToneId = "clarity";
  state.customStatement = "";
  state.holdDuration = 60;
  state.holdElapsed = 0;
  state.reflection = "";
  state.note = "";
  state.status = "";
  render();
}

function goToStep(index) {
  if (index < 0 || index >= steps.length) {
    return;
  }
  if (steps[state.step].id === "hold" && index !== state.step) {
    stopHold();
  }
  state.step = index;
  state.status = "";
  render();
}

function nextStep() {
  if (!canContinue()) {
    state.status = "Complete this chamber before continuing.";
    render();
    return;
  }

  if (state.step < steps.length - 1) {
    goToStep(state.step + 1);
  }
}

function previousStep() {
  goToStep(Math.max(0, state.step - 1));
}

function saveSession() {
  const tone = selectedTone();
  const session = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    authority: currentAuthority(),
    tone: tone.label,
    toneId: tone.id,
    statement: currentStatement(),
    frequency: tone.hz,
    holdDuration: state.holdDuration,
    reflection: state.reflection,
    note: state.note.trim(),
    createdAt: new Date().toISOString()
  };

  state.sessions = [session, ...state.sessions].slice(0, 30);
  saveSessions();
  state.status = "Saved locally.";
  stopHold();
  render();
}

function exportSessions() {
  const payload = JSON.stringify({ app: "Tone Sovereign", version: 1, sessions: state.sessions }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tone-sovereign-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importSessions(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const incoming = Array.isArray(parsed.sessions) ? parsed.sessions : [];
      state.sessions = [...incoming, ...state.sessions]
        .filter((session, index, all) => all.findIndex(item => item.id === session.id) === index)
        .slice(0, 30);
      saveSessions();
      state.status = "Imported locally.";
      render();
    } catch {
      state.status = "That file did not look like a Tone Sovereign export.";
      render();
    }
  };
  reader.readAsText(file);
}

function startHold() {
  if (!audio) {
    audio = new SovereignAudio();
  }
  audio.start(selectedTone().hz);
  state.holdStartedAt = performance.now();
  state.holdElapsed = 0;
  window.clearInterval(holdTimer);
  holdTimer = window.setInterval(() => {
    state.holdElapsed = Math.min(state.holdDuration, (performance.now() - state.holdStartedAt) / 1000);
    if (state.holdElapsed >= state.holdDuration) {
      stopHold(false);
      state.status = "The tone is held.";
    }
    render();
  }, 250);
  render();
}

function stopHold(resetElapsed = true) {
  if (audio) {
    audio.stop();
  }
  window.clearInterval(holdTimer);
  holdTimer = 0;
  state.holdStartedAt = 0;
  if (resetElapsed) {
    state.holdElapsed = 0;
  }
}

class SovereignAudio {
  constructor() {
    this.context = null;
    this.oscillator = null;
    this.gain = null;
    this.lfo = null;
    this.lfoGain = null;
  }

  start(frequency) {
    this.stop();
    this.context = new AudioContext();
    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.lfo = this.context.createOscillator();
    this.lfoGain = this.context.createGain();
    this.oscillator.type = "sine";
    this.oscillator.frequency.value = frequency;
    this.gain.gain.value = 0.0001;
    this.lfo.frequency.value = 0.08;
    this.lfoGain.gain.value = frequency * 0.0025;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.oscillator.frequency);
    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);
    this.oscillator.start();
    this.lfo.start();
    this.gain.gain.exponentialRampToValueAtTime(0.08, this.context.currentTime + 1.2);
  }

  stop() {
    if (!this.context || !this.gain || !this.oscillator || !this.lfo) {
      return;
    }
    const now = this.context.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(0.0001, now, 0.16);
    this.oscillator.stop(now + 0.45);
    this.lfo.stop(now + 0.45);
    this.context.close();
    this.context = null;
    this.oscillator = null;
    this.gain = null;
    this.lfo = null;
    this.lfoGain = null;
  }
}

function render() {
  const step = steps[state.step];
  app.innerHTML = `
    <aside class="rail" aria-label="Tone Sovereign notes">
      <section class="brand">
        <img src="./tone-sovereign-logo.png" alt="">
        <div>
          <h1>Tone Sovereign</h1>
          <p class="tagline">Choose what governs you.</p>
        </div>
      </section>
      <section class="rail-section">
        <p class="kicker">Core purpose</p>
        <h2>Strip suffering of its authority.</h2>
        <p>Choose what governs you, then hold the new tone long enough for the field to learn it.</p>
      </section>
      <section class="rail-section">
        <p class="kicker">Principles</p>
        <div class="principles">
          <div class="principle"><span>?</span><p>Attention follows authority.</p></div>
          <div class="principle"><span>x</span><p>You can revoke authority.</p></div>
          <div class="principle"><span>~</span><p>Perception creates experience.</p></div>
          <div class="principle"><span>*</span><p>A new tone creates a new field.</p></div>
        </div>
      </section>
    </aside>

    <section class="instrument" aria-labelledby="stage-title">
      <nav class="progress-strip" aria-label="Ritual steps">
        ${steps.map((item, index) => `
          <button class="step-tab ${index < state.step ? "done" : ""}" type="button" aria-current="${index === state.step ? "step" : "false"}" data-step="${index}">
            <span class="step-mark">${index < state.step ? "✓" : index + 1}</span>
            <span class="step-name">${item.label}</span>
          </button>
        `).join("")}
      </nav>
      <header class="instrument-title">
        <p class="step-label">${state.step + 1}. ${step.label}</p>
        <h2 id="stage-title">${step.title}</h2>
        <p>${step.body}</p>
      </header>
      <section class="stage">
        ${renderStage(step.id)}
      </section>
      <footer class="stage-actions">
        <button class="secondary-action" type="button" data-action="back" ${state.step === 0 ? "disabled" : ""}>Back</button>
        ${step.id === "hold" ? holdButton() : ""}
        ${step.id === "integrate" ? `<button class="primary-action" type="button" data-action="save" ${!canContinue() ? "disabled" : ""}>Save</button>` : `<button class="primary-action" type="button" data-action="next" ${!canContinue() ? "disabled" : ""}>Continue</button>`}
        <button class="secondary-action" type="button" data-action="reset">Begin again</button>
      </footer>
    </section>

    <aside class="archive" aria-label="Local history">
      <div class="archive-head">
        <div>
          <p class="kicker">Local history</p>
          <h2>${state.sessions.length ? `${state.sessions.length} saved` : "No saved tones yet"}</h2>
        </div>
        <div class="archive-actions">
          <button class="icon-action" type="button" data-action="export" title="Export sessions" aria-label="Export sessions">↓</button>
          <button class="icon-action" type="button" data-action="import" title="Import sessions" aria-label="Import sessions">↑</button>
          <input class="hidden-file" type="file" accept="application/json" data-file-import>
        </div>
      </div>
      <p class="status-line">${state.status}</p>
      <div class="history-list">
        ${renderHistory()}
      </div>
    </aside>
  `;

  bindEvents();
}

function renderStage(stageId) {
  switch (stageId) {
    case "notice":
      return `
        <div class="authority-grid">
          ${authorityOptions.map(option => `<button class="authority-chip ${state.authority === option ? "selected" : ""}" type="button" data-authority="${option}">${option}</button>`).join("")}
        </div>
        ${state.authority === "Other" ? `<input class="field-input" data-custom-authority value="${escapeAttribute(state.customAuthority)}" placeholder="Name what has authority">` : ""}
      `;
    case "revoke":
      return `
        <div class="revoke-block">
          <div class="seal" aria-hidden="true">x</div>
          <p class="statement-preview">${escapeHtml(currentAuthority() || "This no longer governs me.")}</p>
          <p>${escapeHtml(currentAuthority() || "This")} no longer has authority over my attention.</p>
        </div>
      `;
    case "choose":
      return `
        <div class="tone-grid">
          ${tones.map(tone => `
            <button class="tone-chip ${state.selectedToneId === tone.id ? "selected" : ""}" type="button" data-tone="${tone.id}" style="--tone-color: ${tone.color}">
              <span class="tone-swatch"></span>
              <span><strong>${tone.label}</strong><span>${tone.hz} Hz</span></span>
            </button>
          `).join("")}
        </div>
        <textarea class="field-textarea" data-statement placeholder="${escapeAttribute(selectedTone().statement)}">${escapeHtml(state.customStatement)}</textarea>
      `;
    case "hold": {
      const progress = Math.round((state.holdElapsed / state.holdDuration) * 100);
      const breath = state.holdStartedAt ? (Math.sin(performance.now() / 1600) + 1) / 2 : 0.25;
      return `
        <div class="hold-field">
          <div class="hold-orb" style="--breath: ${breath.toFixed(3)}">
            <img src="./tone-sovereign-logo.png" alt="">
          </div>
          <div class="hold-readout">
            <p class="statement-preview">${escapeHtml(currentStatement())}</p>
            <div>
              <p class="meter-label">${Math.round(state.holdElapsed)} / ${state.holdDuration} seconds</p>
              <div class="meter" aria-label="Hold progress"><span style="--progress: ${progress}%"></span></div>
            </div>
            <div class="duration-grid">
              ${[30, 60, 90].map(value => `<button class="duration-chip ${state.holdDuration === value ? "selected" : ""}" type="button" data-duration="${value}">${value}s</button>`).join("")}
            </div>
          </div>
        </div>
      `;
    }
    case "integrate":
      return `
        <div class="reflection-grid">
          ${reflections.map(item => `<button class="reflection-chip ${state.reflection === item ? "selected" : ""}" type="button" data-reflection="${item}">${item}</button>`).join("")}
        </div>
        <textarea class="field-textarea" data-note placeholder="What changed?">${escapeHtml(state.note)}</textarea>
      `;
    default:
      return "";
  }
}

function holdButton() {
  if (state.holdStartedAt) {
    return `<button class="primary-action" type="button" data-action="stop-hold">Stop tone</button>`;
  }
  return `<button class="primary-action" type="button" data-action="start-hold">Play tone</button>`;
}

function renderHistory() {
  if (!state.sessions.length) {
    return `<p class="archive-empty">Saved sessions stay on this device unless you export them.</p>`;
  }

  return state.sessions.map(session => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".history-kicker").textContent = `${session.authority} -> ${session.reflection}`;
    node.querySelector("h3").textContent = session.tone;
    node.querySelector("p:last-of-type").textContent = session.statement;
    node.querySelector("time").dateTime = session.createdAt;
    node.querySelector("time").textContent = new Date(session.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    return node.outerHTML;
  }).join("");
}

function bindEvents() {
  app.querySelectorAll("[data-step]").forEach(button => {
    button.addEventListener("click", () => goToStep(Number(button.dataset.step)));
  });

  app.querySelectorAll("[data-authority]").forEach(button => {
    button.addEventListener("click", () => {
      state.authority = button.dataset.authority;
      state.status = "";
      render();
    });
  });

  app.querySelector("[data-custom-authority]")?.addEventListener("input", event => {
    state.customAuthority = event.target.value;
    state.status = "";
    refreshActionState();
  });

  app.querySelectorAll("[data-tone]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedToneId = button.dataset.tone;
      state.customStatement = "";
      if (state.holdStartedAt) {
        startHold();
      } else {
        render();
      }
    });
  });

  app.querySelector("[data-statement]")?.addEventListener("input", event => {
    state.customStatement = event.target.value;
  });

  app.querySelectorAll("[data-duration]").forEach(button => {
    button.addEventListener("click", () => {
      state.holdDuration = Number(button.dataset.duration);
      state.holdElapsed = 0;
      render();
    });
  });

  app.querySelectorAll("[data-reflection]").forEach(button => {
    button.addEventListener("click", () => {
      state.reflection = button.dataset.reflection;
      render();
    });
  });

  app.querySelector("[data-note]")?.addEventListener("input", event => {
    state.note = event.target.value;
  });

  app.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "next") nextStep();
      if (action === "back") previousStep();
      if (action === "reset") resetRitual();
      if (action === "save") saveSession();
      if (action === "start-hold") startHold();
      if (action === "stop-hold") stopHold(false);
      if (action === "export") exportSessions();
      if (action === "import") app.querySelector("[data-file-import]")?.click();
    });
  });

  app.querySelector("[data-file-import]")?.addEventListener("change", event => {
    const [file] = event.target.files;
    if (file) {
      importSessions(file);
    }
  });
}

function refreshActionState() {
  const primary = app.querySelector('[data-action="next"], [data-action="save"]');
  if (primary) {
    primary.disabled = !canContinue();
  }
  const status = app.querySelector(".status-line");
  if (status) {
    status.textContent = state.status;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawField(time = 0) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height * 0.52);

  const tone = selectedTone();
  const pulse = state.holdStartedAt ? (Math.sin(time / 1200) + 1) / 2 : 0.24;
  const radius = Math.min(width, height) * (0.20 + pulse * 0.018);
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, "rgba(245, 223, 165, 0.22)");
  gradient.addColorStop(0.42, "rgba(212, 175, 55, 0.10)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = hexToRgba(tone.color, 0.18 + pulse * 0.18);
  context.lineWidth = 1.2;
  for (let ring = 0; ring < 4; ring += 1) {
    context.beginPath();
    const ringRadius = radius * (0.52 + ring * 0.19) + Math.sin(time / 1600 + ring) * 3;
    context.arc(0, 0, ringRadius, 0, Math.PI * 2);
    context.stroke();
  }

  context.strokeStyle = "rgba(245, 223, 165, 0.18)";
  context.lineWidth = 1.1;
  for (let line = 0; line < 9; line += 1) {
    context.beginPath();
    const y = -90 + line * 22;
    for (let x = -width * 0.46; x <= width * 0.46; x += 18) {
      const curve = Math.sin((x / 120) + time / 1700 + line * 0.4) * (8 + line * 0.4);
      if (x === -width * 0.46) {
        context.moveTo(x, y + curve);
      } else {
        context.lineTo(x, y + curve);
      }
    }
    context.stroke();
  }

  context.restore();
  animationFrame = requestAnimationFrame(drawField);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

window.addEventListener("resize", resizeCanvas);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

resizeCanvas();
render();
animationFrame = requestAnimationFrame(drawField);

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
  stopHold();
});
