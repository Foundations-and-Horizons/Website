create table public.crm_goals (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 first_year integer not null check(first_year between 2000 and 2200),
 first_target numeric(12,2) not null check(first_target>0),
 annual_target numeric(12,2) not null check(annual_target>0),
 take_home_aim numeric(12,2) not null check(take_home_aim>=0)
);
create table public.crm_other_income (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 label text not null check(length(trim(label)) between 1 and 250),
 amount numeric(12,2) not null check(amount>0),
 received_on date not null,
 reference text not null check(length(trim(reference)) between 1 and 250),
 unique(owner_id,reference)
);
create index crm_other_income_owner_date on public.crm_other_income(owner_id,received_on);
alter table public.crm_goals enable row level security;
alter table public.crm_other_income enable row level security;
create policy owner_goals on public.crm_goals for all to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy owner_income on public.crm_other_income for all to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
revoke all on public.crm_goals,public.crm_other_income from anon;
grant select,insert,update on public.crm_goals to authenticated;
grant select,insert,update on public.crm_other_income to authenticated;
alter publication supabase_realtime add table public.crm_goals,public.crm_other_income;
create function public.crm_log_other_income(p_owner uuid,p_label text,p_amount numeric,p_received_on date,p_reference text) returns uuid
language plpgsql security invoker set search_path=public,pg_temp as $$
declare new_id uuid;
begin
 if auth.uid() is not null and auth.uid()<>p_owner then raise exception 'Owner mismatch'; end if;
 if p_received_on is null or p_received_on>(now() at time zone 'America/Denver')::date then raise exception 'Income must already be received';end if;
 if p_amount is null or p_amount<=0 or p_amount<>round(p_amount,2) then raise exception 'Invalid amount';end if;
 insert into crm_other_income(owner_id,label,amount,received_on,reference)
 values(p_owner,trim(p_label),p_amount,p_received_on,trim(p_reference)) returning id into new_id;
 insert into crm_activity(owner_id,source,event_id,event_type,summary,occurred_at,payload)
 values(p_owner,'manual','income:'||new_id,'income_received','Other income received: '||trim(p_label),now(),jsonb_build_object('income_id',new_id,'reference',trim(p_reference)));
 return new_id;
end $$;
revoke execute on function public.crm_log_other_income(uuid,text,numeric,date,text) from public,anon;
grant execute on function public.crm_log_other_income(uuid,text,numeric,date,text) to authenticated;
