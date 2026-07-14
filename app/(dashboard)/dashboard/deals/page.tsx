"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Pipeline = { id: string; key: string; name: string; color: string; icon: string; sort_order: number };
type Stage = { id: string; pipeline_id: string; key: string; label: string; sort_order: number; is_won: boolean; is_lost: boolean };
type Deal = {
  id: string; title: string; pipeline_id: string; stage_id: string | null;
  company_id: string | null; primary_contact_id: string | null;
  value: number | null; currency: string; status: string;
  next_action: string | null; next_action_due: string | null;
  expected_close: string | null; notes: string | null;
  created_at: string; updated_at: string;
  companies?: { name: string } | null;
  contacts?: { full_name: string } | null;
};
type Activity = {
  id: string; type: string; subject: string | null; body: string | null;
  occurred_at: string; created_at: string;
};
type Company = { id: string; name: string };
type Contact = { id: string; full_name: string };

const ACTIVITY_TYPES = [
  { key: "email",    label: "Email",       icon: "📧" },
  { key: "note",     label: "Note",        icon: "📝" },
  { key: "call",     label: "Call",        icon: "📞" },
  { key: "meeting",  label: "Event / Met", icon: "📅" },
  { key: "task",     label: "LinkedIn DM", icon: "💼" },
];

const EMPTY_FORM = {
  title: "", pipeline_id: "", stage_id: "", company_id: "", primary_contact_id: "",
  value: "", currency: "USD", next_action: "", next_action_due: "", expected_close: "", notes: "",
};

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function isRotting(deal: Deal, activities: Activity[]): boolean {
  if (deal.status !== "open") return false;
  const lastActivity = activities[0]?.occurred_at || deal.created_at;
  return daysSince(lastActivity) >= 14;
}

