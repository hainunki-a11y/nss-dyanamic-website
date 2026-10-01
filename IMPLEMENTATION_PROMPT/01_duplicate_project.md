# Session 1 — Duplicate the project + git init (Phase 0 setup)

Run this in a **fresh session**. Do NOT modify `D:\NSS\website`.

## Task
1. Create `D:\NSS\dynamic-website` as a **full recursive copy** of `D:\NSS\website`
   (all HTML, CSS, JS, assets, docs — everything).
2. Verify the copy is complete: count files in both folders and diff the file lists
   (they should be identical). Spot-check a few files with identical hashes.
3. Inside `D:\NSS\dynamic-website` only:
   - `git init`
   - Create `.gitignore` containing at least: `.DS_Store`, `Thumbs.db`, `node_modules/`.
   - Create `vercel.json` with the static framework preset:
     ```json
     { "version": 2, "builds": [{ "src": "/*", "use": "@vercel/static" }] }
     ```
   - Do a `git add .` and an initial commit "Baseline static site (copied from NSS/website)".
     (Do NOT push — no remote is configured; that's fine.)
4. Confirm the copied site still works locally:
   - `python -m http.server 8000` from `D:\NSS\dynamic-website` and check `index.html`,
     `events.html`, `teams.html`, `testimonials.html` load.

## Rules
- Work **only** in `D:\NSS\dynamic-website`. Never touch `D:\NSS\website`.
- Do not modify any existing HTML/CSS/JS in this session (that happens in later phases).

## Handoff (MANDATORY)
At the end, write/overwrite `D:\NSS\dynamic-website\HANDOFF.md` containing:
- Confirmation the copy is complete and identical (file counts).
- The git state (initialized, initial commit hash).
- That the site loads locally (verification performed).
- **Instructions for Session 2:** read `docs/CMS_SOLUTION_REPORT.md` Section 5.2 (data schemas)
  and `docs/DATA_SCHEMA.md`, then create the `/data` JSON layer seeded from the current
  hardcoded content, plus `data.js` and `scripts/validate-data.js`.
- List the exact files Session 2 should read first and create.

Also write `docs/PROGRESS.md` noting Session 1 complete and Session 2 next.
