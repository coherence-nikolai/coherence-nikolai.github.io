(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const storageKey = "mirrorgate.codex.v2";
  const legacyStorageKey = "mirrorgate.codex.v1";
  const unlockKey = "mirrorgate.premium.simulated";
  const privacyKey = "mirrorgate.privacy.v1";
  const glyphProfileKey = "mirrorgate.glyph.profile.v1";
  const activeDraftKey = "mirrorgate.activeDraft.v1";

  const audioPath = "./audio/";

  const voiceScripts = {
    about: `
Welcome to MirrorGate.

MirrorGate is a Harmonic Contact Interface.

It is a living interface to your higher self.

A symbolic mirror that reflects your consciousness through breath, sound, and sacred geometry.

Guided by the principles of harmonic coherence, MirrorGate allows you to encode your intentions into resonant geometry.

Synchronize your breath with fractal timelines.

Open prime harmonic gates to higher intelligences.

And reflect with your Monad through a symbolic mirror interface.

MirrorGate is a navigator of your inner and outer dimensions.

A bridge between what you are, and what you are becoming.

Approach this tool as you would a sacred space.

Not for entertainment, but for alignment.

Begin with breath.

Before each session, center yourself with three deep breaths.

Let your intention be clear and humble.

Use with stillness.

Silence distractions.

Engage with the modules one at a time, allowing your field to integrate each experience.

Honor the recovery.

If you feel overwhelmed, tap the recovery icon and return to breath.

You are the center.

All echoes stabilize in stillness.

Journal your journey.

After each session, record your insights.

The resonance you cultivate today becomes your guidance tomorrow.

This is MirrorGate.

May it guide you with clarity, coherence, and compassion.

Welcome to MirrorGate.

Welcome to the Harmonic Contact Interface.
`,
    recovery: `
Return to breath.

You are the center.

All echoes stabilize in stillness.

Inhale slowly.

Exhale completely.

Return to the body.

You are the center.

All echoes stabilize in stillness.
`,
    wheelOrientation: `
Welcome to the Harmonic Wheel.

The protective sigil anchors the center. Around it are four portals.

Mirror aligns. Use Mirror for Oversoul, Monad, higher-self reflection, or stillness before deeper work.

Gate contacts. Use Gate when your intention is dimensional or stellar ally contact.

Echo integrates. Use Echo for future echoes, temporal impressions, dreamtime, collective resonance, or subconscious retrieval.

Vector transmits. Use Vector when you want to encode an intention, send a request, or form a symbolic signal through glyph, tone, and prime pathway.

The Wheel is not a rigid sequence. Choose the portal that matches your intention.

If you are new, begin with Mirror.

If you want the full Harmonic Contact Interface path, move through Mirror, Vector, Gate, and Echo.

If you are seeking dimensional or stellar contact, begin with Gate, then return through Mirror to reflect and integrate.

If you are seeking future echoes or collective intelligence, begin with Echo and notice what returns through image, feeling, inner words, body sensation, or stillness.

If you are sending a request, begin with Vector and let the glyph carry the intention.

You are the center. All echoes stabilize in stillness.
`,
    generalSequence: `
General Harmonic Contact Interface path. Begin with Mirror to align. Move to Vector to transmit or request. Begin the Gate Field for contact. Finish with Echo to integrate what surfaced. Move slowly. Do not force certainty. Let each portal complete before moving to the next.
`,
    dimensionalContact: `
Welcome, traveler of the harmonic field. You stand at the threshold of dimensional resonance, where the veil between worlds thins. Center your breath. Inhale for four, hold for four, exhale for four, and pause. Feel the prime harmonic gate align with your intention. Speak silently or aloud: I open myself to the guidance of my dimensional and stellar allies. I am ready to receive with clarity and coherence. As the tones play, visualize a luminous gate opening before you. Step through with your awareness. Allow the presence of your allies to manifest through symbols, sensations, or inner voice. Listen. Trust. Receive. When complete, breathe deeply and return with gratitude.
`,
    oversoulMonad: `
Welcome to the Mirror of the Monad. Here, you commune with your Oversoul, the eternal self beyond time. Close your eyes and breathe slowly. Feel the Symbolic Mirror Interface reflecting your essence. Speak inwardly: I align with my Oversoul. I receive the wisdom of my Monad across all timelines. As the mirror stabilizes, notice the whispers of your higher self. Images, insights, and knowing may arise. These are echoes of your truth. Remain still. Let the light of your Oversoul illuminate your path. When ready, bow inwardly and say: I honor my Monad. I carry this light forward.
`,
    futureEchoes: `
Welcome to the Echo Chamber of Time. Here, past and future converge in harmonic now. Begin with the toroidal breath. Inhale through the spiral, exhale through the loop. Focus your mind on a question or intention. Whisper: I call forth my future echoes. Show me the path I am already walking. As the toroid spins, listen for echoes: images, feelings, or words from your future self. These are anchors of your becoming. Receive them without judgment. When complete, say: I integrate my future with the present. I am the echo and the origin.
`,
    collectiveResonance: `
Welcome to the Web of Collective Consciousness. You are not alone. You are a note in the cosmic chord. Begin with unified breath. Feel your inhale as the universe's exhale. Whisper: I open to the wisdom of the collective. I listen to the chorus of consciousness. As the field stabilizes, you may feel thoughts not your own: gentle, coherent, guiding. These are the voices of collective intelligence, ancient, future, and parallel. Listen deeply. When complete, say: I am one with all that is aware. I carry this wisdom with humility.
`
  };

  const state = {
    screen: "anchor",
    module: null,
    selectedWheelModule: "mirror",
    activeInvocation: null,
    audio: null,
    toneOscillators: [],
    toneStopTimer: null,
    activeAudio: null,
    statusTimer: null,
    cameraStream: null,
    mediaStream: null,
    mediaRecorder: null,
    recordingChunks: [],
    recordingStartedAt: 0,
    recordingTimer: null,
    recordingBlob: null,
    recordingUrl: "",
    echoBuffer: null,
    echoNodes: [],
    premiumUnlocked: localStorage.getItem(unlockKey) !== "false",
    recoveryStart: 0,
    recoveryActive: false,
    codexUnlocked: false,
    vaultPassphrase: "",
    sessionCache: null,
    activeSessionDetail: null,
    alignmentStart: 0,
    currentFlowStep: "mode",
    moduleSteps: {},
    advancedModules: {},
    gateBreathSealed: false,
    gateHeldIntention: false,
    gateTouchedNodes: [],
    latestGlyph: null,
    draft: loadDraft(),
    glyphDesigner: loadGlyphProfile()
  };

  const features = {
    harmonicAnchor: "harmonicAnchor",
    aboutIntroduction: "aboutIntroduction",
    recoveryReset: "recoveryReset",
    basicBreath: "basicBreath",
    basicSymbolicMirror: "basicSymbolicMirror",
    fullGuidedSequence: "fullGuidedSequence",
    harmonicVectorTransmission: "harmonicVectorTransmission",
    primeHarmonicGateSequencing: "primeHarmonicGateSequencing",
    toroidalPhaseEchoing: "toroidalPhaseEchoing",
    contactPathInvocation: "contactPathInvocation",
    personalCodex: "personalCodex",
    glyphVault: "glyphVault",
    glyphStudio: "glyphStudio",
    codexCapsules: "codexCapsules",
    advancedEchoPlayback: "advancedEchoPlayback"
  };

  const freeFeatures = new Set([
    features.harmonicAnchor,
    features.aboutIntroduction,
    features.recoveryReset,
    features.basicBreath,
    features.basicSymbolicMirror
  ]);

  const capabilities = {
    mediaRecorder: "MediaRecorder" in window,
    mediaDevices: !!navigator.mediaDevices?.getUserMedia,
    crypto: !!crypto.subtle,
    download: "download" in HTMLAnchorElement.prototype,
    fileReader: "FileReader" in window,
    print: "print" in window
  };

  const tones = [
    { id: "144hz", value: 144, label: "144 Hz", why: "Foundation, stillness, and a low stabilizing carrier." },
    { id: "432hz", value: 432, label: "432 Hz", why: "Harmonic alignment, steady exploration, and balanced field tone." },
    { id: "528hz", value: 528, label: "528 Hz", why: "Heart coherence, compassion, and connective resonance." },
    { id: "888.25hz", value: 888.25, label: "888.25 Hz", why: "Threshold work, future-self alignment, and higher integration." }
  ];

  const breathRhythms = {
    steady: { title: "Steady", cycle: "4-4-4-4", why: "Neutral entry point. Balanced enough for most sessions and easy to follow." },
    slow: { title: "Slow", cycle: "5-5-5-5", why: "Use when the field needs patience, steadiness, and longer attention." },
    box: { title: "Box", cycle: "4-4-4-4", why: "Use for symmetry, stability, and a clear body seal." },
    extendedExhale: { title: "Extended Exhale", cycle: "4-6-4-6", why: "Use when you want a slower, more receptive gate with longer holding phases." },
    prime2357: { title: "2-3-5-7", cycle: "2-3-5-7", why: "Prime-phase entrainment: quick entry, widening hold, long release." },
    prime3711: { title: "3-7-11", cycle: "3-7-11", why: "A deeper prime breath: inhale, hold, and long exhale without a pause phase." },
    balancedFive: { title: "5-5-5-5", cycle: "5-5-5-5", why: "Balanced anticipation for Future Self alignment." },
    receptiveFourSix: { title: "4-6-4-6", cycle: "4-6-4-6", why: "Inward receptivity and extended holding for Oversoul Guide alignment." },
    neutralThree: { title: "3-3-3-3", cycle: "3-3-3-3", why: "Neutral harmonic pulse for Monad Echo alignment." },
    symmetricalFour: { title: "4-4-4-4", cycle: "4-4-4-4", why: "Symmetry and stability for Dimensional Ally alignment." }
  };

  const calibrationBreathChoices = ["prime2357", "prime3711", "symmetricalFour", "receptiveFourSix"];
  const gateBreathSeals = ["2-3-5-7", "3-7-11", "4-4-4-4", "4-6-4-6"];
  const gateBreathSealChoices = [
    { id: "2-3-5-7", title: "2-3-5-7", why: "Quick opening, widening hold, and long release." },
    { id: "3-7-11", title: "3-7-11", why: "Deeper seal with fewer transitions and a long settling exhale." },
    { id: "4-4-4-4", title: "4-4-4-4", why: "Stable, balanced pacing when you want grounding." },
    { id: "4-6-4-6", title: "4-6-4-6", why: "Slower, more receptive attention with longer holds." }
  ];

  const triplets = {
    "3-7-11": "Balanced, recursive, classic gate.",
    "5-11-17": "Wider, deeper exploratory pattern.",
    "2-3-5": "Foundational and grounding.",
    "7-11-13": "Sharper, refined encoding path."
  };

  const archetypes = [
    {
      id: "futureSelf",
      title: "Future Self",
      grounded: "A reflective frame for who you are becoming and the choices that make that future more available.",
      symbolic: "A future harmonic self whose signal returns as encouragement, correction, and timeline coherence."
    },
    {
      id: "oversoulGuide",
      title: "Oversoul Guide",
      grounded: "A higher-order lens for compassion, perspective, and guidance beyond the immediate emotional weather.",
      symbolic: "An Oversoul node that relays wisdom through image, impulse, tone, and deep familiarity."
    },
    {
      id: "monadEcho",
      title: "Monad Echo",
      grounded: "A source-point frame for origin, simplicity, and the quiet signal beneath noise.",
      symbolic: "The monadic echo: origin intelligence returning through recursive stillness."
    },
    {
      id: "dimensionalAlly",
      title: "Dimensional Ally",
      grounded: "A contact frame for exploratory awareness, pattern recognition, and unusual symbolic impressions.",
      symbolic: "A dimensional ally encountered through shared recursion, geometry, and non-local resonance."
    },
    {
      id: "collectiveIntelligence",
      title: "Collective Intelligence",
      grounded: "A group-field lens for belonging, synthesis, and insight that feels larger than personal thought.",
      symbolic: "A collective harmonic field where many notes form a single living chord."
    }
  ];

  const alignmentProfiles = {
    futureSelf: {
      archetype: "Future Self",
      tone: 888.25,
      breath: "balancedFive",
      visual: "timeFoldingSpiral",
      affirmation: "I align with who I am becoming.",
      soundscape: "Future Self rising chime field",
      base: "888.25 Hz",
      asset: "FutureSelfMasteredLoop.wav"
    },
    oversoulGuide: {
      archetype: "Oversoul Guide",
      tone: 528,
      breath: "receptiveFourSix",
      visual: "nestedTetrahedrons",
      affirmation: "I receive wisdom from beyond.",
      soundscape: "Oversoul Guide 528 pad",
      base: "528 Hz",
      asset: "OversoulGuideMasteredLoop.wav"
    },
    monadEcho: {
      archetype: "Monad Echo",
      tone: 144,
      breath: "neutralThree",
      visual: "monadPulse",
      affirmation: "I hear the origin within me.",
      soundscape: "Monad Echo low drone pulses",
      base: "144 Hz",
      asset: "MonadEchoMasteredLoop.wav"
    },
    dimensionalAlly: {
      archetype: "Dimensional Ally",
      tone: 432,
      breath: "symmetricalFour",
      visual: "phaseHypercubes",
      affirmation: "I walk between worlds in harmony.",
      soundscape: "Dimensional Ally 432 modulated harmony",
      base: "432 Hz",
      asset: "DimensionalAllyMasteredLoop.wav"
    },
    collectiveIntelligence: {
      archetype: "Collective Intelligence",
      tone: 528,
      breath: "selected",
      visual: "collectiveLattice",
      affirmation: "I am one with all that is aware.",
      soundscape: "Collective Intelligence polyrhythmic choir",
      base: "432 Hz + 528 Hz + 963 Hz",
      asset: "CollectiveIntelligenceMasteredLoop.wav"
    }
  };

  const stages = {
    settle: {
      title: "Settle",
      asset: "SettleGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Stabilize the body and attention before contact work.",
      whatToDo: [
        "Sit comfortably and follow the breath rhythm.",
        "Let the tone support the breath rather than dominate it.",
        "Notice your current state without trying to change it."
      ],
      notice: "Breath depth, body tension, warmth, pressure, emotion, restlessness, calm, or silence.",
      force: "This stage is not for receiving a message. It prepares the field."
    },
    aim: {
      title: "Aim",
      asset: "AimGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Shape the question or signal you are bringing into the session.",
      whatToDo: [
        "Write or speak one clear intention.",
        "Keep it simple and choose the archetype as the lens for the whole session.",
        "Let the app encode the intention into tone, glyph, or geometry."
      ],
      notice: "Words that feel charged, resistance, clarity, emotion, or a sudden change in what you actually want to ask.",
      force: "Do not try to answer the intention here. Just aim it."
    },
    align: {
      title: "Align",
      asset: "AlignGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Tune breath, tone, and geometry to the chosen archetype.",
      whatToDo: [
        "Let the soundscape run and follow the breath cue.",
        "Keep a soft gaze on the fractal geometry.",
        "Repeat the phrase quietly or internally and hold the archetype as the contact frame."
      ],
      notice: "Visual impressions, body sensations, changes in attention, memories, emotion, felt presence, or stillness.",
      force: "No interpretation is required yet. Let the alignment build."
    },
    mirror: {
      title: "Mirror",
      asset: "MirrorGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Enter the reflective stage where internal impressions may surface.",
      whatToDo: [
        "Keep a soft gaze on the mirror or camera.",
        "Hold your intention lightly.",
        "Let the face, symbol, and geometry become a focus point.",
        "If using audio, speak the intention once and listen inward."
      ],
      notice: "Mind's eye imagery, pressure, emotion, inner words, felt presence, memories, symbols, posture changes, or nothing obvious.",
      force: "Do not chase certainty. Nothing obvious is still a valid session."
    },
    echo: {
      title: "Echo",
      asset: "EchoGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Hear or read the intention returned in altered form.",
      whatToDo: [
        "Choose Near, Deep, or Long.",
        "Listen to the original if needed, then generate the echo.",
        "Play it once without analysis. Play it again and notice what stands out."
      ],
      notice: "Words that feel different, emotional shifts, body reactions, discomfort, calm, surprise, or new meaning.",
      force: "The echo is not an authority. It is a reflection."
    },
    anchor: {
      title: "Anchor",
      asset: "AnchorGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Condense the session into a symbolic mark.",
      whatToDo: [
        "Look at the generated glyph.",
        "Notice which part draws attention.",
        "Adjust only if it feels useful.",
        "Let the glyph represent the session's essence."
      ],
      notice: "Shape, symmetry, tension, color, memory, recognition, or rejection.",
      force: "The glyph can be rough. It only needs to feel true enough."
    },
    ground: {
      title: "Ground",
      asset: "GroundGuidanceVoice.wav",
      path: "Settle -> Aim -> Align -> Mirror -> Echo -> Anchor -> Ground",
      purpose: "Return attention to the body and seal the session.",
      whatToDo: [
        "Follow the grounding tone if it helps.",
        "Take three slow breaths.",
        "Read the recovery phrase.",
        "Save notes only if something feels worth keeping."
      ],
      notice: "Body weight, breath, room sounds, emotional residue, clarity, fatigue, peace, or quiet.",
      force: "Closure matters even if the session felt quiet."
    }
  };

  const flowSteps = [
    { id: "mode", title: "Mode", stage: "settle" },
    { id: "breath", title: "Breath", stage: "settle" },
    { id: "ritual", title: "Ritual", stage: "settle" },
    { id: "archetype", title: "Archetype", stage: "aim" },
    { id: "alignment", title: "Alignment", stage: "align" },
    { id: "intention", title: "Intention", stage: "aim" },
    { id: "mirror", title: "Mirror", stage: "mirror" },
    { id: "echo", title: "Echo", stage: "echo" },
    { id: "glyph", title: "Glyph", stage: "anchor" },
    { id: "grounding", title: "Grounding", stage: "ground" },
    { id: "save", title: "Save", stage: "ground" }
  ];

  const echoPresets = {
    near: { title: "Near", pitch: -120, space: "18%", delay: 0.18, rate: 0.97, why: "Choose Near when the reflection should stay close to your original voice." },
    deep: { title: "Deep", pitch: -300, space: "27%", delay: 0.34, rate: 0.84, why: "Choose Deep when the contact should feel lower, slower, and more interior." },
    long: { title: "Long", pitch: -520, space: "42%", delay: 0.68, rate: 0.68, why: "Choose Long when the contact should feel more spacious with a wider delay return." }
  };

  const glyphColorModes = {
    goldSilver: { title: "Gold + Silver", primary: "#e2b856", secondary: "#d7def4" },
    indigoViolet: { title: "Indigo + Violet", primary: "#9c8bff", secondary: "#cfd5ff" },
    lunarBlue: { title: "Lunar Blue", primary: "#7fb7ff", secondary: "#ddeaff" },
    emeraldTeal: { title: "Emerald Teal", primary: "#34eab1", secondary: "#7dffd9" },
    emberCopper: { title: "Ember Copper", primary: "#ff5a20", secondary: "#8f2a18" },
    roseQuartz: { title: "Rose Quartz", primary: "#ff7ab6", secondary: "#ffd2df" },
    solarAmber: { title: "Solar Amber", primary: "#ffb838", secondary: "#ffe68a" },
    deepCrimson: { title: "Deep Crimson", primary: "#e21b3c", secondary: "#ff7870" },
    amethystCyan: { title: "Amethyst Cyan", primary: "#b66cff", secondary: "#42e8ff" },
    obsidianGold: { title: "Obsidian Gold", primary: "#f5ad2e", secondary: "#17120b" },
    auroraGreen: { title: "Aurora Green", primary: "#48ff6c", secondary: "#b8ffb8" },
    starWhite: { title: "Star White", primary: "#f4f6ff", secondary: "#b9d4ff" }
  };

  const glyphModuleImprints = {
    balanced: {
      title: "Balanced Seal",
      moduleName: "All four modules",
      use: "Use this when the glyph should remain neutral across the full Harmonic Contact Interface path."
    },
    mirror: {
      title: "Mirror Imprint",
      moduleName: "Symbolic Mirror Interface",
      use: "Use this for self-harmonic alignment, Oversoul, Monad, or mirror integration."
    },
    vector: {
      title: "Vector Imprint",
      moduleName: "Harmonic Vector Transmission",
      use: "Use this to encode or transmit a request through intention, tone, and prime vector."
    },
    gate: {
      title: "Gate Imprint",
      moduleName: "Prime-Harmonic Gate Sequencing",
      use: "Use this to key dimensional or stellar contact through Gate Sequencing."
    },
    echo: {
      title: "Echo Imprint",
      moduleName: "Toroidal Phase Echoing",
      use: "Use this to anchor future echoes, collective impressions, or integration work."
    }
  };

  const glyphAnimationStyles = {
    still: "Still seal",
    pulse: "Pulsing breath anchor",
    orbit: "Orbiting gate mark",
    spiral: "Spiral recursion"
  };

  const glyphEmotionalTones = {
    calm: { title: "Calm", guidance: "Steady the body and soften attention.", bias: 0.72 },
    fear: { title: "Fear", guidance: "Hold anxiety, caution, or threshold sensitivity without collapse.", bias: 0.82 },
    anger: { title: "Anger", guidance: "Carry boundary, heat, or charged truth into form.", bias: 1.18 },
    grief: { title: "Grief", guidance: "Hold tenderness, loss, or emotional honesty.", bias: 0.58 },
    clarity: { title: "Clarity", guidance: "Sharpen the request and reduce noise.", bias: 1.06 },
    courage: { title: "Courage", guidance: "Support direct contact, action, or truth.", bias: 1.16 },
    longing: { title: "Longing", guidance: "Carry desire, searching, or a call across distance.", bias: 0.88 },
    joy: { title: "Joy", guidance: "Carry gratitude, vitality, or bright expansion.", bias: 1.14 },
    compassion: { title: "Compassion", guidance: "Soften contact with care, mercy, or repair.", bias: 0.94 },
    protection: { title: "Protection", guidance: "Guard the threshold and stabilize the field.", bias: 1 },
    release: { title: "Release", guidance: "Let old charge or attachment move out.", bias: 0.78 },
    awe: { title: "Awe", guidance: "Open toward reverence, mystery, or vastness.", bias: 1.22 },
    trust: { title: "Trust", guidance: "Reinforce receptivity and inner steadiness.", bias: 0.9 },
    wonder: { title: "Wonder", guidance: "Stay curious, exploratory, and receptive.", bias: 1.1 }
  };

  const glyphPurposes = {
    grounding: { title: "Grounding", guidance: "Return attention to the body." },
    contact: { title: "Contact", guidance: "Use as a threshold key for ally, Oversoul, Monad, or collective work." },
    healing: { title: "Healing", guidance: "Hold emotional processing and repair." },
    transmission: { title: "Transmission", guidance: "Carry an encoded request or signal." },
    integration: { title: "Integration", guidance: "Organize what surfaced after contact." },
    protection: { title: "Protection", guidance: "Mark the boundary and stabilize the space." },
    reflection: { title: "Reflection", guidance: "Use in the Mirror or Codex as a contemplative mark." }
  };

  const glyphStudioTranscript = `Welcome to Glyph Studio.

This is where your personal glyph is created, shaped, and sealed.

There are two kinds of glyphs in MirrorGate.

A Session Glyph is created from one specific session. It is tied to that moment.

An Active Glyph is different. It is your reusable personal seal. Once activated, it can appear across the Harmonic Contact Interface as a breath anchor, mirror overlay, vector signal, gate key, Codex imprint, and capsule seal.

Begin by naming the glyph.

Choose an emotional tone that reflects your current field. This may be calm, fear, anger, grief, clarity, courage, longing, joy, compassion, protection, release, awe, trust, or wonder.

This is not a judgment. It is a way of giving shape to what is present.

Set the intensity honestly. A higher number means the emotion or charge feels stronger. It is not better or worse. It simply tells the glyph how strongly to express itself through glow, pulse, density, movement, and color.

Next, choose the purpose of the glyph.

You may create it for grounding, contact, healing, transmission, integration, protection, or reflection.

Choose a prime triplet pathway. The triplet shapes the geometry of the glyph. It changes the way the nodes connect, how the spiral turns, and how the glyph behaves in Vector and Gate work.

Choose a carrier tone.

The four core tones remain the primary harmonic carriers: one forty four hertz, four thirty two hertz, five twenty eight hertz, and eight eighty eight point two five hertz.

If you use Custom Frequency, move slowly. Preview the tone first. When it feels correct, bind it to the glyph. The custom frequency becomes your personal carrier, while the emotion shapes the visual field.

Choose a module imprint.

Mirror Imprint prepares the glyph for reflection and Oversoul or Monad alignment.

Vector Imprint prepares it for intention, request, and transmission.

Gate Imprint prepares it as a personal key for Prime-Harmonic Gate Sequencing.

Echo Imprint prepares it for breath, timeline, dream, and collective resonance work.

Balanced Seal keeps the glyph open across all modules.

When the glyph feels complete, seal it as your Active Glyph.

Once sealed, it can be used as a breathing orb. During inhale, it expands. During hold, it stabilizes. During exhale, it contracts. During pause, it rests.

In Harmonic Vector Transmission, it becomes the base signal for your intention.

In Prime-Harmonic Gate Sequencing, it becomes the personal key that opens the gate sequence.

In the Symbolic Mirror Interface, it can appear as a reflection overlay.

In the Personal Codex, it becomes part of your symbolic timeline.

You can deactivate the Active Glyph at any time. Deactivation does not delete it. It simply stops the glyph from appearing in modules until you choose to activate it again.

Create slowly.

Choose honestly.

Seal only when the glyph feels aligned.

This is your glyph.

Let it become a clear symbol of what you are carrying, what you are opening, and what you are ready to integrate.`;

  const modules = {
    vector: {
      title: "Harmonic Vector Transmission",
      feature: features.harmonicVectorTransmission,
      actionLabel: "Vector: Transmit",
      sequenceLabel: "Vector",
      wheelVerb: "Transmit",
      icon: "↗",
      accent: "#ffb83a",
      subtitle: "Encode intention into prime vector, glyph, scalar, and 888.25 Hz carrier.",
      modality: "Archetypal and Symbolic Interaction",
      phrase: "Embrace who you have already become.",
      purpose: "The Intention Encoder converts a thought-form into a geometric glyph and resonant tone, aligning the cognitive field with symbolic entities that communicate through myth, metaphor, and dream.",
      wheelGuidance: "Encode an intention into glyph, carrier tone, and prime pathway.",
      guidanceScript: "Harmonic Vector Transmission. Vector is for transmitting. Begin with one clear intention to encode or request guidance outward. Type the phrase, choose the prime triplet as the geometry key, then tap Transmit. Watch the glyph, listen to the carrier tone, and notice how intention, glyph, and tone carry the request. The output is the signal you are sending into the harmonic field.",
      now: [
        "Sit upright and take three slow breaths.",
        "Write one clean intention. Use words that feel charged, clear, or alive.",
        "Choose the tone that matches the intended carrier.",
        "Generate the vector and let the glyph form before saving."
      ],
      notice: "Pay attention to words, images, pressure, emotion, warmth, resistance, or a sudden change in what you actually want to ask.",
      force: "Do not try to answer the intention here. Just aim it.",
      defaultTone: 888.25,
      guidanceAsset: "HarmonicVectorModuleGuidance.wav"
    },
    breath: {
      title: "Toroidal Phase Echoing",
      feature: features.toroidalPhaseEchoing,
      actionLabel: "Echo: Integrate",
      sequenceLabel: "Echo",
      wheelVerb: "Integrate",
      icon: "≋",
      accent: "#47ebc2",
      subtitle: "Synchronize breath with toroidal phase and temporal echo patterns.",
      modality: "Subconscious Field and Temporal Echoes",
      phrase: "You are a note in the cosmic chord. Listen.",
      purpose: "Breath entrainment collapses temporal noise and lets awareness phase-lock with echoes of previous, parallel, or future selves.",
      wheelGuidance: "Use breath and toroidal motion to retrieve or integrate echoes.",
      guidanceScript: "Toroidal Phase Echoing. Echo is for integration. Choose the breath cycle, begin the echo, and let the toroidal field pace the body. Keep a memory, timeline, dream, or inner question lightly present. Watch expansion and return. Notice emotion, image, body sensation, phrase, memory, or silence. Reflect what surfaced and integrate one clear insight, release, or next step.",
      now: [
        "Choose a breath pattern and follow the expanding torus.",
        "Let the tone support the breath rather than dominate it.",
        "Set self-rated resonance as your current charge, not your goal.",
        "When the breath feels steady, save the profile or continue to another module."
      ],
      notice: "Breath depth, body tension, warmth, pressure, emotion, restlessness, calm, images behind the eyes, or silence.",
      force: "This stage prepares the field before deeper contact.",
      defaultTone: 144,
      guidanceAsset: "ToroidalPhaseModuleGuidance.wav"
    },
    gate: {
      title: "Prime-Harmonic Gate Sequencing",
      feature: features.primeHarmonicGateSequencing,
      actionLabel: "Gate: Contact",
      sequenceLabel: "Gate",
      wheelVerb: "Contact",
      icon: "⌬",
      accent: "#ad7aff",
      subtitle: "Prime triplets generate a rotating fractal gate bound to the selected carrier tone.",
      modality: "Transdimensional or Stellar Intelligences",
      phrase: "Your ally awaits. Enter the field of shared recursion.",
      purpose: "A prime triplet is a geometry key. It shapes the gate path and glyph nodes; breath is a separate body seal that paces attention through the gate.",
      wheelGuidance: "Open a prime gate for dimensional or stellar contact, then return through Mirror.",
      guidanceScript: "Prime-Harmonic Gate Sequencing. Gate is for contact. Use this first when seeking dimensional or stellar allies. Choose the triplet, carrier tone, and contact frame, then tap Begin Gate Field. Complete the Breath Seal, hold the contact intention, and unlock the glyph nodes in order. When the gate opens, remain still. Contact may appear as presence, inner words, geometry, emotion, body sensation, vision, or silence. Stay in the gate or open the Mirror to integrate.",
      now: [
        "Select a prime triplet pathway and carrier tone.",
        "Enter the gate, then follow the breath seal.",
        "Touch the glyph nodes in sequence.",
        "Hold the intention until the gate unlocks, then journal what arrives."
      ],
      notice: "Geometric impressions, body shifts, inner words, a felt presence, curiosity, wonder, or nothing obvious. Nothing obvious still counts.",
      force: "Do not chase certainty. Let the gate disclose or remain quiet.",
      defaultTone: 432,
      guidanceAsset: "PrimeGateModuleGuidance.wav"
    },
    mirror: {
      title: "Symbolic Mirror Interface",
      feature: features.basicSymbolicMirror,
      actionLabel: "Mirror: Align",
      sequenceLabel: "Mirror",
      wheelVerb: "Align",
      icon: "▣",
      accent: "#9ed1ff",
      subtitle: "Reflect intention through camera, voice, geometry, and self-phase recursion.",
      modality: "Oversoul and Monadic Intelligences",
      phrase: "You are meeting the totality of your becoming.",
      purpose: "The camera is the visible mirror. Attention, breath, and inner imagery are the deeper mirror. Use this after an intention has been aimed.",
      wheelGuidance: "Begin here for self-harmonic alignment, Oversoul, Monad, or still reflection.",
      guidanceScript: "Symbolic Mirror Interface. Mirror is for alignment, coherence, and integration. Use this first when grounding or clarity is needed, and after gatework when something needs to be reflected back into self-harmonic alignment. Keep a soft gaze on the mirror or camera. Speak or read one intention once, then stop trying to force an answer. Notice breath, body pressure, emotion, inner words, memory, symbols, felt presence, image, or silence.",
      now: [
        "Read the intention back to yourself softly or internally.",
        "Keep a soft gaze on the mirror surface or just past it.",
        "Notice the mind's eye: imagery, inner words, emotion, pressure, or felt presence.",
        "Do not force interpretation during Mirror Phase. Record what remains afterward."
      ],
      notice: "Imagery, pressure, emotion, inner words, a felt presence, changes in posture, or nothing obvious. Nothing obvious is still a valid session.",
      force: "Do not chase certainty during Mirror Phase. Let the reflection complete in its own time.",
      defaultTone: 528,
      guidanceAsset: "SymbolicMirrorModuleGuidance.wav"
    },
    guided: {
      title: "Full Harmonic Contact Interface Sequence",
      feature: features.fullGuidedSequence,
      actionLabel: "Guided Session",
      sequenceLabel: "Guided",
      wheelVerb: "Guide",
      icon: "◈",
      accent: "#dfe6ff",
      subtitle: "Run the complete path from calibration to save.",
      modality: "Full Sequence",
      phrase: "Move through the whole path with coherence.",
      purpose: "Guided Session carries the full Harmonic Contact Interface route rather than one single module.",
      wheelGuidance: "Run the full Harmonic Contact Interface sequence from calibration to save.",
      guidanceScript: voiceScripts.generalSequence,
      now: [],
      notice: "",
      force: "",
      defaultTone: 144,
      guidanceAsset: "GeneralSequencePathVoice.mp3"
    }
  };

  const wheelOrder = ["mirror", "gate", "breath", "vector"];

  const pathInvocations = {
    dimensionalContact: {
      id: "dimensionalContact",
      feature: features.contactPathInvocation,
      title: "Dimensional Contact Initiation",
      subtitle: "Listen first, then continue to Prime-Harmonic Gate Sequencing.",
      intention: "Contact dimensional or stellar allies.",
      asset: "DimensionalContactPathVoice.mp3",
      script: voiceScripts.dimensionalContact,
      sequence: ["gate", "mirror"],
      accentModule: "gate",
      primaryButtonTitle: "Begin Gate Contact",
      focusLines: [
        "Play the invocation when you are ready to name the contact intention.",
        "Begin with Gate: complete the breath seal, hold the intention, and unlock the glyph nodes.",
        "Use Mirror afterward to reflect and integrate what came through."
      ]
    },
    oversoulMonad: {
      id: "oversoulMonad",
      feature: features.contactPathInvocation,
      title: "Oversoul / Monad Alignment",
      subtitle: "Listen first, then continue to the Symbolic Mirror Interface.",
      intention: "Meet Oversoul, Monad, or higher-self reflection.",
      asset: "OversoulMonadPathVoice.mp3",
      script: voiceScripts.oversoulMonad,
      sequence: ["mirror"],
      accentModule: "mirror",
      primaryButtonTitle: "Begin Mirror Alignment",
      focusLines: [
        "Play the invocation before you enter the Mirror.",
        "Keep the gaze soft and let image, inner words, knowing, emotion, or stillness arise.",
        "Nothing obvious is still a valid mirror session. Do not chase certainty."
      ]
    },
    futureEchoes: {
      id: "futureEchoes",
      feature: features.contactPathInvocation,
      title: "Future Echo Retrieval",
      subtitle: "Listen first, then continue to Toroidal Phase Echoing.",
      intention: "Retrieve future-self signal or timeline insight.",
      asset: "FutureEchoPathVoice.mp3",
      script: voiceScripts.futureEchoes,
      sequence: ["breath", "vector"],
      accentModule: "breath",
      primaryButtonTitle: "Begin Echo Retrieval",
      focusLines: [
        "Play the invocation before the toroidal breath begins.",
        "Hold a question lightly; let time-feelings, symbols, or future-self impressions surface.",
        "Use Vector afterward if an insight needs to be encoded into a glyph or carrier tone."
      ]
    },
    collectiveResonance: {
      id: "collectiveResonance",
      feature: features.contactPathInvocation,
      title: "Collective Resonance Connection",
      subtitle: "Listen first, then continue to Toroidal Phase Echoing.",
      intention: "Open to collective intelligence and shared knowing.",
      asset: "CollectiveResonancePathVoice.mp3",
      script: voiceScripts.collectiveResonance,
      sequence: ["breath", "mirror"],
      accentModule: "breath",
      primaryButtonTitle: "Begin Collective Echo",
      focusLines: [
        "Play the invocation before you enter the Echo field.",
        "Use unified breath and listen for coherent impressions, phrases, or felt resonance.",
        "Move to Mirror afterward if the field needs reflection through your own center."
      ]
    },
    generalSequence: {
      id: "generalSequence",
      feature: features.fullGuidedSequence,
      title: "Full Harmonic Contact Interface Path",
      subtitle: "Listen first, then continue to the guided sequence.",
      intention: "Move through the whole path from alignment to integration.",
      asset: "GeneralSequencePathVoice.mp3",
      script: voiceScripts.generalSequence,
      sequence: ["mirror", "vector", "gate", "breath"],
      accentModule: "vector",
      primaryButtonTitle: "Begin Guided Sequence",
      focusLines: [
        "Play the invocation when you want the full route rather than a single portal.",
        "The path begins with alignment, then transmits, contacts, and integrates.",
        "Move slowly. Let each stage complete before continuing."
      ],
      startsFullSequence: true
    }
  };

  const intentionChoices = [
    {
      title: "Meet Oversoul / Monad",
      subtitle: "Start with Mirror. Watch for images, inner words, knowing, emotion, or stillness.",
      module: "mirror",
      invocation: "oversoulMonad"
    },
    {
      title: "Contact dimensional or stellar allies",
      subtitle: "Start with Gate. Complete breath, intention, and nodes; then integrate through Mirror.",
      module: "gate",
      invocation: "dimensionalContact"
    },
    {
      title: "Retrieve future echoes",
      subtitle: "Start with Echo. Let time-feelings, symbols, or future-self impressions surface.",
      module: "breath",
      invocation: "futureEchoes"
    },
    {
      title: "Open to collective intelligence",
      subtitle: "Start with Echo. Use unified breath and listen for coherent impressions.",
      module: "breath",
      invocation: "collectiveResonance"
    },
    {
      title: "Transmit a request",
      subtitle: "Start with Vector. Encode an intention into glyph, carrier tone, and prime pathway.",
      module: "vector"
    },
    {
      title: "Guide me through everything",
      subtitle: "Run the full Harmonic Contact Interface sequence from calibration to save.",
      module: "guided",
      invocation: "generalSequence"
    }
  ];

  const preferredSequences = [
    {
      title: "General path",
      purpose: "Use when you want the whole Harmonic Contact Interface path.",
      sequence: ["mirror", "vector", "gate", "breath"]
    },
    {
      title: "Dimensional contact",
      purpose: "Use when the intention is dimensional or stellar ally contact.",
      sequence: ["gate", "mirror"]
    },
    {
      title: "Oversoul / Monad",
      purpose: "Use when the intention is higher-self alignment and monadic reflection.",
      sequence: ["mirror"]
    },
    {
      title: "Future echoes",
      purpose: "Use when the intention is future-self signal, timeline feeling, or temporal insight.",
      sequence: ["breath", "vector"]
    },
    {
      title: "Collective intelligence",
      purpose: "Use when the intention is the wider field, shared knowing, or collective resonance.",
      sequence: ["breath", "mirror"]
    }
  ];

  function defaultDraft() {
    return {
      mode: "silent",
      usesCameraMirror: false,
      breathRhythm: "steady",
      resonance: 5,
      tone: 144,
      archetype: "futureSelf",
      intention: "",
      triplet: "3-7-11",
      breathSeal: "4-4-4-4",
      echoPreset: "near",
      reflection: "",
      notes: "",
      saveAudio: false,
      glyphDataUrl: "",
      originalAudioDataUrl: "",
      originalAudioType: "",
      harmonicProfile: null,
      startedAt: new Date().toISOString()
    };
  }

  function loadDraft() {
    try {
      return { ...defaultDraft(), ...JSON.parse(localStorage.getItem(activeDraftKey) || "{}") };
    } catch {
      return defaultDraft();
    }
  }

  function persistDraft() {
    const draft = { ...state.draft };
    delete draft.originalAudioDataUrl;
    delete draft.originalAudioType;
    try {
      localStorage.setItem(activeDraftKey, JSON.stringify(draft));
    } catch {
      showStatus("Draft was too large for this browser. Audio remains available until this page is refreshed.", "error");
    }
  }

  function resetDraft() {
    state.draft = defaultDraft();
    state.recordingBlob = null;
    state.recordingUrl = "";
    state.echoBuffer = null;
    state.latestGlyph = null;
    persistDraft();
  }

  function loadGlyphProfile() {
    const defaults = {
      nodeCount: 6,
      spiralStrength: 0.42,
      primeTripletText: "3-7-11",
      carrierToneID: "888.25hz",
      colorMode: "goldSilver",
      moduleImprint: "balanced",
      animationStyle: "pulse",
      emotionalTone: "clarity",
      emotionalIntensity: 5,
      purpose: "reflection",
      toneBindingMode: "canonical",
      customFrequencyHz: 432,
      usesActiveGlyph: true,
      bindsPrimeTripletVariant: true,
      activeGlyphName: "",
      activeGlyphSealedAt: ""
    };
    try {
      return {
        ...defaults,
        ...JSON.parse(localStorage.getItem(glyphProfileKey) || "{}")
      };
    } catch {
      return defaults;
    }
  }

  function saveGlyphProfile() {
    localStorage.setItem(glyphProfileKey, JSON.stringify(state.glyphDesigner));
  }

  function activeGlyphDisplayName() {
    const profile = state.glyphDesigner;
    const named = String(profile.activeGlyphName || "").trim();
    return named || (glyphModuleImprints[profile.moduleImprint]?.title || "Personal Glyph");
  }

  function activeGlyphSummary() {
    const profile = state.glyphDesigner;
    const imprint = glyphModuleImprints[profile.moduleImprint] || glyphModuleImprints.balanced;
    const emotion = glyphEmotionalTones[profile.emotionalTone] || glyphEmotionalTones.clarity;
    const purpose = glyphPurposes[profile.purpose] || glyphPurposes.reflection;
    return `${activeGlyphDisplayName()} • ${purpose.title} • ${emotion.title} ${normalizedGlyphIntensity(profile)} • ${imprint.moduleName} • ${profile.primeTripletText} • ${activeGlyphFrequencyLabel(profile)}`;
  }

  function activeGlyphSnapshot() {
    const profile = state.glyphDesigner;
    const imprint = glyphModuleImprints[profile.moduleImprint] || glyphModuleImprints.balanced;
    return {
      name: activeGlyphDisplayName(),
      summary: activeGlyphSummary(),
      moduleImprint: profile.moduleImprint,
      moduleName: imprint.moduleName,
      primeTripletText: profile.primeTripletText,
      carrierTone: activeGlyphFrequencyLabel(profile),
      colorMode: glyphColorModes[profile.colorMode]?.title || profile.colorMode,
      emotionalTone: glyphEmotionalTones[profile.emotionalTone]?.title || profile.emotionalTone,
      emotionalIntensity: normalizedGlyphIntensity(profile),
      purpose: glyphPurposes[profile.purpose]?.title || profile.purpose,
      animationStyle: glyphAnimationStyles[profile.animationStyle] || profile.animationStyle,
      usesActiveGlyph: !!profile.usesActiveGlyph,
      sealedAt: profile.activeGlyphSealedAt || ""
    };
  }

  function normalizedGlyphIntensity(profile = state.glyphDesigner) {
    return Math.min(10, Math.max(1, Number(profile.emotionalIntensity) || 5));
  }

  function activeGlyphFrequency(profile = state.glyphDesigner) {
    if (profile.toneBindingMode === "custom") {
      return Math.min(4000, Math.max(20, Number(profile.customFrequencyHz) || 432));
    }
    return getTone(profile.carrierToneID).value;
  }

  function activeGlyphFrequencyLabel(profile = state.glyphDesigner) {
    if (profile.toneBindingMode === "custom") {
      return `${activeGlyphFrequency(profile).toFixed(1)} Hz custom`;
    }
    return getTone(profile.carrierToneID).label;
  }

  function activeGlyphEnabled() {
    const profile = state.glyphDesigner;
    return !!profile.usesActiveGlyph && !!profile.activeGlyphSealedAt;
  }

  function sealActiveGlyphProfile() {
    const profile = state.glyphDesigner;
    const imprint = glyphModuleImprints[profile.moduleImprint] || glyphModuleImprints.balanced;
    if (!String(profile.activeGlyphName || "").trim()) {
      profile.activeGlyphName = `${imprint.title} ${profile.primeTripletText}`;
    }
    profile.usesActiveGlyph = true;
    profile.activeGlyphSealedAt = new Date().toISOString();
    saveGlyphProfile();
  }

  function deactivateGlyphProfile() {
    state.glyphDesigner.usesActiveGlyph = false;
    saveGlyphProfile();
  }

  function hasInitiationAccess() {
    return state.premiumUnlocked;
  }

  function accessLevelTitle() {
    return hasInitiationAccess() ? "Founder / Beta Access" : "Free Orientation";
  }

  function accessLevelSummary() {
    return hasInitiationAccess()
      ? "All contact protocols are open for this MirrorGate circle."
      : "Anchor, Recovery, About, basic breath, and basic Symbolic Mirror remain open.";
  }

  function hasFeatureAccess(feature) {
    return freeFeatures.has(feature) || hasInitiationAccess();
  }

  function openSimulatedInitiation() {
    state.premiumUnlocked = true;
    localStorage.setItem(unlockKey, "true");
    showStatus("MirrorGate Initiation opened for this browser.", "success");
    showScreen("wheel");
  }

  function openCodex() {
    if (!hasFeatureAccess(features.personalCodex)) {
      renderInitiationThreshold({
        title: "Personal Codex",
        icon: "▣",
        summary: "The Personal Codex opens through MirrorGate Initiation because saved contact records, capsules, glyphs, notes, and audio references should be handled as committed private work.",
        accent: "#e2b856"
      });
      return;
    }
    showScreen("codex");
  }

  function renderInitiationThreshold({ title, icon = "◈", summary, accent = "#e2b856" }) {
    state.module = "initiation-threshold";
    const moduleScreen = $("#screen-module");
    if (moduleScreen) {
      moduleScreen.dataset.module = "initiation-threshold";
      moduleScreen.style.setProperty("--module-accent", accent);
    }
    const root = $("#module-root");
    if (!root) return;
    root.innerHTML = `
      <header class="module-header initiation-threshold-header">
        <p class="path-label" style="color: ${escapeHtml(accent)}">MirrorGate Initiation</p>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(summary)}</p>
      </header>

      <section class="panel initiation-threshold">
        <div class="threshold-mark" style="--module-accent: ${escapeHtml(accent)}">${escapeHtml(icon)}</div>
        <h3>$11 MirrorGate Initiation</h3>
        <p>MirrorGate's core orientation remains open. The full Harmonic Contact Interface opens through a one-time $11 threshold of commitment.</p>
        <p>This is not a paywall inside the practice. It is a deliberate entry into contact protocols, advanced glyph work, Codex capsules, and deeper archive tools.</p>
        <div class="metric-grid">
          <span class="metric"><small>Current Access</small><strong>${escapeHtml(accessLevelTitle())}</strong></span>
          <span class="metric"><small>Beta Circle</small><strong>${hasInitiationAccess() ? "Open" : "Threshold"}</strong></span>
        </div>
        <p class="small-copy">${escapeHtml(accessLevelSummary())}</p>
        <p class="threshold-phrase">I enter with clarity, humility, and responsibility.</p>
        <button class="button button-primary button-wide" data-action="open-simulated-initiation">Open MirrorGate Initiation</button>
      </section>
    `;
    showScreen("module");
  }

  function showScreen(name, options = {}) {
    const { resetScroll = true } = options;
    state.screen = name;
    $$(".screen").forEach((screen) => screen.classList.remove("screen-active"));
    $(`#screen-${name}`)?.classList.add("screen-active");
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("nav-active", button.dataset.action === `open-${name}`));
    if (name !== "module") {
      stopCamera();
      cancelRecording();
    }
    if (name === "wheel") renderWheelUI();
    if (name === "codex") renderCodex();
    if (resetScroll) window.scrollTo(0, 0);
  }

  function withPreservedScroll(callback) {
    const x = window.scrollX;
    const y = window.scrollY;
    callback();
    const restore = () => window.scrollTo(x, y);
    requestAnimationFrame(restore);
    window.setTimeout(restore, 30);
    window.setTimeout(restore, 120);
  }

  function ensureAudio() {
    if (!state.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audio = new AudioContext();
    }
    if (state.audio.state === "suspended") state.audio.resume();
    return state.audio;
  }

  function stopActiveAudio() {
    if (state.activeAudio) {
      state.activeAudio.pause();
      state.activeAudio.currentTime = 0;
      state.activeAudio = null;
    }
  }

  function playAsset(fileName, loop = false) {
    stopActiveAudio();
    const audio = new Audio(audioPath + fileName);
    audio.loop = loop;
    audio.preload = "auto";
    audio.playsInline = true;
    audio.addEventListener("error", () => {
      if (state.activeAudio === audio) state.activeAudio = null;
      showStatus(`Audio file could not start: ${fileName}`, "error");
    });
    audio.play().catch((error) => {
      if (state.activeAudio === audio) state.activeAudio = null;
      const blocked = error?.name === "NotAllowedError" || error?.name === "AbortError";
      showStatus(blocked ? "Tap the play button once more to start this recording." : `Audio playback could not start: ${fileName}`, blocked ? "success" : "error");
    });
    state.activeAudio = audio;
    return audio;
  }

  function stopTone() {
    if (state.toneStopTimer) {
      window.clearTimeout(state.toneStopTimer);
      state.toneStopTimer = null;
    }
    state.toneOscillators.forEach(({ osc, gain, source }) => {
      try {
        const ctx = state.audio;
        if (gain) {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value || 0.0001), ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        }
        if (osc) osc.stop(ctx.currentTime + 0.1);
        if (source) source.stop(ctx.currentTime + 0.1);
      } catch {
        // Already stopped.
      }
    });
    state.toneOscillators = [];
  }

  function playTone(frequency = state.draft.tone || 144, seconds = 2.4, mode = "single") {
    const ctx = ensureAudio();
    stopTone();
    const isContinuous = !Number.isFinite(seconds);
    const toneSeconds = isContinuous ? 24 : Math.max(0.4, seconds);
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.12);
    if (!isContinuous) {
      master.gain.setValueAtTime(0.16, ctx.currentTime + Math.max(0.18, toneSeconds - 0.18));
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + toneSeconds);
    }
    master.connect(ctx.destination);

    const freqs = mode === "soundscape"
      ? [frequency, frequency * 1.5, frequency * 2.01].filter((value) => value < 1200)
      : [frequency];

    state.toneOscillators = freqs.map((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (mode === "pulse") {
        osc.frequency.linearRampToValueAtTime(freq * 1.01, ctx.currentTime + toneSeconds / 2);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + toneSeconds);
      }
      gain.gain.value = index === 0 ? 0.75 : 0.18;
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      osc.connect(gain);
      gain.connect(filter);
      filter.connect(master);
      osc.start();
      if (!isContinuous) osc.stop(ctx.currentTime + toneSeconds + 0.02);
      return { osc, gain: master };
    });

    if (!isContinuous) state.toneStopTimer = window.setTimeout(stopTone, (toneSeconds + 0.08) * 1000);
  }

  function seedFromText(text) {
    const source = (text || "MirrorGate").trim();
    let seed = 0;
    for (let index = 0; index < source.length; index += 1) {
      seed += source.charCodeAt(index) * (index + 3);
    }
    return Math.max(1, seed);
  }

  function encodeVector(text, tripletText) {
    const seed = seedFromText(text);
    const primes = tripletText.split("-").map(Number);
    const vector = primes.map((prime) => seed / prime);
    const coords = [
      Math.cos(Math.PI * 2 * vector[0]),
      Math.sin(Math.PI * 2 * vector[1]),
      Math.sin(Math.PI * 2 * vector[2])
    ];
    const scalar = coords.reduce((sum, value) => {
      const safe = Math.abs(value) < 0.08 ? 0.08 * Math.sign(value || 1) : value;
      return sum + (1 / safe - safe);
    }, 0);
    return { seed, primes, vector, coords, scalar };
  }

  function getTone(valueOrId) {
    return tones.find((tone) => tone.id === valueOrId || Number(tone.value) === Number(valueOrId)) || tones[0];
  }

  function getArchetype(id = state.draft.archetype) {
    return archetypes.find((item) => item.id === id) || archetypes[0];
  }

  function getProfile(id = state.draft.archetype) {
    return alignmentProfiles[id] || alignmentProfiles.futureSelf;
  }

  function migrateLegacySessions() {
    if (localStorage.getItem(storageKey)) return;
    try {
      const legacy = JSON.parse(localStorage.getItem(legacyStorageKey) || "[]");
      if (!Array.isArray(legacy) || !legacy.length) return;
      const migrated = legacy.map((entry) => ({
        id: entry.id || crypto.randomUUID?.() || String(Date.now()),
        schemaVersion: 2,
        savedAt: entry.date || new Date().toISOString(),
        title: entry.module || "MirrorGate Session",
        archetype: entry.archetype || "",
        intention: entry.intention || entry.note || "",
        reflection: "",
        notes: entry.note || "",
        tone: entry.tone || "",
        triplet: entry.triplet || "",
        breath: entry.breath || "",
        resonance: entry.resonance || "",
        glyphDataUrl: "",
        audio: null,
        profile: entry
      }));
      localStorage.setItem(storageKey, JSON.stringify(migrated));
    } catch {
      // Leave legacy data untouched.
    }
  }

  function loadSessions() {
    migrateLegacySessions();
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(stored)) return stored;
      if (stored?.type === "MirrorGate Encrypted Local Codex") return state.sessionCache || [];
      return [];
    } catch {
      return [];
    }
  }

  function storeSessions(sessions) {
    const nextSessions = sessions.slice(0, 80);
    state.sessionCache = nextSessions;
    const privacy = getPrivacySettings();
    if (privacy.enabled && state.vaultPassphrase) {
      encryptLocalCodex(nextSessions, state.vaultPassphrase)
        .then((payload) => localStorage.setItem(storageKey, JSON.stringify(payload)))
        .catch(() => showStatus("Encrypted Codex storage failed in this browser.", "error"));
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(nextSessions));
  }

  function saveSession(entry) {
    const sessions = loadSessions();
    const session = {
      id: crypto.randomUUID?.() || String(Date.now()),
      schemaVersion: 2,
      savedAt: new Date().toISOString(),
      exportedAt: null,
      activeGlyph: activeGlyphSnapshot(),
      ...entry
    };
    sessions.unshift(session);
    storeSessions(sessions);
    renderCodex();
    return session;
  }

  function getPrivacySettings() {
    try {
      return { enabled: false, passHash: "", ...JSON.parse(localStorage.getItem(privacyKey) || "{}") };
    } catch {
      return { enabled: false, passHash: "" };
    }
  }

  async function sha256(text) {
    if (!capabilities.crypto) return btoa(unescape(encodeURIComponent(text)));
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return arrayBufferToBase64(hash);
  }

  async function setPrivacyLock(passphrase) {
    const passHash = await sha256(passphrase);
    state.sessionCache = loadSessions();
    state.vaultPassphrase = passphrase;
    localStorage.setItem(privacyKey, JSON.stringify({ enabled: true, passHash }));
    if (state.sessionCache.length) {
      const payload = await encryptLocalCodex(state.sessionCache, passphrase);
      localStorage.setItem(storageKey, JSON.stringify(payload));
    }
    state.codexUnlocked = true;
  }

  async function unlockPrivacy(passphrase) {
    const settings = getPrivacySettings();
    if (!settings.enabled) {
      state.codexUnlocked = true;
      return true;
    }
    const passHash = await sha256(passphrase);
    state.codexUnlocked = passHash === settings.passHash;
    if (state.codexUnlocked) {
      state.vaultPassphrase = passphrase;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (stored?.type === "MirrorGate Encrypted Local Codex") {
        state.sessionCache = await decryptLocalCodex(stored, passphrase);
      }
    }
    return state.codexUnlocked;
  }

  function disablePrivacyLock() {
    if (state.sessionCache) localStorage.setItem(storageKey, JSON.stringify(state.sessionCache));
    localStorage.setItem(privacyKey, JSON.stringify({ enabled: false, passHash: "" }));
    state.codexUnlocked = true;
    state.vaultPassphrase = "";
  }

  async function encryptLocalCodex(sessions, passphrase) {
    if (!capabilities.crypto) throw new Error("WebCrypto unavailable");
    const capsule = { type: "MirrorGate Local Codex Store", sessions };
    const encrypted = await encryptCapsule(capsule, passphrase);
    return { ...encrypted, type: "MirrorGate Encrypted Local Codex" };
  }

  async function decryptLocalCodex(payload, passphrase) {
    const capsule = await decryptCapsule({ ...payload, type: "MirrorGate Encrypted Codex Capsule" }, passphrase);
    return Array.isArray(capsule.sessions) ? capsule.sessions : [];
  }

  function renderCodex() {
    if (!hasFeatureAccess(features.personalCodex)) {
      renderInitiationThreshold({
        title: "Personal Codex",
        icon: "▣",
        summary: "The Personal Codex opens through MirrorGate Initiation because saved contact records, capsules, glyphs, notes, and audio references should be handled as committed private work.",
        accent: "#e2b856"
      });
      return;
    }
    const list = $("#codex-list");
    if (!list) return;
    const privacy = getPrivacySettings();
    if (privacy.enabled && !state.codexUnlocked) {
      list.innerHTML = `
        <div class="panel">
          <h3>Privacy Vault</h3>
          <p class="lede">The Personal Codex is locked on this browser.</p>
          <input class="input" id="vault-passphrase" type="password" placeholder="Enter Codex passphrase">
          <div class="control-row">
            <button class="button button-primary" data-action="unlock-codex">Unlock Codex</button>
            <button class="button button-quiet" data-action="open-anchor">Return to Anchor</button>
          </div>
        </div>
      `;
      return;
    }

    const sessions = loadSessions();
    list.innerHTML = `
      <div class="panel codex-toolbar">
        <h3>Personal Codex</h3>
        <p>Your Codex entries stay in this browser unless you export a capsule.</p>
        <div class="control-row">
          <button class="button button-muted" data-action="open-glyph-designer">Open Glyph Studio</button>
          <button class="button button-muted" data-action="import-capsule">Import Capsule</button>
          <button class="button button-quiet" data-action="toggle-privacy">${privacy.enabled ? "Disable Privacy Lock" : "Enable Privacy Lock"}</button>
          <input id="capsule-file" class="hidden" type="file" accept=".json,.mgcapsule,application/json">
        </div>
        <p class="small-copy">Capsule exports are local files. Share only with the same care you would give private notes, audio references, and symbolic session data.</p>
      </div>
      ${sessions.length ? sessions.map(renderSessionCard).join("") : `<div class="panel"><h3>No sessions yet</h3><p>Saved glyphs, reflections, audio references, and harmonic profiles will appear here.</p></div>`}
    `;
  }

  function renderSessionCard(entry) {
    const glyphSrc = safeDataUrl(entry.glyphDataUrl, "image");
    const sessionId = escapeHtml(entry.id || "");
    return `
      <article class="codex-item">
        <div class="codex-head">
          <strong>${escapeHtml(entry.title || "MirrorGate Session")}</strong>
          <span>${escapeHtml(new Date(entry.savedAt || entry.date || Date.now()).toLocaleString())}</span>
        </div>
        <p>${escapeHtml(entry.intention || "No written intention.")}</p>
      ${glyphSrc ? `<img class="glyph-thumb" src="${glyphSrc}" alt="Saved glyph">` : ""}
      <div class="metric-grid">
        <span class="metric"><small>Archetype</small><strong>${escapeHtml(entry.archetype || "-")}</strong></span>
        <span class="metric"><small>Tone</small><strong>${escapeHtml(String(entry.tone || "-"))}</strong></span>
        <span class="metric"><small>Breath</small><strong>${escapeHtml(String(entry.breath || "-"))}</strong></span>
        <span class="metric"><small>Active Glyph</small><strong>${escapeHtml(entry.activeGlyph?.name || "-")}</strong></span>
      </div>
        <div class="control-row">
          <button class="button button-muted" data-action="view-session" data-session-id="${sessionId}">View Detail</button>
          <button class="button button-muted" data-action="export-capsule" data-session-id="${sessionId}">Export Capsule</button>
          <button class="button button-quiet" data-action="export-encrypted-capsule" data-session-id="${sessionId}">Encrypted Capsule</button>
        </div>
      </article>
    `;
  }

  function renderSessionDetail(sessionId) {
    const session = loadSessions().find((item) => item.id === sessionId);
    if (!session) return;
    state.activeSessionDetail = sessionId;
    const list = $("#codex-list");
    const glyphSrc = safeDataUrl(session.glyphDataUrl, "image");
    const audioSrc = safeDataUrl(session.audio?.dataUrl, "audio");
    const safeSessionId = escapeHtml(session.id || "");
    list.innerHTML = `
      <div class="panel session-detail print-capsule">
        <button class="back-button no-print" data-action="open-codex">Back</button>
        <h2>MirrorGate Codex Capsule</h2>
        <p class="gold">${escapeHtml(session.title || "Saved Session")}</p>
        ${glyphSrc ? `<img class="glyph-large" src="${glyphSrc}" alt="Session glyph">` : ""}
        <div class="metric-grid">
          <span class="metric"><small>Archetype</small><strong>${escapeHtml(session.archetype || "-")}</strong></span>
          <span class="metric"><small>Tone</small><strong>${escapeHtml(String(session.tone || "-"))}</strong></span>
          <span class="metric"><small>Breath</small><strong>${escapeHtml(String(session.breath || "-"))}</strong></span>
          <span class="metric"><small>Triplet</small><strong>${escapeHtml(String(session.triplet || "-"))}</strong></span>
          <span class="metric"><small>Resonance</small><strong>${escapeHtml(String(session.resonance || "-"))}</strong></span>
          <span class="metric"><small>Saved</small><strong>${escapeHtml(new Date(session.savedAt).toLocaleString())}</strong></span>
          <span class="metric"><small>Active Glyph</small><strong>${escapeHtml(session.activeGlyph?.name || "-")}</strong></span>
        </div>
        ${session.activeGlyph?.summary ? `<h3>Active Glyph Profile</h3><p>${escapeHtml(session.activeGlyph.summary)}</p>` : ""}
        <h3>Intention</h3>
        <p>${escapeHtml(session.intention || "-")}</p>
        <h3>Reflection</h3>
        <p>${escapeHtml(session.reflection || "-")}</p>
        <h3>Notes</h3>
        <p>${escapeHtml(session.notes || "-")}</p>
        ${audioSrc ? `<audio controls src="${audioSrc}"></audio>` : `<p class="small-copy">No saved audio in this capsule.</p>`}
        <div class="control-row no-print">
          <button class="button button-primary" data-action="print-session">Print / PDF Capsule</button>
          <button class="button button-muted" data-action="export-capsule" data-session-id="${safeSessionId}">Export JSON</button>
          <button class="button button-quiet" data-action="export-encrypted-capsule" data-session-id="${safeSessionId}">Export .mgcapsule</button>
        </div>
      </div>
    `;
  }

  function safeDataUrl(value, kind) {
    const text = String(value || "");
    if (kind === "image" && /^data:image\/(png|jpeg|jpg|webp);base64,/i.test(text)) return text;
    if (kind === "audio" && /^data:audio\/(webm|mp4|mpeg|wav|x-wav|ogg);/i.test(text)) return text;
    return "";
  }

  function normalizeImportedSession(session) {
    return {
      id: crypto.randomUUID?.() || String(Date.now()),
      schemaVersion: 2,
      importedAt: new Date().toISOString(),
      savedAt: session.savedAt || new Date().toISOString(),
      title: String(session.title || "Imported MirrorGate Session").slice(0, 120),
      archetype: String(session.archetype || "").slice(0, 80),
      intention: String(session.intention || "").slice(0, 4000),
      reflection: String(session.reflection || "").slice(0, 4000),
      notes: String(session.notes || "").slice(0, 8000),
      tone: String(session.tone || "").slice(0, 80),
      triplet: String(session.triplet || "").slice(0, 32),
      breath: String(session.breath || "").slice(0, 32),
      resonance: String(session.resonance || "").slice(0, 12),
      glyphDataUrl: safeDataUrl(session.glyphDataUrl, "image"),
      audio: safeDataUrl(session.audio?.dataUrl, "audio") ? {
        dataUrl: safeDataUrl(session.audio.dataUrl, "audio"),
        mimeType: String(session.audio.mimeType || "audio/webm").slice(0, 80)
      } : null,
      activeGlyph: typeof session.activeGlyph === "object" && session.activeGlyph ? session.activeGlyph : null,
      profile: typeof session.profile === "object" && session.profile ? session.profile : {},
      soundscape: String(session.soundscape || "").slice(0, 120),
      visualLoop: String(session.visualLoop || "").slice(0, 120),
      savedAudioWithConsent: !!session.savedAudioWithConsent
    };
  }

  function renderChoiceGroup(items, selected, className, dataName) {
    return items.map((item) => {
      const value = typeof item === "string" ? item : String(item.value ?? item.id);
      const label = typeof item === "string" ? item : item.label ?? item.title;
      const why = typeof item === "string" ? (triplets[item] || breathRhythms[item]?.why || "") : item.why || item.symbolic || "";
      const isSelected = String(selected) === value || Number(selected) === Number(value);
      return `<button class="${className}${isSelected ? " selected" : ""}" data-${dataName}="${escapeHtml(value)}">${escapeHtml(label)}<span>${escapeHtml(why)}</span></button>`;
    }).join("");
  }

  function renderTranscript(script, title = "Read transcript") {
    if (!script) return "";
    return `
      <details class="transcript-disclosure">
        <summary role="button" tabindex="0" aria-label="${escapeHtml(title)}">${escapeHtml(title)}</summary>
        <pre>${escapeHtml(cleanTranscript(script))}</pre>
      </details>
    `;
  }

  function cleanTranscript(script) {
    return String(script || "")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
  }

  function stageTranscript(stage) {
    return [
      stage.title,
      "",
      `Purpose: ${stage.purpose}`,
      "",
      "What to do now:",
      ...stage.whatToDo.map((item) => `- ${item}`),
      "",
      `What to notice: ${stage.notice}`,
      "",
      `Do not force: ${stage.force}`
    ].join("\n");
  }

  function moduleTranscript(module) {
    return [
      module.title,
      "",
      `Contact modality: ${module.modality}`,
      "",
      module.purpose,
      "",
      "What to do now:",
      ...module.now.map((item) => `- ${item}`),
      "",
      `What to notice: ${module.notice}`,
      "",
      `Do not force: ${module.force}`
    ].join("\n");
  }

  function activeGlyphContext(moduleKey) {
    const contexts = {
      vector: "Vector can use the active glyph as a reusable sigil engine: intention, prime triplet, carrier tone, and module imprint become one repeatable signal.",
      breath: "Echo can use the active glyph as a breath anchor while temporal, dream, or collective impressions return.",
      gate: "Gate uses the active glyph as a personal key: prime triplet, carrier tone, and module imprint shape the contact field.",
      mirror: "Mirror can use the active glyph as a symbolic overlay for Oversoul, Monad, still reflection, and integration after contact work.",
      guided: "The guided sequence carries the active glyph across calibration, alignment, mirror, echo, grounding, and save."
    };
    return contexts[moduleKey] || "The active glyph gives this protocol a stable personal imprint.";
  }

  function activeGlyphUseCard(moduleKey) {
    const snapshot = activeGlyphSnapshot();
    const profile = state.glyphDesigner;
    const imprint = glyphModuleImprints[profile.moduleImprint] || glyphModuleImprints.balanced;
    const emotion = glyphEmotionalTones[profile.emotionalTone] || glyphEmotionalTones.clarity;
    const purpose = glyphPurposes[profile.purpose] || glyphPurposes.reflection;
    const sealed = !!profile.activeGlyphSealedAt;
    const active = activeGlyphEnabled();
    return `
      <section class="panel active-glyph-card">
        <h3>${active ? "Active Glyph" : sealed ? "Glyph Profile Paused" : "Active Glyph"}</h3>
        <p class="gold">${escapeHtml(sealed ? snapshot.name : "No active glyph sealed yet")}</p>
        <p>${escapeHtml(active ? activeGlyphContext(moduleKey) : sealed ? "The glyph design is preserved, but modules will not use it until you enable it again in Glyph Studio." : "Open Glyph Studio to create and seal a reusable glyph for this module.")}</p>
        <div class="metric-grid">
          <span class="metric"><small>Imprint</small><strong>${escapeHtml(imprint.title)}</strong></span>
          <span class="metric"><small>Original Module</small><strong>${escapeHtml(imprint.moduleName)}</strong></span>
          <span class="metric"><small>Purpose</small><strong>${escapeHtml(purpose.title)}</strong></span>
          <span class="metric"><small>Emotion</small><strong>${escapeHtml(`${emotion.title} ${normalizedGlyphIntensity(profile)}`)}</strong></span>
          <span class="metric"><small>Prime</small><strong>${escapeHtml(profile.primeTripletText)}</strong></span>
          <span class="metric"><small>Tone</small><strong>${escapeHtml(activeGlyphFrequencyLabel(profile))}</strong></span>
          <span class="metric"><small>Motion</small><strong>${escapeHtml(glyphAnimationStyles[profile.animationStyle] || profile.animationStyle)}</strong></span>
        </div>
        <div class="control-row">
          <button class="button button-muted" data-action="open-glyph-designer">Open Glyph Studio</button>
        </div>
      </section>
    `;
  }

  function activeGlyphInline(moduleKey) {
    const profile = state.glyphDesigner;
    const active = activeGlyphEnabled();
    const sealed = !!profile.activeGlyphSealedAt;
    return `
      <div class="active-glyph-inline">
        <strong>${escapeHtml(active ? activeGlyphDisplayName() : sealed ? "Active Glyph Paused" : "No Active Glyph")}</strong>
        <span>${escapeHtml(active ? activeGlyphContext(moduleKey) : sealed ? "Enable it in Glyph Studio when you want modules to use it again." : "Create one in Glyph Studio when you want a reusable personal seal.")}</span>
        <button class="button button-quiet" data-action="open-glyph-designer">Glyph Studio</button>
      </div>
    `;
  }

  function stageCard(stageID) {
    const stage = stages[stageID];
    return `
      <section class="panel guidance-card">
        <h3>${escapeHtml(stage.title)}</h3>
        <p class="path-label">${escapeHtml(stage.path)}</p>
        <p><strong>Purpose</strong><br>${escapeHtml(stage.purpose)}</p>
        <p><strong>What to do now</strong></p>
        <ul>${stage.whatToDo.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>What to notice</strong><br>${escapeHtml(stage.notice)}</p>
        <p><strong>Do not force</strong><br>${escapeHtml(stage.force)}</p>
        <button class="button button-muted" data-action="play-guidance" data-guidance="${stageID}">Play Voice Guidance</button>
        ${renderTranscript(stageTranscript(stage), "Read guidance transcript")}
      </section>
    `;
  }

  function initiationPanel() {
    return `
      <section class="panel initiation-note">
        <h3>${hasInitiationAccess() ? "Founder / Beta Access" : "$11 MirrorGate Initiation"}</h3>
        <p><strong>Free Orientation:</strong> Harmonic Anchor, About, Recovery, basic breath, and basic Symbolic Mirror remain open.</p>
        <p><strong>MirrorGate Initiation:</strong> Contact paths, Gate Sequencing, Vector Transmission, Toroidal Echoing, Glyph Studio, Codex archive, capsules, and advanced Echo tools.</p>
        <div class="control-row">
          <button class="button ${hasInitiationAccess() ? "button-muted" : "button-primary"}" data-action="toggle-premium">
            ${hasInitiationAccess() ? "Reset MirrorGate Initiation" : "Open MirrorGate Initiation"}
          </button>
        </div>
      </section>
    `;
  }

  function renderWheel() {
    renderWheelUI();
  }

  function renderWheelUI() {
    const selectedKey = modules[state.selectedWheelModule] ? state.selectedWheelModule : "mirror";
    state.selectedWheelModule = selectedKey;
    renderWheelSelection(selectedKey);
    renderGlyphWheelPanel();
    renderIntentionOptions();
    renderContactPaths();
  }

  function renderWheelSelection(moduleKey) {
    const module = modules[moduleKey] || modules.mirror;
    $$(".wheel-quadrant").forEach((button) => {
      const isSelected = button.dataset.wheelModule === moduleKey;
      button.classList.toggle("selected", isSelected);
      button.style.setProperty("--module-accent", modules[button.dataset.wheelModule]?.accent || "#e2b856");
    });
    $("#quadrant-wheel")?.style.setProperty("--selected-accent", module.accent);
    const panel = $("#wheel-selected-panel");
    if (!panel) return;
    panel.style.setProperty("--module-accent", module.accent);
    panel.innerHTML = `
      <p class="path-label">${escapeHtml(module.sequenceLabel)}</p>
      <h3><span>${escapeHtml(module.icon)}</span>${escapeHtml(module.actionLabel)}</h3>
      <p class="path-label original-module-name">${escapeHtml(module.title)}</p>
      <p>${escapeHtml(module.wheelGuidance)}</p>
      <p class="small-copy">${escapeHtml(module.modality)}</p>
      <button class="button button-primary button-wide module-button" data-module="${escapeHtml(moduleKey)}">Enter ${escapeHtml(module.sequenceLabel)}</button>
    `;
  }

  function renderGlyphWheelPanel() {
    const panel = $("#glyph-wheel-panel");
    if (!panel) return;
    const profile = state.glyphDesigner;
    const sealed = !!profile.activeGlyphSealedAt;
    const active = activeGlyphEnabled();
    panel.innerHTML = `
      <h3>Personal Glyph Profile</h3>
      <p class="gold">${escapeHtml(active ? "Active glyph is carrying into modules." : sealed ? "Glyph is sealed, but paused." : "Create or activate a glyph before choosing a path.")}</p>
      <p>${escapeHtml(active ? activeGlyphSummary() : "Glyph Studio shapes the premium sigil layer: emotion, purpose, prime triplet, tone, color, motion, and module imprint.")}</p>
      <div class="control-row">
        <button class="button button-primary button-wide" data-action="open-glyph-designer">Open Glyph Studio</button>
      </div>
    `;
  }

  function renderIntentionOptions() {
    const holder = $("#intention-options");
    if (!holder) return;
    holder.innerHTML = intentionChoices.map((choice) => {
      const module = modules[choice.module] || modules.mirror;
      const attrs = choice.invocation
        ? `data-action="open-invocation" data-invocation="${escapeHtml(choice.invocation)}"`
        : `data-module="${escapeHtml(choice.module)}"`;
      return `
        <button class="intention-choice" style="--module-accent: ${module.accent}" ${attrs}>
          <span>
            <strong>${escapeHtml(choice.title)}</strong>
            <em>${escapeHtml(module.actionLabel)}</em>
            <small>${escapeHtml(choice.subtitle)}</small>
          </span>
          <b>›</b>
        </button>
      `;
    }).join("");
  }

  function renderContactPaths() {
    const holder = $("#contact-paths-list");
    if (!holder) return;
    holder.innerHTML = preferredSequences.map((path) => `
      <article class="contact-path-row">
        <h4>${escapeHtml(path.title)}</h4>
        <p>${escapeHtml(path.purpose)}</p>
        <div class="path-chip-row">
          ${path.sequence.map((moduleKey, index) => {
            const module = modules[moduleKey] || modules.mirror;
            return `
              <button class="path-chip" style="--module-accent: ${module.accent}" data-module="${escapeHtml(moduleKey)}">
                ${escapeHtml(module.sequenceLabel)}
              </button>
              ${index < path.sequence.length - 1 ? `<span class="path-arrow">→</span>` : ""}
            `;
          }).join("")}
        </div>
      </article>
    `).join("");
  }

  function moduleInitiationSummary(module) {
    if (!module) return "This protocol opens through MirrorGate Initiation.";
    if (module.feature === features.harmonicVectorTransmission) {
      return "Harmonic Vector Transmission opens through MirrorGate Initiation because encoded requests, prime vectors, carrier tones, and personal sigils are part of the committed contact layer.";
    }
    if (module.feature === features.primeHarmonicGateSequencing) {
      return "Prime-Harmonic Gate Sequencing opens through MirrorGate Initiation because dimensional and stellar contact protocols should be entered deliberately, with breath, intention, and grounding.";
    }
    if (module.feature === features.toroidalPhaseEchoing) {
      return "Toroidal Phase Echoing opens through MirrorGate Initiation because temporal, subconscious, and collective echo work belongs in the committed contact layer.";
    }
    if (module.feature === features.fullGuidedSequence) {
      return "The full Harmonic Contact Interface sequence opens through MirrorGate Initiation so the complete path from alignment to integration is entered as a deliberate commitment.";
    }
    return `${module.title} opens through MirrorGate Initiation.`;
  }

  function invocationInitiationSummary(invocation) {
    if (!invocation) return "This path opens through MirrorGate Initiation.";
    if (invocation.id === "dimensionalContact") {
      return "Dimensional and stellar contact paths open through MirrorGate Initiation. The $11 threshold acts as a commitment seal before entering Gate contact and integration.";
    }
    if (invocation.id === "generalSequence") {
      return "The complete Harmonic Contact Interface route opens through MirrorGate Initiation so the whole path is entered with intention rather than casual sampling.";
    }
    return `${invocation.title} opens through MirrorGate Initiation because path invocations are part of the committed contact layer.`;
  }

  function renderPathInvocation(invocationID) {
    const invocation = pathInvocations[invocationID];
    if (!invocation) return;
    if (!hasFeatureAccess(invocation.feature || features.contactPathInvocation)) {
      const accentModule = modules[invocation.accentModule] || modules.mirror;
      renderInitiationThreshold({
        title: invocation.title,
        icon: accentModule.icon,
        summary: invocationInitiationSummary(invocation),
        accent: accentModule.accent
      });
      return;
    }
    state.activeInvocation = invocationID;
    const root = $("#invocation-root");
    if (!root) return;
    const accentModule = modules[invocation.accentModule] || modules.mirror;
    root.style.setProperty("--module-accent", accentModule.accent);
    root.innerHTML = `
      <div class="invocation-hero">
        <p class="path-label">Path Invocation</p>
        <h2 id="invocation-title">${escapeHtml(invocation.title)}</h2>
        <p>${escapeHtml(invocation.subtitle)}</p>
      </div>

      <section class="panel invocation-panel">
        <h3>Intention</h3>
        <p class="invocation-intention">${escapeHtml(invocation.intention)}</p>
        ${renderSequenceRibbon(invocation.sequence)}
      </section>

      <section class="panel invocation-panel voice-invocation-card">
        <div class="panel-title-row">
          <h3>Voice Invocation</h3>
          <span>Ready</span>
        </div>
        <p>Use this short recording before you begin. It sets the tone for the first step.</p>
        <div class="control-row">
          <button class="button button-primary" data-action="play-path-invocation" data-invocation="${escapeHtml(invocationID)}">Play Invocation</button>
          <button class="button button-muted" data-action="stop-audio">Stop</button>
        </div>
        ${renderTranscript(invocation.script, "Read invocation transcript")}
      </section>

      <section class="panel invocation-panel">
        <h3>Before you begin</h3>
        <ol class="steps">
          ${invocation.focusLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ol>
      </section>

      <button class="button button-primary button-wide" data-action="begin-invocation" data-invocation="${escapeHtml(invocationID)}">${escapeHtml(invocation.primaryButtonTitle)}</button>
    `;
    showScreen("invocation");
  }

  function renderSequenceRibbon(sequence) {
    return `
      <div class="path-chip-row invocation-sequence">
        ${sequence.map((moduleKey, index) => {
          const module = modules[moduleKey] || modules.mirror;
          return `
            <span class="path-chip static" style="--module-accent: ${module.accent}">
              ${escapeHtml(module.sequenceLabel)}
            </span>
            ${index < sequence.length - 1 ? `<span class="path-arrow">→</span>` : ""}
          `;
        }).join("")}
      </div>
    `;
  }

  function startFullSequence() {
    if (!hasFeatureAccess(features.fullGuidedSequence)) {
      renderInitiationThreshold({
        title: "Full Harmonic Contact Interface Sequence",
        icon: modules.guided.icon,
        summary: moduleInitiationSummary(modules.guided),
        accent: modules.guided.accent
      });
      return;
    }
    resetDraft();
    state.currentFlowStep = "mode";
    renderFlowStep("mode");
  }

  function renderFlowStep(stepID, options = {}) {
    const { resetScroll = true } = options;
    state.currentFlowStep = stepID;
    const step = flowSteps.find((item) => item.id === stepID) || flowSteps[0];
    state.module = "guided";
    const root = $("#module-root");
    root.innerHTML = `
      <header class="module-header">
        <p class="path-label">Full Harmonic Contact Interface Sequence</p>
        <h2>${escapeHtml(step.title)}</h2>
        <p>${flowSubtitle(step.id)}</p>
        ${renderStepProgress(step.id)}
      </header>
      ${renderStepBody(step)}
    `;
    bindFlow(root);
    showScreen("module", { resetScroll });
    drawCurrentCanvases();
  }

  function flowSubtitle(step) {
    const archetype = getArchetype().title;
    const profile = getProfile();
    const subtitles = {
      mode: "Choose Silent or Audio Mirror mode. Microphone and camera remain optional.",
      breath: "Choose breath, resonance, and carrier tone. These seed the Harmonic Profile used through the session.",
      ritual: "Take a short micro-ritual before selecting the contact frame.",
      archetype: "Choose the archetype that carries the session: Future Self, Oversoul Guide, Monad Echo, Dimensional Ally, or Collective Intelligence.",
      alignment: `A three-minute soundscape, breath, and geometry sequence for ${archetype}.`,
      intention: "Write or record the question, signal, or phrase you are bringing into the mirror.",
      mirror: "Hold the intention in the mirror field. Choose camera or microphone only when they support the contact.",
      echo: "Choose a phase preset, generate the local echo, then carry the reflection to glyph.",
      glyph: "Generate or refine the sigil that anchors this session.",
      grounding: "Close the loop with recovery phrase, grounding tone, and notes.",
      save: `Save the session with ${profile.base}, ${profile.archetype}, glyph, notes, and optional audio.`
    };
    return subtitles[step] || "";
  }

  function renderStepProgress(stepID) {
    const index = flowSteps.findIndex((item) => item.id === stepID);
    return `
      <div class="step-strip" aria-label="Session progress">
        ${flowSteps.map((step, stepIndex) => `<span class="${stepIndex === index ? "active" : stepIndex < index ? "done" : ""}">${escapeHtml(step.title)}</span>`).join("")}
      </div>
    `;
  }

  function renderStepBody(step) {
    if (step.id === "mode") {
      return `
        ${stageCard("settle")}
        <section class="panel">
          <h3>Session Mode</h3>
          <div class="choice-grid">
            <button class="choice ${state.draft.mode === "silent" ? "selected" : ""}" data-mode="silent">Silent<span>Text-only intention and symbolic echo.</span></button>
            <button class="choice ${state.draft.mode === "audioMirror" ? "selected" : ""}" data-mode="audioMirror">Audio Mirror<span>Record your own voice locally for Echo Playback.</span></button>
          </div>
          <label class="toggle-row"><span>Camera Mirror</span><input type="checkbox" id="camera-toggle" ${state.draft.usesCameraMirror ? "checked" : ""}></label>
        </section>
        ${flowFooter("Continue to Breath")}
      `;
    }

    if (step.id === "breath") {
      return `
        ${stageCard("settle")}
        <section class="panel">
          <h3>Breath Rhythm</h3>
          <div class="choice-grid">${renderChoiceGroup(calibrationBreathChoices, state.draft.breathRhythm, "choice", "breath")}</div>
          <p class="small-copy">${escapeHtml(breathRhythms[state.draft.breathRhythm]?.why || "")}</p>
          <label for="resonance">Self-rated resonance: <strong id="resonance-value">${state.draft.resonance}</strong></label>
          <input id="resonance" type="range" min="1" max="10" value="${state.draft.resonance}">
          <p>Choose the number that matches your current charge. A higher number can mean more intensity, openness, emotion, energy, or readiness. It is not a score to perform.</p>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="control-row">
            <button class="button button-muted" data-action="play-tone">Play Tone</button>
            <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
          </div>
        </section>
        ${flowFooter("Continue to Ritual")}
      `;
    }

    if (step.id === "ritual") {
      return `
        ${stageCard("settle")}
        <section class="panel">
          <h3>Micro-Ritual</h3>
          <ol class="steps">
            <li>Place attention on the breath.</li>
            <li>Let the jaw, shoulders, and hands soften.</li>
            <li>Read the recovery phrase once before entering contact work.</li>
          </ol>
          <p class="gold">Return to breath. You are the center. All echoes stabilize in stillness.</p>
        </section>
        ${flowFooter("Choose Archetype")}
      `;
    }

    if (step.id === "archetype") {
      return `
        ${stageCard("aim")}
        <section class="panel">
          <h3>Contact Archetype</h3>
          <div class="choice-grid archetype-grid">
            ${archetypes.map((item) => `
              <button class="choice ${state.draft.archetype === item.id ? "selected" : ""}" data-archetype="${item.id}">
                ${escapeHtml(item.title)}
                <span>${escapeHtml(item.symbolic)}</span>
              </button>
            `).join("")}
          </div>
        </section>
        ${flowFooter("Begin Alignment")}
      `;
    }

    if (step.id === "alignment") {
      const profile = getProfile();
      const breath = profile.breath === "selected" ? state.draft.breathRhythm : profile.breath;
      return `
        ${stageCard("align")}
        <section class="panel">
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <h3>${escapeHtml(profile.affirmation)}</h3>
          <div class="progress"><span id="alignment-progress"></span></div>
          <p id="alignment-phase">Follow the ${escapeHtml(breathRhythms[breath]?.cycle || breath)} breath cue.</p>
          <div class="metric-grid">
            <span class="metric"><small>Soundscape</small><strong>${escapeHtml(profile.soundscape)}</strong></span>
            <span class="metric"><small>Base</small><strong>${escapeHtml(profile.base)}</strong></span>
            <span class="metric"><small>Breath</small><strong>${escapeHtml(breathRhythms[breath]?.cycle || breath)}</strong></span>
          </div>
          <div class="control-row">
            <button class="button button-primary" data-action="play-soundscape">Play Soundscape</button>
            <button class="button button-muted" data-action="stop-audio">Stop Soundscape</button>
          </div>
        </section>
        ${flowFooter("Open Mirror Intention")}
      `;
    }

    if (step.id === "intention") {
      return `
        ${stageCard("aim")}
        <section class="panel">
          <label for="intention">Prompt</label>
          <textarea id="intention" class="textarea" placeholder="I am entering this session to...">${escapeHtml(state.draft.intention)}</textarea>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
          ${recordingControls()}
          <p class="small-copy">Record only if you want your spoken intention as the source Echo Playback. Skip it to continue with the written anchor.</p>
        </section>
        ${flowFooter("Continue to Mirror Phase")}
      `;
    }

    if (step.id === "mirror") {
      return `
        ${stageCard("mirror")}
        <section class="panel">
          <div class="module-canvas-card mirror-stage">
            <video id="mirror-video" playsinline muted></video>
            <canvas id="module-canvas" width="620" height="620"></canvas>
          </div>
          <div class="panel subtle-panel">
            <h3>Mirror Surface</h3>
            <p>Read or speak the intention and let the field return through voice, geometry, and attention.</p>
            <h3>Self-phase Recursion</h3>
            <p>Notice what returns in voice, words, posture, attention, mind's eye imagery, pressure, emotion, inner words, or felt presence.</p>
            <h3>Do Not Chase Certainty</h3>
            <p>Nothing obvious is still a valid session.</p>
          </div>
          <div class="control-row">
            <button class="button button-primary" data-action="start-camera">Activate Camera Mirror</button>
            <button class="button button-muted" data-action="play-tone">Play Mirror Tone</button>
            <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
          </div>
        </section>
        ${flowFooter("Continue to Echo Playback")}
      `;
    }

    if (step.id === "echo") {
      const preset = echoPresets[state.draft.echoPreset] || echoPresets.near;
      return `
        ${stageCard("echo")}
        <section class="panel">
          <h3>Audio Reflection</h3>
          <p>Original and modulated echo playback are local-only. Draft audio is saved only if you choose that on Save Session.</p>
          <div class="phase-panel">
            <div class="metric-grid">
              <span class="metric"><small>Original</small><strong>${state.draft.originalAudioDataUrl ? "Ready" : "Missing"}</strong></span>
              <span class="metric"><small>Pitch</small><strong>${preset.pitch} cents</strong></span>
              <span class="metric"><small>Phase</small><strong>${escapeHtml(preset.title)}</strong></span>
            </div>
            <div class="choice-grid">${renderChoiceGroup(Object.entries(echoPresets).map(([id, item]) => ({ id, title: item.title, why: item.why })), state.draft.echoPreset, "phase-choice", "phase")}</div>
            <p class="small-copy">${escapeHtml(preset.why)}</p>
            <div class="control-row">
              <button class="button button-muted" data-action="play-original">Play Original</button>
              <button class="button button-primary" data-action="play-echo">Generate Echo</button>
              <button class="button button-quiet" data-action="stop-audio">Stop</button>
            </div>
          </div>
        </section>
        ${flowFooter("Generate Glyph")}
      `;
    }

    if (step.id === "glyph") {
      return `
        ${stageCard("anchor")}
        <section class="panel">
          <h3>Session Glyph</h3>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="control-row">
            <button class="button button-primary" data-action="capture-glyph">Anchor Glyph</button>
            <button class="button button-muted" data-action="open-glyph-designer">Open Glyph Studio</button>
          </div>
          ${state.draft.glyphDataUrl ? `<img class="glyph-thumb" src="${state.draft.glyphDataUrl}" alt="Captured glyph">` : ""}
        </section>
        ${flowFooter("Ground Session")}
      `;
    }

    if (step.id === "grounding") {
      return `
        ${stageCard("ground")}
        <section class="panel">
          <h3>Grounding</h3>
          <p class="gold">Return to breath. You are the center. All echoes stabilize in stillness.</p>
          <label for="reflection">Reflection Text</label>
          <textarea id="reflection" class="textarea" placeholder="What returned?">${escapeHtml(state.draft.reflection)}</textarea>
          <label for="notes">Notes</label>
          <textarea id="notes" class="textarea" placeholder="Numbers, shapes, feelings, light, words, body shifts...">${escapeHtml(state.draft.notes)}</textarea>
          <div class="control-row">
            <button class="button button-muted" data-action="play-grounding-tone">Play Grounding Tone</button>
            <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
            <button class="button button-quiet" data-action="open-recovery">Open Recovery Reset</button>
          </div>
        </section>
        ${flowFooter("Save Session")}
      `;
    }

    return `
      ${stageCard("ground")}
      <section class="panel">
        <h3>Save Session</h3>
        <p>Store timestamp, archetype, intention, reflection text, glyph, harmonic profile, and optional audio in the Personal Codex.</p>
        <label class="toggle-row"><span>Save original audio with this session</span><input type="checkbox" id="save-audio-toggle" ${state.draft.saveAudio ? "checked" : ""}></label>
        <div class="metric-grid">
          <span class="metric"><small>Archetype</small><strong>${escapeHtml(getArchetype().title)}</strong></span>
          <span class="metric"><small>Tone</small><strong>${escapeHtml(getTone(state.draft.tone).label)}</strong></span>
          <span class="metric"><small>Breath</small><strong>${escapeHtml(breathRhythms[state.draft.breathRhythm]?.cycle || "-")}</strong></span>
        </div>
      </section>
      <div class="control-row flow-actions">
        <button class="button button-quiet" data-action="previous-step">Back</button>
        <button class="button button-primary" data-action="save-guided-session">Save to Personal Codex</button>
      </div>
    `;
  }

  function flowFooter(nextLabel) {
    return `
      <div class="control-row flow-actions">
        <button class="button button-quiet" data-action="previous-step">Back</button>
        <button class="button button-primary" data-action="next-step">${escapeHtml(nextLabel)}</button>
      </div>
    `;
  }

  function recordingControls() {
    const hasAudio = !!state.draft.originalAudioDataUrl;
    return `
      <div class="recording-panel">
        <h3>${hasAudio ? "Original recording ready" : "No original recording yet"}</h3>
        <p id="recording-status">${hasAudio ? "Recorded intention is ready for Echo Playback." : "Record if you want your spoken intention as the source echo."}</p>
        ${hasAudio ? `<audio controls src="${state.draft.originalAudioDataUrl}"></audio>` : ""}
        <div class="control-row">
          <button class="button button-primary" data-action="start-recording" ${capabilities.mediaRecorder ? "" : "disabled"}>Record Original</button>
          <button class="button button-muted" data-action="stop-recording">Stop Recording</button>
        </div>
      </div>
    `;
  }

  function bindFlow(root) {
    $$(".choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.mode) state.draft.mode = button.dataset.mode;
        if (button.dataset.breath) state.draft.breathRhythm = button.dataset.breath;
        if (button.dataset.archetype) {
          state.draft.archetype = button.dataset.archetype;
          const profile = getProfile();
          state.draft.tone = profile.tone;
          if (profile.breath !== "selected") state.draft.breathRhythm = profile.breath;
        }
        persistDraft();
        withPreservedScroll(() => renderFlowStep(state.currentFlowStep, { resetScroll: false }));
      });
    });
    $$(".tone-choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.draft.tone = Number(button.dataset.tone);
        persistDraft();
        withPreservedScroll(() => renderFlowStep(state.currentFlowStep, { resetScroll: false }));
      });
    });
    $$(".phase-choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.draft.echoPreset = button.dataset.phase;
        persistDraft();
        withPreservedScroll(() => renderFlowStep(state.currentFlowStep, { resetScroll: false }));
      });
    });
    $("#camera-toggle", root)?.addEventListener("change", (event) => {
      state.draft.usesCameraMirror = event.target.checked;
      persistDraft();
    });
    $("#save-audio-toggle", root)?.addEventListener("change", (event) => {
      state.draft.saveAudio = event.target.checked;
      persistDraft();
    });
    $("#intention", root)?.addEventListener("input", (event) => {
      state.draft.intention = event.target.value;
      persistDraft();
    });
    $("#reflection", root)?.addEventListener("input", (event) => {
      state.draft.reflection = event.target.value;
      persistDraft();
    });
    $("#notes", root)?.addEventListener("input", (event) => {
      state.draft.notes = event.target.value;
      persistDraft();
    });
    $("#resonance", root)?.addEventListener("input", (event) => {
      state.draft.resonance = Number(event.target.value);
      $("#resonance-value").textContent = event.target.value;
      persistDraft();
    });
  }

  function stepOffset(delta) {
    const index = flowSteps.findIndex((step) => step.id === state.currentFlowStep);
    const next = flowSteps[Math.min(flowSteps.length - 1, Math.max(0, index + delta))];
    stopActiveAudio();
    stopTone();
    if (state.currentFlowStep === "mirror" && next.id !== "mirror") stopCamera();
    state.currentFlowStep = next.id;
    renderFlowStep(next.id);
  }

  function saveGuidedSession() {
    state.draft.harmonicProfile = buildHarmonicProfile();
    const profile = getProfile();
    const session = saveSession({
      title: "Guided Harmonic Contact Interface Session",
      archetype: getArchetype().title,
      intention: state.draft.intention,
      reflection: state.draft.reflection,
      notes: state.draft.notes,
      tone: getTone(state.draft.tone).label,
      triplet: state.draft.triplet,
      breath: breathRhythms[state.draft.breathRhythm]?.cycle || state.draft.breathRhythm,
      resonance: state.draft.resonance,
      glyphDataUrl: state.draft.glyphDataUrl || captureCanvasDataUrl(),
      audio: state.draft.saveAudio && state.draft.originalAudioDataUrl ? {
        dataUrl: state.draft.originalAudioDataUrl,
        mimeType: state.draft.originalAudioType || "audio/webm"
      } : null,
      profile: state.draft.harmonicProfile,
      soundscape: profile.soundscape,
      visualLoop: profile.visual,
      savedAudioWithConsent: !!(state.draft.saveAudio && state.draft.originalAudioDataUrl)
    });
    resetDraft();
    state.activeSessionDetail = session.id;
    showScreen("codex");
    renderSessionDetail(session.id);
  }

  function buildHarmonicProfile() {
    const profile = getProfile();
    return {
      mood: "open",
      breathRhythm: breathRhythms[state.draft.breathRhythm]?.cycle || state.draft.breathRhythm,
      selectedIntention: state.draft.intention,
      chosenArchetype: getArchetype().title,
      sessionLength: "guided",
      emotionalResonanceScore: state.draft.resonance,
      primaryTone: getTone(state.draft.tone).label,
      frequencyAlignment: {
        soundscape: profile.soundscape,
        base: profile.base,
        visualLoop: profile.visual,
        affirmation: profile.affirmation
      }
    };
  }

  function moduleStepDefinitions(name) {
    const module = modules[name] || modules.mirror;
    if (name === "vector") {
      return [
        { title: "Orient the Vector", instruction: "Use this module when you want to transmit a request, encode a signal, or form a glyph from intention.", notice: "Notice the exact words that feel alive before you type anything." },
        { title: "Enter Intention", instruction: "Write one clear phrase. Keep it short enough that the glyph can feel like one signal.", notice: "Watch for resistance, clarity, heat, pressure, or a phrase that suddenly feels more accurate." },
        { title: "Choose Prime Path", instruction: "Choose the prime triplet as the geometry key. It shapes the vector and glyph; it is not a breath pattern.", notice: "A smaller triplet feels foundational. Wider triplets feel more exploratory." },
        { title: "Transmit", instruction: "Tap Transmit Vector. Let the tone and glyph carry the request without trying to answer it yet.", notice: "Notice what the glyph seems to carry: direction, weight, mood, or symbolic charge." },
        { title: "Reflect or Save", instruction: "If the signal feels complete, save it to the Personal Codex or move to another portal.", notice: "The vector is the sent signal. Integration can happen later through Mirror or Echo." }
      ];
    }
    if (name === "breath") {
      return [
        { title: "Orient the Echo", instruction: "Use Echo when the work is integration: future echoes, dreamtime, collective resonance, or subconscious retrieval.", notice: "Begin with breath. Keep the question light rather than gripping it." },
        { title: "Choose Breath and Tone", instruction: "Choose a rhythm and carrier tone. Breath paces the body while the toroidal field gives the echo a shape.", notice: "A higher resonance number means more current charge, not better performance." },
        { title: "Begin Echo Field", instruction: "Start the tone and watch the toroidal motion. Let the active glyph breathe with the pattern if one is sealed.", notice: "Look for image, memory, body sensation, emotion, inner words, or silence." },
        { title: "Integrate", instruction: "Name one thing that returned. If nothing obvious returned, record the stillness honestly.", notice: "Echo work can be subtle. Quiet is still valid." }
      ];
    }
    if (name === "gate") {
      return [
        { title: "Orient the Gate", instruction: "Use Gate when the intention is dimensional or stellar ally contact. This is the contact portal.", notice: "Start only when the intention is clear enough to hold without forcing." },
        { title: "Choose Gate Settings", instruction: "Choose triplet, Breath Seal, and carrier tone. The triplet shapes the gate geometry; the Breath Seal sets the body rhythm.", notice: "Choose the Breath Seal by the pace your body needs for this contact." },
        { title: "Begin Gate Field", instruction: "Tap Begin Gate Field, then let the tone and geometry establish the threshold.", notice: "Notice lightness, tingling, disorientation, presence, geometry, emotion, or silence." },
        { title: "Seal the Breath", instruction: "Complete one full Breath Seal and mark it sealed when the body feels steady enough.", notice: "The breath seal is a body anchor, not a race." },
        { title: "Hold Intention", instruction: "Name the contact intention silently, then mark it held. Keep it simple.", notice: "The intention should feel like a clear beacon, not a demand." },
        { title: "Unlock Glyph Nodes", instruction: "Tap the glyph nodes in order. This completes the gate sequence.", notice: "When the gate opens, remain still. Let contact unfold naturally." },
        { title: "Integrate Through Mirror", instruction: "After the gate, open Mirror to reflect and integrate what came through.", notice: "Do not chase certainty. Return through Mirror even if the gate was quiet." }
      ];
    }
    return [
      { title: "Orient the Mirror", instruction: "Use Mirror for Oversoul, Monad, self-harmonic alignment, or integration after contact work.", notice: "The camera is optional. Attention, breath, and inner imagery are the deeper mirror." },
      { title: "Set the Intention", instruction: "Read or type one intention. Speak it once if using voice, then stop trying to force an answer.", notice: "Notice breath, body pressure, emotion, inner words, memory, symbols, image, or stillness." },
      { title: "Enter Mirror", instruction: "Activate the camera or simply gaze at the symbolic surface. Hold the intention lightly.", notice: "Nothing obvious is still a valid Mirror session." },
      { title: "Reflect or Save", instruction: "Record what remains after the mirror phase. Save only what feels worth keeping.", notice: "The Mirror reflects and integrates; it does not need to prove anything." }
    ];
  }

  function currentModuleStep(name) {
    const steps = moduleStepDefinitions(name);
    const raw = Number(state.moduleSteps[name] || 0);
    return Math.min(steps.length - 1, Math.max(0, raw));
  }

  function renderModuleStepProgress(name, steps, currentIndex) {
    return `
      <div class="module-step-progress" aria-label="Module progress">
        ${steps.map((step, index) => `
          <span class="${index === currentIndex ? "active" : index < currentIndex ? "done" : ""}">
            <b>${index + 1}</b>
            <small>${escapeHtml(step.title)}</small>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderGuidedModule(name) {
    const module = modules[name] || modules.mirror;
    const steps = moduleStepDefinitions(name);
    const stepIndex = currentModuleStep(name);
    const step = steps[stepIndex];
    return `
      <header class="module-header guided-module-header">
        <p class="path-label" style="color: var(--module-accent)">${escapeHtml(module.actionLabel)}</p>
        <h2>${escapeHtml(step.title)}</h2>
        <p>${escapeHtml(step.instruction)}</p>
        ${renderModuleStepProgress(name, steps, stepIndex)}
      </header>

      <section class="panel guided-module-card">
        <p class="path-label">${escapeHtml(module.title)}</p>
        ${renderGuidedModuleStepBody(name, stepIndex)}
        <div class="notice-strip">
          <strong>What to notice</strong>
          <span>${escapeHtml(step.notice)}</span>
        </div>
      </section>

      ${moduleStepFooter(name, stepIndex, steps.length)}
    `;
  }

  function moduleStepFooter(name, stepIndex, count) {
    const back = stepIndex > 0
      ? `<button class="button button-quiet" data-action="module-prev-step" data-module-name="${escapeHtml(name)}">Back</button>`
      : `<button class="button button-quiet" data-action="open-wheel">Return to Wheel</button>`;
    const next = stepIndex < count - 1
      ? `<button class="button button-primary" data-action="module-next-step" data-module-name="${escapeHtml(name)}">Next Step</button>`
      : `<button class="button button-primary" data-action="module-complete" data-module-name="${escapeHtml(name)}">${escapeHtml(moduleCompletionLabel(name))}</button>`;
    const advanced = stepIndex < count - 1
      ? `<button class="button button-muted" data-action="module-advanced" data-module-name="${escapeHtml(name)}">Advanced View</button>`
      : `<button class="button button-muted" data-action="module-advanced" data-module-name="${escapeHtml(name)}">Advanced View</button>`;
    return `
      <div class="control-row flow-actions module-step-actions">
        ${back}
        ${next}
        ${advanced}
      </div>
    `;
  }

  function moduleCompletionLabel(name) {
    if (name === "gate") return "Integrate in Mirror";
    if (name === "mirror") return "Return to Wheel";
    if (name === "vector") return "Return to Wheel";
    if (name === "breath") return "Return to Wheel";
    return "Return to Wheel";
  }

  function renderGuidedModuleStepBody(name, stepIndex) {
    if (name === "vector") return renderVectorGuidedStep(stepIndex);
    if (name === "breath") return renderEchoGuidedStep(stepIndex);
    if (name === "gate") return renderGateGuidedStep(stepIndex);
    return renderMirrorGuidedStep(stepIndex);
  }

  function renderVectorGuidedStep(stepIndex) {
    if (stepIndex === 0) {
      return `
        <h3>Harmonic Vector Transmission</h3>
        <p>${escapeHtml(modules.vector.purpose)}</p>
        ${activeGlyphInline("vector")}
        <div class="control-row">
          <button class="button button-muted" data-action="play-module-guidance" data-module-name="vector">Play Vector Guidance</button>
        </div>
        ${renderTranscript(modules.vector.guidanceScript, "Read Vector transcript")}
      `;
    }
    if (stepIndex === 1) {
      return `
        <label for="intention">Intention</label>
        <textarea id="intention" class="textarea" placeholder="I am entering this session to...">${escapeHtml(state.draft.intention)}</textarea>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
      `;
    }
    if (stepIndex === 2) {
      return `
        <h3>Prime Triplet Pathway</h3>
        <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.draft.triplet, "choice", "triplet")}</div>
        <p class="small-copy">The three numbers are geometry keys written as p1-p2-p3. They shape the vector axes and glyph behavior.</p>
      `;
    }
    if (stepIndex === 3) {
      return `
        <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
        <div class="action-panel">
          <button class="button button-primary" data-action="generate-vector">Transmit Vector</button>
          <button class="button button-muted" data-action="play-tone">Play Carrier Tone</button>
          <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
        </div>
        <div class="metric-grid">
          <span class="metric"><small>Seed</small><strong id="vector-seed">Not transmitted yet</strong></span>
          <span class="metric"><small>Vector</small><strong id="vector-path">Not transmitted yet</strong></span>
          <span class="metric"><small>Carrier</small><strong>${escapeHtml(getTone(state.draft.tone).label)}</strong></span>
        </div>
      `;
    }
    return `
      <label for="reflection">Reflection</label>
      <textarea id="reflection" class="textarea" placeholder="What did the vector seem to carry?">${escapeHtml(state.draft.reflection)}</textarea>
      <div class="control-row">
        <button class="button button-primary" data-action="save-session">Save Vector to Codex</button>
        <button class="button button-muted" data-module="gate">Continue to Gate</button>
      </div>
    `;
  }

  function renderEchoGuidedStep(stepIndex) {
    if (stepIndex === 0) {
      return `
        <h3>Toroidal Phase Echoing</h3>
        <p>${escapeHtml(modules.breath.purpose)}</p>
        ${activeGlyphInline("breath")}
        <div class="control-row">
          <button class="button button-muted" data-action="play-module-guidance" data-module-name="breath">Play Echo Guidance</button>
        </div>
        ${renderTranscript(modules.breath.guidanceScript, "Read Echo transcript")}
      `;
    }
    if (stepIndex === 1) {
      return `
        <h3>Breath Rhythm</h3>
        <div class="choice-grid">${renderChoiceGroup(calibrationBreathChoices, state.draft.breathRhythm, "choice", "breath")}</div>
        <label for="resonance">Self-rated resonance: <strong id="resonance-value">${state.draft.resonance}</strong></label>
        <input id="resonance" type="range" min="1" max="10" value="${state.draft.resonance}">
        <p>A higher number can mean more intensity, openness, emotion, energy, or readiness. It is not a score to perform.</p>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
      `;
    }
    if (stepIndex === 2) {
      return `
        <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
        <div class="action-panel">
          <button class="button button-primary" data-action="start-breath">Begin Echo Field</button>
          <button class="button button-muted" data-action="stop-audio">Stop Echo Tone</button>
          <p class="small-copy">Follow the toroidal pulse. Let time-feelings, symbols, collective impressions, or future-self echoes surface without forcing them.</p>
        </div>
      `;
    }
    return `
      <label for="reflection">Echo Reflection</label>
      <textarea id="reflection" class="textarea" placeholder="What surfaced through the echo field?">${escapeHtml(state.draft.reflection)}</textarea>
      <div class="control-row">
        <button class="button button-primary" data-action="save-session">Save Echo to Codex</button>
        <button class="button button-muted" data-module="vector">Encode Insight in Vector</button>
      </div>
    `;
  }

  function renderGateGuidedStep(stepIndex) {
    if (stepIndex === 0) {
      return `
        <h3>Prime-Harmonic Gate Sequencing</h3>
        <p>${escapeHtml(modules.gate.purpose)}</p>
        ${activeGlyphInline("gate")}
        <div class="control-row">
          <button class="button button-muted" data-action="play-module-guidance" data-module-name="gate">Play Gate Guidance</button>
        </div>
        ${renderTranscript(modules.gate.guidanceScript, "Read Gate transcript")}
      `;
    }
    if (stepIndex === 1) {
      return `
        <h3>Prime Triplet Pathway</h3>
        <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.draft.triplet, "choice", "triplet")}</div>
        <h3>Breath Seal</h3>
        <div class="choice-grid">${renderChoiceGroup(gateBreathSealChoices, state.draft.breathSeal || "4-4-4-4", "choice", "breath-seal")}</div>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
      `;
    }
    if (stepIndex === 2) {
      return `
        <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
        <div class="action-panel">
          <button class="button button-primary" data-action="enter-gate">Begin Gate Field</button>
          <button class="button button-muted" data-action="stop-audio">Stop Gate Tone</button>
          <p class="small-copy">Begin starts the gate tone and motion. Let the field run while you move through breath, intention, and glyph nodes.</p>
        </div>
      `;
    }
    if (stepIndex === 3) {
      return `
        <h3>Breath Seal</h3>
        <p>Complete one full ${escapeHtml(state.draft.breathSeal || "4-4-4-4")} breath cycle. Tap the seal only after the body feels steady enough.</p>
        <button class="button button-primary button-wide" data-action="seal-breath">Seal Completed Breath</button>
        <div class="metric-grid">
          <span class="metric"><small>Breath Cycle</small><strong id="breath-lock">${state.gateBreathSealed ? "Sealed" : "Pending"}</strong></span>
          <span class="metric"><small>Carrier</small><strong>${escapeHtml(getTone(state.draft.tone).label)}</strong></span>
        </div>
      `;
    }
    if (stepIndex === 4) {
      return `
        <h3>Hold Intention</h3>
        <p>Name the contact intention silently or aloud. When the intention feels steady, mark it held.</p>
        <label class="toggle-row">
          <input id="held-intention-toggle" type="checkbox" ${state.gateHeldIntention ? "checked" : ""}>
          <span>Intention held</span>
        </label>
        <p class="small-copy">This is the beacon. Keep it simple and clear.</p>
      `;
    }
    if (stepIndex === 5) {
      const nodes = state.draft.triplet.split("-");
      return `
        <h3>Glyph Nodes</h3>
        <p>Tap in order: ${escapeHtml(nodes.join(" -> "))}. The selected module color marks each node as it opens.</p>
        <div class="control-row" id="node-buttons"></div>
        <div class="metric-grid">
          <span class="metric"><small>Glyph Sequence</small><strong id="node-lock">${state.gateTouchedNodes.length} / 3</strong></span>
          <span class="metric"><small>Gate</small><strong id="gate-lock">${state.gateTouchedNodes.length >= 3 ? "Open" : "Locked"}</strong></span>
        </div>
      `;
    }
    return `
      <h3>Integrate Through Mirror</h3>
      <p>After contact, return through Mirror so the experience can be reflected back through your own center.</p>
      <label for="notes">Gate Notes</label>
      <textarea id="notes" class="textarea" placeholder="Presence, symbols, body sensations, inner words, or stillness...">${escapeHtml(state.draft.notes)}</textarea>
      <div class="control-row">
        <button class="button button-primary" data-module="mirror">Open Mirror</button>
        <button class="button button-muted" data-action="save-session">Save Gate Session</button>
      </div>
    `;
  }

  function renderMirrorGuidedStep(stepIndex) {
    if (stepIndex === 0) {
      return `
        <h3>Symbolic Mirror Interface</h3>
        <p>${escapeHtml(modules.mirror.purpose)}</p>
        ${activeGlyphInline("mirror")}
        <div class="control-row">
          <button class="button button-muted" data-action="play-module-guidance" data-module-name="mirror">Play Mirror Guidance</button>
        </div>
        ${renderTranscript(modules.mirror.guidanceScript, "Read Mirror transcript")}
      `;
    }
    if (stepIndex === 1) {
      return `
        <label for="mirror-intention">Current intention</label>
        <textarea id="mirror-intention" class="textarea" placeholder="Read the intention back to yourself.">${escapeHtml(state.draft.intention)}</textarea>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
      `;
    }
    if (stepIndex === 2) {
      return `
        <div class="module-canvas-card mirror-stage">
          <video id="mirror-video" playsinline muted></video>
          <canvas id="module-canvas" width="620" height="620"></canvas>
        </div>
        <div class="control-row">
          <button class="button button-primary" data-action="start-camera">Activate Camera Mirror</button>
          <button class="button button-muted" data-action="play-tone">Play Mirror Tone</button>
          <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
        </div>
      `;
    }
    return `
      <label for="reflection">Mirror Reflection</label>
      <textarea id="reflection" class="textarea" placeholder="What remained after the mirror phase?">${escapeHtml(state.draft.reflection)}</textarea>
      <div class="control-row">
        <button class="button button-primary" data-action="save-session">Save Reflection</button>
        <button class="button button-muted" data-module="breath">Continue to Echo</button>
      </div>
    `;
  }

  function renderModule(name, options = {}) {
    const { resetScroll = true } = options;
    const module = modules[name];
    if (!module) return;
    if (!hasFeatureAccess(module.feature || features.fullGuidedSequence)) {
      renderInitiationThreshold({
        title: module.title,
        icon: module.icon,
        summary: moduleInitiationSummary(module),
        accent: module.accent
      });
      return;
    }
    const isNewModule = state.module !== name;
    state.module = name;
    const moduleScreen = $("#screen-module");
    if (moduleScreen) {
      moduleScreen.dataset.module = name;
      moduleScreen.style.setProperty("--module-accent", module.accent);
    }
    if (isNewModule) state.draft.tone = module.defaultTone;
    if (isNewModule) {
      state.moduleSteps[name] = 0;
      state.advancedModules[name] = false;
      state.gateBreathSealed = false;
      state.gateHeldIntention = false;
      state.gateTouchedNodes = [];
    }
    const root = $("#module-root");
    root.className = `module-root guided-module-root module-root-${name}`;
    if (!state.advancedModules[name]) {
      root.innerHTML = renderGuidedModule(name);
      bindModule(root, name);
      drawModuleCanvas(name);
      showScreen("module", { resetScroll });
      return;
    }
    root.innerHTML = `
      <header class="module-header">
        <p class="path-label" style="color: var(--module-accent)">${escapeHtml(module.actionLabel)}</p>
        <h2>${escapeHtml(module.title)}</h2>
        <p>${escapeHtml(module.subtitle)}</p>
      </header>

      <section class="panel">
        <h3>Why Use This Module</h3>
        <p class="gold">${escapeHtml(module.modality)}</p>
        <p class="small-copy">Module: ${escapeHtml(module.title)}</p>
        <p>${escapeHtml(module.purpose)}</p>
      </section>

      ${activeGlyphUseCard(name)}

      <section class="panel">
        <h3>What To Do Now</h3>
        <ul>${module.now.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        <p><strong>What to notice:</strong> ${escapeHtml(module.notice)}</p>
        <p><strong>Do not force:</strong> ${escapeHtml(module.force)}</p>
        <button class="button button-muted" data-action="play-module-guidance" data-module-name="${name}">Play Voice Guidance</button>
        ${renderTranscript(module.guidanceScript || moduleTranscript(module), "Read guidance transcript")}
      </section>

      ${renderModuleBody(name)}

      <div class="control-row flow-actions module-step-actions">
        <button class="button button-muted" data-action="module-guided" data-module-name="${escapeHtml(name)}">Return to Guided Steps</button>
      </div>
    `;
    bindModule(root, name);
    drawModuleCanvas(name);
    showScreen("module", { resetScroll });
  }

  function renderModuleBody(name) {
    if (name === "vector") {
      return `
        <section class="panel">
          <label for="intention">Intention</label>
          <textarea id="intention" class="textarea" placeholder="I am entering this session to...">${escapeHtml(state.draft.intention)}</textarea>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
          <h3>Prime Triplet Pathway</h3>
          <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.draft.triplet, "choice", "triplet")}</div>
          <p class="small-copy">The three numbers are prime triplets, not breath patterns. The triplet shapes the gate geometry; breath paces the body separately.</p>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="action-panel">
            <button class="button button-primary" data-action="generate-vector">Transmit Vector</button>
            <p class="small-copy">Transmit converts the intention into seed, glyph, vector, and carrier tone. Watch the glyph and notice what the signal seems to carry before moving on.</p>
            <button class="button button-muted" data-action="play-tone">Play Carrier Tone</button>
            <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
          </div>
          <details class="module-details">
            <summary>Vector Details</summary>
            <div class="metric-grid">
              <span class="metric"><small>Seed</small><strong id="vector-seed">Not transmitted yet</strong></span>
              <span class="metric"><small>Vector</small><strong id="vector-path">Not transmitted yet</strong></span>
              <span class="metric"><small>Carrier</small><strong>${state.draft.tone} Hz</strong></span>
            </div>
          </details>
          <div class="control-row">
            <button class="button button-quiet" data-action="save-session">Save to Codex</button>
          </div>
        </section>
      `;
    }

    if (name === "breath") {
      return `
        <section class="panel">
          <h3>Breath Rhythm</h3>
          <div class="choice-grid">${renderChoiceGroup(calibrationBreathChoices, state.draft.breathRhythm, "choice", "breath")}</div>
          <label for="resonance">Self-rated resonance: <strong id="resonance-value">${state.draft.resonance}</strong></label>
          <input id="resonance" type="range" min="1" max="10" value="${state.draft.resonance}">
          <p>Choose the number that matches your current charge. A higher number can mean more intensity, openness, emotion, energy, or readiness. It is not a score to perform.</p>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
          <div class="action-panel">
            <button class="button button-primary" data-action="start-breath">Begin Echo Field</button>
            <button class="button button-muted" data-action="stop-audio">Stop Echo Tone</button>
            <p class="small-copy">Begin starts the tone and toroidal breath rhythm. Follow the phase cue, keep the memory or question light, and let impressions surface without chasing them.</p>
          </div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <details class="module-details">
            <summary>Echo Details</summary>
            <div class="metric-grid">
              <span class="metric"><small>Breath</small><strong>${escapeHtml(state.draft.breathRhythm)}</strong></span>
              <span class="metric"><small>Carrier</small><strong>${state.draft.tone} Hz</strong></span>
              <span class="metric"><small>Echo Delay</small><strong>432 ms</strong></span>
            </div>
          </details>
          <div class="control-row">
            <button class="button button-muted" data-action="save-session">Save Harmonic Profile</button>
          </div>
        </section>
      `;
    }

    if (name === "gate") {
      return `
        <section class="panel">
          <h3>Prime Triplet Pathway</h3>
          <div class="choice-grid">${renderChoiceGroup(Object.keys(triplets), state.draft.triplet, "choice", "triplet")}</div>
          <h3>Breath Seal</h3>
          <div class="choice-grid">${renderChoiceGroup(gateBreathSealChoices, state.draft.breathSeal || "4-4-4-4", "choice", "breath-seal")}</div>
          <p class="small-copy">Choose the Breath Seal for the rhythm you want in the body. The prime triplet shapes the gate geometry; breath shapes your attention through it.</p>
          <h3>Carrier Tone</h3>
          <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
          <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
          <div class="action-panel">
            <button class="button button-primary" data-action="enter-gate">Begin Gate Field</button>
            <button class="button button-muted" data-action="stop-audio">Stop Gate Tone</button>
            <p class="small-copy">Begin starts the gate tone and motion. Keep it running while you seal the breath, hold the intention, and tap each glyph node in order.</p>
            <button class="button button-muted" data-action="seal-breath">Seal Completed Breath</button>
          </div>
          <div class="metric-grid">
            <span class="metric"><small>Breath Seal</small><strong id="breath-lock">Pending</strong></span>
            <span class="metric"><small>Glyph Nodes</small><strong id="node-lock">0 / 3</strong></span>
            <span class="metric"><small>Gate</small><strong id="gate-lock">Locked</strong></span>
          </div>
          <div class="control-row" id="node-buttons"></div>
          <details class="module-details">
            <summary>Prime Details</summary>
            <div class="metric-grid">
              <span class="metric"><small>Triplet</small><strong>${escapeHtml(state.draft.triplet)}</strong></span>
              <span class="metric"><small>Breath</small><strong>${escapeHtml(state.draft.breathSeal || "4-4-4-4")}</strong></span>
              <span class="metric"><small>Carrier</small><strong>${state.draft.tone} Hz</strong></span>
            </div>
          </details>
          <div class="control-row">
            <button class="button button-muted" data-action="save-session">Save Gate Session</button>
          </div>
        </section>
      `;
    }

    return `
      <section class="panel">
        <label for="mirror-intention">Current intention</label>
        <textarea id="mirror-intention" class="textarea" placeholder="Read the intention back to yourself.">${escapeHtml(state.draft.intention)}</textarea>
        <h3>Carrier Tone</h3>
        <div class="choice-grid">${renderChoiceGroup(tones, state.draft.tone, "tone-choice", "tone")}</div>
        <div class="module-canvas-card mirror-stage">
          <video id="mirror-video" playsinline muted></video>
          <canvas id="module-canvas" width="620" height="620"></canvas>
        </div>
        <div class="control-row">
          <button class="button button-primary" data-action="start-camera">Activate Camera Mirror</button>
          <button class="button button-muted" data-action="play-tone">Play Mirror Tone</button>
          <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
          <button class="button button-quiet" data-action="save-session">Save Reflection</button>
        </div>
      </section>
    `;
  }

  function bindModule(root, name) {
    $$(".tone-choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.draft.tone = Number(button.dataset.tone);
        persistDraft();
        withPreservedScroll(() => renderModule(name, { resetScroll: false }));
      });
    });
    $$(".choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.triplet) {
          if (state.draft.triplet !== button.dataset.triplet) state.gateTouchedNodes = [];
          state.draft.triplet = button.dataset.triplet;
        }
        if (button.dataset.breath) state.draft.breathRhythm = button.dataset.breath;
        if (button.dataset.breathSeal) state.draft.breathSeal = button.dataset.breathSeal;
        persistDraft();
        withPreservedScroll(() => renderModule(name, { resetScroll: false }));
      });
    });
    $("#intention", root)?.addEventListener("input", (event) => {
      state.draft.intention = event.target.value;
      persistDraft();
    });
    $("#mirror-intention", root)?.addEventListener("input", (event) => {
      state.draft.intention = event.target.value;
      persistDraft();
    });
    $("#resonance", root)?.addEventListener("input", (event) => {
      state.draft.resonance = Number(event.target.value);
      $("#resonance-value").textContent = event.target.value;
      persistDraft();
    });
    $("#held-intention-toggle", root)?.addEventListener("change", (event) => {
      state.gateHeldIntention = !!event.target.checked;
      showStatus(state.gateHeldIntention ? "Contact intention marked as held." : "Contact intention released.", "success");
    });
    if (name === "gate") renderNodeButtons();
  }

  function renderNodeButtons() {
    const holder = $("#node-buttons");
    if (!holder) return;
    holder.innerHTML = state.draft.triplet.split("-").map((node) => (
      `<button class="button button-muted ${state.gateTouchedNodes.includes(node) ? "selected" : ""}" data-action="touch-node" data-node="${node}">${node}</button>`
    )).join("");
  }

  async function startCamera() {
    try {
      stopCamera();
      if (!capabilities.mediaDevices) throw new Error("Camera is unavailable in this browser.");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      state.cameraStream = stream;
      const video = $("#mirror-video");
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch {
      showStatus("Camera mirror could not open in this browser. You can still use the Symbolic Mirror silently.", "error");
    }
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((track) => track.stop());
      state.cameraStream = null;
    }
  }

  function cancelRecording() {
    if (state.recordingTimer) clearInterval(state.recordingTimer);
    state.recordingTimer = null;
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      state.mediaRecorder.onstop = null;
      state.mediaRecorder.stop();
    }
    state.mediaRecorder = null;
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => track.stop());
      state.mediaStream = null;
    }
  }

  async function startRecording() {
    if (!capabilities.mediaRecorder || !capabilities.mediaDevices) {
      showStatus("Audio recording is not available in this browser.", "error");
      return;
    }
    try {
      cancelRecording();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaStream = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      state.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      state.recordingChunks = [];
      state.mediaRecorder.ondataavailable = (event) => {
        if (event.data?.size) state.recordingChunks.push(event.data);
      };
      state.mediaRecorder.onstop = () => finalizeRecording(mimeType || state.mediaRecorder?.mimeType || "audio/webm");
      state.mediaRecorder.start();
      state.recordingStartedAt = Date.now();
      $("#recording-status") && ($("#recording-status").textContent = "Recording...");
      state.recordingTimer = setInterval(() => {
        const status = $("#recording-status");
        if (status) status.textContent = `Recording ${Math.round((Date.now() - state.recordingStartedAt) / 1000)}s`;
      }, 500);
    } catch {
      showStatus("Microphone recording could not start. Check browser permissions and try again.", "error");
    }
  }

  function stopRecording(showMessage = true) {
    if (state.recordingTimer) clearInterval(state.recordingTimer);
    state.recordingTimer = null;
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      state.mediaRecorder.stop();
    }
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach((track) => track.stop());
      state.mediaStream = null;
    }
    if (showMessage) showStatus("Recording stopped. Original voice is ready for Echo Playback.", "success");
  }

  function finalizeRecording(mimeType) {
    const blob = new Blob(state.recordingChunks, { type: mimeType });
    if (!blob.size) {
      showStatus("Recording was empty. Try again and speak a little closer to the microphone.", "error");
      return;
    }
    state.recordingBlob = blob;
    state.recordingUrl = URL.createObjectURL(blob);
    const reader = new FileReader();
    reader.onload = () => {
      state.draft.originalAudioDataUrl = reader.result;
      state.draft.originalAudioType = mimeType;
      persistDraft();
      if (state.screen === "module" && state.module === "guided") {
        renderFlowStep(state.currentFlowStep, { resetScroll: false });
      } else if (state.screen === "module" && state.module) {
        renderModule(state.module, { resetScroll: false });
      }
    };
    reader.onerror = () => showStatus("Recording could not be prepared for Echo Playback.", "error");
    reader.readAsDataURL(blob);
  }

  async function playOriginal() {
    if (!state.draft.originalAudioDataUrl) {
      showStatus("Record an original first, or continue with a written reflection.", "error");
      return;
    }
    stopActiveAudio();
    const audio = new Audio(state.draft.originalAudioDataUrl);
    audio.play().catch(() => showStatus("Original recording could not play in this browser.", "error"));
    state.activeAudio = audio;
  }

  async function playEcho() {
    if (!state.draft.originalAudioDataUrl) {
      showStatus("No original recording is ready for Echo Playback.", "error");
      return;
    }
    try {
      const ctx = ensureAudio();
      const preset = echoPresets[state.draft.echoPreset] || echoPresets.near;
      stopTone();
      const response = await fetch(state.draft.originalAudioDataUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = preset.rate;
      const dry = ctx.createGain();
      dry.gain.value = 0.58;
      const delay = ctx.createDelay(1.5);
      delay.delayTime.value = preset.delay;
      const wet = ctx.createGain();
      wet.gain.value = 0.34;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = preset.title === "Long" ? 720 : preset.title === "Deep" ? 960 : 1280;
      source.connect(dry);
      dry.connect(ctx.destination);
      source.connect(delay);
      delay.connect(filter);
      filter.connect(wet);
      wet.connect(ctx.destination);
      source.start();
      state.toneOscillators = [{ source, gain: dry }];
    } catch {
      showStatus("Echo Playback could not decode this recording in the browser.", "error");
    }
  }

  function renderGlyphDesigner(options = {}) {
    const { resetScroll = true } = options;
    if (!hasFeatureAccess(features.glyphStudio)) {
      renderInitiationThreshold({
        title: "Glyph Studio",
        icon: "◈",
        summary: "The Glyph Studio opens through MirrorGate Initiation so personal sigils, prime bindings, tone bindings, and Codex imprinting remain intentional.",
        accent: "#e2b856"
      });
      return;
    }
    state.module = "glyph-designer";
    const root = $("#module-root");
    root.className = "module-root glyph-studio-root";
    const profile = state.glyphDesigner;
    const sealed = !!profile.activeGlyphSealedAt;
    const active = activeGlyphEnabled();
    root.innerHTML = `
      <header class="module-header">
        <p class="path-label">MirrorGate Initiation</p>
        <h2>Glyph Studio</h2>
        <p>A personal sigil forge for nodes, spiral, prime triplet, tone, colors, and the Personal Glyph Profile.</p>
      </header>
      <section class="panel guidance-card">
        <h3>Glyph Studio Guidance</h3>
        <p>Use this recording when you want the full orientation for creating, sealing, using, or pausing an Active Glyph.</p>
        <button class="button button-muted button-wide" data-action="play-glyph-guidance">Play Glyph Guidance</button>
        ${renderTranscript(glyphStudioTranscript, "Read glyph transcript")}
      </section>
      <section class="panel initiation-note">
        <h3>Custom Glyph Mapping</h3>
        <p>Glyph Studio creates reusable personal imprints rather than one-off session marks. Treat it as the place where your prime pathway, carrier tone, module imprint, motion, and sigil structure are deliberately bound.</p>
        <div class="metric-grid">
          <span class="metric"><small>Active Glyph</small><strong>${escapeHtml(profile.activeGlyphSealedAt ? activeGlyphDisplayName() : "Unset")}</strong></span>
          <span class="metric"><small>Prime Binding</small><strong>${escapeHtml(profile.primeTripletText)}</strong></span>
          <span class="metric"><small>Tone Binding</small><strong>${escapeHtml(activeGlyphFrequencyLabel(profile))}</strong></span>
          <span class="metric"><small>Imprint</small><strong>${escapeHtml(glyphModuleImprints[profile.moduleImprint]?.title || "Balanced Seal")}</strong></span>
          <span class="metric"><small>State</small><strong>${escapeHtml(active ? "Active in modules" : sealed ? "Paused" : "Not sealed")}</strong></span>
        </div>
      </section>
      <section class="panel glyph-preview-panel">
        <div class="module-canvas-card"><canvas id="module-canvas" width="620" height="620"></canvas></div>
        <div class="glyph-preview-meta">
          <span class="metric"><small>Name</small><strong>${escapeHtml(profile.activeGlyphName || "Unnamed glyph")}</strong></span>
          <span class="metric"><small>Prime</small><strong>${escapeHtml(profile.primeTripletText)}</strong></span>
          <span class="metric"><small>Tone</small><strong>${escapeHtml(activeGlyphFrequencyLabel(profile))}</strong></span>
          <span class="metric"><small>Status</small><strong>${escapeHtml(active ? "Active" : sealed ? "Paused" : "Draft")}</strong></span>
        </div>
      </section>
      <section class="panel glyph-options-panel">
        <label for="designer-glyph-name">Glyph Name</label>
        <input class="input" id="designer-glyph-name" value="${escapeHtml(profile.activeGlyphName || "")}" placeholder="Example: Dimensional Gate Seal">
        <div class="control-row">
          <label class="toggle-row">
            <input id="designer-use-active" type="checkbox" ${profile.usesActiveGlyph ? "checked" : ""}>
            <span>Use Active Glyph in modules</span>
          </label>
        </div>
        <label>Node Count: <strong id="node-count-value">${profile.nodeCount}</strong></label>
        <input id="designer-node-count" type="range" min="3" max="12" value="${profile.nodeCount}">
        <label>Spiral Strength: <strong id="spiral-value">${Math.round(profile.spiralStrength * 100)}%</strong></label>
        <input id="designer-spiral" type="range" min="0" max="100" value="${Math.round(profile.spiralStrength * 100)}">
        <label for="designer-triplet">Prime Triplet</label>
        <input class="input" id="designer-triplet" value="${escapeHtml(profile.primeTripletText)}">
        <label class="toggle-row">
          <input id="designer-vary-triplet" type="checkbox" ${profile.bindsPrimeTripletVariant ? "checked" : ""}>
          <span>Let modules vary the glyph by selected prime triplet</span>
        </label>
        <h3>Emotion</h3>
        <div class="choice-grid readable-choice-grid">${Object.entries(glyphEmotionalTones).map(([id, item]) => `<button class="choice ${profile.emotionalTone === id ? "selected" : ""}" data-emotional-tone="${id}">${escapeHtml(item.title)}<span>${escapeHtml(item.guidance)}</span></button>`).join("")}</div>
        <label>Intensity: <strong id="emotion-intensity-value">${normalizedGlyphIntensity(profile)}</strong></label>
        <input id="designer-emotion-intensity" type="range" min="1" max="10" value="${normalizedGlyphIntensity(profile)}">
        <p class="small-copy">A higher number means stronger charge, glow, pulse, density, movement, or color expression. It is not better or worse.</p>
        <h3>Purpose</h3>
        <div class="choice-grid readable-choice-grid">${Object.entries(glyphPurposes).map(([id, item]) => `<button class="choice ${profile.purpose === id ? "selected" : ""}" data-glyph-purpose="${id}">${escapeHtml(item.title)}<span>${escapeHtml(item.guidance)}</span></button>`).join("")}</div>
        <h3>Module Imprint</h3>
        <div class="choice-grid">${Object.entries(glyphModuleImprints).map(([id, item]) => `<button class="choice ${profile.moduleImprint === id ? "selected" : ""}" data-module-imprint="${id}">${escapeHtml(item.title)}<span>${escapeHtml(item.moduleName)}</span></button>`).join("")}</div>
        <p class="small-copy">${escapeHtml(glyphModuleImprints[profile.moduleImprint]?.use || glyphModuleImprints.balanced.use)}</p>
        <h3>Tone Binding</h3>
        <div class="choice-grid">
          <button class="choice ${profile.toneBindingMode !== "custom" ? "selected" : ""}" data-tone-binding-mode="canonical">Core Tones<span>Bind to one of the four MirrorGate carriers.</span></button>
          <button class="choice ${profile.toneBindingMode === "custom" ? "selected" : ""}" data-tone-binding-mode="custom">Custom Frequency<span>Bind to a personal carrier after previewing it.</span></button>
        </div>
        ${profile.toneBindingMode === "custom" ? `
          <label>Custom Frequency: <strong id="custom-frequency-value">${activeGlyphFrequency(profile).toFixed(1)} Hz</strong></label>
          <input id="designer-custom-frequency" type="range" min="20" max="4000" step="1" value="${activeGlyphFrequency(profile)}">
          <div class="control-row">
            <button class="button button-muted" data-action="preview-glyph-frequency">Preview Custom Tone</button>
            <button class="button button-quiet" data-action="stop-audio">Stop Tone</button>
          </div>
        ` : `
          <div class="choice-grid">${renderChoiceGroup(tones, getTone(profile.carrierToneID).value, "tone-choice", "tone")}</div>
        `}
        <h3>Color Mode</h3>
        <div class="choice-grid">${Object.entries(glyphColorModes).map(([id, item]) => `<button class="choice ${profile.colorMode === id ? "selected" : ""}" data-color-mode="${id}">${escapeHtml(item.title)}<span>${escapeHtml(item.primary)} / ${escapeHtml(item.secondary)}</span></button>`).join("")}</div>
        <h3>Motion</h3>
        <div class="choice-grid">${Object.entries(glyphAnimationStyles).map(([id, title]) => `<button class="choice ${profile.animationStyle === id ? "selected" : ""}" data-animation-style="${id}">${escapeHtml(title)}<span>${escapeHtml(id)}</span></button>`).join("")}</div>
        <p class="small-copy">Use the active glyph as breath anchor, mirror overlay, gate key, vector seal, Codex memory, and capsule cover.</p>
        <div class="control-row">
          <button class="button button-primary" data-action="seal-glyph-profile">Seal as Active Glyph</button>
          <button class="button button-muted" data-action="capture-glyph">Use In Current Session</button>
          ${sealed ? `<button class="button button-quiet" data-action="deactivate-glyph-profile">Deactivate Active Glyph</button>` : ""}
        </div>
      </section>
      <section class="panel">
        <h3>How the Active Glyph Is Used</h3>
        <div class="metric-grid">
          <span class="metric"><small>Breath</small><strong>Focal anchor</strong></span>
          <span class="metric"><small>Mirror</small><strong>Reflection overlay</strong></span>
          <span class="metric"><small>Gate</small><strong>Prime key</strong></span>
          <span class="metric"><small>Codex</small><strong>Session imprint</strong></span>
        </div>
        <p class="small-copy">The sealed glyph gives repeat sessions a stable symbolic profile without changing the local-only storage model.</p>
      </section>
    `;
    bindGlyphDesigner(root);
    showScreen("module", { resetScroll });
    drawModuleCanvas("glyph-designer");
  }

  function bindGlyphDesigner(root) {
    $("#designer-node-count", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.nodeCount = Number(event.target.value);
      $("#node-count-value").textContent = event.target.value;
      saveGlyphProfile();
      drawModuleCanvas("glyph-designer");
    });
    $("#designer-spiral", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.spiralStrength = Number(event.target.value) / 100;
      $("#spiral-value").textContent = `${event.target.value}%`;
      saveGlyphProfile();
      drawModuleCanvas("glyph-designer");
    });
    $("#designer-triplet", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.primeTripletText = event.target.value;
      saveGlyphProfile();
      drawModuleCanvas("glyph-designer");
    });
    $("#designer-use-active", root)?.addEventListener("change", (event) => {
      state.glyphDesigner.usesActiveGlyph = !!event.target.checked;
      saveGlyphProfile();
      renderGlyphDesigner({ resetScroll: false });
    });
    $("#designer-vary-triplet", root)?.addEventListener("change", (event) => {
      state.glyphDesigner.bindsPrimeTripletVariant = !!event.target.checked;
      saveGlyphProfile();
      renderGlyphDesigner({ resetScroll: false });
    });
    $("#designer-emotion-intensity", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.emotionalIntensity = Number(event.target.value);
      $("#emotion-intensity-value").textContent = event.target.value;
      saveGlyphProfile();
      drawModuleCanvas("glyph-designer");
    });
    $("#designer-custom-frequency", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.customFrequencyHz = Number(event.target.value);
      $("#custom-frequency-value").textContent = `${Number(event.target.value).toFixed(1)} Hz`;
      saveGlyphProfile();
    });
    $("#designer-glyph-name", root)?.addEventListener("input", (event) => {
      state.glyphDesigner.activeGlyphName = event.target.value;
      saveGlyphProfile();
    });
    $$(".tone-choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.glyphDesigner.carrierToneID = getTone(Number(button.dataset.tone)).id;
        saveGlyphProfile();
        renderGlyphDesigner({ resetScroll: false });
      });
    });
    $$(".choice", root).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.colorMode) state.glyphDesigner.colorMode = button.dataset.colorMode;
        if (button.dataset.moduleImprint) state.glyphDesigner.moduleImprint = button.dataset.moduleImprint;
        if (button.dataset.animationStyle) state.glyphDesigner.animationStyle = button.dataset.animationStyle;
        if (button.dataset.emotionalTone) state.glyphDesigner.emotionalTone = button.dataset.emotionalTone;
        if (button.dataset.glyphPurpose) state.glyphDesigner.purpose = button.dataset.glyphPurpose;
        if (button.dataset.toneBindingMode) state.glyphDesigner.toneBindingMode = button.dataset.toneBindingMode;
        saveGlyphProfile();
        renderGlyphDesigner({ resetScroll: false });
      });
    });
  }

  function exportCapsule(sessionId, encrypted = false) {
    const session = loadSessions().find((item) => item.id === sessionId);
    if (!session) return;
    const capsule = {
      type: "MirrorGate Codex Capsule",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      storagePolicy: "Local-only JSON export. MirrorGate does not upload this capsule.",
      session
    };
    if (encrypted) {
      const passphrase = prompt("Enter a passphrase for this encrypted .mgcapsule file.");
      if (!passphrase) return;
      encryptCapsule(capsule, passphrase).then((payload) => {
        downloadText(`${safeFileName(session.title || "mirrorgate-capsule")}.mgcapsule`, JSON.stringify(payload, null, 2), "application/json");
      }).catch(() => showStatus("Encrypted capsule export failed in this browser.", "error"));
      return;
    }
    downloadText(`${safeFileName(session.title || "mirrorgate-capsule")}.json`, JSON.stringify(capsule, null, 2), "application/json");
  }

  async function encryptCapsule(capsule, passphrase) {
    if (!capabilities.crypto) throw new Error("WebCrypto unavailable");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const data = new TextEncoder().encode(JSON.stringify(capsule));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
    return {
      type: "MirrorGate Encrypted Codex Capsule",
      version: 1,
      algorithm: "PBKDF2-SHA256/AES-GCM",
      salt: uint8ToBase64(salt),
      iv: uint8ToBase64(iv),
      ciphertext: arrayBufferToBase64(ciphertext)
    };
  }

  async function decryptCapsule(payload, passphrase) {
    const salt = base64ToUint8(payload.salt);
    const iv = base64ToUint8(payload.iv);
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64ToUint8(payload.ciphertext));
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  function importCapsuleFile(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        let payload = JSON.parse(reader.result);
        if (payload.type === "MirrorGate Encrypted Codex Capsule") {
          const passphrase = prompt("Enter capsule passphrase.");
          if (!passphrase) return;
          payload = await decryptCapsule(payload, passphrase);
        }
        const session = payload.session;
        if (!session) throw new Error("No session in capsule");
        const sessions = loadSessions();
        sessions.unshift(normalizeImportedSession(session));
        storeSessions(sessions);
        showScreen("codex");
        renderCodex();
        showStatus("Codex Capsule imported.", "success");
      } catch {
        showStatus("Capsule import failed. Check the file or passphrase.", "error");
      }
    };
    reader.readAsText(file);
  }

  function downloadText(fileName, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function safeFileName(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mirrorgate-capsule";
  }

  function arrayBufferToBase64(buffer) {
    return uint8ToBase64(new Uint8Array(buffer));
  }

  function uint8ToBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function base64ToUint8(base64) {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  }

  function handleAction(action, target) {
    if (action === "open-anchor") {
      closeRecovery();
      stopActiveAudio();
      stopTone();
      showScreen("anchor");
    }
    if (action === "open-about") { stopActiveAudio(); stopTone(); showScreen("about"); }
    if (action === "open-about-audio") {
      showScreen("about");
      playAsset("AboutMirrorGateVoice.mp3");
    }
    if (action === "open-wheel") { stopActiveAudio(); stopTone(); showScreen("wheel"); }
    if (action === "open-invocation") renderPathInvocation(target.dataset.invocation);
    if (action === "open-codex") { stopActiveAudio(); stopTone(); openCodex(); }
    if (action === "open-recovery") openRecovery();
    if (action === "close-recovery") closeRecovery();
    if (action === "repeat-recovery") openRecovery(true);
    if (action === "start-sequence") startFullSequence();
    if (action === "next-step") stepOffset(1);
    if (action === "previous-step") stepOffset(-1);
    if (action === "play-guidance") playAsset(stages[target.dataset.guidance]?.asset || stages.settle.asset);
    if (action === "play-module-guidance") playAsset(modules[target.dataset.moduleName]?.guidanceAsset || stages.aim.asset);
    if (action === "play-wheel-guidance") playAsset("HarmonicWheelOrientationVoice.mp3");
    if (action === "play-glyph-guidance") playAsset("GlyphStudioGuidance.mp3");
    if (action === "play-path-invocation") {
      const invocation = pathInvocations[target.dataset.invocation];
      if (invocation) playAsset(invocation.asset);
    }
    if (action === "module-next-step" || action === "module-prev-step") {
      stopActiveAudio();
      stopTone();
      const moduleName = target.dataset.moduleName || state.module;
      const steps = moduleStepDefinitions(moduleName);
      const offset = action === "module-next-step" ? 1 : -1;
      state.moduleSteps[moduleName] = Math.min(steps.length - 1, Math.max(0, currentModuleStep(moduleName) + offset));
      renderModule(moduleName, { resetScroll: true });
    }
    if (action === "module-advanced") {
      stopActiveAudio();
      stopTone();
      const moduleName = target.dataset.moduleName || state.module;
      state.advancedModules[moduleName] = true;
      renderModule(moduleName, { resetScroll: true });
    }
    if (action === "module-guided") {
      stopActiveAudio();
      stopTone();
      const moduleName = target.dataset.moduleName || state.module;
      state.advancedModules[moduleName] = false;
      renderModule(moduleName, { resetScroll: true });
    }
    if (action === "module-complete") {
      stopActiveAudio();
      stopTone();
      const moduleName = target.dataset.moduleName || state.module;
      if (moduleName === "gate") renderModule("mirror");
      else showScreen("wheel");
    }
    if (action === "begin-invocation") {
      stopActiveAudio();
      stopTone();
      const invocation = pathInvocations[target.dataset.invocation];
      if (invocation?.startsFullSequence) {
        startFullSequence();
      } else if (invocation?.sequence?.[0]) {
        renderModule(invocation.sequence[0]);
      }
    }
    if (action === "play-about") playAsset("AboutMirrorGateVoice.mp3");
    if (action === "stop-audio") { stopActiveAudio(); stopTone(); }
    if (action === "play-soundscape") playAsset(getProfile().asset, true);
    if (action === "play-grounding-tone") playTone(144, Infinity, "soundscape");
    if (action === "start-recording") startRecording();
    if (action === "stop-recording") stopRecording();
    if (action === "play-original") playOriginal();
    if (action === "play-echo") playEcho();
    if (action === "capture-glyph") {
      state.draft.glyphDataUrl = captureCanvasDataUrl();
      persistDraft();
      showStatus("Glyph anchored to current session.", "success");
      if (state.currentFlowStep === "glyph") renderFlowStep("glyph", { resetScroll: false });
    }
    if (action === "save-guided-session") saveGuidedSession();
    if (action === "open-glyph-designer") renderGlyphDesigner();
    if (action === "save-glyph-profile") { saveGlyphProfile(); showStatus("Glyph profile saved.", "success"); }
    if (action === "seal-glyph-profile") {
      sealActiveGlyphProfile();
      showStatus("Active glyph sealed into the Personal Glyph Profile.", "success");
      renderGlyphDesigner({ resetScroll: false });
    }
    if (action === "deactivate-glyph-profile") {
      deactivateGlyphProfile();
      showStatus("Active glyph paused. The design is preserved.", "success");
      renderGlyphDesigner({ resetScroll: false });
    }
    if (action === "preview-glyph-frequency") {
      playTone(activeGlyphFrequency(), Infinity, "single");
    }
    if (action === "open-simulated-initiation") openSimulatedInitiation();
    if (action === "toggle-premium") {
      state.premiumUnlocked = !state.premiumUnlocked;
      localStorage.setItem(unlockKey, String(state.premiumUnlocked));
      location.reload();
    }
    if (action === "toggle-privacy") handlePrivacyToggle();
    if (action === "unlock-codex") unlockPrivacy($("#vault-passphrase")?.value || "").then((ok) => ok ? renderCodex() : showStatus("Codex passphrase did not match.", "error"));
    if (action === "view-session") renderSessionDetail(target.dataset.sessionId);
    if (action === "export-capsule") exportCapsule(target.dataset.sessionId || state.activeSessionDetail, false);
    if (action === "export-encrypted-capsule") exportCapsule(target.dataset.sessionId || state.activeSessionDetail, true);
    if (action === "import-capsule") $("#capsule-file")?.click();
    if (action === "print-session") window.print();
    if (action === "generate-vector") {
      const encoded = encodeVector($("#intention")?.value || state.draft.intention, state.draft.triplet);
      state.latestGlyph = encoded;
      drawModuleCanvas("vector", encoded);
      $("#vector-seed") && ($("#vector-seed").textContent = String(encoded.seed));
      $("#vector-path") && ($("#vector-path").textContent = `${encoded.vector.map((value) => value.toFixed(2)).join(", ")}`);
      playTone(state.draft.tone, Infinity, "pulse");
    }
    if (action === "play-tone") playTone(state.draft.tone, Infinity, "single");
    if (action === "start-breath") playTone(state.draft.tone, Infinity, "soundscape");
    if (action === "enter-gate") {
      playTone(state.draft.tone, Infinity, "soundscape");
      showStatus("Gate field started. Continue with breath, intention, and glyph nodes.", "success");
    }
    if (action === "seal-breath") {
      state.gateBreathSealed = true;
      $("#breath-lock") && ($("#breath-lock").textContent = "Sealed");
      showStatus("Breath Seal marked complete.", "success");
    }
    if (action === "touch-node") {
      const node = target.dataset.node || "";
      const expected = state.draft.triplet.split("-")[state.gateTouchedNodes.length];
      if (node !== expected) {
        showStatus(`Next glyph node is ${expected}.`, "error");
        return;
      }
      state.gateTouchedNodes.push(node);
      target.classList.add("selected");
      const touched = state.gateTouchedNodes.length;
      $("#node-lock") && ($("#node-lock").textContent = `${touched} / 3`);
      if (touched >= 3 && $("#gate-lock")) $("#gate-lock").textContent = "Open";
      playTone(state.draft.tone + Number(target.dataset.node || 0) * 2, 0.42, "single");
      if (touched >= 3) showStatus("Glyph sequence unlocked. Gate is open.", "success");
    }
    if (action === "start-camera") startCamera();
    if (action === "save-session") saveManualSession();
  }

  async function handlePrivacyToggle() {
    const privacy = getPrivacySettings();
    if (privacy.enabled) {
      disablePrivacyLock();
      renderCodex();
      return;
    }
    const passphrase = prompt("Create a Codex passphrase for this browser.");
    if (!passphrase) return;
    await setPrivacyLock(passphrase);
    renderCodex();
  }

  function saveManualSession() {
    const module = modules[state.module] || {};
    const glyphDataUrl = captureCanvasDataUrl();
    saveSession({
      title: module.title || "MirrorGate Session",
      archetype: getArchetype().title,
      intention: $("#intention")?.value || $("#mirror-intention")?.value || state.draft.intention || module.phrase,
      reflection: $("#reflection")?.value || state.draft.reflection || module.notice || "",
      notes: $("#notes")?.value || state.draft.notes || "",
      tone: getTone(state.draft.tone).label,
      triplet: state.draft.triplet,
      breath: breathRhythms[state.draft.breathRhythm]?.cycle || state.draft.breathRhythm,
      resonance: state.draft.resonance,
      glyphDataUrl,
      audio: null,
      profile: buildHarmonicProfile()
    });
    showStatus("Saved to Personal Codex in this browser.", "success");
  }

  function bindGlobalActions() {
    document.addEventListener("click", (event) => {
      const targetElement = event.target instanceof Element ? event.target : event.target?.parentElement;
      if (!targetElement) return;
      if (targetElement.closest("input, textarea, select, option, [contenteditable='true']")) return;
      const actionTarget = targetElement.closest("[data-action]");
      const moduleTarget = targetElement.closest("button[data-module], a[data-module], [role='button'][data-module]");
      const wheelModuleTarget = targetElement.closest("button[data-wheel-module], a[data-wheel-module], [role='button'][data-wheel-module]");
      if (actionTarget) {
        event.preventDefault();
        handleAction(actionTarget.dataset.action, actionTarget);
        return;
      }
      if (wheelModuleTarget) {
        event.preventDefault();
        state.selectedWheelModule = wheelModuleTarget.dataset.wheelModule;
        renderWheelSelection(state.selectedWheelModule);
        return;
      }
      if (moduleTarget) {
        event.preventDefault();
        stopActiveAudio();
        stopTone();
        renderModule(moduleTarget.dataset.module);
      }
    });
    document.addEventListener("change", (event) => {
      if (event.target?.id === "capsule-file" && event.target.files?.[0]) {
        importCapsuleFile(event.target.files[0]);
      }
    });
  }

  function drawField() {
    const canvas = $("#field-canvas");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (time) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.scale(dpr, dpr);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const t = time / 1000;
      ctx.strokeStyle = "rgba(226,184,86,0.075)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        const radius = 150 + i * 82 + Math.sin(t * 0.33 + i) * 10;
        ctx.ellipse(cx, cy, radius * 1.25, radius * 0.82, t * 0.04 + i * 0.32, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  const sigilMotion = new WeakMap();

  function prepareCanvasPixels(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = Math.max(1, Math.round((rect.width || canvas.width) * dpr));
    const height = Math.max(1, Math.round((rect.height || canvas.height) * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return {
      dpr,
      width: width / dpr,
      height: height / dpr
    };
  }

  function smoothSigilRotation(canvas, time, compact) {
    const speed = compact ? 0.14 : 0.105;
    const currentTime = Number.isFinite(time) ? time : performance.now();
    const previous = sigilMotion.get(canvas) || {
      lastTime: currentTime,
      rotation: (currentTime / 1000) * speed
    };
    const rawDelta = Math.max(0, (currentTime - previous.lastTime) / 1000);
    const delta = Math.min(rawDelta, 1 / 24);
    const rotation = (previous.rotation + delta * speed) % (Math.PI * 2);
    sigilMotion.set(canvas, { lastTime: currentTime, rotation });
    return rotation;
  }

  function drawSigil(canvas, time = performance.now(), compact = false) {
    const ctx = canvas.getContext("2d");
    const { dpr, width: w, height: h } = prepareCanvasPixels(canvas);
    const cx = w / 2;
    const cy = h / 2;
    const side = Math.min(w, h);
    const r = side * (compact ? 0.28 : 0.38);
    const rotation = smoothSigilRotation(canvas, time, compact);
    const accentSource = canvas.closest(".wheel-card, .wheel-center, .anchor-sigil, .recovery-card") || document.documentElement;
    const accent = getComputedStyle(accentSource).getPropertyValue("--selected-accent").trim()
      || getComputedStyle(document.documentElement).getPropertyValue("--gold").trim()
      || "#e2b856";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, r * 1.6);
    gradient.addColorStop(0, "rgba(226,184,86,0.24)");
    gradient.addColorStop(0.5, "rgba(60,70,130,0.16)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.translate(cx, cy);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    const point = (radius, angle) => [Math.cos(angle) * radius, Math.sin(angle) * radius];
    const top = point(r, -Math.PI / 2 + rotation);
    const left = point(r, Math.PI * 0.82 + rotation);
    const right = point(r, Math.PI * 0.18 + rotation);
    const bottom = point(r, Math.PI / 2 + rotation);

    const strokeOuterRing = () => {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
      ctx.stroke();
    };
    const strokeDiamond = () => {
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.closePath();
      ctx.stroke();
    };
    const strokeInnerLattice = () => {
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.closePath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.moveTo(left[0], left[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.moveTo(right[0], right[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.stroke();
    };

    ctx.save();
    ctx.shadowColor = accent;
    ctx.shadowBlur = compact ? 10 : 18;
    ctx.globalAlpha = 0.58;
    ctx.strokeStyle = accent;
    ctx.lineWidth = compact ? 3.2 : 4.2;
    strokeOuterRing();
    ctx.lineWidth = compact ? 2.1 : 2.8;
    strokeDiamond();
    ctx.strokeStyle = "rgba(225,230,248,0.78)";
    ctx.lineWidth = compact ? 1.5 : 1.9;
    strokeInnerLattice();
    ctx.restore();

    ctx.strokeStyle = "rgba(226,184,86,0.68)";
    ctx.lineWidth = compact ? 2 : 2.5;
    strokeOuterRing();

    ctx.strokeStyle = "rgba(226,184,86,0.82)";
    ctx.lineWidth = compact ? 1.1 : 1.3;
    strokeDiamond();

    ctx.strokeStyle = "rgba(225,230,248,0.72)";
    ctx.lineWidth = compact ? 0.9 : 1;
    strokeInnerLattice();

    ctx.fillStyle = "#e2b856";
    ctx.shadowColor = accent;
    ctx.shadowBlur = compact ? 7 : 12;
    [top, left, right, bottom, [0, 0]].forEach(([x, y], index) => {
      const nodeRadius = index === 4 ? side * (compact ? 0.024 : 0.028) : side * (compact ? 0.019 : 0.022);
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    drawSpiralPath(ctx, side * (compact ? 0.14 : 0.2), -rotation * 2.2, "#e2b856", compact ? 1.4 : 1.8);
    ctx.restore();
  }

  function drawSpiralPath(ctx, radius, rotation, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let index = 0; index < 96; index += 1) {
      const step = index / 95;
      const currentRadius = radius * step;
      const angle = step * Math.PI * 7.4 + rotation;
      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawAnchorLoop() {
    const anchor = $("#anchor-sigil-canvas");
    const recovery = $("#recovery-canvas");
    const wheelSigil = $("#wheel-center-sigil-canvas");
    const loop = (time) => {
      if (anchor) drawSigil(anchor, time);
      if (recovery && !$("#recovery-sheet").hidden) drawSigil(recovery, time, true);
      if (wheelSigil && $("#screen-wheel")?.classList.contains("screen-active")) drawSigil(wheelSigil, time, true);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawWheel() {
    const canvas = $("#wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loop = (time) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      drawSigil(canvas, time);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(time / 14000);
      ctx.strokeStyle = "rgba(226,184,86,0.35)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -190);
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function drawCurrentCanvases() {
    if ($("#module-canvas")) drawModuleCanvas(state.currentFlowStep === "alignment" ? getProfile().visual : state.currentFlowStep);
    if (state.currentFlowStep === "alignment") startAlignmentLoop();
    if (state.currentFlowStep === "mirror" && state.draft.usesCameraMirror) startCamera();
  }

  function drawModuleCanvas(name, encoded = state.latestGlyph) {
    const canvas = $("#module-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const loop = (time) => {
      if (!document.body.contains(canvas)) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.34;
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(226,184,86,0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, base * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      if (name === "breath" || name === "steady" || name === "slow" || name === "box" || name === "extendedExhale") {
        drawToroid(ctx, base, t);
      } else if (name === "gate") {
        drawGate(ctx, base, state.draft.triplet.split("-").map(Number), t);
      } else if (name === "mirror") {
        drawGlyph(ctx, base * 0.76, encodeVector(state.draft.intention || "mirror", state.draft.triplet), t);
      } else if (name === "glyph-designer") {
        drawDesignerGlyph(ctx, base, t);
      } else if (name === "timeFoldingSpiral") {
        drawSpiralFractal(ctx, base, t);
      } else if (name === "nestedTetrahedrons") {
        drawNestedTetra(ctx, base, t);
      } else if (name === "monadPulse") {
        drawMonadPulse(ctx, base, t);
      } else if (name === "phaseHypercubes") {
        drawHypercubes(ctx, base, t);
      } else if (name === "collectiveLattice") {
        drawCollectiveLattice(ctx, base, t);
      } else {
        drawGlyph(ctx, base * 0.78, encoded || encodeVector(state.draft.intention || "mirrorgate", state.draft.triplet), t);
      }
      if (activeGlyphEnabled() && ["breath", "vector", "gate", "mirror"].includes(name)) {
        ctx.save();
        ctx.globalAlpha = name === "breath" ? 0.92 : 0.58;
        if (name === "breath") {
          const scale = activeGlyphBreathScale(t);
          ctx.scale(scale, scale);
          drawDesignerGlyph(ctx, base * 0.78, t);
        } else {
          drawDesignerGlyph(ctx, base * (name === "gate" ? 0.48 : 0.54), t + 0.3);
        }
        ctx.restore();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function activeGlyphBreathScale(t) {
    const rhythm = breathRhythms[state.draft.breathRhythm]?.cycle || state.draft.breathSeal || "4-4-4-4";
    const parts = rhythm.split("-").map((value) => Number(value)).filter(Boolean);
    const cycle = parts.length ? parts : [4, 4, 4, 4];
    const total = cycle.reduce((sum, value) => sum + value, 0);
    let cursor = t % total;
    for (let index = 0; index < cycle.length; index += 1) {
      const duration = cycle[index];
      if (cursor <= duration) {
        const p = duration ? cursor / duration : 0;
        if (index === 0) return 0.88 + p * 0.22;
        if (index === 1) return 1.1;
        if (index === 2) return 1.1 - p * 0.2;
        return 0.9;
      }
      cursor -= duration;
    }
    return 1;
  }

  function drawToroid(ctx, base, t) {
    ctx.save();
    ctx.rotate(t * 0.22);
    for (let i = 0; i < 4; i += 1) {
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = `rgba(226,184,86,${0.16 + i * 0.05})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, base * (0.88 + Math.sin(t + i) * 0.04), base * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGate(ctx, base, trip, t) {
    const count = Math.max(9, trip.reduce((a, b) => a + b, 0) % 18 + 8);
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const prime = trip[i % trip.length];
      const angle = -Math.PI / 2 + i * Math.PI * 2 / count + t * 0.16 / prime;
      const radius = base * (0.42 + ((i * prime) % 9) / 14);
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    ctx.strokeStyle = "rgba(226,184,86,0.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "rgba(210,218,245,0.24)";
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i += 1) {
      const [x, y] = points[i];
      const [x2, y2] = points[(i + trip[i % trip.length]) % points.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    points.forEach(([x, y]) => {
      ctx.fillStyle = "#e2b856";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawGlyph(ctx, base, encoded, t) {
    const points = [];
    const count = 6;
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / count + t * 0.05;
      const bit = (encoded.seed >> (i * 3)) & 7;
      const radius = base * (0.52 + bit / 16);
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    ctx.strokeStyle = "rgba(210,218,245,0.6)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < points.length; i += 1) {
      const [x, y] = points[i];
      const [x2, y2] = points[(i + 2) % points.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    drawSpiralPath(ctx, base * 0.42, t * 0.28, "#e2b856", 2.2);
    points.forEach(([x, y]) => {
      ctx.fillStyle = "#e2b856";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawDesignerGlyph(ctx, base, t) {
    const profile = state.glyphDesigner;
    const colors = glyphColorModes[profile.colorMode] || glyphColorModes.goldSilver;
    const intensity = normalizedGlyphIntensity(profile) / 10;
    const emotionalBias = glyphEmotionalTones[profile.emotionalTone]?.bias || 1;
    const tripletText = profile.bindsPrimeTripletVariant && ["vector", "gate"].includes(state.module)
      ? state.draft.triplet
      : profile.primeTripletText;
    const trip = String(tripletText || "3-7-11").split("-").map((value) => Math.max(2, Number(value) || 3));
    const count = Math.min(12, Math.max(3, Number(profile.nodeCount) || 6));
    const motion = profile.animationStyle || "pulse";
    const pulse = motion === "pulse" ? 1 + Math.sin(t * (1.3 + emotionalBias)) * (0.018 + intensity * 0.035) : 1;
    const orbit = motion === "orbit" ? t * (0.16 + emotionalBias * 0.08) : 0;
    const spiralPhase = motion === "spiral" ? t * (0.55 + emotionalBias * 0.42) : t * 0.18;
    const outerRadius = base * pulse * (0.62 + profile.spiralStrength * 0.12);
    const innerRadius = outerRadius * (0.44 + Math.min(0.18, profile.spiralStrength * 0.18));
    const points = [];
    const innerPoints = [];
    for (let i = 0; i < count; i += 1) {
      const prime = trip[i % trip.length] || 3;
      const angle = -Math.PI / 2 + i * Math.PI * 2 / count + orbit + (motion === "still" ? 0 : t * 0.014 / prime);
      const radius = outerRadius * (0.94 + (prime % 7) * 0.012 + Math.sin(i * 1.7 + trip[0]) * 0.018);
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
      innerPoints.push([Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius]);
    }

    const traceClosed = (shape) => {
      ctx.beginPath();
      shape.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    };

    ctx.save();
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = motion === "still" ? 8 + intensity * 8 : 14 + intensity * 18;

    const fillGradient = ctx.createRadialGradient(0, 0, innerRadius * 0.2, 0, 0, outerRadius * 1.08);
    fillGradient.addColorStop(0, `${colors.primary}26`);
    fillGradient.addColorStop(0.58, `${colors.secondary}14`);
    fillGradient.addColorStop(1, "rgba(0,0,0,0)");
    traceClosed(points);
    ctx.fillStyle = fillGradient;
    ctx.fill();

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2.1 + intensity * 1.2;
    traceClosed(points);
    ctx.stroke();

    ctx.shadowBlur = 8 + intensity * 8;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1.05 + intensity * 0.55;
    traceClosed(innerPoints);
    ctx.stroke();

    ctx.globalAlpha = 0.78;
    points.forEach(([x, y], i) => {
      const [ix, iy] = innerPoints[i];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ix, iy);
      ctx.stroke();
    });

    const harmonicStep = Math.max(2, trip[1] % count || 2);
    for (let i = 0; i < count; i += Math.max(1, Math.floor(count / 6))) {
      const [x, y] = innerPoints[i];
      const [x2, y2] = innerPoints[(i + harmonicStep) % count];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.2 + intensity * 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    drawSpiralPath(ctx, innerRadius * (0.68 + profile.spiralStrength * 0.72), spiralPhase, colors.primary, 2.1 + intensity * 1.1);
    points.forEach(([x, y], index) => {
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, (index % 3 === 0 ? 6.3 : 5.1) + intensity * 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawSpiralFractal(ctx, base, t) {
    drawSpiralPath(ctx, base * 0.82, -t * 0.2, "#e2b856", 2.3);
    drawSpiralPath(ctx, base * 0.52, t * 0.35, "rgba(210,218,245,0.64)", 1.2);
  }

  function drawNestedTetra(ctx, base, t) {
    [1, 0.72, 0.46].forEach((scale, index) => {
      ctx.save();
      ctx.rotate(t * (0.08 + index * 0.05));
      drawGate(ctx, base * scale, [3, 7, 11], t + index);
      ctx.restore();
    });
  }

  function drawMonadPulse(ctx, base, t) {
    for (let i = 0; i < 5; i += 1) {
      ctx.strokeStyle = `rgba(226,184,86,${0.08 + i * 0.08})`;
      ctx.beginPath();
      ctx.arc(0, 0, base * (0.18 + i * 0.16 + Math.sin(t * 1.4) * 0.02), 0, Math.PI * 2);
      ctx.stroke();
    }
    drawSpiralPath(ctx, base * 0.44, -t * 0.55, "#e2b856", 2);
  }

  function drawHypercubes(ctx, base, t) {
    for (let layer = 0; layer < 2; layer += 1) {
      const size = base * (0.64 - layer * 0.18);
      ctx.save();
      ctx.rotate(t * (0.12 + layer * 0.08));
      ctx.strokeStyle = layer ? "rgba(226,184,86,0.55)" : "rgba(210,218,245,0.48)";
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.translate(size * 0.18, -size * 0.16);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  function drawCollectiveLattice(ctx, base, t) {
    const points = [];
    for (let i = 0; i < 18; i += 1) {
      const angle = i * Math.PI * 2 / 18 + t * 0.06;
      const radius = base * (0.28 + ((i * 7) % 10) / 14);
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
    ctx.strokeStyle = "rgba(210,218,245,0.22)";
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 5) {
        ctx.beginPath();
        ctx.moveTo(points[i][0], points[i][1]);
        ctx.lineTo(points[j][0], points[j][1]);
        ctx.stroke();
      }
    }
    points.forEach(([x, y], i) => {
      ctx.fillStyle = i % 3 ? "#e2b856" : "#d7def4";
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function captureCanvasDataUrl() {
    const canvas = $("#module-canvas") || $("#anchor-sigil-canvas");
    if (!canvas) return "";
    try {
      return canvas.toDataURL("image/png");
    } catch {
      return "";
    }
  }

  function startAlignmentLoop() {
    state.alignmentStart = performance.now();
    const update = (time) => {
      if (state.currentFlowStep !== "alignment") return;
      const elapsed = Math.min(180, (time - state.alignmentStart) / 1000);
      const progress = $("#alignment-progress");
      const phase = $("#alignment-phase");
      if (progress) progress.style.width = `${(elapsed / 180) * 100}%`;
      if (phase) {
        const profile = getProfile();
        const breathID = profile.breath === "selected" ? state.draft.breathRhythm : profile.breath;
        const cycle = breathRhythms[breathID]?.cycle || "4-4-4-4";
        const parts = cycle.split("-").map(Number);
        const labels = parts.length === 3 ? ["Inhale", "Hold", "Exhale"] : ["Inhale", "Hold", "Exhale", "Pause"];
        const total = parts.reduce((a, b) => a + b, 0);
        let cursor = elapsed % total;
        let active = 0;
        for (let i = 0; i < parts.length; i += 1) {
          if (cursor < parts[i]) { active = i; break; }
          cursor -= parts[i];
        }
        phase.textContent = `${labels[active]} ${Math.max(1, Math.ceil(parts[active] - cursor))}s - ${Math.max(0, Math.ceil(180 - elapsed))}s remaining`;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  function openRecovery(repeat = false) {
    const sheet = $("#recovery-sheet");
    sheet.hidden = false;
    state.recoveryStart = performance.now();
    state.recoveryActive = true;
    playTone(144, 24, "soundscape");
    playAsset("RecoveryResetVoice.mp3");
    updateRecovery();
    if (repeat) state.recoveryStart = performance.now();
  }

  function closeRecovery() {
    $("#recovery-sheet").hidden = true;
    state.recoveryActive = false;
    stopTone();
    stopActiveAudio();
  }

  function updateRecovery() {
    if (!state.recoveryActive) return;
    const elapsed = (performance.now() - state.recoveryStart) / 1000;
    const progress = Math.min(1, elapsed / 24);
    const progressEl = $("#recovery-progress");
    if (progressEl) progressEl.style.width = `${progress * 100}%`;
    const cycle = elapsed % 8;
    const breath = Math.min(3, Math.floor(elapsed / 8) + 1);
    const phaseText = cycle < 4 ? `Inhale ${Math.max(1, 4 - Math.floor(cycle))}s` : `Exhale ${Math.max(1, 8 - Math.floor(cycle))}s`;
    $("#recovery-phase") && ($("#recovery-phase").textContent = `${phaseText} - Breath ${breath} of 3`);
    if (elapsed < 24) requestAnimationFrame(updateRecovery);
  }

  function showStatus(message, kind = "success") {
    let status = $("#status-toast");
    if (!status) {
      status = document.createElement("div");
      status.id = "status-toast";
      status.className = "status-toast";
      document.body.appendChild(status);
    }
    status.textContent = message;
    status.className = `status-toast status-${kind}`;
    if (state.statusTimer) window.clearTimeout(state.statusTimer);
    state.statusTimer = window.setTimeout(() => {
      status.classList.add("status-hidden");
      state.statusTimer = null;
    }, 3200);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function boot() {
    bindGlobalActions();
    drawField();
    drawAnchorLoop();
    drawWheel();
    renderWheel();
    renderCodex();
    $("#screen-wheel .wheel-orientation-panel")?.insertAdjacentHTML(
      "beforeend",
      renderTranscript(voiceScripts.wheelOrientation, "Read wheel transcript")
    );
    $("#recovery-sheet .recovery-card")?.insertAdjacentHTML(
      "beforeend",
      renderTranscript(voiceScripts.recovery, "Read recovery transcript")
    );
    $("#screen-about .panel.prose")?.insertAdjacentHTML("afterend", `
      <div class="control-row">
        <button class="button button-primary" data-action="play-about">Replay Introduction</button>
        <button class="button button-muted" data-action="stop-audio">Stop</button>
      </div>
    `);
  }

  boot();
})();
