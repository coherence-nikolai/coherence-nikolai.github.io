export const BLOCKERS = [
  { id: "overwhelmed", label: "Everything feels too big" },
  { id: "unclear", label: "I do not understand the task" },
  { id: "starting", label: "I cannot get myself to begin" },
  { id: "perfectionism", label: "I am scared to do it badly" },
  { id: "time", label: "Time feels slippery" },
  { id: "energy", label: "My energy is low" },
  { id: "memory", label: "I will forget what I was doing" },
  { id: "sensory", label: "The environment is too noisy or intense" }
];

export const ROUTE_LIBRARY = {
  dashboard: {
    title: "Pause and shrink the task",
    reason: "When capacity is low, the right first move is reducing friction, not demanding more output.",
    action: "Use the Today panel to choose one small action that lowers pressure.",
    followUp: "If the task is still foggy after that, move to Unpack."
  },
  planner: {
    title: "Build a first-step plan",
    reason: "The task exists, but the entry point is not visible yet.",
    action: "Go to Plan and turn the task into one visible first step plus a low-pressure micro-plan.",
    followUp: "If the wording of the assignment is part of the problem, switch to Unpack."
  },
  unpack: {
    title: "Translate the task before you attempt it",
    reason: "Task confusion is real friction. Clarity has to come before confidence.",
    action: "Paste the prompt into Unpack and turn it into plain-language instructions and advisor questions.",
    followUp: "After that, move into Plan for a practical first-step plan."
  },
  notes: {
    title: "Capture what you know before it evaporates",
    reason: "When memory or processing is overloaded, preserving the thread matters more than polishing it.",
    action: "Use Notes to capture ideas, confusions, and sources, then convert them into a review pack.",
    followUp: "If a task emerges from the notes, move into Plan."
  },
  profile: {
    title: "Name the pattern",
    reason: "Sometimes the useful next move is understanding the conditions that make studying more possible.",
    action: "Use Profile to answer one prompt about what helps, blocks, or steadies your study brain.",
    followUp: "After one answer, return to Plan or Notes with a clearer support cue."
  },
  finish: {
    title: "Stop well while the thread is still alive",
    reason: "When momentum is high, a clean stopping point protects recovery and makes re-entry much easier.",
    action: "Use Finish to close the session, leave a breadcrumb, and avoid burning past the point where your brain can recover well.",
    followUp: "If you still have active thoughts, leave one memory cue in Notes before you step away."
  }
};

export const STUDY_STATES = {
  overwhelmed: {
    label: "Overloaded",
    prompt: "Everything feels too big, too loud, or too sharp to tackle cleanly.",
    brief: "Northstar will lower the pressure first, reduce decision count, and bias toward a gentler re-entry.",
    route: "dashboard",
    supportState: "low",
    battery: 2,
    timeAvailable: 5,
    blockers: ["overwhelmed", "energy", "sensory"],
    intent: "reduce pressure and restart gently",
    routeNote: "Regulation and reduction come before output."
  },
  confused: {
    label: "Confused",
    prompt: "The wording is muddy and I cannot see what the task is really asking for.",
    brief: "Northstar will translate the task before it asks you to perform inside it.",
    route: "unpack",
    supportState: "standard",
    battery: 3,
    timeAvailable: 15,
    blockers: ["unclear"],
    intent: "understand what the task is asking",
    routeNote: "Clarity comes before confidence."
  },
  avoiding: {
    label: "Avoiding",
    prompt: "I keep skirting around it, even though I know it matters.",
    brief: "Northstar will find a safer contact point with the task and keep the first move very small.",
    route: "planner",
    supportState: "low",
    battery: 2,
    timeAvailable: 5,
    blockers: ["starting", "perfectionism", "overwhelmed"],
    intent: "touch the task without triggering shutdown",
    routeNote: "Re-entry matters more than intensity."
  },
  drifting: {
    label: "Losing the thread",
    prompt: "Ideas, reading details, or next steps keep slipping out of reach.",
    brief: "Northstar will help you capture what matters before memory has to hold it all.",
    route: "notes",
    supportState: "standard",
    battery: 3,
    timeAvailable: 15,
    blockers: ["memory", "time"],
    intent: "capture what I know before it disappears",
    routeNote: "Preserve the thread before asking for polish."
  },
  hyperfocused: {
    label: "Running too hot",
    prompt: "I can keep going, but I may overshoot and leave myself with no clean stopping point.",
    brief: "Northstar will help you close the session while the work still feels legible.",
    route: "finish",
    supportState: "standard",
    battery: 4,
    timeAvailable: 15,
    blockers: ["time"],
    intent: "close the session before burnout or drift",
    routeNote: "Protect recovery while the thread is still alive."
  }
};

