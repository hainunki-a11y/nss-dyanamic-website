# File Structure — NSS TSEC Mumbai Website

Full recursive listing of the project with descriptions. Asset image sizes are in KB.

```text
D:\NSS\website\
│
├── index.html              # HOMEPAGE (22.6 KB)
│   └── Hero slider · Who We Are (About NSS) · Objectives · Our Events ·
│       NSS Magazine (hidden) · Footer with map · Lottie accents
│
├── events.html             # EVENTS PAGE (7.3 KB)
│   └── Timeline hero · Academic year tabs · Filter bar (search + chips) ·
│       Timeline (JS-injected) · "All Events" table · Lightbox modal · Footer
│
├── teams.html              # TEAMS PAGE (26.2 KB)
│   └── Faculty advisors · Five-frame faculty grid · NSS Leadership row ·
│       Council marquee slideshow · Core Committee table · Footer
│
├── testimonials.html       # TESTIMONIALS PAGE (12 KB)
│   └── Hero · Testimonial cards grid · Footer · Modal popup container
│
│
├── style.css               # (24.1 KB) GLOBAL DESIGN SYSTEM
│   └── CSS variables (colors, spacing 8px grid, typography) · reset ·
│       navbar · who-we-are · objectives · events · teams · council/marquee ·
│       core-committee table · footer + map · Lottie accents
│
├── hero.css                # (3.0 KB) Hero slider: slides, Ken Burns, controls, dots
├── intro.css               # (3.0 KB) First-load cinematic intro overlay
├── preloader.css           # (3.6 KB) Preloader + offline screen
├── magazine.css            # (12.2 KB) Magazine covers + fullscreen 3D book viewer
├── events-calendar.css     # (8.8 KB) Home events tabs + calendar widget
├── events-timeline.css     # (18.1 KB) Timeline strip, filter bar, table, lightbox
├── testimonials.css        # (9.0 KB) Testimonial grid + modal
│
│
├── script.js               # (9.3 KB) GLOBAL JS — GSAP init, hero slider, navbar,
│   │                       #   smooth scroll, letter-split titles, section animations,
│   │                       #   council marquee, divider reveal
├── intro.js                # (4.5 KB) Homepage-only, once-per-session intro sequence
├── preloader.js            # (2.7 KB) Preloader + offline detection (all pages)
├── events-timeline.js      # (21.6 KB) Event dataset + timeline/filter/table/lightbox render
├── events-calendar.js      # (15.6 KB) Homepage calendar widget + archive events
├── magazine.js             # (13.0 KB) 3D magazine viewer (flip/drag/keyboard/touch)
├── testimonials.js         # (3.1 KB) Testimonial modal + GSAP animations
│
│
├── README.md               # Original hand-written README (2.7 KB) — not modified
├── README.generated.md     # THIS generated documentation
│
├── docs/                   # Generated documentation suite
│   ├── ARCHITECTURE.md
│   ├── FILE_STRUCTURE.md
│   ├── TECH_STACK.md
│   ├── EVENT_SYSTEM.md
│   ├── MAGAZINE_VIEWER.md
│   ├── TEAMS_AND_TESTIMONIALS.md
│   ├── IMPROVEMENTS.md
│   └── DEPLOYMENT.md
│
└── assets/
    ├── nss_logo.png                       (155.1 KB) Site logo
    │
    ├── Events/                            (24 event photos, JPEG/JPG)
    │   ├── 150 years grand vande mataram.jpeg   (299.9 KB)
    │   ├── Anti plastic rally.jpeg              (312.7 KB)
    │   ├── BEach cleaning drive.jpeg            (268.1 KB)
    │   ├── beach-cleaning.jpeg                 (352.3 KB)
    │   ├── Ganapati day 5.jpeg                 (342.8 KB)
    │   ├── Ganpati Visarjan day 7.jpeg         (301.6 KB)
    │   ├── ganpati vishrajan.jpg               (2935.7 KB)
    │   ├── health-checkup.jpg                  (2360.6 KB)
    │   ├── Independence day.jpeg               (292.8 KB)
    │   ├── independence day.jpg                (2653.4 KB)
    │   ├── international-yoga day.jpg          (2924.9 KB)
    │   ├── kanheri caves.jpg                   (2955.6 KB)
    │   ├── Kargil Diwas.jpg                    (3143.5 KB)
    │   ├── Karuna 2026.jpg                     (4186.9 KB)
    │   ├── karuna.jpg                          (2660.2 KB)
    │   ├── nasha-mukti.jpg                     (1730.3 KB)
    │   ├── NSS Day.jpeg                        (298.5 KB)
    │   ├── nss-orientation.jpg                 (2071.6 KB)
    │   ├── patrotic Rally.jpeg                 (391.5 KB)
    │   ├── Rallies.jpeg                        (374.4 KB)
    │   ├── sgnp awareness.jpg                  (3749.6 KB)
    │   ├── traffic management ganpati vishrajan.jpg (1902.3 KB)
    │   ├── tree plantation.jpg                 (3663.2 KB)
    │   └── Unity Day.jpeg                      (214.4 KB)
    │
    ├── Our Events/                          (7 PNG gallery images)
    │   ├── Awareness rallies.png            (651.1 KB)
    │   ├── beach cleaning.png               (608.0 KB)
    │   ├── ekta diwas.png                   (659.0 KB)
    │   ├── ganapati visarjan.png            (610.7 KB)
    │   ├── independence day.png             (391.1 KB)
    │   ├── international yoga day.png       (618.1 KB)
    │   └── NSS day.png                      (436.9 KB)
    │
    ├── photos/                              (9 images)
    │   ├── dhrupesh savadiya.png.jpeg       (89.8 KB)  team/photo
    │   ├── hero_1.jpg                       (209.0 KB)  hero slide + magazine + objectives
    │   ├── hero_2.jpg                       (185.8 KB)  hero slide + objectives + magazine
    │   ├── hero_3.png                       (11634.2 KB) hero slide + objectives + magazine
    │   ├── hero_4.jpg                       (142.3 KB)  hero slide + objectives + magazine
    │   ├── hero_5.jpg                       (2643.2 KB) hero slide
    │   ├── mangesh more.png.jpeg            (19.5 KB)   team/photo
    │   ├── po.png.png                       (303.5 KB)  Programme Officer (teams.html)
    │   └── pricipal.png.png                 (329.0 KB)  Principal (teams.html)
    │
    ├── screenshots/                         (7 README walkthrough images)
    │   ├── about.png · events.png · hero.png · magazine.png
    │   ├── objectives.png · teams.png · testimonials.png
    │
    └── testimonials/                        (3 volunteer portraits)
        ├── Aryan.png                        (2142.2 KB)
        ├── Nitin.png                        (1601.3 KB)
        └── tirtha.png                       (1948.3 KB)
```

