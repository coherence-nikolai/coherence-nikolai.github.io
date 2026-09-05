const ROOT = "./";
const FIRST_LIGHT = Object.freeze({
  duration: 16.20,
  entryDelay: 2.60,
  voiceDelay: 13.48,
  ambienceDelay: 15.18
});
const NOTICE = Object.freeze({
  duration: 60,
  cueDuration: 10,
  manualCueDuration: 4
});
const STABILISE = Object.freeze({ duration: 120 });
const SPECTRUM = Object.freeze({
  orientation: "#e3b84f",
  practice: "#d8be82",
  fields: "#8f9fd1",
  teachings: "#7fafcb",
  acts: "#8fc58b",
  threshold: "#a58dcb",
  notice: "#7db7d8",
  stabilise: "#78b89f",
  discern: "#a8c6d8",
  reclaim: "#e1b45e",
  cross: "#a58dcb",
  embody: "#d79baa",
  integrate: "#7fb5b0"
});
const guidedSitsManifest = await fetch(`${ROOT}guided-sits.json`, { cache: "no-cache" })
  .then(response => {
    if (!response.ok) throw new Error(`Guided Sits manifest request failed: ${response.status}`);
    return response.json();
  })
  .catch(() => ({ durationsSeconds: [900, 1800, 2700, 3600], practices: [] }));
const STORAGE = {
  preferences: "tone-sovereign.preferences.v1",
  traces: "tone-sovereign.traces.v1",
  carriedAct: "tone-sovereign.carried-act.v1",
  ruleOfLife: "tone-sovereign.rule-of-life.v1",
  engineDrafts: "tone-sovereign.practice-engine-drafts.v1",
  missions: "tone-sovereign.missions.v1",
  crossMarks: "tone-sovereign.cross-marks.v1",
  lastHeldTone: "tone-sovereign.last-held-tone.v1"
};

const copy = {
  en: {
    app: "Tone Sovereign",
    taglineLead: "Choose the tone of a",
    goldenAge: "Golden Age.",
    enter: "Enter",
    symbol: "The Symbol",
    replay: "Replay First Light",
    replayWithSound: "Replay with sound",
    soundOn: "Sound on",
    soundOff: "Sound off",
    voiceOn: "Voice guidance on",
    voiceOff: "Voice guidance off",
    language: "Español",
    home: "Home",
    back: "Back",
    settings: "Settings",
    history: "What You Chose to Keep",
    fiveDoors: "Five doors",
    beginQuestion: "Where would you like to begin?",
    beginSupport: "Choose the doorway that meets this moment. Each stands on its own.",
    practice: "Enter the Practice",
    practiceSupport: "Meet this moment directly.",
    fields: "Walk the Seven Fields",
    fieldsSupport: "Explore the Living Cosmology.",
    library: "Practices & Teachings",
    librarySupport: "Find something to practise or understand.",
    acts: "Perform a Sovereign Act",
    actsSupport: "Let one Golden Age quality enter the day.",
    threshold: "Enter the Threshold",
    thresholdSupport: "Meet a deeper question or crossing.",
    about: "About Tone Sovereign",
    continue: "Continue",
    choose: "Choose",
    save: "Save",
    saved: "Saved on this device.",
    notRequired: "Nothing here is required.",
    nextMovement: "Next movement",
    previousMovement: "Previous movement",
    returnHome: "Return home",
    beginAgain: "Begin again",
    another: "Another",
    close: "Close"
  },
  es: {
    app: "Tone Sovereign",
    taglineLead: "Elige el tono de una",
    goldenAge: "Edad Dorada.",
    enter: "Entrar",
    symbol: "El símbolo",
    replay: "Repetir Primera Luz",
    replayWithSound: "Repetir con sonido",
    soundOn: "Sonido activado",
    soundOff: "Sonido desactivado",
    voiceOn: "Guía de voz activada",
    voiceOff: "Guía de voz desactivada",
    language: "English",
    home: "Inicio",
    back: "Atrás",
    settings: "Ajustes",
    history: "Lo que elegiste conservar",
    fiveDoors: "Cinco puertas",
    beginQuestion: "¿Dónde te gustaría comenzar?",
    beginSupport: "Elige la puerta que acompaña este momento. Cada una funciona por sí sola.",
    practice: "Entrar en la práctica",
    practiceSupport: "Encuentra este momento directamente.",
    fields: "Recorrer los Siete Campos",
    fieldsSupport: "Explora la Cosmología Viva.",
    library: "Prácticas y enseñanzas",
    librarySupport: "Encuentra algo para practicar o comprender.",
    acts: "Realizar un acto soberano",
    actsSupport: "Deja que una cualidad de la Edad Dorada entre en tu día.",
    threshold: "Entrar en el Umbral",
    thresholdSupport: "Encuentra una pregunta más profunda o un cruce.",
    about: "Acerca de Tone Sovereign",
    continue: "Continuar",
    choose: "Elegir",
    save: "Guardar",
    saved: "Guardado en este dispositivo.",
    notRequired: "Nada aquí es obligatorio.",
    nextMovement: "Siguiente movimiento",
    previousMovement: "Movimiento anterior",
    returnHome: "Volver al inicio",
    beginAgain: "Comenzar de nuevo",
    another: "Otro",
    close: "Cerrar"
  }
};

const doors = [
  { id: "practice", mark: "⌁", key: "practice", support: "practiceSupport", spectrum: "practice", primary: true },
  { id: "fields", mark: "≋", key: "fields", support: "fieldsSupport", spectrum: "fields" },
  { id: "library", mark: "▱", key: "library", support: "librarySupport", spectrum: "teachings" },
  { id: "acts", mark: "↗", key: "acts", support: "actsSupport", spectrum: "acts" },
  { id: "threshold", mark: "∩", key: "threshold", support: "thresholdSupport", spectrum: "threshold" }
];

const guidedLibraryPaths = {
  en: [
    {
      id: "manifestation-as-participation",
      title: "Manifestation as Participation",
      subtitle: "Receive, include the whole self, and let capacity move through you.",
      entryIDs: ["manifestation-as-participation", "receiving-can-become-giving", "love-without-self-abandonment", "you-manifest-from-the-whole-self", "integration-beyond-positivity"],
      practiceID: "reciprocal-creation"
    },
    {
      id: "overwhelm-to-contribution",
      title: "From Overwhelm to Contribution",
      subtitle: "Listen inwardly and outwardly, then take one honest, reversible step.",
      entryIDs: ["attunement-listening-in-both-directions", "purpose-is-an-unfolding-relationship", "the-means-already-contain-the-world", "the-mission-does-not-require-self-destruction", "let-the-next-step-reveal-the-next"],
      practiceID: "attunement-compass"
    }
  ],
  es: [
    {
      id: "manifestation-as-participation",
      title: "La manifestación como participación",
      subtitle: "Recibe, incluye todo tu ser y deja que tu capacidad tome forma a través de ti.",
      entryIDs: ["manifestation-as-participation", "receiving-can-become-giving", "love-without-self-abandonment", "you-manifest-from-the-whole-self", "integration-beyond-positivity"],
      practiceID: "reciprocal-creation"
    },
    {
      id: "overwhelm-to-contribution",
      title: "Del agobio a la contribución",
      subtitle: "Escucha hacia dentro y hacia fuera, y da un paso honesto y reversible.",
      entryIDs: ["attunement-listening-in-both-directions", "purpose-is-an-unfolding-relationship", "the-means-already-contain-the-world", "the-mission-does-not-require-self-destruction", "let-the-next-step-reveal-the-next"],
      practiceID: "attunement-compass"
    }
  ]
};

const theLockAssetSet = language => Object.freeze({
  cover: `${ROOT}assets/comics/${language}/specials/the-lock/cover.webp`,
  pages: Object.freeze(Array.from(
    { length: 30 },
    (_, index) => `${ROOT}assets/comics/${language}/specials/the-lock/page-${String(index + 1).padStart(2, "0")}.webp`
  ))
});

const comicSeries = [
  {
    id: "mainline",
    en: {
      title: "Tone Comics",
      subtitle: "The mainline story of sovereignty moving from inner practice into wider participation."
    },
    es: {
      title: "Tone Comics",
      subtitle: "La historia principal de la soberanía, desde la práctica interior hacia una participación más amplia."
    },
    issues: [
      { number: 1, pages: 12, esReady: true, en: "The Birth of the Sovereign", es: "El nacimiento del Soberano" },
      { number: 2, pages: 10, esReady: true, en: "The Sovereign and the Seven Living Fields", es: "El Soberano y los Siete Campos Vivos" },
      { number: 3, pages: 12, esReady: true, en: "The Offered Future", es: "El Futuro Ofrecido" },
      { number: 4, pages: 12, esReady: true, en: "The Sovereign and the Borrowed Mind", es: "El Soberano y la Mente Prestada" },
      { number: 5, pages: 11, esReady: true, en: "The Beautiful City", es: "La Ciudad Hermosa" },
      { number: 6, pages: 11, esReady: true, en: "The Hollow Crown", es: "La Corona Hueca" }
    ]
  },
  {
    id: "hall",
    en: {
      title: "The Hall of Inner Adversaries",
      subtitle: "A separate ten-issue series about meeting protective inner patterns without giving any one of them command."
    },
    es: {
      title: "El Salón de los Adversarios Interiores",
      subtitle: "Una serie independiente de diez números sobre cómo encontrar patrones protectores internos sin ceder el mando a ninguno."
    },
    issues: [
      { number: 1, pages: 4, esReady: true, en: "Inner Ache", es: "Dolor Interior" },
      { number: 2, pages: 4, esReady: true, en: "The Doubter", es: "El Dubitativo" },
      { number: 3, pages: 4, esReady: true, en: "The Pretender", es: "El Farsante" },
      { number: 4, pages: 4, esReady: true, en: "The Tyrant", es: "El Tirano" },
      { number: 5, pages: 4, esReady: true, en: "The Echo", es: "El Eco" },
      { number: 6, pages: 4, esReady: true, en: "The Compulsion", es: "La Compulsión" },
      { number: 7, pages: 4, esReady: true, en: "Shame", es: "La Vergüenza" },
      { number: 8, pages: 4, esReady: true, en: "The Divider", es: "El Divisor" },
      { number: 9, pages: 4, esReady: true, en: "The Architect", es: "El Arquitecto" },
      { number: 10, pages: 9, esReady: true, philosophicalFiction: true, en: "The Self", es: "El Yo" }
    ]
  },
  {
    id: "specials",
    kind: "specials",
    en: {
      title: "Special Stories",
      subtitle: "Optional long-form fiction from the world of Tone Sovereign. Read it as story, not as diagnosis, doctrine or instruction."
    },
    es: {
      title: "Historias especiales",
      subtitle: "Ficción larga y opcional del mundo de Tone Sovereign. Léela como relato, no como diagnóstico, doctrina ni instrucción."
    },
    issues: [
      {
        id: "the-lock",
        number: 1,
        pages: 30,
        hasCover: true,
        published: false,
        assetReady: true,
        esReady: true,
        philosophicalFiction: true,
        en: "THE LOCK",
        es: "EL BLOQUEO",
        assets: {
          en: theLockAssetSet("en"),
          es: theLockAssetSet("es")
        },
        transcriptPaths: {
          en: `${ROOT}assets/comics/en/specials/the-lock/transcript.json`,
          es: `${ROOT}assets/comics/es/specials/the-lock/transcript.json`
        }
      }
    ]
  }
];

const movements = [
  {
    id: "notice", mark: "·", color: SPECTRUM.notice,
    en: { name: "Notice", line: "See clearly", title: "Notice what is here.", body: "Four simple invitations, then open noticing." },
    es: { name: "Notar", line: "Ver con claridad", title: "Nota lo que está aquí.", body: "Cuatro invitaciones sencillas y luego atención abierta." }
  },
  {
    id: "stabilise", mark: "│", color: SPECTRUM.stabilise,
    en: { name: "Stabilise", line: "Find stability", title: "What feels difficult now?", body: "Choose the closest state. We will choose a gentle breath." },
    es: { name: "Estabilizar", line: "Encontrar estabilidad", title: "¿Qué se siente difícil ahora?", body: "Elige el estado más cercano. Elegiremos una respiración suave." }
  },
  {
    id: "discern", mark: "◇", color: SPECTRUM.discern,
    en: { name: "Discern", line: "Separate fact from story", title: "What do you know for sure?", body: "Make room between what happened and what your mind added." },
    es: { name: "Discernir", line: "Separar hecho de relato", title: "¿Qué sabes con certeza?", body: "Abre espacio entre lo que ocurrió y lo que tu mente añadió." }
  },
  {
    id: "reclaim", mark: "◌", color: SPECTRUM.reclaim,
    en: { name: "Reclaim", line: "Choose your relationship", title: "What is pulling at your attention?", body: "Name it, pause, then choose how you will relate to it." },
    es: { name: "Recuperar", line: "Volver a elegir", title: "¿Qué atrae tu atención?", body: "Ponle un nombre, haz una pausa y elige cómo relacionarte con eso." }
  },
  {
    id: "cross", mark: "∩", color: SPECTRUM.cross,
    en: { name: "Cross", line: "Meet a threshold", title: "Choose a doorway.", body: "Let one useful question meet you before the next step." },
    es: { name: "Cruzar", line: "Encontrar un umbral", title: "Elige una puerta.", body: "Deja que una pregunta útil te encuentre antes del siguiente paso." }
  },
  {
    id: "embody", mark: "∿", color: SPECTRUM.embody,
    en: { name: "Embody", line: "Embody a quality", title: "Choose the tone you want to carry.", body: "Let sound, breath and attention give the quality a felt form." },
    es: { name: "Encarnar", line: "Encarnar una cualidad", title: "Elige el tono que quieres llevar.", body: "Deja que el sonido, la respiración y la atención den forma a la cualidad." }
  },
  {
    id: "integrate", mark: "∴", color: SPECTRUM.integrate,
    en: { name: "Integrate", line: "Carry it into life", title: "What small act gives this tone a body?", body: "Choose one action you can genuinely take." },
    es: { name: "Integrar", line: "Llevarlo a la vida", title: "¿Qué pequeño acto da cuerpo a este tono?", body: "Elige una acción que realmente puedas realizar." }
  }
];

const noticeCues = {
  en: [
    "Feel where your body touches the chair, floor, or bed.",
    "Let one sound come to you.",
    "Notice one area of light, colour, or darkness.",
    "Notice a thought, image, or mood appearing.",
    "Now notice what arrives."
  ],
  es: [
    "Siente dónde tu cuerpo toca la silla, el suelo o la cama.",
    "Deja que un sonido llegue a ti.",
    "Observa una zona de luz, color u oscuridad.",
    "Observa cómo aparece un pensamiento, una imagen o un estado de ánimo.",
    "Ahora observa lo que aparece."
  ]
};

const noticeVoiceCues = [
  "ts_notice_contact_v1",
  "ts_notice_sound_v1",
  "ts_notice_sight_v1",
  "ts_notice_thought_v1",
  "ts_notice_open_v1"
];

const steadyStates = [
  { id: "overwhelmed", pattern: "physiological", en: ["Overwhelmed", "Flooded, overloaded, too much input."], es: ["Abrumado", "Demasiadas cosas a la vez."] },
  { id: "anxious", pattern: "coherent", en: ["Anxious / scattered", "Racing, uneasy, needing structure."], es: ["Ansioso / disperso", "Acelerado, inquieto, necesito estructura."] },
  { id: "angry", pattern: "extended", en: ["Anger / heat", "Heat, irritation, close to reacting."], es: ["Enojo / calor", "Calor, irritación, cerca de reaccionar."] },
  { id: "stuck", pattern: "anapana", en: ["Stuck / avoiding", "Can’t begin, avoiding, choosing nothing."], es: ["Bloqueado / evitando", "No puedo empezar, evito, no elijo nada."] },
  { id: "looping", pattern: "coherent", en: ["Thoughts looping / being hard on myself", "Repeating thoughts, blame, self-attack."], es: ["Pensamientos repetidos / ser duro conmigo", "Pensamientos repetidos, culpa, ataques contra mí mismo."] },
  { id: "fog", pattern: "anapana", en: ["Fog / far away", "Numb, unreal, hard to locate."], es: ["Mente nublada / sensación de lejanía", "Entumecido, irreal, difícil de ubicar."] },
  { id: "wired", pattern: "extended", en: ["Wired / can’t settle", "Restless, wired, can’t wind down."], es: ["Inquietud / me cuesta calmarme", "Inquieto, activado, no puedo bajar."] }
];

const steadyModes = [
  { id: "overwhelmed", en: ["Too much", "Reduce intensity and make room."], es: ["Demasiado", "Reduce la intensidad y abre espacio."] },
  { id: "anxious", en: ["Too activated", "Find a steadier rhythm."], es: ["Demasiada activación", "Encuentra un ritmo más estable."] },
  { id: "fog", en: ["Too far away", "Return gently to what is here."], es: ["Demasiado lejos", "Vuelve con suavidad a lo que está aquí."] }
];

const BREATH_PATTERNS = Object.freeze({
  physiological: {
    rgb: "244,162,97",
    en: { title: "Double inhale, long exhale", cue: "Small inhale. Inhale again. Slow exhale." },
    es: { title: "Doble inhalación y exhalación larga", cue: "Inhala suavemente. Inhala otra vez. Exhala despacio." },
    phases: [
      { id: "inhale", duration: 2, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "inhale-again", duration: 1.5, voice: "ts_stabilise_inhale_again_v1", sound: "in2" },
      { id: "exhale", duration: 6, voice: "ts_stabilise_long_exhale_v1", sound: "out" }
    ]
  },
  extended: {
    rgb: "90,181,212",
    en: { title: "Long exhale", cue: "Breathe in. Let the exhale be longer." },
    es: { title: "Exhalación larga", cue: "Inhala. Deja que la exhalación dure más." },
    phases: [
      { id: "inhale", duration: 4, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "exhale", duration: 6, voice: "ts_stabilise_long_exhale_v1", sound: "out" }
    ]
  },
  coherent: {
    rgb: "120,240,177",
    en: { title: "Steady rhythm", cue: "Breathe in. Breathe out. No hold, no push." },
    es: { title: "Ritmo estable", cue: "Inhala. Exhala. Sin pausa y sin forzar." },
    phases: [
      { id: "inhale", duration: 5.5, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "exhale", duration: 5.5, voice: "ts_stabilise_exhale_v1", sound: "out" }
    ]
  },
  anapana: {
    rgb: "138,191,184",
    en: { title: "Natural breath", cue: "Observe the natural breath without changing it." },
    es: { title: "Respiración natural", cue: "Observa la respiración natural sin cambiarla." },
    phases: [
      { id: "observe", duration: 7, voice: "ts_stabilise_natural_breath_v1", sound: "observe" },
      { id: "breath-in", duration: 5.5, voice: "", sound: "observe" },
      { id: "breath-out", duration: 5.5, voice: "", sound: "observe" },
      { id: "natural", duration: 6, voice: "", sound: "observe" }
    ]
  },
  "478": {
    rgb: "179,157,219",
    en: { title: "4-7-8", cue: "Inhale. Optional hold. Exhale longer." },
    es: { title: "4-7-8", cue: "Inhala. Pausa opcional. Exhala más largo." },
    phases: [
      { id: "inhale", duration: 4, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "hold", duration: 7, voice: "", sound: "hold" },
      { id: "exhale", duration: 8, voice: "ts_stabilise_long_exhale_v1", sound: "out" }
    ]
  },
  fire: {
    rgb: "255,140,105",
    en: { title: "Breath of fire", cue: "Short pulses. Stop if dizzy." },
    es: { title: "Respiración de fuego", cue: "Pulsos cortos. Detente si te mareas." },
    phases: [
      { id: "pulse", duration: .45, voice: "", sound: "in" },
      { id: "release", duration: .45, voice: "", sound: "out" }
    ]
  },
  twoone: {
    rgb: "255,209,102",
    en: { title: "Small ignition", cue: "Breathe in. Optional pause. Exhale longer." },
    es: { title: "Pequeño encendido", cue: "Inhala. Pausa opcional. Exhala más largo." },
    phases: [
      { id: "inhale", duration: 2, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "hold", duration: 1, voice: "", sound: "hold" },
      { id: "exhale", duration: 4, voice: "ts_stabilise_long_exhale_v1", sound: "out" },
      { id: "hold2", duration: 1, voice: "", sound: "hold2" }
    ]
  },
  box: {
    rgb: "126,200,227",
    en: { title: "Box breathing", cue: "Inhale. Optional pause. Exhale. Optional pause." },
    es: { title: "Respiración cuadrada", cue: "Inhala. Pausa opcional. Exhala. Pausa opcional." },
    phases: [
      { id: "inhale", duration: 4, voice: "ts_stabilise_inhale_v1", sound: "in" },
      { id: "hold", duration: 4, voice: "", sound: "hold" },
      { id: "exhale", duration: 4, voice: "ts_stabilise_exhale_v1", sound: "out" },
      { id: "hold2", duration: 4, voice: "", sound: "hold2" }
    ]
  }
});

const pulls = {
  en: ["Fear", "Pressure", "Self-doubt", "Regret", "Old story", "Another person's demand", "Comparison", "Something else"],
  es: ["Miedo", "Presión", "Duda de ti", "Arrepentimiento", "Una vieja historia", "La exigencia de otra persona", "Comparación", "Algo más"]
};

const relations = {
  en: ["Listen without obeying", "Set it down for now", "Question the demand", "Leave it undecided"],
  es: ["Escuchar sin obedecer", "Dejarlo por ahora", "Cuestionar la exigencia", "Dejarlo sin decidir"]
};

const doorways = [
  { id: "self", en: ["Self", "How you are meeting this.", "Who are you in the moment before choosing?"], es: ["Yo", "Cómo estás encontrando esto.", "¿Quién eres en el momento antes de elegir?"] },
  { id: "truth", en: ["Truth", "What is clear beneath the noise.", "What remains true when fear is not leading?"], es: ["Verdad", "Lo que está claro bajo el ruido.", "¿Qué sigue siendo verdad cuando el miedo no dirige?"] },
  { id: "relationship", en: ["Relationship", "The space between you and another.", "What would respect both people here?"], es: ["Relación", "El espacio entre tú y otra persona.", "¿Qué respetaría a ambas personas aquí?"] },
  { id: "action", en: ["Action", "The next honest movement.", "What is the smallest brave step available?"], es: ["Acción", "El próximo movimiento honesto.", "¿Cuál es el paso valiente más pequeño disponible?"] },
  { id: "unknown", en: ["Unknown", "What cannot be forced yet.", "What becomes possible if you do not rush the answer?"], es: ["Lo desconocido", "Lo que todavía no puede forzarse.", "¿Qué se vuelve posible si no apuras la respuesta?"] }
];

const crossFocuses = [
  { id: "self", glyph: "○", questionKey: "self", en: ["Self", "How you are meeting this."], es: ["Tú", "Cómo estás viviendo esto."] },
  { id: "body", glyph: "△", questionKey: "body", en: ["Body", "What is here in sensation."], es: ["Cuerpo", "Lo que está presente en la sensación."] },
  { id: "silence", glyph: "—", questionKey: "silence", en: ["Silence", "What is here without words."], es: ["Silencio", "Lo que está aquí sin palabras."] },
  { id: "relationship", glyph: "∞", questionKey: "relationship", en: ["Relation", "What is happening between."], es: ["Relación", "Lo que está ocurriendo entre ambos."] },
  { id: "shadow", glyph: "◑", questionKey: "shadow", en: ["Shadow", "What is not yet clear."], es: ["Sombra", "Lo que todavía no está claro."] },
  { id: "time", glyph: "⌛", questionKey: "time", en: ["Time", "What belongs to now."], es: ["Tiempo", "Lo que pertenece a este momento."] },
  { id: "unknown", glyph: "?", questionKey: "silence", en: ["The Unknown", "What can remain unknown."], es: ["Lo desconocido", "Lo que puede seguir sin saberse."] },
  { id: "control", glyph: "│", questionKey: "self", en: ["Control", "What you can hold or release."], es: ["Control", "Lo que puedes sostener o soltar."] },
  { id: "grief", glyph: "·", questionKey: "shadow", en: ["Grief", "What you are carrying."], es: ["Duelo", "Lo que estás llevando."] },
  { id: "desire", glyph: "◇", questionKey: "body", en: ["Desire", "What you want."], es: ["Deseo", "Lo que quieres."] },
  { id: "ending", glyph: "∩", questionKey: "time", en: ["Ending", "What may be complete."], es: ["Final", "Lo que quizá ya está completo."] }
];

const crossQuestions = {
  self: {
    en: ["What matters most in this moment?", "What is yours to choose here?", "What feels honest without explanation?", "What would be enough for now?"],
    es: ["¿Qué importa más en este momento?", "¿Qué te corresponde elegir aquí?", "¿Qué se siente honesto sin explicarlo?", "¿Qué sería suficiente por ahora?"]
  },
  body: {
    en: ["What sensation is clearest right now?", "Where do you notice ease or effort?", "What changes with one unforced breath?", "What does your body need less of?"],
    es: ["¿Qué sensación está más clara ahora?", "¿Dónde notas facilidad o esfuerzo?", "¿Qué cambia con una respiración sin forzar?", "¿De qué necesita menos tu cuerpo?"]
  },
  silence: {
    en: ["What can remain unanswered for now?", "What remains when you stop explaining?", "What do you notice in the quiet?", "What is here before words?"],
    es: ["¿Qué puede quedar sin respuesta por ahora?", "¿Qué queda cuando dejas de explicar?", "¿Qué notas en la quietud?", "¿Qué está aquí antes de las palabras?"]
  },
  relationship: {
    en: ["What would make this contact clearer?", "What wants to be said simply?", "What boundary or opening is needed?", "What can you offer without ignoring your own needs?"],
    es: ["¿Qué haría más claro este contacto?", "¿Qué quiere decirse con sencillez?", "¿Qué límite o apertura hace falta?", "¿Qué puedes ofrecer sin ignorar tus propias necesidades?"]
  },
  shadow: {
    en: ["What is difficult to name without judging it?", "What have you set aside for later?", "What becomes clearer when nothing is forced?", "What deserves a little more room?"],
    es: ["¿Qué cuesta nombrar sin juzgarlo?", "¿Qué has dejado para después?", "¿Qué se aclara cuando no fuerzas nada?", "¿Qué merece un poco más de espacio?"]
  },
  time: {
    en: ["What belongs to now?", "What can wait?", "What is ready for one next step?", "What may already be complete?"],
    es: ["¿Qué pertenece a este momento?", "¿Qué puede esperar?", "¿Qué está listo para un siguiente paso?", "¿Qué quizá ya está completo?"]
  }
};

const capacityFlows = {
  discern: [
    {
      en: ["What can you notice directly?", "Choose what you can observe without explaining why.", ["A body sensation", "A feeling", "A thought", "Something happening", "Nothing clear"]],
      es: ["¿Qué puedes notar directamente?", "Elige lo que puedes observar sin explicar por qué.", ["Una sensación corporal", "Un sentimiento", "Un pensamiento", "Algo que está ocurriendo", "Nada claro"]]
    },
    {
      en: ["What are you guessing or telling yourself?", "A thought can be here without being a fact.", ["A prediction", "A judgement", "A memory", "An explanation", "Nothing clear"]],
      es: ["¿Qué estás suponiendo o diciéndote?", "Un pensamiento puede estar aquí sin ser un hecho.", ["Una predicción", "Un juicio", "Un recuerdo", "Una explicación", "Nada claro"]]
    },
    {
      en: ["What remains honest now?", "Choose only what can guide the next moment.", ["Stay with what is here", "Seek one fact", "Wait before deciding", "Ask a clear question", "Uncertainty remains"]],
      es: ["¿Qué sigue siendo honesto ahora?", "Elige solo lo que puede guiar el próximo momento.", ["Quedarme con lo que hay", "Buscar un hecho", "Esperar antes de decidir", "Hacer una pregunta clara", "La incertidumbre continúa"]]
    }
  ],
  integrate: [
    {
      en: ["What else matters here?", "Body signals, feelings, limits, safety and other perspectives all count.", ["The body's signal", "A feeling", "Another perspective", "A practical limit", "A safety need", "Nothing more"]],
      es: ["¿Qué más importa aquí?", "Las señales del cuerpo, los sentimientos, los límites, la seguridad y otras perspectivas cuentan.", ["La señal del cuerpo", "Un sentimiento", "Otra perspectiva", "Un límite práctico", "Una necesidad de seguridad", "Nada más"]]
    },
    {
      en: ["What should not make the whole choice by itself?", "You can notice a signal without letting it decide everything.", ["Fear", "Urgency", "A familiar story", "Another person's demand", "The need to please", "Nothing is taking over"]],
      es: ["¿Qué no debería tomar toda la decisión por sí solo?", "Puedes notar una señal sin dejar que lo decida todo.", ["El miedo", "La urgencia", "Una historia conocida", "La exigencia de otra persona", "La necesidad de agradar", "Nada está tomando el control"]]
    },
    {
      en: ["What will you carry forward?", "Choose one response that respects everything you included.", ["Protect the boundary", "Seek support", "Consider a repair", "Rest before acting", "Take one safe step", "Finish here"]],
      es: ["¿Qué llevarás contigo?", "Elige una respuesta que respete todo lo que incluiste.", ["Proteger el límite", "Buscar apoyo", "Considerar una reparación", "Descansar antes de actuar", "Dar un paso seguro", "Terminar aquí"]]
    }
  ]
};

const tones = [
  { id: "love", hz: 528, color: "#d39aa4", en: "Love", es: "Amor" },
  { id: "peace", hz: 432, color: "#84b7a2", en: "Peace", es: "Paz" },
  { id: "wonder", hz: 963, color: "#7e92e8", en: "Wonder", es: "Asombro" },
  { id: "courage", hz: 396, color: "#ca825a", en: "Courage", es: "Valentía" },
  { id: "gratitude", hz: 417, color: "#d6a95e", en: "Gratitude", es: "Gratitud" },
  { id: "compassion", hz: 594, color: "#c68daf", en: "Compassion", es: "Compasión" },
  { id: "trust", hz: 285, color: "#83b79a", en: "Trust", es: "Confianza" },
  { id: "clarity", hz: 741, color: "#82b5d2", en: "Clarity", es: "Claridad" },
  { id: "stillness", hz: 174, color: "#a4b8c6", en: "Stillness", es: "Quietud" },
  { id: "patience", hz: 324, color: "#9baac8", en: "Patience", es: "Paciencia" },
  { id: "hope", hz: 639, color: "#9e97e5", en: "Hope", es: "Esperanza" },
  { id: "forgiveness", hz: 528, color: "#bfa76a", en: "Forgiveness", es: "Perdón" },
  { id: "strength", hz: 396, color: "#7f8ae7", en: "Strength", es: "Fortaleza" },
  { id: "joy", hz: 852, color: "#e59158", en: "Joy", es: "Alegría" }
];

const fields = [
  { n: 1, color: "#d8c49a", en: ["Presence", "Direct contact with reality", "none", "existence, stillness, grounding and direct contact with reality", "Feel your feet and name three things you can see."], es: ["Presencia", "Contacto directo con la realidad", "ninguno", "existencia, quietud, arraigo y contacto directo con la realidad", "Siente tus pies y nombra tres cosas que puedes ver."] },
  { n: 2, color: "#b9c989", en: ["Vitality", "Life moving through the body", "Presence", "instinct, movement, desire, sensation and life-force", "Move in the way your body is quietly asking for."], es: ["Vitalidad", "La vida moviéndose en el cuerpo", "Presencia", "instinto, movimiento, deseo, sensación y fuerza vital", "Muévete de la manera que tu cuerpo pide suavemente."] },
  { n: 3, color: "#d8b45a", en: ["Sovereignty", "The freedom and duty to choose", "Presence and Vitality", "agency, boundaries, responsibility, individuality and choice", "Name one clear yes and one clear no."], es: ["Soberanía", "La libertad y responsabilidad de elegir", "Presencia y Vitalidad", "agencia, límites, responsabilidad, individualidad y elección", "Nombra un sí claro y un no claro."] },
  { n: 4, color: "#9ebdd2", en: ["Discernment", "Perspective with emotional clarity", "Presence, Vitality and Sovereignty", "perspective, emotional clarity, symbolic perception, interpretation and intuition with discernment", "Write one fact and one interpretation."], es: ["Discernimiento", "Perspectiva con claridad emocional", "Presencia, Vitalidad y Soberanía", "perspectiva, claridad emocional, percepción simbólica, interpretación e intuición con discernimiento", "Escribe un hecho y una interpretación."] },
  { n: 5, color: "#86b7ad", en: ["Participation", "Contributing to the wider field", "Presence, Vitality, Sovereignty and Discernment", "conscious participation, responsibility, contribution, coherence and awareness of the wider field", "Choose one action that helps more than only you."], es: ["Participación", "Contribuir al campo más amplio", "Presencia, Vitalidad, Soberanía y Discernimiento", "participación consciente, responsabilidad, contribución, coherencia y conciencia del campo más amplio", "Elige una acción que ayude a más personas, no solo a ti."] },
  { n: 6, color: "#b8a5cc", en: ["Integration", "Holding many truths in relationship", "all earlier Fields", "multiple perspectives, relational intelligence, nonlinear understanding and the capacity to integrate apparent opposites without losing local grounding", "Let two different truths sit together without forcing either away."], es: ["Integración", "Sostener muchas verdades en relación", "todos los Campos anteriores", "múltiples perspectivas, inteligencia relacional, comprensión no lineal y capacidad de integrar aparentes opuestos sin perder el arraigo local", "Deja que dos verdades diferentes estén juntas sin expulsar ninguna."] },
  { n: 7, color: "#f0dca2", en: ["Unity", "Wholeness without erasing difference", "all earlier Fields", "wholeness, service, collective consciousness and participation in the larger whole without erasing individuality", "Offer one particular gift in service to the whole."], es: ["Unidad", "Totalidad sin borrar la diferencia", "todos los Campos anteriores", "totalidad, servicio, conciencia colectiva y participación en el conjunto sin borrar la individualidad", "Ofrece un don particular al servicio del conjunto."] }
];

