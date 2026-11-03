import { decideOutreach, type Prospect, type Message, type MailSignal } from "./policy";
import { prepareScoutDraft, type DraftInputs, type OutreachDraft } from "./draft";

export type CandidateReview = {
  prospectId: string;
  organization: string;
  action: "hold" | "draft_initial" | "draft_follow_up";
  reason: string;
  draft?: OutreachDraft;
};
export type PilotInputs = {
  prospects: Prospect[];
  history: Message[];
  signalsByProspect: Record<string, MailSignal>;
  draftInputsByProspect: Record<string, DraftInputs>;
  verifiedContactEmails: string[];
  excludedOrganizations: string[];
  capacityAvailable: boolean;
  now: Date;
};

// Deliberately pure and draft-only. This function cannot send mail, create drafts,
// update the CRM, or write to Supabase. Gmail signals must come from a verified source.
export function reviewScoutPilot(input: PilotInputs): CandidateReview[] {
  if (input.prospects.length > 5) throw new Error("Pilot limited to five prospects");
  return input.prospects.map(prospect => {
    const signal = input.signalsByProspect[prospect.id];
    if (!signal) return { prospectId: prospect.id, organization: prospect.organization_name, action: "hold", reason: "No verified Gmail history check" };
    const decision = decideOutreach(prospect, input.history, signal, input.now, {
      pilotMode: true,
      capacityAvailable: input.capacityAvailable,
      excludedOrganizations: input.excludedOrganizations,
      verifiedContactEmails: input.verifiedContactEmails
    });
    const base = { prospectId: prospect.id, organization: prospect.organization_name, action: decision.action, reason: decision.reason };
    if (decision.action === "hold") return base;
    const details = input.draftInputsByProspect[prospect.id];
    if (!details) return { ...base, action: "hold" as const, reason: "Missing reviewed research and signature" };
    try {
      const draft = prepareScoutDraft(prospect, details, decision.action === "draft_initial" ? "initial" : "follow_up");
      return { ...base, draft };
    } catch (error) {
      return { ...base, action: "hold" as const, reason: error instanceof Error ? error.message : "Draft validation failed" };
    }
  });
}
