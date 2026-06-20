export const locationOptions = [
  "behind the eyes",
  "face",
  "head",
  "throat",
  "chest",
  "abdomen",
  "whole body",
  "around the body",
  "no clear location",
  "not present"
];

export const textureOptions = [
  "sensation",
  "pressure",
  "image",
  "thought",
  "emotion",
  "watcher",
  "contraction",
  "warmth",
  "boundary",
  "doer",
  "intention",
  "story",
  "space",
  "absence",
  "unclear"
];

export const stabilityOptions = [
  "stable",
  "shifting",
  "flickering",
  "vanishing",
  "re-forming",
  "hard to look at",
  "unclear"
];

export const toneOptions = [
  "quiet",
  "neutral",
  "charged",
  "urgent",
  "soft",
  "fear",
  "sadness",
  "pride",
  "shame",
  "desire",
  "peace",
  "unclear"
];

export const boundaryOptions = [
  "inside the body",
  "at the skin",
  "around the body",
  "in the visual field",
  "in thought only",
  "no clear boundary",
  "not present",
  "unclear"
];

export const ownershipOptions = [
  "clearly mine",
  "partly mine",
  "owned as thought",
  "owned as sensation",
  "just happening",
  "not owned",
  "unclear"
];

export const narrativeOptions = [
  "memory",
  "future",
  "role",
  "problem",
  "image of me",
  "social pressure",
  "wordless being",
  "nothing narrative",
  "unclear"
];

export const firstReadQuestions = [
  {
    id: "location",
    mode: "single",
    title: "Locate",
    question: "Where does the sense of me seem to gather?",
    help: "Choose the closest direct report. It can be vague, absent, or changing.",
    options: locationOptions
  },
  {
    id: "textures",
    mode: "multi",
    title: "Texture",
    question: "What does the I-sense seem made of?",
    help: "Select every marker that fits before interpreting it.",
    options: textureOptions
  },
  {
    id: "stability",
    mode: "single",
    title: "Stability",
    question: "What happens when attention touches it?",
    help: "Notice whether it stays available, shifts, vanishes, or resists being seen.",
    options: stabilityOptions
  },
  {
    id: "boundary",
    mode: "single",
    title: "Boundary",
    question: "Where does me seem to end?",
    help: "Look for the edge, border, or lack of border before explaining it.",
    options: boundaryOptions
  },
  {
    id: "ownership",
    mode: "single",
    title: "Ownership",
    question: "How owned does this experience feel?",
    help: "Check whether the sensations, thoughts, or viewpoint feel mine, automatic, or simply present.",
    options: ownershipOptions
  },
  {
    id: "observer",
    mode: "single",
    title: "Observer",
    question: "Is there a watcher or observer feeling?",
    help: "This does not mean there is or is not a self. It is only a report.",
    options: ["yes, clear", "yes, faint", "only as a thought", "not clear", "not present"]
  },
  {
    id: "agency",
    mode: "single",
    title: "Agency",
    question: "Is there a doer or controller feeling?",
    help: "Look at intention, effort, control, and the sense of making experience happen.",
    options: ["clear doer", "subtle doer", "intention only", "automatic", "not clear", "not present"]
  },
  {
    id: "tone",
    mode: "single",
    title: "Tone",
    question: "What tone seems to strengthen me-ness?",
    help: "Some users find self-sense intensifies around emotion, urgency, or social pressure.",
    options: toneOptions
  },
  {
    id: "narrative",
    mode: "single",
    title: "Story",
    question: "What most makes this feel personal?",
    help: "Notice whether me-ness is held by a role, memory, image, problem, or no story at all.",
    options: narrativeOptions
  }
];

export const resultMarkers = [
  "stayed the same",
  "shifted location",
  "softened",
  "intensified",
  "became unclear",
  "dropped away briefly",
  "re-formed",
  "widened",
  "contracted",
  "nothing clear"
];

export const remainsMarkers = [
  "sensation",
  "sound",
  "space",
  "thought",
  "emotion",
  "body sensation",
  "seeing",
  "knowing",
  "ordinary experience",
  "cannot say"
];

