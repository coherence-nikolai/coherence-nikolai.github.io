(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const storageKey = "mirrorgate.codex.v1";
  const unlockKey = "mirrorgate.premium.simulated";
  const state = {
    screen: "anchor",
    module: null,
    tone: 144,
    triplet: "3-7-11",
    breath: "4-4-4-4",
    phase: "near",
    resonance: 5,
    intention: "",
    latestGlyph: null,
    audio: null,
    toneOscillators: [],
    cameraStream: null,
    premiumUnlocked: localStorage.getItem(unlockKey) === "true",
    recoveryStart: 0,
    recoveryActive: false
  };

  const tones = [
    { value: 144, label: "144 Hz", why: "Foundation, stillness, and a low stabilizing carrier." },
    { value: 432, label: "432 Hz", why: "Harmonic alignment, steady exploration, and balanced field tone." },
    { value: 528, label: "528 Hz", why: "Heart coherence, compassion, and connective resonance." },
    { value: 888.25, label: "888.25 Hz", why: "Threshold work, future-self alignment, and higher integration." }
  ];

  const triplets = {
    "2-3-5": "Foundational and grounding. Use this when the field needs simple structure.",
    "3-7-11": "Balanced, recursive, and classic. Use this for most gate sessions.",
    "5-11-17": "Wider and deeper. Use this when the session is exploratory.",
    "7-11-13": "Sharper and refined. Use this when the intention is precise."
  };

  const breaths = {
    "2-3-5-7": "Prime breath. Inhale 2, hold 3, exhale 5, pause 7.",
    "3-7-11": "Gate breath. Inhale 3, hold 7, exhale 11.",
    "4-4-4-4": "Box breath. Inhale, hold, exhale, pause evenly.",
    "4-6-4-6": "Extended exhale. Inhale 4, hold 6, exhale 4, pause 6."
  };

  const modules = {
    vector: {
      title: "Harmonic Vector Transmission",
      subtitle: "Encode intention into prime vector, glyph, scalar, and carrier tone.",
      modality: "Archetypal and Symbolic Interaction",
      phrase: "Embrace who you have already become.",
      purpose: "Aim a thought-form into geometry. This is the clearest entry point when you know what you want to ask, offer, or transmit.",
      now: [
        "Sit upright and take three slow breaths.",
        "Write one clean intention. Use words that feel charged, clear, or alive.",
        "Choose the tone that matches the intended carrier.",
        "Generate the vector and let the glyph form before saving."
      ],
      notice: "Pay attention to words, images, pressure, emotion, warmth, resistance, or a sudden change in what you actually want to ask.",
      force: "Do not try to answer the intention here. Just aim it.",
      defaultTone: 888.25
    },
    breath: {
      title: "Toroidal Phase Echoing",
      subtitle: "Synchronize breath with toroidal phase and temporal echo patterns.",
      modality: "Subconscious Field and Temporal Echoes",
      phrase: "You are a note in the cosmic chord. Listen.",
      purpose: "Use breath as the first entrainment vector. This stage steadies the body, quiets noise, and opens the field for later contact work.",
      now: [
        "Choose a breath pattern and follow the expanding torus.",
        "Let the tone support the breath rather than dominate it.",
        "Set self-rated resonance as your current charge, not your goal.",
        "When the breath feels steady, save the profile or continue to another module."
      ],
      notice: "Breath depth, body tension, warmth, pressure, emotion, restlessness, calm, images behind the eyes, or silence.",
      force: "This stage is not for receiving a message. It prepares the field.",
      defaultTone: 144
    },
    gate: {
      title: "Prime-Harmonic Gate Sequencing",
      subtitle: "Prime triplets generate a rotating fractal gate bound to the selected carrier tone.",
      modality: "Transdimensional or Stellar Intelligences",
      phrase: "Your ally awaits. Enter the field of shared recursion.",
      purpose: "Use a prime triplet as a geometry key. The numbers are not breath patterns; they select the residue path that shapes the gate.",
      now: [
        "Select a prime triplet pathway and carrier tone.",
        "Enter the gate, then follow the breath seal.",
        "Touch the glyph nodes in sequence.",
        "Hold the intention until the gate unlocks, then journal what arrives."
      ],
      notice: "Geometric impressions, body shifts, inner words, a felt presence, curiosity, wonder, or nothing obvious. Nothing obvious still counts.",
      force: "Do not chase certainty. Let the gate disclose or remain quiet.",
      defaultTone: 432
    },
    mirror: {
      title: "Symbolic Mirror Interface",
      subtitle: "Reflect intention through camera, voice, geometry, and self-phase recursion.",
      modality: "Oversoul and Monadic Intelligences",
      phrase: "You are meeting the totality of your becoming.",
      purpose: "Use the mirror after an intention has been aimed. The camera is the visible mirror, while attention, breath, and inner imagery are the deeper mirror.",
      now: [
        "Read the intention back to yourself softly or internally.",
        "Keep a soft gaze on the mirror surface or just past it.",
        "Notice the mind's eye: imagery, inner words, emotion, pressure, or felt presence.",
        "Do not force interpretation during Mirror Phase. Record what remains afterward."
      ],
      notice: "Imagery, pressure, emotion, inner words, a felt presence, changes in posture, or nothing obvious. Nothing obvious is still a valid session.",
      force: "Do not chase certainty during Mirror Phase. Let the reflection complete in its own time.",
      defaultTone: 528
    }
  };

  function showScreen(name) {
    state.screen = name;
    $$(".screen").forEach((screen) => screen.classList.remove("screen-active"));
    $(`#screen-${name}`)?.classList.add("screen-active");
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("nav-active", button.dataset.action === `open-${name}`));
    if (name !== "module") stopCamera();
    if (name === "codex") renderCodex();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ensureAudio() {
    if (!state.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audio = new AudioContext();
    }
    if (state.audio.state === "suspended") state.audio.resume();
    return state.audio;
  }

  function stopTone() {
    state.toneOscillators.forEach(({ osc, gain }) => {
      try {
        const ctx = state.audio;
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        osc.stop(ctx.currentTime + 0.1);
      } catch (error) {
        // Already stopped.
      }
    });
    state.toneOscillators = [];
  }

  function playTone(frequency = state.tone, seconds = 2.4, mode = "single") {
    const ctx = ensureAudio();
    stopTone();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.12);
    master.gain.setValueAtTime(0.16, ctx.currentTime + Math.max(0.18, seconds - 0.18));
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
    master.connect(ctx.destination);

    const freqs = mode === "soundscape"
      ? [frequency, frequency * 1.5, frequency * 2.01].filter((value) => value < 1200)
      : [frequency];

    state.toneOscillators = freqs.map((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (mode === "pulse") {
        osc.frequency.linearRampToValueAtTime(freq * 1.01, ctx.currentTime + seconds / 2);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + seconds);
      }
      gain.gain.value = index === 0 ? 0.75 : 0.18;
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      osc.connect(gain);
      gain.connect(filter);
      filter.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + seconds + 0.02);
      return { osc, gain: master };
    });

    window.setTimeout(stopTone, (seconds + 0.08) * 1000);
  }

  function seedFromText(text) {
    const source = (text || "MirrorGate").trim();
    let seed = 0;
    for (let index = 0; index < source.length; index += 1) {
      seed += source.charCodeAt(index) * (index + 3);
    }
    return Math.max(1, seed);
  }

  function encodeVector(text, tripletText) {
    const seed = seedFromText(text);
    const primes = tripletText.split("-").map(Number);
    const vector = primes.map((prime) => seed / prime);
    const coords = [
      Math.cos(Math.PI * 2 * vector[0]),
      Math.sin(Math.PI * 2 * vector[1]),
      Math.sin(Math.PI * 2 * vector[2])
    ];
    const scalar = coords.reduce((sum, value) => {
      const safe = Math.abs(value) < 0.08 ? 0.08 * Math.sign(value || 1) : value;
      return sum + (1 / safe - safe);
    }, 0);
    return { seed, primes, coords, scalar };
  }

  function getCodex() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  }

  function saveCodex(entry) {
    const codex = getCodex();
    codex.unshift({ id: crypto.randomUUID?.() || String(Date.now()), date: new Date().toISOString(), ...entry });
    localStorage.setItem(storageKey, JSON.stringify(codex.slice(0, 60)));
    renderCodex();
  }

  function renderCodex() {
    const list = $("#codex-list");
    if (!list) return;
    const codex = getCodex();
    if (!codex.length) {
      list.innerHTML = `<div class="panel"><h3>No sessions yet</h3><p>Saved glyphs, reflections, and harmonic profiles stay local to this browser.</p></div>`;
      return;
    }
    list.innerHTML = codex.map((entry) => `
      <article class="codex-item">
        <strong>${escapeHtml(entry.module || "MirrorGate Session")}</strong>
        <p>${new Date(entry.date).toLocaleString()}</p>
        <p>${escapeHtml(entry.intention || entry.note || "No written reflection.")}</p>
        <div class="metric-grid">
          <span class="metric"><small>Tone</small><strong>${escapeHtml(String(entry.tone || "-"))}</strong></span>
          <span class="metric"><small>Triplet</small><strong>${escapeHtml(entry.triplet || "-")}</strong></span>
          <span class="metric"><small>Resonance</small><strong>${escapeHtml(String(entry.resonance || "-"))}</strong></span>
        </div>
      </article>
    `).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function renderChoiceGroup(items, selected, className, dataName) {
    return items.map((item) => {
      const value = typeof item === "string" ? item : String(item.value);
      const label = typeof item === "string" ? item : item.label;
      const why = typeof item === "string" ? (triplets[item] || breaths[item] || "") : item.why;
      const isSelected = String(selected) === value;
      return `<button class="${className}${isSelected ? " selected" : ""}" data-${dataName}="${escapeHtml(value)}">${escapeHtml(label)}<span>${escapeHtml(why)}</span></button>`;
    }).join("");
  }

  function renderModule(name) {
    const module = modules[name];
    if (!module) return;
    const isNewModule = state.module !== name;
    state.module = name;
    if (isNewModule) state.tone = module.defaultTone;
    const root = $("#module-root");
    root.innerHTML = `
      <header class="module-header">
        <h2>${module.title}</h2>
        <p>${module.subtitle}</p>
      </header>

      <section class="panel">
        <h3>Why Use This Module</h3>
        <p class="gold">${module.modality}</p>
        <p>${module.purpose}</p>
      </section>

      <section class="panel">
        <h3>What To Do Now</h3>
        <ul>${module.now.map((line) => `<li>${line}</li>`).join("")}</ul>
        <p><strong>What to notice:</strong> ${module.notice}</p>
        <p><strong>Do not force:</strong> ${module.force}</p>
      </section>

      ${renderModuleBody(name)}
    `;
    bindModule(root, name);
    drawModuleCanvas(name);
    showScreen("module");
  }

  function renderModuleBody(name) {
    if (name === "vector") {
      return `
        <section class="panel">
          <label for="intention">Intention</label>
          <textarea id="intention" class="textarea" placeholder="I am entering this session to...">${escapeHtml(state.intention)}</textarea>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.tone, "tone-choice", "tone")}</div>
          <h3>Prime Triplet Pathway</h3>
          <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.triplet, "choice", "triplet")}</div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="control-row">
            <button class="button button-primary" data-action="generate-vector">Generate Vector</button>
            <button class="button button-muted" data-action="play-tone">Play Carrier</button>
            <button class="button button-quiet" data-action="save-session">Save to Codex</button>
          </div>
        </section>
      `;
    }

    if (name === "breath") {
      return `
        <section class="panel">
          <h3>Breath Rhythm</h3>
          <div class="choice-grid">${renderChoiceGroup(Object.keys(breaths), state.breath, "choice", "breath")}</div>
          <label for="resonance">Self-rated resonance: <strong id="resonance-value">${state.resonance}</strong></label>
          <input id="resonance" type="range" min="1" max="10" value="${state.resonance}">
          <p>Choose the number that matches your current charge. A higher number can mean more intensity, openness, emotion, energy, or readiness. It is not a score to perform.</p>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.tone, "tone-choice", "tone")}</div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="control-row">
            <button class="button button-primary" data-action="start-breath">Start Breath Tone</button>
            <button class="button button-muted" data-action="save-session">Save Harmonic Profile</button>
          </div>
        </section>
      `;
    }

    if (name === "gate") {
      return `
        <section class="panel">
          <h3>Prime Triplet Pathway</h3>
          <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.triplet, "choice", "triplet")}</div>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.tone, "tone-choice", "tone")}</div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="metric-grid">
            <span class="metric"><small>Breath Seal</small><strong id="breath-lock">Pending</strong></span>
            <span class="metric"><small>Glyph Nodes</small><strong id="node-lock">0 / 3</strong></span>
            <span class="metric"><small>Gate</small><strong id="gate-lock">Locked</strong></span>
          </div>
          <div class="control-row" id="node-buttons"></div>
          <div class="control-row">
            <button class="button button-primary" data-action="enter-gate">Enter Gate</button>
            <button class="button button-muted" data-action="save-session">Save Gate Session</button>
          </div>
        </section>
      `;
    }

    return `
      <section class="panel">
        <label for="mirror-intention">Current intention</label>
        <textarea id="mirror-intention" class="textarea" placeholder="Read the intention back to yourself.">${escapeHtml(state.intention)}</textarea>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.tone, "tone-choice", "tone")}</div>
        <div class="module-canvas-card mirror-stage">
          <video id="mirror-video" playsinline muted></video>
          <canvas id="module-canvas" width="620" height="620"></canvas>
        </div>
        <div class="control-row">
          <button class="button button-primary" data-action="start-camera">Activate Camera Mirror</button>
          <button class="button button-muted" data-action="play-tone">Play Mirror Tone</button>
          <button class="button button-quiet" data-action="save-session">Save Reflection</button>
        </div>
      </section>
    `;
  }

  function bindModule(root, name) {
    $$(".tone-choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.tone = Number(button.dataset.tone);
        renderModule(name);
      });
    });
    $$(".choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.triplet) state.triplet = button.dataset.triplet;
        if (button.dataset.breath) state.breath = button.dataset.breath;
        renderModule(name);
      });
    });

    $("#intention", root)?.addEventListener("input", (event) => {
      state.intention = event.target.value;
    });
    $("#mirror-intention", root)?.addEventListener("input", (event) => {
      state.intention = event.target.value;
    });
    $("#resonance", root)?.addEventListener("input", (event) => {
      state.resonance = event.target.value;
      $("#resonance-value").textContent = event.target.value;
    });

    if (name === "gate") renderNodeButtons();
  }

  function renderNodeButtons() {
    const holder = $("#node-buttons");
    if (!holder) return;
    holder.innerHTML = state.triplet.split("-").map((node) => (
      `<button class="button button-muted" data-action="touch-node" data-node="${node}">${node}</button>`
    )).join("");
  }

  async function startCamera() {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      state.cameraStream = stream;
      const video = $("#mirror-video");
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (error) {
      alert("Camera mirror could not open in this browser. You can still use the Symbolic Mirror silently.");
    }
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((track) => track.stop());
      state.cameraStream = null;
    }
  }

  function handleAction(action, target) {
    if (action === "open-anchor") showScreen("anchor");
    if (action === "open-about") showScreen("about");
    if (action === "open-wheel") showScreen("wheel");
    if (action === "open-codex") showScreen("codex");
    if (action === "open-recovery") openRecovery();
    if (action === "close-recovery") closeRecovery();
    if (action === "repeat-recovery") openRecovery(true);
    if (action === "start-sequence") renderModule("breath");
    if (action === "generate-vector") {
      const encoded = encodeVector($("#intention")?.value || state.intention, state.triplet);
      state.latestGlyph = encoded;
      drawModuleCanvas("vector", encoded);
      playTone(state.tone, 2.2, "pulse");
    }
    if (action === "play-tone") playTone(state.tone, 3, "single");
    if (action === "start-breath") playTone(state.tone, 10, "soundscape");
    if (action === "enter-gate") {
      playTone(state.tone, 12, "soundscape");
      $("#breath-lock").textContent = "Sealed";
    }
    if (action === "touch-node") {
      target.classList.add("selected");
      const touched = $$("#node-buttons .selected").length;
      $("#node-lock").textContent = `${touched} / 3`;
      if (touched >= 3) $("#gate-lock").textContent = "Open";
      playTone(state.tone + Number(target.dataset.node || 0) * 2, 0.42, "single");
    }
    if (action === "start-camera") startCamera();
    if (action === "save-session") {
      const module = modules[state.module] || {};
      saveCodex({
        module: module.title,
        intention: $("#intention")?.value || $("#mirror-intention")?.value || state.intention || module.phrase,
        tone: `${state.tone} Hz`,
        triplet: state.triplet,
        breath: state.breath,
        resonance: state.resonance
      });
      alert("Saved to Personal Codex in this browser.");
    }
  }

  function bindGlobalActions() {
    document.addEventListener("click", (event) => {
      const actionTarget = event.target.closest("[data-action]");
      const moduleTarget = event.target.closest("[data-module]");
      if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);
      if (moduleTarget) renderModule(moduleTarget.dataset.module);
    });
  }

  function drawField() {
    const canvas = $("#field-canvas");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (time) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.scale(dpr, dpr);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const t = time / 1000;
      ctx.strokeStyle = "rgba(226,184,86,0.075)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        const radius = 150 + i * 82 + Math.sin(t * 0.33 + i) * 10;
        ctx.ellipse(cx, cy, radius * 1.25, radius * 0.82, t * 0.04 + i * 0.32, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawSigil(canvas, time = performance.now(), compact = false) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * (compact ? 0.28 : 0.38);
    const t = time / 1000;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(cx, cy);

    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, r * 1.6);
    gradient.addColorStop(0, "rgba(226,184,86,0.24)");
    gradient.addColorStop(0.5, "rgba(60,70,130,0.16)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(226,184,86,0.62)";
    ctx.lineWidth = compact ? 2 : 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(t * 0.12);
    const nodes = 5;
    const points = [];
    for (let i = 0; i < nodes; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / nodes;
      points.push([Math.cos(angle) * r * 0.82, Math.sin(angle) * r * 0.82]);
    }
    ctx.strokeStyle = "rgba(225,230,248,0.72)";
    ctx.lineWidth = compact ? 1.7 : 2.1;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "rgba(226,184,86,0.46)";
    ctx.beginPath();
    for (let i = 0; i < points.length; i += 1) {
      const [x, y] = points[i];
      const [x2, y2] = points[(i + 2) % points.length];
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();

    ctx.fillStyle = "#e2b856";
    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, compact ? 5 : 8, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.rotate(-t * 0.32);
    ctx.strokeStyle = "rgba(226,184,86,0.9)";
    ctx.lineWidth = compact ? 2 : 3;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 5.2; a += 0.08) {
      const sr = a * (compact ? 2.2 : 3.5);
      const x = Math.cos(a) * sr;
      const y = Math.sin(a) * sr;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawAnchorLoop() {
    const anchor = $("#anchor-sigil-canvas");
    const recovery = $("#recovery-canvas");
    const loop = (time) => {
      if (anchor) drawSigil(anchor, time);
      if (recovery && !$("#recovery-sheet").hidden) drawSigil(recovery, time, true);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawWheel() {
    const canvas = $("#wheel-canvas");
    const ctx = canvas.getContext("2d");
    const loop = (time) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      drawSigil(canvas, time);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(time / 14000);
      ctx.strokeStyle = "rgba(226,184,86,0.35)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -190);
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawModuleCanvas(name, encoded = state.latestGlyph) {
    const canvas = $("#module-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const trip = state.triplet.split("-").map(Number);
    const loop = (time) => {
      if (!document.body.contains(canvas)) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.34;
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, base * 1.8);
      glow.addColorStop(0, "rgba(226,184,86,0.20)");
      glow.addColorStop(0.5, "rgba(67,75,148,0.20)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.11);
      ctx.strokeStyle = "rgba(210,218,245,0.22)";
      for (let i = 1; i <= 4; i += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, base * i / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (name === "breath") {
        const pulse = 0.72 + (Math.sin(t * 0.8) + 1) * 0.18;
        ctx.scale(pulse, pulse * 0.72);
        drawTorusLines(ctx, base);
      } else if (name === "gate") {
        drawGate(ctx, base, trip, t);
      } else if (name === "mirror") {
        drawMirrorOverlay(ctx, base, t);
      } else {
        drawGlyph(ctx, base, encoded || encodeVector(state.intention, state.triplet), t);
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawTorusLines(ctx, base) {
    ctx.strokeStyle = "rgba(226,184,86,0.55)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      ctx.rotate(Math.PI / 8);
      ctx.beginPath();
      ctx.ellipse(0, 0, base, base * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawGate(ctx, base, trip, t) {
    const points = [];
    const count = 16;
    for (let i = 0; i < count; i += 1) {
      const prime = trip[i % trip.length];
      const angle = (i * prime * Math.PI * 2 / count) + t * 0.07;
      const radius = base * (0.36 + ((i * prime) % 7) / 10);
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    ctx.strokeStyle = "rgba(226,184,86,0.62)";
    ctx.lineWidth = 2;
    for (let i = 0; i < points.length; i += 1) {
      const [x, y] = points[i];
      const [x2, y2] = points[(i + trip[1]) % points.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.fillStyle = "#e2b856";
    points.forEach(([x, y], index) => {
      ctx.globalAlpha = index % 3 === 0 ? 1 : 0.55;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawMirrorOverlay(ctx, base, t) {
    ctx.strokeStyle = "rgba(226,184,86,0.62)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, base * 0.78, 0, Math.PI * 2);
    ctx.stroke();
    ctx.rotate(Math.sin(t * 0.22) * 0.25);
    drawGlyph(ctx, base * 0.78, encodeVector(state.intention || "mirror", state.triplet), t);
  }

  function drawGlyph(ctx, base, encoded, t) {
    const coords = encoded.coords || [0.2, 0.5, 0.8];
    const points = coords.map((coord, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / 3 + t * 0.04;
      const radius = base * (0.58 + Math.abs(coord) * 0.28);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius];
    });
    ctx.strokeStyle = "rgba(226,184,86,0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "rgba(220,226,245,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -base * 0.65);
    points.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#e2b856";
    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function openRecovery(repeat = false) {
    state.recoveryStart = performance.now();
    state.recoveryActive = true;
    $("#recovery-sheet").hidden = false;
    if (!repeat) playTone(144, 7, "soundscape");
  }

  function closeRecovery() {
    state.recoveryActive = false;
    $("#recovery-sheet").hidden = true;
    stopTone();
  }

  function updateRecovery() {
    if (state.recoveryActive) {
      const elapsed = (performance.now() - state.recoveryStart) / 1000;
      const total = 12;
      const cycle = elapsed % 4;
      const breath = Math.min(3, Math.floor(elapsed / 4) + 1);
      $("#recovery-progress").style.width = `${Math.min(100, elapsed / total * 100)}%`;
      $("#recovery-phase").textContent = `${cycle < 2 ? "Inhale" : "Exhale"} ${Math.max(1, 2 - Math.floor(cycle % 2))}s - Breath ${breath} of 3`;
      if (elapsed >= total) state.recoveryActive = false;
    }
    requestAnimationFrame(updateRecovery);
  }

  function boot() {
    bindGlobalActions();
    drawField();
    drawAnchorLoop();
    drawWheel();
    updateRecovery();
    showScreen("anchor");

    window.addEventListener("beforeunload", () => {
      stopTone();
      stopCamera();
    });
  }

  boot();
})();
