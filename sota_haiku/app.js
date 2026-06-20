const app = document.querySelector("#app");

const storage = {
  onboarding: "haikuGates.onboardingComplete",
  pace: "haikuGates.defaultPace",
  audio: "haikuGates.audioPrompts",
  haikuVoice: "haikuGates.haikuVoice",
  gong: "haikuGates.zenGong",
  sessions: "haikuGates.sessions"
};

const state = {
  gates: [],
  view: "loading",
  activeGateID: null,
  activeDepth: "standard",
  selectedDurationSeconds: 600,
  selectedDurationLabel: "10 min",
  timer: null,
  voicePlayer: null,
  gongPlayers: [],
  gateRevealTimer: null,
  gateIntroTimers: [],
  gateControlsVisible: false,
  reflection: null,
  journalFilter: "all"
};

const paceToDepth = {
  gentle: "gentle",
  balanced: "standard",
  experienced: "standard"
};

init();

async function init() {
  try {
    state.gates = await loadGates();
    state.view = "arrival";
    render();
    registerServiceWorker();
  } catch (error) {
    app.innerHTML = `<main class="stack"><h1>Sota Haiku</h1><p class="lead">The haiku content could not be loaded.</p><pre>${escapeHTML(error.message)}</pre></main>`;
  }
}

async function loadGates() {
  const response = await fetch("./shared/haiku-gates.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Haiku content failed with ${response.status}`);
  const gates = await response.json();
  return gates.sort((a, b) => a.order - b.order);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, gate, depth } = target.dataset;

  if (action === "toggle-arrival-gate") {
    target.classList.toggle("painted");
    return;
  }
  if (action === "complete-onboarding") {
    localStorage.setItem(storage.onboarding, "true");
    transitionToGateList();
  }
  if (action === "enter-home") {
    localStorage.setItem(storage.onboarding, "true");
    transitionToGateList();
  }
  if (action === "choose-gate") {
    localStorage.setItem(storage.onboarding, "true");
    transitionToGateList();
  }
  if (action === "home") setView("gates");
  if (action === "gates") setView("gates");
  if (action === "journal") setView("journal");
  if (action === "settings") setView("settings");
  if (action === "gate") openGate(gate);
  if (action === "select-duration") {
    state.selectedDurationSeconds = Number(target.dataset.seconds || 0);
    state.selectedDurationLabel = target.dataset.label || "Free";
    updateDurationControls();
  }
  if (action === "start-practice") startPractice(gate, depth);
  if (action === "start-quick-practice") startPractice(gate, "gentle", Number(target.dataset.seconds || 60), target.dataset.label || "One minute", true);
  if (action === "pause") togglePause();
  if (action === "toggle-practice-voice") togglePracticeVoice();
  if (action === "toggle-gong") toggleGong();
  if (action === "end-practice") openReflection();
  if (action === "save-reflection") saveReflection();
  if (action === "export") exportJournal();
  if (action === "delete-all") deleteAll();
  if (action === "reset") resetApp();
});

app.addEventListener("change", (event) => {
  if (event.target.matches("[data-setting='pace']")) {
    localStorage.setItem(storage.pace, event.target.value);
  }
  if (event.target.matches("[data-setting='audio']")) {
    localStorage.setItem(storage.audio, event.target.checked ? "true" : "false");
  }
  if (event.target.matches("[data-setting='haiku-voice']")) {
    localStorage.setItem(storage.haikuVoice, event.target.checked ? "true" : "false");
  }
  if (event.target.matches("[data-setting='gong']")) {
    localStorage.setItem(storage.gong, event.target.checked ? "true" : "false");
    if (!event.target.checked) stopGongAudio();
  }
  if (event.target.matches("[data-journal-filter]")) {
    state.journalFilter = event.target.value;
    render();
  }
});

function setView(view) {
  stopTimer();
  clearGateIntro();
  state.view = view;
  render();
  scrollToTop();
}

function openGate(gateID) {
  stopTimer();
  clearGateIntro();
  state.view = "gate";
  state.activeGateID = gateID;
  state.activeDepth = defaultDepth();
  state.selectedDurationSeconds = 600;
  state.selectedDurationLabel = "10 min";
  state.gateControlsVisible = false;
  render();
  scrollToTop();
  const gate = findGate(gateID);
  if (gate) startGateIntro(gate);
}

