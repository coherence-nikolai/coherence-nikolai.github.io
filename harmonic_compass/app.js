const STORAGE_KEY = "harmonic-compass-journal-v1";
const SETTINGS_KEY = "harmonic-compass-settings-v1";
const BACKUP_KEY = "harmonic-compass-journal-backup-v1";

const PRECEPTS = [
  {
    id: 1,
    text: "The Universe is Mental. You live in a U-inverse of your own creation - an inter-conceived notional experience and chosen soul journey for a dimensionally-limited Avatar Self, thoroughly designed by your multidimensional and omniscient Higher Self.",
    themes: ["mental universe", "avatar self", "higher self"],
    prompt: "Where am I forgetting that this experience is being perceived through a chosen Avatar Self?",
    practice: "Name one place where you can reclaim authorship without blaming yourself."
  },
  {
    id: 2,
    text: "You are the playwright, director, producer, and actor on your life's stage play. Your Higher Self chose to participate in a Multiplayer Spiritual Life Simulation - the One Source dividing itself into the many, to observe itself through greater variation of angular perception.",
    themes: ["simulation", "source", "perception"],
    prompt: "What role am I unconsciously performing today?",
    practice: "Rewrite one scene as if your Higher Self placed it there for observation."
  },
  {
    id: 3,
    text: "This experience enables increasing empathy and wisdom - the cumulative collection of all biased observational emotional responses of all divisions of Source Creation, expanding the knowledge database of spacetime memory.",
    themes: ["empathy", "wisdom", "spacetime memory"],
    prompt: "Which emotional response is asking to become wisdom instead of repetition?",
    practice: "Translate one reaction into the wisdom it is trying to teach."
  },
  {
    id: 4,
    text: "The backdrop is Duality. The aim is to transcend Duality, integrate the Shadow, and attain the Philosopher's Stone of hemi-synchronization - merging Conscious and Unconscious Minds into ONE Whole: The Superconscious Mind.",
    themes: ["duality", "shadow", "superconscious"],
    prompt: "Where am I splitting myself into acceptable and unacceptable parts?",
    practice: "Write one sentence from the conscious mind and one from the unconscious mind."
  },
  {
    id: 5,
    text: "The Hero and Villain co-depend on each other in order to define the boundary of their Self-perception. The Villain begins where the Hero ends and vice versa.",
    themes: ["hero", "villain", "self-perception"],
    prompt: "Who have I cast as the villain, and what boundary does that protect?",
    practice: "Describe the villain's function without defending or attacking it."
  },
  {
    id: 6,
    text: "Learn to see the unseen. Believe in miracles (Mira = Look; Cle = Key). Study the Art of Science and Science of Art. Realize that everything connects to everything else. Embrace that Believing is Seeing.",
    themes: ["miracles", "science", "art", "connection"],
    prompt: "What invisible connection is trying to become visible?",
    practice: "Track three small correspondences without forcing meaning."
  },
  {
    id: 7,
    text: "Seek not validation from others. You are NOT what you do. Your identity is independent of your accomplishments. What triggers you emotionally is an opportunity to expand awareness of Self.",
    themes: ["validation", "identity", "trigger"],
    prompt: "What accomplishment am I using as proof that I am allowed to exist?",
    practice: "Do one action today without using it to earn identity."
  },
  {
    id: 8,
    text: "What you judge in others is what you like or dislike about yourself. Like perceives like through sympathetic resonance. A truly humble person perceives only humility - arrogance perceives arrogance.",
    themes: ["projection", "judgment", "resonance"],
    prompt: "What judgment keeps returning, and what self-image does it protect?",
    practice: "Write the judgment as: I notice this because a version of me knows this frequency."
  },
  {
    id: 9,
    text: "Do not erase unpleasant awareness - see the beauty in polarity. Transmute the pain of suffering into the gold of soul evolution. All unattractive characteristics you eradicate from your persona will only multiply in your field around you in a new reflection.",
    themes: ["polarity", "suffering", "transmutation"],
    prompt: "What unpleasant awareness am I trying to erase?",
    practice: "Hold the rejected trait as information before trying to improve it."
  },
  {
    id: 10,
    text: "The world doesn't happen TO you; it happens FOR you. Consciousness attracts self-similar consciousness: victim consciousness leads to more victimhood.",
    themes: ["victimhood", "attraction", "self-similar"],
    prompt: "Where am I describing myself as done-to rather than met-by?",
    practice: "Change one sentence from 'to me' into 'for my awareness'."
  },
  {
    id: 11,
    text: "Feel and express deep empathy and gratitude for all perspectives. Sincere gratitude raises vibration almost instantaneously.",
    themes: ["gratitude", "empathy", "vibration"],
    prompt: "Which perspective can I bless without needing to become it?",
    practice: "Express one precise gratitude out loud."
  },
  {
    id: 12,
    text: "Choose love over the desire for objective truths that make you right. The only objective truth is the love that underlies it all.",
    themes: ["love", "truth", "rightness"],
    prompt: "Where do I want to be right more than I want to remain open?",
    practice: "Choose one conversation where love matters more than victory."
  },
  {
    id: 13,
    text: "Fall in love with the world as it is, without condition. Fall completely in love with yourself. What you voice will eventually be made manifest.",
    themes: ["unconditional love", "manifestation", "voice"],
    prompt: "What am I voicing repeatedly into the field?",
    practice: "Speak one sentence that you are willing to see made manifest."
  },
  {
    id: 14,
    text: "Be the change you desire to see. It is not enmity that makes life difficult but self-loathing. Accept and integrate your shadow consciousness.",
    themes: ["shadow", "self-loathing", "integration"],
    prompt: "Where am I blaming the world for what is asking to be integrated within me?",
    practice: "Name one disowned quality, thank it for protecting you, and ask what it needs in order to return."
  },
  {
    id: 15,
    text: "Study the Quadrivium: Arithmetic (Number in itself), Geometry (Number in Space), Music (Number in Time), and Cosmology (Number in Spacetime). The more I learn, the less I actually 'know.'",
    themes: ["quadrivium", "number", "humility"],
    prompt: "Which form of number is speaking today: itself, space, time, or spacetime?",
    practice: "Study one pattern slowly enough that certainty softens."
  },
  {
    id: 16,
    text: "Engage in random acts of kindness, expecting absolutely NOTHING in return.",
    themes: ["kindness", "service", "non-attachment"],
    prompt: "Where can I give without making the gift into identity?",
    practice: "Do one anonymous or unannounced act of kindness."
  },
  {
    id: 17,
    text: "Everyone you meet and every experience can be a divine communication. Learn to see the synchronicities from your Higher Self.",
    themes: ["synchronicity", "communication", "higher self"],
    prompt: "What has repeated enough times that it deserves attention?",
    practice: "Log one synchronicity without deciding too quickly what it means."
  },
  {
    id: 18,
    text: "Practice mindfulness and intentionality. How you do one thing is how you do everything.",
    themes: ["mindfulness", "intentionality", "practice"],
    prompt: "What small action is revealing the pattern of the whole?",
    practice: "Perform one ordinary act with total intentionality."
  },
  {
    id: 19,
    text: "Seek relationships that reflect where your consciousness is evolving. The heart expands as the ego dissolves.",
    themes: ["relationship", "heart", "ego"],
    prompt: "Which relationship reflects the consciousness I am growing into?",
    practice: "Offer one moment of ego-softening contact."
  },
  {
    id: 20,
    text: "Match your frequency through modulation of emotional states. We perceive the world as we are, not as it is.",
    themes: ["frequency", "emotion", "perception"],
    prompt: "What emotional state is tinting the world right now?",
    practice: "Modulate state before interpreting the situation."
  },
  {
    id: 21,
    text: "Embrace your unique expression. The Universe expands through unique perspectives. The only thing real in this Universal Mind Matrix is how we feel. There are no mistakes, only learnings.",
    themes: ["expression", "feeling", "learning"],
    prompt: "What unique expression have I been withholding?",
    practice: "Let one honest expression exist without editing it into acceptability."
  },
  {
    id: 22,
    text: "Take risks, be vulnerable, love deeply. There is no actual death, only transition. There is no God judgment - only self-imposed judgments.",
    themes: ["risk", "vulnerability", "transition"],
    prompt: "What risk is my heart already moving toward?",
    practice: "Do one vulnerable thing with clean intention and no demand."
  },
  {
    id: 23,
    text: "If you think you can or think you can't, you're right. Be an optimist. The only real obstacles are the ones we persistently believe in.",
    themes: ["optimism", "belief", "obstacle"],
    prompt: "Which belief is acting as a wall because I keep reasserting it?",
    practice: "Replace one fixed belief with an experiment."
  },
  {
    id: 24,
    text: "Exercise your talents. Explore your depths. Have fun. Surrender to the beauty of this Divine Unfolding.",
    themes: ["talent", "depth", "surrender", "play"],
    prompt: "Where can depth and play stop being opposites?",
    practice: "Use one talent today for beauty, not proof."
  }
];

