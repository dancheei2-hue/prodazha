document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     МОБИЛЬНОЕ МЕНЮ
  ========================= */

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


  /* =========================
     VIMEO
     СВОЙ ЭКРАН ПОСЛЕ ОКОНЧАНИЯ
  ========================= */

  const vimeoPlayer =
    document.getElementById('vimeoPlayer');

  const videoEnded =
    document.getElementById('videoEnded');


  if (
    vimeoPlayer &&
    typeof Vimeo !== 'undefined'
  ) {

    const player =
      new Vimeo.Player(vimeoPlayer);


    player.on('ended', () => {

      /*
        Скрываем Vimeo-плеер
        после полного окончания видео.
      */

      vimeoPlayer.style.visibility =
        'hidden';


      /*
        Показываем собственный
        финальный экран сайта.
      */

      if (videoEnded) {

        videoEnded.classList.add(
          'visible'
        );

        videoEnded.setAttribute(
          'aria-hidden',
          'false'
        );

      }

    });

  }


  /* =========================
     ФОРМА ОБРАТНОЙ СВЯЗИ
  ========================= */

  const form =
    document.getElementById('contactForm');

  const success =
    document.getElementById('formSuccess');

  const error =
    document.getElementById('formError');


  const endpoint =
    'https://formsubmit.co/ajax/danil@avreal.ru';


  if (form) {

    form.addEventListener(
      'submit',
      async e => {

        e.preventDefault();


        const btn =
          form.querySelector(
            'button[type="submit"]'
          );


        /*
          Сбрасываем предыдущие сообщения.
        */

        success?.classList.remove(
          'visible'
        );

        error?.classList.remove(
          'visible'
        );


        /*
          Блокируем кнопку на время отправки.
        */

        if (btn) {

          btn.disabled = true;

          btn.style.opacity = '.7';

        }


        /*
          Собираем данные формы.
        */

        const data = {

          name:
            form.elements.name.value.trim(),

          phone:
            form.elements.phone.value.trim(),

          message:
            form.elements.message.value.trim(),

          _subject:
            'Новая заявка с сайта «Продай сам»',

          _template:
            'table'

        };


        try {

          const res =
            await fetch(
              endpoint,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  'Accept':
                    'application/json'
                },

                body:
                  JSON.stringify(data)
              }
            );


          /*
            Если сервер вернул ошибку,
            показываем сообщение об ошибке.
          */

          if (!res.ok) {

            throw new Error(
              'request failed'
            );

          }


          /*
            Успешная отправка.
          */

          form.reset();


          success?.classList.add(
            'visible'
          );


        } catch (err) {

          /*
            Ошибка отправки.
          */

          error?.classList.add(
            'visible'
          );


        } finally {

          /*
            Возвращаем кнопку
            в исходное состояние.
          */

          if (btn) {

            btn.disabled = false;

            btn.style.opacity = '1';

          }

        }

      }
    );

  }

});
