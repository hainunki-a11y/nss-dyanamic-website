#!/usr/bin/env node
/*
  NSS TSEC — Data validation script (scripts/validate-data.js)

  Validates every JSON file under /data against the rules in
  docs/DATA_SCHEMA.md §9:
    - every JSON file parses
    - event `date` is in `DD Mon YYYY` format and is parseable
    - `photo` / `image` / `avatar` point to an existing file in the repo
      (external URLs like placehold.co are skipped)
    - `order` is a positive integer
    - all `title` / `name` fields are required and non-empty
    - `email` is a valid email format

  Usage:  node scripts/validate-data.js
  Exits 0 on success, 1 on any failure.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

let errors = [];
let checked = 0;

function fail(file, msg) {
  errors.push(`${file}: ${msg}`);
}

function readJSON(file) {
  const abs = path.join(DATA_DIR, file);
  if (!fs.existsSync(abs)) {
    fail(file, 'file does not exist');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (e) {
    fail(file, 'invalid JSON: ' + e.message);
    return null;
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function validDate(str) {
  if (typeof str !== 'string') return false;
  const m = /^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/.exec(str);
  if (!m) return false;
  const day = parseInt(m[1], 10);
  const month = MONTHS.indexOf(m[2]);
  const year = parseInt(m[3], 10);
  const d = new Date(Date.UTC(year, month, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month &&
    d.getUTCDate() === day &&
    day >= 1 && day <= 31
  );
}

function isExternalUrl(p) {
  return /^(https?:|data:|blob:)/i.test(String(p));
}

function fileExists(p) {
  if (typeof p !== 'string' || !p) return false;
  if (isExternalUrl(p)) return true; // external URLs are not repo files
  const abs = path.join(ROOT, p);
  // Normalize and ensure it stays inside the repo
  if (!abs.startsWith(ROOT)) return false;
  try {
    return fs.existsSync(abs);
  } catch (e) {
    return false;
  }
}

function validOrder(v) {
  return Number.isInteger(v) && v > 0;
}

function requiredText(obj, key) {
  return typeof obj[key] === 'string' && obj[key].trim().length > 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ────────────────────────────────────────────────
   site.json
   ──────────────────────────────────────────────── */
function validateSite(file, d) {
  if (!d) return;
  checked++;
  if (!d.hero || !requiredText(d.hero, 'title')) fail(file, 'hero.title is required');
  if (!d.hero || !requiredText(d.hero, 'quote')) fail(file, 'hero.quote is required');

  if (!d.about || !requiredText(d.about, 'title')) fail(file, 'about.title is required');
  if (d.about && (!Array.isArray(d.about.paragraphs) || d.about.paragraphs.length === 0)) {
    fail(file, 'about.paragraphs must be a non-empty array');
  }

  if (!d.objectives || !requiredText(d.objectives, 'title')) fail(file, 'objectives.title is required');
  if (d.objectives && !requiredText(d.objectives, 'intro')) fail(file, 'objectives.intro is required');

  if (!d.contact) { fail(file, 'contact is required'); return; }
  if (d.contact.email && !EMAIL_RE.test(d.contact.email)) fail(file, 'contact.email is not a valid email');
  if (!Array.isArray(d.contact.phoneLines) || d.contact.phoneLines.length === 0) {
    fail(file, 'contact.phoneLines must be a non-empty array');
  } else {
    d.contact.phoneLines.forEach((p, i) => {
      if (!requiredText(p, 'label')) fail(file, `contact.phoneLines[${i}].label is required`);
      if (!requiredText(p, 'phone')) fail(file, `contact.phoneLines[${i}].phone is required`);
    });
  }
  if (!d.contact.mapLink) fail(file, 'contact.mapLink is required');
  if (!requiredText(d.contact, 'copyright')) fail(file, 'contact.copyright is required');

  if (!d.introText || !requiredText(d.introText, 'line1')) fail(file, 'introText.line1 is required');
  if (!d.introText || !requiredText(d.introText, 'line2')) fail(file, 'introText.line2 is required');
}

/* ────────────────────────────────────────────────
   hero-slides.json
   ──────────────────────────────────────────────── */
function validateHeroSlides(file, d) {
  if (!d) return;
  checked++;
  if (!Array.isArray(d.slides) || d.slides.length === 0) {
    fail(file, 'slides must be a non-empty array');
    return;
  }
  d.slides.forEach((s, i) => {
    if (!s.image) fail(file, `slides[${i}].image is required`);
    else if (!fileExists(s.image)) fail(file, `slides[${i}].image not found: ${s.image}`);
    if (!validOrder(s.order)) fail(file, `slides[${i}].order must be a positive integer`);
  });
}

/* ────────────────────────────────────────────────
   objectives.json
   ──────────────────────────────────────────────── */
function validateObjectives(file, d) {
  if (!d) return;
  checked++;
  if (!Array.isArray(d.items) || d.items.length === 0) {
    fail(file, 'items must be a non-empty array');
    return;
  }
  d.items.forEach((o, i) => {
    if (!requiredText(o, 'title')) fail(file, `items[${i}].title is required`);
    if (!o.image) fail(file, `items[${i}].image is required`);
    else if (!fileExists(o.image)) fail(file, `items[${i}].image not found: ${o.image}`);
    if (!validOrder(o.order)) fail(file, `items[${i}].order must be a positive integer`);
  });
}

/* ────────────────────────────────────────────────
   category-icons.json
   ──────────────────────────────────────────────── */
function validateCategoryIcons(file, d) {
  if (!d) return;
  checked++;
  if (!d.icons || typeof d.icons !== 'object' || Object.keys(d.icons).length === 0) {
    fail(file, 'icons must be a non-empty object map');
  }
}