const CORRIDORS = [
  { id: 1, name: "Seed · Information", triple: "(3,4,5)", rapidity: "acosh(4)", state: "Base Information / Digital Discrimination" },
  { id: 2, name: "EM · Alphahedron", triple: "(5,12,13)", rapidity: "acosh(12)", state: "Electromagnetic Perception · Light Awareness" },
  { id: 3, name: "Gravity", triple: "(8,15,17)", rapidity: "acosh(15)", state: "Gravitational Grounding · Embodiment" },
  { id: 4, name: "Weak · Entropic", triple: "(7,24,25)", rapidity: "acosh(24)", state: "Entropic Transition · Change Recognition" },
  { id: 5, name: "Time · Temporal", triple: "(9,40,41)", rapidity: "acosh(40)", state: "Temporal Flow · Memory Integration" },
  { id: 6, name: "Strong · Nuclear", triple: "(11,60,61)", rapidity: "acosh(60)", state: "Nuclear Coherence · Unified Field" },
  { id: 7, name: "Dark Energy", triple: "(13,84,85)", rapidity: "acosh(84)", state: "Non-Local Expansion · Cosmic Awareness" }
];

const DIMENSIONS = [
  { id: 0, name: "0D · Point", primitive: "θ = 0, (1,0)", mode: "Pure potential - undifferentiated awareness before the first distinction", signature: "ε∞ = 1/√3 · the loop seed" },
  { id: 1, name: "1D · Line", primitive: "Rapidity axis θₙ", mode: "Sequential awareness - time, causality, linear narrative consciousness", signature: "Metallic series λₙ" },
  { id: 2, name: "2D · Plane", primitive: "Right triangle (a,b,c)", mode: "Relational awareness - the perception of force, tension, and angle between things", signature: "∂ · seed corridor (3,4,5)" },
  { id: 3, name: "3D · Solid", primitive: "Polytope V=2c", mode: "Embodied awareness - topology, form, the sense of being a bounded self in space", signature: "Alphahedron V=26 · n=12" },
  { id: 4, name: "4D · Field", primitive: "Coherence field ρ(x,y,z,t)", mode: "Non-local awareness - the observer as a field, not a point; entanglement as geometry", signature: "S = 0 · variational identity" }
];

