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

 // Desktop screen flow: one wheel gesture = one scene. The horizontal scene consumes wheel-down as horizontal movement, then returns to vertical flow.
 const horizontal = document.querySelector('.horizontal-scene');
 const track = document.getElementById('sequenceTrack');
 const panels = horizontal ? [...horizontal.querySelectorAll('.sequence-panel')] : [];
 const scenesAll = [...document.querySelectorAll('main > .scene')];
 let hIndex = 0, wheelBusy = false;
 const desktop = window.matchMedia('(min-width:801px)');
 const setHorizontal = (next) => {
   if(!track || !panels.length) return;
   hIndex = Math.max(0, Math.min(panels.length - 1, next));
   track.style.transform = `translate3d(-${hIndex * 100}vw,0,0)`;
   horizontal.classList.toggle('is-horizontal-end', hIndex === panels.length - 1);
   const bar=horizontal.querySelector('.horizontal-progress b');
   if(bar) bar.style.width=`${((hIndex+1)/panels.length)*100}%`;
 };
 const goScene = (scene) => {
   if(!scene) return;
   window.scrollTo({top:scene.offsetTop,behavior:'smooth'});
 };
 const horizontalIsActive = () => {
   if(!horizontal) return false;
   return Math.abs(window.scrollY - horizontal.offsetTop) < Math.max(40, window.innerHeight*.18);
 };
 const currentSceneIndex = () => {
   let idx=0, best=Infinity;
   scenesAll.forEach((scene,i)=>{const d=Math.abs(window.scrollY-scene.offsetTop);if(d<best){best=d;idx=i;}});
   return idx;
 };
 if(horizontal && track && desktop.matches){
   setHorizontal(0);
   window.addEventListener('wheel', e => {
     if(!desktop.matches || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
     e.preventDefault();
     if(wheelBusy) return;
     const down=e.deltaY>0;
     wheelBusy=true;
     if(horizontalIsActive()){
       if(down && hIndex < panels.length-1){
         setHorizontal(hIndex+1);
       } else if(!down && hIndex>0){
         setHorizontal(hIndex-1);
       } else if(down && hIndex===panels.length-1){
         goScene(horizontal.nextElementSibling);
       } else if(!down && hIndex===0){
         goScene(horizontal.previousElementSibling);
       }
       setTimeout(()=>wheelBusy=false,850);
       return;
     }
     const idx=currentSceneIndex();
     const target=scenesAll[idx + (down?1:-1)];
     if(target){
       if(target===horizontal && down) setHorizontal(0);
       goScene(target);
     }
     setTimeout(()=>wheelBusy=false,850);
   }, {passive:false});

   let startX=0,startY=0;
   horizontal.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY});
   horizontal.addEventListener('pointerup',e=>{
     const dx=e.clientX-startX,dy=e.clientY-startY;
     if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)) setHorizontal(hIndex+(dx<0?1:-1));
   });
 }

 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.body.classList.add('navigating');setTimeout(()=>document.body.classList.remove('navigating'),500)}));
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.round-btn,.final-button,.hero-next,.route-steps a,.choice-big a');if(!target)return;target.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'})});
});
