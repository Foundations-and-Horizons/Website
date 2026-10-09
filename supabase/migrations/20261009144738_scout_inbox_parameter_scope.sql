create or replace function public.scout_inbox_ingest(p_owner uuid,finding jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
#variable_conflict use_variable
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

