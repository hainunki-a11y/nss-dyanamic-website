# Deployment — NSS TSEC Mumbai Website

The site is **100% static** (HTML/CSS/JS + assets, no build step). It can be deployed to any static host by uploading/pushing the `website` folder contents. Below are step-by-step guides for the most common platforms.

> **No build command is required.** The "build output" is simply the repository root itself (all files). Do **not** deploy `node_modules` (there is none) or `.git`.

---

## 0. Prepare

Before deploying, make sure:
- The folder contains `index.html` at its root (it does).
- All asset paths are **relative** (`assets/...`, `style.css`, etc.) — they already are, so sub-path hosting works without changes.
- (Optional but recommended) Compress the large hero/event images — see `docs/IMPROVEMENTS.md`.

---

## 1. GitHub Pages

### Option A — via `gh-pages` branch (manual)
```bash
# from the project folder
git init
git add .
git commit -m "Deploy"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main

# create the gh-pages branch containing the site files
git checkout --orphan gh-pages
git add .
git commit -m "Deploy site"
git push -u origin gh-pages
```
Then in the repo **Settings → Pages → Branch** select `gh-pages` / root. Your site is at `https://<you>.github.io/<repo>/`.

### Option B — GitHub Actions (automatic, recommended)
Add `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .            # upload the whole static site
      - uses: actions/deploy-pages@v4
```
Settings → Pages → Source: **GitHub Actions**.

> Since asset URLs are relative, the site works at a sub-path like `https://<you>.github.io/<repo>/` without modification.

---

## 2. Netlify

1. Sign in at [netlify.com](https://netlify.com) → **Add new site → Import an existing project**.
2. Connect your Git repo and let Netlify detect it.
3. **Build settings** (leave defaults for a static site):
   - Build command: *(leave empty)*
   - Publish directory: `.`  (the repo root)
4. Deploy. Netlify auto-assigns a URL like `https://<name>.netlify.app`; add a custom domain in **Domain settings**.

### Alternative — drag & drop
Drag the `website` folder onto the Netlify dashboard — no Git needed.

---

## 3. Vercel

1. Sign in at [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import your Git repository.
3. **Framework Preset**: choose **Other** (static).
   - Build command: *(leave empty)*
   - Output directory: *(leave as default / `.`)*
4. Click **Deploy**. Vercel assigns `https://<project>.vercel.app`.

> Vercel auto-serves `index.html` as the entry point — no configuration required for this static site.

---

## 4. Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
2. Select the repo.
3. **Build configuration:**
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`  (root — or leave the default)
4. **Save and Deploy.** URL: `https://<project>.pages.dev`.

### Direct upload alternative
Use **Direct Upload** in Cloudflare Pages and drag the `website` folder.

---

## 5. Other Options

| Host | How |
| --- | --- |
| Any web server (Apache/Nginx) | Copy the folder into the web root. |
| S3 / CloudFront / object storage | Upload the folder; enable static website hosting. |
| `surge.sh` | `npx surge .` |
| Firebase Hosting | `firebase init hosting` → point `public` at the folder → `firebase deploy`. |

---

## 6. Post-Deploy Checks

- [ ] Load the root URL — the intro + hero should play once per session.
- [ ] Navigate to all 4 pages (`index`, `events`, `teams`, `testimonials`) and back.
- [ ] Test the events timeline filters/search and lightbox.
- [ ] Confirm relative asset paths resolve (no `file://` or absolute path breakage).
- [ ] Verify the Google Fonts / GSAP / Lottie CDNs are reachable from the deployed domain (CSP/permissions), or self-host them (see `docs/IMPROVEMENTS.md`).