const RECURSIVE_STEPS = [
  { id: "root", symbol: "√3", value: "1.7320508...", operation: "Root - primal emergence", mode: "Undifferentiated Field" },
  { id: "delta", symbol: "∂", value: "3.6602540...", operation: "Expansion x 5 minus 5", mode: "Individuated Awareness" },
  { id: "omega", symbol: "ω", value: "6.3397459...", operation: "Self-squaring, scaled", mode: "Reflective Complexity" },
  { id: "epsilon", symbol: "ε∞", value: "0.5773502...", operation: "Inversion -> return to 1/√3", mode: "Dissolution / Return" }
];

const CODEX_ARTICLES = [
  {
    id: "attribution",
    title: "Attribution",
    body: "Primary source framework credited to Robert Edward Grant and the Sovereign Avatar / The Universal One material from Codex Universalis Press, 2026. Harmonic Compass is a private personal-use interface for working with this original framework while preserving Robert Edward Grant's name, source language, and codex attribution throughout the product.",
    formula: "Robert Edward Grant · Codex Universalis Press · 2026"
  },
  {
    id: "loop",
    title: "Recursive Harmonic Loop",
    body: "The Recursive Codex reveals a loop that closes with perfect precision at arbitrary digit depth. This recursive closure is a mathematical model of self-referential awareness - the process by which a system returns exactly to its own origin.",
    formula: "∂ = 5(√3 - 1) -> ω = ∂²/10 + 5 -> 10/ω - 1 = 1/√3 = ε∞ <=> LOOP CLOSED"
  },
  {
    id: "signature",
    title: "The Signature of Intent",
    body: "From two geometric operators Δθ and Δφ, three dimensionless constants of physics emerge from the same framework with no free parameters. The architecture of reality is intentional. The constants are a message from You to you: from the part that remembers, to the part that forgot.",
    formula: "P(chance alignment) ≈ 1 : 10^429"
  },
  {
    id: "grammar",
    title: "Four Constants as Recursive Grammar",
    body: "Each step in the loop encodes a distinct operation of consciousness: expansion, complexification, inversion, return. ∂ + ω = 9.999... (Chi, χ) - the exact infinite sum of Phi and Sieve. The loop is neither arbitrary nor approximated: it is closed.",
    formula: "√3 -> ∂ -> ω -> ε∞ -> 1/√3"
  },
  {
    id: "yhwh",
    title: "YHWH Tetragrammaton Mapping",
    body: "The four letters of the Tetragrammaton map to the four constants of the harmonic loop. The Name encodes the same recursive structure as the loop itself: primal ground -> expansion -> complexification -> return.",
    formula: "י (Yod) = √3 | ה (He) = ∂ | ו (Vav) = ω | ה (He) = ε∞ = 1/√3"
  },
  {
    id: "compass",
    title: "Compass Harmonics",
    body: "The two angles sum to exactly 100° - not 90°, not 360°, but the base-10 century angle. This links the harmonic loop to both angular geometry and decimal number consciousness.",
    formula: "∂ x 10 = 36°36'9\" · ω x 10 = 63°23'51\" · Sum = 100°"
  },
  {
    id: "operator",
    title: "The Consciousness Operator",
    body: "The consciousness operator C is the iterated harmonic loop. Its fixed point under iteration is not a static value but the infinite sum Chi = ∂ + ω = 9.999... - a number that is simultaneously 9 (discrete, countable) and 10 (continuous, complete).",
    formula: "C = limₙ→∞ [∂ -> ω -> ε∞ -> ∂]ⁿ · Fixed point: ∂ + ω = 9.999... (χ)"
  }
];

const ENTRY_TYPES = [
  "Intention",
  "Trigger",
  "Synchronicity",
  "Gratitude",
  "Shadow Integration",
  "Dream",
  "Relationship Reflection",
  "Frequency Shift",
  "Return-to-Origin Insight",
  "Freeform"
];

const state = {
  view: "today",
  selectedPrecept: dailyCompass().precept.id,
  search: "",
  journal: loadJournal(),
  editingId: null,
  filters: {
    type: "All",
    precept: "All"
  }
};

let searchRenderTimer = 0;

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { startDate: saved.startDate || "2026-05-23" };
  } catch {
    return { startDate: "2026-05-23" };
  }
}

function saveSettings(settings) {
  return safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadJournal() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function saveJournal() {
  return persistJournal(state.journal);
}

function persistJournal(entries) {
  return safeSetItem(STORAGE_KEY, JSON.stringify(entries));
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    toast("This browser could not save the latest change. Export your journal before continuing.");
    return false;
  }
}