function timeAgo(dateStr: string): string {
  const days = daysSince(dateStr);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DealsPage() {
  const supabase = createClient();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activePipeline, setActivePipeline] = useState<string>("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealActivities, setDealActivities] = useState<Activity[]>([]);
  const [activityMap, setActivityMap] = useState<Record<string, Activity[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Activity log
  const [logType, setLogType] = useState("email");
  const [logBody, setLogBody] = useState("");
  const [logNextAction, setLogNextAction] = useState("");
  const [logDue, setLogDue] = useState("");
  const [loggingActivity, setLoggingActivity] = useState(false);

  const load = useCallback(async () => {
    const [{ data: pData }, { data: sData }, { data: dData }, { data: coData }, { data: ctData }] = await Promise.all([
      supabase.from("pipelines").select("*").order("sort_order"),
      supabase.from("pipeline_stages").select("*").order("sort_order"),
      supabase.from("deals").select("*, companies(name), contacts(full_name)").order("updated_at", { ascending: false }),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("contacts").select("id, full_name").order("full_name"),
    ]);
    setPipelines(pData || []);
    setStages(sData || []);
    setDeals(dData || []);
    setCompanies(coData || []);
    setContacts(ctData || []);
    if (pData?.length && !activePipeline) setActivePipeline(pData[0].id);

    // Load recent activities for rotting detection
    if (dData?.length) {
      const { data: actData } = await supabase
        .from("activities")
        .select("id, deal_id, occurred_at")
        .in("deal_id", dData.map((d) => d.id))
        .order("occurred_at", { ascending: false });
      const map: Record<string, Activity[]> = {};
      (actData || []).forEach((a: { id: string; deal_id: string; occurred_at: string }) => {
        if (!map[a.deal_id]) map[a.deal_id] = [];
        map[a.deal_id].push(a as unknown as Activity);
      });
      setActivityMap(map);
    }
  }, [activePipeline]);

  useEffect(() => { load(); }, []);

  async function openDeal(deal: Deal) {
    setSelectedDeal(deal);
    setLogBody("");
    setLogNextAction(deal.next_action || "");
    setLogDue(deal.next_action_due || "");
    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("deal_id", deal.id)
      .order("occurred_at", { ascending: false });
    setDealActivities(data || []);
  }

  async function logActivity() {
    if (!selectedDeal || !logBody.trim()) return;
    setLoggingActivity(true);
    const typeLabel = ACTIVITY_TYPES.find((t) => t.key === logType)?.label || logType;
    await supabase.from("activities").insert({
      deal_id: selectedDeal.id,
      company_id: selectedDeal.company_id,
      type: logType,
      subject: typeLabel,
      body: logBody.trim(),
    });
    if (logNextAction) {
      await supabase.from("deals").update({
        next_action: logNextAction,
        next_action_due: logDue || null,
      }).eq("id", selectedDeal.id);
    }
    setLogBody("");
    setLoggingActivity(false);
    openDeal(selectedDeal);
    load();
  }

  async function advanceStage(deal: Deal) {
    const stageList = stages.filter((s) => s.pipeline_id === deal.pipeline_id).sort((a, b) => a.sort_order - b.sort_order);
    const idx = stageList.findIndex((s) => s.id === deal.stage_id);
    const next = stageList[idx + 1];
    if (!next) return;
    const status = next.is_won ? "won" : next.is_lost ? "lost" : "open";
    await supabase.from("deals").update({ stage_id: next.id, status }).eq("id", deal.id);
    await supabase.from("activities").insert({
      deal_id: deal.id, type: "stage_change",
      subject: `Moved to ${next.label}`, body: null,
    });
    if (selectedDeal?.id === deal.id) {
      const updated = { ...deal, stage_id: next.id, status };
      setSelectedDeal(updated);
      openDeal(updated);
    }
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

  function openNew() {
    setForm({ ...EMPTY_FORM, pipeline_id: activePipeline, stage_id: pipelineStages[0]?.id || "" });
    setEditingDeal(null);
    setShowForm(true);
  }

  function openEdit(deal: Deal, e?: React.MouseEvent) {
    e?.stopPropagation();
    setForm({
      title: deal.title, pipeline_id: deal.pipeline_id, stage_id: deal.stage_id || "",
      company_id: deal.company_id || "", primary_contact_id: deal.primary_contact_id || "",
      value: deal.value != null ? String(deal.value) : "", currency: deal.currency,
      next_action: deal.next_action || "", next_action_due: deal.next_action_due || "",
      expected_close: deal.expected_close || "", notes: deal.notes || "",
    });
    setEditingDeal(deal);
    setShowForm(true);
  }

  async function saveDeal() {
    setSaving(true);
    const payload = {
      title: form.title, pipeline_id: form.pipeline_id || activePipeline,
      stage_id: form.stage_id || null, company_id: form.company_id || null,
      primary_contact_id: form.primary_contact_id || null,
      value: form.value ? parseFloat(form.value) : null, currency: form.currency,
      next_action: form.next_action || null, next_action_due: form.next_action_due || null,
      expected_close: form.expected_close || null, notes: form.notes || null,
    };
    if (editingDeal) {
      await supabase.from("deals").update(payload).eq("id", editingDeal.id);
    } else {
      await supabase.from("deals").insert(payload);
    }
    setSaving(false); setShowForm(false); setEditingDeal(null); load();
  }

  async function removeDeal(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!confirm("Delete this deal?")) return;
    if (selectedDeal?.id === id) setSelectedDeal(null);
    await supabase.from("deals").delete().eq("id", id);
    load();
  }

  const pipelineStages = stages.filter((s) => s.pipeline_id === activePipeline).sort((a, b) => a.sort_order - b.sort_order);
  const pipeline = pipelines.find((p) => p.id === activePipeline);
  const openDeals = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "open").length;
  const wonDeals = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "won").length;
  const totalValue = deals.filter((d) => d.pipeline_id === activePipeline && d.status === "open" && d.value).reduce((s, d) => s + (d.value || 0), 0);
  const selectedStages = selectedDeal ? stages.filter((s) => s.pipeline_id === selectedDeal.pipeline_id).sort((a, b) => a.sort_order - b.sort_order) : [];
  const selectedStageIdx = selectedStages.findIndex((s) => s.id === selectedDeal?.stage_id);

  return (
    <div className="flex gap-0 h-full -m-6 md:-m-8">
      {/* Main kanban area */}
      <div className={`flex flex-col flex-1 min-w-0 p-6 md:p-8 transition-all ${selectedDeal ? "hidden xl:flex" : "flex"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
            <p className="text-sm text-gray-400">Track every opportunity from first contact to close.</p>
          </div>
          <button onClick={openNew} className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#1e2d8a] font-semibold shadow-sm transition-all">
            + New Deal
          </button>
        </div>

        {/* Pipeline tabs */}
        <div className="flex gap-2 mb-5 shrink-0 overflow-x-auto">
          {pipelines.map((p) => (
            <button key={p.id} onClick={() => setActivePipeline(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${activePipeline === p.id ? "text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}
              style={activePipeline === p.id ? { background: p.color } : {}}>
              <span>{p.icon}</span><span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 shrink-0">
          {[
            { label: "Open", value: openDeals, color: "text-gray-900" },
            { label: "Won", value: `${wonDeals} 🏆`, color: "text-green-600" },
            { label: "Value", value: totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—", color: "text-[#2a3db4]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-h-0">
          {pipelineStages.map((stage) => {
            const cards = deals.filter((d) => d.pipeline_id === activePipeline && d.stage_id === stage.id);
            const stageColor = stage.is_won ? "#16a34a" : stage.is_lost ? "#dc2626" : (pipeline?.color || "#2a3db4");
            return (
              <div key={stage.id}
                className="flex flex-col shrink-0 w-60 bg-gray-50 rounded-2xl border border-gray-200"
                onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(stage.id)}>
                <div className="px-3 pt-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: stageColor }} />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{stage.label}</span>
                  </div>
                  <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-400 font-medium">{cards.length}</span>
                </div>
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {cards.map((deal) => {
                    const overdue = deal.next_action_due && new Date(deal.next_action_due) < new Date();
                    const rotting = isRotting(deal, activityMap[deal.id] || []);
                    const isSelected = selectedDeal?.id === deal.id;
                    return (
                      <div key={deal.id} draggable
                        onDragStart={() => setDragging(deal.id)} onDragEnd={() => setDragging(null)}
                        onClick={() => openDeal(deal)}
                        className={`bg-white rounded-xl border shadow-sm p-3 cursor-pointer hover:shadow-md transition-all group ${dragging === deal.id ? "opacity-40 scale-95" : ""} ${isSelected ? "ring-2 ring-[#2a3db4]" : "hover:border-gray-300"}`}
                        style={{ borderLeftWidth: 3, borderLeftColor: stageColor }}>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-sm font-semibold text-gray-900 leading-tight flex-1">{deal.title}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {rotting && <span title="No activity in 14+ days" className="text-xs">🟠</span>}
                            <button onClick={(e) => openEdit(deal, e)} className="text-gray-300 hover:text-[#2a3db4] text-xs px-1">✎</button>
                            <button onClick={(e) => removeDeal(deal.id, e)} className="text-gray-300 hover:text-red-500 text-xs px-1">✕</button>
                          </div>
                        </div>
                        {deal.companies && <p className="text-xs text-gray-400 mb-1">🏢 {(deal.companies as unknown as { name: string }).name}</p>}
                        {deal.value && <p className="text-xs font-bold text-[#2a3db4] mb-1">${Number(deal.value).toLocaleString()}</p>}
                        {deal.next_action && (
                          <p className={`text-xs truncate ${overdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
                            {overdue ? "⚠️ " : "→ "}{deal.next_action}
                          </p>
                        )}
                        {rotting && !overdue && <p className="text-xs text-orange-400 mt-1">🟠 No activity lately</p>}
                      </div>
                    );
                  })}
                  {cards.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-gray-300 text-xs">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal detail panel */}
      {selectedDeal && (
        <div className="flex flex-col w-full xl:w-96 shrink-0 bg-white border-l border-gray-100 overflow-y-auto">
          {/* Panel header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-50 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setSelectedDeal(null)} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
                ← Back
              </button>
              <button onClick={(e) => openEdit(selectedDeal, e)} className="text-xs text-gray-400 hover:text-[#2a3db4] font-medium">Edit deal</button>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{selectedDeal.title}</h2>
            {selectedDeal.companies && <p className="text-sm text-gray-400">🏢 {(selectedDeal.companies as unknown as { name: string }).name}</p>}
            {selectedDeal.contacts && <p className="text-sm text-gray-400">👤 {(selectedDeal.contacts as unknown as { full_name: string }).full_name}</p>}
            {selectedDeal.value && <p className="text-sm font-bold text-[#2a3db4] mt-1">${Number(selectedDeal.value).toLocaleString()}</p>}
          </div>

          {/* Stage progress */}
          <div className="px-5 py-4 border-b border-gray-50 shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Stage</p>
            <div className="flex gap-1 flex-wrap">
              {selectedStages.map((s, i) => {
                const isCurrent = s.id === selectedDeal.stage_id;
                const isPast = i < selectedStageIdx;
                const stageColor = selectedDeal.pipeline_id ? (pipelines.find((p) => p.id === selectedDeal.pipeline_id)?.color || "#2a3db4") : "#2a3db4";
                return (
                  <div key={s.id} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${isCurrent ? "text-white shadow-sm" : isPast ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}
                    style={isCurrent ? { background: stageColor } : {}}>
                    {isPast ? "✓ " : ""}{s.label}
                  </div>
                );
              })}
            </div>
            {selectedDeal.status === "open" && selectedStageIdx < selectedStages.length - 1 && (
              <button onClick={() => advanceStage(selectedDeal)}
                className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm"
                style={{ background: pipelines.find((p) => p.id === selectedDeal.pipeline_id)?.color || "#2a3db4" }}>
                Move to {selectedStages[selectedStageIdx + 1]?.label} →
              </button>
            )}
          </div>

          {/* Next action */}
          {selectedDeal.next_action && (
            <div className="px-5 py-3 border-b border-gray-50 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Next Action</p>
              <p className="text-sm text-gray-700">{selectedDeal.next_action}</p>
              {selectedDeal.next_action_due && (
                <p className={`text-xs mt-0.5 font-medium ${new Date(selectedDeal.next_action_due) < new Date() ? "text-red-500" : "text-gray-400"}`}>
                  Due {selectedDeal.next_action_due}
                </p>
              )}
            </div>
          )}

          {/* Log activity */}
          <div className="px-5 py-4 border-b border-gray-50 shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Log Activity</p>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {ACTIVITY_TYPES.map((t) => (
                <button key={t.key} onClick={() => setLogType(t.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${logType === t.key ? "bg-[#2a3db4] text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                  <span>{t.icon}</span><span>{t.label}</span>
                </button>
              ))}
            </div>
            <textarea value={logBody} onChange={(e) => setLogBody(e.target.value)}
              placeholder="What happened? One sentence is enough."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20 resize-none text-gray-700 placeholder-gray-300 mb-2" />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={logNextAction} onChange={(e) => setLogNextAction(e.target.value)}
                placeholder="Next action..."
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20 text-gray-700 placeholder-gray-300" />
              <input type="date" value={logDue} onChange={(e) => setLogDue(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20 text-gray-400" />
            </div>
            <button onClick={logActivity} disabled={!logBody.trim() || loggingActivity}
              className="w-full py-2.5 bg-[#2a3db4] text-white rounded-xl text-sm font-semibold hover:bg-[#1e2d8a] disabled:opacity-40 transition-all shadow-sm">
              {loggingActivity ? "Saving…" : "Log Activity"}
            </button>
          </div>

          {/* Activity timeline */}
          <div className="px-5 py-4 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Timeline</p>
            {dealActivities.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-300 text-sm">No activity yet.</p>
                <p className="text-gray-300 text-xs mt-1">Log your first touchpoint above.</p>
              </div>
            )}
            <div className="space-y-4">
              {dealActivities.map((a) => {
                const typeObj = ACTIVITY_TYPES.find((t) => t.key === a.type);
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
                      {a.type === "stage_change" ? "🔄" : typeObj?.icon || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-500">{a.subject || typeObj?.label}</p>
                        <p className="text-xs text-gray-300 shrink-0">{timeAgo(a.occurred_at)}</p>
                      </div>
                      {a.body && <p className="text-sm text-gray-700 mt-0.5 leading-snug">{a.body}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Deal form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-1">{editingDeal ? "Edit Deal" : "New Deal"} 🎯</h2>
            <p className="text-sm text-gray-400 mb-5">Every big win starts with a single conversation.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Humane Society — FoundationWorks"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Pipeline</label>
                  <select value={form.pipeline_id} onChange={(e) => setForm((f) => ({ ...f, pipeline_id: e.target.value, stage_id: "" }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20">
                    {pipelines.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Stage</label>
                  <select value={form.stage_id} onChange={(e) => setForm((f) => ({ ...f, stage_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20">
                    <option value="">— pick —</option>
                    {stages.filter((s) => s.pipeline_id === (form.pipeline_id || activePipeline)).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Company</label>
                  <select value={form.company_id} onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20">
                    <option value="">— none —</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Contact</label>
                  <select value={form.primary_contact_id} onChange={(e) => setForm((f) => ({ ...f, primary_contact_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20">
                    <option value="">— none —</option>
                    {contacts.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Value ($)</label>
                  <input type="number" min="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Expected Close</label>
                  <input type="date" value={form.expected_close} onChange={(e) => setForm((f) => ({ ...f, expected_close: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Next Action</label>
                <input value={form.next_action} onChange={(e) => setForm((f) => ({ ...f, next_action: e.target.value }))}
                  placeholder="e.g. Send follow-up email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Due Date</label>
                <input type="date" value={form.next_action_due} onChange={(e) => setForm((f) => ({ ...f, next_action_due: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Context, background, anything relevant..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/20 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditingDeal(null); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={saveDeal} disabled={!form.title || saving}
                className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-xl text-sm font-semibold hover:bg-[#1e2d8a] disabled:opacity-40 shadow-sm">
                {saving ? "Saving…" : editingDeal ? "Save Changes" : "Create Deal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
