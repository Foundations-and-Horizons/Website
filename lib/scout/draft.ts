import type { Prospect } from "./policy";

export type OutreachDraft = { prospectId: string; to: string; subject: string; body: string; kind: "initial" | "follow_up" };
export type DraftInputs = {
  organization: string;
  contactName: string | null;
  verifiedEmail: string;
  evidence: string;
  service: "volunteer_systems" | "operations_consulting" | "operations_build";
  signature: string;
  resourceUrl?: string;
};

function tidy(value: string): string { return value.replace(/\s+/g, " ").trim(); }
function safe(value: string): string { return tidy(value).slice(0, 600); }

export function prepareScoutDraft(prospect: Prospect, input: DraftInputs, kind: "initial" | "follow_up"): OutreachDraft {
  if (!input.signature.trim()) throw new Error("Signature required before creating Scout drafts");
  if (input.verifiedEmail.toLowerCase() !== prospect.contact_email?.toLowerCase())
    throw new Error("Recipient has not been verified");
  if (!input.evidence.trim() || !prospect.source_url) throw new Error("Specific sourced evidence required");
  const greeting = input.contactName?.trim() ? `Hi ${safe(input.contactName)},` : "Hello,";
  const offer = {
    volunteer_systems: "designing practical volunteer systems that are easier for small teams to run",
    operations_consulting: "helping nonprofit teams simplify operations and turn priorities into workable plans",
    operations_build: "building and handing off practical nonprofit operating systems"
  }[input.service];
  const subject = kind === "initial"
    ? `A practical operations idea for ${safe(input.organization)}`
    : `Following up — ${safe(input.organization)}`;
  const body = kind === "initial"
    ? `${greeting}\n\nI came across ${safe(input.organization)} and noticed ${safe(input.evidence)}. I don't want to assume what your team needs, but I thought there might be a useful conversation.\n\nThrough Foundations & Horizons, I focus on ${offer}. If that's relevant to your current priorities, would a brief conversation be worthwhile?\n\n${input.resourceUrl ? `Here's a free leadership discussion resource if useful: ${input.resourceUrl}\n\n` : ""}If this isn't relevant, just let me know and I won't follow up.\n\n${input.signature.trim()}`
    : `${greeting}\n\nJust following up once on my earlier note about practical operations support for ${safe(input.organization)}. If it's not a priority, no response is needed and I won't follow up again.\n\n${input.signature.trim()}`;
  return { prospectId: prospect.id, to: input.verifiedEmail, subject, body, kind };
}
