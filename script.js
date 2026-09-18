document.addEventListener('DOMContentLoaded', () => {

  /* Мобильное меню */

  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');

      burger.setAttribute(
        'aria-expanded',
        String(open)
      );
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');

        burger.setAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  }


  /* Форма обратной связи */

  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const error = document.getElementById('formError');

  const endpoint =
    'https://formsubmit.co/ajax/danil@avreal.ru';

  if (form) {

    form.addEventListener('submit', async e => {

      e.preventDefault();

      const btn =
        form.querySelector('button[type="submit"]');

      success?.classList.remove('visible');
      error?.classList.remove('visible');

      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '.7';
      }

      const data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        message: form.elements.message.value.trim(),

        _subject:
          'Новая заявка с сайта «Продай сам»',

        _template:
          'table'
      };

      try {

        const res = await fetch(
          endpoint,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Accept':
                'application/json'
            },

            body: JSON.stringify(data)
          }
        );

        if (!res.ok) {
          throw new Error('request failed');
        }

        form.reset();

        success?.classList.add('visible');

      } catch (err) {

        error?.classList.add('visible');

      } finally {

        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '1';
        }

      }

    });

  }

});
