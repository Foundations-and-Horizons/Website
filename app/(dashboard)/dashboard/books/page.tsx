"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Sale = { id: string; period: string; units_sold: number; notes: string | null; created_at: string };

export default function BookSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ period: "", units_sold: "", notes: "" });
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("book_sales").select("*").order("period", { ascending: false });
    setSales((data || []).map((r) => ({ ...r, units_sold: Number(r.units_sold) })));
  }
  useEffect(() => { load(); }, []);

  async function save() {
    // period column is DATE — pad YYYY-MM to YYYY-MM-01 so Postgres accepts it
    const period = form.period.length === 7 ? form.period + "-01" : form.period;
    await supabase.from("book_sales").insert({
      period,
      units_sold: form.units_sold === "" ? 0 : parseInt(form.units_sold),
      notes: form.notes || null,
    });
    setForm({ period: "", units_sold: "", notes: "" });
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("book_sales").delete().eq("id", id);
    load();
  }

  const lastLogged = sales[0]?.created_at
    ? Math.floor((Date.now() - new Date(sales[0].created_at).getTime()) / 86400000)
    : null;
  const totalUnits = sales.reduce((s, r) => s + r.units_sold, 0);
  const bestMonth = sales.reduce((best, s) => s.units_sold > best ? s.units_sold : best, 0);
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const thisMonth = sales.find((s) => s.period.slice(0, 7) === thisMonthKey)?.units_sold ?? null;

  function formatPeriod(p: string) {
    const [y, m] = p.split("-");
    if (!m) return p;
    return new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  // Charts
  const maxUnits = Math.max(...sales.map((s) => s.units_sold), 1);
  const sorted = [...sales].reverse();
  const chartWidth = 600;
  const chartHeight = 160;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const lineMax = Math.max(...sorted.map((s) => s.units_sold), 1);
  const toX = (i: number) =>
    sorted.length < 2
      ? padLeft + (chartWidth - padLeft - padRight) / 2
      : padLeft + (i / (sorted.length - 1)) * (chartWidth - padLeft - padRight);
  const toY = (v: number) =>
    padTop + (1 - v / lineMax) * (chartHeight - padTop - padBottom);
  const points = sorted.map((s, i) => `${toX(i)},${toY(s.units_sold)}`).join(" ");
  const areaPoints = [
    `${toX(0)},${chartHeight - padBottom}`,
    ...sorted.map((s, i) => `${toX(i)},${toY(s.units_sold)}`),
    `${toX(sorted.length - 1)},${chartHeight - padBottom}`,
  ].join(" ");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Sales 📚</h1>
          <p className="text-sm text-gray-400">Every copy is proof the message is spreading.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] font-medium shadow transition-colors"
        >
          + Log Month
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">All Time</p>
          <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
          <p className="text-xs text-gray-400 mt-1">copies sold 🎉</p>
        </div>
        <div className={`rounded-xl shadow-sm border p-5 ${thisMonth !== null && thisMonth === 0 ? "bg-red-50 border-red-200" : thisMonth !== null && thisMonth === bestMonth ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">This Month</p>
          <p className={`text-3xl font-bold ${thisMonth === null ? "text-gray-400" : thisMonth === 0 ? "text-red-500" : thisMonth === bestMonth ? "text-green-600" : "text-gray-900"}`}>
            {thisMonth !== null ? thisMonth : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">{thisMonth === bestMonth && thisMonth > 0 ? "best month! 🏆" : thisMonth === 0 ? "zero this month" : "units"}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Best Month</p>
          <p className="text-3xl font-bold text-amber-500">{bestMonth || "—"}</p>
          <p className="text-xs text-gray-400 mt-1">units 🏅</p>
        </div>
        <div className={`rounded-xl shadow-sm border p-5 ${lastLogged !== null && lastLogged > 30 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Last Logged</p>
          <p className={`text-3xl font-bold ${lastLogged !== null && lastLogged > 30 ? "text-amber-500" : "text-gray-900"}`}>
            {lastLogged !== null ? `${lastLogged}d` : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {lastLogged !== null && lastLogged > 14 ? "check KDP! 👀" : "ago"}
          </p>
        </div>
      </div>

      {/* Line chart */}
      {sorted.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3">📈 Sales Trend</h2>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height: 160 }}>
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const y = padTop + (1 - frac) * (chartHeight - padTop - padBottom);
              return (
                <g key={frac}>
                  <line x1={padLeft} x2={chartWidth - padRight} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} />
                  <text x={padLeft - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{Math.round(frac * lineMax)}</text>
                </g>
              );
            })}
            <polygon points={areaPoints} fill="#2a3db4" fillOpacity={0.08} />
            <polyline points={points} fill="none" stroke="#2a3db4" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {sorted.map((s, i) => (
              <g key={s.id}>
                <circle cx={toX(i)} cy={toY(s.units_sold)} r={4} fill={s.units_sold === 0 ? "#fca5a5" : "#2a3db4"} stroke="white" strokeWidth={1.5} />
                <text x={toX(i)} y={chartHeight - padBottom + 14} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  {formatPeriod(s.period)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Bar chart */}
      {sales.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">📊 Units by Month</h2>
          <div className="flex items-end gap-2 h-32 overflow-x-auto pb-2">
            {sorted.map((s) => (
              <div key={s.id} className="flex flex-col items-center min-w-[48px]">
                <span className={`text-xs mb-1 font-medium ${Number(s.units_sold) === 0 ? "text-red-400" : "text-gray-600"}`}>{s.units_sold}</span>
                <div
                  className={`rounded-t w-8 transition-all ${Number(s.units_sold) === 0 ? "bg-red-300 border border-red-400" : Number(s.units_sold) === bestMonth ? "bg-amber-400" : "bg-[#2a3db4]"}`}
                  style={{ height: Number(s.units_sold) === 0 ? "24px" : `${Math.max(4, (Number(s.units_sold) / maxUnits) * 100)}px` }}
                />
                <span className="text-gray-400 mt-1 whitespace-nowrap" style={{ fontSize: "9px" }}>
                  {formatPeriod(s.period).split(" ")[0].slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-700">All Entries</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Month</th>
              <th className="text-left px-5 py-3">Units</th>
              <th className="text-left px-5 py-3">Notes</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No entries yet — log your first month!</td></tr>
            )}
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{formatPeriod(s.period)}</td>
                <td className="px-5 py-3">
                  <span className={`font-bold ${s.units_sold === 0 ? "text-red-400" : s.units_sold === bestMonth ? "text-amber-500" : "text-gray-900"}`}>
                    {s.units_sold}
                    {s.units_sold === bestMonth && s.units_sold > 0 ? " 🏆" : ""}
                    {s.units_sold === 0 ? " 😬" : ""}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{s.notes || "—"}</td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(s.id)} className="text-xs text-gray-300 hover:text-red-500 transition-colors">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-1">Log Book Sales</h2>
            <p className="text-sm text-gray-400 mb-5">Record your KDP numbers for the month.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Month</label>
                <input type="month" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Units Sold</label>
                <input type="number" min="0" value={form.units_sold} onChange={(e) => setForm((f) => ({ ...f, units_sold: e.target.value }))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Anything notable this month?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
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
