-- ─── Rodeo Road Log: Horses + extended run fields ────────────────────────────

-- Horses table: one row per horse.
create table if not exists rodeo_horses (
  name       text primary key,
  notes      text not null default '',
  created_at timestamptz not null default now()
);

alter table rodeo_horses enable row level security;
-- No policies — server-side service-role key only.

-- Extend rodeo_runs with the new fields.
alter table rodeo_runs
  add column if not exists horse        text    not null default '',
  add column if not exists placement    text    not null default '',
  add column if not exists entry_fee    numeric not null default 0,
  add column if not exists barrel1_notes text   not null default '',
  add column if not exists barrel2_notes text   not null default '',
  add column if not exists barrel3_notes text   not null default '',
  add column if not exists ground       text    not null default '';
