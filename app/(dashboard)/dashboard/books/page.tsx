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
    setSales(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    await supabase.from("book_sales").insert({
      period: form.period,
      units_sold: parseInt(form.units_sold) || 0,
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

  function formatPeriod(p: string) {
    const [y, m] = p.split("-");
    if (!m) return p;
    return new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  // Charts
  const maxUnits = Math.max(...sales.map((s) => s.units_sold), 1);

  // Line chart SVG helpers
  const chartWidth = 600;
  const chartHeight = 160;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const sorted = [...sales].reverse();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Sales Log</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded hover:bg-[#1e2d8a]">
          + Log Sales
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500">Total Units Sold</p>
          <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500">Days Since Last Log</p>
          <p className={`text-3xl font-bold ${lastLogged !== null && lastLogged > 30 ? "text-yellow-600" : "text-gray-900"}`}>
            {lastLogged !== null ? lastLogged : "—"}
          </p>
          {lastLogged !== null && lastLogged > 14 && (
            <p className="text-xs text-yellow-600 mt-1">Time to check KDP Reports!</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500">Entries Logged</p>
          <p className="text-3xl font-bold text-gray-900">{sales.length}</p>
        </div>
      </div>

      {/* Line chart */}
      {sorted.length > 1 && (
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Sales Trend</h2>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height: 160 }}>
            {/* Y-axis gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const y = padTop + (1 - frac) * (chartHeight - padTop - padBottom);
              return (
                <g key={frac}>
                  <line x1={padLeft} x2={chartWidth - padRight} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} />
                  <text x={padLeft - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                    {Math.round(frac * lineMax)}
                  </text>
                </g>
              );
            })}
            {/* Filled area */}
            <polygon points={areaPoints} fill="#2a3db4" fillOpacity={0.08} />
            {/* Line */}
            <polyline points={points} fill="none" stroke="#2a3db4" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {/* Dots + labels */}
            {sorted.map((s, i) => (
              <g key={s.id}>
                <circle cx={toX(i)} cy={toY(s.units_sold)} r={4} fill="#2a3db4" stroke="white" strokeWidth={1.5} />
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
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Units by Period</h2>
          <div className="flex items-end gap-2 h-32 overflow-x-auto pb-2">
            {[...sales].reverse().map((s) => (
              <div key={s.id} className="flex flex-col items-center min-w-[40px]">
                <span className="text-xs text-gray-500 mb-1">{s.units_sold}</span>
                <div
                  className="bg-[#2a3db4] rounded-t w-8"
                  style={{ height: `${(s.units_sold / maxUnits) * 100}px` }}
                />
                <span className="text-xs text-gray-400 mt-1 rotate-45 origin-top-left whitespace-nowrap" style={{ fontSize: "10px" }}>
                  {formatPeriod(s.period)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Period</th>
              <th className="text-left px-4 py-3">Units Sold</th>
              <th className="text-left px-4 py-3">Notes</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">{formatPeriod(s.period)}</td>
                <td className="px-4 py-3 font-medium">{s.units_sold}</td>
                <td className="px-4 py-3 text-gray-500">{s.notes || "—"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(s.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Log Book Sales</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Month</label>
                <input type="month" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Units Sold</label>
                <input type="number" value={form.units_sold} onChange={(e) => setForm((f) => ({ ...f, units_sold: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Notes</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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