function startPractice(gateID, depth, durationOverrideSeconds, sessionLabel, eyesOpen = false) {
  const gate = findGate(gateID);
  const exercise = getExercise(gate, depth);
  const hasOverride = Number.isFinite(durationOverrideSeconds);
  state.view = "practice";
  state.activeGateID = gateID;
  state.activeDepth = depth;
  state.timer = {
    gate,
    exercise,
    elapsed: 0,
    paused: false,
    durationSeconds: hasOverride ? durationOverrideSeconds : exercise.defaultDurationMinutes * 60,
    sessionLabel: sessionLabel || labelDepth(exercise.depth),
    eyesOpen,
    startedAt: new Date().toISOString(),
    lastPromptIndex: -1,
    voiceReady: false,
    voiceStartTimer: null,
    gongTimer: null,
    interval: null
  };
  render();
  scrollToTop();
  stopVoiceAudio();
  startPracticeAudioSequence();
  state.timer.interval = window.setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (!state.timer || state.timer.paused) return;
  state.timer.elapsed += 1;
  const duration = state.timer.durationSeconds;
  if (duration > 0 && state.timer.elapsed >= duration) {
    state.timer.elapsed = duration;
    state.timer.paused = true;
  }
  renderPractice();
  speakCurrentPrompt();
}

function togglePause() {
  if (!state.timer) return;
  state.timer.paused = !state.timer.paused;
  renderPractice();
}

function togglePracticeVoice() {
  const isOn = localStorage.getItem(storage.audio) === "true";
  localStorage.setItem(storage.audio, isOn ? "false" : "true");
  if (isOn) {
    stopVoiceAudio();
  } else if (state.timer) {
    state.timer.lastPromptIndex = -1;
    speakCurrentPrompt();
  }
  renderPractice();
}

function toggleGong() {
  const isOn = gongEnabled();
  localStorage.setItem(storage.gong, isOn ? "false" : "true");
  if (isOn) {
    stopGongAudio();
    if (state.timer?.gongTimer) window.clearTimeout(state.timer.gongTimer);
  } else {
    if (state.timer) startPracticeAudioSequence();
    else playGongAudio(0.62);
  }
  renderPractice();
}

function stopTimer() {
  if (state.timer?.interval) window.clearInterval(state.timer.interval);
  if (state.timer?.voiceStartTimer) window.clearTimeout(state.timer.voiceStartTimer);
  if (state.timer?.gongTimer) window.clearTimeout(state.timer.gongTimer);
  state.timer = null;
  stopAllAudio();
}

function openReflection() {
  if (!state.timer) return;
  const { gate, exercise, elapsed, startedAt, sessionLabel } = state.timer;
  state.reflection = { gate, exercise, elapsed, startedAt, sessionLabel };
  stopTimer();
  state.view = "reflection";
  render();
  scrollToTop();
}

function speakCurrentPrompt() {
  if (!state.timer || !state.timer.voiceReady || localStorage.getItem(storage.audio) !== "true") return;
  const promptIndex = currentPromptIndex(state.timer.exercise, state.timer.elapsed, state.timer.durationSeconds);
  if (promptIndex === state.timer.lastPromptIndex) return;
  state.timer.lastPromptIndex = promptIndex;
  playInstructionAudio(state.timer.gate, promptIndex);
}

function startPracticeAudioSequence() {
  if (!state.timer) return;
  state.timer.voiceReady = false;
  state.timer.lastPromptIndex = -1;

  const voiceDelay = gongEnabled() ? 4600 : 1500;
  if (gongEnabled()) {
    playGongAudio(0.58);
    state.timer.gongTimer = window.setTimeout(() => {
      if (!state.timer || !gongEnabled()) return;
      playGongAudio(0.52);
      schedulePracticeGongLoop();
    }, voiceDelay);
  }

  state.timer.voiceStartTimer = window.setTimeout(() => {
    if (!state.timer) return;
    state.timer.voiceReady = true;
    speakCurrentPrompt();
  }, voiceDelay + (gongEnabled() ? 820 : 0));
}

function schedulePracticeGongLoop() {
  if (!state.timer || !gongEnabled()) return;
  state.timer.gongTimer = window.setTimeout(() => {
    if (!state.timer || !gongEnabled()) return;
    playGongAudio(0.32);
    schedulePracticeGongLoop();
  }, 58000);
}

