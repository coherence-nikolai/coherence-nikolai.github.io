const STORAGE_KEY = "harmonic-compass-journal-v2";
const SETTINGS_KEY = "harmonic-compass-settings-v2";
const BACKUP_KEY = "harmonic-compass-backup-v2";
const COMPLETIONS_KEY = "harmonic-compass-practice-completions-v2";
const DRAFT_KEY = "harmonic-compass-draft-v2";

const ATTRIBUTION = "Inspired by the works of Robert Edward Grant. Independent private study instrument.";
const DEFAULT_START_DATE = "2026-05-23";
const VOICE_VERSION = "20";
const VOICE_BASE = "./voice/audio/";

const VOICE_GUIDES = {
  welcome: { label: "Welcome", short: "Welcome", file: "guide_welcome.mp3" },
  today: { label: "Today Guide", short: "Today", file: "guide_today.mp3" },
  wheel: { label: "Wheel Guide", short: "Wheel", file: "guide_wheel.mp3" },
  gateDetail: { label: "Gate Detail Guide", short: "Gate Guide", file: "guide_gate_detail.mp3" },
  practice: { label: "Practice Guide", short: "Practice", file: "guide_practice.mp3" },
  seed: { label: "Seed", short: "Seed", file: "guide_seed.mp3" },
  motion: { label: "Motion", short: "Motion", file: "guide_motion.mp3" },
  mirror: { label: "Mirror", short: "Mirror", file: "guide_mirror.mp3" },
  return: { label: "Return", short: "Return", file: "guide_return.mp3" },
  journal: { label: "Journal Guide", short: "Journal", file: "guide_journal.mp3" },
  completion: { label: "Completion", short: "Completion", file: "guide_completion.mp3" }
};

const STEP_VOICE = {
  Seed: VOICE_GUIDES.seed,
  Motion: VOICE_GUIDES.motion,
  Mirror: VOICE_GUIDES.mirror,
  Return: VOICE_GUIDES.return
};

const APP_INTRO_TRANSCRIPT = [
  "Welcome to Harmonic Compass.",
  "This private study instrument is inspired by the works of Robert Edward Grant, especially the 24 precepts of Universal Mind.",
  "Those precepts point toward a way of seeing: that consciousness, perception, relationship, shadow, gratitude, courage, love, and creative expression are not separate subjects. They are parts of one living practice.",
  "Harmonic Compass does not ask you to memorize philosophy or decode mathematics. It turns the spirit of the 24 precepts into 24 original Compass Gates, each written in its own paraphrased voice.",
  "Each Gate gives you three things: a simple orientation, a concrete practice, and a reflection prompt. The purpose is not to get the right answer. The purpose is to notice what your life is showing you, and to move one honest step from there.",
  "The app uses a four-part rhythm: Seed, Motion, Mirror, Return. Seed asks you to name the signal. Motion asks you to take one clean action. Mirror asks you to notice what changed. Return asks you to carry one line of learning forward.",
  "Begin with Today if you want the app to choose the next Gate for you. Open the Wheel if you want to explore the full field. Use Practices when you need one action you can actually do. Use Journal when something in the day feels worth remembering.",
  "Everything here is private and stored locally in this browser. Treat it as a compass, not a command. Let the guidance stay simple. Listen, practice once, write honestly, and return tomorrow with a little more coherence."
];

const RHYTHM_STEPS = [
  {
    id: "seed",
    name: "Seed",
    verb: "notice",
    prompt: "Name the signal, question, intention, or inner state.",
    experience: "First spark, honest beginning, latent intent becoming visible."
  },
  {
    id: "expansion",
    name: "Motion",
    verb: "move",
    prompt: "Take one concrete action that moves the signal into life.",
    experience: "The smallest embodied action that turns reflection into movement."
  },
  {
    id: "reflection",
    name: "Mirror",
    verb: "observe",
    prompt: "Notice what the action reveals back to you.",
    experience: "Feedback, pattern, emotional truth, and the mirror of what happened."
  },
  {
    id: "return",
    name: "Return",
    verb: "integrate",
    prompt: "Save the learning, release what is complete, and carry one clean sentence forward.",
    experience: "The moment where experience becomes memory, practice, or release."
  }
];

const CORRIDORS = [
  { id: "seed", name: "Origin Lens", tone: "origin", meaning: "The beginning point where a signal becomes distinguishable." },
  { id: "light", name: "Perception Lens", tone: "clarity", meaning: "Seeing, feedback, attention, and pattern recognition." },
  { id: "ground", name: "Embodiment Lens", tone: "body", meaning: "Capacity, pacing, boundaries, and practical form." },
  { id: "entropy", name: "Change Lens", tone: "threshold", meaning: "Transition, friction, release, repair, and transformation." },
  { id: "time", name: "Memory Lens", tone: "sequence", meaning: "Echoes, rhythm, relationship history, and lived continuity." },
  { id: "coherence", name: "Power Lens", tone: "will", meaning: "Aligned action, clean desire, voice, and integration." },
  { id: "field", name: "Field Lens", tone: "mystery", meaning: "Service, spaciousness, awareness, and surrender." }
];

const DEPTHS = [
  { id: "d0", name: "Spark Layer", primitive: "single mark", mode: "pure potential before the first distinction" },
  { id: "d1", name: "Path Layer", primitive: "sequence", mode: "motion, timing, direction, and choice" },
  { id: "d2", name: "Mirror Layer", primitive: "relationship", mode: "tension, comparison, and reflection" },
  { id: "d3", name: "Body Layer", primitive: "form", mode: "embodiment, boundary, repair, and lived consequence" },
  { id: "d4", name: "Field Layer", primitive: "coherence", mode: "pattern across time, meaning, and awareness" }
];

function practices(gateId, rows) {
  return rows.map((row, index) => ({
    id: `g${String(gateId).padStart(2, "0")}-p${index + 1}`,
    gateId,
    title: row[0],
    type: row[1],
    duration: row[2],
    action: row[3],
    prompt: row[4]
  }));
}

