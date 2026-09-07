import {publicURL,libraryURL,CAPACITY_BOOKS} from '../tone_sovereign/public-routes.mjs';
const current=document.querySelector('#current-library');
const archive=document.querySelector('#archive-library');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const collections=[
  ['mainline','The Sovereign / Tone Sovereign','El Soberano / Tone Sovereign','The original six issues.','Los seis números originales.'],
  ['practice-compendium','The seven practice books','Los siete libros de práctica','A book for each capacity. Read in any order.','Un libro para cada capacidad. Lee en cualquier orden.'],
  ['hall','Villain arcs','Arcos de los adversarios','The Hall of Inner Adversaries.','El Salón de los Adversarios Interiores.'],
  ['specials','Special stories','Historias especiales','THE LOCK and the longer stories.','EL BLOQUEO y las historias largas.'],
  ['insight','Insight','Insight','A separate illustrated exploration.','Una exploración ilustrada independiente.']
];
let manifest;
let archiveLoaded=false;
function legacyRequested(){
  // Preserve old issue hashes without stealing the current library's skip link.
  const currentAnchor=location.hash==='#current-library'||location.hash==='#current-shelves'||location.hash.startsWith('#collection-');
  return new URLSearchParams(location.search).get('edition')==='archive'||Boolean(location.hash&&!currentAnchor);
}
function resolvedAsset(path){return new URL(path,new URL('/tone_sovereign/',location.origin)).pathname+(new URL(path,new URL('/tone_sovereign/',location.origin)).search);}
async function renderLibrary(){
  const skip=document.querySelector('.cn-skip');
  if(skip)skip.href=legacyRequested()?'#archive-library':'#current-library';
  if(legacyRequested()){
    document.documentElement.lang='en';
    current.hidden=true;archive.hidden=false;
    if(!archiveLoaded){
      try{await import('./app.js?v=20260810c');archiveLoaded=true;}
      catch{archive.querySelector('#comic-stats').innerHTML='The archive could not load. <a href="/tone_comics/?edition=archive">Reload the archive</a>.';}
    }
    return;
  }
  current.hidden=false;archive.hidden=true;
  const query=new URLSearchParams(location.search);
  const lang=query.get('lang')==='es'?'es':'en';
  const es=lang==='es';
  document.documentElement.lang=lang;
  const requested=query.get('series');
  const active=collections.some(([id])=>id===requested)?requested:null;
  const title=es?'Historias para un mundo más consciente.':'Stories for a more conscious world.';
  current.innerHTML=`<header class="cn-section cn-library-intro"><p class="cn-eyebrow">Tone Comics</p><h1>${title}</h1><p class="cn-muted">${es?'Un solo catálogo de las ediciones actuales, con los estilos originales de cada historia. Elige una colección y lee a tu ritmo.':'One catalogue of the current editions, preserving each story’s own art and voice. Choose a collection and read at your own pace.'}</p><nav class="cn-language" aria-label="${es?'Idioma de lectura':'Reading language'}"><a href="${libraryURL(active,'en')}" ${!es?'aria-current="true"':''}>English</a><a href="${libraryURL(active,'es')}" ${es?'aria-current="true"':''}>Español</a></nav><nav class="cn-library-index" aria-label="${es?'Colecciones':'Collections'}"><a href="${libraryURL(null,lang)}" ${!active?'aria-current="true"':''}>${es?'Todas':'All collections'}</a>${collections.map(([id,enTitle,esTitle])=>`<a href="${libraryURL(id,lang)}" ${active===id?'aria-current="true"':''}>${esc(es?esTitle:enTitle)}</a>`).join('')}</nav></header><div id="current-shelves"><p role="status">${es?'Cargando las ediciones…':'Loading editions…'}</p></div><aside class="cn-section"><h2>${es?'Ediciones anteriores':'Earlier editions'}</h2><p class="cn-muted">${es?'El archivo conserva las versiones originales, variantes y su orden de páginas.':'The archive keeps the original versions, variants and page order intact.'}</p><a class="cn-link" href="/tone_comics/?edition=archive">${es?'Abrir el archivo original':'Open the original archive'} →</a></aside>`;
  const shelves=current.querySelector('#current-shelves');
  try{
    if(!manifest){const response=await fetch('/tone_sovereign/comic-editions.json',{cache:'no-cache'});if(!response.ok)throw Error('manifest');manifest=await response.json();if(manifest.version!==1||!Array.isArray(manifest.editions))throw Error('format');}
    // Avoid replacing a newer route if a fetch finished after navigation.
    if(legacyRequested()||document.documentElement.lang!==lang||new URLSearchParams(location.search).get('series')!==requested)return;
    shelves.innerHTML=collections.filter(([id])=>!active||id===active).map(([id,enTitle,esTitle,enCopy,esCopy])=>{
      const editions=manifest.editions.filter(item=>item.series===id&&item.language===lang&&item.issue>0).sort((a,b)=>a.issue-b.issue);
      return `<section class="cn-section" aria-labelledby="collection-${id}"><div class="cn-section-intro"><div><h2 id="collection-${id}">${esc(es?esTitle:enTitle)}</h2><p>${esc(es?esCopy:enCopy)}</p></div></div><div class="cn-library-books">${editions.map(edition=>{
        const other=manifest.editions.find(item=>item.series===id&&item.issue===edition.issue&&item.language!==(lang));
        const link=publicURL({kind:'book',series:id,issue:edition.issue,lang});
        const relation=id==='practice-compendium'?CAPACITY_BOOKS.find(item=>item.issue===edition.issue):null;
        return `<article class="cn-library-book"><a class="cn-book" href="${link}"><img src="${esc(resolvedAsset(edition.thumbnail||edition.paths[0]))}" width="320" height="480" loading="lazy" decoding="async" alt=""><strong>${esc(edition.title)}</strong></a><p class="cn-book-meta">${edition.hasSeparateCover?`${edition.storyPageCount} ${es?'páginas + portada':'pages + cover'}`:`${edition.imageCount} ${es?'páginas':'pages'}`}</p><div class="cn-edition-links"><a href="${link}">${es?'Leer en español':'Read in English'}</a>${other?`<a href="${publicURL({kind:'book',series:id,issue:edition.issue,lang:other.language})}" lang="${other.language}">${es?'English':'Español'}</a>`:''}</div>${relation?`<a class="cn-link cn-book-practice" href="${publicURL({kind:'capacity',id:relation.capacity,lang})}">${es?'Explorar esta capacidad':'Explore this capacity'} →</a>`:''}</article>`;
      }).join('')}</div></section>`;
    }).join('');
  }catch{
    manifest=null;
    shelves.innerHTML=`<p role="alert">${es?'No se pudo cargar el catálogo. Puedes volver a intentarlo o abrir el archivo original.':'The catalogue could not load. Please retry or open the original archive.'}</p><a class="cn-button" href="${libraryURL(active,lang)}">${es?'Volver a intentar':'Try again'}</a>`;
  }
}
document.addEventListener('click',event=>{
  const anchor=event.target.closest('#current-library a');
  if(!anchor||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(anchor.href);
  if(url.pathname!=='/tone_comics/'||url.searchParams.has('edition')||url.hash)return;
  event.preventDefault();history.pushState(null,'',url);renderLibrary().then(()=>{current.querySelector('h1')?.setAttribute('tabindex','-1');current.querySelector('h1')?.focus({preventScroll:true});window.scrollTo(0,0);});
});
window.addEventListener('popstate',renderLibrary);
window.addEventListener('hashchange',()=>{if(legacyRequested())renderLibrary();});
await renderLibrary();
