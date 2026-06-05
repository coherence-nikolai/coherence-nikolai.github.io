const copy = {
  en: {
    label: "Free web instrument",
    heroTitle: "Try Tone Recall",
    heroLine: "Choose a state. Shape a tone. Save it privately.",
    heroCopy: "This small web version gives you the core idea of Tone Recall: listen to the state you want to strengthen, let a simple sine tone hold it, and return to it later.",
    startCta: "Start the web practice",
    appCta: "Open the iOS app",
    mapLabel: "Map",
    mapTitle: "The web version is a taste of the app.",
    mapCopy: "It keeps the free core simple: choose, shape, save, recall. The full iOS app adds the deeper chambers, Spiral Practice, and the polished native audio ritual.",
    mapOneTitle: "Choose",
    mapOneCopy: "Pick the mind state you want to become familiar with.",
    mapTwoTitle: "Shape",
    mapTwoCopy: "Use the sliders to make the tone feel closer to the state.",
    mapThreeTitle: "Save",
    mapThreeCopy: "Keep the tone in this browser, privately and locally.",
    mapFourTitle: "Return",
    mapFourCopy: "Replay a saved tone when you want to remember the state.",
    languageIntro: "Language",
    currentLabel: "Current tone",
    sineTone: "sine tone",
    statusIdle: "Ready when you are.",
    statusPlaying: "The tone is sounding.",
    statusStopped: "Tone released.",
    statusSaved: "Saved for recall.",
    chooseLabel: "Choose",
    chooseHint: "one state",
    shapeLabel: "Shape",
    shapeHint: "gently",
    amplitudeLabel: "Amplitude",
    brightnessLabel: "Brightness",
    playButton: "Begin tone",
    stopButton: "Release tone",
    saveButton: "Save for recall",
    savedLabel: "Recall",
    savedTitle: "Saved in this browser.",
    savedCopy: "These tones are stored only in your browser. Clear browser storage and they disappear.",
    emptyTitle: "No tones saved yet.",
    emptyCopy: "Choose a state, shape the tone, then save it here.",
    playSaved: "Play this tone",
    privacyLabel: "Privacy",
    privacyTitle: "Local by default.",
    privacyCopy: "No account, no server, no tracking. The web version uses your browser only.",
    iosLabel: "iOS app",
    iosTitle: "The full instrument lives on iPhone.",
    iosCopy: "Tone Recall for iOS includes the native sound engine, saved tone flow, resonance chambers, and Spiral Practice.",
    downloadButton: "Download Tone Recall",
    footerNote: "Tone Recall is a personal reflection instrument, not medical advice, therapy, diagnosis, crisis support, or an emergency service.",
    savedOn: "Saved",
    hz: "Hz"
  },
  es: {
    label: "Instrumento web gratis",
    heroTitle: "Prueba Tone Recall",
    heroLine: "Elige un estado. Dale forma al tono. Guárdalo en privado.",
    heroCopy: "Esta pequeña versión web muestra la idea central de Tone Recall: escucha el estado que quieres fortalecer, deja que un tono senoidal lo sostenga, y vuelve a él más tarde.",
    startCta: "Empezar la práctica web",
    appCta: "Abrir la app de iOS",
    mapLabel: "Mapa",
    mapTitle: "La versión web es una muestra de la app.",
    mapCopy: "Mantiene el núcleo gratis y simple: elegir, dar forma, guardar, recordar. La app completa para iOS suma cámaras más profundas, Spiral Practice y el ritual de audio nativo.",
    mapOneTitle: "Elige",
    mapOneCopy: "Escoge el estado mental que quieres volver más familiar.",
    mapTwoTitle: "Dale forma",
    mapTwoCopy: "Usa los controles para acercar el tono al estado.",
    mapThreeTitle: "Guarda",
    mapThreeCopy: "Mantén el tono en este navegador, de forma privada y local.",
    mapFourTitle: "Vuelve",
    mapFourCopy: "Reproduce un tono guardado cuando quieras recordar ese estado.",
    languageIntro: "Idioma",
    currentLabel: "Tono actual",
    sineTone: "tono senoidal",
    statusIdle: "Listo cuando tú quieras.",
    statusPlaying: "El tono está sonando.",
    statusStopped: "Tono soltado.",
    statusSaved: "Guardado para recordar.",
    chooseLabel: "Elige",
    chooseHint: "un estado",
    shapeLabel: "Dale forma",
    shapeHint: "suavemente",
    amplitudeLabel: "Amplitud",
    brightnessLabel: "Brillo",
    playButton: "Comenzar tono",
    stopButton: "Soltar tono",
    saveButton: "Guardar para recordar",
    savedLabel: "Recuerdo",
    savedTitle: "Guardado en este navegador.",
    savedCopy: "Estos tonos se guardan solo en tu navegador. Si borras el almacenamiento del navegador, desaparecen.",
    emptyTitle: "Aún no hay tonos guardados.",
    emptyCopy: "Elige un estado, dale forma al tono y guárdalo aquí.",
    playSaved: "Reproducir este tono",
    privacyLabel: "Privacidad",
    privacyTitle: "Local por defecto.",
    privacyCopy: "Sin cuenta, sin servidor, sin seguimiento. La versión web usa solo tu navegador.",
    iosLabel: "App iOS",
    iosTitle: "El instrumento completo vive en iPhone.",
    iosCopy: "Tone Recall para iOS incluye el motor de sonido nativo, el flujo de tonos guardados, cámaras de resonancia y Spiral Practice.",
    downloadButton: "Descargar Tone Recall",
    footerNote: "Tone Recall es un instrumento personal de reflexión. No es consejo médico, terapia, diagnóstico, apoyo en crisis ni servicio de emergencia.",
    savedOn: "Guardado",
    hz: "Hz"
  }
};

