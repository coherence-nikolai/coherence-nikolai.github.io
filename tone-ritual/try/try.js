const copy = {
  en: {
    label: "Free web ritual",
    heroTitle: "Try Tone Ritual",
    heroLine: "Ten small acts. One changed field.",
    heroCopy: "Choose a small ritual, receive ten acts, complete any that feel possible, and save a private field note in this browser.",
    startCta: "Start the web ritual",
    appCta: "Open the iOS app",
    mapLabel: "Map",
    mapTitle: "A small taste of the iOS app.",
    mapCopy: "The web ritual keeps the free core simple: choose, receive, complete, save. The iOS app holds the larger rotating libraries, Tone Plus packs, languages, and the full native experience.",
    mapOneTitle: "Choose",
    mapOneCopy: "Pick the ritual that fits the day.",
    mapTwoTitle: "Receive",
    mapTwoCopy: "Let ten small acts gather into view.",
    mapThreeTitle: "Complete",
    mapThreeCopy: "Mark only what feels possible.",
    mapFourTitle: "Save",
    mapFourCopy: "Keep one field note privately in this browser.",
    languageIntro: "Language",
    chooseLabel: "Choose",
    chooseTitle: "One small ritual.",
    chooseHint: "free web set",
    newSetButton: "Generate another set",
    progressCopy: "No need to complete all ten.",
    actsLabel: "Today's acts",
    actsTitle: "Complete any that feel possible.",
    fieldLabel: "Field note",
    fieldTitle: "What shifted in the field?",
    fieldCopy: "No change is still a true answer.",
    noteLabel: "One sentence about today",
    notePlaceholder: "The day has been touched.",
    saveNoteButton: "Save field note",
    savedLabel: "Field notes",
    savedTitle: "Saved in this browser.",
    savedCopy: "These notes are stored only in your browser. Clear browser storage and they disappear.",
    privacyLabel: "Privacy",
    privacyTitle: "Local by default.",
    privacyCopy: "No account, no server, no tracking. The web version uses your browser only.",
    iosLabel: "iOS app",
    iosTitle: "The full ritual field lives on iPhone.",
    iosCopy: "Tone Ritual for iOS includes larger rotating act libraries, 9 languages, local field notes, and Tone Plus ritual packs.",
    downloadButton: "Download Tone Ritual",
    footerNote: "Tone Ritual is a reflective wellbeing app, not medical advice, therapy, diagnosis, crisis support, or an emergency service.",
    done: "Done",
    mark: "Mark",
    oneAct: "One act matters.",
    warming: "The field is warming.",
    touched: "The day has been touched.",
    complete: "The constellation is complete.",
    saved: "A field note has been saved.",
    emptyNotes: "No field notes yet. Begin with one small act."
  },
  es: {
    label: "Ritual web gratis",
    heroTitle: "Prueba Tone Ritual",
    heroLine: "Diez actos pequeños. Un campo que cambia.",
    heroCopy: "Elige un ritual pequeño, recibe diez actos, completa los que se sientan posibles y guarda una nota privada en este navegador.",
    startCta: "Empezar el ritual web",
    appCta: "Abrir la app de iOS",
    mapLabel: "Mapa",
    mapTitle: "Una pequeña muestra de la app de iOS.",
    mapCopy: "El ritual web mantiene lo esencial: elegir, recibir, completar y guardar. La app de iOS contiene bibliotecas más amplias, packs Tone Plus, idiomas y la experiencia nativa completa.",
    mapOneTitle: "Elige",
    mapOneCopy: "Escoge el ritual que calza con tu día.",
    mapTwoTitle: "Recibe",
    mapTwoCopy: "Deja que diez actos pequeños aparezcan.",
    mapThreeTitle: "Completa",
    mapThreeCopy: "Marca solo lo que se sienta posible.",
    mapFourTitle: "Guarda",
    mapFourCopy: "Conserva una nota privada en este navegador.",
    languageIntro: "Idioma",
    chooseLabel: "Elige",
    chooseTitle: "Un ritual pequeño.",
    chooseHint: "set web gratis",
    newSetButton: "Generar otro set",
    progressCopy: "No necesitas completar los diez.",
    actsLabel: "Actos de hoy",
    actsTitle: "Completa cualquiera que se sienta posible.",
    fieldLabel: "Nota de campo",
    fieldTitle: "¿Qué cambió en el campo?",
    fieldCopy: "Sin cambio también es una respuesta verdadera.",
    noteLabel: "Una frase sobre hoy",
    notePlaceholder: "El día fue tocado.",
    saveNoteButton: "Guardar nota de campo",
    savedLabel: "Notas de campo",
    savedTitle: "Guardadas en este navegador.",
    savedCopy: "Estas notas se guardan solo en tu navegador. Si borras el almacenamiento del navegador, desaparecen.",
    privacyLabel: "Privacidad",
    privacyTitle: "Local por defecto.",
    privacyCopy: "Sin cuenta, sin servidor, sin seguimiento. La versión web usa solo tu navegador.",
    iosLabel: "App iOS",
    iosTitle: "El campo ritual completo vive en iPhone.",
    iosCopy: "Tone Ritual para iOS incluye bibliotecas rotativas más amplias, 9 idiomas, notas locales y packs Tone Plus.",
    downloadButton: "Descargar Tone Ritual",
    footerNote: "Tone Ritual es una app de bienestar reflexivo, no consejo médico, terapia, diagnóstico, apoyo de crisis ni servicio de emergencia.",
    done: "Hecho",
    mark: "Marcar",
    oneAct: "Un acto importa.",
    warming: "El campo se está entibiando.",
    touched: "El día fue tocado.",
    complete: "La constelación está completa.",
    saved: "La nota de campo fue guardada.",
    emptyNotes: "Aún no hay notas de campo. Comienza con un acto pequeño."
  }
};

