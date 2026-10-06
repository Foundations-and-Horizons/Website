create function public.crm_invoice_event(p_owner uuid,event jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r public.crm_records; i public.crm_invoices; a uuid; event_at timestamptz; v numeric;
begin
 if auth.uid() is not null and auth.uid()<>p_owner then raise exception 'Owner mismatch'; end if;
 if event->>'source' not in ('reply_watch','manual','reconciliation') then raise exception 'Invalid source'; end if;
 if event->>'event_type' not in ('invoice_sent','payment_received') then raise exception 'Invalid event type'; end if;
 if coalesce(event->>'event_id','')='' or coalesce(event->>'invoice_key','')='' or coalesce(event->>'summary','')='' then raise exception 'Missing invoice evidence'; end if;
 event_at:=(event->>'occurred_at')::timestamptz;
 if event_at is null or event_at>now()+interval '5 minutes' then raise exception 'Invalid event time'; end if;
 v:=(event->>'amount')::numeric;
 if v is null or v<=0 or v<>round(v,2) then raise exception 'Invalid amount'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 select * into r from public.crm_records where owner_id=p_owner and entity_key=event->>'entity_key' for update;
 if r.id is null or r.kind<>'client' then raise exception 'Match an existing client first'; end if;
 select * into i from public.crm_invoices where owner_id=p_owner and import_key=event->>'invoice_key' for update;
 if i.id is null then
  if event->>'event_type'<>'invoice_sent' or coalesce(event->>'label','')='' then raise exception 'Log the confirmed invoice before its payment'; end if;
  insert into public.crm_invoices(owner_id,record_id,import_key,label,amount,status,issued_on,due_on,notes)
  values(p_owner,r.id,event->>'invoice_key',event->>'label',v,'sent',(event->>'issued_on')::date,(event->>'due_on')::date,event->>'summary') returning * into i;
 end if;
 if i.record_id<>r.id or i.amount<>v or i.status='void' then raise exception 'Invoice mismatch; review manually'; end if;
 if event->>'event_type'='payment_received' and nullif(event->>'paid_on','') is null then raise exception 'Confirmed payment date required'; end if;
 insert into public.crm_activity(owner_id,record_id,source,event_id,event_type,summary,occurred_at,payload)
 values(p_owner,r.id,event->>'source',event->>'event_id',event->>'event_type',event->>'summary',event_at,event)
 on conflict(owner_id,event_id) do nothing returning id into a;
 if a is null then return i.id; end if;
 if event->>'event_type'='payment_received' and i.status<>'paid' then
  update public.crm_invoices set status='paid',paid_on=(event->>'paid_on')::date where id=i.id;
 end if;
 return i.id;
end $$;
revoke execute on function public.crm_invoice_event(uuid,jsonb) from public,anon;
grant execute on function public.crm_invoice_event(uuid,jsonb) to authenticated;
