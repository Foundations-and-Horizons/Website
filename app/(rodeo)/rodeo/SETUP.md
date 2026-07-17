# Rodeo Road Log — setup (one-time)

The barrel-racing tracker lives at **`/rodeo`** on the site. It stores data in
your existing Supabase database and is protected by a single shared family
password, so it syncs across every phone that logs in.

There are just **two things** to do once, then deploy.

## 1. Create the database tables

Open your Supabase project (the same one the website already uses) →
**SQL Editor** → **New query** → paste the contents of
[`supabase/migrations/003_rodeo.sql`](../../../supabase/migrations/003_rodeo.sql)
→ **Run**.

That creates three tables (`rodeo_runs`, `rodeo_arenas`, `rodeo_stays`). They
have row-level security on with no public policies, so they can only be read or
written from the server — never from a browser with the public key.

## 2. Add the family password

In your hosting settings (Vercel → Project → **Settings → Environment
Variables**), add:

| Name             | Value                                  |
| ---------------- | -------------------------------------- |
| `RODEO_PASSWORD` | whatever password you want the family to type |

The app reuses two variables the site **already has** for the contact form, so
you normally don't need to touch them:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If for some reason those aren't set, add them too (find them in Supabase →
Project Settings → API → the **service_role** key; keep that key secret).

## 3. Deploy

Merge/redeploy so the new page ships. Then go to **`yoursite.com/rodeo`**, type
the family password, and start logging runs. Share the same URL + password with
whoever needs it.

## Everyday use

- **Log runs** with time, Jackpot vs College Rodeo, winnings, and a YouTube link.
- **Arenas** remember indoor/outdoor and your notes; the home page shows best
  outdoor and best indoor times plus **total winnings**.
- **Stays** link to an arena, so you can see where you stayed last time.
- Everything saves to the cloud instantly and shows up on any signed-in phone.

## Changing the password later

Update `RODEO_PASSWORD` in your hosting settings and redeploy. Everyone will need
to enter the new password once (there's a sign-out button in the top bar).

## Notes

- To reset it back to empty, delete the rows in the three `rodeo_*` tables (or
  the tables themselves) from the Supabase dashboard.
- This is completely separate from the company dashboard/login — a different
  password, different tables.
