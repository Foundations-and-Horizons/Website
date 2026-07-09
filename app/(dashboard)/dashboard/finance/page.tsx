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
  const taxDeductible = transactions.filter((t) => t.tax_deductible).reduce((s, t) => s + Number(t.amount), 0);

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setMonth(i);
    return { value: new Date().getFullYear() + "-" + String(i + 1).padStart(2, "0"), label: d.toLocaleString("en-US", { month: "long" }) + " " + new Date().getFullYear() };
  });

  const allCats = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  const barColor = net < 0 ? "bg-red-500" : goalPct >= 75 ? "bg-green-500" : "bg-[#2a3db4]";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance 💰</h1>
          <p className="text-sm text-gray-400">Every dollar in and out of the business.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(transactions)}
            className="text-sm border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Export CSV
          </button>
          <button onClick={() => setShowForm(true)}
            className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] font-medium shadow transition-colors">
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Net Income Goal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Annual Net Income Goal — {new Date().getFullYear()}</p>
            <p className="text-3xl font-bold text-gray-900">${net.toLocaleString()}</p>
            <p className="text-sm text-gray-400">of ${goal.toLocaleString()} goal</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${goalPct >= 100 ? "text-green-600" : goalPct >= 50 ? "text-[#2a3db4]" : "text-gray-700"}`}>
              {goalPct}%
            </p>
            {goalPct >= 100 ? (
              <p className="text-xs text-green-500 font-semibold">Goal hit! 🎉</p>
            ) : !editGoal ? (
              <button onClick={() => setEditGoal(true)} className="text-xs text-gray-400 hover:text-[#2a3db4] hover:underline">Edit goal</button>
            ) : (
              <div className="flex gap-1 items-center mt-1">
                <span className="text-sm">$</span>
                <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                <button onClick={saveGoal} className="text-xs bg-[#2a3db4] text-white px-2 py-1 rounded-lg">Save</button>
                <button onClick={() => setEditGoal(false)} className="text-xs text-gray-400 hover:underline ml-1">✕</button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div className={`h-4 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.max(2, goalPct)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">${Math.max(0, goal - net).toLocaleString()} remaining to goal</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Income</p>
          <p className="text-2xl font-bold text-green-600">+${income.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Expenses</p>
          <p className="text-2xl font-bold text-red-500">−${expenses.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl shadow-sm border p-5 ${net >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Net</p>
          <p className={`text-2xl font-bold ${net >= 0 ? "text-green-700" : "text-red-600"}`}>
            {net >= 0 ? "+" : ""}${net.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tax Deductible</p>
          <p className="text-2xl font-bold text-amber-500">${taxDeductible.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
          <option value="all">All Months</option>
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
          <option value="all">All Categories</option>
          {allCats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Type</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Description</th>
              <th className="text-left px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Tax ✓</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-400">{t.date}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${t.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {t.type === "income" ? "↑ income" : "↓ expense"}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{t.category}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{t.description}</td>
                <td className={`px-5 py-3 font-bold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "−"}${Number(t.amount).toLocaleString()}
                </td>
                <td className="px-5 py-3 text-xs">{t.tax_deductible ? <span className="text-amber-500 font-semibold">✓</span> : <span className="text-gray-200">—</span>}</td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(t.id)} className="text-xs text-gray-300 hover:text-red-500 transition-colors">✕</button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No transactions logged yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-1">Add Transaction</h2>
            <p className="text-sm text-gray-400 mb-5">Log income or an expense.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Type</label>
                <div className="flex gap-2">
                  {(["income", "expense"] as const).map((t) => (
                    <button key={t} onClick={() => setForm((f) => ({ ...f, type: t, category: t === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${form.type === t ? (t === "income" ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500") : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {t === "income" ? "↑ Income" : "↓ Expense"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                  {(form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Amount ($)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              {form.type === "expense" && (
                <>
                  <div className="flex items-center gap-3 py-1">
                    <input type="checkbox" id="taxd" checked={form.tax_deductible}
                      onChange={(e) => setForm((f) => ({ ...f, tax_deductible: e.target.checked }))}
                      className="w-4 h-4 accent-[#2a3db4]" />
                    <label htmlFor="taxd" className="text-sm text-gray-700 font-medium">Tax deductible</label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Receipt location</label>
                    <input value={form.receipt_note} onChange={(e) => setForm((f) => ({ ...f, receipt_note: e.target.value }))}
                      placeholder="e.g. Gmail, Dropbox/receipts"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2d8a]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
