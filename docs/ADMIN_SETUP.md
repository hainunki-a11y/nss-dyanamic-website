# NSS Website Admin Setup Guide (for the tech lead)

This guide covers the **one-time technical setup** to enable the web-based content admin on
the NSS website. It assumes the site is hosted on **Vercel** at
`https://nss-website-pink.vercel.app/` and is a static site backed by a **GitHub repository**
(`Bhavesh1411/NSS-Website`).

> This guide is for the **tech lead / developer**. Everyday editors should read
> **`ADMIN_GUIDE.md`** instead.

---

## 1. Prerequisites

- The website is in a **GitHub repository** (`Bhavesh1411/NSS-Website`).
- That repository is **connected to a Vercel project** that auto-builds on push to the
  default branch (`main`).
- You have **admin access** to the GitHub repo and the Vercel project.

> **Default branch must be `main`.** `admin/config.yml` and all the docs assume the repo's
> default branch is **`main`**. The local checkout (and the current local git repo) is on
> `master`; before going live, rename it once with `git branch -M main`, push it, and point
> the Vercel production branch at `main`. If you keep the branch named `master` instead,
> you must update `branch: main` in `admin/config.yml` to `branch: master` and every doc that
> says `main` — the whole pipeline depends on this one name matching the repo's default branch.

If the repo is not yet connected to Vercel: in Vercel, click **Add New → Project**, import the
GitHub repo, choose the **Other (static)** framework preset, leave the build command empty and
the output directory as the root, then **Deploy**.

---

## 2. Overview

We use **Sveltia CMS** (a Decap-compatible, Git-based headless CMS). Editors edit content as
**JSON files** committed to the repo via the **GitHub API** — **no database and no server**.

```
Editor opens /admin/  →  signs in with GitHub  →  edits forms
     →  Save  →  commits JSON files to the repo
     →  Vercel auto-builds on push to main  →  live site updates (~1 min)
```

The admin lives in `admin/index.html` + `admin/config.yml` and is served **as a static file**
by Vercel — no serverless function is required.

---

## 3. What's already in the repo

The pieces that ship with the codebase (already created in Phase 3):

| Path | Purpose |
|---|---|
| `admin/index.html` | Loads the Sveltia CMS bundle from the CDN. |
| `admin/config.yml` | Backend (`github`, `Bhavesh1411/NSS-Website`, `main`), media library, and all 8 content types (9 collections). |
| `data/` | The content "database" (all JSON) that the CMS reads and writes. |
| `assets/uploaded/` | Folder where CMS-uploaded images land (media library target). |
| `vercel.json` | Static framework preset (no build step). |

The CMS configuration **does not contain any secret**. It only references the public
`repo`/`branch`. Authentication is handled entirely in the editor's browser.

---

## 4. GitHub authentication (the important step)

Sveltia CMS authenticates against GitHub **entirely client-side**, so **no serverless OAuth
function is required**. There are two supported ways to sign in. We recommend the first.

### Option A — Fine-grained access token (recommended; truly no-serverless)

This is the simplest and fully client-side path. It works well when the CMS is used by a small
group of **technical** editors (the NSS tech team). Each editor signs in by pasting a token;
no OAuth App and no server are involved.

**Create a fine-grained personal access token (one per editor, or one shared):**

1. On GitHub, go to **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Give it a name (e.g. `nss-admin`).
3. Under **Repository access**, choose **Only select repositories** and select the
   `NSS-Website` repo.
4. Under **Permissions → Repository permissions**, set:
   - **Contents** → **Read and write** (this is what lets the CMS read and commit JSON + images).
   - **Pull requests** → **Read and write** (only needed if Editorial Workflow is ever enabled;
     not needed for the current publish-immediately setup, but harmless to add).
5. Click **Generate token**, then **copy it immediately** — GitHub shows it only once.

**Where the token goes:** it is **not** placed in `config.yml` or `index.html`. The editor
pastes it into the Sveltia **login prompt** ("Sign in with Token"). Sveltia stores it in the
**browser's local storage only** — it never leaves the client and is never committed to the
repo.

> **Never commit a token.** Treat it like a password. If it is ever leaked, revoke it on GitHub
> and generate a new one.

### Option B — GitHub OAuth App (for non-technical editors, requires a small server)

If you want everyday editors to sign in with just **"Authorize"** (no token pasting), you need
an OAuth **client** that Sveltia can call — this is the **only** part that needs a small
serverless function (e.g. **Sveltia CMS Authenticator** on Cloudflare Workers, or a
third-party Decap OAuth client). This contradicts the "no serverless function" goal, so it is
optional and only worth doing if token pasting is unacceptable.

