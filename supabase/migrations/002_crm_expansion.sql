-- ════════════════════════════════════════════════════════════════════════════
-- 002_crm_expansion.sql
--
-- Expands the dashboard into a full CRM: Companies → Contacts → Deals, moving
-- through per-area Pipelines, with an Activity timeline, Tasks, and Tags.
-- Also adds a lightweight gamification layer (XP events + achievements).
--
-- SAFE TO RUN: every statement is additive (create ... if not exists). The
-- one-time backfill from the legacy `leads` table is guarded so it only runs
-- while the new tables are empty — re-running this file will not duplicate data.
-- Nothing is dropped; the legacy `leads` table is left intact.
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- set_updated_at() already exists from 001; recreate defensively so this file
-- can be applied on a fresh database too.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Pipelines & Stages ──────────────────────────────────────────────────────
create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  color text not null default '#2a3db4',
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references pipelines(id) on delete cascade,
  key text not null,
  label text not null,
  sort_order int not null default 0,
  is_won boolean not null default false,
  is_lost boolean not null default false,
  unique (pipeline_id, key)
);

-- ─── Companies ─────────────────────────────────────────────────────────────
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  city text,
  state text,
  size text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Case-insensitive uniqueness so we don't create "Humane Society" twice.
create unique index if not exists companies_name_lower_idx on companies (lower(name));

drop trigger if exists companies_updated_at on companies;
create trigger companies_updated_at before update on companies
  for each row execute function set_updated_at();

-- ─── Contacts ────────────────────────────────────────────────────────────────
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  first_name text,
  last_name text,
  full_name text not null,
  title text,
  email text,
  phone text,
  linkedin_url text,
  tier text check (tier in ('A','B','C')),
  source text,
  fit_notes text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_company_idx on contacts (company_id);
create index if not exists contacts_email_idx on contacts (lower(email));

drop trigger if exists contacts_updated_at on contacts;
create trigger contacts_updated_at before update on contacts
  for each row execute function set_updated_at();

