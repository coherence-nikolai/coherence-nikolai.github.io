(function () {
  "use strict";

  const THREE_URL = "https://unpkg.com/three@0.165.0/build/three.module.js";
  const STORAGE_KEY = "toneGlyph.savedRecipes.v2";
  const LEGACY_STORAGE_KEY = "toneGlyph.savedGlyphs.v1";
  const MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");

  const toneProfiles = [
    { id: "calm", label: "Calm", freq: 196, colors: ["#f6d27a", "#66e2cf", "#8ea7ff", "#1f4f4a"] },
    { id: "clarity", label: "Clarity", freq: 261.63, colors: ["#f8f3dc", "#8ee8ff", "#f6d27a", "#274869"] },
    { id: "love", label: "Love", freq: 329.63, colors: ["#ffd0cc", "#f08a7e", "#f6d27a", "#6d3146"] },
    { id: "protect", label: "Guard", freq: 174, colors: ["#d9e7ff", "#8ea7ff", "#66e2cf", "#17243f"] },
    { id: "focus", label: "Focus", freq: 220, colors: ["#f6d27a", "#f2f7ee", "#66e2cf", "#233326"] },
    { id: "renewal", label: "Renew", freq: 293.66, colors: ["#b8f4b3", "#66e2cf", "#f6d27a", "#153d31"] }
  ];

  const palettes = [
    ["#f6d27a", "#66e2cf", "#f08a7e", "#8ea7ff"],
    ["#f8f3dc", "#80e7ff", "#d8ffb6", "#223a57"],
    ["#ffc4b8", "#f08a7e", "#f6d27a", "#5e2940"],
    ["#a9ffe8", "#66e2cf", "#f7e6a2", "#183a3f"],
    ["#d9e7ff", "#8ea7ff", "#f2f7ee", "#1f2f4f"],
    ["#f6d27a", "#f08a7e", "#d8ffb6", "#21150f"]
  ];

  const modeCopy = {
    kasina: "Gaze",
    breath: "Breathe",
    play: "Touch",
    ritual: "Intention",
    glyph: "Create"
  };

  const glyphFamilies = [
    {
      id: "sacred",
      label: "Sacred",
      seeds: [
        { id: "metatron", label: "Metatron" },
        { id: "seed", label: "Seed" },
        { id: "flower", label: "Flower" },
        { id: "vesica", label: "Vesica" }
      ]
    },
    {
      id: "elemental",
      label: "Elemental",
      seeds: [
        { id: "fire", label: "Fire" },
        { id: "earth", label: "Earth" },
        { id: "air", label: "Air" },
        { id: "water", label: "Water" },
        { id: "ether", label: "Ether" }
      ]
    },
    {
      id: "tone",
      label: "Tone",
      seeds: [
        { id: "harmonic", label: "Harmonic" },
        { id: "octave", label: "Octave" },
        { id: "chord", label: "Chord" }
      ]
    },
    {
      id: "ritual",
      label: "Ritual",
      seeds: [
        { id: "seal", label: "Seal" },
        { id: "release", label: "Release" },
        { id: "protect", label: "Protect" },
        { id: "open", label: "Open" },
        { id: "remember", label: "Remember" }
      ]
    },
    {
      id: "motion",
      label: "Motion",
      seeds: [
        { id: "spiral", label: "Spiral" },
        { id: "torus", label: "Torus" },
        { id: "mirror", label: "Mirror" },
        { id: "gesture", label: "Gesture" }
      ]
    }
  ];

  const ritualActions = [
    { id: "seal", label: "Seal" },
    { id: "open", label: "Open" },
    { id: "protect", label: "Protect" },
    { id: "release", label: "Release" },
    { id: "remember", label: "Remember" },
    { id: "clarify", label: "Clarify" }
  ];

  const state = {
    mode: "ritual",
    intention: "",
    tone: "calm",
    colors: toneProfiles[0].colors.slice(),
    sealedAt: null,
    activePulse: 0,
    activeNode: null,
    trueGlyph: false,
    family: "sacred",
    seed: "metatron",
    ritualAction: "seal",
    builder: {
      symmetry: 6,
      density: 6,
      orbits: 2,
      depth: 1,
      aura: 5,
      breath: 4,
      variant: 0
    },
    gesture: [],
    saves: [],
    reducedMotion: MOTION_QUERY.matches,
    renderer: null
  };

  const refs = {};
  let geometry = buildGlyphModel(state);
  let toastTimer = 0;
  let audioContext = null;

  document.addEventListener("DOMContentLoaded", start);

  function start() {
    bindRefs();
    loadSaves();
    buildFamilyControls();
    buildSeedControls();
    buildActionControls();
    buildToneControls();
    buildPaletteControls();
    bindControls();
    applyTheme();
    updateUI();
    startRenderer();
  }

  function bindRefs() {
    refs.canvas = document.getElementById("glyph-canvas");
    refs.status = document.getElementById("render-status");
    refs.toast = document.getElementById("toast");
    refs.modeButtons = Array.from(document.querySelectorAll(".mode-button[data-mode]"));
    refs.intention = document.getElementById("intention-input");
    refs.toneOptions = document.getElementById("tone-options");
    refs.familyOptions = document.getElementById("family-options");
    refs.seedSelect = document.getElementById("seed-select");
    refs.actionSelect = document.getElementById("action-select");
    refs.paletteOptions = document.getElementById("palette-options");
    refs.colorInputs = Array.from(document.querySelectorAll("[data-color-index]"));
    refs.ranges = {
      symmetry: document.getElementById("symmetry-range"),
      density: document.getElementById("density-range"),
      orbits: document.getElementById("orbit-range"),
      depth: document.getElementById("depth-range"),
      aura: document.getElementById("aura-range"),
      breath: document.getElementById("breath-range")
    };
    refs.outputs = {
      symmetry: document.getElementById("symmetry-output"),
      density: document.getElementById("density-output"),
      orbits: document.getElementById("orbit-output"),
      depth: document.getElementById("depth-output"),
      aura: document.getElementById("aura-output"),
      breath: document.getElementById("breath-output")
    };
    refs.seal = document.getElementById("seal-button");
    refs.clear = document.getElementById("clear-button");
    refs.save = document.getElementById("save-button");
    refs.share = document.getElementById("share-button");
    refs.download = document.getElementById("download-button");
    refs.trueView = document.getElementById("true-view-button");
    refs.front = document.getElementById("front-button");
    refs.variant = document.getElementById("variant-button");
    refs.clearGesture = document.getElementById("clear-gesture-button");
    refs.recipe = document.getElementById("recipe-button");
    refs.savedGlyphs = document.getElementById("saved-glyphs");
  }

  function bindControls() {
    refs.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    refs.intention.addEventListener("input", () => {
      state.intention = refs.intention.value.trim();
      state.sealedAt = null;
      updateUI();
    });

    refs.colorInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const index = Number(input.dataset.colorIndex);
        state.colors[index] = input.value;
        state.sealedAt = null;
        applyTheme();
        updateUI();
      });
    });

    refs.seal.addEventListener("click", sealRitual);
    refs.clear.addEventListener("click", clearRitual);
    refs.save.addEventListener("click", saveGlyph);
    refs.share.addEventListener("click", shareGlyph);
    refs.download.addEventListener("click", downloadGlyph);
    refs.trueView.addEventListener("click", () => setTrueGlyph(!state.trueGlyph));
    refs.front.addEventListener("click", resetFrontFace);
    refs.seedSelect.addEventListener("change", () => {
      state.seed = refs.seedSelect.value;
      rebuildGlyph("Seed: " + currentSeed().label);
    });
    refs.actionSelect.addEventListener("change", () => {
      state.ritualAction = refs.actionSelect.value;
      applyActionDefaults();
      rebuildGlyph("Action: " + currentAction().label);
    });
    Object.keys(refs.ranges).forEach((key) => {
      refs.ranges[key].addEventListener("input", () => {
        state.builder[key] = Number(refs.ranges[key].value);
        rebuildGlyph();
      });
    });
    refs.variant.addEventListener("click", () => {
      state.builder.variant = (state.builder.variant + 1) % 12;
      rebuildGlyph("Variant " + (state.builder.variant + 1));
    });
    refs.clearGesture.addEventListener("click", () => {
      state.gesture = [];
      rebuildGlyph("Trace cleared");
    });
    refs.recipe.addEventListener("click", downloadRecipe);

    MOTION_QUERY.addEventListener("change", (event) => {
      state.reducedMotion = event.matches;
    });
  }

  function buildFamilyControls() {
    refs.familyOptions.innerHTML = "";
    glyphFamilies.forEach((family) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "family-option";
      button.textContent = family.label;
      button.dataset.family = family.id;
      button.addEventListener("click", () => {
        state.family = family.id;
        state.seed = family.seeds[0].id;
        buildSeedControls();
        applyFamilyDefaults();
        rebuildGlyph("Family: " + family.label);
      });
      refs.familyOptions.append(button);
    });
  }

  function buildSeedControls() {
    refs.seedSelect.innerHTML = "";
    currentFamily().seeds.forEach((seed) => {
      const option = document.createElement("option");
      option.value = seed.id;
      option.textContent = seed.label;
      refs.seedSelect.append(option);
    });
    refs.seedSelect.value = state.seed;
  }

  function buildActionControls() {
    refs.actionSelect.innerHTML = "";
    ritualActions.forEach((action) => {
      const option = document.createElement("option");
      option.value = action.id;
      option.textContent = action.label;
      refs.actionSelect.append(option);
    });
    refs.actionSelect.value = state.ritualAction;
  }

  function buildToneControls() {
    refs.toneOptions.innerHTML = "";
    toneProfiles.forEach((tone) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tone-option";
      button.textContent = tone.label;
      button.dataset.tone = tone.id;
      button.addEventListener("click", () => {
        state.tone = tone.id;
        state.colors = tone.colors.slice();
        state.sealedAt = null;
        applyTheme();
        updateUI();
        pulse(tone.freq, 0.11);
      });
      refs.toneOptions.append(button);
    });
  }

  function buildPaletteControls() {
    refs.paletteOptions.innerHTML = "";
    palettes.forEach((palette, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "palette-option";
      button.ariaLabel = "Palette " + (index + 1);
      const strip = document.createElement("span");
      strip.className = "palette-strip";
      palette.forEach((color) => {
        const swatch = document.createElement("i");
        swatch.style.background = color;
        strip.append(swatch);
      });
      button.append(strip);
      button.addEventListener("click", () => {
        state.colors = palette.slice();
        state.sealedAt = null;
        applyTheme();
        updateUI();
        pulse(currentTone().freq * 1.5, 0.08);
      });
      refs.paletteOptions.append(button);
    });
  }

  async function startRenderer() {
    try {
      const three = await import(THREE_URL);
      state.renderer = new ThreeGlyphRenderer(refs.canvas, three, geometry, state);
      await state.renderer.init();
      refs.status.textContent = "3D field";
      updateUI();
    } catch (error) {
      console.warn("Three.js renderer unavailable, using canvas fallback.", error);
      state.renderer = new CanvasGlyphRenderer(refs.canvas, geometry, state);
      state.renderer.init();
      refs.status.textContent = "Canvas field";
      updateUI();
    }
  }

  function setMode(mode) {
    if (!modeCopy[mode]) return;
    state.mode = mode;
    document.body.dataset.mode = mode;
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq, mode === "play" ? 0.1 : 0.055);
  }

  function setTrueGlyph(enabled) {
    state.trueGlyph = Boolean(enabled);
    document.body.dataset.view = state.trueGlyph ? "true" : "living";
    rebuildGlyph();
    if (state.trueGlyph) resetRendererFront();
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq * (state.trueGlyph ? 1.25 : 1), 0.055);
    showToast(state.trueGlyph ? "True glyph" : "Living field");
  }

  function resetFrontFace() {
    resetRendererFront();
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq, 0.05);
    showToast("Front facing");
  }

  function resetRendererFront() {
    if (state.renderer && state.renderer.resetFrontFace) state.renderer.resetFrontFace();
  }

  function sealRitual() {
    state.intention = refs.intention.value.trim();
    state.sealedAt = Date.now();
    state.activePulse = performance.now();
    rebuildGlyph();
    updateUI();
    pulse(currentTone().freq * 2, 0.22);
    showToast(currentAction().label + " sealed");
  }

  function clearRitual() {
    state.intention = "";
    state.sealedAt = null;
    refs.intention.value = "";
    updateUI();
    showToast("Field cleared");
  }

  function saveGlyph() {
    const record = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      schemaVersion: 2,
      intention: state.intention,
      tone: state.tone,
      colors: state.colors.slice(),
      mode: state.mode,
      sealedAt: state.sealedAt,
      recipe: createRecipeSnapshot()
    };
    state.saves = [record].concat(state.saves).slice(0, 12);
    persistSaves();
    renderSaves();
    showToast("Glyph saved");
  }

  async function shareGlyph() {
    const blob = await createGlyphBlob("square");
    const file = new File([blob], "tone-glyph.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Tone Glyph",
        text: state.intention || "Tone Glyph",
        files: [file]
      });
      return;
    }
    downloadBlob(blob, "tone-glyph.png");
    showToast("Image downloaded");
  }

  async function downloadGlyph() {
    const blob = await createGlyphBlob("wallpaper");
    downloadBlob(blob, "tone-glyph-wallpaper.png");
    showToast("Wallpaper downloaded");
  }

  function downloadRecipe() {
    const blob = new Blob([JSON.stringify(createRecipeSnapshot(), null, 2)], { type: "application/json" });
    downloadBlob(blob, "tone-glyph-recipe.json");
    showToast("Recipe downloaded");
  }

  function loadSavedGlyph(record) {
    applyRecipe(record.recipe || legacyRecipeFromRecord(record));
    refs.intention.value = state.intention;
    applyTheme();
    buildSeedControls();
    updateUI();
    rebuildGlyph();
    state.activePulse = performance.now();
    showToast("Glyph restored");
  }

  function updateUI() {
    refs.modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });

    refs.trueView.classList.toggle("active", state.trueGlyph);
    refs.trueView.setAttribute("aria-pressed", state.trueGlyph ? "true" : "false");

    Array.from(refs.familyOptions.children).forEach((button) => {
      button.classList.toggle("active", button.dataset.family === state.family);
    });

    refs.seedSelect.value = state.seed;
    refs.actionSelect.value = state.ritualAction;

    Object.keys(refs.ranges).forEach((key) => {
      const value = String(state.builder[key]);
      if (refs.ranges[key].value !== value) refs.ranges[key].value = value;
      refs.outputs[key].textContent = value;
    });

    Array.from(refs.toneOptions.children).forEach((button) => {
      button.classList.toggle("active", button.dataset.tone === state.tone);
    });

    refs.colorInputs.forEach((input) => {
      const index = Number(input.dataset.colorIndex);
      if (input.value.toLowerCase() !== state.colors[index].toLowerCase()) {
        input.value = state.colors[index];
      }
    });

    const label = modeCopy[state.mode] || "Field";
    refs.status.textContent = state.trueGlyph ? "True glyph" : currentSeed().label + " " + label;
  }

  function applyTheme() {
    const root = document.documentElement;
    state.colors.forEach((color, index) => {
      root.style.setProperty("--tone-" + String.fromCharCode(97 + index), color);
    });
    if (state.renderer && state.renderer.updateTheme) state.renderer.updateTheme();
  }

  function currentTone() {
    return toneProfiles.find((tone) => tone.id === state.tone) || toneProfiles[0];
  }

  function currentFamily() {
    return glyphFamilies.find((family) => family.id === state.family) || glyphFamilies[0];
  }

  function currentSeed() {
    return currentFamily().seeds.find((seed) => seed.id === state.seed) || currentFamily().seeds[0];
  }

  function currentAction() {
    return ritualActions.find((action) => action.id === state.ritualAction) || ritualActions[0];
  }

  function loadSaves() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const v2Saves = raw ? JSON.parse(raw) : [];
      if (Array.isArray(v2Saves) && v2Saves.length) {
        state.saves = v2Saves;
      } else {
        const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
        const legacy = legacyRaw ? JSON.parse(legacyRaw) : [];
        state.saves = Array.isArray(legacy) ? legacy.map((record) => ({
          id: record.id || String(Date.now()),
          createdAt: record.createdAt || new Date().toISOString(),
          schemaVersion: 2,
          intention: record.intention || "",
          tone: record.tone || "calm",
          colors: Array.isArray(record.colors) ? record.colors.slice(0, 4) : toneProfiles[0].colors.slice(),
          mode: record.mode || "ritual",
          sealedAt: record.sealedAt || null,
          recipe: legacyRecipeFromRecord(record)
        })) : [];
      }
    } catch {
      state.saves = [];
    }
    renderSaves();
  }

  function persistSaves() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saves));
  }

  function renderSaves() {
    refs.savedGlyphs.innerHTML = "";
    if (!state.saves.length) {
      const empty = document.createElement("span");
      empty.className = "saved-chip";
      empty.textContent = "No saved glyphs";
      refs.savedGlyphs.append(empty);
      return;
    }
    state.saves.forEach((record) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "saved-chip";
      button.addEventListener("click", () => loadSavedGlyph(record));
      const dot = document.createElement("span");
      dot.style.setProperty("--chip-color", record.colors && record.colors[0] ? record.colors[0] : "#f6d27a");
      const seed = record.recipe && record.recipe.seed ? seedLabel(record.recipe.seed) : toneLabel(record.tone);
      const text = document.createTextNode(record.intention ? record.intention.slice(0, 22) : seed);
      button.append(dot, text);
      refs.savedGlyphs.append(button);
    });
  }

  function toneLabel(id) {
    const tone = toneProfiles.find((item) => item.id === id);
    return tone ? tone.label : "Glyph";
  }

  function seedLabel(id) {
    const family = glyphFamilies.find((item) => item.seeds.some((seed) => seed.id === id));
    const seed = family ? family.seeds.find((item) => item.id === id) : null;
    return seed ? seed.label : "Glyph";
  }

  function applyFamilyDefaults() {
    if (!currentFamily().seeds.some((seed) => seed.id === state.seed)) {
      state.seed = currentFamily().seeds[0].id;
    }
    const defaults = {
      sacred: { symmetry: 6, density: 6, orbits: 2, depth: 1, aura: 5, breath: 4 },
      elemental: { symmetry: 4, density: 5, orbits: 2, depth: 2, aura: 5, breath: 4 },
      tone: { symmetry: 8, density: 6, orbits: 3, depth: 2, aura: 6, breath: 5 },
      ritual: { symmetry: 6, density: 5, orbits: 2, depth: 1, aura: 7, breath: 4 },
      motion: { symmetry: 9, density: 5, orbits: 3, depth: 3, aura: 6, breath: 6 }
    };
    Object.assign(state.builder, defaults[state.family] || defaults.sacred, { variant: state.builder.variant });
  }

  function applyActionDefaults() {
    const actionSeed = {
      seal: "seal",
      open: "open",
      protect: "protect",
      release: "release",
      remember: "remember",
      clarify: "harmonic"
    }[state.ritualAction];
    state.family = state.ritualAction === "clarify" ? "tone" : "ritual";
    state.seed = actionSeed || "seal";
    state.builder.aura = state.ritualAction === "protect" ? 8 : state.builder.aura;
    state.builder.density = state.ritualAction === "release" ? 4 : state.builder.density;
    state.builder.orbits = state.ritualAction === "open" ? 3 : state.builder.orbits;
    buildSeedControls();
  }

  function createRecipeSnapshot() {
    return {
      schemaVersion: 2,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      family: state.family,
      seed: state.seed,
      ritualAction: state.ritualAction,
      intention: state.intention,
      tone: state.tone,
      colors: state.colors.slice(),
      mode: state.mode,
      trueGlyph: state.trueGlyph,
      sealedAt: state.sealedAt,
      builder: { ...state.builder },
      gesture: state.gesture.slice(-120)
    };
  }

  function legacyRecipeFromRecord(record) {
    return {
      schemaVersion: 2,
      family: "sacred",
      seed: "metatron",
      ritualAction: "seal",
      intention: record.intention || "",
      tone: record.tone || "calm",
      colors: Array.isArray(record.colors) ? record.colors.slice(0, 4) : toneProfiles[0].colors.slice(),
      mode: record.mode || "ritual",
      trueGlyph: false,
      sealedAt: record.sealedAt || null,
      builder: { symmetry: 6, density: 6, orbits: 2, depth: 1, aura: 5, breath: 4, variant: 0 },
      gesture: []
    };
  }

  function applyRecipe(recipe) {
    const safe = recipe || legacyRecipeFromRecord({});
    const family = glyphFamilies.find((item) => item.id === safe.family) ? safe.family : "sacred";
    const familySeeds = glyphFamilies.find((item) => item.id === family).seeds;
    state.family = family;
    state.seed = familySeeds.some((seed) => seed.id === safe.seed) ? safe.seed : familySeeds[0].id;
    state.ritualAction = ritualActions.some((action) => action.id === safe.ritualAction) ? safe.ritualAction : "seal";
    state.intention = safe.intention || "";
    state.tone = toneProfiles.some((tone) => tone.id === safe.tone) ? safe.tone : "calm";
    state.colors = Array.isArray(safe.colors) ? safe.colors.slice(0, 4) : currentTone().colors.slice();
    while (state.colors.length < 4) state.colors.push(currentTone().colors[state.colors.length]);
    state.mode = modeCopy[safe.mode] ? safe.mode : state.mode;
    document.body.dataset.mode = state.mode;
    state.trueGlyph = Boolean(safe.trueGlyph);
    document.body.dataset.view = state.trueGlyph ? "true" : "living";
    state.sealedAt = safe.sealedAt || null;
    state.builder = {
      symmetry: clampNumber(safe.builder && safe.builder.symmetry, 3, 12, 6),
      density: clampNumber(safe.builder && safe.builder.density, 1, 9, 6),
      orbits: clampNumber(safe.builder && safe.builder.orbits, 1, 5, 2),
      depth: clampNumber(safe.builder && safe.builder.depth, 0, 6, 1),
      aura: clampNumber(safe.builder && safe.builder.aura, 1, 9, 5),
      breath: clampNumber(safe.builder && safe.builder.breath, 1, 9, 4),
      variant: clampNumber(safe.builder && safe.builder.variant, 0, 11, 0)
    };
    state.gesture = Array.isArray(safe.gesture) ? safe.gesture.slice(-120) : [];
  }

  function rebuildGlyph(message) {
    geometry = buildGlyphModel(state);
    if (state.renderer && state.renderer.setModel) state.renderer.setModel(geometry);
    state.activePulse = performance.now();
    updateUI();
    if (message) showToast(message);
  }

  function recordGesturePoint(event) {
    if (!["play", "glyph", "ritual"].includes(state.mode)) return;
    const rect = refs.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
    const last = state.gesture[state.gesture.length - 1];
    if (last && Math.hypot(last.x - x, last.y - y) < 0.035) return;
    state.gesture.push({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    if (state.gesture.length > 120) state.gesture.shift();
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, Math.round(number)));
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    refs.toast.textContent = message;
    refs.toast.classList.add("visible");
    toastTimer = window.setTimeout(() => refs.toast.classList.remove("visible"), 1800);
  }

  function pulse(frequency, gainValue) {
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.015, now + 0.42);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.76);
    } catch {
      // Audio is optional. Some browsers block or omit it until a user gesture.
    }
  }

  function buildGlyphModel(recipeState) {
    const seed = recipeState.seed;
    if (seed === "metatron") return createMetatronGeometry();
    if (seed === "seed") return createSeedGeometry(recipeState);
    if (seed === "flower") return createFlowerGeometry(recipeState);
    if (seed === "vesica") return createVesicaGeometry(recipeState);
    if (seed === "spiral") return createSpiralGeometry(recipeState);
    if (seed === "torus") return createTorusGeometry(recipeState);
    if (seed === "mirror") return createMirrorGeometry(recipeState);
    if (seed === "gesture") return createGestureGeometry(recipeState);
    if (["fire", "earth", "air", "water", "ether"].includes(seed)) return createElementalGeometry(recipeState);
    if (["harmonic", "octave", "chord"].includes(seed)) return createToneGeometry(recipeState);
    if (["seal", "release", "protect", "open", "remember"].includes(seed)) return createRitualGeometry(recipeState);
    return createRadialGeometry(recipeState, { id: seed, label: seedLabel(seed), symmetry: recipeState.builder.symmetry });
  }

  function createMetatronGeometry() {
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    const innerRadius = 1;
    const outerRadius = 2;
    const circleRadius = 1;
    for (let i = 0; i < 6; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 3;
      nodes.push({
        id: "inner-" + i,
        ring: "inner",
        x: Math.cos(angle) * innerRadius,
        y: Math.sin(angle) * innerRadius,
        z: 0
      });
    }
    for (let i = 0; i < 6; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 3;
      nodes.push({
        id: "outer-" + i,
        ring: "outer",
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        z: 0
      });
    }

    const lines = [];
    for (let from = 0; from < nodes.length; from += 1) {
      for (let to = from + 1; to < nodes.length; to += 1) {
        const distance = Math.hypot(nodes[from].x - nodes[to].x, nodes[from].y - nodes[to].y);
        const weight = 0.25 + Math.max(0, 1 - distance / 4) * 0.75;
        lines.push({ from, to, weight, distance });
      }
    }
    const circles = nodes.map((node, nodeIndex) => ({ node: nodeIndex, radius: circleRadius, weight: node.ring === "center" ? 1 : 0.8, role: node.ring }));
    return normalizeModel({ id: "metatron", label: "Metatron", family: "sacred", nodes, lines, circles, circleRadius });
  }

  function createSeedGeometry(recipeState) {
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    for (let i = 0; i < 6; i += 1) nodes.push(radialNode("petal-" + i, 1, -Math.PI / 2 + i * Math.PI / 3, 0, "petal"));
    const lines = radialLines(nodes, 0).concat(ringLines(nodes, [1, 2, 3, 4, 5, 6], 0.72));
    if (recipeState.builder.density > 5) lines.push(...chordLines(nodes, [1, 2, 3, 4, 5, 6], 2, 0.42));
    const circles = nodes.map((node, nodeIndex) => ({ node: nodeIndex, radius: 1, weight: 0.86, role: "seed" }));
    return normalizeModel({ id: "seed", label: "Seed of Life", family: "sacred", nodes, lines, circles, circleRadius: 1 });
  }

  function createFlowerGeometry(recipeState) {
    const rings = Math.max(2, Math.min(4, recipeState.builder.orbits));
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    const seen = new Set(["0,0"]);
    for (let q = -rings; q <= rings; q += 1) {
      for (let r = -rings; r <= rings; r += 1) {
        const s = -q - r;
        const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
        if (distance === 0 || distance > rings) continue;
        const key = q + "," + r;
        if (seen.has(key)) continue;
        seen.add(key);
        nodes.push({
          id: "hex-" + q + "-" + r,
          ring: "flower-" + distance,
          x: q + r / 2,
          y: r * Math.sqrt(3) / 2,
          z: zFromDepth(recipeState, distance / rings)
        });
      }
    }
    const lines = distanceLines(nodes, 1.05, recipeState.builder.density, 0.7);
    if (recipeState.builder.density > 6) lines.push(...distanceLines(nodes, 1.78, recipeState.builder.density - 4, 0.36));
    const circles = nodes.map((node, nodeIndex) => ({ node: nodeIndex, radius: 1, weight: nodeIndex === 0 ? 1 : 0.72, role: "flower" }));
    return normalizeModel({ id: "flower", label: "Flower Field", family: "sacred", nodes, lines, circles, circleRadius: 1 });
  }

  function createVesicaGeometry(recipeState) {
    const spread = 0.72 + recipeState.builder.variant * 0.018;
    const h = Math.sqrt(Math.max(0.1, 1 - spread * spread));
    const nodes = [
      { id: "left", ring: "circle", x: -spread, y: 0, z: 0 },
      { id: "right", ring: "circle", x: spread, y: 0, z: 0 },
      { id: "upper", ring: "lens", x: 0, y: h, z: 0 },
      { id: "lower", ring: "lens", x: 0, y: -h, z: 0 },
      { id: "center", ring: "center", x: 0, y: 0, z: zFromDepth(recipeState, 0.25) }
    ];
    const lines = [
      { from: 0, to: 1, weight: 0.82 },
      { from: 2, to: 3, weight: 0.82 },
      { from: 0, to: 2, weight: 0.6 },
      { from: 0, to: 3, weight: 0.6 },
      { from: 1, to: 2, weight: 0.6 },
      { from: 1, to: 3, weight: 0.6 },
      { from: 4, to: 2, weight: 0.48 },
      { from: 4, to: 3, weight: 0.48 }
    ];
    const circles = [
      { node: 0, radius: 1, weight: 1, role: "vesica" },
      { node: 1, radius: 1, weight: 1, role: "vesica" },
      { node: 4, radius: 0.5, weight: 0.45, role: "center" }
    ];
    return normalizeModel({ id: "vesica", label: "Vesica", family: "sacred", nodes, lines, circles, circleRadius: 1 });
  }

  function createElementalGeometry(recipeState) {
    const configs = {
      fire: { label: "Fire Tetra", symmetry: 3, orbits: 2, star: 2, phase: -Math.PI / 2 },
      earth: { label: "Earth Cube", symmetry: 4, orbits: 2, star: 1, phase: Math.PI / 4 },
      air: { label: "Air Octa", symmetry: 4, orbits: 3, star: 2, phase: -Math.PI / 2 },
      water: { label: "Water Icosa", symmetry: 5, orbits: 3, star: 2, phase: -Math.PI / 2 },
      ether: { label: "Ether Dodeca", symmetry: 5, orbits: 2, star: 2, phase: Math.PI / 10 }
    };
    return createRadialGeometry(recipeState, { id: recipeState.seed, ...configs[recipeState.seed] });
  }

  function createToneGeometry(recipeState) {
    const tone = currentTone();
    const toneSymmetry = recipeState.seed === "octave" ? 8 : recipeState.seed === "chord" ? 3 : Math.max(5, Math.min(12, Math.round(tone.freq / 38)));
    return createRadialGeometry(recipeState, {
      id: recipeState.seed,
      label: seedLabel(recipeState.seed),
      symmetry: toneSymmetry,
      orbits: recipeState.seed === "chord" ? 3 : recipeState.builder.orbits,
      star: recipeState.seed === "chord" ? 1 : 2,
      phase: -Math.PI / 2
    });
  }

  function createRitualGeometry(recipeState) {
    const configs = {
      seal: { label: "Seal", symmetry: 6, orbits: 2, star: 2, phase: -Math.PI / 2 },
      release: { label: "Release", symmetry: 8, orbits: 3, star: 3, phase: Math.PI / 8 },
      protect: { label: "Protect", symmetry: 4, orbits: 3, star: 2, phase: Math.PI / 4 },
      open: { label: "Open", symmetry: 12, orbits: 2, star: 5, phase: -Math.PI / 2 },
      remember: { label: "Remember", symmetry: 7, orbits: 3, star: 2, phase: -Math.PI / 2 }
    };
    return createRadialGeometry(recipeState, { id: recipeState.seed, ...configs[recipeState.seed] });
  }

  function createRadialGeometry(recipeState, config) {
    const symmetry = config.symmetry || recipeState.builder.symmetry;
    const orbits = config.orbits || recipeState.builder.orbits;
    const phase = config.phase || 0;
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    const orbitGroups = [];
    for (let ring = 1; ring <= orbits; ring += 1) {
      const group = [];
      const radius = ring * 0.82;
      for (let i = 0; i < symmetry; i += 1) {
        const index = nodes.length;
        const angle = phase + (i / symmetry) * Math.PI * 2 + recipeState.builder.variant * 0.018 * ring;
        group.push(index);
        nodes.push(radialNode("r" + ring + "-" + i, radius, angle, zFromDepth(recipeState, ring / orbits), "orbit-" + ring));
      }
      orbitGroups.push(group);
    }
    let lines = radialLines(nodes, 0);
    orbitGroups.forEach((group, ringIndex) => {
      lines = lines.concat(ringLines(nodes, group, 0.64 + ringIndex * 0.08));
      if (recipeState.builder.density > 4) lines = lines.concat(chordLines(nodes, group, config.star || 2, 0.42));
    });
    for (let i = 1; i < orbitGroups.length; i += 1) {
      const inner = orbitGroups[i - 1];
      const outer = orbitGroups[i];
      outer.forEach((outerIndex, index) => lines.push({ from: outerIndex, to: inner[index % inner.length], weight: 0.38 }));
    }
    const circles = [{ node: 0, radius: 0.42, weight: 0.55, role: "center" }];
    orbitGroups.flat().forEach((nodeIndex) => {
      circles.push({ node: nodeIndex, radius: 0.38 + recipeState.builder.aura * 0.045, weight: 0.4, role: "orbit" });
    });
    circles.push({ node: 0, radius: orbits * 0.82, weight: 0.42, role: "boundary" });
    return normalizeModel({ id: config.id, label: config.label || seedLabel(config.id), family: recipeState.family, nodes, lines, circles, circleRadius: 0.64 });
  }

  function createSpiralGeometry(recipeState) {
    const turns = 2 + recipeState.builder.orbits * 0.65;
    const count = 18 + recipeState.builder.density * 4;
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const radius = 0.18 + t * (2.2 + recipeState.builder.orbits * 0.18);
      const angle = -Math.PI / 2 + turns * Math.PI * 2 * t + recipeState.builder.variant * 0.11;
      nodes.push(radialNode("spiral-" + i, radius, angle, zFromDepth(recipeState, t), "spiral"));
    }
    const lines = [];
    for (let i = 1; i < nodes.length - 1; i += 1) lines.push({ from: i, to: i + 1, weight: 0.68 });
    for (let i = 4; i < nodes.length; i += Math.max(3, 10 - recipeState.builder.density)) lines.push({ from: 0, to: i, weight: 0.28 });
    const circles = [{ node: 0, radius: 0.54, weight: 0.5, role: "center" }];
    for (let i = 6; i < nodes.length; i += 7) circles.push({ node: i, radius: 0.26, weight: 0.34, role: "spiral" });
    return normalizeModel({ id: "spiral", label: "Spiral Field", family: "motion", nodes, lines, circles, circleRadius: 0.5 });
  }

  function createTorusGeometry(recipeState) {
    const symmetry = Math.max(6, recipeState.builder.symmetry);
    const rings = Math.max(2, recipeState.builder.orbits);
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    const groups = [];
    for (let ring = 0; ring < rings; ring += 1) {
      const group = [];
      const major = 1 + ring * 0.38;
      const z = (ring - (rings - 1) / 2) * (recipeState.builder.depth * 0.12);
      for (let i = 0; i < symmetry; i += 1) {
        const index = nodes.length;
        group.push(index);
        const angle = (i / symmetry) * Math.PI * 2 + ring * 0.22 + recipeState.builder.variant * 0.035;
        nodes.push(radialNode("torus-" + ring + "-" + i, major, angle, z, "torus-" + ring));
      }
      groups.push(group);
    }
    let lines = [];
    groups.forEach((group) => { lines = lines.concat(ringLines(nodes, group, 0.68)); });
    for (let g = 1; g < groups.length; g += 1) {
      groups[g].forEach((nodeIndex, index) => lines.push({ from: nodeIndex, to: groups[g - 1][index], weight: 0.4 }));
    }
    lines = lines.concat(radialLines(nodes, 0).filter((_, index) => index % Math.max(1, 5 - Math.floor(recipeState.builder.density / 2)) === 0));
    const circles = groups.flat().filter((_, index) => index % 2 === 0).map((nodeIndex) => ({ node: nodeIndex, radius: 0.28, weight: 0.34, role: "torus" }));
    circles.push({ node: 0, radius: 1.92, weight: 0.42, role: "torus-boundary" });
    return normalizeModel({ id: "torus", label: "Torus Field", family: "motion", nodes, lines, circles, circleRadius: 0.42 });
  }

  function createMirrorGeometry(recipeState) {
    const model = createRadialGeometry(recipeState, { id: "mirror", label: "Mirror", symmetry: recipeState.builder.symmetry, orbits: recipeState.builder.orbits, star: 2, phase: Math.PI / recipeState.builder.symmetry });
    const reflected = model.nodes.slice(1).map((node, index) => ({ ...node, id: "mirror-" + index, x: -node.x, z: -node.z * 0.5 }));
    const baseLength = model.nodes.length;
    model.nodes = model.nodes.concat(reflected);
    reflected.forEach((_, index) => model.lines.push({ from: index + 1, to: baseLength + index, weight: 0.24 }));
    model.circles = model.circles.concat(reflected.slice(0, Math.min(12, reflected.length)).map((_, index) => ({ node: baseLength + index, radius: 0.34, weight: 0.28, role: "reflection" })));
    return normalizeModel(model);
  }

  function createGestureGeometry(recipeState) {
    if (!recipeState.gesture.length) return createSpiralGeometry(recipeState);
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    recipeState.gesture.slice(-90).forEach((point, index) => {
      nodes.push({
        id: "trace-" + index,
        ring: "gesture",
        x: point.x * 2.4,
        y: point.y * 2.4,
        z: zFromDepth(recipeState, index / Math.max(1, recipeState.gesture.length - 1))
      });
    });
    const lines = [];
    for (let i = 1; i < nodes.length - 1; i += 1) lines.push({ from: i, to: i + 1, weight: 0.55 });
    for (let i = 1; i < nodes.length; i += Math.max(3, 12 - recipeState.builder.density)) lines.push({ from: 0, to: i, weight: 0.26 });
    const circles = [{ node: 0, radius: 0.46, weight: 0.42, role: "center" }];
    return normalizeModel({ id: "gesture", label: "Gesture Trace", family: "motion", nodes, lines, circles, circleRadius: 0.4 });
  }

  function radialNode(id, radius, angle, z, ring) {
    return { id, ring, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z };
  }

  function radialLines(nodes, centerIndex) {
    return nodes.map((_, index) => index).filter((index) => index !== centerIndex).map((index) => ({ from: centerIndex, to: index, weight: 0.32 }));
  }

  function ringLines(nodes, group, weight) {
    return group.map((nodeIndex, index) => ({ from: nodeIndex, to: group[(index + 1) % group.length], weight }));
  }

  function chordLines(nodes, group, step, weight) {
    return group.map((nodeIndex, index) => ({ from: nodeIndex, to: group[(index + step) % group.length], weight }));
  }

  function distanceLines(nodes, maxDistance, density, weight) {
    const lines = [];
    const keepEvery = Math.max(1, 10 - density);
    for (let from = 0; from < nodes.length; from += 1) {
      for (let to = from + 1; to < nodes.length; to += 1) {
        const distance = distanceBetween(nodes[from], nodes[to]);
        if (distance <= maxDistance + 0.001 && (from + to) % keepEvery === 0) {
          lines.push({ from, to, weight: weight + Math.max(0, 1 - distance / maxDistance) * 0.25, distance });
        }
      }
    }
    return lines;
  }

  function zFromDepth(recipeState, unit) {
    return recipeState.trueGlyph ? 0 : (recipeState.builder.depth || 0) * 0.08 * Math.sin(unit * Math.PI * 2 + recipeState.builder.variant * 0.3);
  }

  function distanceBetween(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
  }

  function normalizeModel(model) {
    model.nodes = model.nodes.map((node, index) => ({
      id: node.id || "node-" + index,
      ring: node.ring || "field",
      x: node.x || 0,
      y: node.y || 0,
      z: node.z || 0,
      radius: node.radius || 1
    }));
    model.lines = dedupeLines((model.lines || []).map((line) => {
      const distance = line.distance || distanceBetween(model.nodes[line.from], model.nodes[line.to]);
      return { from: line.from, to: line.to, weight: line.weight || 0.4, distance, role: line.role || "line" };
    }).filter((line) => model.nodes[line.from] && model.nodes[line.to] && line.from !== line.to));
    model.circles = (model.circles && model.circles.length ? model.circles : [{ node: 0, radius: model.circleRadius || 1, weight: 0.4, role: "center" }])
      .filter((circle) => model.nodes[circle.node])
      .map((circle) => ({ node: circle.node, radius: circle.radius || model.circleRadius || 1, weight: circle.weight || 0.4, role: circle.role || "circle" }));
    model.circleRadius = model.circleRadius || 1;
    return model;
  }

  function dedupeLines(lines) {
    const seen = new Set();
    return lines.filter((line) => {
      const from = Math.min(line.from, line.to);
      const to = Math.max(line.from, line.to);
      const key = from + ":" + to;
      if (seen.has(key)) return false;
      seen.add(key);
      line.from = from;
      line.to = to;
      return true;
    });
  }

  class ThreeGlyphRenderer {
    constructor(canvas, three, model, appState) {
      this.canvas = canvas;
      this.THREE = three;
      this.model = model;
      this.state = appState;
      this.nodeMeshes = [];
      this.lineMeshes = [];
      this.ringMeshes = [];
      this.drag = { active: false, x: 0, y: 0, moved: false };
      this.rotation = { x: 0, y: 0, z: 0 };
      this.raycaster = null;
      this.pointer = null;
    }

    async init() {
      const THREE = this.THREE;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      this.scene = new THREE.Scene();
      this.perspectiveCamera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      this.perspectiveCamera.position.set(0, 0, 10.4);
      this.orthographicCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100);
      this.orthographicCamera.position.set(0, 0, 10.4);
      this.camera = this.perspectiveCamera;

      this.group = new THREE.Group();
      this.scene.add(this.group);
      this.scene.add(new THREE.AmbientLight(0xffffff, 1.05));
      const keyLight = new THREE.PointLight(0xf6d27a, 2.4, 18);
      keyLight.position.set(2.4, -3.2, 4);
      this.scene.add(keyLight);
      const coolLight = new THREE.PointLight(0x66e2cf, 1.6, 14);
      coolLight.position.set(-3.2, 2.8, 3);
      this.scene.add(coolLight);

      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      this.buildObjects();
      this.bindPointer();
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.animate();
    }

    buildObjects() {
      const THREE = this.THREE;
      const colors = this.state.colors;
      const nodeGeometry = new THREE.SphereGeometry(0.075, 28, 18);
      const centerGeometry = new THREE.SphereGeometry(0.12, 36, 24);

      this.model.lines.forEach((line, index) => {
        const from = this.model.nodes[line.from];
        const to = this.model.nodes[line.to];
        const material = new THREE.MeshStandardMaterial({
          color: colors[1],
          emissive: colors[1],
          emissiveIntensity: 0.48,
          transparent: true,
          opacity: 0.12 + line.weight * 0.2,
          roughness: 0.42,
          metalness: 0.2
        });
        const mesh = makeCylinderBetween(THREE, point(from), point(to), 0.004 + line.weight * 0.004, material);
        mesh.userData = { line, index, baseOpacity: material.opacity };
        this.lineMeshes.push(mesh);
        this.group.add(mesh);
      });

      this.model.nodes.forEach((node, index) => {
        const isCenter = index === 0 || node.ring === "center";
        const material = new THREE.MeshStandardMaterial({
          color: isCenter ? colors[0] : index % 3 === 0 ? colors[2] : colors[1],
          emissive: isCenter ? colors[0] : index % 3 === 0 ? colors[2] : colors[1],
          emissiveIntensity: isCenter ? 1.3 : 0.9,
          roughness: 0.26,
          metalness: 0.38
        });
        const mesh = new THREE.Mesh(isCenter ? centerGeometry : nodeGeometry, material);
        mesh.position.copy(point(node));
        mesh.scale.setScalar(Math.max(0.7, Math.min(1.6, node.radius || 1)));
        mesh.userData = { node, index, baseScale: mesh.scale.x };
        this.nodeMeshes.push(mesh);
        this.group.add(mesh);
      });

      this.model.circles.forEach((circle, index) => {
        const node = this.model.nodes[circle.node];
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: circle.role === "center" ? colors[0] : colors[1],
          emissive: circle.role === "center" ? colors[0] : colors[1],
          emissiveIntensity: 0.48 + (circle.weight || 0.4) * 0.22,
          transparent: true,
          opacity: 0.12 + (circle.weight || 0.4) * 0.2,
          roughness: 0.5
        });
        const ringGeometry = new THREE.TorusGeometry(circle.radius, 0.008, 12, 180);
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(point(node));
        ring.userData = { circle, index };
        this.ringMeshes.push(ring);
        this.group.add(ring);
      });

      function point(node) {
        return new THREE.Vector3(node.x, node.y, node.z);
      }
    }

    setModel(model) {
      this.model = model;
      this.nodeMeshes = [];
      this.lineMeshes = [];
      this.ringMeshes = [];
      while (this.group.children.length) {
        const child = this.group.children.pop();
        disposeObject(child);
      }
      this.buildObjects();
      this.resetFrontFace();

      function disposeObject(object) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      }
    }

    bindPointer() {
      this.canvas.addEventListener("pointerdown", (event) => {
        this.drag = { active: true, x: event.clientX, y: event.clientY, moved: false };
        this.canvas.setPointerCapture(event.pointerId);
      });

      this.canvas.addEventListener("pointermove", (event) => {
        if (!this.drag.active) return;
        const dx = event.clientX - this.drag.x;
        const dy = event.clientY - this.drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
        recordGesturePoint(event);
        if (this.state.trueGlyph) {
          this.drag.x = event.clientX;
          this.drag.y = event.clientY;
          return;
        }
        this.rotation.y += dx * 0.006;
        this.rotation.x += dy * 0.004;
        this.rotation.x = Math.max(0.15, Math.min(1.05, this.rotation.x));
        this.drag.x = event.clientX;
        this.drag.y = event.clientY;
      });

      this.canvas.addEventListener("pointerup", (event) => {
        const wasTap = !this.drag.moved;
        this.drag.active = false;
        if (!wasTap && this.state.seed === "gesture") rebuildGlyph("Trace shaped");
        if (wasTap) this.pick(event);
      });
    }

    pick(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.activeCamera());
      const hits = this.raycaster.intersectObjects(this.nodeMeshes, false);
      if (hits[0]) {
        this.state.activeNode = hits[0].object.userData.index;
        this.state.activePulse = performance.now();
        const tone = currentTone();
        pulse(tone.freq * (1 + this.state.activeNode / 24), 0.12);
        if (this.state.mode === "play") showToast("Node " + (this.state.activeNode + 1));
      } else if (this.state.mode === "play") {
        this.state.activePulse = performance.now();
        pulse(currentTone().freq, 0.07);
      }
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      this.renderer.setSize(width, height, false);
      this.perspectiveCamera.aspect = width / height;
      this.perspectiveCamera.updateProjectionMatrix();

      const aspect = width / height;
      const viewHeight = 6.55;
      const viewWidth = viewHeight * aspect;
      this.orthographicCamera.left = -viewWidth / 2;
      this.orthographicCamera.right = viewWidth / 2;
      this.orthographicCamera.top = viewHeight / 2;
      this.orthographicCamera.bottom = -viewHeight / 2;
      this.orthographicCamera.updateProjectionMatrix();
    }

    updateTheme() {
      const colors = this.state.colors;
      this.nodeMeshes.forEach((mesh, index) => {
        const color = index === 0 || mesh.userData.node.ring === "center" ? colors[0] : index % 3 === 0 ? colors[2] : colors[1];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
      this.lineMeshes.forEach((mesh) => {
        mesh.material.color.set(colors[1]);
        mesh.material.emissive.set(colors[1]);
      });
      this.ringMeshes.forEach((mesh, index) => {
        const color = mesh.userData.circle && mesh.userData.circle.role === "center" ? colors[0] : colors[1];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
    }

    resetFrontFace() {
      this.rotation.x = 0;
      this.rotation.y = 0;
      this.rotation.z = 0;
      this.drag.active = false;
    }

    activeCamera() {
      return this.state.trueGlyph ? this.orthographicCamera : this.perspectiveCamera;
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      const now = performance.now();
      const seconds = now / 1000;
      const mode = this.state.mode;
      const reduced = this.state.reducedMotion;
      const trueGlyph = this.state.trueGlyph;
      const breath = reduced || trueGlyph ? 1 : 1 + Math.sin(seconds * (mode === "breath" ? 1.35 : 0.45)) * (mode === "breath" ? 0.08 : 0.018);
      const sealPulse = this.state.sealedAt ? Math.max(0, 1 - (Date.now() - this.state.sealedAt) / 5200) : 0;
      const tapPulse = Math.max(0, 1 - (now - this.state.activePulse) / 1300);

      if (!this.drag.active && !reduced && !trueGlyph) {
        this.rotation.z += mode === "kasina" ? 0.00018 : 0.00042;
      }

      this.group.rotation.set(trueGlyph ? 0 : this.rotation.x, trueGlyph ? 0 : this.rotation.y, trueGlyph ? 0 : this.rotation.z);
      this.group.scale.setScalar(trueGlyph ? 1 : breath + sealPulse * 0.035);

      this.lineMeshes.forEach((mesh, index) => {
        const wave = reduced ? 0.25 : (Math.sin(seconds * 2.2 + index * 0.33) + 1) / 2;
        mesh.material.opacity = mesh.userData.baseOpacity + wave * 0.13 + tapPulse * 0.16;
        mesh.material.emissiveIntensity = 0.36 + wave * 0.5 + tapPulse * 0.7 + sealPulse * 0.4;
      });

      this.nodeMeshes.forEach((mesh, index) => {
        const active = this.state.activeNode === index ? tapPulse : 0;
        mesh.material.emissiveIntensity = (index === 0 ? 1.2 : 0.72) + active * 1.8 + sealPulse * 0.6;
        const baseScale = mesh.userData.baseScale || 1;
        const size = baseScale * (index === 0 ? 1 : 1 + active * 0.45 + sealPulse * 0.08);
        mesh.scale.setScalar(size);
      });

      this.ringMeshes.forEach((mesh, index) => {
        const phase = reduced || trueGlyph ? 0 : Math.sin(seconds * 0.85 + index * 0.4) * 0.035;
        const modeLift = mode === "glyph" && !trueGlyph ? 0.035 : 0;
        mesh.scale.setScalar(trueGlyph ? 1 : 1 + phase + modeLift + sealPulse * 0.045);
        const base = 0.1 + ((mesh.userData.circle && mesh.userData.circle.weight) || 0.4) * 0.18;
        mesh.material.opacity = base + tapPulse * 0.08 + sealPulse * 0.09;
      });

      this.camera = this.activeCamera();
      this.renderer.render(this.scene, this.camera);
    }
  }

  class CanvasGlyphRenderer {
    constructor(canvas, model, appState) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.model = model;
      this.state = appState;
      this.rotation = 0;
      this.drag = { active: false, x: 0 };
    }

    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.bindPointer();
      this.animate();
    }

    bindPointer() {
      this.canvas.addEventListener("pointerdown", (event) => {
        this.drag = { active: true, x: event.clientX };
        this.canvas.setPointerCapture(event.pointerId);
      });
      this.canvas.addEventListener("pointermove", (event) => {
        if (!this.drag.active) return;
        recordGesturePoint(event);
        if (this.state.trueGlyph) {
          this.drag.x = event.clientX;
          return;
        }
        this.rotation += (event.clientX - this.drag.x) * 0.008;
        this.drag.x = event.clientX;
      });
      this.canvas.addEventListener("pointerup", () => {
        this.drag.active = false;
        this.state.activePulse = performance.now();
        if (this.state.seed === "gesture") rebuildGlyph("Trace shaped");
        pulse(currentTone().freq, 0.08);
      });
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      this.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      if (!this.state.reducedMotion && !this.drag.active && !this.state.trueGlyph) this.rotation += 0.001;
      drawGlyph2D(this.ctx, this.width, this.height, {
        model: this.model,
        colors: this.state.colors,
        intention: "",
        rotation: this.state.trueGlyph ? 0 : this.rotation,
        mode: this.state.mode,
        trueGlyph: this.state.trueGlyph,
        pulse: Math.max(0, 1 - (performance.now() - this.state.activePulse) / 1400),
        wallpaper: false
      });
    }

    resetFrontFace() {
      this.rotation = 0;
      this.drag.active = false;
    }

    setModel(model) {
      this.model = model;
      this.resetFrontFace();
    }
  }

  function makeCylinderBetween(THREE, start, end, radius, material) {
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 10, 1, false);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(midpoint);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    return mesh;
  }

  function createGlyphBlob(format) {
    const canvas = document.createElement("canvas");
    const wallpaper = format === "wallpaper";
    canvas.width = wallpaper ? 1080 : 1200;
    canvas.height = wallpaper ? 1920 : 1200;
    const ctx = canvas.getContext("2d");
    drawGlyph2D(ctx, canvas.width, canvas.height, {
      model: geometry,
      colors: state.colors,
      intention: state.intention,
      rotation: state.trueGlyph ? 0 : -0.22,
      mode: state.mode,
      trueGlyph: state.trueGlyph,
      pulse: state.sealedAt ? 0.8 : 0.36,
      wallpaper
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function drawGlyph2D(ctx, width, height, options) {
    const colors = options.colors;
    const cx = width / 2;
    const cy = height * (options.wallpaper ? 0.44 : 0.48);
    const scale = Math.min(width, height) * (options.wallpaper ? 0.15 : 0.16);
    const circleRadius = scale * options.model.circleRadius;
    const timePulse = options.pulse || 0;
    const breath = options.trueGlyph ? 1 : 1 + (options.mode === "breath" ? 0.035 : 0.014) * Math.sin(Date.now() / 900);

    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, Math.max(width, height) * 0.72);
    bg.addColorStop(0, mix(colors[1], "#05070a", 0.78));
    bg.addColorStop(0.38, mix(colors[3], "#05070a", 0.86));
    bg.addColorStop(1, "#05070a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const projected = options.model.nodes.map((node) => {
      const angle = options.rotation || 0;
      const x = node.x * Math.cos(angle) - node.y * Math.sin(angle);
      const y = node.x * Math.sin(angle) + node.y * Math.cos(angle);
      return {
        x: cx + x * scale * breath,
        y: cy + y * scale * breath,
        radius: node.radius || 1,
        ring: node.ring
      };
    });

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    options.model.circles.forEach((circle) => {
      const node = projected[circle.node];
      const ringColor = circle.role === "center" ? colors[0] : colors[1];
      ctx.beginPath();
      ctx.arc(node.x, node.y, scale * circle.radius * breath, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.1, scale * 0.005 * (0.7 + (circle.weight || 0.4)));
      ctx.strokeStyle = alpha(ringColor, 0.12 + (circle.weight || 0.4) * 0.26);
      ctx.shadowColor = ringColor;
      ctx.shadowBlur = 12 + timePulse * 12;
      ctx.stroke();
    });

    options.model.lines.forEach((line, index) => {
      const from = projected[line.from];
      const to = projected[line.to];
      const linePulse = options.trueGlyph ? 0.35 : (Math.sin(Date.now() / 520 + index * 0.48) + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.lineWidth = Math.max(0.8, scale * 0.0045 * (0.75 + line.weight));
      ctx.strokeStyle = alpha(colors[1], 0.14 + line.weight * 0.15 + linePulse * 0.06 + timePulse * 0.12);
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 12 + timePulse * 18;
      ctx.stroke();
    });

    projected.forEach((node, index) => {
      const nodeColor = index === 0 || node.ring === "center" ? colors[0] : index % 3 === 0 ? colors[2] : colors[1];
      const radius = scale * (index === 0 ? 0.07 : 0.04) * node.radius * (1 + timePulse * 0.28);
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4.8);
      glow.addColorStop(0, alpha("#ffffff", 0.92));
      glow.addColorStop(0.22, alpha(nodeColor, 0.88));
      glow.addColorStop(1, alpha(nodeColor, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    if (options.intention) {
      ctx.fillStyle = alpha("#eef5ee", 0.86);
      ctx.font = "600 42px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      wrapText(ctx, options.intention, cx, height * 0.82, width * 0.72, 54);
      ctx.font = "500 24px Inter, system-ui, sans-serif";
      ctx.fillStyle = alpha(colors[0], 0.84);
      ctx.fillText("Tone Glyph", cx, height * 0.91);
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    const start = y - ((lines.length - 1) * lineHeight) / 2;
    lines.slice(0, 3).forEach((item, index) => ctx.fillText(item, x, start + index * lineHeight));
  }

  function alpha(color, amount) {
    const rgb = hexToRgb(color);
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + amount + ")";
  }

  function mix(colorA, colorB, amountB) {
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);
    const amountA = 1 - amountB;
    return rgbToHex({
      r: Math.round(a.r * amountA + b.r * amountB),
      g: Math.round(a.g * amountA + b.g * amountB),
      b: Math.round(a.b * amountA + b.b * amountB)
    });
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const value = parseInt(clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function rgbToHex(rgb) {
    return "#" + [rgb.r, rgb.g, rgb.b].map((value) => value.toString(16).padStart(2, "0")).join("");
  }
})();