const rituals = [
  {
    id: "core",
    color: "rgba(205, 104, 137, 0.2)",
    en: { name: "Core", description: "Foundational acts for any kind of day." },
    es: { name: "Base", description: "Actos base para cualquier tipo de día." },
    acts: [
      act("Gratitude", "Gratitud", "Thank someone specifically", "Agradece algo específico", "Send a short message naming one specific thing you appreciate.", "Envía un mensaje breve nombrando algo específico que agradeces."),
      act("Kindness", "Amabilidad", "Offer one kind sentence", "Ofrece una frase amable", "Say one genuinely kind sentence to someone nearby or online.", "Di una frase genuinamente amable a alguien cerca o en línea."),
      act("Connection", "Conexión", "Ask one human question", "Haz una pregunta humana", "Ask a question that invites a real answer, then leave room for the reply.", "Haz una pregunta que invite una respuesta real y deja espacio para escuchar."),
      act("Presence", "Presencia", "Take ten breaths", "Toma diez respiraciones", "Pause before the next thing and take ten steady breaths.", "Pausa antes de lo siguiente y toma diez respiraciones tranquilas."),
      act("Beauty", "Belleza", "Find one quiet beauty", "Encuentra una belleza tranquila", "Notice one ordinary thing that is beautiful without needing to photograph it.", "Nota una cosa cotidiana que sea bella sin necesidad de fotografiarla."),
      act("Courage", "Coraje", "Begin the avoided thing", "Empieza eso evitado", "Work on something you have been avoiding for two minutes only.", "Trabaja solo dos minutos en algo que has estado evitando."),
      act("Repair", "Reparación", "Soften one tension", "Suaviza una tensión", "Clarify, apologise, or send a gentle message where there has been friction.", "Aclara, pide disculpas o envía un mensaje amable donde hubo roce."),
      act("Contribution", "Contribución", "Make one thing easier", "Haz algo más fácil", "Do one small task that quietly helps someone else.", "Haz una pequeña tarea que ayude silenciosamente a alguien."),
      act("Movement", "Movimiento", "Step outside", "Sal un momento", "Walk outside for five minutes without needing to achieve anything.", "Camina afuera cinco minutos sin tener que lograr nada."),
      act("Savouring", "Saborear", "Slow one ordinary moment", "Lentifica un momento común", "Drink, eat, or look at something slowly for one full minute.", "Bebe, come o mira algo lentamente durante un minuto completo."),
      act("Gratitude", "Gratitud", "Name one ordinary comfort", "Nombra una comodidad cotidiana", "Notice one comfort that usually goes unmentioned.", "Nota una comodidad que normalmente pasa sin ser nombrada."),
      act("Presence", "Presencia", "Listen for three sounds", "Escucha tres sonidos", "Close your eyes, if it feels safe, and listen for three separate sounds.", "Cierra los ojos, si se siente seguro, y escucha tres sonidos distintos.")
    ]
  },
  {
    id: "low-energy",
    color: "rgba(82, 162, 150, 0.2)",
    en: { name: "Low Energy", description: "Gentle acts for low-capacity days." },
    es: { name: "Baja energía", description: "Actos suaves para días de baja capacidad." },
    acts: [
      act("Presence", "Presencia", "Unclench one place", "Suelta una zona", "Notice your jaw, shoulders, or hands and soften one place by one degree.", "Nota tu mandíbula, hombros o manos y suaviza una zona apenas un grado."),
      act("Kindness", "Amabilidad", "Lower the bar kindly", "Baja la exigencia con cariño", "Choose one thing that can be smaller today and still count.", "Elige algo que hoy pueda ser más pequeño y aun así contar."),
      act("Movement", "Movimiento", "Take twenty gentle steps", "Da veinte pasos suaves", "Walk twenty slow steps with no destination other than returning to yourself.", "Da veinte pasos lentos sin otro destino que volver a ti."),
      act("Gratitude", "Gratitud", "Thank the support under you", "Agradece el soporte bajo ti", "Notice the chair, floor, bed, or ground holding some of your weight.", "Nota la silla, el piso, la cama o la tierra sosteniendo parte de tu peso."),
      act("Savouring", "Saborear", "Drink slowly", "Bebe lentamente", "Take three slow sips of water, tea, or coffee without multitasking.", "Toma tres sorbos lentos de agua, té o café sin hacer otra cosa."),
      act("Connection", "Conexión", "Send a low-pressure hello", "Envía un hola sin presión", "Send one message that does not require a reply.", "Envía un mensaje que no necesite respuesta."),
      act("Contribution", "Contribución", "Reset one tiny surface", "Ordena una superficie mínima", "Clear one small surface, even if the rest stays as it is.", "Despeja una superficie pequeña, aunque el resto quede igual."),
      act("Beauty", "Belleza", "Choose one colour", "Elige un color", "Notice one colour near you and let it be enough for a moment.", "Nota un color cerca de ti y deja que eso baste por un momento."),
      act("Repair", "Reparación", "Postpone with respect", "Posterga con respeto", "If you cannot answer now, send one clear and kind delay message.", "Si no puedes responder ahora, envía un mensaje claro y amable para postergar."),
      act("Courage", "Coraje", "Do the first inch", "Haz el primer centímetro", "Open the thing you are avoiding, then stop if that is enough.", "Abre eso que estás evitando y detente si eso ya es suficiente."),
      act("Presence", "Presencia", "One hand on heart", "Una mano al corazón", "Place one hand on your chest and let yourself pause for three breaths.", "Pon una mano en el pecho y permítete pausar por tres respiraciones."),
      act("Kindness", "Amabilidad", "Speak to yourself plainly", "Háblate con simpleza", "Replace one harsh inner sentence with a more neutral one.", "Cambia una frase interna dura por una más neutral.")
    ]
  },
  {
    id: "morning",
    color: "rgba(213, 174, 85, 0.2)",
    en: { name: "Morning", description: "A softer beginning for the day ahead." },
    es: { name: "Mañana", description: "Un comienzo más suave para el día." },
    acts: [
      act("Presence", "Presencia", "Begin before the phone", "Empieza antes del teléfono", "Take three breaths before opening another app.", "Toma tres respiraciones antes de abrir otra app."),
      act("Gratitude", "Gratitud", "Notice what is already enough", "Nota lo que ya basta", "Find one part of this moment that does not need improving before you continue.", "Encuentra una parte de este momento que no necesita mejora antes de seguir."),
      act("Kindness", "Amabilidad", "Use one warmer sentence", "Usa una frase más cálida", "Replace one sharp sentence at the start of the day with a version that is still true but less punishing.", "Cambia una frase dura al comienzo del día por una versión verdadera pero menos castigadora."),
      act("Movement", "Movimiento", "Open the shoulders", "Abre los hombros", "Roll your shoulders slowly three times and let the day begin with more room.", "Gira los hombros lentamente tres veces y deja que el día empiece con más espacio."),
      act("Savouring", "Saborear", "Let the first drink land", "Deja llegar el primer sorbo", "Let your first drink of the day have your full attention for three sips.", "Dale plena atención a tu primera bebida del día por tres sorbos."),
      act("Connection", "Conexión", "Send morning warmth", "Envía calidez matutina", "Send one short message that brings warmth without asking for anything.", "Envía un mensaje breve que lleve calidez sin pedir nada."),
      act("Contribution", "Contribución", "Prepare one small ease", "Prepara una pequeña facilidad", "Set up one thing that will make later today slightly easier.", "Prepara algo que haga el día un poco más fácil más tarde."),
      act("Beauty", "Belleza", "Look toward light", "Mira hacia la luz", "Look toward natural light for one minute, even through a window.", "Mira luz natural por un minuto, aunque sea por una ventana."),
      act("Courage", "Coraje", "Name the brave thing", "Nombra lo valiente", "Name one small brave thing you may be willing to do today.", "Nombra una cosa pequeña y valiente que quizás estés dispuesto a hacer hoy."),
      act("Repair", "Reparación", "Start clean where possible", "Empieza limpio donde puedas", "If yesterday left friction, choose one gentle next sentence.", "Si ayer quedó roce, elige una próxima frase amable."),
      act("Presence", "Presencia", "Choose the tone", "Elige el tono", "Ask: what tone do I want to carry into the first hour?", "Pregunta: ¿qué tono quiero llevar a la primera hora?"),
      act("Gratitude", "Gratitud", "Thank the beginning", "Agradece el comienzo", "Notice that this day has not fully formed yet.", "Nota que este día todavía no está completamente formado.")
    ]
  }
];