const teachings = [
  {
    id: "golden-age", icon: "✦",
    en: { title: "The Golden Age", line: "A tone we practise now", sections: [["An orientation", "The Golden Age is not a prediction or a belief you must accept. It is an orientation toward clarity, compassion, courage, creativity, responsibility and reverence for life."], ["How it begins", "It begins whenever clarity becomes action, compassion becomes relationship, courage becomes movement, creativity becomes contribution and responsibility becomes the way we live."], ["A simple test", "Ask: would this choice belong in a civilisation that helps people return to their own attention and agency?"]] },
    es: { title: "La Edad Dorada", line: "Un tono que practicamos ahora", sections: [["Una orientación", "La Edad Dorada no es una predicción ni una creencia obligatoria. Es una orientación hacia la claridad, la compasión, la valentía, la creatividad, la responsabilidad y la reverencia por la vida."], ["Cómo comienza", "Comienza cuando la claridad se vuelve acción, la compasión se vuelve relación, la valentía se vuelve movimiento, la creatividad se vuelve contribución y la responsabilidad se vuelve nuestra forma de vivir."], ["Una prueba sencilla", "Pregunta: ¿esta elección pertenecería a una civilización que ayuda a las personas a recuperar su atención y su capacidad de elegir?"]] }
  },
  {
    id: "nested-fields", icon: "≋",
    en: { title: "The Principle of Nested Fields", line: "Growth carries earlier gifts forward", sections: [["Not a ladder", "The Seven Fields are not levels that replace one another. They are increasingly inclusive ways of participating in reality."], ["Carry forward", "Presence remains essential within Unity. Vitality remains alive within Participation. Sovereignty remains necessary within Integration."], ["Return when needed", "A broad idea may need grounding. Care for the whole may need a clear boundary. Growth includes returning to the gift that this moment needs."]] },
    es: { title: "El principio de los Campos Anidados", line: "Crecer conserva los dones anteriores", sections: [["No es una escalera", "Los Siete Campos no son niveles que reemplazan a los anteriores. Son formas cada vez más inclusivas de participar en la realidad."], ["Conservar", "La Presencia sigue siendo esencial dentro de la Unidad. La Vitalidad sigue viva dentro de la Participación. La Soberanía sigue siendo necesaria dentro de la Integración."], ["Volver cuando hace falta", "Una idea amplia puede necesitar arraigo. El cuidado del conjunto puede necesitar un límite claro. Crecer incluye volver al don que este momento necesita."]] }
  },
  {
    id: "form", icon: "◇",
    en: { title: "Equivalence of Form", line: "The way we act shapes what we build", sections: [["Form matters", "A peaceful aim pursued through force carries the form of force. A free future built through control carries the form of control."], ["Practise the future", "Try to let the quality of the future appear in the way you move toward it now."], ["Ask", "Does the way I am doing this match the world I hope to help create?"]] },
    es: { title: "Equivalencia de la forma", line: "La manera de actuar da forma a lo que creamos", sections: [["La forma importa", "Una meta pacífica perseguida a la fuerza lleva la forma de la fuerza. Un futuro libre construido mediante control lleva la forma del control."], ["Practicar el futuro", "Intenta que la cualidad del futuro aparezca en la manera en que avanzas hacia él ahora."], ["Pregunta", "¿La manera en que hago esto coincide con el mundo que espero ayudar a crear?"]] }
  },
  {
    id: "coherence", icon: "∴",
    en: { title: "Coherence", line: "Many parts in honest relationship", sections: [["Not sameness", "Coherence does not erase different feelings, thoughts or needs. It lets them communicate without allowing one part to rule the whole."], ["Sovereignty", "Sovereignty is not one part conquering the others. It is the capacity of the whole field to listen, choose and act."], ["Practise", "Let two different parts of you speak. Then choose a response large enough to respect what each is protecting."]] },
    es: { title: "Coherencia", line: "Muchas partes en relación honesta", sections: [["No es uniformidad", "La coherencia no borra sentimientos, pensamientos o necesidades diferentes. Les permite comunicarse sin que una parte gobierne el conjunto."], ["Soberanía", "La soberanía no es una parte conquistando a las otras. Es la capacidad del campo completo para escuchar, elegir y actuar."], ["Práctica", "Deja hablar a dos partes diferentes de ti. Luego elige una respuesta lo bastante amplia para respetar lo que cada una protege."]] }
  },
  {
    id: "imagination", icon: "◯",
    en: { title: "Imagination and Form", line: "Possibility meets a real boundary", sections: [["Two gifts", "Imagination opens possibility. Form gives possibility a shape that can be experienced, tested and shared."], ["No denial", "Creating does not mean pretending limits, feelings or other people's choices do not exist. It means participating honestly within reality."], ["Bring it to life", "Join thought, feeling and action. A vision becomes trustworthy when these begin to move together."]] },
    es: { title: "Imaginación y forma", line: "La posibilidad encuentra un límite real", sections: [["Dos dones", "La imaginación abre posibilidades. La forma les da una figura que puede vivirse, probarse y compartirse."], ["Sin negación", "Crear no significa fingir que no existen los límites, los sentimientos o las elecciones de otras personas. Significa participar con honestidad dentro de la realidad."], ["Llevarlo a la vida", "Une pensamiento, sentimiento y acción. Una visión se vuelve confiable cuando comienzan a moverse juntos."]] }
  },
  {
    id: "inclusion", icon: "◎",
    en: { title: "The Principle of Inclusion", line: "Include before transcending", sections: [["Carry the healthy gift", "Every wider consciousness includes and reorganises the healthy expression of what came before."], ["Stay whole", "Expansion without inclusion becomes fragmentation. Integration allows earlier gifts to remain alive within broader participation."], ["Remember", "Body before cosmology. Boundaries within unity. The whole acts through the particular."]] },
    es: { title: "El principio de inclusión", line: "Incluir antes de trascender", sections: [["Conservar el don sano", "Cada forma más amplia de conciencia incluye y reorganiza la expresión sana de lo anterior."], ["Conservar la totalidad", "La expansión sin inclusión se vuelve fragmentación. La integración permite que los dones anteriores sigan vivos dentro de una participación más amplia."], ["Recuerda", "El cuerpo antes que la cosmología. Límites dentro de la unidad. El conjunto actúa a través de lo particular."]] }
  }
];

const acts = [
  ["Truth in attention", "Write the facts of one situation without interpretation, then pause.", "Verdad en la atención", "Escribe los hechos de una situación sin interpretarlos y luego haz una pausa."],
  ["A clean yes", "Say yes to one thing you genuinely have room for.", "Un sí limpio", "Di sí a algo para lo que realmente tienes espacio."],
  ["A kind no", "Decline one request without attacking yourself or the other person.", "Un no amable", "Rechaza una petición sin atacarte ni atacar a la otra persona."],
  ["Repair one thread", "Make one honest apology without explaining it away.", "Reparar un hilo", "Haz una disculpa honesta sin justificarla."],
  ["Give full attention", "Listen to one person without preparing your reply.", "Dar atención completa", "Escucha a una persona sin preparar tu respuesta."],
  ["Create one small thing", "Make something today that did not exist this morning.", "Crear algo pequeño", "Haz hoy algo que no existía esta mañana."],
  ["Care for the shared world", "Leave one place better than you found it.", "Cuidar el mundo compartido", "Deja un lugar mejor de como lo encontraste."],
  ["Move life-force", "Give ten minutes to the work that keeps calling you.", "Mover la fuerza vital", "Dedica diez minutos al trabajo que sigue llamándote."],
  ["Choose enough", "Stop one task when it is truly complete enough.", "Elegir lo suficiente", "Detén una tarea cuando esté suficientemente completa."],
  ["Return to the body", "Drink water slowly and feel your feet on the ground.", "Volver al cuerpo", "Bebe agua lentamente y siente tus pies en el suelo."],
  ["Name the good", "Tell someone one precise thing you appreciate about them.", "Nombrar lo bueno", "Dile a alguien algo preciso que aprecias de esa persona."],
  ["Make room", "Clear one small space so it can serve what matters now.", "Hacer espacio", "Despeja un lugar pequeño para que sirva a lo que importa ahora."],
  ["Ask before assuming", "Replace one guess about another person with a respectful question.", "Preguntar antes de suponer", "Reemplaza una suposición sobre otra persona con una pregunta respetuosa."],
  ["Protect the quiet", "Give yourself five minutes without input.", "Proteger el silencio", "Date cinco minutos sin recibir información."],
  ["Share a resource", "Offer time, knowledge or an object where it can genuinely help.", "Compartir un recurso", "Ofrece tiempo, conocimiento u objeto donde pueda ayudar de verdad."],
  ["Take the next honest step", "Do the smallest action that makes your intention real.", "Dar el siguiente paso honesto", "Haz la acción más pequeña que vuelva real tu intención."],
  ["Let joy count", "Choose one harmless thing because it brings aliveness.", "Dejar que la alegría cuente", "Elige algo inofensivo porque trae vitalidad."],
  ["Check the form", "Ask whether your method matches the future you want.", "Revisar la forma", "Pregunta si tu método coincide con el futuro que deseas."],
  ["Include another view", "Describe a view you disagree with fairly before responding.", "Incluir otra mirada", "Describe con justicia una mirada con la que no estás de acuerdo antes de responder."],
  ["Rest without earning it", "Take a short rest because bodies need care, not as a reward.", "Descansar sin ganarlo", "Descansa un momento porque el cuerpo necesita cuidado, no como recompensa."]
];

const aboutText = {
  en: `Welcome to Tone Sovereign.

Reality is shaped not only by what happens, but by how we meet it.

Your tone is the quality you bring to that meeting: the way your awareness, inner depth and choices take form through you. Fear may be present while your tone is courage. Grief may be present while your tone is tenderness. Tone is not about controlling what you feel. It is about choosing how you relate, respond and participate.

Tone Sovereign is a practice of conscious participation: a place to notice what is present, restore steadiness, discern clearly, reclaim your freedom to choose, cross a meaningful threshold, embody a quality large enough to hold the moment and carry that chosen tone into your life.

A Golden Age is not simply a future we wait for. It begins whenever clarity becomes action, compassion becomes relationship, courage becomes movement, creativity becomes contribution and responsibility becomes the way we live.

Nothing here stands above your own discernment. Every practice is an invitation. Every insight is yours to test. Use what helps. Leave what does not.

You remain the one who chooses.

Choose the tone of a Golden Age.`,
  es: `Bienvenido a Tone Sovereign.

La realidad toma forma no solo por lo que ocurre, sino por cómo la encontramos.

Tu tono es la cualidad que llevas a ese encuentro: la manera en que tu atención, tu profundidad interior y tus elecciones toman forma a través de ti. El miedo puede estar presente mientras tu tono es la valentía. El dolor puede estar presente mientras tu tono es la ternura. El tono no consiste en controlar lo que sientes. Consiste en elegir cómo te relacionas, respondes y participas.

Tone Sovereign es una práctica de participación consciente: un lugar para notar lo que está presente, recuperar estabilidad, discernir con claridad, recobrar tu libertad de elegir, cruzar un umbral significativo, encarnar una cualidad lo bastante amplia para sostener el momento y llevar ese tono elegido a tu vida.

Una Edad Dorada no es simplemente un futuro que esperamos. Comienza cuando la claridad se vuelve acción, la compasión se vuelve relación, la valentía se vuelve movimiento, la creatividad se vuelve contribución y la responsabilidad se vuelve nuestra forma de vivir.

Nada aquí está por encima de tu propio discernimiento. Cada práctica es una invitación. Cada idea es tuya para poner a prueba. Usa lo que ayuda. Deja lo que no.

Tú sigues siendo quien elige.

Elige el tono de una Edad Dorada.`
};

const symbolText = {
  en: {
    title: "The Tone Sovereign Symbol",
    intro: "Three forms. One living practice.",
    sections: [
      ["The Sword", "Discernment", "The sword represents the capacity to cut through confusion, recognise what is shaping the present moment and distinguish what is true from what merely has influence. It is not a symbol of domination. Its power is clarity. Sovereignty begins with seeing clearly."],
      ["The Circle", "Wholeness", "The circle represents the larger field of awareness. Thoughts, emotions, sensations, memories and circumstances all belong within experience, but none need rule it. Wholeness is not perfection. It is the capacity to include without becoming divided."],
      ["The Triskelion", "Living Sovereignty", "The triskelion represents movement, cycles and continual becoming. Here it means Living Sovereignty, renewed through awareness, integration and conscious participation. Sovereignty is practised, not permanently attained."],
      ["Together", "Centre · wholeness · movement", "The sword gives the symbol its centre. The circle gives it wholeness. The triskelion gives it movement. Together they represent a sovereignty that is centred without rigidity, whole without perfection and alive through conscious participation."]
    ],
    closing: "Discern clearly. Hold the whole. Participate consciously.\n\nEvery moment offers another opportunity to choose the tone through which you meet the world."
  },
  es: {
    title: "El símbolo de Tone Sovereign",
    intro: "Tres formas. Una práctica viva.",
    sections: [
      ["La espada", "Discernimiento", "La espada representa la capacidad de atravesar la confusión, reconocer qué está dando forma al momento presente y distinguir lo verdadero de aquello que solo tiene influencia. No es un símbolo de dominación. Su poder es la claridad. La soberanía comienza al ver con claridad."],
      ["El círculo", "Totalidad", "El círculo representa el campo más amplio de la atención. Pensamientos, emociones, sensaciones, recuerdos y circunstancias pertenecen a la experiencia, pero ninguno necesita gobernarla. La totalidad no es perfección. Es la capacidad de incluir sin dividirnos."],
      ["El trisquel", "Soberanía viva", "El trisquel representa movimiento, ciclos y un continuo devenir. Aquí significa Soberanía Viva, renovada mediante atención, integración y participación consciente. La soberanía se practica; no se alcanza para siempre."],
      ["Juntos", "Centro · totalidad · movimiento", "La espada da centro al símbolo. El círculo le da totalidad. El trisquel le da movimiento. Juntos representan una soberanía centrada sin rigidez, completa sin perfección y viva mediante la participación consciente."]
    ],
    closing: "Discierne con claridad. Sostén el conjunto. Participa conscientemente.\n\nCada momento ofrece otra oportunidad para elegir el tono con el que encuentras el mundo."
  }
};

const canonicalCatalogs = window.TONE_SOVEREIGN_CATALOGS;
if (!canonicalCatalogs?.en || !canonicalCatalogs?.es) {
  throw new Error("Tone Sovereign catalog did not load.");
}

const catalogFor = language => canonicalCatalogs[language === "es" ? "es" : "en"];
const phrase = (english, spanish) => state.lang === "es" ? spanish : english;
const readableTag = value => String(value || "")
  .replaceAll("-", " ")
  .replace(/\b\w/g, letter => letter.toUpperCase());
const spanishTagLabels = {
  "1d-presence": "1D · Presencia", "2d-vitality": "2D · Vitalidad", "3d-sovereignty": "3D · Soberanía", "4d-discernment": "4D · Discernimiento", "5d-participation": "5D · Participación", "6d-integration": "6D · Integración", "7d-unity": "7D · Unidad",
  attention: "Atención", congruence: "Congruencia", "conscious-intake": "Recepción consciente", "cultural-sovereignty": "Soberanía cultural", dreams: "Sueños", "embodied-expression": "Expresión encarnada", embodiment: "Encarnación", "emergent-pathways": "Caminos emergentes", emotion: "Emoción", "field-stewardship": "Cuidado del campo", "full-arrival": "Llegada plena", "golden-age": "Edad Dorada", identity: "Identidad", meditation: "Meditación", perception: "Percepción", relationships: "Relaciones", shadow: "Sombra", "sustainable-service": "Servicio sostenible",
  alignment: "Alineación", "body-care": "Cuidado del cuerpo", "cultural-discernment": "Discernimiento cultural", "field-regulation": "Regulación del campo", focus: "Enfoque", "independent-thought": "Pensamiento independiente", "information-boundary": "Límite de información", "next-step": "Próximo paso", presence: "Presencia", rest: "Descanso",
  alone: "A solas", "creative-project": "Proyecto creativo", group: "Grupo", online: "En línea", relationship: "Relación", "sleep-threshold": "Antes de dormir", work: "Trabajo",
  beauty: "Belleza", cooperation: "Cooperación", courage: "Valentía", creativity: "Creatividad", dignity: "Dignidad", kindness: "Amabilidad", repair: "Reparación", restraint: "Moderación", service: "Servicio", truth: "Verdad",
  body: "Cuerpo", "chosen-connection": "Conexión elegida", "daily-task": "Tarea cotidiana", "digital-life": "Vida digital", "immediate-space": "Espacio cercano", "inner-attention": "Atención interior", "shared-world": "Mundo compartido",
  small: "Pequeño", spacious: "Espacioso", steady: "Constante", notice: "Notar", stabilise: "Estabilizar", discern: "Discernir", reclaim: "Recuperar", cross: "Cruzar", embody: "Encarnar", integrate: "Integrar"
};
const tagLabel = value => state.lang === "es" ? (spanishTagLabels[value] || readableTag(value)) : readableTag(value);

function contentByID(collection, id) {
  return collection.find(item => item.id === id) || collection[0];
}

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

const savedPreferences = readJSON(STORAGE.preferences, {});
const state = {
  view: "landing",
  stack: [],
  lang: savedPreferences.lang === "es" ? "es" : "en",
  sound: savedPreferences.sound !== false,
  voice: savedPreferences.voice !== false,
  reduceMotion: Boolean(savedPreferences.reduceMotion),
  quietWords: savedPreferences.quietWords !== false,
  ceremonyKey: 1,
  ceremonySettled: false,
  ceremonyEntryReady: false,
  resetConfirmationOpen: false,
  resetError: "",
  selectedField: "1d-presence",
  selectedTeaching: "golden-age",
  selectedLaw: "law-01",
  selectedPrinciple: "principle-01",
  selectedEntry: "separate-event-from-interpretation",
  selectedPath: "manifestation-as-participation",
  selectedEngine: "congruence-compass",
  selectedMission: "",
  foundationMode: "laws",
  foundationVisibleCount: 10,
  libraryMode: "",
  libraryQuery: "",
  libraryField: "all",
  libraryDomain: "all",
  libraryNeed: "all",
  libraryVisibleCount: 8,
  selectedComicSeries: "mainline",
  selectedComicIssue: 1,
  comicPage: 1,
  teachingDepth: 1,
  showFullTeaching: false,
  showAllPractices: false,
  guidedSit: newGuidedSit(),
  guidedKind: "",
  guidedPhase: 0,
  engineStep: 0,
  engineDuration: 2,
  engineResponses: {},
  engineComplete: false,
  actIndex: Number(localStorage.getItem(STORAGE.carriedAct) || 0) % canonicalCatalogs.en.sovereignActs.length,
  actQuality: "all",
  actContext: "all",
  actEffort: "all",
  ruleOfLife: readJSON(STORAGE.ruleOfLife, { principleIDs: [], commitmentIDs: [] }),
  engineDrafts: readJSON(STORAGE.engineDrafts, {}),
  missions: readJSON(STORAGE.missions, []),
  missionDraft: { title: "", direction: "", nextVisibleStep: "", sustainabilityNote: "", principleID: "" },
  traces: readJSON(STORAGE.traces, []),
  toast: "",
  practice: newPractice()
};

function newPractice() {
  const rememberedTone = localStorage.getItem(STORAGE.lastHeldTone) || "";
  const rememberedToneDefinition = tones.find(item => item.id === rememberedTone);
  return {
    index: 0,
    movement: "",
    sequence: false,
    stage: "",
    interrupted: false,
    interruptedAt: 0,
    capacityStep: 0,
    capacityAnswers: [],
    selectedOption: "",
    noticeStarted: false,
    noticeStartedAt: 0,
    noticeCue: 0,
    noticeManualCue: -1,
    noticeManualUntil: 0,
    noticeLastManualCue: -1,
    noticeDuration: 60,
    guidance: "quiet",
    noticeOutcome: "",
    noticeAcknowledged: false,
    steadyExpanded: false,
    steadyState: "",
    breathPattern: "",
    breathStartedAt: 0,
    breathDuration: STABILISE.duration,
    facts: "",
    story: "",
    pull: "",
    pendingPull: "",
    reclaimHolding: false,
    reclaimComplete: false,
    relation: "",
    customPull: "",
    doorway: "self",
    questionSaved: false,
    crossFocus: "self",
    crossExpanded: false,
    crossQuestion: 0,
    crossRecent: [],
    crossSaved: false,
    crossCrossed: false,
    crossRemaining: false,
    tone: rememberedToneDefinition?.id || "",
    embodyStage: "choose",
    frequency: rememberedToneDefinition?.hz || 432,
    amplitude: 34,
    tonePlaying: false,
    act: "",
    reflection: ""
  };
}

function newGuidedSit() {
  const allowedDurations = guidedSitsManifest.durationsSeconds || [900, 1800, 2700, 3600];
  const savedDuration = Number(savedPreferences.guidedSitDuration);
  const savedGuidance = ["regular", "light", "off"].includes(savedPreferences.guidedSitGuidance)
    ? savedPreferences.guidedSitGuidance
    : "regular";
  const savedBackgroundTone = savedPreferences.guidedSitBackgroundTone === true;
  const savedIntroduction = savedPreferences.guidedSitIntroduction !== false;
  return {
    selectedID: "",
    phase: "catalog",
    duration: allowedDurations.includes(savedDuration) ? savedDuration : allowedDurations[0],
    guidance: savedGuidance,
    backgroundTone: savedBackgroundTone,
    introduction: savedIntroduction,
    introductionPlaying: false,
    elapsed: 0,
    paused: false,
    lastCueIndex: -1,
    lastTickAt: 0
  };
}

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");
const canvas = document.querySelector("#ambient-field");
const ctx = canvas.getContext("2d", { alpha: true });
let ceremonyTimer = 0;
let ceremonyEntryTimer = 0;
let practiceTimer = 0;
let guidedSitTimer = 0;
let toastTimer = 0;
let fieldFrame = 0;
let breathLastPhaseKey = "";
let reclaimHoldTimer = 0;
let comicSwipeStart = null;

const tr = key => copy[state.lang][key] || key;
const local = item => item[state.lang];

class SoundEngine {
  constructor() {
    this.context = null;
    this.nodes = new Set();
    this.master = null;
    this.bufferCache = new Map();
    this.voiceSource = null;
    this.voiceToken = 0;
    this.firstLightSources = [];
    this.breathDrone = null;
    this.breathDroneGain = null;
    this.guidedSitAmbient = null;
    this.guidedSitAmbientGeneration = 0;
  }

