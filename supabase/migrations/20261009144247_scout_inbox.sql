-- Additive Scout Inbox. Existing CRM/authentication/data remain unchanged.
create table public.scout_inbox (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
 dedupe_key text not null check(length(dedupe_key) between 1 and 500),
 scout text not null check(length(scout) between 1 and 100), category text not null,
 organization text not null check(length(organization) between 1 and 250),
 title text not null check(length(title) between 1 and 250), opportunity_type text not null default '',
 fit_reason text not null, contact jsonb not null default '{}', email_verified boolean not null default false,
 important_dates jsonb not null default '[]', deadline_at timestamptz, source_url text not null check(source_url ~ '^https?://'),
 recommendation text not null default '', notes text not null default '', original_finding jsonb not null,
 discovered_at timestamptz not null, last_seen_at timestamptz not null, seen_count integer not null default 1,
 status text not null default 'New' check(status in ('New','Pursue','Hold','Pass')),
 reviewed_at timestamptz, reviewed_by text, review_notes text not null default '', review_after date,
 crm_kind text check(crm_kind in ('consulting','speaking','client','workshop')),
 crm_record_id uuid, crm_entity_key text, converted_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id,dedupe_key), unique(owner_id,id),
 foreign key(owner_id,crm_record_id) references public.crm_records(owner_id,id),
 check(jsonb_typeof(original_finding)='object'),check(jsonb_typeof(contact)='object'),check(jsonb_typeof(important_dates)='array')
);
create index scout_inbox_review_idx on public.scout_inbox(owner_id,status,discovered_at desc);
create index scout_inbox_crm_idx on public.scout_inbox(owner_id,crm_record_id);
create table public.scout_inbox_sightings (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),inbox_id uuid not null,
 scout text not null,event_id text not null,finding jsonb not null,discovered_at timestamptz not null,
 created_at timestamptz not null default now(),unique(owner_id,scout,event_id),
 foreign key(owner_id,inbox_id) references public.scout_inbox(owner_id,id)
);
create index scout_sightings_inbox_idx on public.scout_inbox_sightings(owner_id,inbox_id);
create table public.scout_inbox_reviews (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),inbox_id uuid not null,
 previous_status text not null,status text not null,reviewer text not null,notes text not null default '',
 crm_record_id uuid,created_at timestamptz not null default now(),
 foreign key(owner_id,inbox_id) references public.scout_inbox(owner_id,id),
 foreign key(owner_id,crm_record_id) references public.crm_records(owner_id,id)
);
create index scout_reviews_inbox_idx on public.scout_inbox_reviews(owner_id,inbox_id);
alter table public.scout_inbox enable row level security;
alter table public.scout_inbox_sightings enable row level security;
alter table public.scout_inbox_reviews enable row level security;
create policy owner_access on public.scout_inbox for all to authenticated using((select auth.uid())=owner_id) with check((select auth.uid())=owner_id);
create policy owner_read on public.scout_inbox_sightings for select to authenticated using((select auth.uid())=owner_id);
create policy owner_insert on public.scout_inbox_sightings for insert to authenticated with check((select auth.uid())=owner_id);
create policy owner_read on public.scout_inbox_reviews for select to authenticated using((select auth.uid())=owner_id);
create policy owner_insert on public.scout_inbox_reviews for insert to authenticated with check((select auth.uid())=owner_id);
revoke all on public.scout_inbox,public.scout_inbox_sightings,public.scout_inbox_reviews from public,anon,authenticated,service_role;
grant select,insert,update on public.scout_inbox to authenticated,service_role;
grant select,insert on public.scout_inbox_sightings,public.scout_inbox_reviews to authenticated,service_role;
create trigger scout_inbox_updated before update on public.scout_inbox for each row execute function public.set_updated_at();

