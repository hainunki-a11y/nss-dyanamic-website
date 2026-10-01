/* ═══════════════════════════════════════════════════
   NSS TSEC — Realistic 3D Book Magazine Logic
   FIXED: Perfect centering, smooth 0.7s flips,
          clean closed → open → back cover states
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Magazine Content Data ── */
  const pagesData = [
    {
      front: {
        img: 'assets/photos/hero_1.jpg',
        title: 'Beach Cleaning Drive',
        desc: 'Our volunteers gathered at Juhu Beach for a massive cleaning drive, collecting over 200 kg of waste. The event brought together 80+ enthusiastic members who worked tirelessly under the morning sun.'
      },
      back: {
        img: 'assets/photos/hero_2.jpg',
        title: 'Independence Day Rally',
        desc: 'A grand rally through the streets of Bandra on 15th August filled the neighbourhood with patriotic fervour. Volunteers carried the national flag and sang anthems.'
      }
    },
    {
      front: {
        img: 'assets/photos/hero_3.png',
        title: 'NSS Day Celebrations',
        desc: 'Celebrating NSS Day with cultural programmes, tree plantation, and a pledge ceremony. Faculty advisors addressed the gathering, inspiring volunteers.'
      },
      back: {
        img: 'assets/photos/hero_4.jpg',
        title: 'Blood Donation Camp',
        desc: 'In collaboration with local hospitals, our NSS unit organized a blood donation camp on campus. Over 60 units were collected in a single day.'
      }
    }
  ];

  /* ── State ── */
  let currentFlip = 0;   // which page index is next to flip
  let isOpened = false;   // has cover been flipped open?
  let isAtBack = false;   // is back cover showing?
  const totalFlippable = pagesData.length + 1; // cover + content pages

  let overlay = null;

  /* ── Build the viewer DOM (once, lazily) ── */
  function buildViewer() {
    const el = document.createElement('div');
    el.className = 'book-overlay';
    el.id = 'magazine-viewer';

    let pagesHTML = '';

    // Page 0: FRONT COVER
    pagesHTML += `
      <div class="book-page" data-index="0" style="z-index: ${totalFlippable + 1};">
        <div class="page-front page-cover-front">
          <img src="assets/photos/hero_1.jpg" class="cover-photo" alt="">
          <div class="cover-content">
            <img src="assets/nss_logo.png" alt="NSS" class="cover-logo">
            <h2>NSS MAGAZINE</h2>
          </div>
        </div>
        <div class="page-back">
          <div class="page-content">
            <img src="assets/photos/hero_1.jpg" class="page-img" alt="">
            <div class="page-title">Foreword</div>
            <p class="page-desc">Welcome to the inaugural edition of our NSS Magazine. This visual journey captures the heart and soul of our unit's impact on community and nation.</p>
            <span class="page-number">1</span>
          </div>
        </div>
      </div>`;

    // Pages 1..n: CONTENT (last one has JAI HIND on back)
    pagesData.forEach((p, i) => {
      const isLast = (i === pagesData.length - 1);
      pagesHTML += `
        <div class="book-page" data-index="${i + 1}" style="z-index: ${totalFlippable - i};">
          <div class="page-front">
            <div class="page-content">
              <img src="${p.front.img}" class="page-img" alt="">
              <div class="page-title">${p.front.title}</div>
              <p class="page-desc">${p.front.desc}</p>
              <span class="page-number">${(i + 1) * 2}</span>
            </div>
          </div>
          <div class="page-back ${isLast ? 'page-back-hind' : ''}">
            ${isLast ? `<div class="hind-text">JAI HIND</div>` : `
            <div class="page-content">
              <img src="${p.back.img}" class="page-img" alt="">
              <div class="page-title">${p.back.title}</div>
              <p class="page-desc">${p.back.desc}</p>
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
    nextBtn.disabled = (currentFlip >= totalFlippable);
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
    if (currentFlip >= totalFlippable) return;

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
      if (currentFlip >= totalFlippable) {
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
    if (!overlay) overlay = buildViewer();

    // Reset everything
    currentFlip = 0;
    isOpened = false;
    isAtBack = false;

    const container = document.getElementById('book-container');
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

  /* ── Init: attach to magazine cards ── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.magazine-card').forEach(card => {
      card.addEventListener('click', openViewer);
    });
  });

})();