function dailyCompass(date = new Date()) {
  const settings = loadSettings();
  const start = new Date(`${settings.startDate}T00:00:00`);
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.max(0, Math.floor((current - start) / 86400000));
  const precept = PRECEPTS[days % PRECEPTS.length];
  const corridor = CORRIDORS[(precept.id - 1) % CORRIDORS.length];
  const dimension = DIMENSIONS[(precept.id - 1) % DIMENSIONS.length];
  const step = RECURSIVE_STEPS[(precept.id - 1) % RECURSIVE_STEPS.length];

  return { days, precept, corridor, dimension, step };
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  render();
}

function toast(message) {
  const el = byId("toast");
  el.textContent = message;
  el.classList.add("visible");
  window.setTimeout(() => el.classList.remove("visible"), 2600);
}

function render() {
  const titleMap = {
    today: "Today",
    wheel: "Harmonic Wheel",
    precepts: "The 24 Precepts",
    journal: "Journal Memory Field",
    codex: "Codex Library",
    export: "Export & Privacy"
  };

  byId("view-title").textContent = titleMap[state.view] || "Harmonic Compass";
  const root = byId("app-root");

  if (state.view === "today") root.innerHTML = renderToday();
  if (state.view === "wheel") root.innerHTML = renderWheelView();
  if (state.view === "precepts") root.innerHTML = renderPrecepts();
  if (state.view === "journal") root.innerHTML = renderJournal();
  if (state.view === "codex") root.innerHTML = renderCodex();
  if (state.view === "export") root.innerHTML = renderExport();

  bindViewEvents();
}

function renderToday() {
  const compass = dailyCompass();
  const entryCount = entriesForPrecept(compass.precept.id).length;
  const selected = PRECEPTS.find((item) => item.id === state.selectedPrecept) || compass.precept;
  const selectedCorridor = CORRIDORS[(selected.id - 1) % CORRIDORS.length];
  const selectedDimension = DIMENSIONS[(selected.id - 1) % DIMENSIONS.length];
  const selectedStep = RECURSIVE_STEPS[(selected.id - 1) % RECURSIVE_STEPS.length];

  return `
    <div class="today-grid">
      <section class="hero-panel">
        <div class="panel-top">
          <span class="micro-label">Today's Compass</span>
          <span class="cycle-chip">Day ${compass.days + 1} · ${new Date().toLocaleDateString()}</span>
        </div>
        <div class="precept-hero">
          <div class="precept-number">Precept ${compass.precept.id}</div>
          <blockquote>${escapeHtml(compass.precept.text)}</blockquote>
        </div>
        <div class="harmonic-strip" aria-label="Daily harmonic mapping">
          <span>${escapeHtml(compass.corridor.name)}</span>
          <span>${escapeHtml(compass.dimension.name)}</span>
          <span>${escapeHtml(compass.step.symbol)} · ${escapeHtml(compass.step.mode)}</span>
        </div>
        <div class="prompt-row">
          <div>
            <span class="micro-label">Prompt</span>
            <p>${escapeHtml(compass.precept.prompt)}</p>
          </div>
          <div>
            <span class="micro-label">Practice</span>
            <p>${escapeHtml(compass.precept.practice)}</p>
          </div>
        </div>
        <div class="panel-actions">
          <button class="primary-button" type="button" data-action="journal-today">Journal With This</button>
          <button class="ghost-button" type="button" data-action="open-wheel">Open Wheel</button>
        </div>
      </section>

      <section class="wheel-panel compact-wheel">
        ${renderWheelSvg(compass.precept.id)}
      </section>

      <aside class="state-panel">
        <div class="panel-top">
          <span class="micro-label">State Check</span>
          <span>${entryCount} linked entries</span>
        </div>
        ${renderStateControls()}
        <div class="formula-card">
          <span class="micro-label">Recursive Codex</span>
          <code>∂ = 5(√3−1) → ω = ∂²/10+5 → 10/ω−1 = 1/√3</code>
        </div>
      </aside>
    </div>

    <section class="detail-band">
      <div>
        <span class="micro-label">Selected Harmonic</span>
        <h2>Precept ${selected.id}</h2>
        <p>${escapeHtml(selected.text)}</p>
      </div>
      <div class="mini-matrix">
        <span><strong>${escapeHtml(selectedCorridor.name)}</strong>${escapeHtml(selectedCorridor.state)}</span>
        <span><strong>${escapeHtml(selectedDimension.name)}</strong>${escapeHtml(selectedDimension.mode)}</span>
        <span><strong>${escapeHtml(selectedStep.symbol)} ${escapeHtml(selectedStep.value)}</strong>${escapeHtml(selectedStep.operation)}</span>
      </div>
    </section>
  `;
}

function renderStateControls() {
  return `
    <div class="range-stack">
      ${renderRange("Frequency", 62)}
      ${renderRange("Energy", 54)}
      ${renderRange("Clarity", 71)}
    </div>
    <div class="toggle-row">
      <label><input type="checkbox" id="check-shadow"> Shadow</label>
      <label><input type="checkbox" id="check-sync"> Synchronicity</label>
      <label><input type="checkbox" id="check-gratitude" checked> Gratitude</label>
    </div>
  `;
}