create function public.scout_inbox_ingest(p_owner uuid,finding jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare item public.scout_inbox; stamp timestamptz; sighting uuid; previous_sighting public.scout_inbox_sightings;
begin
 if auth.uid() is not null and auth.uid()<>p_owner then raise exception 'Owner mismatch'; end if;
 if jsonb_typeof(finding)<>'object' or finding is null then raise exception 'Finding must be an object'; end if;
 if coalesce(trim(finding->>'dedupe_key'),'')='' or coalesce(trim(finding->>'scout'),'')='' or coalesce(trim(finding->>'event_id'),'')='' or coalesce(trim(finding->>'organization'),'')='' or coalesce(trim(finding->>'title'),'')='' or coalesce(trim(finding->>'fit_reason'),'')='' or coalesce(trim(finding->>'category'),'')='' then raise exception 'Missing required finding fields'; end if;
 stamp:=(finding->>'discovered_at')::timestamptz;
 if stamp is null or stamp>now()+interval '5 minutes' then raise exception 'Invalid discovery time'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 select * into previous_sighting from public.scout_inbox_sightings where owner_id=p_owner and scout=finding->>'scout' and event_id=finding->>'event_id';
 if previous_sighting.id is not null then
  select * into item from public.scout_inbox where owner_id=p_owner and id=previous_sighting.inbox_id;
  if item.dedupe_key<>trim(finding->>'dedupe_key') then raise exception 'Event ID reused for another opportunity'; end if;
  return item.id;
 end if;
 select * into item from public.scout_inbox where owner_id=p_owner and dedupe_key=trim(finding->>'dedupe_key') for update;
 if item.id is null then
  insert into public.scout_inbox(owner_id,dedupe_key,scout,category,organization,title,opportunity_type,fit_reason,contact,email_verified,important_dates,deadline_at,source_url,recommendation,notes,original_finding,discovered_at,last_seen_at,crm_kind)
  values(p_owner,trim(finding->>'dedupe_key'),finding->>'scout',finding->>'category',trim(finding->>'organization'),trim(finding->>'title'),coalesce(finding->>'opportunity_type',''),finding->>'fit_reason',coalesce(finding->'contact','{}'),coalesce((finding->>'email_verified')::boolean,false),coalesce(finding->'important_dates','[]'),nullif(finding->>'deadline_at','')::timestamptz,finding->>'source_url',coalesce(finding->>'recommendation',''),coalesce(finding->>'notes',''),finding,stamp,stamp,nullif(finding->>'crm_kind','')) returning * into item;
 end if;
 insert into public.scout_inbox_sightings(owner_id,inbox_id,scout,event_id,finding,discovered_at)
 values(p_owner,item.id,finding->>'scout',finding->>'event_id',finding,stamp) returning id into sighting;
 update public.scout_inbox set last_seen_at=greatest(last_seen_at,stamp),seen_count=(select count(*) from public.scout_inbox_sightings where owner_id=p_owner and inbox_id=item.id) where owner_id=p_owner and id=item.id;
 return item.id;
end $$;

create function public.scout_inbox_review(p_owner uuid,p_id uuid,p_status text,p_reviewer text,p_notes text default '',p_kind text default null,p_entity_key text default null,p_review_after date default null,p_expected_at timestamptz default null) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare item public.scout_inbox; target public.crm_records; target_key text; matches integer; evidence text; new_record boolean:=false;
begin
 if auth.uid() is not null and auth.uid()<>p_owner then raise exception 'Owner mismatch'; end if;
 if p_status is null or p_status not in ('New','Pursue','Hold','Pass') or coalesce(trim(p_reviewer),'')='' then raise exception 'Invalid decision or reviewer'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 select * into item from public.scout_inbox where owner_id=p_owner and id=p_id for update;
 if item.id is null then raise exception 'Finding not found'; end if;
 if p_expected_at is not null and p_expected_at<>item.updated_at then raise exception 'Finding changed; refresh before reviewing'; end if;
 if p_status='Pursue' and item.crm_record_id is null then
  if p_kind is null or p_kind not in ('consulting','speaking','client','workshop') then raise exception 'Choose CRM category'; end if;
  if nullif(trim(p_entity_key),'') is not null then
   select * into target from public.crm_records where owner_id=p_owner and entity_key=p_entity_key and kind=p_kind;
   if target.id is null then raise exception 'Existing CRM entity key not found in chosen category'; end if;
  else
   -- Match organization/category and title or verified email; ambiguous matches require explicit selection.
   select count(*) into matches from public.crm_records where owner_id=p_owner and kind=p_kind and
    regexp_replace(lower(organization),'[^a-z0-9]','','g')=regexp_replace(lower(item.organization),'[^a-z0-9]','','g') and
    (regexp_replace(lower(title),'[^a-z0-9]','','g')=regexp_replace(lower(item.title),'[^a-z0-9]','','g') or
     (item.email_verified and coalesce(item.contact->>'email','')<>'' and lower(email)=lower(item.contact->>'email')));
   if matches>1 then raise exception 'Multiple CRM matches; select the existing opportunity'; end if;
   if matches=1 then
    select * into target from public.crm_records where owner_id=p_owner and kind=p_kind and regexp_replace(lower(organization),'[^a-z0-9]','','g')=regexp_replace(lower(item.organization),'[^a-z0-9]','','g') and (regexp_replace(lower(title),'[^a-z0-9]','','g')=regexp_replace(lower(item.title),'[^a-z0-9]','','g') or (item.email_verified and coalesce(item.contact->>'email','')<>'' and lower(email)=lower(item.contact->>'email')));
   end if;
  end if;
  target_key:=coalesce(target.entity_key,'scout-inbox:'||item.dedupe_key);
  if target.id is not null and target.entity_key is null then
   target_key:='scout-inbox:existing:'||target.id::text;
   update public.crm_records set entity_key=target_key where owner_id=p_owner and id=target.id;
  end if;
  new_record:=target.id is null;
  evidence:=concat('Pursue approved by ',p_reviewer,'. ',p_notes,E'\nFit: ',item.fit_reason,E'\nSource: ',item.source_url,E'\nRecommendation: ',item.recommendation,E'\nNotes: ',item.notes,E'\nContact (verification retained in inbox): ',item.contact::text,E'\nDates: ',item.important_dates::text,E'\nInbox: ',item.id::text);
  item.crm_record_id:=public.crm_record_event(p_owner,jsonb_build_object('source','manual','event_id','scout-inbox:pursue:'||item.id::text,'entity_key',target_key,'kind',p_kind,'event_type',case when new_record then 'discovered' else 'note' end,'occurred_at',now(),'summary',evidence,'organization',item.organization,'title',item.title,'contact',case when item.email_verified then coalesce(item.contact->>'name','') else '' end,'email',case when item.email_verified then coalesce(item.contact->>'email','') else '' end));
  if new_record then update public.crm_records set notes=evidence,next_action='Chief of Staff: review and prepare next step',next_action_due=item.deadline_at::date where owner_id=p_owner and id=item.crm_record_id; end if;
  item.crm_entity_key:=target_key;item.crm_kind:=p_kind;item.converted_at:=now();
 end if;
 update public.scout_inbox set status=p_status,reviewed_at=case when p_status='New' then null else now() end,reviewed_by=p_reviewer,review_notes=coalesce(p_notes,''),review_after=p_review_after,crm_record_id=item.crm_record_id,crm_entity_key=item.crm_entity_key,crm_kind=item.crm_kind,converted_at=item.converted_at where owner_id=p_owner and id=item.id;
 insert into public.scout_inbox_reviews(owner_id,inbox_id,previous_status,status,reviewer,notes,crm_record_id) values(p_owner,item.id,item.status,p_status,p_reviewer,coalesce(p_notes,''),item.crm_record_id);
 return item.crm_record_id;
end $$;
revoke execute on function public.scout_inbox_ingest(uuid,jsonb),public.scout_inbox_review(uuid,uuid,text,text,text,text,text,date,timestamptz) from public,anon;
grant execute on function public.scout_inbox_ingest(uuid,jsonb),public.scout_inbox_review(uuid,uuid,text,text,text,text,text,date,timestamptz) to authenticated,service_role;
