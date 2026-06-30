-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── Leads (CRM) ─────────────────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  role text,
  email text,
  phone text,
  source text,
  tier text check (tier in ('A','B','C')),
  fit_notes text,
  stage text not null default 'not_contacted'
    check (stage in ('not_contacted','sent','followed_up','responded','discovery_call','proposal','won','lost')),
  date_last_contact date,
  next_action text,
  next_action_due date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();

-- ─── LinkedIn Posts ───────────────────────────────────────────────────────────
create table if not exists linkedin_posts (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'idea'
    check (status in ('idea','drafted','posted')),
  draft_text text,
  topic_tag text,
  posted_date date,
  created_at timestamptz not null default now()
);

-- ─── Book Sales ───────────────────────────────────────────────────────────────
create table if not exists book_sales (
  id uuid primary key default gen_random_uuid(),
  period date not null,
  units_sold integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

-- ─── Revenue Entries ──────────────────────────────────────────────────────────
create table if not exists revenue_entries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  description text not null,
  amount numeric(10,2) not null,
  date_received date not null,
  created_at timestamptz not null default now()
);

-- ─── Transactions (Income & Expense) ─────────────────────────────────────────
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  category text not null,
  description text not null,
  amount numeric(10,2) not null,
  date date not null,
  tax_deductible boolean not null default false,
  receipt_note text,
  created_at timestamptz not null default now()
);

-- ─── Settings ─────────────────────────────────────────────────────────────────
create table if not exists settings (
  key text primary key,
  value text not null
);
insert into settings (key, value) values ('annual_revenue_goal', '25000') on conflict do nothing;

-- ─── Seed: Leads ──────────────────────────────────────────────────────────────
insert into leads (name, organization, role, email, source, tier, stage) values
  ('Alysha Sutton', 'Volunteers of America Utah', null, 'alysha.sutton@voaut.org', 'VPMI Contacts 2024', 'B', 'sent'),
  ('Jolie Gordon', 'Humane Society of Utah', null, 'jolie@utahhumane.org', 'VPMI Contacts 2024', 'B', 'sent'),
  ('Shamar Lejardi', 'Camp Hobe', null, 'shamar.lejardi@camphobekids.org', 'VPMI Contacts 2024', 'B', 'sent'),
  ('Heather Dorius', 'Meals on Wheels', null, 'hdorius@mountainland.org', 'VPMI Contacts 2024', 'B', 'sent'),
  ('Lillian Bowles-Brown', 'Women of the World', null, 'volunteers@womenofworld.org', 'VPMI Contacts 2024', 'B', 'sent'),
  ('Caroline Glissmeyer', 'United Way of Utah County', null, 'carolineg@unitedwayuc.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Gina O''Brien', 'United Way of Northern Utah', null, 'gobrien@uwnu.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Jodi Lutkin', 'Utah Down Syndrome Foundation', 'CEO', 'ceo@udsf.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Danielle Meza', 'American Indian Services', null, 'danielle@americanindianservices.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Jeanine Kunshek', 'First Step House', null, 'jkunshek@firststephouse.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('James Ririe', 'Fit to Recover', null, 'james@fit2recover.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Amanda Patten-Bareny', 'Independence Hospice', null, 'mandyp626@gmail.com', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Jessica Hercules', 'English Skills Learning Center', null, 'j.hercules@eslcenter.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Jessy Salas', 'Asian Association of Utah', null, 'jessy.salas@aau-slc.org', 'VPMI Contacts 2024', 'A', 'not_contacted'),
  ('Crystal Oborn', 'Cache Refugee and Immigration Connection', null, 'crystal@cacherefugees.org', 'VPMI Contacts 2024', 'A', 'not_contacted')
on conflict do nothing;

-- Fit note for Amanda Patten-Bareny
update leads set fit_notes = 'Medicare hospice rules require tracked volunteer hours — strong pain-point angle'
where name = 'Amanda Patten-Bareny';

-- ─── Seed: LinkedIn post angle prompts ───────────────────────────────────────
insert into linkedin_posts (status, draft_text, topic_tag) values
  ('idea', 'Chapter 1 angle: What does a "strong foundation" actually look like for a nonprofit? Most leaders can''t answer this — here''s the 3-part framework I use with every client.', 'book chapter'),
  ('idea', 'The Mission Filter: Most nonprofits say yes to too many things. Here''s a simple tool to run every new opportunity through before committing your team''s time.', 'platform demo'),
  ('idea', 'Capacity Map angle: Your team is stretched. But do you actually know WHERE the bottleneck is? I built a visual tool to show it in under 10 minutes.', 'platform demo'),
  ('idea', 'Delegation Planner angle: Executive directors carry too much. This isn''t a mindset problem — it''s a systems problem. Here''s how to fix it structurally.', 'platform demo'),
  ('idea', 'Burnout Self-Check angle: I see it every time: the leader who built the nonprofit from nothing, now running on empty. Here are the 5 early warning signs I watch for.', 'platform demo'),
  ('idea', 'Behind the scenes: What a typical nonprofit operational assessment actually looks like — and what surprises most leaders when we''re done.', 'behind the scenes')
on conflict do nothing;
