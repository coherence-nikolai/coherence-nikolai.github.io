(function () {
  "use strict";

  const THREE_URL = "https://unpkg.com/three@0.165.0/build/three.module.js";
  const STORAGE_KEY = "toneGlyph.savedGlyphs.v1";
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

  const state = {
    mode: "ritual",
    intention: "",
    tone: "calm",
    colors: toneProfiles[0].colors.slice(),
    sealedAt: null,
    activePulse: 0,
    activeNode: null,
    saves: [],
    reducedMotion: MOTION_QUERY.matches,
    renderer: null
  };

  const refs = {};
  const geometry = createMetatronGeometry();
  let toastTimer = 0;
  let audioContext = null;

  document.addEventListener("DOMContentLoaded", start);

  function start() {
    bindRefs();
    loadSaves();
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
    refs.paletteOptions = document.getElementById("palette-options");
    refs.colorInputs = Array.from(document.querySelectorAll("[data-color-index]"));
    refs.seal = document.getElementById("seal-button");
    refs.clear = document.getElementById("clear-button");
    refs.save = document.getElementById("save-button");
    refs.share = document.getElementById("share-button");
    refs.download = document.getElementById("download-button");
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

    MOTION_QUERY.addEventListener("change", (event) => {
      state.reducedMotion = event.matches;
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
    } catch (error) {
      console.warn("Three.js renderer unavailable, using canvas fallback.", error);
      state.renderer = new CanvasGlyphRenderer(refs.canvas, geometry, state);
      state.renderer.init();
      refs.status.textContent = "Canvas field";
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

  function sealRitual() {
    state.intention = refs.intention.value.trim();
    state.sealedAt = Date.now();
    state.activePulse = performance.now();
    updateUI();
    pulse(currentTone().freq * 2, 0.22);
    showToast(state.intention ? "Ritual sealed" : "Glyph sealed");
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
      intention: state.intention,
      tone: state.tone,
      colors: state.colors.slice(),
      mode: state.mode,
      sealedAt: state.sealedAt
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

  function loadSavedGlyph(record) {
    state.intention = record.intention || "";
    state.tone = record.tone || "calm";
    state.colors = Array.isArray(record.colors) ? record.colors.slice(0, 4) : currentTone().colors.slice();
    while (state.colors.length < 4) state.colors.push(currentTone().colors[state.colors.length]);
    state.sealedAt = record.sealedAt || null;
    refs.intention.value = state.intention;
    applyTheme();
    updateUI();
    state.activePulse = performance.now();
    showToast("Glyph restored");
  }

  function updateUI() {
    refs.modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
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
    refs.status.textContent = state.renderer instanceof ThreeGlyphRenderer ? "3D field" : label;
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

  function loadSaves() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.saves = raw ? JSON.parse(raw) : [];
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
      const text = document.createTextNode(record.intention ? record.intention.slice(0, 22) : toneLabel(record.tone));
      button.append(dot, text);
      refs.savedGlyphs.append(button);
    });
  }

  function toneLabel(id) {
    const tone = toneProfiles.find((item) => item.id === id);
    return tone ? tone.label : "Glyph";
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

  function createMetatronGeometry() {
    const nodes = [{ id: "center", ring: "center", x: 0, y: 0, z: 0.2 }];
    const innerRadius = 1;
    const outerRadius = 2;
    for (let i = 0; i < 6; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 3;
      nodes.push({
        id: "inner-" + i,
        ring: "inner",
        x: Math.cos(angle) * innerRadius,
        y: Math.sin(angle) * innerRadius,
        z: 0.04
      });
    }
    for (let i = 0; i < 6; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 3;
      nodes.push({
        id: "outer-" + i,
        ring: "outer",
        x: Math.cos(angle) * outerRadius,
        y: Math.sin(angle) * outerRadius,
        z: -0.18
      });
    }

    const lines = [];
    const add = (from, to, weight) => lines.push({ from, to, weight });
    for (let i = 1; i <= 12; i += 1) add(0, i, 0.72);
    for (let i = 0; i < 6; i += 1) {
      const inner = 1 + i;
      const nextInner = 1 + ((i + 1) % 6);
      const skipInner = 1 + ((i + 2) % 6);
      const outer = 7 + i;
      const nextOuter = 7 + ((i + 1) % 6);
      const skipOuter = 7 + ((i + 2) % 6);
      add(inner, nextInner, 0.88);
      add(inner, skipInner, 0.42);
      add(outer, nextOuter, 0.7);
      add(outer, skipOuter, 0.32);
      add(inner, outer, 0.8);
      add(inner, nextOuter, 0.5);
      add(outer, nextInner, 0.44);
    }
    return { nodes, lines };
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
      this.rotation = { x: 0.58, y: -0.18, z: -0.24 };
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
      this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      this.camera.position.set(0, 0, 7.4);

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
      const ringGeometry = new THREE.TorusGeometry(0.48, 0.009, 12, 140);
      const auraGeometry = new THREE.TorusGeometry(2.55, 0.01, 12, 220);

      this.model.lines.forEach((line, index) => {
        const from = this.model.nodes[line.from];
        const to = this.model.nodes[line.to];
        const material = new THREE.MeshStandardMaterial({
          color: colors[1],
          emissive: colors[1],
          emissiveIntensity: 0.55,
          transparent: true,
          opacity: 0.18 + line.weight * 0.32,
          roughness: 0.42,
          metalness: 0.2
        });
        const mesh = makeCylinderBetween(THREE, point(from), point(to), 0.007 + line.weight * 0.006, material);
        mesh.userData = { line, index, baseOpacity: material.opacity };
        this.lineMeshes.push(mesh);
        this.group.add(mesh);
      });

      this.model.nodes.forEach((node, index) => {
        const material = new THREE.MeshStandardMaterial({
          color: index === 0 ? colors[0] : colors[index > 6 ? 2 : 1],
          emissive: index === 0 ? colors[0] : colors[index > 6 ? 2 : 1],
          emissiveIntensity: index === 0 ? 1.3 : 0.9,
          roughness: 0.26,
          metalness: 0.38
        });
        const mesh = new THREE.Mesh(index === 0 ? centerGeometry : nodeGeometry, material);
        mesh.position.copy(point(node));
        mesh.userData = { node, index };
        this.nodeMeshes.push(mesh);
        this.group.add(mesh);

        const ringMaterial = new THREE.MeshStandardMaterial({
          color: colors[index > 6 ? 3 : 0],
          emissive: colors[index > 6 ? 3 : 0],
          emissiveIntensity: 0.46,
          transparent: true,
          opacity: index === 0 ? 0.28 : 0.2,
          roughness: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(point(node));
        ring.userData = { node, index };
        this.ringMeshes.push(ring);
        this.group.add(ring);
      });

      const auraMaterial = new THREE.MeshStandardMaterial({
        color: colors[0],
        emissive: colors[0],
        emissiveIntensity: 0.32,
        transparent: true,
        opacity: 0.18,
        roughness: 0.5
      });
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      this.ringMeshes.push(aura);
      this.group.add(aura);

      function point(node) {
        return new THREE.Vector3(node.x, node.y, node.z);
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
        this.rotation.y += dx * 0.006;
        this.rotation.x += dy * 0.004;
        this.rotation.x = Math.max(0.15, Math.min(1.05, this.rotation.x));
        this.drag.x = event.clientX;
        this.drag.y = event.clientY;
      });

      this.canvas.addEventListener("pointerup", (event) => {
        const wasTap = !this.drag.moved;
        this.drag.active = false;
        if (wasTap) this.pick(event);
      });
    }

    pick(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
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
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    updateTheme() {
      const colors = this.state.colors;
      this.nodeMeshes.forEach((mesh, index) => {
        const color = index === 0 ? colors[0] : colors[index > 6 ? 2 : 1];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
      this.lineMeshes.forEach((mesh) => {
        mesh.material.color.set(colors[1]);
        mesh.material.emissive.set(colors[1]);
      });
      this.ringMeshes.forEach((mesh, index) => {
        const color = index > 6 ? colors[3] : colors[0];
        mesh.material.color.set(color);
        mesh.material.emissive.set(color);
      });
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      const now = performance.now();
      const seconds = now / 1000;
      const mode = this.state.mode;
      const reduced = this.state.reducedMotion;
      const breath = reduced ? 1 : 1 + Math.sin(seconds * (mode === "breath" ? 1.35 : 0.45)) * (mode === "breath" ? 0.08 : 0.018);
      const sealPulse = this.state.sealedAt ? Math.max(0, 1 - (Date.now() - this.state.sealedAt) / 5200) : 0;
      const tapPulse = Math.max(0, 1 - (now - this.state.activePulse) / 1300);

      if (!this.drag.active && !reduced) {
        this.rotation.z += mode === "kasina" ? 0.00018 : 0.00042;
        this.rotation.y += mode === "play" ? 0.00095 : 0.00036;
      }

      this.group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
      this.group.scale.setScalar(breath + sealPulse * 0.035);

      this.lineMeshes.forEach((mesh, index) => {
        const wave = reduced ? 0.25 : (Math.sin(seconds * 2.2 + index * 0.33) + 1) / 2;
        mesh.material.opacity = mesh.userData.baseOpacity + wave * 0.13 + tapPulse * 0.16;
        mesh.material.emissiveIntensity = 0.36 + wave * 0.5 + tapPulse * 0.7 + sealPulse * 0.4;
      });

      this.nodeMeshes.forEach((mesh, index) => {
        const active = this.state.activeNode === index ? tapPulse : 0;
        mesh.material.emissiveIntensity = (index === 0 ? 1.2 : 0.72) + active * 1.8 + sealPulse * 0.6;
        const size = index === 0 ? 1 : 1 + active * 0.45 + sealPulse * 0.08;
        mesh.scale.setScalar(size);
      });

      this.ringMeshes.forEach((mesh, index) => {
        const phase = reduced ? 0 : Math.sin(seconds * 0.85 + index * 0.4) * 0.035;
        const modeLift = mode === "glyph" ? 0.035 : 0;
        mesh.scale.setScalar(1 + phase + modeLift + sealPulse * 0.045);
        mesh.material.opacity = 0.14 + tapPulse * 0.08 + sealPulse * 0.09;
      });

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
        this.rotation += (event.clientX - this.drag.x) * 0.008;
        this.drag.x = event.clientX;
      });
      this.canvas.addEventListener("pointerup", () => {
        this.drag.active = false;
        this.state.activePulse = performance.now();
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
      if (!this.state.reducedMotion && !this.drag.active) this.rotation += 0.001;
      drawGlyph2D(this.ctx, this.width, this.height, {
        model: this.model,
        colors: this.state.colors,
        intention: "",
        rotation: this.rotation,
        mode: this.state.mode,
        pulse: Math.max(0, 1 - (performance.now() - this.state.activePulse) / 1400),
        wallpaper: false
      });
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
      rotation: -0.22,
      mode: state.mode,
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
    const scale = Math.min(width, height) * (options.wallpaper ? 0.19 : 0.24);
    const circleRadius = scale * 0.48;
    const timePulse = options.pulse || 0;
    const breath = 1 + (options.mode === "breath" ? 0.035 : 0.014) * Math.sin(Date.now() / 900);

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
      const depth = 1 + node.z * 0.25;
      return {
        x: cx + x * scale * breath,
        y: cy + y * scale * 0.84 * breath - node.z * scale * 0.38,
        depth
      };
    });

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    options.model.lines.forEach((line, index) => {
      const from = projected[line.from];
      const to = projected[line.to];
      const linePulse = (Math.sin(Date.now() / 520 + index * 0.48) + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.lineWidth = Math.max(1.2, scale * 0.009 * (0.7 + line.weight));
      ctx.strokeStyle = alpha(colors[1], 0.16 + line.weight * 0.18 + linePulse * 0.08 + timePulse * 0.14);
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 16 + timePulse * 22;
      ctx.stroke();
    });

    projected.forEach((node, index) => {
      const ringColor = index > 6 ? colors[3] : colors[0];
      ctx.beginPath();
      ctx.arc(node.x, node.y, circleRadius * (index === 0 ? 1.03 : 1), 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.1, scale * 0.008);
      ctx.strokeStyle = alpha(ringColor, index === 0 ? 0.34 : 0.22);
      ctx.shadowColor = ringColor;
      ctx.shadowBlur = 12 + timePulse * 12;
      ctx.stroke();
    });

    projected.forEach((node, index) => {
      const nodeColor = index === 0 ? colors[0] : index > 6 ? colors[2] : colors[1];
      const radius = scale * (index === 0 ? 0.07 : 0.044) * (1 + timePulse * 0.28);
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
