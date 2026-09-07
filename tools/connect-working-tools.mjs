// Explicit public shells only. Foreign apps remain in their original framework.
import {readFileSync,writeFileSync} from 'node:fs';
const routes=['northstar','spark','pattern','breath','kasina','steady','clear-path','harmonic_compass','i-sense_observatory','tone_loom','toneparadox','innerorbit','toneglyph','sota_haiku','tone-mirror','scaffold','catastic','mirrorgate','see','flux-notes','threshold'];
for(const route of routes){
  const path=`${route}/index.html`;let html=readFileSync(path,'utf8');
  if(html.includes('/assets/tool-context.js'))continue;
  html=html.replace('</head>','<link rel="stylesheet" href="/assets/tool-context.css?v=20260907-r1">\n<script defer src="/assets/tool-context.js?v=20260907-r1"></script>\n</head>');
  writeFileSync(path,html);
}
console.log(`Connected ${routes.length} public tool shells; untouched Field/Resonance edits, deleted Hidden Worlds and Next hydration remain excluded.`);