export const TASK_VERBS = {
  auto: {
    label: "Auto-detect if possible",
    meaning: "Northstar will look for a likely command word in your prompt."
  },
  analyse: {
    label: "Analyse",
    meaning: "Break the topic into parts, show how they relate, and explain what those parts reveal."
  },
  compare: {
    label: "Compare",
    meaning: "Show what is similar and different, then explain why those similarities and differences matter."
  },
  discuss: {
    label: "Discuss",
    meaning: "Explore the issue from more than one angle, then build a clear line of thinking."
  },
  evaluate: {
    label: "Evaluate",
    meaning: "Judge strengths, limitations, or value using evidence and explicit criteria."
  },
  explain: {
    label: "Explain",
    meaning: "Make the topic understandable by describing how or why it works."
  },
  reflect: {
    label: "Reflect",
    meaning: "Connect the topic to your experience, learning, or practice, and show what changed."
  },
  critique: {
    label: "Critique",
    meaning: "Examine the argument carefully, identify strengths and weaknesses, and defend your judgment."
  }
};

export const NOTE_BLOCK_TYPES = {
  idea: {
    label: "Idea",
    shortLabel: "Idea",
    placeholder: "Write the point in plain language if you can, not only the source wording."
  },
  question: {
    label: "Question",
    shortLabel: "Question",
    placeholder: "Capture what still feels unclear, slippery, or worth asking about later."
  },
  evidence: {
    label: "Evidence",
    shortLabel: "Evidence",
    placeholder: "Save a source, example, statistic, or reference you may want to reuse."
  },
  quote: {
    label: "Quote",
    shortLabel: "Quote",
    placeholder: "Paste a line or phrase you may want to cite, remember, or unpack."
  },
  task: {
    label: "Next task",
    shortLabel: "Task",
    placeholder: "Write the next concrete action these notes should lead to."
  },
  cue: {
    label: "Memory cue",
    shortLabel: "Cue",
    placeholder: "Leave yourself a breadcrumb so re-entry is easier next time."
  }
};

export const FINISH_ITEMS = [
  "I met the minimum outcome for this session.",
  "My file is named clearly and saved in the right place.",
  "I checked the task instructions or rubric again.",
  "I noted what still needs doing.",
  "I know the next step for the next session."
];

export const SUPPORT_RESOURCES = [
  {
    title: "Academic skills advisor",
    text: "Replace this with your booking link, campus contact, or support email."
  },
  {
    title: "Disability or accessibility support",
    text: "Add institution-specific accommodations, learning access, or inclusion services here."
  },
  {
    title: "After-hours support",
    text: "Add local wellbeing, crisis, or urgent support guidance appropriate to your region."
  }
];

export const PROFILE_QUESTIONS = [
  {
    id: "starting",
    prompt: "When I sit down to study, the hardest part is usually...",
    supportText: "Pick the snag that tends to appear first, even if more than one is true.",
    options: [
      { label: "Actually beginning the task", tags: ["initiation", "overwhelm"] },
      { label: "Knowing what the task is asking", tags: ["clarity", "processing"] },
      { label: "Staying with it once I start", tags: ["attention", "time"] },
      { label: "Submitting before it feels perfect", tags: ["perfectionism"] }
    ]
  },
  {
    id: "reading",
    prompt: "When I am reading academic material, I usually need...",
    supportText: "Think about what helps the text land, not what sounds most scholarly.",
    options: [
      { label: "Plainer language or examples", tags: ["processing", "clarity"] },
      { label: "More visual structure or chunking", tags: ["processing", "visual"] },
      { label: "Audio, discussion, or spoken explanation", tags: ["auditory", "processing"] },
      { label: "A quieter environment so the text can land", tags: ["sensory"] }
    ]
  },
  {
    id: "time",
    prompt: "Time tends to feel...",
    supportText: "Choose the option that most often describes how deadlines and work sessions feel from the inside.",
    options: [
      { label: "Invisible until a deadline is suddenly close", tags: ["time", "urgency"] },
      { label: "Long enough until I start and then it disappears", tags: ["time", "attention"] },
      { label: "Manageable if I can see a step-by-step plan", tags: ["structure"] },
      { label: "Fine, but I still need support getting going", tags: ["initiation"] }
    ]
  },
  {
    id: "environment",
    prompt: "My study environment works best when...",
    supportText: "This is about conditions, not discipline. Pick the setup that usually gives your brain the best chance.",
    options: [
      { label: "There is low noise and low sensory clutter", tags: ["sensory"] },
      { label: "I can move, fidget, or shift around", tags: ["regulation"] },
      { label: "Someone else is around or checking in", tags: ["accountability"] },
      { label: "I can see the whole plan in front of me", tags: ["structure", "memory"] }
    ]
  },
  {
    id: "feedback",
    prompt: "The kind of support that helps me most is...",
    supportText: "Choose the kind of help that lowers friction fastest, not the help you think you should need.",
    options: [
      { label: "A plain-language explanation of what to do first", tags: ["clarity", "initiation"] },
      { label: "Concrete examples or models", tags: ["processing", "visual"] },
      { label: "A realistic accountability structure", tags: ["accountability", "time"] },
      { label: "Permission to do a good-enough first pass", tags: ["perfectionism", "overwhelm"] }
    ]
  },
  {
    id: "stress",
    prompt: "When I am stressed about study, I tend to...",
    supportText: "Answer from the pattern you recognise most often when pressure rises.",
    options: [
      { label: "Freeze and avoid it", tags: ["overwhelm", "initiation"] },
      { label: "Do other tasks that feel safer or easier", tags: ["avoidance", "initiation"] },
      { label: "Hyperfocus unevenly and burn out", tags: ["attention", "recovery"] },
      { label: "Keep going but become exhausted and foggy", tags: ["recovery", "energy"] }
    ]
  }
];