const states = [
  { id: "love", en: "Love", es: "Amor", detailEn: "soft warmth", detailEs: "calor suave", frequency: 528, color: "#dba2aa" },
  { id: "peace", en: "Peace", es: "Paz", detailEn: "steady quiet", detailEs: "quietud estable", frequency: 432, color: "#9fc8bc" },
  { id: "courage", en: "Courage", es: "Coraje", detailEn: "forward ember", detailEs: "brasa que avanza", frequency: 639, color: "#d99a6a" },
  { id: "gratitude", en: "Gratitude", es: "Gratitud", detailEn: "golden attention", detailEs: "atención dorada", frequency: 528, color: "#d9bb72" },
  { id: "clarity", en: "Clarity", es: "Claridad", detailEn: "clear signal", detailEs: "señal clara", frequency: 741, color: "#9fd4e4" },
  { id: "stillness", en: "Stillness", es: "Quietud", detailEn: "deep rest", detailEs: "descanso profundo", frequency: 174, color: "#b9b6d9" },
  { id: "patience", en: "Patience", es: "Paciencia", detailEn: "unhurried field", detailEs: "campo sin apuro", frequency: 285, color: "#b8a6dd" },
  { id: "joy", en: "Joy", es: "Alegría", detailEn: "light return", detailEs: "retorno liviano", frequency: 852, color: "#edc771" }
];

const storageKey = "toneRecallWebTrySaves";
const root = document.querySelector(".tone-try-page");
const main = document.querySelector(".try-main");
const stateGrid = document.getElementById("state-grid");
const savedGrid = document.getElementById("saved-grid");
const selectedState = document.getElementById("selected-state");
const selectedFrequency = document.getElementById("selected-frequency");
const toneStatus = document.getElementById("tone-status");
const amplitude = document.getElementById("amplitude");
const brightness = document.getElementById("brightness");
const amplitudeOutput = document.getElementById("amplitude-output");
const brightnessOutput = document.getElementById("brightness-output");
const playButton = document.getElementById("play-button");
const saveButton = document.getElementById("save-button");
const webWavePath = document.querySelector(".web-wave path");
const miniWavePath = document.querySelector(".mini-wave path");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let lang = "en";
let activeState = states.find((state) => state.id === "clarity") || states[0];
let audioContext = null;
let masterGain = null;
let oscillator = null;
let shimmer = null;
let isPlaying = false;
let reduceMotion = motionQuery.matches;

function t(key) {
  return copy[lang][key] || copy.en[key] || key;
}

function labelFor(state) {
  return state[lang] || state.en;
}

function detailFor(state) {
  return lang === "es" ? state.detailEs : state.detailEn;
}

function loadSaves() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function persistSaves(saves) {
  window.localStorage.setItem(storageKey, JSON.stringify(saves.slice(0, 9)));
}

