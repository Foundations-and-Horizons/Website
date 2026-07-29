# Foundations & Horizons Website — Project Handoff

This document is for a new AI session picking up where the previous one left off.
Paste it into your project instructions and read it fully before touching any code.

---

## Who This Is For

**Stephen Cook** — Director of Operations for both global and local nonprofits.
Website: `foundationsandhorizons.com`
GitHub repo: `foundations-and-horizons/website`
Vercel project: deploys automatically from the `main` branch.
Primary email: `stephen.cook@usanainc.com`
Foundation email: `stephen.cook@foundationsandhorizons.com`

**PERMANENT SECURITY RULE — never violate this:**
> Never mention USANA Foundation anywhere on the website or in any code comments, UI text, or documentation that could be publicly visible. Replace any reference with "Director of Operations for both global and local nonprofits."

---

## Tech Stack

- **Framework**: Next.js 16.2.9, App Router. The auth middleware file is `proxy.ts` (not `middleware.ts` — this version renamed it). Read `node_modules/next/dist/docs/` before writing Next.js code.
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres). Two projects exist:
  - `F&H website` (id: `gpqivmzdkgwvdinzfhlf`, region: us-east-1) — **production**, ACTIVE
  - `F&H Volunteer Hub Demo` (id: `jnbswluljsagpgrfumca`, region: us-east-2) — INACTIVE, unused
- **Auth (dashboard)**: Supabase Auth (email/password), enforced in `proxy.ts`
- **Auth (rodeo)**: Custom family-password gate via `RODEO_PASSWORD` env var + `httpOnly` cookie `rodeo_session`
- **Email**: Resend API, sending from `stephen.cook@foundationsandhorizons.com`. DNS verification was pending at last check — may need to be confirmed in Resend dashboard before outbound email works.
- **Deployment**: Vercel, auto-deploys `main`. All feature work is done on `claude/internal-tool-setup-m3dh74` and merged to `main` via PR.

---

## Repository Structure

```
app/
  (marketing)/          Public-facing pages
    page.tsx            Home
    about/
    contact/
    services/
    solutions/
    speaking/
    tools/
    foundationworks/
    education/
  (dashboard)/
    dashboard/          Internal CRM/ops dashboard (Supabase auth required)
      page.tsx          Dashboard home
      contacts/
      companies/
      leads/
      deals/
      finance/
      revenue/
      books/
      linkedin/
      login/
      layout.tsx
      DashboardNav.tsx
  (rodeo)/
    rodeo/              Rodeo Road Log app
      page.tsx
      RodeoApp.tsx      Main client component (~900 lines)
      LoginForm.tsx
      actions.ts        Server actions
  gate/                 (legacy, not in active use)
  api/
  globals.css
  layout.tsx

lib/
  access.ts             isDashboardPublic() toggle
  rodeo/
    auth.ts             Rodeo password gate logic
    db.ts               Supabase server-only data access
    types.ts            All shared TypeScript types

public/
  volunteer-hub.html    Standalone volunteer demo (localStorage-based)

supabase/
  migrations/
    001_dashboard_schema.sql
    002_crm_expansion.sql
    003_rodeo.sql
    004_rodeo_horses.sql

proxy.ts                Auth middleware (Next.js 16 convention)
next.config.ts          Rewrites: /volunteer-demo → /volunteer-hub.html
```

---

## Environment Variables (Vercel)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only, never expose) |
| `RODEO_PASSWORD` | Family password for Rodeo Road Log (`Addy`) |
| `RESEND_API_KEY` | Resend email API key |
| `DASHBOARD_PUBLIC` | Set to `"true"` to bypass dashboard login gate |

---

## The Three Main "Apps"

### 1. Public Marketing Site (`foundationsandhorizons.com`)

Standard Next.js pages under `app/(marketing)/`. Nothing unusual. Uses Tailwind. The home page, about, services, speaking, contact, etc. are all standard server components. No auth required.

### 2. Internal Dashboard (`/dashboard`)

A full CRM/ops dashboard for Stephen's foundation work.

- **Auth**: Supabase email/password. Login at `/dashboard/login`. Protected by `proxy.ts` — only `/dashboard/:path*` routes are gated.
- **Data**: All stored in Supabase production project. Tables created by `001_dashboard_schema.sql` and `002_crm_expansion.sql`.
- **Sections**: Contacts, Companies, Leads, Deals, Finance, Revenue, Books, LinkedIn pipeline.
- **Email compose**: Built-in email composition using Resend, sends from `stephen.cook@foundationsandhorizons.com`. Won't work until DNS is verified in Resend.
- **`lib/access.ts`**: Exports `isDashboardPublic()` — checks `DASHBOARD_PUBLIC` env var. Set to `"true"` to skip auth entirely (useful for demos).

