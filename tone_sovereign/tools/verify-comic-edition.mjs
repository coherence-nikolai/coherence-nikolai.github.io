import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const app=await readFile(resolve(root,'app.js'),'utf8');
const sw=await readFile(resolve(root,'sw.js'),'utf8');
const declarations=app.slice(app.indexOf('const THE_LOCK_EDITION'),app.indexOf('const comicSeries'));
const assets=vm.createContext({ROOT:'/tone_sovereign/'});
vm.runInContext(declarations,assets);
for(const lang of ['en','es']){
  const set=vm.runInContext(`theLockAssetSet('${lang}')`,assets);
  const paths=[set.cover,...set.pages];
  assert.equal(paths.length,31);assert.equal(new Set(paths).size,31);
  for(const path of paths){
    const url=new URL(path,'https://example.test');
    assert.equal(url.searchParams.get('edition'),'ink-v4');
    assert(url.pathname.includes(`/comics/${lang}/specials/the-lock/`));
  }
  assert(app.includes(`assets/comics/${lang}/specials/the-lock/transcript.json?edition=`));
}
const origin='https://example.test';
const base=`${origin}/tone_sovereign/assets/comics/en/specials/the-lock/`;
const oldRequest={url:`${base}page-01.webp`};
const newRequest={url:`${base}page-01.webp?edition=ink-v4`,method:'GET'};
const otherComic={url:`${origin}/tone_sovereign/assets/comics/en/issue-01/page-01.webp`};
const foreign={url:'https://different.test/assets/comics/en/specials/the-lock/cover.webp'};
const imageCache=new Map([[oldRequest.url,{label:'old edition'}],[otherComic.url,{label:'other comic'}],[foreign.url,{label:'foreign'}]]);
const deletedCaches=[];const deletedRequests=[];const networkRequests=[];const handlers={};
let core=[];
let finishWrite;
const cache={
  keys:async()=>[oldRequest,newRequest,otherComic,foreign],
  delete:async request=>{deletedRequests.push(request.url);return imageCache.delete(request.url);},
  match:async request=>imageCache.get(request.url),
  put:async(request,response)=>{await new Promise(resolve=>{finishWrite=()=>{imageCache.set(request.url,response);resolve();};});},
  addAll:async requests=>{core=Array.from(requests);}
};
const context=vm.createContext({
  URL,Response,
  self:{location:{origin},addEventListener:(name,handler)=>{handlers[name]=handler;},skipWaiting:()=>{},clients:{claim:()=>{}}},
  caches:{open:async()=>cache,keys:async()=>['tone-sovereign-v1','tone-sovereign-v32','tone-sovereign-v33','tone-sovereign-v34','tone-sovereign-v35','tone-sovereign-comics-v2','tone-sovereign-media-v1','northstar-v1','catastic-v9','field-v2'],delete:async name=>{deletedCaches.push(name);return true;},match:async()=>undefined},
  fetch:async request=>{networkRequests.push(request.url);return {ok:true,label:'new edition',clone(){return this;}};}
});
vm.runInContext(sw,context);
let work;
handlers.install({waitUntil:p=>{work=p;}});await work;
for(const lang of ['en','es'])assert(core.includes(`./assets/comics/${lang}/specials/the-lock/transcript.json?edition=ink-v4`));
handlers.activate({waitUntil:p=>{work=p;}});await work;
assert.deepEqual(deletedCaches,['tone-sovereign-v32','tone-sovereign-v33','tone-sovereign-v34']);
assert(!deletedCaches.includes('tone-sovereign-v35'),'Keep the current website cache.');
assert(!deletedCaches.includes('tone-sovereign-v1'),'Keep the sibling app cache.');
assert.deepEqual(deletedRequests,[oldRequest.url]);
assert(imageCache.has(otherComic.url));assert(imageCache.has(foreign.url));
handlers.fetch({request:newRequest,respondWith:p=>{work=p;}});
let responseSettled=false;
work.then(()=>{responseSettled=true;});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(typeof finishWrite,'function');
assert.equal(responseSettled,false,'Fetch event must stay alive until the offline write finishes.');
finishWrite();
assert.equal((await work).label,'new edition');
assert.deepEqual(networkRequests,[newRequest.url]);
handlers.fetch({request:newRequest,respondWith:p=>{work=p;}});
assert.equal((await work).label,'new edition');
assert.equal(networkRequests.length,1,'An already cached current edition remains available offline.');
imageCache.delete(newRequest.url);
cache.put=async()=>{throw new Error('Quota exceeded');};
handlers.fetch({request:newRequest,respondWith:p=>{work=p;}});
assert.equal((await work).label,'new edition','A storage quota error must not hide a successful online response.');
console.log('Comic edition verified: 62 versioned images, ordered-language transcript paths, Tone-only cleanup, sibling-app preservation, awaited offline writes and quota fallback.');
