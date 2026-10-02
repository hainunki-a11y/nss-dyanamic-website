# Verification Note — What can and cannot be tested

This note documents what was verified **locally** during Phase 3 (installing the CMS) and what
can **only** be verified once the repo is connected to **live GitHub + Vercel**.

---

## 1. Verified locally (this session)

| Check | Result |
|---|---|
| `admin/index.html` served at `/admin/` (HTTP 200, `text/html`) via `python -m http.server` | ✅ PASS |
| `admin/config.yml` served at `/admin/config.yml` (HTTP 200, `application/yaml`) | ✅ PASS |
| `admin/config.yml` parses as valid YAML (PyYAML `safe_load`) | ✅ PASS |
| Backend block: `name: github`, `repo: Bhavesh1411/NSS-Website`, `branch: main` | ✅ PASS |
| Media folder `assets/uploaded/` exists (created) | ✅ PASS |
| All 8 content types mapped to collections (9 collections incl. 2 event folders) | ✅ PASS |
| Every file collection `file:` path resolves to an existing `data/*.json` | ✅ PASS |
| Every folder collection `folder:` matches `data/events/2025-26` (37) & `data/events/2026-27` (14) | ✅ PASS |
| Configured field `name`s match the actual JSON keys in every `data/*.json` (incl. nested object/list sub-fields) | ✅ PASS |
| Media library: allowed types `jpg, jpeg, png, webp, gif`, size limit 5 MB (5,242,880 bytes) | ✅ PASS |

**Not testable locally:** the Sveltia CMS JavaScript bundle loads from a CDN (`unpkg`), so the
actual admin UI (login screen, forms, media picker) only renders when the page is opened in a
browser **with internet access**. It cannot be exercised in a fully offline local test.

---

## 2. Cannot be tested until connected to live GitHub + Vercel

The admin's login → edit → publish flow depends on a real GitHub repository and the Vercel
deploy pipeline. These are **pending** until the repo is connected and deployed:

| Item | Why it needs live connection |
|---|---|
| **Sign in** (fine-grained token or OAuth) | Requires a real GitHub account/token against the actual `Bhavesh1411/NSS-Website` repo. |
| **Reading an entry** from the repo | The CMS lists/loads entries via the GitHub API; no token was available locally, so this could not be exercised. |
| **Editing & saving each content type** | Saving commits JSON via the GitHub API to `main`. |
| **Uploading an image** | Writes the file to `assets/uploaded/` in the repo via the GitHub API. |
| **Publish** (change appears live) | Requires Vercel to rebuild on push to `main`. |
| **Rollback** (revert a commit) | Requires the live GitHub history + a fresh Vercel deploy. |
| **Multi-editor / conflict handling** | Requires real concurrent GitHub commits. |

---

## 3. Pending items to complete after the repo is live

1. Confirm the repo default branch is **`main`** (the config and this guide assume `main`).
   If the repo uses `master`, update `branch:` in `admin/config.yml` to match.
2. Add the GitHub fine-grained token / OAuth client (see `docs/ADMIN_SETUP.md` §4).
3. Invite editors as repo contributors (see `docs/ADMIN_SETUP.md` §5).
4. Open `https://nss-website-pink.vercel.app/admin/`, sign in, and run the
   "Verification checklist" in `docs/ADMIN_SETUP.md` §8.
5. Run `node scripts/validate-data.js` after a CMS edit to confirm the written JSON still
   passes the data contract checks (dates, required fields, image paths, order, email).

---

## 4. How to test the data contract locally (independent of GitHub)

You don't need GitHub to confirm that the files the CMS will write still match the schema:

```
node scripts/validate-data.js
```

This validates every `data/*.json` (dates, required fields, image paths, order, email). Run it
after any CMS edit to catch a malformed save before it affects the live site.
