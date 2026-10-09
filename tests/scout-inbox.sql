begin;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"fe82ef66-5ac1-41d7-b16c-ad2034281b73","role":"authenticated"}',true);
do $$
declare owner uuid:='fe82ef66-5ac1-41d7-b16c-ad2034281b73'; item uuid; rid uuid; second uuid; base_count int; payload jsonb; r public.scout_inbox; existing public.crm_records;
begin
 select count(*) into base_count from public.crm_records;
 payload:=jsonb_build_object('dedupe_key','test:scout-inbox:rollback','event_id','test:discovery:1','scout','test_scout','category','consulting','organization','Scout Inbox rollback test','title','Test only; never committed','fit_reason','Test preservation','source_url','https://example.com/test','discovered_at',now(),'contact',jsonb_build_object('email','unverified@example.com'),'notes','Original evidence');
 item:=public.scout_inbox_ingest(owner,payload);
 if public.scout_inbox_ingest(owner,payload)<>item then raise exception 'Replay changed identity';end if;
 if (select count(*) from public.crm_records)<>base_count then raise exception 'Ingest wrote CRM';end if;
 perform public.scout_inbox_review(owner,item,'Pass','Test reviewer','Reject test');
 second:=public.scout_inbox_ingest(owner,payload||jsonb_build_object('scout','other_scout','event_id','test:discovery:2','notes','Later evidence'));
 select * into r from public.scout_inbox where id=item;
 if second<>item or r.status<>'Pass' or r.seen_count<>2 or r.notes<>'Original evidence' then raise exception 'Dedupe/pass/original preservation failed';end if;
 perform public.scout_inbox_review(owner,item,'Hold','Test reviewer','Later');
 if (select count(*) from public.crm_records)<>base_count then raise exception 'Hold wrote CRM';end if;
 rid:=public.scout_inbox_review(owner,item,'Pursue','Test reviewer','Approved','consulting');
 if rid is null or (select count(*) from public.crm_records)<>base_count+1 then raise exception 'Pursue did not create one CRM record';end if;
 if (select email from public.crm_records where id=rid)<>'' then raise exception 'Unverified email promoted';end if;
 if public.scout_inbox_review(owner,item,'Pursue','Test reviewer','Retry','consulting')<>rid then raise exception 'Pursue replay changed record';end if;
 if (select count(*) from public.crm_records)<>base_count+1 or (select count(*) from public.crm_activity where event_id='scout-inbox:pursue:'||item::text)<>1 then raise exception 'Pursue duplicated CRM/event';end if;
 select * into existing from public.crm_records where owner_id=owner and id<>rid and entity_key is not null limit 1;
 payload:=payload||jsonb_build_object('dedupe_key','test:existing:rollback','event_id','test:existing:1','organization',existing.organization,'title',existing.title);
 item:=public.scout_inbox_ingest(owner,payload);
 if public.scout_inbox_review(owner,item,'Pursue','Test reviewer','Existing match',existing.kind,existing.entity_key)<>existing.id then raise exception 'Existing CRM match failed';end if;
 if (select count(*) from public.crm_records)<>base_count+1 then raise exception 'Existing match duplicated';end if;
 begin
  perform public.scout_inbox_ingest(gen_random_uuid(),payload);
  raise exception 'Cross-owner call succeeded';
 exception when others then
  if sqlerrm='Cross-owner call succeeded' then raise;end if;
 end;
 begin
  perform public.scout_inbox_review(owner,item,'Pass','Test reviewer','',null,null,null,'2000-01-01');
  raise exception 'Stale review succeeded';
 exception when others then
  if sqlerrm='Stale review succeeded' then raise;end if;
 end;
end $$;
-- Signed-in strangers cannot see Stephen's findings.
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',true);
do $$ begin if exists(select 1 from public.scout_inbox) then raise exception 'RLS leaked inbox';end if;end $$;
reset role;
select 'PASS: ingest/replay/Pass/Hold/Pursue/existing-match/unverified-email/stale-review/owner-RLS' as checks;
select has_table_privilege('anon','public.scout_inbox','SELECT') as anon_read,has_function_privilege('anon','public.scout_inbox_review(uuid,uuid,text,text,text,text,text,date,timestamptz)','EXECUTE') as anon_review;
rollback;