-- ─── Deals ───────────────────────────────────────────────────────────────────
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pipeline_id uuid not null references pipelines(id),
  stage_id uuid references pipeline_stages(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  primary_contact_id uuid references contacts(id) on delete set null,
  value numeric(12,2),
  currency text not null default 'USD',
  status text not null default 'open' check (status in ('open','won','lost')),
  next_action text,
  next_action_due date,
  expected_close date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists deals_pipeline_idx on deals (pipeline_id);
create index if not exists deals_stage_idx on deals (stage_id);
create index if not exists deals_company_idx on deals (company_id);

drop trigger if exists deals_updated_at on deals;
create trigger deals_updated_at before update on deals
  for each row execute function set_updated_at();

-- ─── Activities (timeline) ─────────────────────────────────────────────────
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'note'
    check (type in ('note','email','call','meeting','task','stage_change','system')),
  subject text,
  body text,
  deal_id uuid references deals(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists activities_deal_idx on activities (deal_id, occurred_at desc);
create index if not exists activities_contact_idx on activities (contact_id, occurred_at desc);

-- ─── Tasks ─────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean not null default false,
  due_date date,
  priority text check (priority in ('low','med','high')),
  deal_id uuid references deals(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists tasks_open_due_idx on tasks (done, due_date);

-- ─── Tags ──────────────────────────────────────────────────────────────────
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color text not null default '#64748b'
);
create table if not exists contact_tags (
  contact_id uuid references contacts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (contact_id, tag_id)
);
create table if not exists deal_tags (
  deal_id uuid references deals(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (deal_id, tag_id)
);

-- ─── Gamification ────────────────────────────────────────────────────────────
create table if not exists xp_events (
  id uuid primary key default gen_random_uuid(),
  amount int not null,
  reason text not null,
  source_type text,            -- 'deal' | 'linkedin' | 'task' | 'book' | 'manual'
  source_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists xp_events_created_idx on xp_events (created_at desc);

create table if not exists achievements (
  key text primary key,
  name text not null,
  description text,
  icon text,
  xp int not null default 0,
  sort_order int not null default 0
);
create table if not exists earned_achievements (
  achievement_key text primary key references achievements(key) on delete cascade,
  earned_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- Seeds
-- ════════════════════════════════════════════════════════════════════════════

-- Pipelines
insert into pipelines (key, name, color, icon, sort_order) values
  ('consulting', 'Consulting & Services', '#2a3db4', '🧭', 1),
  ('software',   'Software / SaaS',        '#0d9488', '🧩', 2),
  ('speaking',   'Speaking & Education',   '#c026d3', '🎤', 3)
on conflict (key) do nothing;

-- Consulting stages — mirror the legacy leads stages 1:1 for a clean backfill.
insert into pipeline_stages (pipeline_id, key, label, sort_order, is_won, is_lost)
select p.id, s.key, s.label, s.sort_order, s.is_won, s.is_lost
from pipelines p
join (values
  ('not_contacted', 'Not Contacted', 1, false, false),
  ('sent',          'Sent',          2, false, false),
  ('followed_up',   'Followed Up',   3, false, false),
  ('responded',     'Responded',     4, false, false),
  ('discovery_call','Discovery Call',5, false, false),
  ('proposal',      'Proposal',      6, false, false),
  ('won',           'Won',           7, true,  false),
  ('lost',          'Lost',          8, false, true)
) as s(key, label, sort_order, is_won, is_lost) on true
where p.key = 'consulting'
on conflict (pipeline_id, key) do nothing;

-- Software stages
insert into pipeline_stages (pipeline_id, key, label, sort_order, is_won, is_lost)
select p.id, s.key, s.label, s.sort_order, s.is_won, s.is_lost
from pipelines p
join (values
  ('lead',        'Lead',        1, false, false),
  ('demo',        'Demo',        2, false, false),
  ('trial',       'Trial',       3, false, false),
  ('proposal',    'Proposal',    4, false, false),
  ('negotiation', 'Negotiation', 5, false, false),
  ('won',         'Closed Won',  6, true,  false),
  ('lost',        'Closed Lost', 7, false, true)
) as s(key, label, sort_order, is_won, is_lost) on true
where p.key = 'software'
on conflict (pipeline_id, key) do nothing;

-- Speaking stages
insert into pipeline_stages (pipeline_id, key, label, sort_order, is_won, is_lost)
select p.id, s.key, s.label, s.sort_order, s.is_won, s.is_lost
from pipelines p
join (values
  ('inquiry',    'Inquiry',    1, false, false),
  ('discussing', 'Discussing', 2, false, false),
  ('booked',     'Booked',     3, false, false),
  ('delivered',  'Delivered',  4, true,  false),
  ('declined',   'Declined',   5, false, true)
) as s(key, label, sort_order, is_won, is_lost) on true
where p.key = 'speaking'
on conflict (pipeline_id, key) do nothing;

-- Achievements
insert into achievements (key, name, description, icon, xp, sort_order) values
  ('first_blood',   'First Contact',      'Log your first outreach email',            '📧', 50,  1),
  ('streak_7',      'Consistency',        'Keep a 7-day activity streak',             '🔥', 150, 2),
  ('linkedin_3',    'Thought Leader',     'Hit your weekly LinkedIn goal (3 posts)',  '💼', 100, 3),
  ('first_win',     'First Deal',         'Close your first deal',                    '🏆', 300, 4),
  ('pipeline_10',   'Full Funnel',        'Have 10 active deals at once',             '📈', 200, 5),
  ('inbox_zero',    'Inbox Zero',         'Clear all overdue follow-ups',             '✅', 120, 6)
on conflict (key) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- One-time backfill from legacy `leads` (guarded: only runs while empty)
-- ════════════════════════════════════════════════════════════════════════════
do $$
declare
  consulting_id uuid;
begin
  -- Only backfill the first time, and only if the legacy table exists.
  if to_regclass('public.leads') is null then
    return;
  end if;
  if exists (select 1 from companies) or exists (select 1 from contacts) or exists (select 1 from deals) then
    return;
  end if;

  select id into consulting_id from pipelines where key = 'consulting';

  -- Companies from distinct organizations (collapse case-variant duplicates
  -- so the lower(name) unique index can't be violated).
  insert into companies (name)
  select min(organization)
  from leads
  where organization is not null and btrim(organization) <> ''
  group by lower(organization);

  -- Contacts (one per lead), linked to their company
  insert into contacts (company_id, full_name, title, email, phone, tier, source, fit_notes, notes)
  select c.id, l.name, l.role, l.email, l.phone, l.tier, l.source, l.fit_notes, l.notes
  from leads l
  left join companies c on lower(c.name) = lower(l.organization);

  -- Deals (one per lead) in the consulting pipeline, mapped to the matching stage
  insert into deals (title, pipeline_id, stage_id, company_id, primary_contact_id,
                     status, next_action, next_action_due, notes)
  select
    coalesce(nullif(btrim(l.organization), ''), l.name) || ' — Consulting',
    consulting_id,
    st.id,
    co.id,
    ct.id,
    case when l.stage = 'won' then 'won' when l.stage = 'lost' then 'lost' else 'open' end,
    l.next_action,
    l.next_action_due,
    l.notes
  from leads l
  left join pipeline_stages st on st.pipeline_id = consulting_id and st.key = l.stage
  left join companies co on lower(co.name) = lower(l.organization)
  left join contacts ct on lower(ct.full_name) = lower(l.name)
                        and (ct.company_id = co.id or (ct.company_id is null and co.id is null));
end $$;