  async ready() {
    if (!this.context || this.context.state === "closed") {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.context.createGain();
      this.master.gain.value = 0.82;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") await this.context.resume();
    return this.context;
  }

  stop() {
    this.stopTones();
    this.stopVoice();
    this.stopFirstLight();
  }

  stopTones() {
    this.guidedSitAmbientGeneration += 1;
    this.nodes.forEach(node => { try { node.stop(); } catch {} });
    this.nodes.clear();
    this.breathDrone = null;
    this.breathDroneGain = null;
    this.guidedSitAmbient = null;
  }

  stopVoice() {
    this.voiceToken += 1;
    this.setGuidedSitAmbientDucked(false);
    if (!this.voiceSource) return;
    try { this.voiceSource.stop(); } catch {}
    this.voiceSource = null;
  }

  stopFirstLight() {
    this.firstLightSources.forEach(({ source }) => {
      try { source.stop(); } catch {}
    });
    this.firstLightSources = [];
  }

  async loadBuffer(url, context = this.context) {
    if (this.bufferCache.has(url)) return this.bufferCache.get(url);
    const request = fetch(url, { cache: "force-cache" })
      .then(response => {
        if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then(bytes => context.decodeAudioData(bytes));
    this.bufferCache.set(url, request);
    try {
      return await request;
    } catch (error) {
      this.bufferCache.delete(url);
      throw error;
    }
  }

  voiceURL(cue, language = state.lang) {
    return `${ROOT}assets/voice/${language}/${cue}.mp3`;
  }

  async prepareFirstLight() {
    const context = await this.ready();
    const requests = [];
    if (state.sound) {
      requests.push(this.loadBuffer(`${ROOT}assets/sound/ts_first_light_arrival_full.wav`, context));
      requests.push(this.loadBuffer(`${ROOT}assets/sound/ts_first_light_living_ambience.wav`, context));
    }
    if (state.voice) requests.push(this.loadBuffer(this.voiceURL("ts_first_light_tagline_v1"), context));
    await Promise.all(requests);
    return context;
  }

  async prepareVoiceCues(cues) {
    const context = await this.ready();
    const language = state.lang;
    await Promise.all(cues.map(cue => this.loadBuffer(this.voiceURL(cue, language), context)));
    return context;
  }

  scheduleBuffer(buffer, when, gainValue, { loop = false, firstLight = false } = {}) {
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.setValueAtTime(gainValue, when);
    source.connect(gain).connect(this.master);
    source.start(when);
    if (firstLight) {
      this.firstLightSources.push({ source, gain });
      source.addEventListener("ended", () => {
        this.firstLightSources = this.firstLightSources.filter(item => item.source !== source);
      });
    }
    return { source, gain };
  }

  async playVoice(cue, delay = 0, onEnded = null) {
    if (!state.voice) return false;
    const requestedAt = Date.now();
    this.stopVoice();
    const token = this.voiceToken;
    const language = state.lang;
    const context = await this.ready();
    const buffer = await this.loadBuffer(this.voiceURL(cue, language), context);
    if (!state.voice || token !== this.voiceToken || language !== state.lang) return false;
    this.setGuidedSitAmbientDucked(true);
    const remainingDelay = Math.max(0, delay - ((Date.now() - requestedAt) / 1000));
    const { source } = this.scheduleBuffer(buffer, context.currentTime + remainingDelay, 0.86);
    this.voiceSource = source;
    source.addEventListener("ended", () => {
      if (this.voiceSource === source) {
        this.voiceSource = null;
        this.setGuidedSitAmbientDucked(false);
        if (typeof onEnded === "function") onEnded();
      }
    });
    return true;
  }

  note(frequency, when, duration, gain = 0.035, type = "sine", endFrequency = null) {
    const context = this.context;
    if (!context || !this.master) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, when + duration * 0.82);
    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.exponentialRampToValueAtTime(gain, when + Math.min(.45, duration * .2));
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(envelope).connect(this.master);
    oscillator.start(when);
    oscillator.stop(when + duration + .05);
    this.nodes.add(oscillator);
    oscillator.addEventListener("ended", () => this.nodes.delete(oscillator));
  }

  async ceremony(includeVoice = false) {
    this.stop();
    if (!state.sound && !(state.voice && includeVoice)) return;
    const context = await this.prepareFirstLight();
    const start = context.currentTime + 0.06;

    if (state.sound) {
      const [arrival, ambience] = await Promise.all([
        this.loadBuffer(`${ROOT}assets/sound/ts_first_light_arrival_full.wav`, context),
        this.loadBuffer(`${ROOT}assets/sound/ts_first_light_living_ambience.wav`, context)
      ]);
      const arrivalNode = this.scheduleBuffer(arrival, start, 0.52, { firstLight: true });
      arrivalNode.gain.gain.setValueAtTime(0.52, start + FIRST_LIGHT.voiceDelay - 0.30);
      arrivalNode.gain.gain.linearRampToValueAtTime(0.125, start + FIRST_LIGHT.voiceDelay);

      const ambienceNode = this.scheduleBuffer(
        ambience,
        start + FIRST_LIGHT.ambienceDelay,
        state.voice && includeVoice ? 0.0125 : 0.052,
        { loop: true, firstLight: true }
      );
      if (state.voice && includeVoice) {
        ambienceNode.gain.gain.setValueAtTime(0.0125, start + FIRST_LIGHT.voiceDelay + 4.08);
        ambienceNode.gain.gain.linearRampToValueAtTime(0.052, start + FIRST_LIGHT.voiceDelay + 4.80);
      }
    }

    if (state.voice && includeVoice) {
      const buffer = await this.loadBuffer(this.voiceURL("ts_first_light_tagline_v1"), context);
      const { source } = this.scheduleBuffer(buffer, start + FIRST_LIGHT.voiceDelay, 0.86);
      this.voiceSource = source;
      source.addEventListener("ended", () => {
        if (this.voiceSource === source) this.voiceSource = null;
      });
    }
  }

  async startBreathPattern(patternKey) {
    if (!state.sound) return;
    await this.ready();
    this.stopTones();
    const droneSettings = {
      anapana: { frequency: 110, gain: .045 },
      coherent: { frequency: 120, gain: .05 },
      extended: { frequency: 98, gain: .04 },
      physiological: { frequency: 130, gain: .04 }
    }[patternKey];
    if (!droneSettings) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(droneSettings.frequency, now);
    filter.type = "lowpass";
    filter.frequency.value = 800;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(droneSettings.gain, now + 1.5);
    oscillator.connect(filter).connect(gain).connect(this.master);
    oscillator.start(now);
    this.nodes.add(oscillator);
    this.breathDrone = oscillator;
    this.breathDroneGain = gain;
    oscillator.addEventListener("ended", () => this.nodes.delete(oscillator));
  }

  async breathPhase(patternKey, phaseType) {
    if (!state.sound || phaseType === "observe") return;
    await this.ready();
    const now = this.context.currentTime;
    if (patternKey === "coherent" && this.breathDrone) {
      const target = phaseType === "in" ? 140 : 100;
      this.breathDrone.frequency.cancelScheduledValues(now);
      this.breathDrone.frequency.setValueAtTime(this.breathDrone.frequency.value, now);
      this.breathDrone.frequency.linearRampToValueAtTime(target, now + 5.5);
      return;
    }
    const frequency = { in: 330, out: 220, hold: 275, hold2: 275, in2: 392 }[phaseType] || 280;
    this.note(frequency, now, .6, .07, "sine");
    this.note(frequency * 2, now, .4, .025, "sine");
  }

  async tone(frequency, amplitude) {
    if (!state.sound) return;
    await this.ready();
    this.stopTones();
    const now = this.context.currentTime;
    this.note(frequency, now, 80, Math.max(.012, amplitude / 1500));
    this.note(frequency * 1.5, now + .05, 80, Math.max(.006, amplitude / 3100));
  }

  async threshold() {
    if (!state.sound) return;
    await this.ready();
    this.stopTones();
    const now = this.context.currentTime;
    this.note(174, now, 50, .018);
    this.note(261.63, now + .2, 50, .009);
  }

  async thresholdCrossing() {
    if (!state.sound) return;
    await this.ready();
    const now = this.context.currentTime;
    this.note(261.63, now, 1.8, .065, "sine", 392);
    this.note(392, now + .16, 2.1, .045, "sine", 523.25);
    this.note(784, now + .42, 1.25, .018);
  }

  async guidedSitBell(closing = false) {
    if (!state.sound) return;
    await this.ready();
    const now = this.context.currentTime;
    const root = closing ? 293.66 : 392;
    const duration = closing ? 2.8 : 2.2;
    const ratios = closing ? [1, 1.5, 2, 3] : [1, 2, 3, 4];
    ratios.forEach((ratio, index) => {
      this.note(root * ratio, now + index * .025, duration * (1 - index * .08), .045 / (index + 1), "sine");
    });
  }

  guidedSitAmbientProfile(practiceID) {
    return {
      "breath-at-the-threshold": { root: 110.00, gain: .014 },
      "simple-noting": { root: 146.83, gain: .011 },
      "the-living-body": { root: 98.00, gain: .014 },
      "open-field": { root: 130.81, gain: .010 },
      "golden-age-goodwill": { root: 174.61, gain: .010 },
      "holding-opposites": { root: 123.47, gain: .011 },
      "sovereign-rest": { root: 87.31, gain: .013 }
    }[practiceID] || null;
  }

  async startGuidedSitAmbient(practiceID) {
    const profile = this.guidedSitAmbientProfile(practiceID);
    if (!state.sound || !state.guidedSit.backgroundTone || !profile) return;
    if (this.guidedSitAmbient?.practiceID === practiceID) return;
    this.stopGuidedSitAmbient(true);
    const generation = this.guidedSitAmbientGeneration;
    const context = await this.ready();
    if (!state.sound || !state.guidedSit.backgroundTone
      || generation !== this.guidedSitAmbientGeneration
      || state.view !== "guidedSits"
      || state.guidedSit.phase !== "session"
      || state.guidedSit.selectedID !== practiceID
      || !this.guidedSitAmbientProfile(practiceID)) return;
    const now = context.currentTime;
    const output = context.createGain();
    const filter = context.createBiquadFilter();
    const fundamental = context.createOscillator();
    const fifth = context.createOscillator();
    const fundamentalGain = context.createGain();
    const fifthGain = context.createGain();
    const pulse = context.createOscillator();
    const pulseDepth = context.createGain();

    fundamental.type = "sine";
    fifth.type = "sine";
    fundamental.frequency.setValueAtTime(profile.root, now);
    fifth.frequency.setValueAtTime(profile.root * 1.5, now);
    fundamentalGain.gain.value = 0.78;
    fifthGain.gain.value = 0.22;
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.35;
    output.gain.setValueAtTime(.0001, now);
    output.gain.exponentialRampToValueAtTime(profile.gain, now + 1.4);
    pulse.frequency.value = 1 / 12;
    pulseDepth.gain.value = profile.gain * .12;

    fundamental.connect(fundamentalGain).connect(filter);
    fifth.connect(fifthGain).connect(filter);
    filter.connect(output).connect(this.master);
    pulse.connect(pulseDepth).connect(output.gain);
    [fundamental, fifth, pulse].forEach(source => {
      source.start(now);
      this.nodes.add(source);
      source.addEventListener("ended", () => this.nodes.delete(source));
    });
    this.guidedSitAmbient = {
      practiceID,
      sources: [fundamental, fifth, pulse],
      gain: output,
      target: profile.gain
    };
  }

  stopGuidedSitAmbient(immediate = false) {
    this.guidedSitAmbientGeneration += 1;
    const ambient = this.guidedSitAmbient;
    if (!ambient) return;
    this.guidedSitAmbient = null;
    const now = this.context?.currentTime || 0;
    if (!immediate && this.context) {
      ambient.gain.gain.cancelScheduledValues(now);
      ambient.gain.gain.setValueAtTime(Math.max(ambient.gain.gain.value, .0001), now);
      ambient.gain.gain.exponentialRampToValueAtTime(.0001, now + .35);
    }
    window.setTimeout(() => {
      ambient.sources.forEach(source => {
        try { source.stop(); } catch {}
        this.nodes.delete(source);
      });
    }, immediate ? 0 : 390);
  }

  setGuidedSitAmbientDucked(ducked) {
    const ambient = this.guidedSitAmbient;
    if (!ambient || !this.context) return;
    const now = this.context.currentTime;
    const target = Math.max(.0001, ambient.target * (ducked ? .22 : 1));
    ambient.gain.gain.cancelScheduledValues(now);
    ambient.gain.gain.setValueAtTime(Math.max(ambient.gain.gain.value, .0001), now);
    ambient.gain.gain.exponentialRampToValueAtTime(target, now + (ducked ? .28 : .85));
  }

  async confirmSound() {
    if (!state.sound) return;
    await this.ready();
    const now = this.context.currentTime;
    this.note(392, now, .9, .045);
    this.note(587.33, now + .08, 1.1, .025);
  }
}

const sound = new SoundEngine();
const HISTORY_MARKER = "tone-sovereign";

function persistPreferences() {
  localStorage.setItem(STORAGE.preferences, JSON.stringify({
    lang: state.lang,
    sound: state.sound,
    voice: state.voice,
    reduceMotion: state.reduceMotion,
    quietWords: state.quietWords,
    guidedSitDuration: state.guidedSit.duration,
    guidedSitGuidance: state.guidedSit.guidance,
    guidedSitBackgroundTone: state.guidedSit.backgroundTone,
    guidedSitIntroduction: state.guidedSit.introduction
  }));
  document.documentElement.lang = state.lang;
  document.documentElement.classList.toggle("user-reduced-motion", state.reduceMotion);
  const description = state.lang === "es"
    ? "Tone Sovereign es una práctica privada de participación consciente. Elige el tono de una Edad Dorada."
    : "Tone Sovereign is a private practice of conscious participation. Choose the tone of a Golden Age.";
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('link[rel="manifest"]')?.setAttribute("href", state.lang === "es" ? "./manifest-es.webmanifest" : "./manifest.webmanifest");
}

function announce(message) { liveRegion.textContent = ""; requestAnimationFrame(() => { liveRegion.textContent = message; }); }

function focusCurrentView() {
  requestAnimationFrame(() => {
    const heading = app.querySelector("main h1, main [role='heading']");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  });
}

function showToast(message) {
  state.toast = message;
  window.clearTimeout(toastTimer);
  const existing = document.querySelector(".toast");
  if (existing) existing.textContent = message;
  else document.body.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${escapeHTML(message)}</div>`);
  toastTimer = window.setTimeout(() => { state.toast = ""; document.querySelector(".toast")?.remove(); }, 2600);
}

function navigate(view, options = {}) {
  stopPracticeTimers();
  if (state.view === "guidedSits" && view !== "guidedSits") resetGuidedSitSession();
  window.scrollTo({ top: 0, behavior: "auto" });
  const changedView = state.view !== view;
  const remembersView = changedView && options.remember !== false;
  if (remembersView) state.stack.push(state.view);
  state.view = view;
  if (options.field) state.selectedField = options.field;
  if (options.teaching) state.selectedTeaching = options.teaching;
  if (options.law) state.selectedLaw = options.law;
  if (options.principle) state.selectedPrinciple = options.principle;
  if (options.entry) state.selectedEntry = options.entry;
  if (options.path) state.selectedPath = options.path;
  if (options.guidedKind) {
    state.guidedKind = options.guidedKind;
    state.guidedPhase = 0;
  }
  if (options.engine) {
    state.selectedEngine = options.engine;
    state.engineStep = 0;
    state.engineResponses = { ...(state.engineDrafts[options.engine] || {}) };
    state.engineComplete = false;
  }
  if (options.mission !== undefined) {
    state.selectedMission = options.mission;
    const mission = state.missions.find(item => item.id === options.mission);
    state.missionDraft = mission ? { title: mission.title, direction: mission.direction, nextVisibleStep: mission.nextVisibleStep || "", sustainabilityNote: mission.sustainabilityNote || "", principleID: mission.principleID || "" } : { title: "", direction: "", nextVisibleStep: "", sustainabilityNote: "", principleID: "" };
  }
  if (options.mode) {
    if (view === "foundations") state.foundationMode = options.mode;
    if (view === "library") state.libraryMode = options.mode;
  }
  render();
  if (changedView) {
    const historyState = { app: HISTORY_MARKER, view };
    if (remembersView) window.history.pushState(historyState, "", window.location.href);
    else window.history.replaceState(historyState, "", window.location.href);
  }
  if (changedView) focusCurrentView();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function restorePreviousView() {
  stopPracticeTimers();
  if (state.view === "guidedSits") resetGuidedSitSession();
  state.view = state.stack.pop() || "home";
  render();
  focusCurrentView();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function goBack() {
  if (state.stack.length && window.history.state?.app === HISTORY_MARKER) {
    window.history.back();
    return;
  }
  restorePreviousView();
}

function goHome() {
  stopPracticeTimers();
  if (state.view === "guidedSits") resetGuidedSitSession();
  state.stack = [];
  state.view = "home";
  window.history.replaceState({ app: HISTORY_MARKER, view: "home" }, "", window.location.href);
  render();
  focusCurrentView();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function currentSpectrum() {
  if (state.view === "movement") {
    const movement = movementByID();
    return { name: "movement", color: movement.color };
  }
  if (["practice", "guidedSits", "guided", "practiceEngines", "practiceEngine"].includes(state.view)) {
    return { name: "practice", color: SPECTRUM.practice };
  }
  if (["fields", "nestedFields", "field"].includes(state.view)) {
    return { name: "fields", color: SPECTRUM.fields };
  }
  if (["library", "libraryPath", "teaching", "foundations", "law", "principle", "entry", "scales", "comics", "comicReader"].includes(state.view)) {
    return { name: "teachings", color: SPECTRUM.teachings };
  }
  if (["acts", "ruleOfLife", "missions", "mission", "history"].includes(state.view)) {
    return { name: "acts", color: SPECTRUM.acts };
  }
  if (state.view === "threshold") {
    return { name: "threshold", color: SPECTRUM.threshold };
  }
  return { name: "orientation", color: SPECTRUM.orientation };
}

function currentInterfaceMode() {
  if (state.view === "guidedSits") {
    return state.guidedSit.phase === "catalog" ? "navigation" : "practice";
  }
  if (["movement", "guided", "practiceEngine", "acts", "mission"].includes(state.view)) {
    return "practice";
  }
  if (["nestedFields", "field", "libraryPath", "teaching", "law", "principle", "entry", "scales", "comics", "comicReader", "symbol", "about", "ruleOfLife"].includes(state.view)) {
    return "teaching";
  }
  if (state.view === "threshold") return "threshold";
  return "navigation";
}

function render() {
  persistPreferences();
  const renderers = {
    landing: renderLanding,
    home: renderHome,
    practice: renderPractice,
    guidedSits: renderGuidedSits,
    movement: renderMovementSession,
    fields: renderFields,
    nestedFields: renderNestedFields,
    field: renderField,
    guided: renderGuidedExperience,
    library: renderLibrary,
    libraryPath: renderLibraryPath,
    teaching: renderTeaching,
    foundations: renderFoundations,
    law: renderLaw,
    principle: renderPrinciple,
    entry: renderLibraryEntry,
    comics: renderComics,
    comicReader: renderComicReader,
    practiceEngines: renderPracticeEngines,
    practiceEngine: renderPracticeEngine,
    ruleOfLife: renderRuleOfLife,
    missions: renderMissions,
    mission: renderMission,
    scales: renderScales,
    acts: renderActs,
    threshold: renderThreshold,
    history: renderHistory,
    settings: renderSettings,
    symbol: renderSymbol,
    about: renderAbout
  };
  const spectrum = currentSpectrum();
  const interfaceMode = currentInterfaceMode();
  app.innerHTML = `<div class="app-shell spectrum-${spectrum.name} interface-${interfaceMode}" style="--section-color:${spectrum.color}">${(renderers[state.view] || renderHome)()}</div>`;
  if (state.view === "symbol") observeSymbolSections();
  if (state.view === "landing" && !state.ceremonySettled) settleCeremonyLater();
  if (state.view === "movement") resumePracticeView();
  if (state.view === "guidedSits" && state.guidedSit.phase === "session" && !state.guidedSit.paused) startGuidedSitTimer();
  if (state.view === "threshold") sound.threshold().catch(() => {});
  if (state.view === "comics" || state.view === "comicReader") prepareComicImages();
}

function renderTopbar(title, subtitle = "") {
  return `<header class="topbar">
    <button class="icon-button" type="button" data-action="back" aria-label="${escapeHTML(tr("back"))}" title="${escapeHTML(tr("back"))}">←</button>
    <div class="topbar-title"><strong>${escapeHTML(title)}</strong>${subtitle ? `<span>${escapeHTML(subtitle)}</span>` : ""}</div>
    <div class="topbar-actions">
      <button class="icon-button" type="button" data-action="home" aria-label="${escapeHTML(tr("home"))}" title="${escapeHTML(tr("home"))}">⌂</button>
      <button class="icon-button" type="button" data-action="toggle-sound" aria-label="${state.sound ? tr("soundOn") : tr("soundOff")}" title="${state.sound ? tr("soundOn") : tr("soundOff")}">${renderSoundIcon(state.sound)}</button>
    </div>
  </header>`;
}

function renderSoundIcon(enabled = true) {
  return `<span class="sound-glyph ${enabled ? "is-on" : "is-off"}" aria-hidden="true"><span class="sound-speaker"></span><span class="sound-wave sound-wave-one"></span><span class="sound-wave sound-wave-two"></span><span class="sound-slash"></span></span>`;
}

function renderLivingApexStar() {
  const rayAngles = [0, 18, 42, 67, 90, 112, 139, 161, 180, 204, 229, 252, 270, 293, 318, 341];
  const rayLengths = [70, 38, 56, 30, 78, 42, 62, 34, 66, 46, 74, 36, 82, 40, 58, 32];
  const raySpeeds = [1.31, 1.87, 1.09, 2.17, 1.43, 1.73, 1.19, 2.31, 1.57, 1.01, 1.97, 1.27, 1.69, 2.09, 1.13, 1.79];
  const rays = rayAngles.map((angle, index) => (
    `<span class="tip-ray" style="--ray-angle:${angle}deg;--ray-length:${rayLengths[index]}px;--ray-speed:${raySpeeds[index]}s;--ray-delay:-${(index * 0.17).toFixed(2)}s"></span>`
  )).join("");
  const sparkAngles = [12, 73, 137, 196, 258, 326];
  const sparks = sparkAngles.map((angle, index) => (
    `<span class="tip-spark" style="--spark-angle:${angle}deg;--spark-distance:${28 + index * 7}px;--spark-speed:${(1.37 + index * 0.29).toFixed(2)}s;--spark-delay:-${(index * 0.41).toFixed(2)}s"></span>`
  )).join("");
  return `<div class="tip-star"><span class="tip-core"></span>${rays}${sparks}</div>`;
}

function renderLanding() {
  const immediateEntry = state.ceremonySettled || state.ceremonyEntryReady || state.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `<main class="landing ceremony ${state.ceremonySettled ? "is-settled" : "is-playing"} ${immediateEntry ? "entry-ready" : ""}" data-ceremony="${state.ceremonyKey}">
    <div class="gold-wash" aria-hidden="true"></div>
    <div class="landing-inner">
      <div class="landing-tools" ${state.ceremonySettled ? "" : "inert"}>
        <button class="landing-replay-button delayed-control" type="button" data-action="replay-ceremony" aria-label="${tr("replayWithSound")}" title="${tr("replayWithSound")}">${renderSoundIcon(true)}<span>${tr("replayWithSound")}</span></button>
        <button class="text-button delayed-control" type="button" data-action="listen-first-light">${phrase("Hear the invitation", "Escuchar la invitación")}</button>
        <button class="text-button delayed-control" type="button" data-action="toggle-language">${tr("language")}</button>
      </div>
      <section class="landing-title" aria-label="Tone Sovereign">
        <span class="tone-word">TONE</span>
        <span class="sovereign-word">SOVEREIGN</span>
      </section>
      <div class="mark-stage" aria-hidden="true">
        <div class="sun-rays"></div>
        <img class="sword-construction-mark sword-blade-mark" src="${ROOT}sword-mark.png" alt="">
        <img class="sword-construction-mark sword-hilt-mark" src="${ROOT}sword-mark.png" alt="">
        <img class="sword-construction-mark sword-handle-mark" src="${ROOT}sword-mark.png" alt="">
        <img class="sword-construction-mark sword-triskelion-mark" src="${ROOT}sword-mark.png" alt="">
        <img class="sword-mark" src="${ROOT}sword-mark.png" alt="">
        <div class="ring-trace"></div>
        <div class="ring-leading-star-orbit"><span class="ring-leading-star"></span></div>
        <div class="blade-current"></div>
        <div class="travelling-star"></div>
        ${renderLivingApexStar()}
      </div>
      <section class="landing-copy" ${state.ceremonySettled ? "" : "inert"}>
        <p>${tr("taglineLead")}</p>
        <strong>${tr("goldenAge")}</strong>
        <button class="symbol-link" type="button" data-view="symbol">${tr("symbol")}</button>
      </section>
      <div class="landing-actions" ${immediateEntry ? "" : "inert"}>
        <button class="enter-button" type="button" data-view="home">${tr("enter")} &nbsp;→</button>
      </div>
    </div>
  </main>`;
}

function settleCeremonyLater() {
  window.clearTimeout(ceremonyTimer);
  window.clearTimeout(ceremonyEntryTimer);
  const reduced = state.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const entryDelay = reduced ? 100 : FIRST_LIGHT.entryDelay * 1000;
  const duration = state.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : FIRST_LIGHT.duration * 1000;
  ceremonyEntryTimer = window.setTimeout(() => {
    state.ceremonyEntryReady = true;
    const actions = document.querySelector(".ceremony .landing-actions");
    document.querySelector(".ceremony")?.classList.add("entry-ready");
    actions?.removeAttribute("inert");
  }, entryDelay);
  ceremonyTimer = window.setTimeout(() => {
    state.ceremonySettled = true;
    const ceremony = document.querySelector(".ceremony");
    ceremony?.classList.add("is-settled");
    ceremony?.classList.remove("is-playing");
    ceremony?.querySelectorAll("[inert]").forEach(node => node.removeAttribute("inert"));
  }, duration);
}

async function replayCeremony(withAudio = true) {
  sound.stop();
  const shouldPlayAudio = withAudio && (state.sound || state.voice);
  if (shouldPlayAudio) {
    try {
      await sound.prepareFirstLight();
    } catch {
      showToast(state.lang === "en" ? "Sound could not start. Tap replay once more." : "No se pudo iniciar el sonido. Toca repetir otra vez.");
    }
  }
  state.ceremonyKey += 1;
  state.ceremonySettled = false;
  state.ceremonyEntryReady = false;
  render();
  if (shouldPlayAudio) sound.ceremony(false).catch(() => {
    showToast(state.lang === "en" ? "Sound could not start. Tap replay once more." : "No se pudo iniciar el sonido. Toca repetir otra vez.");
  });
}

function renderHome() {
  return `${renderTopbar(tr("app"), state.lang === "en" ? "Choose the tone of a Golden Age" : "Elige el tono de una Edad Dorada")}
    <main class="page wide home-page">
      <header class="section-intro">
        <p class="eyebrow">${tr("fiveDoors")}</p>
        <h1 class="display">${tr("beginQuestion")}</h1>
        <p class="lede hero-copy">${tr("beginSupport")}</p>
      </header>
      <section class="door-stack" aria-label="${tr("fiveDoors")}">
        ${doors.map(door => `<button class="door spectrum-row ${door.primary ? "primary-door" : ""}" style="--item-color:${SPECTRUM[door.spectrum]}" type="button" data-view="${door.id}">
          <span class="door-mark" aria-hidden="true">${door.mark}</span>
          <span class="door-copy"><strong>${tr(door.key)}</strong><span>${tr(door.support)}</span></span>
          <span class="door-arrow" aria-hidden="true">→</span>
        </button>`).join("")}
      </section>
      <button class="orientation-invitation spectrum-row" style="--item-color:${SPECTRUM.orientation}" type="button" data-view="about">
        <span class="door-mark" aria-hidden="true">✦</span>
        <span><strong>${phrase("Begin Here", "Comienza aquí")}</strong><small>${phrase("A short introduction to tone, sovereignty and the Golden Age.", "Una breve introducción al tono, la soberanía y la Edad Dorada.")}</small></span>
        <b aria-hidden="true">→</b>
      </button>
      <footer class="home-footer">
        <button class="text-button" type="button" data-view="foundations">${phrase("Foundations", "Fundamentos")}</button>
        <button class="text-button" type="button" data-view="ruleOfLife">${phrase("My compass", "Mi brújula")}</button>
        <button class="text-button" type="button" data-view="history">${tr("history")}</button>
        <button class="text-button" type="button" data-view="settings">${tr("settings")}</button>
        <button class="text-button" type="button" data-action="replay-from-home">${tr("replay")}</button>
      </footer>
    </main>`;
}

function renderPractice() {
  const lang = state.lang;
  return `${renderTopbar(lang === "en" ? "Practice" : "Práctica", lang === "en" ? "Each movement stands on its own" : "Cada movimiento funciona por sí solo")}
    <main class="page wide movement-field-page">
      <header class="section-intro movement-field-intro">
        <p class="eyebrow">${lang === "en" ? "CHOOSE A MOVEMENT" : "ELIGE UN MOVIMIENTO"}</p>
        <h1 class="display">${lang === "en" ? "What do you need now?" : "¿Qué necesitas ahora?"}</h1>
        <p class="lede">${lang === "en" ? "Follow all seven steps, or choose one step below." : "Sigue los siete pasos o elige un paso a continuación."}</p>
      </header>
      <button class="full-practice-entry" type="button" data-action="start-full-practice"><span aria-hidden="true">✦</span><span><strong>${lang === "en" ? "Begin the full seven-step practice" : "Comenzar la práctica completa de siete pasos"}</strong><small>${lang === "en" ? "Notice → Stabilise → Discern → Reclaim → Cross → Embody → Integrate" : "Notar → Estabilizar → Discernir → Recuperar → Cruzar → Encarnar → Integrar"}</small></span><b>→</b></button>
      <button class="guided-practice-entry" type="button" data-view="guidedSits"><span aria-hidden="true">◷</span><span><strong>${lang === "en" ? "Guided Sits" : "Meditaciones guiadas"}</strong><small>${lang === "en" ? "15, 30, 45, or 60 minutes with optional voice guidance" : "15, 30, 45 o 60 minutos con guía de voz opcional"}</small></span><b>›</b></button>
      <button class="guided-practice-entry" type="button" data-view="practiceEngines"><span aria-hidden="true">◌</span><span><strong>${lang === "en" ? "Short guided practices" : "Prácticas guiadas breves"}</strong><small>${lang === "en" ? "One-minute check-in, or choose a reusable practice" : "Una revisión de un minuto o una práctica para repetir"}</small></span><b>›</b></button>
      <p class="movement-or-label">${lang === "en" ? "OR CHOOSE ONE STEP" : "O ELIGE UN PASO"}</p>
      <section class="movement-field-grid" aria-label="${lang === "en" ? "Independent practices" : "Prácticas independientes"}">
        ${movements.map(item => {
          const itemCopy = local(item);
          return `<button class="movement-field-choice" style="--movement-color:${item.color}" type="button" data-open-movement="${item.id}">
            <span class="movement-field-mark" aria-hidden="true">${item.mark}</span>
            <span><strong>${escapeHTML(itemCopy.name)}</strong><small>${escapeHTML(itemCopy.line)}</small></span>
            <b aria-hidden="true">→</b>
          </button>`;
        }).join("")}
      </section>
      <p class="movement-field-note">${lang === "en" ? "Begin anywhere. Finishing one practice never requires starting another." : "Comienza donde quieras. Terminar una práctica nunca exige comenzar otra."}</p>
    </main>`;
}

const guidedSitMarks = Object.freeze({
  wind: "∿",
  "circle.dotted": "···",
  "figure.mind.and.body": "◇",
  circle: "○",
  heart: "♡",
  waveform: "≈",
  "arrow.left.and.right": "⇌",
  moon: "•"
});

function guidedSitPractice() {
  return guidedSitsManifest.practices.find(item => item.id === state.guidedSit.selectedID) || guidedSitsManifest.practices[0];
}

function guidedSitContent(practice = guidedSitPractice()) {
  return practice?.[state.lang] || practice?.en;
}

function guidedSitAssetID(practice, cueIndex) {
  return `ts_sit_${practice.id.replaceAll("-", "_")}_${String(cueIndex + 1).padStart(2, "0")}_v1`;
}

function guidedSitIntroductionAssetID(practice) {
  return `ts_sit_${practice.id.replaceAll("-", "_")}_intro_v1`;
}

function guidedSitSchedule(duration = state.guidedSit.duration, mode = state.guidedSit.guidance) {
  const safeDuration = Math.max(Number(duration) || 180, 180);
  const interval = mode === "regular" ? 120 : 300;
  const cueByTime = new Map([
    [0, 0],
    [Math.min(20, safeDuration - 120), 1],
    [Math.min(42, safeDuration - 120), 2],
    [Math.min(66, safeDuration - 120), 3]
  ]);
  let cueIndex = 4;
  for (let time = 66 + interval; time <= safeDuration - 180; time += interval) {
    cueByTime.set(time, Math.min(cueIndex, 7));
    cueIndex = cueIndex === 7 ? 4 : cueIndex + 1;
  }
  cueByTime.set(Math.max(0, safeDuration - 120), 8);
  cueByTime.set(Math.max(0, safeDuration - 32), 9);
  return [...cueByTime.entries()]
    .map(([elapsed, cue]) => ({ elapsed, cue }))
    .sort((a, b) => a.elapsed - b.elapsed);
}

function currentGuidedSitEvent() {
  return guidedSitSchedule().filter(item => item.elapsed <= state.guidedSit.elapsed).at(-1) || { elapsed: 0, cue: 0 };
}

function guidedSitModeCopy(mode) {
  const definitions = {
    regular: {
      en: ["Regular", "More support through the opening minute, then an invitation about every two minutes."],
      es: ["Regular", "Más apoyo durante el primer minuto; después, una invitación aproximadamente cada dos minutos."]
    },
    light: {
      en: ["Light", "More support through the opening minute, then an invitation about every five minutes."],
      es: ["Ligera", "Más apoyo durante el primer minuto; después, una invitación aproximadamente cada cinco minutos."]
    },
    off: {
      en: ["Voice off", "Bells and the visual field, without spoken guidance."],
      es: ["Sin voz", "Campanas y campo visual, sin guía hablada."]
    }
  };
  return definitions[mode][state.lang];
}

function guidedSitInstrument(practice, progress, active = false) {
  const circumference = 603.19;
  const clamped = Math.max(0, Math.min(progress, 1));
  const mark = guidedSitMarks[practice.symbol] || "•";
  return `<div class="guided-sit-instrument ${active ? "is-active" : ""}" style="--guided-accent:${escapeAttribute(practice.accent || "#D9B45A")}" role="img" aria-label="${phrase("Guided sit field", "Campo de meditación guiada")}" aria-valuenow="${Math.round(clamped * 100)}">
    <svg viewBox="0 0 220 220" aria-hidden="true">
      <circle class="guided-sit-glow" cx="110" cy="110" r="100"></circle>
      <circle class="guided-sit-track" cx="110" cy="110" r="96"></circle>
      <circle class="guided-sit-progress" data-guided-progress-ring cx="110" cy="110" r="96" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - clamped)}"></circle>
      <circle class="guided-sit-inner-ring" cx="110" cy="110" r="58"></circle>
    </svg>
    <span class="guided-sit-mark" aria-hidden="true">${mark}</span>
    <span class="guided-sit-star" aria-hidden="true"></span>
  </div>`;
}

function guidedSitSupportsBackgroundTone(practice = guidedSitPractice()) {
  return practice?.id !== "sound-and-silence";
}

function guidedSitBackgroundToneDetail(practice = guidedSitPractice()) {
  if (!guidedSitSupportsBackgroundTone(practice)) {
    return phrase(
      "This practice leaves the background silent so you can hear the sounds around you.",
      "Esta práctica deja el fondo en silencio para que puedas oír los sonidos a tu alrededor."
    );
  }
  return phrase(
    "A very quiet tone can sit beneath the voice. It is optional and carries no hidden meaning.",
    "Un tono muy suave puede acompañar la voz. Es opcional y no tiene ningún significado oculto."
  );
}

function renderGuidedSits() {
  const sit = state.guidedSit;
  const practices = guidedSitsManifest.practices || [];
  if (sit.phase === "catalog") {
    return `${renderTopbar(phrase("Guided Sits", "Meditaciones guiadas"), phrase("Back to practice", "Volver a las prácticas"))}
      <main class="page guided-sits-page"><header class="section-intro"><p class="eyebrow">${phrase("Stillness", "Quietud")}</p><h1 class="page-title">${phrase("How would you like to sit?", "¿Cómo te gustaría meditar?")}</h1><p class="lede">${phrase("Choose one simple way to meet the next few minutes. You may stop or change your focus at any time.", "Elige una forma sencilla de acompañar los próximos minutos. Puedes detenerte o cambiar el foco en cualquier momento.")}</p></header>
      <section class="list guided-sit-catalog">${practices.map(practice => { const content = guidedSitContent(practice); return `<button class="list-row guided-sit-row" type="button" data-guided-practice="${practice.id}"><span class="guided-sit-row-mark" style="--guided-accent:${escapeAttribute(practice.accent)}" aria-hidden="true">${guidedSitMarks[practice.symbol] || "•"}</span><span><strong>${escapeHTML(content.title)}</strong><span>${escapeHTML(content.purpose)}</span></span><b>→</b></button>`; }).join("")}</section>
      ${practices.length ? "" : `<p class="empty-state">${phrase("Guided sits are unavailable in this build.", "Las meditaciones guiadas no están disponibles en esta versión.")}</p>`}</main>`;
  }

  const practice = guidedSitPractice();
  if (!practice) {
    state.guidedSit.phase = "catalog";
    return renderGuidedSits();
  }
  const content = guidedSitContent(practice);

  if (sit.phase === "setup") {
    return `${renderTopbar(content.title, phrase("Back to guided sits", "Volver a meditaciones"))}
      <main class="page guided-sits-page guided-sit-setup">
        ${guidedSitInstrument(practice, 0)}
        <header class="section-intro"><p class="eyebrow">${escapeHTML(content.intention)}</p><h1 class="page-title">${escapeHTML(content.title)}</h1><p class="lede">${escapeHTML(content.purpose)}</p></header>
        <section class="guided-sit-orientation"><p>${escapeHTML(content.lineage)}</p><p>${escapeHTML(content.safety)}</p></section>
        <section class="guided-sit-options guided-sit-introduction-option"><p class="eyebrow">${phrase("Introduction", "Introducción")}</p><p class="guided-sit-option-detail">${phrase("A short orientation to the purpose and shape of this meditation. It does not use any of your meditation time.", "Una breve orientación sobre el propósito y la forma de esta meditación. No ocupa parte del tiempo de meditación.")}</p><div class="guided-sit-segments"><button type="button" data-guided-introduction="on" aria-pressed="${sit.introduction}">${phrase("Before the sit", "Antes de meditar")}</button><button type="button" data-guided-introduction="off" aria-pressed="${!sit.introduction}">${phrase("Skip", "Omitir")}</button></div><button class="text-button guided-sit-intro-listen" type="button" data-action="preview-guided-sit-introduction">◉ ${phrase("Hear introduction", "Escuchar introducción")}</button><details class="guided-sit-transcript"><summary>${phrase("Read the words", "Leer las palabras")}</summary><p>${escapeHTML(content.introduction)}</p></details></section>
        <section class="guided-sit-options"><p class="eyebrow">${phrase("Length", "Duración")}</p><div class="guided-sit-segments">${guidedSitsManifest.durationsSeconds.map(duration => `<button type="button" data-guided-duration="${duration}" aria-pressed="${sit.duration === duration}">${duration / 60} min</button>`).join("")}</div></section>
        <section class="guided-sit-options"><p class="eyebrow">${phrase("Guidance", "Guía")}</p><div class="guided-sit-segments guidance-modes">${["regular", "light", "off"].map(mode => `<button type="button" data-guided-mode="${mode}" aria-pressed="${sit.guidance === mode}">${guidedSitModeCopy(mode)[0]}</button>`).join("")}</div><p class="guided-sit-option-detail">${guidedSitModeCopy(sit.guidance)[1]}</p></section>
        <section class="guided-sit-options"><p class="eyebrow">${phrase("Background tone", "Tono de fondo")}</p>${guidedSitSupportsBackgroundTone(practice) ? `<div class="guided-sit-segments tone-modes"><button type="button" data-guided-tone="on" aria-pressed="${sit.backgroundTone}">${phrase("Subtle", "Suave")}</button><button type="button" data-guided-tone="off" aria-pressed="${!sit.backgroundTone}">${phrase("Off", "Apagado")}</button></div>` : ""}<p class="guided-sit-option-detail">${escapeHTML(guidedSitBackgroundToneDetail(practice))}</p></section>
        <button class="primary-button" type="button" data-action="begin-guided-sit">${phrase("Begin this sit", "Comenzar esta meditación")}</button>
      </main>`;
  }

  if (sit.phase === "introduction") {
    const introductionStatus = sit.introductionPlaying
      ? phrase("Introduction playing", "Reproduciendo la introducción")
      : phrase("Introduction paused", "Introducción en pausa");
    return `${renderTopbar(content.title, phrase("Back to setup", "Volver a la preparación"))}
      <main class="page guided-sits-page guided-sit-introduction">
        ${guidedSitInstrument(practice, 0, true)}
        <header class="section-intro"><p class="eyebrow">${phrase("About this meditation", "Acerca de esta meditación")}</p><h1 class="page-title">${escapeHTML(content.title)}</h1><p class="lede">${escapeHTML(content.purpose)}</p></header>
        <p class="guided-sit-intro-status" role="status">◉ ${introductionStatus}</p>
        <details class="guided-sit-transcript"><summary>${phrase("Read the introduction", "Leer la introducción")}</summary><p>${escapeHTML(content.introduction)}</p></details>
        <button class="secondary-button" type="button" data-action="${sit.introductionPlaying ? "pause-guided-sit-introduction" : "replay-guided-sit-introduction"}">${sit.introductionPlaying ? phrase("Pause introduction", "Pausar introducción") : phrase("Play introduction", "Reproducir introducción")}</button>
        <button class="primary-button" type="button" data-action="skip-guided-sit-introduction">${phrase("Begin the meditation now", "Comenzar la meditación ahora")}</button>
      </main>`;
  }

  if (sit.phase === "complete") {
    return `${renderTopbar(phrase("Guided Sits", "Meditaciones guiadas"), phrase("Return", "Volver"))}
      <main class="page guided-sits-page guided-sit-completion">${guidedSitInstrument(practice, 1)}<header class="section-intro"><p class="eyebrow">${escapeHTML(content.intention)}</p><h1 class="page-title">${phrase("The sit is complete.", "La meditación ha terminado.")}</h1><p class="lede">${phrase("Notice what is here now. Nothing needs to be measured or saved.", "Nota lo que está presente ahora. No hace falta medir ni guardar nada.")}</p></header><button class="primary-button" type="button" data-action="guided-sit-return">${phrase("Return to guided sits", "Volver a meditaciones")}</button></main>`;
  }

  const cueEvent = currentGuidedSitEvent();
  const cue = content.cues[cueEvent.cue] || content.purpose;
  const progress = sit.elapsed / Math.max(sit.duration, 1);
  const remaining = Math.max(sit.duration - sit.elapsed, 0);
  return `${renderTopbar(content.title, phrase("Leave this sit", "Salir de esta meditación"))}
    <main class="page guided-sits-page guided-sit-session">
      <p class="eyebrow">${escapeHTML(content.intention)}</p>
      ${guidedSitInstrument(practice, progress, !sit.paused)}
      <section class="guided-sit-cue" role="status" aria-live="polite"><h1 data-guided-cue>${escapeHTML(cue)}</h1><time data-guided-timer datetime="PT${remaining}S" aria-label="${phrase("Time remaining", "Tiempo restante")}">${formatClock(remaining)}</time></section>
      <div class="button-row guided-sit-controls"><button class="secondary-button" type="button" data-action="pause-guided-sit">${sit.paused ? phrase("Resume", "Continuar") : phrase("Pause", "Pausar")}</button>${sit.guidance === "off" ? "" : `<button class="secondary-button" type="button" data-action="replay-guided-sit-cue">${phrase("Replay", "Repetir")}</button>`}</div>
      ${guidedSitSupportsBackgroundTone(practice) ? `<button class="text-button guided-sit-tone-toggle" type="button" data-action="toggle-guided-sit-tone">${sit.backgroundTone ? phrase("◌ Background tone on", "◌ Tono de fondo activado") : phrase("◌ Background tone off", "◌ Tono de fondo desactivado")}</button>` : ""}
      <button class="text-button" type="button" data-action="end-guided-sit">${phrase("End sit", "Terminar meditación")}</button>
    </main>`;
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function selectGuidedSit(practiceID) {
  state.guidedSit.selectedID = practiceID;
  state.guidedSit.phase = "setup";
  state.guidedSit.elapsed = 0;
  state.guidedSit.paused = false;
  state.guidedSit.lastCueIndex = -1;
  render();
  const practice = guidedSitPractice();
  if (state.voice && practice) {
    sound.prepareVoiceCues([
      guidedSitIntroductionAssetID(practice),
      ...[0, 1, 2, 3].map(index => guidedSitAssetID(practice, index))
    ]).catch(() => {});
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

async function beginGuidedSit() {
  const practice = guidedSitPractice();
  if (!practice) return;
  sound.stopVoice();
  if (state.guidedSit.introduction && state.voice) {
    state.guidedSit.phase = "introduction";
    state.guidedSit.introductionPlaying = true;
    render();
    announce(phrase("Introduction playing.", "Reproduciendo la introducción."));
    const started = await sound.playVoice(guidedSitIntroductionAssetID(practice), 0, () => {
      if (state.view === "guidedSits" && state.guidedSit.phase === "introduction" && state.guidedSit.selectedID === practice.id) {
        startGuidedSitSession();
      }
    }).catch(() => false);
    if (started) return;
    if (state.view === "guidedSits" && state.guidedSit.phase === "introduction" && state.guidedSit.selectedID === practice.id) {
      state.guidedSit.introductionPlaying = false;
      render();
      if (!document.hidden) showToast(phrase("The introduction is unavailable. You can read it or begin now.", "La introducción no está disponible. Puedes leerla o comenzar ahora."));
    }
    return;
  }
  startGuidedSitSession();
}

function startGuidedSitSession() {
  const practice = guidedSitPractice();
  if (!practice) return;
  sound.stopVoice();
  state.guidedSit.phase = "session";
  state.guidedSit.introductionPlaying = false;
  state.guidedSit.elapsed = 0;
  state.guidedSit.paused = false;
  state.guidedSit.lastCueIndex = 0;
  state.guidedSit.lastTickAt = Date.now();
  render();
  sound.guidedSitBell(false).catch(() => {});
  sound.startGuidedSitAmbient(practice.id).catch(() => {});
  if (state.guidedSit.guidance !== "off") {
    sound.playVoice(guidedSitAssetID(practice, 0), 1.25).catch(() => {
      showToast(phrase("Voice guidance is unavailable. The silent sit will continue.", "La guía de voz no está disponible. La meditación continuará en silencio."));
    });
  }
  announce(guidedSitContent(practice).cues[0]);
}

async function replayGuidedSitIntroduction() {
  const practice = guidedSitPractice();
  if (!practice || !state.voice) {
    showToast(phrase("Turn voice on in Settings to hear the introduction.", "Activa la voz en Ajustes para escuchar la introducción."));
    return;
  }
  state.guidedSit.introductionPlaying = true;
  render();
  const started = await sound.playVoice(guidedSitIntroductionAssetID(practice), 0, () => {
    if (state.view === "guidedSits" && state.guidedSit.phase === "introduction" && state.guidedSit.selectedID === practice.id) {
      startGuidedSitSession();
    }
  }).catch(() => false);
  if (!started && state.view === "guidedSits" && state.guidedSit.phase === "introduction" && state.guidedSit.selectedID === practice.id) {
    state.guidedSit.introductionPlaying = false;
    render();
    if (!document.hidden) showToast(phrase("The introduction is unavailable.", "La introducción no está disponible."));
  }
}

function previewGuidedSitIntroduction() {
  const practice = guidedSitPractice();
  if (!practice || !state.voice) {
    showToast(phrase("Turn voice on in Settings to hear the introduction.", "Activa la voz en Ajustes para escuchar la introducción."));
    return;
  }
  sound.playVoice(guidedSitIntroductionAssetID(practice)).catch(() => {
    showToast(phrase("The introduction is unavailable.", "La introducción no está disponible."));
  });
}

function updateGuidedSitTimer() {
  const sit = state.guidedSit;
  if (state.view !== "guidedSits" || sit.phase !== "session" || sit.paused || document.hidden) return;
  const now = Date.now();
  const delta = Math.floor((now - sit.lastTickAt) / 1000);
  if (delta <= 0) return;
  const previousElapsed = sit.elapsed;
  sit.elapsed = Math.min(sit.duration, sit.elapsed + delta);
  sit.lastTickAt += delta * 1000;

  const crossed = guidedSitSchedule().filter(item => item.elapsed > previousElapsed && item.elapsed <= sit.elapsed).at(-1);
  if (crossed) {
    sit.lastCueIndex = crossed.cue;
    const practice = guidedSitPractice();
    if (sit.guidance !== "off") sound.playVoice(guidedSitAssetID(practice, crossed.cue)).catch(() => {});
    announce(guidedSitContent(practice).cues[crossed.cue]);
    render();
  } else {
    const remaining = Math.max(sit.duration - sit.elapsed, 0);
    const timer = document.querySelector("[data-guided-timer]");
    const ring = document.querySelector("[data-guided-progress-ring]");
    const instrument = document.querySelector(".guided-sit-instrument");
    if (timer) { timer.textContent = formatClock(remaining); timer.dateTime = `PT${remaining}S`; }
    if (ring) ring.style.strokeDashoffset = String(603.19 * (1 - sit.elapsed / Math.max(sit.duration, 1)));
    if (instrument) instrument.setAttribute("aria-valuenow", String(Math.round(sit.elapsed / Math.max(sit.duration, 1) * 100)));
  }

  if (sit.elapsed >= sit.duration) completeGuidedSit();
}

function startGuidedSitTimer() {
  const sit = state.guidedSit;
  if (guidedSitTimer || state.view !== "guidedSits" || sit.phase !== "session" || sit.paused || document.hidden) return;
  sit.lastTickAt = Date.now();
  guidedSitTimer = window.setInterval(updateGuidedSitTimer, 250);
}

function pauseGuidedSit() {
  updateGuidedSitTimer();
  state.guidedSit.paused = !state.guidedSit.paused;
  sound.stopVoice();
  if (state.guidedSit.paused) {
    sound.stopGuidedSitAmbient();
  } else {
    sound.startGuidedSitAmbient(guidedSitPractice().id).catch(() => {});
    replayGuidedSitCue();
  }
  window.clearInterval(guidedSitTimer);
  guidedSitTimer = 0;
  render();
}

function replayGuidedSitCue() {
  if (state.guidedSit.guidance === "off") return;
  const practice = guidedSitPractice();
  const cue = currentGuidedSitEvent().cue;
  sound.playVoice(guidedSitAssetID(practice, cue)).catch(() => {
    showToast(phrase("Voice guidance is unavailable.", "La guía de voz no está disponible."));
  });
}

function completeGuidedSit() {
  if (state.guidedSit.phase !== "session") return;
  window.clearInterval(guidedSitTimer);
  guidedSitTimer = 0;
  sound.stopVoice();
  sound.stopGuidedSitAmbient();
  sound.guidedSitBell(true).catch(() => {});
  state.guidedSit.phase = "complete";
  state.guidedSit.paused = false;
  state.guidedSit.elapsed = state.guidedSit.duration;
  render();
  announce(phrase("The sit is complete.", "La meditación ha terminado."));
}

function resetGuidedSitSession() {
  window.clearInterval(guidedSitTimer);
  guidedSitTimer = 0;
  sound.stopVoice();
  sound.stopGuidedSitAmbient(true);
  const duration = state.guidedSit.duration;
  const guidance = state.guidedSit.guidance;
  const backgroundTone = state.guidedSit.backgroundTone;
  const introduction = state.guidedSit.introduction;
  state.guidedSit = { ...newGuidedSit(), duration, guidance, backgroundTone, introduction };
}

function returnGuidedSitToSetup() {
  window.clearInterval(guidedSitTimer);
  guidedSitTimer = 0;
  sound.stopVoice();
  sound.stopGuidedSitAmbient(true);
  state.guidedSit.phase = "setup";
  state.guidedSit.elapsed = 0;
  state.guidedSit.paused = false;
  state.guidedSit.lastCueIndex = -1;
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function movementByID(id = state.practice.movement) {
  return movements.find(item => item.id === id) || movements[0];
}

function movementTopbar(movement) {
  const itemCopy = local(movement);
  return `<header class="topbar">
    <button class="icon-button" type="button" data-action="movement-back" aria-label="${escapeHTML(tr("back"))}" title="${escapeHTML(tr("back"))}">←</button>
    <div class="topbar-title"><strong>${escapeHTML(itemCopy.name)}</strong><span>${escapeHTML(itemCopy.line)}</span></div>
    <div class="topbar-actions"><button class="icon-button" type="button" data-action="home" aria-label="${escapeHTML(tr("home"))}" title="${escapeHTML(tr("home"))}">⌂</button></div>
  </header>`;
}

function renderMovementSession() {
  const p = state.practice;
  const movement = movementByID();
  if (p.interrupted) return `${movementTopbar(movement)}<main class="page movement-session-page"><section class="practice-stage focused-stage interrupted-practice">${renderMovementHeading(phrase("Paused when you stepped away", "En pausa cuando saliste"), phrase("Nothing resumed by itself. Continue only when you are ready, or leave here.", "Nada se reanudó por sí solo. Continúa solo cuando estés listo o sal de aquí."))}<div class="practice-actions"><button class="primary-button" type="button" data-action="resume-interrupted-practice">${phrase("Resume", "Reanudar")}</button><button class="text-button" type="button" data-action="leave-interrupted-practice">${phrase("Leave practice", "Salir de la práctica")}</button></div></section></main>`;
  if (movement.id === "stabilise" && p.stage === "breath" && p.breathStartedAt) return renderStabiliseSession();
  if (p.stage === "continuity") return renderContinuityChoice(movement);
  return `${movementTopbar(movement)}
    <main class="page movement-session-page" style="--movement-color:${movement.color}">
      ${renderIndependentMovement(movement.id)}
    </main>`;
}

function renderContinuityChoice(movement) {
  const lang = state.lang;
  const bridge = {
    notice: ["stabilise", "Create room for the signal.", "Abrir espacio para la señal."],
    stabilise: ["discern", "Look with enough steadiness.", "Mirar con suficiente estabilidad."],
    discern: ["reclaim", "Decide what may govern.", "Decidir qué puede gobernar."],
    reclaim: ["cross", "Meet the threshold without rushing it.", "Encontrar el umbral sin apresurarlo."],
    cross: ["embody", "Give the direction a felt form.", "Dar a la dirección una forma sentida."],
    embody: ["integrate", "Place the tone beside the rest of life.", "Colocar el tono junto al resto de la vida."]
  }[movement.id];
  const nextMovement = bridge ? movementByID(bridge[0]) : null;
  return `${movementTopbar(movement)}<main class="page continuity-page">
    <div class="completion-seal"><div class="seal-orb"><span>${movement.mark}</span></div>
      <h1 class="practice-title">${lang === "en" ? "Save this practice on this device?" : "¿Guardar esta práctica en este dispositivo?"}</h1>
      <p class="lede">${lang === "en" ? "This saves the practice and the response you chose. Tone Sovereign will not tell you what your choices mean." : "Esto guarda la práctica y la respuesta que elegiste. Tone Sovereign no te dirá qué significan tus elecciones."}</p>
    </div>
    <div class="practice-actions"><button class="primary-button" type="button" data-action="finish-movement-save">${lang === "en" ? "Save on this device" : "Guardar en este dispositivo"}</button>
    <button class="text-button" type="button" data-action="finish-movement-pass">${lang === "en" ? "Finish here without saving" : "Terminar aquí sin guardar"}</button>
    ${bridge && nextMovement ? `<aside class="adjacent-bridge"><p>${lang === "en" ? bridge[1] : bridge[2]}</p><button class="secondary-button" type="button" data-open-movement="${nextMovement.id}">${lang === "en" ? `Continue with ${nextMovement.en.name}` : `Continuar con ${nextMovement.es.name}`}</button></aside>` : ""}</div>
  </main>`;
}

function renderMovementHeading(title, support, eyebrow = "") {
  return `<header class="practice-copy movement-heading">${eyebrow ? `<p class="eyebrow">${escapeHTML(eyebrow)}</p>` : ""}<h1 class="practice-title">${escapeHTML(title)}</h1><p class="lede">${escapeHTML(support)}</p></header>`;
}

function renderIndependentMovement(id) {
  if (id === "notice") return renderNoticeMovement();
  if (id === "stabilise") return renderStabiliseMovement();
  if (id === "discern" || id === "integrate") return renderCapacityMovement(id);
  if (id === "reclaim") return renderReclaimMovement();
  if (id === "cross") return renderCrossMovement();
  return renderEmbodyMovement();
}

function renderNoticeMovement() {
  const p = state.practice;
  const lang = state.lang;
  if (p.stage === "arrive") return `<section class="practice-stage focused-stage">
    ${renderMovementHeading(lang === "en" ? "Notice one simple feeling in your body." : "Nota una sensación sencilla en tu cuerpo.", p.guidance === "guided" ? (lang === "en" ? "Four optional spoken cues, then notice freely." : "Cuatro indicaciones habladas opcionales y luego atención libre.") : (lang === "en" ? "A quiet minute with brief words on screen." : "Un minuto en silencio con palabras breves en pantalla."))}
    <div class="instrument-region notice-instrument still" aria-hidden="true"><span class="aperture-ring"></span><span class="aperture-line"></span><span class="aperture-point"></span></div>
    <div class="segmented practice-guidance" aria-label="${lang === "en" ? "Notice guidance" : "Guía para Notar"}"><button type="button" data-practice-guidance="quiet" aria-pressed="${p.guidance === "quiet"}">${lang === "en" ? "Quiet" : "Silencio"}</button><button type="button" data-practice-guidance="guided" aria-pressed="${p.guidance === "guided"}">${lang === "en" ? "Guided" : "Guiada"}</button></div>
    <button class="primary-button" type="button" data-action="start-notice">${lang === "en" ? "Begin" : "Comenzar"}</button>
    <div class="practice-settings-row"><button class="text-button" type="button" data-action="toggle-words">${state.quietWords ? (lang === "en" ? "Use quiet labels" : "Usar etiquetas suaves") : (lang === "en" ? "Without labels" : "Sin etiquetas")}</button>
    <label>${lang === "en" ? "Duration" : "Duración"}<select data-notice-duration><option value="30" ${p.noticeDuration === 30 ? "selected" : ""}>30s</option><option value="60" ${p.noticeDuration === 60 ? "selected" : ""}>60s</option><option value="90" ${p.noticeDuration === 90 ? "selected" : ""}>90s</option></select></label></div>
  </section>`;
  if (p.stage === "close") {
    const outcomes = lang === "en" ? ["Clearer", "Different", "No change", "Not sure"] : ["Más claro", "Diferente", "Sin cambio", "No lo sé"];
    return `<section class="practice-stage focused-stage">${renderMovementHeading(lang === "en" ? "What is different, if anything?" : "¿Qué ha cambiado, si algo cambió?", lang === "en" ? "A response is optional." : "Responder es opcional.")}
      <div class="instrument-region notice-instrument still" aria-hidden="true"><span class="aperture-ring"></span><span class="aperture-line"></span><span class="aperture-point"></span></div>
      <div class="choice-grid">${outcomes.map((item, index) => `<button class="choice ${p.noticeOutcome === String(index) ? "selected" : ""}" type="button" data-notice-outcome="${index}">${item}</button>`).join("")}</div>
      <button class="primary-button" type="button" data-action="complete-movement">${lang === "en" ? "Return to practice menu" : "Volver al menú de prácticas"}</button>
      <button class="text-button" type="button" data-action="continue-stabilise">${lang === "en" ? "Continue with Stabilise" : "Continuar con Estabilizar"}</button>
    </section>`;
  }
  const cue = noticeCues[lang][p.noticeCue];
  return `<section class="practice-stage focused-stage notice-live-stage">
    <button class="instrument-region notice-instrument ${p.noticeAcknowledged ? "acknowledged" : ""}" type="button" data-action="notice-tap" aria-label="${p.noticeAcknowledged ? (lang === "en" ? "Noticed" : "Notado") : (lang === "en" ? "Ready. Acknowledge what you notice" : "Listo. Reconoce lo que notes")}"><span class="aperture-ring"></span><span class="aperture-line"></span><span class="aperture-point"></span></button>
    <p class="notice-status" data-notice-status>${p.noticeAcknowledged ? (lang === "en" ? "Noticed" : "Notado") : (lang === "en" ? "Ready" : "Listo")}</p>
    ${renderMovementHeading(cue, state.quietWords ? (lang === "en" ? "Tap the centre when you notice something." : "Toca el centro cuando notes algo.") : (lang === "en" ? "No naming is needed." : "No hace falta nombrarlo."))}
    <p class="timer" data-notice-timer>${Math.floor(p.noticeDuration / 60)}:${String(p.noticeDuration % 60).padStart(2, "0")}</p>
    <div class="button-row"><button class="secondary-button" type="button" data-action="another-notice-cue">${lang === "en" ? "Another cue" : "Otra indicación"}</button><button class="text-button" type="button" data-action="end-notice">${lang === "en" ? "End practice" : "Terminar práctica"}</button></div>
  </section>`;
}

function renderStabiliseMovement() {
  const p = state.practice;
  const lang = state.lang;
  if (p.stage === "complete") return `<section class="practice-stage focused-stage">${renderMovementHeading(lang === "en" ? "ENOUGH" : "SUFICIENTE", lang === "en" ? "Did this bring you closer?" : "¿Esto te acercó un poco?")}
    <div class="completion-seal"><div class="seal-orb"><span>│</span></div></div>
    <button class="primary-button" type="button" data-action="complete-movement">${lang === "en" ? "Return to practice menu" : "Volver al menú de prácticas"}</button></section>`;
  if (p.stage === "patterns") return `<section class="practice-stage">${renderMovementHeading(lang === "en" ? "Choose a breath" : "Elige una respiración", lang === "en" ? "Choose the rhythm that asks least from you right now. Every hold is optional." : "Elige el ritmo que te pida menos ahora. Cada pausa es opcional.")}
    <div class="stabilise-instrument" role="img" aria-label="${lang === "en" ? "A steady vertical line meeting a calm horizon" : "Una línea vertical estable que se encuentra con un horizonte tranquilo"}"><span></span><i></i></div>
    <div class="state-list">${Object.entries(BREATH_PATTERNS).map(([key, item]) => `<button class="state-choice" type="button" data-breath-pattern="${key}"><span class="state-mini-axis" style="--pattern-rgb:${item.rgb}" aria-hidden="true"></span><span><strong>${item[lang].title}</strong><small>${item[lang].cue}</small></span><b>›</b></button>`).join("")}</div></section>`;
  if (!p.steadyState) {
    const visible = p.steadyExpanded ? steadyStates : steadyModes;
    return `<section class="practice-stage">${renderMovementHeading(lang === "en" ? "What feels difficult now?" : "¿Qué se siente difícil ahora?", lang === "en" ? "Choose the closest state. You can change it." : "Elige el estado más cercano. Puedes cambiarlo.")}
      <div class="stabilise-instrument" role="img" aria-label="${lang === "en" ? "A steady vertical line meeting a calm horizon" : "Una línea vertical estable que se encuentra con un horizonte tranquilo"}"><span></span><i></i></div>
      <div class="state-list">${visible.map(item => `<button class="state-choice" type="button" data-steady="${item.id}"><span class="state-mini-axis" aria-hidden="true"></span><span><strong>${item[lang][0]}</strong><small>${item[lang][1]}</small></span><b>›</b></button>`).join("")}</div>
      ${p.steadyExpanded ? `<button class="text-button" type="button" data-action="less-steady">${lang === "en" ? "Back to three simple choices" : "Volver a tres opciones sencillas"}</button>` : `<button class="text-button" type="button" data-action="more-steady">${lang === "en" ? "Choose a more specific state" : "Elegir un estado más específico"} ↓</button>`}
    </section>`;
  }
  const chosen = steadyStates.find(item => item.id === p.steadyState);
  const pattern = BREATH_PATTERNS[p.breathPattern || chosen.pattern];
  return `<section class="practice-stage focused-stage">
    ${renderMovementHeading(pattern[lang].title, pattern[lang].cue, chosen[lang][0])}
    <p class="consent-copy">${lang === "en" ? "Stop at any time. Let the breath return to its natural rhythm." : "Detente cuando quieras. Deja que la respiración vuelva a su ritmo natural."}</p>
    <div class="segmented practice-duration" aria-label="${lang === "en" ? "Breathing duration" : "Duración de la respiración"}">${[[10,"10 sec","10 s"],[120,"2 min","2 min"],[300,"5 min","5 min"]].map(([seconds,en,es]) => `<button type="button" data-breath-duration="${seconds}" aria-pressed="${p.breathDuration === seconds}">${lang === "en" ? en : es}</button>`).join("")}</div>
    <div class="segmented practice-guidance" aria-label="${lang === "en" ? "Breathing guidance" : "Guía de respiración"}"><button type="button" data-practice-guidance="quiet" aria-pressed="${p.guidance === "quiet"}">${lang === "en" ? "Quiet" : "Silencio"}</button><button type="button" data-practice-guidance="guided" aria-pressed="${p.guidance === "guided"}">${lang === "en" ? "Guided" : "Guiada"}</button></div>
    <button class="primary-button" type="button" data-action="start-breath">${lang === "en" ? "Begin breathing" : "Comenzar respiración"}</button>
    <button class="text-button" type="button" data-action="change-breath-pattern">${lang === "en" ? "Change breath" : "Cambiar respiración"}</button>
    <button class="text-button" type="button" data-action="change-steady">${lang === "en" ? "Choose another state" : "Elegir otro estado"}</button>
  </section>`;
}

function renderCapacityInstrument(id, step, lang, answers, selectedOption) {
  const visibleAnswers = [...answers];
  if (selectedOption) visibleAnswers[step] = selectedOption;
  const answerAt = index => visibleAnswers[index] || (lang === "en" ? "No response selected" : "No has seleccionado una respuesta");
  if (id === "discern") {
    const labels = lang === "en"
      ? ["Directly known", "Added interpretation", "Honest next step"]
      : ["Conocido directamente", "Interpretación añadida", "Siguiente paso honesto"];
    return `<div class="capacity-instrument discern-lenses step-${step}" role="img" aria-label="${escapeAttribute(`${labels[step]}. ${answerAt(step)}`)}">
      <div class="discern-lens direct"><span>${labels[0]}<small>${escapeHTML(answerAt(0))}</small></span></div>
      <div class="discern-channel" aria-hidden="true"></div>
      <div class="discern-lens added"><span>${labels[1]}<small>${escapeHTML(answerAt(1))}</small></span></div>
      <p>${labels[2]}<small>${escapeHTML(answerAt(2))}</small></p>
    </div>`;
  }
  const labels = lang === "en"
    ? ["Included signal", "Not sole authority", "Carry forward"]
    : ["Señal incluida", "No es la única autoridad", "Llevar adelante"];
  return `<div class="capacity-instrument integrate-strands step-${step}" role="img" aria-label="${escapeAttribute(`${labels[step]}. ${answerAt(step)}`)}">
    <svg viewBox="0 0 600 150" preserveAspectRatio="none" aria-hidden="true">
      <path class="strand one" d="M18 26 C160 26 244 74 390 74 S510 74 580 74"></path>
      <path class="strand two" d="M18 74 C170 74 250 74 390 74 S510 74 580 74"></path>
      <path class="strand three" d="M18 124 C162 124 250 74 390 74 S510 74 580 74"></path>
      <circle cx="390" cy="74" r="13"></circle>
    </svg>
    <div class="instrument-labels"><span>${labels[0]}<small>${escapeHTML(answerAt(0))}</small></span><span>${labels[1]}<small>${escapeHTML(answerAt(1))}</small></span><span>${labels[2]}<small>${escapeHTML(answerAt(2))}</small></span></div>
  </div>`;
}

function renderCapacityMovement(id) {
  const p = state.practice;
  const lang = state.lang;
  const flow = capacityFlows[id];
  const item = flow[p.capacityStep][lang];
  const heldTone = id === "integrate" && p.sequence ? tones.find(tone => tone.id === localStorage.getItem(STORAGE.lastHeldTone)) : null;
  return `<section class="practice-stage focused-stage capacity-stage">
    <p class="eyebrow">${p.capacityStep + 1} ${lang === "en" ? "of" : "de"} ${flow.length}</p>
    ${renderMovementHeading(item[0], item[1])}
    <button class="text-button voice-invitation" type="button" data-action="listen-capacity-stage">${lang === "en" ? "Hear this invitation" : "Escuchar esta invitación"}</button>
    ${heldTone ? `<p class="gentle-note">${lang === "en" ? `Also present: the ${heldTone.en} tone held in Embody. It is one strand, not the whole choice.` : `También está presente el tono ${heldTone.es} guardado en Encarnar. Es una hebra, no toda la elección.`}</p>` : ""}
    ${renderCapacityInstrument(id, p.capacityStep, lang, p.capacityAnswers, p.selectedOption)}
    <div class="choice-grid capacity-choices">${item[2].map(option => `<button class="choice ${p.selectedOption === option ? "selected" : ""}" type="button" data-capacity-option="${escapeAttribute(option)}">${escapeHTML(option)}</button>`).join("")}</div>
    <button class="primary-button" type="button" data-action="capacity-continue" ${p.selectedOption ? "" : "disabled"}>${p.capacityStep === flow.length - 1 ? (lang === "en" ? "Complete practice" : "Completar práctica") : tr("continue")}</button>
  </section>`;
}

function renderReclaimMovement() {
  const p = state.practice;
  const lang = state.lang;
  const pullIsUnclear = p.pull === "Nothing clear" || p.pull === "Nada claro";
  const unbindingSupport = pullIsUnclear
    ? (lang === "en" ? "What is unclear can remain outside your centre. It does not have to choose for you." : "Lo que no está claro puede permanecer fuera de tu centro. No tiene que elegir por ti.")
    : (lang === "en" ? `${p.pull} may still be here, outside your centre. It does not have to choose for you.` : `${p.pull} puede seguir aquí, fuera de tu centro. No tiene que elegir por ti.`);
  const relationshipSupport = pullIsUnclear
    ? (lang === "en" ? "What is unclear can remain visible without taking the centre. Choose the relationship that leaves you room to act." : "Lo que no está claro puede seguir visible sin ocupar el centro. Elige una forma de relacionarte que te deje espacio para actuar.")
    : (lang === "en" ? `${p.pull} remains visible outside your centre. Choose the relationship that leaves you room to act.` : `${p.pull} sigue visible fuera de tu centro. Elige una forma de relacionarte que te deje espacio para actuar.`);
  if (p.stage === "authority") return `<section class="practice-stage focused-stage">${renderMovementHeading(lang === "en" ? "What is pulling at your attention?" : "¿Qué está tirando de tu atención?", lang === "en" ? "Choose the closest name. You can leave it unclear." : "Elige el nombre más cercano. Puedes dejarlo sin aclarar.")}
    <div class="instrument-region reclaim-instrument reclaim-opening" role="img" aria-label="${lang === "en" ? "Open spiral with your centre held clear" : "Espiral abierta con tu centro despejado"}" aria-description="${lang === "en" ? "No pull selected" : "No has seleccionado qué tira de ti"}"><svg class="reclaim-spiral" viewBox="0 0 120 120" aria-hidden="true"><path d="M63 58 C72 54 76 63 72 70 C66 82 45 78 40 64 C33 44 51 27 72 31 C97 36 105 65 91 85 C74 109 37 103 24 77"></path></svg><span class="reclaim-point"></span></div>
    <p class="reclaim-centre-copy">${lang === "en" ? "The pull can be present without occupying your centre." : "Eso que tira de ti puede estar presente sin ocupar tu centro."}</p>
    <div class="choice-grid">${pulls[lang].map((item, index) => `<button class="choice" type="button" data-pull="${index}">${item}</button>`).join("")}</div>
    <button class="text-button" type="button" data-action="reclaim-nothing-clear">${lang === "en" ? "Nothing clear" : "Nada claro"}</button></section>`;
  if (p.stage === "custom") return `<section class="practice-stage focused-stage">${renderMovementHeading(lang === "en" ? "Name it plainly." : "Nómbralo con sencillez.", lang === "en" ? "A few words are enough. You can leave it unclear." : "Bastan unas pocas palabras. Puedes dejarlo sin aclarar.")}
    <label class="field-label reclaim-custom-field"><span>${lang === "en" ? "What is pulling at your attention?" : "¿Qué está tirando de tu atención?"}</span><input class="field-input" data-input="customPull" value="${escapeAttribute(p.customPull)}" maxlength="80" autocomplete="off"></label>
    <button class="primary-button" type="button" data-action="reclaim-custom-continue" ${p.customPull.trim() ? "" : "disabled"}>${tr("continue")}</button>
    <button class="text-button" type="button" data-action="reclaim-nothing-clear">${lang === "en" ? "Nothing clear" : "Nada claro"}</button></section>`;
  if (p.stage === "confirm") return `<section class="practice-stage focused-stage">
    ${renderMovementHeading(lang === "en" ? "Is this close enough?" : "¿Esto se acerca lo suficiente?", lang === "en" ? "You can change it, leave it unclear, or continue. Naming does not make it the authority." : "Puedes cambiarlo, dejarlo sin aclarar o continuar. Nombrarlo no le da autoridad.")}
    <p class="reclaim-confirmed-pull">${escapeHTML(p.pendingPull)}</p>
    <div class="practice-actions"><button class="primary-button" type="button" data-action="confirm-reclaim-pull">${lang === "en" ? "Continue with this" : "Continuar con esto"}</button><button class="text-button" type="button" data-action="change-reclaim-pull">${lang === "en" ? "Change it" : "Cambiarlo"}</button></div>
  </section>`;
  if (p.stage === "pause") return `<section class="practice-stage focused-stage"><p class="eyebrow">${escapeHTML(p.pull)}</p>
    <button class="instrument-region reclaim-instrument ${p.reclaimHolding ? "hold-active" : ""} ${p.reclaimComplete ? "is-complete" : ""}" type="button" data-action="reclaim-hold" aria-label="${lang === "en" ? "Press and hold through one natural breath" : "Mantén pulsado durante una respiración natural"}"><svg class="reclaim-spiral" viewBox="0 0 120 120" aria-hidden="true"><path d="M63 58 C72 54 76 63 72 70 C66 82 45 78 40 64 C33 44 51 27 72 31 C97 36 105 65 91 85 C74 109 37 103 24 77"></path></svg><span class="reclaim-line"></span><span class="reclaim-point"></span></button>
    ${renderMovementHeading(p.reclaimComplete ? (lang === "en" ? "You can still choose." : "Todavía puedes elegir.") : (lang === "en" ? "Hold your centre for one breath." : "Mantén tu centro durante una respiración."), p.reclaimComplete ? unbindingSupport : (lang === "en" ? "Hold the spiral for one breath, or continue when ready." : "Mantén la espiral durante una respiración o continúa cuando estés listo."))}
    <button class="primary-button" type="button" data-action="reclaim-to-relationship">${lang === "en" ? "Choose how to respond" : "Elegir cómo responder"}</button></section>`;
  if (p.stage === "relationship") return `<section class="practice-stage focused-stage"><p class="eyebrow">${escapeHTML(p.pull)}</p>
    <div class="instrument-region reclaim-instrument small" aria-hidden="true"><span class="reclaim-line"></span><span class="reclaim-point"></span></div>
    ${renderMovementHeading(lang === "en" ? "Choose how you will respond to it." : "Elige cómo responderás.", relationshipSupport)}
    <div class="choice-grid">${relations[lang].map(item => `<button class="choice ${p.relation === item ? "selected" : ""}" type="button" data-relation="${escapeAttribute(item)}">${item}</button>`).join("")}</div>
    <button class="primary-button" type="button" data-action="reclaim-complete" ${p.relation ? "" : "disabled"}>${tr("continue")}</button></section>`;
  const relationIndex = relations[lang].indexOf(p.relation);
  const principles = lang === "en" ? ["You can hear the pull without letting it steer. You choose what leads.", "You can set this down without resolving it. You choose what leads.", "You can question a demand before giving it authority. You choose what leads.", "You do not have to decide this now. You choose what leads."] : ["Puedes escuchar el impulso sin dejar que dirija. Tú eliges qué guía.", "Puedes dejar esto por ahora sin resolverlo. Tú eliges qué guía.", "Puedes cuestionar una exigencia antes de darle autoridad. Tú eliges qué guía.", "No tienes que decidir esto ahora. Tú eliges qué guía."];
  return `<section class="practice-stage focused-stage"><div class="instrument-region reclaim-instrument small" aria-hidden="true"><span class="reclaim-line"></span><span class="reclaim-point"></span></div>
    ${renderMovementHeading(p.relation, principles[Math.max(0, relationIndex)])}
    <button class="primary-button" type="button" data-action="complete-movement">${lang === "en" ? "Return to practice menu" : "Volver al menú de prácticas"}</button>
    <button class="text-button" type="button" data-action="continue-embody">${lang === "en" ? "Continue with Embody" : "Continuar con Encarnar"}</button></section>`;
}

function currentCrossFocus() { return crossFocuses.find(item => item.id === state.practice.crossFocus) || crossFocuses[0]; }
function currentCrossQuestionKey() { return `${currentCrossFocus().questionKey}:${state.practice.crossQuestion % 4}`; }
function currentCrossQuestion() { const focus = currentCrossFocus(); return crossQuestions[focus.questionKey][state.lang][state.practice.crossQuestion % 4]; }

function chooseCrossQuestion({ avoidCurrent = false } = {}) {
  const p = state.practice;
  const focus = currentCrossFocus();
  const all = [0, 1, 2, 3];
  const recent = new Set(p.crossRecent);
  let choices = all.filter(index => !recent.has(`${focus.questionKey}:${index}`) && (!avoidCurrent || index !== p.crossQuestion));
  if (!choices.length) choices = all.filter(index => !avoidCurrent || index !== p.crossQuestion);
  if (!choices.length) choices = all;
  p.crossQuestion = choices[Math.floor(Math.random() * choices.length)];
  p.crossRecent = [currentCrossQuestionKey(), ...p.crossRecent.filter(item => item !== currentCrossQuestionKey())].slice(0, 6);
  p.crossSaved = crossQuestionIsSaved();
  p.crossCrossed = false;
  p.crossRemaining = false;
}

function crossQuestionIsSaved() {
  const key = currentCrossQuestionKey();
  return readJSON(STORAGE.crossMarks, []).some(item => item.id === key || (!item.id && item.question === crossQuestions[currentCrossFocus().questionKey].en[state.practice.crossQuestion]));
}

function renderCrossMovement() {
  const p = state.practice;
  const lang = state.lang;
  const focus = currentCrossFocus();
  if (p.stage === "question" || p.stage === "crossed") return `<section class="practice-stage focused-stage cross-question-stage">
    <div class="doorway-instrument cross-door ${p.stage === "crossed" ? "open" : ""}" role="img" aria-label="${lang === "en" ? `Selected focus: ${focus.en[0]}. ${focus.en[1]}` : `Enfoque seleccionado: ${focus.es[0]}. ${focus.es[1]}`}"><span>${focus.glyph}</span></div>
    <p class="eyebrow">${escapeHTML(focus[lang][0])} · ${lang === "en" ? "QUESTION" : "PREGUNTA"}</p>
    <h1 class="practice-title cross-question">${escapeHTML(currentCrossQuestion())}</h1>
    <p class="lede">${lang === "en" ? "Stay with this for one breath. No answer is required." : "Quédate con esto durante una respiración. No hace falta responder."}</p>
    <div class="cross-tools"><button class="text-button" type="button" data-action="save-cross-question">${p.crossSaved ? (lang === "en" ? "Saved" : "Guardada") : (lang === "en" ? "Save question" : "Guardar pregunta")}</button><button class="text-button" type="button" data-action="another-cross-question">${lang === "en" ? "Another question" : "Otra pregunta"}</button></div>
    <p class="consent-copy">${lang === "en" ? "No answer is required. Leave whenever you have enough." : "No hace falta responder. Sal cuando hayas tenido suficiente."}</p>
    ${p.stage === "crossed" ? `<button class="primary-button" type="button" data-action="cross-ready">${tr("continue")}</button>` : `<div class="cross-decisions" aria-label="${lang === "en" ? "Threshold choices" : "Opciones del umbral"}">
      <p id="cross-choice-hint" class="sr-only">${lang === "en" ? "Cross when ready opens the threshold without leaving this question." : "Cruzar cuando estés listo abre el umbral sin dejar esta pregunta."}</p>
      <p id="cross-remain-hint" class="sr-only">${lang === "en" ? "Keeps the threshold open without requiring a crossing" : "Mantiene abierto el umbral sin exigir que lo cruces"}</p>
      <p id="cross-return-hint" class="sr-only">${lang === "en" ? "Returns without treating the crossing as required" : "Vuelve sin tratar el cruce como una obligación"}</p>
      <button type="button" data-action="cross-ready" aria-describedby="cross-choice-hint">${lang === "en" ? "Cross when ready" : "Cruzar cuando estés listo"}</button>
      <button type="button" data-action="cross-remain" aria-pressed="${p.crossRemaining}" aria-describedby="cross-remain-hint">${lang === "en" ? "Remain with the question" : "Permanecer con la pregunta"}${p.crossRemaining ? `<small>${lang === "en" ? "Chosen for now" : "Elegido por ahora"}</small>` : ""}</button>
      <button type="button" data-action="cross-return-focus" aria-describedby="cross-return-hint">${lang === "en" ? "Return to focus choices" : "Volver a las opciones de enfoque"}</button>
    </div>${p.crossRemaining ? `<p class="consent-copy remaining-copy">${lang === "en" ? "Remaining with the question. Cross or return only if you choose." : "Te quedas con la pregunta. Cruza o vuelve solo si así lo eliges."}</p>` : ""}`}
  </section>`;
  if (p.stage === "close") return `<section class="practice-stage focused-stage"><div class="doorway-instrument cross-door open" aria-hidden="true"><span>│</span></div><p class="eyebrow">${lang === "en" ? "RETURN" : "REGRESO"}</p>
    ${renderMovementHeading(lang === "en" ? "Take only what feels useful." : "Quédate solo con lo que sea útil.", lang === "en" ? "Keep the question, or leave it here." : "Guarda la pregunta o déjala aquí.")}
    <button class="primary-button" type="button" data-action="complete-movement">${lang === "en" ? "Return to practice menu" : "Volver al menú de prácticas"}</button></section>`;
  return `<section class="practice-stage focused-stage">${renderMovementHeading(lang === "en" ? "Choose a focus" : "Elige un enfoque", lang === "en" ? "Choose what feels closest." : "Elige lo que se sienta más cercano.")}
    <div class="cross-focus-grid">${(p.crossExpanded ? crossFocuses : crossFocuses.slice(0, 6)).map(item => `<button class="cross-focus-choice ${item.id === focus.id ? "selected" : ""}" type="button" data-cross-focus="${item.id}" aria-pressed="${item.id === focus.id}"><span>${item.glyph}</span><strong>${item[lang][0]}</strong><small>${item[lang][1]}</small></button>`).join("")}</div>
    <button class="text-button" type="button" data-action="toggle-cross-more">${p.crossExpanded ? (lang === "en" ? "Show six core doors" : "Mostrar seis puertas principales") : (lang === "en" ? "More doors" : "Más puertas")}</button>
    ${readJSON(STORAGE.crossMarks, []).length ? `<button class="text-button" type="button" data-action="return-saved-cross">${lang === "en" ? "Return to saved question" : "Volver a una pregunta guardada"}</button>` : ""}
    <button class="primary-button" type="button" data-action="open-cross-question">${lang === "en" ? `Open the ${focus.en[0]} question` : `Abrir la pregunta de ${focus.es[0]}`}</button>
  </section>`;
}

function renderEmbodyMovement() {
  const p = state.practice;
  const lang = state.lang;
  const tone = tones.find(item => item.id === p.tone) || null;
  const rememberedTone = localStorage.getItem(STORAGE.lastHeldTone);
  if (p.embodyStage === "remembered" && tone) return `<section class="practice-stage focused-stage embody-stage">
    <div class="tone-field compact" style="color:${tone.color}" aria-hidden="true"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none"><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div>
    ${renderMovementHeading(lang === "en" ? `Return to ${tone.en}?` : `¿Volver a ${tone.es}?`, lang === "en" ? "This was your last held tone. It is offered as a memory, not a recommendation." : "Este fue tu último tono guardado. Se ofrece como recuerdo, no como recomendación.")}
    <div class="practice-actions"><button class="primary-button" type="button" data-action="use-remembered-tone">${lang === "en" ? "Use this tone" : "Usar este tono"}</button><button class="text-button" type="button" data-action="choose-fresh-tone">${lang === "en" ? "Choose fresh" : "Elegir de nuevo"}</button></div>
  </section>`;
  if (p.embodyStage === "all") return `<section class="practice-stage">${renderMovementHeading(lang === "en" ? "Choose a tone" : "Elige un tono", lang === "en" ? "Choose the quality you want to practise." : "Elige la cualidad que quieres practicar.")}
    <div class="choice-grid">${tones.map(item => `<button class="choice" type="button" data-tone="${item.id}" data-select-tone="1">${item[lang]}</button>`).join("")}</div></section>`;
  if (p.embodyStage === "tune" && tone) return `<section class="practice-stage focused-stage embody-stage"><div class="tone-field" style="color:${tone.color}"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none" aria-hidden="true"><path class="tone-wave-halo" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-light" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div>
    ${renderMovementHeading(tone[lang], lang === "en" ? `Adjust the sound until it feels close enough to ${tone.en}.` : `Ajusta el sonido hasta que se sienta suficientemente cercano a ${tone.es}.`)}
    <details class="dial-help"><summary>${lang === "en" ? "What do the dials change?" : "¿Qué cambian los controles?"}</summary><p><strong>${lang === "en" ? "Frequency:" : "Frecuencia:"}</strong> ${lang === "en" ? "moves the pitch higher or lower; it does not assign meaning or healing." : "sube o baja el tono; no asigna significado ni curación."}</p><p><strong>${lang === "en" ? "Strength:" : "Intensidad:"}</strong> ${lang === "en" ? "changes loudness only. Keep it comfortable, or leave sound off." : "solo cambia el volumen. Mantenlo cómodo o deja el sonido apagado."}</p></details>
    <div class="tone-controls"><label class="range-label">${lang === "en" ? "Frequency" : "Frecuencia"}<input type="range" min="180" max="880" value="${p.frequency}" data-range="frequency"><span>${p.frequency} Hz</span></label><label class="range-label">${lang === "en" ? "Strength" : "Intensidad"}<input type="range" min="10" max="70" value="${p.amplitude}" data-range="amplitude"><span>${p.amplitude}</span></label></div>
    <button class="primary-button" type="button" data-action="embody-hold">${lang === "en" ? "This is it" : "Este es el tono"}</button></section>`;
  if (p.embodyStage === "hold" && tone) return `<section class="practice-stage focused-stage embody-hold-stage"><div class="tone-field large" style="color:${tone.color}"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none" aria-hidden="true"><path class="tone-wave-halo" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-light" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div>
    ${renderMovementHeading(tone[lang], lang === "en" ? "Stay with the tone." : "Quédate con el tono.")}
    <button class="primary-button" type="button" data-action="embody-complete">${lang === "en" ? "Complete practice" : "Completar práctica"}</button></section>`;
  if (p.embodyStage === "after" && tone) return `<section class="practice-stage focused-stage embody-hold-stage embody-after-stage">
    <div class="tone-field large after-image" style="color:${tone.color}" role="img" aria-label="${lang === "en" ? `The after-image of ${tone.en} as its sound recedes` : `La huella de ${tone.es} mientras el sonido se desvanece`}"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none" aria-hidden="true"><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div>
    ${renderMovementHeading(tone[lang], lang === "en" ? "This tone is ready. Carry it if it feels right for you." : "Este tono está listo. Llévalo contigo si sientes que es adecuado para ti.")}
    <p class="consent-copy">${lang === "en" ? "Notice what remains when the sound recedes." : "Observa qué permanece cuando el sonido se desvanece."}</p>
    <button class="primary-button" type="button" data-action="embody-carry">${lang === "en" ? "Carry this tone" : "Llevar este tono"}</button>
    <button class="text-button" type="button" data-action="embody-choose-another">${lang === "en" ? "Choose another tone" : "Elegir otro tono"}</button>
  </section>`;
  const toneColor = tone?.color || "#b7afa2";
  const toneName = tone?.[lang] || (lang === "en" ? "No tone selected" : "Ningún tono seleccionado");
  const selectionContext = tone && rememberedTone === tone.id
    ? (lang === "en" ? "Last held tone — choose again if it no longer fits." : "Último tono guardado — vuelve a elegir si ya no encaja.")
    : tone
      ? (lang === "en" ? "Choose the tone" : "Elige el tono")
      : (lang === "en" ? "Begin without a prescribed tone." : "Empieza sin un tono preestablecido.");
  return `<section class="practice-stage focused-stage embody-stage"><div class="tone-field compact ${tone ? "" : "neutral"}" style="color:${toneColor}"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none" aria-hidden="true"><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div><p class="eyebrow embody-selection-context">${selectionContext}</p><h1 class="practice-title" style="color:${toneColor}">${toneName}</h1>
    <div class="tone-carousel"><button class="icon-button" type="button" data-action="previous-tone" aria-label="${lang === "en" ? "Previous tone" : "Tono anterior"}">‹</button><button class="primary-button" type="button" data-action="enter-tone" ${tone ? "" : "disabled"}>${lang === "en" ? "Enter this tone" : "Entrar en este tono"}</button><button class="icon-button" type="button" data-action="next-tone" aria-label="${lang === "en" ? "Next tone" : "Tono siguiente"}">›</button></div>
    <button class="text-button" type="button" data-action="show-all-tones">${lang === "en" ? "All tones" : "Todos los tonos"}</button></section>`;
}

function startMovement(id) {
  stopPracticeTimers();
  state.practice = newPractice();
  state.practice.movement = id;
  state.practice.stage = {
    notice: "arrive",
    stabilise: "chooser",
    discern: "practice",
    reclaim: "authority",
    cross: "choose",
    embody: "choose",
    integrate: "practice"
  }[id] || "practice";
  if (id === "embody" && state.practice.tone) state.practice.embodyStage = "remembered";
  state.view = "movement";
  if (state.stack.at(-1) !== "practice") state.stack.push("practice");
  render();
  focusCurrentView();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function playCapacityStageVoice(id, step) {
  const cue = {
    "discern:0": "ts_discern_direct_v1",
    "discern:1": "ts_discern_added_v1",
    "discern:2": "ts_discern_honest_v1",
    "integrate:0": "ts_integrate_include_v1",
    "integrate:2": "ts_integrate_carry_v1"
  }[`${id}:${step}`];
  if (!state.voice) {
    showToast(phrase("Voice is off. You can turn it on in Settings.", "La voz está desactivada. Puedes activarla en Ajustes."));
    return;
  }
  if (cue) sound.playVoice(cue);
}

function playEngineStageVoice() {
  const engine = contentByID(catalogFor(state.lang).practiceEngines, state.selectedEngine);
  const stepID = engine?.steps?.[state.engineStep]?.id;
  const cue = {
    "reciprocal-creation-desire": "ts_reciprocal_desire_v1",
    "reciprocal-creation-nourishment": "ts_reciprocal_nourishment_v1",
    "reciprocal-creation-contribution": "ts_reciprocal_contribution_v1",
    "reciprocal-creation-feared-change": "ts_reciprocal_include_fear_v1",
    "reciprocal-creation-action": "ts_reciprocal_action_v1",
    "attunement-compass-pull": "ts_attunement_pull_v1",
    "attunement-compass-capacity": "ts_attunement_capacity_v1",
    "attunement-compass-context": "ts_attunement_context_v1",
    "attunement-compass-meeting": "ts_attunement_meeting_v1",
    "attunement-compass-next-step": "ts_attunement_next_step_v1"
  }[stepID];
  if (!state.voice) {
    showToast(phrase("Voice is off. You can turn it on in Settings.", "La voz está desactivada. Puedes activarla en Ajustes."));
    return;
  }
  if (cue) sound.playVoice(cue);
}

function startFullPractice() {
  startMovement(movements[0].id);
  state.practice.sequence = true;
  render();
}

function advanceFullPractice() {
  const current = movements.findIndex(item => item.id === state.practice.movement);
  const next = movements[current + 1];
  if (!next) { state.practice.stage = "continuity"; render(); return; }
  const sequence = true;
  startMovement(next.id);
  state.practice.sequence = sequence;
  render();
}

function returnToMovementField() {
  stopPracticeTimers();
  state.practice = newPractice();
  state.view = "practice";
  if (state.stack.at(-1) === "practice") state.stack.pop();
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function movementBack() {
  const p = state.practice;
  const id = p.movement;
  if (p.stage === "continuity") {
    p.stage = id === "notice" ? "close" : id === "stabilise" ? "complete" : id === "reclaim" ? "complete" : id === "cross" ? "close" : id === "embody" ? "hold" : "practice";
  } else if (id === "notice" && p.stage === "close") p.stage = "noting";
  else if (id === "notice" && p.stage === "noting") p.stage = "arrive";
  else if (id === "stabilise" && p.stage === "complete") p.stage = "setup";
  else if (id === "stabilise" && p.stage === "patterns") p.stage = p.steadyState ? "setup" : "chooser";
  else if (id === "stabilise" && p.steadyState) { p.steadyState = ""; p.breathPattern = ""; p.stage = "chooser"; }
  else if ((id === "discern" || id === "integrate") && p.capacityStep > 0) {
    p.capacityStep -= 1;
    p.selectedOption = p.capacityAnswers[p.capacityStep] || "";
  } else if (id === "reclaim" && p.stage === "complete") p.stage = "relationship";
  else if (id === "reclaim" && p.stage === "relationship") p.stage = "pause";
  else if (id === "reclaim" && p.stage === "pause") p.stage = p.customPull ? "custom" : "authority";
  else if (id === "reclaim" && p.stage === "confirm") p.stage = p.customPull ? "custom" : "authority";
  else if (id === "reclaim" && p.stage === "custom") p.stage = "authority";
  else if (id === "cross" && p.stage === "close") p.stage = "question";
  else if (id === "cross" && (p.stage === "question" || p.stage === "crossed" || p.stage === "focuses")) p.stage = "choose";
  else if (id === "embody" && p.embodyStage === "after") p.embodyStage = "hold";
  else if (id === "embody" && p.embodyStage === "hold") p.embodyStage = "tune";
  else if (id === "embody" && p.embodyStage === "tune") p.embodyStage = "choose";
  else if (id === "embody" && p.embodyStage === "all") p.embodyStage = "choose";
  else { returnToMovementField(); return; }
  stopPracticeTimers();
  render();
  focusCurrentView();
}

function requestMovementCompletion() {
  stopPracticeTimers();
  if (state.practice.sequence && state.practice.movement !== movements.at(-1).id) { advanceFullPractice(); return; }
  state.practice.stage = "continuity";
  render();
}

function finishMovement(save) {
  const p = state.practice;
  const movement = movementByID();
  if (save) {
    const noticeOutcomes = state.lang === "en"
      ? ["Clearer", "Different", "No change", "Not sure"]
      : ["Más claro", "Diferente", "Sin cambio", "No lo sé"];
    const detail = p.movement === "cross" ? currentCrossQuestion()
      : p.movement === "reclaim" ? p.relation
      : p.movement === "embody" ? (tones.find(item => item.id === p.tone)?.[state.lang] || "")
      : p.movement === "notice" ? (noticeOutcomes[Number(p.noticeOutcome)] || "")
      : p.capacityAnswers.filter(Boolean).join(" · ");
    addTrace({ type: "practice", title: local(movement).name, detail: detail || local(movement).line });
    showToast(tr("saved"));
  }
  returnToMovementField();
}

function selectedBreathPattern() {
  const selectedState = steadyStates.find(item => item.id === state.practice.steadyState);
  return BREATH_PATTERNS[state.practice.breathPattern || selectedState?.pattern] || BREATH_PATTERNS.extended;
}

function selectedBreathPatternKey() {
  const selectedState = steadyStates.find(item => item.id === state.practice.steadyState);
  const key = state.practice.breathPattern || selectedState?.pattern;
  return BREATH_PATTERNS[key] ? key : "extended";
}

function breathInstrumentURL() {
  const patternKey = selectedBreathPatternKey();
  const pattern = selectedBreathPattern();
  const elapsed = Math.max(0, (Date.now() - state.practice.breathStartedAt) / 1000);
  const reduced = state.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const query = new URLSearchParams({
    pattern: patternKey,
    rgb: pattern.rgb,
    lang: state.lang,
    reduce: reduced ? "1" : "0",
    elapsed: elapsed.toFixed(3)
  });
  return `${ROOT}breath-instrument.html?${query}`;
}

function renderStabiliseSession() {
  const lang = state.lang;
  const selectedState = steadyStates.find(item => item.id === state.practice.steadyState);
  const pattern = selectedBreathPattern();
  const patternCopy = pattern[lang];
  const consent = lang === "en"
    ? "Stop at any time. Let the breath return to its natural rhythm."
    : "Detente cuando quieras. Deja que la respiración vuelva a su ritmo natural.";
  return `<main class="steady-session" style="--steady-rgb:${pattern.rgb}">
    <iframe class="steady-breath-instrument" src="${breathInstrumentURL()}" title="${lang === "en" ? "Breathing guide" : "Guía de respiración"}" tabindex="-1"></iframe>
    <header class="steady-session-header">
      <button class="icon-button" type="button" data-action="stop-breath" aria-label="${lang === "en" ? "Leave breathing practice" : "Salir de la práctica de respiración"}">‹</button>
      <div><strong>${lang === "en" ? "Stabilise" : "Estabilizar"}</strong><span>${escapeHTML(selectedState?.[lang]?.[0] || patternCopy.title)}</span></div>
    </header>
    <footer class="steady-session-footer">
      <strong class="steady-session-timer" data-breath-timer>${Math.floor(state.practice.breathDuration / 60)}:${String(state.practice.breathDuration % 60).padStart(2, "0")}</strong>
      <p>${consent}</p>
      <button class="primary-button" type="button" data-action="stop-breath">${lang === "en" ? "Enough" : "Suficiente"}</button>
    </footer>
    <span class="sr-only" data-breath-status aria-live="polite"></span>
  </main>`;
}

function renderMovement(id) {
  const lang = state.lang;
  const p = state.practice;
  if (id === "notice") {
    const cue = noticeCues[lang][p.noticeCue];
    return `<button class="instrument-region notice-instrument" type="button" data-action="notice-tap" aria-label="${lang === "en" ? "Acknowledge what you noticed" : "Reconocer lo que notaste"}">
      <span class="aperture-ring"></span><span class="aperture-line"></span><span class="aperture-point"></span>
    </button>
    <p class="cue-label" data-notice-cue>${escapeHTML(cue)}</p>
    <p class="timer" data-notice-timer>${p.noticeStarted ? "1:00" : ""}</p>
    <button class="secondary-button" type="button" data-action="${p.noticeStarted ? "another-notice-cue" : "start-notice"}">${p.noticeStarted ? (lang === "en" ? "Another cue" : "Otra invitación") : (lang === "en" ? "Begin noticing" : "Comenzar a notar")}</button>`;
  }
  if (id === "stabilise") {
    if (!p.steadyState) {
      return `<div class="choice-grid">${steadyStates.map(item => `<button class="choice" type="button" data-steady="${item.id}"><strong>${item[lang][0]}</strong><br><small>${item[lang][1]}</small></button>`).join("")}</div>`;
    }
    const chosen = steadyStates.find(item => item.id === p.steadyState);
    const pattern = BREATH_PATTERNS[chosen.pattern];
    return `<div class="practice-copy steady-setup-copy">
        <p class="eyebrow">${chosen[lang][0]}</p>
        <h2 class="steady-pattern-title">${escapeHTML(pattern[lang].title)}</h2>
        <p class="lede">${escapeHTML(pattern[lang].cue)}</p>
      </div>
      <button class="primary-button" type="button" data-action="start-breath">${lang === "en" ? "Begin breathing" : "Comenzar respiración"}</button>
      <button class="text-button" type="button" data-action="change-steady">${lang === "en" ? "Choose another state" : "Elegir otro estado"}</button>`;
  }
  if (id === "discern") {
    return `<div class="two-fields">
      <label class="field-label">${lang === "en" ? "What happened?" : "¿Qué ocurrió?"}<textarea class="field-textarea" data-input="facts" placeholder="${lang === "en" ? "Only what a camera could record." : "Solo lo que una cámara podría grabar."}">${escapeHTML(p.facts)}</textarea></label>
      <label class="field-label">${lang === "en" ? "What did your mind add?" : "¿Qué añadió tu mente?"}<textarea class="field-textarea" data-input="story" placeholder="${lang === "en" ? "A guess, fear, meaning or prediction." : "Una suposición, miedo, significado o predicción."}">${escapeHTML(p.story)}</textarea></label>
    </div>
    <p class="cue-label">${lang === "en" ? "Both can be present. They are not the same thing." : "Ambos pueden estar presentes. No son lo mismo."}</p>`;
  }
  if (id === "reclaim") {
    if (!p.pull) return `<div class="choice-grid">${pulls[lang].map((item, index) => `<button class="choice" type="button" data-pull="${index}">${item}</button>`).join("")}</div>`;
    if (!p.relation) {
      return `<p class="eyebrow" style="text-align:center">${escapeHTML(p.pull)}</p>
        <button class="instrument-region ${p.reclaimHolding ? "hold-active" : ""}" type="button" data-action="reclaim-hold" aria-label="${lang === "en" ? "Hold your centre for one breath" : "Sostén tu centro durante una respiración"}" aria-pressed="${p.reclaimHolding}"><span class="reclaim-line"></span><span class="reclaim-point"></span></button>
        <div class="practice-copy"><p class="lede">${lang === "en" ? "Pause for one natural breath. Then choose the response that gives you the most room to act." : "Haz una pausa durante una respiración natural. Luego elige la respuesta que te dé más espacio para actuar."}</p></div>
        <div class="choice-grid">${relations[lang].map(item => `<button class="choice" type="button" data-relation="${escapeHTML(item)}">${item}</button>`).join("")}</div>`;
    }
    return `<div class="completion-seal"><div class="seal-orb"></div><p class="eyebrow">${escapeHTML(p.pull)}</p><h2 class="practice-title">${escapeHTML(p.relation)}</h2><p class="lede">${lang === "en" ? "You can hear what is present without giving it control." : "Puedes escuchar lo que está presente sin entregarle el control."}</p></div>`;
  }
  if (id === "cross") {
    const doorway = doorways.find(item => item.id === p.doorway) || doorways[0];
    return `<div class="instrument-region doorway-instrument" aria-hidden="true"></div>
      <div class="practice-copy"><p class="eyebrow">${doorway[lang][0]}</p><h2 class="practice-title">${doorway[lang][2]}</h2><p class="lede">${doorway[lang][1]}</p></div>
      <div class="choice-grid">${doorways.map(item => `<button class="choice ${item.id === p.doorway ? "selected" : ""}" type="button" data-doorway="${item.id}">${item[lang][0]}</button>`).join("")}</div>
      <button class="secondary-button" type="button" data-action="save-question">${p.questionSaved ? (lang === "en" ? "Question kept" : "Pregunta guardada") : (lang === "en" ? "Keep this question" : "Guardar esta pregunta")}</button>`;
  }
  if (id === "embody") {
    const tone = tones.find(item => item.id === p.tone) || tones[0];
    return `<div class="tone-field" style="color:${tone.color}"><div class="tone-orb"></div><svg class="tone-wave" viewBox="0 300 1024 440" preserveAspectRatio="none" aria-hidden="true"><path class="tone-wave-halo" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-main" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path><path class="tone-wave-light" d="M92 558 C154 558 210 414 306 386 C397 360 445 504 520 582 C593 658 662 674 742 596 C812 528 858 506 932 514"></path></svg></div>
      <div class="practice-copy"><p class="eyebrow">${lang === "en" ? "Choose the tone" : "Elige el tono"}</p><h2 class="practice-title" style="color:${tone.color}">${tone[lang]}</h2></div>
      <div class="choice-grid">${tones.map(item => `<button class="choice ${item.id === p.tone ? "selected" : ""}" type="button" data-tone="${item.id}">${item[lang]}</button>`).join("")}</div>
      <div class="tone-controls">
        <label class="range-label">${lang === "en" ? "Frequency" : "Frecuencia"}<input type="range" min="180" max="880" value="${p.frequency}" data-range="frequency"><span>${p.frequency} Hz</span></label>
        <label class="range-label">${lang === "en" ? "Strength" : "Intensidad"}<input type="range" min="10" max="70" value="${p.amplitude}" data-range="amplitude"><span>${p.amplitude}</span></label>
      </div>
      <button class="primary-button" type="button" data-action="toggle-tone">${p.tonePlaying ? (lang === "en" ? "Let the tone rest" : "Dejar descansar el tono") : (lang === "en" ? "Enter this tone" : "Entrar en este tono")}</button>`;
  }
  const suggested = p.act || currentAct()[lang === "en" ? 0 : 2];
  return `<div class="completion-seal"><div class="seal-orb"></div><p class="eyebrow">${lang === "en" ? "A form for your tone" : "Una forma para tu tono"}</p><h2 class="practice-title">${escapeHTML(suggested)}</h2></div>
    <label class="field-label">${lang === "en" ? "Your small act" : "Tu pequeño acto"}<input class="field-input" data-input="act" value="${escapeAttribute(p.act)}" placeholder="${escapeAttribute(currentAct()[lang === "en" ? 1 : 3])}"></label>
    <label class="field-label">${lang === "en" ? "One note, if useful" : "Una nota, si ayuda"}<textarea class="field-textarea" data-input="reflection" placeholder="${lang === "en" ? "What do you want to remember?" : "¿Qué quieres recordar?"}">${escapeHTML(p.reflection)}</textarea></label>`;
}

function nextMovement() {
  if (state.practice.index < movements.length - 1) {
    stopPracticeTimers();
    state.practice.index += 1;
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  savePracticeTrace();
}

function previousMovement() {
  if (state.practice.index <= 0) return;
  stopPracticeTimers();
  state.practice.index -= 1;
  render();
}

function playMovementVoice(id) {
  const cues = {
    discern: "ts_discern_direct_v1",
    cross: "ts_cross_open_question_v1",
    embody: "ts_embody_enter_v1",
    integrate: "ts_integrate_carry_v1"
  };
  if (cues[id]) sound.playVoice(cues[id], 0.28);
}

function savePracticeTrace() {
  const p = state.practice;
  const tone = tones.find(item => item.id === p.tone) || tones[0];
  const doorway = doorways.find(item => item.id === p.doorway) || doorways[0];
  const fallbackAct = currentAct()[state.lang === "en" ? 0 : 2];
  addTrace({
    type: "practice",
    title: state.lang === "en" ? `${tone.en} carried forward` : `Tono elegido: ${tone.es}`,
    detail: p.act.trim() || fallbackAct,
    data: { facts: p.facts, story: p.story, pull: p.pull, relation: p.relation, doorway: doorway[state.lang][0], question: doorway[state.lang][2], tone: tone[state.lang] }
  });
  state.practice = newPractice();
  showToast(tr("saved"));
  navigate("home", { remember: false });
}

function resumePracticeView() {
  if (state.practice.noticeStarted) startNoticeTimer(false);
  if (state.practice.breathStartedAt) startBreathTimer(false);
}

function stopPracticeTimers() {
  window.clearInterval(practiceTimer);
  window.clearInterval(guidedSitTimer);
  window.clearTimeout(reclaimHoldTimer);
  practiceTimer = 0;
  guidedSitTimer = 0;
  reclaimHoldTimer = 0;
  breathLastPhaseKey = "";
  sound.stop();
  state.practice.tonePlaying = false;
}

function startNoticeTimer(reset = true) {
  if (reset) {
    state.practice.noticeStartedAt = Date.now();
    state.practice.noticeManualCue = -1;
    state.practice.noticeManualUntil = 0;
    state.practice.noticeLastManualCue = -1;
    state.practice.noticeCue = 0;
  }
  state.practice.noticeStarted = true;
  window.clearInterval(practiceTimer);
  const update = () => {
    const now = Date.now();
    const elapsed = (now - state.practice.noticeStartedAt) / 1000;
    const guidedCueDuration = state.practice.noticeDuration === 30 ? 5 : state.practice.noticeDuration === 90 ? 12 : 10;
    const automaticCue = Math.min(4, Math.floor(elapsed / guidedCueDuration));
    const manualIsActive = state.practice.noticeManualCue >= 0 && now < state.practice.noticeManualUntil;
    const cue = manualIsActive ? state.practice.noticeManualCue : automaticCue;
    if (!manualIsActive && state.practice.noticeManualCue >= 0) {
      state.practice.noticeManualCue = -1;
      state.practice.noticeManualUntil = 0;
    }
    if (cue !== state.practice.noticeCue) {
      state.practice.noticeCue = cue;
      if (state.practice.guidance === "guided") sound.playVoice(noticeVoiceCues[cue]);
      announce(noticeCues[state.lang][cue]);
    }
    const remaining = Math.max(0, state.practice.noticeDuration - Math.floor(elapsed));
    const timer = document.querySelector("[data-notice-timer]");
    const cueNode = document.querySelector("[data-notice-cue]");
    if (timer) timer.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
    if (cueNode) cueNode.textContent = noticeCues[state.lang][cue];
    if (remaining <= 0) {
      window.clearInterval(practiceTimer);
      practiceTimer = 0;
      state.practice.noticeStarted = false;
      state.practice.stage = "close";
      announce(state.lang === "en" ? "Practice complete" : "Práctica completa");
      render();
    }
  };
  update();
  practiceTimer = window.setInterval(update, 250);
}

async function beginNoticePractice() {
  try {
    if (state.practice.guidance === "guided" && state.voice) await sound.prepareVoiceCues(noticeVoiceCues);
  } catch {
    showToast(state.lang === "en" ? "Voice guidance could not start." : "No se pudo iniciar la guía de voz.");
  }
  state.practice.noticeStarted = true;
  state.practice.stage = "noting";
  state.practice.noticeStartedAt = Date.now();
  state.practice.noticeCue = 0;
  state.practice.noticeManualCue = -1;
  state.practice.noticeManualUntil = 0;
  state.practice.noticeLastManualCue = -1;
  state.practice.noticeAcknowledged = false;
  render();
  if (state.practice.guidance === "guided") sound.playVoice(noticeVoiceCues[0]);
  announce(noticeCues[state.lang][0]);
}

function offerAnotherNoticeCue() {
  const currentGuidedCue = state.practice.noticeCue < 4 ? state.practice.noticeCue : -1;
  const previousCue = state.practice.noticeLastManualCue >= 0
    ? state.practice.noticeLastManualCue
    : currentGuidedCue;
  const cue = (previousCue + 1) % 4;
  state.practice.noticeLastManualCue = cue;
  state.practice.noticeManualCue = cue;
  state.practice.noticeManualUntil = Date.now() + NOTICE.manualCueDuration * 1000;
  state.practice.noticeCue = cue;
  state.practice.noticeAcknowledged = false;
  render();
  if (state.practice.guidance === "guided") sound.playVoice(noticeVoiceCues[cue]);
  announce(noticeCues[state.lang][cue]);
}

function breathFrameAt(pattern, elapsed) {
  const cycleDuration = pattern.phases.reduce((sum, phase) => sum + phase.duration, 0);
  const cycleIndex = Math.floor(elapsed / cycleDuration);
  const cycleElapsed = elapsed % cycleDuration;
  let cursor = 0;
  for (let index = 0; index < pattern.phases.length; index += 1) {
    const phase = pattern.phases[index];
    if (cycleElapsed < cursor + phase.duration || index === pattern.phases.length - 1) {
      return { phase, index, cycleIndex, key: `${cycleIndex}:${index}` };
    }
    cursor += phase.duration;
  }
  return { phase: pattern.phases[0], index: 0, cycleIndex, key: `${cycleIndex}:0` };
}

function breathVoiceCues(pattern) {
  return [...new Set([
    ...pattern.phases.map(phase => phase.voice).filter(Boolean),
    ...(pattern === BREATH_PATTERNS.anapana ? ["ts_stabilise_return_attention_v1"] : [])
  ])];
}

async function beginBreathPractice() {
  const pattern = selectedBreathPattern();
  try {
    if (state.practice.guidance === "guided" && state.voice) await sound.prepareVoiceCues(breathVoiceCues(pattern));
    else if (state.sound) await sound.ready();
  } catch {
    showToast(state.lang === "en" ? "Breathing audio could not start." : "No se pudo iniciar el audio de respiración.");
  }
  state.practice.stage = "breath";
  state.practice.breathStartedAt = Date.now();
  breathLastPhaseKey = "";
  render();
}

async function startBreathTimer(reset = true) {
  if (reset) {
    state.practice.breathStartedAt = Date.now();
    breathLastPhaseKey = "";
  }
  const startedAt = state.practice.breathStartedAt;
  const patternKey = selectedBreathPatternKey();
  const pattern = selectedBreathPattern();
  try { await sound.startBreathPattern(patternKey); } catch {}
  if (!state.practice.breathStartedAt || state.practice.breathStartedAt !== startedAt) return;
  window.clearInterval(practiceTimer);
  const update = () => {
    const elapsed = (Date.now() - state.practice.breathStartedAt) / 1000;
    const remaining = Math.max(0, state.practice.breathDuration - Math.floor(elapsed));
    const timerNode = document.querySelector("[data-breath-timer]");
    if (timerNode) timerNode.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
    if (remaining <= 0) {
      window.clearInterval(practiceTimer);
      practiceTimer = 0;
      state.practice.breathStartedAt = 0;
      sound.stop();
      state.practice.stage = "complete";
      announce(state.lang === "en" ? "Breathing practice complete" : "Práctica de respiración completada");
      render();
      return;
    }
    const frame = breathFrameAt(pattern, elapsed);
    if (frame.key !== breathLastPhaseKey) {
      breathLastPhaseKey = frame.key;
      sound.breathPhase(patternKey, frame.phase.sound).catch(() => {});
      let voiceCue = frame.phase.voice;
      if (patternKey === "anapana" && frame.index === 0 && frame.cycleIndex > 0) voiceCue = "ts_stabilise_return_attention_v1";
      if (voiceCue && state.practice.guidance === "guided") sound.playVoice(voiceCue);
      const phaseLabels = state.lang === "en"
        ? { inhale: "Inhale", "inhale-again": "Inhale again", exhale: "Exhale", observe: "Observe the natural breath", "breath-in": "Notice the breath coming in", "breath-out": "Notice the breath going out", natural: "Let breath stay natural" }
        : { inhale: "Inhala", "inhale-again": "Inhala otra vez", exhale: "Exhala", observe: "Observa la respiración natural", "breath-in": "Nota cómo entra la respiración", "breath-out": "Nota cómo sale la respiración", natural: "Deja que la respiración siga natural" };
      const status = phaseLabels[frame.phase.id] || pattern[state.lang].cue;
      const statusNode = document.querySelector("[data-breath-status]");
      if (statusNode) statusNode.textContent = status;
      announce(status);
    }
  };
  update();
  practiceTimer = window.setInterval(update, 100);
}

const fieldColors = ["#d8c49a", "#b9c989", "#d8b45a", "#9ebdd2", "#86b7ad", "#b8a5cc", "#f0dca2"];

function renderFields() {
  const catalog = catalogFor(state.lang);
  return `${renderTopbar(tr("fields"), phrase("A spectrum of increasing inclusion", "Un espectro de inclusión creciente"))}
    <main class="page wide">
      <header class="section-intro"><p class="eyebrow">${phrase("Nested, not ranked", "Anidados, no jerárquicos")}</p><h1 class="page-title">${phrase("The Seven Nested Fields", "Los Siete Campos Anidados")}</h1><p class="lede measure">${phrase("Every Field contributes an essential capacity. Growth carries each mature gift into a wider, more responsible way of participating.", "Cada Campo aporta una capacidad esencial. Crecer lleva cada don maduro hacia una manera más amplia y responsable de participar.")}</p></header>
      <section class="nested-map" aria-label="${phrase("The Seven Nested Fields", "Los Siete Campos Anidados")}">
        ${catalog.fields.map((field, index) => `<span class="field-ring" style="--size:${18 + index * 11}%;--ring-color:${fieldColors[index]}" aria-hidden="true"></span>`).join("")}
        <div class="field-nodes">${catalog.fields.map((field, index) => `<button class="field-node" type="button" data-field="${field.id}" style="--field-color:${fieldColors[index]}"><span class="field-number">${field.dimension}D</span><span><strong>${escapeHTML(field.title)}</strong><small>${escapeHTML(field.archetype)} · ${escapeHTML(field.gift)}</small></span></button>`).join("")}</div>
      </section>
      <section class="start-here"><p class="eyebrow">${phrase("The Principle of Nested Fields", "El principio de los Campos Anidados")}</p><p class="lede">${phrase("The Seven Fields are increasingly inclusive ways of participating in reality. Every wider Field carries forward the mature gifts of those before it.", "Los Siete Campos son formas cada vez más inclusivas de participar en la realidad. Cada Campo más amplio conserva los dones maduros de los anteriores.")}</p><button class="secondary-button" type="button" data-view="nestedFields">${phrase("Open the Principle of Nested Fields", "Abrir el principio de los Campos Anidados")}</button></section>
    </main>`;
}

function renderNestedFields() {
  const catalog = catalogFor(state.lang);
  const principle = contentByID(catalog.principles, "principle-31");
  const companions = catalog.libraryEntries.filter(entry => principle.libraryEntryIDs?.includes(entry.id));
  return `${renderTopbar(phrase("Nested Fields", "Campos Anidados"), phrase("Every wider Field carries the gifts before it", "Cada Campo más amplio conserva los dones anteriores"))}
    <main class="page nested-fields-page">
      <header class="section-intro"><p class="eyebrow">${phrase("The Principle of Nested Fields", "El principio de los Campos Anidados")}</p><h1 class="page-title">${phrase("Growth includes what came before.", "Crecer incluye lo que vino antes.")}</h1><p class="lede">${phrase("The Seven Fields are not levels that replace one another. They are increasingly inclusive ways of participating in reality. Every wider Field carries forward the mature gifts of those before it.", "Los Siete Campos no son niveles que se reemplazan entre sí. Son formas cada vez más inclusivas de participar en la realidad. Cada Campo más amplio conserva los dones maduros de los anteriores.")}</p></header>
      <section class="nested-spectrum" aria-label="${phrase("Seven nested Fields", "Siete Campos Anidados")}">${catalog.fields.map((field, index) => `<button type="button" data-field="${field.id}" style="--nested-color:${fieldColors[index]};--nested-index:${index}"><span>${field.dimension}D</span><strong>${escapeHTML(field.title)}</strong><small>${escapeHTML(field.carriesForward)}</small></button>`).join("")}</section>
      <article class="prose"><section><h2>${phrase("The Principle of Inclusion", "El principio de inclusión")}</h2><p>${escapeHTML(principle.meaning)}</p><blockquote>${escapeHTML(principle.contemplativeQuestion)}</blockquote></section></article>
      <div class="practice-actions"><button class="primary-button" type="button" data-principle="${principle.id}">${phrase("Read the Principle of Inclusion", "Leer el principio de inclusión")}</button></div>
      ${companions.length ? `<section><p class="eyebrow">${phrase("Companion teachings", "Enseñanzas relacionadas")}</p><div class="list">${companions.map(entry => `<button class="list-row" type="button" data-entry="${entry.id}"><span><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>→</b></button>`).join("")}</div></section>` : ""}
    </main>`;
}

function primaryMovementForField(field) {
  const capacity = field.linkedPractices?.find(item => item.kind === "capacity");
  return movements.some(item => item.id === capacity?.id) ? capacity.id : "notice";
}

function renderField() {
  const catalog = catalogFor(state.lang);
  const field = contentByID(catalog.fields, state.selectedField);
  const index = Math.max(0, catalog.fields.findIndex(item => item.id === field.id));
  const color = fieldColors[index];
  return `${renderTopbar(`${field.dimension}D · ${escapeHTML(field.title)}`, field.archetype)}
    <main class="page">
      <header class="section-intro"><p class="eyebrow">${escapeHTML(field.archetype)}</p><h1 class="page-title" style="color:${color}">${escapeHTML(field.title)}</h1><p class="lede">${escapeHTML(field.coreTeaching)}</p></header>
      <div class="instrument-region field-emblem" style="border-color:${color};color:${color}" aria-hidden="true"><span class="field-number" style="--field-color:${color};font-size:1.5rem">${field.dimension}D</span><small>${escapeHTML(field.sovereignPhrase)}</small></div>
      <section class="carry-forward"><p class="eyebrow">${phrase("What this Field carries forward", "Lo que este Campo lleva consigo")}</p><p><strong>${phrase("Carries forward:", "Lleva consigo:")}</strong> ${escapeHTML(field.carriesForward)}</p><p><strong>${phrase("Adds:", "Añade:")}</strong> ${escapeHTML(field.adds)}</p></section>
      <article class="prose field-teaching">
        <section><h2>${phrase("Gift", "Don")}</h2><p>${escapeHTML(field.gift)}</p></section>
        <section><h2>${phrase("When the gift loses balance", "Cuando el don pierde equilibrio")}</h2><p>${escapeHTML(field.shadow)}</p></section>
        <section><h2>${phrase("Sovereign question", "Pregunta soberana")}</h2><blockquote>${escapeHTML(field.sovereignQuestion)}</blockquote></section>
        <section><h2>${phrase("Return", "Regreso")}</h2><p>${escapeHTML(field.returnPractice)}</p></section>
        <section><h2>${phrase("Expand", "Expansión")}</h2><p>${escapeHTML(field.expansionPractice)}</p></section>
        <section><h2>${phrase("Golden Age expression", "Expresión de la Edad Dorada")}</h2><p>${escapeHTML(field.goldenAgeExpression)}</p></section>
      </article>
      <div class="practice-actions"><button class="primary-button" type="button" data-action="open-field-return" data-field="${field.id}">${phrase("Experience the return", "Experimentar el regreso")}</button><button class="text-button" type="button" data-view="nestedFields">${phrase("The Principle of Nested Fields", "El principio de los Campos Anidados")}</button></div>
    </main>`;
}

function guidedExperienceDefinition() {
  const catalog = catalogFor(state.lang);
  const entry = contentByID(catalog.libraryEntries, state.selectedEntry);
  const field = contentByID(catalog.fields, state.selectedField);
  if (state.guidedKind === "field-return") return {
    navigationTitle: field.title,
    eyebrow: phrase("Return practice", "Práctica de regreso"),
    phases: [
      [field.archetype, field.returnPractice, field.sovereignPhrase],
      [phrase("Sovereign question", "Pregunta soberana"), field.sovereignQuestion, phrase("No answer is required. Notice what is true for you.", "No hace falta responder. Observa lo que sea verdadero para ti.")],
      [phrase("Golden Age expression", "Expresión de la Edad Dorada"), field.goldenAgeExpression, phrase("Carry only what belongs in this moment.", "Lleva solo lo que corresponda a este momento.")]
    ],
    finalTitle: `${phrase("Continue with", "Continuar con")} ${escapeHTML(local(movementByID(primaryMovementForField(field))).name)}`
  };
  if (state.guidedKind === "entry-crossing") return {
    navigationTitle: entry.title,
    eyebrow: phrase("Sovereign question", "Pregunta soberana"),
    phases: [["", entry.sovereignQuestion, phrase("Keep the question if it is useful. Its meaning remains yours.", "Guarda la pregunta si te resulta útil. Su significado sigue siendo tuyo.")]],
    finalTitle: phrase("Enter a Sovereign Crossing", "Entrar en un cruce soberano")
  };
  if (state.guidedKind === "entry-act") return {
    navigationTitle: entry.title,
    eyebrow: phrase("Embodied act", "Acto encarnado"),
    phases: [["", entry.embodiedAct, entry.goldenAgeExpression]],
    finalTitle: phrase("Carry this act", "Llevar este acto")
  };
  if (state.guidedKind === "entry-deeper") {
    const link = entry.appLinks?.[0];
    return {
      navigationTitle: entry.title,
      eyebrow: phrase("Go deeper", "Profundizar"),
      phases: [[link?.label || "", entry.coreTeaching, phrase("Continue only if this remains useful now.", "Continúa solo si esto sigue siendo útil ahora.")]],
      finalTitle: `${phrase("Open", "Abrir")} ${escapeHTML(link?.label || local(movementByID(entry.tags.capacities[0])).name)}`
    };
  }
  return {
    navigationTitle: entry.title,
    eyebrow: phrase("Two-minute practice", "Práctica de dos minutos"),
    phases: entry.twoMinutePractice.map((instruction, index) => [
      `${phrase("Step", "Paso")} ${index + 1} ${phrase("of", "de")} ${entry.twoMinutePractice.length}`,
      instruction,
      index === entry.twoMinutePractice.length - 1 ? phrase("Nothing more is required.", "No hace falta nada más.") : phrase("Take the time you need before continuing.", "Tómate el tiempo que necesites antes de continuar.")
    ]),
    finalTitle: phrase("Complete and return", "Completar y volver")
  };
}

function renderGuidedExperience() {
  const definition = guidedExperienceDefinition();
  const index = Math.min(state.guidedPhase, definition.phases.length - 1);
  const [title, prompt, support] = definition.phases[index];
  const final = index === definition.phases.length - 1;
  return `<header class="topbar"><button class="icon-button" type="button" data-action="guided-back" aria-label="${escapeHTML(index ? phrase("Previous step", "Paso anterior") : phrase("Leave this invitation", "Salir de esta invitación"))}">←</button><div class="topbar-title"><strong>${escapeHTML(definition.navigationTitle)}</strong></div><div class="topbar-actions"><button class="icon-button" type="button" data-action="home" aria-label="${tr("home")}">⌂</button></div></header>
    <main class="page guided-experience-page"><section class="guided-phase"><p class="eyebrow">${escapeHTML(definition.eyebrow)}</p>${title ? `<h2>${escapeHTML(title)}</h2>` : ""}<h1 class="practice-title">${escapeHTML(prompt)}</h1>${support ? `<p class="lede">${escapeHTML(support)}</p>` : ""}</section><div class="practice-actions"><button class="primary-button" type="button" data-action="guided-next">${final ? definition.finalTitle : tr("continue")}</button><button class="text-button" type="button" data-action="guided-leave">${phrase("Leave it here", "Dejarlo aquí")}</button></div></main>`;
}

function completeGuidedExperience() {
  const catalog = catalogFor(state.lang);
  const entry = contentByID(catalog.libraryEntries, state.selectedEntry);
  const field = contentByID(catalog.fields, state.selectedField);
  if (state.guidedKind === "field-return") {
    startMovement(primaryMovementForField(field));
    return;
  }
  if (state.guidedKind === "entry-crossing") {
    startMovement("cross");
    return;
  }
  if (state.guidedKind === "entry-act") {
    addTrace({ type: "act", title: entry.title, detail: entry.embodiedAct });
    navigate("history", { remember: false });
    return;
  }
  if (state.guidedKind === "entry-deeper") {
    const link = entry.appLinks?.[0];
    if (link?.kind === "field" && catalog.fields.some(item => item.id === link.id)) {
      navigate("field", { field: link.id, remember: false });
      return;
    }
    if (movements.some(item => item.id === link?.id)) {
      startMovement(link.id);
      return;
    }
    startMovement(entry.tags.capacities.find(id => movements.some(item => item.id === id)) || "notice");
    return;
  }
  goBack();
}

function libraryFilterOptions(values, selected) {
  return [...values].sort().map(value => `<option value="${escapeAttribute(value)}" ${value === selected ? "selected" : ""}>${escapeHTML(tagLabel(value))}</option>`).join("");
}

function filteredLibraryEntries(catalog) {
  const query = state.libraryQuery.trim().toLocaleLowerCase(state.lang === "es" ? "es" : "en");
  return catalog.libraryEntries.filter(entry => {
    const searchable = [entry.title, entry.summary, entry.sovereignQuestion, entry.libraryCopy].join(" ").toLocaleLowerCase(state.lang === "es" ? "es" : "en");
    return (!query || searchable.includes(query))
      && (state.libraryField === "all" || entry.tags.fields.includes(state.libraryField))
      && (state.libraryDomain === "all" || entry.tags.domains.includes(state.libraryDomain))
      && (state.libraryNeed === "all" || entry.tags.needs.includes(state.libraryNeed));
  });
}

function entrySpectrumColor(entry, catalog) {
  const fieldID = entry?.tags?.fields?.[0];
  const index = catalog.fields.findIndex(field => field.id === fieldID);
  return index >= 0 ? fieldColors[index] : SPECTRUM.teachings;
}

function fieldLinkedSpectrumColor(item, catalog) {
  const fieldID = item?.fieldIDs?.[0];
  const index = catalog.fields.findIndex(field => field.id === fieldID);
  return index >= 0 ? fieldColors[index] : SPECTRUM.teachings;
}

function practiceEngineSpectrumColor(engine) {
  const capacity = engine?.capacitySequence?.find(id => SPECTRUM[id]);
  return capacity ? SPECTRUM[capacity] : SPECTRUM.practice;
}

function renderLibrary() {
  const catalog = catalogFor(state.lang);
  const entries = filteredLibraryEntries(catalog);
  const visibleEntries = entries.slice(0, state.libraryVisibleCount);
  const fields = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.fields));
  const domains = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.domains));
  const needs = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.needs));
  const featuredIDs = ["separate-event-from-interpretation", "body-before-cosmology", "emotion-is-information-not-command", "practise-one-golden-act"];
  const featured = featuredIDs.map(id => catalog.libraryEntries.find(entry => entry.id === id)).filter(Boolean);
  const practiceContent = `<section><p class="eyebrow">${phrase("Longer guided practice", "Práctica guiada más larga")}</p><div class="list"><button class="list-row spectrum-row" style="--item-color:${SPECTRUM.stabilise}" type="button" data-view="guidedSits"><span><strong>${phrase("Guided Sits", "Meditaciones guiadas")}</strong><span>${phrase("Eight practices with 15, 30, 45, or 60 minute options and optional voice guidance.", "Ocho prácticas de 15, 30, 45 o 60 minutos con guía de voz opcional.")}</span></span><b>→</b></button></div></section>
    <section><p class="eyebrow">${phrase("Guided practice paths", "Caminos de práctica guiada")}</p><div class="list">${guidedLibraryPaths[state.lang].map(path => `<button class="list-row spectrum-row" style="--item-color:${SPECTRUM.threshold}" type="button" data-library-path="${path.id}"><span><strong>${escapeHTML(path.title)}</strong><span>${escapeHTML(path.subtitle)}</span></span><b>→</b></button>`).join("")}</div></section>
    <section><p class="eyebrow">${phrase("Two-minute practices", "Prácticas de dos minutos")}</p><div class="list">${featured.map(entry => `<button class="list-row spectrum-row" style="--item-color:${entrySpectrumColor(entry, catalog)}" type="button" data-entry-practice="${entry.id}"><span><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>2 min</b></button>`).join("")}</div><button class="secondary-button" type="button" data-action="browse-two-minute">${phrase("Browse all two-minute practices", "Ver todas las prácticas de dos minutos")}</button></section>
    ${state.showAllPractices ? `<section class="list">${catalog.libraryEntries.map(entry => `<button class="list-row spectrum-row" style="--item-color:${entrySpectrumColor(entry, catalog)}" type="button" data-entry-practice="${entry.id}"><span><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>→</b></button>`).join("")}</section>` : ""}
    <section class="start-here"><button class="primary-button" type="button" data-view="practiceEngines">${phrase("Explore all guided practices", "Explorar todas las prácticas guiadas")}</button></section>`;
  const teachingContent = `<section class="start-here"><p class="eyebrow">${phrase("Begin here", "Comienza aquí")}</p><button class="list-row spectrum-row" style="--item-color:${SPECTRUM.teachings}" type="button" data-view="foundations"><span><strong>${phrase("Laws & Principles", "Leyes y principios")}</strong><span>${phrase("The foundations of conscious participation, with plain-language and deeper explanations.", "Los fundamentos de la participación consciente, con explicaciones sencillas y profundas.")}</span></span><b>→</b></button><button class="list-row spectrum-row" style="--item-color:${SPECTRUM.reclaim}" type="button" data-view="comics"><span><strong>${phrase("Comics", "Cómics")}</strong><span>${phrase("Explore illustrated teachings and optional fiction in distinct story collections.", "Explora enseñanzas ilustradas y ficción opcional en colecciones narrativas distintas.")}</span></span><b>→</b></button></section>
    <section class="library-tools"><label class="search-field"><span>${phrase("Search teachings", "Buscar enseñanzas")}</span><input class="field-input" type="search" value="${escapeAttribute(state.libraryQuery)}" data-library-query placeholder="${phrase("A question, quality or situation", "Una pregunta, cualidad o situación")}"></label><div class="filter-grid"><label>${phrase("Field", "Campo")}<select data-library-filter="field"><option value="all">${phrase("All Fields", "Todos los Campos")}</option>${libraryFilterOptions(fields, state.libraryField)}</select></label><label>${phrase("Theme", "Tema")}<select data-library-filter="domain"><option value="all">${phrase("All themes", "Todos los temas")}</option>${libraryFilterOptions(domains, state.libraryDomain)}</select></label><label>${phrase("Need", "Necesidad")}<select data-library-filter="need"><option value="all">${phrase("All needs", "Todas las necesidades")}</option>${libraryFilterOptions(needs, state.libraryNeed)}</select></label></div><p class="result-count">${entries.length} ${phrase("teachings", "enseñanzas")}</p></section>
    <section class="list">${visibleEntries.map(entry => `<button class="list-row spectrum-row" style="--item-color:${entrySpectrumColor(entry, catalog)}" type="button" data-entry="${entry.id}"><span><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>→</b></button>`).join("") || `<p class="empty-state">${phrase("No teaching matches those filters. Nothing is missing; try a wider search.", "Ninguna enseñanza coincide con esos filtros. No falta nada; prueba una búsqueda más amplia.")}</p>`}</section>
    ${visibleEntries.length < entries.length ? `<button class="secondary-button progressive-disclosure" type="button" data-action="show-more-teachings">${phrase("Show 8 more", "Mostrar 8 más")} · ${entries.length - visibleEntries.length} ${phrase("remaining", "restantes")}</button>` : ""}`;
  return `${renderTopbar(tr("library"), phrase("Back to the five doors", "Volver a las cinco puertas"))}
    <main class="page wide">
      <header class="section-intro"><p class="eyebrow">${tr("library")}</p><h1 class="page-title">${phrase("What would help now?", "¿Qué ayudaría ahora?")}</h1><p class="lede measure">${phrase("Choose something to practise, or explore the idea behind it.", "Elige algo para practicar o explora la idea que hay detrás.")}</p></header>
      <section class="library-mode-choices"><p class="eyebrow">${state.libraryMode ? phrase("Switch at any time", "Cambia cuando quieras") : phrase("Choose a way in", "Elige una forma de entrar")}</p><button class="list-row spectrum-row" style="--item-color:${SPECTRUM.practice}" type="button" data-library-mode="practices" aria-pressed="${state.libraryMode === "practices"}"><span><strong>${phrase("Find a practice", "Encontrar una práctica")}</strong><span>${phrase("Begin a guided path or choose a two-minute practice.", "Comienza un camino guiado o elige una práctica de dos minutos.")}</span></span><b>${state.libraryMode === "practices" ? "✓" : "→"}</b></button><button class="list-row spectrum-row" style="--item-color:${SPECTRUM.teachings}" type="button" data-library-mode="teachings" aria-pressed="${state.libraryMode === "teachings"}"><span><strong>${phrase("Explore a teaching", "Explorar una enseñanza")}</strong><span>${phrase("Start, continue, search, or browse the teachings.", "Comienza, continúa, busca o explora las enseñanzas.")}</span></span><b>${state.libraryMode === "teachings" ? "✓" : "→"}</b></button></section>
      ${state.libraryMode === "practices" ? practiceContent : state.libraryMode === "teachings" ? teachingContent : ""}
    </main>`;
}

function comicContext() {
  const series = comicSeries.find(item => item.id === state.selectedComicSeries) || comicSeries[0];
  const issue = series.issues.find(item => item.number === state.selectedComicIssue) || series.issues[0];
  return { series, issue };
}

function comicImageCount(issue) {
  return issue.pages + (issue.hasCover ? 1 : 0);
}

function comicPageDescriptor(issue, position = 1) {
  if (issue.hasCover && position === 1) return { key: "cover", label: phrase("Cover", "Portada"), storyPage: 0 };
  const storyPage = issue.hasCover ? position - 1 : position;
  return {
    key: `page-${String(storyPage).padStart(2, "0")}`,
    label: `${phrase("Page", "Página")} ${storyPage}`,
    storyPage
  };
}

function comicAssetPath(seriesID, issueOrNumber, position, language = state.lang) {
  const issue = typeof issueOrNumber === "object"
    ? issueOrNumber
    : comicSeries.find(item => item.id === seriesID)?.issues.find(item => item.number === Number(issueOrNumber));
  const descriptor = comicPageDescriptor(issue || { pages: position, hasCover: false }, position);
  const assetSet = issue?.assets?.[language];
  if (assetSet) return descriptor.key === "cover" ? assetSet.cover : assetSet.pages[descriptor.storyPage - 1];
  const issueNumber = String(issue?.number ?? issueOrNumber).padStart(2, "0");
  const pageNumber = String(position).padStart(2, "0");
  return `${ROOT}assets/comics/${language}/${seriesID}/issue-${issueNumber}/page-${pageNumber}.webp`;
}

function comicImageAlt(series, issue, position = 1) {
  const seriesTitle = series[state.lang].title;
  const issueTitle = issue[state.lang];
  const descriptor = comicPageDescriptor(issue, position);
  if (descriptor.key === "cover") {
    return phrase(
      `${seriesTitle}: ${issueTitle}, cover`,
      `${seriesTitle}: ${issueTitle}, portada`
    );
  }
  return phrase(
    `${seriesTitle}${series.kind === "specials" ? ":" : `, Issue ${issue.number}:`} ${issueTitle}, page ${descriptor.storyPage} of ${issue.pages}`,
    `${seriesTitle}${series.kind === "specials" ? ":" : `, número ${issue.number}:`} ${issueTitle}, página ${descriptor.storyPage} de ${issue.pages}`
  );
}

function comicIssueLabel(series, issue) {
  if (series.kind === "specials") return phrase("Special story", "Historia especial");
  return `${phrase("Issue", "Número")} ${issue.number}`;
}

function renderComicLanguageControl() {
  return `<div class="comic-language-control" role="group" aria-label="${phrase("Comic language", "Idioma del cómic")}">
    <button type="button" data-comic-language="en" aria-pressed="${state.lang === "en"}">EN</button>
    <button type="button" data-comic-language="es" aria-pressed="${state.lang === "es"}">ES</button>
  </div>`;
}

function renderComicIssueCard(series, issue) {
  const spanishFallback = state.lang === "es" && !issue.esReady;
  const artLanguage = spanishFallback ? "en" : state.lang;
  const issueLabel = comicIssueLabel(series, issue);
  const openLabel = phrase(`Open ${series.en.title}, ${issueLabel}: ${issue.en}`, `Abrir ${series.es.title}, ${issueLabel}: ${issue.es}`);
  const coverPath = comicAssetPath(series.id, issue, 1, artLanguage);
  const cover = issue.assetReady === false
    ? `<span class="comic-cover-placeholder" role="img" aria-label="${escapeAttribute(phrase("Cover artwork in preparation", "Ilustración de portada en preparación"))}" data-comic-asset-path="${escapeAttribute(coverPath)}"><small>${escapeHTML(issueLabel)}</small><strong>${escapeHTML(issue[state.lang])}</strong><span>${phrase("Artwork in preparation", "Ilustraciones en preparación")}</span></span>`
    : `<img src="${coverPath}" data-comic-fallback="${comicAssetPath(series.id, issue, 1, "en")}" loading="lazy" decoding="async" alt="">`;
  return `<button class="comic-issue-card" type="button" data-comic-series="${series.id}" data-comic-issue="${issue.number}" aria-label="${escapeAttribute(openLabel)}">
    <span class="comic-cover-wrap">${cover}</span>
    <span class="comic-card-copy"><small>${escapeHTML(issueLabel)} · ${series.kind === "specials" ? `${issue.pages} ${phrase("story pages", "páginas de historia")} + ${phrase("cover", "portada")}` : `${issue.pages} ${phrase("pages", "páginas")}`}</small><strong>${escapeHTML(issue[state.lang])}</strong>${spanishFallback ? `<span>${phrase("Spanish edition in preparation · English available", "Edición en español en preparación · disponible en inglés")}</span>` : ""}${issue.assetReady === false ? `<span>${phrase("Reader scaffold ready · artwork forthcoming", "Lector preparado · ilustraciones próximamente")}</span>` : ""}</span>
  </button>`;
}

function renderComics() {
  const publishedSeries = comicSeries
    .map(series => ({ ...series, issues: series.issues.filter(issue => issue.published !== false) }))
    .filter(series => series.issues.length > 0);
  return `${renderTopbar(phrase("Comics", "Cómics"), phrase("Illustrated teachings", "Enseñanzas ilustradas"))}
    <main class="page wide comics-library-page">
      <header class="section-intro comics-intro"><div><p class="eyebrow">${phrase("Practices & Teachings", "Prácticas y enseñanzas")}</p><h1 class="page-title">${phrase("Stories for discernment.", "Historias para el discernimiento.")}</h1><p class="lede measure">${phrase("Read in any order. These stories offer images and questions; they do not diagnose you or decide what your experience means.", "Lee en cualquier orden. Estas historias ofrecen imágenes y preguntas; no te diagnostican ni deciden qué significa tu experiencia.")}</p></div>${renderComicLanguageControl()}</header>
      ${publishedSeries.map(series => `<section class="comic-shelf" aria-labelledby="comic-series-${series.id}"><header><p class="eyebrow">${series.id === "mainline" ? phrase("Mainline series", "Serie principal") : series.kind === "specials" ? phrase("Optional fiction", "Ficción opcional") : phrase("Separate series", "Serie independiente")}</p><h2 id="comic-series-${series.id}">${escapeHTML(series[state.lang].title)}</h2><p>${escapeHTML(series[state.lang].subtitle)}</p></header><div class="comic-issue-grid">${series.issues.map(issue => renderComicIssueCard(series, issue)).join("")}</div></section>`).join("")}
      <p class="gentle-note">${phrase("Comic images load only as you open or approach them. Your reading position is not recorded.", "Las imágenes se cargan solo cuando las abres o te acercas a ellas. Tu posición de lectura no se registra.")}</p>
    </main>`;
}

function renderComicReader() {
  const { series, issue } = comicContext();
  const imageCount = comicImageCount(issue);
  const page = Math.min(Math.max(1, state.comicPage), imageCount);
  state.comicPage = page;
  const spanishFallback = state.lang === "es" && !issue.esReady;
  const artLanguage = spanishFallback ? "en" : state.lang;
  const descriptor = comicPageDescriptor(issue, page);
  const progress = descriptor.key === "cover" ? `${phrase("Cover", "Portada")} · 1 / ${imageCount}` : `${descriptor.storyPage} / ${issue.pages}`;
  const assetPath = comicAssetPath(series.id, issue, page, artLanguage);
  const comicPage = issue.assetReady === false
    ? `<div class="comic-page-placeholder" role="img" aria-label="${escapeAttribute(comicImageAlt(series, issue, page))}" data-comic-asset-path="${escapeAttribute(assetPath)}"><p class="eyebrow">${escapeHTML(descriptor.label)}</p><strong>${escapeHTML(issue[state.lang])}</strong><span>${phrase("Artwork in preparation", "Ilustración en preparación")}</span></div>`
    : `<img class="comic-page-image" src="${assetPath}" data-comic-fallback="${comicAssetPath(series.id, issue, page, "en")}" loading="lazy" decoding="async" alt="${escapeAttribute(comicImageAlt(series, issue, page))}">`;
  const pagePicker = imageCount > 12
    ? `<label class="comic-page-picker"><span>${phrase("Go to", "Ir a")}</span><select data-comic-page-picker aria-label="${phrase("Go to comic page", "Ir a una página del cómic")}">${Array.from({ length: imageCount }, (_, index) => { const position = index + 1; const item = comicPageDescriptor(issue, position); return `<option value="${position}" ${position === page ? "selected" : ""}>${escapeHTML(item.label)}</option>`; }).join("")}</select></label>`
    : "";
  const transcript = issue.transcriptPaths
    ? `<details class="comic-transcript" data-comic-transcript data-transcript-key="${escapeAttribute(`${state.lang}:${series.id}:${issue.id || issue.number}:${descriptor.key}`)}"><summary>${phrase("Page transcript and image description", "Transcripción y descripción de la imagen")}</summary><div class="comic-transcript-content"><section><h2>${phrase("Image description", "Descripción de la imagen")}</h2><p data-comic-image-description>${phrase("Open this section to load the description.", "Abre esta sección para cargar la descripción.")}</p></section><section><h2>${phrase("Transcript", "Transcripción")}</h2><p data-comic-transcript-copy>${phrase("Open this section to load the transcript.", "Abre esta sección para cargar la transcripción.")}</p></section></div></details>`
    : "";
  return `${renderTopbar(series[state.lang].title, `${comicIssueLabel(series, issue)} · ${issue[state.lang]}`)}
    <main class="comic-reader-page">
      <header class="comic-reader-heading"><div><p class="eyebrow">${escapeHTML(comicIssueLabel(series, issue))}</p><h1>${escapeHTML(issue[state.lang])}</h1></div>${renderComicLanguageControl()}</header>
      <p id="comic-language-note" class="comic-language-note" ${spanishFallback ? "" : "hidden"}>${phrase("Spanish edition in preparation. Showing the English artwork.", "La edición en español está en preparación. Se muestra la versión gráfica en inglés.")}</p>
      <figure class="comic-page-stage" data-comic-swipe tabindex="0" aria-label="${phrase("Comic page. Swipe or use the arrow keys to turn pages.", "Página del cómic. Desliza o usa las flechas para cambiar de página.")}">
        ${comicPage}
      </figure>
      <nav class="comic-reader-controls" aria-label="${phrase("Comic page navigation", "Navegación de páginas del cómic")}">
        <button class="secondary-button" type="button" data-action="previous-comic-page" ${page === 1 ? "disabled" : ""}>← <span>${phrase("Previous", "Anterior")}</span></button>
        <output aria-live="polite" aria-atomic="true">${progress}</output>
        <button class="secondary-button" type="button" data-action="next-comic-page" ${page === imageCount ? "disabled" : ""}><span>${phrase("Next", "Siguiente")}</span> →</button>
      </nav>
      ${pagePicker}
      <p class="comic-reader-help">${phrase("Swipe left or right · Arrow keys turn pages", "Desliza a la izquierda o derecha · las flechas cambian de página")}</p>
      ${transcript}
    </main>`;
}

const comicTranscriptCache = new Map();

async function loadComicTranscript(details) {
  const { series, issue } = comicContext();
  const path = issue.transcriptPaths?.[state.lang];
  if (!path) return;
  const descriptor = comicPageDescriptor(issue, state.comicPage);
  const expectedKey = `${state.lang}:${series.id}:${issue.id || issue.number}:${descriptor.key}`;
  if (details.dataset.transcriptKey !== expectedKey) return;
  const descriptionNode = details.querySelector("[data-comic-image-description]");
  const transcriptNode = details.querySelector("[data-comic-transcript-copy]");
  descriptionNode.textContent = phrase("Loading description…", "Cargando descripción…");
  transcriptNode.textContent = phrase("Loading transcript…", "Cargando transcripción…");
  try {
    let document = comicTranscriptCache.get(path);
    if (!document) {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Transcript request failed: ${response.status}`);
      document = await response.json();
      comicTranscriptCache.set(path, document);
    }
    if (details.dataset.transcriptKey !== expectedKey) return;
    const entry = document.entries?.[descriptor.key] || {};
    descriptionNode.textContent = entry.imageDescription?.trim() || phrase("Image description in preparation.", "Descripción de la imagen en preparación.");
    transcriptNode.textContent = entry.transcript?.trim() || phrase("Page transcript in preparation.", "Transcripción de la página en preparación.");
  } catch {
    descriptionNode.textContent = phrase("Image description is not available yet.", "La descripción de la imagen aún no está disponible.");
    transcriptNode.textContent = phrase("Page transcript is not available yet.", "La transcripción de la página aún no está disponible.");
  }
}

