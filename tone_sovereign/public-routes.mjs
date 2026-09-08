// Public, shareable orientation only. No answers, journals or practice sessions
// belong in a URL or a browser-history record.
export const CAPACITY_BOOKS = Object.freeze([
  ['notice','stop-living-in-the-next-moment'],
  ['stabilise','return-to-centre'],
  ['discern','separate-event-from-interpretation'],
  ['reclaim','emotion-is-information-not-command'],
  ['cross','hold-the-vision-release-the-script'],
  ['embody','devotion-to-the-ordinary'],
  ['integrate','contradiction-disperses-power']
].map(([capacity,teaching],index)=>Object.freeze({capacity,teaching,issue:index+1})));

export function readPublicRoute(search,manifest,catalog,defaultLanguage='en'){
  const query=new URLSearchParams(search);
  const open=query.get('open');
  if(!open) return null;
  const lang=query.get('lang')||(defaultLanguage==='es'?'es':'en');
  const invalid={kind:'unavailable',view:'publicUnavailable',lang:lang==='es'?'es':'en'};
  if(!['en','es'].includes(lang)) return invalid;
  if(['home','comics','library','about'].includes(open)) return {kind:open,view:open,lang};
  if(open==='capacity'){
    const id=query.get('id');
    return catalog?.capacities?.some(item=>item.id===id)?{kind:open,view:'capacityOverview',id,lang}:invalid;
  }
  if(open==='teaching'){
    const id=query.get('id');
    return catalog?.libraryEntries?.some(item=>item.id===id)?{kind:open,view:'entry',id,lang}:invalid;
  }
  if(open==='book'||open==='the-lock'){
    const series=open==='the-lock'?'specials':query.get('series');
    const issue=open==='the-lock'?1:Number(query.get('issue'));
    if(!Number.isSafeInteger(issue)||issue<1) return invalid;
    const edition=manifest?.editions?.find(item=>item.series===series&&item.issue===issue&&item.language===lang);
    if(!edition||!Array.isArray(edition.paths)||!edition.paths.length) return invalid;
    const page=query.get('page');
    let position=1;
    if(page==='cover'){
      if(!edition.hasSeparateCover) return invalid;
    } else if(page!==null){
      if(!/^[1-9]\d*$/.test(page)) return invalid;
      position=Number(page)+(edition.hasSeparateCover?1:0);
      if(!Number.isSafeInteger(position)||position>edition.paths.length) return invalid;
    }
    return {kind:'book',view:'comicReader',series,issue,lang,position};
  }
  return invalid;
}

export function publicURL(route){
  const params=new URLSearchParams({open:route.kind,lang:route.lang==='es'?'es':'en'});
  if(route.kind==='book'){
    params.set('series',route.series);params.set('issue',String(route.issue));
    if(route.page!==undefined) params.set('page',String(route.page));
  }
  if(route.id) params.set('id',route.id);
  return `/tone_sovereign/?${params}`;
}

export function libraryURL(series,lang='en'){
  const params=new URLSearchParams({lang:lang==='es'?'es':'en'});
  if(['mainline','practice-compendium','hall','specials','insight'].includes(series)) params.set('series',series);
  return `/tone_comics/?${params}`;
}
