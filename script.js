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

 // Desktop guided navigation: wheel moves one full screen at a time.
 const horizontal = document.querySelector('.horizontal-scene');
 const track = document.getElementById('sequenceTrack');
 const panels = horizontal ? [...horizontal.querySelectorAll('.sequence-panel')] : [];
 const scenesAll = [...document.querySelectorAll('main > .scene')];
 let hIndex = 0, wheelBusy = false;
 const setHorizontal = (next) => {
   if(!track || !panels.length) return;
   hIndex = Math.max(0, Math.min(panels.length - 1, next));
   track.style.transform = `translate3d(-${hIndex * 100}vw,0,0)`;
 };
 const goScene = (scene) => {
   if(!scene) return;
   scene.scrollIntoView({behavior:'smooth', block:'start'});
 };
 const horizontalIsActive = () => {
   if(!horizontal) return false;
   const r=horizontal.getBoundingClientRect();
   return r.top > -window.innerHeight*.15 && r.top < window.innerHeight*.15;
 };
 if(horizontal && track && window.matchMedia('(min-width:801px)').matches){
   setHorizontal(0);
   window.addEventListener('wheel', e => {
     if(Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
     const down=e.deltaY>0;
     if(wheelBusy){e.preventDefault();return;}

     if(horizontalIsActive()){
       if((down && hIndex < panels.length-1) || (!down && hIndex > 0)){
         e.preventDefault();
         wheelBusy=true;
         setHorizontal(hIndex + (down?1:-1));
         setTimeout(()=>wheelBusy=false,820);
         return;
       }
       // At the ends, return control to the normal vertical page flow.
       if(down && hIndex === panels.length-1){
         e.preventDefault();
         wheelBusy=true;
         const next=horizontal.nextElementSibling;
         setTimeout(()=>{goScene(next);wheelBusy=false},40);
         return;
       }
       if(!down && hIndex === 0){
         e.preventDefault();
         wheelBusy=true;
         const prev=horizontal.previousElementSibling;
         setTimeout(()=>{goScene(prev);wheelBusy=false},40);
         return;
       }
     }

     // If a large wheel gesture lands between sections, snap to the nearest scene.
     const candidates=scenesAll.filter(x=>x!==horizontal || horizontalIsActive());
     let nearest=null,dist=Infinity;
     candidates.forEach(x=>{const d=Math.abs(x.getBoundingClientRect().top);if(d<dist){dist=d;nearest=x;}});
     if(nearest && dist>8 && dist<window.innerHeight*.75){
       e.preventDefault();
       wheelBusy=true;
       goScene(nearest);
       setTimeout(()=>wheelBusy=false,820);
     }
   }, {passive:false});

   let startX=0,startY=0;
   horizontal.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY});
   horizontal.addEventListener('pointerup',e=>{
     const dx=e.clientX-startX,dy=e.clientY-startY;
     if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)) setHorizontal(hIndex + (dx<0?1:-1));
   });
 }

 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.body.classList.add('navigating');setTimeout(()=>document.body.classList.remove('navigating'),500)}));
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.round-btn,.final-button,.hero-next,.route-steps a,.choice-big a');if(!target)return;target.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'})});
});