function prepareComicImages() {
  document.querySelectorAll("img[data-comic-fallback]").forEach(image => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.comicFallback;
      if (!fallback || image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      image.src = fallback;
      if (image.classList.contains("comic-page-image")) {
        document.querySelector("#comic-language-note")?.removeAttribute("hidden");
        announce(phrase("Spanish page unavailable. Showing English.", "Página en español no disponible. Se muestra en inglés."));
      }
    }, { once: true });
  });
  if (state.view !== "comicReader") return;
  const { series, issue } = comicContext();
  if (issue.assetReady === false || state.comicPage >= comicImageCount(issue)) return;
  const preload = new Image();
  preload.src = comicAssetPath(series.id, issue, state.comicPage + 1, state.lang === "es" && !issue.esReady ? "en" : state.lang);
}

function openComicIssue(seriesID, issueNumber) {
  const series = comicSeries.find(item => item.id === seriesID);
  const issue = series?.issues.find(item => item.number === Number(issueNumber));
  if (!series || !issue || issue.published === false) return;
  state.selectedComicSeries = series.id;
  state.selectedComicIssue = issue.number;
  state.comicPage = 1;
  navigate("comicReader");
}

function turnComicPage(offset) {
  if (state.view !== "comicReader") return;
  const { issue } = comicContext();
  const next = Math.min(comicImageCount(issue), Math.max(1, state.comicPage + offset));
  if (next === state.comicPage) return;
  state.comicPage = next;
  render();
  document.querySelector("[data-comic-swipe]")?.focus({ preventScroll: true });
}

