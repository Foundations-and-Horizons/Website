// Scout v1: deterministic safety policy. No email or database side effects.
export type Prospect = {
  id: string;
  organization_name: string;
  contact_email: string | null;
  source_url: string | null;
  fit_reason: string | null;
  status: string;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  gmail_thread_id: string | null;
};
export type Message = { prospect_id: string; kind: string; status: string; sent_at: string | null };
export type MailSignal = { replied: boolean; bounced: boolean; optedOut: boolean; uncertain: boolean };
export type ScoutDecision = { action: "hold" | "draft_initial" | "draft_follow_up"; reason: string };
const DAY = 86_400_000;
export function decideOutreach(
  prospect: Prospect,
  history: Message[],
  mail: MailSignal,
  now: Date,
  options: { pilotMode: boolean; capacityAvailable: boolean; excludedOrganizations: string[]; verifiedContactEmails: string[] }
): ScoutDecision {
  const hold = (reason: string): ScoutDecision => ({ action: "hold", reason });
  if (mail.uncertain) return hold("Gmail thread status uncertain");
  if (mail.replied || mail.bounced || mail.optedOut) return hold("Reply, bounce, or opt-out detected");
  if (options.excludedOrganizations.some(x => x.trim().toLowerCase() === prospect.organization_name.trim().toLowerCase()))
    return hold("Excluded organization");
  if (!options.capacityAvailable) return hold("Capacity reached: waitlist");
  if (!prospect.contact_email || !options.verifiedContactEmails.some(email => email.toLowerCase() === prospect.contact_email?.toLowerCase()) || !prospect.source_url || !prospect.fit_reason)
    return hold("Verified contact, source, and specific fit rationale required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prospect.contact_email)) return hold("Invalid contact email");
  if (!["new", "qualified", "pursue", "contacted"].includes(prospect.status.toLowerCase()))
    return hold("Prospect not eligible for outreach");
  const sent = history.filter(x => x.prospect_id === prospect.id && x.status === "sent");
  if (sent.some(x => x.kind === "follow_up")) return hold("Maximum one follow-up");
  if (!sent.some(x => x.kind === "initial")) return { action: "draft_initial", reason: options.pilotMode ? "Pilot: draft only" : "Ready for controlled send" };
  if (!prospect.gmail_thread_id) return hold("Cannot verify Gmail thread");
  const last = prospect.last_contact_at && Date.parse(prospect.last_contact_at);
  if (!last || !Number.isFinite(last) || now.getTime() - last < 7 * DAY) return hold("Seven-day waiting period");
  if (prospect.next_follow_up_at && Date.parse(prospect.next_follow_up_at) > now.getTime()) return hold("Follow-up not due");
  return { action: "draft_follow_up", reason: options.pilotMode ? "Pilot: draft only" : "Ready for controlled send" };
}
