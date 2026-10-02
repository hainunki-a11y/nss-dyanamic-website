/* ============================================================
   NSS TSEC — Homepage renderer (renderHome.js)
   Builds the hero slides, hero text, about, objectives and the
   home "Our Events" grid from the shared /data layer, plus the
   footer. Reuses the existing class names so the existing CSS
   and GSAP animations keep working unchanged.
   Must load AFTER data.js. Signals NSS.renderComplete() when done.
   ============================================================ */
(function () {
  'use strict';

  if (window.NSS && window.NSS.markRendering) window.NSS.markRendering();

  /* Curated home-grid definition. The cards are DERIVED from the
     2026-27 events data (photos/tags come from data/events/2026-27),
     while preserving the original on-screen display titles and order. */
  var HOME_CARDS = [
    { title: 'International Yoga Day', label: 'International Yoga Day 2026' },
    { title: 'Kargil Diwas Celebration', label: 'Kargil Diwas Celebration' },
    { title: 'Tree Plantation Drive', label: 'Tree Plantation Drive 2026' },
    { title: 'Independence Day', label: 'Independence Day 2026' },
    { title: 'Ganpati Visarjan', label: 'Ganpati Visarjan 2026' },
    { title: 'Helping Traffic Management in Visarjan', label: 'Traffic Management in Visarjan' },
    { title: 'Beach Cleaning Gorai', label: 'Beach Cleaning Drive' },
    { title: 'Health Checkup Camp', label: 'Health Checkup Camp' },
    { title: 'SGNP Kanheri Caves Visit', label: 'SGNP Kanheri Caves Visit' },
    { title: 'NSS Orientation', label: 'NSS Orientation' },
    { title: 'Nasha Mukti Awareness', label: 'Nasha Mukti Awareness' },
    { title: 'Karuna', label: 'Karuna' }
  ];

  function escapeHtml(s) {
    return (window.NSS && window.NSS.escapeHtml) ? window.NSS.escapeHtml(s) : String(s == null ? '' : s);
  }

  /* ── Hero: text + slides ── */
  function renderHero(site, slidesData) {
    var heroTitleEl = document.querySelector('.hero-title');
    var heroQuoteEl = document.querySelector('.hero-quote');
    if (heroTitleEl && site && site.hero) heroTitleEl.textContent = site.hero.title || 'TSEC-NSS UNIT';
    if (heroQuoteEl && site && site.hero) heroQuoteEl.textContent = site.hero.quote || 'NOT ME BUT YOU';

    var slider = document.getElementById('hero-slider');
    if (!slider) return;
    var slides = (slidesData && slidesData.slides) || [];
    slides.forEach(function (s, i) {
      if (!s || !s.image) return;
      var slide = document.createElement('div');
      slide.className = 'slide' + (i === 0 ? ' active' : '');
      var bg = document.createElement('div');
      bg.className = 'slide-bg';
      bg.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(\'' + escapeHtml(s.image) + '\')';
      slide.appendChild(bg);
      slider.appendChild(slide);
    });
  }

  /* ── About / Who We Are ── */
  function renderAbout(site) {
    if (!site || !site.about) return;
    var titleEl = document.querySelector('.who-we-are-title');
    if (titleEl) titleEl.textContent = site.about.title || 'ABOUT NSS';

    var contentEl = document.querySelector('.who-we-are-content');
    if (contentEl) {
      var paragraphs = (site.about.paragraphs || []).slice(0, 2);
      contentEl.innerHTML = paragraphs.map(function (p) {
        return '<p class="who-we-are-text">' + escapeHtml(p) + '</p>';
      }).join('');
    }
  }

  /* ── Objectives ── */
  function renderObjectives(site, objectivesData) {
    if (!site || !site.objectives) return;
    var titleEl = document.querySelector('.objectives-title');
    if (titleEl) titleEl.textContent = site.objectives.title || 'Our Objectives';
    var textEl = document.querySelector('.objectives-text');
    if (textEl) textEl.textContent = site.objectives.intro || '';

    var grid = document.querySelector('.objectives-grid');
    if (!grid) return;
    var items = (objectivesData && objectivesData.items) || [];
    grid.innerHTML = items.map(function (o) {
      return '<div class="objective-card">' +
        '<div class="card-img-container">' +
          '<img src="' + escapeHtml(o.image) + '" alt="' + escapeHtml(o.title) + '" onerror="this.onerror=null; this.src=\'assets/nss_logo.png\';">' +
          '<div class="card-slide-overlay">' +
            '<h3 class="card-title-hover">' + escapeHtml(o.title) + '</h3>' +
            '<p class="card-desc">' + escapeHtml(o.description) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Home "Our Events" grid (derived from 2026-27 events) ── */
  function renderHomeEvents(events2026) {
    var grid = document.querySelector('.events-grid');
    if (!grid) return;
    var byTitle = {};
    (events2026 || []).forEach(function (ev) {
      if (!byTitle[ev.title]) byTitle[ev.title] = ev;
    });
    grid.innerHTML = HOME_CARDS.map(function (card) {
      var ev = byTitle[card.title];
      var photo = (ev && ev.photo) ? ev.photo : 'https://placehold.co/600x400';
      var alt = escapeHtml(card.label);
      return '<div class="event-card">' +
        '<div class="card-img-container">' +
          '<img src="' + escapeHtml(photo) + '" alt="' + alt + '" onerror="this.onerror=null; this.src=\'assets/nss_logo.png\';">' +
          '<div class="card-slide-overlay">' +
            '<h3 class="card-title-hover">' + escapeHtml(card.label) + '</h3>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Main ── */
  document.addEventListener('DOMContentLoaded', function () {
    // Guard: if data.js failed to load (transient network/server blip) window.NSS
    // is undefined; bail out gracefully instead of throwing an uncaught error.
    if (!window.NSS || !window.NSS.getData) return;
    Promise.all([
      window.NSS.getData(),
      window.NSS.getEvents('2026-27')
    ]).then(function (res) {
      var data = res[0];
      var events2026 = res[1] || [];
      var site = (data && data.site) || {};

      renderHero(site, data && data.heroSlides);
      renderAbout(site);
      renderObjectives(site, data && data.objectives);
      renderHomeEvents(events2026);

      if (window.NSS.renderFooter) window.NSS.renderFooter(data);

      if (window.NSS.renderComplete) window.NSS.renderComplete();
    });
  });
})();