function setTheme(state) {
  root.style.setProperty("--state-color", state.color);
  root.style.setProperty("--state-color-soft", `${state.color}38`);
  root.style.setProperty("--state-color-faint", `${state.color}18`);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalise(value, minimum, maximum) {
  return clamp((value - minimum) / (maximum - minimum), 0, 1);
}

function updateWaveVisualControls() {
  const amplitudeLevel = normalise(Number(amplitude.value || 36), 12, 72);
  const brightnessLevel = normalise(Number(brightness.value || 44), 0, 100);
  const strokeWidth = 6.2 + amplitudeLevel * 8.8;
  const glowSize = 12 + brightnessLevel * 22;

  root.style.setProperty("--wave-stroke", strokeWidth.toFixed(2));
  root.style.setProperty("--wave-glow", `${glowSize.toFixed(1)}px`);
}

function renderCopy() {
  document.documentElement.lang = lang;
  main.dataset.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.classList.toggle("active", button.dataset.langButton === lang);
  });
  playButton.textContent = isPlaying ? t("stopButton") : t("playButton");
  toneStatus.textContent = isPlaying ? t("statusPlaying") : t("statusIdle");
}

function renderStates() {
  stateGrid.innerHTML = "";
  states.forEach((state) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-button";
    button.dataset.stateId = state.id;
    button.style.setProperty("--state-color", state.color);
    button.classList.toggle("active", state.id === activeState.id);
    button.innerHTML = `<strong>${labelFor(state)}</strong><span>${detailFor(state)} · ${state.frequency} Hz</span>`;
    button.addEventListener("click", () => {
      activeState = state;
      updateSelectedState();
      renderStates();
      updateAudioTone();
    });
    stateGrid.appendChild(button);
  });
}

