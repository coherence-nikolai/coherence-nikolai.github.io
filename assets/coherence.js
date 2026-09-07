(() => {
  const navItems = [
    ['/tone_sovereign/?open=home','Tone Sovereign','Tone Sovereign'],
    ['/#apps','All apps','Todas las apps'],
    ['/tone_comics/','Comics','Cómics'],
    ['/#welcome','About','Acerca de'],
    ['/support/','Support','Ayuda']
  ];
  const navHTML = () => navItems.map(([href,en,es])=>`<a href="${href}">${document.documentElement.lang==='es'?es:en}</a>`).join('');
  function updateNavigation(){
    document.querySelectorAll('[data-cn-nav]').forEach(nav=>{nav.innerHTML=navHTML();});
    document.querySelectorAll('[data-cn-guide]').forEach(label=>{label.textContent=document.documentElement.lang==='es'?'Acerca de esta práctica web':'About this web practice';});
    document.querySelectorAll('[data-cn-app-about]').forEach(link=>{link.textContent=(document.documentElement.lang==='es'?'Acerca de ':'About ')+link.dataset.cnAppAbout;});
  }
  if(document.body.dataset.coherence==='public'){
    document.body.classList.add('coherence-public');
    const nav=document.querySelector('.site-header .nav');
    if(nav) nav.setAttribute('data-cn-nav','');
    const footer=document.querySelector('.footer nav');
    if(footer){
      const info={'/tone/try/':['/tone/','Tone Recall'],'/tone-steady/try/':['/tone-steady/','Tone Steady'],'/tone-ritual/try/':['/tone-ritual/','Tone Ritual'],'/tone-threshold/try/':['/tone-threshold/','Tone Threshold']}[location.pathname];
      const excluded=['/',...navItems.map(([href])=>href),'/#tone-apps','/#sota-family',info?.[0]];
      const remaining=[...footer.querySelectorAll('a')].filter(a=>!excluded.includes(a.getAttribute('href'))).map(a=>a.outerHTML).join('');
      footer.innerHTML=`<span class="cn-nav" data-cn-nav></span>${info?`<a href="${info[0]}" data-cn-app-about="${info[1]}">About ${info[1]}</a>`:''}${remaining}`;
    }
  }
  updateNavigation();
  new MutationObserver(updateNavigation).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  // Historic section links remain meaningful without a collapsed directory.
  const aliases={labs:'apps',return:'welcome','tone-comics':'stories','neurodivergent-support':'study-support'};
  function restoreAnchor(){
    let name;try{name=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const target=document.getElementById(aliases[name]||name);
    if(target && aliases[name]) target.scrollIntoView({block:'start',behavior:'instant'});
  }
  window.addEventListener('hashchange',restoreAnchor); restoreAnchor();
})();