function renderLibraryPath() {
  const catalog = catalogFor(state.lang);
  const path = guidedLibraryPaths[state.lang].find(item => item.id === state.selectedPath) || guidedLibraryPaths[state.lang][0];
  const entries = path.entryIDs.map(id => catalog.libraryEntries.find(entry => entry.id === id)).filter(Boolean);
  const practice = contentByID(catalog.practiceEngines, path.practiceID);
  return `${renderTopbar(phrase("Guided practice path", "Camino de práctica guiada"), phrase("Back to Practices & Teachings", "Volver a Prácticas y enseñanzas"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("One clear thread", "Un hilo claro")}</p><h1 class="page-title">${escapeHTML(path.title)}</h1><p class="lede">${escapeHTML(path.subtitle)}</p></header><p class="gentle-note">${phrase("Move in order, or enter only the teaching that is useful now.", "Avanza en orden o entra solo en la enseñanza que sea útil ahora.")}</p><section class="list path-steps">${entries.map((entry, index) => `<button class="list-row" type="button" data-entry="${entry.id}"><span><small>${index + 1} ${phrase("of", "de")} ${entries.length}</small><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>→</b></button>`).join("")}</section><div class="practice-actions"><button class="primary-button" type="button" data-engine="${practice.id}">${phrase("Begin", "Comenzar")} ${escapeHTML(practice.title)}</button></div><p class="gentle-note">${phrase("The practice offers a reflection. It does not decide what your choices mean.", "La práctica ofrece una reflexión. No decide qué significan tus elecciones.")}</p></main>`;
}

