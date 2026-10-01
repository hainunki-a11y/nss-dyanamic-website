# NSS Website — CMS Troubleshooting

Common issues when using the content admin, with fixes.

---

## 1. I can't log in to the admin

- **You are not a repo contributor.** The owner must add your GitHub account with **write** access to the repo (GitHub → Settings → Collaborators). See `docs/ADMIN_SETUP.md`.
- **Wrong URL.** Make sure you're at `https://nss-website-pink.vercel.app/admin/`.
- **Browser blocked the popup.** Allow popups for the site and try again.
- **OAuth app misconfigured.** The tech lead should check the OAuth callback URL matches the site (see `ADMIN_SETUP.md` §3.4).

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
- Ask the tech lead to **revert the commit** that deleted it (see `ADMIN_SETUP.md` §4, rollback).

## 7. The site shows old images / missing images after a change

- If an image was removed or the path changed, the page may show a placeholder. Check the **photo/image** field in the admin points to a valid file.
- Hard refresh the browser.

## 8. GitHub rate limit errors

- Authenticated (signed-in) usage has generous limits. If you see rate-limit errors, wait a few minutes and retry, or have editors work in smaller batches.

## 9. Where do I check the deploy status?

- **Vercel dashboard** → your project → **Deployments** tab. Green = success; red = failed (click for the error log).

---

## Still stuck?

- Ask the **tech lead / owner** — they can check GitHub history, revert changes, and inspect Vercel logs.
- See `docs/ADMIN_GUIDE.md` (for editors) and `docs/ADMIN_SETUP.md` (for the tech lead).