### 3. Rodeo Road Log (`/rodeo`)

A private barrel-racing tracking app for Stephen's family.

- **Auth**: Simple family password. `RODEO_PASSWORD=Addy` in Vercel env vars. Stored as `httpOnly` cookie `rodeo_session`. Logic in `lib/rodeo/auth.ts`.
- **Data**: Supabase production project, tables prefixed `rodeo_`. All tables have RLS enabled but no policies — access is server-side only via service role key.
- **Tables**:
  - `rodeo_runs` — individual barrel racing runs
  - `rodeo_stays` — lodging during events
  - `rodeo_arenas` — arena info
  - `rodeo_horses` — horses (added in migration 004)
- **Features** (as of last session):
  - Home dashboard with stats: run count, total won, net season (earnings minus entry fees), best outdoor time, best indoor time
  - Horse filter on home and runs list
  - Runs tab: log runs with date, event, arena, horse, category (jackpot/college), time, earnings, entry fee, placement, ground conditions, per-barrel notes, video link, notes
  - Stays tab: log lodging with dates, type (hotel/campground), ADA flag, rating, notes
  - Arenas tab: track arena type (indoor/outdoor) and notes
  - Horses tab: add/edit horses; shows run count, best time, total won per horse
- **Ground conditions** enum: `"" | "Hard" | "Deep" | "Sloppy" | "Freshly dragged" | "Good"`
- **Visual style**: Western theme, turquoise/teal color palette, saddle-stitch card borders.

---

## Volunteer Demo (`/volunteer-demo`)

A standalone HTML file at `public/volunteer-hub.html`. It is NOT connected to any database — all data lives in the browser's `localStorage` under the key `fh_vhub_v2`.

- Accessed at `foundationsandhorizons.com/volunteer-demo`
- Rewrite defined in `next.config.ts`
- This is a **demo only**, designed to look like a real volunteer management system for presentations
- **Volunteer types**: Warehouse, Deliveries, Admin, Outreach (only these four — others were removed)
- **Delivery roles**: Driver, Driver 2 (there is no "Assistant" — it was renamed)
- **Status options**: Active, Inactive, On Leave (Summer Break was fully removed)
- **Event types**: Community Outreach Day, Back-to-School Supply Drive, Corporate Partner Day, Neighborhood Resource Fair, Youth Volunteer Day, Holiday Donation Sort — varied nonprofit events, no "Pack" terminology
- **Seed data key**: If you need to reset the demo data for all visitors, bump the localStorage key in the JS near the top of the file (e.g., `fh_vhub_v2` → `fh_vhub_v3`)
- The file has ~24 seed volunteers including Jasmine Carter and Marcus Webb (Outreach), and an upcoming anniversary event

---

## Git Workflow

- Feature branch: `claude/internal-tool-setup-m3dh74`
- Always develop on this branch, then merge to `main` via PR on GitHub
- Vercel deploys automatically when `main` is updated
- **Commit author must be**: `user.name = Claude`, `user.email = noreply@anthropic.com`
  - Set with: `git config user.email noreply@anthropic.com && git config user.name Claude`
  - If commits are flagged as unsigned/wrong author by a stop hook, fix with:
    `git commit --amend --no-edit --reset-author` then `git push --force-with-lease`

---

## Known Pending Items

1. **Resend DNS verification**: `foundationsandhorizons.com` domain was still pending verification in Resend at last check. Dashboard email compose is built but won't send until this is done. Check `resend.com` dashboard.
2. **Supabase migrations**: All 4 migrations have been applied to production. If you add new ones, use the Supabase MCP tool `apply_migration` against project id `gpqivmzdkgwvdinzfhlf`.
3. **Leads/pipeline CRM**: A FoundationWorks pipeline feature was discussed but not fully built. The groundwork (contacts, companies, deals tables) exists in Supabase.

---

## Supabase MCP

The Supabase MCP server is available. Use it for:
- `list_projects` — confirm which project is active
- `apply_migration` — run DDL changes (use project id `gpqivmzdkgwvdinzfhlf`)
- `execute_sql` — run queries for debugging
- `list_tables` — inspect schema

Do NOT apply migrations to the `jnbswluljsagpgrfumca` project (the inactive demo one).

---

## Things NOT to Do

- Do not mention USANA Foundation anywhere (see security rule at top)
- Do not push directly to `main` — use the feature branch
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Do not add a `middleware.ts` file — this Next.js version uses `proxy.ts`
- Do not change the `fh_vhub_v2` localStorage key unless intentionally resetting demo data for all visitors
- Do not run `playwright install` — Chromium is pre-installed at `/opt/pw-browsers`
