const ROOT = "./";
const FIRST_LIGHT = Object.freeze({
  duration: 16.20,
  voiceDelay: 13.48,
  ambienceDelay: 15.18
});
const NOTICE = Object.freeze({
  duration: 60,
  cueDuration: 10,
  manualCueDuration: 4
});
const STORAGE = {
  preferences: "tone-sovereign.preferences.v1",
  traces: "tone-sovereign.traces.v1",
  carriedAct: "tone-sovereign.carried-act.v1",
  ruleOfLife: "tone-sovereign.rule-of-life.v1",
  engineDrafts: "tone-sovereign.practice-engine-drafts.v1",
  missions: "tone-sovereign.missions.v1"
};

const copy = {
  en: {
    app: "Tone Sovereign",
    taglineLead: "Choose the tone of a",
    goldenAge: "Golden Age.",
    enter: "Enter",
    symbol: "The Symbol",
    replay: "Replay First Light",
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
    fieldsSupport: "Explore the nested spectrum of consciousness.",
    library: "Practices & Teachings",
    librarySupport: "Begin with one clear path.",
    acts: "Perform a Sovereign Act",
    actsSupport: "Let one Golden Age quality enter the day.",
    threshold: "Enter the Threshold",
    thresholdSupport: "Sit with a question before choosing.",
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
    fieldsSupport: "Descubre cómo cada Campo conserva los dones anteriores.",
    library: "Prácticas y enseñanzas",
    librarySupport: "Comienza con un camino claro.",
    acts: "Realizar un acto soberano",
    actsSupport: "Deja que una cualidad de la Edad Dorada entre en tu día.",
    threshold: "Entrar en el Umbral",
    thresholdSupport: "Quédate con una pregunta antes de elegir.",
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
  { id: "practice", mark: "⌁", key: "practice", support: "practiceSupport", primary: true },
  { id: "fields", mark: "≋", key: "fields", support: "fieldsSupport" },
  { id: "library", mark: "▱", key: "library", support: "librarySupport" },
  { id: "acts", mark: "↗", key: "acts", support: "actsSupport" },
  { id: "threshold", mark: "∩", key: "threshold", support: "thresholdSupport" }
];

const movements = [
  {
    id: "notice", mark: "·", color: "#e9cb78",
    en: { name: "Notice", line: "See clearly", title: "Notice what is here.", body: "Four simple invitations, then open noticing." },
    es: { name: "Notar", line: "Ver con claridad", title: "Nota lo que está aquí.", body: "Cuatro invitaciones sencillas y luego atención abierta." }
  },
  {
    id: "stabilise", mark: "│", color: "#86b7ad",
    en: { name: "Stabilise", line: "Find stability", title: "What feels difficult now?", body: "Choose the closest state. We will choose a gentle breath." },
    es: { name: "Estabilizar", line: "Encontrar estabilidad", title: "¿Qué se siente difícil ahora?", body: "Elige el estado más cercano. Elegiremos una respiración suave." }
  },
  {
    id: "discern", mark: "◇", color: "#9eb3c7",
    en: { name: "Discern", line: "Separate fact from story", title: "What do you know for sure?", body: "Make room between what happened and what your mind added." },
    es: { name: "Discernir", line: "Separar hecho de relato", title: "¿Qué sabes con certeza?", body: "Abre espacio entre lo que ocurrió y lo que tu mente añadió." }
  },
  {
    id: "reclaim", mark: "◌", color: "#d9b45a",
    en: { name: "Reclaim", line: "Choose your relationship", title: "What is pulling at your attention?", body: "Name it, pause, then choose how you will relate to it." },
    es: { name: "Recuperar", line: "Volver a elegir", title: "¿Qué atrae tu atención?", body: "Ponle un nombre, haz una pausa y elige cómo relacionarte con eso." }
  },
  {
    id: "cross", mark: "∩", color: "#d6a77d",
    en: { name: "Cross", line: "Meet a threshold", title: "Choose a doorway.", body: "Let one useful question meet you before the next step." },
    es: { name: "Cruzar", line: "Encontrar un umbral", title: "Elige una puerta.", body: "Deja que una pregunta útil te encuentre antes del siguiente paso." }
  },
  {
    id: "embody", mark: "∿", color: "#d39aa4",
    en: { name: "Embody", line: "Embody a quality", title: "Choose the tone you want to carry.", body: "Let sound, breath and attention give the quality a felt form." },
    es: { name: "Encarnar", line: "Encarnar una cualidad", title: "Elige el tono que quieres llevar.", body: "Deja que el sonido, la respiración y la atención den forma a la cualidad." }
  },
  {
    id: "integrate", mark: "∴", color: "#b8a5cc",
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
  { id: "overwhelmed", en: ["Overwhelmed", "Too much input, everything at once."], es: ["Demasiado a la vez", "Llegan demasiadas cosas al mismo tiempo."], breath: "4 · 6" },
  { id: "anxious", en: ["Anxious or scattered", "Racing, uneasy, hard to focus."], es: ["Ansiedad o dispersión", "Hay inquietud y cuesta concentrarse."], breath: "4 · 6" },
  { id: "angry", en: ["Anger or heat", "Irritated, tense, close to reacting."], es: ["Enojo o calor", "Hay irritación, tensión o ganas de reaccionar."], breath: "4 · 7" },
  { id: "stuck", en: ["Stuck or avoiding", "Hard to begin or choose."], es: ["Bloqueo o evitación", "Cuesta comenzar o elegir."], breath: "natural" },
  { id: "looping", en: ["Looping or self-attack", "The same thought keeps returning."], es: ["Pensamientos en bucle", "El mismo pensamiento sigue volviendo con dureza."], breath: "4 · 6" },
  { id: "fog", en: ["Fog or far away", "Numb, unreal, hard to locate."], es: ["Niebla o lejanía", "Hay desconexión o cuesta ubicarse."], breath: "natural" },
  { id: "wired", en: ["Wired or restless", "Unable to settle or wind down."], es: ["Aceleración o inquietud", "Cuesta calmarse o bajar el ritmo."], breath: "4 · 7" }
];

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

const tones = [
  { id: "courage", hz: 396, color: "#d59a73", en: "Courage", es: "Valentía" },
  { id: "clarity", hz: 432, color: "#9ebdd2", en: "Clarity", es: "Claridad" },
  { id: "love", hz: 528, color: "#d39aa4", en: "Love", es: "Amor" },
  { id: "compassion", hz: 594, color: "#d3a9bd", en: "Compassion", es: "Compasión" },
  { id: "steadiness", hz: 285, color: "#86b7ad", en: "Steadiness", es: "Estabilidad" },
  { id: "wonder", hz: 639, color: "#b8a5cc", en: "Wonder", es: "Asombro" },
  { id: "truth", hz: 741, color: "#d8b45a", en: "Truth", es: "Verdad" }
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
  selectedField: "1d-presence",
  selectedTeaching: "golden-age",
  selectedLaw: "law-01",
  selectedPrinciple: "principle-01",
  selectedEntry: "separate-event-from-interpretation",
  selectedEngine: "congruence-compass",
  selectedMission: "",
  foundationMode: "laws",
  libraryMode: "practices",
  libraryQuery: "",
  libraryField: "all",
  libraryDomain: "all",
  libraryNeed: "all",
  teachingDepth: 1,
  showFullTeaching: false,
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
  return {
    index: 0,
    noticeStarted: false,
    noticeStartedAt: 0,
    noticeCue: 0,
    noticeManualCue: -1,
    noticeManualUntil: 0,
    noticeLastManualCue: -1,
    steadyState: "",
    breathStartedAt: 0,
    facts: "",
    story: "",
    pull: "",
    reclaimHolding: false,
    relation: "",
    doorway: "self",
    questionSaved: false,
    tone: "love",
    frequency: 528,
    amplitude: 34,
    tonePlaying: false,
    act: "",
    reflection: ""
  };
}

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");
const canvas = document.querySelector("#ambient-field");
const ctx = canvas.getContext("2d", { alpha: true });
let ceremonyTimer = 0;
let practiceTimer = 0;
let toastTimer = 0;
let fieldFrame = 0;

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
    this.nodes.forEach(node => { try { node.stop(); } catch {} });
    this.nodes.clear();
  }

  stopVoice() {
    this.voiceToken += 1;
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

  async playVoice(cue, delay = 0) {
    if (!state.voice) return false;
    this.stopVoice();
    const token = this.voiceToken;
    const language = state.lang;
    const context = await this.ready();
    const buffer = await this.loadBuffer(this.voiceURL(cue, language), context);
    if (!state.voice || token !== this.voiceToken || language !== state.lang) return false;
    const { source } = this.scheduleBuffer(buffer, context.currentTime + Math.max(0, delay), 0.86);
    this.voiceSource = source;
    source.addEventListener("ended", () => {
      if (this.voiceSource === source) this.voiceSource = null;
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

  async ceremony() {
    this.stop();
    if (!state.sound && !state.voice) return;
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
        state.voice ? 0.0125 : 0.052,
        { loop: true, firstLight: true }
      );
      if (state.voice) {
        ambienceNode.gain.gain.setValueAtTime(0.0125, start + FIRST_LIGHT.voiceDelay + 4.08);
        ambienceNode.gain.gain.linearRampToValueAtTime(0.052, start + FIRST_LIGHT.voiceDelay + 4.80);
      }
    }

    if (state.voice) {
      const buffer = await this.loadBuffer(this.voiceURL("ts_first_light_tagline_v1"), context);
      const { source } = this.scheduleBuffer(buffer, start + FIRST_LIGHT.voiceDelay, 0.86);
      this.voiceSource = source;
      source.addEventListener("ended", () => {
        if (this.voiceSource === source) this.voiceSource = null;
      });
    }
  }

  async breath() {
    if (!state.sound) return;
    await this.ready();
    this.stopTones();
    const now = this.context.currentTime;
    [220, 277.18].forEach(f => this.note(f, now, 30, .018));
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
}

const sound = new SoundEngine();

function persistPreferences() {
  localStorage.setItem(STORAGE.preferences, JSON.stringify({
    lang: state.lang,
    sound: state.sound,
    voice: state.voice,
    reduceMotion: state.reduceMotion,
    quietWords: state.quietWords
  }));
  document.documentElement.lang = state.lang;
  document.documentElement.classList.toggle("user-reduced-motion", state.reduceMotion);
}

function announce(message) { liveRegion.textContent = ""; requestAnimationFrame(() => { liveRegion.textContent = message; }); }

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
  window.scrollTo({ top: 0, behavior: "auto" });
  if (state.view !== view && options.remember !== false) state.stack.push(state.view);
  state.view = view;
  if (options.field) state.selectedField = options.field;
  if (options.teaching) state.selectedTeaching = options.teaching;
  if (options.law) state.selectedLaw = options.law;
  if (options.principle) state.selectedPrinciple = options.principle;
  if (options.entry) state.selectedEntry = options.entry;
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
  window.scrollTo({ top: 0, behavior: "auto" });
}

function goBack() {
  stopPracticeTimers();
  state.view = state.stack.pop() || "home";
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function goHome() {
  stopPracticeTimers();
  state.stack = [];
  state.view = "home";
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function render() {
  persistPreferences();
  const renderers = {
    landing: renderLanding,
    home: renderHome,
    practice: renderPractice,
    fields: renderFields,
    field: renderField,
    library: renderLibrary,
    teaching: renderTeaching,
    foundations: renderFoundations,
    law: renderLaw,
    principle: renderPrinciple,
    entry: renderLibraryEntry,
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
  app.innerHTML = `<div class="app-shell">${(renderers[state.view] || renderHome)()}</div>`;
  if (state.view === "symbol") observeSymbolSections();
  if (state.view === "landing" && !state.ceremonySettled) settleCeremonyLater();
  if (state.view === "practice") resumePracticeView();
  if (state.view === "threshold") sound.threshold().catch(() => {});
}

function renderTopbar(title, subtitle = "") {
  return `<header class="topbar">
    <button class="icon-button" type="button" data-action="back" aria-label="${escapeHTML(tr("back"))}" title="${escapeHTML(tr("back"))}">←</button>
    <div class="topbar-title"><strong>${escapeHTML(title)}</strong>${subtitle ? `<span>${escapeHTML(subtitle)}</span>` : ""}</div>
    <div class="topbar-actions">
      <button class="icon-button" type="button" data-action="home" aria-label="${escapeHTML(tr("home"))}" title="${escapeHTML(tr("home"))}">⌂</button>
      <button class="icon-button" type="button" data-action="toggle-sound" aria-label="${state.sound ? tr("soundOn") : tr("soundOff")}" title="${state.sound ? tr("soundOn") : tr("soundOff")}">${state.sound ? "◖" : "○"}</button>
    </div>
  </header>`;
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
  return `<main class="landing ceremony ${state.ceremonySettled ? "is-settled" : "is-playing"}" data-ceremony="${state.ceremonyKey}">
    <div class="gold-wash" aria-hidden="true"></div>
    <div class="landing-inner">
      <div class="landing-tools" ${state.ceremonySettled ? "" : "inert"}>
        <button class="icon-button delayed-control" type="button" data-action="replay-ceremony" aria-label="${tr("replay")}" title="${tr("replay")}">↻</button>
        <button class="icon-button landing-sound-button" type="button" data-action="toggle-sound-replay" aria-label="${state.sound ? tr("soundOn") : tr("soundOff")}" title="${state.sound ? tr("soundOn") : tr("soundOff")}">${state.sound ? "◖" : "○"}</button>
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
        <div class="blade-current"></div>
        <div class="travelling-star"></div>
        ${renderLivingApexStar()}
      </div>
      <section class="landing-copy" ${state.ceremonySettled ? "" : "inert"}>
        <p>${tr("taglineLead")}</p>
        <strong>${tr("goldenAge")}</strong>
        <button class="symbol-link" type="button" data-view="symbol">${tr("symbol")}</button>
      </section>
      <div class="landing-actions" ${state.ceremonySettled ? "" : "inert"}>
        <button class="enter-button" type="button" data-view="home">${tr("enter")} &nbsp;→</button>
      </div>
    </div>
  </main>`;
}

function settleCeremonyLater() {
  window.clearTimeout(ceremonyTimer);
  const duration = state.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : FIRST_LIGHT.duration * 1000;
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
  render();
  if (shouldPlayAudio) sound.ceremony().catch(() => {
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
      <button class="orientation-invitation" type="button" data-view="about">
        <span class="door-mark" aria-hidden="true">✦</span>
        <span><strong>${phrase("Begin Here", "Comienza aquí")}</strong><small>${phrase("A short introduction to tone, sovereignty and the Golden Age.", "Una breve introducción al tono, la soberanía y la Edad Dorada.")}</small></span>
        <b aria-hidden="true">→</b>
      </button>
      <section class="door-stack" aria-label="${tr("fiveDoors")}">
        ${doors.map(door => `<button class="door ${door.primary ? "primary-door" : ""}" type="button" data-view="${door.id}">
          <span class="door-mark" aria-hidden="true">${door.mark}</span>
          <span class="door-copy"><strong>${tr(door.key)}</strong><span>${tr(door.support)}</span></span>
          <span class="door-arrow" aria-hidden="true">→</span>
        </button>`).join("")}
      </section>
      <footer class="home-footer">
        <button class="text-button" type="button" data-view="foundations">${phrase("Foundations", "Fundamentos")}</button>
        <button class="text-button" type="button" data-view="ruleOfLife">${phrase("My compass", "Mi brújula")}</button>
        <button class="text-button" type="button" data-view="history">${tr("history")}</button>
        <button class="text-button" type="button" data-view="settings">${tr("settings")}</button>
        <button class="text-button" type="button" data-action="replay-from-home">${tr("replay")}</button>
      </footer>
    </main>`;
}

function movementCopy() { return local(movements[state.practice.index]); }

function renderPractice() {
  const movement = movements[state.practice.index];
  const movementCopy = local(movement);
  return `${renderTopbar(movementCopy.name, movementCopy.line)}
    <main class="page practice-page">
      <nav class="movement-strip" aria-label="${state.lang === "en" ? "Practice movements" : "Movimientos de la práctica"}">
        ${movements.map((item, index) => `<button class="movement-dot ${index < state.practice.index ? "done" : ""} ${index === state.practice.index ? "active" : ""}" type="button" data-movement="${index}" aria-label="${local(item).name}" aria-current="${index === state.practice.index ? "step" : "false"}"></button>`).join("")}
      </nav>
      <section class="practice-stage" style="--movement-color:${movement.color}">
        <header class="practice-copy">
          <p class="eyebrow">${state.practice.index + 1} · ${escapeHTML(movementCopy.name)}</p>
          <h1 class="practice-title">${escapeHTML(movementCopy.title)}</h1>
          <p class="lede">${escapeHTML(movementCopy.body)}</p>
        </header>
        ${renderMovement(movement.id)}
      </section>
      <footer class="practice-actions">
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="previous-movement" ${state.practice.index === 0 ? "disabled" : ""}>${tr("previousMovement")}</button>
          <button class="primary-button" type="button" data-action="next-movement">${state.practice.index === movements.length - 1 ? tr("save") : tr("nextMovement")}</button>
        </div>
        <button class="text-button" type="button" data-action="home">${tr("returnHome")}</button>
      </footer>
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
    const natural = chosen.breath === "natural";
    return `<div class="instrument-region breath-orb" aria-hidden="true"></div>
      <div class="practice-copy">
        <p class="eyebrow">${chosen[lang][0]}</p>
        <p class="lede">${natural ? (lang === "en" ? "Let the breath come and go by itself." : "Deja que la respiración entre y salga por sí sola.") : (lang === "en" ? "Breathe in gently. Let the exhale last a little longer." : "Inhala suavemente. Deja que la exhalación dure un poco más.")}</p>
        <p class="timer" data-breath-timer>${p.breathStartedAt ? "0:30" : chosen.breath}</p>
      </div>
      <button class="primary-button" type="button" data-action="${p.breathStartedAt ? "stop-breath" : "start-breath"}">${p.breathStartedAt ? (lang === "en" ? "End breathing" : "Terminar respiración") : (lang === "en" ? "Begin breathing" : "Comenzar respiración")}</button>
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
    playMovementVoice(movements[state.practice.index].id);
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
  playMovementVoice(movements[state.practice.index].id);
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
  practiceTimer = 0;
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
    const automaticCue = Math.min(4, Math.floor(elapsed / NOTICE.cueDuration));
    const manualIsActive = state.practice.noticeManualCue >= 0 && now < state.practice.noticeManualUntil;
    const cue = manualIsActive ? state.practice.noticeManualCue : automaticCue;
    if (!manualIsActive && state.practice.noticeManualCue >= 0) {
      state.practice.noticeManualCue = -1;
      state.practice.noticeManualUntil = 0;
    }
    if (cue !== state.practice.noticeCue) {
      state.practice.noticeCue = cue;
      sound.playVoice(noticeVoiceCues[cue]);
      announce(noticeCues[state.lang][cue]);
    }
    const remaining = Math.max(0, NOTICE.duration - Math.floor(elapsed));
    const timer = document.querySelector("[data-notice-timer]");
    const cueNode = document.querySelector("[data-notice-cue]");
    if (timer) timer.textContent = `0:${String(remaining).padStart(2, "0")}`;
    if (cueNode) cueNode.textContent = noticeCues[state.lang][cue];
    if (remaining <= 0) { window.clearInterval(practiceTimer); practiceTimer = 0; announce(state.lang === "en" ? "Practice complete" : "Práctica completa"); }
  };
  update();
  practiceTimer = window.setInterval(update, 250);
}

async function beginNoticePractice() {
  try {
    if (state.voice) await sound.prepareVoiceCues(noticeVoiceCues);
  } catch {
    showToast(state.lang === "en" ? "Voice guidance could not start." : "No se pudo iniciar la guía de voz.");
  }
  state.practice.noticeStarted = true;
  state.practice.noticeStartedAt = Date.now();
  state.practice.noticeCue = 0;
  state.practice.noticeManualCue = -1;
  state.practice.noticeManualUntil = 0;
  state.practice.noticeLastManualCue = -1;
  render();
  sound.playVoice(noticeVoiceCues[0]);
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
  render();
  sound.playVoice(noticeVoiceCues[cue]);
  announce(noticeCues[state.lang][cue]);
}

function startBreathTimer(reset = true) {
  if (reset) state.practice.breathStartedAt = Date.now();
  sound.breath().catch(() => {});
  window.clearInterval(practiceTimer);
  const update = () => {
    const elapsed = (Date.now() - state.practice.breathStartedAt) / 1000;
    const remaining = Math.max(0, 30 - Math.floor(elapsed));
    const node = document.querySelector("[data-breath-timer]");
    if (node) node.textContent = `0:${String(remaining).padStart(2, "0")}`;
    if (remaining <= 0) { window.clearInterval(practiceTimer); practiceTimer = 0; state.practice.breathStartedAt = 0; sound.stop(); announce(state.lang === "en" ? "Breathing complete" : "Respiración completa"); }
  };
  update();
  practiceTimer = window.setInterval(update, 250);
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
      <section class="start-here"><p class="eyebrow">${phrase("The Principle of Nested Fields", "El principio de los Campos Anidados")}</p><p class="lede">${phrase("The Seven Fields are increasingly inclusive ways of participating in reality. Every wider Field carries forward the mature gifts of those before it.", "Los Siete Campos son formas cada vez más inclusivas de participar en la realidad. Cada Campo más amplio conserva los dones maduros de los anteriores.")}</p><button class="text-button" type="button" data-action="open-inclusion-principle">${phrase("Read the Principle of Inclusion", "Leer el principio de inclusión")}</button></section>
    </main>`;
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
      <div class="practice-actions"><button class="primary-button" type="button" data-action="save-field-practice" data-field="${field.id}">${phrase("Carry this return practice", "Llevar esta práctica de regreso")}</button></div>
    </main>`;
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

function renderLibrary() {
  const catalog = catalogFor(state.lang);
  const entries = filteredLibraryEntries(catalog);
  const fields = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.fields));
  const domains = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.domains));
  const needs = new Set(catalog.libraryEntries.flatMap(entry => entry.tags.needs));
  const practiceContent = `<section class="start-here"><p class="eyebrow">${phrase("Begin here", "Comienza aquí")}</p><h2>${phrase("Choose the amount of support you need", "Elige el apoyo que necesitas")}</h2><p>${phrase("Use a two-minute practice for one clear movement, or enter a guided engine when you want a fuller sequence.", "Usa una práctica de dos minutos para un movimiento claro o entra en una secuencia guiada cuando quieras más apoyo.")}</p><button class="primary-button" type="button" data-view="practiceEngines">${phrase("Explore all guided practices", "Explorar todas las prácticas guiadas")}</button></section>
    <section class="content-grid">${catalog.practiceEngines.slice(0, 4).map(engine => `<button class="content-card" type="button" data-engine="${engine.id}"><span class="eyebrow">${engine.recommendedDurations.join(" · ")} min</span><strong>${escapeHTML(engine.title)}</strong><small>${escapeHTML(engine.purpose)}</small><b>→</b></button>`).join("")}</section>`;
  const teachingContent = `<section class="start-here"><p class="eyebrow">${phrase("Begin here", "Comienza aquí")}</p><button class="list-row" type="button" data-view="foundations"><span><strong>${phrase("Laws & Principles", "Leyes y principios")}</strong><span>${phrase("The foundations of conscious participation, with plain-language and deeper explanations.", "Los fundamentos de la participación consciente, con explicaciones sencillas y profundas.")}</span></span><b>→</b></button></section>
    <section class="library-tools"><label class="search-field"><span>${phrase("Search teachings", "Buscar enseñanzas")}</span><input class="field-input" type="search" value="${escapeAttribute(state.libraryQuery)}" data-library-query placeholder="${phrase("A question, quality or situation", "Una pregunta, cualidad o situación")}"></label><div class="filter-grid"><label>${phrase("Field", "Campo")}<select data-library-filter="field"><option value="all">${phrase("All Fields", "Todos los Campos")}</option>${libraryFilterOptions(fields, state.libraryField)}</select></label><label>${phrase("Theme", "Tema")}<select data-library-filter="domain"><option value="all">${phrase("All themes", "Todos los temas")}</option>${libraryFilterOptions(domains, state.libraryDomain)}</select></label><label>${phrase("Need", "Necesidad")}<select data-library-filter="need"><option value="all">${phrase("All needs", "Todas las necesidades")}</option>${libraryFilterOptions(needs, state.libraryNeed)}</select></label></div><p class="result-count">${entries.length} ${phrase("teachings", "enseñanzas")}</p></section>
    <section class="list">${entries.map(entry => `<button class="list-row" type="button" data-entry="${entry.id}"><span><strong>${escapeHTML(entry.title)}</strong><span>${escapeHTML(entry.summary)}</span></span><b>→</b></button>`).join("") || `<p class="empty-state">${phrase("No teaching matches those filters. Nothing is missing; try a wider search.", "Ninguna enseñanza coincide con esos filtros. No falta nada; prueba una búsqueda más amplia.")}</p>`}</section>`;
  return `${renderTopbar(tr("library"), phrase("Practices and teachings, clearly separated", "Prácticas y enseñanzas, claramente separadas"))}
    <main class="page wide">
      <header class="section-intro"><p class="eyebrow">${phrase("You do not need to read everything", "No necesitas leerlo todo")}</p><h1 class="page-title">${tr("library")}</h1><p class="lede measure">${phrase("Begin with what meets this moment. Practices help you do something now; teachings help you understand the wider pattern.", "Comienza con lo que acompaña este momento. Las prácticas te ayudan a hacer algo ahora; las enseñanzas ayudan a comprender el patrón más amplio.")}</p></header>
      <nav class="segmented" aria-label="${tr("library")}"><button type="button" data-library-mode="practices" aria-pressed="${state.libraryMode === "practices"}">${phrase("Practices", "Prácticas")}</button><button type="button" data-library-mode="teachings" aria-pressed="${state.libraryMode === "teachings"}">${phrase("Teachings", "Enseñanzas")}</button></nav>
      ${state.libraryMode === "practices" ? practiceContent : teachingContent}
    </main>`;
}

function renderTeaching() {
  const item = teachings.find(entry => entry.id === state.selectedTeaching) || teachings[0];
  const text = item[state.lang];
  return `${renderTopbar(text.title, text.line)}<main class="page"><header class="section-intro"><p class="eyebrow">${item.icon} · ${phrase("Orientation", "Orientación")}</p><h1 class="page-title">${text.title}</h1><p class="lede">${text.line}</p></header><article class="prose">${text.sections.map(section => `<section><h2>${section[0]}</h2><p>${section[1]}</p></section>`).join("")}</article><div class="practice-actions"><button class="primary-button" type="button" data-action="save-teaching" data-teaching="${item.id}">${phrase("Carry one question from this", "Llevar una pregunta de esto")}</button></div></main>`;
}

function renderFoundations() {
  const catalog = catalogFor(state.lang);
  const items = state.foundationMode === "laws" ? catalog.laws : catalog.principles;
  return `${renderTopbar(phrase("Foundations", "Fundamentos"), phrase("Laws and principles for conscious participation", "Leyes y principios para la participación consciente"))}
    <main class="page wide"><header class="section-intro"><p class="eyebrow">${phrase("A compass, not a command", "Una brújula, no una orden")}</p><h1 class="page-title">${phrase("Foundations", "Fundamentos")}</h1><p class="lede measure">${phrase("These teachings offer ways to see and act more clearly. Test them in life. Your discernment remains the authority.", "Estas enseñanzas ofrecen maneras de ver y actuar con más claridad. Pruébalas en la vida. Tu discernimiento sigue siendo la autoridad.")}</p></header>
      <nav class="segmented"><button type="button" data-foundation-mode="laws" aria-pressed="${state.foundationMode === "laws"}">${phrase("21 Laws", "21 Leyes")}</button><button type="button" data-foundation-mode="principles" aria-pressed="${state.foundationMode === "principles"}">${phrase("32 Principles", "32 Principios")}</button></nav>
      <button class="orientation-invitation" type="button" data-view="scales"><span class="door-mark" aria-hidden="true">≋</span><span><strong>${phrase("Four scales of participation", "Cuatro escalas de participación")}</strong><small>${phrase("Inner coherence, personal sovereignty, conscious relationship and field stewardship.", "Coherencia interior, soberanía personal, relación consciente y cuidado del campo.")}</small></span><b>→</b></button>
      <section class="list foundation-list">${items.map(item => `<button class="list-row" type="button" data-${state.foundationMode === "laws" ? "law" : "principle"}="${item.id}"><span><small>${String(item.order).padStart(2, "0")}</small><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(state.foundationMode === "laws" ? item.coreQuestion : item.contemplativeQuestion)}</span></span><b>→</b></button>`).join("")}</section>
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
  return `${renderTopbar(entry.title, field ? `${field.dimension}D · ${field.title}` : phrase("Teaching", "Enseñanza"))}<main class="page"><header class="section-intro"><p class="eyebrow">${field ? `${field.dimension}D · ${escapeHTML(field.title)}` : phrase("Living teaching", "Enseñanza viva")}</p><h1 class="page-title">${escapeHTML(entry.title)}</h1><p class="lede">${escapeHTML(entry.summary)}</p></header><article class="prose"><section><h2>${phrase("Orientation", "Orientación")}</h2><p>${escapeHTML(entry.libraryCopy)}</p></section><section><h2>${phrase("Sovereign question", "Pregunta soberana")}</h2><blockquote>${escapeHTML(entry.sovereignQuestion)}</blockquote></section><section class="embodied-invitation"><h2>${phrase("Live this today", "Vívelo hoy")}</h2><p>${escapeHTML(entry.embodiedAct)}</p></section>${state.showFullTeaching ? `<section><h2>${phrase("Core teaching", "Enseñanza central")}</h2><p>${escapeHTML(entry.coreTeaching)}</p></section><section><h2>${phrase("When it loses balance", "Cuando pierde equilibrio")}</h2><p>${escapeHTML(entry.shadowForm)}</p></section><section><h2>${phrase("How to recognise it", "Cómo reconocerlo")}</h2><p>${escapeHTML(entry.recognition)}</p></section><section><h2>${phrase("Two-minute practice", "Práctica de dos minutos")}</h2><ol>${entry.twoMinutePractice.map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol></section><section><h2>${phrase("Golden Age expression", "Expresión de la Edad Dorada")}</h2><p>${escapeHTML(entry.goldenAgeExpression)}</p></section>` : ""}</article><div class="practice-actions"><button class="secondary-button" type="button" data-action="toggle-full-teaching">${state.showFullTeaching ? phrase("Return to the short view", "Volver a la vista breve") : phrase("Read the full teaching", "Leer la enseñanza completa")}</button><button class="primary-button" type="button" data-action="save-entry" data-entry="${entry.id}">${phrase("Keep this question", "Guardar esta pregunta")}</button>${field ? `<button class="text-button" type="button" data-field="${field.id}">${phrase("Explore this Field", "Explorar este Campo")}</button>` : ""}</div></main>`;
}

function renderPracticeEngines() {
  const catalog = catalogFor(state.lang);
  return `${renderTopbar(phrase("Guided Practices", "Prácticas guiadas"), phrase("Twelve ways to meet a real moment", "Doce maneras de acompañar un momento real"))}<main class="page wide"><header class="section-intro"><p class="eyebrow">${phrase("Choose by need, not achievement", "Elige según tu necesidad, no como logro")}</p><h1 class="page-title">${phrase("Guided Practices", "Prácticas guiadas")}</h1><p class="lede measure">${phrase("Each practice stands on its own. Choose two, five or ten minutes. You can leave at any point.", "Cada práctica funciona por sí sola. Elige dos, cinco o diez minutos. Puedes salir en cualquier momento.")}</p></header><section class="content-grid engine-grid">${catalog.practiceEngines.map(engine => `<button class="content-card" type="button" data-engine="${engine.id}"><span class="eyebrow">${engine.recommendedDurations.join(" · ")} min</span><strong>${escapeHTML(engine.title)}</strong><small>${escapeHTML(engine.purpose)}</small><span class="tag-line">${engine.capacitySequence.map(tagLabel).join(" → ")}</span><b>→</b></button>`).join("")}</section></main>`;
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
  return `${renderTopbar(engine.title, `${state.engineDuration} min · ${state.engineStep + 1} ${phrase("of", "de")} ${engine.steps.length}`)}<main class="page practice-engine-page"><nav class="movement-strip" aria-label="${phrase("Practice steps", "Pasos de la práctica")}">${engine.steps.map((item, index) => `<span class="movement-dot ${index < state.engineStep ? "done" : ""} ${index === state.engineStep ? "active" : ""}"></span>`).join("")}</nav><header class="section-intro"><p class="eyebrow">${escapeHTML(engine.title)}</p><h1 class="practice-title">${escapeHTML(step.prompt)}</h1>${step.optionalSupport ? `<p class="lede">${escapeHTML(step.optionalSupport)}</p>` : ""}</header>${responseControl}<div class="duration-row" aria-label="${phrase("Practice length", "Duración de la práctica")}">${engine.recommendedDurations.map(duration => `<button class="chip" type="button" data-engine-duration="${duration}" aria-pressed="${state.engineDuration === duration}">${duration} min</button>`).join("")}</div><footer class="practice-actions"><div class="button-row"><button class="secondary-button" type="button" data-action="previous-engine-step" ${state.engineStep === 0 ? "disabled" : ""}>${tr("back")}</button><button class="primary-button" type="button" data-action="next-engine-step">${isLast ? phrase("Complete practice", "Completar la práctica") : tr("continue")}</button></div><button class="text-button" type="button" data-view="practiceEngines">${phrase("Choose another practice", "Elegir otra práctica")}</button></footer></main>`;
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
  return `${renderTopbar(tr("history"), phrase("Saved only when you choose", "Guardado solo cuando tú eliges"))}<main class="page"><header class="section-intro"><p class="eyebrow">${phrase("Personal Sovereign Path", "Camino soberano personal")}</p><h1 class="page-title">${state.traces.length || state.missions.length || state.ruleOfLife.principleIDs.length ? phrase("Your saved choices are here.", "Tus elecciones guardadas están aquí.") : phrase("Nothing saved yet.", "Todavía no hay nada guardado.")}</h1><p class="lede">${phrase("Practices, questions, principles and directions appear here only when you choose to save them. Tone Sovereign does not interpret them.", "Las prácticas, preguntas, principios y direcciones aparecen aquí solo cuando eliges guardarlos. Tone Sovereign no los interpreta.")}</p></header><section class="continuity-links"><button class="orientation-invitation" type="button" data-view="ruleOfLife"><span class="door-mark" aria-hidden="true">│</span><span><strong>${phrase("My Golden Age Rule of Life", "Mi regla de vida de la Edad Dorada")}</strong><small>${phrase("Keep chosen principles and commitments as a living orientation.", "Conserva principios y compromisos elegidos como orientación viva.")}</small></span><b>→</b></button><button class="orientation-invitation" type="button" data-view="missions"><span class="door-mark" aria-hidden="true">↗</span><span><strong>${phrase("Mission Path", "Camino de misión")}</strong><small>${phrase("Protect a direction, its next visible step and a sustainable rhythm.", "Protege una dirección, su próximo paso visible y un ritmo sostenible.")}</small></span><b>→</b></button><button class="orientation-invitation" type="button" data-view="foundations"><span class="door-mark" aria-hidden="true">≋</span><span><strong>${phrase("Foundations", "Fundamentos")}</strong><small>${phrase("Return to the Laws, Principles and scales of participation.", "Vuelve a las Leyes, los Principios y las escalas de participación.")}</small></span><b>→</b></button></section>${state.traces.length ? `<section class="trace-list"><p class="eyebrow">${phrase("Saved practices and questions", "Prácticas y preguntas guardadas")}</p>${state.traces.map(trace => `<article class="trace-row"><div><h3>${escapeHTML(trace.title)}</h3><p>${escapeHTML(trace.detail || "")}</p></div><time datetime="${trace.createdAt}">${new Intl.DateTimeFormat(state.lang === "es" ? "es-CL" : "en-AU", { dateStyle: "medium" }).format(new Date(trace.createdAt))}</time></article>`).join("")}</section>` : `<p class="empty-state">${phrase("No saved practices yet. Nothing is missing.", "Todavía no hay prácticas guardadas. No falta nada.")}</p>`}<p class="gentle-note">${phrase("Everything shown here stays in this browser unless you export it. You can erase it in Settings. It does not rank, diagnose or define you.", "Todo lo que aparece aquí permanece en este navegador salvo que lo exportes. Puedes borrarlo en Ajustes. No te clasifica, diagnostica ni define.")}</p></main>`;
}

function renderSettings() {
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
        <div class="setting-row"><div><strong>${state.lang === "en" ? "Erase local data" : "Borrar datos locales"}</strong><span>${state.lang === "en" ? "Remove all saved traces from this browser" : "Eliminar todas las huellas de este navegador"}</span></div><button class="text-button danger" type="button" data-action="erase">${state.lang === "en" ? "Erase" : "Borrar"}</button></div>
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
  const data = { app: "Tone Sovereign", version: 2, exportedAt: new Date().toISOString(), preferences: { lang: state.lang, sound: state.sound, voice: state.voice, reduceMotion: state.reduceMotion, quietWords: state.quietWords }, traces: state.traces, ruleOfLife: state.ruleOfLife, missions: state.missions };
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
      showToast(state.lang === "en" ? "Your local data was restored." : "Tus datos locales fueron restaurados.");
      render();
    } catch {
      showToast(state.lang === "en" ? "That file is not a Tone Sovereign export." : "Ese archivo no es una exportación de Tone Sovereign.");
    }
  };
  reader.readAsText(file);
}

function eraseData() {
  const message = state.lang === "en" ? "Erase all saved traces on this device?" : "¿Borrar todas las huellas guardadas en este dispositivo?";
  if (!window.confirm(message)) return;
  state.traces = [];
  localStorage.removeItem(STORAGE.traces);
  localStorage.removeItem(STORAGE.carriedAct);
  localStorage.removeItem(STORAGE.ruleOfLife);
  localStorage.removeItem(STORAGE.engineDrafts);
  localStorage.removeItem(STORAGE.missions);
  state.ruleOfLife = { principleIDs: [], commitmentIDs: [] };
  state.engineDrafts = {};
  state.missions = [];
  showToast(state.lang === "en" ? "Local traces erased." : "Huellas locales borradas.");
  render();
}

function readAbout() {
  if (!state.voice) {
    showToast(state.lang === "en" ? "Turn on Nikolai's voice in Settings first." : "Activa la voz de Nikolai en Ajustes.");
    return;
  }
  sound.playVoice("ts_about_introduction_v1");
}

app.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const { action, view, movement, steady, pull, relation, doorway, tone, field, teaching, law, principle, entry, engine, mission } = button.dataset;

  if (view) { navigate(view); return; }
  if (movement !== undefined) { stopPracticeTimers(); state.practice.index = Number(movement); render(); playMovementVoice(movements[state.practice.index].id); return; }
  if (steady) { state.practice.steadyState = steady; render(); return; }
  if (pull !== undefined) { state.practice.pull = pulls[state.lang][Number(pull)]; render(); return; }
  if (relation) { state.practice.relation = relation; render(); return; }
  if (doorway) { state.practice.doorway = doorway; render(); return; }
  if (tone) { const selected = tones.find(item => item.id === tone); state.practice.tone = tone; state.practice.frequency = selected.hz; if (state.practice.tonePlaying) sound.tone(selected.hz, state.practice.amplitude); render(); return; }
  if (!action && field) { navigate("field", { field }); return; }
  if (!action && teaching) { navigate("teaching", { teaching }); return; }
  if (!action && law) { state.teachingDepth = 1; navigate("law", { law }); return; }
  if (!action && principle) { state.teachingDepth = 1; navigate("principle", { principle }); return; }
  if (!action && entry) { state.showFullTeaching = false; navigate("entry", { entry }); return; }
  if (!action && engine) { navigate("practiceEngine", { engine }); return; }
  if (!action && mission) { navigate("mission", { mission }); return; }

  if (button.dataset.libraryMode) { state.libraryMode = button.dataset.libraryMode; render(); return; }
  if (button.dataset.foundationMode) { state.foundationMode = button.dataset.foundationMode; render(); return; }
  if (button.dataset.depth) { state.teachingDepth = Number(button.dataset.depth); render(); return; }
  if (button.dataset.engineDuration) { state.engineDuration = Number(button.dataset.engineDuration); render(); return; }

  if (action === "back") goBack();
  if (action === "home") goHome();
  if (action === "replay-ceremony") replayCeremony(true);
  if (action === "replay-from-home" || action === "replay-from-settings") { state.stack = []; state.view = "landing"; replayCeremony(true); }
  if (action === "toggle-sound-replay") { state.sound = !state.sound; persistPreferences(); replayCeremony(true); }
  if (action === "toggle-sound") { state.sound = !state.sound; if (!state.sound) sound.stop(); persistPreferences(); render(); }
  if (action === "toggle-language") { sound.stop(); state.lang = state.lang === "en" ? "es" : "en"; persistPreferences(); render(); }
  if (action === "toggle-voice") { state.voice = !state.voice; if (!state.voice) sound.stopVoice(); persistPreferences(); render(); }
  if (action === "toggle-motion") { state.reduceMotion = !state.reduceMotion; persistPreferences(); render(); }
  if (action === "toggle-words") { state.quietWords = !state.quietWords; persistPreferences(); render(); }
  if (action === "open-inclusion-principle") { state.teachingDepth = 1; navigate("principle", { principle: "principle-31" }); }
  if (action === "previous-movement") previousMovement();
  if (action === "next-movement") nextMovement();
  if (action === "start-notice") beginNoticePractice();
  if (action === "another-notice-cue") offerAnotherNoticeCue();
  if (action === "notice-tap" && state.quietWords) showToast(state.lang === "en" ? "Noticed" : "Notado");
  if (action === "start-breath") { state.practice.breathStartedAt = Date.now(); sound.playVoice("ts_stabilise_inhale_v1"); render(); startBreathTimer(false); }
  if (action === "stop-breath") { state.practice.breathStartedAt = 0; stopPracticeTimers(); render(); }
  if (action === "change-steady") { state.practice.steadyState = ""; state.practice.breathStartedAt = 0; stopPracticeTimers(); render(); }
  if (action === "reclaim-hold") { state.practice.reclaimHolding = !state.practice.reclaimHolding; if (state.practice.reclaimHolding) sound.playVoice("ts_reclaim_centre_remains_v1"); render(); }
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
  if (action === "erase") eraseData();
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
  if (target.dataset.input) state.practice[target.dataset.input] = target.value;
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

app.addEventListener("change", event => {
  if (event.target.matches("[data-import-file]") && event.target.files[0]) importData(event.target.files[0]);
  const libraryFilter = event.target.dataset.libraryFilter;
  if (libraryFilter === "field") state.libraryField = event.target.value;
  if (libraryFilter === "domain") state.libraryDomain = event.target.value;
  if (libraryFilter === "need") state.libraryNeed = event.target.value;
  if (libraryFilter) render();
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

app.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-action='notice-tap']")) {
    event.preventDefault();
    if (state.quietWords) showToast(state.lang === "en" ? "Noticed" : "Notado");
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
  if (!state.reduceMotion && state.view !== "landing") {
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
window.addEventListener("beforeunload", () => { cancelAnimationFrame(fieldFrame); stopPracticeTimers(); });

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));

persistPreferences();
resizeField();
render();
fieldFrame = requestAnimationFrame(drawAmbient);
