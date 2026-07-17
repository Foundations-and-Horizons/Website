// Server-only data access for the Rodeo Road Log.
//
// Reuses the site's existing Supabase env (NEXT_PUBLIC_SUPABASE_URL +
// SUPABASE_SERVICE_ROLE_KEY). All access goes through the service-role key on
// the server, guarded by the family-password check in the Server Actions —
// the rodeo_* tables have RLS enabled with no policies, so the public anon
// key cannot touch them.
//
// If the env isn't configured (e.g. local dev without secrets), reads return
// empty data and writes throw a clear error, so the UI still renders.

import type {
  ArenaMap,
  ArenaType,
  Category,
  RodeoData,
  Run,
  Stay,
  StayType,
} from "./types";

export function isConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── row <-> app mappers ──────────────────────────────────────────────────────

type RunRow = {
  id: string;
  run_date: string | null;
  event: string;
  arena: string;
  category: string;
  run_time: number | null;
  earnings: number | null;
  video_link: string | null;
  notes: string | null;
};

function rowToRun(r: RunRow): Run {
  return {
    id: r.id,
    date: r.run_date ?? "",
    event: r.event ?? "",
    arena: r.arena ?? "",
    category: (r.category as Category) || "jackpot",
    time: r.run_time == null ? "" : String(r.run_time),
    earnings: Number(r.earnings) || 0,
    videoLink: r.video_link ?? "",
    notes: r.notes ?? "",
  };
}

function runToRow(r: Run) {
  return {
    id: r.id,
    run_date: r.date || null,
    event: r.event,
    arena: r.arena,
    category: r.category,
    run_time: r.time === "" || r.time == null ? null : Number(r.time),
    earnings: Number(r.earnings) || 0,
    video_link: r.videoLink || "",
    notes: r.notes || "",
  };
}

type StayRow = {
  id: string;
  start_date: string | null;
  end_date: string | null;
  type: string;
  name: string;
  arena: string | null;
  ada: boolean | null;
  rating: number | null;
  notes: string | null;
};

function rowToStay(s: StayRow): Stay {
  return {
    id: s.id,
    startDate: s.start_date ?? "",
    endDate: s.end_date ?? "",
    type: (s.type as StayType) || "hotel",
    name: s.name ?? "",
    arena: s.arena ?? "",
    ada: !!s.ada,
    rating: Number(s.rating) || 0,
    notes: s.notes ?? "",
  };
}

function stayToRow(s: Stay) {
  return {
    id: s.id,
    start_date: s.startDate || null,
    end_date: s.endDate || null,
    type: s.type,
    name: s.name,
    arena: s.arena || "",
    ada: !!s.ada,
    rating: Number(s.rating) || 0,
    notes: s.notes || "",
  };
}

// ── reads ────────────────────────────────────────────────────────────────────

export async function fetchAll(): Promise<RodeoData> {
  const empty: RodeoData = { runs: [], stays: [], arenas: {} };
  const supabase = await getClient();
  if (!supabase) return empty;

  const [runsRes, staysRes, arenasRes] = await Promise.all([
    supabase.from("rodeo_runs").select("*"),
    supabase.from("rodeo_stays").select("*"),
    supabase.from("rodeo_arenas").select("*"),
  ]);

  const runs = (runsRes.data as RunRow[] | null)?.map(rowToRun) ?? [];
  const stays = (staysRes.data as StayRow[] | null)?.map(rowToStay) ?? [];
  const arenas: ArenaMap = {};
  for (const a of (arenasRes.data as
    | { name: string; type: string | null; notes: string | null }[]
    | null) ?? []) {
    arenas[a.name] = {
      type: (a.type as ArenaType) || "",
      notes: a.notes ?? "",
    };
  }
  return { runs, stays, arenas };
}

// ── writes ───────────────────────────────────────────────────────────────────

function requireClient(supabase: Awaited<ReturnType<typeof getClient>>) {
  if (!supabase) {
    throw new Error(
      "The rodeo database isn't configured yet. Add the Supabase env vars and run the setup SQL."
    );
  }
  return supabase;
}

export async function upsertRun(run: Run): Promise<Run> {
  const supabase = requireClient(await getClient());
  const { data, error } = await supabase
    .from("rodeo_runs")
    .upsert(runToRow(run))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToRun(data as RunRow);
}

export async function deleteRun(id: string): Promise<void> {
  const supabase = requireClient(await getClient());
  const { error } = await supabase.from("rodeo_runs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertStay(stay: Stay): Promise<Stay> {
  const supabase = requireClient(await getClient());
  const { data, error } = await supabase
    .from("rodeo_stays")
    .upsert(stayToRow(stay))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToStay(data as StayRow);
}

export async function deleteStay(id: string): Promise<void> {
  const supabase = requireClient(await getClient());
  const { error } = await supabase.from("rodeo_stays").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertArena(
  name: string,
  type: ArenaType,
  notes: string
): Promise<void> {
  const supabase = requireClient(await getClient());
  const { error } = await supabase
    .from("rodeo_arenas")
    .upsert({ name, type, notes });
  if (error) throw new Error(error.message);
}

export type { Category, StayType };
