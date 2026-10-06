export const kinds = ["client", "consulting", "speaking", "workshop"] as const;
export type Kind = typeof kinds[number];
export const stages = {
  client: ["preparing", "active", "review", "completed", "on_hold"],
  consulting: ["scouted", "contacted", "replied", "conversation", "proposal", "won", "declined", "on_hold"],
  speaking: ["scouted", "drafting", "submitted", "booked", "delivered", "declined", "on_hold"],
  workshop: ["planning", "registration", "delivered", "cancelled", "on_hold"],
} as const;
export const labels: Record<string, string> = {
  client: "Client delivery", consulting: "Consulting outreach", speaking: "Speaking", workshop: "Workshops",
  preparing: "Preparing for kickoff", active: "In progress", review: "Client review", completed: "Complete",
  scouted: "Scouted · not applied", contacted: "Email sent", replied: "Reply received", conversation: "Conversation", proposal: "Proposal",
  won: "Won", declined: "Declined", on_hold: "On hold", drafting: "Drafting", submitted: "Applied",
  booked: "Booked", delivered: "Delivered", planning: "Planning", registration: "Registration open", cancelled: "Cancelled",
};
export type RecordItem = { id: string; kind: Kind; organization: string; title: string; contact: string; email: string;
  stage: string; value: number | null; event_date: string | null; next_action: string; next_action_due: string | null;
  notes: string; source: string; needs_review: boolean; updated_at: string; import_key?: string | null };
export type Invoice = { id: string; record_id: string; label: string; amount: number; status: "draft" | "sent" | "paid" | "void";
  issued_on: string | null; due_on: string | null; paid_on: string | null; notes: string; updated_at: string; import_key?: string | null };
export type Task = { id: string; record_id: string | null; title: string; due_on: string | null; done: boolean; updated_at: string; import_key?: string | null };
export type Activity = { id: string; record_id: string | null; source: string; event_type: string; summary: string; occurred_at: string };
export type Workspace = { records: RecordItem[]; invoices: Invoice[]; tasks: Task[]; activity: Activity[] };
export function todayDenver(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T12:00:00Z")) : "No date set";
}
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const closed = (r: RecordItem) => ["declined", "completed", "delivered", "cancelled", "on_hold", "won"].includes(r.stage);
export function totals(data: Workspace) {
  return {
    clients: data.records.filter(r => r.kind === "client" && !closed(r)).length,
    applied: data.records.filter(r => r.kind === "speaking" && r.stage === "submitted").length,
    receivable: data.invoices.filter(i => i.status === "sent").reduce((s, i) => s + Number(i.amount), 0),
    paid: data.invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0),
    contracted: data.records.filter(r => r.kind === "client" && r.stage !== "on_hold").reduce((s,r) => s + Number(r.value || 0), 0),
  };
}
