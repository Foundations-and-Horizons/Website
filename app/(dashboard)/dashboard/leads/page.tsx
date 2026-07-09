"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const STAGES = ["not_contacted","sent","followed_up","responded","discovery_call","proposal","won","lost"] as const;
type Stage = typeof STAGES[number];

const STAGE_CONFIG: Record<Stage, { label: string; color: string; bg: string; border: string; dot: string }> = {
  not_contacted: { label: "Not Contacted", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200", dot: "bg-gray-400" },
  sent:          { label: "Sent",          color: "text-blue-600", bg: "bg-blue-50",  border: "border-blue-200", dot: "bg-blue-400" },
  followed_up:   { label: "Followed Up",   color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-400" },
  responded:     { label: "Responded",     color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-400" },
  discovery_call:{ label: "Discovery Call",color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  proposal:      { label: "Proposal",      color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-400" },
  won:           { label: "Won 🎉",         color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300", dot: "bg-emerald-500" },
  lost:          { label: "Lost",          color: "text-red-400", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-300" },
};

const TIER_CONFIG: Record<string, { label: string; classes: string }> = {
  A: { label: "A", classes: "bg-[#2a3db4] text-white" },
  B: { label: "B", classes: "bg-gray-200 text-gray-700" },
  C: { label: "C", classes: "bg-yellow-100 text-yellow-700" },
};

type Lead = {
  id: string;
  name: string;
  organization: string;
  role: string | null;
  email: string | null;
  tier: string | null;
  stage: string;
  next_action: string | null;
  next_action_due: string | null;
  notes: string | null;
  fit_notes: string | null;
};

const ACTIVE_STAGES: Stage[] = ["not_contacted","sent","followed_up","responded","discovery_call","proposal"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  async function load() {
    const { data } = await supabase.from("leads").select("*").order("tier").order("name");
    setLeads(data || []);
  }

  useEffect(() => { load(); }, []);

  async function save(lead: Partial<Lead> & { id?: string }) {
    if (lead.id) {
      await supabase.from("leads").update(lead).eq("id", lead.id);
    } else {
      await supabase.from("leads").insert(lead);
    }
    setEditing(null);
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  }

  async function advanceStage(lead: Lead) {
    const idx = STAGES.indexOf(lead.stage as Stage);
    if (idx < 0 || idx >= STAGES.length - 2) return; // don't advance past proposal into won/lost
    const next = STAGES[idx + 1];
    await supabase.from("leads").update({ stage: next }).eq("id", lead.id);
    load();
  }

  const isOverdue = (lead: Lead) =>
    lead.next_action_due && lead.next_action_due <= today && !["won","lost"].includes(lead.stage);

  const activeLeads = leads.filter(l => ACTIVE_STAGES.includes(l.stage as Stage));
  const overdueLeads = leads.filter(l => isOverdue(l));
  const wonLeads = leads.filter(l => l.stage === "won");
  const proposalLeads = leads.filter(l => l.stage === "proposal");

  const filteredLeads = leads.filter(l => {
    if (stageFilter !== "all" && l.stage !== stageFilter) return false;
    if (tierFilter !== "all" && l.tier !== tierFilter) return false;
    return true;
  });

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outreach Pipeline</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track every lead from first contact to close</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setView("kanban")}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${view === "kanban" ? "bg-white shadow text-gray-900 font-medium" : "text-gray-500"}`}>
                Kanban
              </button>
              <button onClick={() => setView("table")}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${view === "table" ? "bg-white shadow text-gray-900 font-medium" : "text-gray-500"}`}>
                Table
              </button>
            </div>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1e2d8a] transition-colors font-medium"
            >
              + Add Lead
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Active Leads</p>
            <p className="text-3xl font-bold text-gray-900">{activeLeads.length}</p>
            <p className="text-xs text-gray-400 mt-1">in pipeline</p>
          </div>
          <div className={`rounded-xl border p-5 ${overdueLeads.length > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Overdue</p>
            <p className={`text-3xl font-bold ${overdueLeads.length > 0 ? "text-red-600" : "text-gray-900"}`}>{overdueLeads.length}</p>
            <p className="text-xs text-gray-400 mt-1">need action now</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">In Proposal</p>
            <p className="text-3xl font-bold text-orange-600">{proposalLeads.length}</p>
            <p className="text-xs text-gray-400 mt-1">ready to close</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Won</p>
            <p className="text-3xl font-bold text-emerald-600">{wonLeads.length}</p>
            <p className="text-xs text-gray-400 mt-1">closed deals 🎉</p>
          </div>
        </div>

        {/* Kanban view */}
        {view === "kanban" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {STAGES.map((stage) => {
                const cfg = STAGE_CONFIG[stage];
                const stageLeads = leads.filter(l => l.stage === stage);
                return (
                  <div key={stage} className="w-64 flex-shrink-0">
                    {/* Column header */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-x ${cfg.border} ${cfg.bg} mb-0`}>
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                      <span className={`ml-auto text-xs font-bold ${cfg.color} opacity-60`}>{stageLeads.length}</span>
                    </div>
                    {/* Cards */}
                    <div className={`border-x border-b ${cfg.border} rounded-b-lg min-h-[120px] p-2 space-y-2 bg-white/60`}>
                      {stageLeads.length === 0 && (
                        <p className="text-xs text-gray-300 text-center py-6">—</p>
                      )}
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group
                            ${isOverdue(lead) ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"}`}
                          onClick={() => { setEditing(lead); setShowForm(true); }}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white
                              ${lead.tier === "A" ? "bg-[#2a3db4]" : lead.tier === "B" ? "bg-gray-400" : "bg-yellow-500"}`}>
                              {initials(lead.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
                              <p className="text-xs text-gray-500 truncate">{lead.organization}</p>
                            </div>
                            {lead.tier && (
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${TIER_CONFIG[lead.tier]?.classes}`}>
                                {lead.tier}
                              </span>
                            )}
                          </div>
                          {lead.next_action && (
                            <p className="text-xs text-gray-500 truncate mb-1">→ {lead.next_action}</p>
                          )}
                          {lead.next_action_due && (
                            <p className={`text-xs font-medium ${isOverdue(lead) ? "text-red-600" : "text-gray-400"}`}>
                              {isOverdue(lead) ? "⚠ " : ""}Due {lead.next_action_due}
                            </p>
                          )}
                          {/* Advance button */}
                          {!["won","lost"].includes(stage) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); advanceStage(lead); }}
                              className={`mt-2 w-full text-xs py-1 rounded border font-medium transition-all
                                opacity-0 group-hover:opacity-100
                                ${cfg.color} ${cfg.border} hover:${cfg.bg}`}
                            >
                              Move to {STAGE_CONFIG[STAGES[STAGES.indexOf(stage) + 1]]?.label} →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table view */}
        {view === "table" && (
          <>
            <div className="flex gap-3 flex-wrap">
              <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                <option value="all">All Stages</option>
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
              </select>
              <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                <option value="all">All Tiers</option>
                <option value="A">Tier A</option>
                <option value="B">Tier B</option>
                <option value="C">Tier C</option>
              </select>
              <span className="text-sm text-gray-400 self-center">{filteredLeads.length} leads</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Org</th>
                    <th className="text-left px-4 py-3">Tier</th>
                    <th className="text-left px-4 py-3">Stage</th>
                    <th className="text-left px-4 py-3">Next Action Due</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => {
                    const cfg = STAGE_CONFIG[lead.stage as Stage];
                    return (
                      <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${isOverdue(lead) ? "bg-red-50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0
                              ${lead.tier === "A" ? "bg-[#2a3db4]" : lead.tier === "B" ? "bg-gray-400" : "bg-yellow-500"}`}>
                              {initials(lead.name)}
                            </div>
                            <span className="font-medium text-gray-900">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{lead.organization}</td>
                        <td className="px-4 py-3">
                          {lead.tier && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${TIER_CONFIG[lead.tier]?.classes}`}>{lead.tier}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg?.bg} ${cfg?.color}`}>
                            {cfg?.label || lead.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {lead.next_action_due ? (
                            <span className={isOverdue(lead) ? "text-red-600 font-medium" : "text-gray-500"}>
                              {isOverdue(lead) ? "⚠ " : ""}{lead.next_action_due}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setEditing(lead); setShowForm(true); }}
                            className="text-[#2a3db4] hover:underline text-xs mr-3 font-medium">Edit</button>
                          <button onClick={() => remove(lead.id)}
                            className="text-red-400 hover:underline text-xs">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <LeadForm
          lead={editing}
          onSave={save}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function LeadForm({ lead, onSave, onClose }: {
  lead: Lead | null;
  onSave: (l: Partial<Lead> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Lead>>({
    name: lead?.name || "",
    organization: lead?.organization || "",
    role: lead?.role || "",
    email: lead?.email || "",
    tier: lead?.tier || "A",
    stage: lead?.stage || "not_contacted",
    next_action: lead?.next_action || "",
    next_action_due: lead?.next_action_due || "",
    notes: lead?.notes || "",
    fit_notes: lead?.fit_notes || "",
  });

  function set(k: keyof Lead, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{lead ? "Edit Lead" : "Add Lead"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          {(["name","organization","role","email"] as const).map((f) => (
            <div key={f}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{f}</label>
              <input value={form[f] || ""} onChange={(e) => set(f, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30 focus:border-[#2a3db4]" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tier</label>
              <select value={form.tier || "A"} onChange={(e) => set("tier", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                <option>A</option><option>B</option><option>C</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Stage</label>
              <select value={form.stage || "not_contacted"} onChange={(e) => set("stage", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Next Action</label>
            <input value={form.next_action || ""} onChange={(e) => set("next_action", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Next Action Due</label>
            <input type="date" value={form.next_action_due || ""} onChange={(e) => set("next_action_due", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fit Notes</label>
            <textarea value={form.fit_notes || ""} onChange={(e) => set("fit_notes", e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-gray-200 justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={() => onSave(lead ? { ...form, id: lead.id } : form)}
            className="text-sm px-5 py-2 bg-[#2a3db4] text-white rounded-lg hover:bg-[#1e2d8a] font-medium">Save</button>
        </div>
      </div>
    </div>
  );
}
