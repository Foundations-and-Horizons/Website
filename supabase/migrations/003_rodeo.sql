-- ─── Rodeo Road Log ──────────────────────────────────────────────────────────
-- Tables for the barrel-racing tracker (runs, arenas, hotel/campground stays).
--
-- Security model: these tables have RLS enabled with NO policies, so the public
-- anon key can't read or write them. The app reaches them only from the server
-- using the service-role key, behind the shared family-password gate.

create extension if not exists "pgcrypto";

-- Arenas: one row per arena, remembers indoor/outdoor + notes.
create table if not exists rodeo_arenas (
  name       text primary key,
  type       text not null default '' check (type in ('', 'indoor', 'outdoor')),
  notes      text not null default '',
  created_at timestamptz not null default now()
);

-- Runs: each timed run.
create table if not exists rodeo_runs (
  id         uuid primary key default gen_random_uuid(),
  run_date   date,
  event      text not null,
  arena      text not null,
  category   text not null default 'jackpot' check (category in ('jackpot', 'college')),
  run_time   numeric,
  earnings   numeric not null default 0,
  video_link text not null default '',
  notes      text not null default '',
  created_at timestamptz not null default now()
);

-- Stays: hotels / campgrounds, optionally linked to an arena.
create table if not exists rodeo_stays (
  id         uuid primary key default gen_random_uuid(),
  start_date date,
  end_date   date,
  type       text not null default 'hotel' check (type in ('hotel', 'campground')),
  name       text not null,
  arena      text not null default '',
  ada        boolean not null default false,
  rating     integer not null default 0,
  notes      text not null default '',
  created_at timestamptz not null default now()
);

alter table rodeo_arenas enable row level security;
alter table rodeo_runs   enable row level security;
alter table rodeo_stays  enable row level security;
-- Intentionally no policies: only the server-side service-role key may access
-- these tables. The public anon key is denied by default.
