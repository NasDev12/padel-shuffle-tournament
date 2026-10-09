# Padel Shuffle

Static site (HTML + CSS + JS) with a free Supabase database. No build step.

```
index.html              page shell
css/style.css           styles
js/app.js               app logic + database + admin login (Google, Apple, email link)
js/config.js            <- paste your Supabase URL + anon key here
js/seed.js              demo data (used only when Supabase is not configured)
assets/logo.jpg
supabase/1-admins.sql   <- list of admin emails
supabase/2-schema.sql   tables + security rules
supabase/3-seed.sql     current players and tournaments
```

## 1. Database (supabase.com, free)
1. Create a project at **supabase.com**.
2. **SQL Editor**: run `supabase/1-admins.sql`, then `2-schema.sql`, then `3-seed.sql` (paste, Run).
3. **Project Settings -> API**: copy the *Project URL* and the *anon / publishable* key into `js/config.js`.

## 2. Admins
Current admins: `padelshuffle@gmail.com`, `nassermh.alharthy@gmail.com`.
To add/remove one: edit `supabase/1-admins.sql`, paste it into the SQL Editor and **Run** again (editing the file alone changes nothing).
Emails must be lowercase.

## 3. Login setup (Supabase -> Authentication)
- **URL Configuration**: set *Site URL* to your live address and add it to *Redirect URLs*
  (for GitHub Pages: `https://USERNAME.github.io/REPO/`). Missing this is the #1 cause of broken login.
- **Email link**: works out of the box.
- **Google**: Google Cloud Console -> APIs & Services -> Credentials -> OAuth client ID (Web).
  Add `https://YOUR-PROJECT.supabase.co/auth/v1/callback` as an authorized redirect URI.
  Then Supabase -> Providers -> Google: enable and paste Client ID + Secret.
- **Apple** (needs a paid Apple Developer account): create a Services ID + key, then Supabase -> Providers -> Apple.
  The admin must choose "Share My Email" (not "Hide My Email") or the email won't match the admin list.

## 4. Publish with GitHub Pages (free)
1. Push this folder to a GitHub repo.
2. Repo **Settings -> Pages** -> Source: *Deploy from a branch* -> `main` / `(root)` -> Save.
3. Your site appears at `https://USERNAME.github.io/REPO/`. Use that URL in the Supabase URL Configuration above.
(Netlify, Cloudflare Pages and Vercel also work.) Test locally with `npx serve .`

## Using the site as admin
- Click **Admin login** (top right) and sign in with an approved email. Non-admin emails are signed out immediately.
- **Tournaments tab**: enter name, type and date, press **Create**. Press **Edit**, add players, type each finishing place
  (points fill in automatically, editable), then **Done** to save. **Delete** -> **Confirm delete** removes one.
- **Leaderboard tab**: **Add player** in the Admin box; **+ / −** next to a player adjusts points by 1 (saved as "Manual adjustments").
- Points: Tournament places 1-8 = 10, 8, 6, 4, 2, 2, 1, 1. Americano/Mexicano = 5, 4, 3, 2, 1, 1, 0, 0.
- Visitors see everything read-only and updates appear live.

## Notes
- The anon key is meant to be public; security comes from the rules in `2-schema.sql` (anyone reads, only admins write).
  Never put the `service_role` key in this project.
- Supabase free projects pause after about a week of inactivity: open the dashboard and click Restore.
- Without keys in `config.js` the site runs in demo mode with sample data and nothing is saved.
