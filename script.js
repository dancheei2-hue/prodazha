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

 // Desktop: the journey chapter moves horizontally, then returns to vertical scrolling.
 const horizontal = document.querySelector('.horizontal-scene');
 const track = document.getElementById('sequenceTrack');
 const progressLine = horizontal?.querySelector('.horizontal-progress b');
 const panels = horizontal ? [...horizontal.querySelectorAll('.sequence-panel')] : [];
 let hIndex = 0, hBusy = false;
 const setHorizontal = (next) => {
  if(!track || !panels.length) return;
  hIndex = Math.max(0, Math.min(panels.length - 1, next));
  track.style.transform = `translate3d(-${hIndex * 100}vw,0,0)`;
  if(progressLine) progressLine.style.width = `${((hIndex+1)/panels.length)*100}%`;
  horizontal.classList.toggle('is-horizontal-end', hIndex === panels.length-1);
 };
 if(horizontal && track && window.matchMedia('(min-width:801px)').matches){
  setHorizontal(0);
  window.addEventListener('wheel', e => {
   const r = horizontal.getBoundingClientRect();
   const inside = r.top <= 2 && r.bottom >= window.innerHeight - 2;
   if(!inside || hBusy) return;
   const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
   if(Math.abs(delta) < 18) return;
   if((delta > 0 && hIndex < panels.length-1) || (delta < 0 && hIndex > 0)){
    e.preventDefault();
    hBusy = true;
    setHorizontal(hIndex + (delta > 0 ? 1 : -1));
    setTimeout(()=>hBusy=false, 760);
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
