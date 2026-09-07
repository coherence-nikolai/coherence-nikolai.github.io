/* Explicit, read-only DOM adapters for public context. No storage, app actions,
   audio, canvas, history, fetch or automatic navigation. Focus modes stay quiet. */
(() => {
  const route=location.pathname.replace(/index\.html$/,'');
  const hosts={
    '/northstar/':[{selector:'main.main',at:'start'}],
    '/spark/':[{selector:'#s-home',screen:true}],
    '/pattern/':[{selector:'#s-home',screen:true}],
    '/breath/':[{selector:'#s-home',screen:true}],
    '/kasina/':[{selector:'#s-home',screen:true}],
    '/see/':[{selector:'#s-home',screen:true}],
    '/field/':[{selector:'#s-home',screen:true}],
    '/resonance/':[{selector:'#s-home',screen:true}],
    '/steady/':[{selector:'.container',at:'start'}],
    '/flux-notes/':[{selector:'.topbar',at:'before'}],
    '/threshold/':[{selector:'#landing',scroll:true}],
    '/clear-path/':[{selector:'#main',at:'start'}],
    '/harmonic_compass/':[{selector:'.workspace',at:'start'}],
    '/i-sense_observatory/':[{selector:'.app-shell',at:'start'}],
    '/tone_loom/':[{selector:'#landingScreen'},{selector:'#loomApp .app-topbar',at:'after'}],
    '/toneparadox/':[{selector:'#landingPage > .landing-header',at:'after'},{selector:'#aboutDialog h2',at:'after',dialog:true}],
    '/innerorbit/':[{selector:'#aboutDialog h2',at:'after',dialog:true}],
    '/toneglyph/':[{selector:'.mode-rail',at:'after',variant:'cn-glyph-mobile'},{selector:'#control-drawer',variant:'cn-glyph-desktop'}],
    '/sota_haiku/':[{selector:'#app > main.stack'},{selector:'#app .line-menu-list',at:'start'}],
    '/sota/':[{selector:'#screen-entry',screen:true},{selector:'#settings-panel .settings-inner',at:'start'},{selector:'#mode-sit-setup .setup-inner',at:'start'}],
    '/tone-mirror/':[{selector:'.landing-stack'},{selector:'.app-shell > header.topbar',at:'after',variant:'cn-tool-constrained'}],
    '/scaffold/':[{selector:'.app-header',at:'after',variant:'cn-tool-constrained'}],
    '/catastic/':[{selector:'#root',at:'before',variant:'cn-tool-constrained'}],
    '/mirrorgate/':[{selector:'main'}]
  }[route];
  if(!hosts)return;
  const text={en:['Coherence Nikolai · website home','All apps','Comics','Support','Website navigation'],es:['Coherence Nikolai · inicio del sitio','Todas las apps','Cómics','Ayuda','Navegación del sitio']};
  function build(id,variant){
    const nav=document.createElement('nav');nav.className=`cn-tool-links ${variant||''}`;nav.dataset.cnContext=id;
    const copy=text[document.documentElement.lang==='es'?'es':'en'];nav.setAttribute('aria-label',copy[4]);
    ['/','/#apps','/tone_comics/','/support/'].forEach((href,index)=>{const anchor=document.createElement('a');anchor.href=href;anchor.textContent=copy[index];nav.append(anchor);});
    return nav;
  }
  function mount(){
    hosts.forEach((rule,index)=>{
      const host=document.querySelector(rule.selector);
      const id=`${route}:${index}`;
      const existing=[...document.querySelectorAll('[data-cn-context]')].find(node=>node.dataset.cnContext===id);
      if(!host){existing?.remove();return;}
      if(existing)return;
      if(rule.screen)host.classList.add('cn-connected-screen');
      if(rule.scroll)host.classList.add('cn-connected-landing');
      if(rule.dialog)host.closest('dialog')?.classList.add('cn-tool-dialog');
      const nav=build(id,rule.variant);
      if(rule.at==='after')host.after(nav);
      else if(rule.at==='before')host.before(nav);
      else if(rule.at==='start')host.prepend(nav);
      else host.append(nav);
    });
  }
  let scheduled=false;
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mount();});};
  mount();
  // Whole-root renders in the existing apps may replace a host. Reattach only
  // the context node, never call an app's Enter/Reset/Save function to find it.
  new MutationObserver(records=>{if(records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1&&!node.matches?.('.cn-tool-links'))))schedule();}).observe(document.body,{childList:true,subtree:true});
  new MutationObserver(()=>{document.querySelectorAll('[data-cn-context]').forEach(node=>node.remove());schedule();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
