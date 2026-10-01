/* ═══════════════════════════════════════════
   NSS TSEC — Preloader & Offline Logic
   Works on ALL pages; self-contained.
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Inject Preloader HTML immediately ── */
  const preloaderHTML = `
    <div id="nss-preloader" aria-live="polite" aria-label="Loading NSS TSEC website">
      <div class="preloader-logo-wrap">
        <img src="assets/nss_logo.png" alt="NSS Logo">
      </div>
      <div class="preloader-bar-track">
        <div class="preloader-bar-fill"></div>
      </div>
      <span class="preloader-text">Loading&hellip;</span>
    </div>`;

  /* ── 2. Inject Offline HTML ── */
  const offlineHTML = `
    <div id="nss-offline" role="alert" aria-label="No internet connection">
      <div class="offline-logo-wrap">
        <img src="assets/nss_logo.png" alt="NSS Logo">
      </div>
      <span class="offline-text">Loading&hellip; Please wait</span>
      <span class="offline-hint">Check your internet connection</span>
    </div>`;

  /* Insert at top of body */
  document.body.insertAdjacentHTML('afterbegin', offlineHTML);
  document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
  document.body.classList.add('preloading');

  /* ── 3. Offline detection ── */
  const offlineEl = document.getElementById('nss-offline');

  function checkOnline() {
    if (!navigator.onLine) {
      offlineEl.classList.add('visible');
    } else {
      offlineEl.classList.remove('visible');
    }
  }

  window.addEventListener('online',  checkOnline);
  window.addEventListener('offline', checkOnline);
  checkOnline(); // Run immediately on load

  /* ── 4. Hide preloader after page is ready ── */
  const MIN_SHOW_MS = 2000; // show for at least 2 s
  const startTime = Date.now();

  function dismissPreloader() {
    const preloaderEl = document.getElementById('nss-preloader');
    if (!preloaderEl) return;

    const elapsed  = Date.now() - startTime;
    const delay    = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(function () {
      preloaderEl.classList.add('hide');
      document.body.classList.remove('preloading');

      /* Remove from DOM after transition completes */
      preloaderEl.addEventListener('transitionend', function () {
        preloaderEl.remove();
      }, { once: true });
    }, delay);
  }

  /* Fire on window load (all resources ready) */
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
  }

})();
