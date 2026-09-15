// ============================================================
// Продай сам — Самолет Плюс: базовая интерактивность
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu ---------- */
  const header = document.querySelector('.site-header');
  const burgerBtn = document.getElementById('burgerBtn');

  if (burgerBtn && header) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // close mobile menu when a nav link is clicked
    header.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all other items (accordion behaviour)
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Video "play" placeholder ---------- */
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoCtaBtn = document.getElementById('videoCtaBtn');
  const videoPlayer = document.querySelector('.video-player');

  function playVideoPlaceholder(e) {
    if (e) e.preventDefault();
    if (videoPlayer) {
      videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      videoPlayer.style.outline = '3px solid #2f5bff';
      setTimeout(() => { videoPlayer.style.outline = 'none'; }, 800);
    }
  }

  if (videoPlayBtn) videoPlayBtn.addEventListener('click', playVideoPlaceholder);
  if (videoCtaBtn) videoCtaBtn.addEventListener('click', playVideoPlaceholder);

  /* ---------- Contact form: sends submissions to danil@avreal.ru via FormSubmit ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/danil@avreal.ru';

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const phone = contactForm.querySelector('input[name="phone"]').value.trim();

      if (formError) formError.classList.remove('visible');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          _subject: 'Новая заявка с сайта «Продай сам»',
          _template: 'table'
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Request failed');
          formSuccess.classList.add('visible');
          contactForm.reset();
          setTimeout(() => formSuccess.classList.remove('visible'), 8000);
        })
        .catch(() => {
          if (formError) formError.classList.add('visible');
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
        });
    });
  }

});