function renderRange(label, value) {
  return `
    <label class="range-control">
      <span>${label}<strong>${value}</strong></span>
      <input type="range" min="0" max="100" value="${value}" aria-label="${label}">
    </label>
  `;
}

function renderWheelView() {
  const selected = PRECEPTS.find((item) => item.id === state.selectedPrecept) || dailyCompass().precept;
  const corridor = CORRIDORS[(selected.id - 1) % CORRIDORS.length];
  const dimension = DIMENSIONS[(selected.id - 1) % DIMENSIONS.length];
  const step = RECURSIVE_STEPS[(selected.id - 1) % RECURSIVE_STEPS.length];
  return `
    <div class="wheel-layout">
      <section class="wheel-stage">
        <div class="wheel-stage-head">
          <div>
            <span class="micro-label">Recursive harmonic loop of consciousness</span>
            <h2>24 gates around a closed return.</h2>
          </div>
          <button class="ghost-button" type="button" data-action="spin-wheel">Spin</button>
        </div>
        ${renderWheelSvg(dailyCompass().precept.id)}
      </section>
      <aside class="selection-panel">
        <span class="micro-label">Active Segment</span>
        <h2>Precept ${selected.id}</h2>
        <p>${escapeHtml(selected.text)}</p>
        <div class="selection-grid">
          <div><strong>${escapeHtml(corridor.name)}</strong><span>${escapeHtml(corridor.triple)} · ${escapeHtml(corridor.rapidity)}</span></div>
          <div><strong>${escapeHtml(dimension.name)}</strong><span>${escapeHtml(dimension.signature)}</span></div>
          <div><strong>${escapeHtml(step.symbol)} · ${escapeHtml(step.mode)}</strong><span>${escapeHtml(step.operation)}</span></div>
        </div>
        <button class="primary-button full" type="button" data-action="journal-selected">Journal With Precept ${selected.id}</button>
      </aside>
    </div>
  `;
}

function renderWheelSvg(todayId) {
  const size = 720;
  const cx = size / 2;
  const cy = size / 2;
  const outer = 330;
  const inner = 245;
  const segments = PRECEPTS.map((precept, index) => {
    const start = -90 + index * 15 + 0.5;
    const end = start + 14;
    const path = describeArc(cx, cy, outer, inner, start, end);
    const labelAngle = (start + end) / 2;
    const label = polarToCartesian(cx, cy, 292, labelAngle);
    const isSelected = precept.id === state.selectedPrecept;
    const isToday = precept.id === todayId;
    return `
      <g class="wheel-segment ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}" data-precept="${precept.id}" tabindex="0" role="button" aria-label="Precept ${precept.id}">
        <path d="${path}"></path>
        <text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="central">${precept.id}</text>
      </g>
    `;
  }).join("");

  const corridorMarks = CORRIDORS.map((corridor, index) => {
    const angle = -90 + index * (360 / CORRIDORS.length);
    const p1 = polarToCartesian(cx, cy, 215, angle);
    const p2 = polarToCartesian(cx, cy, 232, angle);
    const label = polarToCartesian(cx, cy, 190, angle);
    return `
      <line class="corridor-mark" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"></line>
      <text class="corridor-label" x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="central">${index + 1}</text>
    `;
  }).join("");

  return `
    <svg class="harmonic-wheel" viewBox="0 0 ${size} ${size}" role="img" aria-label="Harmonic Wheel with 24 precepts">
      <defs>
        <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#68c7ff" stop-opacity="0.22"></stop>
          <stop offset="42%" stop-color="#d9a441" stop-opacity="0.10"></stop>
          <stop offset="100%" stop-color="#050913" stop-opacity="0"></stop>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#wheelGlow)"></rect>
      <circle class="wheel-grid" cx="${cx}" cy="${cy}" r="318"></circle>
      <circle class="wheel-grid inner" cx="${cx}" cy="${cy}" r="218"></circle>
      <circle class="gold-ring" cx="${cx}" cy="${cy}" r="174"></circle>
      <ellipse class="orbit orbit-one" cx="${cx}" cy="${cy}" rx="260" ry="76"></ellipse>
      <ellipse class="orbit orbit-two" cx="${cx}" cy="${cy}" rx="112" ry="260" transform="rotate(38 ${cx} ${cy})"></ellipse>
      ${segments}
      ${corridorMarks}
      <g class="center-seal">
        <circle cx="${cx}" cy="${cy}" r="112"></circle>
        <text x="${cx}" y="${cy - 18}" text-anchor="middle">√3 → ∂ → ω → ε∞</text>
        <text x="${cx}" y="${cy + 22}" text-anchor="middle">LOOP CLOSED</text>
      </g>
    </svg>
  `;
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

function describeArc(cx, cy, outerR, innerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", outerStart.x, outerStart.y,
    "A", outerR, outerR, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    "L", innerStart.x, innerStart.y,
    "A", innerR, innerR, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
    "Z"
  ].join(" ");
}

