# NSS Website Admin Guide (for editors)

This guide explains, in plain English, how the **team** can add or update content on the NSS website — **without touching any code**.

> If you are the technical person setting this up for the first time, use **`ADMIN_SETUP.md`** instead. This guide is for everyday editors.

---

## 1. The big picture (read this first)

Think of the website as a **shop window**, and the admin page as the **back office**.

| Thing | What it is |
|---|---|
| **The website** | What visitors see (your normal pages). |
| **The admin page** | A private webpage only the team can open. You edit here. |
| **GitHub storage box** | A safe filing cabinet where all content is kept. Every change is recorded here so you can always undo. |

When you **save** a change in the admin:
1. The change is stored safely (in GitHub).
2. The website **rebuilds itself automatically** (this takes about a minute).
3. Visitors then see the updated content.

**Important:** changes are **not instant** — allow about a minute for them to appear.

---

## 2. Logging in

1. Open the admin page at: **`https://nss-website-pink.vercel.app/admin/`**
2. Click **"Sign in with GitHub"**.
3. You will be asked to authorize the app — click **Authorize**.
4. You are now in the admin.

> **Only invited team members can get in.** If you can't log in, the owner needs to add you as a **repo contributor** on GitHub (see `ADMIN_SETUP.md`).

---

## 3. What you can edit

The admin menu shows one section per content type:

- **Site Config** — hero title/quote, the "About NSS" text, objectives intro, and contact info (email, phone numbers, address, map).
- **Hero Slides** — the big images that slide on the homepage.
- **Objectives** — the 4 cards under "Our Objectives".
- **Events** — split by academic year (2025-26, 2026-27). This is where you add/update event photos and names.
- **Category Icons** — the little emoji used for each event category.
- **Magazine** — the pages of the magazine viewer.
- **Team Members** — faculty, leadership, council, and the committee table.
- **Testimonials** — the volunteer story cards.

---

## 4. Editing content (step by step)

### Add a new event
1. Go to **Events** → choose the correct academic year folder.
2. Click **New entry** (or "Add").
3. Fill in the form:
   - **Title** — event name (e.g. "Tree Plantation Drive").
   - **Date** — pick it (format: e.g. `21 Jun 2026`).
   - **Category / Tag** — choose from the list (Environment, Health Drive, etc.).
   - **Venue** *(optional)* — where it happened.
   - **Photo** — drag & drop an image file here.
   - **Order** — a number controlling where it appears.
4. Click **Save**.

### Add a new team member
1. Go to **Team Members**.
2. Click **New entry**.
3. Fill in **Name**, **Role** (e.g. "Youth President"), choose the **Section** (faculty / leadership / council / committee), **upload a photo**, and optionally add a **quote**.
4. Click **Save**.

### Add a new testimonial
1. Go to **Testimonials**.
2. Click **New entry**.
3. Fill in **Name**, **Role** (e.g. "Volunteer"), **Year/Batch**, the **Thought** (the quote), and **upload an avatar photo**.
4. Click **Save**.

### Edit or delete existing content
- **Edit:** click the entry in the list, change the fields, click **Save**.
- **Delete:** open the entry and use the **Delete** button (there is usually a confirmation).

### Upload an image
- In any **photo/avatar/image** field, click the upload button or **drag & drop** the image into the box.
- Allowed types: `jpg`, `jpeg`, `png`, `webp`, `gif`.
- Keep images reasonably sized (ideally under ~5 MB) so the site stays fast.

---

## 5. Preview before saving

Most editor screens include a **Preview** pane that shows roughly how the change will look. Use it to double-check before you save.

---

## 6. Saving and publishing

- Click **Save** (or **Publish**).
- There is **no draft/review step** — saving publishes immediately to the live site.
- Wait about **one minute** for the site to rebuild, then check the live site to confirm.

---

## 7. Undoing a mistake (rollback)

Every save is recorded in the **GitHub history**. If you (or someone else) make a mistake:

1. Ask the **owner / tech lead** (they have access to GitHub).
2. They can **revert** the last change — like "undo".
3. The website rebuilds and the previous version is restored.

You can safely experiment — nothing is lost, and everything can be undone.

---

## 8. What NOT to do

- **Do not** try to edit the website files directly in a code editor unless you're technical.
- **Do not** log in to the admin with your personal GitHub account if you're not an invited contributor.
- **Do not** upload huge images (over ~5 MB) — keep the site fast.
- **Do not** delete content you're unsure about — ask the owner first (though it can be reverted).

---

## 9. Still stuck?

- Check the **live site** is showing what you expect.
- Ask the owner / tech lead — they can check the GitHub history and restore anything.
- See `docs/CMS_TROUBLESHOOTING.md` for common problems.