/* ────────────────────────────────────────────────
   magazine.json
   ──────────────────────────────────────────────── */
function validateMagazine(file, d) {
  if (!d) return;
  checked++;
  if (d.cover) {
    if (!d.cover.image) fail(file, 'cover.image is required');
    else if (!fileExists(d.cover.image)) fail(file, `cover.image not found: ${d.cover.image}`);
    if (!d.cover.logo) fail(file, 'cover.logo is required');
    else if (!fileExists(d.cover.logo)) fail(file, `cover.logo not found: ${d.cover.logo}`);
    if (!requiredText(d.cover, 'title')) fail(file, 'cover.title is required');
  } else {
    fail(file, 'cover is required');
  }
  if (!Array.isArray(d.pages) || d.pages.length === 0) {
    fail(file, 'pages must be a non-empty array');
    return;
  }
  d.pages.forEach((p, i) => {
    ['front', 'back'].forEach(side => {
      const s = p[side];
      if (!s) { fail(file, `pages[${i}].${side} is required`); return; }
      if (!s.image) fail(file, `pages[${i}].${side}.image is required`);
      else if (!fileExists(s.image)) fail(file, `pages[${i}].${side}.image not found: ${s.image}`);
      if (!requiredText(s, 'title')) fail(file, `pages[${i}].${side}.title is required`);
    });
    if (!validOrder(p.order)) fail(file, `pages[${i}].order must be a positive integer`);
  });
}

/* ────────────────────────────────────────────────
   team-members.json
   ──────────────────────────────────────────────── */
function validateTeamMembers(file, d) {
  if (!d) return;
  checked++;
  const sections = d.sections;
  if (!sections) { fail(file, 'sections is required'); return; }

  ['faculty', 'leadership', 'council'].forEach(sec => {
    if (!Array.isArray(sections[sec])) {
      fail(file, `sections.${sec} must be an array`);
      return;
    }
    sections[sec].forEach((m, i) => {
      if (!requiredText(m, 'name')) fail(file, `sections.${sec}[${i}].name is required`);
      if (!requiredText(m, 'role')) fail(file, `sections.${sec}[${i}].role is required`);
      if (!m.photo) fail(file, `sections.${sec}[${i}].photo is required`);
      else if (!fileExists(m.photo)) fail(file, `sections.${sec}[${i}].photo not found: ${m.photo}`);
      if (!validOrder(m.order)) fail(file, `sections.${sec}[${i}].order must be a positive integer`);
    });
  });

  if (!Array.isArray(sections.committee)) {
    fail(file, 'sections.committee must be an array');
    return;
  }
  sections.committee.forEach((m, i) => {
    if (!requiredText(m, 'name')) fail(file, `sections.committee[${i}].name is required`);
    if (!requiredText(m, 'designation')) fail(file, `sections.committee[${i}].designation is required`);
  });
}

/* ────────────────────────────────────────────────
   testimonials.json
   ──────────────────────────────────────────────── */
function validateTestimonials(file, d) {
  if (!d) return;
  checked++;
  if (!Array.isArray(d.items) || d.items.length === 0) {
    fail(file, 'items must be a non-empty array');
    return;
  }
  d.items.forEach((t, i) => {
    if (!requiredText(t, 'name')) fail(file, `items[${i}].name is required`);
    if (!requiredText(t, 'thought')) fail(file, `items[${i}].thought is required`);
    if (!t.avatar) fail(file, `items[${i}].avatar is required`);
    else if (!fileExists(t.avatar)) fail(file, `items[${i}].avatar not found: ${t.avatar}`);
    if (!validOrder(t.order)) fail(file, `items[${i}].order must be a positive integer`);
  });
}

/* ────────────────────────────────────────────────
   events/<year>/*.json
   ──────────────────────────────────────────────── */
function validateEvent(file, d) {
  if (!d) return;
  checked++;
  if (!requiredText(d, 'title')) fail(file, 'title is required');
  if (!d.date) fail(file, 'date is required');
  else if (!validDate(d.date)) fail(file, `date is not valid DD Mon YYYY: "${d.date}"`);
  if (!requiredText(d, 'tag')) fail(file, 'tag is required');
  if (!d.photo) fail(file, 'photo is required');
  else if (!fileExists(d.photo)) fail(file, `photo not found: ${d.photo}`);
  if (!validOrder(d.order)) fail(file, 'order must be a positive integer');
}

/* ────────────────────────────────────────────────
   Main runner
   ──────────────────────────────────────────────── */
function listJson(dir) {
  const abs = path.join(DATA_DIR, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter(f => f.endsWith('.json')).sort();
}

function run() {
  validateSite('site.json', readJSON('site.json'));
  validateHeroSlides('hero-slides.json', readJSON('hero-slides.json'));
  validateObjectives('objectives.json', readJSON('objectives.json'));
  validateCategoryIcons('category-icons.json', readJSON('category-icons.json'));
  validateMagazine('magazine.json', readJSON('magazine.json'));
  validateTeamMembers('team-members.json', readJSON('team-members.json'));
  validateTestimonials('testimonials.json', readJSON('testimonials.json'));

  // Events by academic year
  const years = ['2025-26', '2026-27'];
  years.forEach(year => {
    const files = listJson(path.join('events', year));
    if (files.length === 0) {
      fail(`events/${year}`, 'no JSON files found');
      return;
    }
    files.forEach(f => {
      const rel = path.join('events', year, f);
      validateEvent(rel, readJSON(rel));
    });
  });

  console.log(`\nValidated ${checked} JSON document(s).`);
  if (errors.length) {
    console.log(`\n${errors.length} validation error(s):`);
    errors.forEach(e => console.log('  ✗ ' + e));
    process.exit(1);
  } else {
    console.log('All data files pass validation.');
  }
}

run();
