"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const STAGES = ["not_contacted","sent","followed_up","responded","discovery_call","proposal","won","lost"] as const;
const STAGE_LABELS: Record<string, string> = {
  not_contacted: "Not Contacted",
  sent: "Sent",
  followed_up: "Followed Up",
  responded: "Responded",
  discovery_call: "Discovery Call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  async function load() {
    let q = supabase.from("leads").select("*").order("tier").order("name");
    if (stageFilter !== "all") q = q.eq("stage", stageFilter);
    if (tierFilter !== "all") q = q.eq("tier", tierFilter);
    const { data } = await q;
    setLeads(data || []);
  }

  useEffect(() => { load(); }, [stageFilter, tierFilter]);

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

  const isOverdue = (lead: Lead) =>
    lead.next_action_due && lead.next_action_due <= today && !["won","lost"].includes(lead.stage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outreach Pipeline</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded hover:bg-[#1e2d8a] transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All Tiers</option>
          <option value="A">Tier A</option>
          <option value="B">Tier B</option>
          <option value="C">Tier C</option>
        </select>
        <span className="text-sm text-gray-400 self-center">{leads.length} leads</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Org</th>
              <th className="text-left px-4 py-3">Tier</th>
              <th className="text-left px-4 py-3">Stage</th>
              <th className="text-left px-4 py-3">Next Action Due</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className={isOverdue(lead) ? "bg-red-50" : ""}>
                <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                <td className="px-4 py-3 text-gray-500">{lead.organization}</td>
                <td className="px-4 py-3">
                  {lead.tier && (
                    <span className={
                      lead.tier === "A" ? "bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-medium" :
                      lead.tier === "B" ? "bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs font-medium" :
                      "bg-yellow-100 text-yellow-700 rounded px-2 py-0.5 text-xs font-medium"
                    }>{lead.tier}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-indigo-50 text-indigo-700 rounded px-2 py-0.5 text-xs">
                    {STAGE_LABELS[lead.stage] || lead.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {lead.next_action_due ? (
                    <span className={isOverdue(lead) ? "text-red-600 font-medium" : "text-gray-600"}>
                      {lead.next_action_due}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => { setEditing(lead); setShowForm(true); }}
                    className="text-[#2a3db4] hover:underline text-xs mr-3">Edit</button>
                  <button onClick={() => remove(lead.id)}
                    className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add modal */}
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">{lead ? "Edit Lead" : "Add Lead"}</h2>
        <div className="space-y-3">
          {(["name","organization","role","email"] as const).map((f) => (
            <div key={f}>
              <label className="block text-xs text-gray-600 mb-0.5 capitalize">{f}</label>
              <input value={form[f] || ""} onChange={(e) => set(f, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Tier</label>
              <select value={form.tier || "A"} onChange={(e) => set("tier", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                <option>A</option><option>B</option><option>C</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Stage</label>
              <select value={form.stage || "not_contacted"} onChange={(e) => set("stage", e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Next Action</label>
            <input value={form.next_action || ""} onChange={(e) => set("next_action", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Next Action Due</label>
            <input type="date" value={form.next_action_due || ""} onChange={(e) => set("next_action_due", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Fit Notes</label>
            <textarea value={form.fit_notes || ""} onChange={(e) => set("fit_notes", e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Notes</label>
            <textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(lead ? { ...form, id: lead.id } : form)}
            className="text-sm px-4 py-2 bg-[#2a3db4] text-white rounded hover:bg-[#1e2d8a]">Save</button>
        </div>
      </div>
    </div>
  );
}