function renderSaved() {
  const saves = loadSaves();
  savedGrid.innerHTML = "";

  if (!saves.length) {
    const empty = document.createElement("article");
    empty.className = "empty-saved";
    empty.innerHTML = `<div><h3>${t("emptyTitle")}</h3><p>${t("emptyCopy")}</p></div>`;
    savedGrid.appendChild(empty);
    return;
  }

  saves.forEach((save) => {
    const state = states.find((item) => item.id === save.stateId) || states[0];
    const card = document.createElement("article");
    card.className = "saved-card";
    card.style.setProperty("--card-color", state.color);
    const date = new Intl.DateTimeFormat(lang === "es" ? "es-CL" : "en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(save.createdAt));
    card.innerHTML = `
      <h3>${labelFor(state)}</h3>
      <p>${t("savedOn")} ${date}</p>
      <p>${save.frequency} ${t("hz")} · ${t("amplitudeLabel")} ${save.amplitude} · ${t("brightnessLabel")} ${save.brightness}</p>
      <button type="button">${t("playSaved")}</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      activeState = state;
      amplitude.value = save.amplitude;
      brightness.value = save.brightness;
      updateSelectedState();
      renderStates();
      startTone();
      updateAudioTone();
    });
    savedGrid.appendChild(card);
  });
}

function updateSelectedState() {
  selectedState.textContent = labelFor(activeState);
  selectedFrequency.textContent = activeState.frequency;
  amplitudeOutput.textContent = amplitude.value;
  brightnessOutput.textContent = brightness.value;
  setTheme(activeState);
  updateWaveVisualControls();
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextConstructor();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    return audioContext.resume();
  }

  return Promise.resolve();
}

function gainTarget() {
  const raw = Number(amplitude.value);
  return Math.max(0.025, Math.min(0.22, raw / 340));
}

function shimmerFrequency() {
  const cents = (Number(brightness.value) - 50) * 0.9;
  return activeState.frequency * Math.pow(2, cents / 1200);
}

function makeWavePath(width, height, timestamp, options = {}) {
  const pointCount = options.points || 10;
  const padding = options.padding || 8;
  const amplitudeLevel = normalise(Number(amplitude.value || 36), 12, 72);
  const brightnessLevel = normalise(Number(brightness.value || 44), 0, 100);
  const cycles = (options.cycles || 1.26) + brightnessLevel * (options.cycleRange || 0.36);
  const phase = timestamp * ((options.speed || 0.00056) + brightnessLevel * (options.speedRange || 0.00042));
  const amplitudeBoost = isPlaying ? 1.16 : 1;
  const amplitudeBase = options.amplitude || 34;
  const amplitudeRange = options.range || 38;
  const amplitudeWave = (amplitudeBase + amplitudeLevel * amplitudeRange) * amplitudeBoost;
  const rippleMix = (options.ripple || 0.07) + brightnessLevel * (options.rippleRange || 0.18);
  const centerY = height * (options.center || 0.52) + Math.sin(timestamp * 0.00032) * (2 + amplitudeLevel * 4);
  const points = [];

  for (let index = 0; index < pointCount; index += 1) {
    const progress = index / (pointCount - 1);
    const x = padding + progress * (width - padding * 2);
    const y =
      centerY +
      Math.sin(progress * Math.PI * 2 * cycles + phase) * amplitudeWave +
      Math.sin(progress * Math.PI * 4 * cycles + phase * 0.58) * amplitudeWave * rippleMix;
    points.push([x, y]);
  }

  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return path;
}

function animateWave(timestamp) {
  if (!reduceMotion) {
    if (webWavePath) {
      webWavePath.setAttribute("d", makeWavePath(520, 220, timestamp, {
        amplitude: 22,
        range: 54,
        cycles: 1.12,
        cycleRange: 0.50,
        speed: isPlaying ? 0.00082 : 0.00038,
        speedRange: isPlaying ? 0.00070 : 0.00038,
        ripple: 0.05,
        rippleRange: 0.20,
        points: 11,
        center: 0.53
      }));
    }

    if (miniWavePath) {
      miniWavePath.setAttribute("d", makeWavePath(420, 160, timestamp + 900, {
        amplitude: 20,
        range: 28,
        cycles: 1.16,
        cycleRange: 0.28,
        speed: 0.00032,
        speedRange: 0.00022,
        ripple: 0.04,
        rippleRange: 0.12,
        points: 9,
        center: 0.54
      }));
    }
  }

  window.requestAnimationFrame(animateWave);
}

function startTone() {
  ensureAudio().then(() => {
    if (isPlaying) {
      updateAudioTone();
      return;
    }

    oscillator = audioContext.createOscillator();
    shimmer = audioContext.createOscillator();
    oscillator.type = "sine";
    shimmer.type = "sine";
    oscillator.frequency.setValueAtTime(activeState.frequency, audioContext.currentTime);
    shimmer.frequency.setValueAtTime(shimmerFrequency(), audioContext.currentTime);

    oscillator.connect(masterGain);
    shimmer.connect(masterGain);
    oscillator.start();
    shimmer.start();

    isPlaying = true;
    root.classList.add("is-sounding");
    renderCopy();
    toneStatus.textContent = t("statusPlaying");

    const now = audioContext.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(gainTarget(), now + 0.28);
  }).catch((error) => {
    toneStatus.textContent = error && error.message ? error.message : "Audio unavailable.";
  });
}

function stopTone() {
  if (!audioContext || !isPlaying) {
    return;
  }

  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(0.0001, now, 0.08);

  const oldOscillator = oscillator;
  const oldShimmer = shimmer;
  window.setTimeout(() => {
    try { oldOscillator && oldOscillator.stop(); } catch {}
    try { oldShimmer && oldShimmer.stop(); } catch {}
    try { oldOscillator && oldOscillator.disconnect(); } catch {}
    try { oldShimmer && oldShimmer.disconnect(); } catch {}
  }, 260);

  oscillator = null;
  shimmer = null;
  isPlaying = false;
  root.classList.remove("is-sounding");
  renderCopy();
  toneStatus.textContent = t("statusStopped");
}

function updateAudioTone() {
  updateSelectedState();
  if (!audioContext || !isPlaying || !oscillator || !shimmer) {
    return;
  }

  const now = audioContext.currentTime;
  oscillator.frequency.setTargetAtTime(activeState.frequency, now, 0.055);
  shimmer.frequency.setTargetAtTime(shimmerFrequency(), now, 0.055);
  masterGain.gain.setTargetAtTime(gainTarget(), now, 0.08);
}

function saveCurrentTone() {
  const saves = loadSaves();
  const nextSave = {
    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
    stateId: activeState.id,
    frequency: activeState.frequency,
    amplitude: Number(amplitude.value),
    brightness: Number(brightness.value),
    createdAt: new Date().toISOString()
  };
  persistSaves([nextSave, ...saves]);
  toneStatus.textContent = t("statusSaved");
  renderSaved();
}

document.querySelectorAll("[data-lang-button]").forEach((button) => {
  button.addEventListener("click", () => {
    lang = button.dataset.langButton || "en";
    renderCopy();
    renderStates();
    renderSaved();
    updateSelectedState();
  });
});

playButton.addEventListener("click", () => {
  if (isPlaying) {
    stopTone();
  } else {
    startTone();
  }
});

saveButton.addEventListener("click", saveCurrentTone);
amplitude.addEventListener("input", updateAudioTone);
brightness.addEventListener("input", updateAudioTone);
window.addEventListener("pagehide", stopTone);
if (motionQuery.addEventListener) {
  motionQuery.addEventListener("change", (event) => {
    reduceMotion = event.matches;
  });
} else if (motionQuery.addListener) {
  motionQuery.addListener((event) => {
    reduceMotion = event.matches;
  });
}

renderCopy();
updateSelectedState();
renderStates();
renderSaved();
window.requestAnimationFrame(animateWave);