export const PROFILE_TAG_CONTENT = {
  initiation: {
    label: "Task initiation support",
    summary: "You benefit from visible entry points and tiny, low-friction first actions.",
    strategies: [
      "Start with a setup action you can see, such as opening the document or pasting the prompt.",
      "Use a short body-double session or text a check-in person before you begin.",
      "Treat beginning as the win. Momentum can come later."
    ],
    advisorAsk: "I start more easily when the first action is very concrete. Can we break this task into a visible opening move?"
  },
  clarity: {
    label: "Task clarity support",
    summary: "Ambiguous instructions create real friction. Plain language and examples unlock progress.",
    strategies: [
      "Translate command words before drafting.",
      "Write down what the marker probably wants to see.",
      "Bring one targeted clarification question to staff or advising."
    ],
    advisorAsk: "I work better once the task language is translated into plain steps. Can we unpack the brief together?"
  },
  processing: {
    label: "Processing support",
    summary: "You may need chunking, examples, alternate formats, or more time to turn input into meaning.",
    strategies: [
      "Work in short blocks and summarize each section in your own words.",
      "Use examples, diagrams, or audio when possible.",
      "Reduce the amount of text you are holding at once."
    ],
    advisorAsk: "I understand better when information is chunked and modelled. Can we work from one example?"
  },
  time: {
    label: "Time scaffolding",
    summary: "Time needs to be externalised to stay usable, especially when tasks feel abstract.",
    strategies: [
      "Break the task into now, next, and later instead of one huge deadline.",
      "Estimate the next step, not the whole project.",
      "Use visible checkpoints instead of relying on an internal sense of time."
    ],
    advisorAsk: "Deadlines feel more manageable when I can see short checkpoints. Can we create those together?"
  },
  perfectionism: {
    label: "Good-enough drafting support",
    summary: "Fear of getting it wrong may be blocking completion more than the task itself.",
    strategies: [
      "Write the rough version before the good version.",
      "Decide what counts as enough for this session in advance.",
      "Separate drafting from polishing so both do not happen at once."
    ],
    advisorAsk: "I can get stuck trying to make work perfect too early. Can we define what a good-enough first pass looks like?"
  },
  overwhelm: {
    label: "Overwhelm reduction",
    summary: "When the task arrives as one giant whole, your brain may need it reduced before it feels reachable.",
    strategies: [
      "Shrink the task until the first action feels almost too small.",
      "Choose one pressure-reducing move before asking for output.",
      "Define what the next safe contact point with the task is."
    ],
    advisorAsk: "Large tasks can hit me as one overwhelming block. Can we reduce this into smaller visible pieces?"
  },
  sensory: {
    label: "Sensory safety",
    summary: "Noise, clutter, brightness, or unpredictability may be using capacity you need for learning.",
    strategies: [
      "Lower visual and sensory clutter before asking for cognitive effort.",
      "Use headphones, quiet zones, or a calmer digital layout when possible.",
      "Build in small regulation resets instead of waiting for overload."
    ],
    advisorAsk: "My environment affects how much information I can process. Can we talk about study setups that reduce overload?"
  },
  accountability: {
    label: "External structure",
    summary: "You may work best when the task is shared, witnessed, or time-boxed with another person or structure.",
    strategies: [
      "Set a brief check-in with someone you trust.",
      "Use appointment prep notes so support conversations start quickly.",
      "Create a visible completion checkpoint rather than a vague intention."
    ],
    advisorAsk: "I follow through better with some external structure. Can we build a realistic accountability step?"
  },
  recovery: {
    label: "Recovery-aware pacing",
    summary: "Productivity without recovery can backfire. Sustainable study includes stopping well.",
    strategies: [
      "Plan the stopping point before fatigue chooses it for you.",
      "Capture the next step before leaving so re-entry is easier.",
      "Measure success by continuity, not intensity."
    ],
    advisorAsk: "I need study plans that include recovery and re-entry, not just output. Can we build that in?"
  },
  visual: {
    label: "Visual structure",
    summary: "You may understand and remember more when information is spatial, color-coded, or visibly chunked.",
    strategies: [
      "Turn notes into headings, boxes, and short prompts.",
      "Use one idea per line before turning it into paragraphs.",
      "Keep visual hierarchy strong and uncluttered."
    ],
    advisorAsk: "Visual examples and visible structure help me understand faster. Can we map this out visually?"
  },
  attention: {
    label: "Attention support",
    summary: "Staying with a task may require stronger structure, fewer competing cues, and clearer stopping points.",
    strategies: [
      "Limit the current task to one visible goal.",
      "Close unrelated tabs before the hard part.",
      "Set a short review checkpoint before attention drifts too far."
    ],
    advisorAsk: "I do better when the session has a narrow target and a clear stopping point. Can we define that together?"
  },
  energy: {
    label: "Low-energy adaptation",
    summary: "Some days the best plan is the smallest plan that still keeps the thread alive.",
    strategies: [
      "Use 5-minute modes instead of all-or-nothing thinking.",
      "Choose preservation tasks such as opening, naming, or outlining.",
      "Treat continuity as success on low-capacity days."
    ],
    advisorAsk: "I need ways to keep the thread alive on low-energy days without feeling like I failed."
  },
  urgency: {
    label: "Urgency regulation",
    summary: "You may activate best under pressure, but relying on panic is exhausting.",
    strategies: [
      "Simulate urgency with short checkpoints rather than last-minute stress.",
      "Make the first action public or visible.",
      "Externalise deadlines into smaller time markers."
    ],
    advisorAsk: "I often only switch on near deadlines. Can we build earlier activation points that do not rely on panic?"
  },
  avoidance: {
    label: "Avoidance awareness",
    summary: "If the task feels threatening, the brain may protect itself by moving elsewhere.",
    strategies: [
      "Name what feels threatening about the task before forcing action.",
      "Choose one safe contact point with the task.",
      "Pair the task with clarity, support, or a lower-pressure first move."
    ],
    advisorAsk: "I can avoid tasks that feel loaded or threatening. Can we identify what is making this one feel high-stakes?"
  },
  structure: {
    label: "Visible structure",
    summary: "You may perform best when expectations, sequence, and progress are externalised.",
    strategies: [
      "Keep the plan visible while you work.",
      "Use headings, numbered steps, and checklists.",
      "Reduce hidden assumptions in the workflow."
    ],
    advisorAsk: "I do best when the structure is explicit. Can we write out the sequence together?"
  },
  regulation: {
    label: "Regulation support",
    summary: "Movement, grounding, and nervous-system support may be necessary before cognitive work becomes possible.",
    strategies: [
      "Build in a short regulation step before the hardest task.",
      "Use movement or sensory tools intentionally, not as an afterthought.",
      "Treat regulation as part of studying, not a distraction from it."
    ],
    advisorAsk: "A short regulation step helps me access the work. Can we plan with that in mind?"
  },
  auditory: {
    label: "Audio support",
    summary: "You may process better when content is heard or discussed rather than only read silently.",
    strategies: [
      "Read key text aloud or use text-to-speech when possible.",
      "Talk through the concept before writing it formally.",
      "Capture spoken explanations and convert them later."
    ],
    advisorAsk: "I often understand more through discussion or audio. Can we talk the task through first?"
  },
  memory: {
    label: "Memory offload",
    summary: "Holding many loose pieces in mind can drain capacity fast. Visible capture helps.",
    strategies: [
      "Write every open loop down as soon as it appears.",
      "Use notes that convert directly into next actions.",
      "Leave yourself a visible re-entry note before stopping."
    ],
    advisorAsk: "I lose the thread if I have to hold too much in memory. Can we make the plan more visible?"
  }
};
