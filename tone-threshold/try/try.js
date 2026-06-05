const copy = {
  en: {
    label: "Free web doorway",
    heroTitle: "Try Tone Threshold",
    heroLine: "One question. One doorway. No rush to answer.",
    heroCopy: "This small web version gives you the free core of Tone Threshold: stand before one question, cross when ready, and keep a private mark when something has not finished with you.",
    startCta: "Start the web crossing",
    appCta: "Open the iOS app",
    mapLabel: "Map",
    mapTitle: "The web version is a simple doorway.",
    mapCopy: "It keeps the free Threshold experience intentionally small: choose a doorway, receive a question, cross to the next, and keep only what still has weight.",
    mapOneTitle: "Choose",
    mapOneCopy: "Select the doorway you want to stand before.",
    mapTwoTitle: "Stand",
    mapTwoCopy: "Let one question have the whole room.",
    mapThreeTitle: "Cross",
    mapThreeCopy: "Move only when the answer starts falling silent.",
    mapFourTitle: "Keep",
    mapFourCopy: "Save a mark privately in this browser.",
    languageIntro: "Language",
    doorLabel: "Doorway",
    doorTitle: "Choose where to stand.",
    saveButton: "Keep this mark",
    savedButton: "Mark kept",
    crossButton: "Cross the threshold",
    questionNote: "No completing. No optimizing. Only the next doorway.",
    savedLabel: "Saved marks",
    savedTitle: "Kept in this browser.",
    savedCopy: "These marks stay local to this browser. The full iOS app adds Return Field, where saved questions can return later.",
    emptyTitle: "No marks kept yet.",
    emptyCopy: "Keep a question when something in it has not finished with you.",
    standAgain: "Stand before it",
    savedOn: "Kept",
    privacyLabel: "Privacy",
    privacyTitle: "Local by default.",
    privacyCopy: "No account, no server, no tracking. Saved marks remain in this browser unless you clear them.",
    iosLabel: "iOS app",
    iosTitle: "The Living Threshold lives on iPhone.",
    iosCopy: "Tone Threshold for iOS adds Return Field, Tone Plus, deeper crossings, personal chambers, premium doors, and grounded soundfields.",
    downloadButton: "Download Tone Threshold",
    footerNote: "Tone Threshold is a contemplative inquiry instrument, not medical advice, therapy, diagnosis, crisis support, or an emergency service.",
    doorwaySuffix: "doorway"
  },
  es: {
    label: "Umbral web gratis",
    heroTitle: "Prueba Tone Threshold",
    heroLine: "Una pregunta. Una puerta. Sin prisa por responder.",
    heroCopy: "Esta pequeña versión web muestra el núcleo gratis de Tone Threshold: estar ante una pregunta, cruzar cuando estés listo, y guardar una marca privada cuando algo no ha terminado contigo.",
    startCta: "Empezar el cruce web",
    appCta: "Abrir la app de iOS",
    mapLabel: "Mapa",
    mapTitle: "La versión web es una puerta simple.",
    mapCopy: "Mantiene la experiencia gratis de Threshold deliberadamente pequeña: elige una puerta, recibe una pregunta, cruza a la siguiente y guarda solo lo que aún tiene peso.",
    mapOneTitle: "Elige",
    mapOneCopy: "Selecciona la puerta ante la que quieres estar.",
    mapTwoTitle: "Permanece",
    mapTwoCopy: "Deja que una pregunta ocupe toda la sala.",
    mapThreeTitle: "Cruza",
    mapThreeCopy: "Muévete solo cuando la respuesta empiece a quedar en silencio.",
    mapFourTitle: "Guarda",
    mapFourCopy: "Guarda una marca privada en este navegador.",
    languageIntro: "Idioma",
    doorLabel: "Puerta",
    doorTitle: "Elige dónde estar.",
    saveButton: "Guardar esta marca",
    savedButton: "Marca guardada",
    crossButton: "Cruzar el umbral",
    questionNote: "Sin completar. Sin optimizar. Solo la siguiente puerta.",
    savedLabel: "Marcas guardadas",
    savedTitle: "Guardadas en este navegador.",
    savedCopy: "Estas marcas permanecen locales en este navegador. La app completa para iOS añade Return Field, donde las preguntas guardadas pueden volver más tarde.",
    emptyTitle: "Aún no hay marcas.",
    emptyCopy: "Guarda una pregunta cuando algo en ella no haya terminado contigo.",
    standAgain: "Volver a estar ante ella",
    savedOn: "Guardada",
    privacyLabel: "Privacidad",
    privacyTitle: "Local por defecto.",
    privacyCopy: "Sin cuenta, sin servidor, sin seguimiento. Las marcas guardadas permanecen en este navegador salvo que las borres.",
    iosLabel: "App iOS",
    iosTitle: "El Umbral Vivo vive en iPhone.",
    iosCopy: "Tone Threshold para iOS añade Return Field, Tone Plus, cruces más profundos, cámaras personales, puertas premium y campos sonoros arraigados.",
    downloadButton: "Descargar Tone Threshold",
    footerNote: "Tone Threshold es un instrumento de indagación contemplativa. No es consejo médico, terapia, diagnóstico, apoyo en crisis ni servicio de emergencia.",
    doorwaySuffix: "puerta"
  }
};