function startGateIntro(gate) {
  const voiceOn = localStorage.getItem(storage.haikuVoice) !== "false";
  const settleDelay = gongEnabled() ? 4600 : 2200;
  if (gongEnabled()) playGongAudio(0.70);
  state.gateIntroTimers.push(window.setTimeout(() => {
    if (state.view !== "gate") return;
    if (gongEnabled()) playGongAudio(0.64);
    state.gateIntroTimers.push(window.setTimeout(() => {
      if (state.view !== "gate") return;
      if (!voiceOn) {
        scheduleGateControls(3600);
        return;
      }
      const player = playVoiceAudio(`./audio/Haiku/haiku-${pad2(gate.order)}.mp3`);
      if (!player) {
        scheduleGateControls(7200);
        return;
      }
      let scheduled = false;
      const scheduleFromDuration = () => {
        if (scheduled) return;
        scheduled = true;
        const duration = Number.isFinite(player.duration) ? player.duration * 1000 : 0;
        scheduleGateControls(Math.max(duration + 1700, 7600));
      };
      player.addEventListener("loadedmetadata", scheduleFromDuration, { once: true });
      player.addEventListener("ended", () => {
        if (gongEnabled()) playGongAudio(0.42);
        if (!state.gateControlsVisible) scheduleGateControls(900);
      }, { once: true });
      if (player.readyState >= 1) scheduleFromDuration();
      if (!scheduled) scheduleGateControls(18000);
    }, gongEnabled() ? 820 : 0));
  }, settleDelay));
}

function scheduleGateControls(delayMs) {
  window.clearTimeout(state.gateRevealTimer);
  state.gateRevealTimer = window.setTimeout(() => {
    if (state.view !== "gate") return;
    state.gateControlsVisible = true;
    revealGateControls();
  }, delayMs);
}

function revealGateControls() {
  const controls = app.querySelector(".gate-controls");
  if (!controls) return;
  controls.classList.add("is-revealed");
}

function updateDurationControls() {
  const controls = app.querySelector(".gate-controls");
  if (!controls) return;
  controls.querySelectorAll("[data-action='select-duration']").forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.seconds || 0) === state.selectedDurationSeconds);
  });
  const begin = controls.querySelector("[data-action='start-quick-practice']");
  if (begin) {
    begin.dataset.seconds = String(state.selectedDurationSeconds);
    begin.dataset.label = state.selectedDurationLabel;
  }
}

function playHaikuAudio(gate) {
  return playVoiceAudio(`./audio/Haiku/haiku-${pad2(gate.order)}.mp3`);
}

function playInstructionAudio(gate, promptIndex) {
  return playVoiceAudio(`./audio/Instructions/instruction-${pad2(gate.order)}-${pad2(promptIndex + 1)}.mp3`);
}

function playVoiceAudio(source) {
  stopVoiceAudio();
  const audio = new Audio(source);
  state.voicePlayer = audio;
  audio.play().catch(() => {
    if (state.voicePlayer === audio) state.voicePlayer = null;
  });
  return audio;
}

function playGongAudio(volume = 0.62) {
  const audio = new Audio("./audio/Ambience/temple-gong.wav");
  audio.volume = volume;
  state.gongPlayers.push(audio);
  audio.addEventListener("ended", () => {
    state.gongPlayers = state.gongPlayers.filter((player) => player !== audio);
  }, { once: true });
  audio.play().catch(() => {
    state.gongPlayers = state.gongPlayers.filter((player) => player !== audio);
  });
}

function stopVoiceAudio() {
  if (!state.voicePlayer) return;
  state.voicePlayer.pause();
  state.voicePlayer.currentTime = 0;
  state.voicePlayer = null;
}

function stopGongAudio() {
  state.gongPlayers.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  state.gongPlayers = [];
}

function stopAllAudio() {
  stopVoiceAudio();
  stopGongAudio();
}

function clearGateIntro() {
  window.clearTimeout(state.gateRevealTimer);
  state.gateIntroTimers.forEach((timer) => window.clearTimeout(timer));
  state.gateIntroTimers = [];
  state.gateRevealTimer = null;
  state.gateControlsVisible = false;
  stopAllAudio();
}