const reflections = [
  ["warmer", "Warmer", "Más cálido"],
  ["clearer", "Clearer", "Más claro"],
  ["softer", "Softer", "Más suave"],
  ["braver", "Braver", "Más valiente"],
  ["connected", "More connected", "Más conectado"],
  ["no-change", "No change", "Sin cambio"]
];

let lang = "en";
let selectedRitualId = "core";
let sessionActs = [];
let selectedReflection = "";

const main = document.querySelector(".ritual-main");
const choiceGrid = document.getElementById("ritual-choice-grid");
const actList = document.getElementById("act-list");
const progressCount = document.getElementById("progress-count");
const progressLine = document.getElementById("progress-line");
const selectedRitualPill = document.getElementById("selected-ritual-pill");
const interactiveMark = document.getElementById("interactive-mark");
const reflectionGrid = document.getElementById("reflection-grid");
const noteInput = document.getElementById("note-input");
const saveStatus = document.getElementById("save-status");
const savedGrid = document.getElementById("saved-grid");

function act(categoryEn, categoryEs, titleEn, titleEs, instructionEn, instructionEs) {
  return {
    id: `${titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(16).slice(2)}`,
    category: { en: categoryEn, es: categoryEs },
    title: { en: titleEn, es: titleEs },
    instruction: { en: instructionEn, es: instructionEs },
    done: false
  };
}

