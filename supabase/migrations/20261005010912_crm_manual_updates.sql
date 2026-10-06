alter table public.crm_activity alter column record_id drop not null;
create function public.crm_save_item(p_owner uuid,category text,p_id uuid,expected_at timestamptz,value jsonb) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare r public.crm_records; i public.crm_invoices; t public.crm_tasks; result_id uuid; link_id uuid; summary text;
begin
 if auth.uid() is null or auth.uid()<>p_owner then raise exception 'Sign in as the record owner'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_owner::text,0));
 if category='record' then
  r:=jsonb_populate_record(null::public.crm_records,value);
  if p_id is null then
   insert into public.crm_records(owner_id,kind,organization,title,contact,email,stage,value,event_date,next_action,next_action_due,notes,source,needs_review,entity_key,last_event_at)
   values(p_owner,r.kind,r.organization,r.title,r.contact,r.email,r.stage,r.value,r.event_date,r.next_action,r.next_action_due,r.notes,r.source,r.needs_review,
    r.kind||':'||lower(r.organization)||':'||lower(r.title),now()) returning id into result_id;
  else
   update public.crm_records set kind=r.kind,organization=r.organization,title=r.title,contact=r.contact,email=r.email,stage=r.stage,value=r.value,
    event_date=r.event_date,next_action=r.next_action,next_action_due=r.next_action_due,notes=r.notes,source=r.source,needs_review=r.needs_review,last_event_at=now()
   where owner_id=p_owner and id=p_id and updated_at=expected_at returning id into result_id;
  end if;
  link_id:=result_id;summary:='Relationship saved: '||r.organization||' · '||r.stage;
 elsif category='invoice' then
  i:=jsonb_populate_record(null::public.crm_invoices,value);
  if p_id is null then
   insert into public.crm_invoices(owner_id,record_id,label,amount,status,issued_on,due_on,paid_on,notes)
   values(p_owner,i.record_id,i.label,i.amount,i.status,i.issued_on,i.due_on,i.paid_on,i.notes) returning id into result_id;
  else
   update public.crm_invoices set record_id=i.record_id,label=i.label,amount=i.amount,status=i.status,issued_on=i.issued_on,due_on=i.due_on,paid_on=i.paid_on,notes=i.notes
   where owner_id=p_owner and id=p_id and updated_at=expected_at returning id into result_id;
  end if;
  link_id:=i.record_id;summary:='Invoice saved: '||i.label||' · '||i.status;
 elsif category='task' then
  t:=jsonb_populate_record(null::public.crm_tasks,value);
  if p_id is null then
   insert into public.crm_tasks(owner_id,record_id,title,due_on,done) values(p_owner,t.record_id,t.title,t.due_on,t.done) returning id into result_id;
  else
   update public.crm_tasks set record_id=t.record_id,title=t.title,due_on=t.due_on,done=t.done
   where owner_id=p_owner and id=p_id and updated_at=expected_at returning id into result_id;
  end if;
  link_id:=t.record_id;summary:='Task saved: '||t.title||case when t.done then ' · completed' else '' end;
 else raise exception 'Invalid category';
 end if;
 if result_id is null then raise exception 'Record changed since it was opened; refresh before saving'; end if;
 insert into public.crm_activity(owner_id,record_id,source,event_id,event_type,summary,occurred_at,payload)
 values(p_owner,link_id,'manual','manual:'||gen_random_uuid()::text,'manual_update',summary,now(),jsonb_build_object('category',category,'item_id',result_id));
 return result_id;
end $$;
revoke execute on function public.crm_save_item(uuid,text,uuid,timestamptz,jsonb) from public,anon;
grant execute on function public.crm_save_item(uuid,text,uuid,timestamptz,jsonb) to authenticated;
