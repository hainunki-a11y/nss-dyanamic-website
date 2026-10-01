# Session 2 — Phase 1: Create the data layer

Work **only** in `D:\NSS\dynamic-website`. **First read `D:\NSS\dynamic-website\HANDOFF.md`** for context, then the design docs below.

## Context to load
- `docs/CMS_SOLUTION_REPORT.md` — Section 5.2 (data schemas), 5.3 (folder structure), 5.10 (fallback).
- `docs/DATA_SCHEMA.md` — exact JSON structure for all 8 content types.
- The CURRENT source files that hold the content to migrate:
  - `index.html` (hero text, about, objectives, home events grid, footer, contact)
  - `events-timeline.js` (`NSS_EVENTS`, `NSS_EVENTS_2026_27`, `CATEGORY_ICON`)
  - `events-calendar.js` (`EVENTS_2025_26`, `CATEGORY_ICON`)
  - `magazine.js` (`pagesData`, cover)
  - `teams.html` (faculty, leadership, council, committee)
  - `testimonials.html` (7 cards)
  - `intro.js` (typewriter lines)

## Task — create the /data JSON layer
1. Create the `data/` folder with these files, **seeded EXACTLY from current on-screen content**
   (the site must look identical after later phases):
   - `data/site.json` (hero title/quote, about, objectives intro, contact/phone lines, map, copyright, introText)
   - `data/hero-slides.json` (the 5 hero images from `index.html`)
   - `data/objectives.json` (the 4 objective cards)
   - `data/category-icons.json` (the `CATEGORY_ICON` map)
   - `data/magazine.json` (cover, foreword, pages from `magazine.js`)
   - `data/team-members.json` (sections: faculty, leadership, council, committee from `teams.html`)
   - `data/testimonials.json` (7 testimonials from `testimonials.html`)
   - `data/events/2025-26/*.json` and `data/events/2026-27/*.json` (one file per event,
     preserving date/title/tag/venue/photo/order; the 2025-26 set is the SINGLE source —
     note it currently exists in BOTH `events-timeline.js` and `events-calendar.js`)
2. Create `data.js` — a shared loader that:
   - `fetch()`es the JSON files (with a small cache + timeout).
   - Exposes a promise-based API (e.g. `NSS.getData()`).
   - Includes an embedded **offline fallback snapshot** (last-known-good defaults) and
     a function to `escapeHtml()` text rendered into the DOM (XSS defense).
   - Logs fetch errors to the console.
3. Create `scripts/validate-data.js` — validates every JSON file against the rules in
   `docs/DATA_SCHEMA.md` §9 (dates parse, required fields present, image paths exist in the repo).
4. Run `scripts/validate-data.js` and fix any failures.

## Rules
- Do NOT yet refactor the HTML/JS renderers (that's Session 3). This session only creates the
  data files + loader + validator.
- Keep field names exactly as documented in `DATA_SCHEMA.md`.

## Handoff (MANDATORY)
Update `D:\NSS\dynamic-website\HANDOFF.md`:
- List every file created under `data/` (with counts: e.g. 38 events in 2025-26, 14 in 2026-27).
- Confirm `validate-data.js` passes.
- Note any content that was ambiguous (e.g. duplicated events) and how you resolved it.
- **Instructions for Session 3:** read `docs/CMS_SOLUTION_REPORT.md` §5.9 (refactor),
  then refactor `events-timeline.js`, `events-calendar.js`, `magazine.js`, `intro.js`,
  add `renderHome.js`/`renderTeams.js`/`renderTestimonials.js`, render footer from `site.json`,
  and make GSAP run after data renders.
- Update `docs/PROGRESS.md`.