function t(key) {
  return copy[lang][key] || copy.en[key] || key;
}

function shuffle(items) {
  return [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function selectedRitual() {
  return rituals.find((ritual) => ritual.id === selectedRitualId) || rituals[0];
}

function applyLanguage(nextLang) {
  lang = nextLang;
  document.documentElement.lang = lang;
  main.dataset.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.classList.toggle("active", button.dataset.langButton === lang);
  });
  renderAll();
}

function startSession() {
  const ritual = selectedRitual();
  sessionActs = shuffle(ritual.acts).slice(0, 10).map((item, index) => ({
    ...item,
    instanceId: `${item.id}-${Date.now()}-${index}`,
    done: false
  }));
  selectedReflection = "";
  noteInput.value = "";
  saveStatus.textContent = "";
  renderAll();
}

function renderAll() {
  renderChoices();
  renderActs();
  renderProgress();
  renderReflections();
  renderSavedNotes();
}

function renderChoices() {
  choiceGrid.innerHTML = "";
  rituals.forEach((ritual) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ritual-choice";
    button.style.setProperty("--act-glow", ritual.color);
    button.setAttribute("aria-pressed", ritual.id === selectedRitualId ? "true" : "false");
    button.innerHTML = `<strong>${ritual[lang].name}</strong><span>${ritual[lang].description}</span>`;
    button.addEventListener("click", () => {
      selectedRitualId = ritual.id;
      startSession();
    });
    choiceGrid.appendChild(button);
  });
}