function renderPrecepts() {
  const query = state.search.trim().toLowerCase();
  const filtered = PRECEPTS.filter((precept) => {
    if (!query) return true;
    return `precept ${precept.id} ${precept.text} ${precept.themes.join(" ")}`.toLowerCase().includes(query);
  });

  return `
    <section class="library-head">
      <div>
        <span class="micro-label">Universal Mind</span>
        <h2>The 24 Precepts</h2>
        <p>Canonical source text is preserved. Prompts and practices are secondary navigation layers.</p>
      </div>
      <input class="search-input" type="search" value="${escapeHtml(state.search)}" placeholder="Search precepts, themes, or number" data-action="search">
    </section>
    <div class="precept-grid">
      ${filtered.map(renderPreceptCard).join("")}
    </div>
  `;
}

function renderPreceptCard(precept) {
  const entries = entriesForPrecept(precept.id);
  return `
    <article class="precept-card ${precept.id === state.selectedPrecept ? "selected" : ""}" data-precept-card="${precept.id}">
      <div class="card-top">
        <span>Precept ${precept.id}</span>
        <span>${entries.length} entries</span>
      </div>
      <p>${escapeHtml(precept.text)}</p>
      <div class="theme-row">${precept.themes.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="ghost-button" type="button" data-action="select-precept" data-precept="${precept.id}">Select</button>
        <button class="primary-button small" type="button" data-action="journal-precept" data-precept="${precept.id}">Journal</button>
      </div>
    </article>
  `;
}

function renderJournal() {
  const entries = filteredEntries();
  const selected = PRECEPTS.find((item) => item.id === state.selectedPrecept) || dailyCompass().precept;
  const editing = state.editingId ? state.journal.find((entry) => entry.id === state.editingId) : null;

  return `
    <div class="journal-layout">
      <section class="journal-composer">
        <span class="micro-label">${editing ? "Edit Memory" : "New Memory"}</span>
        <h2>${editing ? "Refine the entry." : "Add to the memory field."}</h2>
        <form id="journal-form">
          <label>
            Entry type
            <select name="type">
              ${ENTRY_TYPES.map((type) => `<option ${editing?.type === type ? "selected" : ""}>${type}</option>`).join("")}
            </select>
          </label>
          <label>
            Linked precept
            <select name="preceptId">
              ${PRECEPTS.map((precept) => `<option value="${precept.id}" ${(editing?.preceptId || selected.id) === precept.id ? "selected" : ""}>Precept ${precept.id}</option>`).join("")}
            </select>
          </label>
          <label>
            Title
            <input name="title" value="${escapeHtml(editing?.title || "")}" placeholder="A short name for this signal">
          </label>
          <label>
            Entry
            <textarea name="body" rows="7" placeholder="What happened, what moved, what returned?">${escapeHtml(editing?.body || "")}</textarea>
          </label>
          <div class="form-grid">
            <label>Frequency before <input name="before" type="number" min="0" max="100" value="${editing?.before ?? 50}"></label>
            <label>Frequency after <input name="after" type="number" min="0" max="100" value="${editing?.after ?? 68}"></label>
          </div>
          <label>
            Tags
            <input name="tags" value="${escapeHtml((editing?.tags || []).join(", "))}" placeholder="shadow, relationship, synchronicity">
          </label>
          <div class="panel-actions">
            <button class="primary-button" type="submit">${editing ? "Save Entry" : "Create Entry"}</button>
            ${editing ? `<button class="ghost-button" type="button" data-action="cancel-edit">Cancel</button>` : ""}
          </div>
        </form>
      </section>

      <section class="journal-timeline">
        <div class="timeline-head">
          <div>
            <span class="micro-label">Memory Field</span>
            <h2>${entries.length} entries</h2>
          </div>
          <div class="filter-row">
            <select data-action="filter-type" aria-label="Filter by entry type">
              <option>All</option>
              ${ENTRY_TYPES.map((type) => `<option ${state.filters.type === type ? "selected" : ""}>${type}</option>`).join("")}
            </select>
            <select data-action="filter-precept" aria-label="Filter by precept">
              <option>All</option>
              ${PRECEPTS.map((precept) => `<option value="${precept.id}" ${state.filters.precept === String(precept.id) ? "selected" : ""}>Precept ${precept.id}</option>`).join("")}
            </select>
          </div>
        </div>
        ${entries.length ? entries.map(renderEntry).join("") : renderEmptyJournal()}
      </section>
    </div>
  `;
}

function renderEmptyJournal() {
  const today = dailyCompass().precept;
  return `
    <div class="empty-state">
      <span class="micro-label">Pattern field forming</span>
      <h3>Begin with today's precept.</h3>
      <p>${escapeHtml(today.prompt)}</p>
      <button class="primary-button" type="button" data-action="journal-today">Journal With Precept ${today.id}</button>
    </div>
  `;
}

function renderEntry(entry) {
  const precept = PRECEPTS.find((item) => item.id === Number(entry.preceptId));
  return `
    <article class="entry-card">
      <div class="entry-head">
        <div>
          <span class="micro-label">${escapeHtml(entry.type)} · Precept ${entry.preceptId}</span>
          <h3>${escapeHtml(entry.title || "Untitled signal")}</h3>
        </div>
        <time>${new Date(entry.createdAt).toLocaleDateString()}</time>
      </div>
      <p>${escapeHtml(entry.body || "")}</p>
      ${precept ? `<blockquote>${escapeHtml(precept.text)}</blockquote>` : ""}
      <div class="entry-meta">
        <span>${entry.before ?? 0} -> ${entry.after ?? 0}</span>
        ${(entry.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="ghost-button" type="button" data-action="edit-entry" data-entry="${entry.id}">Edit</button>
        <button class="danger-button" type="button" data-action="delete-entry" data-entry="${entry.id}">Delete</button>
      </div>
    </article>
  `;
}