export const integrationMarkers = [
  "easy to return",
  "needed grounding",
  "ordinary afterwards",
  "wide perception stayed",
  "self-sense re-formed",
  "emotion softened",
  "more questions opened",
  "no after-effect",
  "cannot say"
];

export const noteFacetGroups = [
  {
    id: "components",
    label: "what it seemed made of",
    options: textureOptions
  },
  {
    id: "change",
    label: "what changed",
    options: resultMarkers
  },
  {
    id: "remains",
    label: "what remained",
    options: remainsMarkers
  },
  {
    id: "integration",
    label: "after-effect",
    options: integrationMarkers
  }
];

const rawLensLibrary = [
  {
    id: "location",
    title: "Location Lens",
    shortTitle: "Location",
    lineage: "felt center",
    aim: "Find where me-ness seems to gather without assuming it should be anywhere.",
    directAction: "Let attention touch the apparent center, then check whether it is sensation, image, viewpoint, or thought.",
    reflection: "Did the center stay, move, become unclear, or show itself as parts?",
    prompts: [
      "Where is the strongest felt center of me?",
      "If the self-sense had a center point, where would it be?",
      "Does the center stay fixed when it is observed?",
      "Is the location a sensation, an image, a viewpoint, or a thought?",
      "What happens if the center is allowed to be vague?"
    ],
    markers: ["behind eyes", "head", "chest", "abdomen", "whole body", "around body", "moving", "no location", "not present"]
  },
  {
    id: "noting",
    title: "Noting Lens",
    shortTitle: "Noting",
    lineage: "bare phenomena",
    aim: "Break the self-sense into direct phenomena: sensation, tone, image, thought, intention.",
    directAction: "Name the most obvious component simply, then look again before adding a story.",
    reflection: "Which components remained when the word self was not used?",
    prompts: [
      "What is most obvious: sensation, thought, image, emotion, or intention?",
      "Can me-ness be noted as pressure, pressure, or thinking, thinking?",
      "What changes when the component is named simply?",
      "Is there one thing called self, or several fast events?",
      "What is the coarsest piece of it right now?"
    ],
    markers: ["sensation", "pressure", "thinking", "image", "emotion", "intention", "warmth", "contraction", "vibration", "absence"]
  },
  {
    id: "seer-seen",
    title: "Seer-Seen Lens",
    shortTitle: "Seer-Seen",
    lineage: "observer inquiry",
    aim: "Look at whether the self-sense can itself be observed.",
    directAction: "Turn attention toward the watcher feeling and check whether it has shape, location, texture, or distance.",
    reflection: "Was the watcher an observer, an observed object, both, neither, or unclear?",
    prompts: [
      "Can the watcher feeling itself be seen or felt?",
      "When the watcher is observed, what is it made of?",
      "Does the observer have a location, edge, image, or posture?",
      "Does the observer move into another position when looked at?",
      "What remains if the watcher is only another appearance?"
    ],
    markers: ["watcher", "distance", "behind eyes", "image", "silence", "tension", "receding", "seen object", "unclear"]
  },
  {
    id: "i-thought",
    title: "I-Thought Lens",
    shortTitle: "I-Thought",
    lineage: "I-am inquiry",
    aim: "Track the arising of I before it becomes a story.",
    directAction: "Wait for the subtle I to form, then note whether it appears as word, pressure, image, knowing, or movement.",
    reflection: "What was present just before I became a thought or phrase?",
    prompts: [
      "Where does the wordless sense I first appear?",
      "What is here just before the thought I forms?",
      "Is I a word, pressure, knowing, image, or subtle movement?",
      "When I is noticed, does it stay as I or become something else?",
      "Can attention rest before I becomes I-am-this?"
    ],
    markers: ["word", "preverbal", "thought", "source", "heart", "head", "knowing", "movement", "absence"]
  },
  {
    id: "agency",
    title: "Agency Lens",
    shortTitle: "Agency",
    lineage: "doer inquiry",
    aim: "Observe the felt doer, controller, chooser, or author of action.",
    directAction: "Before a simple action, look for the author of intention without slowing the action down.",
    reflection: "Did intention require an owner, or did ownership arrive afterward?",
    prompts: [
      "Before movement, is there a doer or only intention?",
      "Does choosing feel authored, automatic, or mixed?",
      "Where is the controller felt in the body?",
      "What happens to me-ness when action is simple and ordinary?",
      "Can intention be felt without adding an owner?"
    ],
    markers: ["doer", "intention", "effort", "control", "automatic", "choosing", "tension", "release", "unclear"]
  },
  {
    id: "boundary",
    title: "Boundary Lens",
    shortTitle: "Boundary",
    lineage: "inside / outside",
    aim: "Examine where inside-me appears to end and world begins.",
    directAction: "Include skin, sound, sight, and space, then look for the border that makes experience feel inside or outside.",
    reflection: "Was the boundary sensory, visual, conceptual, emotional, absent, or unclear?",
    prompts: [
      "Where is the border between me and world?",
      "Is the boundary skin, vision, pressure, attention, or thought?",
      "Does sound appear outside, inside, or neither?",
      "Does the body feel owned as a whole or in parts?",
      "What happens when the boundary is allowed to soften?"
    ],
    markers: ["skin", "visual edge", "pressure", "around body", "sound field", "owned body", "partial body", "soft edge", "no edge"]
  },
  {
    id: "narrative",
    title: "Narrative Lens",
    shortTitle: "Narrative",
    lineage: "story self",
    aim: "See whether me-ness is being held together by memory, role, problem, or future.",
    directAction: "Let the personal story show itself as a sentence, image, role, problem, memory, or expectation.",
    reflection: "What remained of me-ness when the story paused?",
    prompts: [
      "What story is maintaining me right now?",
      "Is there a role, problem, plan, or memory holding the self-sense?",
      "If the story pauses, what is left of me-ness?",
      "Does the self feel older, younger, public, private, defended, or unfinished?",
      "Which sentence about me keeps returning?"
    ],
    markers: ["memory", "future", "role", "problem", "defense", "identity", "self-image", "social self", "quiet"]
  },
  {
    id: "emotion-tone",
    title: "Emotion-Tone Lens",
    shortTitle: "Emotion",
    lineage: "affective self",
    aim: "Notice how emotion strengthens, softens, or colors the felt sense of self.",
    directAction: "Feel the emotional tone as body sensation before deciding what it means.",
    reflection: "Did emotion make the self-sense more solid, softer, defended, tender, or absent?",
    prompts: [
      "Which emotion makes me-ness more solid?",
      "Where is the emotion located relative to the self-sense?",
      "Is the self-sense protecting, wanting, fearing, proving, or hiding?",
      "What happens if the emotion is felt as sensation and tone?",
      "Does me remain when the emotional charge softens?"
    ],
    markers: ["fear", "sadness", "pride", "shame", "desire", "defense", "tenderness", "urgency", "peace"]
  },
  {
    id: "field",
    title: "Field Lens",
    shortTitle: "Field",
    lineage: "wide perception",
    aim: "Observe what happens to self-center when perception opens wider.",
    directAction: "Include peripheral seeing, hearing, and body sensation as one field, then check the apparent center.",
    reflection: "Did the center disperse, relocate, widen, remain unchanged, or become irrelevant?",
    prompts: [
      "Let peripheral seeing be included. What happens to the center of me?",
      "Does hearing widen the field or reinforce a center?",
      "Can the body be included inside a larger field of experience?",
      "Does self-sense disperse, relocate, or stay exactly the same?",
      "What remains present when attention is not narrowed around me?"
    ],
    markers: ["wide seeing", "peripheral clarity", "sound field", "body included", "center softened", "space", "ordinary", "no change"]
  },
  {
    id: "absence",
    title: "Absence Lens",
    shortTitle: "Absence",
    lineage: "not found",
    aim: "If no clear self is found, record what is still present without forcing a conclusion.",
    directAction: "Look for the self-sense, and if it is not clear, record what is plainly still present.",
    reflection: "Was absence blank, ordinary, peaceful, uneasy, spacious, or simply not clear?",
    prompts: [
      "If the self-sense is not found, what is still here?",
      "Is absence blank, spacious, ordinary, peaceful, uneasy, or unclear?",
      "Does a self re-form after being unfound?",
      "What sensations or thoughts claim the absence afterward?",
      "Can not-finding be recorded without turning it into a belief?"
    ],
    markers: ["not found", "space", "ordinary", "peace", "uneasy", "thought returned", "re-formed", "blank", "cannot say"]
  }
];

