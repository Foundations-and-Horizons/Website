-- Additive workspace: existing CRM records remain intact for reconciliation.
create table public.crm_records (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
 kind text not null check(kind in ('client','consulting','speaking','workshop')),
 organization text not null, title text not null, contact text not null default '', email text not null default '',
 stage text not null, value numeric(12,2) check(value >= 0), event_date date,
 next_action text not null default '', next_action_due date, notes text not null default '', source text not null default '',
 needs_review boolean not null default true, import_key text, entity_key text,
 last_event_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id,import_key), unique(owner_id,entity_key), unique(owner_id,id),
 check ((kind='client' and stage in ('preparing','active','review','completed','on_hold')) or
 (kind='consulting' and stage in ('scouted','contacted','conversation','proposal','won','declined','on_hold')) or
 (kind='speaking' and stage in ('scouted','drafting','submitted','booked','delivered','declined','on_hold')) or
 (kind='workshop' and stage in ('planning','registration','delivered','cancelled','on_hold')))
);
create table public.crm_invoices (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), record_id uuid not null,
 label text not null, amount numeric(12,2) not null check(amount >= 0),
 status text not null check(status in ('draft','sent','paid','void')), issued_on date, due_on date, paid_on date,
 notes text not null default '', import_key text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id,import_key), foreign key(owner_id,record_id) references public.crm_records(owner_id,id),
 check ((status='paid' and paid_on is not null) or (status<>'paid' and paid_on is null))
);
create table public.crm_tasks (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), record_id uuid,
 title text not null, due_on date, done boolean not null default false, import_key text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id,import_key), foreign key(owner_id,record_id) references public.crm_records(owner_id,id)
);
create table public.crm_activity (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), record_id uuid not null,
 source text not null, event_id text not null, event_type text not null, summary text not null,
 occurred_at timestamptz not null, payload jsonb not null default '{}', created_at timestamptz not null default now(),
 unique(owner_id,source,event_id), foreign key(owner_id,record_id) references public.crm_records(owner_id,id)
);
create index crm_activity_record_idx on public.crm_activity(owner_id,record_id,occurred_at desc);
create index crm_invoice_record_idx on public.crm_invoices(owner_id,record_id);
create index crm_task_record_idx on public.crm_tasks(owner_id,record_id);
alter table public.crm_records enable row level security;
alter table public.crm_invoices enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_activity enable row level security;
create policy owner_access on public.crm_records for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy owner_access on public.crm_invoices for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy owner_access on public.crm_tasks for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy owner_read on public.crm_activity for select to authenticated using ((select auth.uid())=owner_id);
create policy owner_insert on public.crm_activity for insert to authenticated with check ((select auth.uid())=owner_id);
grant select,insert,update,delete on public.crm_records,public.crm_invoices,public.crm_tasks to authenticated;
grant select,insert on public.crm_activity to authenticated;
revoke all on public.crm_records,public.crm_invoices,public.crm_tasks,public.crm_activity from anon;
create trigger crm_records_updated before update on public.crm_records for each row execute function public.set_updated_at();
create trigger crm_invoices_updated before update on public.crm_invoices for each row execute function public.set_updated_at();
create trigger crm_tasks_updated before update on public.crm_tasks for each row execute function public.set_updated_at();

-- Connector SQL and authenticated users share the same atomic, replay-safe event intake.
-- Invoker security preserves RLS. No service-role key or public webhook is required.
create function public.crm_record_event(p_owner uuid, event jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r public.crm_records; event_at timestamptz; target_stage text; event_kind text; inserted_id uuid;
begin
 if auth.uid() is not null and auth.uid()<>p_owner then raise exception 'Owner mismatch'; end if;
 if event->>'source' not in ('client_scout','speaking_scout','reply_watch','manual','reconciliation') then raise exception 'Unknown source'; end if;
 if coalesce(event->>'event_id','')='' or coalesce(event->>'entity_key','')='' or coalesce(event->>'summary','')='' then raise exception 'Missing event identity or evidence'; end if;
 event_kind := event->>'kind';
 if event_kind not in ('consulting','speaking','client','workshop') then raise exception 'Invalid kind'; end if;
 if event->>'event_type' not in ('discovered','email_sent','reply_received','positive_reply','declined','application_submitted','booked','note') then raise exception 'Invalid event type'; end if;
 event_at := (event->>'occurred_at')::timestamptz;
 if event_at is null or event_at>now()+interval '5 minutes' then raise exception 'Invalid event time'; end if;
 -- One lock per owner serializes concurrent creates and retries across all scouts.
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 select * into r from public.crm_records where owner_id=p_owner and entity_key=event->>'entity_key' for update;
 if r.id is null then
  if coalesce(event->>'organization','')='' or coalesce(event->>'title','')='' then raise exception 'New records need organization and title'; end if;
  insert into public.crm_records(owner_id,entity_key,kind,organization,title,contact,email,stage,source,needs_review)
  values(p_owner,event->>'entity_key',event_kind,event->>'organization',event->>'title',coalesce(event->>'contact',''),coalesce(event->>'email',''),
   case event_kind when 'client' then 'preparing' when 'workshop' then 'planning' else 'scouted' end,event->>'source',true) returning * into r;
 end if;
 if r.kind<>event_kind then raise exception 'Kind mismatch; link the existing record rather than duplicating it'; end if;
 insert into public.crm_activity(owner_id,record_id,source,event_id,event_type,summary,occurred_at,payload)
 values(p_owner,r.id,event->>'source',event->>'event_id',event->>'event_type',event->>'summary',event_at,event)
 on conflict(owner_id,source,event_id) do nothing returning id into inserted_id;
 if inserted_id is null then return r.id; end if;
 if r.last_event_at is not null and event_at<=r.last_event_at then return r.id; end if;
 target_stage:=r.stage;
 if event_kind='consulting' and r.stage not in ('won','declined','on_hold') then
  if event->>'event_type'='email_sent' and r.stage='scouted' then target_stage:='contacted'; end if;
  if event->>'event_type'='positive_reply' and r.stage in ('scouted','contacted') then target_stage:='conversation'; end if;
  if event->>'event_type'='declined' then target_stage:='declined'; end if;
 elsif event_kind='speaking' and r.stage not in ('declined','delivered','on_hold') then
  if event->>'event_type'='application_submitted' and r.stage in ('scouted','drafting') then target_stage:='submitted'; end if;
  if event->>'event_type'='booked' then target_stage:='booked'; end if;
  if event->>'event_type'='declined' then target_stage:='declined'; end if;
 end if;
 update public.crm_records set stage=target_stage,last_event_at=event_at,
  next_action=case when target_stage='declined' then '' else coalesce(event->>'next_action',next_action) end,
  next_action_due=case when target_stage='declined' then null else next_action_due end,
  needs_review=case when event->>'event_type' in ('reply_received','positive_reply') then true else needs_review end
 where id=r.id;
 return r.id;
end $$;
revoke execute on function public.crm_record_event(uuid,jsonb) from public,anon;
grant execute on function public.crm_record_event(uuid,jsonb) to authenticated;
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  alter publication supabase_realtime add table public.crm_records,public.crm_invoices,public.crm_tasks,public.crm_activity;
 end if;
end $$;
