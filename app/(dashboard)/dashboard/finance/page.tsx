"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  tax_deductible: boolean;
  receipt_note: string | null;
  created_at: string;
};

const INCOME_CATEGORIES = ["Consulting fees","Platform deployment fees","Support/retainer fees","Book royalties"];
const EXPENSE_CATEGORIES = ["Software/subscriptions","Hosting/domain","Marketing","Travel/mileage","Professional development","Equipment","Contract labor","Books/printing","Misc"];

function exportCSV(rows: Transaction[]) {
  const header = ["Date","Type","Category","Description","Amount","Tax Deductible","Receipt Note"];
  const lines = rows.map((r) => [
    r.date, r.type, r.category, r.description,
    r.amount, r.tax_deductible ? "Yes" : "No", r.receipt_note || ""
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "fh-finances.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goal, setGoal] = useState(25000);
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("25000");
  const [monthFilter, setMonthFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense" as "income" | "expense",
    category: EXPENSE_CATEGORIES[0],
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    tax_deductible: false,
    receipt_note: "",
  });
  const supabase = createClient();

  async function load() {
    let q = supabase.from("transactions").select("*").order("date", { ascending: false });
    if (monthFilter !== "all") q = q.like("date", monthFilter + "%");
    if (catFilter !== "all") q = q.eq("category", catFilter);
    const { data } = await q;
    setTransactions(data || []);
    const { data: gs } = await supabase.from("settings").select("value").eq("key", "annual_net_income_goal").single();
    if (gs) { setGoal(Number(gs.value)); setGoalInput(gs.value); }
  }
  useEffect(() => { load(); }, [monthFilter, catFilter]);

  async function saveGoal() {
    await supabase.from("settings").upsert({ key: "annual_net_income_goal", value: goalInput });
    setGoal(Number(goalInput));
    setEditGoal(false);
  }

  async function save() {
    await supabase.from("transactions").insert({
      ...form,
      amount: parseFloat(form.amount),
      receipt_note: form.receipt_note || null,
    });
    setForm({ type: "expense", category: EXPENSE_CATEGORIES[0], description: "", amount: "",
      date: new Date().toISOString().split("T")[0], tax_deductible: false, receipt_note: "" });
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this transaction?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    load();
  }

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const net = income - expenses;
  const goalPct = Math.min(100, Math.max(0, Math.round((net / goal) * 100)));

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setMonth(i);
    return { value: new Date().getFullYear() + "-" + String(i + 1).padStart(2, "0"), label: d.toLocaleString("en-US", { month: "long" }) + " " + new Date().getFullYear() };
  });

  const allCats = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Income & Expenses</h1>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(transactions)}
            className="text-sm border border-gray-300 px-3 py-2 rounded hover:bg-gray-50">Export CSV</button>
          <button onClick={() => setShowForm(true)}
            className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded hover:bg-[#1e2d8a]">
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Net Income Goal */}
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Income Goal — {new Date().getFullYear()}</p>
            <p className="text-2xl font-bold text-gray-900">${net.toLocaleString()} <span className="text-sm font-normal text-gray-400">of ${goal.toLocaleString()}</span></p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#2a3db4]">{goalPct}%</p>
            {!editGoal ? (
              <button onClick={() => setEditGoal(true)} className="text-xs text-gray-400 hover:text-[#2a3db4] hover:underline">Edit goal</button>
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
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all ${net < 0 ? "bg-red-500" : "bg-[#2a3db4]"}`} style={{ width: `${goalPct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">${Math.max(0, goal - net).toLocaleString()} remaining to goal</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500">Total Income</p>
          <p className="text-3xl font-bold text-green-600">${income.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">${expenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-2 border-[#2a3db4]">
          <p className="text-xs text-gray-500">Net</p>
          <p className={`text-3xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
            {net >= 0 ? "+" : ""}${net.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1">
          <option value="all">All Months</option>
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1">
          <option value="all">All Categories</option>
          {allCats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Tax</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 text-gray-500">{t.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded px-2 py-0.5 ${t.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{t.category}</td>
                <td className="px-4 py-3">{t.description}</td>
                <td className={`px-4 py-3 font-medium ${t.type === "income" ? "text-green-700" : "text-red-700"}`}>
                  {t.type === "income" ? "+" : "−"}${Number(t.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{t.tax_deductible ? "✓" : ""}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No transactions logged</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Type</label>
                <select value={form.type} onChange={(e) => {
                  const t = e.target.value as "income" | "expense";
                  setForm((f) => ({ ...f, type: t, category: t === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] }));
                }} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                  {(form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-xs text-gray-600 mb-0.5">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
              {form.type === "expense" && (
                <>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="taxd" checked={form.tax_deductible}
                      onChange={(e) => setForm((f) => ({ ...f, tax_deductible: e.target.checked }))} />
                    <label htmlFor="taxd" className="text-sm text-gray-700">Tax deductible</label>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Receipt location</label>
                    <input value={form.receipt_note} onChange={(e) => setForm((f) => ({ ...f, receipt_note: e.target.value }))}
                      placeholder="e.g. Gmail, Dropbox/receipts"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  </div>
                </>
              )}
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