const GATES = [
  {
    id: 1,
    title: "First Spark",
    essence: "A beginning asks for one honest motion, not a perfect map. Let the smallest true impulse become visible.",
    shadow: "Waiting for certainty before starting.",
    question: "What wants one simple yes from me now?",
    themes: ["beginning", "intent", "signal"],
    mapping: { corridor: "seed", depth: "d0", layer: "Will", step: "seed", reason: "This gate begins the rhythm by turning latent intent into a single visible mark." },
    practices: practices(1, [
      ["One True Motion", "Action", "2 min", "Do the smallest honest action that would make the next step real.", "What changed once the beginning existed outside your head?"],
      ["No Perfect Map", "Writing", "5 min", "Write three imperfect first steps and choose one.", "Which step carries the most life even if it is not complete?"],
      ["Visible Signal", "Environment", "3 min", "Place one object where it can remind you of today's intention.", "What did the visible symbol help you remember?"]
    ])
  },
  {
    id: 2,
    title: "Quiet Axis",
    essence: "Stability appears when attention returns to the center beneath reaction. From there, choice becomes cleaner.",
    shadow: "Over-correcting to regain control.",
    question: "Where can I pause before steering?",
    themes: ["center", "pause", "choice"],
    mapping: { corridor: "ground", depth: "d1", layer: "Body", step: "return", reason: "The rhythm returns through the body so reaction can settle before choice." },
    practices: practices(2, [
      ["Axis Breath", "Body", "90 sec", "Stand still, soften the jaw, and breathe down the center line of the body.", "Where did choice return when your body slowed down?"],
      ["Before Steering", "Observation", "3 min", "Notice an urge to fix, advise, or correct, then wait three breaths.", "What did the pause reveal underneath the urge?"],
      ["Clean Next Turn", "Action", "4 min", "Choose one response from steadiness instead of speed.", "How did the action feel different when it came from center?"]
    ])
  },
  {
    id: 3,
    title: "Living Measure",
    essence: "Growth becomes sustainable when pace and capacity are listened to together. More is not always wiser than enough.",
    shadow: "Confusing intensity with progress.",
    question: "What rhythm can I actually sustain?",
    themes: ["pace", "capacity", "measure"],
    mapping: { corridor: "ground", depth: "d3", layer: "Body", step: "reflection", reason: "The body tests whether expansion has become sustainable form." },
    practices: practices(3, [
      ["Capacity Check", "Body", "4 min", "Rate your real capacity from 1 to 10 before adding more effort.", "What did your system say it can honestly hold today?"],
      ["Enough Line", "Boundary", "5 min", "Define what enough looks like before you begin a task.", "Where did the enough line prevent overextension?"],
      ["Rhythm Audit", "Planning", "8 min", "Review your day and remove one intensity spike that is masquerading as devotion.", "What rhythm would let this practice last?"]
    ])
  },
  {
    id: 4,
    title: "Pattern Weaver",
    essence: "Separate details begin to speak when you notice the relationship between them. Meaning often lives in the arrangement.",
    shadow: "Collecting signals without synthesis.",
    question: "What pattern is forming across the pieces?",
    themes: ["pattern", "synthesis", "relationship"],
    mapping: { corridor: "light", depth: "d2", layer: "Mind", step: "expansion", reason: "Attention differentiates the parts, then the plane shows their relationships." },
    practices: practices(4, [
      ["Three Signals", "Observation", "6 min", "List three repeated details from the last day and draw a line between them.", "What relationship appeared between the signals?"],
      ["Arrange the Pieces", "Creative", "10 min", "Move notes, images, or objects into a pattern that feels true.", "What did the arrangement reveal that the list could not?"],
      ["Name the Weave", "Writing", "4 min", "Give the emerging pattern a title of five words or fewer.", "What does the title clarify?"]
    ])
  },
  {
    id: 5,
    title: "Threshold Breath",
    essence: "Change often arrives as a narrow doorway rather than a grand announcement. Step through with enough presence to feel the crossing.",
    shadow: "Retreating when transition feels undefined.",
    question: "What doorway am I already standing in?",
    themes: ["transition", "doorway", "presence"],
    mapping: { corridor: "entropy", depth: "d1", layer: "Spirit", step: "seed", reason: "A threshold begins a new sequence by admitting that the old sequence has changed." },
    practices: practices(5, [
      ["Doorway Naming", "Writing", "5 min", "Name the transition you are already inside.", "What changes when the threshold has a name?"],
      ["Crossing Gesture", "Body", "2 min", "Physically step across a doorway with one clear intention.", "What did your body register as you crossed?"],
      ["Transition Witness", "Ritual", "7 min", "Light, hold, or arrange one simple object to mark the crossing.", "What is ready to be honored before the new form appears?"]
    ])
  },
  {
    id: 6,
    title: "Merciful Mirror",
    essence: "Feedback becomes useful when it is received without collapse or defense. The mirror is not the judge; it is the instrument.",
    shadow: "Turning insight into self-attack.",
    question: "What can I see clearly without making it cruel?",
    themes: ["mirror", "feedback", "compassion"],
    mapping: { corridor: "light", depth: "d2", layer: "Heart", step: "reflection", reason: "This gate belongs to light because the user is learning to see; it belongs to reflection because feedback becomes compassionate pattern, not punishment." },
    practices: practices(6, [
      ["Kind Mirror", "Reflection", "5 min", "Write one difficult truth using language you would trust from a wise friend.", "What truth became usable when it stopped attacking you?"],
      ["Feedback Without Collapse", "Body", "3 min", "Receive one piece of feedback while keeping both feet on the floor and one hand on the heart.", "What helped the body stay present?"],
      ["Instrument Not Judge", "Inquiry", "6 min", "Ask what the mirror is measuring, then ask what it is not allowed to decide about your worth.", "What did the mirror reveal without becoming the judge?"]
    ])
  },
  {
    id: 7,
    title: "Hidden Current",
    essence: "Beneath the visible situation, a quieter motive may be moving everything. Follow the current before naming the conclusion.",
    shadow: "Reacting only to surface events.",
    question: "What deeper need is shaping this moment?",
    themes: ["motive", "depth", "need"],
    mapping: { corridor: "time", depth: "d4", layer: "Heart", step: "reflection", reason: "Hidden motives often reveal themselves across repetition, memory, and emotional pattern." },
    practices: practices(7, [
      ["Need Under Story", "Inquiry", "7 min", "Under a current story, write the need that might be moving it.", "What need was quieter than the explanation?"],
      ["Current Tracking", "Observation", "1 day", "Notice every time the same emotional current appears today.", "Where did the current move through different scenes?"],
      ["Name Before Conclusion", "Writing", "4 min", "Before deciding what something means, list three possible currents beneath it.", "Which possibility softened your certainty?"]
    ])
  },
  {
    id: 8,
    title: "Clear Flame",
    essence: "Desire becomes trustworthy when it is clarified rather than denied. Let wanting mature into direction.",
    shadow: "Either indulging impulse or suppressing it.",
    question: "What desire becomes clean when I tell the truth about it?",
    themes: ["desire", "direction", "energy"],
    mapping: { corridor: "coherence", depth: "d1", layer: "Will", step: "expansion", reason: "Desire differentiates raw energy into a chosen direction." },
    practices: practices(8, [
      ["Desire Sentence", "Writing", "5 min", "Write: I want... Then write what this wanting protects, serves, or seeks.", "What made the desire cleaner?"],
      ["Impulse to Direction", "Action", "8 min", "Turn one impulse into one responsible next action.", "What changed when energy became direction?"],
      ["Flame Check", "Body", "3 min", "Feel where desire lives in the body and ask whether it is hot, clear, tight, or open.", "What did the body say about the quality of wanting?"]
    ])
  },
  {
    id: 9,
    title: "Open Hand",
    essence: "Release is not abandonment; it is the end of gripping what has finished teaching. Space returns when the hand unclenches.",
    shadow: "Holding familiar weight as identity.",
    question: "What am I allowed to stop carrying?",
    themes: ["release", "space", "identity"],
    mapping: { corridor: "entropy", depth: "d3", layer: "Spirit", step: "return", reason: "Release closes a cycle by letting finished material change form." },
    practices: practices(9, [
      ["Unclench Practice", "Body", "2 min", "Make a fist around the thing you are gripping, then slowly open the hand.", "What did release feel like before the mind explained it?"],
      ["Finished Teaching", "Writing", "6 min", "Write what an old pattern already taught you.", "What can end because the lesson has been received?"],
      ["Make Space", "Environment", "10 min", "Clear one physical space that represents the thing you are done carrying.", "What entered when space returned?"]
    ])
  },
  {
    id: 10,
    title: "Brave Listening",
    essence: "Real listening changes the listener before it answers. Let another reality enter without rushing to organize it.",
    shadow: "Listening only to prepare a response.",
    question: "What have I not let myself fully hear?",
    themes: ["listening", "receptivity", "relationship"],
    mapping: { corridor: "light", depth: "d2", layer: "Heart", step: "reflection", reason: "Listening uses perception as a relational mirror instead of a debate tool." },
    practices: practices(10, [
      ["No Reply Listening", "Relationship", "1 conversation", "In one conversation, listen without planning your next sentence.", "What entered when you stopped preparing a response?"],
      ["Repeat Back", "Relationship", "5 min", "Repeat what someone said until they feel accurately heard.", "What changed when accuracy mattered more than speed?"],
      ["Listen to Silence", "Observation", "3 min", "Let silence have three full breaths before answering.", "What did the silence communicate?"]
    ])
  },
  {
    id: 11,
    title: "Shared Bridge",
    essence: "A bridge is built from both sides, with patience for difference. Connection strengthens when translation matters more than winning.",
    shadow: "Demanding sameness before trust.",
    question: "Where can I translate instead of persuade?",
    themes: ["translation", "bridge", "trust"],
    mapping: { corridor: "coherence", depth: "d2", layer: "Social", step: "expansion", reason: "A bridge expands the field by creating shared structure without erasing difference." },
    practices: practices(11, [
      ["Translate One Need", "Relationship", "6 min", "Translate your position into the need underneath it.", "What bridge appeared when the need was named?"],
      ["Both Sides Map", "Writing", "8 min", "Draw two columns: what I mean, what they might hear.", "Where was translation needed?"],
      ["Ask Before Persuading", "Relationship", "1 conversation", "Ask one sincere clarifying question before making your point.", "What softened when curiosity came first?"]
    ])
  },
  {
    id: 12,
    title: "Boundary Bell",
    essence: "A clean boundary protects the life of the connection. It rings before resentment has to shout.",
    shadow: "Mistaking self-erasure for kindness.",
    question: "What limit would preserve my generosity?",
    themes: ["boundary", "generosity", "integrity"],
    mapping: { corridor: "coherence", depth: "d3", layer: "Will", step: "return", reason: "The boundary returns scattered energy to integrity so connection can survive." },
    practices: practices(12, [
      ["Bell Sentence", "Writing", "5 min", "Write one boundary as a clean sentence with no courtroom speech around it.", "What limit preserves your generosity?"],
      ["Resentment Forecast", "Inquiry", "4 min", "Ask where resentment will grow if no boundary is named.", "What is the earliest kind boundary?"],
      ["Small No", "Action", "Today", "Practice one small no where you normally overextend.", "What happened when the no was simple?"]
    ])
  },
  {
    id: 13,
    title: "Inner Weather",
    essence: "Feelings move like weather when they are allowed to pass through the body. Naming the storm is different from becoming it.",
    shadow: "Fusing identity with passing emotion.",
    question: "What feeling needs room without becoming the whole sky?",
    themes: ["emotion", "weather", "body"],
    mapping: { corridor: "time", depth: "d3", layer: "Body", step: "reflection", reason: "Emotion is tracked as a moving pattern through the body across time." },
    practices: practices(13, [
      ["Weather Report", "Body", "3 min", "Name the feeling as weather: cloudy, electric, heavy, bright, shifting.", "What changed when the feeling became weather, not identity?"],
      ["Ninety Seconds", "Body", "90 sec", "Let one emotion move in the body for ninety seconds without solving it.", "Where did the feeling move?"],
      ["Sky Sentence", "Writing", "4 min", "Write: this feeling is in me, and it is not all of me.", "What space opened around the emotion?"]
    ])
  },
  {
    id: 14,
    title: "Mind Garden",
    essence: "Thoughts become a habitat through repetition. Tend the ones that make perception more honest and alive.",
    shadow: "Letting inherited thoughts run unexamined.",
    question: "Which thought am I feeding by habit?",
    themes: ["thought", "habit", "garden"],
    mapping: { corridor: "ground", depth: "d2", layer: "Mind", step: "return", reason: "This gate returns thought to tended form by pruning what repeats unconsciously." },
    practices: practices(14, [
      ["Thought Weeding", "Writing", "6 min", "Write one thought you keep feeding and one thought you want to cultivate instead.", "Which thought deserves less nourishment?"],
      ["Inherited Voice Check", "Inquiry", "5 min", "Ask whether a repeating thought is yours, inherited, or borrowed from fear.", "Whose voice is this thought using?"],
      ["Plant One Line", "Ritual", "2 min", "Choose one truthful sentence and repeat it slowly three times.", "What did the new sentence make possible?"]
    ])
  },
  {
    id: 15,
    title: "Golden Friction",
    essence: "Resistance can reveal where growth is asking for traction. Meet the difficulty as information before calling it obstruction.",
    shadow: "Treating discomfort as a stop sign.",
    question: "What is this friction trying to strengthen?",
    themes: ["friction", "growth", "strength"],
    mapping: { corridor: "entropy", depth: "d3", layer: "Will", step: "expansion", reason: "Friction is change pressure; the expansion step turns resistance into usable force." },
    practices: practices(15, [
      ["Friction Inventory", "Writing", "5 min", "List three places you feel resistance and what each may be strengthening.", "Which friction contains traction?"],
      ["One Degree Harder", "Action", "5 min", "Take a tiny action toward the difficulty without overwhelming the system.", "What became stronger through contact?"],
      ["Obstruction Reframe", "Inquiry", "4 min", "Ask what the obstacle is training instead of blocking.", "What training is hidden in the difficulty?"]
    ])
  },
  {
    id: 16,
    title: "True Scale",
    essence: "Some choices shrink when seen up close and expand when seen in context. Adjust the scale until the next right move appears.",
    shadow: "Magnifying urgency beyond proportion.",
    question: "What changes when I widen the frame?",
    themes: ["scale", "perspective", "context"],
    mapping: { corridor: "light", depth: "d4", layer: "Mind", step: "reflection", reason: "Perspective widens perception until proportion becomes visible." },
    practices: practices(16, [
      ["Zoom Out", "Observation", "4 min", "Imagine the issue from tomorrow, next month, and five years out.", "Which scale made the next move clearer?"],
      ["Proportion Line", "Writing", "5 min", "Draw a line from tiny to enormous and place the issue honestly on it.", "Was the urgency proportionate?"],
      ["Context Question", "Inquiry", "3 min", "Ask what context is missing from your current interpretation.", "What fact or feeling changed the scale?"]
    ])
  },
  {
    id: 17,
    title: "Rooted Voice",
    essence: "Expression carries farther when it rises from the body, not performance. Speak from contact with what is actually true.",
    shadow: "Shaping words to be approved.",
    question: "What would I say if I stayed connected to myself?",
    themes: ["voice", "truth", "expression"],
    mapping: { corridor: "coherence", depth: "d3", layer: "Social", step: "seed", reason: "Authentic expression begins as a grounded seed before it becomes social signal." },
    practices: practices(17, [
      ["Hand on Belly", "Body", "2 min", "Place a hand on the belly before saying the true sentence.", "Did the words stay connected to the body?"],
      ["Unapproved Draft", "Writing", "7 min", "Write the thing you would say if approval were not the goal.", "What truth appeared before editing?"],
      ["One Rooted Sentence", "Relationship", "Today", "Speak one honest sentence without overexplaining it.", "What carried farther because it was simple?"]
    ])
  },
  {
    id: 18,
    title: "Luminous Repair",
    essence: "Repair does not erase rupture; it brings care to the place where trust was strained. The willingness to mend is itself a signal.",
    shadow: "Avoiding accountability to avoid shame.",
    question: "What repair would restore dignity for everyone involved?",
    themes: ["repair", "trust", "accountability"],
    mapping: { corridor: "entropy", depth: "d3", layer: "Heart", step: "return", reason: "Repair returns relationship through the changed place instead of pretending rupture did not happen." },
    practices: practices(18, [
      ["Dignity Repair", "Relationship", "8 min", "Write or speak a repair that names impact without self-erasure.", "What restored dignity on both sides?"],
      ["Accountability Without Shame", "Body", "4 min", "Feel the body while naming one thing you can own cleanly.", "What could be owned without collapse?"],
      ["Care at the Strain", "Action", "Today", "Bring one specific care action to a strained place.", "What signal did repair send?"]
    ])
  },
  {
    id: 19,
    title: "Nested Choice",
    essence: "Every decision sits inside larger loyalties. Choose in a way your future self can inhabit.",
    shadow: "Optimizing the moment while betraying the arc.",
    question: "What larger commitment should guide this choice?",
    themes: ["choice", "principle", "future self"],
    mapping: { corridor: "seed", depth: "d1", layer: "Will", step: "reflection", reason: "A choice is a line; reflection aligns that line with the larger pattern it belongs to." },
    practices: practices(19, [
      ["Future Self Vote", "Writing", "5 min", "Ask your future self which option they can inhabit with dignity.", "Which choice aged well in imagination?"],
      ["Loyalty Stack", "Inquiry", "6 min", "List the loyalties inside the decision: comfort, truth, love, freedom, craft, body.", "Which loyalty should lead?"],
      ["Arc Over Moment", "Action", "Today", "Make one choice that serves the arc rather than the momentary reward.", "What arc did you strengthen?"]
    ])
  },
  {
    id: 20,
    title: "Creative Tension",
    essence: "Opposites can generate movement when neither is forced to vanish. Hold the stretch until a third possibility appears.",
    shadow: "Splitting reality into either-or.",
    question: "What new option appears if both truths remain present?",
    themes: ["polarity", "novelty", "third option"],
    mapping: { corridor: "entropy", depth: "d2", layer: "Mind", step: "expansion", reason: "Tension differentiates two poles, then creates motion toward a third form." },
    practices: practices(20, [
      ["Both Truths", "Writing", "6 min", "Write two opposing truths without resolving them.", "What changed when neither truth had to vanish?"],
      ["Third Door", "Creative", "8 min", "Brainstorm five options that are not either original pole.", "Which third door has life?"],
      ["Hold the Stretch", "Body", "3 min", "Hold both hands apart, naming one truth in each hand, then breathe.", "What did the body learn about tension?"]
    ])
  },
  {
    id: 21,
    title: "Ancestral Echo",
    essence: "Some reactions are older than the present scene. Honor the origin without letting it author the future.",
    shadow: "Repeating inherited survival strategies unconsciously.",
    question: "What old echo is asking to be updated?",
    themes: ["memory", "legacy", "choice"],
    mapping: { corridor: "time", depth: "d4", layer: "Spirit", step: "return", reason: "An old pattern is returned to choice when memory is honored without obeying it blindly." },
    practices: practices(21, [
      ["Older Than Now", "Inquiry", "5 min", "Ask whether your reaction belongs entirely to the current moment.", "What part of the reaction felt older than now?"],
      ["Honor and Update", "Writing", "7 min", "Thank the old strategy, then write the update it needs today.", "What can be honored without being repeated?"],
      ["Future Author", "Action", "Today", "Choose one response that lets the future author the next line.", "Where did choice replace inheritance?"]
    ])
  },
  {
    id: 22,
    title: "Useful Mystery",
    essence: "Not knowing can be an active intelligence when it keeps inquiry open. Let uncertainty become a chamber for listening.",
    shadow: "Forcing premature answers to escape ambiguity.",
    question: "What can remain unknown while I stay engaged?",
    themes: ["mystery", "inquiry", "uncertainty"],
    mapping: { corridor: "field", depth: "d4", layer: "Spirit", step: "seed", reason: "Mystery seeds inquiry by leaving enough space for the field to respond." },
    practices: practices(22, [
      ["Unknown List", "Writing", "5 min", "List what you do not know without solving any of it.", "Which unknown became less threatening when it was named?"],
      ["Open Question Walk", "Observation", "10 min", "Walk with one open question and do not answer it during the walk.", "What did the question do when it stayed open?"],
      ["No Premature Seal", "Practice", "1 day", "Refuse one premature conclusion today.", "What stayed alive because you did not seal it too early?"]
    ])
  },
  {
    id: 23,
    title: "Embodied Yes",
    essence: "Consent, commitment, and enthusiasm each have a bodily signature. Wait for the answer that includes your whole system.",
    shadow: "Agreeing from pressure or momentum.",
    question: "Where does my body say yes, no, or not yet?",
    themes: ["consent", "body", "commitment"],
    mapping: { corridor: "ground", depth: "d3", layer: "Body", step: "reflection", reason: "The body becomes the measuring instrument for yes, no, and not yet." },
    practices: practices(23, [
      ["Yes No Not Yet", "Body", "4 min", "Ask the body for yes, no, and not yet, noticing each signature.", "Which answer included your whole system?"],
      ["Pressure Check", "Inquiry", "3 min", "Before agreeing, ask whether the yes is clean or pressured.", "What pressure was trying to speak as consent?"],
      ["Delay for Truth", "Action", "Today", "Use the sentence: I need to feel into this before I answer.", "What truth arrived after the delay?"]
    ])
  },
  {
    id: 24,
    title: "Field Offering",
    essence: "The work becomes complete when it serves beyond the self. Offer what has ripened without needing to control its reception.",
    shadow: "Withholding gifts until guaranteed recognition.",
    question: "What is ready to be given cleanly?",
    themes: ["service", "gift", "surrender"],
    mapping: { corridor: "field", depth: "d4", layer: "Social", step: "expansion", reason: "Integration expands into the field when the gift is offered without control." },
    practices: practices(24, [
      ["Clean Offering", "Action", "Today", "Share one useful gift without tracking how it is received.", "What was clean about offering without control?"],
      ["Ripened Gift", "Writing", "6 min", "Name one skill, insight, or kindness that is ripe enough to give.", "What has ripened beyond private possession?"],
      ["Release Reception", "Ritual", "3 min", "After giving, open both hands and release the need to manage the outcome.", "What changed when reception was no longer yours to control?"]
    ])
  }
];