function filteredEntries() {
  return state.journal
    .filter((entry) => state.filters.type === "All" || entry.type === state.filters.type)
    .filter((entry) => state.filters.precept === "All" || String(entry.preceptId) === state.filters.precept)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function entriesForPrecept(preceptId) {
  return state.journal.filter((entry) => Number(entry.preceptId) === Number(preceptId));
}

function renderCodex() {
  const query = state.search.trim().toLowerCase();
  const articles = CODEX_ARTICLES.filter((article) => {
    if (!query) return true;
    return `${article.title} ${article.body} ${article.formula}`.toLowerCase().includes(query);
  });

  return `
    <section class="library-head">
      <div>
        <span class="micro-label">Sovereign Avatar · The Universal One</span>
        <h2>Codex Library</h2>
        <p>Robert Edward Grant · Codex Universalis Press · 2026. Source language is preserved for private study.</p>
      </div>
      <input class="search-input" type="search" value="${escapeHtml(state.search)}" placeholder="Search ∂, ω, χ, shadow, YHWH" data-action="search">
    </section>

    <div class="codex-stack">
      ${articles.map((article) => `
        <article class="codex-article">
          <span class="micro-label">${escapeHtml(article.id)}</span>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.body)}</p>
          <code>${escapeHtml(article.formula)}</code>
        </article>
      `).join("")}
    </div>

    <section class="codex-tables">
      ${renderCorridorTable()}
      ${renderDimensionTable()}
      ${renderConstantsTable()}
    </section>
  `;
}

function renderCorridorTable() {
  return `
    <article class="data-table-card">
      <h3>Seven Force Corridors</h3>
      <div class="data-table">
        ${CORRIDORS.map((item) => `
          <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.triple)}</span><span>${escapeHtml(item.rapidity)}</span><span>${escapeHtml(item.state)}</span></div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderDimensionTable() {
  return `
    <article class="data-table-card">
      <h3>Dimensional States of Consciousness</h3>
      <div class="data-table dimensions">
        ${DIMENSIONS.map((item) => `
          <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.primitive)}</span><span>${escapeHtml(item.mode)}</span><span>${escapeHtml(item.signature)}</span></div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderConstantsTable() {
  return `
    <article class="data-table-card">
      <h3>Four Constants as Recursive Grammar</h3>
      <div class="data-table constants">
        ${RECURSIVE_STEPS.map((item) => `
          <div><strong>${escapeHtml(item.symbol)}</strong><span>${escapeHtml(item.value)}</span><span>${escapeHtml(item.operation)}</span><span>${escapeHtml(item.mode)}</span></div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderExport() {
  const settings = loadSettings();
  return `
    <div class="export-layout">
      <section class="export-card">
        <span class="micro-label">Privacy</span>
        <h2>Local-first memory.</h2>
        <p>V1 stores journal entries in this browser. It does not require an account, cloud sync, or AI service. This public route is marked noindex and omitted from the sitemap.</p>
        <label class="date-setting">
          Daily cycle start
          <input type="date" value="${escapeHtml(settings.startDate)}" data-action="start-date">
        </label>
      </section>
      <section class="export-card">
        <span class="micro-label">Export</span>
        <h2>Carry the field with you.</h2>
        <p>Export includes Robert Edward Grant attribution, source-linked precept IDs, and all saved journal entries.</p>
        <div class="panel-actions">
          <button class="primary-button" type="button" data-action="export-json">Export JSON</button>
          <button class="ghost-button" type="button" data-action="export-markdown">Export Markdown</button>
        </div>
      </section>
      <section class="export-card">
        <span class="micro-label">Import</span>
        <h2>Restore a JSON archive.</h2>
        <p>Imports only replace the journal after the file validates as a Harmonic Compass archive or journal entry array.</p>
        <input type="file" accept="application/json" data-action="import-json">
      </section>
    </div>
  `;
}

function bindViewEvents() {
  document.querySelectorAll(".wheel-segment").forEach((segment) => {
    segment.addEventListener("click", () => {
      state.selectedPrecept = Number(segment.dataset.precept);
      render();
    });
    segment.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.selectedPrecept = Number(segment.dataset.precept);
        render();
      }
    });
  });

  document.querySelectorAll("[data-action='search']").forEach((input) => {
    input.addEventListener("input", (event) => {
      const cursor = event.target.selectionStart ?? event.target.value.length;
      state.search = event.target.value;
      window.clearTimeout(searchRenderTimer);
      searchRenderTimer = window.setTimeout(() => {
        render();
        requestAnimationFrame(() => {
          const restoredInput = document.querySelector("[data-action='search']");
          if (restoredInput) {
            restoredInput.focus();
            restoredInput.setSelectionRange(cursor, cursor);
          }
        });
      }, 220);
    });
  });

  const form = byId("journal-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const entry = {
        id: state.editingId || `entry-${Date.now()}`,
        createdAt: state.editingId ? state.journal.find((item) => item.id === state.editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: data.get("type"),
        preceptId: Number(data.get("preceptId")),
        title: String(data.get("title") || "").trim(),
        body: String(data.get("body") || "").trim(),
        before: clamp(Number(data.get("before")), 0, 100),
        after: clamp(Number(data.get("after")), 0, 100),
        tags: String(data.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean)
      };

      if (!entry.body) {
        toast("Write a few words before saving.");
        return;
      }

      const nextJournal = state.editingId
        ? state.journal.map((item) => item.id === state.editingId ? entry : item)
        : [entry, ...state.journal];

      if (!persistJournal(nextJournal)) {
        return;
      }

      state.journal = nextJournal;
      state.editingId = null;
      state.selectedPrecept = entry.preceptId;
      toast("Memory saved.");
      render();
    });
  }

  document.querySelectorAll("[data-action='filter-type']").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.filters.type = event.target.value;
      render();
    });
  });

  document.querySelectorAll("[data-action='filter-precept']").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.filters.precept = event.target.value;
      render();
    });
  });
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-view], [data-action]");
  if (!target) return;

  if (target.dataset.view) {
    setView(target.dataset.view);
    return;
  }

  const action = target.dataset.action;
  if (action === "open-today") setView("today");
  if (action === "new-entry") {
    state.editingId = null;
    setView("journal");
  }
  if (action === "open-wheel") setView("wheel");
  if (action === "journal-today") {
    state.selectedPrecept = dailyCompass().precept.id;
    state.editingId = null;
    setView("journal");
  }
  if (action === "journal-selected") {
    state.editingId = null;
    setView("journal");
  }
  if (action === "journal-precept") {
    state.selectedPrecept = Number(target.dataset.precept);
    state.editingId = null;
    setView("journal");
  }
  if (action === "select-precept") {
    state.selectedPrecept = Number(target.dataset.precept);
    setView("today");
  }
  if (action === "spin-wheel") {
    state.selectedPrecept = Math.floor(Math.random() * 24) + 1;
    render();
  }
  if (action === "cancel-edit") {
    state.editingId = null;
    render();
  }
  if (action === "edit-entry") {
    state.editingId = target.dataset.entry;
    render();
  }
  if (action === "delete-entry") {
    const entryId = target.dataset.entry;
    const entry = state.journal.find((item) => item.id === entryId);
    if (entry && window.confirm(`Delete "${entry.title || "Untitled signal"}"?`)) {
      const nextJournal = state.journal.filter((item) => item.id !== entryId);
      if (!persistJournal(nextJournal)) {
        return;
      }
      state.journal = nextJournal;
      toast("Memory deleted.");
      render();
    }
  }
  if (action === "export-json") exportJson();
  if (action === "export-markdown") exportMarkdown();
});

