// ============================================================
// Страница "20 этапов" — рендер списка и деталей из stages-data.json
//
// КАК ДОБАВИТЬ ВИДЕО (RuTube или VK Видео):
// Откройте stages-data.json, найдите нужный этап по номеру ("num")
// и впишите в поле "video" ссылку на встраивание:
//
//   RuTube: на странице видео нажмите "Поделиться" → "Вставить код" →
//           скопируйте адрес из атрибута src, например:
//           "video": { "type": "rutube", "src": "https://rutube.ru/play/embed/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/" }
//
//   VK Видео: на странице видео нажмите "Поделиться" → "Код для вставки" →
//           скопируйте адрес из атрибута src (vk.com/video_ext.php?...), например:
//           "video": { "type": "vk", "src": "https://vk.com/video_ext.php?oid=-123&id=456&hash=abc" }
//
// Пока поле "video" оставлено как null — вместо видео показывается заглушка.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('stagesNav');
  const detailEl = document.getElementById('stageDetail');
  if (!navEl || !detailEl) return;

  fetch('stages-data.json')
    .then((res) => res.json())
    .then((data) => {
      const flatStages = [];
      data.groups.forEach((group) => {
        group.items.forEach((item) => {
          flatStages.push({ ...item, groupTitle: group.title, groupRange: group.range });
        });
      });

      renderNav(data.groups);
      bindNavClicks();

      const initialNum = getStageNumFromHash(flatStages) || flatStages[0].num;
      showStage(initialNum, flatStages);

      window.addEventListener('hashchange', () => {
        const num = getStageNumFromHash(flatStages);
        if (num) showStage(num, flatStages);
      });
    })
    .catch((err) => {
      detailEl.innerHTML = '<p class="stage-load-error">Не удалось загрузить данные этапов. Обновите страницу.</p>';
      console.error(err);
    });

  function getStageNumFromHash(flatStages) {
    const match = window.location.hash.match(/^#stage-(\d+)$/);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    return flatStages.some((s) => s.num === num) ? num : null;
  }

  function renderNav(groups) {
    let html = '';
    groups.forEach((group) => {
      html += `<div class="nav-group">
        <p class="nav-group-label">${group.range} · ${group.title}</p>
        <ul class="nav-group-list">`;
      group.items.forEach((item) => {
        html += `<li>
          <a href="#stage-${item.num}" class="nav-stage-link" data-num="${item.num}">
            <span class="nav-stage-num">${String(item.num).padStart(2, '0')}</span>
            <span class="nav-stage-title">${item.title}</span>
          </a>
        </li>`;
      });
      html += `</ul></div>`;
    });
    navEl.innerHTML = html;
  }

  function bindNavClicks() {
    navEl.querySelectorAll('.nav-stage-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          navEl.classList.remove('open');
        }
      });
    });
  }

  function renderVideo(video) {
    if (!video || !video.src) {
      return `<div class="stage-video-placeholder">
        <span>🎬</span>
        <p>Видео появится здесь</p>
      </div>`;
    }
    return `<div class="stage-video-frame">
      <iframe src="${video.src}" allow="clipboard-write; autoplay" allowfullscreen loading="lazy"></iframe>
    </div>`;
  }

  function showStage(num, flatStages) {
    const idx = flatStages.findIndex((s) => s.num === num);
    if (idx === -1) return;
    const stage = flatStages[idx];
    const prev = flatStages[idx - 1];
    const next = flatStages[idx + 1];

    navEl.querySelectorAll('.nav-stage-link').forEach((link) => {
      link.classList.toggle('active', parseInt(link.dataset.num, 10) === num);
    });

    const activeLink = navEl.querySelector('.nav-stage-link.active');
    if (activeLink && activeLink.scrollIntoView) {
      activeLink.scrollIntoView({ block: 'nearest' });
    }

    const checklistHtml = stage.checklist
      .map((c) => `<li>${c}</li>`)
      .join('');

    detailEl.innerHTML = `
      <p class="eyebrow">${stage.groupRange} · ${stage.groupTitle}</p>
      <h2>${String(stage.num).padStart(2, '0')}. ${stage.title}</h2>
      <p class="stage-summary">${stage.summary}</p>

      ${renderVideo(stage.video)}

      <div class="stage-checklist-box">
        <p class="stage-checklist-title">Чек-лист этапа</p>
        <ul class="stage-checklist">${checklistHtml}</ul>
        <a href="checklist-20-etapov.pdf" download class="link-arrow">Скачать полный чек-лист (PDF) <span class="arrow">↓</span></a>
      </div>

      <div class="stage-pager">
        ${prev ? `<a href="#stage-${prev.num}" class="stage-pager-btn stage-pager-prev">← ${String(prev.num).padStart(2, '0')}. ${prev.title}</a>` : '<span></span>'}
        ${next ? `<a href="#stage-${next.num}" class="stage-pager-btn stage-pager-next">${String(next.num).padStart(2, '0')}. ${next.title} →</a>` : `<a href="index.html#contact" class="stage-pager-btn stage-pager-next">Обсудить продажу со мной →</a>`}
      </div>
    `;
  }
});
