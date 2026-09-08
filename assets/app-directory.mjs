// Public destination registry. An information page or historic alias is not another app.
export const appGroups = [
  {id:'tone-apps', title:'Tone & reflection', description:'Attention, steadiness, reflection and participation.', apps:[
    {id:'sovereign', name:'Tone Sovereign', href:'/tone_sovereign/?open=home', about:'/tone_sovereign/?open=about&lang=en', description:'Seven capacities, practices and teachings.', logo:'/tone_sovereign/sword-mark.png'},
    {id:'recall', name:'Tone Recall', href:'/tone/try/#instrument', about:'/tone/', description:'Choose, shape and revisit a tone.', logo:'/assets/tone-recall-icon.png', aliases:['/tone-recall/','/tonerecall/']},
    {id:'tone-steady', name:'Tone Steady', href:'/tone-steady/try/#steady-instrument', about:'/tone-steady/', description:'A pause before responding.', logo:'/assets/tone-steady-icon.png'},
    {id:'ritual', name:'Tone Ritual', href:'/tone-ritual/try/#web-ritual', about:'/tone-ritual/', description:'Small acts that carry intention into life.', logo:'/assets/tone-ritual-icon.png'},
    {id:'tone-threshold', name:'Tone Threshold', href:'/tone-threshold/try/#threshold-instrument', about:'/tone-threshold/', description:'Reflective questions for a crossing.', logo:'/assets/tone-threshold-icon.png'},
    {id:'mirror', name:'Tone Mirror', href:'/tone-mirror/', about:'/tone-mirror-journal/', description:'Symbol, breath and a private reflection.', logo:'/tone-mirror/icon.svg'},
    {id:'glyph', name:'Tone Glyph', href:'/toneglyph/', about:'/toneglyph/about/', description:'Geometry, attention and personal symbolic form.', logo:'/toneglyph/icon.svg'},
    {id:'paradox', name:'Tone Paradox', href:'/toneparadox/', about:'/toneparadox/?open=about', description:'Hold a present state and its opposite.', logo:'/toneparadox/toneparadox-icon.svg'},
    {id:'compass', name:'Harmonic Compass', href:'/harmonic_compass/', description:'Daily gates, practice and reflection. Also known as Tone Compass.', aliases:['/tonecompass/'], homepage:false},
    {id:'loom', name:'Tone Loom', href:'/tone_loom/', about:'/tone_loom/about/', description:'Play tone wheels and weave patterns of sound and light.', logo:'/tone_loom/icon.svg'},
    {id:'inner-orbit', name:'Inner Orbit', href:'/innerorbit/', description:'Another instrument for holding both sides of an experience.', homepage:false},
    {id:'hidden-worlds', name:'Hidden Worlds', href:'/hidden_worlds/app/', about:'/hidden_worlds/', description:'Consider what may lie behind visible behaviour.', homepage:false},
    {id:'tone-hidden-worlds', name:'Tone: Hidden Worlds', href:'/tone_hidden_worlds/', description:'The Tone edition of the empathy practice.', homepage:false}
  ]},
  {id:'sota-family', title:'Meditation & inquiry', description:'Sitting, poetry, direct observation and self-inquiry.', apps:[
    {id:'sota', name:'Sota', href:'/sota/', description:'Sitting, noting and a companion for your practice. Optional AI features.'},
    {id:'haiku', name:'Sota Haiku', href:'/sota_haiku/', description:'One poem, an optional voice, and room to sit.'},
    {id:'unfabricate', name:'Unfabricate', href:'/unfabricate/', description:'A sutta-based companion for direct practice.'},
    {id:'i-sense', name:'I-Sense Observatory', href:'/i-sense_observatory/', description:'Observe the felt sense of being me.'}
  ]},
  {id:'study-support', title:'Study & getting started', description:'Practical support for starting, focusing and returning.', apps:[
    {id:'northstar', name:'Northstar', href:'/northstar/', description:'A calmer academic-skills companion.', logo:'/northstar/icon.svg'},
    {id:'scaffold', name:'Scaffold', href:'/scaffold/', description:'Turn a stuck task into one next physical action.'},
    {id:'study-steady', name:'Steady', href:'/steady/', description:'Short grounding prompts for intense or stuck moments.'},
    {id:'spark', name:'Spark', href:'/spark/', description:'Find a first step when starting feels hard.'},
    {id:'pattern', name:'Pattern', href:'/pattern/', description:'Explore learning and work patterns, with practical strategies.'},
    {id:'flux-notes', name:'Flux Notes', href:'/flux-notes/', description:'Capture notes in words, voice, images or sketches.'},
    {id:'clear-path', name:'Clear Path', href:'/clear-path/', description:'Clarify the task and what comes next.'}
  ]},
  {id:'experiments', title:'Exploration & play', description:'Small instruments for attention, curiosity and making.', apps:[
    {id:'breath', name:'Breath', href:'/breath/', description:'Explore guided breath patterns.'},
    {id:'see', name:'See', href:'/see/', description:'Simple noting of present experience.'},
    {id:'kasina', name:'Kasina', href:'/kasina/', description:'A visual object for concentration.'},
    {id:'field', name:'Field', href:'/field/', description:'Explore awareness and experience.'},
    {id:'resonance', name:'Resonance', href:'/resonance/', description:'An experiment with sound and presence.'},
    {id:'threshold', name:'Threshold', href:'/threshold/', description:'The standalone question and reflection experiment.'},
    {id:'catastic', name:'Catastic!', href:'/catastic/', description:'A playful studio for creating and saving cats.'},
    {id:'mirrorgate', name:'MirrorGate', href:'/mirrorgate/', action:'Availability', description:'Currently unavailable. Its beta is private.', status:'unavailable'}
  ]}
];

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function directoryHTML(){
  return appGroups.map(group=>`<section class="cn-directory-group" id="${group.id}" aria-labelledby="${group.id}-title"><div class="cn-directory-heading"><h3 id="${group.id}-title">${escapeHTML(group.title)}</h3><p>${escapeHTML(group.description)}</p></div><ul class="cn-app-list">${group.apps.filter(app=>app.homepage!==false).map(app=>`<li><div><a href="${app.href}">${escapeHTML(app.name)}</a><small>${escapeHTML(app.description)}</small></div>${app.about?`<a class="cn-app-about" href="${app.about}" aria-label="About ${escapeHTML(app.name)}">About</a>`:app.action?`<span class="cn-app-about">${escapeHTML(app.action)}</span>`:''}</li>`).join('')}</ul></section>`).join('\n');
}
