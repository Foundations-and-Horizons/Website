"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  saveRunAction,
  deleteRunAction,
  saveStayAction,
  deleteStayAction,
  saveArenaAction,
  logoutAction,
} from "./actions";
import type {
  ArenaMap,
  ArenaType,
  Category,
  Run,
  Stay,
  StayType,
} from "@/lib/rodeo/types";

/* ── icons (lucide-style) ─────────────────────────────────────────────────── */
const ICON: Record<string, string> = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  timer:
    '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  mappin:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  hotel:
    '<path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>',
  tent: '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>',
  video:
    '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  accessibility:
    '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-3.72-6.5"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  trash:
    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  pencil:
    '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  sort: '<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  building:
    '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  trophy:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  logout:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
};
function Icon({
  name,
  size = 18,
  color = "currentColor",
  fill = "none",
}: {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICON[name] }}
    />
  );
}

/* ── helpers ──────────────────────────────────────────────────────────────── */
let seq = 0;
function uid() {
  return "id" + Date.now().toString(36) + (seq++).toString(36);
}
function fmtTime(sec: string | number) {
  if (sec === "" || sec == null || isNaN(Number(sec))) return "--";
  return Number(sec).toFixed(2);
}
function fmtMoney(n: number) {
  return "$" + (Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}
function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function catLabel(c: Category) {
  return c === "college" ? "College Rodeo" : "Jackpot";
}
function catClass(c: Category) {
  return c === "college" ? "gold" : "rustc";
}

/* ── styles (scoped under .rr-root) ───────────────────────────────────────── */
const STAR =
  "<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/>";
const starSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='104' height='104' viewBox='0 0 104 104'><g fill='#FFF6E6' fill-opacity='0.11'><g transform='translate(9,13) scale(0.52)'>${STAR}</g><g transform='translate(66,40) scale(0.8)'>${STAR}</g><g transform='translate(40,78) scale(0.44)'>${STAR}</g></g></svg>`;
const noiseSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='l'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(#l)' opacity='0.4'/></svg>";
const starUri = `data:image/svg+xml,${encodeURIComponent(starSvg)}`;
const noiseUri = `data:image/svg+xml,${encodeURIComponent(noiseSvg)}`;

const CSS = `
.rr-root{--cream:#F3EBDC;--charcoal:#2A211B;--leather:#5C3A21;--rust:#BE4B23;--gold:#D99A3D;--teal:#2E8B8B;--denim:#3D5A73;--money:#3E7C4F;--card:#E8D7B9;
  --fd:'Arial Narrow','Helvetica Neue Condensed',Impact,system-ui,sans-serif;--fb:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--fm:ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace;
  min-height:100vh;color:var(--charcoal);font-family:var(--fb);
  background-color:#5CC3B6;background-image:url("${starUri}"),linear-gradient(180deg,#6FD0C4 0%,#46B5A8 100%);background-repeat:repeat,no-repeat;background-size:104px 104px,cover;background-attachment:fixed,fixed;}
.rr-root *{box-sizing:border-box;}
.rr-root button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.rr-root a{color:inherit;text-decoration:none;}
.rr-root .fd{font-family:var(--fd);font-weight:800;letter-spacing:.01em;}
.rr-root .fm{font-family:var(--fm);}
.rr-root .wrap{max-width:680px;margin:0 auto;padding:16px;}
.rr-root .row{display:flex;align-items:center;}
.rr-root .between{justify-content:space-between;}
.rr-root .gap2{gap:8px;}.rr-root .gap4{gap:16px;}
.rr-root .grow{flex:1;}
.rr-root .wrapf{flex-wrap:wrap;}
.rr-root .hide-sm{display:none;}
@media(min-width:640px){.rr-root .hide-sm{display:inline;}}
.rr-root .topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--charcoal);border-bottom:4px double var(--gold);box-shadow:0 4px 14px rgba(0,0,0,.22);}
.rr-root .brand{font-family:var(--fd);font-weight:800;font-size:26px;letter-spacing:.03em;color:var(--cream);cursor:pointer;}
.rr-root .tabs{display:flex;gap:4px;align-items:center;}
.rr-root .tab{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;font-size:14px;font-weight:700;color:#C9BFAE;transition:background .15s,color .15s;}
.rr-root .tab.active{background:var(--rust);color:var(--cream);}
.rr-root .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 16px;margin-top:-32px;position:relative;z-index:10;}
@media(min-width:640px){.rr-root .stats{grid-template-columns:repeat(4,1fr);}}
.rr-root .pill{display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid rgba(217,154,61,.2);border-radius:18px;padding:14px 10px;box-shadow:0 6px 18px rgba(42,33,27,.12);}
.rr-root .pill .num{font-family:var(--fm);font-size:22px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums;line-height:1;}
.rr-root .pill .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--leather);margin-top:4px;text-align:center;}
.rr-root .hero{position:relative;width:100%;height:52vh;min-height:300px;overflow:hidden;}
.rr-root .hero img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block;}
.rr-root .hero .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,33,27,0) 30%,rgba(42,33,27,.85) 92%);}
.rr-root .hero .cap{position:absolute;left:0;right:0;bottom:0;padding:0 20px 26px;}
.rr-root .hero h1{font-family:var(--fd);font-weight:800;font-size:52px;line-height:.92;color:var(--cream);margin:0;text-shadow:0 2px 12px rgba(0,0,0,.4);}
.rr-root .hero p{margin:8px 0 0;color:#E9DEC9;font-size:15px;max-width:34ch;}
@media(min-width:640px){.rr-root .hero h1{font-size:64px;}}
.rr-root .navgrid{display:grid;gap:12px;padding:24px 16px 48px;}
@media(min-width:640px){.rr-root .navgrid{grid-template-columns:repeat(3,1fr);}}
.rr-root .navcard{display:flex;align-items:center;gap:16px;border-radius:18px;padding:16px;text-align:left;box-shadow:0 3px 10px rgba(42,33,27,.1);transition:box-shadow .15s,transform .15s;}
.rr-root .navcard:hover{box-shadow:0 10px 24px rgba(42,33,27,.18);transform:translateY(-2px);}
.rr-root .navcard .badge{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex:none;}
.rr-root .navcard .t{font-family:var(--fd);font-weight:800;font-size:20px;line-height:1.05;}
.rr-root .navcard .s{font-size:12px;color:var(--leather);margin-top:2px;}
.rr-root .card{position:relative;border:2px solid rgba(217,154,61,.2);border-radius:18px;padding:16px;box-shadow:0 3px 10px rgba(42,33,27,.1);}
.rr-root .card::after{content:"";position:absolute;inset:5px;border:2px dashed rgba(46,139,139,.6);border-radius:13px;pointer-events:none;}
.rr-root .card,.rr-root .pill,.rr-root .navcard,.rr-root .sheet,.rr-root .sheet .head{background-color:var(--card);background-image:url("${noiseUri}");background-blend-mode:soft-light;}
.rr-root .list{display:flex;flex-direction:column;gap:12px;}
.rr-root .grid2{display:grid;gap:12px;}
@media(min-width:640px){.rr-root .grid2{grid-template-columns:repeat(2,1fr);}}
.rr-root .title{font-family:var(--fd);font-weight:800;font-size:26px;}
.rr-root .muted{color:var(--leather);}
.rr-root .chip{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;}
.rr-root .chip.denim{background:rgba(61,90,115,.16);color:var(--denim);}
.rr-root .chip.teal{background:rgba(46,139,139,.18);color:var(--teal);}
.rr-root .chip.gold{background:rgba(217,154,61,.28);color:#7d5a17;}
.rr-root .chip.rustc{background:rgba(190,75,35,.18);color:var(--rust);}
.rr-root .chip.money{background:rgba(62,124,79,.2);color:var(--money);}
.rr-root .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.rr-root .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:999px;font-weight:700;font-size:14px;padding:9px 16px;color:#fff;transition:filter .15s;white-space:nowrap;flex:none;}
.rr-root .btn:hover{filter:brightness(1.06);}
.rr-root .btn.rust{background:var(--rust);}.rr-root .btn.denim{background:var(--denim);}.rr-root .btn.teal{background:var(--teal);}
.rr-root .btn-block{width:100%;padding:13px;border-radius:999px;font-weight:800;font-size:15px;color:#fff;border:none;}
.rr-root .icon-btn{padding:7px;border-radius:999px;background:var(--cream);display:inline-flex;}
.rr-root .selectlike{font-size:14px;border-radius:999px;padding:7px 13px;border:2px solid rgba(217,154,61,.4);background:#fff;color:var(--leather);}
.rr-root .empty{text-align:center;padding:56px 0;color:var(--leather);}
.rr-root .empty .title{margin-top:8px;}
.rr-root .time{font-family:var(--fm);font-size:26px;font-weight:700;color:var(--rust);line-height:1;font-variant-numeric:tabular-nums;}
.rr-root .tny{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--leather);}
.rr-root .overlay{position:fixed;inset:0;z-index:30;background:rgba(42,33,27,.55);display:flex;align-items:flex-end;justify-content:center;}
@media(min-width:640px){.rr-root .overlay{align-items:center;padding:16px;}}
.rr-root .sheet{width:100%;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;}
@media(min-width:640px){.rr-root .sheet{max-width:520px;border-radius:20px;}}
.rr-root .sheet .head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:2px solid rgba(217,154,61,.3);}
.rr-root .sheet .body{padding:20px;}
.rr-root .field{margin-bottom:16px;}
.rr-root .field>label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--leather);margin-bottom:6px;}
.rr-root .inp{width:100%;padding:10px 12px;border-radius:10px;border:2px solid rgba(217,154,61,.5);background:#fff;font-size:15px;color:var(--charcoal);}
.rr-root textarea.inp{min-height:72px;resize:vertical;}
.rr-root .seg{display:flex;gap:8px;flex-wrap:wrap;}
.rr-root .seg button{flex:1;min-width:120px;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:12px;font-weight:700;font-size:14px;border:2px solid rgba(92,58,33,.25);background:#fff;color:var(--leather);}
.rr-root .seg.teal button.on{background:var(--teal);color:#fff;border-color:var(--teal);}
.rr-root .seg.denim button.on{background:var(--denim);color:#fff;border-color:var(--denim);}
.rr-root .seg.rust button.on{background:var(--rust);color:#fff;border-color:var(--rust);}
.rr-root .stars{display:flex;gap:4px;}
.rr-root .stars button{padding:2px;}
.rr-root .toggle{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border-radius:12px;font-weight:700;font-size:14px;border:2px solid rgba(61,90,115,.35);background:#fff;color:var(--leather);}
.rr-root .toggle.on{background:var(--denim);color:#fff;}
.rr-root .prefix{position:relative;}
.rr-root .prefix>span{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--leather);font-weight:700;}
.rr-root .prefix>input{padding-left:26px;}
.rr-root .line2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.rr-root .substay{display:flex;align-items:center;gap:8px;background:var(--cream);border-radius:12px;padding:8px 12px;}
.rr-root .toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:40;background:var(--rust);color:#fff;font-size:14px;font-weight:600;padding:10px 16px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;}
`;

/* ── form types ───────────────────────────────────────────────────────────── */
type RunForm = {
  id: string;
  date: string;
  event: string;
  arena: string;
  arenaType: ArenaType;
  category: Category;
  time: string;
  earnings: string;
  videoLink: string;
  notes: string;
};
type StayForm = {
  id: string;
  startDate: string;
  endDate: string;
  type: StayType;
  name: string;
  arena: string;
  ada: boolean;
  rating: number;
  notes: string;
};
type ArenaDetailForm = { note: string; type: ArenaType };
type ArenaNewForm = { name: string; type: ArenaType };
type Modal =
  | { kind: "run"; editing: boolean }
  | { kind: "arenaDetail"; name: string }
  | { kind: "arenaNew" }
  | { kind: "travel"; editing: boolean }
  | null;

const TABS: [string, string, string][] = [
  ["home", "Home", "home"],
  ["runs", "Runs", "timer"],
  ["arenas", "Arenas", "mappin"],
  ["travel", "Travel", "hotel"],
];

export default function RodeoApp({
  initialRuns,
  initialStays,
  initialArenas,
  initialView = "home",
}: {
  initialRuns: Run[];
  initialStays: Stay[];
  initialArenas: ArenaMap;
  initialView?: string;
}) {
  const [view, setView] = useState<string>(initialView);
  const [runs, setRuns] = useState<Run[]>(initialRuns);
  const [stays, setStays] = useState<Stay[]>(initialStays);
  const [arenaInfo, setArenaInfo] = useState<ArenaMap>(initialArenas);
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState<RunForm | StayForm | ArenaDetailForm | ArenaNewForm | null>(null);
  const [runFilter, setRunFilter] = useState("all");
  const [runCat, setRunCat] = useState("all");
  const [runSort, setRunSort] = useState("date-desc");
  const [err, setErr] = useState<string | null>(null);

  const arenas = useMemo(() => {
    const set = new Set<string>();
    runs.forEach((r) => r.arena && set.add(r.arena));
    Object.keys(arenaInfo).forEach((a) => set.add(a));
    return Array.from(set).sort();
  }, [runs, arenaInfo]);

  const arenaType = (name: string): ArenaType => arenaInfo[name]?.type || "";
  const arenaNotesOf = (name: string): string => arenaInfo[name]?.notes || "";
  const bestByType = (type: ArenaType) => {
    const t = runs
      .filter((r) => arenaType(r.arena) === type)
      .map((r) => Number(r.time))
      .filter((n) => !isNaN(n) && n > 0);
    return t.length ? Math.min(...t) : null;
  };
  const totalWon = runs.reduce((s, r) => s + (Number(r.earnings) || 0), 0);
  const staysForArena = (name: string) => stays.filter((s) => s.arena === name);

  async function persist(fn: () => Promise<void>, revert: () => void) {
    try {
      await fn();
    } catch (e) {
      revert();
      setErr(
        e instanceof Error && e.message !== "Unauthorized"
          ? e.message
          : "Couldn't save — check your connection and try again."
      );
    }
  }

  function closeModal() {
    setModal(null);
    setForm(null);
  }

  /* ── run handlers ── */
  function newRun() {
    setForm({
      id: uid(),
      date: "",
      event: "",
      arena: "",
      arenaType: "outdoor",
      category: "jackpot",
      time: "",
      earnings: "",
      videoLink: "",
      notes: "",
    });
    setModal({ kind: "run", editing: false });
  }
  function editRun(r: Run) {
    setForm({
      id: r.id,
      date: r.date,
      event: r.event,
      arena: r.arena,
      arenaType: arenaType(r.arena) || "outdoor",
      category: r.category,
      time: r.time,
      earnings: r.earnings ? String(r.earnings) : "",
      videoLink: r.videoLink,
      notes: r.notes,
    });
    setModal({ kind: "run", editing: true });
  }
  function saveRun() {
    const f = form as RunForm;
    if (!f.event || !f.arena) return;
    const run: Run = {
      id: f.id,
      date: f.date,
      event: f.event,
      arena: f.arena,
      category: f.category,
      time: f.time,
      earnings: Number(f.earnings) || 0,
      videoLink: f.videoLink,
      notes: f.notes,
    };
    const prevRuns = runs;
    const prevArenas = arenaInfo;
    const existingNotes = arenaNotesOf(run.arena);
    setRuns((rs) => (rs.some((r) => r.id === run.id) ? rs.map((r) => (r.id === run.id ? run : r)) : [...rs, run]));
    if (f.arenaType) {
      setArenaInfo((a) => ({ ...a, [run.arena]: { type: f.arenaType, notes: existingNotes } }));
    }
    closeModal();
    persist(
      async () => {
        await saveRunAction(run);
        if (f.arenaType) await saveArenaAction(run.arena, f.arenaType, existingNotes);
      },
      () => {
        setRuns(prevRuns);
        setArenaInfo(prevArenas);
      }
    );
  }
  function removeRun(id: string) {
    const prev = runs;
    setRuns((rs) => rs.filter((r) => r.id !== id));
    persist(() => deleteRunAction(id), () => setRuns(prev));
  }

  /* ── arena handlers ── */
  function openArena(name: string) {
    setForm({ note: arenaNotesOf(name), type: arenaType(name) });
    setModal({ kind: "arenaDetail", name });
  }
  function newArena() {
    setForm({ name: "", type: "outdoor" });
    setModal({ kind: "arenaNew" });
  }
  function saveArenaDetail() {
    if (modal?.kind !== "arenaDetail") return;
    const f = form as ArenaDetailForm;
    const name = modal.name;
    const prev = arenaInfo;
    setArenaInfo((a) => ({ ...a, [name]: { type: f.type, notes: f.note } }));
    closeModal();
    persist(() => saveArenaAction(name, f.type, f.note), () => setArenaInfo(prev));
  }
  function addArena() {
    const f = form as ArenaNewForm;
    const name = (f.name || "").trim();
    if (!name) return;
    const notes = arenaNotesOf(name);
    const prev = arenaInfo;
    setArenaInfo((a) => ({ ...a, [name]: { type: f.type, notes } }));
    closeModal();
    persist(() => saveArenaAction(name, f.type, notes), () => setArenaInfo(prev));
  }

  /* ── stay handlers ── */
  function newStay() {
    setForm({
      id: uid(),
      startDate: "",
      endDate: "",
      type: "hotel",
      name: "",
      arena: "",
      ada: false,
      rating: 0,
      notes: "",
    });
    setModal({ kind: "travel", editing: false });
  }
  function editStay(s: Stay) {
    setForm({ ...s });
    setModal({ kind: "travel", editing: true });
  }
  function saveStay() {
    const f = form as StayForm;
    if (!f.name) return;
    const stay: Stay = { ...f };
    const prev = stays;
    setStays((ss) => (ss.some((s) => s.id === stay.id) ? ss.map((s) => (s.id === stay.id ? stay : s)) : [...ss, stay]));
    closeModal();
    persist(() => saveStayAction(stay).then(() => undefined), () => setStays(prev));
  }
  function removeStay(id: string) {
    const prev = stays;
    setStays((ss) => ss.filter((s) => s.id !== id));
    persist(() => deleteStayAction(id), () => setStays(prev));
  }

  function upd<T>(patch: Partial<T>) {
    setForm(
      (f) =>
        ({ ...(f as object), ...patch }) as unknown as
          | RunForm
          | StayForm
          | ArenaDetailForm
          | ArenaNewForm
    );
  }

  /* ── views ── */
  const nav = (id: string) => {
    setView(id);
    closeModal();
  };

  const topBar = (current: string) => {
    return (
      <div className="topbar">
        <div className="brand" onClick={() => nav("home")}>
          RODEO ROAD LOG
        </div>
        <div className="tabs">
          {TABS.map(([id, label, ic]) => {
            const on = current === id;
            return (
              <button key={id} className={"tab" + (on ? " active" : "")} onClick={() => nav(id)}>
                <Icon name={ic} size={15} color={on ? "#F3EBDC" : "#C9BFAE"} />
                <span className="hide-sm">{label}</span>
              </button>
            );
          })}
          <form action={logoutAction} style={{ display: "flex" }}>
            <button className="tab" type="submit" title="Sign out" aria-label="Sign out">
              <Icon name="logout" size={15} color="#C9BFAE" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pill = ({ label, value, ic, color }: { label: string; value: ReactNode; ic: string; color?: string }) => {
    return (
      <div className="pill">
        <Icon name={ic} size={20} color="var(--rust)" />
        <div className="num" style={color ? { color } : undefined}>
          {value}
        </div>
        <div className="lbl">{label}</div>
      </div>
    );
  }

  const bo = bestByType("outdoor");
  const bi = bestByType("indoor");

  const homeCards: [string, string, string, string, string][] = [
    ["runs", "Log a run", "Times, category, winnings", "timer", "var(--rust)"],
    ["arenas", "Arenas", "Indoor/outdoor & notes", "mappin", "var(--denim)"],
    ["travel", "On the road", "Hotels & campgrounds", "hotel", "var(--teal)"],
  ];

  const filteredRuns = runs
    .filter((r) => runFilter === "all" || r.arena === runFilter)
    .filter((r) => runCat === "all" || r.category === runCat)
    .sort((a, b) => {
      if (runSort === "date-desc") return (b.date || "").localeCompare(a.date || "");
      if (runSort === "date-asc") return (a.date || "").localeCompare(b.date || "");
      if (runSort === "time-asc") return (Number(a.time) || 999) - (Number(b.time) || 999);
      return 0;
    });
  const sortLbl = runSort === "date-desc" ? "Newest" : runSort === "date-asc" ? "Oldest" : "Fastest";

  const arenaStats = arenas.map((name) => {
    const times = runs.filter((r) => r.arena === name).map((r) => Number(r.time)).filter((n) => !isNaN(n) && n > 0);
    return { name, count: times.length, best: times.length ? Math.min(...times) : null, type: arenaType(name) };
  });

  const sortedStays = [...stays].sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));

  const typeChip = (t: ArenaType) =>
    t === "outdoor" ? (
      <span className="chip teal">
        <Icon name="sun" size={11} color="var(--teal)" />
        Outdoor
      </span>
    ) : t === "indoor" ? (
      <span className="chip denim">
        <Icon name="building" size={11} color="var(--denim)" />
        Indoor
      </span>
    ) : null;

  return (
    <div className="rr-root">
      <style>{CSS}</style>

      {view === "home" && (
        <div>
          <div className="hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rodeo/hero.jpg" alt="Barrel racing" />
            <div className="scrim" />
            <div className="cap">
              <h1>RODEO ROAD LOG</h1>
              <p>Every run, every arena, every stop on the road — in one place.</p>
            </div>
          </div>
          <div className="stats">
            {pill({ label: "Runs logged", value: runs.length, ic: "flag" })}
            {pill({ label: "Total won", value: fmtMoney(totalWon), ic: "trophy", color: "var(--money)" })}
            {pill({ label: "Best outdoor", value: bo ? fmtTime(bo) : "--", ic: "sun" })}
            {pill({ label: "Best indoor", value: bi ? fmtTime(bi) : "--", ic: "building" })}
          </div>
          <div className="navgrid">
            {homeCards.map(([id, t, s, ic, color]) => (
              <button key={id} className="navcard" onClick={() => nav(id)}>
                <div className="badge" style={{ background: color }}>
                  <Icon name={ic} size={24} color="#fff" />
                </div>
                <div className="grow">
                  <div className="t">{t}</div>
                  <div className="s">{s}</div>
                </div>
                <Icon name="chevron" size={18} color="var(--leather)" />
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "runs" && (
        <div>
          {topBar("runs")}
          <div className="wrap">
            <div className="row between gap2 wrapf" style={{ marginBottom: 12 }}>
              <div className="row gap2 wrapf grow" style={{ flex: "1 1 200px", minWidth: 0 }}>
                <select className="selectlike" value={runCat} onChange={(e) => setRunCat(e.target.value)} style={{ minWidth: 0 }}>
                  <option value="all">All types</option>
                  <option value="jackpot">Jackpots</option>
                  <option value="college">College rodeo</option>
                </select>
                <select className="selectlike" value={runFilter} onChange={(e) => setRunFilter(e.target.value)} style={{ minWidth: 0 }}>
                  <option value="all">All arenas</option>
                  {arenas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <button
                  className="selectlike row gap2"
                  style={{ whiteSpace: "nowrap", flex: "none" }}
                  onClick={() =>
                    setRunSort((s) => (s === "date-desc" ? "date-asc" : s === "date-asc" ? "time-asc" : "date-desc"))
                  }
                >
                  <Icon name="sort" size={13} color="var(--leather)" />
                  {sortLbl}
                </button>
              </div>
              <button className="btn rust" onClick={newRun}>
                <Icon name="plus" size={16} color="#fff" />
                Log run
              </button>
            </div>

            {filteredRuns.length === 0 && (
              <div className="empty">
                <Icon name="timer" size={32} color="var(--leather)" />
                <div className="title">No runs to show</div>
                <div>Tap &ldquo;Log run&rdquo; to add one.</div>
              </div>
            )}

            <div className="list">
              {filteredRuns.map((r) => (
                <div key={r.id} className="card">
                  <div className="row between" style={{ alignItems: "flex-start" }}>
                    <div style={{ paddingRight: 8 }}>
                      <div className="fd" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.05 }}>
                        {r.event}
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {fmtDate(r.date)}
                      </div>
                      <div className="chips">
                        <span className={"chip " + catClass(r.category)}>{catLabel(r.category)}</span>
                        <span className="chip denim">
                          <Icon name="mappin" size={11} color="var(--denim)" />
                          {r.arena}
                        </span>
                        {Number(r.earnings) > 0 && (
                          <span className="chip money">
                            <Icon name="trophy" size={11} color="var(--money)" />
                            Won {fmtMoney(r.earnings)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="time">{fmtTime(r.time)}</div>
                      <div className="tny">seconds</div>
                    </div>
                  </div>
                  {r.notes && <div style={{ fontSize: 14, marginTop: 10 }}>{r.notes}</div>}
                  <div className="row between" style={{ marginTop: 12 }}>
                    {r.videoLink ? (
                      <a className="chip teal" href={r.videoLink} target="_blank" rel="noreferrer">
                        <Icon name="video" size={12} color="var(--teal)" />
                        Watch run
                      </a>
                    ) : (
                      <span />
                    )}
                    <div className="row gap2">
                      <button className="icon-btn" onClick={() => editRun(r)} aria-label="Edit run">
                        <Icon name="pencil" size={14} color="var(--leather)" />
                      </button>
                      <button className="icon-btn" onClick={() => removeRun(r.id)} aria-label="Delete run">
                        <Icon name="trash" size={14} color="var(--rust)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "arenas" && (
        <div>
          {topBar("arenas")}
          <div className="wrap">
            <div className="row between" style={{ marginBottom: 12 }}>
              <div className="title">Arenas</div>
              <button className="btn denim" onClick={newArena}>
                <Icon name="plus" size={16} color="#fff" />
                Add arena
              </button>
            </div>
            {arenaStats.length === 0 && (
              <div className="empty">
                <Icon name="mappin" size={32} color="var(--leather)" />
                <div className="title">No arenas yet</div>
                <div>Log a run or add one manually.</div>
              </div>
            )}
            <div className="grid2">
              {arenaStats.map((a) => {
                const note = arenaNotesOf(a.name);
                const nStays = staysForArena(a.name).length;
                return (
                  <button key={a.name} className="card" style={{ textAlign: "left" }} onClick={() => openArena(a.name)}>
                    <div className="row between" style={{ alignItems: "flex-start" }}>
                      <div className="fd" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.05, paddingRight: 8 }}>
                        {a.name}
                      </div>
                      <Icon name="mappin" size={16} color="var(--denim)" />
                    </div>
                    <div className="chips">
                      {typeChip(a.type) || <span className="chip gold">Set indoor/outdoor</span>}
                      {nStays > 0 && (
                        <span className="chip teal">
                          <Icon name="hotel" size={11} color="var(--teal)" />
                          {nStays} stay{nStays === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    <div className="row gap4" style={{ marginTop: 8, fontSize: 14 }}>
                      <span className="muted">
                        {a.count} run{a.count === 1 ? "" : "s"}
                      </span>
                      {a.best !== null && (
                        <span className="fm" style={{ fontWeight: 700, color: "var(--rust)" }}>
                          Best {fmtTime(a.best)}
                        </span>
                      )}
                    </div>
                    {note && (
                      <div className="line2 muted" style={{ fontSize: 12, marginTop: 8 }}>
                        {note}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === "travel" && (
        <div>
          {topBar("travel")}
          <div className="wrap">
            <div className="row between" style={{ marginBottom: 12 }}>
              <div className="title">On the Road</div>
              <button className="btn teal" onClick={newStay}>
                <Icon name="plus" size={16} color="#fff" />
                Log a stay
              </button>
            </div>
            {sortedStays.length === 0 && (
              <div className="empty">
                <Icon name="hotel" size={32} color="var(--leather)" />
                <div className="title">No stays logged yet</div>
                <div>Tap &ldquo;Log a stay&rdquo; after your next trip.</div>
              </div>
            )}
            <div className="list">
              {sortedStays.map((t) => (
                <div key={t.id} className="card">
                  <div className="row between" style={{ alignItems: "flex-start" }}>
                    <div style={{ paddingRight: 8 }}>
                      <div className="row gap2">
                        <Icon name={t.type === "hotel" ? "hotel" : "tent"} size={15} color="var(--teal)" />
                        <div className="fd" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.05 }}>
                          {t.name}
                        </div>
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {fmtDate(t.startDate)}
                        {t.endDate && t.endDate !== t.startDate ? ` – ${fmtDate(t.endDate)}` : ""}
                      </div>
                    </div>
                    <div className="row" style={{ gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={i} name="star" size={13} color="var(--gold)" fill={i < t.rating ? "var(--gold)" : "none"} />
                      ))}
                    </div>
                  </div>
                  <div className="chips">
                    {t.arena && (
                      <span className="chip denim">
                        <Icon name="mappin" size={11} color="var(--denim)" />
                        {t.arena}
                      </span>
                    )}
                    {t.ada && (
                      <span className="chip denim">
                        <Icon name="accessibility" size={11} color="var(--denim)" />
                        ADA room
                      </span>
                    )}
                  </div>
                  {t.notes && <div style={{ fontSize: 14, marginTop: 8 }}>{t.notes}</div>}
                  <div className="row" style={{ justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                    <button className="icon-btn" onClick={() => editStay(t)} aria-label="Edit stay">
                      <Icon name="pencil" size={14} color="var(--leather)" />
                    </button>
                    <button className="icon-btn" onClick={() => removeStay(t.id)} aria-label="Delete stay">
                      <Icon name="trash" size={14} color="var(--rust)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── modals ── */}
      {modal?.kind === "run" && form && runModal()}
      {modal?.kind === "arenaDetail" && form && arenaDetailModal()}
      {modal?.kind === "arenaNew" && form && arenaNewModal()}
      {modal?.kind === "travel" && form && travelModal()}

      {err && (
        <div className="toast" onClick={() => setErr(null)} role="alert">
          {err} (tap to dismiss)
        </div>
      )}
    </div>
  );

  /* ── modal components (closures over state) ── */
  function shell(title: string, children: ReactNode) {
    return (
      <div className="overlay" onClick={closeModal}>
        <div className="sheet" onClick={(e) => e.stopPropagation()}>
          <div className="head">
            <div className="title">{title}</div>
            <button className="icon-btn" onClick={closeModal} aria-label="Close">
              <Icon name="x" size={18} color="var(--charcoal)" />
            </button>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    );
  }

  function runModal() {
    const f = form as RunForm;
    return shell(
      modal && "editing" in modal && modal.editing ? "Edit run" : "Log a run",
      <>
        <div className="field">
          <label>Event / Rodeo name</label>
          <input className="inp" value={f.event} onChange={(e) => upd<RunForm>({ event: e.target.value })} placeholder="e.g. Weber State College Rodeo" />
        </div>
        <div className="field">
          <label>Type</label>
          <div className="seg rust">
            {(["jackpot", "college"] as Category[]).map((o) => (
              <button key={o} className={f.category === o ? "on" : ""} onClick={() => upd<RunForm>({ category: o })}>
                {catLabel(o)}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Date</label>
          <input className="inp" type="date" value={f.date} onChange={(e) => upd<RunForm>({ date: e.target.value })} />
        </div>
        <div className="field">
          <label>Arena</label>
          <input className="inp" list="rr-arena-sug" value={f.arena} onChange={(e) => upd<RunForm>({ arena: e.target.value })} placeholder="e.g. Weber County Fairgrounds" />
          <datalist id="rr-arena-sug">
            {arenas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </div>
        <div className="field">
          <label>Arena type</label>
          <div className="seg denim">
            {([["outdoor", "Outdoor", "sun"], ["indoor", "Indoor", "building"]] as [ArenaType, string, string][]).map(([v, lbl, ic]) => (
              <button key={v} className={f.arenaType === v ? "on" : ""} onClick={() => upd<RunForm>({ arenaType: v })}>
                <Icon name={ic} size={15} />
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Time (seconds)</label>
          <input className="inp" type="number" step="0.01" inputMode="decimal" value={f.time} onChange={(e) => upd<RunForm>({ time: e.target.value })} placeholder="17.23" />
        </div>
        <div className="field">
          <label>Money won (leave 0 if none)</label>
          <div className="prefix">
            <span>$</span>
            <input className="inp" type="number" step="1" inputMode="numeric" value={f.earnings} onChange={(e) => upd<RunForm>({ earnings: e.target.value })} placeholder="0" />
          </div>
        </div>
        <div className="field">
          <label>Video link (YouTube)</label>
          <input className="inp" value={f.videoLink} onChange={(e) => upd<RunForm>({ videoLink: e.target.value })} placeholder="Paste the YouTube link" />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="inp" value={f.notes} onChange={(e) => upd<RunForm>({ notes: e.target.value })} placeholder="Wide first turn, watch the gate..." />
        </div>
        <button className="btn-block" style={{ background: "var(--rust)" }} onClick={saveRun}>
          Save run
        </button>
      </>
    );
  };

  function arenaDetailModal() {
    if (modal?.kind !== "arenaDetail") return null;
    const f = form as ArenaDetailForm;
    const name = modal.name;
    const here = runs
      .filter((r) => r.arena === name)
      .sort((a, b) => (Number(a.time) || 999) - (Number(b.time) || 999));
    const arenaStays = staysForArena(name);
    return shell(
      name,
      <>
        <div className="field">
          <label>Indoor or outdoor</label>
          <div className="seg denim">
            {([["outdoor", "Outdoor", "sun"], ["indoor", "Indoor", "building"]] as [ArenaType, string, string][]).map(([v, lbl, ic]) => (
              <button key={v} className={f.type === v ? "on" : ""} onClick={() => upd<ArenaDetailForm>({ type: v })}>
                <Icon name={ic} size={15} />
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Times here, fastest first</label>
          <div className="list" style={{ gap: 8 }}>
            {here.length === 0 && <div className="muted" style={{ fontSize: 14 }}>No runs logged here yet.</div>}
            {here.map((r) => (
              <div key={r.id} className="row between substay">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.event}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {fmtDate(r.date)} · {catLabel(r.category)}
                  </div>
                </div>
                <div className="fm" style={{ fontWeight: 700, color: "var(--rust)" }}>
                  {fmtTime(r.time)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Where we stayed</label>
          <div className="list" style={{ gap: 8 }}>
            {arenaStays.length === 0 && (
              <div className="muted" style={{ fontSize: 14 }}>
                No stays saved for this arena yet — add one on the Travel screen and pick this arena.
              </div>
            )}
            {arenaStays.map((s) => (
              <div key={s.id} className="substay">
                <Icon name={s.type === "hotel" ? "hotel" : "tent"} size={15} color="var(--teal)" />
                <div className="grow">
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {fmtDate(s.startDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Tips &amp; tricks for this arena</label>
          <textarea
            className="inp"
            style={{ minHeight: 90 }}
            value={f.note}
            onChange={(e) => upd<ArenaDetailForm>({ note: e.target.value })}
            placeholder="e.g. Ground is deep near barrel 3, take it wider..."
          />
        </div>
        <button className="btn-block" style={{ background: "var(--denim)" }} onClick={saveArenaDetail}>
          Save arena
        </button>
      </>
    );
  };

  function arenaNewModal() {
    const f = form as ArenaNewForm;
    return shell(
      "Add an arena",
      <>
        <div className="field">
          <label>Arena name</label>
          <input className="inp" value={f.name} onChange={(e) => upd<ArenaNewForm>({ name: e.target.value })} placeholder="e.g. Utah State Fairpark" />
        </div>
        <div className="field">
          <label>Indoor or outdoor</label>
          <div className="seg denim">
            {([["outdoor", "Outdoor", "sun"], ["indoor", "Indoor", "building"]] as [ArenaType, string, string][]).map(([v, lbl, ic]) => (
              <button key={v} className={f.type === v ? "on" : ""} onClick={() => upd<ArenaNewForm>({ type: v })}>
                <Icon name={ic} size={15} />
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-block" style={{ background: "var(--denim)" }} onClick={addArena}>
          Add arena
        </button>
      </>
    );
  };

  function travelModal() {
    const f = form as StayForm;
    return shell(
      modal && "editing" in modal && modal.editing ? "Edit stay" : "Log a stay",
      <>
        <div className="field">
          <label>Type</label>
          <div className="seg teal">
            {(["hotel", "campground"] as StayType[]).map((o) => (
              <button key={o} className={f.type === o ? "on" : ""} style={{ textTransform: "capitalize" }} onClick={() => upd<StayForm>({ type: o })}>
                <Icon name={o === "hotel" ? "hotel" : "tent"} size={15} />
                {o}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Name</label>
          <input className="inp" value={f.name} onChange={(e) => upd<StayForm>({ name: e.target.value })} placeholder="e.g. Best Western Fairgrounds Inn" />
        </div>
        <div className="field">
          <label>Arena this stay was for</label>
          <select className="inp" value={f.arena} onChange={(e) => upd<StayForm>({ arena: e.target.value })}>
            <option value="">— none —</option>
            {arenas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Check-in</label>
            <input className="inp" type="date" value={f.startDate} onChange={(e) => upd<StayForm>({ startDate: e.target.value })} />
          </div>
          <div className="field">
            <label>Check-out</label>
            <input className="inp" type="date" value={f.endDate} onChange={(e) => upd<StayForm>({ endDate: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Rating</label>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => upd<StayForm>({ rating: i + 1 })} aria-label={`${i + 1} stars`}>
                <Icon name="star" size={26} color="var(--gold)" fill={i < f.rating ? "var(--gold)" : "none"} />
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>ADA accessible room</label>
          <button className={"toggle" + (f.ada ? " on" : "")} onClick={() => upd<StayForm>({ ada: !f.ada })}>
            <Icon name="accessibility" size={16} />
            {f.ada ? "Yes" : "No"}
          </button>
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="inp" value={f.notes} onChange={(e) => upd<StayForm>({ notes: e.target.value })} placeholder="Pet-friendly, close to arena, noisy AC..." />
        </div>
        <button className="btn-block" style={{ background: "var(--teal)" }} onClick={saveStay}>
          Save stay
        </button>
      </>
    );
  };
}