const doors = [
  {
    id: "self",
    en: "Self",
    es: "Yo",
    detailEn: "Identity, rehearsal, becoming.",
    detailEs: "Identidad, ensayo, devenir.",
    color: "#d8bd83",
    guidanceEn: "Stand where the answer falls silent.",
    guidanceEs: "Permanece donde la respuesta cae en silencio.",
    questions: [
      { en: "Who is choosing before the chooser explains itself?", es: "¿Quién elige antes de que quien elige se explique?" },
      { en: "What part of you performs being yourself?", es: "¿Qué parte de ti interpreta ser tú?" },
      { en: "If your name fell quiet, what would still answer?", es: "Si tu nombre quedara en silencio, ¿qué seguiría respondiendo?" },
      { en: "What identity have you mistaken for shelter?", es: "¿Qué identidad has confundido con refugio?" },
      { en: "Who are you when memory stops introducing you?", es: "¿Quién eres cuando la memoria deja de presentarte?" }
    ]
  },
  {
    id: "body",
    en: "Body",
    es: "Cuerpo",
    detailEn: "Sensation, breath, truth.",
    detailEs: "Sensación, respiración, verdad.",
    color: "#8fbdb6",
    guidanceEn: "Let the body answer before language arrives.",
    guidanceEs: "Deja que el cuerpo responda antes de que llegue el lenguaje.",
    questions: [
      { en: "Where does your body know before you do?", es: "¿Dónde sabe tu cuerpo antes que tú?" },
      { en: "What tightens when nothing is being asked of you?", es: "¿Qué se tensa cuando nada te está pidiendo algo?" },
      { en: "Which breath belongs to the answer you cannot say?", es: "¿Qué respiración pertenece a la respuesta que no puedes decir?" },
      { en: "What sensation keeps returning without needing a story?", es: "¿Qué sensación sigue volviendo sin necesitar una historia?" },
      { en: "If the body stopped proving, what would it release?", es: "Si el cuerpo dejara de demostrar, ¿qué soltaría?" }
    ]
  },
  {
    id: "silence",
    en: "Silence",
    es: "Silencio",
    detailEn: "Witness, stillness, the untouched.",
    detailEs: "Testigo, quietud, lo intacto.",
    color: "#b8b2d9",
    guidanceEn: "Let the question become wider than thought.",
    guidanceEs: "Deja que la pregunta se vuelva más amplia que el pensamiento.",
    questions: [
      { en: "What remains when the answer is not invited?", es: "¿Qué queda cuando la respuesta no es invitada?" },
      { en: "Who hears the silence before it is named?", es: "¿Quién oye el silencio antes de que sea nombrado?" },
      { en: "What does not move when everything in you reaches?", es: "¿Qué no se mueve cuando todo en ti se extiende?" },
      { en: "If nothing needed to appear, what is already here?", es: "Si nada necesitara aparecer, ¿qué ya está aquí?" },
      { en: "Where does attention rest when it stops becoming useful?", es: "¿Dónde descansa la atención cuando deja de volverse útil?" }
    ]
  }
];

const storageKey = "toneThresholdWebTryMarks";
const root = document.querySelector(".threshold-try-page");
const main = document.querySelector(".threshold-try-main");
const doorGrid = document.getElementById("door-grid");
const savedGrid = document.getElementById("saved-grid");
const questionPanel = document.querySelector(".question-panel");
const questionDoorLabel = document.getElementById("question-door-label");
const questionText = document.getElementById("question-text");
const questionGuidance = document.getElementById("question-guidance");
const saveButton = document.getElementById("save-button");
const crossButton = document.getElementById("cross-button");

let lang = "en";
let activeDoor = doors[0];
let questionIndexByDoor = {};
let currentQuestion = activeDoor.questions[0];
let isCrossing = false;