---

## Notes on Asset Usage

- **`assets/Events/`** — used by `events-timeline.js` (via `photo:` fields) and partially by `events-calendar.js`. The homepage `index.html` hardcodes a subset of these in its event-card grid.
- **`assets/Our Events/`** — a set of PNG images; **not referenced** by any HTML/JS in the current code. [Assumption: legacy/alternate event gallery or prepared for future use.]
- **`assets/photos/hero_*.jpg|png`** — reused across hero slider, objectives cards, and magazine pages.
- **`assets/photos/po.png.png`** and **`pricipal.png.png`** — used in `teams.html` for the Programme Officer and Principal cards. (Note the doubled file extensions.)
- **`assets/screenshots/`** — referenced only by the original `README.md` visual walkthrough.
- **`assets/testimonials/`** — used by the first three testimonial cards in `testimonials.html`; the remaining cards use `https://placehold.co/...` placeholders.

---

## Missing / Notably Absent Files

| Path | Present? | Note |
| --- | --- | --- |
| `package.json` | No | No Node/build tooling |
| `LICENSE` | No | License undefined |
| `.gitignore` | No | — |
| CI/CD configs (`.github/workflows`, `netlify.toml`, `vercel.json`) | No | Deploy manually |
| Tests | No | None |
| `CNAME` (GitHub Pages custom domain) | No | — |
