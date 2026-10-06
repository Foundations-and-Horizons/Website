"use server";
import { session, workspace } from "@/lib/crm/data";
import { recordFields, textField, dateField, amountField, uuid } from "@/lib/crm/validation";
import { revalidatePath } from "next/cache";
export async function loadWorkspace() { return workspace(); }
export async function saveRecord(input: Record<string,unknown>) {
  const { db, owner } = await session();
  const fields = recordFields(input);
  const result=await db.rpc("crm_save_item",{p_owner:owner,category:"record",p_id:input.id?uuid(input.id):null,expected_at:input.id?textField(input.updated_at):null,value:fields});
  if(result.error) throw new Error(input.id ? "This record changed or could not be saved. Refresh and try again." : "Could not create this record. Check for an existing match and try again.");
  revalidatePath("/dashboard"); return workspace();
}
export async function saveInvoice(input: Record<string,unknown>) {
  const { db,owner } = await session();
  const status = String(input.status);
  if(!["draft","sent","paid","void"].includes(status)) throw new Error("Choose a valid invoice status.");
  const label=textField(input.label,250),paid_on=dateField(input.paid_on);
  if(!label || (status==="paid" && !paid_on) || (status!=="paid" && paid_on)) throw new Error("Paid invoices need a payment date; other invoices must leave it blank.");
  const fields={record_id:uuid(input.record_id),label,amount:amountField(input.amount),status,issued_on:dateField(input.issued_on),due_on:dateField(input.due_on),paid_on,notes:textField(input.notes)};
  const result=await db.rpc("crm_save_item",{p_owner:owner,category:"invoice",p_id:input.id?uuid(input.id):null,expected_at:input.id?textField(input.updated_at):null,value:fields});
  if(result.error) throw new Error("Invoice could not be saved, or it changed since you opened it. Refresh and try again.");
  revalidatePath("/dashboard"); return workspace();
}
export async function saveTask(input: Record<string,unknown>) {
  const {db,owner}=await session();
  const title=textField(input.title,1000); if(!title) throw new Error("Enter a task title.");
  const fields={title,record_id:input.record_id?uuid(input.record_id):null,due_on:dateField(input.due_on),done:input.done===true};
  const result=await db.rpc("crm_save_item",{p_owner:owner,category:"task",p_id:input.id?uuid(input.id):null,expected_at:input.id?textField(input.updated_at):null,value:fields});
  if(result.error) throw new Error("Task could not be saved, or it changed. Refresh and try again.");
  return workspace();
}