function t(key) {
  return copy[lang][key] || copy.en[key] || key;
}

function doorName(door) {
  return door[lang] || door.en;
}

function doorDetail(door) {
  return lang === "es" ? door.detailEs : door.detailEn;
}

function doorGuidance(door) {
  return lang === "es" ? door.guidanceEs : door.guidanceEn;
}

function questionTextFor(question) {
  return question[lang] || question.en;
}

function loadMarks() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function persistMarks(marks) {
  window.localStorage.setItem(storageKey, JSON.stringify(marks.slice(0, 12)));
}

function setTheme(door) {
  root.style.setProperty("--threshold-color", door.color);
  root.style.setProperty("--threshold-color-soft", `${door.color}40`);
  root.style.setProperty("--threshold-color-faint", `${door.color}18`);
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

function renderDoors() {
  doorGrid.innerHTML = "";
  doors.forEach((door) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "door-button";
    button.dataset.doorId = door.id;
    button.style.setProperty("--door-color", door.color);
    button.classList.toggle("active", door.id === activeDoor.id);
    button.innerHTML = `<strong>${doorName(door)}</strong><span>${doorDetail(door)}</span>`;
    button.addEventListener("click", () => {
      if (isCrossing) return;
      activeDoor = door;
      currentQuestion = getQuestionForDoor(door, false);
      renderDoors();
      updateQuestion(false);
    });
    doorGrid.appendChild(button);
  });
}

function getQuestionForDoor(door, advance) {
  const currentIndex = questionIndexByDoor[door.id] || 0;
  const nextIndex = advance ? (currentIndex + 1) % door.questions.length : currentIndex;
  questionIndexByDoor[door.id] = nextIndex;
  return door.questions[nextIndex];
}

function updateQuestion(animate = true) {
  setTheme(activeDoor);
  questionDoorLabel.textContent = `${doorName(activeDoor)} ${t("doorwaySuffix")}`;
  questionText.textContent = questionTextFor(currentQuestion);
  questionGuidance.textContent = doorGuidance(activeDoor);
  saveButton.textContent = t("saveButton");

  if (animate) {
    questionPanel.classList.remove("is-fading");
  }
}

function crossThreshold() {
  if (isCrossing) return;
  isCrossing = true;
  questionPanel.classList.add("is-crossing", "is-fading");

  window.setTimeout(() => {
    currentQuestion = getQuestionForDoor(activeDoor, true);
    updateQuestion(false);
    questionPanel.classList.remove("is-fading");
  }, 520);

  window.setTimeout(() => {
    questionPanel.classList.remove("is-crossing");
    isCrossing = false;
  }, 1180);
}

function saveCurrentQuestion() {
  const marks = loadMarks();
  const mark = {
    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
    doorId: activeDoor.id,
    question: currentQuestion,
    createdAt: new Date().toISOString()
  };
  persistMarks([mark, ...marks]);
  saveButton.textContent = t("savedButton");
  renderMarks();
}

function renderMarks() {
  const marks = loadMarks();
  savedGrid.innerHTML = "";

  if (!marks.length) {
    const empty = document.createElement("article");
    empty.className = "empty-marks";
    empty.innerHTML = `<h3>${t("emptyTitle")}</h3><p>${t("emptyCopy")}</p>`;
    savedGrid.appendChild(empty);
    return;
  }

  marks.forEach((mark) => {
    const door = doors.find((item) => item.id === mark.doorId) || doors[0];
    const date = new Intl.DateTimeFormat(lang === "es" ? "es-CL" : "en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(mark.createdAt));
    const card = document.createElement("article");
    card.className = "saved-mark";
    card.style.setProperty("--mark-color", `${door.color}22`);
    card.innerHTML = `
      <p class="label">${doorName(door)} ${t("doorwaySuffix")}</p>
      <h3>${questionTextFor(mark.question)}</h3>
      <p>${t("savedOn")} ${date}</p>
      <button type="button">${t("standAgain")}</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      activeDoor = door;
      currentQuestion = mark.question;
      renderDoors();
      updateQuestion();
      document.getElementById("threshold-instrument").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    savedGrid.appendChild(card);
  });
}

document.querySelectorAll("[data-lang-button]").forEach((button) => {
  button.addEventListener("click", () => {
    lang = button.dataset.langButton || "en";
    renderCopy();
    renderDoors();
    updateQuestion(false);
    renderMarks();
  });
});

crossButton.addEventListener("click", crossThreshold);
saveButton.addEventListener("click", saveCurrentQuestion);

renderCopy();
renderDoors();
updateQuestion(false);
renderMarks();