export const lensLibrary = rawLensLibrary.map((lens) => ({
  stance: "direct experiment",
  directAction: "Let the prompt point attention, then record only what is directly noticed.",
  reflection: "What changed, if anything, when this lens was applied?",
  ...lens
}));

export function getLensById(id) {
  return lensLibrary.find((lens) => lens.id === id) || lensLibrary[0];
}

export function createEmptyFirstRead() {
  return {
    location: "",
    textures: [],
    stability: "",
    boundary: "",
    ownership: "",
    observer: "",
    agency: "",
    tone: "",
    narrative: ""
  };
}

export function suggestLensIds(firstRead) {
  const scores = Object.fromEntries(lensLibrary.map((lens) => [lens.id, 0]));
  const textures = new Set(firstRead.textures || []);
  const location = firstRead.location || "";
  const stability = firstRead.stability || "";
  const boundary = firstRead.boundary || "";
  const ownership = firstRead.ownership || "";
  const observer = firstRead.observer || "";
  const agency = firstRead.agency || "";
  const tone = firstRead.tone || "";
  const narrative = firstRead.narrative || "";

  const add = (id, score) => {
    scores[id] += score;
  };

  if (["behind the eyes", "face", "head", "throat", "chest", "abdomen"].includes(location)) add("location", 4);
  if (["whole body", "around the body"].includes(location)) {
    add("field", 3);
    add("boundary", 3);
    add("location", 1);
  }
  if (["no clear location", "not present"].includes(location)) {
    add("absence", 6);
    add("field", 2);
  }

  if (textures.has("watcher")) {
    add("seer-seen", 14);
    add("location", 3);
  }
  if (textures.has("pressure") || textures.has("sensation") || textures.has("contraction") || textures.has("warmth")) add("noting", 6);
  if (textures.has("image")) {
    add("seer-seen", 2);
    add("noting", 2);
  }
  if (textures.has("thought")) add("i-thought", 4);
  if (textures.has("story")) add("narrative", 6);
  if (textures.has("emotion")) {
    add("emotion-tone", 5);
    add("noting", 2);
  }
  if (textures.has("boundary")) add("boundary", 6);
  if (textures.has("doer") || textures.has("intention")) add("agency", 7);
  if (textures.has("space")) add("field", 5);
  if (textures.has("absence")) add("absence", 7);

  if (stability === "stable") add("location", 2);
  if (stability === "shifting" || stability === "flickering") add("noting", 2);
  if (stability === "vanishing") {
    add("absence", 5);
    add("field", 2);
  }
  if (stability === "re-forming") add("absence", 3);
  if (stability === "hard to look at") add("emotion-tone", 2);

  if (["at the skin", "around the body", "inside the body", "in the visual field"].includes(boundary)) add("boundary", 5);
  if (["no clear boundary", "not present"].includes(boundary)) {
    add("field", 4);
    add("absence", 2);
  }
  if (boundary === "in thought only") {
    add("i-thought", 3);
    add("narrative", 2);
  }

  if (["clearly mine", "partly mine", "owned as sensation"].includes(ownership)) add("location", 2);
  if (ownership === "owned as thought") {
    add("i-thought", 4);
    add("narrative", 2);
  }
  if (["just happening", "not owned"].includes(ownership)) {
    add("agency", 3);
    add("absence", 2);
  }

  if (observer.includes("yes")) add("seer-seen", 5);
  if (observer === "only as a thought") add("i-thought", 3);
  if (observer === "not present") add("absence", 2);

  if (agency.includes("doer") || agency === "intention only") add("agency", 5);
  if (agency === "automatic") add("agency", 2);
  if (agency === "not present") add("absence", 1);

  if (["charged", "urgent", "fear", "sadness", "pride", "shame", "desire"].includes(tone)) add("emotion-tone", 4);
  if (tone === "quiet" || tone === "peace") add("field", 2);

  if (["memory", "future", "role", "problem", "image of me", "social pressure"].includes(narrative)) add("narrative", 6);
  if (narrative === "wordless being") {
    add("i-thought", 3);
    add("field", 2);
  }
  if (narrative === "nothing narrative") {
    add("absence", 2);
    add("field", 2);
  }

  return lensLibrary
    .map((lens, index) => ({ id: lens.id, score: scores[lens.id], index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.id);
}

export function summarizePatterns(sessions) {
  const normalized = sessions || [];
  const lensCounts = countBy(normalized.map((session) => session.lensId || "unlensed"));
  const locationCounts = countBy(normalized.map((session) => session.firstRead?.location || session.location).filter(Boolean));
  const textureCounts = countBy(normalized.flatMap((session) => session.firstRead?.textures || session.textureMarkers || []));
  const boundaryCounts = countBy(normalized.map((session) => session.firstRead?.boundary).filter(Boolean));
  const ownershipCounts = countBy(normalized.map((session) => session.firstRead?.ownership).filter(Boolean));
  const observerCounts = countBy(normalized.map((session) => session.firstRead?.observer).filter(Boolean));
  const agencyCounts = countBy(normalized.map((session) => session.firstRead?.agency).filter(Boolean));
  const toneCounts = countBy(normalized.map((session) => session.firstRead?.tone).filter(Boolean));
  const narrativeCounts = countBy(normalized.map((session) => session.firstRead?.narrative).filter(Boolean));
  const resultCounts = countBy(normalized.flatMap((session) => session.resultMarkers || session.observedChangeMarkers || []));
  const remainsCounts = countBy(normalized.flatMap((session) => session.remainsMarkers || session.thresholdMarkers || []));
  const integrationCounts = countBy(normalized.flatMap((session) => session.integrationMarkers || []));
  const coOccurrences = summarizeCoOccurrences(normalized);

  const summary = {
    total: normalized.length,
    topLens: topCount(lensCounts),
    topLocation: topCount(locationCounts),
    topTexture: topCount(textureCounts),
    topBoundary: topCount(boundaryCounts),
    topOwnership: topCount(ownershipCounts),
    topObserver: topCount(observerCounts),
    topAgency: topCount(agencyCounts),
    topTone: topCount(toneCounts),
    topNarrative: topCount(narrativeCounts),
    topResult: topCount(resultCounts),
    topRemainder: topCount(remainsCounts),
    topIntegration: topCount(integrationCounts),
    topCoOccurrence: coOccurrences[0] || null,
    droppedAway: resultCounts["dropped away briefly"] || 0,
    becameUnclear: resultCounts["became unclear"] || 0,
    reformed: resultCounts["re-formed"] || 0,
    widened: resultCounts.widened || remainsCounts.space || 0,
    grounded: integrationCounts["needed grounding"] || 0
  };

  return {
    ...summary,
    insights: buildNeutralInsights(summary)
  };
}

function countBy(items) {
  return items.reduce((counts, item) => {
    if (!item) return counts;
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

function topCount(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries[0] ? entries[0][0] : "none yet";
}

function summarizeCoOccurrences(sessions) {
  const pairs = sessions.flatMap((session) => {
    const lens = session.lensId || "unlensed";
    const location = session.firstRead?.location || session.location || "unlocated";
    const results = session.resultMarkers || session.observedChangeMarkers || [];
    return results.map((result) => `${lens} / ${location} -> ${result}`);
  });
  return Object.entries(countBy(pairs))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

function buildNeutralInsights(summary) {
  if (!summary.total) return [];
  const insights = [
    `Most recorded lens: ${summary.topLens}.`,
    `Most reported location: ${summary.topLocation}.`,
    `Most reported texture: ${summary.topTexture}.`
  ];

  if (summary.topBoundary !== "none yet") insights.push(`Most reported boundary: ${summary.topBoundary}.`);
  if (summary.topOwnership !== "none yet") insights.push(`Most reported ownership: ${summary.topOwnership}.`);
  if (summary.topResult !== "none yet") insights.push(`Most repeated result: ${summary.topResult}.`);
  if (summary.topIntegration !== "none yet") insights.push(`Most common after-effect: ${summary.topIntegration}.`);
  if (summary.topCoOccurrence) insights.push(`Repeated pairing: ${summary.topCoOccurrence.label} (${summary.topCoOccurrence.count}).`);

  return insights.slice(0, 6);
}