function gongEnabled() {
  return localStorage.getItem(storage.gong) !== "false";
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function render() {
  if (state.view === "loading") {
    app.innerHTML = `<main class="stack"><h1>Sota Haiku</h1><p class="lead">Loading haiku.</p></main>`;
    return;
  }

  const body = {
    arrival: renderArrival,
    onboarding: renderArrival,
    gates: renderGateList,
    gate: renderGateDetail,
    practice: renderPracticeShell,
    reflection: renderReflection,
    journal: renderJournal,
    settings: renderSettings
  }[state.view]();

  app.innerHTML = `${renderTopbar()}${body}${renderToolbar()}`;
  if (state.view === "arrival" || state.view === "onboarding") {
    window.requestAnimationFrame(() => {
      app.querySelector("[data-anchor-mark]")?.classList.add("painted");
    });
  }
  window.requestAnimationFrame(fitHaikuPoems);
}

function transitionToGateList() {
  const shell = app.querySelector(".arrival-shell");
  if (shell && (state.view === "arrival" || state.view === "onboarding")) {
    shell.classList.add("is-leaving");
    window.setTimeout(() => setView("gates"), 340);
    return;
  }
  setView("gates");
}

window.addEventListener("resize", () => window.requestAnimationFrame(fitHaikuPoems));

function renderTopbar() {
  if (state.view === "arrival" || state.view === "onboarding" || state.view === "home" || state.view === "gates") return "";
  return `
    <header class="topbar">
      <button data-action="home" aria-label="Home" class="brand">
        ${renderMiniLineMark()}
        <span>
          <span class="eyebrow">Sota</span><br>
          <strong>Haiku</strong>
        </span>
      </button>
    </header>
  `;
}

function renderToolbar() {
  return "";
}

function renderArrival() {
  return `
    <main class="haiku-flow-shell arrival-shell">
      <section class="haiku-anchor arrival-art" data-anchor-mark aria-hidden="true">
        <img class="brush-gate-image" src="./shared/brush-lines-only.png?v=21-sequence" alt="" aria-hidden="true" />
        ${renderSotaSeal("arrival-seal")}
      </section>

      <section class="arrival-copy">
        <p class="sota-word">SOTA</p>
        <h1 class="haiku-word">Haiku</h1>
        <p class="lead">Three lines for mind and body.</p>
      </section>

      <section class="arrival-actions">
        <button class="arrival-button arrival-primary" data-action="enter-home">Choose Haiku</button>
      </section>
    </main>
  `;
}

function renderGateList() {
  return `
    <main class="haiku-flow-shell line-menu-shell">
      <section class="haiku-anchor line-menu-anchor" aria-hidden="true">
        <img class="anchor-mark painted-static" src="./shared/brush-lines-only.png?v=21-sequence" alt="" />
        ${renderSotaSeal("arrival-seal line-menu-seal")}
      </section>
      <nav class="line-menu-actions" aria-label="Local app areas">
        <button data-action="journal">Journal</button>
        <button data-action="settings">Settings</button>
      </nav>
      <section class="line-menu-head">
        <h1>Choose Haiku</h1>
        <p class="lead">Let one poem meet the moment.</p>
      </section>
      <section class="line-menu-list">
        ${state.gates.map((gate) => `
          <button class="card gate-row" data-action="gate" data-gate="${gate.id}">
            ${renderMiniLineMark(`row-line-mark gate-order-${gate.order}`)}
            <span class="number">${gate.order}</span>
            <span><strong>${escapeHTML(gate.title)}</strong><br><span class="muted">${escapeHTML(gate.theme)}</span></span>
          </button>
        `).join("")}
      </section>
    </main>
  `;
}

function renderGateDetail() {
  const gate = findGate(state.activeGateID) || state.gates[0];
  const index = state.gates.findIndex((candidate) => candidate.id === gate.id);
  const previousGate = state.gates[index - 1];
  const nextGate = state.gates[index + 1];
  const navButtons = [
    previousGate ? `<button data-action="gate" data-gate="${previousGate.id}">Previous</button>` : `<button disabled>Previous</button>`,
    nextGate ? `<button data-action="gate" data-gate="${nextGate.id}">Next</button>` : `<button disabled>Next</button>`
  ].join("");
  return `
    <main class="haiku-flow-shell gate-shell">
      ${renderGateArt(gate)}
      <section class="gate-controls reveal-after-poem ${state.gateControlsVisible ? "is-revealed" : ""}">
        <section class="gate-title-lockup">
          <p class="eyebrow">Haiku ${gate.order}</p>
          <h1>${escapeHTML(gate.title)}</h1>
        </section>
        <div class="timer-choice-row" aria-label="Timer choices">
          ${[
            ["Free", "Free", 0],
            ["1", "1 min", 60],
            ["5", "5 min", 300],
            ["10", "10 min", 600]
          ].map(([display, label, seconds]) => `
            <button class="${state.selectedDurationSeconds === seconds ? "selected" : ""}" data-action="select-duration" data-seconds="${seconds}" data-label="${label}" aria-label="${escapeHTML(label)}">${escapeHTML(display)}</button>
          `).join("")}
        </div>
        <button class="primary home-begin" data-action="start-quick-practice" data-gate="${gate.id}" data-seconds="${state.selectedDurationSeconds}" data-label="${escapeHTML(state.selectedDurationLabel)}">Begin</button>
        <div class="haiku-nav-row" aria-label="Move between haiku">
          ${navButtons}
        </div>
        <details class="notes-disclosure">
          <summary>Notes</summary>
          <p>${escapeHTML(gate.purpose)}</p>
        </details>
      </section>
    </main>
  `;
}

function renderGateArt(gate) {
  const order = Number(gate.order);
  const poemLines = gate.stanza.slice(0, 3);
  while (poemLines.length < 3) poemLines.push(" ");
  return `
    <section class="haiku-anchor gate-art three-line-art gate-order-${order}" aria-label="Haiku poem for ${escapeHTML(gate.title)}">
      <div class="three-line-stage" aria-hidden="true">
        <img class="gate-logo-line gate-line-one" src="./shared/brush-lines-only.png?v=21-sequence" alt="" />
        <img class="gate-logo-line gate-line-two" src="./shared/brush-lines-only.png?v=21-sequence" alt="" />
        <img class="gate-logo-line gate-line-three" src="./shared/brush-lines-only.png?v=21-sequence" alt="" />
        <span class="gate-seal-ghost-cover"></span>
      </div>
      <div class="three-line-poem" data-fit-poem>
        ${poemLines.map((line, index) => `<span style="--line-index:${index}">${escapeHTML(line)}</span>`).join("")}
      </div>
    </section>
  `;
}

function fitHaikuPoems() {
  document.querySelectorAll("[data-fit-poem]").forEach((poem) => {
    const parent = poem.closest(".gate-art");
    const spans = Array.from(poem.querySelectorAll("span"));
    if (!parent || !spans.length) return;

    poem.style.removeProperty("font-size");
    const computed = window.getComputedStyle(poem);
    let size = Number.parseFloat(computed.fontSize);
    const minSize = 16;
    const maxTextHeight = parent.clientHeight * 0.70;

    while (size > minSize) {
      poem.style.fontSize = `${size}px`;
      const width = poem.clientWidth;
      const widthFits = spans.every((span) => span.scrollWidth <= width + 1);
      const heightFits = poem.scrollHeight <= maxTextHeight;
      if (widthFits && heightFits) break;
      size -= 1;
    }
  });
}

function renderSotaSeal(className = "") {
  return `
    <svg class="sota-seal ${className}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="56" height="56" rx="5" />
      <circle cx="32" cy="22" r="4.6" class="seal-cut" />
      <path class="seal-cut-line" d="M18 40 C25 28 39 28 46 40" />
      <path class="seal-cut-line robe" d="M14 48 C25 38 42 53 51 45" />
    </svg>
  `;
}

function renderMiniLineMark(className = "mini-line-mark") {
  return `<span class="${className}" aria-hidden="true"><img src="./shared/brush-lines-only.png?v=21-sequence" alt="" /></span>`;
}

function renderPracticeShell() {
  return `<main id="practice-root">${practiceMarkup()}</main>`;
}

function renderPractice() {
  const root = document.querySelector("#practice-root");
  if (root) root.innerHTML = practiceMarkup();
}

function practiceMarkup() {
  const timer = state.timer;
  if (!timer) return "";
  const duration = timer.durationSeconds;
  const prompt = timer.exercise.prompts[currentPromptIndex(timer.exercise, timer.elapsed, duration)];
  const isFree = duration === 0;
  const remaining = Math.max(duration - timer.elapsed, 0);
  const progress = isFree ? 0 : Math.round((timer.elapsed / Math.max(duration, 1)) * 100);
  const voiceOn = localStorage.getItem(storage.audio) === "true";
  const gongOn = gongEnabled();
  return `
    <section class="timer">
      <div>
        <p class="eyebrow">Haiku ${timer.gate.order} · ${escapeHTML(timer.gate.title)}</p>
        <h1 class="practice-time">${isFree ? `Free · ${formatTime(timer.elapsed)}` : formatTime(remaining)}</h1>
        ${isFree ? "" : `<div class="progress" aria-label="Practice progress"><span style="--progress:${progress}%"></span></div>`}
      </div>
      <div class="prompt">${escapeHTML(prompt)}</div>
      <div class="audio-controls" aria-label="Audio controls">
        <button data-action="toggle-practice-voice" class="${voiceOn ? "selected" : ""}">${voiceOn ? "Voice On" : "Voice Off"}</button>
        <button data-action="toggle-gong" class="${gongOn ? "selected" : ""}">${gongOn ? "Gong On" : "Gong Off"}</button>
      </div>
      <details class="notes-disclosure">
        <summary>Notes</summary>
        <p>${escapeHTML(timer.gate.purpose)}</p>
      </details>
      <div class="controls">
        <button data-action="pause">${timer.paused ? "Resume" : "Pause"}</button>
        <button data-action="end-practice" class="primary">${isFree || timer.elapsed >= duration ? "Reflect" : "End Kindly"}</button>
      </div>
    </section>
  `;
}

function renderReflection() {
  const session = state.reflection;
  if (!session) return renderGateList();
  const tags = ["body", "thought", "emotion", "wanting", "sound", "self-sense", "wide", "ordinary"];
  return `
    <main class="stack">
      <section>
        <h1>Marginalia</h1>
        <p class="lead">A small mark after the poem.</p>
      </section>
      ${renderGateArt(session.gate)}
      <section class="margin-card" style="--gate-accent:${escapeHTML(session.gate.art.accentHex)}">
        <p class="eyebrow">Carry line</p>
        <p class="serif">${escapeHTML(session.gate.dailyCarry)}</p>
      </section>
      <section class="margin-card" style="--gate-accent:${escapeHTML(session.gate.art.accentHex)}">
        <p class="eyebrow">Margin note</p>
        <p class="muted">Short is enough. This is a mark in the margin, not a report.</p>
        <label>What was noticed?
          <textarea id="noticed" placeholder="A sensation, phrase, image, loop, or ordinary detail."></textarea>
        </label>
        <label>What softened?
          <textarea id="softened" placeholder="Nothing needs to have softened. Honesty is enough."></textarea>
        </label>
      </section>
      <section class="margin-card" style="--gate-accent:#B77B2A">
        <p class="eyebrow">Small tags</p>
        <div class="tag-cloud">
          ${tags.map((tag) => `<label class="tag-pill"><input type="checkbox" name="tag" value="${escapeHTML(tag)}"> ${escapeHTML(tag)}</label>`).join("")}
        </div>
      </section>
      <button class="primary" data-action="save-reflection">Save Reflection</button>
    </main>
  `;
}

function renderJournal() {
  const sessions = filteredSessions();
  return `
    <main class="stack">
      <section><h1>Journal</h1><p class="lead">Margin notes saved locally in this browser.</p></section>
      <section class="card controls">
        <button data-action="export">Export</button>
        <button data-action="delete-all" class="danger">Delete all</button>
      </section>
      <section class="stack">
        ${sessions.length ? sessions.map(renderJournalRow).join("") : `<div class="card"><p class="muted">No notes yet.</p></div>`}
      </section>
    </main>
  `;
}

function renderJournalRow(session) {
  return `
    <article class="card">
      <p class="eyebrow">${escapeHTML(session.date)}</p>
      <h3>${escapeHTML(session.gateTitle)}</h3>
      <p class="serif">${escapeHTML(session.dailyCarry)}</p>
      ${session.note ? `<p class="muted">${escapeHTML(session.note)}</p>` : ""}
      ${session.tags?.length ? `<p class="tag-line">${session.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</p>` : ""}
      <p class="muted">${escapeHTML(session.exerciseDepth)}</p>
    </article>
  `;
}

function renderSettings() {
  return `
    <main class="stack">
      <section><h1>Settings</h1><p class="lead">Local controls for audio and journal data.</p></section>
      <section class="card form-grid">
        <label><input type="checkbox" data-setting="haiku-voice" ${localStorage.getItem(storage.haikuVoice) !== "false" ? "checked" : ""}> Haiku voice</label>
        <label><input type="checkbox" data-setting="audio" ${localStorage.getItem(storage.audio) === "true" ? "checked" : ""}> Practice voice</label>
        <label><input type="checkbox" data-setting="gong" ${gongEnabled() ? "checked" : ""}> Temple gong</label>
      </section>
      <section class="card">
        <p class="muted">Practice reflections stay in this browser by default. Sota Haiku uses no accounts, AI, cloud sync, or analytics.</p>
        <div class="controls">
          <button data-action="export">Export Journal</button>
          <button data-action="delete-all" class="danger">Delete Journal Data</button>
          <button data-action="reset" class="danger">Reset App</button>
        </div>
      </section>
      <section class="card controls">
        <a class="button" href="https://coherence-nikolai.app/privacy/" rel="noopener">Privacy Policy</a>
        <a class="button" href="https://coherence-nikolai.app/support/" rel="noopener">Support</a>
      </section>
    </main>
  `;
}

function saveReflection() {
  const values = readReflectionValues();
  const session = {
    id: makeID(),
    gateID: state.reflection.gate.id,
    gateTitle: state.reflection.gate.title,
    exerciseDepth: state.reflection.sessionLabel || state.reflection.exercise.depth,
    startedAt: state.reflection.startedAt,
    completedAt: new Date().toISOString(),
    durationSeconds: Math.max(state.reflection.elapsed, 1),
    dailyCarry: state.reflection.gate.dailyCarry,
    ...values
  };
  writeSessions([session, ...getSessions()]);
  state.reflection = null;
  state.view = "gates";
  render();
  scrollToTop();
}

function makeID() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `hg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readReflectionValues() {
  const noticed = document.querySelector("#noticed")?.value.trim() || "";
  const softened = document.querySelector("#softened")?.value.trim() || "";
  const note = [
    noticed ? `Noticed: ${noticed}` : "",
    softened ? `Softened: ${softened}` : ""
  ].filter(Boolean).join("\n");
  return {
    intensity: 0,
    workability: 0,
    clarity: 0,
    equanimity: 0,
    striving: 0,
    dullness: 0,
    selfSense: "",
    safetyFlags: [],
    tags: [...document.querySelectorAll("input[name='tag']:checked")].map((input) => input.value),
    note
  };
}

function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(storage.sessions) || "[]");
  } catch {
    return [];
  }
}

function writeSessions(sessions) {
  localStorage.setItem(storage.sessions, JSON.stringify(sessions));
}

function filteredSessions() {
  return getSessions().map((session) => ({
    ...session,
    date: new Date(session.completedAt || session.startedAt).toLocaleString()
  }));
}

function exportJournal() {
  const text = getSessions().map((session) => [
    new Date(session.completedAt || session.startedAt).toLocaleString(),
    `${session.gateTitle} - ${session.exerciseDepth}`,
    `Daily Carry: ${session.dailyCarry}`,
    `Tags: ${session.tags?.length ? session.tags.join(", ") : "None"}`,
    `Note: ${session.note || ""}`
  ].join("\n")).join("\n\n---\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sota-haiku-journal.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function deleteAll() {
  if (!confirm("Delete all journal entries from this browser?")) return;
  writeSessions([]);
  render();
}

function resetApp() {
  if (!confirm("Reset Sota Haiku on this browser?")) return;
  Object.values(storage).forEach((key) => localStorage.removeItem(key));
  state.view = "arrival";
  render();
  scrollToTop();
}

function scrollToTop() {
  window.requestAnimationFrame(() => window.scrollTo(0, 0));
}

function findGate(id) {
  return state.gates.find((gate) => gate.id === id);
}

function getExercise(gate, depth) {
  return gate.exercises.find((exercise) => exercise.depth === depth) || gate.exercises[0];
}

function currentPromptIndex(exercise, elapsed, durationOverrideSeconds) {
  const duration = durationOverrideSeconds > 0 ? durationOverrideSeconds : exercise.defaultDurationMinutes * 60;
  const spacing = Math.max(30, Math.floor(duration / Math.max(exercise.prompts.length, 1)));
  return Math.min(Math.floor(elapsed / spacing), exercise.prompts.length - 1);
}

function defaultDepth() {
  return paceToDepth[localStorage.getItem(storage.pace) || "balanced"] || "standard";
}

function labelDepth(depth) {
  return depth === "deepen" ? "Deepen" : titleCase(depth);
}

function titleCase(value) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