function renderTeaching() {
  const item = teachings.find(entry => entry.id === state.selectedTeaching) || teachings[0];
  const text = item[state.lang];
  return `${renderTopbar(text.title, text.line)}<main class="page"><header class="section-intro"><p class="eyebrow">${item.icon} · ${phrase("Orientation", "Orientación")}</p><h1 class="page-title">${text.title}</h1><p class="lede">${text.line}</p></header><article class="prose">${text.sections.map(section => `<section><h2>${section[0]}</h2><p>${section[1]}</p></section>`).join("")}</article><div class="practice-actions"><button class="primary-button" type="button" data-action="save-teaching" data-teaching="${item.id}">${phrase("Carry one question from this", "Llevar una pregunta de esto")}</button></div></main>`;
}

function renderFoundations() {
  const catalog = catalogFor(state.lang);
  const items = state.foundationMode === "laws" ? catalog.laws : catalog.principles;
  const visibleItems = items.slice(0, state.foundationVisibleCount);
  return `${renderTopbar(phrase("Foundations", "Fundamentos"), phrase("Laws and principles for conscious participation", "Leyes y principios para la participación consciente"))}
    <main class="page wide"><header class="section-intro"><p class="eyebrow">${phrase("A compass, not a command", "Una brújula, no una orden")}</p><h1 class="page-title">${phrase("Foundations", "Fundamentos")}</h1><p class="lede measure">${phrase("These teachings offer ways to see and act more clearly. Test them in life. Your discernment remains the authority.", "Estas enseñanzas ofrecen maneras de ver y actuar con más claridad. Pruébalas en la vida. Tu discernimiento sigue siendo la autoridad.")}</p></header>
      <nav class="segmented"><button type="button" data-foundation-mode="laws" aria-pressed="${state.foundationMode === "laws"}">${phrase("21 Laws", "21 Leyes")}</button><button type="button" data-foundation-mode="principles" aria-pressed="${state.foundationMode === "principles"}">${phrase("32 Principles", "32 Principios")}</button></nav>
      <button class="orientation-invitation" type="button" data-view="scales"><span class="door-mark" aria-hidden="true">≋</span><span><strong>${phrase("Four scales of participation", "Cuatro escalas de participación")}</strong><small>${phrase("Inner coherence, personal sovereignty, conscious relationship and field stewardship.", "Coherencia interior, soberanía personal, relación consciente y cuidado del campo.")}</small></span><b>→</b></button>
      <section class="list foundation-list">${visibleItems.map(item => `<button class="list-row spectrum-row" style="--item-color:${fieldLinkedSpectrumColor(item, catalog)}" type="button" data-${state.foundationMode === "laws" ? "law" : "principle"}="${item.id}"><span><small>${String(item.order).padStart(2, "0")}</small><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(state.foundationMode === "laws" ? item.coreQuestion : item.contemplativeQuestion)}</span></span><b>→</b></button>`).join("")}</section>
      ${visibleItems.length < items.length ? `<button class="secondary-button progressive-disclosure" type="button" data-action="show-more-foundations">${phrase("Show 10 more", "Mostrar 10 más")} · ${items.length - visibleItems.length} ${phrase("remaining", "restantes")}</button>` : ""}
    </main>`;
}

