# NSS TSEC Mumbai — Dynamic Website

[![NSS Logo](assets/nss_logo.png)](https://github.com/hainunki-a11y/nss-dyanamic-website)

The National Service Scheme (NSS) unit website for **Thakur Shyamnarayan Engineering College
(TSEC), Mumbai**. This repository contains the **data-driven, CMS-backed** build of the site —
the content is no longer hardcoded; it lives in JSON files and is editable through a web-based
admin, with no database and no server to manage.

---

## ✏️ Content Management (Admin)

A private, web-based admin lets authorized team members update content **without touching code**.

- **Admin URL:** `<live-site>/admin/` (e.g. `https://nss-website-pink.vercel.app/admin/`)
- **How it works:** an editor signs in with GitHub, fills in simple forms (add an event, upload a
  photo, edit a testimonial), and clicks **Save**. The change is committed to this repo, Vercel
  rebuilds automatically, and visitors see the update in about a minute. Every save is recorded,
  so the owner can **undo/revert** any change.
- **Who can edit:** only people invited as **repo contributors** (via GitHub). Visitors just see
  the website.
- **No database, no server:** content is stored as simple JSON files in `data/` and served by the
  same static host. The admin is a static page that talks to the GitHub API from the browser.

**Guides:**
- 👤 **For editors (non-technical):** [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) — how to log in and edit every section.
- 🔧 **For the tech lead / setup:** [`docs/ADMIN_SETUP.md`](docs/ADMIN_SETUP.md) — OAuth/token setup, Vercel, and go-live checklist.
- 📐 **Data schema reference:** [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md) and the full design in [`docs/CMS_SOLUTION_REPORT.md`](docs/CMS_SOLUTION_REPORT.md).

---

## 🧱 What was implemented

The site was migrated from a fully static site (hardcoded content) to a **data-driven
architecture** in five phases:

| Phase | What was done |
|---|---|
| **0 — Duplicate & git init** | Copied the original static site, initialized git, added `vercel.json` + `.gitignore`. |
| **1 — Data layer** | Extracted all content into `data/` as JSON (single source of truth) with a shared loader (`data.js`) that fetches with caching, timeout, **offline fallback**, and HTML escaping. Added `scripts/validate-data.js`. |
| **2 — Refactor renderers** | All pages now render from `data/` instead of hardcoded arrays/HTML: `renderHome.js`, `renderTeams.js`, `renderTestimonials.js`, `events-timeline.js`, `events-calendar.js`, `magazine.js`, `intro.js`, and the shared footer. |
| **3 — Admin CMS** | Added **Sveltia CMS** at `/admin/` (`admin/config.yml`) with 8 content types across 9 collections, media library, and GitHub auth. |
| **4 — Polish & hardening** | XSS escaping on every rendered value, image fallback, accessibility (`role=dialog`/`aria-modal`, keyboard support), renderers that never throw if `data.js` fails, and offline rendering. |
| **5 — Docs finalize** | Finalized all documentation, README, `PROGRESS.md`, and `HANDOFF.md`. |

---

## 🗃️ Data layer

All content is stored as JSON in `data/` and read at runtime by the renderers:

| Content | File(s) |
|---|---|
| Site config (hero, about, objectives, contact) | `data/site.json` |
| Hero slides | `data/hero-slides.json` |
| Objectives | `data/objectives.json` |
| Events | `data/events/2025-26/*.json`, `data/events/2026-27/*.json` |
| Category icons | `data/category-icons.json` |
| Magazine | `data/magazine.json` |
| Team members | `data/team-members.json` |
| Testimonials | `data/testimonials.json` |

`data.js` exposes `window.NSS.getData()` / `getEvents(year)` and renders the shared footer. If a
`data/` fetch ever fails (offline / CDN hiccup), the site falls back to an embedded snapshot so
pages still render.

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari).

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/hainunki-a11y/nss-dyanamic-website.git
   ```
   *(Note: this is a test/preview repo — point the clone at whatever repo hosts the live site.)*
2. Open `index.html` in your browser, or run a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

> The admin (`/admin/`) requires a live GitHub connection to sign in; it cannot be used from a
> plain `file://` open. For local testing of the admin, run a static server and see
> [`docs/VERIFICATION_NOTE.md`](docs/VERIFICATION_NOTE.md).

---

## 📚 Documentation

The full documentation suite lives in [`docs/`](docs/):

- [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) — editor-facing admin guide.
- [`docs/ADMIN_SETUP.md`](docs/ADMIN_SETUP.md) — tech-lead setup, OAuth/tokens, Vercel.
- [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md) — every JSON field reference.
- [`docs/CMS_TROUBLESHOOTING.md`](docs/CMS_TROUBLESHOOTING.md) — common admin issues.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pages, data layer, and renderers fit together.
- [`docs/CMS_SOLUTION_REPORT.md`](docs/CMS_SOLUTION_REPORT.md) — full design, decisions, and implementation plan.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — session-by-session progress across all phases.
- [`docs/VERIFICATION_NOTE.md`](docs/VERIFICATION_NOTE.md) — what is verified locally vs. what needs a live GitHub + Vercel connection.
- [`HANDOFF.md`](HANDOFF.md) — final handoff and go-live checklist.

---

## 🛠️ Tech Stack

- **HTML5, CSS3, Vanilla JS** — the site itself.
- **Sveltia CMS** (Decap-compatible) — the web admin, loaded from CDN at `/admin/`.
- **GitHub API** — saves/commits content from the admin.
- **GSAP / ScrollTrigger** — scroll animations.
- **Lottie** — vector animations.
- **Google Fonts** — Inter & Montserrat.
- **JSON** — the content "database".

---

*"Not Me, But You." — NSS TSEC Mumbai*
