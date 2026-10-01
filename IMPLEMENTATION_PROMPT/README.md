# Implementation Session Prompts — NSS Dynamic Website

This folder contains **one dedicated prompt per implementation session**. Run them **in order** in separate sessions. Each session:

1. Copies/works in the project as instructed.
2. Implements one phase.
3. **Writes a handoff file** (`HANDOFF.md`) that gives the next session full context, so it can start without re-reading this conversation.

## How to use

1. **First, create the working copy** — the first prompt (`01_duplicate_project.md`) copies `D:\NSS\website` → `D:\NSS\dynamic-website`. Run it once.
2. Then run each phase prompt **in numerical order** in a **new session**, pasting the whole file as the prompt.
3. Each phase ends by writing/updating `D:\NSS\dynamic-website\HANDOFF.md` (and `docs/PROGRESS.md`), so the next session has full context.
4. **Do not modify `D:\NSS\website`** — it stays untouched. All work happens in `D:\NSS\dynamic-website`.

## Session order

| # | File | Phase | Handoff it produces |
|---|---|---|---|
| 1 | `01_duplicate_project.md` | Duplicate project + git init | `HANDOFF.md` (baseline) |
| 2 | `02_data_layer.md` | Phase 1 — data JSON + loader + validation | `HANDOFF.md` update |
| 3 | `03_refactor_renderers.md` | Phase 2 — refactor site to read from data | `HANDOFF.md` update |
| 4 | `04_admin_cms.md` | Phase 3 — Sveltia admin + config + OAuth | `HANDOFF.md` update |
| 5 | `05_polish_hardening.md` | Phase 4 — security, fallback, a11y, QA | `HANDOFF.md` update |
| 6 | `06_docs_finalize.md` | Phase 5 — verify docs match code | `HANDOFF.md` final |

## Handoff file convention

Every session must end by updating `D:\NSS\dynamic-website\HANDOFF.md` with:
- What was completed in this session (with file paths).
- How it was verified / tested.
- Known issues or open items.
- Exact instructions for the next session (what to build next and what files to read first).
- Any assumptions or decisions made.

This is what makes the next session able to start fresh with full context.

## Shared design reference

All sessions should read the canonical design: `D:\NSS\dynamic-website\docs\CMS_SOLUTION_REPORT.md` (Sections 5 and 6), plus the admin docs (`docs/ADMIN_GUIDE.md`, `docs/ADMIN_SETUP.md`, `docs/DATA_SCHEMA.md`, `docs/CMS_TROUBLESHOOTING.md`).
