"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Pipeline = { id: string; key: string; name: string; color: string; icon: string; sort_order: number };
type Stage = { id: string; pipeline_id: string; key: string; label: string; sort_order: number; is_won: boolean; is_lost: boolean };
type Deal = {
  id: string; title: string; pipeline_id: string; stage_id: string | null;
  company_id: string | null; primary_contact_id: string | null;
  value: number | null; currency: string; status: string;
  next_action: string | null; next_action_due: string | null; expected_close: string | null;
  notes: string | null; created_at: string; updated_at: string;
  companies?: { name: string } | null;
  contacts?: { full_name: string } | null;
};
type Company = { id: string; name: string };
type Contact = { id: string; full_name: string; company_id: string | null };

const EMPTY_FORM = {
  title: "", pipeline_id: "", stage_id: "", company_id: "", primary_contact_id: "",
  value: "", currency: "USD", next_action: "", next_action_due: "", expected_close: "", notes: "",
};

export default function DealsPage() {
  const supabase = createClient();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activePipeline, setActivePipeline] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [{ data: pData }, { data: sData }, { data: dData }, { data: coData }, { data: ctData }] = await Promise.all([
      supabase.from("pipelines").select("*").order("sort_order"),
      supabase.from("pipeline_stages").select("*").order("sort_order"),
      supabase.from("deals").select("*, companies(name), contacts(full_name)").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("contacts").select("id, full_name, company_id").order("full_name"),
    ]);
    setPipelines(pData || []);
    setStages(sData || []);
    setDeals(dData || []);
    setCompanies(coData || []);
    setContacts(ctData || []);
    if (pData?.length && !activePipeline) setActivePipeline(pData[0].id);
  }, [activePipeline]);

  useEffect(() => { load(); }, []);

  const pipelineStages = stages.filter((s) => s.pipeline_id === activePipeline).sort((a, b) => a.sort_order - b.sort_order);
  const pipeline = pipelines.find((p) => p.id === activePipeline);

  function dealsByStage(stageId: string) {
    return deals.filter((d) => d.pipeline_id === activePipeline && d.stage_id === stageId);
  }

  function openNew() {
    setForm({ ...EMPTY_FORM, pipeline_id: activePipeline, stage_id: pipelineStages[0]?.id || "" });
    setSelectedDeal(null);
    setShowForm(true);
  }

  function openEdit(deal: Deal) {
    setForm({
      title: deal.title,
      pipeline_id: deal.pipeline_id,
      stage_id: deal.stage_id || "",
      company_id: deal.company_id || "",
      primary_contact_id: deal.primary_contact_id || "",
      value: deal.value != null ? String(deal.value) : "",
      currency: deal.currency,
      next_action: deal.next_action || "",
      next_action_due: deal.next_action_due || "",
      expected_close: deal.expected_close || "",
      notes: deal.notes || "",
    });
    setSelectedDeal(deal);
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      pipeline_id: form.pipeline_id || activePipeline,
      stage_id: form.stage_id || null,
      company_id: form.company_id || null,
      primary_contact_id: form.primary_contact_id || null,
      value: form.value ? parseFloat(form.value) : null,
      currency: form.currency,
      next_action: form.next_action || null,
      next_action_due: form.next_action_due || null,
      expected_close: form.expected_close || null,
      notes: form.notes || null,
    };
    if (selectedDeal) {
      await supabase.from("deals").update(payload).eq("id", selectedDeal.id);
    } else {
      await supabase.from("deals").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    setSelectedDeal(null);
    load();
  }

  async function advanceStage(deal: Deal) {
    const stageList = pipelineStages;
    const idx = stageList.findIndex((s) => s.id === deal.stage_id);
    const next = stageList[idx + 1];
    if (!next) return;
    const status = next.is_won ? "won" : next.is_lost ? "lost" : "open";
    await supabase.from("deals").update({ stage_id: next.id, status }).eq("id", deal.id);
    load();
  }

  async function removeDeal(id: string) {
    if (!confirm("Delete this deal?")) return;
    await supabase.from("deals").delete().eq("id", id);
    load();
  }

  async function onDrop(stageId: string) {
    if (!dragging) return;
    const stage = stages.find((s) => s.id === stageId);
    const status = stage?.is_won ? "won" : stage?.is_lost ? "lost" : "open";
    await supabase.from("deals").update({ stage_id: stageId, status }).eq("id", dragging);
    setDragging(null);
    load();
  }

  const openDeals = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "open").length;
  const wonDeals = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "won").length;
  const totalValue = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "open" && d.value)
    .reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals 🎯</h1>
          <p className="text-sm text-gray-400">Every deal is a conversation worth having.</p>
        </div>
        <button onClick={openNew} className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] font-medium shadow transition-colors">
          + New Deal
        </button>
      </div>

      {/* Pipeline tabs */}
      <div className="flex gap-2 mb-4 shrink-0">
        {pipelines.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePipeline(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activePipeline === p.id ? "text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"}`}
            style={activePipeline === p.id ? { background: p.color } : {}}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Open</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{openDeals}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Won</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{wonDeals} 🏆</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pipeline Value</p>
          <p className="text-2xl font-bold text-[#2a3db4] mt-1">
            {totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—"}
          </p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-h-0">
        {pipelineStages.map((stage) => {
          const cards = dealsByStage(stage.id);
          const stageColor = stage.is_won ? "#16a34a" : stage.is_lost ? "#dc2626" : (pipeline?.color || "#2a3db4");
          return (
            <div
              key={stage.id}
              className="flex flex-col shrink-0 w-64 bg-gray-50 rounded-xl border border-gray-200"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(stage.id)}
            >
              <div className="px-3 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: stageColor }} />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{stage.label}</span>
                </div>
                <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-500 font-medium">{cards.length}</span>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {cards.map((deal) => {
                  const stageList = pipelineStages;
                  const idx = stageList.findIndex((s) => s.id === deal.stage_id);
                  const hasNext = idx < stageList.length - 1 && !stage.is_won && !stage.is_lost;
                  const overdue = deal.next_action_due && new Date(deal.next_action_due) < new Date();
                  return (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDragging(deal.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`bg-white rounded-lg border shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${dragging === deal.id ? "opacity-50" : ""}`}
                      style={{ borderLeftWidth: 3, borderLeftColor: stageColor }}
                    >
                      <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{deal.title}</p>
                      {deal.companies && <p className="text-xs text-gray-500 mb-1">🏢 {deal.companies.name}</p>}
                      {deal.contacts && <p className="text-xs text-gray-500 mb-1">👤 {deal.contacts.full_name}</p>}
                      {deal.value && <p className="text-xs font-bold text-[#2a3db4] mb-1">${Number(deal.value).toLocaleString()}</p>}
                      {deal.next_action && (
                        <p className={`text-xs mb-2 ${overdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
                          {overdue ? "⚠️ " : "→ "}{deal.next_action}
                          {deal.next_action_due && ` (${deal.next_action_due})`}
                        </p>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button onClick={() => openEdit(deal)} className="flex-1 text-xs py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50">Edit</button>
                        {hasNext && (
                          <button onClick={() => advanceStage(deal)} className="flex-1 text-xs py-1 rounded text-white font-medium" style={{ background: stageColor }}>
                            → Next
                          </button>
                        )}
                        <button onClick={() => removeDeal(deal.id)} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-200">✕</button>
                      </div>
                    </div>
                  );
                })}
                {cards.length === 0 && (
                  <p className="text-xs text-gray-300 text-center py-6">Drop deals here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-1">{selectedDeal ? "Edit Deal" : "New Deal"} 🎯</h2>
            <p className="text-sm text-gray-400 mb-5">Every big win starts with a single deal.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Acme Corp — Consulting"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Pipeline</label>
                  <select value={form.pipeline_id} onChange={(e) => setForm((f) => ({ ...f, pipeline_id: e.target.value, stage_id: "" }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    {pipelines.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Stage</label>
                  <select value={form.stage_id} onChange={(e) => setForm((f) => ({ ...f, stage_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    <option value="">— pick stage —</option>
                    {stages.filter((s) => s.pipeline_id === (form.pipeline_id || activePipeline)).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Company</label>
                  <select value={form.company_id} onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    <option value="">— none —</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Contact</label>
                  <select value={form.primary_contact_id} onChange={(e) => setForm((f) => ({ ...f, primary_contact_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    <option value="">— none —</option>
                    {contacts.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Value ($)</label>
                  <input type="number" min="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Expected Close</label>
                  <input type="date" value={form.expected_close} onChange={(e) => setForm((f) => ({ ...f, expected_close: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Next Action</label>
                <input value={form.next_action} onChange={(e) => setForm((f) => ({ ...f, next_action: e.target.value }))}
                  placeholder="e.g. Send proposal"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Due Date</label>
                <input type="date" value={form.next_action_due} onChange={(e) => setForm((f) => ({ ...f, next_action_due: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Context, background, ideas..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setSelectedDeal(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.title || saving} className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2d8a] disabled:opacity-50">
                {saving ? "Saving…" : selectedDeal ? "Update Deal" : "Create Deal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