function depthSelector() {
  return `<nav class="depth-selector" aria-label="${phrase("Depth", "Profundidad")}">${[1, 2, 3].map(level => `<button type="button" data-depth="${level}" aria-pressed="${state.teachingDepth === level}">${level}</button>`).join("")}</nav>`;
}

function renderLaw() {
  const catalog = catalogFor(state.lang);
  const law = contentByID(catalog.laws, state.selectedLaw);
  const teaching = catalog.lawTeachings[law.id];
  const relatedEngine = catalog.practiceEngines.find(engine => law.practiceIDs.includes(engine.id));
  const sections = state.teachingDepth === 1
    ? [[phrase("In plain language", "En palabras sencillas"), teaching.plainLanguage], [phrase("In ordinary life", "En la vida diaria"), teaching.ordinaryExample]]
    : state.teachingDepth === 2
      ? [[phrase("How it works", "Cómo funciona"), teaching.operatingPattern], [phrase("What this does not mean", "Lo que esto no significa"), teaching.notMeaning]]
      : [[phrase("Why this matters for a Golden Age", "Por qué importa para una Edad Dorada"), teaching.goldenAgeRelevance], [phrase("Try it in life", "Pruébalo en la vida"), teaching.embodiedExperiment]];
  return `${renderTopbar(`${phrase("Law", "Ley")} ${law.order}`, law.title)}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Law of conscious participation", "Ley de participación consciente")}</p><h1 class="page-title">${escapeHTML(law.title)}</h1><p class="lede">${escapeHTML(law.meaning)}</p><blockquote>${escapeHTML(law.coreQuestion)}</blockquote></header>${depthSelector()}<article class="prose depth-content">${sections.map(([title, body]) => `<section><h2>${escapeHTML(title)}</h2><p>${escapeHTML(body)}</p></section>`).join("")}</article><aside class="gentle-note">${phrase("This is a lens for reflection, not a diagnosis or a claim that circumstances do not matter.", "Esta es una perspectiva para reflexionar, no un diagnóstico ni una afirmación de que las circunstancias no importan.")}</aside><div class="practice-actions">${relatedEngine ? `<button class="primary-button" type="button" data-engine="${relatedEngine.id}">${phrase("Practise this law", "Practicar esta ley")}</button>` : ""}</div></main>`;
}

function renderPrinciple() {
  const catalog = catalogFor(state.lang);
  const principle = contentByID(catalog.principles, state.selectedPrinciple);
  const teaching = catalog.principleTeachings[principle.id];
  const kept = state.ruleOfLife.principleIDs.includes(principle.id);
  const relatedEngine = catalog.practiceEngines.find(engine => principle.practiceIDs.includes(engine.id));
  const sections = state.teachingDepth === 1
    ? [[phrase("Why it exists", "Por qué existe"), teaching.purpose], [phrase("In ordinary life", "En la vida diaria"), teaching.ordinaryExample]]
    : state.teachingDepth === 2
      ? [[phrase("What it protects", "Lo que protege"), teaching.protects], [phrase("What it balances", "Lo que equilibra"), teaching.balance], [phrase("It is not this", "No es esto"), teaching.notThis]]
      : [[phrase("Within myself", "Dentro de mí"), teaching.innerExpression], [phrase("Between people", "Entre personas"), teaching.relationshipExpression], [phrase("Within society", "En la sociedad"), teaching.societyExpression], [phrase("A question to hold", "Una pregunta para sostener"), teaching.tensionQuestion]];
  return `${renderTopbar(`${phrase("Principle", "Principio")} ${principle.order}`, principle.title)}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Golden Age principle", "Principio de la Edad Dorada")}</p><h1 class="page-title">${escapeHTML(principle.title)}</h1><p class="lede">${escapeHTML(principle.meaning)}</p><blockquote>${escapeHTML(principle.contemplativeQuestion)}</blockquote></header>${depthSelector()}<article class="prose depth-content">${sections.map(([title, body]) => `<section><h2>${escapeHTML(title)}</h2><p>${escapeHTML(body)}</p></section>`).join("")}</article><section class="embodied-invitation"><p class="eyebrow">${phrase("Sovereign act", "Acto soberano")}</p><p>${escapeHTML(principle.sovereignAct)}</p></section><aside class="gentle-note">${phrase("A principle is an invitation to practise, not a measure of your worth.", "Un principio es una invitación a practicar, no una medida de tu valor.")}</aside><div class="practice-actions"><button class="${kept ? "secondary-button" : "primary-button"}" type="button" data-action="toggle-principle" data-principle="${principle.id}">${kept ? phrase("Remove from my compass", "Quitar de mi brújula") : phrase("Keep in my compass", "Guardar en mi brújula")}</button>${relatedEngine ? `<button class="secondary-button" type="button" data-engine="${relatedEngine.id}">${phrase("Practise this principle", "Practicar este principio")}</button>` : ""}</div></main>`;
}

function renderLibraryEntry() {
  const catalog = catalogFor(state.lang);
  const entry = contentByID(catalog.libraryEntries, state.selectedEntry);
  const field = catalog.fields.find(item => entry.tags.fields.includes(item.id));
  const theLockIsPublished = comicSeries
    .find(series => series.id === "specials")
    ?.issues.some(issue => issue.id === "the-lock" && issue.published !== false);
  const relatedStory = entry.id === "separate-event-from-interpretation" && theLockIsPublished
    ? `<aside class="gentle-note"><p class="eyebrow">${phrase("A related story", "Una historia relacionada")}</p><p>${phrase("THE LOCK explores the difference between an experience and the story built around it, without deciding what either must mean.", "EL BLOQUEO explora la diferencia entre una experiencia y la historia que se construye a su alrededor, sin decidir qué debe significar ninguna de las dos.")}</p><button class="secondary-button" type="button" data-comic-series="specials" data-comic-issue="1">${phrase("Read THE LOCK", "Leer EL BLOQUEO")}</button></aside>`
    : "";
  return `${renderTopbar(phrase("Practices & Teachings", "Prácticas y enseñanzas"), field ? `${field.dimension}D · ${field.title}` : phrase("Teaching", "Enseñanza"))}<main class="page"><header class="section-intro"><p class="eyebrow">${field ? `${field.dimension}D · ${escapeHTML(field.title)}` : phrase("Living teaching", "Enseñanza viva")}</p><h1 class="page-title">${escapeHTML(entry.title)}</h1><p class="lede">${escapeHTML(entry.summary)}</p></header><article class="prose"><section><h2>${phrase("Orientation", "Orientación")}</h2><p>${escapeHTML(entry.libraryCopy)}</p></section><section><h2>${phrase("Sovereign question", "Pregunta soberana")}</h2><blockquote>${escapeHTML(entry.sovereignQuestion)}</blockquote></section><section class="embodied-invitation"><h2>${phrase("Live this today", "Vívelo hoy")}</h2><p>${escapeHTML(entry.embodiedAct)}</p></section>${state.showFullTeaching ? `<section><h2>${phrase("Core teaching", "Enseñanza central")}</h2><p>${escapeHTML(entry.coreTeaching)}</p></section><section><h2>${phrase("Shadow form", "Forma de sombra")}</h2><p>${escapeHTML(entry.shadowForm)}</p></section><section><h2>${phrase("Recognition", "Reconocimiento")}</h2><p>${escapeHTML(entry.recognition)}</p></section><section><h2>${phrase("Two-minute practice", "Práctica de dos minutos")}</h2><ol>${entry.twoMinutePractice.map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol></section><section><h2>${phrase("Golden Age expression", "Expresión de la Edad Dorada")}</h2><p>${escapeHTML(entry.goldenAgeExpression)}</p></section>` : ""}</article>${relatedStory}<div class="practice-actions entry-actions"><button class="primary-button" type="button" data-entry-practice="${entry.id}">${phrase("Experience this", "Experimentar esto")}</button><button class="secondary-button" type="button" data-action="toggle-full-teaching">${state.showFullTeaching ? phrase("Show the summary", "Mostrar el resumen") : phrase("Read the full teaching", "Leer la enseñanza completa")}</button><button class="text-button" type="button" data-entry-crossing="${entry.id}">${phrase("Cross this pattern", "Cruzar este patrón")}</button><button class="text-button" type="button" data-entry-act="${entry.id}">${phrase("Live this today", "Vivir esto hoy")}</button><button class="text-button" type="button" data-entry-deeper="${entry.id}">${phrase("Go deeper", "Profundizar")}</button>${field ? `<button class="text-button" type="button" data-field="${field.id}">${phrase("Explore the Field", "Explorar el Campo")}</button>` : ""}</div></main>`;
}

function renderPracticeEngines() {
  const catalog = catalogFor(state.lang);
  return `${renderTopbar(phrase("Guided Practices", "Prácticas guiadas"), phrase("Twelve ways to meet a real moment", "Doce maneras de acompañar un momento real"))}<main class="page wide"><header class="section-intro"><p class="eyebrow">${phrase("Choose by need, not achievement", "Elige según tu necesidad, no como logro")}</p><h1 class="page-title">${phrase("Guided Practices", "Prácticas guiadas")}</h1><p class="lede measure">${phrase("Each practice stands on its own. Choose two, five or ten minutes. You can leave at any point.", "Cada práctica funciona por sí sola. Elige dos, cinco o diez minutos. Puedes salir en cualquier momento.")}</p></header><section class="content-grid engine-grid">${catalog.practiceEngines.map(engine => `<button class="content-card spectrum-card" style="--item-color:${practiceEngineSpectrumColor(engine)}" type="button" data-engine="${engine.id}"><span class="eyebrow">${engine.recommendedDurations.join(" · ")} min</span><strong>${escapeHTML(engine.title)}</strong><small>${escapeHTML(engine.purpose)}</small><span class="tag-line">${engine.capacitySequence.map(tagLabel).join(" → ")}</span><b>→</b></button>`).join("")}</section></main>`;
}

function renderPracticeEngine() {
  const catalog = catalogFor(state.lang);
  const engine = contentByID(catalog.practiceEngines, state.selectedEngine);
  if (state.engineComplete) {
    return `${renderTopbar(engine.title, phrase("Practice complete", "Práctica completada"))}<main class="page"><section class="engine-completion"><div class="completion-seal"><div class="seal-orb" aria-hidden="true"></div><p class="eyebrow">${phrase("Return", "Regreso")}</p><h1 class="page-title">${phrase("Take only what feels useful.", "Lleva solo lo que te resulte útil.")}</h1><p class="lede">${phrase("The practice can end here. Its meaning remains yours.", "La práctica puede terminar aquí. Su significado sigue siendo tuyo.")}</p></div><div class="practice-actions"><button class="primary-button" type="button" data-action="finish-engine">${phrase("Return to practices", "Volver a las prácticas")}</button><button class="secondary-button" type="button" data-action="restart-engine">${phrase("Begin again", "Comenzar de nuevo")}</button></div></section></main>`;
  }
  const step = engine.steps[state.engineStep];
  const response = state.engineResponses[step.id] || "";
  const isLast = state.engineStep === engine.steps.length - 1;
  const responseControl = step.responseKind === "pause"
    ? `<div class="pause-field" aria-hidden="true"><span></span></div>`
    : `<label class="field-label"><span>${step.responseKind === "action" ? phrase("One action, if useful", "Una acción, si es útil") : phrase("A few words, if useful", "Unas palabras, si son útiles")}</span><textarea class="field-textarea" data-engine-response="${step.id}">${escapeHTML(response)}</textarea></label>`;
  return `${renderTopbar(engine.title, `${state.engineDuration} min · ${state.engineStep + 1} ${phrase("of", "de")} ${engine.steps.length}`)}<main class="page practice-engine-page"><nav class="movement-strip" aria-label="${phrase("Practice steps", "Pasos de la práctica")}">${engine.steps.map((item, index) => `<span class="movement-dot ${index < state.engineStep ? "done" : ""} ${index === state.engineStep ? "active" : ""}"></span>`).join("")}</nav><header class="section-intro"><p class="eyebrow">${escapeHTML(engine.title)}</p><h1 class="practice-title">${escapeHTML(step.prompt)}</h1>${step.optionalSupport ? `<p class="lede">${escapeHTML(step.optionalSupport)}</p>` : ""}<button class="text-button voice-invitation" type="button" data-action="listen-engine-stage">${phrase("Hear this invitation", "Escuchar esta invitación")}</button></header>${responseControl}<div class="duration-row" aria-label="${phrase("Practice length", "Duración de la práctica")}">${engine.recommendedDurations.map(duration => `<button class="chip" type="button" data-engine-duration="${duration}" aria-pressed="${state.engineDuration === duration}">${duration} min</button>`).join("")}</div><footer class="practice-actions"><div class="button-row"><button class="secondary-button" type="button" data-action="previous-engine-step" ${state.engineStep === 0 ? "disabled" : ""}>${tr("back")}</button><button class="primary-button" type="button" data-action="next-engine-step">${isLast ? phrase("Complete practice", "Completar la práctica") : tr("continue")}</button></div><button class="text-button" type="button" data-view="practiceEngines">${phrase("Choose another practice", "Elegir otra práctica")}</button></footer></main>`;
}

function currentActPool() {
  const acts = catalogFor(state.lang).sovereignActs.filter(act => (state.actQuality === "all" || act.primaryQuality === state.actQuality) && (state.actContext === "all" || act.context === state.actContext) && (state.actEffort === "all" || act.effort === state.actEffort));
  return acts.length ? acts : catalogFor(state.lang).sovereignActs;
}

function currentAct() {
  const pool = currentActPool();
  return pool[((state.actIndex % pool.length) + pool.length) % pool.length];
}

function renderActs() {
  const catalog = catalogFor(state.lang);
  const act = currentAct();
  const qualities = new Set(catalog.sovereignActs.map(item => item.primaryQuality));
  const contexts = new Set(catalog.sovereignActs.map(item => item.context));
  const efforts = new Set(catalog.sovereignActs.map(item => item.effort));
  return `${renderTopbar(tr("acts"), phrase("One quality entering the day", "Una cualidad entrando en el día"))}<main class="page"><section class="act-stage"><div class="act-path" aria-hidden="true"></div><div class="act-copy"><p class="eyebrow">${escapeHTML(tagLabel(act.primaryQuality))} · ${escapeHTML(tagLabel(act.effort))}</p><h1 class="page-title">${escapeHTML(act.title)}</h1><p>${escapeHTML(act.invitation)}</p></div><details class="act-filters"><summary>${phrase("Choose the kind of act", "Elegir el tipo de acto")}</summary><div class="filter-grid"><label>${phrase("Quality", "Cualidad")}<select data-act-filter="quality"><option value="all">${phrase("Any quality", "Cualquier cualidad")}</option>${libraryFilterOptions(qualities, state.actQuality)}</select></label><label>${phrase("Context", "Contexto")}<select data-act-filter="context"><option value="all">${phrase("Any context", "Cualquier contexto")}</option>${libraryFilterOptions(contexts, state.actContext)}</select></label><label>${phrase("Effort", "Esfuerzo")}<select data-act-filter="effort"><option value="all">${phrase("Any size", "Cualquier tamaño")}</option>${libraryFilterOptions(efforts, state.actEffort)}</select></label></div></details><div class="button-row"><button class="primary-button" type="button" data-action="carry-act">${phrase("Carry this act", "Llevar este acto")}</button><button class="secondary-button" type="button" data-action="another-act">${tr("another")}</button></div><button class="text-button" type="button" data-action="attune-act">${phrase("Attune before choosing", "Afinar antes de elegir")}</button></section></main>`;
}

function renderRuleOfLife() {
  const catalog = catalogFor(state.lang);
  const keptPrinciples = catalog.principles.filter(item => state.ruleOfLife.principleIDs.includes(item.id));
  const prompt = catalog.weeklyReviewPrompts[new Date().getDay() % catalog.weeklyReviewPrompts.length];
  return `${renderTopbar(phrase("My Compass", "Mi brújula"), phrase("Chosen locally, editable at any time", "Elegida localmente, editable en cualquier momento"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("A living rule of life", "Una regla de vida viva")}</p><h1 class="page-title">${phrase("My Compass", "Mi brújula")}</h1><p class="lede">${phrase("Keep only the principles and commitments you want to remember. This is not a score, identity or promise to be perfect.", "Guarda solo los principios y compromisos que quieras recordar. Esto no es una puntuación, identidad ni promesa de perfección.")}</p></header><section class="start-here"><p class="eyebrow">${phrase("This week's question", "La pregunta de esta semana")}</p><blockquote>${escapeHTML(prompt.prompt)}</blockquote></section><section><h2>${phrase("Principles I chose", "Principios que elegí")}</h2>${keptPrinciples.length ? `<div class="list">${keptPrinciples.map(item => `<button class="list-row" type="button" data-principle="${item.id}"><span><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.sovereignAct)}</span></span><b>→</b></button>`).join("")}</div>` : `<p class="empty-state">${phrase("No principles kept yet. Explore Foundations and keep only what feels worth practising.", "Todavía no guardaste principios. Explora Fundamentos y conserva solo lo que valga la pena practicar.")}</p>`}</section><section><h2>${phrase("Commitments", "Compromisos")}</h2><div class="commitment-list">${catalog.ruleCommitments.map(item => `<label class="commitment-row"><input type="checkbox" data-commitment="${item.id}" ${state.ruleOfLife.commitmentIDs.includes(item.id) ? "checked" : ""}><span><strong>${escapeHTML(item.domain)}</strong>${escapeHTML(item.text)}</span></label>`).join("")}</div></section></main>`;
}

function renderMissions() {
  return `${renderTopbar(phrase("Mission Path", "Camino de misión"), phrase("Optional project orientation", "Orientación opcional para un proyecto"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Direction before explanation", "Dirección antes que explicación")}</p><h1 class="page-title">${phrase("Protect a direction.", "Protege una dirección.")}</h1><p class="lede">${phrase("This is not a task manager. It holds direction, the next visible step and the rhythm that preserves the person serving it.", "Esto no es un gestor de tareas. Sostiene la dirección, el próximo paso visible y el ritmo que cuida a la persona que la sirve.")}</p></header>${state.missions.length ? `<section class="list">${state.missions.map(mission => `<button class="list-row" type="button" data-mission="${mission.id}"><span><strong>${escapeHTML(mission.title)}</strong><span>${escapeHTML(mission.direction)}</span></span><b>→</b></button>`).join("")}</section>` : `<p class="empty-state">${phrase("No direction has been saved yet.", "Todavía no se ha guardado ninguna dirección.")}</p>`}<div class="practice-actions"><button class="primary-button" type="button" data-action="new-mission">${phrase("Begin a Mission Path", "Comenzar un camino de misión")}</button></div></main>`;
}

function renderMission() {
  const catalog = catalogFor(state.lang);
  const existing = state.missions.find(item => item.id === state.selectedMission);
  const draft = state.missionDraft;
  return `${renderTopbar(existing ? phrase("Mission Path", "Camino de misión") : phrase("New Mission Path", "Nuevo camino de misión"), phrase("Let movement reveal the route", "Deja que el movimiento revele la ruta"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Direction before explanation", "Dirección antes que explicación")}</p><h1 class="page-title">${phrase("Let movement reveal the route.", "Deja que el movimiento revele la ruta.")}</h1><p class="lede">${phrase("Choose a direction that can preserve the body, attention and relationships through which it will be served.", "Elige una dirección que pueda cuidar el cuerpo, la atención y las relaciones mediante las que será servida.")}</p></header><section class="mission-form"><label class="field-label"><span>${phrase("Name this path", "Nombra este camino")}</span><input class="field-input" data-mission-input="title" value="${escapeAttribute(draft.title)}"></label><label class="field-label"><span>${phrase("Protected direction", "Dirección protegida")}</span><textarea class="field-textarea" data-mission-input="direction">${escapeHTML(draft.direction)}</textarea></label><label class="field-label"><span>${phrase("Next visible step", "Próximo paso visible")}</span><input class="field-input" data-mission-input="nextVisibleStep" value="${escapeAttribute(draft.nextVisibleStep)}"></label><label class="field-label"><span>${phrase("What rhythm could sustain this?", "¿Qué ritmo podría sostener esto?")}</span><textarea class="field-textarea" data-mission-input="sustainabilityNote">${escapeHTML(draft.sustainabilityNote)}</textarea></label><label class="field-label"><span>${phrase("Guiding principle", "Principio guía")}</span><select data-mission-principle><option value="">${phrase("No principle selected", "Ningún principio seleccionado")}</option>${catalog.principles.map(item => `<option value="${item.id}" ${draft.principleID === item.id ? "selected" : ""}>${escapeHTML(item.title)}</option>`).join("")}</select></label></section><div class="practice-actions"><button class="primary-button" type="button" data-action="save-mission" ${draft.title.trim() && draft.direction.trim() ? "" : "disabled"}>${phrase("Save this direction", "Guardar esta dirección")}</button>${existing ? `<button class="text-button danger" type="button" data-action="delete-mission">${phrase("Release this Mission Path", "Soltar este camino de misión")}</button>` : ""}</div></main>`;
}

function renderScales() {
  const scales = [
    [phrase("Inner coherence", "Coherencia interior"), phrase("Bring thoughts, feelings, values and actions into honest relationship.", "Pon pensamientos, emociones, valores y acciones en una relación honesta.")],
    [phrase("Personal sovereignty", "Soberanía personal"), phrase("Choose with agency, boundaries and responsibility.", "Elige con autonomía, límites y responsabilidad.")],
    [phrase("Conscious relationship", "Relación consciente"), phrase("Meet difference without control, disappearance or forced agreement.", "Encuentra la diferencia sin control, desaparición ni acuerdo forzado.")],
    [phrase("Field stewardship", "Cuidado del campo"), phrase("Consider how choices shape communities, systems and the living world.", "Considera cómo las elecciones dan forma a comunidades, sistemas y al mundo vivo.")]
  ];
  return `${renderTopbar(phrase("Four Scales", "Cuatro escalas"), phrase("From inner life to the wider field", "Desde la vida interior hasta el campo más amplio"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("One choice, several scales", "Una elección, varias escalas")}</p><h1 class="page-title">${phrase("Four Scales of Participation", "Cuatro escalas de participación")}</h1><p class="lede">${phrase("A choice can be kind to one part of us and harmful to a relationship or system. The four scales help widen attention without erasing the particular person in front of us.", "Una elección puede ser amable con una parte de nosotros y dañina para una relación o sistema. Las cuatro escalas amplían la atención sin borrar a la persona concreta frente a nosotros.")}</p></header><section class="scale-rings">${scales.map(([title, body], index) => `<article style="--scale-size:${100 - index * 13}%;--scale-index:${index}"><span>${index + 1}</span><div><h2>${title}</h2><p>${body}</p></div></article>`).join("")}</section></main>`;
}

function renderThreshold() {
  const doorway = doorways.find(item => item.id === state.practice.doorway) || doorways[0];
  return `${renderTopbar(tr("threshold"), state.lang === "en" ? "No rushing. Only the next doorway." : "Sin prisa. Solo la próxima puerta.")}
    <main class="page"><section class="threshold-stage"><div class="threshold-frame"><p class="eyebrow">${doorway[state.lang][0]}</p><h1 class="practice-title">${doorway[state.lang][2]}</h1><p class="lede">${state.lang === "en" ? "Stay with the question. An answer is not required." : "Quédate con la pregunta. No hace falta una respuesta."}</p></div><div class="choice-grid">${doorways.map(item => `<button class="choice ${item.id === state.practice.doorway ? "selected" : ""}" type="button" data-doorway="${item.id}">${item[state.lang][0]}</button>`).join("")}</div><div class="button-row"><button class="primary-button" type="button" data-action="keep-threshold">${state.lang === "en" ? "Keep this question" : "Guardar esta pregunta"}</button><button class="secondary-button" type="button" data-action="leave-threshold">${state.lang === "en" ? "Leave it here" : "Dejarla aquí"}</button></div></section></main>`;
}

function renderHistory() {
  const rememberedID = localStorage.getItem(STORAGE.lastHeldTone);
  const remembered = tones.find(item => item.id === rememberedID);
  const hasKept = state.traces.length || state.missions.length || state.ruleOfLife.principleIDs.length || remembered;
  return `${renderTopbar(phrase("Kept on this device", "Guardado en este dispositivo"), phrase("Only when you choose", "Solo cuando tú eliges"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Kept on this device", "Guardado en este dispositivo")}</p><h1 class="page-title">${hasKept ? phrase("Your chosen material is here.", "El material que elegiste está aquí.") : phrase("Nothing saved yet.", "Todavía no hay nada guardado.")}</h1><p class="lede">${phrase("Saved traces and a remembered tone stay distinct. Tone Sovereign does not combine or interpret them.", "Las huellas guardadas y un tono recordado permanecen separados. Tone Sovereign no los combina ni los interpreta.")}</p></header>
    <section class="kept-device-section"><p class="eyebrow">${phrase("Remembered tone", "Tono recordado")}</p>${remembered ? `<h2>${escapeHTML(remembered[state.lang])}</h2><p>${phrase("Your last held Embody tone—not a score, recommendation or diagnosis.", "Tu último tono guardado en Encarnar: no es una puntuación, recomendación ni diagnóstico.")}</p><button class="text-button" type="button" data-action="return-remembered-tone">${phrase("Return to Embody", "Volver a Encarnar")}</button>` : `<p>${phrase("No tone is being remembered.", "No hay ningún tono recordado.")}</p>`}</section>
    ${state.traces.length ? `<section class="trace-list"><p class="eyebrow">${phrase("Saved practices and questions", "Prácticas y preguntas guardadas")}</p>${state.traces.map(trace => `<article class="trace-row"><div><h3>${escapeHTML(trace.title)}</h3><p>${escapeHTML(trace.detail || "")}</p></div><time datetime="${trace.createdAt}">${new Intl.DateTimeFormat(state.lang === "es" ? "es-CL" : "en-AU", { dateStyle: "medium" }).format(new Date(trace.createdAt))}</time></article>`).join("")}</section>` : `<p class="empty-state">${phrase("No saved practices yet. Nothing is missing.", "Todavía no hay prácticas guardadas. No falta nada.")}</p>`}
    <section class="continuity-links"><p class="eyebrow">${phrase("Continue from here", "Continuar desde aquí")}</p><button class="orientation-invitation" type="button" data-view="ruleOfLife"><span class="door-mark" aria-hidden="true">│</span><span><strong>${phrase("My Golden Age Rule of Life", "Mi regla de vida de la Edad Dorada")}</strong><small>${phrase("Keep chosen principles and commitments as a living orientation.", "Conserva principios y compromisos elegidos como orientación viva.")}</small></span><b>→</b></button><button class="orientation-invitation" type="button" data-view="missions"><span class="door-mark" aria-hidden="true">↗</span><span><strong>${phrase("Mission Path", "Camino de misión")}</strong><small>${phrase("Protect a direction and its next visible step.", "Protege una dirección y su próximo paso visible.")}</small></span><b>→</b></button></section>
    <p class="gentle-note">${phrase("Everything shown here stays in this browser unless you export it. You can erase it in Settings. It does not rank, diagnose or define you.", "Todo lo que aparece aquí permanece en este navegador salvo que lo exportes. Puedes borrarlo en Ajustes. No te clasifica, diagnostica ni define.")}</p></main>`;
}

function renderSettings() {
  if (state.resetConfirmationOpen) return `${renderTopbar(tr("settings"), phrase("Confirm local reset", "Confirmar borrado local"))}<main class="page reset-confirmation"><section role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><p class="eyebrow">${phrase("LOCAL AND IRREVERSIBLE", "LOCAL E IRREVERSIBLE")}</p><h1 id="reset-title" class="page-title">${phrase("Reset saved practice data?", "¿Borrar los datos guardados de práctica?")}</h1><p id="reset-description" class="lede">${phrase("This permanently removes the following material from this browser. It cannot be undone unless you exported a copy.", "Esto elimina de forma permanente el siguiente material de este navegador. No se puede deshacer salvo que hayas exportado una copia.")}</p><ul class="reset-list"><li>${phrase("Saved practices, reflections and questions", "Prácticas, reflexiones y preguntas guardadas")}</li><li>${phrase("Compass principles, commitments and mission paths", "Principios, compromisos y caminos de misión")}</li><li>${phrase("Cross marks, carried acts and remembered tones", "Marcas de Cruce, actos llevados y tonos recordados")}</li><li>${phrase("Unfinished practice responses and breath preferences", "Respuestas de práctica sin terminar y preferencias de respiración")}</li></ul><p class="gentle-note">${phrase("Your language, sound and accessibility settings will remain.", "Se conservarán tus ajustes de idioma, sonido y accesibilidad.")}</p>${state.resetError ? `<p class="reset-error" role="alert">${escapeHTML(state.resetError)}</p>` : ""}<div class="practice-actions"><button class="primary-button danger-button" type="button" data-action="confirm-erase">${phrase("Reset saved data", "Borrar datos guardados")}</button><button class="text-button" type="button" data-action="cancel-erase">${phrase("Cancel", "Cancelar")}</button></div></section></main>`;
  return `${renderTopbar(tr("settings"), state.lang === "en" ? "Private, local and yours" : "Privado, local y tuyo")}
    <main class="page"><header class="section-intro"><p class="eyebrow">${state.lang === "en" ? "Your instrument" : "Tu instrumento"}</p><h1 class="page-title">${tr("settings")}</h1></header>
      <section class="settings-group">
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Language" : "Idioma"}</strong><span>${state.lang === "en" ? "English" : "Español"}</span></div><button class="text-button" type="button" data-action="toggle-language">${tr("language")}</button></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Sound" : "Sonido"}</strong><span>${state.lang === "en" ? "Ceremony, breath, tone and threshold sound" : "Sonido de ceremonia, respiración, tono y umbral"}</span></div><button class="switch" type="button" role="switch" aria-checked="${state.sound}" data-action="toggle-sound"><span class="sr-only">${state.sound ? tr("soundOn") : tr("soundOff")}</span></button></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Nikolai's voice" : "Voz de Nikolai"}</strong><span>${state.lang === "en" ? "Optional spoken invitations in English" : "Invitaciones habladas opcionales en español"}</span></div><button class="switch" type="button" role="switch" aria-checked="${state.voice}" data-action="toggle-voice"><span class="sr-only">${state.voice ? tr("voiceOn") : tr("voiceOff")}</span></button></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Reduced motion" : "Movimiento reducido"}</strong><span>${state.lang === "en" ? "Use gentle fades instead of travelling light" : "Usar fundidos suaves en lugar de luz en movimiento"}</span></div><button class="switch" type="button" role="switch" aria-label="${state.lang === "en" ? "Reduced motion" : "Movimiento reducido"}" aria-checked="${state.reduceMotion}" data-action="toggle-motion"></button></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Quiet words" : "Palabras suaves"}</strong><span>${state.lang === "en" ? "Show brief acknowledgements during practice" : "Mostrar reconocimientos breves durante la práctica"}</span></div><button class="switch" type="button" role="switch" aria-label="${state.lang === "en" ? "Quiet words" : "Palabras suaves"}" aria-checked="${state.quietWords}" data-action="toggle-words"></button></div>
      </section>
      <section class="settings-group">
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Export your data" : "Exportar tus datos"}</strong><span>${state.lang === "en" ? "Download one readable JSON file" : "Descargar un archivo JSON legible"}</span></div><button class="text-button" type="button" aria-label="${state.lang === "en" ? "Export your data" : "Exportar tus datos"}" data-action="export">↓</button></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Import your data" : "Importar tus datos"}</strong><span>${state.lang === "en" ? "Restore a Tone Sovereign export" : "Restaurar una exportación de Tone Sovereign"}</span></div><button class="text-button" type="button" aria-label="${state.lang === "en" ? "Import your data" : "Importar tus datos"}" data-action="import">↑</button><input class="file-input" type="file" accept="application/json" aria-label="${state.lang === "en" ? "Choose a Tone Sovereign export" : "Elegir una exportación de Tone Sovereign"}" data-import-file></div>
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Reset saved practice data" : "Borrar datos guardados de práctica"}</strong><span>${state.lang === "en" ? "Review exactly what will be removed first" : "Revisar primero qué se eliminará exactamente"}</span></div><button class="text-button danger" type="button" data-action="erase">${state.lang === "en" ? "Review" : "Revisar"}</button></div>
      </section>
      <div class="practice-actions"><button class="secondary-button" type="button" data-action="replay-from-settings">${tr("replay")}</button></div>
    </main>`;
}

function renderSymbol() {
  const text = symbolText[state.lang];
  return `${renderTopbar(text.title, text.intro)}<main class="page"><img class="symbol-mark" src="${ROOT}sword-mark.png" alt="${state.lang === "en" ? "Sword, circle and triskelion" : "Espada, círculo y trisquel"}"><header class="section-intro"><p class="eyebrow">${tr("symbol")}</p><h1 class="page-title">${text.title}</h1><p class="lede">${text.intro}</p></header>${text.sections.map((section, index) => `<section class="symbol-section" data-symbol-section="${index}"><h2>${section[0]}</h2><h3>${section[1]}</h3><p>${section[2]}</p></section>`).join("")}<section class="symbol-section"><p class="lede about-copy">${text.closing}</p></section><button class="primary-button" type="button" data-action="back">${state.lang === "en" ? "Return" : "Volver"}</button></main>`;
}

function renderAbout() {
  return `${renderTopbar(tr("about"), state.lang === "en" ? "An invitation, never a demand" : "Una invitación, nunca una exigencia")}
    <main class="page"><header class="section-intro"><p class="eyebrow">${state.lang === "en" ? "Orientation" : "Orientación"}</p><h1 class="page-title">${tr("about")}</h1></header><div class="about-audio"><button class="secondary-button" type="button" data-action="read-about">${state.lang === "en" ? "Listen in Nikolai's voice" : "Escuchar con la voz de Nikolai"}</button></div><article class="prose about-copy">${escapeHTML(aboutText[state.lang])}</article></main>`;
}

function observeSymbolSections() {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("active", entry.isIntersecting)), { threshold: .6 });
  document.querySelectorAll("[data-symbol-section]").forEach(node => observer.observe(node));
}

function addTrace(trace) {
  state.traces = [{ id: crypto.randomUUID?.() || String(Date.now()), createdAt: new Date().toISOString(), ...trace }, ...state.traces].slice(0, 100);
  localStorage.setItem(STORAGE.traces, JSON.stringify(state.traces));
}

