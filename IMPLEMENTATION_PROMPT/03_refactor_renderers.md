# Session 3 — Phase 2: Refactor the site to read from the data layer

Work **only** in `D:\NSS\dynamic-website`. **First read `D:\NSS\dynamic-website\HANDOFF.md`** for context, then the design docs.

## Context to load
- `docs/CMS_SOLUTION_REPORT.md` — Section 5.9 (refactor), 5.10 (fallback), 6 Phase 2.
- `docs/DATA_SCHEMA.md`.
- The current files to change: `events-timeline.js`, `events-calendar.js`, `magazine.js`,
  `intro.js`, `index.html`, `teams.html`, `testimonials.html`, `script.js`.

## Task — refactor renderers to fetch from /data
The visual result must be **identical** to the original (same layout, text, images, GSAP animations).

1. **Events timeline** (`events-timeline.js`): replace the hardcoded `NSS_EVENTS` /
   `NSS_EVENTS_2026_27` with the fetched arrays from `data/events/2025-26` and
   `data/events/2026-27`. Keep `groupByMonth`, `buildMonthBlock`, `applyFilters`, and the
   lightbox logic — only the data source changes. Load the arrays asynchronously and render
   when ready.
2. **Events calendar** (`events-calendar.js`): DELETE the duplicated `EVENTS_2025_26` array
   and read the same 2025-26 data from `data/events/2025-26`. This removes the duplication.
3. **Homepage sections** (`index.html` + new `renderHome.js`): replace hardcoded hero slides,
   objectives cards, about text, and the "Our Events" grid with JS-built DOM from the data
   (reuse the existing class names so CSS/GSAP still work). Use empty mount points in HTML.
   The homepage grid should be **derived from** the 2026-27 events (e.g. filter/limit), not a
   separate hardcoded list.
4. **Teams** (`teams.html` + new `renderTeams.js`): render the faculty grid, leadership row,
   council marquee track, and committee table from `data/team-members.json`, preserving all
   `.team-card`, `.leader-card-large`, `.slide-card`, and table classes. The marquee clone
   logic in `script.js` must keep working on the rendered cards.
5. **Testimonials** (`testimonials.html` + new `renderTestimonials.js`): render cards from
   `data/testimonials.json`; the existing modal logic (reads from rendered cards) keeps working.
6. **Magazine** (`magazine.js`): load `pagesData` + cover/foreword from `data/magazine.json`
   before building the viewer.
7. **Intro** (`intro.js`): read line1/line2 from `data/site.json` (with default fallback).
8. **Footer** (all four pages): render contact/phone lines/copyright from `data/site.json`.
9. **Load order**: load `data.js` before the renderers; renderers must AWAIT data before
   GSAP animations run, so animations target existing elements.

## Verification (MANDATORY)
- Run a local server (`python -m http.server 8000` from the project root).
- **Screenshot diff** against the ORIGINAL `D:\NSS\website` for all 4 pages, desktop + mobile
  (or at least visually compare). The site must look identical.
- Test: events filters/search/lightbox; testimonials modal; magazine viewer; hero slider.
- Test the **offline fallback** (DevTools → offline): pages render from the snapshot, not broken.
- Confirm there are NO console errors related to fetch/data.

## Rules
- Do not change the visual design, CSS, or animation behavior.
- Preserve all class names and IDs that CSS/JS depend on.

## Handoff (MANDATORY)
Update `D:\NSS\dynamic-website\HANDOFF.md`:
- List every file changed/added, and what each now reads from.
- Note the removal of the duplicated `EVENTS_2025_26` array.
- Report verification results (screenshots, offline test, interactive tests).
- Any remaining visual differences or bugs.
- **Instructions for Session 4:** read `docs/CMS_SOLUTION_REPORT.md` §5.4-5.6 and
  `docs/ADMIN_SETUP.md`, then build `/admin/index.html` + `/admin/config.yml` with Sveltia CMS,
  configure GitHub OAuth, media folder `assets/uploaded`, and collections for all 8 content types.
- Update `docs/PROGRESS.md`.
