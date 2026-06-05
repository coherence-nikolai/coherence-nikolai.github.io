const copy = {
  en: {
    label: "Free web instrument",
    heroTitle: "Try Tone Steady",
    heroLine: "Choose what feels difficult. Follow the breath.",
    heroCopy: "A small web version of the free Tone Steady flow: choose the closest state, let Steady choose the breath, and leave when enough has changed.",
    startCta: "Start the web practice",
    appCta: "Open the iOS app",
    mapLabel: "Map",
    mapTitle: "The free core, in the browser.",
    mapCopy: "This web version is intentionally small. No account, no recording, no premium tools. Just a state, a breath, and a clean exit.",
    mapOneTitle: "Choose",
    mapOneCopy: "Pick the closest difficult state.",
    mapTwoTitle: "Follow",
    mapTwoCopy: "Let the orb and words keep the rhythm.",
    mapThreeTitle: "Enough",
    mapThreeCopy: "Stop as soon as enough has shifted.",
    mapFourTitle: "Leave",
    mapFourCopy: "Return without making the app the destination.",
    languageIntro: "Language",
    chooseLabel: "Choose what feels difficult now",
    chooseTitle: "Steady will choose the breath.",
    beginButton: "Begin breathing",
    whyButton: "Why this helps",
    enoughButton: "Enough",
    ready: "Ready",
    resultLabel: "Enough",
    resultTitle: "Leave it here.",
    resultCopy: "Nothing else is required.",
    againButton: "Choose another state",
    downloadButton: "Download Tone Steady",
    privacyLabel: "Privacy",
    privacyTitle: "No account. No feed.",
    privacyCopy: "This web practice does not save personal data. It runs in your browser and ends when you leave.",
    iosLabel: "iOS app",
    iosTitle: "The full instrument lives on iPhone.",
    iosCopy: "Tone Steady for iOS adds personal voice recording, recovery paths, local settings, and the native breathing instrument.",
    appDownloadButton: "Open Tone Steady",
    returnButton: "Return",
    footerNote: "Tone Steady is a personal regulation instrument, not medical advice, therapy, diagnosis, crisis support, or an emergency service."
  },
  es: {
    label: "Instrumento web gratis",
    heroTitle: "Prueba Tone Steady",
    heroLine: "Elige lo que se siente difícil. Sigue la respiración.",
    heroCopy: "Una pequeña versión web del flujo gratuito de Tone Steady: elige el estado más cercano, deja que Steady elija la respiración y sal cuando algo haya cambiado lo suficiente.",
    startCta: "Empezar la práctica web",
    appCta: "Abrir la app de iOS",
    mapLabel: "Mapa",
    mapTitle: "El núcleo gratis, en el navegador.",
    mapCopy: "Esta versión web es pequeña a propósito. Sin cuenta, sin grabación, sin herramientas premium. Solo un estado, una respiración y una salida limpia.",
    mapOneTitle: "Elige",
    mapOneCopy: "Escoge el estado difícil más cercano.",
    mapTwoTitle: "Sigue",
    mapTwoCopy: "Deja que el orbe y las palabras sostengan el ritmo.",
    mapThreeTitle: "Suficiente",
    mapThreeCopy: "Detente en cuanto algo haya cambiado lo suficiente.",
    mapFourTitle: "Sal",
    mapFourCopy: "Vuelve sin convertir la app en el destino.",
    languageIntro: "Idioma",
    chooseLabel: "Elige lo que se siente difícil ahora",
    chooseTitle: "Steady elegirá la respiración.",
    beginButton: "Empezar a respirar",
    whyButton: "Por qué ayuda",
    enoughButton: "Suficiente",
    ready: "Listo",
    resultLabel: "Suficiente",
    resultTitle: "Déjalo aquí.",
    resultCopy: "No hace falta nada más.",
    againButton: "Elegir otro estado",
    downloadButton: "Descargar Tone Steady",
    privacyLabel: "Privacidad",
    privacyTitle: "Sin cuenta. Sin feed.",
    privacyCopy: "Esta práctica web no guarda datos personales. Funciona en tu navegador y termina cuando sales.",
    iosLabel: "App iOS",
    iosTitle: "El instrumento completo vive en iPhone.",
    iosCopy: "Tone Steady para iOS añade grabación personal de voz, rutas de recuperación, ajustes locales y el instrumento nativo de respiración.",
    appDownloadButton: "Abrir Tone Steady",
    returnButton: "Volver",
    footerNote: "Tone Steady es un instrumento personal de regulación. No es consejo médico, terapia, diagnóstico, apoyo en crisis ni servicio de emergencia."
  }
};

