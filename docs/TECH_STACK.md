# Tech Stack — NSS TSEC Mumbai Website

Every language, library, tool, and CDN resource used in the project, with evidence (file + line reference). All references were verified against the actual source files.

---

## 1. Languages

| Language | Where | Evidence |
| --- | --- | --- |
| **HTML5** (semantic tags, `<header>`, `<section>`, `<footer>`, `<main>`, inline SVG) | all pages | `index.html:35` (`<header>`), `index.html:58` (`<section>`), `index.html:94` (inline SVG), `index.html:434` (`<footer>`) |
| **CSS3** (custom properties, `@media`, flexbox, grid, `backdrop-filter`, `clip-path`, `@keyframes`, `clamp()`) | all stylesheets | `style.css:6` (`:root` vars), `style.css:202` (`@media`), `style.css:47` (`@keyframes shine`) |
| **Vanilla JavaScript** (ES6+: `const/let`, arrow functions, template literals, `async/await`, `Map`, IIFEs, `'use strict'`) | all scripts | `script.js:6`, `events-timeline.js:109`, `intro.js:7`, `events-calendar.js:5` |

---

## 2. External Libraries (CDN)

### 2.1 GSAP — GreenSock Animation Platform (v3.12.2)
Loaded from cdnjs on three pages.

| Script | Evidence |
| --- | --- |
| `gsap.min.js` | `index.html:501`, `teams.html:689`, `testimonials.html:233` |
| `ScrollTrigger.min.js` | `index.html:502`, `teams.html:690`, `testimonials.html:234` |
| `ScrollToPlugin.min.js` | `index.html:503`, `teams.html:691`, `testimonials.html:235` |

Usage:
- Plugin registration: `script.js:8` (`gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)`), `testimonials.js:8`.
- Timeline animations: `script.js:177` (`gsap.timeline`), `script.js:148` (`gsap.to(window, { scrollTo })`).
- ScrollTrigger triggers: `script.js:179-183`, `testimonials.js:31`.
- Marquee tween: `script.js:338`.

> Note: `events.html` does **not** load GSAP; its interactivity is pure CSS/vanilla JS.

### 2.2 Lottie Player (v2.0.8) + Lottie JSON assets
Loaded from unpkg: `index.html:26`
```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
```
Three `<lottie-player>` elements on the homepage, each loading a remote JSON:
| Accent | JSON URL | Evidence |
| --- | --- | --- |
| Heart/Community (About) | `https://assets3.lottiefiles.com/packages/lf20_s2lryxtd.json` | `index.html:127-135` |
| Plant (Objectives) | `https://assets5.lottiefiles.com/packages/lf20_myejiggj.json` | `index.html:191-199` |
| Flag (Events) | `https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json` | `index.html:385-393` |

Styled as faint background accents by `.lottie-accent` in `style.css:1081`.

### 2.3 Google Fonts
Preconnected and loaded via `<link>` on every page. Families used across pages:

| Family | Used for | Evidence |
| --- | --- | --- |
| Montserrat (700, 800) | Headings | `style.css:27` (`--font-heading`) |
| Inter (400, 500, 600) | Body | `style.css:28` (`--font-body`) |
| Poppins (400, 500) | Body copy on light sections | `style.css:295` (`who-we-are-text`) |
| Playfair Display (700 italic) | Card titles | `style.css:417` (`card-title-hover`) |
| League Spartan (700) | Hero title | `hero.css:132` |
| Cormorant Garamond (600 italic) | Hero quote | `hero.css:150` |
| Great Vibes | Team hover words / testimonial quote | `style.css:701`, `testimonials.css:145` |

Link references: `index.html:15`, `events.html:15`, `teams.html:15`, `testimonials.html:15`.

### 2.4 Google Maps Embed
Homepage footer embed iframe: `index.html:471-480`, styled dark-mode with CSS filter (`style.css:1205`).

### 2.5 Placeholder images
`https://placehold.co/...` used for placeholder team member photos (`teams.html:95` etc.), some testimonials (`testimonials.html:113` etc.), and default event photos (`events-calendar.js:31`, `events-timeline.js:139`).

---

## 3. Design System (CSS variables)

Defined in `style.css:6-36`:
- Colors: `--nss-red`, `--nss-white`, `--bg-dark`, `--bg-card`, `--text-primary/secondary/muted`.
- Spacing (8px grid): `--s-1`…`--s-12`.
- Typography: `--font-heading`, `--font-body`.
- Utilities: `--radius-sm/md/lg`, `--glass`, `--transition-smooth`.

---

## 4. No Build Tooling

There is **no** `package.json`, `node_modules`, bundler (webpack/Vite), transpiler (Babel/TypeScript), CSS preprocessor (Sass/LESS), or task runner. The project is fully self-contained static files that run directly in the browser.

---

## 5. Asset Inventory (by type)

| Type | Count | Location |
| --- | --- | --- |
| HTML | 4 | root |
| CSS | 8 | root |
| JS | 7 | root |
| Markdown | 2 (+8 generated in `docs/`) | root, `docs/` |
| PNG images | 14 | `assets/**` |
| JPG / JPEG images | 37 | `assets/**` |
| Fonts (local) | 0 | — (all via Google Fonts CDN) |
| Video / audio | 0 | — |
| JSON (local data) | 58 | `data/` (single source of truth, edited via the CMS admin) |
