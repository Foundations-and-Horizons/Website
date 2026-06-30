"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Entry = { id: string; description: string; amount: number; date_received: string; lead_id: string | null; created_at: string };

export default function RevenuePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goal, setGoal] = useState(25000);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("25000");
  const [form, setForm] = useState({ description: "", amount: "", date_received: "" });
  const supabase = createClient();

  async function load() {
    const yearStart = new Date().getFullYear() + "-01-01";
    const { data } = await supabase.from("revenue_entries").select("*").gte("date_received", yearStart).order("date_received", { ascending: false });
    setEntries(data || []);
    const { data: gs } = await supabase.from("settings").select("value").eq("key", "annual_revenue_goal").single();
    if (gs) { setGoal(Number(gs.value)); setGoalInput(gs.value); }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    await supabase.from("revenue_entries").insert({ description: form.description, amount: parseFloat(form.amount), date_received: form.date_received });
    setForm({ description: "", amount: "", date_received: "" });
    setShowForm(false);
    load();
  }

  async function saveGoal() {
    await supabase.from("settings").upsert({ key: "annual_revenue_goal", value: goalInput });
    setEditGoal(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("revenue_entries").delete().eq("id", id);
    load();
  }

  const total = entries.reduce((s, e) => s + Number(e.amount), 0);
  const pct = Math.min(100, Math.round((total / goal) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenue vs. Goal</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded hover:bg-[#1e2d8a]">
          + Add Revenue
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-3xl font-bold text-gray-900">${total.toLocaleString()}</p>
            <p className="text-sm text-gray-500">of ${goal.toLocaleString()} goal ({new Date().getFullYear()})</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#2a3db4]">{pct}%</p>
            {!editGoal ? (
              <button onClick={() => setEditGoal(true)} className="text-xs text-gray-400 hover:underline">Edit goal</button>
            ) : (
              <div className="flex gap-1 items-center mt-1">
                <span className="text-sm">$</span>
                <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm" />
                <button onClick={saveGoal} className="text-xs bg-[#2a3db4] text-white px-2 py-1 rounded">Save</button>
                <button onClick={() => setEditGoal(false)} className="text-xs text-gray-400 hover:underline ml-1">Cancel</button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div className="bg-[#2a3db4] h-4 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">${(goal - total).toLocaleString()} remaining to goal</p>
      </div>

      {/* Entries table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 text-gray-500">{e.date_received}</td>
                <td className="px-4 py-3">{e.description}</td>
                <td className="px-4 py-3 font-medium text-green-700">${Number(e.amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(e.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No revenue logged yet this year</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add Revenue</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Description</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Amount ($)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Date Received</label>
                <input type="date" value={form.date_received} onChange={(e) => setForm((f) => ({ ...f, date_received: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 border border-gray-300 rounded">Cancel</button>
              <button onClick={save} className="text-sm px-4 py-2 bg-[#2a3db4] text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