const patterns = {
  sigh: {
    en: {
      name: "Physiological sigh",
      title: "Two inhales. One long release.",
      body: "Too much input needs less choice and a faster physical downshift.",
      whyTitle: "Small inhale. Inhale again. Slow exhale.",
      whyBody: "Two small inhales followed by a longer exhale can help the body discharge pressure quickly.",
      phases: [
        { label: "Small inhale", duration: 3, scale: 1.08 },
        { label: "Inhale again", duration: 2, scale: 1.18 },
        { label: "Slow exhale", duration: 6, scale: 0.78 },
        { label: "Rest", duration: 2, scale: 0.84 }
      ]
    },
    es: {
      name: "Suspiro fisiológico",
      title: "Dos inhalaciones. Una salida larga.",
      body: "Demasiado estímulo necesita menos elección y una bajada física más rápida.",
      whyTitle: "Inhala poco. Inhala otra vez. Exhala lento.",
      whyBody: "Dos inhalaciones pequeñas seguidas de una exhalación más larga pueden ayudar al cuerpo a descargar presión rápidamente.",
      phases: [
        { label: "Inhala poco", duration: 3, scale: 1.08 },
        { label: "Inhala otra vez", duration: 2, scale: 1.18 },
        { label: "Exhala lento", duration: 6, scale: 0.78 },
        { label: "Descansa", duration: 2, scale: 0.84 }
      ]
    }
  },
  box: {
    en: {
      name: "Box breathing",
      title: "Four sides. Stay with the edge.",
      body: "A clear count gives a scattered system something simple to follow.",
      whyTitle: "Inhale four. Hold four. Exhale four. Hold four.",
      whyBody: "Equal sides can give anxious energy a steadier boundary without asking you to solve anything.",
      phases: [
        { label: "Inhale", duration: 4, scale: 1.16 },
        { label: "Hold", duration: 4, scale: 1.16 },
        { label: "Exhale", duration: 4, scale: 0.82 },
        { label: "Hold", duration: 4, scale: 0.82 }
      ]
    },
    es: {
      name: "Respiración cuadrada",
      title: "Cuatro lados. Quédate con el borde.",
      body: "Un conteo claro le da a un sistema disperso algo simple que seguir.",
      whyTitle: "Inhala cuatro. Sostén cuatro. Exhala cuatro. Sostén cuatro.",
      whyBody: "Los lados iguales pueden darle a la ansiedad un límite más estable sin pedirte que resuelvas nada.",
      phases: [
        { label: "Inhala", duration: 4, scale: 1.16 },
        { label: "Sostén", duration: 4, scale: 1.16 },
        { label: "Exhala", duration: 4, scale: 0.82 },
        { label: "Sostén", duration: 4, scale: 0.82 }
      ]
    }
  },
  longExhale: {
    en: {
      name: "Long exhale",
      title: "Breathe in. Exhale longer.",
      body: "A longer exhale gives the body a simple cue: there is less to do.",
      whyTitle: "Breathe in. Exhale long.",
      whyBody: "Lengthening the exhale can lower the charge without adding more thinking.",
      phases: [
        { label: "Breathe in", duration: 4, scale: 1.14 },
        { label: "Exhale long", duration: 7, scale: 0.78 },
        { label: "Rest", duration: 1, scale: 0.82 }
      ]
    },
    es: {
      name: "Exhalación larga",
      title: "Inhala. Exhala más largo.",
      body: "Una exhalación más larga le da al cuerpo una señal simple: hay menos que hacer.",
      whyTitle: "Inhala. Exhala largo.",
      whyBody: "Alargar la exhalación puede bajar la carga sin añadir más pensamiento.",
      phases: [
        { label: "Inhala", duration: 4, scale: 1.14 },
        { label: "Exhala largo", duration: 7, scale: 0.78 },
        { label: "Descansa", duration: 1, scale: 0.82 }
      ]
    }
  },
  ignition: {
    en: {
      name: "Small ignition",
      title: "One small start.",
      body: "A short breath can give frozen energy a first edge.",
      whyTitle: "Inhale. Hold briefly. Exhale.",
      whyBody: "A small structured cycle can help the body find the first movement without forcing momentum.",
      phases: [
        { label: "Inhale", duration: 3, scale: 1.12 },
        { label: "Hold", duration: 2, scale: 1.12 },
        { label: "Exhale", duration: 4, scale: 0.82 },
        { label: "Begin again", duration: 2, scale: 0.88 }
      ]
    },
    es: {
      name: "Pequeño inicio",
      title: "Un comienzo pequeño.",
      body: "Una respiración breve puede darle a la energía congelada un primer borde.",
      whyTitle: "Inhala. Sostén breve. Exhala.",
      whyBody: "Un ciclo pequeño y estructurado puede ayudar al cuerpo a encontrar el primer movimiento sin forzar el impulso.",
      phases: [
        { label: "Inhala", duration: 3, scale: 1.12 },
        { label: "Sostén", duration: 2, scale: 1.12 },
        { label: "Exhala", duration: 4, scale: 0.82 },
        { label: "Empieza otra vez", duration: 2, scale: 0.88 }
      ]
    }
  },
  steady: {
    en: {
      name: "Steady rhythm",
      title: "Even breath. Fewer loops.",
      body: "A steady rhythm gives looping thought less room to keep steering.",
      whyTitle: "Inhale five. Exhale five.",
      whyBody: "An even rhythm can bring attention back to the body instead of the argument in the mind.",
      phases: [
        { label: "Inhale", duration: 5, scale: 1.15 },
        { label: "Exhale", duration: 5, scale: 0.80 }
      ]
    },
    es: {
      name: "Ritmo estable",
      title: "Respiración pareja. Menos vueltas.",
      body: "Un ritmo estable le da menos espacio al pensamiento repetitivo para seguir dirigiendo.",
      whyTitle: "Inhala cinco. Exhala cinco.",
      whyBody: "Un ritmo parejo puede devolver la atención al cuerpo en vez de dejarla en la discusión mental.",
      phases: [
        { label: "Inhala", duration: 5, scale: 1.15 },
        { label: "Exhala", duration: 5, scale: 0.80 }
      ]
    }
  },
  natural: {
    en: {
      name: "Natural breath",
      title: "Observe the natural breath.",
      body: "Fog needs simple contact, not more effort.",
      whyTitle: "Notice the breath coming in and going out.",
      whyBody: "Natural breath keeps the task low. You only locate what is already happening.",
      phases: [
        { label: "Notice breath in", duration: 5, scale: 1.04 },
        { label: "Notice breath out", duration: 5, scale: 0.92 },
        { label: "Let it be natural", duration: 6, scale: 0.98 },
        { label: "Feel contact", duration: 5, scale: 0.96 }
      ]
    },
    es: {
      name: "Respiración natural",
      title: "Observa la respiración natural.",
      body: "La niebla necesita contacto simple, no más esfuerzo.",
      whyTitle: "Nota la respiración al entrar y al salir.",
      whyBody: "La respiración natural mantiene la tarea ligera. Solo ubicas lo que ya está ocurriendo.",
      phases: [
        { label: "Nota cómo entra", duration: 5, scale: 1.04 },
        { label: "Nota cómo sale", duration: 5, scale: 0.92 },
        { label: "Déjala natural", duration: 6, scale: 0.98 },
        { label: "Siente contacto", duration: 5, scale: 0.96 }
      ]
    }
  },
  fourSevenEight: {
    en: {
      name: "4-7-8",
      title: "Slow the system down.",
      body: "A longer hold and release gives wired energy time to settle.",
      whyTitle: "Inhale four. Hold seven. Exhale eight.",
      whyBody: "The slower pattern asks the body to stop rushing and follow one clear rhythm.",
      phases: [
        { label: "Inhale", duration: 4, scale: 1.16 },
        { label: "Hold", duration: 7, scale: 1.16 },
        { label: "Exhale", duration: 8, scale: 0.78 }
      ]
    },
    es: {
      name: "4-7-8",
      title: "Baja la velocidad del sistema.",
      body: "Una pausa y salida más largas le dan tiempo a la energía inquieta para asentarse.",
      whyTitle: "Inhala cuatro. Sostén siete. Exhala ocho.",
      whyBody: "El patrón más lento le pide al cuerpo dejar de correr y seguir un ritmo claro.",
      phases: [
        { label: "Inhala", duration: 4, scale: 1.16 },
        { label: "Sostén", duration: 7, scale: 1.16 },
        { label: "Exhala", duration: 8, scale: 0.78 }
      ]
    }
  }
};

