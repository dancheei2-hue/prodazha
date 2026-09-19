document.addEventListener('DOMContentLoaded',()=>{
 const burger=document.getElementById('burgerBtn'),menu=document.getElementById('mobileMenu');
 burger?.addEventListener('click',()=>{const open=menu.classList.toggle('open');burger.setAttribute('aria-expanded',String(open))});
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger?.setAttribute('aria-expanded','false')}));
 const progress=document.getElementById('progressBar');
 const scenes=[...document.querySelectorAll('.scene')];
 if('IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');e.target.querySelectorAll('.reveal').forEach(x=>x.classList.add('in'))}}),{threshold:.2});
  scenes.forEach(scene=>{scene.querySelectorAll('.route-steps a,.mistake-cards article,.choice-big a,.money-stack article,.video-wrap,.mistakes-head,.choice-inner,.final-copy').forEach(x=>x.classList.add('reveal'));io.observe(scene)});
  const pio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&progress){const idx=scenes.indexOf(e.target)+1;progress.style.width=`${Math.round(idx/scenes.length*100)}%`}}),{threshold:.55});
  scenes.forEach(x=>pio.observe(x));
 }
 const iframe=document.getElementById('vimeoPlayer'),ended=document.getElementById('videoEnded');
 if(iframe&&window.Vimeo){const player=new Vimeo.Player(iframe);player.on('ended',()=>{iframe.style.visibility='hidden';ended?.classList.add('visible')})}

 // Desktop guided flow. One wheel gesture advances exactly one scene/panel.
 const horizontal = document.querySelector('.horizontal-scene');
 const track = document.getElementById('sequenceTrack');
 const panels = horizontal ? [...horizontal.querySelectorAll('.sequence-panel')] : [];
 const scenesAll = [...document.querySelectorAll('main > .scene')];
 let hIndex = 0, wheelBusy = false, wheelTimer = null;
 const desktop = window.matchMedia('(min-width:801px)');
 const setHorizontal = (next) => {
   if(!track || !panels.length) return;
   hIndex = Math.max(0, Math.min(panels.length - 1, next));
   track.style.transform = `translate3d(-${hIndex * 100}vw,0,0)`;
   horizontal.classList.toggle('is-horizontal-end', hIndex === panels.length - 1);
 };
 const goScene = (scene) => {
   if(!scene) return;
   const top = scene.getBoundingClientRect().top + window.scrollY;
   window.scrollTo({top, behavior:'smooth'});
 };
 const horizontalIsActive = () => horizontal && Math.abs(window.scrollY - (horizontal.offsetTop || 0)) < 24;
 const currentSceneIndex = () => {
   const y=window.scrollY, vh=window.innerHeight;
   let idx=0, best=Infinity;
   scenesAll.forEach((scene,i)=>{
     const top=scene.offsetTop, d=Math.abs(y-top);
     if(d<best){best=d;idx=i;}
   });
   return idx;
 };
 const releaseWheel = () => { wheelBusy=false; wheelTimer=null; };
 const lockWheel = (ms=1100) => {
   wheelBusy=true;
   clearTimeout(wheelTimer);
   wheelTimer=setTimeout(releaseWheel,ms);
 };
 if(horizontal && track && desktop.matches){
   setHorizontal(0);
   window.addEventListener('wheel', e => {
     if(!desktop.matches || Math.abs(e.deltaY) <= Math.abs(e.deltaX) || wheelBusy) return;
     e.preventDefault();
     const down=e.deltaY>0;
     lockWheel(1100);
     if(horizontalIsActive()){
       if(down && hIndex < panels.length-1){
         setHorizontal(hIndex+1);
       } else if(!down && hIndex>0){
         setHorizontal(hIndex-1);
       } else {
         const target=down ? horizontal.nextElementSibling : horizontal.previousElementSibling;
         if(target) goScene(target);
       }
       return;
     }
     const idx=currentSceneIndex();
     const target=scenesAll[idx + (down?1:-1)];
     if(target){
       if(target===horizontal && down) setHorizontal(0);
       goScene(target);
     } else {
       // At the footer/bottom or top, release the lock so native page movement is not trapped.
       setTimeout(releaseWheel,120);
     }
   }, {passive:false});
 }

 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.body.classList.add('navigating');setTimeout(()=>document.body.classList.remove('navigating'),500)}));
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.round-btn,.final-button,.hero-next,.route-steps a,.choice-big a');if(!target)return;target.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'})});
});
