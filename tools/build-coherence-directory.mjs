import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {directoryHTML} from '../assets/app-directory.mjs';
const file=fileURLToPath(new URL('../index.html',import.meta.url));
const html=readFileSync(file,'utf8');
const start='<!-- app-directory:start -->',end='<!-- app-directory:end -->';
if(!html.includes(start)||!html.includes(end))throw new Error('Directory build markers missing');
const next=html.slice(0,html.indexOf(start)+start.length)+'\n'+directoryHTML()+'\n'+html.slice(html.indexOf(end));
if(process.argv.includes('--check')){if(next!==html)throw new Error('Homepage directory does not match canonical registry');console.log('Directory is current.');}
else{writeFileSync(file,next);console.log('Built the complete static homepage directory.');}
