/* ═══════════════════════════════════════════════════
   NSS TSEC — Realistic 3D Book Magazine Logic
   FIXED: Perfect centering, smooth 0.7s flips,
          clean closed → open → back cover states
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Magazine Content Data ──
     (Session 3) Loaded from data/magazine.json via the shared loader. */
  let pagesData = [];
  let magData = null;
  let dataReady = false;

  /* ── XSS-safe text escaping (Session 5) ── */
  function esc(s) {
    return (window.NSS && window.NSS.escapeHtml) ? window.NSS.escapeHtml(s) : String(s == null ? '' : s);
  }

  /* Neutral fallback image so a missing/broken photo never shows a broken icon. */
  var FALLBACK_IMG = 'assets/nss_logo.png';

  function loadMagazineData() {
    if (window.NSS && window.NSS.getData) {
      return window.NSS.getData().then(function (data) {
        magData = (data && data.magazine) || null;
        pagesData = (magData && magData.pages) || [];
        dataReady = true;
        return pagesData;
      });
    }
    dataReady = true;
    return Promise.resolve(pagesData);
  }

  /* ── State ── */
  let currentFlip = 0;   // which page index is next to flip
  let isOpened = false;   // has cover been flipped open?
  let isAtBack = false;   // is back cover showing?
  // (Session 5 fix) totalFlippable was computed once at parse time when
  // pagesData was still empty, so it always equalled 1 and the magazine could
  // never flip past the cover. Now it is derived live from the loaded pages.
  function getTotalFlippable() { return pagesData.length + 1; } // cover + content pages

  let overlay = null;

  /* ── Build the viewer DOM (once, lazily) ── */
  function buildViewer() {
    const el = document.createElement('div');
    el.className = 'book-overlay';
    el.id = 'magazine-viewer';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'NSS magazine viewer');

    let pagesHTML = '';

    // Page 0: FRONT COVER
    const cover = (magData && magData.cover) || {};
    const foreword = (magData && magData.foreword) || 'Welcome to the inaugural edition of our NSS Magazine. This visual journey captures the heart and soul of our unit\'s impact on community and nation.';
    pagesHTML += `
      <div class="book-page" data-index="0" style="z-index: ${getTotalFlippable() + 1};">
        <div class="page-front page-cover-front">
          <img src="${esc(cover.image || 'assets/photos/hero_1.jpg')}" class="cover-photo" alt="NSS magazine front cover" onerror="this.onerror=null; this.src='assets/nss_logo.png';">
          <div class="cover-content">
            <img src="${esc(cover.logo || 'assets/nss_logo.png')}" alt="NSS" class="cover-logo" onerror="this.onerror=null; this.src='assets/nss_logo.png';">
            <h2>${esc(cover.title || 'NSS MAGAZINE')}</h2>
          </div>
        </div>
        <div class="page-back">
          <div class="page-content">
            <img src="${esc(cover.image || 'assets/photos/hero_1.jpg')}" class="page-img" alt="Magazine foreword photo" onerror="this.onerror=null; this.src='assets/nss_logo.png';">
            <div class="page-title">Foreword</div>
            <p class="page-desc">${esc(foreword)}</p>
            <span class="page-number">1</span>
          </div>
        </div>
      </div>`;

    // Pages 1..n: CONTENT (last one has JAI HIND on back)
    pagesData.forEach((p, i) => {
      const isLast = (i === pagesData.length - 1);
      const front = p.front || {};
      const back = p.back || {};
      pagesHTML += `
        <div class="book-page" data-index="${i + 1}" style="z-index: ${getTotalFlippable() - i};">
          <div class="page-front">
            <div class="page-content">
              <img src="${esc(front.image)}" class="page-img" alt="${esc(front.title || 'Magazine page')}" onerror="this.onerror=null; this.src='assets/nss_logo.png';">
              <div class="page-title">${esc(front.title)}</div>
              <p class="page-desc">${esc(front.description)}</p>
              <span class="page-number">${(i + 1) * 2}</span>
            </div>
          </div>
          <div class="page-back ${isLast ? 'page-back-hind' : ''}">
            ${isLast ? `<div class="hind-text">JAI HIND</div>` : `
            <div class="page-content">
              <img src="${esc(back.image)}" class="page-img" alt="${esc(back.title || 'Magazine page')}" onerror="this.onerror=null; this.src='assets/nss_logo.png';">
              <div class="page-title">${esc(back.title)}</div>
              <p class="page-desc">${esc(back.description)}</p>
              <span class="page-number">${(i + 1) * 2 + 1}</span>
            </div>`}
          </div>
        </div>`;
    });

    el.innerHTML = `
      <button class="book-close" id="book-close" aria-label="Close magazine">&times;</button>
      <div class="book-wrapper">
        <div class="book-container state-closed" id="book-container">
          <div class="book-page-left" id="book-left"></div>
          <div class="book-page-right-area" id="book-right">${pagesHTML}</div>
          <div class="book-spine-glow"></div>
          <div class="back-cover-panel"><div class="hind-text">JAI HIND</div></div>
        </div>
      </div>
      <nav class="book-nav" id="book-nav" aria-label="Magazine navigation">
        <button class="book-nav-btn" id="book-prev" aria-label="Previous page">&#8592;</button>
        <button class="book-nav-btn" id="book-next" aria-label="Next page">&#8594;</button>
      </nav>`;

    document.body.appendChild(el);
    return el;
  }

  /* ── Update left page to show back-face of last flipped page ── */
  function updateLeftContent() {
    const leftEl = document.getElementById('book-left');
    if (!leftEl) return;

    if (currentFlip <= 0 || !isOpened) {
      leftEl.innerHTML = '';
      return;
    }

    const lastFlippedIndex = currentFlip - 1;
    const flippedPage = document.querySelector(`.book-page[data-index="${lastFlippedIndex}"]`);
    if (flippedPage) {
      const backFace = flippedPage.querySelector('.page-back');
      if (backFace) {
        leftEl.innerHTML = backFace.innerHTML;
      }
    }
  }

  /* ── Update nav button visibility ── */
  function updateNav() {
    const nav = document.getElementById('book-nav');
    const prevBtn = document.getElementById('book-prev');
    const nextBtn = document.getElementById('book-next');

    // Show nav once book is opened, hide at back cover
    if (isOpened && !isAtBack) {
      nav.classList.add('visible');
    } else if (!isOpened) {
      nav.classList.remove('visible');
    }

    prevBtn.disabled = (currentFlip <= 0);
    nextBtn.disabled = (currentFlip >= getTotalFlippable());
  }

  /* ═══════════════════════════
     STATE TRANSITIONS
     ═══════════════════════════ */

  function transitionToOpen() {
    const container = document.getElementById('book-container');
    container.classList.remove('state-closed', 'state-back');
    container.classList.add('state-open');
    isOpened = true;
    isAtBack = false;
  }

  function transitionToBack() {
    const container = document.getElementById('book-container');
    container.classList.remove('state-open', 'state-closed');
    container.classList.add('state-back');
    isAtBack = true;

    // Hide nav after a moment
    setTimeout(() => {
      const nav = document.getElementById('book-nav');
      nav.classList.remove('visible');
    }, 400);
  }

  function transitionToClosed() {
    const container = document.getElementById('book-container');
    container.classList.remove('state-open', 'state-back');
    container.classList.add('state-closed');
    isOpened = false;
    isAtBack = false;
  }

  /* ═══════════════════════════
     FLIP LOGIC
     ═══════════════════════════ */

  function flipForward() {
    if (currentFlip >= getTotalFlippable()) return;

    const pageEl = document.querySelector(`.book-page[data-index="${currentFlip}"]`);
    if (!pageEl) return;

    // If this is the cover being flipped (first flip), open the book
    if (currentFlip === 0 && !isOpened) {
      transitionToOpen();
    }

    pageEl.classList.add('flipped');
    currentFlip++;

    // After flip animation, update content
    setTimeout(() => {
      updateLeftContent();

      // If we just flipped the last page, transition to back cover
      if (currentFlip >= getTotalFlippable()) {
        transitionToBack();
      }

      updateNav();
    }, 500);

    updateNav();
  }

  function flipBackward() {
    if (currentFlip <= 0) return;

    // If at back cover, first re-open the book layout
    if (isAtBack) {
      transitionToOpen();
    }

    currentFlip--;

    const pageEl = document.querySelector(`.book-page[data-index="${currentFlip}"]`);
    if (!pageEl) return;

    pageEl.classList.remove('flipped');

    setTimeout(() => {
      updateLeftContent();

      // If we just un-flipped the cover, close the book
      if (currentFlip === 0) {
        transitionToClosed();
      }

      updateNav();
    }, 500);

    updateNav();
  }

  /* ═══════════════════════════
     OPEN / CLOSE VIEWER
     ═══════════════════════════ */

  function openViewer() {
    if (!dataReady) {
      loadMagazineData().then(() => {
        if (!overlay) overlay = buildViewer();
        showViewer();
      });
      return;
    }
    if (!overlay) overlay = buildViewer();
    showViewer();
  }

  function showViewer() {
    // Reset everything
    currentFlip = 0;
    isOpened = false;
    isAtBack = false;

    const container = document.getElementById('book-container');
    if (!container) return;

    container.className = 'book-container state-closed';

    document.querySelectorAll('.book-page').forEach(p => {
      p.classList.remove('flipped', 'dragging');
      p.style.transform = '';
    });

    document.getElementById('book-left').innerHTML = '';
    document.getElementById('book-nav').classList.remove('visible');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    attachEvents();
    const closeBtn = document.getElementById('book-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeViewer() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════
     EVENT HANDLING
     ═══════════════════════════ */

  function attachEvents() {
    document.getElementById('book-close').onclick = closeViewer;
    document.getElementById('book-prev').onclick = flipBackward;
    document.getElementById('book-next').onclick = flipForward;

    // Click on any un-flipped page to flip forward
    document.querySelectorAll('.book-page').forEach(page => {
      page.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(page.dataset.index);
        if (idx === currentFlip && !page.classList.contains('flipped')) {
          flipForward();
        }
      };
    });

    // Click left page area to flip backward
    document.getElementById('book-left').onclick = flipBackward;

    // Keyboard
    document.onkeydown = (e) => {
      if (!overlay || !overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') flipForward();
      if (e.key === 'ArrowLeft') flipBackward();
    };

    // Overlay background click to close
    overlay.onclick = (e) => {
      if (e.target === overlay) closeViewer();
    };

    // Drag-to-flip
    setupDrag();
  }

  function setupDrag() {
    document.querySelectorAll('.book-page').forEach(page => {
      let startX = 0;
      let isDragging = false;

      page.addEventListener('mousedown', (e) => {
        const idx = parseInt(page.dataset.index);
        if (idx !== currentFlip || page.classList.contains('flipped')) return;
        startX = e.clientX;
        isDragging = true;
        page.classList.add('dragging');
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = startX - e.clientX;
        const angle = Math.max(-180, Math.min(0, -(dx / 2.5)));
        page.style.transform = `rotateY(${angle}deg)`;
      });

      window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        page.classList.remove('dragging');
        page.style.transform = '';
        const dx = startX - e.clientX;
        if (dx > 70) {
          flipForward();
        }
      });

      // Touch support
      page.addEventListener('touchstart', (e) => {
        const idx = parseInt(page.dataset.index);
        if (idx !== currentFlip || page.classList.contains('flipped')) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        page.classList.add('dragging');
      }, { passive: true });

      page.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = startX - e.touches[0].clientX;
        const angle = Math.max(-180, Math.min(0, -(dx / 2.5)));
        page.style.transform = `rotateY(${angle}deg)`;
      }, { passive: true });

      page.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        page.classList.remove('dragging');
        page.style.transform = '';
        const dx = startX - (e.changedTouches[0]?.clientX || startX);
        if (dx > 50) flipForward();
      });
    });
  }

  /* ── Init: load data, then attach to magazine cards ── */
  document.addEventListener('DOMContentLoaded', () => {
    loadMagazineData().then(() => {
      document.querySelectorAll('.magazine-card').forEach(card => {
        card.addEventListener('click', openViewer);
      });
    });
  });

})();
