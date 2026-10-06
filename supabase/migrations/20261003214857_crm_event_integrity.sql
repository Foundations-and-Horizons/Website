alter table public.crm_records drop constraint crm_records_check;
alter table public.crm_records add constraint crm_records_stage_check check ((kind='client' and stage in ('preparing','active','review','completed','on_hold')) or (kind='consulting' and stage in ('scouted','contacted','replied','conversation','proposal','won','declined','on_hold')) or (kind='speaking' and stage in ('scouted','drafting','submitted','booked','delivered','declined','on_hold')) or (kind='workshop' and stage in ('planning','registration','delivered','cancelled','on_hold')));
alter table public.crm_activity drop constraint crm_activity_owner_id_source_event_id_key;
alter table public.crm_activity add constraint crm_activity_owner_event_key unique(owner_id,event_id);
create or replace function public.crm_record_event(p_owner uuid, event jsonb) returns uuid
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
 on conflict(owner_id,event_id) do nothing returning id into inserted_id;
 if inserted_id is null then return r.id; end if;
 if r.last_event_at is not null and event_at<=r.last_event_at then return r.id; end if;
 target_stage:=r.stage;
 if event_kind='consulting' and r.stage not in ('won','declined','on_hold') then
  if event->>'event_type'='email_sent' and r.stage='scouted' then target_stage:='contacted'; end if;
  if event->>'event_type'='reply_received' and r.stage in ('scouted','contacted') then target_stage:='replied'; end if;
  if event->>'event_type'='positive_reply' and r.stage in ('scouted','contacted','replied') then target_stage:='conversation'; end if;
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