1. Register a **GitHub OAuth App** at `https://github.com/settings/applications/new`:
   - Application name: `NSS Admin` (or similar).
   - Homepage URL: `https://nss-website-pink.vercel.app/`.
   - Authorization callback URL: `<YOUR_OAUTH_CLIENT_URL>/callback`.
2. Deploy an OAuth client (e.g. [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)
   on Cloudflare Workers) and configure its `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
   environment variables from the OAuth App.
3. In `admin/config.yml`, add `base_url: <YOUR_OAUTH_CLIENT_URL>` under `backend`.

**Where the client ID goes:** the OAuth App's **client ID** is a public value — it is baked
into the OAuth client's config (an environment variable on the serverless function), **not**
into `config.yml` or `index.html`. The **client secret** must **never** be committed; it lives
only as an encrypted environment variable on the OAuth client server.

---

## 5. Invite editors (contributors)

Access control is simply **repo write access** — there is no separate user database.

1. On GitHub, go to the `NSS-Website` repo → **Settings → Collaborators → Add people**.
2. Add each editor's GitHub account with the **Write** (or higher) role.
3. Tell them the admin URL: `https://nss-website-pink.vercel.app/admin/`.
   - If using **Option A**, also tell them to create/paste their fine-grained token at login.
   - If using **Option B**, they just click **Authorize**.

Only people with **write access to the repo** can edit content. Visitors (read-only) cannot
get in.

---

## 6. Deploy pipeline (Vercel)

1. Ensure the Vercel project is connected to the GitHub repo and builds on push to `main`.
2. A minimal `vercel.json` (`{ "version": 2, "builds": [{ "src": "/*", "use": "@vercel/static" }] }`)
   already exists and makes the static preset explicit.
3. When an editor saves, the CMS commits to `main` → Vercel rebuilds → the live site updates
   (~1 minute).
4. **Rollback:** revert the offending commit in GitHub (or `git revert` locally and push);
   Vercel redeploys the previous version.

---

## 7. Security notes

- **Never commit** an OAuth client secret or any personal access token.
- With the recommended token method, the token lives only in the editor's browser local
  storage; nothing secret is stored in the static bundle or config.
- **Escape HTML** in rendered text fields (defense against XSS) — see Phase 4.
- Keep the CMS write scope limited to `data/` and `assets/uploaded/` (the configured
  collections).

### 7.1 Branch protection (recommended)

We strongly recommend protecting `main` so a mistaken or malicious force-push can never
silently overwrite history. **At minimum, block force-pushes**:

1. GitHub → repo → **Settings → Branches → Add branch protection rule** (or edit the one for
   `main`).
2. Under **Protect matching branches**, set the branch to `main`.
3. Tick **Require a pull request before merging** *(optional)* — note that this changes the
   editor flow: the CMS currently **publishes straight to `main`** (see `ADMIN_SETUP.md` §6),
   so if you enable PR-required protection you must either switch editors to open PRs from
   their own branches (via Sveltia's Editorial Workflow) or leave PR-required off and only
   block force-pushes.
4. Tick **Do not allow force pushes** (and, if desired, **Block force pushes for everyone**
   including admins).

> **Recommendation for this site:** enable **"Do not allow force pushes"** only (keep the
> publish-immediately-to-`main` model). That blocks the worst failure mode without breaking
> the CMS's direct-to-`main` saves. Rolling back still works via `git revert` (the CMS never
> rewrites history, so a revert commit is always safe).

---

## 8. Verification checklist

- [ ] `admin/index.html` loads at `/admin/` without console errors (static, no server).
- [ ] `admin/config.yml` parses (valid YAML); every collection matches a `data/*.json` file
      or `data/events/<year>/` folder.
- [ ] `/admin/` shows all 9 collections (Site Config, Hero Slides, Objectives, Events 2025-26,
      Events 2026-27, Category Icons, Magazine, Team Members, Testimonials).
- [ ] An editor can sign in (token or OAuth), open each collection, and see the existing
      content.
- [ ] Edit each of the 8 content types; upload an image to `assets/uploaded/`; publish.
- [ ] Change appears on the live Vercel site after ~1 minute.
- [ ] Rollback works (revert a commit → previous version restored).
- [ ] Editors can follow `ADMIN_GUIDE.md` end-to-end.

> Items requiring the live GitHub + Vercel connection (login, publish, rollback) can **only**
> be verified once the repo is connected and deployed. See `docs/VERIFICATION_NOTE.md` for
> what can be tested locally versus what needs the live connection.

---

## 9. See also

- `docs/CMS_SOLUTION_REPORT.md` — full design, data schemas, refactor plan, testing.
- `docs/DATA_SCHEMA.md` — JSON field reference.
- `docs/VERIFICATION_NOTE.md` — what can/cannot be tested locally.
- `docs/CMS_TROUBLESHOOTING.md` — common issues.
