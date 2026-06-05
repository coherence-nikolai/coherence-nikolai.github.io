(function () {
  const phases = [
    {
      key: "inhale",
      label: "Inhale",
      count: 4,
      instruction: "Let attention widen.",
      color: "#72e4ff",
      baseMs: 4000
    },
    {
      key: "pause",
      label: "Pause",
      count: 2,
      instruction: "Notice the place that does not choose a side.",
      color: "#d8ad58",
      baseMs: 2000
    },
    {
      key: "exhale",
      label: "Exhale",
      count: 6,
      instruction: "Let form return gently.",
      color: "#c66c36",
      baseMs: 6000
    },
    {
      key: "rest",
      label: "Rest",
      count: 2,
      instruction: "Allow the cycle to complete.",
      color: "#72d59b",
      baseMs: 2000
    }
  ];

  const pairs = [
    {
      id: "expansion-return",
      name: "Expansion / Return",
      short: "Open and form",
      equation: "1 + 0 = 1",
      motif: "Orbit",
      prompt: "Where can absence be included without losing wholeness?",
      description: "A practice for moving between openness and form without forcing a winner.",
      colorA: "#72e4ff",
      colorB: "#c66c36"
    },
    {
      id: "chaos-order",
      name: "Chaos / Order",
      short: "Signal and crystal",
      equation: "edge = pattern",
      motif: "Fractal",
      prompt: "Where is disorder asking to become information, and where is order becoming too rigid to breathe?",
      description: "A way to notice when life wants more structure or more freedom.",
      colorA: "#a688ff",
      colorB: "#72d59b"
    },
    {
      id: "shadow-persona",
      name: "Shadow / Persona",
      short: "Hidden and shown",
      equation: "1 x 0 = 0",
      motif: "Mirror",
      prompt: "What part of you has been protecting the visible self from a truth it is ready to meet?",
      description: "A gentle inquiry into what is hidden, performed, or ready to be integrated.",
      colorA: "#8c6dff",
      colorB: "#d8ad58"
    },
    {
      id: "inner-outer",
      name: "Inner / Outer",
      short: "Depth and world",
      equation: "axis = relation",
      motif: "Axis",
      prompt: "What inner signal wants to change how you move through the outer world?",
      description: "A practice for aligning private awareness with visible action.",
      colorA: "#6fa7ff",
      colorB: "#e37a8e"
    },
    {
      id: "wave-particle",
      name: "Wave / Particle",
      short: "Field and point",
      equation: "phase -> point",
      motif: "Wave",
      prompt: "Where do you need to stay fluid, and where do you need to become specific?",
      description: "A lens for choosing between possibility and commitment.",
      colorA: "#72e4ff",
      colorB: "#d8ad58"
    },
    {
      id: "many-one",
      name: "Many / One",
      short: "Multiplicity and center",
      equation: "0^0 = threshold",
      motif: "Stillpoint",
      prompt: "What appears when many competing meanings are allowed to gather around one quiet center?",
      description: "A contemplative pause for complexity, unity, and the point between them.",
      colorA: "#72d59b",
      colorB: "#f0c46a"
    },
    {
      id: "unknown-known",
      name: "Unknown / Known",
      short: "Mystery and map",
      equation: "question -> form",
      motif: "Spiral",
      prompt: "What mystery is not asking to be solved yet, only accompanied?",
      description: "A practice for staying close to uncertainty without turning away.",
      colorA: "#a688ff",
      colorB: "#6fa7ff"
    },
    {
      id: "tension-support",
      name: "Tension / Support",
      short: "Force and third side",
      equation: "5-12-13",
      motif: "Triangle",
      prompt: "What would create a stable third side between the pressure you feel and the support you need?",
      description: "A triangle practice for relation, direction, and stability.",
      colorA: "#c66c36",
      colorB: "#72d59b"
    }
  ];

  const symbols = [
    {
      equation: "1 + 0 = 1",
      title: "Inclusion",
      body: "A prompt for spaciousness. Something absent, quiet, or unspoken can be included without destroying the whole."
    },
    {
      equation: "1 x 0 = 0",
      title: "Dissolution",
      body: "A prompt for surrender. Contact with the unknown may dissolve a shape that has become too fixed."
    },
    {
      equation: "0^0",
      title: "Threshold",
      body: "A symbol for the charged pause where certainty and emptiness meet without resolving too quickly."
    },
    {
      equation: "Euler cycle",
      title: "Return",
      body: "A reminder that practice moves in phases: opening, turning, releasing, and coming back."
    },
    {
      equation: "5-12-13",
      title: "Stable Relation",
      body: "A triangle lens. Two forces become workable when a third side gives them proportion."
    },
    {
      equation: "wave -> point",
      title: "Commitment",
      body: "Possibility becomes action when the field gathers into one chosen point."
    }
  ];

  const storageKey = "inner-orbit-v1-journal";

  const els = {
    orbitCanvas: document.getElementById("orbitCanvas"),
    cardCanvas: document.getElementById("cardCanvas"),
    beginButton: document.getElementById("beginButton"),
    resetButton: document.getElementById("resetButton"),
    saveButton: document.getElementById("saveButton"),
    cardButton: document.getElementById("cardButton"),
    downloadButton: document.getElementById("downloadButton"),
    phaseLabel: document.getElementById("phaseLabel"),
    phaseInstruction: document.getElementById("phaseInstruction"),
    cycleProgress: document.getElementById("cycleProgress"),
    paceRange: document.getElementById("paceRange"),
    paceOutput: document.getElementById("paceOutput"),
    polarityList: document.getElementById("polarityList"),
    equationLabel: document.getElementById("equationLabel"),
    motifLabel: document.getElementById("motifLabel"),
    promptText: document.getElementById("promptText"),
    noteInput: document.getElementById("noteInput"),
    journalList: document.getElementById("journalList"),
    entryCount: document.getElementById("entryCount"),
    mandala: document.getElementById("mandala"),
    mapPairTitle: document.getElementById("mapPairTitle"),
    mapPairText: document.getElementById("mapPairText"),
    intentionText: document.getElementById("intentionText"),
    libraryGrid: document.getElementById("libraryGrid")
  };

  const state = {
    running: false,
    selectedPairId: pairs[0].id,
    intention: "Hold both",
    pace: 1,
    startedAt: 0,
    elapsedAtPause: 0,
    lastPhaseKey: "inhale",
    latestCardEntry: null,
    journal: loadJournal()
  };

  const orbitCtx = els.orbitCanvas.getContext("2d");
  const cardCtx = els.cardCanvas.getContext("2d");

  function loadJournal() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveJournal() {
    localStorage.setItem(storageKey, JSON.stringify(state.journal));
  }

  function getSelectedPair() {
    return pairs.find((pair) => pair.id === state.selectedPairId) || pairs[0];
  }

  function getPhaseDurations() {
    return phases.map((phase) => ({
      ...phase,
      duration: phase.baseMs / state.pace
    }));
  }

  function getMetrics(now) {
    const phaseDurations = getPhaseDurations();
    const cycleMs = phaseDurations.reduce((total, phase) => total + phase.duration, 0);
    const elapsed = state.running ? state.elapsedAtPause + now - state.startedAt : state.elapsedAtPause;
    const cycleElapsed = ((elapsed % cycleMs) + cycleMs) % cycleMs;
    let cursor = 0;
    let active = phaseDurations[0];

    for (const phase of phaseDurations) {
      if (cycleElapsed >= cursor && cycleElapsed < cursor + phase.duration) {
        active = phase;
        break;
      }
      cursor += phase.duration;
    }

    const phaseElapsed = cycleElapsed - cursor;
    return {
      elapsed,
      cycleElapsed,
      cycleMs,
      cycleProgress: cycleElapsed / cycleMs,
      phase: active,
      phaseProgress: Math.max(0, Math.min(1, phaseElapsed / active.duration))
    };
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function getBreathScale(metrics, time) {
    const t = easeInOut(metrics.phaseProgress);
    if (metrics.phase.key === "inhale") return 0.44 + t * 0.5;
    if (metrics.phase.key === "pause") return 0.94 + Math.sin(time * 0.0018) * 0.025;
    if (metrics.phase.key === "exhale") return 0.94 - t * 0.48;
    return 0.46 + Math.sin(time * 0.0012) * 0.018;
  }

  function resizeCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    return { width: rect.width, height: rect.height };
  }

  function drawOrbit(now, metrics) {
    const size = resizeCanvas(els.orbitCanvas, orbitCtx);
    const w = size.width;
    const h = size.height;
    const cx = w / 2;
    const cy = h / 2 + 8;
    const scale = Math.min(w, h) * 0.42;
    const breath = getBreathScale(metrics, now);
    const pair = getSelectedPair();

    orbitCtx.clearRect(0, 0, w, h);
    drawStageGlow(orbitCtx, w, h, cx, cy, pair, breath);
    drawAxes(orbitCtx, w, h, cx, cy);
    drawExpansionMesh(orbitCtx, cx, cy, scale, breath, now, pair);
    drawReturnOrbit(orbitCtx, cx, cy, scale, breath, now, pair);
    drawSpiral(orbitCtx, cx, cy, scale, breath, now, pair);
    drawStillpoint(orbitCtx, cx, cy, scale, breath, metrics);
    drawBreathCurve(orbitCtx, w, h, metrics, pair);
  }

  function drawStageGlow(ctx, w, h, cx, cy, pair, breath) {
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.62);
    gradient.addColorStop(0, hexToRgba(pair.colorA, 0.16 + breath * 0.05));
    gradient.addColorStop(0.35, hexToRgba(pair.colorB, 0.07));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  function drawAxes(ctx, w, h, cx, cy) {
    ctx.save();
    ctx.strokeStyle = "rgba(137,164,204,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, cy);
    ctx.lineTo(w - 28, cy);
    ctx.moveTo(cx, 32);
    ctx.lineTo(cx, h - 38);
    ctx.stroke();

    ctx.font = "700 11px SFMono-Regular, Consolas, monospace";
    ctx.fillStyle = "rgba(145,163,187,0.76)";
    ctx.fillText("RETURN", Math.max(32, w - 96), h - 34);
    ctx.fillText("STILLPOINT", cx + 12, cy - 12);
    ctx.restore();
  }

  function drawExpansionMesh(ctx, cx, cy, scale, breath, now, pair) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = hexToRgba(pair.colorA, 0.28);

    for (let i = -4; i <= 4; i += 1) {
      const offset = i * scale * 0.12;
      ctx.beginPath();
      for (let step = 0; step <= 90; step += 1) {
        const t = step / 90;
        const y = cy + (t - 0.5) * scale * 1.62;
        const bend = Math.pow(t - 0.5, 2) * scale * 0.92 * breath;
        const wave = Math.sin(t * Math.PI * 2 + now * 0.001 + i) * 9;
        const x = cx + offset + Math.sign(i || 1) * bend + wave;
        step === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = hexToRgba(pair.colorA, 0.16);
    for (let ring = 0; ring < 5; ring += 1) {
      const r = scale * (0.24 + ring * 0.14) * breath;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.44, r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawReturnOrbit(ctx, cx, cy, scale, breath, now, pair) {
    ctx.save();
    ctx.lineWidth = 1.2;

    for (let i = 0; i < 7; i += 1) {
      const t = i / 7;
      const alpha = 0.08 + t * 0.07;
      const rx = scale * (0.52 + t * 0.46) * (0.82 + breath * 0.18);
      const ry = scale * (0.16 + t * 0.18) * (1.12 - breath * 0.12);
      ctx.strokeStyle = hexToRgba(pair.colorB, alpha);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, Math.sin(now * 0.00035 + i) * 0.06, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = hexToRgba("#d8ad58", 0.36);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, scale * 0.19, scale * 0.19, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSpiral(ctx, cx, cy, scale, breath, now, pair) {
    ctx.save();
    const gradient = ctx.createLinearGradient(cx - scale, cy, cx + scale, cy);
    gradient.addColorStop(0, hexToRgba(pair.colorA, 0.9));
    gradient.addColorStop(0.5, "rgba(216,173,88,0.88)");
    gradient.addColorStop(1, hexToRgba(pair.colorB, 0.9));
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 22;
    ctx.shadowColor = hexToRgba(pair.colorA, 0.42);
    ctx.beginPath();

    for (let i = 0; i <= 420; i += 1) {
      const t = i / 420;
      const theta = t * Math.PI * 4.8 + now * 0.00022;
      const r = scale * (0.04 + t * 0.62) * (0.55 + breath * 0.45);
      const pinch = 0.52 + Math.sin(theta * 0.5) * 0.08;
      const x = cx + Math.cos(theta) * r * 1.58;
      const y = cy + Math.sin(theta) * r * pinch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawStillpoint(ctx, cx, cy, scale, breath, metrics) {
    ctx.save();
    const pulse = metrics.phase.key === "pause" ? 1 + Math.sin(metrics.phaseProgress * Math.PI) * 0.45 : 1;
    const radius = 6 + breath * 4 * pulse;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 4.5);
    gradient.addColorStop(0, "rgba(255,235,178,1)");
    gradient.addColorStop(0.32, "rgba(216,173,88,0.62)");
    gradient.addColorStop(1, "rgba(216,173,88,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2ce78";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(242,206,120,0.54)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, scale * (0.08 + i * 0.08) * breath, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBreathCurve(ctx, w, h, metrics, pair) {
    const x0 = w * 0.16;
    const x1 = w * 0.84;
    const y = h - 88;
    const width = x1 - x0;

    ctx.save();
    ctx.strokeStyle = "rgba(137,164,204,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();

    const gradient = ctx.createLinearGradient(x0, 0, x1, 0);
    gradient.addColorStop(0, pair.colorA);
    gradient.addColorStop(0.48, "#d8ad58");
    gradient.addColorStop(0.74, pair.colorB);
    gradient.addColorStop(1, "#72d59b");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();

    for (let i = 0; i <= 160; i += 1) {
      const t = i / 160;
      let value;
      if (t < 0.3) value = easeInOut(t / 0.3) * 0.75;
      else if (t < 0.45) value = 0.75 - (t - 0.3) / 0.15 * 0.08;
      else if (t < 0.84) value = 0.67 - easeInOut((t - 0.45) / 0.39) * 0.42;
      else value = 0.25 - (t - 0.84) / 0.16 * 0.03;
      const px = x0 + t * width;
      const py = y - value * 54;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    const markerX = x0 + metrics.cycleProgress * width;
    ctx.fillStyle = "#f2ce78";
    ctx.beginPath();
    ctx.arc(markerX, y - 44, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function updatePhaseDom(metrics) {
    if (state.lastPhaseKey !== metrics.phase.key) {
      state.lastPhaseKey = metrics.phase.key;
      document.querySelectorAll("[data-phase-jump]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.phaseJump === metrics.phase.key);
      });
    }

    els.phaseLabel.textContent = metrics.phase.label;
    els.phaseInstruction.textContent = metrics.phase.instruction;
    els.cycleProgress.style.width = `${Math.round(metrics.cycleProgress * 100)}%`;
  }

  function animationLoop(now) {
    const metrics = getMetrics(now);
    updatePhaseDom(metrics);
    drawOrbit(now, metrics);
    requestAnimationFrame(animationLoop);
  }

  function renderPolarityList() {
    els.polarityList.replaceChildren();

    pairs.forEach((pair) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "polarity-button";
      button.dataset.pairId = pair.id;
      button.innerHTML = `<strong>${pair.name}</strong><small>${pair.short}</small>`;
      button.classList.toggle("is-active", pair.id === state.selectedPairId);
      button.addEventListener("click", () => selectPair(pair.id));
      els.polarityList.append(button);
    });
  }

  function renderMandala() {
    els.mandala.replaceChildren();

    pairs.forEach((pair, index) => {
      const angle = (index / pairs.length) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(angle) * 37;
      const y = 50 + Math.sin(angle) * 37;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-node";
      button.style.left = `${x}%`;
      button.style.top = `${y}%`;
      button.dataset.pairId = pair.id;
      button.innerHTML = `<strong>${pair.name}</strong><small>${pair.motif}</small>`;
      button.classList.toggle("is-active", pair.id === state.selectedPairId);
      button.addEventListener("click", () => selectPair(pair.id));
      els.mandala.append(button);
    });

    const center = document.createElement("div");
    center.className = "map-node is-active";
    center.style.left = "50%";
    center.style.top = "50%";
    center.innerHTML = "<strong>Stillpoint</strong><small>Hold both</small>";
    els.mandala.append(center);
  }

  function renderLibrary() {
    els.libraryGrid.replaceChildren();
    symbols.forEach((symbol) => {
      const card = document.createElement("article");
      card.className = "symbol-card";
      card.innerHTML = `<strong>${symbol.equation}</strong><h2>${symbol.title}</h2><p>${symbol.body}</p>`;
      els.libraryGrid.append(card);
    });
  }

  function selectPair(pairId) {
    state.selectedPairId = pairId;
    const pair = getSelectedPair();
    els.equationLabel.textContent = pair.equation;
    els.motifLabel.textContent = pair.name;
    els.promptText.textContent = pair.prompt;
    els.mapPairTitle.textContent = pair.name;
    els.mapPairText.textContent = pair.description;
    renderPolarityList();
    renderMandala();
    renderCardPreview(createCurrentEntry(false));
  }

  function setView(viewName) {
    document.querySelectorAll("[data-view-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.viewPanel === viewName);
    });
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.viewLink === viewName);
    });
  }

  function createCurrentEntry(withId) {
    const pair = getSelectedPair();
    const metrics = getMetrics(performance.now());
    const note = els.noteInput.value.trim();
    return {
      id: withId ? String(Date.now()) : "preview",
      createdAt: new Date().toISOString(),
      pairId: pair.id,
      pairName: pair.name,
      equation: pair.equation,
      motif: pair.motif,
      prompt: pair.prompt,
      note: note || "A quiet practice with the current orbit.",
      phase: metrics.phase.label,
      intention: state.intention,
      colorA: pair.colorA,
      colorB: pair.colorB
    };
  }

  function saveInsight() {
    const entry = createCurrentEntry(true);
    state.journal.unshift(entry);
    state.journal = state.journal.slice(0, 24);
    saveJournal();
    renderJournal();
    renderEntryCount();
    renderCardPreview(entry);
    setView("journal");
  }

  function renderJournal() {
    els.journalList.replaceChildren();

    if (!state.journal.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No saved insights yet. Begin a practice, choose a polarity, write one honest line, then save it here.";
      els.journalList.append(empty);
      return;
    }

    state.journal.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "journal-entry";

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = entry.pairName;
      const note = document.createElement("p");
      note.textContent = entry.note;
      body.append(title, note);

      const actions = document.createElement("div");
      actions.className = "entry-actions";
      const time = document.createElement("time");
      time.dateTime = entry.createdAt;
      time.textContent = formatDate(entry.createdAt);
      const useButton = document.createElement("button");
      useButton.type = "button";
      useButton.className = "text-action";
      useButton.textContent = "Card";
      useButton.addEventListener("click", () => renderCardPreview(entry));
      actions.append(time, useButton);

      item.append(body, actions);
      els.journalList.append(item);
    });
  }

  function renderEntryCount() {
    els.entryCount.textContent = String(state.journal.length);
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function renderCardPreview(entry) {
    state.latestCardEntry = entry;
    const ctx = cardCtx;
    const w = els.cardCanvas.width;
    const h = els.cardCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#05080d");
    bg.addColorStop(0.48, "#0b1520");
    bg.addColorStop(1, "#090908");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.42;
    const radius = Math.min(w, h) * 0.28;
    drawCardGeometry(ctx, cx, cy, radius, entry);

    ctx.fillStyle = "#edf4ff";
    ctx.font = "700 48px Inter, system-ui, sans-serif";
    ctx.fillText("Inner Orbit", 72, 92);

    ctx.fillStyle = entry.colorA;
    ctx.font = "700 26px SFMono-Regular, Consolas, monospace";
    ctx.fillText(entry.equation, 72, h * 0.68);

    ctx.fillStyle = "#edf4ff";
    ctx.font = "800 42px Inter, system-ui, sans-serif";
    wrapText(ctx, entry.pairName, 72, h * 0.735, w - 144, 48);

    ctx.fillStyle = "#a7b7cc";
    ctx.font = "28px Inter, system-ui, sans-serif";
    wrapText(ctx, entry.note, 72, h * 0.82, w - 144, 39, 4);

    ctx.fillStyle = "#6f8098";
    ctx.font = "700 20px SFMono-Regular, Consolas, monospace";
    ctx.fillText(`${entry.phase} / ${entry.intention}`, 72, h - 70);
  }

  function drawCardGeometry(ctx, cx, cy, radius, entry) {
    ctx.save();
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.2);
    glow.addColorStop(0, hexToRgba(entry.colorA, 0.25));
    glow.addColorStop(0.46, hexToRgba(entry.colorB, 0.1));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      ctx.strokeStyle = i % 2 === 0 ? hexToRgba(entry.colorA, 0.3) : hexToRgba(entry.colorB, 0.24);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * (0.55 + i * 0.11), radius * (0.18 + i * 0.035), i * 0.18, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "#d8ad58";
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i <= 360; i += 1) {
      const t = i / 360;
      const theta = t * Math.PI * 5.2;
      const r = radius * (0.08 + t * 0.82);
      const x = cx + Math.cos(theta) * r * 1.18;
      const y = cy + Math.sin(theta) * r * 0.74;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#f2ce78";
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(/\s+/);
    let line = "";
    let lineCount = 0;

    for (let i = 0; i < words.length; i += 1) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = words[i];
        y += lineHeight;
        lineCount += 1;
        if (maxLines && lineCount >= maxLines) return;
      } else {
        line = testLine;
      }
    }

    if (line) ctx.fillText(line, x, y);
  }

  function downloadCard() {
    if (!state.latestCardEntry) {
      renderCardPreview(createCurrentEntry(false));
    }
    const link = document.createElement("a");
    link.download = "inner-orbit-insight-card.png";
    link.href = els.cardCanvas.toDataURL("image/png");
    link.click();
  }

  function jumpToPhase(phaseKey) {
    const phaseDurations = getPhaseDurations();
    let offset = 0;
    for (const phase of phaseDurations) {
      if (phase.key === phaseKey) break;
      offset += phase.duration;
    }
    state.elapsedAtPause = offset;
    state.startedAt = performance.now();
  }

  function resetPractice() {
    state.running = false;
    state.elapsedAtPause = 0;
    state.startedAt = performance.now();
    els.beginButton.textContent = "Begin";
  }

  function togglePractice() {
    const now = performance.now();
    if (state.running) {
      state.elapsedAtPause += now - state.startedAt;
      state.running = false;
      els.beginButton.textContent = "Begin";
    } else {
      state.startedAt = now;
      state.running = true;
      els.beginButton.textContent = "Pause";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        setView(link.dataset.viewLink);
      });
    });

    document.querySelectorAll("[data-phase-jump]").forEach((button) => {
      button.addEventListener("click", () => jumpToPhase(button.dataset.phaseJump));
    });

    document.querySelectorAll("[data-intention]").forEach((button) => {
      button.addEventListener("click", () => {
        state.intention = button.dataset.intention;
        document.querySelectorAll("[data-intention]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });
        els.intentionText.textContent = `Current intention: ${state.intention}.`;
        renderCardPreview(createCurrentEntry(false));
      });
    });

    els.beginButton.addEventListener("click", togglePractice);
    els.resetButton.addEventListener("click", resetPractice);
    els.saveButton.addEventListener("click", saveInsight);
    els.cardButton.addEventListener("click", () => {
      renderCardPreview(createCurrentEntry(false));
      setView("journal");
    });
    els.downloadButton.addEventListener("click", downloadCard);
    els.paceRange.addEventListener("input", () => {
      state.pace = Number(els.paceRange.value);
      els.paceOutput.textContent = `${state.pace.toFixed(2)}x`;
    });
    els.noteInput.addEventListener("input", () => renderCardPreview(createCurrentEntry(false)));
  }

  function init() {
    bindEvents();
    renderPolarityList();
    renderMandala();
    renderLibrary();
    renderJournal();
    renderEntryCount();
    selectPair(state.selectedPairId);
    requestAnimationFrame(animationLoop);
  }

  init();
})();
