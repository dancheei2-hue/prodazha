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
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.body.classList.add('navigating');setTimeout(()=>document.body.classList.remove('navigating'),500)}));
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.round-btn,.final-button,.hero-next,.route-steps a,.choice-big a');if(!target)return;target.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'})});
});