const states = [
  {
    id: "overwhelmed",
    pattern: "sigh",
    color: "#c89461",
    en: { title: "Overwhelmed", detail: "Flooded, overloaded, too much input." },
    es: { title: "Abrumado/a", detail: "Saturación, sobrecarga, demasiado estímulo." }
  },
  {
    id: "anxious",
    pattern: "box",
    color: "#76c6d7",
    en: { title: "Anxious / scattered", detail: "Racing, uneasy, needing structure." },
    es: { title: "Ansiedad / dispersión", detail: "Aceleración, inquietud, necesidad de estructura." }
  },
  {
    id: "anger",
    pattern: "longExhale",
    color: "#d77b4f",
    en: { title: "Anger / heat", detail: "Heat, irritation, close to reacting." },
    es: { title: "Ira / calor", detail: "Calor, irritación, cerca de reaccionar." }
  },
  {
    id: "stuck",
    pattern: "ignition",
    color: "#9fb17c",
    en: { title: "Stuck / avoiding", detail: "Can’t begin, avoiding, choosing nothing." },
    es: { title: "Bloqueo / evitación", detail: "No puedes empezar, evitas, no eliges nada." }
  },
  {
    id: "looping",
    pattern: "steady",
    color: "#d4ad68",
    en: { title: "Looping / self-attack", detail: "Repeating thoughts, blame, self-attack." },
    es: { title: "Bucle / autoataque", detail: "Pensamientos repetidos, culpa, autoataque." }
  },
  {
    id: "fog",
    pattern: "natural",
    color: "#b9b9aa",
    en: { title: "Fog / far away", detail: "Numb, unreal, hard to locate." },
    es: { title: "Niebla / lejanía", detail: "Entumecido/a, irreal, difícil de ubicar." }
  },
  {
    id: "wired",
    pattern: "fourSevenEight",
    color: "#a28bd7",
    en: { title: "Wired / can’t settle", detail: "Restless, braced, can’t wind down." },
    es: { title: "Activación / no baja", detail: "Inquietud, tensión, no puedes bajar." }
  }
];

