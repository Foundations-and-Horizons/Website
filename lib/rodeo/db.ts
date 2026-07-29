// Server-only data access for the Rodeo Road Log.

import type {
  ArenaMap,
  ArenaType,
  Category,
  Ground,
  Horse,
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
  entry_fee: number | null;
  video_link: string | null;
  notes: string | null;
  horse: string | null;
  placement: string | null;
  barrel1_notes: string | null;
  barrel2_notes: string | null;
  barrel3_notes: string | null;
  ground: string | null;
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
    entryFee: Number(r.entry_fee) || 0,
    videoLink: r.video_link ?? "",
    notes: r.notes ?? "",
    horse: r.horse ?? "",
    placement: r.placement ?? "",
    barrel1Notes: r.barrel1_notes ?? "",
    barrel2Notes: r.barrel2_notes ?? "",
    barrel3Notes: r.barrel3_notes ?? "",
    ground: (r.ground as Ground) || "",
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
    entry_fee: Number(r.entryFee) || 0,
    video_link: r.videoLink || "",
    notes: r.notes || "",
    horse: r.horse || "",
    placement: r.placement || "",
    barrel1_notes: r.barrel1Notes || "",
    barrel2_notes: r.barrel2Notes || "",
    barrel3_notes: r.barrel3Notes || "",
    ground: r.ground || "",
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
  const empty: RodeoData = { runs: [], stays: [], arenas: {}, horses: [] };
  const supabase = await getClient();
  if (!supabase) return empty;

  const [runsRes, staysRes, arenasRes, horsesRes] = await Promise.all([
    supabase.from("rodeo_runs").select("*"),
    supabase.from("rodeo_stays").select("*"),
    supabase.from("rodeo_arenas").select("*"),
    supabase.from("rodeo_horses").select("*"),
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
  const horses: Horse[] = (horsesRes.data as
    | { name: string; notes: string | null }[]
    | null)?.map((h) => ({ name: h.name, notes: h.notes ?? "" })) ?? [];

  return { runs, stays, arenas, horses };
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

export async function upsertHorse(horse: Horse): Promise<void> {
  const supabase = requireClient(await getClient());
  const { error } = await supabase
    .from("rodeo_horses")
    .upsert({ name: horse.name, notes: horse.notes });
  if (error) throw new Error(error.message);
}

export async function deleteHorse(name: string): Promise<void> {
  const supabase = requireClient(await getClient());
  const { error } = await supabase.from("rodeo_horses").delete().eq("name", name);
  if (error) throw new Error(error.message);
}

export type { Category, StayType };
