// Mechanical shared-frame migration. Explicit list excludes working app shells,
// private beta, redirects, native code and all unrelated dirty files.
import {readFileSync,writeFileSync} from 'node:fs';
const pages=['tone/index.html','tone/try/index.html','tone-steady/index.html','tone-steady/try/index.html','tone-ritual/index.html','tone-ritual/try/index.html','tone-threshold/index.html','tone-threshold/try/index.html','tone-mirror-journal/index.html','sota/index.html','support/index.html','privacy/index.html','terms/index.html','restore-purchases/index.html'];
const nav='<a href="/tone_sovereign/?open=home">Tone Sovereign</a><a href="/#apps">All apps</a><a href="/tone_comics/">Comics</a><a href="/#welcome">About</a><a href="/support/">Support</a>';
for(const path of pages){
  let html=readFileSync(path,'utf8');
  if(!html.includes('/assets/coherence.css')) html=html.replace('</head>','  <link rel="stylesheet" href="/assets/coherence.css?v=20260907-r2">\n  <script defer src="/assets/coherence.js?v=20260907-r2"></script>\n</head>');
  if(!html.includes('data-coherence="public"')) html=html.replace(/<body([^>]*)>/,'<body$1 data-coherence="public">');
  html=html.replace(/<body([^>]*)>/,(match,attrs)=>attrs.includes('coherence-public')?match:attrs.includes('class="')?`<body${attrs.replace('class="','class="coherence-public ')}>`:`<body class="coherence-public"${attrs}>`);
  html=html.replace(/(<header class="site-header[^\"]*">[\s\S]*?<nav class="nav"[^>]*>)[\s\S]*?(<\/nav>)/,`$1${nav}$2`);
  if(!html.includes('class="footer"')) html=html.replace('</body>',`<footer class="footer"><p>Coherence Nikolai · apps, practices and stories.</p><nav aria-label="Website navigation">${nav}<a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/restore-purchases/">Purchase help</a></nav></footer>\n</body>`);
  if(path.includes('/try/')&&!html.includes('cn-optional-guide')) html=html.replace(/<section class="(?:web-map|steady-map|try-map|threshold-map) section"[\s\S]*?<\/section>/,match=>`<details class="cn-optional-guide"><summary data-cn-guide>About this web practice</summary>${match}</details>`);
  const marks={'tone/index.html':'/assets/tone-recall-icon.png','tone-steady/index.html':'/assets/tone-steady-icon.png','tone-ritual/index.html':'/assets/tone-ritual-icon.png','tone-threshold/index.html':'/assets/tone-threshold-icon.png','tone-mirror-journal/index.html':'/tone-mirror/icon.svg'};
  if(marks[path]&&!html.includes('cn-entrance-mark'))html=html.replace('<section class="hero page-hero">',`<section class="hero page-hero"><img class="cn-entrance-mark" src="${marks[path]}" width="120" height="120" alt="" decoding="async">`);
  for(const [href,anchor] of [['/tone/try/','instrument'],['/tone-steady/try/','steady-instrument'],['/tone-ritual/try/','web-ritual'],['/tone-threshold/try/','threshold-instrument']]) html=html.replaceAll(`href="${href}"`,`href="${href}#${anchor}"`);
  writeFileSync(path,html);
}
console.log(`Connected ${pages.length} public information and practice entrances.`);
