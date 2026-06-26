(() => {
  "use strict";

  const storageKey = "toneLoom.web.spells.v1";

  const tones = [
    { id: 1, name: "Awakening", chamber: "Dawn", color: "#e8c871", family: "bell" },
    { id: 2, name: "Introspection", chamber: "Dawn", color: "#f2b7c8", family: "flute" },
    { id: 3, name: "Clarity", chamber: "Dawn", color: "#9ec5db", family: "glass" },
    { id: 4, name: "Ground", chamber: "Dawn", color: "#8b6542", family: "pluck" },
    { id: 5, name: "Ascent", chamber: "Sky", color: "#9d73d8", family: "choir" },
    { id: 6, name: "Focus", chamber: "Sky", color: "#4d8d5d", family: "pluck" },
    { id: 7, name: "Space", chamber: "Sky", color: "#41a6a6", family: "breath" },
    { id: 8, name: "Shimmer", chamber: "Sky", color: "#8fd9e8", family: "glass" },
    { id: 9, name: "Calm", chamber: "Water", color: "#b59ad7", family: "breath" },
    { id: 10, name: "Presence", chamber: "Water", color: "#34366b", family: "bass" },
    { id: 11, name: "Spark", chamber: "Water", color: "#ef8b49", family: "pluck" },
    { id: 12, name: "Tide", chamber: "Water", color: "#8fd8c4", family: "breath" },
    { id: 13, name: "Joy", chamber: "Flame", color: "#79bff0", family: "bell" },
    { id: 14, name: "Strength", chamber: "Flame", color: "#4f4d51", family: "bass" },
    { id: 15, name: "Fire", chamber: "Flame", color: "#e39b4f", family: "pluck" },
    { id: 16, name: "Vision", chamber: "Flame", color: "#fff2dd", family: "harp" },
    { id: 17, name: "Root", chamber: "Earth", color: "#b53b48", family: "bass" },
    { id: 18, name: "Clear Light", chamber: "Earth", color: "#d7edf1", family: "glass" },
    { id: 19, name: "Will", chamber: "Earth", color: "#bf9148", family: "pluck" },
    { id: 20, name: "Merge", chamber: "Earth", color: "#b7c86f", family: "choir" },
    { id: 21, name: "Cave", chamber: "Night", color: "#243d74", family: "breath" },
    { id: 22, name: "Soften", chamber: "Night", color: "#e7a7bd", family: "harp" },
    { id: 23, name: "Infinite", chamber: "Night", color: "#c6ccd4", family: "choir" },
    { id: 24, name: "Origin", chamber: "Night", color: "#fbf7e8", family: "silence" }
  ];

  const modes = [
    { id: "drift", name: "Drift", base: 50, attack: 0.018, duration: 1.25, peak: 0.15, filter: 1650, wet: 0.22 },
    { id: "spark", name: "Spark", base: 57, attack: 0.006, duration: 0.62, peak: 0.18, filter: 2600, wet: 0.13 },
    { id: "bloom", name: "Bloom", base: 52, attack: 0.024, duration: 1.45, peak: 0.14, filter: 2100, wet: 0.26 },
    { id: "pulse", name: "Pulse", base: 48, attack: 0.009, duration: 0.56, peak: 0.19, filter: 1900, wet: 0.15 },
    { id: "mirror", name: "Mirror", base: 55, attack: 0.012, duration: 0.86, peak: 0.16, filter: 2300, wet: 0.24 },
    { id: "night", name: "Night", base: 45, attack: 0.03, duration: 1.65, peak: 0.12, filter: 1200, wet: 0.32 }
  ];

  const lowHighPattern = [-12, -10, -8, -5, -3, 0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36, 38, 40, 43];

  const wheels = [
    {
      id: "low-high",
      name: "Low to High",
      description: "The mythic scale in low-to-high order.",
      order: Array.from({ length: 24 }, (_, index) => index + 1),
      pattern: lowHighPattern,
      mood: ["#e8c871", "#fbf7e8"]
    },
    {
      id: "close-encounter",
      name: "Close Encounter",
      description: "A five-tone signal for circling slowly.",
      order: [7, 8, 3, 3, 20],
      pattern: [2, 4, 0, 0, 7],
      mood: ["#8fd9e8", "#fff2dd"]
    },
    {
      id: "moon-spiral",
      name: "Moon Spiral",
      description: "Soft night tones arranged as a silver turn.",
      order: [24, 2, 7, 12, 18, 22, 9, 16, 4, 21, 13, 1],
      pattern: [-5, 0, 2, 5, 7, 12, 14, 17, 19, 24, 26, 29],
      mood: ["#c6ccd4", "#b59ad7"]
    },
    {
      id: "gold-thread",
      name: "Gold Thread",
      description: "Bright intervals for a graceful phrase.",
      order: [1, 20, 5, 13, 8, 16, 3, 23],
      pattern: [0, 4, 7, 9, 12, 16, 19, 24],
      mood: ["#e8c871", "#b7c86f"]
    },
    {
      id: "dream-clock",
      name: "Dream Clock",
      description: "The full wheel rearranged by hidden steps.",
      order: [1, 8, 15, 22, 5, 12, 19, 2, 9, 16, 23, 6, 13, 20, 3, 10, 17, 24, 7, 14, 21, 4, 11, 18],
      pattern: [-12, -7, -3, 0, 2, 5, 7, 10, 12, 14, 17, 19, 22, 24, 26, 29, 31, 34, 36, 38, 41, 43, 46, 48],
      mood: ["#b59ad7", "#8fd8c4"]
    },
    {
      id: "ember-path",
      name: "Ember Path",
      description: "Warm plucks and grounded sparks.",
      order: [15, 17, 19, 11, 14, 6, 4, 1],
      pattern: [-12, -5, 0, 3, 7, 10, 12, 15],
      mood: ["#e39b4f", "#b53b48"]
    },
    {
      id: "glass-garden",
      name: "Glass Garden",
      description: "Clear chimes with a gentle flowering arc.",
      order: [8, 18, 22, 13, 16, 3, 23, 12, 20],
      pattern: [0, 2, 4, 7, 11, 12, 14, 16, 19],
      mood: ["#8fd9e8", "#e7a7bd"]
    },
    {
      id: "deep-sea",
      name: "Deep Sea",
      description: "Low blue threads and spacious echoes.",
      order: [10, 12, 21, 23, 7, 18, 22, 4],
      pattern: [-19, -12, -10, -5, 0, 2, 7, 12],
      mood: ["#243d74", "#8fd8c4"]
    },
    {
      id: "star-ladder",
      name: "Star Ladder",
      description: "A rising line for luminous runs.",
      order: [1, 3, 5, 8, 13, 16, 20, 23, 24],
      pattern: [-7, 0, 2, 4, 7, 9, 12, 16, 19],
      mood: ["#fff2dd", "#9d73d8"]
    },
    {
      id: "mythic-clock",
      name: "Mythic Clock",
      description: "Twenty-four lore tones around the full mandala.",
      order: [24, 1, 13, 2, 14, 3, 15, 4, 16, 5, 17, 6, 18, 7, 19, 8, 20, 9, 21, 10, 22, 11, 23, 12],
      pattern: [-12, 0, 7, 2, 9, 4, 11, 5, 12, 7, 14, 9, 16, 11, 18, 12, 19, 14, 21, 16, 23, 18, 26, 19],
      mood: ["#fbf7e8", "#79bff0"]
    }
  ];

  const dom = {
    landing: document.getElementById("landingScreen"),
    app: document.getElementById("loomApp"),
    enter: document.getElementById("enterButton"),
    home: document.getElementById("homeButton"),
    canvas: document.getElementById("loomCanvas"),
    hint: document.getElementById("hintText"),
    wheelName: document.getElementById("wheelName"),
    toneCount: document.getElementById("toneCount"),
    spellState: document.getElementById("spellState"),
    wheelDescription: document.getElementById("wheelDescription"),
    wheelButtons: document.getElementById("wheelButtons"),
    modeButtons: document.getElementById("modeButtons"),
    weave: document.getElementById("weaveButton"),
    play: document.getElementById("playButton"),
    keep: document.getElementById("keepButton"),
    clear: document.getElementById("clearButton"),
    saveDialog: document.getElementById("saveDialog"),
    spellName: document.getElementById("spellNameInput"),
    intention: document.getElementById("intentionInput"),
    archiveDialog: document.getElementById("archiveDialog"),
    archiveList: document.getElementById("archiveList"),
    archive: document.getElementById("archiveButton"),
    seedButton: document.getElementById("seedButton"),
    seedInput: document.getElementById("seedInput"),
    seedStrip: document.getElementById("seedStrip"),
    seedName: document.getElementById("seedName"),
    playSeed: document.getElementById("playSeedButton"),
    loopSeed: document.getElementById("loopSeedButton"),
    clearSeed: document.getElementById("clearSeedButton")
  };

  const canvasContext = dom.canvas.getContext("2d");

  let selectedWheelIndex = 0;
  let selectedModeId = "drift";
  let pathDraft = [];
  let pathStartedAt = 0;
  let wovenEvents = [];
  let wovenLength = 0;
  let isLooping = false;
  let loopTimers = [];
  let activePointers = new Map();
  let activeBursts = [];
  let audio = null;
  let seedAudio = null;
  let seedUrl = null;
  let visualPulse = 0;
  let lastHint = "";

  function currentWheel() {
    return wheels[selectedWheelIndex];
  }

  function currentMode() {
    return modes.find((mode) => mode.id === selectedModeId) || modes[0];
  }

  function toneById(id) {
    return tones.find((tone) => tone.id === id) || tones[0];
  }

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function noteForSlot(slotIndex) {
    const wheel = currentWheel();
    const pattern = wheel.pattern && wheel.pattern.length ? wheel.pattern : lowHighPattern;
    const offset = pattern[slotIndex % pattern.length];
    return currentMode().base + offset;
  }

  function frequencyForSlot(slotIndex) {
    return midiToFrequency(noteForSlot(slotIndex));
  }

  function ensureAudio() {
    if (audio) {
      if (audio.ctx.state === "suspended") {
        audio.ctx.resume();
      }
      return audio;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext({ latencyHint: "interactive" });
    const input = ctx.createGain();
    const dry = ctx.createGain();
    const delay = ctx.createDelay(0.9);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    const master = ctx.createGain();

    input.gain.value = 0.86;
    dry.gain.value = 0.82;
    delay.delayTime.value = 0.18;
    feedback.gain.value = 0.16;
    wet.gain.value = currentMode().wet;
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 5.5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.14;
    master.gain.value = 0.82;

    input.connect(dry);
    dry.connect(compressor);
    input.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(compressor);
    compressor.connect(master);
    master.connect(ctx.destination);

    audio = { ctx, input, wet, delay, feedback, master, voices: [] };
    return audio;
  }

  function updateModeAudio() {
    if (!audio) {
      return;
    }
    const now = audio.ctx.currentTime;
    audio.wet.gain.cancelScheduledValues(now);
    audio.wet.gain.linearRampToValueAtTime(currentMode().wet, now + 0.08);
    audio.delay.delayTime.cancelScheduledValues(now);
    audio.delay.delayTime.linearRampToValueAtTime(selectedModeId === "pulse" ? 0.125 : 0.18, now + 0.08);
  }

  function pruneVoices() {
    if (!audio) {
      return;
    }
    const now = audio.ctx.currentTime;
    audio.voices = audio.voices.filter((voice) => voice.stopAt > now);
    while (audio.voices.length > 18) {
      const voice = audio.voices.shift();
      if (!voice) {
        continue;
      }
      const fadeEnd = now + 0.024;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0.0001, now, 0.008);
      voice.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop(fadeEnd);
        } catch {
          // Voice may already be stopping.
        }
      });
    }
  }

  function playTone(slotIndex, options = {}) {
    const engine = ensureAudio();
    const ctx = engine.ctx;
    const mode = currentMode();
    const wheel = currentWheel();
    const tone = toneById(wheel.order[slotIndex % wheel.order.length]);
    const intensity = Math.max(0.35, Math.min(1, options.intensity || 0.72));
    const kind = options.kind || "tap";
    const when = ctx.currentTime + (options.delay || 0);
    const dragShortener = kind === "drag" ? 0.52 : 1;
    const duration = Math.max(0.22, (options.duration || mode.duration) * dragShortener);
    const attack = Math.max(0.004, mode.attack);
    const releaseEnd = when + duration;
    const frequency = frequencyForSlot(slotIndex);
    const peak = Math.min(0.24, mode.peak * intensity * (kind === "loop" ? 0.82 : 1));
    const panValue = Math.sin((slotIndex / wheel.order.length) * Math.PI * 2) * 0.56;

    pruneVoices();

    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const filter = ctx.createBiquadFilter();
    const oscillatorA = ctx.createOscillator();
    const oscillatorB = ctx.createOscillator();
    const family = tone.family;

    oscillatorA.type = family === "bass" ? "sine" : family === "pluck" ? "triangle" : "sine";
    oscillatorB.type = family === "glass" || family === "bell" ? "sine" : "triangle";
    oscillatorA.frequency.setValueAtTime(frequency, when);
    oscillatorB.frequency.setValueAtTime(frequency * harmonicForFamily(family), when);
    oscillatorB.detune.setValueAtTime(family === "choir" ? 7 : family === "breath" ? -5 : 3, when);

    filter.type = "lowpass";
    filter.Q.value = family === "glass" ? 3.6 : family === "bass" ? 0.7 : 1.4;
    filter.frequency.setValueAtTime(Math.max(420, mode.filter * (0.82 + intensity * 0.55)), when);
    filter.frequency.exponentialRampToValueAtTime(Math.max(260, mode.filter * 0.62), releaseEnd);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(peak, when + attack);
    gain.gain.setTargetAtTime(0.0001, Math.max(when + attack + 0.025, releaseEnd - 0.08), 0.055);

    oscillatorA.connect(filter);
    oscillatorB.connect(filter);
    filter.connect(gain);
    if (pan) {
      pan.pan.setValueAtTime(panValue, when);
      gain.connect(pan);
      pan.connect(engine.input);
    } else {
      gain.connect(engine.input);
    }

    oscillatorA.start(when);
    oscillatorB.start(when);
    oscillatorA.stop(releaseEnd + 0.12);
    oscillatorB.stop(releaseEnd + 0.12);

    engine.voices.push({
      gain,
      oscillators: [oscillatorA, oscillatorB],
      stopAt: releaseEnd + 0.15
    });

    activeBursts.push({
      slotIndex,
      color: tone.color,
      createdAt: performance.now(),
      expiresAt: performance.now() + duration * 860
    });

    visualPulse = Math.min(1, visualPulse + 0.12);
  }

  function harmonicForFamily(family) {
    if (family === "bell" || family === "glass") {
      return 2.01;
    }
    if (family === "choir" || family === "harp") {
      return 1.5;
    }
    if (family === "bass") {
      return 0.5;
    }
    if (family === "breath") {
      return 1.005;
    }
    return 2;
  }

  function startPath() {
    if (!pathDraft.length) {
      pathStartedAt = performance.now();
    }
  }

  function addPathEvent(slotIndex, intensity) {
    startPath();
    const wheel = currentWheel();
    const at = (performance.now() - pathStartedAt) / 1000;
    const cappedAt = Math.min(at, 24);
    pathDraft.push({
      slotIndex,
      toneId: wheel.order[slotIndex % wheel.order.length],
      at: cappedAt,
      intensity: Math.max(0.35, Math.min(1, intensity)),
      wheelId: wheel.id
    });

    if (pathDraft.length > 96) {
      pathDraft = pathDraft.slice(-96);
      pathStartedAt = performance.now() - pathDraft[0].at * 1000;
    }

    if (pathDraft.length > 2) {
      setSpellState("Path ready");
      dom.weave.classList.add("ready");
      showHint("Press Weave to hold this path", 1300);
    }
  }

  function quantizeEvents(events) {
    if (!events.length) {
      return [];
    }
    const step = selectedModeId === "pulse" ? 0.18 : 0.12;
    let previousAt = -1;
    return events
      .map((event) => ({
        ...event,
        at: Math.max(0, Math.round(event.at / step) * step)
      }))
      .filter((event) => {
        if (event.at === previousAt && event.slotIndex === (event.previousSlot || -1)) {
          return false;
        }
        previousAt = event.at;
        return true;
      });
  }

  function weavePath() {
    if (!pathDraft.length) {
      showHint("Touch the wheel first", 1400);
      return;
    }

    wovenEvents = quantizeEvents(pathDraft);
    const lastAt = wovenEvents.reduce((max, event) => Math.max(max, event.at), 0);
    wovenLength = Math.max(2.2, Math.min(24, lastAt + 0.92));
    setSpellState("Woven");
    dom.weave.classList.remove("ready");
    showHint("The path is woven", 1500);
    playWovenLoop();
  }

  function clearLoopTimers() {
    loopTimers.forEach((timer) => window.clearTimeout(timer));
    loopTimers = [];
    isLooping = false;
    dom.play.textContent = "Play";
  }

  function scheduleLoopCycle() {
    if (!isLooping || !wovenEvents.length) {
      return;
    }

    wovenEvents.forEach((event) => {
      const timer = window.setTimeout(() => {
        playTone(event.slotIndex, {
          kind: "loop",
          intensity: event.intensity || 0.62,
          duration: selectedModeId === "drift" || selectedModeId === "night" ? 1.1 : 0.62
        });
      }, event.at * 1000);
      loopTimers.push(timer);
    });

    const nextCycle = window.setTimeout(scheduleLoopCycle, wovenLength * 1000);
    loopTimers.push(nextCycle);
  }

  function playWovenLoop() {
    if (!wovenEvents.length) {
      if (pathDraft.length) {
        wovenEvents = quantizeEvents(pathDraft);
        const lastAt = wovenEvents.reduce((max, event) => Math.max(max, event.at), 0);
        wovenLength = Math.max(2.2, Math.min(24, lastAt + 0.92));
      } else {
        showHint("No path has been woven yet", 1500);
        return;
      }
    }

    clearLoopTimers();
    isLooping = true;
    dom.play.textContent = "Stop";
    setSpellState("Playing");
    scheduleLoopCycle();
  }

  function togglePlay() {
    if (isLooping) {
      clearLoopTimers();
      setSpellState(wovenEvents.length ? "Woven" : "Free play");
      return;
    }
    playWovenLoop();
  }

  function clearSpell() {
    pathDraft = [];
    wovenEvents = [];
    wovenLength = 0;
    activePointers.clear();
    clearLoopTimers();
    dom.weave.classList.remove("ready");
    setSpellState("Free play");
    showHint("Wheel cleared", 1200);
  }

  function openSaveDialog() {
    if (!wovenEvents.length && pathDraft.length) {
      wovenEvents = quantizeEvents(pathDraft);
      const lastAt = wovenEvents.reduce((max, event) => Math.max(max, event.at), 0);
      wovenLength = Math.max(2.2, Math.min(24, lastAt + 0.92));
    }

    if (!wovenEvents.length) {
      showHint("Weave a path first", 1400);
      return;
    }

    dom.spellName.value = `${currentWheel().name} Spell`;
    dom.intention.value = "";
    dom.saveDialog.returnValue = "";
    dom.saveDialog.showModal();
  }

  function saveSpell() {
    const wheel = currentWheel();
    const name = dom.spellName.value.trim() || `${wheel.name} Spell`;
    const spell = {
      id: `spell-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      version: 1,
      name,
      intention: dom.intention.value.trim(),
      wheelId: wheel.id,
      wheelName: wheel.name,
      modeId: selectedModeId,
      modeName: currentMode().name,
      toneCount: wheel.order.length,
      events: wovenEvents,
      length: wovenLength,
      colors: wheel.mood,
      createdAt: new Date().toISOString()
    };

    const spells = readSpells();
    spells.unshift(spell);
    window.localStorage.setItem(storageKey, JSON.stringify(spells.slice(0, 60)));
    setSpellState("Kept");
    showHint("Spell kept", 1600);
  }

  function readSpells() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function renderArchive() {
    const spells = readSpells();
    dom.archiveList.textContent = "";

    if (!spells.length) {
      const empty = document.createElement("p");
      empty.className = "empty-spells";
      empty.textContent = "No spells kept yet. Run a finger around the wheel, press Weave, then Keep.";
      dom.archiveList.append(empty);
      return;
    }

    spells.forEach((spell) => {
      const row = document.createElement("article");
      row.className = "spell-row";

      const sigil = document.createElement("span");
      sigil.className = "spell-sigil";
      sigil.style.background = spellSigilBackground(spell);

      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = spell.name || "Untitled Spell";
      const meta = document.createElement("p");
      meta.textContent = `${spell.modeName || "Drift"} - ${spell.wheelName || "Magic Wheel"} - ${spell.toneCount || 0} tones`;
      const intention = document.createElement("p");
      intention.textContent = spell.intention ? `"${spell.intention}"` : "Local spell";
      copy.append(title, meta, intention);

      const actions = document.createElement("div");
      actions.className = "spell-actions";

      const play = document.createElement("button");
      play.type = "button";
      play.textContent = "Play";
      play.addEventListener("click", () => loadSpell(spell));

      const share = document.createElement("button");
      share.type = "button";
      share.textContent = "Share";
      share.addEventListener("click", () => {
        shareSpell(spell).catch(() => {});
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => deleteSpell(spell.id));

      actions.append(play, share, remove);
      row.append(sigil, copy, actions);
      dom.archiveList.append(row);
    });
  }

  function spellSigilBackground(spell) {
    const colors = Array.isArray(spell.colors) && spell.colors.length ? spell.colors : ["#e6c985", "#fff6e8"];
    return `radial-gradient(circle, rgba(255,246,232,.78), ${colors[0]}55 34%, transparent 64%), conic-gradient(from 20deg, ${colors.join(", ")}, ${colors[0]})`;
  }

  function loadSpell(spell) {
    const wheelIndex = wheels.findIndex((wheel) => wheel.id === spell.wheelId);
    if (wheelIndex >= 0) {
      selectedWheelIndex = wheelIndex;
    }
    if (spell.modeId && modes.some((mode) => mode.id === spell.modeId)) {
      selectedModeId = spell.modeId;
    }
    wovenEvents = Array.isArray(spell.events) ? spell.events : [];
    wovenLength = Number(spell.length) || 4;
    pathDraft = wovenEvents.slice();
    updateUI();
    dom.archiveDialog.close();
    showHint(`${spell.name || "Spell"} released`, 1400);
    playWovenLoop();
  }

  function deleteSpell(id) {
    const spells = readSpells().filter((spell) => spell.id !== id);
    window.localStorage.setItem(storageKey, JSON.stringify(spells));
    renderArchive();
  }

  async function shareSpell(spell) {
    const text = [
      spell.name || "Tone Loom Spell",
      "Tone Loom - a living instrument of tone and light.",
      `Wheel: ${spell.wheelName || "Magic Wheel"}`,
      `Mode: ${spell.modeName || "Drift"}`,
      `Threads: ${(spell.events || []).length}`,
      spell.intention ? `Intention: ${spell.intention}` : "",
      "Open: https://coherence-nikolai.app/tone_loom/"
    ].filter(Boolean).join("\n");

    if (navigator.share) {
      await navigator.share({ title: spell.name || "Tone Loom Spell", text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showHint("Spell text copied", 1500);
    }
  }

  function setSpellState(value) {
    dom.spellState.textContent = value;
  }

  function showHint(message, duration = 1900) {
    if (message === lastHint && dom.hint.classList.contains("visible")) {
      return;
    }
    lastHint = message;
    dom.hint.textContent = message;
    dom.hint.classList.add("visible");
    window.clearTimeout(showHint.timer);
    showHint.timer = window.setTimeout(() => {
      dom.hint.classList.remove("visible");
    }, duration);
  }

  function updateUI() {
    const wheel = currentWheel();
    dom.wheelName.textContent = wheel.name;
    dom.toneCount.textContent = `${wheel.order.length} ${wheel.order.length === 1 ? "tone" : "tones"}`;
    dom.wheelDescription.textContent = wheel.description;
    updateModeAudio();

    [...dom.wheelButtons.children].forEach((button, index) => {
      button.classList.toggle("active", index === selectedWheelIndex);
    });
    [...dom.modeButtons.children].forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === selectedModeId);
    });
  }

  function buildControls() {
    wheels.forEach((wheel, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wheel-pill";
      button.textContent = wheel.name;
      button.addEventListener("click", () => {
        selectedWheelIndex = index;
        clearLoopTimers();
        pathDraft = [];
        wovenEvents = [];
        setSpellState("Free play");
        dom.weave.classList.remove("ready");
        updateUI();
        showHint(`${wheel.name} is ready`, 1300);
      });
      dom.wheelButtons.append(button);
    });

    modes.forEach((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mode-pill";
      button.dataset.mode = mode.id;
      button.textContent = mode.name;
      button.addEventListener("click", () => {
        selectedModeId = mode.id;
        updateUI();
      });
      dom.modeButtons.append(button);
    });
  }

  function hitTest(event) {
    const rect = dom.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.min(rect.width, rect.height);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = size * 0.438;
    const inner = size * 0.19;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.hypot(dx, dy);
    const wheel = currentWheel();

    if (distance < inner * 0.9) {
      return { kind: "core", x, y };
    }

    if (distance < inner || distance > radius * 1.17) {
      return null;
    }

    const angle = (Math.atan2(dy, dx) + Math.PI * 2.5) % (Math.PI * 2);
    const slotIndex = Math.floor((angle / (Math.PI * 2)) * wheel.order.length) % wheel.order.length;
    return { kind: "slot", slotIndex, x, y, distance };
  }

  function pointerIntensity(event, previous) {
    if (!previous) {
      return 0.7;
    }
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    const dt = Math.max(16, performance.now() - previous.time);
    const speed = Math.hypot(dx, dy) / dt;
    return Math.max(0.42, Math.min(1, 0.45 + speed * 0.48));
  }

  function handlePointerDown(event) {
    event.preventDefault();
    ensureAudio();
    dom.canvas.setPointerCapture(event.pointerId);
    const hit = hitTest(event);

    if (!hit) {
      return;
    }

    if (hit.kind === "core") {
      togglePlay();
      return;
    }

    const pointer = { lastSlot: hit.slotIndex, lastTime: performance.now(), x: event.clientX, y: event.clientY, time: performance.now() };
    activePointers.set(event.pointerId, pointer);
    playTone(hit.slotIndex, { kind: "tap", intensity: 0.82 });
    addPathEvent(hit.slotIndex, 0.82);
  }

  function handlePointerMove(event) {
    const pointer = activePointers.get(event.pointerId);
    if (!pointer) {
      return;
    }
    event.preventDefault();
    const hit = hitTest(event);
    if (!hit || hit.kind !== "slot") {
      return;
    }
    const now = performance.now();
    const minGap = selectedModeId === "spark" ? 58 : selectedModeId === "drift" || selectedModeId === "night" ? 112 : 78;
    const intensity = pointerIntensity(event, pointer);

    if (hit.slotIndex !== pointer.lastSlot && now - pointer.lastTime > minGap) {
      pointer.lastSlot = hit.slotIndex;
      pointer.lastTime = now;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;
      playTone(hit.slotIndex, { kind: "drag", intensity });
      addPathEvent(hit.slotIndex, intensity);
    } else {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;
    }
  }

  function handlePointerUp(event) {
    if (activePointers.has(event.pointerId)) {
      activePointers.delete(event.pointerId);
    }
    if (pathDraft.length > 2) {
      setSpellState("Path ready");
      showHint("Press Weave to hold this path", 1500);
    }
  }

  function slotPoint(slotIndex, radiusFactor = 0.84) {
    const rect = dom.canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = size * 0.438 * radiusFactor;
    const angle = (slotIndex + 0.5) / currentWheel().order.length * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      angle
    };
  }

  function resizeCanvas() {
    const rect = dom.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (dom.canvas.width !== width || dom.canvas.height !== height) {
      dom.canvas.width = width;
      dom.canvas.height = height;
      canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function drawWheel() {
    resizeCanvas();
    const rect = dom.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) {
      window.requestAnimationFrame(drawWheel);
      return;
    }

    const ctx = canvasContext;
    const wheel = currentWheel();
    const now = performance.now();
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.438;
    const inner = size * 0.19;
    const slotCount = wheel.order.length;
    const pulse = visualPulse;
    visualPulse *= 0.92;
    activeBursts = activeBursts.filter((burst) => burst.expiresAt > now);

    ctx.clearRect(0, 0, width, height);
    drawOuterGlow(ctx, cx, cy, radius, wheel, pulse);
    drawRings(ctx, cx, cy, radius, inner);

    for (let index = 0; index < slotCount; index += 1) {
      drawSlot(ctx, index, cx, cy, radius, inner, wheel, now);
    }

    drawPath(ctx, pathDraft, radius);
    drawWovenMarks(ctx, wovenEvents, cx, cy, inner);
    drawCore(ctx, cx, cy, inner, wheel, pulse);
    window.requestAnimationFrame(drawWheel);
  }

  function drawOuterGlow(ctx, cx, cy, radius, wheel, pulse) {
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.2);
    glow.addColorStop(0, hexToRgba(wheel.mood[0], 0.14));
    glow.addColorStop(0.48, hexToRgba(wheel.mood[1] || wheel.mood[0], 0.08));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (1.05 + pulse * 0.03), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRings(ctx, cx, cy, radius, inner) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,246,232,0.10)";
    ctx.lineWidth = 1;
    for (let ring = 0; ring < 6; ring += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, inner + (radius - inner) * ((ring + 1) / 7), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(232,215,178,0.30)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSlot(ctx, index, cx, cy, radius, inner, wheel, now) {
    const slotAngle = Math.PI * 2 / wheel.order.length;
    const start = index * slotAngle - Math.PI / 2;
    const end = start + slotAngle;
    const tone = toneById(wheel.order[index]);
    const burst = activeBursts.find((item) => item.slotIndex === index);
    const burstAge = burst ? Math.max(0, Math.min(1, (burst.expiresAt - now) / 800)) : 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start + 0.01, end - 0.01);
    ctx.arc(cx, cy, inner, end - 0.01, start + 0.01, true);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(tone.color, burst ? 0.19 + burstAge * 0.18 : 0.055);
    ctx.fill();

    ctx.strokeStyle = burst ? hexToRgba(tone.color, 0.54) : "rgba(255,246,232,0.055)";
    ctx.lineWidth = burst ? 2.4 : 1;
    ctx.stroke();

    const point = slotPoint(index, 0.95);
    const dotRadius = Math.max(9, radius * 0.035) + burstAge * 9;
    const dot = ctx.createRadialGradient(point.x, point.y, 1, point.x, point.y, dotRadius * 2.4);
    dot.addColorStop(0, "rgba(255,246,232,0.96)");
    dot.addColorStop(0.38, hexToRgba(tone.color, 0.82));
    dot.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = dot;
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius * 2.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = burst ? "rgba(255,246,232,0.98)" : hexToRgba(tone.color, 0.92);
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,246,232,0.34)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(point.angle) * inner * 1.08, cy + Math.sin(point.angle) * inner * 1.08);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawPath(ctx, events, radius) {
    if (events.length < 2) {
      return;
    }

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, radius * 0.018);
    ctx.strokeStyle = "rgba(255,246,232,0.58)";
    ctx.beginPath();
    events.slice(-42).forEach((event, index) => {
      const point = slotPoint(event.slotIndex, 0.66);
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  function drawWovenMarks(ctx, events, cx, cy, inner) {
    if (!events.length) {
      return;
    }

    ctx.save();
    const orbit = inner * 1.25;
    events.slice(0, 36).forEach((event, index) => {
      const angle = (event.at / Math.max(1, wovenLength)) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * orbit;
      const y = cy + Math.sin(angle) * orbit;
      const tone = toneById(event.toneId);
      ctx.fillStyle = hexToRgba(tone.color, 0.66);
      ctx.beginPath();
      ctx.arc(x, y, 3.2 + (index % 3), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawCore(ctx, cx, cy, inner, wheel, pulse) {
    ctx.save();
    const coreGradient = ctx.createRadialGradient(cx, cy, inner * 0.08, cx, cy, inner * 1.05);
    coreGradient.addColorStop(0, "rgba(255,246,232,0.92)");
    coreGradient.addColorStop(0.38, `${wheel.mood[0]}36`);
    coreGradient.addColorStop(1, "rgba(8,4,3,0.96)");
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, inner * (0.95 + pulse * 0.06), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(232,215,178,0.46)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, inner * 1.02, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,246,232,0.78)";
    ctx.lineWidth = Math.max(3, inner * 0.045);
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let step = 0; step < 94; step += 1) {
      const angle = step * 0.28 + performance.now() / 9000;
      const radius = inner * 0.04 + step * inner * 0.0038;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const value = parseInt(normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function loadSeed(file) {
    if (!file) {
      return;
    }
    clearSeed();
    seedUrl = URL.createObjectURL(file);
    seedAudio = new Audio(seedUrl);
    seedAudio.preload = "auto";
    seedAudio.loop = false;
    dom.seedName.textContent = file.name.replace(/\.[^.]+$/, "");
    dom.seedStrip.hidden = false;
    showHint("Seed ready", 1500);
  }

  function playSeed() {
    if (!seedAudio) {
      dom.seedInput.click();
      return;
    }
    if (seedAudio.paused) {
      seedAudio.play();
      dom.playSeed.textContent = "Pause Seed";
    } else {
      seedAudio.pause();
      dom.playSeed.textContent = "Play Seed";
    }
  }

  function toggleSeedLoop() {
    if (!seedAudio) {
      dom.seedInput.click();
      return;
    }
    seedAudio.loop = !seedAudio.loop;
    dom.loopSeed.textContent = seedAudio.loop ? "Unloop Seed" : "Loop Seed";
    if (seedAudio.loop && seedAudio.paused) {
      seedAudio.play();
      dom.playSeed.textContent = "Pause Seed";
    }
  }

  function clearSeed() {
    if (seedAudio) {
      seedAudio.pause();
      seedAudio.removeAttribute("src");
      seedAudio.load();
    }
    if (seedUrl) {
      URL.revokeObjectURL(seedUrl);
    }
    seedAudio = null;
    seedUrl = null;
    dom.seedInput.value = "";
    dom.seedStrip.hidden = true;
    dom.playSeed.textContent = "Play Seed";
    dom.loopSeed.textContent = "Loop Seed";
  }

  function bindEvents() {
    dom.enter.addEventListener("click", () => {
      dom.landing.hidden = true;
      dom.app.hidden = false;
      ensureAudio();
      showHint("Run your finger around the wheel", 2200);
    });

    dom.home.addEventListener("click", () => {
      dom.app.hidden = true;
      dom.landing.hidden = false;
      clearLoopTimers();
    });

    dom.canvas.addEventListener("pointerdown", handlePointerDown);
    dom.canvas.addEventListener("pointermove", handlePointerMove);
    dom.canvas.addEventListener("pointerup", handlePointerUp);
    dom.canvas.addEventListener("pointercancel", handlePointerUp);
    dom.canvas.addEventListener("lostpointercapture", handlePointerUp);

    dom.weave.addEventListener("click", weavePath);
    dom.play.addEventListener("click", togglePlay);
    dom.keep.addEventListener("click", openSaveDialog);
    dom.clear.addEventListener("click", clearSpell);

    dom.saveDialog.addEventListener("close", () => {
      if (dom.saveDialog.returnValue === "save") {
        saveSpell();
      }
    });

    dom.archive.addEventListener("click", () => {
      renderArchive();
      dom.archiveDialog.returnValue = "";
      dom.archiveDialog.showModal();
    });

    dom.seedButton.addEventListener("click", () => dom.seedInput.click());
    dom.seedInput.addEventListener("change", () => loadSeed(dom.seedInput.files && dom.seedInput.files[0]));
    dom.playSeed.addEventListener("click", playSeed);
    dom.loopSeed.addEventListener("click", toggleSeedLoop);
    dom.clearSeed.addEventListener("click", clearSeed);
    window.addEventListener("resize", resizeCanvas);
  }

  buildControls();
  bindEvents();
  updateUI();
  window.requestAnimationFrame(drawWheel);
})();
