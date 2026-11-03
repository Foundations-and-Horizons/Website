import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Message, Prospect } from "./policy";

// Read-only repository adapter. Never use a public anon key for Scout operations.
function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Scout database credentials are not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function loadScoutCandidates(limit = 5): Promise<Prospect[]> {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 25) throw new Error("Invalid candidate limit");
  const { data, error } = await client()
    .from("prospects")
    .select("id,organization_name,contact_email,source_url,fit_reason,status,last_contact_at,next_follow_up_at,gmail_thread_id")
    .in("status", ["new", "qualified", "pursue", "contacted"])
    .order("score", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Scout candidates unavailable: ${error.message}`);
  return (data ?? []) as Prospect[];
}

export async function loadOutreachHistory(prospectIds: string[]): Promise<Message[]> {
  if (!prospectIds.length) return [];
  if (prospectIds.length > 25) throw new Error("Too many prospects");
  const { data, error } = await client()
    .from("outreach_messages")
    .select("prospect_id,kind,status,sent_at")
    .in("prospect_id", prospectIds);
  if (error) throw new Error(`Scout outreach history unavailable: ${error.message}`);
  return (data ?? []) as Message[];
}
