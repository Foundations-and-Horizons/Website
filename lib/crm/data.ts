import "server-only";
import { createClient } from "@/lib/supabase/server";
import { type Workspace, type RecordItem, type Invoice, type Task, type Activity } from "./model";
export async function session() {
  const db = await createClient();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) throw new Error("Please sign in to your private workspace.");
  return { db, owner: user.id };
}
export async function workspace(): Promise<Workspace> {
  const { db, owner } = await session();
  const results = await Promise.all([
    db.from("crm_records").select("*").eq("owner_id",owner).order("updated_at",{ascending:false}),
    db.from("crm_invoices").select("*").eq("owner_id",owner).order("issued_on",{ascending:false}),
    db.from("crm_tasks").select("*").eq("owner_id",owner).order("due_on",{nullsFirst:false}),
    db.from("crm_activity").select("id,record_id,source,event_type,summary,occurred_at").eq("owner_id",owner).order("occurred_at",{ascending:false}).limit(100),
  ]);
  if(results.some(r=>r.error)) throw new Error("The CRM could not load. Your records have not been changed. Try refreshing or check the database connection.");
  return { records: results[0].data as RecordItem[], invoices: results[1].data as Invoice[], tasks: results[2].data as Task[], activity: results[3].data as Activity[] };
}
