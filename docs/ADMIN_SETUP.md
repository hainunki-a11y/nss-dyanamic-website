# NSS Website Admin Setup Guide (for the tech lead)

This guide covers the **one-time technical setup** to enable the web-based content admin on the NSS website. It assumes the site is hosted on **Vercel** at `https://nss-website-pink.vercel.app/` and is a static site backed by a **GitHub repository**.

> This guide is for the **tech lead / developer**. Everyday editors should read **`ADMIN_GUIDE.md`** instead.

---

## 1. Prerequisites

- The website is in a **GitHub repository** (e.g. `Bhavesh1411/NSS-Website`).
- That repository is **connected to a Vercel project** that auto-builds on push to the default branch (`main`).
- You have **admin access** to the GitHub repo and the Vercel project.

If the repo is not yet connected to Vercel: in Vercel, click **Add New → Project**, import the GitHub repo, choose the **Other (static)** framework preset, leave the build command empty and output directory as root, then **Deploy**.

---

## 2. Overview of what we are setting up

We use a **Git-based CMS** — **Sveltia CMS** (Decap-compatible) — so editors can edit content as **JSON files** committed to the repo via the **GitHub API**, with **no database and no server**.

Flow:

```
Editor opens /admin/  →  signs in with GitHub OAuth  →  edits forms
     →  Save  →  commits JSON files to the repo
     →  Vercel auto-builds on push  →  live site updates
```

---

## 3. The pieces to add (in order)

### 3.1 Content data files (`data/`)

Create the content folder that the site reads from (and that the CMS writes to):

```
website/
├── admin/                     # CMS admin app
│   ├── index.html
│   └── config.yml             # CMS collection definitions
├── data/
│   ├── site.json              # hero text, about, objectives intro, contact
│   ├── hero-slides.json
│   ├── objectives.json
│   ├── category-icons.json
│   ├── magazine.json
│   ├── team-members.json
│   ├── testimonials.json
│   └── events/
│       ├── 2025-26/           # one JSON file per event
│       └── 2026-27/
├── assets/uploaded/           # images uploaded via the CMS
└── vercel.json                # static framework preset (explicit)
```

Seed the JSON files with the **current hardcoded content** so the site looks the same before and after. The exact schemas are in `docs/CMS_SOLUTION_REPORT.md` (§5.2) and `docs/DATA_SCHEMA.md`.

### 3.2 Admin entry (`admin/index.html`)

A minimal page that loads the Sveltia CMS admin. It points the CMS at `config.yml`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>NSS Content Admin</title>
</head>
<body>
  <!-- Include the Sveltia CMS script (or build it locally) here -->
  <script src="https://cdn.jsdelivr.net/npm/sveltia-cms/dist/sveltia-cms.js"></script>
  <script>
    // Initialise with the GitHub backend
    window.SveltiaCMS.init({
      config: 'config.yml',
      backend: {
        name: 'github',
        repo: 'Bhavesh1411/NSS-Website',   // your owner/repo
        branch: 'main',
        auth_type: 'github',
        // base_url / auth_endpoint: see note in §5 about Sveltia OAuth
      },
      ...
    });
  </script>
</body>
</html>
```

> **Note:** `admin/index.html` is served from the **static site** (no server needed). The `robots` meta keeps search engines out of the admin.

### 3.3 CMS configuration (`admin/config.yml`)

Define the collections so editors get structured forms. A minimal skeleton:

```yaml
backend:
  name: github
  repo: Bhavesh1411/NSS-Website
  branch: main
  auth_type: github

media_folder: "assets/uploaded"
public_folder: "/assets/uploaded"

collections:
  - name: "events_2026_27"
    label: "Events 2026-27"
    folder: "data/events/2026-27"
    extension: json
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "string", required: true, hint: "e.g. 21 Jun 2026" }
      - { label: "Category", name: "tag", widget: "string" }
      - { label: "Venue", name: "venue", widget: "string", required: false }
      - { label: "Photo", name: "photo", widget: "image", required: false }
      - { label: "Order", name: "order", widget: "number" }
  # ... add similar collections for the other 7 content types (see CMS_SOLUTION_REPORT §5.2)
```

### 3.4 GitHub OAuth (the fiddly part)

Sveltia CMS can authenticate **entirely client-side** against GitHub, so **no serverless function is required**. Set up either:

- **Option A — Fine-grained access token (simplest for a small team):** create a fine-grained PAT that can read/write `Contents` on this repo, and have editors use it (or configure it via Sveltia's token prompt). Follow Sveltia's docs for the exact field names.
- **Option B — GitHub OAuth App:** register a GitHub OAuth App with the callback URL pointing at your site (Vercel supports this). The **client ID** goes in the config; the **secret** is managed by GitHub / your OAuth flow — **never** put the secret in the static files.

> Because Sveltia does this client-side, there is **no Netlify Identity / Git Gateway** and no serverless function. If you later switch to **Decap CMS**, you would add Netlify Identity + Git Gateway (or a tiny serverless OAuth function) instead — see the report for the trade-off.

### 3.5 Invite editors (contributors)

- In GitHub, go to **Settings → Collaborators** on the repo and **add** each editor's GitHub account with **write** access.
- Editors then sign in to the admin with their own GitHub account.
- This is the entire access-control model: **repo contributors = content editors**. No separate user database.

### 3.6 Make the site read from `data/`

Refactor the existing JS/HTML to `fetch()` the JSON files instead of hardcoded data:
- Add a shared `data.js` loader (fetch + cache + offline fallback snapshot + HTML escaping).
- Update `events-timeline.js`, `events-calendar.js`, `magazine.js`, `intro.js`, and add small `renderHome.js` / `renderTeams.js` / `renderTestimonials.js` to build the static sections.
- See `docs/CMS_SOLUTION_REPORT.md` (§5.9, §5.10) for the full refactor + fallback approach.

---

## 4. Deploy pipeline (Vercel)

1. Ensure the Vercel project is connected to the GitHub repo and builds on push to `main`.
2. Add a minimal `vercel.json` to be explicit about the static preset (optional but recommended):
   ```json
   { "version": 2, "builds": [{ "src": "/*", "use": "@vercel/static" }] }
   ```
3. When an editor saves, the CMS commits to `main` → Vercel rebuilds → the live site updates (~1 minute).
4. **Rollback:** revert the offending commit in GitHub (or `git revert` locally and push); Vercel redeploys the previous version.

---

## 5. Security notes

- **Never commit** the OAuth secret or any personal access token.
- The admin config references only the **public client ID**; the secret stays with GitHub / the OAuth flow.
- **Escape HTML** in rendered text fields (defense against XSS).
- Keep the CMS write scope limited to `data/` and `assets/uploaded/` (configured collections).
- Optionally enable **branch protection** on `main` to block force-pushes.

---

## 6. Verification checklist

- [ ] `data/` JSON files exist and match current on-screen content (screenshot-diff).
- [ ] `data.js` loader + renderers work; site looks identical; offline fallback renders.
- [ ] `/admin/` loads; you can log in with a contributor account.
- [ ] Edit each of the 8 content types; upload an image; publish.
- [ ] Change appears on the live Vercel site after ~1 minute.
- [ ] Rollback works (revert a commit → previous version restored).
- [ ] Editors can follow `ADMIN_GUIDE.md` end-to-end.

---

## 7. See also

- `docs/CMS_SOLUTION_REPORT.md` — full design, data schemas, refactor plan, testing.
- `docs/DATA_SCHEMA.md` — JSON field reference.
- `docs/CMS_TROUBLESHOOTING.md` — common issues.
