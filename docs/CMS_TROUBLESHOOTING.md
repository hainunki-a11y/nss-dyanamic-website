# NSS Website — CMS Troubleshooting

Common issues when using the content admin, with fixes.

---

## 1. I can't log in to the admin

- **You are not a repo contributor.** The owner must add your GitHub account with **write** access to the repo (GitHub → Settings → Collaborators). See `docs/ADMIN_SETUP.md`.
- **Wrong URL.** Make sure you're at `https://nss-website-pink.vercel.app/admin/`.
- **Browser blocked the popup.** Allow popups for the site and try again.
- **OAuth app misconfigured.** The tech lead should check the OAuth callback URL matches the site (see `ADMIN_SETUP.md` §4, Option B).

## 2. I saved a change but the live site still shows the old content

- **Wait ~1 minute.** The site rebuilds after you save; changes are not instant.
- **The deploy may have failed.** Check the Vercel dashboard for a failed build (often a broken JSON file — see #4).
- **Hard refresh your browser** (Ctrl/Cmd+Shift+R) to clear the cached page.

## 3. The admin says "Not Authorized" or shows an error on save

- Your GitHub token may have expired or been revoked. Sign out and sign back in.
- You may have lost write access. Ask the owner to re-invite you.
- Check you're on the correct branch (`main`).

## 4. I saved and now the site is broken / shows an error

- This usually means a **JSON file is invalid** (e.g. missing a comma, a required field empty, or a bad date format). This is why we have validation.
- **Fix it:** open the file in the admin and correct the field, then save again.
- **Roll back (safest):** ask the tech lead to **revert the last commit** in GitHub. This restores the previous working version and triggers a redeploy.

## 5. My image didn't upload

- Check the file type is allowed: `jpg`, `jpeg`, `png`, `webp`, `gif`.
- Keep it under the size limit (~5 MB). Very large images fail to upload and slow the site.
- Ensure you have write access (see #1).

## 6. I deleted something by mistake

- Content is **versioned in Git** — nothing is permanently lost.
- Ask the tech lead to **revert the commit** that deleted it (see `ADMIN_SETUP.md` §6, rollback).

## 7. The site shows old images / missing images after a change

- If an image was removed or the path changed, the page may show a placeholder. Check the **photo/image** field in the admin points to a valid file.
- Hard refresh the browser.

## 8. GitHub rate limit errors

The CMS edits content through the **GitHub API**, which enforces rate limits. Knowing how
these work helps you avoid and resolve "rate limit" errors.

- **Authenticated vs anonymous:** the biggest factor is whether you are signed in.
  - **Signed in (with a fine-grained token or OAuth)** — you get a **much higher** hourly
    limit (5,000 requests/hour per token) — plenty for normal editing. **Always sign in**; the
    admin works at its best when you are authenticated.
  - **Not signed in (anonymous reads)** — the limit is far lower (60 requests/hour per IP),
    so browsing the admin or refreshing a lot without signing in can quickly hit the wall.
- **Per-IP vs per-token:** anonymous limits are shared per IP (e.g. a whole campus on the same
  network shares 60/hour). A signed-in token's limit is per token, so each editor's activity is
  counted separately.
- **What a rate-limit error looks like:** Sveltia will show an error such as
  `API rate limit exceeded`, or a `403` response with `rate limit` / `X-RateLimit-Remaining: 0`
  in the details.
- **What to do:**
  1. **Sign in** (token or OAuth) and retry — this immediately raises your limit.
  2. **Wait a few minutes** and retry — the window resets hourly.
  3. **Work in smaller batches** — save a few entries, then pause, instead of saving many at once.
  4. Avoid hammering the admin with rapid refreshes.
- **Where the limit applies:** it affects **reads** (opening entries, previews, the content list)
  and **writes** (saving/publishing). A burst of saves can consume several requests.
- **Tip for the tech lead:** if editors report frequent limit errors, confirm they are signing in
  (authenticated usage is rarely a problem at this scale — see `docs/CMS_SOLUTION_REPORT.md` §5.11).

## 9. Where do I check the deploy status?

- **Vercel dashboard** → your project → **Deployments** tab. Green = success; red = failed (click for the error log).

---

## Still stuck?

- Ask the **tech lead / owner** — they can check GitHub history, revert changes, and inspect Vercel logs.
- See `docs/ADMIN_GUIDE.md` (for editors) and `docs/ADMIN_SETUP.md` (for the tech lead).
