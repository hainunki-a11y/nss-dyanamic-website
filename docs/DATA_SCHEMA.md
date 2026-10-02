# NSS Website — Data Schema Reference

All website content is stored as **JSON files** in the `data/` folder. These files are the single source of truth — the website reads them, and the admin (CMS) writes to them.

This document lists the exact structure of every content file. It is the reference for developers and for the CMS field configuration.

> Full design context: see `docs/CMS_SOLUTION_REPORT.md`.

---

## 1. `data/site.json` — Site Config (single file)

Global text: hero, about, objectives intro, contact, intro typewriter.

```json
{
  "hero": { "title": "TSEC-NSS UNIT", "quote": "NOT ME BUT YOU" },
  "about": {
    "title": "ABOUT NSS",
    "paragraphs": [
      "Paragraph one...",
      "Paragraph two..."
    ]
  },
  "objectives": { "title": "Our Objectives", "intro": "The focus is on enhancing..." },
  "contact": {
    "college": "TSEC",
    "address": "Mumbai, Kandivali East",
    "collegeUrl": "https://tsecmumbai.in/",
    "email": "nss@tsecmumbai.in",
    "phoneLines": [
      { "label": "Dr. Suresh Pathak (PO)", "phone": "9869525639" },
      { "label": "Bhavesh Chaudhary (Youth President)", "phone": "7756828367" }
    ],
    "mapEmbedUrl": "https://www.google.com/maps/embed?...",
    "mapLink": "https://maps.app.goo.gl/1cJSEkku6nCB3DFB7",
    "copyright": "2026 NSS TSEC Mumbai",
    "tagline": "Not Me, But You."
  },
  "introText": { "line1": "TSEC NSS UNIT", "line2": "MH09SB39" }
}
```

---

## 2. `data/hero-slides.json` — Hero Slides (single file, array)

```json
{
  "slides": [
    { "image": "assets/photos/hero_1.jpg", "alt": "Hero 1", "order": 1 },
    { "image": "assets/photos/hero_2.jpg", "alt": "Hero 2", "order": 2 }
  ]
}
```

---

## 3. `data/objectives.json` — Objectives (single file, array)

```json
{
  "items": [
    {
      "image": "assets/photos/hero_1.jpg",
      "title": "Community Understanding",
      "description": "Develop awareness about real-world community challenges",
      "order": 1
    }
  ]
}
```

---

## 4. `data/events/<year>/*.json` — Events (folder collection, one file per event)

Each event is its own JSON file inside the academic-year folder (`2025-26`, `2026-27`).

```json
{
  "title": "Beach Cleaning Gorai",
  "date": "27 Sep 2026",
  "tag": "Environment",
  "venue": "Gorai",
  "photo": "assets/Events/beach-cleaning.jpeg",
  "order": 1
}
```

- `date` must be in **`DD Mon YYYY`** format (e.g. `15 Aug 2026`).
- `tag` should match a key in `category-icons.json` so it gets the right emoji.

> This replaces the old duplicated arrays (`NSS_EVENTS` / `NSS_EVENTS_2026_27` in `events-timeline.js` and `EVENTS_2025_26` in `events-calendar.js`).

---

## 5. `data/category-icons.json` — Category Icons (single file, map)

```json
{
  "icons": {
    "hackathon": "💻",
    "health drive": "❤️",
    "cultural event": "🎭",
    "awareness": "📢",
    "seminar": "🎓",
    "event series": "🗓️",
    "patriotic event": "🇮🇳",
    "sports": "🏅",
    "environment": "🌱",
    "rally": "📣",
    "ceremony": "🏆",
    "celebration": "🎉",
    "orientation": "🎯"
  }
}
```

---

## 6. `data/magazine.json` — Magazine (single file)

```json
{
  "cover": { "image": "assets/photos/hero_1.jpg", "logo": "assets/nss_logo.png", "title": "NSS MAGAZINE" },
  "foreword": "Welcome to the inaugural edition...",
  "pages": [
    {
      "front": { "image": "assets/photos/hero_2.jpg", "title": "Independence Day Rally", "description": "..." },
      "back": { "image": "assets/photos/hero_4.jpg", "title": "Blood Donation Camp", "description": "..." },
      "order": 1
    }
  ]
}
```

Replaces the `pagesData` array in `magazine.js`.

---

## 7. `data/team-members.json` — Team Members (single file, grouped by section)

```json
{
  "sections": {
    "faculty": [
      { "name": "Dr. S.M. Ganechari.", "role": "Principal & Chief Advisor", "photo": "assets/photos/pricipal.png.png", "quote": "...", "order": 1 }
    ],
    "leadership": [
      { "name": "Bhavesh Chaudhary", "role": "Youth President", "photo": "...", "quote": "...", "order": 1 }
    ],
    "council": [
      { "name": "Devkar Susmita", "role": "PR & Team Lead", "photo": "...", "quote": "NSS TSEC", "order": 1 }
    ],
    "committee": [
      { "name": "Bhavesh Chaudhary", "designation": "NSS Leader", "order": 1 }
    ]
  }
}
```

The **core-committee table** is derived from `committee` (optionally merged with leadership/council names) so it is no longer hand-duplicated in `teams.html`.

---

## 8. `data/testimonials.json` — Testimonials (single file, array)

```json
{
  "items": [
    {
      "name": "Tirtha Pawar",
      "role": "Volunteer",
      "year": "Batch 2025-26",
      "thought": "My one year journey in NSS has been...",
      "avatar": "assets/testimonials/tirtha.png",
      "order": 1
    }
  ]
}
```

Replaces the hardcoded `.testimonial-card` blocks in `testimonials.html`.

---

## 9. Validation rules

- `date`: format `DD Mon YYYY`; must be parseable.
- `photo` / `image` / `avatar`: must point to an existing file in the repo.
- `order`: positive integer; controls display order.
- All `title` / `name` fields: required.
- `email`: must be a valid email format.

A validation script (`scripts/validate-data.js`) checks these rules against a JSON Schema before deploy.
