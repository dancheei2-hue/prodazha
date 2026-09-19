document.addEventListener('DOMContentLoaded',()=>{
 const burger=document.getElementById('burgerBtn'),menu=document.getElementById('mobileMenu');
 burger?.addEventListener('click',()=>{const open=menu.classList.toggle('open');burger.setAttribute('aria-expanded',open)});
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger?.setAttribute('aria-expanded','false')}));
 const iframe=document.getElementById('vimeoPlayer'),ended=document.getElementById('videoEnded');
 if(iframe&&window.Vimeo){const player=new Vimeo.Player(iframe);player.on('ended',()=>{iframe.style.visibility='hidden';ended?.classList.add('visible')})}
 const form=document.getElementById('contactForm'),success=document.getElementById('formSuccess'),error=document.getElementById('formError');
 if(form)form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('button[type=submit]');success?.classList.remove('visible');error?.classList.remove('visible');if(btn){btn.disabled=true;btn.style.opacity='.6'}const data={name:form.elements.name.value.trim(),phone:form.elements.phone.value.trim(),message:form.elements.message.value.trim(),_subject:'Новая заявка с сайта «Продай сам»',_template:'table'};try{const r=await fetch('https://formsubmit.co/ajax/danil@avreal.ru',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error();form.reset();success?.classList.add('visible')}catch{error?.classList.add('visible')}finally{if(btn){btn.disabled=false;btn.style.opacity='1'}}});
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduce&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('section:not(.hero) .section-no, .mistake-list article, .route-line a, .choice, .loss-grid article, .video-card, .manifesto blockquote').forEach(el=>{el.classList.add('reveal');io.observe(el)})}
 document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.header-cta,.circle-link,.choice a');if(!b)return;b.classList.remove('tap');requestAnimationFrame(()=>b.classList.add('tap'));setTimeout(()=>b.classList.remove('tap'),350)});
});
