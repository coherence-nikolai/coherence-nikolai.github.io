const body=document.body;
const query=new URLSearchParams(location.search);
const lang=query.get('lang')==='es'?'es':'en';
body.dataset.lang=lang;document.documentElement.lang=lang;
document.querySelectorAll('[data-lang-link]').forEach(link=>{if(link.dataset.langLink===lang)link.setAttribute('aria-current','true')});
const descriptions={
  es:{
    'screen-1':'Al anochecer, Stephen espera en un andén lluvioso. La pantalla de servicio anuncia un retraso. Hay otros pasajeros cerca, bajo la luz fluorescente.',
    'screen-3':'Tres globos de pensamiento ocupan el encuadre cercano de Stephen. El andén y los pasajeros siguen apenas visibles alrededor.',
    'screen-4':'Stephen permanece tenso en el mismo andén, donde el servicio sigue retrasado. Aún sostiene el teléfono. Debajo aparecen las opciones de tocar una vez o continuar en silencio.',
    'screen-5':'Un único anillo dorado tenue atraviesa el mismo andén mientras vuelve a aparecer la escena más amplia.',
    'screen-6':'El tren sigue retrasado. La lluvia, los pasajeros, los reflejos y la postura tensa de Stephen comparten el encuadre más amplio.',
    'screen-7':'Cerca, se rompe una bolsa de papel. Varias naranjas caen al andén mojado y una rueda hasta el zapato de Stephen. Él se da cuenta antes de que nadie empiece a ayudar.',
    'screen-8':'Stephen y otro pasajero se agachan para recoger las naranjas mientras la persona que las llevaba mantiene abierta la bolsa rota.',
    'screen-9':'Los mismos pasajeros esperan en el mismo andén lluvioso. El servicio sigue retrasado.'
  }
};
document.querySelectorAll('.comic-screen').forEach((screen,index)=>{
  screen.setAttribute('aria-label',lang==='es'?`Pantalla ${index+1} de 9`:`Screen ${index+1} of 9`);
  const image=screen.querySelector('img[alt]:not([alt=""])');if(image&&descriptions[lang]?.[screen.id])image.alt=descriptions[lang][screen.id];
});
const exit=document.querySelector('.gong-exit');if(exit)exit.setAttribute('aria-label',lang==='es'?'Salir del cómic':'Exit comic');
const labels=lang==='es'?{
  follow:'Seguir el pensamiento',strike:'Tocar una vez',quiet:'Continuar en silencio',return:'Volver al día'
}:{follow:'Follow the thought',strike:'Strike once',quiet:'Continue quietly',return:'Return to the day'};
document.querySelector('[data-action="follow-thought"]')?.setAttribute('aria-label',labels.follow);
document.querySelector('[data-action="strike"]')?.setAttribute('aria-label',labels.strike);
document.querySelector('[data-action="quiet"]')?.setAttribute('aria-label',labels.quiet);
document.querySelector('.gong-return')?.setAttribute('aria-label',labels.return);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const after=document.querySelector('[data-after]');
const screenThree=document.querySelector('.screen-three');
const progress=document.querySelector('.gong-progress');
let phase=query.get('path')==='sound'||query.get('path')==='quiet'?'after':'before';

function setPhase(next,{history='replace',scroll=false}={}){
  phase=next;body.dataset.phase=phase;after.hidden=phase!=='after';
  if(phase==='after')screenThree.classList.add('thoughts-revealed');
  const url=new URL(location.href);
  if(phase==='after')url.searchParams.set('path',url.searchParams.get('path')==='quiet'?'quiet':'sound');else url.searchParams.delete('path');
  if(history==='push')window.history.pushState({phase},'',url);else if(history==='replace')window.history.replaceState({phase},'',url);
  if(scroll&&phase==='after')requestAnimationFrame(()=>document.querySelector('#screen-5')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
}

function playGong(){
  const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
  try{const ctx=new AudioContext(),now=ctx.currentTime,master=ctx.createGain();master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.18,now+.035);master.gain.exponentialRampToValueAtTime(.0001,now+4.4);master.connect(ctx.destination);[98,146.8,223].forEach((frequency,index)=>{const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=index===0?'sine':'triangle';oscillator.frequency.value=frequency;gain.gain.value=[.72,.22,.1][index];oscillator.connect(gain);gain.connect(master);oscillator.start(now);oscillator.stop(now+4.5)});setTimeout(()=>ctx.close(),5000)}catch{}
}

function announce(english,spanish){const status=document.querySelector('#gong-status');if(status)status.textContent=lang==='es'?spanish:english}
function revealThoughts(){if(!screenThree.classList.contains('thoughts-revealed')){screenThree.classList.add('thoughts-revealed');announce('Two more thoughts appeared.','Aparecieron dos pensamientos más.')}}

document.addEventListener('click',event=>{
  const control=event.target.closest('[data-action]');if(!control)return;
  const action=control.dataset.action;
  if(action==='start'){document.querySelector('#screen-1')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}
  if(action==='follow-thought'){revealThoughts();document.querySelector('#screen-3')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}
  if(action==='strike'||action==='quiet'){
    const url=new URL(location.href);url.searchParams.set('path',action==='quiet'?'quiet':'sound');window.history.pushState({phase:'after'},'',url);if(action==='strike')playGong();setPhase('after',{history:'none',scroll:true});announce('One gong. Nothing vanished. There was more room.','Un gong. Nada desapareció. Había más espacio.');return;
  }
  if(action==='replay'){window.history.pushState({phase:'before'},'',location.pathname+`?lang=${lang}`);screenThree.classList.remove('thoughts-revealed');setPhase('before',{history:'none'});document.querySelector('.gong-cover')?.scrollIntoView({behavior:'auto'});}
});

const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.target.id==='screen-3')revealThoughts()}},{threshold:.55}):null;
if(observer)observer.observe(screenThree);
const screens=[...document.querySelectorAll('.comic-screen')];
const progressObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const number=Number(visible.target.id.split('-')[1]);progress.style.setProperty('--progress',`${number/9*100}%`)},{threshold:[.25,.5,.75]}):null;
screens.forEach(screen=>progressObserver?.observe(screen));
window.addEventListener('popstate',()=>setPhase(new URLSearchParams(location.search).has('path')?'after':'before',{history:'none'}));
setPhase(phase,{history:'replace'});
