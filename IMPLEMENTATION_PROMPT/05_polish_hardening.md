# Session 5 — Phase 4: Polish, hardening & full QA

Work **only** in `D:\NSS\dynamic-website`. **First read `D:\NSS\dynamic-website\HANDOFF.md`** for context, then the design docs.

## Context to load
- `docs/CMS_SOLUTION_REPORT.md` — Section 5.10 (fallback), 5.11 (security), 5.12 (testing), 6 Phase 4.
- `docs/ADMIN_GUIDE.md`, `docs/CMS_TROUBLESHOOTING.md` (so the QA aligns with the docs).

## Task — polish & harden
1. **XSS escaping**: confirm every text value rendered from data into the DOM goes through the
   `escapeHtml()` helper in `data.js`. Audit all renderers (home, teams, testimonials, events,
   magazine, footer).
2. **Image handling**: enforce allowed types + ~5 MB size limit in the CMS config (done in
   Session 4 — verify). Add an `onerror` fallback for images (to the NSS logo or a neutral
   placeholder) so a missing/broken image never shows a broken icon.
3. **Offline fallback**: make sure the fallback snapshot in `data.js` is complete and that every
   renderer works when `fetch()` fails (renders from snapshot, never throws). Test with
   DevTools → offline.
4. **Accessibility pass** on the new renderers + admin:
   - Descriptive `alt` text on rendered images.
   - `role="dialog"`/`aria-modal` where modals are used (testimonials modal, events lightbox).
   - Keyboard access for any new interactive elements.
5. **Rate-limit awareness**: document GitHub API rate-limit behavior for editors
   (in `docs/CMS_TROUBLESHOOTING.md`).
6. **Branch protection note**: add a note in `docs/ADMIN_SETUP.md` recommending branch
   protection on `main` (block force-push).
7. **Full QA checklist** — run and record results:
   - All 4 pages render identically to the original (screenshot/visual compare).
   - Events filters, search, lightbox, year tabs.
   - Testimonials modal.
   - Magazine viewer (open, flip, close).
   - Hero slider (arrows, dots, autoplay, hover-pause).
   - Offline fallback on all pages.
   - Responsive: desktop + mobile.
   - Reduced-motion preference respected.
   - No console errors.

## Rules
- Do not change the visual design.
- Do not touch `D:\NSS\website`.

## Handoff (MANDATORY)
Update `D:\NSS\dynamic-website\HANDOFF.md`:
- What was hardened/changed and why.
- Full QA results table (pass/fail per item).
- Any remaining known issues.
- **Instructions for Session 6:** read `docs/ADMIN_GUIDE.md`, `docs/ADMIN_SETUP.md`,
  `docs/DATA_SCHEMA.md`, `docs/CMS_TROUBLESHOOTING.md` and verify they match the implemented
  code; update them if needed; update the main `README.md`; finalize `HANDOFF.md` and
  `docs/PROGRESS.md`.
- Update `docs/PROGRESS.md`.