function exportData() {
  const data = { app: "Tone Sovereign", version: 3, exportedAt: new Date().toISOString(), preferences: { lang: state.lang, sound: state.sound, voice: state.voice, reduceMotion: state.reduceMotion, quietWords: state.quietWords }, traces: state.traces, crossMarks: readJSON(STORAGE.crossMarks, []), ruleOfLife: state.ruleOfLife, missions: state.missions };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `tone-sovereign-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (data.app !== "Tone Sovereign" || !Array.isArray(data.traces)) throw new Error("Invalid export");
      state.traces = data.traces.slice(0, 100);
      localStorage.setItem(STORAGE.traces, JSON.stringify(state.traces));
      if (data.ruleOfLife && Array.isArray(data.ruleOfLife.principleIDs) && Array.isArray(data.ruleOfLife.commitmentIDs)) {
        state.ruleOfLife = data.ruleOfLife;
        localStorage.setItem(STORAGE.ruleOfLife, JSON.stringify(state.ruleOfLife));
      }
      if (Array.isArray(data.missions)) {
        state.missions = data.missions;
        localStorage.setItem(STORAGE.missions, JSON.stringify(state.missions));
      }
      if (Array.isArray(data.crossMarks)) localStorage.setItem(STORAGE.crossMarks, JSON.stringify(data.crossMarks.slice(0, 30)));
      showToast(state.lang === "en" ? "Your local data was restored." : "Tus datos locales fueron restaurados.");
      render();
    } catch {
      showToast(state.lang === "en" ? "That file is not a Tone Sovereign export." : "Ese archivo no es una exportación de Tone Sovereign.");
    }
  };
  reader.readAsText(file);
}

function eraseData() {
  const resetKeys = [STORAGE.traces, STORAGE.carriedAct, STORAGE.ruleOfLife, STORAGE.engineDrafts, STORAGE.missions, STORAGE.crossMarks, STORAGE.lastHeldTone];
  const failed = [];
  resetKeys.forEach(key => {
    try { localStorage.removeItem(key); } catch { failed.push(key); }
  });
  if (failed.length) {
    state.resetError = phrase("Some saved data could not be removed. Nothing is being reported as fully reset; please try again.", "No se pudieron borrar algunos datos guardados. No se indica que el borrado esté completo; inténtalo de nuevo.");
    render();
    return;
  }
  state.traces = [];
  state.actIndex = 0;
  state.ruleOfLife = { principleIDs: [], commitmentIDs: [] };
  state.engineDrafts = {};
  state.missions = [];
  state.guidedSit = { ...newGuidedSit(), duration: 900, guidance: "regular", backgroundTone: false, introduction: true };
  state.practice = newPractice();
  state.resetConfirmationOpen = false;
  state.resetError = "";
  persistPreferences();
  showToast(state.lang === "en" ? "Saved practice data was reset." : "Se borraron los datos guardados de práctica.");
  render();
}

function readAbout() {
  if (!state.voice) {
    showToast(state.lang === "en" ? "Turn on Nikolai's voice in Settings first." : "Activa la voz de Nikolai en Ajustes.");
    return;
  }
  sound.playVoice("ts_about_introduction_v1");
}

app.addEventListener("click", async event => {
  const button = event.target.closest("button");
  if (!button) return;
  const { action, view, steady, pull, relation, doorway, tone, field, teaching, law, principle, entry, engine, mission } = button.dataset;

  if (view === "threshold") { startMovement("cross"); return; }
  if (view) { navigate(view); return; }
  if (button.dataset.comicSeries && button.dataset.comicIssue) { openComicIssue(button.dataset.comicSeries, button.dataset.comicIssue); return; }
  if (button.dataset.comicLanguage) { state.lang = button.dataset.comicLanguage; persistPreferences(); render(); return; }
  if (button.dataset.libraryPath) { navigate("libraryPath", { path: button.dataset.libraryPath }); return; }
  if (button.dataset.entryPractice) { state.selectedEntry = button.dataset.entryPractice; navigate("guided", { guidedKind: "entry-practice" }); return; }
  if (button.dataset.entryCrossing) { state.selectedEntry = button.dataset.entryCrossing; navigate("guided", { guidedKind: "entry-crossing" }); return; }
  if (button.dataset.entryAct) { state.selectedEntry = button.dataset.entryAct; navigate("guided", { guidedKind: "entry-act" }); return; }
  if (button.dataset.entryDeeper) { state.selectedEntry = button.dataset.entryDeeper; navigate("guided", { guidedKind: "entry-deeper" }); return; }
  if (button.dataset.openMovement) { startMovement(button.dataset.openMovement); return; }
  if (button.dataset.guidedPractice) { selectGuidedSit(button.dataset.guidedPractice); return; }
  if (button.dataset.guidedDuration) { state.guidedSit.duration = Number(button.dataset.guidedDuration); persistPreferences(); render(); return; }
  if (button.dataset.guidedMode) { state.guidedSit.guidance = button.dataset.guidedMode; persistPreferences(); render(); return; }
  if (button.dataset.guidedIntroduction) {
    state.guidedSit.introduction = button.dataset.guidedIntroduction === "on";
    persistPreferences();
    render();
    return;
  }
  if (button.dataset.guidedTone) {
    state.guidedSit.backgroundTone = button.dataset.guidedTone === "on";
    persistPreferences();
    if (!state.guidedSit.backgroundTone) sound.stopGuidedSitAmbient();
    render();
    return;
  }
  if (button.dataset.practiceGuidance) {
    state.practice.guidance = button.dataset.practiceGuidance;
    if (state.practice.guidance === "guided" && !state.voice) showToast(phrase("Voice is off; this practice will stay quiet unless you turn it on in Settings.", "La voz está desactivada; esta práctica seguirá en silencio salvo que la actives en Ajustes."));
    render();
    return;
  }
  if (button.dataset.breathDuration) { state.practice.breathDuration = Number(button.dataset.breathDuration); render(); return; }
  if (button.dataset.capacityOption !== undefined) { state.practice.selectedOption = button.dataset.capacityOption; render(); return; }
  if (button.dataset.noticeOutcome !== undefined) { state.practice.noticeOutcome = button.dataset.noticeOutcome; render(); return; }
  if (button.dataset.crossFocus) { state.practice.crossFocus = button.dataset.crossFocus; state.practice.crossQuestion = 0; state.practice.crossSaved = false; state.practice.crossCrossed = false; state.practice.crossRemaining = false; state.practice.stage = "choose"; render(); return; }
  if (button.dataset.breathPattern) { state.practice.breathPattern = button.dataset.breathPattern; state.practice.stage = "setup"; render(); return; }
  if (steady) { state.practice.steadyState = steady; state.practice.breathPattern = ""; state.practice.stage = "setup"; render(); return; }
  if (pull !== undefined) {
    const pullIndex = Number(pull);
    state.practice.pendingPull = pulls[state.lang][pullIndex];
    state.practice.customPull = "";
    state.practice.stage = pullIndex === pulls[state.lang].length - 1 ? "custom" : "confirm";
    render();
    return;
  }
  if (relation) { state.practice.relation = relation; render(); return; }
  if (doorway) { state.practice.doorway = doorway; render(); return; }
  if (tone) { const selected = tones.find(item => item.id === tone); state.practice.tone = tone; state.practice.frequency = selected.hz; if (button.dataset.selectTone) state.practice.embodyStage = "tune"; if (state.practice.tonePlaying) sound.tone(selected.hz, state.practice.amplitude); render(); return; }
  if (!action && field) { navigate("field", { field }); return; }
  if (!action && teaching) { navigate("teaching", { teaching }); return; }
  if (!action && law) { state.teachingDepth = 1; navigate("law", { law }); return; }
  if (!action && principle) { state.teachingDepth = 1; navigate("principle", { principle }); return; }
  if (!action && entry) { state.showFullTeaching = false; navigate("entry", { entry }); return; }
  if (!action && engine) { navigate("practiceEngine", { engine }); return; }
  if (!action && mission) { navigate("mission", { mission }); return; }

  if (button.dataset.libraryMode) { state.libraryMode = button.dataset.libraryMode; state.libraryVisibleCount = 8; render(); return; }
  if (button.dataset.foundationMode) { state.foundationMode = button.dataset.foundationMode; state.foundationVisibleCount = 10; render(); return; }
  if (button.dataset.depth) { state.teachingDepth = Number(button.dataset.depth); render(); return; }
  if (button.dataset.engineDuration) { state.engineDuration = Number(button.dataset.engineDuration); render(); return; }

  if (action === "back" && state.view === "guidedSits" && state.guidedSit.phase === "session") {
    returnGuidedSitToSetup();
    return;
  }
  if (action === "back" && state.view === "guidedSits" && state.guidedSit.phase === "introduction") {
    sound.stopVoice();
    state.guidedSit.phase = "setup";
    render();
    return;
  }
  if (action === "back" && state.view === "guidedSits" && state.guidedSit.phase !== "catalog") {
    resetGuidedSitSession();
    render();
    return;
  }
  if (action === "back") goBack();
  if (action === "home") goHome();
  if (action === "previous-comic-page") turnComicPage(-1);
  if (action === "next-comic-page") turnComicPage(1);
  if (action === "begin-guided-sit") await beginGuidedSit();
  if (action === "preview-guided-sit-introduction") previewGuidedSitIntroduction();
  if (action === "replay-guided-sit-introduction") replayGuidedSitIntroduction();
  if (action === "pause-guided-sit-introduction") { sound.stopVoice(); state.guidedSit.introductionPlaying = false; render(); }
  if (action === "skip-guided-sit-introduction") startGuidedSitSession();
  if (action === "pause-guided-sit") pauseGuidedSit();
  if (action === "replay-guided-sit-cue") replayGuidedSitCue();
  if (action === "toggle-guided-sit-tone") {
    state.guidedSit.backgroundTone = !state.guidedSit.backgroundTone;
    persistPreferences();
    if (state.guidedSit.backgroundTone) sound.startGuidedSitAmbient(guidedSitPractice().id).catch(() => {});
    else sound.stopGuidedSitAmbient();
    render();
  }
  if (action === "end-guided-sit") completeGuidedSit();
  if (action === "guided-sit-return") { resetGuidedSitSession(); render(); window.scrollTo({ top: 0, behavior: "auto" }); }
  if (action === "guided-back") { if (state.guidedPhase > 0) { state.guidedPhase -= 1; render(); } else goBack(); }
  if (action === "guided-leave") goBack();
  if (action === "guided-next") {
    const definition = guidedExperienceDefinition();
    if (state.guidedPhase < definition.phases.length - 1) { state.guidedPhase += 1; render(); }
    else completeGuidedExperience();
  }
  if (action === "open-field-return") { state.selectedField = button.dataset.field; navigate("guided", { guidedKind: "field-return" }); }
  if (action === "browse-two-minute") { state.showAllPractices = true; render(); }
  if (action === "show-more-teachings") { state.libraryVisibleCount += 8; render(); }
  if (action === "show-more-foundations") { state.foundationVisibleCount += 10; render(); }
  if (action === "movement-back") movementBack();
  if (action === "resume-interrupted-practice") {
    const pausedFor = Math.max(0, Date.now() - state.practice.interruptedAt);
    if (state.practice.noticeStartedAt) state.practice.noticeStartedAt += pausedFor;
    if (state.practice.breathStartedAt) state.practice.breathStartedAt += pausedFor;
    const crossingWasPaused = state.practice.movement === "cross";
    state.practice.interrupted = false;
    state.practice.interruptedAt = 0;
    render();
    if (crossingWasPaused) sound.threshold().catch(() => {});
  }
  if (action === "leave-interrupted-practice") returnToMovementField();
  if (action === "start-full-practice") startFullPractice();
  if (action === "return-movement-field") returnToMovementField();
  if (action === "complete-movement") requestMovementCompletion();
  if (action === "finish-movement-save") finishMovement(true);
  if (action === "finish-movement-pass") finishMovement(false);
  if (action === "continue-stabilise") startMovement("stabilise");
  if (action === "continue-embody") startMovement("embody");
  if (action === "replay-ceremony") {
    state.sound = true;
    persistPreferences();
    await replayCeremony(true);
  }
  if (action === "listen-first-light") {
    if (!state.voice) showToast(phrase("Voice is off. You can turn it on in Settings.", "La voz está desactivada. Puedes activarla en Ajustes."));
    else sound.playVoice("ts_first_light_tagline_v1");
  }
  if (action === "replay-from-home" || action === "replay-from-settings") { state.stack = []; state.view = "landing"; replayCeremony(true); }
  if (action === "toggle-sound") {
    state.sound = !state.sound;
    persistPreferences();
    if (state.sound) {
      await sound.confirmSound().catch(() => {
        showToast(state.lang === "en" ? "Sound could not start. Try once more." : "No se pudo iniciar el sonido. Inténtalo otra vez.");
      });
      showToast(state.lang === "en" ? "Sound effects are on. Voice guidance is set separately in Settings." : "Los efectos de sonido están activados. La guía de voz se configura por separado en Ajustes.");
      if (state.view === "guidedSits" && state.guidedSit.phase === "session" && !state.guidedSit.paused) {
        sound.startGuidedSitAmbient(guidedSitPractice().id).catch(() => {});
      }
    } else {
      sound.stopTones();
      sound.stopFirstLight();
      showToast(state.lang === "en" ? "Sound effects are off. Voice guidance remains separate." : "Los efectos de sonido están desactivados. La guía de voz sigue siendo independiente.");
    }
    render();
  }
  if (action === "toggle-language") { sound.stop(); state.lang = state.lang === "en" ? "es" : "en"; persistPreferences(); render(); }
  if (action === "toggle-voice") { state.voice = !state.voice; if (!state.voice) sound.stopVoice(); persistPreferences(); render(); }
  if (action === "toggle-motion") { state.reduceMotion = !state.reduceMotion; persistPreferences(); render(); }
  if (action === "toggle-words") { state.quietWords = !state.quietWords; persistPreferences(); render(); }
  if (action === "open-inclusion-principle") { state.teachingDepth = 1; navigate("principle", { principle: "principle-31" }); }
  if (action === "start-notice") beginNoticePractice();
  if (action === "another-notice-cue") offerAnotherNoticeCue();
  if (action === "end-notice") { stopPracticeTimers(); state.practice.noticeStarted = false; state.practice.stage = "close"; render(); }
  if (action === "notice-tap") {
    state.practice.noticeAcknowledged = true;
    button.classList.add("acknowledged");
    button.setAttribute("aria-label", state.lang === "en" ? "Noticed" : "Notado");
    const status = document.querySelector("[data-notice-status]");
    if (status) status.textContent = state.lang === "en" ? "Noticed" : "Notado";
    announce(state.lang === "en" ? "Noticed" : "Notado");
  }
  if (action === "start-breath") await beginBreathPractice();
  if (action === "stop-breath") { state.practice.breathStartedAt = 0; stopPracticeTimers(); state.practice.stage = "complete"; render(); }
  if (action === "more-steady") { state.practice.steadyExpanded = true; render(); }
  if (action === "less-steady") { state.practice.steadyExpanded = false; render(); }
  if (action === "change-breath-pattern") { state.practice.stage = "patterns"; render(); }
  if (action === "change-steady") { state.practice.steadyState = ""; state.practice.breathPattern = ""; state.practice.stage = "chooser"; state.practice.breathStartedAt = 0; stopPracticeTimers(); render(); }
  if (action === "capacity-continue") {
    const flow = capacityFlows[state.practice.movement];
    state.practice.capacityAnswers[state.practice.capacityStep] = state.practice.selectedOption;
    if (state.practice.capacityStep < flow.length - 1) { state.practice.capacityStep += 1; state.practice.selectedOption = state.practice.capacityAnswers[state.practice.capacityStep] || ""; render(); }
    else requestMovementCompletion();
  }
  if (action === "listen-capacity-stage") playCapacityStageVoice(state.practice.movement, state.practice.capacityStep);
  if (action === "listen-engine-stage") playEngineStageVoice();
  if (action === "reclaim-hold" && event.detail === 0 && !state.practice.reclaimComplete) {
    state.practice.reclaimHolding = false;
    state.practice.reclaimComplete = true;
    announce(state.lang === "en" ? "You can still choose." : "Todavía puedes elegir.");
    render();
  }
  if (action === "reclaim-nothing-clear") { state.practice.pendingPull = state.lang === "en" ? "Nothing clear" : "Nada claro"; state.practice.customPull = ""; state.practice.stage = "confirm"; render(); }
  if (action === "reclaim-custom-continue") { state.practice.pendingPull = state.practice.customPull.trim(); state.practice.stage = "confirm"; render(); }
  if (action === "confirm-reclaim-pull") { state.practice.pull = state.practice.pendingPull; state.practice.stage = "pause"; render(); }
  if (action === "change-reclaim-pull") { state.practice.pendingPull = ""; state.practice.stage = state.practice.customPull ? "custom" : "authority"; render(); }
  if (action === "reclaim-to-relationship") { state.practice.stage = "relationship"; render(); }
  if (action === "reclaim-complete") { state.practice.stage = "complete"; render(); }
  if (action === "show-cross-focuses") { state.practice.stage = "focuses"; render(); }
  if (action === "toggle-cross-more") { state.practice.crossExpanded = !state.practice.crossExpanded; render(); }
  if (action === "previous-cross-focus" || action === "next-cross-focus") {
    const current = crossFocuses.findIndex(item => item.id === state.practice.crossFocus);
    const offset = action === "previous-cross-focus" ? -1 : 1;
    state.practice.crossFocus = crossFocuses[(current + offset + crossFocuses.length) % crossFocuses.length].id;
    state.practice.crossQuestion = 0;
    state.practice.crossSaved = false;
    state.practice.crossCrossed = false;
    state.practice.crossRemaining = false;
    render();
  }
  if (action === "open-cross-question") {
    state.practice.crossQuestion = 0;
    state.practice.crossRecent = [currentCrossQuestionKey(), ...state.practice.crossRecent.filter(item => item !== currentCrossQuestionKey())].slice(0, 6);
    state.practice.crossSaved = crossQuestionIsSaved();
    state.practice.crossCrossed = false;
    state.practice.crossRemaining = false;
    state.practice.stage = "question";
    sound.threshold().catch(() => {});
    render();
  }
  if (action === "another-cross-question") {
    chooseCrossQuestion({ avoidCurrent: true });
    state.practice.stage = "question";
    render();
  }
  if (action === "save-cross-question") {
    const marks = readJSON(STORAGE.crossMarks, []);
    const id = currentCrossQuestionKey();
    const question = crossQuestions[currentCrossFocus().questionKey].en[state.practice.crossQuestion];
    const existing = marks.findIndex(item => item.id === id || (!item.id && item.question === question));
    const next = existing >= 0 ? marks.filter((_, index) => index !== existing) : [{ id, focus: state.practice.crossFocus, questionKey: currentCrossFocus().questionKey, questionIndex: state.practice.crossQuestion, question, savedAt: new Date().toISOString(), returnCount: 0, lastReturn: null, lastCrossing: null }, ...marks].slice(0, 30);
    localStorage.setItem(STORAGE.crossMarks, JSON.stringify(next));
    state.practice.crossSaved = existing < 0;
    render();
  }
  if (action === "cross-remain") {
    state.practice.crossRemaining = true;
    render();
    announce(state.lang === "en" ? "Chosen for now" : "Elegido por ahora");
  }
  if (action === "cross-return-focus") {
    state.practice.crossCrossed = false;
    state.practice.crossRemaining = false;
    state.practice.stage = "choose";
    render();
  }
  if (action === "return-saved-cross") {
    const saved = readJSON(STORAGE.crossMarks, [])[0];
    if (saved) {
      const marks = readJSON(STORAGE.crossMarks, []);
      const returnedAt = new Date().toISOString();
      localStorage.setItem(STORAGE.crossMarks, JSON.stringify(marks.map((item, index) => index === 0 ? { ...item, returnCount: (item.returnCount || 0) + 1, lastReturn: returnedAt } : item)));
      state.practice.crossFocus = saved.focus;
      state.practice.crossQuestion = Number(saved.questionIndex) || 0;
      state.practice.crossSaved = true;
      state.practice.crossCrossed = false;
      state.practice.crossRemaining = false;
      state.practice.stage = "question";
      sound.threshold().catch(() => {});
      render();
    }
  }
  if (action === "cross-ready") {
    if (state.practice.stage === "question") {
      state.practice.stage = "crossed";
      state.practice.crossCrossed = true;
      state.practice.crossRemaining = false;
      sound.thresholdCrossing().catch(() => {});
      if (state.practice.crossSaved) {
        const id = currentCrossQuestionKey();
        localStorage.setItem(STORAGE.crossMarks, JSON.stringify(readJSON(STORAGE.crossMarks, []).map(item => item.id === id ? { ...item, lastCrossing: new Date().toISOString() } : item)));
      }
      render();
    }
    else { stopPracticeTimers(); state.practice.stage = "close"; render(); }
  }
  if (action === "previous-tone" || action === "next-tone") {
    const current = tones.findIndex(item => item.id === state.practice.tone);
    const offset = action === "previous-tone" ? -1 : 1;
    const start = current < 0 ? (offset > 0 ? -1 : 0) : current;
    const selected = tones[(start + offset + tones.length) % tones.length];
    state.practice.tone = selected.id; state.practice.frequency = selected.hz; render();
  }
  if (action === "show-all-tones") { state.practice.embodyStage = "all"; render(); }
  if (action === "use-remembered-tone") { state.practice.embodyStage = "tune"; render(); }
  if (action === "choose-fresh-tone") { state.practice.tone = ""; state.practice.frequency = 432; state.practice.embodyStage = "choose"; render(); }
  if (action === "enter-tone") { state.practice.embodyStage = "tune"; sound.tone(state.practice.frequency, state.practice.amplitude); state.practice.tonePlaying = true; render(); }
  if (action === "embody-hold") { state.practice.embodyStage = "hold"; sound.tone(state.practice.frequency, state.practice.amplitude); state.practice.tonePlaying = true; render(); }
  if (action === "embody-complete") {
    sound.stop();
    state.practice.tonePlaying = false;
    if (state.practice.tone) localStorage.setItem(STORAGE.lastHeldTone, state.practice.tone);
    state.practice.embodyStage = "after";
    render();
  }
  if (action === "embody-carry") requestMovementCompletion();
  if (action === "embody-choose-another") {
    state.practice.tone = "";
    state.practice.frequency = 432;
    state.practice.embodyStage = "choose";
    render();
  }
  if (action === "return-remembered-tone") startMovement("embody");
  if (action === "save-question") { state.practice.questionSaved = !state.practice.questionSaved; render(); }
  if (action === "toggle-tone") { state.practice.tonePlaying = !state.practice.tonePlaying; if (state.practice.tonePlaying) sound.tone(state.practice.frequency, state.practice.amplitude); else sound.stop(); render(); }
  if (action === "save-field-practice") { const item = contentByID(catalogFor(state.lang).fields, button.dataset.field); addTrace({ type: "field", title: `${item.dimension}D · ${item.title}`, detail: item.returnPractice }); showToast(tr("saved")); }
  if (action === "save-teaching") { const item = teachings.find(entry => entry.id === button.dataset.teaching); addTrace({ type: "teaching", title: item[state.lang].title, detail: item[state.lang].line }); showToast(tr("saved")); }
  if (action === "save-entry") { const item = contentByID(catalogFor(state.lang).libraryEntries, button.dataset.entry); addTrace({ type: "teaching", title: item.title, detail: item.sovereignQuestion }); showToast(tr("saved")); }
  if (action === "toggle-full-teaching") { state.showFullTeaching = !state.showFullTeaching; render(); }
  if (action === "toggle-principle") {
    const id = button.dataset.principle;
    state.ruleOfLife.principleIDs = state.ruleOfLife.principleIDs.includes(id) ? state.ruleOfLife.principleIDs.filter(item => item !== id) : [...state.ruleOfLife.principleIDs, id];
    localStorage.setItem(STORAGE.ruleOfLife, JSON.stringify(state.ruleOfLife));
    render();
  }
  if (action === "another-act") { const pool = currentActPool(); state.actIndex = (state.actIndex + 1 + Math.floor(Math.random() * Math.max(1, pool.length - 1))) % pool.length; render(); }
  if (action === "carry-act") { const act = currentAct(); localStorage.setItem(STORAGE.carriedAct, String(state.actIndex)); addTrace({ type: "act", title: act.title, detail: act.invitation }); showToast(tr("saved")); }
  if (action === "attune-act") { state.practice = newPractice(); state.practice.index = 0; navigate("practice"); }
  if (action === "keep-threshold") { const doorwayItem = doorways.find(item => item.id === state.practice.doorway); addTrace({ type: "threshold", title: doorwayItem[state.lang][0], detail: doorwayItem[state.lang][2] }); showToast(tr("saved")); }
  if (action === "leave-threshold") goHome();
  if (action === "export") exportData();
  if (action === "import") document.querySelector("[data-import-file]")?.click();
  if (action === "erase") { state.resetError = ""; state.resetConfirmationOpen = true; render(); focusCurrentView(); }
  if (action === "cancel-erase") { state.resetError = ""; state.resetConfirmationOpen = false; render(); focusCurrentView(); }
  if (action === "confirm-erase") eraseData();
  if (action === "read-about") readAbout();
  if (action === "previous-engine-step") { state.engineStep = Math.max(0, state.engineStep - 1); render(); }
  if (action === "next-engine-step") {
    const engineItem = contentByID(catalogFor(state.lang).practiceEngines, state.selectedEngine);
    if (state.engineStep < engineItem.steps.length - 1) state.engineStep += 1;
    else {
      state.engineComplete = true;
      addTrace({ type: "practice", title: engineItem.title, detail: phrase("Completed as a private practice.", "Completada como práctica privada.") });
      delete state.engineDrafts[engineItem.id];
      localStorage.setItem(STORAGE.engineDrafts, JSON.stringify(state.engineDrafts));
    }
    render();
  }
  if (action === "restart-engine") { state.engineStep = 0; state.engineComplete = false; state.engineResponses = {}; render(); }
  if (action === "finish-engine") { state.libraryMode = "practices"; navigate("practiceEngines", { remember: false }); }
  if (action === "new-mission") { navigate("mission", { mission: "" }); }
  if (action === "save-mission") {
    const existingIndex = state.missions.findIndex(item => item.id === state.selectedMission);
    const value = { id: state.selectedMission || crypto.randomUUID?.() || String(Date.now()), ...state.missionDraft, updatedAt: new Date().toISOString() };
    state.missions = existingIndex >= 0 ? state.missions.map((item, index) => index === existingIndex ? value : item) : [value, ...state.missions];
    localStorage.setItem(STORAGE.missions, JSON.stringify(state.missions));
    showToast(tr("saved"));
    navigate("missions", { remember: false });
  }
  if (action === "delete-mission") {
    state.missions = state.missions.filter(item => item.id !== state.selectedMission);
    localStorage.setItem(STORAGE.missions, JSON.stringify(state.missions));
    navigate("missions", { remember: false });
  }
});

let librarySearchTimer = 0;
app.addEventListener("input", event => {
  const target = event.target;
  if (target.dataset.input) {
    state.practice[target.dataset.input] = target.value;
    if (target.dataset.input === "customPull") {
      const continueButton = document.querySelector('[data-action="reclaim-custom-continue"]');
      if (continueButton) continueButton.disabled = !target.value.trim();
    }
  }
  if (target.dataset.engineResponse) {
    state.engineResponses[target.dataset.engineResponse] = target.value;
    state.engineDrafts[state.selectedEngine] = { ...state.engineResponses };
    localStorage.setItem(STORAGE.engineDrafts, JSON.stringify(state.engineDrafts));
  }
  if (target.dataset.missionInput) {
    state.missionDraft[target.dataset.missionInput] = target.value;
    const saveButton = document.querySelector('[data-action="save-mission"]');
    if (saveButton) saveButton.disabled = !(state.missionDraft.title.trim() && state.missionDraft.direction.trim());
  }
  if (target.dataset.libraryQuery !== undefined) {
    state.libraryQuery = target.value;
    state.libraryVisibleCount = 8;
    window.clearTimeout(librarySearchTimer);
    librarySearchTimer = window.setTimeout(() => {
      render();
      const input = document.querySelector("[data-library-query]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 180);
  }
  if (target.dataset.range === "frequency") { state.practice.frequency = Number(target.value); if (state.practice.tonePlaying) sound.tone(state.practice.frequency, state.practice.amplitude); target.nextElementSibling.textContent = `${target.value} Hz`; }
  if (target.dataset.range === "amplitude") { state.practice.amplitude = Number(target.value); if (state.practice.tonePlaying) sound.tone(state.practice.frequency, state.practice.amplitude); target.nextElementSibling.textContent = target.value; }
});

app.addEventListener("pointerdown", event => {
  const control = event.target.closest("[data-action='reclaim-hold']");
  if (!control || state.practice.reclaimComplete) return;
  event.preventDefault();
  window.clearTimeout(reclaimHoldTimer);
  state.practice.reclaimHolding = true;
  control.classList.add("hold-active");
  control.setPointerCapture?.(event.pointerId);
  reclaimHoldTimer = window.setTimeout(() => {
    reclaimHoldTimer = 0;
    state.practice.reclaimHolding = false;
    state.practice.reclaimComplete = true;
    announce(state.lang === "en" ? "You can still choose." : "Todavía puedes elegir.");
    render();
  }, 3200);
});

app.addEventListener("pointerdown", event => {
  const stage = event.target.closest("[data-comic-swipe]");
  if (!stage || state.view !== "comicReader") return;
  comicSwipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  stage.setPointerCapture?.(event.pointerId);
});

function cancelReclaimHold(event) {
  const control = event.target.closest?.("[data-action='reclaim-hold']") || document.querySelector("[data-action='reclaim-hold'].hold-active");
  if (!control || !reclaimHoldTimer) return;
  window.clearTimeout(reclaimHoldTimer);
  reclaimHoldTimer = 0;
  state.practice.reclaimHolding = false;
  control.classList.remove("hold-active");
}

app.addEventListener("pointerup", cancelReclaimHold);
app.addEventListener("pointercancel", cancelReclaimHold);
app.addEventListener("pointerup", event => {
  const stage = event.target.closest?.("[data-comic-swipe]");
  if (!stage || !comicSwipeStart || comicSwipeStart.pointerId !== event.pointerId) return;
  const deltaX = event.clientX - comicSwipeStart.x;
  const deltaY = event.clientY - comicSwipeStart.y;
  comicSwipeStart = null;
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
  turnComicPage(deltaX < 0 ? 1 : -1);
});
app.addEventListener("pointercancel", () => { comicSwipeStart = null; });

app.addEventListener("toggle", event => {
  const details = event.target.closest?.("[data-comic-transcript]");
  if (details?.open) loadComicTranscript(details);
}, true);

app.addEventListener("change", event => {
  if (event.target.matches("[data-import-file]") && event.target.files[0]) importData(event.target.files[0]);
  if (event.target.matches("[data-notice-duration]")) { state.practice.noticeDuration = Number(event.target.value); }
  if (event.target.matches("[data-comic-page-picker]")) {
    state.comicPage = Number(event.target.value);
    render();
    document.querySelector("[data-comic-swipe]")?.focus({ preventScroll: true });
  }
  const libraryFilter = event.target.dataset.libraryFilter;
  if (libraryFilter === "field") state.libraryField = event.target.value;
  if (libraryFilter === "domain") state.libraryDomain = event.target.value;
  if (libraryFilter === "need") state.libraryNeed = event.target.value;
  if (libraryFilter) { state.libraryVisibleCount = 8; render(); }
  const actFilter = event.target.dataset.actFilter;
  if (actFilter === "quality") state.actQuality = event.target.value;
  if (actFilter === "context") state.actContext = event.target.value;
  if (actFilter === "effort") state.actEffort = event.target.value;
  if (actFilter) { state.actIndex = 0; render(); }
  if (event.target.dataset.commitment) {
    const id = event.target.dataset.commitment;
    state.ruleOfLife.commitmentIDs = event.target.checked ? [...new Set([...state.ruleOfLife.commitmentIDs, id])] : state.ruleOfLife.commitmentIDs.filter(item => item !== id);
    localStorage.setItem(STORAGE.ruleOfLife, JSON.stringify(state.ruleOfLife));
  }
  if (event.target.matches("[data-mission-principle]")) state.missionDraft.principleID = event.target.value;
});

document.addEventListener("keydown", event => {
  if (state.view === "comicReader" && !event.target.matches("input, textarea, select") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
    event.preventDefault();
    turnComicPage(event.key === "ArrowLeft" ? -1 : 1);
  }
});

function escapeHTML(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function escapeAttribute(value = "") { return escapeHTML(value).replaceAll("\n", " "); }

function resizeField() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * ratio);
  canvas.height = Math.floor(innerHeight * ratio);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawAmbient(time = 0) {
  const width = innerWidth;
  const height = innerHeight;
  ctx.clearRect(0, 0, width, height);
  if (!state.reduceMotion && !matchMedia("(prefers-reduced-motion: reduce)").matches && state.view !== "landing") {
    const gradient = ctx.createRadialGradient(width * .5, height * .22, 0, width * .5, height * .22, Math.min(width, height) * .5);
    gradient.addColorStop(0, "rgba(216,180,90,.09)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(216,180,90,.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(width * .5, height * .3, 110 + i * 66 + Math.sin(time / 3200 + i) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  fieldFrame = requestAnimationFrame(drawAmbient);
}

window.addEventListener("resize", resizeField);
window.addEventListener("popstate", event => {
  if (event.state?.app === HISTORY_MARKER) restorePreviousView();
});
document.addEventListener("visibilitychange", () => {
  const noticing = state.view === "movement" && state.practice.movement === "notice" && state.practice.noticeStarted;
  const breathing = state.view === "movement" && state.practice.movement === "stabilise" && state.practice.breathStartedAt;
  const crossing = state.view === "movement" && state.practice.movement === "cross" && (state.practice.stage === "question" || state.practice.stage === "crossed");
  const guidedSitting = state.view === "guidedSits" && state.guidedSit.phase === "session";
  const guidedIntroduction = state.view === "guidedSits" && state.guidedSit.phase === "introduction";
  if (!noticing && !breathing && !crossing && !guidedSitting && !guidedIntroduction) return;
  if (document.hidden) {
    if (guidedIntroduction) {
      sound.stopVoice();
      state.guidedSit.introductionPlaying = false;
      return;
    }
    window.clearInterval(practiceTimer);
    window.clearInterval(guidedSitTimer);
    practiceTimer = 0;
    guidedSitTimer = 0;
    breathLastPhaseKey = "";
    sound.stop();
    if (guidedSitting) state.guidedSit.paused = true;
    if (noticing || breathing || crossing) {
      state.practice.interrupted = true;
      state.practice.interruptedAt = Date.now();
    }
  } else if (guidedIntroduction) {
    render();
    announce(phrase("Introduction paused.", "Introducción en pausa."));
  } else if (guidedSitting) {
    render();
    announce(phrase("Practice paused.", "Práctica en pausa."));
  } else if (noticing || breathing || crossing) {
    render();
    focusCurrentView();
    announce(phrase("Practice paused.", "Práctica en pausa."));
  }
});
window.addEventListener("beforeunload", () => { cancelAnimationFrame(fieldFrame); stopPracticeTimers(); });

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));

persistPreferences();
resizeField();
window.history.replaceState({ app: HISTORY_MARKER, view: state.view }, "", window.location.href);
render();
fieldFrame = requestAnimationFrame(drawAmbient);