const ALL_PRACTICES = GATES.flatMap((gate) => gate.practices);
const VIEW_TITLES = {
  today: "Good evening, Seeker.",
  wheel: "Wheel",
  gates: "Gates",
  gateDetail: "Gate Detail",
  practices: "Practices",
  practiceSession: "Practice Session",
  journal: "Journal",
  codex: "Method",
  guide: "Guide",
  export: "Export"
};

const root = document.querySelector("#app-root");
const title = document.querySelector("#view-title");
const toastNode = document.querySelector("#toast");

const state = {
  view: "today",
  selectedGateId: null,
  selectedPracticeId: null,
  journal: loadJournal(),
  completions: loadCompletions(),
  settings: loadSettings(),
  draft: loadDraft(),
  editingId: null,
  search: "",
  practiceSearch: "",
  filters: { type: "all", gate: "all", practice: "all" },
  wheelMode: "today",
  guideInput: "",
  guideMode: "reflect",
  guideOutput: ""
};

state.selectedGateId = dailyCompass().gate.id;
state.selectedPracticeId = getGate(state.selectedGateId).practices[0].id;

function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    toast("Local storage is unavailable in this browser context.");
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    toast("Local storage is unavailable in this browser context.");
    return false;
  }
}

function loadJournal() {
  const stored = safeGetItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function loadCompletions() {
  const stored = safeGetItem(COMPLETIONS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function loadSettings() {
  const defaults = { startDate: DEFAULT_START_DATE };
  const stored = safeGetItem(SETTINGS_KEY);
  if (!stored) return defaults;
  try {
    return { ...defaults, ...JSON.parse(stored) };
  } catch (error) {
    return defaults;
  }
}

function loadDraft() {
  const stored = safeGetItem(DRAFT_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function persistJournal(entries) {
  return safeSetItem(STORAGE_KEY, JSON.stringify(entries));
}

function persistCompletions(completions) {
  return safeSetItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

function saveSettings(next) {
  state.settings = { ...state.settings, ...next };
  return safeSetItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function saveDraft(next) {
  state.draft = { ...state.draft, ...next };
  return safeSetItem(DRAFT_KEY, JSON.stringify(state.draft));
}

function clearDraft() {
  state.draft = {};
  safeRemoveItem(DRAFT_KEY);
}

function getGate(id) {
  return GATES.find((gate) => gate.id === Number(id)) || GATES[0];
}

function getPractice(id) {
  return ALL_PRACTICES.find((practice) => practice.id === id) || null;
}

function getCorridor(id) {
  return CORRIDORS.find((corridor) => corridor.id === id) || CORRIDORS[0];
}

function getDepth(id) {
  return DEPTHS.find((depth) => depth.id === id) || DEPTHS[0];
}

function getStep(id) {
  return RHYTHM_STEPS.find((step) => step.id === id) || RHYTHM_STEPS[0];
}

function currentGate() {
  return getGate(state.selectedGateId || dailyCompass().gate.id);
}

function currentPractice(gate = currentGate()) {
  const selected = getPractice(state.selectedPracticeId);
  if (selected && selected.gateId === gate.id) return selected;
  state.selectedPracticeId = gate.practices[0].id;
  return gate.practices[0];
}

function voiceSrc(file) {
  return `${VOICE_BASE}${file}?v=${VOICE_VERSION}`;
}

function gateVoice(gate) {
  const number = String(gate.id).padStart(2, "0");
  return {
    label: `Gate ${number}`,
    short: `Gate ${number}`,
    file: `gate_${number}.mp3`
  };
}

function dailyCompass() {
  const start = new Date(`${state?.settings?.startDate || DEFAULT_START_DATE}T00:00:00`);
  const now = new Date();
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const day = Math.max(0, Math.floor((today - startDay) / 86400000));
  return { day, gate: GATES[day % GATES.length] };
}

function completionForPractice(practiceId) {
  return state.completions.find((item) => item.practiceId === practiceId);
}

function completionsForGate(gateId) {
  return state.completions.filter((item) => item.gateId === Number(gateId));
}

function journalForGate(gateId) {
  return state.journal.filter((entry) => Number(entry.gateId) === Number(gateId));
}

function resetScrollPosition() {
  const reset = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  reset();
  window.requestAnimationFrame(reset);
  window.setTimeout(reset, 0);
  window.setTimeout(reset, 80);
}

function setView(view) {
  state.view = view === "precepts" ? "gates" : view === "avatar" ? "guide" : view;
  resetScrollPosition();
  render();
  resetScrollPosition();
}

function render() {
  const normalized = state.view === "precepts" ? "gates" : state.view;
  state.view = VIEW_TITLES[normalized] ? normalized : "today";
  const gate = currentGate();
  title.textContent = state.view === "gateDetail" ? `Gate ${String(gate.id).padStart(2, "0")}` : VIEW_TITLES[state.view];
  const activeNav = state.view === "gateDetail" ? "gates" : state.view === "practiceSession" ? "practices" : state.view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeNav);
  });

  const views = {
    today: renderToday,
    wheel: renderWheelView,
    gates: renderGates,
    gateDetail: renderGateDetail,
    practices: renderPractices,
    practiceSession: renderPracticeSession,
    journal: renderJournal,
    codex: renderMethod,
    guide: renderGuide,
    export: renderExport
  };

  root.innerHTML = views[state.view]();
}

function renderToday() {
  const daily = dailyCompass();
  const gate = currentGate();
  const practice = currentPractice(gate);
  const step = getStep(gate.mapping.step);
  const corridor = getCorridor(gate.mapping.corridor);
  const depth = getDepth(gate.mapping.depth);
  const complete = completionForPractice(practice.id);
  const gateEntries = journalForGate(gate.id);
  const ritualCopy = {
    seed: "Set your intention",
    expansion: "Take one clean action",
    reflection: "Reflect and integrate",
    return: "Rest and renew"
  };

  return `
    <div class="observatory-today">
      <section class="ritual-band">
        <div>
          <p class="micro-label">Today's rhythm</p>
          <h2>${escapeHtml(step.name)} phase</h2>
        </div>
        <div class="ritual-flow">
          ${RHYTHM_STEPS.map((item, index) => `
            <div class="ritual-step ${item.id === gate.mapping.step ? "active" : ""}">
              <span class="ritual-orb">${index + 1}</span>
              <span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(ritualCopy[item.id] || item.prompt)}</small>
              </span>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="cosmic-wheel-panel">
        <div class="wheel-constellation" aria-hidden="true"></div>
        ${renderWheel({ compact: false })}
      </section>

      <aside class="gate-chamber">
        <div class="chamber-top">
          <p class="micro-label">${daily.gate.id === gate.id ? "Daily gate" : "Selected gate"}</p>
          <span>Cycle day ${daily.day + 1}</span>
        </div>
        <h2>Gate ${String(gate.id).padStart(2, "0")}</h2>
        <h3>${escapeHtml(gate.title)}</h3>
        <div class="gate-tags">
          ${gate.themes.slice(0, 3).map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}
        </div>
        <p>${escapeHtml(gate.essence)}</p>
        ${renderVoicePanel([VOICE_GUIDES.today], "Begin with audio")}

        ${renderDisclosure("More audio", `
          <div class="voice-actions compact-stack">
            ${renderVoiceButton(VOICE_GUIDES.welcome)}
            ${renderVoiceButton(gateVoice(gate))}
          </div>
        `)}

        <div class="practice-orbit-card">
          <p class="micro-label">${complete ? "Completed practice" : "Today's practice"}</p>
          <h3>${escapeHtml(practice.title)}</h3>
          <span>${escapeHtml(practice.duration)} · ${escapeHtml(practice.type)}</span>
          <p>${escapeHtml(practice.action)}</p>
        </div>

        ${renderDisclosure("Reflection prompt", `<blockquote>${escapeHtml(practice.prompt)}</blockquote>`)}

        <div class="panel-actions">
          <button class="primary-button full" type="button" data-action="start-practice" data-practice="${practice.id}">Start Practice</button>
        </div>

        ${renderDisclosure("More actions", `
          <div class="panel-actions vertical">
            <button class="ghost-button full" type="button" data-action="open-gate" data-gate="${gate.id}">View Gate</button>
            <button class="ghost-button full" type="button" data-action="journal-practice" data-practice="${practice.id}">Open Journal</button>
            <button class="ghost-button full" type="button" data-action="toggle-practice" data-practice="${practice.id}">${complete ? "Mark Open" : "Mark Done"}</button>
          </div>
        `)}

        ${renderDisclosure("Compass context", `
          <div class="chamber-map">
            <span>${escapeHtml(corridor.name)}</span>
            <span>${escapeHtml(depth.name)}</span>
            <span>${escapeHtml(step.name)}</span>
          </div>
        `)}

        ${renderDisclosure("Local status", `<p class="privacy-row">${gateEntries.length} memories · ${completionsForGate(gate.id).length} completed practices · stored locally</p>`)}
      </aside>

      <div class="observatory-card-grid">
        <article class="observatory-card">
          <div class="card-visual intention-visual" aria-hidden="true"></div>
          <p class="micro-label">Daily intention</p>
          <h3>${escapeHtml(gate.question)}</h3>
          <p>Choose one clean sentence.</p>
          <button class="ghost-button" type="button" data-action="journal-practice" data-practice="${practice.id}">Set Intention</button>
        </article>
        <article class="observatory-card">
          <div class="card-visual rhythm-visual" aria-hidden="true"></div>
          <p class="micro-label">Rhythm support</p>
          <h3>${escapeHtml(step.name)} · ${escapeHtml(capitalize(step.verb))}</h3>
          <p>${escapeHtml(step.prompt)}</p>
          <button class="ghost-button" type="button" data-action="open-wheel">Open Wheel</button>
        </article>
        <article class="observatory-card">
          <div class="card-visual journal-visual" aria-hidden="true"></div>
          <p class="micro-label">Journaling</p>
          <h3>${gateEntries.length ? `${gateEntries.length} memories saved` : "Begin the memory field"}</h3>
          <p>Save the signal while it is fresh.</p>
          <button class="ghost-button" type="button" data-action="new-entry">Continue Journal</button>
        </article>
      </div>
    </div>
  `;
}

function renderWheelView() {
  const gate = currentGate();
  const practice = currentPractice(gate);
  const corridor = getCorridor(gate.mapping.corridor);
  const depth = getDepth(gate.mapping.depth);
  const step = getStep(gate.mapping.step);

  return `
    <div class="wheel-layout">
      <section class="wheel-stage">
        <div class="wheel-stage-head">
          <div>
            <p class="micro-label">Harmonic wheel</p>
            <h2>24 original Compass Gates.</h2>
          </div>
          <div class="topbar-actions">
            ${[
              ["today", "Today"],
              ["journal", "Journal"],
              ["practice", "Practice"],
              ["pattern", "Pattern"]
            ].map(([mode, label]) => `
              <button class="ghost-button ${state.wheelMode === mode ? "selected" : ""}" type="button" data-action="set-wheel-mode" data-mode="${mode}">${label}</button>
            `).join("")}
            <button class="ghost-button" type="button" data-action="spin-wheel">Spin</button>
          </div>
        </div>
        ${renderWheel({ compact: false })}
      </section>

      <aside class="selection-panel">
        <p class="micro-label">Active segment</p>
        <h2>Gate ${gate.id}<br>${escapeHtml(gate.title)}</h2>
        <p>${escapeHtml(gate.essence)}</p>
        ${renderVoicePanel([VOICE_GUIDES.wheel, gateVoice(gate)], "Voice guide")}
        ${renderDisclosure("Compass map", `<div class="selection-grid">
          <div><strong>${escapeHtml(corridor.name)}</strong>${escapeHtml(corridor.meaning)}</div>
          <div><strong>${escapeHtml(depth.name)}</strong>${escapeHtml(depth.mode)}</div>
          <div><strong>${escapeHtml(step.name)}</strong>${escapeHtml(gate.mapping.reason)}</div>
        </div>`)}
        <div class="focus-card practice-focus">
          <p class="micro-label">Suggested practice</p>
          <h3>${escapeHtml(practice.title)}</h3>
          <p>${escapeHtml(practice.action)}</p>
        </div>
        <div class="panel-actions vertical">
          <button class="primary-button full" type="button" data-action="open-gate" data-gate="${gate.id}">View Gate ${gate.id}</button>
          <button class="ghost-button full" type="button" data-action="start-practice" data-practice="${practice.id}">Start Practice</button>
          <button class="ghost-button full" type="button" data-action="journal-practice" data-practice="${practice.id}">Journal Gate ${gate.id}</button>
        </div>
      </aside>
    </div>
  `;
}

function renderGates() {
  const term = state.search.trim().toLowerCase();
  const gates = GATES.filter((gate) => {
    const haystack = `${gate.id} ${gate.title} ${gate.essence} ${gate.shadow} ${gate.question} ${gate.themes.join(" ")}`.toLowerCase();
    return !term || haystack.includes(term);
  });

  return `
    <section class="library-head">
      <div>
        <p class="micro-label">Paraphrased original model</p>
        <h2>The Compass Gates</h2>
        <p>Each gate is written in Harmonic Compass's own voice: a state, a shadow signal, a guidance shape, and three concrete practices.</p>
      </div>
      <input class="search-input" type="search" placeholder="Search gates" value="${escapeAttr(state.search)}" data-action="search-gates">
    </section>

    <div class="precept-grid">
      ${gates.map((gate) => {
        const step = getStep(gate.mapping.step);
        const corridor = getCorridor(gate.mapping.corridor);
        return `
          <article class="precept-card ${gate.id === state.selectedGateId ? "selected" : ""}">
            <div class="card-top">
              <span>Gate ${gate.id}</span>
              <span>${escapeHtml(step.name)}</span>
            </div>
            <h3>${escapeHtml(gate.title)}</h3>
            <p>${escapeHtml(gate.essence)}</p>
            <div class="theme-row">
              <span>${escapeHtml(corridor.name)}</span>
              ${gate.themes.slice(0, 2).map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}
            </div>
            <div class="card-actions">
              <button class="ghost-button" type="button" data-action="open-gate" data-gate="${gate.id}">View Gate</button>
              <button class="primary-button small" type="button" data-action="journal-gate" data-gate="${gate.id}">Journal</button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderGateDetail() {
  const gate = currentGate();
  const practice = currentPractice(gate);
  const corridor = getCorridor(gate.mapping.corridor);
  const depth = getDepth(gate.mapping.depth);
  const step = getStep(gate.mapping.step);
  const entries = journalForGate(gate.id);
  const completed = completionsForGate(gate.id);

  return `
    <div class="gate-detail-layout">
      <section class="gate-detail-hero">
        <div class="detail-action-row">
          <button class="ghost-button" type="button" data-action="back-to-gates">All Gates</button>
          <button class="ghost-button" type="button" data-action="open-wheel">Wheel</button>
        </div>
        <p class="micro-label">Gate ${String(gate.id).padStart(2, "0")} · ${escapeHtml(corridor.name)}</p>
        <h2>${escapeHtml(gate.title)}</h2>
        <p class="detail-essence">${escapeHtml(gate.essence)}</p>
        <div class="gate-tags detail-tags">
          ${gate.themes.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}
        </div>
        ${renderVoicePanel([VOICE_GUIDES.gateDetail, gateVoice(gate)], "Voice guide")}

        <div class="gate-question-card">
          <p class="micro-label">Integration question</p>
          <blockquote>${escapeHtml(gate.question)}</blockquote>
        </div>

        <div class="detail-rhythm-panel">
          <div>
            <p class="micro-label">Guided movement</p>
            <h3>${escapeHtml(step.name)} · ${escapeHtml(capitalize(step.verb))}</h3>
            <p>${escapeHtml(step.prompt)}</p>
          </div>
          ${renderRhythmLadder(gate.mapping.step)}
        </div>

        <div class="panel-actions">
          <button class="primary-button" type="button" data-action="start-practice" data-practice="${practice.id}">Start ${escapeHtml(practice.title)}</button>
          <button class="ghost-button" type="button" data-action="journal-gate" data-gate="${gate.id}">Journal Gate</button>
        </div>
      </section>

      <aside class="gate-detail-side">
        <article class="focus-card practice-focus">
          <p class="micro-label">Start here</p>
          <h3>${escapeHtml(practice.title)}</h3>
          <p>${escapeHtml(practice.action)}</p>
        </article>

        ${renderDisclosure("Shadow and lens", `
          <div class="disclosure-stack">
            <div>
              <p class="micro-label">Shadow signal</p>
              <h3>${escapeHtml(gate.shadow)}</h3>
              <p>Use this as a signal for practice, not as a verdict.</p>
            </div>
            <div>
              <p class="micro-label">Compass lens</p>
              <h3>${escapeHtml(depth.name)}</h3>
              <p>${escapeHtml(depth.mode)}</p>
              <p>${escapeHtml(gate.mapping.reason)}</p>
            </div>
          </div>
        `)}

        ${renderDisclosure("Saved progress", `
          <div class="stat-strip stacked">
            <span><strong>${entries.length}</strong>${entries.length === 1 ? "saved memory" : "saved memories"}</span>
            <span><strong>${completed.length}</strong>${completed.length === 1 ? "practice complete" : "practices complete"}</span>
            <span><strong>${escapeHtml(step.name)}</strong>active movement</span>
          </div>
        `)}
      </aside>

      <section class="gate-practice-suite">
        <div class="section-heading">
          <div>
            <p class="micro-label">Three concrete actions</p>
            <h2>Practice This Gate</h2>
          </div>
          <button class="ghost-button" type="button" data-action="view-practices">Practice Bank</button>
        </div>
        <div class="gate-practice-grid">
          ${gate.practices.map((item) => renderPracticeCard(item)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderPractices() {
  const term = state.practiceSearch.trim().toLowerCase();
  const status = state.filters.practice;
  const practicesList = ALL_PRACTICES.filter((practice) => {
    const gate = getGate(practice.gateId);
    const haystack = `${gate.title} ${practice.title} ${practice.type} ${practice.action} ${practice.prompt}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    const done = Boolean(completionForPractice(practice.id));
    const matchesStatus = status === "all" || (status === "done" && done) || (status === "open" && !done);
    return matchesTerm && matchesStatus;
  });
  const selected = getPractice(state.selectedPracticeId);
  const featured = practicesList.find((practice) => practice.id === selected?.id) || practicesList[0] || null;
  const visiblePractices = featured
    ? [featured, ...practicesList.filter((practice) => practice.id !== featured.id)].slice(0, 18)
    : [];

  return `
    <section class="library-head">
      <div>
        <p class="micro-label">Practice instrument</p>
        <h2>Practice Bank</h2>
        <p>Choose one concrete action. Keep the rest available without letting the whole archive crowd the moment.</p>
      </div>
      <div class="practice-library-tools">
        ${renderVoiceButton(VOICE_GUIDES.practice)}
        <div class="filter-row">
          <input class="search-input" type="search" placeholder="Search practices" value="${escapeAttr(state.practiceSearch)}" data-action="search-practices">
          <select data-action="filter-practice">
            ${option("all", "All", status)}
            ${option("open", "Unfinished", status)}
            ${option("done", "Done", status)}
          </select>
        </div>
      </div>
    </section>

    ${featured ? `
      <div class="practice-bank-shell">
        ${renderPracticeSpotlight(featured, practicesList.length)}
        <section class="practice-list-panel">
          <div class="practice-list-head">
            <div>
              <p class="micro-label">Available practices</p>
              <h3>${practicesList.length} ${practicesList.length === 1 ? "match" : "matches"}</h3>
            </div>
            <span>${visiblePractices.length === practicesList.length ? "All shown" : `Showing ${visiblePractices.length}`}</span>
          </div>
          <div class="practice-list">
            ${visiblePractices.map((practice) => renderPracticeRow(practice, featured.id)).join("")}
          </div>
        </section>
      </div>
    ` : `
      <section class="empty-state">
        <p class="micro-label">No practices found</p>
        <h2>No matching practice.</h2>
        <p>Clear the search or change the filter to return to the full bank.</p>
      </section>
    `}
  `;
}

function renderPracticeSession() {
  const gate = currentGate();
  const practice = currentPractice(gate);
  const step = getStep(gate.mapping.step);
  const done = completionForPractice(practice.id);
  const sessionSteps = [
    {
      name: "Seed",
      label: "Name the signal",
      body: gate.question,
      action: "Write one sentence about what is actually asking for attention."
    },
    {
      name: "Motion",
      label: "Do the practice",
      body: practice.action,
      action: "Complete the action once, at the smallest honest scale."
    },
    {
      name: "Mirror",
      label: "Notice the reflection",
      body: practice.prompt,
      action: "Record what changed in body, emotion, thought, or relationship."
    },
    {
      name: "Return",
      label: "Carry one line forward",
      body: "Let the experience become a usable memory.",
      action: "Save a journal entry, mark the practice complete, or choose the next gate."
    }
  ];

  return `
    <div class="practice-session-layout">
      <section class="practice-session-hero">
        <div class="detail-action-row">
          <button class="ghost-button" type="button" data-action="back-to-gate">Back to Gate</button>
          <button class="ghost-button" type="button" data-action="view-practices">Practice Bank</button>
        </div>
        <p class="micro-label">Gate ${String(gate.id).padStart(2, "0")} · ${escapeHtml(gate.title)}</p>
        <h2>${escapeHtml(practice.title)}</h2>
        <p class="session-action-line">${escapeHtml(practice.action)}</p>
        <div class="gate-tags detail-tags">
          <span>${escapeHtml(practice.duration)}</span>
          <span>${escapeHtml(practice.type)}</span>
          <span>${escapeHtml(step.name)}</span>
        </div>
        ${renderVoicePanel([VOICE_GUIDES.practice, gateVoice(gate)], "Voice guide")}

        ${renderDisclosure("Reflection prompt", `<blockquote>${escapeHtml(practice.prompt)}</blockquote>`, "prompt-disclosure")}

        <div class="panel-actions">
          <button class="primary-button" type="button" data-action="journal-practice" data-practice="${practice.id}">Journal This Practice</button>
          <button class="ghost-button" type="button" data-action="toggle-practice" data-practice="${practice.id}">${done ? "Mark Open" : "Mark Done"}</button>
        </div>
      </section>

      <section class="session-steps-panel">
        <p class="micro-label">Guided session</p>
        <h2>Seed → Motion → Mirror → Return</h2>
        <div class="session-step-grid">
          ${sessionSteps.map((item, index) => {
            const active = item.name === step.name;
            return `
              <article class="session-step-card ${active ? "active" : "is-compact"}">
                <span class="step-index">${index + 1}</span>
                <h3>${escapeHtml(item.name)}</h3>
                <strong>${escapeHtml(item.label)}</strong>
                ${active ? `
                  <p>${escapeHtml(item.body)}</p>
                  <small>${escapeHtml(item.action)}</small>
                ` : ""}
                ${renderVoiceButton(STEP_VOICE[item.name], { compact: true })}
              </article>
            `;
          }).join("")}
        </div>
      </section>

      <aside class="session-side-panel">
        <article class="focus-card practice-focus">
          <p class="micro-label">${done ? "Completed" : "Current status"}</p>
          <h3>${done ? "Complete." : "Ready."}</h3>
          <p>${done ? `Completed ${formatDate(done.completedAt)}.` : "Move through one step at a time."}</p>
        </article>
        ${done ? renderVoicePanel([VOICE_GUIDES.completion], "Completion audio") : ""}
        ${renderDisclosure("Gate context", `
          <div class="disclosure-stack">
            <div>
              <p class="micro-label">Gate question</p>
              <h3>${escapeHtml(gate.question)}</h3>
            </div>
            <p>${escapeHtml(gate.essence)}</p>
          </div>
        `)}
        <div class="panel-actions vertical">
          <button class="primary-button full" type="button" data-action="open-gate" data-gate="${gate.id}">View Gate Detail</button>
          <button class="ghost-button full" type="button" data-action="open-wheel">Open Wheel</button>
        </div>
      </aside>
    </div>
  `;
}

function renderJournal() {
  const editing = state.editingId ? state.journal.find((entry) => entry.id === state.editingId) : null;
  const gateId = Number(editing?.gateId || state.draft.gateId || state.selectedGateId || dailyCompass().gate.id);
  const gate = getGate(gateId);
  const practice = getPractice(editing?.practiceId || state.draft.practiceId || state.selectedPracticeId) || gate.practices[0];
  const values = {
    title: editing?.title || state.draft.title || `${gate.title} · ${practice.title}`,
    type: editing?.type || state.draft.type || "practice",
    gateId,
    practiceId: practice.id,
    before: editing?.before ?? state.draft.before ?? 50,
    after: editing?.after ?? state.draft.after ?? 50,
    tags: editing?.tags?.join(", ") || state.draft.tags || gate.themes.slice(0, 2).join(", "),
    body: editing?.body || state.draft.body || ""
  };
  const entries = filteredEntries();

  return `
    <div class="journal-layout">
      <section class="journal-composer">
        <p class="micro-label">${editing ? "Editing memory" : "Memory field"}</p>
        <h2>${editing ? "Edit entry" : "Journal practice"}</h2>
        ${renderVoicePanel([VOICE_GUIDES.journal], "Voice guide")}
        <form id="journal-form">
          <input type="hidden" name="id" value="${escapeAttr(editing?.id || "")}">
          <div class="form-grid">
            <label>Gate
              <select name="gateId" data-action="compose-gate">
                ${GATES.map((item) => option(String(item.id), `Gate ${item.id} · ${item.title}`, String(values.gateId))).join("")}
              </select>
            </label>
            <label>Practice
              <select name="practiceId" data-action="compose-draft">
                ${gate.practices.map((item) => option(item.id, item.title, values.practiceId)).join("")}
              </select>
            </label>
          </div>
          <label>Title
            <input name="title" value="${escapeAttr(values.title)}" data-action="compose-draft">
          </label>
          <label>Entry
            <textarea name="body" data-action="compose-draft" placeholder="${escapeAttr(practice.prompt)}">${escapeHtml(values.body)}</textarea>
          </label>
          <div class="prompt-row journal-prompt">
            <div><strong>Practice</strong><p>${escapeHtml(practice.action)}</p></div>
            <div><strong>Prompt</strong><p>${escapeHtml(practice.prompt)}</p></div>
          </div>
          <div class="form-grid">
            <label>Type
              <select name="type" data-action="compose-draft">
                ${["practice", "dream", "synchronicity", "insight", "shadow", "repair"].map((item) => option(item, capitalize(item), values.type)).join("")}
              </select>
            </label>
            <label>Tags
              <input name="tags" value="${escapeAttr(values.tags)}" data-action="compose-draft">
            </label>
          </div>
          <div class="form-grid">
            <label>Before state
              <input name="before" type="range" min="0" max="100" value="${values.before}" data-action="compose-draft">
            </label>
            <label>After state
              <input name="after" type="range" min="0" max="100" value="${values.after}" data-action="compose-draft">
            </label>
          </div>
          <div class="panel-actions">
            <button class="primary-button" type="submit" data-action="save-journal">${editing ? "Save Changes" : "Save Memory"}</button>
            ${editing ? `<button class="ghost-button" type="button" data-action="cancel-edit">Cancel</button>` : `<button class="ghost-button" type="button" data-action="clear-draft">Clear Draft</button>`}
          </div>
        </form>
      </section>

      <section class="journal-timeline">
        <div class="timeline-head">
          <div>
            <p class="micro-label">Linked memory</p>
            <h2>${state.journal.length} saved ${state.journal.length === 1 ? "entry" : "entries"}</h2>
          </div>
          <div class="filter-row">
            <select data-action="filter-type">
              ${option("all", "All types", state.filters.type)}
              ${["practice", "dream", "synchronicity", "insight", "shadow", "repair"].map((item) => option(item, capitalize(item), state.filters.type)).join("")}
            </select>
            <select data-action="filter-gate">
              ${option("all", "All gates", state.filters.gate)}
              ${GATES.map((item) => option(String(item.id), `Gate ${item.id}`, state.filters.gate)).join("")}
            </select>
          </div>
        </div>
        ${renderPatternSummary()}
        ${entries.length ? entries.map(renderEntryCard).join("") : renderEmptyState("No memories match this filter.", "Journal a gate or clear the filters to repopulate the field.")}
      </section>
    </div>
  `;
}

function renderMethod() {
  return `
    <div class="codex-stack">
      <article class="codex-article">
        <p class="micro-label">Compass method</p>
        <h3>Seed → Motion → Mirror → Return</h3>
        <p>The app does not ask the user to interpret notation. It quietly guides each Gate through a four-part reflective rhythm: name the signal, act once, notice what is reflected, and carry the learning forward.</p>
        ${renderRhythmLadder(currentGate().mapping.step)}
      </article>

      <article class="codex-article">
        <p class="micro-label">Four movements</p>
        <h3>How guidance is shaped</h3>
        ${renderDisclosure("Show movements", `<div class="mini-matrix">
          ${RHYTHM_STEPS.map((step) => `<span><strong>${escapeHtml(step.name)}</strong>${escapeHtml(step.prompt)} ${escapeHtml(step.experience)}</span>`).join("")}
        </div>`)}
      </article>

      <article class="codex-article">
        <p class="micro-label">Seven lenses</p>
        <h3>How a Gate is colored</h3>
        ${renderDisclosure("Show lenses", `<div class="mini-matrix">
          ${CORRIDORS.map((corridor) => `<span><strong>${escapeHtml(corridor.name)}</strong>${escapeHtml(corridor.meaning)}</span>`).join("")}
        </div>`)}
      </article>

      <article class="codex-article">
        <p class="micro-label">Five pattern layers</p>
        <h3>How a Gate is grounded</h3>
        ${renderDisclosure("Show layers", `<div class="mini-matrix">
          ${DEPTHS.map((depth) => `<span><strong>${escapeHtml(depth.name)}</strong>${escapeHtml(depth.primitive)} · ${escapeHtml(depth.mode)}</span>`).join("")}
        </div>`)}
      </article>
    </div>

    <section class="data-table-card mapping-card">
      <div class="library-head inset">
        <div>
          <p class="micro-label">Curated pattern map</p>
          <h2>Gate method</h2>
          <p>Mappings are intentionally curated for practice coherence. They decide which movement, lens, and layer shape the user's prompts.</p>
        </div>
      </div>
      ${renderDisclosure("Show full mapping table", `<div class="data-table mapping-table">
        <div class="table-head"><strong>Gate</strong><strong>Lens</strong><strong>Layer</strong><strong>Rhythm</strong><strong>Reason</strong></div>
        ${GATES.map((gate) => `
          <div>
            <strong>${gate.id}. ${escapeHtml(gate.title)}</strong>
            <span>${escapeHtml(getCorridor(gate.mapping.corridor).name)}</span>
            <span>${escapeHtml(getDepth(gate.mapping.depth).name)}</span>
            <span>${escapeHtml(getStep(gate.mapping.step).name)}</span>
            <span>${escapeHtml(gate.mapping.reason)}</span>
          </div>
        `).join("")}
      </div>`)}
    </section>
  `;
}

function renderGuide() {
  const gate = currentGate();
  const practice = currentPractice(gate);
  const output = state.guideOutput || generateGuideResponse();

  return `
    <div class="guide-stack">
      <section class="guide-intro-panel">
        <div>
          <p class="micro-label">Introduction guidance</p>
          <h2>How to use Harmonic Compass.</h2>
          <p>This introduction credits Robert Edward Grant's 24 precepts as the inspiration for the app, then explains how to move through the private practice flow.</p>
        </div>
        ${renderVoicePanel([VOICE_GUIDES.welcome], "Introduction audio")}
        ${renderDisclosure("Read transcript", renderTranscript(APP_INTRO_TRANSCRIPT), "transcript-disclosure")}
      </section>

      <div class="guide-layout">
        <section class="journal-composer">
          <p class="micro-label">Local compass guide</p>
          <h2>Ask the instrument.</h2>
          <form id="guide-form">
            <label>Mode
              <select name="mode" data-action="guide-mode">
                ${option("reflect", "Reflect", state.guideMode)}
                ${option("integrate", "Integrate", state.guideMode)}
                ${option("practice", "Choose practice", state.guideMode)}
                ${option("rhythm", "Rhythm", state.guideMode)}
                ${option("remember", "Remember", state.guideMode)}
              </select>
            </label>
            <label>Question or situation
              <textarea name="guideInput" data-action="guide-input" placeholder="Write what you want to bring to Gate ${gate.id}.">${escapeHtml(state.guideInput)}</textarea>
            </label>
            <div class="panel-actions">
              <button class="primary-button" type="submit" data-action="generate-guide">Generate Guidance</button>
              <button class="ghost-button" type="button" data-action="clear-guide">Clear</button>
            </div>
          </form>
          <p class="privacy-note">This guide is local/static. It does not call a remote AI service, analytics endpoint, or cloud journal.</p>
        </section>

        <section class="journal-timeline guide-output">
          <p class="micro-label">Response for Gate ${gate.id}</p>
          <h2>${escapeHtml(gate.title)}</h2>
          ${output}
          <div class="focus-card practice-focus">
            <p class="micro-label">Next embodied action</p>
            <h3>${escapeHtml(practice.title)}</h3>
            <p>${escapeHtml(practice.action)}</p>
            <code>${escapeHtml(practice.prompt)}</code>
          </div>
          <div class="panel-actions">
            <button class="primary-button" type="button" data-action="journal-practice" data-practice="${practice.id}">Journal This</button>
            <button class="ghost-button" type="button" data-action="toggle-practice" data-practice="${practice.id}">${completionForPractice(practice.id) ? "Mark Open" : "Mark Done"}</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderExport() {
  return `
    <div class="export-layout">
      <section class="export-card">
        <p class="micro-label">Private archive</p>
        <h2>Export</h2>
        <p>Journal entries, practice completions, and settings live in this browser's local storage unless you export them.</p>
        <div class="panel-actions vertical">
          <button class="primary-button full" type="button" data-action="export-json">Download JSON</button>
          <button class="ghost-button full" type="button" data-action="export-markdown">Download Markdown</button>
        </div>
      </section>

      <section class="export-card">
        <p class="micro-label">Restore</p>
        <h2>Import</h2>
        <p>Import replaces the current local archive after confirmation. A local backup is saved first when possible.</p>
        <label class="file-button">
          <span class="ghost-button full">Choose JSON Archive</span>
          <input type="file" accept="application/json,.json" data-action="import-json">
        </label>
        <div class="date-setting">
          <label>Cycle start date
            <input type="date" value="${escapeAttr(state.settings.startDate)}" data-action="start-date">
          </label>
        </div>
      </section>

      <section class="export-card">
        <p class="micro-label">Credit and privacy</p>
        <h2>About</h2>
        <p>${escapeHtml(ATTRIBUTION)}</p>
        <p>This private build uses original Compass Gate language and curated practice guidance. It is not affiliated with, endorsed by, or copied from any public site.</p>
        <div class="stat-strip stacked">
          <span><strong>${state.journal.length}</strong> local memories</span>
          <span><strong>${state.completions.length}</strong> completed practices</span>
          <span><strong>0</strong> network journal calls</span>
        </div>
        <div class="panel-actions vertical">
          <button class="danger-button full" type="button" data-action="clear-completions">Clear Practice Marks</button>
          <button class="danger-button full" type="button" data-action="clear-all-data">Clear All Local Data</button>
        </div>
      </section>
    </div>
  `;
}

function renderPracticeCard(practice) {
  const gate = getGate(practice.gateId);
  const done = completionForPractice(practice.id);
  return `
    <article class="practice-card ${done ? "completed" : ""}">
      <div class="card-top">
        <span>Gate ${gate.id} · ${escapeHtml(gate.title)}</span>
        <span>${done ? "Done" : escapeHtml(practice.duration)}</span>
      </div>
      <h3>${escapeHtml(practice.title)}</h3>
      <p>${escapeHtml(practice.action)}</p>
      <div class="theme-row">
        <span>${escapeHtml(practice.type)}</span>
        <span>${escapeHtml(getStep(gate.mapping.step).name)}</span>
      </div>
      ${renderDisclosure("Prompt", `<code>${escapeHtml(practice.prompt)}</code>`, "card-disclosure")}
      <div class="card-actions">
        <button class="ghost-button" type="button" data-action="start-practice" data-practice="${practice.id}">Start</button>
        <button class="primary-button small" type="button" data-action="journal-practice" data-practice="${practice.id}">Journal</button>
        <button class="ghost-button" type="button" data-action="toggle-practice" data-practice="${practice.id}">${done ? "Mark Open" : "Mark Done"}</button>
      </div>
    </article>
  `;
}

function renderPracticeSpotlight(practice, total) {
  const gate = getGate(practice.gateId);
  const step = getStep(gate.mapping.step);
  const done = completionForPractice(practice.id);
  return `
    <article class="practice-spotlight ${done ? "completed" : ""}">
      <div class="spotlight-meta">
        <span>Gate ${String(gate.id).padStart(2, "0")} · ${escapeHtml(gate.title)}</span>
        <span>${escapeHtml(practice.duration)}</span>
      </div>
      <p class="micro-label">${total} practices in this view</p>
      <h3>${escapeHtml(practice.title)}</h3>
      <p>${escapeHtml(practice.action)}</p>
      <div class="theme-row">
        <span>${escapeHtml(practice.type)}</span>
        <span>${escapeHtml(step.name)}</span>
      </div>
      ${renderDisclosure("Prompt", `<code>${escapeHtml(practice.prompt)}</code>`, "card-disclosure")}
      <div class="panel-actions">
        <button class="primary-button" type="button" data-action="start-practice" data-practice="${practice.id}">Start Practice</button>
        <button class="ghost-button" type="button" data-action="journal-practice" data-practice="${practice.id}">Journal</button>
        <button class="ghost-button" type="button" data-action="toggle-practice" data-practice="${practice.id}">${done ? "Mark Open" : "Mark Done"}</button>
      </div>
    </article>
  `;
}

function renderPracticeRow(practice, selectedId) {
  const gate = getGate(practice.gateId);
  const done = completionForPractice(practice.id);
  return `
    <button class="practice-row ${practice.id === selectedId ? "selected" : ""} ${done ? "completed" : ""}" type="button" data-action="choose-practice" data-practice="${practice.id}">
      <span>
        <small>Gate ${gate.id} · ${escapeHtml(gate.title)}</small>
        <strong>${escapeHtml(practice.title)}</strong>
      </span>
      <span>
        <small>${escapeHtml(practice.type)}</small>
        <em>${done ? "Done" : escapeHtml(practice.duration)}</em>
      </span>
    </button>
  `;
}

function renderTranscript(lines) {
  return `
    <div class="transcript-copy">
      ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function renderDisclosure(label, content, className = "") {
  return `
    <details class="soft-disclosure ${escapeAttr(className)}">
      <summary>${escapeHtml(label)}</summary>
      <div class="disclosure-body">${content}</div>
    </details>
  `;
}

function renderVoicePanel(guides, heading = "Voice guide") {
  const items = guides.filter(Boolean);
  if (!items.length) return "";
  return `
    <div class="voice-guide-panel">
      <div class="voice-guide-copy">
        <span class="voice-pulse" aria-hidden="true"></span>
        <div>
          <p class="micro-label">${escapeHtml(heading)}</p>
          <h3>Listen before moving.</h3>
        </div>
      </div>
      <div class="voice-actions">
        ${items.map((guide) => renderVoiceButton(guide)).join("")}
      </div>
    </div>
  `;
}

function renderVoiceButton(guide, options = {}) {
  if (!guide?.file) return "";
  const label = guide.label || "Guide";
  const visible = options.compact ? guide.short || label : `Listen · ${label}`;
  return `
    <button class="voice-button ${options.compact ? "compact" : ""}" type="button"
      data-action="play-voice"
      data-audio="${escapeAttr(voiceSrc(guide.file))}"
      data-label="${escapeAttr(label)}"
      aria-label="Play ${escapeAttr(label)}">
      <span class="voice-icon" aria-hidden="true"></span>
      <span>${escapeHtml(visible)}</span>
    </button>
  `;
}

function renderRhythmLadder(activeStepId) {
  return `
    <div class="rhythm-ladder">
      ${RHYTHM_STEPS.map((step, index) => `
        <div class="rhythm-step ${step.id === activeStepId ? "active" : ""}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(step.name)}</strong>
          <small>${escapeHtml(capitalize(step.verb))}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function renderWheel({ compact }) {
  const daily = dailyCompass().gate;
  const selected = currentGate();
  const radiusOuter = compact ? 300 : 330;
  const radiusInner = compact ? 205 : 224;
  const cx = 360;
  const cy = 360;
  const segmentAngle = 360 / GATES.length;

  const segments = GATES.map((gate, index) => {
    const start = -90 + index * segmentAngle + 1.2;
    const end = -90 + (index + 1) * segmentAngle - 1.2;
    const mid = (start + end) / 2;
    const textPoint = polar(cx, cy, (radiusInner + radiusOuter) / 2, mid);
    const entries = journalForGate(gate.id).length;
    const completed = completionsForGate(gate.id).length;
    const overlayClass = state.wheelMode === "journal" && entries ? "has-journal" :
      state.wheelMode === "practice" && completed ? "has-practice" :
      state.wheelMode === "pattern" ? `depth-${gate.mapping.depth}` : "";
    return `
      <g class="wheel-segment ${gate.id === selected.id ? "selected" : ""} ${gate.id === daily.id ? "today" : ""} ${overlayClass}"
         data-action="select-gate" data-gate="${gate.id}" tabindex="0" role="button" aria-label="Gate ${gate.id}, ${escapeAttr(gate.title)}">
        <path d="${ringSegment(cx, cy, radiusInner, radiusOuter, start, end)}"></path>
        <text x="${textPoint.x}" y="${textPoint.y}" text-anchor="middle" dominant-baseline="middle">${gate.id}</text>
      </g>
    `;
  }).join("");

  const marks = CORRIDORS.map((corridor, index) => {
    const angle = -90 + index * (360 / CORRIDORS.length);
    const inner = polar(cx, cy, compact ? 160 : 174, angle);
    const outer = polar(cx, cy, compact ? 186 : 204, angle);
    const label = polar(cx, cy, compact ? 144 : 154, angle + 3);
    return `
      <line class="corridor-mark" x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}"></line>
      <text class="corridor-label" x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle">${index + 1}</text>
    `;
  }).join("");

  return `
    <svg class="harmonic-wheel ${compact ? "compact" : ""}" viewBox="0 0 720 720" role="img" aria-label="Harmonic Compass wheel with 24 original gates">
      <circle class="wheel-grid" cx="${cx}" cy="${cy}" r="304"></circle>
      <circle class="wheel-grid inner" cx="${cx}" cy="${cy}" r="234"></circle>
      <circle class="gold-ring" cx="${cx}" cy="${cy}" r="168"></circle>
      <ellipse class="orbit orbit-one" cx="${cx}" cy="${cy}" rx="260" ry="76" transform="rotate(-22 ${cx} ${cy})"></ellipse>
      <ellipse class="orbit orbit-two" cx="${cx}" cy="${cy}" rx="260" ry="76" transform="rotate(44 ${cx} ${cy})"></ellipse>
      <g>${segments}</g>
      <g>${marks}</g>
      <g class="center-seal">
        <circle cx="${cx}" cy="${cy}" r="92"></circle>
        <text class="center-label" x="${cx}" y="${cy - 42}" text-anchor="middle">ACTIVE GATE</text>
        <text class="center-number" x="${cx}" y="${cy + 6}" text-anchor="middle">${String(selected.id).padStart(2, "0")}</text>
        <text class="center-title" x="${cx}" y="${cy + 36}" text-anchor="middle">${escapeHtml(selected.title)}</text>
        <text class="center-subtitle" x="${cx}" y="${cy + 58}" text-anchor="middle">${escapeHtml(selected.themes.slice(0, 3).join(" · "))}</text>
      </g>
    </svg>
  `;
}

function renderPatternSummary() {
  const topGate = mostFrequent(state.journal.map((entry) => Number(entry.gateId)).filter(Boolean));
  const topTags = topItems(state.journal.flatMap((entry) => entry.tags || []), 4);
  const tagText = topTags.map(escapeHtml).join(", ");
  return `
    <div class="pattern-panel">
      <span><strong>${topGate ? `Gate ${topGate}` : "No dominant gate"}</strong>${topGate ? escapeHtml(getGate(topGate).title) : "Begin journaling to reveal a pattern."}</span>
      <span><strong>${topTags.length ? tagText : "No recurring tags"}</strong>${topTags.length ? "Recurring language in the memory field." : "Tags will summarize your themes."}</span>
      <span><strong>${state.completions.length} completions</strong>Practice marks across the compass.</span>
    </div>
  `;
}

function renderEntryCard(entry) {
  const gate = getGate(entry.gateId);
  const practice = getPractice(entry.practiceId);
  return `
    <article class="entry-card">
      <div class="entry-head">
        <div>
          <h3>${escapeHtml(entry.title || "Untitled memory")}</h3>
          <div class="entry-meta">
            <span>Gate ${gate.id} · ${escapeHtml(gate.title)}</span>
            ${practice ? `<span>${escapeHtml(practice.title)}</span>` : ""}
            <span>${escapeHtml(entry.type || "entry")}</span>
          </div>
        </div>
        <time>${formatDate(entry.createdAt)}</time>
      </div>
      <p>${escapeHtml(entry.body)}</p>
      <blockquote>${escapeHtml(gate.question)}</blockquote>
      <div class="entry-meta">
        <span>state ${entry.before ?? 0} → ${entry.after ?? 0}</span>
        ${(entry.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="ghost-button" type="button" data-action="edit-entry" data-entry="${entry.id}">Edit</button>
        <button class="danger-button" type="button" data-action="delete-entry" data-entry="${entry.id}">Delete</button>
      </div>
    </article>
  `;
}

function renderEmptyState(titleText, bodyText) {
  return `
    <div class="empty-state">
      <h3>${escapeHtml(titleText)}</h3>
      <p>${escapeHtml(bodyText)}</p>
      <button class="primary-button" type="button" data-action="new-entry">New Entry</button>
    </div>
  `;
}

function filteredEntries() {
  return state.journal.filter((entry) => {
    const typeOk = state.filters.type === "all" || entry.type === state.filters.type;
    const gateOk = state.filters.gate === "all" || Number(entry.gateId) === Number(state.filters.gate);
    return typeOk && gateOk;
  });
}

function generateGuideResponse() {
  const gate = currentGate();
  const practice = currentPractice(gate);
  const step = getStep(gate.mapping.step);
  const recent = state.journal.slice(0, 3);
  const userLine = state.guideInput.trim() ? `<p><strong>Your signal:</strong> ${escapeHtml(state.guideInput.trim())}</p>` : "";

  if (state.guideMode === "rhythm") {
    return `
      ${userLine}
      <p>The active Gate is currently shaped by <strong>${escapeHtml(step.name)}</strong>. Use that movement as the next clean instruction.</p>
      <p>${escapeHtml(step.prompt)}</p>
    `;
  }

  if (state.guideMode === "remember") {
    return `
      ${userLine}
      <p>Your memory field currently holds ${state.journal.length} ${state.journal.length === 1 ? "entry" : "entries"} and ${state.completions.length} completed practice ${state.completions.length === 1 ? "mark" : "marks"}.</p>
      <p>${recent.length ? `Recent signals: ${recent.map((entry) => escapeHtml(entry.title || getGate(entry.gateId).title)).join(", ")}.` : "The field is open. Save one memory to begin seeing recurrence."}</p>
      <p>Return to Gate ${gate.id}: ${escapeHtml(gate.question)}</p>
    `;
  }

  if (state.guideMode === "practice") {
    return `
      ${userLine}
      <p>Choose the body of the work, not just the idea. The cleanest next practice is <strong>${escapeHtml(practice.title)}</strong>: ${escapeHtml(practice.action)}</p>
      <p>Complete it once, then journal what actually happened rather than what should have happened.</p>
    `;
  }

  if (state.guideMode === "integrate") {
    return `
      ${userLine}
      <p>Integration means the shadow pattern gets a job instead of an exile. For Gate ${gate.id}, watch for: ${escapeHtml(gate.shadow)}</p>
      <p>Move it through the rhythm: ${escapeHtml(step.name)} asks you to ${escapeHtml(step.verb)}. Then save one memory so the learning has somewhere to land.</p>
    `;
  }

  return `
    ${userLine}
    <p>Gate ${gate.id}, <strong>${escapeHtml(gate.title)}</strong>, points to this: ${escapeHtml(gate.essence)}</p>
    <p>The reflection question is: ${escapeHtml(gate.question)}</p>
    <p>The pattern map is ${escapeHtml(getCorridor(gate.mapping.corridor).name)} · ${escapeHtml(getDepth(gate.mapping.depth).name)} · ${escapeHtml(step.name)}. ${escapeHtml(gate.mapping.reason)}</p>
  `;
}

function archivePayload() {
  return {
    app: "Harmonic Compass",
    version: 2,
    attribution: ATTRIBUTION,
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    journal: state.journal,
    completions: state.completions
  };
}

function exportJson() {
  downloadFile("harmonic-compass-archive.json", JSON.stringify(archivePayload(), null, 2), "application/json");
}

function exportMarkdown() {
  const lines = [
    "# Harmonic Compass Archive",
    "",
    ATTRIBUTION,
    "",
    "This archive contains original Compass Gate journal entries and practice marks from local browser storage.",
    "",
    `Exported: ${new Date().toLocaleString()}`,
    "",
    "## Practice Completions",
    "",
    ...state.completions.map((item) => {
      const practice = getPractice(item.practiceId);
      const gate = getGate(item.gateId);
      return `- ${formatDate(item.completedAt)} · Gate ${gate.id} ${gate.title} · ${practice?.title || item.practiceId}`;
    }),
    "",
    "## Journal",
    ""
  ];

  state.journal.forEach((entry) => {
    const gate = getGate(entry.gateId);
    const practice = getPractice(entry.practiceId);
    lines.push(`### ${entry.title || "Untitled memory"}`);
    lines.push(`- Date: ${formatDate(entry.createdAt)}`);
    lines.push(`- Gate: ${gate.id} · ${gate.title}`);
    if (practice) lines.push(`- Practice: ${practice.title}`);
    lines.push(`- Type: ${entry.type}`);
    lines.push(`- State: ${entry.before ?? 0} -> ${entry.after ?? 0}`);
    if (entry.tags?.length) lines.push(`- Tags: ${entry.tags.join(", ")}`);
    lines.push("");
    lines.push(entry.body || "");
    lines.push("");
  });

  downloadFile("harmonic-compass-archive.md", lines.join("\n"), "text/markdown");
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      const journal = Array.isArray(payload) ? payload : payload.journal || [];
      const completions = Array.isArray(payload.completions) ? payload.completions : [];
      const settings = payload.settings && typeof payload.settings === "object" ? payload.settings : state.settings;
      if (!Array.isArray(journal)) throw new Error("No journal array found");
      const valid = journal.every((entry) => entry && entry.id && entry.createdAt && entry.body !== undefined);
      if (!valid) throw new Error("Archive contains invalid entries");

      if (state.journal.length || state.completions.length) {
        const confirmed = window.confirm("Importing this archive replaces the current local Harmonic Compass data. A local backup will be attempted first. Continue?");
        if (!confirmed) {
          toast("Import cancelled.");
          return;
        }
        safeSetItem(BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), payload: archivePayload() }));
      }

      persistJournal(journal);
      persistCompletions(completions);
      saveSettings(settings);
      state.journal = journal;
      state.completions = completions;
      state.settings = { ...state.settings, ...settings };
      toast("Archive imported.");
      setView("journal");
    } catch (error) {
      toast(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
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

function markPractice(practiceId) {
  const practice = getPractice(practiceId);
  if (!practice) return;
  const existing = completionForPractice(practice.id);
  const next = existing
    ? state.completions.filter((item) => item.practiceId !== practice.id)
    : [{ id: createId(), practiceId: practice.id, gateId: practice.gateId, completedAt: new Date().toISOString() }, ...state.completions];
  if (persistCompletions(next)) {
    state.completions = next;
    toast(existing ? "Practice reopened." : "Practice marked complete.");
    render();
  }
}

function preparePracticeJournal(practiceId) {
  const practice = getPractice(practiceId);
  if (!practice) return;
  const gate = getGate(practice.gateId);
  state.selectedGateId = gate.id;
  state.selectedPracticeId = practice.id;
  state.editingId = null;
  saveDraft({
    gateId: gate.id,
    practiceId: practice.id,
    type: "practice",
    title: `${gate.title} · ${practice.title}`,
    tags: `${practice.type.toLowerCase()}, ${gate.themes.slice(0, 2).join(", ")}`,
    body: `Practice: ${practice.action}\n\nPrompt: ${practice.prompt}\n\nWhat happened:\n`
  });
  setView("journal");
}

function saveJournalFromForm(form) {
  const data = new FormData(form);
  const id = String(data.get("id") || "").trim();
  const gateId = Number(data.get("gateId")) || dailyCompass().gate.id;
  const practiceId = String(data.get("practiceId") || "");
  const entry = {
    id: id || createId(),
    createdAt: id ? state.journal.find((item) => item.id === id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gateId,
    practiceId,
    type: String(data.get("type") || "practice"),
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

  const nextJournal = id
    ? state.journal.map((item) => item.id === id ? entry : item)
    : [entry, ...state.journal];

  if (persistJournal(nextJournal)) {
    state.journal = nextJournal;
    state.editingId = null;
    state.selectedGateId = gateId;
    state.selectedPracticeId = practiceId || getGate(gateId).practices[0].id;
    clearDraft();
    toast("Memory saved.");
    render();
  }
}

function updateDraftFromForm(form) {
  if (state.editingId) return;
  const data = new FormData(form);
  saveDraft({
    gateId: Number(data.get("gateId")) || state.selectedGateId,
    practiceId: String(data.get("practiceId") || ""),
    type: String(data.get("type") || "practice"),
    title: String(data.get("title") || ""),
    body: String(data.get("body") || ""),
    before: Number(data.get("before")) || 0,
    after: Number(data.get("after")) || 0,
    tags: String(data.get("tags") || "")
  });
}

let voiceAudio = null;
let activeVoiceUrl = "";

function clearVoiceButtons() {
  document.querySelectorAll(".voice-button.playing").forEach((button) => button.classList.remove("playing"));
}

function playVoice(audioPath, label, button) {
  if (!audioPath) return;
  const nextUrl = new URL(audioPath, window.location.href).href;
  if (!voiceAudio) {
    voiceAudio = new Audio();
    voiceAudio.preload = "none";
    voiceAudio.addEventListener("ended", () => {
      activeVoiceUrl = "";
      clearVoiceButtons();
    });
  }

  if (activeVoiceUrl === nextUrl && !voiceAudio.paused) {
    voiceAudio.pause();
    activeVoiceUrl = "";
    clearVoiceButtons();
    toast(`${label || "Audio"} paused.`);
    return;
  }

  clearVoiceButtons();
  activeVoiceUrl = nextUrl;
  voiceAudio.src = nextUrl;
  voiceAudio.currentTime = 0;
  button?.classList.add("playing");

  voiceAudio.play()
    .then(() => toast(`Playing ${label || "audio guide"}.`))
    .catch(() => {
      activeVoiceUrl = "";
      clearVoiceButtons();
      toast("Audio could not start. Tap again or check browser audio permissions.");
    });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-view], [data-action]");
  if (!target) return;

  if (target.dataset.view) {
    setView(target.dataset.view);
    return;
  }

  const action = target.dataset.action;
  if (action === "play-voice") {
    playVoice(target.dataset.audio, target.dataset.label, target);
    return;
  }
  if (action === "save-journal") {
    event.preventDefault();
    const form = target.closest("#journal-form");
    if (form) saveJournalFromForm(form);
    return;
  }
  if (action === "generate-guide") {
    event.preventDefault();
    const form = target.closest("#guide-form");
    if (form) {
      const data = new FormData(form);
      state.guideMode = String(data.get("mode") || "reflect");
      state.guideInput = String(data.get("guideInput") || "");
      state.guideOutput = generateGuideResponse();
      render();
    }
    return;
  }
  if (action === "open-today") setView("today");
  if (action === "new-entry") {
    state.editingId = null;
    setView("journal");
  }
  if (action === "open-wheel") setView("wheel");
  if (action === "open-gate") {
    const gate = getGate(target.dataset.gate || state.selectedGateId);
    state.selectedGateId = gate.id;
    if (!getPractice(state.selectedPracticeId) || getPractice(state.selectedPracticeId)?.gateId !== gate.id) {
      state.selectedPracticeId = gate.practices[0].id;
    }
    setView("gateDetail");
  }
  if (action === "back-to-gates") setView("gates");
  if (action === "back-to-gate") setView("gateDetail");
  if (action === "view-practices") setView("practices");
  if (action === "select-gate") {
    const gate = getGate(target.dataset.gate);
    state.selectedGateId = gate.id;
    state.selectedPracticeId = gate.practices[0].id;
    render();
  }
  if (action === "choose-practice" || action === "start-practice") {
    const practice = getPractice(target.dataset.practice);
    if (practice) {
      state.selectedGateId = practice.gateId;
      state.selectedPracticeId = practice.id;
      setView(action === "start-practice" ? "practiceSession" : state.view);
    }
  }
  if (action === "journal-practice") preparePracticeJournal(target.dataset.practice);
  if (action === "journal-gate") {
    const gate = getGate(target.dataset.gate);
    state.selectedGateId = gate.id;
    state.selectedPracticeId = gate.practices[0].id;
    preparePracticeJournal(gate.practices[0].id);
  }
  if (action === "toggle-practice") markPractice(target.dataset.practice);
  if (action === "spin-wheel") {
    const gate = GATES[Math.floor(Math.random() * GATES.length)];
    state.selectedGateId = gate.id;
    state.selectedPracticeId = gate.practices[0].id;
    render();
  }
  if (action === "set-wheel-mode") {
    state.wheelMode = target.dataset.mode || "today";
    render();
  }
  if (action === "cancel-edit") {
    state.editingId = null;
    render();
  }
  if (action === "clear-draft") {
    clearDraft();
    render();
  }
  if (action === "edit-entry") {
    state.editingId = target.dataset.entry;
    render();
  }
  if (action === "delete-entry") {
    const entry = state.journal.find((item) => item.id === target.dataset.entry);
    if (entry && window.confirm(`Delete "${entry.title || "Untitled memory"}"?`)) {
      const next = state.journal.filter((item) => item.id !== entry.id);
      if (persistJournal(next)) {
        state.journal = next;
        toast("Memory deleted.");
        render();
      }
    }
  }
  if (action === "clear-guide") {
    state.guideInput = "";
    state.guideOutput = "";
    render();
  }
  if (action === "export-json") exportJson();
  if (action === "export-markdown") exportMarkdown();
  if (action === "clear-completions" && window.confirm("Clear all practice completion marks?")) {
    if (persistCompletions([])) {
      state.completions = [];
      toast("Practice marks cleared.");
      render();
    }
  }
  if (action === "clear-all-data" && window.confirm("Clear all local Harmonic Compass data in this browser? Export first if needed.")) {
    safeSetItem(BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), payload: archivePayload() }));
    [STORAGE_KEY, COMPLETIONS_KEY, SETTINGS_KEY, DRAFT_KEY].forEach(safeRemoveItem);
    state.journal = [];
    state.completions = [];
    state.settings = loadSettings();
    clearDraft();
    toast("Local data cleared.");
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "journal-form") {
    event.preventDefault();
    saveJournalFromForm(event.target);
  }
  if (event.target.id === "guide-form") {
    event.preventDefault();
    const data = new FormData(event.target);
    state.guideMode = String(data.get("mode") || "reflect");
    state.guideInput = String(data.get("guideInput") || "");
    state.guideOutput = generateGuideResponse();
    render();
  }
});

document.addEventListener("input", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "search-gates") {
    state.search = target.value;
    render();
  }
  if (target.dataset.action === "search-practices") {
    state.practiceSearch = target.value;
    render();
  }
  if (target.dataset.action === "compose-draft") {
    const form = target.closest("#journal-form");
    if (form) updateDraftFromForm(form);
  }
  if (target.dataset.action === "guide-input") {
    state.guideInput = target.value;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "filter-type") {
    state.filters.type = target.value;
    render();
  }
  if (target.dataset.action === "filter-gate") {
    state.filters.gate = target.value;
    render();
  }
  if (target.dataset.action === "filter-practice") {
    state.filters.practice = target.value;
    render();
  }
  if (target.dataset.action === "compose-gate") {
    const gate = getGate(target.value);
    state.selectedGateId = gate.id;
    state.selectedPracticeId = gate.practices[0].id;
    const form = target.closest("#journal-form");
    if (form) updateDraftFromForm(form);
    render();
  }
  if (target.dataset.action === "compose-draft") {
    const form = target.closest("#journal-form");
    if (form) updateDraftFromForm(form);
  }
  if (target.dataset.action === "guide-mode") {
    state.guideMode = target.value;
    state.guideOutput = "";
    render();
  }
  if (target.dataset.action === "start-date") {
    if (saveSettings({ startDate: target.value || DEFAULT_START_DATE })) {
      toast("Cycle start updated.");
      render();
    }
  }
  if (target.dataset.action === "import-json") {
    importJson(target.files?.[0]);
    target.value = "";
  }
});

function ringSegment(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const outerStart = polar(cx, cy, outerRadius, startAngle);
  const outerEnd = polar(cx, cy, outerRadius, endAngle);
  const innerEnd = polar(cx, cy, innerRadius, endAngle);
  const innerStart = polar(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function polar(cx, cy, radius, angle) {
  const radians = (Math.PI / 180) * angle;
  return {
    x: Number((cx + radius * Math.cos(radians)).toFixed(3)),
    y: Number((cy + radius * Math.sin(radians)).toFixed(3))
  };
}

function option(value, label, selected) {
  return `<option value="${escapeAttr(value)}" ${String(value) === String(selected) ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function topItems(items, limit) {
  const counts = new Map();
  items.filter(Boolean).forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([item]) => item);
}

function mostFrequent(items) {
  return topItems(items, 1)[0] || null;
}

function formatDate(dateString) {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
  } catch (error) {
    return dateString || "";
  }
}

function formatNumber(value, digits = 6) {
  return Number(value).toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function createId() {
  return window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

let toastTimer = null;
function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove("visible"), 2600);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

render();