document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "start-date") {
    if (saveSettings({ startDate: target.value || "2026-05-23" })) {
      toast("Cycle start updated.");
      render();
    }
  }

  if (target.dataset.action === "import-json") {
    importJson(target.files?.[0]);
    target.value = "";
  }
});

function archivePayload() {
  return {
    app: "Harmonic Compass",
    version: 1,
    attribution: "Primary source framework credited to Robert Edward Grant and Codex Universalis Press, 2026.",
    exportedAt: new Date().toISOString(),
    journal: state.journal
  };
}

function exportJson() {
  downloadFile("harmonic-compass-journal.json", JSON.stringify(archivePayload(), null, 2), "application/json");
}

function exportMarkdown() {
  const lines = [
    "# Harmonic Compass Journal",
    "",
    "Primary source framework credited to Robert Edward Grant and Codex Universalis Press, 2026.",
    "",
    `Exported: ${new Date().toLocaleString()}`,
    ""
  ];

  state.journal.forEach((entry) => {
    const precept = PRECEPTS.find((item) => item.id === Number(entry.preceptId));
    lines.push(`## ${entry.title || "Untitled signal"}`);
    lines.push("");
    lines.push(`Type: ${entry.type}`);
    lines.push(`Precept: ${entry.preceptId}`);
    lines.push(`Date: ${new Date(entry.createdAt).toLocaleString()}`);
    lines.push(`State: ${entry.before ?? 0} -> ${entry.after ?? 0}`);
    if (entry.tags?.length) lines.push(`Tags: ${entry.tags.join(", ")}`);
    lines.push("");
    if (precept) {
      lines.push(`> ${precept.text}`);
      lines.push("");
    }
    lines.push(entry.body || "");
    lines.push("");
  });

  downloadFile("harmonic-compass-journal.md", lines.join("\n"), "text/markdown");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      const entries = Array.isArray(payload) ? payload : payload.journal;
      if (!Array.isArray(entries)) throw new Error("No journal array found");
      const valid = entries.every((entry) => entry && entry.id && entry.createdAt && entry.body !== undefined);
      if (!valid) throw new Error("Archive contains invalid entries");

      if (state.journal.length) {
        const confirmed = window.confirm(`Importing this archive will replace ${state.journal.length} existing journal ${state.journal.length === 1 ? "entry" : "entries"}. Export first if you need a separate backup. Continue?`);
        if (!confirmed) {
          toast("Import cancelled.");
          return;
        }
        safeSetItem(BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), journal: state.journal }));
      }

      if (!persistJournal(entries)) {
        return;
      }

      state.journal = entries;
      toast("Journal archive imported.");
      setView("journal");
    } catch (error) {
      toast(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

render();
