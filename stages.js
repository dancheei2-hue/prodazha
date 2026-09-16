// ============================================================
// Страница "20 уроков" — экран текущего урока + экран списка,
// данные берутся из stages-data.json (единый источник с PDF-чек-листом).
//
// КАК ДОБАВИТЬ ВИДЕО (RuTube или VK Видео):
// Откройте stages-data.json, найдите нужный урок по номеру ("num")
// и впишите в поле "video" ссылку на встраивание и, по желанию, длительность:
//
//   RuTube: на странице видео нажмите "Поделиться" → "Вставить код" →
//           скопируйте адрес из атрибута src, например:
//           "video": { "type": "rutube", "src": "https://rutube.ru/play/embed/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/", "duration": "12:34" }
//
//   VK Видео: на странице видео нажмите "Поделиться" → "Код для вставки" →
//           скопируйте адрес из атрибута src (vk.com/video_ext.php?...), например:
//           "video": { "type": "vk", "src": "https://vk.com/video_ext.php?oid=-123&id=456&hash=abc", "duration": "9:12" }
//
// Пока поле "video" оставлено как null — вместо видео показывается заглушка,
// а в списке уроков вместо длительности стоит пометка "Скоро".
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const lessonView = document.getElementById('lessonView');
  const listView = document.getElementById('lessonsListView');
  const listEl = document.getElementById('lessonsList');
  const bodyEl = document.getElementById('courseAppBody');
  if (!lessonView || !listView || !listEl || !bodyEl) return;

  const els = {
    counter: document.getElementById('lessonCounter'),
    title: document.getElementById('lessonTitle'),
    checklist: document.getElementById('lessonChecklist'),
    video: document.getElementById('lessonVideo'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    nextCard: document.getElementById('nextCard'),
    nextCardLabel: document.getElementById('nextCardLabel'),
    nextCardTitle: document.getElementById('nextCardTitle'),
    nextCardDuration: document.getElementById('nextCardDuration'),
    toggleListBtn: document.getElementById('toggleListBtn'),
    showListBtn: document.getElementById('showListBtn'),
    backToLessonBtn: document.getElementById('backToLessonBtn'),
  };

  let flatStages = [];
  let isSuppressingHash = false;

  fetch('stages-data.json')
    .then((res) => res.json())
    .then((data) => {
      data.groups.forEach((group) => {
        group.items.forEach((item) => {
          flatStages.push({ ...item, groupTitle: group.title, groupRange: group.range });
        });
      });

      renderList();

      const initialNum = getStageNumFromHash() || flatStages[0].num;
      showLesson(initialNum, { updateHash: false, scroll: false });

      window.addEventListener('hashchange', () => {
        if (isSuppressingHash) { isSuppressingHash = false; return; }
        const num = getStageNumFromHash();
        if (num) showLesson(num, { updateHash: false, closeList: true });
      });
    })
    .catch((err) => {
      els.title.textContent = 'Не удалось загрузить уроки';
      console.error(err);
    });

  els.toggleListBtn.addEventListener('click', () => openList());
  els.showListBtn.addEventListener('click', () => openList());
  els.backToLessonBtn.addEventListener('click', () => closeList());

  function openList() {
    listView.classList.add('is-visible');
    lessonView.classList.add('is-hidden-mobile');
  }
  function closeList() {
    listView.classList.remove('is-visible');
    lessonView.classList.remove('is-hidden-mobile');
  }

  function getStageNumFromHash() {
    const match = window.location.hash.match(/^#stage-(\d+)$/);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    return flatStages.some((s) => s.num === num) ? num : null;
  }

  function durationLabel(stage) {
    if (stage.video && stage.video.duration) return stage.video.duration;
    if (stage.video && stage.video.src) return 'Видео';
    return 'Скоро';
  }

  function renderList() {
    listEl.innerHTML = flatStages.map((stage) => `
      <button class="lesson-row" data-num="${stage.num}" aria-label="Урок ${stage.num}: ${stage.title}">
        <span class="lesson-row-num">${stage.num}</span>
        <span class="lesson-row-text">
          <span class="lesson-row-title">${stage.title}</span>
          <span class="lesson-row-duration">${durationLabel(stage)}</span>
        </span>
        <span class="lesson-row-play" aria-hidden="true"><span>▶</span></span>
      </button>
    `).join('');

    listEl.querySelectorAll('.lesson-row').forEach((row) => {
      row.addEventListener('click', () => {
        const num = parseInt(row.dataset.num, 10);
        showLesson(num, { updateHash: true, closeList: true });
      });
    });
  }

  function renderVideo(stage) {
    const video = stage.video;
    if (!video || !video.src) {
      return `
        <div class="lesson-video-placeholder">
          <div class="lesson-video-stage">
            <span class="lesson-video-play" aria-hidden="true"><span>▶</span></span>
          </div>
          <div class="lesson-video-controlbar">
            <span class="cb-icon" aria-hidden="true">▶</span>
            <span>Видео скоро</span>
            <span class="cb-track" aria-hidden="true"></span>
            <span class="cb-icon" aria-hidden="true">🔊</span>
            <span class="cb-icon" aria-hidden="true">⚙</span>
            <span class="cb-icon" aria-hidden="true">⛶</span>
          </div>
        </div>`;
    }
    return `<div class="lesson-video-frame">
      <iframe src="${video.src}" allow="clipboard-write; autoplay" allowfullscreen loading="lazy"></iframe>
    </div>`;
  }

  function showLesson(num, opts) {
    const options = opts || {};
    const idx = flatStages.findIndex((s) => s.num === num);
    if (idx === -1) return;
    const stage = flatStages[idx];
    const prev = flatStages[idx - 1];
    const next = flatStages[idx + 1];

    els.counter.textContent = `Урок ${stage.num} из ${flatStages.length}`;
    els.title.textContent = stage.title;
    els.checklist.innerHTML = stage.checklist.map((c) => `<li>${c}</li>`).join('');
    els.video.innerHTML = renderVideo(stage);

    els.prevBtn.disabled = !prev;
    els.prevBtn.onclick = prev ? () => showLesson(prev.num, { updateHash: true }) : null;

    if (next) {
      els.nextBtn.textContent = 'Следующий урок →';
      els.nextBtn.onclick = () => showLesson(next.num, { updateHash: true });

      els.nextCard.href = `#stage-${next.num}`;
      els.nextCard.onclick = (e) => { e.preventDefault(); showLesson(next.num, { updateHash: true }); };
      els.nextCardLabel.textContent = `Урок ${next.num}`;
      els.nextCardTitle.textContent = next.title;
      els.nextCardDuration.textContent = durationLabel(next);
      els.nextCard.style.display = '';
    } else {
      els.nextBtn.textContent = 'Завершить курс →';
      els.nextBtn.onclick = () => { window.location.href = 'index.html#contact'; };

      els.nextCardLabel.textContent = 'Финал';
      els.nextCardTitle.textContent = 'Поздравляем — вы прошли весь курс! Обсудим продажу?';
      els.nextCardDuration.textContent = 'Написать Данилу';
      els.nextCard.href = 'index.html#contact';
      els.nextCard.onclick = null;
    }

    listEl.querySelectorAll('.lesson-row').forEach((row) => {
      row.classList.toggle('is-active', parseInt(row.dataset.num, 10) === num);
    });
    const activeRow = listEl.querySelector('.lesson-row.is-active');
    if (activeRow && activeRow.scrollIntoView) {
      activeRow.scrollIntoView({ block: 'nearest' });
    }

    if (options.updateHash !== false) {
      isSuppressingHash = true;
      window.location.hash = `stage-${num}`;
    }
    if (options.closeList) {
      closeList();
    }

    if (options.scroll !== false && window.innerWidth <= 960) {
      lessonView.scrollIntoView({ block: 'start' });
    }
  }
});
