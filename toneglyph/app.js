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

  const toneFamilyPalette = {
    ink: "#0b0707",
    inkSoft: "#130d0c",
    parchment: "#f2eadf",
    gold: "#e8d7b2",
    amber: "#bd8d64",
    rose: "#b98574",
    teal: "#86bdb4",
    shadow: "#050303"
  };

  const shapeTypes = [
    { id: "living", label: "Living", faces: true, particles: true, rings: true, breath: 1.12 },
    { id: "solid", label: "Solid", faces: true, particles: false, rings: true, breath: 0.72 },
    { id: "wire", label: "Wire", faces: false, particles: false, rings: true, breath: 0.48 },
    { id: "particle", label: "Particles", faces: false, particles: true, rings: false, breath: 0.9 },
    { id: "flat", label: "Flat", faces: false, particles: false, rings: true, breath: 0.2 }
  ];

  const materialProfiles = [
    { id: "gold", label: "Gold", line: 1, face: 0.14, glow: 1.1, metalness: 0.62, roughness: 0.24, thickness: 1.2, particle: 1, palette: null },
    { id: "glass", label: "Glass", line: 0.82, face: 0.11, glow: 0.86, metalness: 0.12, roughness: 0.08, thickness: 0.9, particle: 0.8, palette: ["#f8f3dc", "#8ee8ff", "#d9e7ff", "#1f4f4a"] },
    { id: "crystal", label: "Crystal", line: 0.95, face: 0.16, glow: 1.3, metalness: 0.28, roughness: 0.12, thickness: 1, particle: 1.25, palette: ["#f8f3dc", "#80e7ff", "#ffc4ff", "#223a57"] },
    { id: "ink", label: "Ink", line: 0.72, face: 0.04, glow: 0.22, metalness: 0.02, roughness: 0.8, thickness: 0.82, particle: 0.35, palette: ["#f2f7ee", "#121619", "#8ea7ff", "#05070a"] },
    { id: "neon", label: "Neon", line: 1.18, face: 0.08, glow: 1.55, metalness: 0.2, roughness: 0.18, thickness: 1.35, particle: 1.5, palette: ["#f6d27a", "#66e2cf", "#f08a7e", "#14144a"] },
    { id: "stone", label: "Stone", line: 0.68, face: 0.18, glow: 0.42, metalness: 0.05, roughness: 0.84, thickness: 1.05, particle: 0.45, palette: ["#d8ffb6", "#aeb9a7", "#f6d27a", "#273024"] },
    { id: "pearl", label: "Pearl", line: 0.9, face: 0.18, glow: 0.98, metalness: 0.18, roughness: 0.18, thickness: 0.95, particle: 1.05, palette: ["#f8f3dc", "#ffd0cc", "#8ee8ff", "#30334f"] },
    { id: "fire", label: "Fire", line: 1.12, face: 0.12, glow: 1.45, metalness: 0.16, roughness: 0.3, thickness: 1.22, particle: 1.35, palette: ["#f6d27a", "#f08a7e", "#ffc24d", "#331411"] },
    { id: "water", label: "Water", line: 0.96, face: 0.13, glow: 1.05, metalness: 0.08, roughness: 0.12, thickness: 0.9, particle: 1.1, palette: ["#d9e7ff", "#66e2cf", "#8ea7ff", "#102d3a"] },
    { id: "shadow", label: "Shadow", line: 0.6, face: 0.09, glow: 0.3, metalness: 0.1, roughness: 0.56, thickness: 1.05, particle: 0.55, palette: ["#d9e7ff", "#5d6b83", "#8ea7ff", "#05070a"] }
  ];

  const motionPresets = [
    { id: "breathe", label: "Breathe", spin: 0.42, tilt: 0.18, pulse: 1, unfold: 0, spiral: 0 },
    { id: "still", label: "Still", spin: 0, tilt: 0, pulse: 0.18, unfold: 0, spiral: 0 },
    { id: "orbit", label: "Orbit", spin: 1.35, tilt: 0.32, pulse: 0.55, unfold: 0, spiral: 0 },
    { id: "pulse", label: "Pulse", spin: 0.3, tilt: 0.15, pulse: 1.45, unfold: 0, spiral: 0 },
    { id: "unfold", label: "Unfold", spin: 0.62, tilt: 0.24, pulse: 0.85, unfold: 1, spiral: 0 },
    { id: "spiral", label: "Spiral", spin: 0.82, tilt: 0.4, pulse: 0.9, unfold: 0.2, spiral: 1 },
    { id: "mirror", label: "Mirror", spin: 0.34, tilt: 0.6, pulse: 0.72, unfold: 0.15, spiral: -0.7 }
  ];

  const layerOptions = [
    { id: "aura", label: "Aura", defaultOn: true },
    { id: "faces", label: "Faces", defaultOn: true },
    { id: "particles", label: "Particles", defaultOn: true },
    { id: "toneField", label: "Tone Field", defaultOn: true },
    { id: "intention", label: "Intention", defaultOn: false }
  ];

  const premiumPacks = [
    { id: "core", label: "Core creator", summary: "Base glyph, tone, colour, depth, save and share." },
    { id: "crystal", label: "Crystal solids", summary: "Glass/crystal forms with bright faces and particle aura.", shapeType: "solid", material: "crystal", layers: { faces: true, particles: true } },
    { id: "temple", label: "Sacred architecture", summary: "Dense architectural wireforms for temple-like glyphs.", material: "stone", builder: { density: 8, orbits: 4 }, layers: { aura: true, faces: true } },
    { id: "soundscape", label: "Soundscape", summary: "Tone-reactive breath, pulse, and aura for listening rituals.", motionPreset: "pulse", shapeType: "living", layers: { particles: true, toneField: true } },
    { id: "wallpaper", label: "Wallpaper studio", summary: "High-aura animated wallpaper look with living particles.", shapeType: "living", material: "pearl", layers: { aura: true, particles: true, intention: false } },
    { id: "ritualCard", label: "Ritual cards", summary: "Intention-forward export layer for sharing a sealed glyph.", layers: { intention: true, aura: true }, motionPreset: "still" }
  ];

  const modeCopy = {
    kasina: "Gaze",
    breath: "Breathe",
    play: "Touch",
    ritual: "Intention",
    glyph: "Create"
  };

  const controlTabCopy = {
    form: "Form",
    matter: "Matter",
    tone: "Tone",
    motion: "Motion",
    ritual: "Ritual",
    layers: "Layers",
    save: "Save"
  };

  const actionCopy = {
    none: { label: "Tone Glyph", tab: "form" },
    tune: { label: "Tune", tab: "tone" },
    shape: { label: "Shape", tab: "form" },
    seal: { label: "Seal", tab: "ritual" },
    save: { label: "Save", tab: "save" }
  };

  const tabToAction = {
    form: "shape",
    matter: "tune",
    tone: "tune",
    motion: "shape",
    ritual: "seal",
    layers: "shape",
    save: "save"
  };

  const glyphFamilies = [
    {
      id: "sacred",
      label: "Sacred",
      seeds: [
        { id: "metatron", label: "Metatron" },
        { id: "seed", label: "Seed" },
        { id: "flower", label: "Flower" },
        { id: "vesica", label: "Vesica" },
        { id: "sri-yantra", label: "Sri Yantra" },
        { id: "fruit-life", label: "Fruit of Life" },
        { id: "egg-life", label: "Egg of Life" },
        { id: "tree-life", label: "Tree of Life" },
        { id: "golden-spiral", label: "Golden Spiral" },
        { id: "golden-grid", label: "Golden Grid" },
        { id: "vesica-chain", label: "Vesica Chain" },
        { id: "trinity-knot", label: "Trinity Knot" },
        { id: "labyrinth", label: "Labyrinth" },
        { id: "solar-cross", label: "Solar Cross" },
        { id: "lunar-gate", label: "Lunar Gate" },
        { id: "pentagram", label: "Pentagram" },
        { id: "hexagram", label: "Hexagram" },
        { id: "heptagram", label: "Heptagram" },
        { id: "octagram", label: "Octagram" },
        { id: "enneagram", label: "Enneagram" },
        { id: "mandala-rose", label: "Mandala Rose" },
        { id: "torus-seal", label: "Torus Seal" },
        { id: "infinity-knot", label: "Infinity Knot" },
        { id: "compass-rose", label: "Compass Rose" }
      ]
    },
    {
      id: "elemental",
      label: "3D Forms",
      seeds: [
        { id: "merkaba", label: "Merkaba" },
        { id: "pyramid", label: "Pyramid" },
        { id: "fire", label: "Tetrahedron" },
        { id: "earth", label: "Cube" },
        { id: "air", label: "Octahedron" },
        { id: "water", label: "Icosahedron" },
        { id: "ether", label: "Dodecahedron" }
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
    controlTab: "form",
    activeAction: "none",
    intention: "",
    tone: "calm",
    colors: toneProfiles[0].colors.slice(),
    sealedAt: null,
    sealSignature: null,
    activePulse: 0,
    activeNode: null,
    trueGlyph: false,
    moveGlyph: false,
    shapeType: "living",
    material: "gold",
    motionPreset: "breathe",
    zoom: 1,
    layers: Object.fromEntries(layerOptions.map((layer) => [layer.id, layer.defaultOn])),
    premiumPack: "core",
    pan: { x: 0, y: 0 },
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
    buildInstrumentControls();
    buildLayerControls();
    buildPremiumControls();
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
    refs.actionButtons = Array.from(document.querySelectorAll("[data-action-button]"));
    refs.controlDrawer = document.getElementById("control-drawer");
    refs.drawerTitle = document.getElementById("drawer-title");
    refs.drawerClose = document.getElementById("drawer-close-button");
    refs.stageHint = document.getElementById("stage-hint");
    refs.controlTabs = Array.from(document.querySelectorAll(".control-tab[data-control-tab]"));
    refs.intention = document.getElementById("intention-input");
    refs.toneOptions = document.getElementById("tone-options");
    refs.familyOptions = document.getElementById("family-options");
    refs.seedSelect = document.getElementById("seed-select");
    refs.seedSearch = document.getElementById("seed-search");
    refs.seedOptions = document.getElementById("seed-options");
    refs.seedLibraryCount = document.getElementById("seed-library-count");
    refs.actionSelect = document.getElementById("action-select");
    refs.paletteOptions = document.getElementById("palette-options");
    refs.shapeType = document.getElementById("shape-type-select");
    refs.material = document.getElementById("material-select");
    refs.motion = document.getElementById("motion-select");
    refs.zoom = document.getElementById("zoom-range");
    refs.zoomOutput = document.getElementById("zoom-output");
    refs.layerOptions = document.getElementById("layer-options");
    refs.premium = document.getElementById("premium-select");
    refs.premiumSummary = document.getElementById("premium-summary");
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
    refs.exportButtons = Array.from(document.querySelectorAll("[data-export-format]"));
    refs.form3d = document.getElementById("form3d-button");
    refs.trueView = document.getElementById("true-view-button");
    refs.move = document.getElementById("move-button");
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
    refs.actionButtons.forEach((button) => {
      button.addEventListener("click", () => setActiveAction(button.dataset.actionButton));
    });
    refs.drawerClose.addEventListener("click", () => setActiveAction("none"));
    refs.controlTabs.forEach((button) => {
      button.addEventListener("click", () => setControlTab(button.dataset.controlTab));
    });

    refs.intention.addEventListener("input", () => {
      state.intention = refs.intention.value.trim();
      state.sealedAt = null;
      state.sealSignature = null;
      updateUI();
    });

    refs.colorInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const index = Number(input.dataset.colorIndex);
        state.colors[index] = input.value;
        state.sealedAt = null;
        state.sealSignature = null;
        applyTheme();
        updateUI();
      });
    });

    refs.seal.addEventListener("click", sealRitual);
    refs.clear.addEventListener("click", clearRitual);
    refs.save.addEventListener("click", saveGlyph);
    refs.share.addEventListener("click", shareGlyph);
    refs.exportButtons.forEach((button) => {
      button.addEventListener("click", () => exportGlyph(button.dataset.exportFormat));
    });
    refs.form3d.addEventListener("click", activate3DForm);
    refs.trueView.addEventListener("click", () => setTrueGlyph(!state.trueGlyph));
    refs.move.addEventListener("click", () => setMoveGlyph(!state.moveGlyph));
    refs.front.addEventListener("click", resetFrontFace);
    refs.seedSelect.addEventListener("change", () => {
      selectSeed(refs.seedSelect.value);
    });
    refs.seedSearch.addEventListener("input", () => {
      filterSeedOptions(refs.seedSearch.value);
    });
    refs.actionSelect.addEventListener("change", () => {
      state.ritualAction = refs.actionSelect.value;
      applyActionDefaults();
      rebuildGlyph("Action: " + currentAction().label);
    });
    refs.shapeType.addEventListener("change", () => setShapeType(refs.shapeType.value));
    refs.material.addEventListener("change", () => setMaterial(refs.material.value));
    refs.motion.addEventListener("change", () => {
      state.motionPreset = refs.motion.value;
      state.activePulse = performance.now();
      updateUI();
      pulse(currentTone().freq * 1.12, 0.045);
      showToast("Motion: " + currentMotion().label);
    });
    refs.zoom.addEventListener("input", () => {
      state.zoom = Number(refs.zoom.value) / 100;
      updateUI();
    });
    refs.premium.addEventListener("change", () => applyPremiumPack(refs.premium.value));
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
    refs.seedOptions.innerHTML = "";
    const seeds = currentFamily().seeds;
    refs.seedLibraryCount.textContent = seeds.length + " seeds";
    refs.seedSearch.placeholder = state.family === "sacred" ? "Search sacred seeds" : "Search " + currentFamily().label.toLowerCase();
    refs.seedSearch.value = "";
    seeds.forEach((seed) => {
      const option = document.createElement("option");
      option.value = seed.id;
      option.textContent = seed.label;
      refs.seedSelect.append(option);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "seed-option";
      button.textContent = seed.label;
      button.dataset.seedOption = seed.id;
      button.addEventListener("click", () => selectSeed(seed.id));
      refs.seedOptions.append(button);
    });
    refs.seedSelect.value = state.seed;
    filterSeedOptions("");
  }

  function selectSeed(seedId) {
    if (!currentFamily().seeds.some((seed) => seed.id === seedId)) return;
    state.seed = seedId;
    refs.seedSelect.value = state.seed;
    state.sealedAt = null;
    state.sealSignature = null;
    filterSeedOptions(refs.seedSearch.value);
    rebuildGlyph("Seed: " + currentSeed().label);
  }

  function filterSeedOptions(query) {
    const value = (query || "").trim().toLowerCase();
    let visible = 0;
    Array.from(refs.seedOptions.children).forEach((button) => {
      const matches = !value || button.textContent.toLowerCase().includes(value);
      button.style.display = matches ? "" : "none";
      button.classList.toggle("active", button.dataset.seedOption === state.seed);
      if (matches) visible += 1;
    });
    refs.seedLibraryCount.textContent = visible + " of " + currentFamily().seeds.length;
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

  function buildInstrumentControls() {
    refs.shapeType.innerHTML = "";
    shapeTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.label;
      refs.shapeType.append(option);
    });
    refs.material.innerHTML = "";
    materialProfiles.forEach((material) => {
      const option = document.createElement("option");
      option.value = material.id;
      option.textContent = material.label;
      refs.material.append(option);
    });
    refs.motion.innerHTML = "";
    motionPresets.forEach((motion) => {
      const option = document.createElement("option");
      option.value = motion.id;
      option.textContent = motion.label;
      refs.motion.append(option);
    });
  }

  function buildLayerControls() {
    refs.layerOptions.innerHTML = "";
    layerOptions.forEach((layer) => {
      const label = document.createElement("label");
      label.className = "layer-toggle";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.layer = layer.id;
      input.checked = Boolean(state.layers[layer.id]);
      input.addEventListener("change", () => {
        state.layers[layer.id] = input.checked;
        rebuildGlyph(layer.label);
      });
      const text = document.createElement("span");
      text.textContent = layer.label;
      label.append(input, text);
      refs.layerOptions.append(label);
    });
  }

  function buildPremiumControls() {
    refs.premium.innerHTML = "";
    premiumPacks.forEach((pack) => {
      const option = document.createElement("option");
      option.value = pack.id;
      option.textContent = pack.label;
      refs.premium.append(option);
    });
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
        state.sealSignature = null;
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
        state.sealSignature = null;
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

  function setActiveAction(action) {
    if (!actionCopy[action]) return;
    state.activeAction = action;
    document.body.dataset.action = action;
    state.controlTab = actionCopy[action].tab;
    document.body.dataset.controlTab = state.controlTab;
    updateUI();
    if (action !== "none") showToast(actionCopy[action].label);
  }

  function setControlTab(tab) {
    if (!controlTabCopy[tab]) return;
    state.controlTab = tab;
    state.activeAction = tabToAction[tab] || state.activeAction || "shape";
    document.body.dataset.controlTab = tab;
    document.body.dataset.action = state.activeAction;
    updateUI();
    showToast(controlTabCopy[tab] + " controls");
  }

  function activate3DForm() {
    const elemental = glyphFamilies.find((family) => family.id === "elemental");
    state.mode = "glyph";
    document.body.dataset.mode = state.mode;
    state.family = "elemental";
    if (!elemental.seeds.some((seed) => seed.id === state.seed)) state.seed = "earth";
    state.shapeType = "solid";
    syncViewFromShapeType();
    state.moveGlyph = false;
    state.builder.depth = Math.max(3, state.builder.depth);
    state.builder.density = Math.max(5, state.builder.density);
    state.builder.orbits = Math.max(2, state.builder.orbits);
    buildSeedControls();
    rebuildGlyph("3D form");
    pulse(currentTone().freq * 1.22, 0.075);
  }

  function setTrueGlyph(enabled) {
    state.trueGlyph = Boolean(enabled);
    state.shapeType = state.trueGlyph ? "flat" : state.shapeType === "flat" ? "living" : state.shapeType;
    document.body.dataset.view = state.trueGlyph ? "true" : "living";
    rebuildGlyph();
    if (state.trueGlyph) resetRendererFront();
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq * (state.trueGlyph ? 1.25 : 1), 0.055);
    showToast(state.trueGlyph ? "True glyph" : "Living field");
  }

  function setShapeType(type) {
    if (!shapeTypes.some((item) => item.id === type)) return;
    state.shapeType = type;
    syncViewFromShapeType();
    state.moveGlyph = false;
    rebuildGlyph("Type: " + currentShapeType().label);
    pulse(currentTone().freq * 1.08, 0.05);
  }

  function syncViewFromShapeType() {
    state.trueGlyph = state.shapeType === "flat";
    document.body.dataset.view = state.trueGlyph ? "true" : "living";
  }

  function setMaterial(materialId) {
    const material = materialProfiles.find((item) => item.id === materialId);
    if (!material) return;
    state.material = material.id;
    if (material.palette) {
      state.colors = material.palette.slice();
      applyTheme();
    }
    rebuildGlyph("Material: " + material.label);
    pulse(currentTone().freq * 1.18, 0.055);
  }

  function setMoveGlyph(enabled) {
    state.moveGlyph = Boolean(enabled);
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq * (state.moveGlyph ? 1.08 : 1.18), 0.045);
    showToast(state.moveGlyph ? "Move glyph" : "Turn 3D");
  }

  function applyPremiumPack(packId) {
    const pack = premiumPacks.find((item) => item.id === packId) || premiumPacks[0];
    state.premiumPack = pack.id;
    if (pack.shapeType) state.shapeType = pack.shapeType;
    if (pack.material) state.material = pack.material;
    if (pack.motionPreset) state.motionPreset = pack.motionPreset;
    if (pack.builder) Object.keys(pack.builder).forEach((key) => { state.builder[key] = pack.builder[key]; });
    if (pack.layers) Object.keys(pack.layers).forEach((key) => { state.layers[key] = pack.layers[key]; });
    syncViewFromShapeType();
    if (currentMaterial().palette) {
      state.colors = currentMaterial().palette.slice();
      applyTheme();
    }
    rebuildGlyph(pack.label);
    pulse(currentTone().freq * 1.28, 0.07);
  }

  function resetFrontFace() {
    state.moveGlyph = false;
    resetRendererFront();
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq, 0.05);
    showToast("Front facing");
  }

  function resetRendererFront() {
    if (state.renderer && state.renderer.resetFrontFace) state.renderer.resetFrontFace();
  }

  function panGlyphBy(dx, dy, rect) {
    if (!rect || !rect.width || !rect.height) return;
    const scale = 6.55;
    state.pan.x = clampFloat(state.pan.x + dx / rect.width * scale, -2.9, 2.9);
    state.pan.y = clampFloat(state.pan.y + dy / rect.height * scale, -2.9, 2.9);
  }

  function sealRitual() {
    state.intention = refs.intention.value.trim();
    state.sealedAt = Date.now();
    state.sealSignature = createSealSignature();
    state.activePulse = performance.now();
    rebuildGlyph();
    updateUI();
    pulse(currentTone().freq * 2, 0.22);
    showToast(currentAction().label + " sealed");
  }

  function clearRitual() {
    state.intention = "";
    state.sealedAt = null;
    state.sealSignature = null;
    refs.intention.value = "";
    updateUI();
    showToast("Field cleared");
  }

  function saveGlyph() {
    const record = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      schemaVersion: 4,
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
    const blob = await createGlyphBlob("card");
    const file = new File([blob], "tone-glyph-ritual-card.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Tone Glyph",
        text: state.intention || "Tone Glyph",
        files: [file]
      });
      return;
    }
    downloadBlob(blob, "tone-glyph-ritual-card.png");
    showToast("Ritual card downloaded");
  }

  async function exportGlyph(format) {
    if (format === "recipe") {
      downloadRecipe();
      return;
    }
    const blob = await createGlyphBlob(format);
    const filenames = {
      card: "tone-glyph-ritual-card.png",
      wallpaper: "tone-glyph-wallpaper.png",
      square: "tone-glyph-square.png",
      transparent: "tone-glyph-transparent.png"
    };
    downloadBlob(blob, filenames[format] || "tone-glyph.png");
    showToast((format === "card" ? "Ritual card" : format.charAt(0).toUpperCase() + format.slice(1)) + " downloaded");
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
    refs.controlTabs.forEach((button) => {
      const isActive = button.dataset.controlTab === state.controlTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    refs.actionButtons.forEach((button) => {
      const isActive = button.dataset.actionButton === state.activeAction;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
    const drawerOpen = state.activeAction !== "none";
    refs.controlDrawer.hidden = !drawerOpen;
    refs.drawerTitle.textContent = drawerOpen ? actionCopy[state.activeAction].label : "Tone Glyph";

    const is3DForm = state.family === "elemental" && !state.trueGlyph;
    refs.form3d.classList.toggle("active", is3DForm);
    refs.form3d.setAttribute("aria-pressed", is3DForm ? "true" : "false");
    refs.trueView.classList.toggle("active", state.trueGlyph);
    refs.trueView.setAttribute("aria-pressed", state.trueGlyph ? "true" : "false");
    refs.move.classList.toggle("active", state.moveGlyph);
    refs.move.setAttribute("aria-pressed", state.moveGlyph ? "true" : "false");

    Array.from(refs.familyOptions.children).forEach((button) => {
      button.classList.toggle("active", button.dataset.family === state.family);
    });

    refs.seedSelect.value = state.seed;
    filterSeedOptions(refs.seedSearch.value);
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
    refs.shapeType.value = state.shapeType;
    refs.material.value = state.material;
    refs.motion.value = state.motionPreset;
    refs.zoom.value = Math.round(state.zoom * 100);
    refs.zoomOutput.textContent = state.zoom.toFixed(2);
    refs.premium.value = state.premiumPack;
    refs.premiumSummary.textContent = currentPremiumPack().summary;
    Array.from(refs.layerOptions.querySelectorAll("input[data-layer]")).forEach((input) => {
      input.checked = Boolean(state.layers[input.dataset.layer]);
    });

    const label = modeCopy[state.mode] || "Field";
    refs.status.textContent = state.moveGlyph ? "Move glyph" : state.trueGlyph ? "True glyph" : currentSeed().label + " " + label;
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

  function currentShapeType() {
    return shapeTypes.find((item) => item.id === state.shapeType) || shapeTypes[0];
  }

  function currentMaterial() {
    return materialProfiles.find((item) => item.id === state.material) || materialProfiles[0];
  }

  function currentMotion() {
    return motionPresets.find((item) => item.id === state.motionPreset) || motionPresets[0];
  }

  function currentPremiumPack() {
    return premiumPacks.find((item) => item.id === state.premiumPack) || premiumPacks[0];
  }

  function layerEnabled(id) {
    return Boolean(state.layers[id]);
  }

  function renderSettings() {
    const type = currentShapeType();
    const material = currentMaterial();
    return {
      type,
      material,
      showFaces: !state.trueGlyph && type.faces && layerEnabled("faces"),
      showParticles: !state.trueGlyph && type.particles && layerEnabled("particles"),
      showRings: type.rings && layerEnabled("aura"),
      showToneField: layerEnabled("toneField"),
      faceOpacity: material.face,
      lineOpacity: material.line,
      glow: material.glow,
      thickness: material.thickness,
      particle: material.particle
    };
  }

  function averageLineDepth(model, line) {
    const from = model.nodes[line.from] || { z: 0 };
    const to = model.nodes[line.to] || { z: 0 };
    return ((from.z || 0) + (to.z || 0)) / 2;
  }

  function glyphLineStyle(model, line, index, settings) {
    const depth = averageLineDepth(model, line);
    const isPrimary = line.weight >= 0.58 || line.role === "edge";
    const isBack = depth < -0.12;
    const color = isPrimary ? toneFamilyPalette.gold : isBack ? toneFamilyPalette.teal : toneFamilyPalette.parchment;
    const opacityBase = isBack ? 0.08 : isPrimary ? 0.22 : 0.14;
    return {
      color,
      emissive: isPrimary ? toneFamilyPalette.gold : toneFamilyPalette.teal,
      opacity: (opacityBase + line.weight * 0.18) * settings.lineOpacity,
      radius: (0.004 + line.weight * (isPrimary ? 0.006 : 0.004)) * settings.thickness,
      travelPhase: index * 0.33 + Math.abs(depth) * 1.7
    };
  }

  function glyphNodeStyle(node, index) {
    const isCenter = index === 0 || node.ring === "center";
    return {
      color: isCenter ? toneFamilyPalette.gold : index % 3 === 0 ? toneFamilyPalette.rose : toneFamilyPalette.teal,
      scale: isCenter ? 1.22 : Math.max(0.7, Math.min(1.55, node.radius || 1))
    };
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
          schemaVersion: 3,
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
      elemental: { symmetry: 4, density: 5, orbits: 2, depth: 4, aura: 5, breath: 4 },
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

  function createSealSignature() {
    const text = (state.intention || currentAction().label || "Tone Glyph").trim();
    const charTotal = text.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
    const ringCount = 1 + (charTotal % 3);
    const notchCount = 6 + (charTotal % 7);
    return {
      ringCount,
      notchCount,
      seed: charTotal % 360,
      sealedLabel: currentAction().label,
      createdAt: new Date().toISOString()
    };
  }

  function createRecipeSnapshot() {
    return {
      schemaVersion: 4,
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
      shapeType: state.shapeType,
      material: state.material,
      motionPreset: state.motionPreset,
      zoom: state.zoom,
      layers: { ...state.layers },
      premiumPack: state.premiumPack,
      sealedAt: state.sealedAt,
      sealSignature: state.sealSignature ? { ...state.sealSignature } : null,
      builder: { ...state.builder },
      gesture: state.gesture.slice(-120)
    };
  }

  function legacyRecipeFromRecord(record) {
    return {
      schemaVersion: 3,
      family: "sacred",
      seed: "metatron",
      ritualAction: "seal",
      intention: record.intention || "",
      tone: record.tone || "calm",
      colors: Array.isArray(record.colors) ? record.colors.slice(0, 4) : toneProfiles[0].colors.slice(),
      mode: record.mode || "ritual",
      trueGlyph: false,
      shapeType: "living",
      material: "gold",
      motionPreset: "breathe",
      zoom: 1,
      layers: Object.fromEntries(layerOptions.map((layer) => [layer.id, layer.defaultOn])),
      premiumPack: "core",
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
    state.shapeType = shapeTypes.some((item) => item.id === safe.shapeType) ? safe.shapeType : state.trueGlyph ? "flat" : "living";
    state.material = materialProfiles.some((item) => item.id === safe.material) ? safe.material : "gold";
    state.motionPreset = motionPresets.some((item) => item.id === safe.motionPreset) ? safe.motionPreset : "breathe";
    state.zoom = clampFloat(Number(safe.zoom) || 1, 0.7, 1.45);
    state.layers = Object.fromEntries(layerOptions.map((layer) => [layer.id, safe.layers && typeof safe.layers[layer.id] === "boolean" ? safe.layers[layer.id] : layer.defaultOn]));
    state.premiumPack = premiumPacks.some((item) => item.id === safe.premiumPack) ? safe.premiumPack : "core";
    syncViewFromShapeType();
    document.body.dataset.view = state.trueGlyph ? "true" : "living";
    state.moveGlyph = false;
    state.sealedAt = safe.sealedAt || null;
    state.sealSignature = safe.sealSignature && typeof safe.sealSignature === "object" ? { ...safe.sealSignature } : null;
    state.pan = { x: 0, y: 0 };
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

  function clampFloat(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
    if (recipeState.family === "sacred") return createSacredGeometry(recipeState);
    if (seed === "spiral") return createSpiralGeometry(recipeState);
    if (seed === "torus") return createTorusGeometry(recipeState);
    if (seed === "mirror") return createMirrorGeometry(recipeState);
    if (seed === "gesture") return createGestureGeometry(recipeState);
    if (["merkaba", "pyramid", "fire", "earth", "air", "water", "ether"].includes(seed)) return createElementalGeometry(recipeState);
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

  function createSacredGeometry(recipeState) {
    if (recipeState.seed === "sri-yantra") return createSriYantraGeometry(recipeState);
    if (recipeState.seed === "tree-life") return createTreeOfLifeGeometry(recipeState);
    if (recipeState.seed === "vesica-chain") return createVesicaChainGeometry(recipeState);
    if (recipeState.seed === "golden-spiral" || recipeState.seed === "labyrinth") {
      const model = createSpiralGeometry({ ...recipeState, seed: "spiral" });
      model.id = recipeState.seed;
      model.label = seedLabel(recipeState.seed);
      model.family = "sacred";
      if (recipeState.seed === "labyrinth") {
        model.circles.push({ node: 0, radius: 1.28, weight: 0.34, role: "labyrinth-wall" });
        model.circles.push({ node: 0, radius: 1.88, weight: 0.28, role: "labyrinth-wall" });
      }
      return model;
    }
    if (recipeState.seed === "torus-seal") {
      const model = createTorusGeometry({ ...recipeState, seed: "torus", builder: { ...recipeState.builder, orbits: Math.max(3, recipeState.builder.orbits) } });
      model.id = "torus-seal";
      model.label = "Torus Seal";
      model.family = "sacred";
      return model;
    }

    const configs = {
      "fruit-life": { symmetry: 6, orbits: 2, star: 2, circles: 13, phase: -Math.PI / 2 },
      "egg-life": { symmetry: 8, orbits: 1, star: 3, phase: Math.PI / 8 },
      "golden-grid": { symmetry: 4, orbits: 4, star: 2, phase: Math.PI / 4 },
      "trinity-knot": { symmetry: 3, orbits: 3, star: 1, phase: -Math.PI / 2 },
      "solar-cross": { symmetry: 4, orbits: 3, star: 2, phase: 0 },
      "lunar-gate": { symmetry: 8, orbits: 2, star: 3, phase: Math.PI / 8 },
      pentagram: { symmetry: 5, orbits: 2, star: 2, phase: -Math.PI / 2 },
      hexagram: { symmetry: 6, orbits: 2, star: 2, phase: -Math.PI / 2 },
      heptagram: { symmetry: 7, orbits: 2, star: 3, phase: -Math.PI / 2 },
      octagram: { symmetry: 8, orbits: 2, star: 3, phase: -Math.PI / 2 },
      enneagram: { symmetry: 9, orbits: 2, star: 4, phase: -Math.PI / 2 },
      "mandala-rose": { symmetry: 12, orbits: 3, star: 5, phase: -Math.PI / 2 },
      "infinity-knot": { symmetry: 8, orbits: 2, star: 3, phase: Math.PI / 8 },
      "compass-rose": { symmetry: 16, orbits: 2, star: 7, phase: -Math.PI / 2 }
    };
    const config = configs[recipeState.seed] || { symmetry: recipeState.builder.symmetry, orbits: recipeState.builder.orbits, star: 2 };
    const model = createRadialGeometry(recipeState, { id: recipeState.seed, label: seedLabel(recipeState.seed), ...config });
    if (recipeState.seed === "lunar-gate") {
      model.circles.push({ node: 0, radius: 1.34, weight: 0.34, role: "lunar-arc" });
    }
    if (recipeState.seed === "infinity-knot") {
      model.lines.push(...model.nodes.slice(1, 9).map((_, index) => ({ from: index + 1, to: ((index + 4) % 8) + 1, weight: 0.3, role: "cross-knot" })));
    }
    return normalizeModel(model);
  }

  function createSriYantraGeometry(recipeState) {
    const nodes = [{ id: "bindu", ring: "center", x: 0, y: 0, z: 0 }];
    const lines = [];
    const faces = [];
    for (let layer = 0; layer < 9; layer += 1) {
      const up = layer % 2 === 0;
      const radius = 0.58 + layer * 0.18;
      const yShift = (layer - 4) * 0.035;
      const group = [];
      for (let i = 0; i < 3; i += 1) {
        const angle = (up ? -Math.PI / 2 : Math.PI / 2) + i * Math.PI * 2 / 3;
        const index = nodes.length;
        group.push(index);
        nodes.push({
          id: "tri-" + layer + "-" + i,
          ring: up ? "up-triangle" : "down-triangle",
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius + yShift,
          z: zFromDepth(recipeState, layer / 9)
        });
      }
      lines.push(...ringLines(nodes, group, layer < 3 ? 0.72 : 0.54));
      faces.push(group);
      group.forEach((nodeIndex) => lines.push({ from: 0, to: nodeIndex, weight: 0.18, role: "bindu-ray" }));
    }
    const circles = [
      { node: 0, radius: 0.36, weight: 0.62, role: "bindu" },
      { node: 0, radius: 1.12, weight: 0.44, role: "yantra-ring" },
      { node: 0, radius: 1.78, weight: 0.34, role: "yantra-ring" }
    ];
    return normalizeModel({ id: "sri-yantra", label: "Sri Yantra", family: "sacred", nodes, lines, faces, circles, circleRadius: 0.52 });
  }

  function createTreeOfLifeGeometry(recipeState) {
    const positions = [
      [0, 2.1], [-0.72, 1.36], [0.72, 1.36], [0, 0.82], [-0.72, 0.08],
      [0.72, 0.08], [0, -0.42], [-0.72, -1.12], [0.72, -1.12], [0, -1.86]
    ];
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0.82, z: 0 }];
    positions.forEach(([x, y], index) => nodes.push({ id: "sphere-" + index, ring: "tree", x, y, z: zFromDepth(recipeState, index / 10), radius: index === 0 || index === 9 ? 1.16 : 1 }));
    const pairs = [[1, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [3, 6], [4, 5], [4, 6], [4, 7], [5, 7], [5, 8], [6, 7], [6, 9], [7, 8], [7, 9], [7, 10], [8, 10], [9, 10]];
    const lines = pairs.map(([from, to]) => ({ from, to, weight: 0.58, role: "path" }));
    const circles = nodes.map((node, index) => ({ node: index, radius: index === 0 ? 0.34 : 0.22, weight: 0.42, role: "sephira" }));
    return normalizeModel({ id: "tree-life", label: "Tree of Life", family: "sacred", nodes, lines, circles, circleRadius: 0.4 });
  }

  function createVesicaChainGeometry(recipeState) {
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    const count = Math.max(5, recipeState.builder.symmetry);
    for (let index = 0; index < count; index += 1) {
      const x = (index - (count - 1) / 2) * 0.48;
      nodes.push({ id: "chain-" + index, ring: "vesica-chain", x, y: Math.sin(index * Math.PI) * 0.08, z: zFromDepth(recipeState, index / count) });
    }
    const lines = [];
    for (let index = 1; index < nodes.length - 1; index += 1) {
      lines.push({ from: index, to: index + 1, weight: 0.7, role: "chain" });
      lines.push({ from: 0, to: index, weight: 0.22, role: "center-link" });
    }
    const circles = nodes.slice(1).map((_, index) => ({ node: index + 1, radius: 0.74, weight: 0.72, role: "vesica" }));
    circles.push({ node: 0, radius: 0.4, weight: 0.4, role: "center" });
    return normalizeModel({ id: "vesica-chain", label: "Vesica Chain", family: "sacred", nodes, lines, circles, circleRadius: 0.72 });
  }

  function createElementalGeometry(recipeState) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const cube = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
    ];
    const octa = [
      { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
    ];
    const icosa = [
      { x: 0, y: 1, z: phi }, { x: 0, y: -1, z: phi }, { x: 0, y: 1, z: -phi }, { x: 0, y: -1, z: -phi },
      { x: 1, y: phi, z: 0 }, { x: -1, y: phi, z: 0 }, { x: 1, y: -phi, z: 0 }, { x: -1, y: -phi, z: 0 },
      { x: phi, y: 0, z: 1 }, { x: -phi, y: 0, z: 1 }, { x: phi, y: 0, z: -1 }, { x: -phi, y: 0, z: -1 }
    ];
    const dodeca = [
      { x: -1, y: -1, z: -1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: -1, y: 1, z: 1 },
      { x: 1, y: -1, z: -1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: 1, z: 1 },
      { x: 0, y: -1 / phi, z: -phi }, { x: 0, y: -1 / phi, z: phi }, { x: 0, y: 1 / phi, z: -phi }, { x: 0, y: 1 / phi, z: phi },
      { x: -1 / phi, y: -phi, z: 0 }, { x: -1 / phi, y: phi, z: 0 }, { x: 1 / phi, y: -phi, z: 0 }, { x: 1 / phi, y: phi, z: 0 },
      { x: -phi, y: 0, z: -1 / phi }, { x: -phi, y: 0, z: 1 / phi }, { x: phi, y: 0, z: -1 / phi }, { x: phi, y: 0, z: 1 / phi }
    ];
    const tetraA = [{ x: 1, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }];
    const tetraB = [{ x: -1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: -1, z: 1 }, { x: -1, y: 1, z: 1 }];
    const configs = {
      merkaba: {
        label: "Merkaba",
        vertices: tetraA.concat(tetraB),
        edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [4, 5], [4, 6], [4, 7], [5, 6], [5, 7], [6, 7]],
        faces: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [4, 5, 6], [4, 5, 7], [4, 6, 7], [5, 6, 7]]
      },
      pyramid: {
        label: "Pyramid",
        vertices: [
          { x: -1, y: -0.72, z: -1 }, { x: 1, y: -0.72, z: -1 }, { x: 1, y: -0.72, z: 1 }, { x: -1, y: -0.72, z: 1 },
          { x: 0, y: 1.24, z: 0 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]],
        faces: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]]
      },
      fire: {
        label: "Tetrahedron",
        vertices: [{ x: 1, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }],
        faces: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]
      },
      earth: {
        label: "Cube",
        vertices: cube,
        faces: [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]]
      },
      air: {
        label: "Octahedron",
        vertices: octa,
        faces: [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]]
      },
      water: { label: "Icosahedron", vertices: icosa },
      ether: { label: "Dodecahedron", vertices: dodeca }
    };
    return createPolyhedronGeometry(recipeState, configs[recipeState.seed] || configs.earth);
  }

  function createPolyhedronGeometry(recipeState, config) {
    const depth = 0.58 + recipeState.builder.depth * 0.19;
    const yaw = recipeState.builder.variant * 0.055;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const raw = config.vertices.map((vertex) => {
      const z = vertex.z * depth;
      return {
        x: vertex.x * cos + z * sin,
        y: vertex.y,
        z: -vertex.x * sin + z * cos
      };
    });
    const maxRadius = Math.max(...raw.map((vertex) => Math.hypot(vertex.x, vertex.y, vertex.z)), 1);
    const fit = 2.18 / maxRadius;
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0 }];
    raw.forEach((vertex, index) => {
      nodes.push({
        id: "solid-" + index,
        ring: "solid",
        x: vertex.x * fit,
        y: vertex.y * fit,
        z: vertex.z * fit,
        radius: 1.08
      });
    });

    const edgePairs = config.edges || shortestEdges(config.vertices);
    const edgeKeys = new Set();
    const lines = edgePairs.map(([from, to]) => {
      edgeKeys.add(lineKey(from + 1, to + 1));
      return { from: from + 1, to: to + 1, weight: 0.88, role: "solid-edge" };
    });
    if (recipeState.builder.density > 5) {
      for (let index = 1; index < nodes.length; index += 1) lines.push({ from: 0, to: index, weight: 0.18, role: "center-spoke" });
    }
    if (recipeState.builder.density > 7) {
      const keepEvery = Math.max(2, 12 - recipeState.builder.density);
      for (let from = 1; from < nodes.length; from += 1) {
        for (let to = from + 1; to < nodes.length; to += 1) {
          if (edgeKeys.has(lineKey(from, to))) continue;
          if ((from + to + recipeState.builder.variant) % keepEvery === 0) lines.push({ from, to, weight: 0.22, role: "solid-chord" });
        }
      }
    }

    const faces = (config.faces || []).map((face) => face.map((nodeIndex) => nodeIndex + 1));
    const circles = [{ node: 0, radius: 0.36, weight: 0.5, role: "center" }];
    for (let index = 1; index < nodes.length; index += 1) {
      circles.push({ node: index, radius: 0.18 + recipeState.builder.aura * 0.015, weight: 0.28, role: "vertex" });
    }
    return normalizeModel({ id: recipeState.seed, label: config.label, family: "elemental", nodes, lines, faces, circles, circleRadius: 0.32 });
  }

  function shortestEdges(vertices) {
    let shortest = Infinity;
    const distances = [];
    for (let from = 0; from < vertices.length; from += 1) {
      for (let to = from + 1; to < vertices.length; to += 1) {
        const distance = distance3(vertices[from], vertices[to]);
        if (distance > 0.001) shortest = Math.min(shortest, distance);
        distances.push({ from, to, distance });
      }
    }
    return distances.filter((edge) => edge.distance <= shortest * 1.08).map((edge) => [edge.from, edge.to]);
  }

  function distance3(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  function lineKey(from, to) {
    return Math.min(from, to) + ":" + Math.max(from, to);
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
    model.faces = (model.faces || [])
      .map((face) => face.filter((nodeIndex) => model.nodes[nodeIndex]))
      .filter((face) => face.length >= 3);
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
      this.faceMeshes = [];
      this.particleMeshes = [];
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
      const settings = renderSettings();
      const materialProfile = settings.material;
      const nodeGeometry = new THREE.SphereGeometry(0.075, 28, 18);
      const centerGeometry = new THREE.SphereGeometry(0.12, 36, 24);

      this.model.faces.forEach((face, index) => {
        const vertices = [];
        for (let faceIndex = 1; faceIndex < face.length - 1; faceIndex += 1) {
          [face[0], face[faceIndex], face[faceIndex + 1]].forEach((nodeIndex) => {
            const node = this.model.nodes[nodeIndex];
            vertices.push(node.x, node.y, node.z);
          });
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
          color: colors[3],
          emissive: colors[index % 2],
          emissiveIntensity: 0.16,
          transparent: true,
          opacity: settings.showFaces ? materialProfile.face : 0,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { face, index, baseOpacity: material.opacity };
        this.faceMeshes.push(mesh);
        this.group.add(mesh);
      });

      this.model.lines.forEach((line, index) => {
        const from = this.model.nodes[line.from];
        const to = this.model.nodes[line.to];
        const style = glyphLineStyle(this.model, line, index, settings);
        const material = new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.emissive,
          emissiveIntensity: 0.42,
          transparent: true,
          opacity: style.opacity,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness
        });
        const mesh = makeCylinderBetween(THREE, point(from), point(to), style.radius, material);
        mesh.userData = { line, index, baseOpacity: material.opacity, travelPhase: style.travelPhase };
        this.lineMeshes.push(mesh);
        this.group.add(mesh);
      });

      this.model.nodes.forEach((node, index) => {
        const isCenter = index === 0 || node.ring === "center";
        const style = glyphNodeStyle(node, index);
        const material = new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.color,
          emissiveIntensity: (isCenter ? 1.3 : 0.9) * materialProfile.glow,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness
        });
        const mesh = new THREE.Mesh(isCenter ? centerGeometry : nodeGeometry, material);
        mesh.position.copy(point(node));
        mesh.scale.setScalar(style.scale);
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
          opacity: settings.showRings ? (0.12 + (circle.weight || 0.4) * 0.2) * materialProfile.line : 0,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness * 0.5
        });
        const ringGeometry = new THREE.TorusGeometry(circle.radius, 0.008 * materialProfile.thickness, 12, 180);
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(point(node));
        ring.userData = { circle, index };
        this.ringMeshes.push(ring);
        this.group.add(ring);
      });

      if (settings.showParticles) {
        const particleGeometry = new THREE.SphereGeometry(0.027 * materialProfile.particle, 14, 10);
        const particleCount = 36 + this.state.builder.aura * 8;
        for (let index = 0; index < particleCount; index += 1) {
          const t = index / particleCount;
          const angle = t * Math.PI * 2 * (2 + this.state.builder.orbits * 0.25);
          const radius = 1.3 + (index % 9) * 0.16 + this.state.builder.aura * 0.055;
          const point3 = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.17) * radius * 0.62,
            Math.sin(angle) * radius * 0.72
          );
          const particleMaterial = new THREE.MeshStandardMaterial({
            color: index % 3 === 0 ? colors[2] : colors[1],
            emissive: index % 3 === 0 ? colors[2] : colors[1],
            emissiveIntensity: 0.55 * materialProfile.glow,
            transparent: true,
            opacity: 0.16 + materialProfile.particle * 0.08,
            roughness: materialProfile.roughness,
            metalness: materialProfile.metalness
          });
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          particle.position.copy(point3);
          particle.userData = { base: point3.clone(), phase: angle, baseOpacity: particleMaterial.opacity };
          this.particleMeshes.push(particle);
          this.group.add(particle);
        }
      }

      function point(node) {
        return new THREE.Vector3(node.x, node.y, node.z);
      }
    }

    setModel(model) {
      this.model = model;
      this.nodeMeshes = [];
      this.lineMeshes = [];
      this.ringMeshes = [];
      this.faceMeshes = [];
      this.particleMeshes = [];
      while (this.group.children.length) {
        const child = this.group.children.pop();
        disposeObject(child);
      }
      this.buildObjects();
      this.resetOrientation();

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
        if (this.state.moveGlyph || this.state.trueGlyph) {
          panGlyphBy(dx, dy, this.canvas.getBoundingClientRect());
        } else {
          this.rotation.y += dx * 0.006;
          this.rotation.x = clampFloat(this.rotation.x + dy * 0.006, -1.35, 1.35);
          this.rotation.z += dx * 0.0008;
        }
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
      const settings = renderSettings();
      this.nodeMeshes.forEach((mesh, index) => {
        const style = glyphNodeStyle(mesh.userData.node, index);
        mesh.material.color.set(style.color);
        mesh.material.emissive.set(style.color);
      });
      this.lineMeshes.forEach((mesh, index) => {
        const style = glyphLineStyle(this.model, mesh.userData.line, index, settings);
        mesh.material.color.set(style.color);
        mesh.material.emissive.set(style.emissive);
      });
      this.faceMeshes.forEach((mesh, index) => {
        mesh.material.color.set(colors[3]);
        mesh.material.emissive.set(colors[index % 2]);
      });
      this.particleMeshes.forEach((mesh, index) => {
        const color = index % 3 === 0 ? colors[2] : colors[1];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
      this.ringMeshes.forEach((mesh, index) => {
        const color = mesh.userData.circle && mesh.userData.circle.role === "center" ? colors[0] : colors[1];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
    }

    resetFrontFace() {
      this.resetOrientation();
      this.state.pan.x = 0;
      this.state.pan.y = 0;
      this.drag.active = false;
    }

    resetOrientation() {
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
      const solidForm = this.model.family === "elemental";
      const motion = currentMotion();
      const settings = renderSettings();
      const breathRate = mode === "breath" ? 1.35 : 0.45 + motion.pulse * 0.18;
      const breathDepth = (mode === "breath" ? 0.08 : 0.018) * currentShapeType().breath * Math.max(0.2, motion.pulse);
      const breath = reduced || trueGlyph ? 1 : 1 + Math.sin(seconds * breathRate) * breathDepth;
      const sealPulse = this.state.sealedAt ? Math.max(0, 1 - (Date.now() - this.state.sealedAt) / 5200) : 0;
      const tapPulse = Math.max(0, 1 - (now - this.state.activePulse) / 1300);

      if (!this.drag.active && !reduced && !trueGlyph && motion.spin > 0) {
        this.rotation.z += (mode === "kasina" ? 0.00018 : 0.00042) * motion.spin;
        if (solidForm && !this.state.moveGlyph) {
          this.rotation.y += 0.00072 * motion.spin;
          this.rotation.x += 0.00016 * Math.max(0.2, motion.tilt);
        }
      }

      const mirrorTilt = motion.id === "mirror" && !trueGlyph ? Math.sin(seconds * 0.55) * 0.16 : 0;
      this.group.rotation.set(trueGlyph ? 0 : this.rotation.x + mirrorTilt, trueGlyph ? 0 : this.rotation.y, trueGlyph ? 0 : this.rotation.z);
      this.group.position.set(this.state.pan.x, -this.state.pan.y, 0);
      this.group.scale.setScalar((trueGlyph ? 1 : breath + sealPulse * 0.035) * this.state.zoom);

      this.lineMeshes.forEach((mesh, index) => {
        const phase = mesh.userData.travelPhase || index * 0.33;
        const wave = reduced ? 0.25 : (Math.sin(seconds * (2.2 + motion.spiral * 0.35) + phase) + 1) / 2;
        mesh.material.opacity = mesh.userData.baseOpacity + wave * 0.11 * settings.lineOpacity + tapPulse * 0.16;
        mesh.material.emissiveIntensity = (0.32 + wave * 0.54 + tapPulse * 0.7 + sealPulse * 0.48) * settings.glow;
      });

      this.faceMeshes.forEach((mesh, index) => {
        const wave = reduced || trueGlyph ? 0.25 : (Math.sin(seconds * 1.35 + index * 0.57) + 1) / 2;
        mesh.material.opacity = settings.showFaces ? mesh.userData.baseOpacity + wave * 0.035 + tapPulse * 0.055 + sealPulse * 0.04 : 0;
      });

      this.nodeMeshes.forEach((mesh, index) => {
        const active = this.state.activeNode === index ? tapPulse : 0;
        mesh.material.emissiveIntensity = ((index === 0 ? 1.2 : 0.72) + active * 1.8 + sealPulse * 0.6) * settings.glow;
        const baseScale = mesh.userData.baseScale || 1;
        const unfold = motion.unfold ? Math.sin(seconds * 0.9 + index * 0.22) * 0.055 * motion.unfold : 0;
        const size = baseScale * (index === 0 ? 1 : 1 + active * 0.45 + sealPulse * 0.08 + unfold);
        mesh.scale.setScalar(size);
      });

      this.ringMeshes.forEach((mesh, index) => {
        const phase = reduced || trueGlyph ? 0 : Math.sin(seconds * 0.85 + index * 0.4) * 0.035;
        const modeLift = mode === "glyph" && !trueGlyph ? 0.035 : 0;
        mesh.scale.setScalar(trueGlyph ? 1 : 1 + phase + modeLift + sealPulse * 0.045);
        const base = 0.1 + ((mesh.userData.circle && mesh.userData.circle.weight) || 0.4) * 0.18;
        mesh.material.opacity = settings.showRings ? base * settings.lineOpacity + tapPulse * 0.08 + sealPulse * 0.09 : 0;
      });

      this.particleMeshes.forEach((mesh, index) => {
        const phase = mesh.userData.phase + seconds * (0.18 + motion.spin * 0.08);
        const base = mesh.userData.base;
        mesh.position.set(
          base.x * Math.cos(phase * 0.05) - base.z * Math.sin(phase * 0.05),
          base.y + Math.sin(seconds * 0.9 + index) * 0.06 * motion.pulse,
          base.x * Math.sin(phase * 0.05) + base.z * Math.cos(phase * 0.05)
        );
        mesh.material.opacity = settings.showParticles ? mesh.userData.baseOpacity + Math.sin(seconds * 1.1 + index) * 0.035 : 0;
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
      this.drag = { active: false, x: 0, y: 0 };
    }

    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.bindPointer();
      this.animate();
    }

    bindPointer() {
      this.canvas.addEventListener("pointerdown", (event) => {
        this.drag = { active: true, x: event.clientX, y: event.clientY };
        this.canvas.setPointerCapture(event.pointerId);
      });
      this.canvas.addEventListener("pointermove", (event) => {
        if (!this.drag.active) return;
        const dx = event.clientX - this.drag.x;
        const dy = event.clientY - this.drag.y;
        recordGesturePoint(event);
        if (this.state.moveGlyph || this.state.trueGlyph) {
          panGlyphBy(dx, dy, this.canvas.getBoundingClientRect());
        } else {
          this.rotation += dx * 0.003 + dy * 0.001;
        }
        this.drag.x = event.clientX;
        this.drag.y = event.clientY;
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
        pan: this.state.pan,
        material: currentMaterial(),
        shapeType: currentShapeType(),
        layers: this.state.layers,
        zoom: this.state.zoom,
        mode: this.state.mode,
        trueGlyph: this.state.trueGlyph,
        sealSignature: this.state.sealSignature,
        pulse: Math.max(0, 1 - (performance.now() - this.state.activePulse) / 1400),
        wallpaper: false
      });
    }

    resetFrontFace() {
      this.resetOrientation();
      this.state.pan.x = 0;
      this.state.pan.y = 0;
      this.drag.active = false;
    }

    resetOrientation() {
      this.rotation = 0;
      this.drag.active = false;
    }

    setModel(model) {
      this.model = model;
      this.resetOrientation();
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
    const sizes = {
      card: { width: 1200, height: 1600, wallpaper: false, transparent: false },
      wallpaper: { width: 1080, height: 1920, wallpaper: true, transparent: false },
      square: { width: 1200, height: 1200, wallpaper: false, transparent: false },
      transparent: { width: 1200, height: 1200, wallpaper: false, transparent: true }
    };
    const size = sizes[format] || sizes.square;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    drawGlyph2D(ctx, canvas.width, canvas.height, {
      model: geometry,
      colors: state.colors,
      intention: layerEnabled("intention") ? state.intention : "",
      rotation: state.trueGlyph ? 0 : -0.22,
      material: currentMaterial(),
      shapeType: currentShapeType(),
      layers: state.layers,
      zoom: state.zoom,
      mode: state.mode,
      trueGlyph: state.trueGlyph,
      sealSignature: state.sealSignature,
      pulse: state.sealedAt ? 0.8 : 0.36,
      wallpaper: size.wallpaper,
      transparent: size.transparent,
      artifact: format
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
    const material = options.material || currentMaterial();
    const shapeType = options.shapeType || currentShapeType();
    const layers = options.layers || state.layers;
    const showFaces = !options.trueGlyph && shapeType.faces && layers.faces;
    const showParticles = !options.trueGlyph && shapeType.particles && layers.particles;
    const showRings = shapeType.rings && layers.aura;
    const cx = width / 2;
    const cy = height * (options.wallpaper ? 0.44 : 0.48);
    const scale = Math.min(width, height) * (options.wallpaper ? 0.15 : 0.16) * (options.zoom || 1);
    const circleRadius = scale * options.model.circleRadius;
    const timePulse = options.pulse || 0;
    const breath = options.trueGlyph ? 1 : 1 + (options.mode === "breath" ? 0.035 : 0.014) * shapeType.breath * Math.sin(Date.now() / 900);
    const pan = options.pan || { x: 0, y: 0 };

    ctx.clearRect(0, 0, width, height);
    if (!options.transparent) {
      const bg = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, Math.max(width, height) * 0.72);
      bg.addColorStop(0, mix(toneFamilyPalette.gold, toneFamilyPalette.ink, layers.toneField ? 0.78 : 0.9));
      bg.addColorStop(0.38, mix(toneFamilyPalette.teal, toneFamilyPalette.ink, layers.toneField ? 0.86 : 0.94));
      bg.addColorStop(1, toneFamilyPalette.shadow);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }

    const projected = options.model.nodes.map((node) => {
      const angle = options.rotation || 0;
      const x = node.x * Math.cos(angle) - node.y * Math.sin(angle);
      const y = node.x * Math.sin(angle) + node.y * Math.cos(angle);
      const depth = options.trueGlyph ? 0 : node.z || 0;
      return {
        x: cx + (x + pan.x + depth * 0.12) * scale * breath,
        y: cy + (y + pan.y - depth * 0.08) * scale * breath,
        z: depth,
        radius: node.radius || 1,
        ring: node.ring
      };
    });

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    if (showFaces) {
      options.model.faces.forEach((face, index) => {
        const first = projected[face[0]];
        if (!first) return;
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        face.slice(1).forEach((nodeIndex) => {
          const node = projected[nodeIndex];
          if (node) ctx.lineTo(node.x, node.y);
        });
        ctx.closePath();
        ctx.fillStyle = alpha(index % 2 === 0 ? colors[3] : colors[2], material.face + timePulse * 0.025);
        ctx.shadowColor = colors[1];
        ctx.shadowBlur = 8 + material.glow * 10;
        ctx.fill();
      });
    }

    options.model.circles.forEach((circle) => {
      if (!showRings) return;
      const node = projected[circle.node];
      const ringColor = circle.role === "center" ? colors[0] : colors[1];
      ctx.beginPath();
      ctx.arc(node.x, node.y, scale * circle.radius * breath, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.1, scale * 0.005 * (0.7 + (circle.weight || 0.4)) * material.thickness);
      ctx.strokeStyle = alpha(ringColor, (0.12 + (circle.weight || 0.4) * 0.26) * material.line);
      ctx.shadowColor = ringColor;
      ctx.shadowBlur = (12 + timePulse * 12) * material.glow;
      ctx.stroke();
    });

    options.model.lines.forEach((line, index) => {
      const from = projected[line.from];
      const to = projected[line.to];
      const linePulse = options.trueGlyph ? 0.35 : (Math.sin(Date.now() / 520 + index * 0.48) + 1) / 2;
      const style = glyphLineStyle(options.model, line, index, {
        lineOpacity: material.line,
        thickness: material.thickness
      });
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.lineWidth = Math.max(0.8, scale * style.radius * 1.12);
      ctx.strokeStyle = alpha(style.color, style.opacity + linePulse * 0.08 + timePulse * 0.12);
      ctx.shadowColor = style.emissive;
      ctx.shadowBlur = (12 + timePulse * 18) * material.glow;
      ctx.stroke();
    });

    if (showParticles) {
      const count = 34 + (state.builder ? state.builder.aura : 5) * 6;
      for (let index = 0; index < count; index += 1) {
        const t = index / count;
        const angle = t * Math.PI * 2 * 2.7 + Date.now() / 2400;
        const radius = scale * (1.35 + (index % 8) * 0.12);
        const x = cx + pan.x * scale + Math.cos(angle) * radius;
        const y = cy + pan.y * scale + Math.sin(angle * 1.2) * radius * 0.58;
        ctx.fillStyle = alpha(index % 3 === 0 ? colors[2] : colors[1], 0.18 + material.particle * 0.04);
        ctx.shadowColor = index % 3 === 0 ? colors[2] : colors[1];
        ctx.shadowBlur = 10 * material.glow;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, scale * 0.01 * material.particle), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    projected.forEach((node, index) => {
      const nodeColor = index === 0 || node.ring === "center" ? colors[0] : index % 3 === 0 ? colors[2] : colors[1];
      const radius = scale * (index === 0 ? 0.07 : 0.04) * node.radius * (1 + timePulse * 0.28);
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4.8);
      glow.addColorStop(0, alpha("#ffffff", 0.92));
      glow.addColorStop(0.22, alpha(nodeColor, 0.88));
      glow.addColorStop(1, alpha(nodeColor, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * (3.2 + material.glow * 1.6), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (options.sealSignature || state.sealSignature) {
      const signature = options.sealSignature || state.sealSignature;
      const ringCount = Math.max(1, signature.ringCount || 1);
      const notchCount = Math.max(3, signature.notchCount || 6);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
        ctx.beginPath();
        ctx.arc(cx + pan.x * scale, cy + pan.y * scale, scale * (1.14 + ringIndex * 0.1), 0, Math.PI * 2);
        ctx.strokeStyle = alpha(toneFamilyPalette.gold, 0.12 + ringIndex * 0.035 + timePulse * 0.08);
        ctx.lineWidth = Math.max(1, scale * 0.004);
        ctx.shadowColor = toneFamilyPalette.gold;
        ctx.shadowBlur = 18 * material.glow;
        ctx.stroke();
      }
      for (let notchIndex = 0; notchIndex < notchCount; notchIndex += 1) {
        const angle = (notchIndex / notchCount) * Math.PI * 2 + ((signature.seed || 0) * Math.PI) / 180;
        const inner = scale * 1.18;
        const outer = scale * 1.27;
        const x1 = cx + pan.x * scale + Math.cos(angle) * inner;
        const y1 = cy + pan.y * scale + Math.sin(angle) * inner;
        const x2 = cx + pan.x * scale + Math.cos(angle) * outer;
        const y2 = cy + pan.y * scale + Math.sin(angle) * outer;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = alpha(toneFamilyPalette.parchment, 0.34);
        ctx.lineWidth = Math.max(1, scale * 0.006);
        ctx.stroke();
      }
      ctx.restore();
    }
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
