/* ═══════════════════════════════════════════════════
   NSS TSEC — Cinematic First-Load Intro Animation
   ● Homepage (index.html) ONLY
   ● Runs ONCE per browser session via sessionStorage
   ● Covers preloader; exits with curtain-slide-up
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Guard: homepage only ── */
  const filename = window.location.pathname.split('/').pop();
  if (filename !== '' && filename !== 'index.html') return;

  /* ── 2. Guard: once per session ── */
  const SESSION_KEY = 'nss_tsec_intro_v1';
  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, '1');

  /* ── 3. Build overlay ── */
  const overlay = document.createElement('div');
  overlay.id = 'nss-intro';
  overlay.setAttribute('role', 'presentation');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="intro-logo-wrap" id="intro-logo-wrap">
      <img class="intro-logo" id="intro-logo" src="assets/nss_logo.png" alt="NSS">
    </div>
    <div class="intro-text-block" id="intro-text-block">
      <div class="intro-line1" id="intro-line1"></div>
      <div class="intro-line2" id="intro-line2"></div>
    </div>
    <div class="intro-line-decor"></div>`;

  document.body.insertAdjacentElement('afterbegin', overlay);
  document.body.style.overflow = 'hidden';

  /* ── 4. Element refs ── */
  const logoWrap = document.getElementById('intro-logo-wrap');
  const logo     = document.getElementById('intro-logo');
  const line1El  = document.getElementById('intro-line1');
  const line2El  = document.getElementById('intro-line2');

  /* ── 5. Utility: promise-based wait ── */
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ── 6. Utility: typewriter ── */
  function typeText(el, text, speed) {
    return new Promise(resolve => {
      let i = 0;
      // Blinking cursor element
      const cursor = document.createElement('span');
      cursor.className = 'intro-cursor';
      el.appendChild(cursor);

      const tick = setInterval(() => {
        if (i >= text.length) {
          clearInterval(tick);
          cursor.remove(); // Remove cursor when done
          resolve();
          return;
        }
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
      }, speed);
    });
  }

  /* ── 7. Main animation sequence ── */
  async function runIntro() {

    /* STEP 1 ─ Start logo off-screen right with pre-rotation */
    logo.style.transition = 'none';
    logoWrap.style.transition = 'none';
    logoWrap.style.transform = 'translateX(calc(100vw + 200px)) rotate(720deg)';
    logoWrap.style.opacity   = '1';

    await wait(60); // One frame — let browser paint initial state

    /* STEP 2 ─ Roll logo into center */
    logoWrap.style.transition = 'transform 1.5s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease';
    logoWrap.style.transform  = 'translateX(0) rotate(0deg)';

    await wait(1550); // Logo arrives

    /* STEP 3 ─ Hold: scale-pulse + golden glow */
    logo.style.transition = 'filter 0.5s ease, transform 0.5s ease';
    logoWrap.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    logoWrap.style.transform  = 'translateX(0) scale(1.08)';
    logo.style.filter = [
      'drop-shadow(0 0 24px rgba(255, 200, 80, 0.55))',
      'drop-shadow(0 0 8px rgba(255, 255, 255, 0.35))',
      'brightness(1.1)'
    ].join(' ');

    await wait(450);

    /* Subtle settle-back */
    logoWrap.style.transform = 'translateX(0) scale(1)';

    await wait(350);

    /* STEP 4 ─ Reveal text block, then type */
    overlay.classList.add('text-visible');

    await wait(350); // Fade-in transition completes

    /* Type Line 1: "TSEC NSS UNIT" */
    await typeText(line1El, 'TSEC NSS UNIT', 72);

    await wait(320);

    /* Type Line 2: "MH09SB39" */
    await typeText(line2El, 'MH09SB39', 90);

    await wait(900); // Pause — let user read

    /* STEP 5 ─ Curtain exit: slide the entire overlay upward */
    overlay.classList.add('exit');

    await wait(1150); // Match CSS transition duration + buffer

    /* STEP 6 ─ Cleanup */
    overlay.remove();
    document.body.style.overflow = '';
  }

  /* Start after a tiny delay to ensure DOM is settled */
  setTimeout(runIntro, 40);

})();