const main = document.querySelector(".steady-try-main");
const page = document.querySelector(".steady-try-page");
const stateGrid = document.getElementById("state-grid");
const selectedEyebrow = document.getElementById("selected-eyebrow");
const selectedTitle = document.getElementById("selected-title");
const selectedCopy = document.getElementById("selected-copy");
const beginButton = document.getElementById("begin-button");
const whyButton = document.getElementById("why-button");
const enoughButton = document.getElementById("enough-button");
const result = document.getElementById("steady-result");
const againLink = document.getElementById("again-link");
const breathOrb = document.querySelector(".breath-orb");
const phaseNode = document.getElementById("breath-phase");
const countNode = document.getElementById("breath-count");
const whyDialog = document.getElementById("why-dialog");
const whyPattern = document.getElementById("why-pattern");
const whyTitle = document.getElementById("why-title");
const whyBody = document.getElementById("why-body");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let lang = "en";
let activeState = states[0];
let sessionTimer = null;
let sessionRunning = false;
let phaseIndex = 0;
let secondsRemaining = 0;

function t(key) {
  return copy[lang][key] || copy.en[key] || key;
}

function stateText(state) {
  return state[lang] || state.en;
}

function patternFor(state) {
  return patterns[state.pattern][lang] || patterns[state.pattern].en;
}