function renderActs() {
  actList.innerHTML = "";
  sessionActs.forEach((item) => {
    const card = document.createElement("article");
    card.className = `act-card${item.done ? " is-done" : ""}`;
    card.style.setProperty("--act-glow", selectedRitual().color);
    card.innerHTML = `
      <div class="act-topline">
        <div class="act-meta">
          <span class="act-category">${item.category[lang]}</span>
        </div>
        <button class="act-toggle" type="button" aria-pressed="${item.done ? "true" : "false"}">
          ${item.done ? t("done") : t("mark")}
        </button>
      </div>
      <h3>${item.title[lang]}</h3>
      <p>${item.instruction[lang]}</p>
    `;
    card.querySelector(".act-toggle").addEventListener("click", () => {
      item.done = !item.done;
      renderActs();
      renderProgress();
    });
    actList.appendChild(card);
  });
}

function renderProgress() {
  const count = sessionActs.filter((item) => item.done).length;
  const ritual = selectedRitual();
  selectedRitualPill.textContent = ritual[lang].name;
  progressCount.textContent = lang === "es" ? `${count} de 10 hechos` : `${count} of 10 done`;
  progressLine.textContent = count === 10 ? t("complete") : count >= 4 ? t("touched") : count >= 1 ? t("warming") : t("oneAct");

  interactiveMark.innerHTML = `<span class="interactive-orb"></span><span class="interactive-ring"></span>`;
  const points = [
    [11, 54], [14, 65], [26, 69], [40, 64], [54, 55],
    [67, 45], [77, 36], [72, 28], [53, 28], [34, 34]
  ];
  points.forEach(([left, top], index) => {
    const dot = document.createElement("span");
    dot.className = `interactive-dot${index < count ? " is-lit" : ""}`;
    dot.style.left = `${left}%`;
    dot.style.top = `${top}%`;
    interactiveMark.appendChild(dot);
  });
  interactiveMark.setAttribute("aria-label", lang === "es" ? `${count} de 10 actos hechos` : `${count} of 10 acts done`);
}

function renderReflections() {
  reflectionGrid.innerHTML = "";
  reflections.forEach(([id, en, es]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reflection-chip";
    button.textContent = lang === "es" ? es : en;
    button.setAttribute("aria-pressed", id === selectedReflection ? "true" : "false");
    button.addEventListener("click", () => {
      selectedReflection = id;
      renderReflections();
    });
    reflectionGrid.appendChild(button);
  });
}

function getSavedNotes() {
  try {
    return JSON.parse(localStorage.getItem("toneRitualWebTryNotes") || "[]");
  } catch {
    return [];
  }
}

function saveFieldNote() {
  const ritual = selectedRitual();
  const count = sessionActs.filter((item) => item.done).length;
  const note = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    lang,
    ritual: ritual[lang].name,
    count,
    reflection: selectedReflection,
    text: noteInput.value.trim(),
    acts: sessionActs.filter((item) => item.done).map((item) => item.title[lang])
  };
  const notes = [note, ...getSavedNotes()].slice(0, 12);
  localStorage.setItem("toneRitualWebTryNotes", JSON.stringify(notes));
  saveStatus.textContent = t("saved");
  renderSavedNotes();
}

function renderSavedNotes() {
  const notes = getSavedNotes();
  savedGrid.innerHTML = "";
  if (!notes.length) {
    savedGrid.innerHTML = `<p class="saved-empty">${t("emptyNotes")}</p>`;
    return;
  }
  notes.forEach((note) => {
    const article = document.createElement("article");
    article.className = "saved-note";
    const date = new Date(note.date).toLocaleDateString(lang === "es" ? "es-CL" : "en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const reflection = reflections.find(([id]) => id === note.reflection);
    const reflectionText = reflection ? (lang === "es" ? reflection[2] : reflection[1]) : (lang === "es" ? "Sin elegir" : "Not selected");
    article.innerHTML = `
      <time>${date}</time>
      <h3>${note.count} / 10 · ${note.ritual}</h3>
      <p>${lang === "es" ? "Cambio" : "Shift"}: ${reflectionText}</p>
      ${note.text ? `<p>${escapeHtml(note.text)}</p>` : ""}
    `;
    savedGrid.appendChild(article);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

document.querySelectorAll("[data-lang-button]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.langButton));
});

document.getElementById("new-session-button").addEventListener("click", startSession);
document.getElementById("save-note-button").addEventListener("click", saveFieldNote);

startSession();
applyLanguage("en");
