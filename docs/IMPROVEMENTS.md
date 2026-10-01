# Suggested Improvements — NSS TSEC Mumbai Website

Prioritized recommendations. Grouped by theme: data, tooling, accessibility, SEO, performance, and code organization. Each includes a concrete suggestion and the motivation.

---

## Priority Legend
- **[High]** — correctness / maintenance / user-facing impact
- **[Medium]** — quality of life, robustness, polish
- **[Low]** — nice-to-have

---

## 1. Data Centralization (High)

**Problem:** Event data is duplicated in **three places**:
1. Hardcoded `index.html` event-card grid (`index.html:219-339`).
2. `NSS_EVENTS` / `NSS_EVENTS_2026_27` in `events-timeline.js` (`events-timeline.js:28,84`).
3. `EVENTS_2025_26` in `events-calendar.js` (`events-calendar.js:30`) — same 2025-26 data as #2.

Adding one event requires editing multiple files, and they can drift out of sync.

**Suggestion:**
- Extract events into a single shared source of truth, e.g. `data/events.js` exporting `const EVENTS = { '2025-26': [...], '2026-27': [...] }`, and import it from both renderers.
- Even better: serve as `data/events.json` and `fetch()` it, or generate the homepage grid from the same dataset instead of hardcoding.

```js
// data/events.js
export const EVENTS = {
  '2025-26': [...],
  '2026-27': [...]
};
```
> Because there's no bundler, a global `window.NSSEVENTS = {...}` or a plain `<script>` that assigns a global is the simplest path.

---

## 2. Build Tooling & Version Pinning (High)

**Problem:** No `package.json`; all libraries loaded from CDNs with fixed URLs (`index.html:26,501-503`). If a CDN URL or a library version changes/breaks, the site silently degrades. No minification/bundling of the many small JS/CSS files.

**Suggestion:**
- Introduce a minimal build (Vite or a simple bundler) to:
  - Pin dependency versions (`npm i gsap @lottiefiles/lottie-player`).
  - Bundle and minify JS/CSS into one file.
  - Vendor assets locally (remove CDN reliance for production resilience).
- At minimum, download GSAP/Lottie/fonts to local `vendor/` for offline reliability.

---

## 3. Remove / Resolve Placeholder Images (High)

**Problem:** Most leadership/council members and 4 of 7 testimonials use `https://placehold.co/...` (`teams.html:205` etc., `testimonials.html:113` etc.). These look unpolished and are third-party dependencies.

**Suggestion:** Replace with real member photos under `assets/photos/` (the repo already has unused `dhrupesh savadiya.png.jpeg` and `mangesh more.png.jpeg` that look intended for this).

---

## 4. Accessibility (Medium/High)

- **Focus management:** The testimonials modal and magazine viewer don't trap or restore focus. Add focus trap + return focus to the trigger.
- **`aria-modal`:** The testimonials modal (`.modal-overlay`) lacks `role="dialog"`/`aria-modal`. The events lightbox has it (`events.html:171`); the testimonial one does not.
- **`<img>` alt text:** Many use `alt="Faculty Name"` or `alt="Volunteer 3"` (`teams.html:63`, `testimonials.html:113`) — use descriptive text.
- **Contrast:** Some muted text (`--text-muted: rgba(255,255,255,0.5)`) may fail WCAG AA on dark backgrounds. Audit.
- **Keyboard:** The testimonial cards and magazine pages are mostly keyboard-accessible via buttons, but confirm the `.magazine-card` (has `role="button"` + `tabindex="0"`, `index.html:407`) has a key handler (it currently only listens to `click`).

---

## 5. SEO (Medium)

- Each page has a `<title>` and meta description/keywords (`index.html:6-10`) — good. Add:
  - **Open Graph / Twitter Card** tags for social sharing.
  - A single **favicon** (currently none).
  - **`<link rel="canonical">`** per page.
  - A `sitemap.xml` and a `robots.txt` for crawlability.

---

## 6. Performance (Medium)

- **Hero images are huge:** `assets/photos/hero_3.png` is **11.6 MB** (PNG), `hero_5.jpg` 2.6 MB. Convert to optimized WebP/AVIF at appropriate sizes and add `srcset`/`loading="lazy"` (except the LCP hero).
- Event photos in `assets/Events/` range up to **4 MB** each — resize/compress for web.
- **Lazy-load** below-the-fold images and the Lottie players (currently eager).
- Consider `preload` for the LCP hero image and `preconnect` already present for fonts (`index.html:13-14`).
- Reduce unused CSS (several legacy blocks in `style.css`, e.g. duplicate `.footer`, `.team-grid`).

---

## 7. Code Organization & Maintainability (Medium)

- `style.css` has **duplicate/legacy sections** (two `.footer` and two `.team-grid` definitions — e.g. `style.css:1030` vs `style.css:1135`). Consolidate into one design system with clear comments.
- Feature styles are already split per page (good). Consider a shared `base.css` + per-page files explicitly.
- `script.js` handles hero slider, nav, sections, and teams marquee. Consider splitting into `hero.js`, `nav.js`, etc., or keep but document sections (already commented).
- Standardize file extensions: `po.png.png`, `pricipal.png.png`, `dhrupesh savadiya.png.jpeg` have doubled extensions (`assets/photos/`).
- `assets/Our Events/*.png` appears unused — either wire them in or remove.

---

## 8. Correctness / Edge Cases

- **Events calendar lightbox** (`events-calendar.js:326`) sets `document.onkeydown` globally, which can clobber other handlers; use `addEventListener` and scope it.
- **`<lottie-player>`** relies on a CDN JSON at runtime; add `fallback` styling in case the network/asset fails.
- **Reduced-motion** is well-handled in CSS/JS (good) — extend the same checks to the magazine drag and testimonials modal animations (mostly covered).
- **404 / custom error page** — none present; add one for a better hosted experience.
- The hidden homepage sections (`#magazine`, calendar tab) use inline `display: none` and `!important` (`index.html:350,398`) — document why or remove.

---

## 9. Deployment / CI (Low/Medium)

- No `.gitignore`, LICENSE, or CI. Add:
  - A `.gitignore` (`.DS_Store`, `Thumbs.db`).
  - A GitHub Actions workflow to deploy to GitHub Pages on push (see `docs/DEPLOYMENT.md`).
  - A `LICENSE` if the author wants to grant usage rights.

---

## 10. Quick-Win Checklist

- [ ] Replace `placehold.co` images with real assets.
- [ ] Compress hero + event images to WebP.
- [ ] Add `aria-modal`/focus trap to testimonial modal.
- [ ] Add OG tags + favicon + `robots.txt` + `sitemap.xml`.
- [ ] Consolidate the three event datasets into one.
- [ ] Clean duplicate CSS blocks.
- [ ] Add `.gitignore` and a GitHub Actions Pages deploy.
