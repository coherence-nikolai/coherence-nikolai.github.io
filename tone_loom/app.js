(() => {
  "use strict";

  const keys = {
    spells: "toneLoom.web.spells.v1",
    settings: "toneLoom.web.settings.v2",
    customWheels: "toneLoom.web.customWheels.v1",
    customConstellations: "toneLoom.web.customConstellations.v1"
  };

  const chambers = [
    { id: "dawn", name: "Dawn" },
    { id: "heart", name: "Heart" },
    { id: "sky", name: "Sky" },
    { id: "root", name: "Root" },
    { id: "flame", name: "Flame" },
    { id: "night", name: "Night" }
  ];

  const effects = [
    { id: "echo", name: "Echo", wet: 0.28, delay: 0.2, feedback: 0.2 },
    { id: "shimmer", name: "Shimmer", wet: 0.24, delay: 0.14, feedback: 0.16 },
    { id: "bloom", name: "Bloom", wet: 0.31, delay: 0.24, feedback: 0.24 },
    { id: "hush", name: "Hush", wet: 0.18, delay: 0.28, feedback: 0.12 },
    { id: "pulse", name: "Pulse", wet: 0.16, delay: 0.12, feedback: 0.18 },
    { id: "reverse", name: "Reverse", wet: 0.24, delay: 0.32, feedback: 0.22 }
  ];

  const modes = [
    { id: "drift", name: "Drift", attack: 0.02, duration: 1.25, peak: 0.15, filter: 1650, multiplier: 0.84 },
    { id: "spark", name: "Spark", attack: 0.006, duration: 0.56, peak: 0.19, filter: 2900, multiplier: 1.12 },
    { id: "bloom", name: "Bloom", attack: 0.026, duration: 1.48, peak: 0.14, filter: 2150, multiplier: 0.94 },
    { id: "pulse", name: "Pulse", attack: 0.008, duration: 0.5, peak: 0.2, filter: 1850, multiplier: 0.78 },
    { id: "mirror", name: "Mirror", attack: 0.014, duration: 0.86, peak: 0.16, filter: 2300, multiplier: 1 },
    { id: "night", name: "Night", attack: 0.034, duration: 1.7, peak: 0.12, filter: 1180, multiplier: 0.58 }
  ];

  const skins = [
    { id: "classic", name: "Classic Loom", colors: ["#160704", "#080403"], accents: ["#e6c985", "#fff6e8"] },
    { id: "gold-thread", name: "Gold Thread", colors: ["#190b04", "#050303"], accents: ["#f0d27e", "#fff4dc"] },
    { id: "moon-glass", name: "Moon Glass", colors: ["#080a13", "#030306"], accents: ["#d9e4ef", "#b59ad7"] },
    { id: "ember-bloom", name: "Ember Bloom", colors: ["#1c0804", "#050202"], accents: ["#f0aa62", "#c94957"] },
    { id: "deep-sea", name: "Deep Sea", colors: ["#031219", "#030407"], accents: ["#90d7d0", "#283c88"] },
    { id: "aurora", name: "Aurora", colors: ["#06100d", "#07040a"], accents: ["#b8e5ca", "#d2a9ef"] }
  ];

  const timbres = [
    { id: "classic", name: "Classic Tones", family: "classic" },
    { id: "crystal-choir", name: "Crystal Choir", family: "choir" },
    { id: "glass-harp", name: "Glass Harp", family: "harp" },
    { id: "soft-gong", name: "Soft Gong", family: "gong" },
    { id: "breath-flute", name: "Breath Flute", family: "breath" },
    { id: "velvet-bass", name: "Velvet Bass", family: "bass" },
    { id: "star-pluck", name: "Star Pluck", family: "pluck" }
  ];

  const reweaves = [
    { id: "gentle", name: "Gentle" },
    { id: "bright", name: "Bright" },
    { id: "night", name: "Night" },
    { id: "reversed", name: "Reverse" },
    { id: "sparse", name: "Sparse" },
    { id: "spiral", name: "Spiral" },
    { id: "echo", name: "Echo" }
  ];

  const tones = [
    tone("awakening", 1, "Awakening", "dawn", 288, "bell chime", "soft gold", "#f7d76a", "rising spiral", "brightens the field", 261.63, "bell"),
    tone("tenderness", 2, "Tenderness", "heart", 295, "whispered flute", "pale pink", "#f7a7c5", "gentle sway", "opens a softer thread", 293.66, "flute"),
    tone("clarity", 3, "Clarity", "dawn", 302, "metallic hum", "silver-blue", "#a8d8f0", "clean ripple", "brings the pattern into focus", 329.63, "glass"),
    tone("grounding", 4, "Grounding", "root", 309, "warm string pluck", "earth brown", "#9b6f45", "steady pulse", "gives the weave weight", 196.0, "pluck"),
    tone("awe", 5, "Awe", "sky", 316, "distant choir", "violet", "#a178ff", "ascending wave", "lifts the spell upward", 392.0, "choir"),
    tone("focus", 6, "Focus", "dawn", 323, "wooden knock", "deep green", "#3e9e72", "rhythmic bounce", "tightens the active thread", 349.23, "pluck"),
    tone("spaciousness", 7, "Spaciousness", "sky", 330, "hollow echo", "teal", "#3ec9c3", "expanding ring", "makes room around the sound", 440.0, "breath"),
    tone("insight", 8, "Insight", "dawn", 337, "crystal shimmer", "light cyan", "#8ceaff", "flickering light", "reveals a hidden accent", 493.88, "glass"),
    tone("stillness", 9, "Stillness", "night", 344, "soft wind", "lavender", "#bba6ff", "winding path", "slows the surface", 220.0, "breath"),
    tone("presence", 10, "Presence", "root", 351, "deep gong", "dark indigo", "#4e5fa8", "slow unfolding", "settles the spell core", 246.94, "bass"),
    tone("creativity", 11, "Creativity", "flame", 358, "electric buzz", "neon orange", "#ff8b38", "quick oscillation", "sparks a new variation", 523.25, "pluck"),
    tone("flow", 12, "Flow", "heart", 365, "ocean wave", "seafoam", "#7de0c4", "flowing curve", "smooths one tone into another", 293.66, "breath"),
    tone("joy", 13, "Joy", "flame", 372, "birdsong", "sky blue", "#6dbdff", "gentle flutter", "adds lift and play", 587.33, "bell"),
    tone("courage", 14, "Courage", "root", 379, "distant thunder", "charcoal", "#5e6069", "rolling momentum", "strengthens the next pulse", 174.61, "bass"),
    tone("passion", 15, "Passion", "flame", 386, "fire crackle", "amber", "#ffb13d", "dancing flame", "makes the loop more vivid", 659.25, "pluck"),
    tone("vision", 16, "Vision", "sky", 393, "ethereal harp", "soft white", "#f4f2e8", "floating ascent", "stretches the phrase outward", 783.99, "harp"),
    tone("vitality", 17, "Vitality", "flame", 400, "bass pulse", "crimson", "#c94957", "deep resonance", "deepens the low thread", 130.81, "bass"),
    tone("wonder", 18, "Wonder", "sky", 407, "glass chime", "transparent blue", "#9ddfff", "shimmering arc", "adds a hidden turn", 698.46, "glass"),
    tone("resolve", 19, "Resolve", "root", 414, "drumbeat", "ochre", "#c59648", "steady march", "locks a repeating step", 261.63, "pluck"),
    tone("harmony", 20, "Harmony", "heart", 421, "harmonic overtone", "gold-green", "#b7d767", "radiant spiral", "blends two intentions", 392.0, "choir"),
    tone("reflection", 21, "Reflection", "night", 428, "echoing cave", "midnight blue", "#283c88", "inward turn", "folds the spell inward", 196.0, "breath"),
    tone("compassion", 22, "Compassion", "heart", 435, "soft piano", "rose quartz", "#ed9db6", "gentle cascade", "rounds the edges", 329.63, "harp"),
    tone("mystery", 23, "Mystery", "night", 442, "cosmic hum", "galactic silver", "#c5c9d8", "expanding stillness", "adds depth and distance", 246.94, "choir"),
    tone("origin", 24, "Origin", "night", 449, "silence pulse", "clear light", "#faf8ea", "invisible breath", "completes and returns", 523.25, "silence")
  ];

  const palettes = [
    { id: "morning-clarity", name: "Dawn Compass", toneIDs: ["awakening", "clarity", "focus", "vision", "wonder", "harmony", "origin"] },
    { id: "heart-opening", name: "Rose Current", toneIDs: ["tenderness", "spaciousness", "stillness", "flow", "joy", "harmony", "compassion"] },
    { id: "dream-weaving", name: "Dream Lantern", toneIDs: ["awe", "stillness", "flow", "vision", "reflection", "mystery", "origin"] },
    { id: "courage-spell", name: "Ember Resolve", toneIDs: ["clarity", "grounding", "presence", "courage", "passion", "vitality", "resolve"] },
    { id: "night-garden", name: "Midnight Garden", toneIDs: ["tenderness", "spaciousness", "stillness", "reflection", "compassion", "mystery", "origin"] },
    { id: "bright-play", name: "Bright Loom", toneIDs: ["awakening", "creativity", "flow", "joy", "passion", "wonder", "harmony"] }
  ];

  const defaultWheels = [
    {
      id: "low-to-high",
      name: "Low to High",
      subtitle: "The clean rising tone ladder",
      toneIDs: [
        "vitality", "courage", "grounding", "reflection", "stillness", "presence",
        "mystery", "awakening", "resolve", "tenderness", "flow", "clarity",
        "compassion", "focus", "awe", "harmony", "spaciousness", "insight",
        "creativity", "origin", "joy", "passion", "wonder", "vision"
      ],
      mood: ["#f7d76a", "#faf8ea"]
    },
    { id: "star-signal", name: "Close Encounter", subtitle: "A five-tone sky call with luminous returns", toneIDs: wheelOrder(["awakening", "spaciousness", "flow", "tenderness", "harmony", "wonder", "origin", "awe", "clarity", "vision"]), mood: ["#8ceaff", "#faf8ea"] },
    { id: "moon-ladder", name: "Moon Spiral", subtitle: "Soft night tones curling upward", toneIDs: wheelOrder(["reflection", "mystery", "stillness", "presence", "origin", "compassion", "tenderness", "flow", "spaciousness", "vision", "wonder", "awe"]), mood: ["#c5c9d8", "#bba6ff"] },
    { id: "gold-thread", name: "Gold Thread", subtitle: "Warm consonant turns around the core", toneIDs: wheelOrder(["awakening", "resolve", "harmony", "clarity", "compassion", "focus", "flow", "origin", "awe", "wonder", "joy", "vision"]), mood: ["#f7d76a", "#b7d767"] },
    { id: "mythic-clock", name: "Dream Clock", subtitle: "The full 24-tone lore circle", toneIDs: tones.map((item) => item.id), mood: ["#bba6ff", "#7de0c4"] },
    { id: "ember-run", name: "Ember Path", subtitle: "Bright playful turns for lively drags", toneIDs: wheelOrder(["vitality", "passion", "joy", "creativity", "resolve", "courage", "focus", "awakening", "wonder", "harmony", "flow", "insight"]), mood: ["#ffb13d", "#c94957"] },
    { id: "glass-ribbon", name: "Glass Garden", subtitle: "Clear shimmer with airy little paths", toneIDs: wheelOrder(["clarity", "insight", "wonder", "vision", "spaciousness", "awe", "origin", "harmony", "flow", "awakening", "mystery", "compassion"]), mood: ["#8ceaff", "#ed9db6"] },
    { id: "deep-pulse", name: "Deep Sea", subtitle: "Low drifting tones with soft returns", toneIDs: wheelOrder(["vitality", "presence", "reflection", "mystery", "stillness", "grounding", "flow", "spaciousness", "harmony", "origin", "compassion", "vision"]), mood: ["#283c88", "#7de0c4"] },
    { id: "star-ladder", name: "Star Ladder", subtitle: "High bright tones stepping into shimmer", toneIDs: wheelOrder(["awakening", "clarity", "awe", "spaciousness", "insight", "origin", "joy", "passion", "wonder", "vision", "mystery", "harmony"]), mood: ["#faf8ea", "#a178ff"] },
    { id: "custom-wheel", name: "Custom Wheel", subtitle: "Choose your own spell circle", toneIDs: wheelOrder(["awakening", "clarity", "flow", "harmony", "origin"]), mood: ["#f7d76a", "#8ceaff"] }
  ];

  const dom = {
    landing: byId("landingScreen"),
    app: byId("loomApp"),
    enter: byId("enterButton"),
    home: byId("homeButton"),
    canvas: byId("loomCanvas"),
    hint: byId("hintText"),
    constellation: byId("constellationButton"),
    library: byId("libraryButton"),
    atelier: byId("atelierButton"),
    seedButton: byId("seedButton"),
    archive: byId("archiveButton"),
    wheelName: byId("wheelName"),
    toneCount: byId("toneCount"),
    spellState: byId("spellState"),
    wheelDescription: byId("wheelDescription"),
    wheelButtons: byId("wheelButtons"),
    modeButtons: byId("modeButtons"),
    effectButtons: byId("effectButtons"),
    record: byId("recordButton"),
    weave: byId("weaveButton"),
    play: byId("playButton"),
    keep: byId("keepButton"),
    share: byId("shareButton"),
    undo: byId("undoButton"),
    clear: byId("clearButton"),
    seedInput: byId("seedInput"),
    seedStrip: byId("seedStrip"),
    seedName: byId("seedName"),
    playSeed: byId("playSeedButton"),
    loopSeed: byId("loopSeedButton"),
    weaveSeed: byId("weaveSeedButton"),
    clearSeed: byId("clearSeedButton"),
    saveDialog: byId("saveDialog"),
    spellName: byId("spellNameInput"),
    intention: byId("intentionInput"),
    archiveDialog: byId("archiveDialog"),
    archiveList: byId("archiveList"),
    libraryDialog: byId("libraryDialog"),
    libraryWheelList: byId("libraryWheelList"),
    constellationList: byId("constellationList"),
    mythicScaleList: byId("mythicScaleList"),
    atelierDialog: byId("atelierDialog"),
    skinButtons: byId("skinButtons"),
    timbreButtons: byId("timbreButtons"),
    effectDepth: byId("effectDepthInput"),
    wheelNameInput: byId("wheelNameInput"),
    wheelOrderPreview: byId("wheelOrderPreview"),
    wheelToneGrid: byId("wheelToneGrid"),
    clearWheelBuilder: byId("clearWheelBuilderButton"),
    saveWheel: byId("saveWheelButton"),
    customWheelList: byId("customWheelList"),
    reweaveButtons: byId("reweaveButtons"),
    layerRow: byId("layerRow"),
    constellationNameInput: byId("constellationNameInput"),
    constellationPreview: byId("constellationPreview"),
    constellationToneGrid: byId("constellationToneGrid"),
    clearConstellationBuilder: byId("clearConstellationBuilderButton"),
    saveConstellation: byId("saveConstellationButton"),
    customConstellationList: byId("customConstellationList"),
    editSpellDialog: byId("editSpellDialog"),
    editSpellName: byId("editSpellNameInput"),
    editIntention: byId("editIntentionInput")
  };

  const ctx2d = dom.canvas.getContext("2d");
  const settings = readJSON(keys.settings, {});

  const wheelIdAliases = {
    "low-high": "low-to-high",
    "close-encounter": "star-signal",
    "moon-spiral": "moon-ladder",
    "dream-clock": "mythic-clock",
    "ember-path": "ember-run",
    "glass-garden": "glass-ribbon",
    "deep-sea": "deep-pulse"
  };

  let selectedWheelId = wheelIdAliases[settings.selectedWheelId] || settings.selectedWheelId || "low-to-high";
  let selectedPaletteId = settings.selectedPaletteId || palettes[0].id;
  let selectedModeId = settings.selectedModeId || "drift";
  let selectedEffectId = settings.selectedEffectId || "echo";
  let selectedSkinId = settings.selectedSkinId || "classic";
  let selectedTimbreId = settings.selectedTimbreId || "classic";
  let effectDepth = Number.isFinite(settings.effectDepth) ? settings.effectDepth : 0.5;
  let constellationVisible = settings.constellationVisible !== false;
  let customWheels = readJSON(keys.customWheels, []);
  let customConstellations = readJSON(keys.customConstellations, []);
  let selectedWheelToneIDs = [];
  let selectedConstellationToneIDs = [];
  let editSpellId = null;
  let pathDraft = [];
  let pathStartedAt = 0;
  let loopEvents = [];
  let atelierLayerEvents = [];
  let layerMuted = false;
  let loopDuration = 8;
  let undoStack = [];
  let isLooping = false;
  let isRecording = false;
  let recordingStartedAt = 0;
  let loopTimers = [];
  let activePointers = new Map();
  let activeBursts = [];
  let seed = null;
  let seedAudio = null;
  let seedUrl = null;
  let audio = null;
  let visualPulse = 0;
  let reweaveCursor = 0;
  let lastHint = "";

  function tone(id, index, name, chamber, lorePitch, soundCharacter, colorName, color, motionBehavior, interactionEffect, audioPitch, family) {
    return { id, index, name, chamber, lorePitch, soundCharacter, colorName, color, motionBehavior, interactionEffect, audioPitch, family };
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function wheelOrder(leadingToneIDs) {
    const seen = new Set();
    const ordered = [];
    [...leadingToneIDs, ...tones.map((item) => item.id)].forEach((toneID) => {
      if (!seen.has(toneID)) {
        seen.add(toneID);
        ordered.push(toneID);
      }
    });
    return ordered;
  }

  function allWheels() {
    return [
      ...defaultWheels,
      ...customWheels.map((wheel) => ({
        ...wheel,
        subtitle: `${wheel.toneIDs.length} tone spell wheel`,
        mood: moodForToneIDs(wheel.toneIDs)
      }))
    ];
  }

  function allPalettes() {
    return [
      ...palettes,
      ...customConstellations.map((item) => ({ ...item, custom: true }))
    ];
  }

  function currentWheel() {
    return allWheels().find((wheel) => wheel.id === selectedWheelId) || defaultWheels[0];
  }

  function currentPalette() {
    return allPalettes().find((palette) => palette.id === selectedPaletteId) || palettes[0];
  }

  function currentMode() {
    return modes.find((mode) => mode.id === selectedModeId) || modes[0];
  }

  function currentEffect() {
    return effects.find((effect) => effect.id === selectedEffectId) || effects[0];
  }

  function currentSkin() {
    return skins.find((skin) => skin.id === selectedSkinId) || skins[0];
  }

  function currentTimbre() {
    return timbres.find((timbre) => timbre.id === selectedTimbreId) || timbres[0];
  }

  function activeToneIDs() {
    const ids = currentWheel().toneIDs.filter((toneID) => toneById(toneID));
    return ids.length ? ids : tones.map((item) => item.id);
  }

  function toneById(id) {
    if (id == null) {
      return tones[0];
    }
    if (typeof id === "number" || /^\d+$/.test(String(id))) {
      return tones[Math.max(0, Math.min(tones.length - 1, Number(id) - 1))] || tones[0];
    }
    const value = String(id).toLowerCase();
    return tones.find((item) => item.id === value || item.name.toLowerCase() === value) || tones[0];
  }

  function slotTone(slotIndex) {
    const ids = activeToneIDs();
    return toneById(ids[((slotIndex % ids.length) + ids.length) % ids.length]);
  }

  function moodForToneIDs(toneIDs) {
    const first = toneById(toneIDs[0]);
    const second = toneById(toneIDs[Math.max(1, Math.floor(toneIDs.length / 2))]);
    return [first.color, second.color];
  }

  function saveSettings() {
    writeJSON(keys.settings, {
      selectedWheelId,
      selectedPaletteId,
      selectedModeId,
      selectedEffectId,
      selectedSkinId,
      selectedTimbreId,
      effectDepth,
      constellationVisible
    });
  }

  function readJSON(key, fallback) {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
      return parsed == null ? fallback : parsed;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
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
    const delay = ctx.createDelay(1.4);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    const master = ctx.createGain();

    input.gain.value = 0.86;
    dry.gain.value = 0.8;
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 6;
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
    audio = { ctx, input, delay, feedback, wet, master, voices: [] };
    updateEffectAudio();
    return audio;
  }

  function updateEffectAudio() {
    if (!audio) {
      return;
    }
    const effect = currentEffect();
    const now = audio.ctx.currentTime;
    const depth = Math.max(0, Math.min(1, effectDepth));
    audio.delay.delayTime.cancelScheduledValues(now);
    audio.feedback.gain.cancelScheduledValues(now);
    audio.wet.gain.cancelScheduledValues(now);
    audio.delay.delayTime.linearRampToValueAtTime(effect.delay, now + 0.08);
    audio.feedback.gain.linearRampToValueAtTime(effect.feedback * (0.55 + depth * 0.65), now + 0.08);
    audio.wet.gain.linearRampToValueAtTime(effect.wet * (0.6 + depth * 0.8), now + 0.08);
  }

  function frequencyForTone(tone, slotIndex = 0) {
    const mode = currentMode();
    let frequency = tone.audioPitch * mode.multiplier;
    if (selectedEffectId === "reverse") {
      frequency *= Math.pow(2, ((activeToneIDs().length - slotIndex) % 7) / 24);
    }
    if (frequency < 130) {
      frequency *= 2;
    }
    if (frequency > 880) {
      frequency *= 0.5;
    }
    return frequency;
  }

  function playToneBySlot(slotIndex, options = {}) {
    playTone(slotTone(slotIndex), slotIndex, options);
  }

  function playTone(tone, slotIndex = 0, options = {}) {
    const engine = ensureAudio();
    const ctx = engine.ctx;
    const mode = currentMode();
    const effect = currentEffect();
    const timbre = currentTimbre();
    const kind = options.kind || "tap";
    const intensity = clamp(options.intensity || 0.72, 0.25, 1);
    const when = ctx.currentTime + (options.delay || 0);
    const dragTrim = kind === "drag" ? 0.48 : 1;
    const duration = clamp((options.duration || mode.duration) * dragTrim, 0.18, 3.4);
    const attack = Math.max(0.004, mode.attack);
    const peak = Math.min(0.24, mode.peak * intensity * (kind === "loop" ? 0.82 : 1));
    const release = when + duration;
    const frequency = frequencyForTone(tone, slotIndex);
    const family = timbre.family === "classic" ? tone.family : timbre.family;
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    pruneVoices();
    oscA.type = waveformForFamily(family, false);
    oscB.type = waveformForFamily(family, true);
    oscA.frequency.setValueAtTime(frequency, when);
    oscB.frequency.setValueAtTime(frequency * harmonicForFamily(family), when);
    oscB.detune.setValueAtTime(detuneForFamily(family, effect.id), when);
    filter.type = family === "bass" || family === "gong" ? "lowpass" : "lowpass";
    filter.Q.value = family === "glass" || family === "harp" ? 3.4 : 1.2;
    filter.frequency.setValueAtTime(Math.max(360, mode.filter * (0.82 + intensity * 0.55)), when);
    filter.frequency.exponentialRampToValueAtTime(Math.max(220, mode.filter * (selectedEffectId === "hush" ? 0.36 : 0.62)), release);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(peak * gainForEffect(effect.id), when + attack);
    gain.gain.setTargetAtTime(0.0001, Math.max(when + attack + 0.025, release - 0.08), selectedEffectId === "bloom" ? 0.09 : 0.05);
    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    if (pan) {
      const count = Math.max(1, activeToneIDs().length);
      pan.pan.setValueAtTime(Math.sin((slotIndex / count) * Math.PI * 2) * 0.56, when);
      gain.connect(pan);
      pan.connect(engine.input);
    } else {
      gain.connect(engine.input);
    }
    oscA.start(when);
    oscB.start(when);
    oscA.stop(release + 0.14);
    oscB.stop(release + 0.14);
    engine.voices.push({ gain, oscillators: [oscA, oscB], stopAt: release + 0.16 });
    activeBursts.push({
      toneID: tone.id,
      slotIndex,
      color: tone.color,
      createdAt: performance.now(),
      expiresAt: performance.now() + duration * 840
    });
    visualPulse = Math.min(1, visualPulse + 0.12);
  }

  function waveformForFamily(family, secondary) {
    if (family === "bass" || family === "gong") return "sine";
    if (family === "pluck") return secondary ? "sine" : "triangle";
    if (family === "choir" || family === "breath") return "sine";
    return secondary ? "sine" : "triangle";
  }

  function harmonicForFamily(family) {
    if (family === "bass") return 0.5;
    if (family === "gong") return 0.75;
    if (family === "choir" || family === "harp") return 1.5;
    if (family === "breath") return 1.005;
    if (family === "glass" || family === "bell") return 2.01;
    return 2;
  }

  function detuneForFamily(family, effectID) {
    const effectShift = effectID === "shimmer" ? 9 : effectID === "hush" ? -7 : 3;
    if (family === "choir") return 11 + effectShift;
    if (family === "breath") return -5;
    if (family === "glass" || family === "harp") return 4 + effectShift;
    return effectShift;
  }

  function gainForEffect(effectID) {
    if (effectID === "hush") return 0.64;
    if (effectID === "bloom") return 0.88;
    if (effectID === "pulse") return 1.04;
    return 1;
  }

  function pruneVoices() {
    if (!audio) return;
    const now = audio.ctx.currentTime;
    audio.voices = audio.voices.filter((voice) => voice.stopAt > now);
    while (audio.voices.length > 18) {
      const voice = audio.voices.shift();
      if (!voice) continue;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0.0001, now, 0.007);
      voice.oscillators.forEach((osc) => {
        try {
          osc.stop(now + 0.025);
        } catch {
          // Already stopped.
        }
      });
    }
  }

  function beginPathIfNeeded() {
    if (!pathDraft.length) {
      pathStartedAt = performance.now();
    }
  }

  function addPathEvent(slotIndex, intensity, gesture = "drag") {
    beginPathIfNeeded();
    const tone = slotTone(slotIndex);
    const at = clamp((performance.now() - pathStartedAt) / 1000, 0, 24);
    const event = {
      id: id(),
      toneID: tone.id,
      slotIndex,
      startTime: at,
      duration: gesture === "tap" ? 0.42 : 0.56,
      gesture,
      effect: selectedEffectId,
      intensity: clamp(intensity, 0.25, 1)
    };
    pathDraft.push(event);
    if (pathDraft.length > 120) {
      pathDraft = pathDraft.slice(-120);
      pathStartedAt = performance.now() - pathDraft[0].startTime * 1000;
    }
    if (isRecording) {
      loopEvents.push({ ...event, startTime: currentRecordTime() });
      loopDuration = Math.max(4, Math.min(24, currentRecordTime() + 0.9));
    }
    if (pathDraft.length > 2 && !isRecording) {
      setSpellState("Path ready");
      dom.weave.classList.add("ready");
      showHint("Press Weave to hold this path", 1300);
    }
  }

  function currentRecordTime() {
    if (!recordingStartedAt) return 0;
    return clamp((performance.now() - recordingStartedAt) / 1000, 0, 24);
  }

  function quantizeEvents(events) {
    const step = selectedModeId === "pulse" ? 0.18 : 0.12;
    return events
      .map(normalizeEvent)
      .map((event) => ({ ...event, startTime: Math.max(0, Math.round(event.startTime / step) * step) }))
      .filter((event, index, list) => index === 0 || event.startTime !== list[index - 1].startTime || event.toneID !== list[index - 1].toneID);
  }

  function normalizeEvent(event) {
    const toneID = event.toneID || event.toneId || toneById(event.toneID || event.toneId || event.slotIndex || 1).id;
    return {
      id: event.id || id(),
      toneID: toneById(toneID).id,
      slotIndex: Number.isFinite(event.slotIndex) ? event.slotIndex : Math.max(0, activeToneIDs().indexOf(toneById(toneID).id)),
      startTime: Number(event.startTime ?? event.at ?? 0) || 0,
      duration: clamp(Number(event.duration ?? 0.48) || 0.48, 0.12, 4),
      gesture: event.gesture || "loop",
      effect: event.effect || selectedEffectId,
      intensity: clamp(Number(event.intensity ?? 0.62) || 0.62, 0.2, 1)
    };
  }

  function pushUndo() {
    undoStack.push({ events: loopEvents.map((event) => ({ ...event })), duration: loopDuration, layer: atelierLayerEvents.map((event) => ({ ...event })) });
    undoStack = undoStack.slice(-12);
  }

  function weavePath() {
    if (pathDraft.length > 2) {
      pushUndo();
      loopEvents = quantizeEvents(pathDraft);
      loopDuration = durationForEvents(loopEvents);
      pathDraft = [];
      stopLoop(false);
      startLoop(true);
      setSpellState("Playing");
      showHint("Path woven", 1400);
      return;
    }
    if (loopEvents.length) {
      applyReweave(reweaves[reweaveCursor % reweaves.length].id);
      reweaveCursor += 1;
      return;
    }
    createSuggestedLoop();
  }

  function createSuggestedLoop() {
    const ids = seed && seed.toneID ? [seed.toneID, ...activeToneIDs()] : activeToneIDs();
    const pattern = patternForMode(selectedModeId);
    const step = selectedModeId === "drift" || selectedModeId === "night" ? 0.72 : 0.46;
    pushUndo();
    loopEvents = pattern.map((offset, index) => {
      const toneID = ids[offset % ids.length];
      return {
        id: id(),
        toneID,
        slotIndex: Math.max(0, activeToneIDs().indexOf(toneID)),
        startTime: index * step,
        duration: index % 4 === 0 ? 0.82 : 0.46,
        gesture: "loop",
        effect: effects[index % effects.length].id,
        intensity: index % 4 === 0 ? 0.78 : 0.62
      };
    });
    loopDuration = selectedModeId === "drift" || selectedModeId === "night" ? 10 : 8;
    stopLoop(false);
    startLoop(true);
    showHint("A weave was born", 1400);
  }

  function patternForMode(modeID) {
    if (modeID === "spark") return [0, 2, 4, 7, 9, 7, 4, 2, 11, 9];
    if (modeID === "bloom") return [0, 4, 7, 12, 7, 4, 2, 9, 5];
    if (modeID === "pulse") return [0, 3, 0, 5, 0, 7, 5, 3];
    if (modeID === "mirror") return [0, 2, 5, 7, 5, 2, 0, 9, 7, 4];
    if (modeID === "night") return [0, 1, 3, 5, 8, 5, 3, 1, 0];
    return [0, 1, 3, 5, 8, 5, 3, 1, 0];
  }

  function durationForEvents(events) {
    const end = events.reduce((max, event) => Math.max(max, event.startTime + event.duration), 0);
    return clamp(end + 0.7, 2.2, 24);
  }

  function toggleRecording() {
    if (isRecording) {
      isRecording = false;
      recordingStartedAt = 0;
      loopEvents = quantizeEvents(loopEvents);
      loopDuration = durationForEvents(loopEvents);
      dom.record.textContent = "Record";
      dom.record.classList.remove("active");
      setSpellState(loopEvents.length ? "Woven" : "Free play");
      showHint(loopEvents.length ? "Recording held" : "Recording stopped", 1300);
      return;
    }
    pushUndo();
    if (!loopEvents.length) {
      loopDuration = 8;
    }
    recordingStartedAt = performance.now();
    isRecording = true;
    dom.record.textContent = loopEvents.length ? "Overdub" : "Stop";
    dom.record.classList.add("active");
    setSpellState(loopEvents.length ? "Overdub" : "Recording");
    showHint(loopEvents.length ? "Overdub the weave" : "Recording", 1300);
  }

  function startLoop(repeats = true) {
    if (!loopEvents.length) {
      showHint("No weave to play", 1200);
      return;
    }
    clearLoopTimers();
    isLooping = true;
    dom.play.textContent = "Stop";
    setSpellState("Playing");
    scheduleLoopCycle(repeats);
  }

  function scheduleLoopCycle(repeats) {
    if (!isLooping) return;
    const playable = [...loopEvents, ...(layerMuted ? [] : atelierLayerEvents)].map(normalizeEvent);
    playable.forEach((event) => {
      const timer = window.setTimeout(() => {
        const tone = toneById(event.toneID);
        playTone(tone, Math.max(0, activeToneIDs().indexOf(tone.id)), {
          kind: "loop",
          intensity: event.intensity,
          duration: event.duration
        });
      }, event.startTime * 1000);
      loopTimers.push(timer);
    });
    if (repeats) {
      loopTimers.push(window.setTimeout(() => scheduleLoopCycle(true), loopDuration * 1000));
    } else {
      loopTimers.push(window.setTimeout(() => stopLoop(false), loopDuration * 1000 + 180));
    }
  }

  function togglePlay() {
    if (isLooping) {
      stopLoop();
    } else {
      startLoop(true);
    }
  }

  function stopLoop(update = true) {
    clearLoopTimers();
    isLooping = false;
    dom.play.textContent = "Play";
    if (update) {
      setSpellState(loopEvents.length ? "Woven" : pathDraft.length > 2 ? "Path ready" : "Free play");
    }
  }

  function clearLoopTimers() {
    loopTimers.forEach((timer) => window.clearTimeout(timer));
    loopTimers = [];
  }

  function undoLast() {
    const last = undoStack.pop();
    if (!last) {
      if (loopEvents.length) {
        loopEvents.pop();
        loopDuration = durationForEvents(loopEvents);
      }
    } else {
      loopEvents = last.events;
      loopDuration = last.duration;
      atelierLayerEvents = last.layer || [];
    }
    stopLoop(false);
    setSpellState(loopEvents.length ? "Woven" : "Free play");
    showHint("Last weave undone", 1200);
    updateUI();
  }

  function clearAll() {
    pushUndo();
    stopLoop(false);
    pathDraft = [];
    loopEvents = [];
    atelierLayerEvents = [];
    layerMuted = false;
    isRecording = false;
    recordingStartedAt = 0;
    loopDuration = 8;
    dom.record.textContent = "Record";
    dom.record.classList.remove("active");
    dom.weave.classList.remove("ready");
    setSpellState("Free play");
    showHint("Loom cleared", 1200);
    updateUI();
  }

  function applyReweave(variantID) {
    if (!loopEvents.length) {
      createSuggestedLoop();
      return;
    }
    pushUndo();
    const events = loopEvents.map(normalizeEvent);
    let transformed = events.map((event) => ({ ...event }));
    if (variantID === "gentle") {
      transformed = transformed.map((event) => ({ ...event, duration: event.duration * 1.18, intensity: event.intensity * 0.82, effect: "hush" }));
    } else if (variantID === "bright") {
      transformed = transformed.map((event, index) => ({ ...event, startTime: event.startTime * 0.92, duration: event.duration * 0.82, intensity: clamp(event.intensity * 1.12, 0.2, 1), effect: index % 2 ? "shimmer" : "echo" }));
    } else if (variantID === "night") {
      transformed = transformed.map((event) => ({ ...event, startTime: event.startTime * 1.12, duration: event.duration * 1.35, intensity: event.intensity * 0.68, effect: "hush" }));
    } else if (variantID === "reversed") {
      transformed = transformed.map((event) => ({ ...event, startTime: Math.max(0, loopDuration - event.startTime - event.duration), effect: "reverse" })).reverse();
    } else if (variantID === "sparse") {
      transformed = transformed.filter((_, index) => index % 2 === 0).map((event) => ({ ...event, duration: event.duration * 1.1 }));
    } else if (variantID === "spiral") {
      transformed = transformed.map((event, index) => {
        const ids = activeToneIDs();
        const toneID = ids[(index * 3) % ids.length] || event.toneID;
        return { ...event, toneID, slotIndex: Math.max(0, ids.indexOf(toneID)), startTime: index * 0.36, effect: "shimmer" };
      });
    } else if (variantID === "echo") {
      transformed = [...transformed, ...transformed.slice(0, 10).map((event) => ({ ...event, id: id(), startTime: (event.startTime + 0.22) % loopDuration, intensity: event.intensity * 0.45, effect: "echo" }))];
    }
    loopEvents = quantizeEvents(transformed);
    loopDuration = Math.max(4, durationForEvents(loopEvents));
    stopLoop(false);
    startLoop(true);
    showHint(`${reweaves.find((item) => item.id === variantID)?.name || "Soft"} reweave`, 1400);
    updateUI();
  }

  function captureLayer() {
    if (!loopEvents.length) {
      showHint("Weave a path first", 1200);
      return;
    }
    atelierLayerEvents = loopEvents.map((event) => ({
      ...normalizeEvent(event),
      id: id(),
      startTime: (normalizeEvent(event).startTime + 0.125) % Math.max(loopDuration, 1),
      duration: clamp(normalizeEvent(event).duration * 1.08, 0.12, 3.8),
      intensity: clamp(normalizeEvent(event).intensity * 0.72, 0.24, 0.78),
      effect: normalizeEvent(event).effect === "hush" ? "echo" : normalizeEvent(event).effect
    }));
    layerMuted = false;
    showHint("Layer held", 1200);
    updateUI();
  }

  function openSaveDialog() {
    if (!loopEvents.length && pathDraft.length > 2) {
      weavePath();
    }
    if (!loopEvents.length) {
      showHint("Weave a path first", 1200);
      return;
    }
    dom.spellName.value = suggestedSpellName(loopEvents);
    dom.intention.value = "";
    dom.saveDialog.returnValue = "";
    dom.saveDialog.showModal();
  }

  function saveCurrentSpell() {
    if (!loopEvents.length) return;
    const spell = spellFromCurrent(dom.spellName.value.trim() || suggestedSpellName(loopEvents), sanitizeText(dom.intention.value));
    const spells = readSpells();
    spells.unshift(spell);
    writeSpells(spells);
    showHint(spell.intentionSeed ? "Intention sealed" : "Spell kept", 1400);
  }

  function spellFromCurrent(name, intentionSeed = "") {
    const wheel = currentWheel();
    return {
      id: id(),
      version: 2,
      name,
      createdAt: new Date().toISOString(),
      paletteID: selectedPaletteId,
      wheelSetID: selectedWheelId,
      wheelName: wheel.name,
      duration: loopDuration,
      events: loopEvents.map(normalizeEvent),
      importedSeed: seed ? { displayName: seed.displayName, sourceName: seed.sourceName, toneName: seed.toneName, colorHex: seed.color, note: seed.note, hasAudio: !!seed.hasAudio } : null,
      intentionSeed: intentionSeed || null,
      isFavorite: false,
      mode: selectedModeId,
      skin: selectedSkinId === "classic" ? null : selectedSkinId,
      timbre: selectedTimbreId === "classic" ? null : selectedTimbreId,
      effectDepth,
      layeredEvents: atelierLayerEvents.map(normalizeEvent),
      pathPoints: pathDraft.slice(-80)
    };
  }

  function readSpells() {
    const raw = readJSON(keys.spells, []);
    return Array.isArray(raw) ? raw.map(normalizeSpell).filter(Boolean) : [];
  }

  function writeSpells(spells) {
    writeJSON(keys.spells, spells.slice(0, 80));
  }

  function normalizeSpell(spell) {
    if (!spell || typeof spell !== "object") return null;
    const events = Array.isArray(spell.events) ? spell.events.map(normalizeEvent) : [];
    return {
      id: spell.id || id(),
      version: spell.version || 1,
      name: spell.name || "Tone Loom Spell",
      createdAt: spell.createdAt || new Date().toISOString(),
      paletteID: spell.paletteID || palettes[0].id,
      wheelSetID: spell.wheelSetID || spell.wheelId || "low-to-high",
      wheelName: spell.wheelName || spell.wheelName || currentWheel().name,
      duration: Number(spell.duration || spell.length || durationForEvents(events)) || 8,
      events,
      importedSeed: spell.importedSeed || null,
      intentionSeed: sanitizeText(spell.intentionSeed || spell.intention || ""),
      isFavorite: !!spell.isFavorite,
      mode: spell.mode || spell.modeId || "drift",
      skin: spell.skin || null,
      timbre: spell.timbre || null,
      effectDepth: Number.isFinite(spell.effectDepth) ? spell.effectDepth : 0.5,
      layeredEvents: Array.isArray(spell.layeredEvents) ? spell.layeredEvents.map(normalizeEvent) : [],
      pathPoints: Array.isArray(spell.pathPoints) ? spell.pathPoints : []
    };
  }

  function suggestedSpellName(events) {
    if (seed) return `${seed.displayName} Weave`;
    const counts = new Map();
    events.forEach((event) => counts.set(event.toneID, (counts.get(event.toneID) || 0) + 1));
    const names = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([toneID]) => toneById(toneID).name);
    const pair = new Set(names);
    if (pair.has("Tenderness") && pair.has("Courage")) return "Soft Bravery";
    if (pair.has("Grounding") && pair.has("Clarity")) return "Clear Footing";
    if (pair.has("Stillness") && pair.has("Mystery")) return "Night Bloom";
    if (pair.has("Awakening") && pair.has("Joy")) return "Joyful Arrival";
    if (pair.has("Origin") && pair.has("Awakening")) return "Beginning Again";
    return names[0] ? `${names[0]} Spell` : "New Spell";
  }

  function loadSpell(spell, repeats = false) {
    const normalized = normalizeSpell(spell);
    if (!normalized || !normalized.events.length) {
      showHint("No threads to release", 1200);
      return;
    }
    stopLoop(false);
    selectedPaletteId = normalized.paletteID;
    selectedWheelId = allWheels().some((wheel) => wheel.id === normalized.wheelSetID) ? normalized.wheelSetID : selectedWheelId;
    selectedModeId = normalized.mode;
    selectedSkinId = normalized.skin || selectedSkinId;
    selectedTimbreId = normalized.timbre || selectedTimbreId;
    effectDepth = normalized.effectDepth;
    loopEvents = normalized.events;
    atelierLayerEvents = normalized.layeredEvents || [];
    loopDuration = normalized.duration;
    if (normalized.importedSeed) {
      seed = seedFromMeta(normalized.importedSeed);
    }
    updateUI();
    startLoop(repeats);
    showHint(normalized.intentionSeed ? "Intention released" : repeats ? "Continue weaving" : "Spell released", 1400);
  }

  function remixSpell(spell) {
    loadSpell(spell, true);
  }

  function duplicateSpell(spell) {
    const copy = normalizeSpell(spell);
    copy.id = id();
    copy.name = `${copy.name} II`;
    copy.createdAt = new Date().toISOString();
    copy.isFavorite = false;
    const spells = readSpells();
    spells.unshift(copy);
    writeSpells(spells);
    renderArchive();
  }

  function toggleFavoriteSpell(spellID) {
    const spells = readSpells();
    const index = spells.findIndex((spell) => spell.id === spellID);
    if (index >= 0) {
      spells[index].isFavorite = !spells[index].isFavorite;
      writeSpells(spells);
      renderArchive();
    }
  }

  function deleteSpell(spellID) {
    writeSpells(readSpells().filter((spell) => spell.id !== spellID));
    renderArchive();
  }

  function openEditSpell(spellID) {
    const spell = readSpells().find((item) => item.id === spellID);
    if (!spell) return;
    editSpellId = spellID;
    dom.editSpellName.value = spell.name;
    dom.editIntention.value = spell.intentionSeed || "";
    dom.editSpellDialog.returnValue = "";
    dom.editSpellDialog.showModal();
  }

  function saveEditedSpell() {
    const spells = readSpells();
    const index = spells.findIndex((spell) => spell.id === editSpellId);
    if (index >= 0) {
      const name = sanitizeText(dom.editSpellName.value);
      spells[index].name = name || spells[index].name;
      spells[index].intentionSeed = sanitizeText(dom.editIntention.value) || null;
      writeSpells(spells);
      renderArchive();
      showHint(spells[index].intentionSeed ? "Intention sealed" : "Spell updated", 1200);
    }
    editSpellId = null;
  }

  async function shareCurrent() {
    if (!loopEvents.length) {
      showHint("Weave a path first", 1200);
      return;
    }
    await shareSpell(spellFromCurrent(suggestedSpellName(loopEvents)));
  }

  async function shareSpell(spell) {
    const text = spellShareText(spell);
    try {
      if (navigator.share) {
        await navigator.share({ title: spell.name || "Tone Loom Spell", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showHint("Spell text copied", 1300);
      }
    } catch {
      // Share cancellation is harmless.
    }
  }

  function spellShareText(spell) {
    return [
      spell.name || "Tone Loom Spell",
      "Tone Loom - a living instrument of tone and light.",
      `Wheel: ${spell.wheelName || "Magic Wheel"}`,
      `Mode: ${modeName(spell.mode)}`,
      `Threads: ${(spell.events || []).length + (spell.layeredEvents || []).length}`,
      spell.intentionSeed ? `Intention: ${spell.intentionSeed}` : "",
      "Open: https://coherence-nikolai.app/tone_loom/"
    ].filter(Boolean).join("\n");
  }

  function exportSpellData(spell) {
    const payload = { format: "tone-loom-spell", version: 1, exportedAt: new Date().toISOString(), spell };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `${safeName(spell.name)}.toneloom`);
    showHint("Spell ready to send", 1200);
  }

  function exportSpellCard(spell) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    const skin = skins.find((item) => item.id === spell.skin) || currentSkin();
    const gradient = ctx.createLinearGradient(0, 0, 1200, 1600);
    gradient.addColorStop(0, skin.colors[0]);
    gradient.addColorStop(1, skin.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 1600);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, 1200, 1600);
    drawCardSigil(ctx, spell, 600, 610, 310);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff6e8";
    ctx.font = "700 82px Georgia, serif";
    wrapCardText(ctx, spell.name || "Tone Loom Spell", 600, 1040, 980, 94);
    ctx.fillStyle = "#c9ad78";
    ctx.font = "38px system-ui, sans-serif";
    ctx.fillText(`${modeName(spell.mode)} - ${spell.wheelName || "Magic Wheel"}`, 600, 1180);
    ctx.font = "32px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,246,232,0.82)";
    ctx.fillText(`${(spell.events || []).length + (spell.layeredEvents || []).length} threads - ${Math.round(spell.duration || 0)}s`, 600, 1260);
    if (spell.intentionSeed) {
      ctx.font = "italic 34px Georgia, serif";
      ctx.fillStyle = "rgba(255,232,190,0.92)";
      wrapCardText(ctx, `Intention: ${spell.intentionSeed}`, 600, 1340, 900, 46);
    }
    ctx.font = "28px system-ui, sans-serif";
    ctx.fillStyle = "rgba(201,173,120,0.76)";
    ctx.fillText("Tone Loom - Loom Atelier", 600, 1460);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${safeName(spell.name)}-card.png`);
    }, "image/png");
    showHint("Spell card ready", 1200);
  }

  function drawCardSigil(ctx, spell, x, y, radius) {
    const events = [...(spell.events || []), ...(spell.layeredEvents || [])].map(normalizeEvent);
    const colors = events.length ? events.map((event) => toneById(event.toneID).color) : ["#e6c985", "#fff6e8"];
    const grad = ctx.createRadialGradient(x, y, 20, x, y, radius);
    grad.addColorStop(0, "rgba(255,246,232,0.86)");
    grad.addColorStop(0.38, `${colors[0]}88`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,246,232,0.7)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    events.slice(0, 40).forEach((event, index) => {
      const angle = (index / Math.max(1, events.length)) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(angle) * radius * 0.65;
      const py = y + Math.sin(angle) * radius * 0.65;
      ctx.fillStyle = toneById(event.toneID).color;
      ctx.beginPath();
      ctx.arc(px, py, 10 + (index % 4), 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function wrapCardText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    let currentY = y;
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, currentY);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function loadSeed(file) {
    if (!file) return;
    clearSeed(false);
    const isAudio = file.type.startsWith("audio/") || file.type.startsWith("video/");
    if (isAudio) {
      seedUrl = URL.createObjectURL(file);
      seedAudio = new Audio(seedUrl);
      seedAudio.preload = "auto";
      seed = seedFromMeta({ displayName: file.name.replace(/\.[^.]+$/, ""), sourceName: file.name, hasAudio: true });
      dom.seedStrip.hidden = false;
      updateUI();
      showHint("Seed ready", 1200);
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.format === "tone-loom-spell" && parsed.spell) {
        const spells = readSpells();
        const imported = normalizeSpell(parsed.spell);
        imported.id = id();
        imported.name = `${imported.name} Import`;
        spells.unshift(imported);
        writeSpells(spells);
        loadSpell(imported, true);
        showHint("Spell imported", 1200);
        return;
      }
      seed = seedFromMeta(parsed);
    } catch {
      seed = seedFromMeta({ displayName: file.name.replace(/\.[^.]+$/, ""), sourceName: file.name, note: "Imported as a creative seed." });
    }
    dom.seedStrip.hidden = false;
    updateUI();
    showHint("Seed threaded", 1200);
  }

  function seedFromMeta(meta) {
    const name = meta.displayName || meta.name || meta.toneName || "Imported Seed";
    const toneName = meta.toneName || meta.tone || name;
    const matched = toneByNameOrColor(toneName, meta.colorHex || meta.color);
    return {
      id: meta.id || id(),
      displayName: name,
      sourceName: meta.sourceName || name,
      toneName,
      toneID: matched.id,
      color: meta.color || normalizeColor(meta.colorHex) || matched.color,
      note: meta.note || "",
      hasAudio: !!meta.hasAudio || !!meta.audioFileName
    };
  }

  function toneByNameOrColor(name, color) {
    const lower = String(name || "").toLowerCase();
    const match = tones.find((item) => lower.includes(item.id) || lower.includes(item.name.toLowerCase()));
    if (match) return match;
    const colorString = normalizeColor(color);
    if (!colorString) return tones[0];
    return tones.reduce((best, item) => colorDistance(item.color, colorString) < colorDistance(best.color, colorString) ? item : best, tones[0]);
  }

  function normalizeColor(value) {
    if (typeof value === "string" && value.startsWith("#")) return value;
    if (typeof value === "number") return `#${value.toString(16).padStart(6, "0").slice(-6)}`;
    return "";
  }

  function colorDistance(a, b) {
    const ca = hexParts(a);
    const cb = hexParts(b);
    return Math.hypot(ca[0] - cb[0], ca[1] - cb[1], ca[2] - cb[2]);
  }

  function hexParts(hex) {
    const value = parseInt(String(hex).replace("#", ""), 16) || 0;
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }

  function playSeed() {
    if (!seedAudio) {
      dom.seedInput.click();
      return;
    }
    if (seedAudio.paused) {
      seedAudio.loop = false;
      seedAudio.play();
    } else {
      seedAudio.pause();
      seedAudio.currentTime = 0;
    }
    updateUI();
  }

  function toggleSeedLoop() {
    if (!seedAudio) {
      dom.seedInput.click();
      return;
    }
    if (!seedAudio.paused && seedAudio.loop) {
      seedAudio.pause();
      seedAudio.currentTime = 0;
      seedAudio.loop = false;
    } else {
      seedAudio.loop = true;
      seedAudio.play();
    }
    updateUI();
  }

  function weaveSeedThread() {
    if (!seed) {
      showHint("Import a tone seed first", 1200);
      return;
    }
    const ids = activeToneIDs();
    const anchorIndex = Math.max(0, ids.indexOf(seed.toneID));
    const offsets = patternForMode(selectedModeId);
    pushUndo();
    loopEvents = offsets.map((offset, index) => {
      const toneID = ids[(anchorIndex + offset) % ids.length] || seed.toneID;
      return {
        id: id(),
        toneID,
        slotIndex: Math.max(0, ids.indexOf(toneID)),
        startTime: index * 0.46,
        duration: index % 4 === 0 ? 0.86 : 0.42,
        gesture: "importedSeed",
        effect: index % 2 ? selectedEffectId : "echo",
        intensity: index % 4 === 0 ? 0.78 : 0.58
      };
    });
    loopDuration = 8;
    stopLoop(false);
    startLoop(true);
    showHint("Seed woven", 1200);
  }

  function clearSeed(show = true) {
    if (seedAudio) {
      seedAudio.pause();
      seedAudio.removeAttribute("src");
      seedAudio.load();
    }
    if (seedUrl) URL.revokeObjectURL(seedUrl);
    seedAudio = null;
    seedUrl = null;
    seed = null;
    dom.seedInput.value = "";
    dom.seedStrip.hidden = true;
    if (show) showHint("Seed cleared", 1000);
    updateUI();
  }

  function selectWheel(idValue) {
    selectedWheelId = idValue;
    stopLoop(false);
    pathDraft = [];
    updateUI();
    showHint(`${currentWheel().name} wheel`, 1100);
  }

  function selectPalette(idValue) {
    selectedPaletteId = idValue;
    updateUI();
    showHint(`${currentPalette().name} constellation`, 1100);
  }

  function saveCustomWheel() {
    const toneIDs = selectedWheelToneIDs.filter((toneID, index, array) => array.indexOf(toneID) === index);
    if (!toneIDs.length) {
      showHint("Choose at least 1 tone", 1100);
      return;
    }
    const name = sanitizeText(dom.wheelNameInput.value) || `${toneIDs.length}-Tone Wheel`;
    const wheel = { id: `custom-wheel:${id()}`, name, toneIDs, createdAt: new Date().toISOString() };
    customWheels.unshift(wheel);
    writeJSON(keys.customWheels, customWheels);
    selectedWheelToneIDs = [];
    dom.wheelNameInput.value = "";
    selectWheel(wheel.id);
    renderAtelier();
    renderLibrary();
    showHint("Spell wheel saved", 1200);
  }

  function deleteCustomWheel(idValue) {
    customWheels = customWheels.filter((wheel) => wheel.id !== idValue);
    writeJSON(keys.customWheels, customWheels);
    if (selectedWheelId === idValue) selectedWheelId = "low-to-high";
    renderAtelier();
    renderLibrary();
    updateUI();
  }

  function saveCustomConstellation() {
    const toneIDs = selectedConstellationToneIDs.filter((toneID, index, array) => array.indexOf(toneID) === index);
    if (toneIDs.length < 3) {
      showHint("Choose at least 3 tones", 1100);
      return;
    }
    const name = sanitizeText(dom.constellationNameInput.value) || "Atelier Constellation";
    const constellation = { id: `custom:${id()}`, name, toneIDs: toneIDs.slice(0, 12), createdAt: new Date().toISOString() };
    customConstellations.unshift(constellation);
    writeJSON(keys.customConstellations, customConstellations);
    selectedConstellationToneIDs = [];
    dom.constellationNameInput.value = "";
    selectPalette(constellation.id);
    renderAtelier();
    renderLibrary();
    showHint("Constellation saved", 1200);
  }

  function deleteCustomConstellation(idValue) {
    customConstellations = customConstellations.filter((item) => item.id !== idValue);
    writeJSON(keys.customConstellations, customConstellations);
    if (selectedPaletteId === idValue) selectedPaletteId = palettes[0].id;
    renderAtelier();
    renderLibrary();
    updateUI();
  }

  function hitTest(event) {
    const rect = dom.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const size = Math.min(rect.width, rect.height);
    const radius = size * 0.438;
    const inner = size * 0.19;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.hypot(dx, dy);
    if (distance < inner * 0.9) return { kind: "core" };
    if (distance < inner || distance > radius * 1.17) return null;
    const angle = (Math.atan2(dy, dx) + Math.PI * 2.5) % (Math.PI * 2);
    const slotIndex = Math.floor((angle / (Math.PI * 2)) * activeToneIDs().length) % activeToneIDs().length;
    return { kind: "slot", slotIndex, x, y, distance };
  }

  function pointerIntensity(event, previous) {
    if (!previous) return 0.74;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    const dt = Math.max(16, performance.now() - previous.time);
    return clamp(0.45 + Math.hypot(dx, dy) / dt * 0.48, 0.38, 1);
  }

  function handlePointerDown(event) {
    event.preventDefault();
    ensureAudio();
    dom.canvas.setPointerCapture(event.pointerId);
    const hit = hitTest(event);
    if (!hit) return;
    if (hit.kind === "core") {
      togglePlay();
      return;
    }
    const pointer = { lastSlot: hit.slotIndex, lastTime: performance.now(), x: event.clientX, y: event.clientY, time: performance.now() };
    activePointers.set(event.pointerId, pointer);
    playToneBySlot(hit.slotIndex, { kind: "tap", intensity: 0.82 });
    addPathEvent(hit.slotIndex, 0.82, "tap");
  }

  function handlePointerMove(event) {
    const pointer = activePointers.get(event.pointerId);
    if (!pointer) return;
    event.preventDefault();
    const hit = hitTest(event);
    if (!hit || hit.kind !== "slot") return;
    const now = performance.now();
    const minGap = selectedModeId === "spark" ? 58 : selectedModeId === "drift" || selectedModeId === "night" ? 112 : 78;
    const intensity = pointerIntensity(event, pointer);
    if (hit.slotIndex !== pointer.lastSlot && now - pointer.lastTime > minGap) {
      pointer.lastSlot = hit.slotIndex;
      pointer.lastTime = now;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;
      playToneBySlot(hit.slotIndex, { kind: "drag", intensity });
      addPathEvent(hit.slotIndex, intensity, "drag");
    } else {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;
    }
  }

  function handlePointerUp(event) {
    activePointers.delete(event.pointerId);
    if (pathDraft.length > 2 && !isRecording) {
      setSpellState("Path ready");
      showHint("Press Weave to hold this path", 1200);
    }
  }

  function renderUIControls() {
    dom.wheelButtons.textContent = "";
    allWheels().forEach((wheel) => {
      const button = el("button", "wheel-pill", wheel.name);
      button.type = "button";
      button.dataset.id = wheel.id;
      button.addEventListener("click", () => selectWheel(wheel.id));
      dom.wheelButtons.append(button);
    });
    dom.modeButtons.textContent = "";
    modes.forEach((mode) => {
      const button = el("button", "mode-pill", mode.name);
      button.type = "button";
      button.dataset.id = mode.id;
      button.addEventListener("click", () => {
        selectedModeId = mode.id;
        saveSettings();
        updateUI();
        showHint(`${mode.name} mode`, 900);
      });
      dom.modeButtons.append(button);
    });
    dom.effectButtons.textContent = "";
    effects.forEach((effect) => {
      const button = el("button", "effect-pill", effect.name);
      button.type = "button";
      button.dataset.id = effect.id;
      button.addEventListener("click", () => {
        selectedEffectId = effect.id;
        updateEffectAudio();
        saveSettings();
        updateUI();
        showHint(effect.name, 900);
      });
      dom.effectButtons.append(button);
    });
  }

  function renderLibrary() {
    dom.libraryWheelList.textContent = "";
    allWheels().forEach((wheel) => {
      const row = optionRow(wheel.name, wheel.subtitle, `${wheel.toneIDs.length} tones`, moodForToneIDs(wheel.toneIDs)[0], selectedWheelId === wheel.id);
      row.addEventListener("click", () => {
        if (wheel.id === "custom-wheel") {
          dom.libraryDialog.close();
          dom.atelierDialog.showModal();
          return;
        }
        selectWheel(wheel.id);
      });
      dom.libraryWheelList.append(row);
    });

    dom.constellationList.textContent = "";
    allPalettes().forEach((palette) => {
      const row = optionRow(palette.name, "Constellation guide", `${palette.toneIDs.length} tones`, moodForToneIDs(palette.toneIDs)[0], selectedPaletteId === palette.id);
      row.addEventListener("click", () => selectPalette(palette.id));
      dom.constellationList.append(row);
    });

    dom.mythicScaleList.textContent = "";
    chambers.forEach((chamber) => {
      const group = el("div", "chamber-group");
      group.append(el("div", "chamber-title", chamber.name));
      const list = el("div", "chamber-tones");
      tones.filter((item) => item.chamber === chamber.id).forEach((item) => {
        const chip = el("span", "lore-chip");
        chip.append(dot(item.color));
        chip.append(document.createTextNode(`${item.name} - ${item.lorePitch}`));
        chip.title = `${item.soundCharacter}; ${item.motionBehavior}; ${item.interactionEffect}`;
        list.append(chip);
      });
      group.append(list);
      dom.mythicScaleList.append(group);
    });
  }

  function renderAtelier() {
    dom.effectDepth.value = String(effectDepth);
    renderTokenButtons(dom.skinButtons, skins, selectedSkinId, (skin) => {
      selectedSkinId = skin.id;
      saveSettings();
      updateUI();
      showHint(skin.name, 900);
    });
    renderTokenButtons(dom.timbreButtons, timbres, selectedTimbreId, (timbre) => {
      selectedTimbreId = timbre.id;
      saveSettings();
      updateUI();
      showHint(timbre.name, 900);
    });
    renderBuilderGrid(dom.wheelToneGrid, selectedWheelToneIDs, (toneID) => {
      const existing = selectedWheelToneIDs.indexOf(toneID);
      if (existing >= 0) selectedWheelToneIDs.splice(existing, 1);
      else if (selectedWheelToneIDs.length < 24) selectedWheelToneIDs.push(toneID);
      renderAtelier();
    });
    renderSelectionPreview(dom.wheelOrderPreview, selectedWheelToneIDs, "No tones chosen yet");
    dom.customWheelList.textContent = "";
    customWheels.forEach((wheel) => {
      const row = optionRow(wheel.name, `${wheel.toneIDs.length} tone spell wheel`, "Use", moodForToneIDs(wheel.toneIDs)[0], selectedWheelId === wheel.id);
      const del = el("button", "token-button", "Delete");
      del.type = "button";
      del.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteCustomWheel(wheel.id);
      });
      row.addEventListener("click", () => selectWheel(wheel.id));
      row.append(del);
      dom.customWheelList.append(row);
    });

    renderTokenButtons(dom.reweaveButtons, reweaves, "", (variant) => applyReweave(variant.id));
    renderLayerRow();
    renderBuilderGrid(dom.constellationToneGrid, selectedConstellationToneIDs, (toneID) => {
      const existing = selectedConstellationToneIDs.indexOf(toneID);
      if (existing >= 0) selectedConstellationToneIDs.splice(existing, 1);
      else if (selectedConstellationToneIDs.length < 12) selectedConstellationToneIDs.push(toneID);
      renderAtelier();
    });
    renderSelectionPreview(dom.constellationPreview, selectedConstellationToneIDs, "Choose at least 3 tones");
    dom.customConstellationList.textContent = "";
    customConstellations.forEach((constellation) => {
      const row = optionRow(constellation.name, `${constellation.toneIDs.length} tone guide`, "Use", moodForToneIDs(constellation.toneIDs)[0], selectedPaletteId === constellation.id);
      const del = el("button", "token-button", "Delete");
      del.type = "button";
      del.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteCustomConstellation(constellation.id);
      });
      row.addEventListener("click", () => selectPalette(constellation.id));
      row.append(del);
      dom.customConstellationList.append(row);
    });
  }

  function renderTokenButtons(container, items, activeID, onSelect) {
    container.textContent = "";
    items.forEach((item) => {
      const button = el("button", `token-button${item.id === activeID ? " active" : ""}`, item.name);
      button.type = "button";
      button.addEventListener("click", () => onSelect(item));
      container.append(button);
    });
  }

  function renderBuilderGrid(container, selected, onToggle) {
    container.textContent = "";
    tones.forEach((item) => {
      const button = el("button", `tone-token${selected.includes(item.id) ? " active" : ""}`);
      button.type = "button";
      button.append(dot(item.color));
      button.append(el("span", "", item.name));
      button.title = `${item.soundCharacter}; ${item.interactionEffect}`;
      button.addEventListener("click", () => onToggle(item.id));
      container.append(button);
    });
  }

  function renderSelectionPreview(container, toneIDs, emptyText) {
    container.textContent = "";
    if (!toneIDs.length) {
      container.textContent = emptyText;
      return;
    }
    toneIDs.forEach((toneID, index) => {
      const item = toneById(toneID);
      const pill = el("span", "selected-pill");
      pill.append(el("strong", "", String(index + 1)));
      pill.append(dot(item.color));
      pill.append(document.createTextNode(item.name));
      container.append(pill);
    });
  }

  function renderLayerRow() {
    dom.layerRow.textContent = "";
    const label = el("span", "", atelierLayerEvents.length ? `${atelierLayerEvents.length} atelier threads` : "No atelier layer yet");
    dom.layerRow.append(label);
    const hold = el("button", "token-button", "Layer");
    hold.type = "button";
    hold.addEventListener("click", captureLayer);
    dom.layerRow.append(hold);
    if (atelierLayerEvents.length) {
      const mute = el("button", "token-button", layerMuted ? "Return" : "Hush");
      mute.type = "button";
      mute.addEventListener("click", () => {
        layerMuted = !layerMuted;
        updateUI();
      });
      const clear = el("button", "token-button", "Clear");
      clear.type = "button";
      clear.addEventListener("click", () => {
        atelierLayerEvents = [];
        layerMuted = false;
        updateUI();
      });
      dom.layerRow.append(mute, clear);
    }
  }

  function renderArchive() {
    const spells = readSpells().sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    dom.archiveList.textContent = "";
    if (!spells.length) {
      dom.archiveList.append(el("p", "empty-spells", "No spells yet. Run your finger around the wheel, press Weave, then Keep."));
      return;
    }
    spells.forEach((spell) => {
      const row = el("article", `spell-row${spell.isFavorite ? " favorite" : ""}`);
      const sigil = el("span", "spell-sigil");
      sigil.style.background = spellSigilBackground(spell);
      const copy = el("div");
      copy.append(el("strong", "", spell.isFavorite ? `* ${spell.name}` : spell.name));
      copy.append(el("p", "", `${modeName(spell.mode)} - ${spell.wheelName || "Magic Wheel"} - ${spell.events.length + spell.layeredEvents.length} threads - ${Math.round(spell.duration)}s`));
      copy.append(el("p", "", spell.intentionSeed ? `"${spell.intentionSeed}"` : "Local spell"));
      const actions = el("div", "spell-actions");
      [
        ["Play", () => loadSpell(spell, false)],
        ["Remix", () => remixSpell(spell)],
        [spell.isFavorite ? "Unstar" : "Star", () => toggleFavoriteSpell(spell.id)],
        ["Share", () => shareSpell(spell)],
        ["Card", () => exportSpellCard(spell)],
        ["File", () => exportSpellData(spell)],
        ["Edit", () => openEditSpell(spell.id)],
        ["Copy", () => duplicateSpell(spell)],
        ["Delete", () => deleteSpell(spell.id)]
      ].forEach(([label, action]) => {
        const button = el("button", "", label);
        button.type = "button";
        button.addEventListener("click", action);
        actions.append(button);
      });
      row.append(sigil, copy, actions);
      dom.archiveList.append(row);
    });
  }

  function optionRow(title, subtitle, meta, color, isActive) {
    const row = el("button", `option-row${isActive ? " active" : ""}`);
    row.type = "button";
    row.append(dot(color, "option-dot"));
    const copy = el("span");
    copy.append(el("span", "option-title", title));
    copy.append(el("span", "option-subtitle", subtitle));
    row.append(copy);
    row.append(el("span", "option-meta", meta));
    return row;
  }

  function dot(color, className = "tone-dot") {
    const item = el("span", className);
    item.style.background = color;
    item.style.color = color;
    return item;
  }

  function spellSigilBackground(spell) {
    const events = [...(spell.events || []), ...(spell.layeredEvents || [])].map(normalizeEvent);
    const colors = events.slice(0, 10).map((event) => toneById(event.toneID).color);
    const palette = colors.length ? colors : ["#e6c985", "#fff6e8"];
    return `radial-gradient(circle, rgba(255,246,232,.78), ${palette[0]}66 34%, transparent 64%), conic-gradient(from 20deg, ${palette.join(", ")}, ${palette[0]})`;
  }

  function drawWheel() {
    resizeCanvas();
    const rect = dom.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      window.requestAnimationFrame(drawWheel);
      return;
    }
    const ctx = ctx2d;
    const width = rect.width;
    const height = rect.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.438;
    const inner = size * 0.19;
    const ids = activeToneIDs();
    const skin = currentSkin();
    const wheel = currentWheel();
    const now = performance.now();
    visualPulse *= 0.92;
    activeBursts = activeBursts.filter((burst) => burst.expiresAt > now);
    ctx.clearRect(0, 0, width, height);
    drawOuterGlow(ctx, cx, cy, radius, wheel, skin, visualPulse);
    drawRings(ctx, cx, cy, radius, inner);
    ids.forEach((toneID, index) => drawSlot(ctx, index, toneById(toneID), cx, cy, radius, inner, now));
    drawConstellation(ctx, cx, cy, radius, inner);
    drawPath(ctx, pathDraft, radius);
    drawWovenMarks(ctx, [...loopEvents, ...(layerMuted ? [] : atelierLayerEvents)], cx, cy, inner);
    drawCore(ctx, cx, cy, inner, skin, visualPulse);
    window.requestAnimationFrame(drawWheel);
  }

  function resizeCanvas() {
    const rect = dom.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (dom.canvas.width !== width || dom.canvas.height !== height) {
      dom.canvas.width = width;
      dom.canvas.height = height;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function drawOuterGlow(ctx, cx, cy, radius, wheel, skin, pulse) {
    const mood = wheel.mood || skin.accents;
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.22);
    glow.addColorStop(0, hexToRgba(mood[0], 0.16 + pulse * 0.08));
    glow.addColorStop(0.48, hexToRgba(mood[1] || mood[0], 0.08));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (1.08 + pulse * 0.03), 0, Math.PI * 2);
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

  function drawSlot(ctx, index, item, cx, cy, radius, inner, now) {
    const count = activeToneIDs().length;
    const angleSize = Math.PI * 2 / count;
    const start = index * angleSize - Math.PI / 2;
    const end = start + angleSize;
    const burst = activeBursts.find((entry) => entry.slotIndex === index || entry.toneID === item.id);
    const burstAge = burst ? clamp((burst.expiresAt - now) / 800, 0, 1) : 0;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start + 0.01, end - 0.01);
    ctx.arc(cx, cy, inner, end - 0.01, start + 0.01, true);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(item.color, burst ? 0.2 + burstAge * 0.18 : 0.055);
    ctx.fill();
    ctx.strokeStyle = burst ? hexToRgba(item.color, 0.58) : "rgba(255,246,232,0.055)";
    ctx.lineWidth = burst ? 2.4 : 1;
    ctx.stroke();
    const point = slotPoint(index, 0.95);
    const dotRadius = Math.max(9, radius * 0.035) + burstAge * 9;
    const dotGlow = ctx.createRadialGradient(point.x, point.y, 1, point.x, point.y, dotRadius * 2.4);
    dotGlow.addColorStop(0, "rgba(255,246,232,0.96)");
    dotGlow.addColorStop(0.38, hexToRgba(item.color, 0.82));
    dotGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = dotGlow;
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius * 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = burst ? "rgba(255,246,232,0.98)" : hexToRgba(item.color, 0.92);
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,246,232,0.24)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(point.angle) * inner * 1.08, cy + Math.sin(point.angle) * inner * 1.08);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawConstellation(ctx, cx, cy, radius, inner) {
    if (!constellationVisible) return;
    const ids = activeToneIDs();
    const guide = currentPalette().toneIDs.map((toneID) => ids.indexOf(toneID)).filter((index) => index >= 0);
    if (!guide.length) return;
    ctx.save();
    ctx.strokeStyle = "rgba(232,215,178,0.38)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    guide.forEach((slot, index) => {
      const point = slotPoint(slot, 0.72);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    if (guide.length > 2) ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    guide.forEach((slot) => {
      const point = slotPoint(slot, 0.72);
      ctx.fillStyle = hexToRgba(slotTone(slot).color, 0.75);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawPath(ctx, events, radius) {
    const list = events.slice(-48).map(normalizeEvent);
    if (list.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, radius * 0.018);
    ctx.strokeStyle = "rgba(255,246,232,0.58)";
    ctx.beginPath();
    list.forEach((event, index) => {
      const point = slotPoint(event.slotIndex, 0.66);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  function drawWovenMarks(ctx, events, cx, cy, inner) {
    if (!events.length) return;
    ctx.save();
    const orbit = inner * 1.25;
    events.map(normalizeEvent).slice(0, 42).forEach((event) => {
      const angle = (event.startTime / Math.max(1, loopDuration)) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * orbit;
      const y = cy + Math.sin(angle) * orbit;
      ctx.fillStyle = hexToRgba(toneById(event.toneID).color, 0.66);
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawCore(ctx, cx, cy, inner, skin, pulse) {
    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy, inner * 0.08, cx, cy, inner * 1.06);
    grad.addColorStop(0, "rgba(255,246,232,0.92)");
    grad.addColorStop(0.4, hexToRgba(skin.accents[0], 0.28));
    grad.addColorStop(1, "rgba(8,4,3,0.96)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, inner * (0.95 + pulse * 0.06), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(skin.accents[0], 0.48);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, inner * 1.02, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,246,232,0.78)";
    ctx.lineWidth = Math.max(3, inner * 0.045);
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let step = 0; step < 96; step += 1) {
      const angle = step * 0.28 + performance.now() / 9000;
      const r = inner * 0.04 + step * inner * 0.0038;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function slotPoint(slotIndex, radiusFactor = 0.84) {
    const rect = dom.canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = size * 0.438 * radiusFactor;
    const count = Math.max(1, activeToneIDs().length);
    const angle = (slotIndex + 0.5) / count * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle };
  }

  function updateUI() {
    const wheel = currentWheel();
    const mode = currentMode();
    const effect = currentEffect();
    const skin = currentSkin();
    document.body.dataset.skin = selectedSkinId;
    document.body.style.background = `radial-gradient(circle at 50% 28%, ${hexToRgba(skin.accents[0], 0.18)}, transparent 27rem), radial-gradient(circle at 70% 72%, ${hexToRgba(skin.accents[1], 0.12)}, transparent 28rem), linear-gradient(180deg, ${skin.colors[0]} 0%, ${skin.colors[1]} 72%, #050303 100%)`;
    dom.wheelName.textContent = wheel.name;
    dom.toneCount.textContent = `${activeToneIDs().length} ${activeToneIDs().length === 1 ? "tone" : "tones"}`;
    dom.wheelDescription.textContent = wheel.subtitle || "Magic Wheel";
    dom.constellation.textContent = constellationVisible ? "Eye" : "Hide";
    dom.constellation.title = constellationVisible ? "Hide constellation guide" : "Show constellation guide";
    dom.spellState.textContent = stateText();
    dom.record.textContent = isRecording ? "Stop" : loopEvents.length ? "Overdub" : "Record";
    dom.record.classList.toggle("active", isRecording);
    dom.weave.textContent = loopEvents.length ? "Reweave" : pathDraft.length > 2 ? "Weave Path" : "Weave";
    dom.weave.classList.toggle("ready", pathDraft.length > 2 && !loopEvents.length);
    dom.play.textContent = isLooping ? "Stop" : "Play";
    dom.keep.disabled = !loopEvents.length;
    dom.share.disabled = !loopEvents.length;
    dom.undo.disabled = !undoStack.length && !loopEvents.length;
    if (seed) {
      dom.seedStrip.hidden = false;
      dom.seedName.textContent = seed.displayName;
      dom.playSeed.textContent = seedAudio && !seedAudio.paused && !seedAudio.loop ? "Stop Seed" : "Play Seed";
      dom.loopSeed.textContent = seedAudio && !seedAudio.paused && seedAudio.loop ? "Stop Loop" : "Loop Seed";
    } else {
      dom.seedStrip.hidden = true;
    }
    [...dom.wheelButtons.children].forEach((button) => button.classList.toggle("active", button.dataset.id === selectedWheelId));
    [...dom.modeButtons.children].forEach((button) => button.classList.toggle("active", button.dataset.id === selectedModeId));
    [...dom.effectButtons.children].forEach((button) => button.classList.toggle("active", button.dataset.id === selectedEffectId));
    updateEffectAudio();
    saveSettings();
    renderLayerRow();
  }

  function stateText() {
    if (isRecording && loopEvents.length) return "overdub";
    if (isRecording) return "recording";
    if (pathDraft.length > 2 && !loopEvents.length) return "path ready";
    if (isLooping) return "playing";
    if (loopEvents.length) return "woven";
    return "free play";
  }

  function setSpellState(value) {
    dom.spellState.textContent = value;
  }

  function showHint(message, duration = 1500) {
    if (message === lastHint && dom.hint.classList.contains("visible")) return;
    lastHint = message;
    dom.hint.textContent = message;
    dom.hint.classList.add("visible");
    window.clearTimeout(showHint.timer);
    showHint.timer = window.setTimeout(() => dom.hint.classList.remove("visible"), duration);
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
      stopLoop(false);
    });
    dom.constellation.addEventListener("click", () => {
      constellationVisible = !constellationVisible;
      updateUI();
      showHint(constellationVisible ? `${currentPalette().name} guide shown` : "Constellation hidden", 1100);
    });
    dom.library.addEventListener("click", () => {
      renderLibrary();
      dom.libraryDialog.showModal();
    });
    dom.atelier.addEventListener("click", () => {
      renderAtelier();
      dom.atelierDialog.showModal();
    });
    dom.archive.addEventListener("click", () => {
      renderArchive();
      dom.archiveDialog.showModal();
    });
    dom.seedButton.addEventListener("click", () => dom.seedInput.click());
    dom.seedInput.addEventListener("change", () => loadSeed(dom.seedInput.files && dom.seedInput.files[0]));
    dom.playSeed.addEventListener("click", playSeed);
    dom.loopSeed.addEventListener("click", toggleSeedLoop);
    dom.weaveSeed.addEventListener("click", weaveSeedThread);
    dom.clearSeed.addEventListener("click", () => clearSeed());
    dom.canvas.addEventListener("pointerdown", handlePointerDown);
    dom.canvas.addEventListener("pointermove", handlePointerMove);
    dom.canvas.addEventListener("pointerup", handlePointerUp);
    dom.canvas.addEventListener("pointercancel", handlePointerUp);
    dom.canvas.addEventListener("lostpointercapture", handlePointerUp);
    dom.record.addEventListener("click", toggleRecording);
    dom.weave.addEventListener("click", weavePath);
    dom.play.addEventListener("click", togglePlay);
    dom.keep.addEventListener("click", openSaveDialog);
    dom.share.addEventListener("click", () => shareCurrent());
    dom.undo.addEventListener("click", undoLast);
    dom.clear.addEventListener("click", clearAll);
    dom.saveDialog.addEventListener("close", () => {
      if (dom.saveDialog.returnValue === "save") saveCurrentSpell();
    });
    dom.editSpellDialog.addEventListener("close", () => {
      if (dom.editSpellDialog.returnValue === "save") saveEditedSpell();
    });
    dom.effectDepth.addEventListener("input", () => {
      effectDepth = clamp(Number(dom.effectDepth.value), 0, 1);
      saveSettings();
      updateEffectAudio();
    });
    dom.clearWheelBuilder.addEventListener("click", () => {
      selectedWheelToneIDs = [];
      renderAtelier();
    });
    dom.saveWheel.addEventListener("click", saveCustomWheel);
    dom.clearConstellationBuilder.addEventListener("click", () => {
      selectedConstellationToneIDs = [];
      renderAtelier();
    });
    dom.saveConstellation.addEventListener("click", saveCustomConstellation);
    window.addEventListener("resize", resizeCanvas);
  }

  function modeName(idValue) {
    return modes.find((mode) => mode.id === idValue)?.name || "Drift";
  }

  function el(tag, className = "", text = "") {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text) item.textContent = text;
    return item;
  }

  function id() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sanitizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function safeName(value) {
    return sanitizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tone-loom-spell";
  }

  function hexToRgba(hex, alpha) {
    const parts = hexParts(hex);
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }

  renderUIControls();
  renderLibrary();
  renderAtelier();
  bindEvents();
  updateUI();
  window.requestAnimationFrame(drawWheel);
})();
