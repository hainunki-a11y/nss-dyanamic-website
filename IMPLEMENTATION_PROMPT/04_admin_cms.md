# Session 4 — Phase 3: Install & configure the Sveltia CMS admin

Work **only** in `D:\NSS\dynamic-website`. **First read `D:\NSS\dynamic-website\HANDOFF.md`** for context, then the design docs.

## Context to load
- `docs/CMS_SOLUTION_REPORT.md` — Section 5.4 (admin UI), 5.5 (auth), 5.6 (pipeline), 5.7 (images).
- `docs/ADMIN_SETUP.md` — the technical setup steps (OAuth, Vercel, config).
- `docs/DATA_SCHEMA.md` — field definitions for each collection.

## Task — build the admin
1. Create `admin/index.html` — a minimal page that loads **Sveltia CMS** and points at
   `config.yml`, with the GitHub backend, repo, and branch. Include:
   - `<meta name="robots" content="noindex">` (keep the admin out of search).
   - No server required (served as a static file by Vercel).
2. Create `admin/config.yml` with **collections for all 8 content types** and correct widgets
   + validation, matching `DATA_SCHEMA.md`:
   - Site Config (single file `data/site.json`)
   - Hero Slides (`data/hero-slides.json`)
   - Objectives (`data/objectives.json`)
   - Category Icons (`data/category-icons.json`)
   - Magazine (`data/magazine.json`)
   - Team Members (`data/team-members.json`)
   - Testimonials (`data/testimonials.json`)
   - Events (folder collections `data/events/2025-26` and `data/events/2026-27`)
   Use appropriate widgets: string, text/markdown, image, select (for category/section),
   datetime/number (for order), and list widgets for repeatable sub-blocks.
3. Configure the **media library** to upload to `assets/uploaded` (create the folder),
   with allowed types `jpg, jpeg, png, webp, gif` and a size limit (~5 MB).
4. Document the **GitHub OAuth** setup clearly in `docs/ADMIN_SETUP.md` (Sveltia client-side
   OAuth / fine-grained token — no serverless function). Add explicit steps for:
   - Creating the GitHub OAuth App or fine-grained token.
   - Where the client ID goes in `config.yml` / `index.html` (NEVER the secret).
   - Inviting editors as repo contributors.
5. Add a `docs/VERIFICATION_NOTE.md` describing what can and cannot be tested locally vs.
   what needs the live GitHub + Vercel connection (login/publish can only be fully tested
   once deployed and connected).

## Verification
- The `/admin/` page loads without console errors when served locally.
- `config.yml` parses (valid YAML); collections match the data files.
- If a local GitHub token is available, test reading an entry; otherwise note it as pending.
- Full login → edit → publish can only be verified after the repo is connected to Vercel —
  document this clearly.

## Rules
- Do not commit any OAuth secret or personal access token.
- Keep admin changes inside `admin/`, `assets/uploaded/`, and doc updates.

## Handoff (MANDATORY)
Update `D:\NSS\dynamic-website\HANDOFF.md`:
- Files created (`admin/index.html`, `admin/config.yml`, `assets/uploaded/`, doc updates).
- What was verified locally vs. what needs the live GitHub/Vercel connection.
- **Instructions for Session 5:** read `docs/CMS_SOLUTION_REPORT.md` §5.10-5.12 (fallback,
  security, testing), then do Phase 4 polish: XSS escaping in renderers, image limits,
  offline fallback robustness, accessibility pass, and full QA.
- Update `docs/PROGRESS.md`.
