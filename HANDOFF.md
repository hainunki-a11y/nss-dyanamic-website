# HANDOFF — Session 2

## Session 1 status: COMPLETE (Phase 0 setup)

### 1. Copy verification
- Created `D:\NSS\dynamic-website` as a full recursive copy of `D:\NSS\website`
  (via `robocopy /E /COPY:DAT`).
- File count: **85 files** in both `D:\NSS\website` and `D:\NSS\dynamic-website`.
- Relative-path file lists are **identical** (`Compare-Object` → 0 differences).
- Hash spot-checks (SHA-256) all **MATCH**: `index.html`, `events.html`,
  `teams.html`, `testimonials.html`, `style.css`, `script.js`,
  `docs/DATA_SCHEMA.md`, and binary assets under `assets/`.
- The destination also contains the `IMPLEMENTATION_PROMPT/` planning folder
  (not part of the website; a pre-existing sibling artifact).

### 2. Git state
- Repository initialized in `D:\NSS\dynamic-website` (`git init`).
- `.gitignore` created (contains `.DS_Store`, `Thumbs.db`, `node_modules/`).
- `vercel.json` created with the static framework preset:
  `{ "version": 2, "builds": [{ "src": "/*", "use": "@vercel/static" }] }`
- Initial commit created (not pushed — no remote configured; that is fine):
  - Short hash: `607bfb5`
  - Full hash: `607bfb56e64dbe59bdbc58c565be28431d347330`
  - Message: `Baseline static site (copied from NSS/website)`
  - 94 files committed (85 website files + 7 IMPLEMENTATION_PROMPT files +
    `.gitignore` + `vercel.json`).

### 3. Local load verification
- Ran `python -m http.server 8000` from `D:\NSS\dynamic-website`.
- All four pages returned **HTTP 200** with expected byte sizes:
  - `index.html` → 200 (23114 bytes)
  - `events.html` → 200 (7493 bytes)
  - `teams.html` → 200 (26818 bytes)
  - `testimonials.html` → 200 (12240 bytes)
- Server was stopped after verification.

---

## Instructions for Session 2 — Build the `/data` JSON layer

### First read these files
1. `docs/CMS_SOLUTION_REPORT.md` — **Section 5.2** ("Data schemas (JSON) for every
   content type", around line 273) defines the target JSON schemas for all content
   types (site, hero slides, objectives, events, teams, testimonials, magazine).
2. `docs/DATA_SCHEMA.md` — detailed field-by-field data schema reference.
3. The current hardcoded content sources to migrate from:
   - `index.html` (site config, hero slides, objectives, about, contact)
   - `events.html` + `events-calendar.js` / `events-timeline.js`
   - `teams.html` + `script.js` (team members)
   - `testimonials.html` + `testimonials.js`
   - `magazine.js` / `intro.js`

### Files Session 2 should create
- `data/site.json` — site config (hero, about, objectives, contact, introText)
- `data/hero-slides.json` — hero carousel slides
- `data/objectives.json` — objectives list
- `data/events.json` — events (calendar + timeline entries)
- `data/teams.json` — team members
- `data/testimonials.json` — testimonials
- `data/magazine.json` — magazine articles (if applicable per schema)
- `data.js` — loader that fetches/imports the JSON into a single namespace
- `scripts/validate-data.js` — validation script that checks the JSON files
  against the documented schemas

### Session 2 constraints
- Seed every JSON file **from the current hardcoded content** (no content loss).
- Do not yet refactor the page renderers (that is Session 3) — build the data
  layer and validator, then verify it.
- Work only in `D:\NSS\dynamic-website`; never touch `D:\NSS\website`.
- Keep `HANDOFF.md` and `docs/PROGRESS.md` updated.