function setTheme(state) {
  page.style.setProperty("--steady-color", state.color);
  page.style.setProperty("--steady-color-soft", `${state.color}3d`);
  page.style.setProperty("--steady-color-faint", `${state.color}1a`);
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
}

function renderStates() {
  stateGrid.innerHTML = "";
  states.forEach((state) => {
    const button = document.createElement("button");
    const text = stateText(state);
    const pattern = patterns[state.pattern][lang].name;
    button.type = "button";
    button.className = "state-button";
    button.style.setProperty("--card-color", state.color);
    button.classList.toggle("active", state.id === activeState.id);
    button.innerHTML = `<strong>${text.title}</strong><span>${text.detail} · ${pattern}</span>`;
    button.addEventListener("click", () => {
      stopSession();
      activeState = state;
      updatePractice();
      renderStates();
    });
    stateGrid.appendChild(button);
  });
}

function updatePractice() {
  const text = stateText(activeState);
  const pattern = patternFor(activeState);
  setTheme(activeState);
  selectedEyebrow.textContent = text.title;
  selectedTitle.textContent = pattern.title;
  selectedCopy.textContent = pattern.body;
  whyPattern.textContent = pattern.name;
  whyTitle.textContent = pattern.whyTitle;
  whyBody.textContent = pattern.whyBody;
  phaseNode.textContent = t("ready");
  countNode.textContent = "-";
  breathOrb.style.setProperty("--breath-scale", "0.82");
}

function tickPhase() {
  const pattern = patternFor(activeState);
  const phase = pattern.phases[phaseIndex];
  phaseNode.textContent = phase.label;
  countNode.textContent = String(secondsRemaining);
  breathOrb.style.setProperty("--breath-scale", String(phase.scale));

  secondsRemaining -= 1;
  if (secondsRemaining <= 0) {
    phaseIndex = (phaseIndex + 1) % pattern.phases.length;
    secondsRemaining = pattern.phases[phaseIndex].duration;
  }
}

function startSession() {
  if (sessionRunning) {
    return;
  }

  const pattern = patternFor(activeState);
  sessionRunning = true;
  phaseIndex = 0;
  secondsRemaining = pattern.phases[0].duration;
  beginButton.hidden = true;
  whyButton.hidden = true;
  enoughButton.hidden = false;
  result.hidden = true;
  tickPhase();
  sessionTimer = window.setInterval(tickPhase, 1000);
}

function stopSession() {
  if (sessionTimer) {
    window.clearInterval(sessionTimer);
  }
  sessionTimer = null;
  sessionRunning = false;
  beginButton.hidden = false;
  whyButton.hidden = false;
  enoughButton.hidden = true;
  updatePractice();
}

function finishSession() {
  stopSession();
  result.hidden = false;
  result.scrollIntoView({ behavior: motionQuery.matches ? "auto" : "smooth", block: "center" });
}

document.querySelectorAll("[data-lang-button]").forEach((button) => {
  button.addEventListener("click", () => {
    stopSession();
    lang = button.dataset.langButton || "en";
    renderCopy();
    updatePractice();
    renderStates();
  });
});

beginButton.addEventListener("click", startSession);
enoughButton.addEventListener("click", finishSession);
whyButton.addEventListener("click", () => {
  updatePractice();
  if (typeof whyDialog.showModal === "function") {
    whyDialog.showModal();
  } else {
    window.alert(`${whyTitle.textContent}\n\n${whyBody.textContent}`);
  }
});

againLink.addEventListener("click", () => {
  result.hidden = true;
});

window.addEventListener("pagehide", stopSession);

renderCopy();
updatePractice();
renderStates();
