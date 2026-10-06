import { kinds, stages, type Kind } from "./model";
export function textField(value: unknown, max = 10000) {
  if (typeof value !== "string" || value.length > max) throw new Error("Please check the text fields.");
  return value.trim();
}
export function dateField(value: unknown): string | null {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value + "T12:00:00Z").toISOString().slice(0,10) !== value) throw new Error("Please enter a valid date.");
  return value;
}
export function amountField(value: unknown, nullable = false): number | null {
  if (nullable && (value === null || value === "")) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 999999999 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001) throw new Error("Please enter a non-negative amount with at most two decimal places.");
  return value;
}
export function uuid(value: unknown) {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new Error("Invalid record.");
  return value;
}
export function recordFields(input: Record<string, unknown>) {
  const kind = input.kind as Kind;
  if (!kinds.includes(kind) || !(stages[kind] as readonly string[]).includes(String(input.stage))) throw new Error("Choose a valid category and status.");
  const organization = textField(input.organization, 250), title = textField(input.title, 250), email = textField(input.email, 250);
  if (!organization || !title) throw new Error("Organization and title are required.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please check the email address.");
  return { kind, organization, title, email, contact: textField(input.contact,250), stage: String(input.stage), value: amountField(input.value,true),
    event_date: dateField(input.event_date), next_action: textField(input.next_action,1000), next_action_due: dateField(input.next_action_due),
    notes: textField(input.notes), source: textField(input.source,1000), needs_review: input.needs_review !== false };
}
