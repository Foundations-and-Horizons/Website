"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string; name: string; website: string | null; industry: string | null;
  city: string | null; state: string | null; size: string | null; notes: string | null;
  created_at: string; updated_at: string;
  _contact_count?: number; _deal_count?: number;
};

const EMPTY_FORM = { name: "", website: "", industry: "", city: "", state: "", size: "", notes: "" };

export default function CompaniesPage() {
  const supabase = createClient();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [selected, setSelected] = useState<Company | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("companies").select("*").order("name");
    if (!data) return;
    // Fetch contact and deal counts
    const enriched = await Promise.all(data.map(async (c) => {
      const [{ count: cc }, { count: dc }] = await Promise.all([
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("company_id", c.id),
        supabase.from("deals").select("*", { count: "exact", head: true }).eq("company_id", c.id),
      ]);
      return { ...c, _contact_count: cc || 0, _deal_count: dc || 0 };
    }));
    setCompanies(enriched);
  }, []);

  useEffect(() => { load(); }, []);

  function openNew() { setForm({ ...EMPTY_FORM }); setSelected(null); setShowForm(true); }
  function openEdit(c: Company) {
    setForm({ name: c.name, website: c.website || "", industry: c.industry || "", city: c.city || "", state: c.state || "", size: c.size || "", notes: c.notes || "" });
    setSelected(c); setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      name: form.name, website: form.website || null, industry: form.industry || null,
      city: form.city || null, state: form.state || null, size: form.size || null, notes: form.notes || null,
    };
    if (selected) {
      await supabase.from("companies").update(payload).eq("id", selected.id);
    } else {
      await supabase.from("companies").insert(payload);
    }
    setSaving(false); setShowForm(false); setSelected(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this company? All linked contacts and deals will be unlinked.")) return;
    await supabase.from("companies").delete().eq("id", id);
    load();
  }

  const filtered = companies.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies 🏢</h1>
          <p className="text-sm text-gray-400">Your network of organizations and opportunities.</p>
        </div>
        <button onClick={openNew} className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] font-medium shadow transition-colors">
          + Add Company
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{companies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">With Deals</p>
          <p className="text-2xl font-bold text-[#2a3db4] mt-1">{companies.filter((c) => (c._deal_count || 0) > 0).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contacts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{companies.reduce((s, c) => s + (c._contact_count || 0), 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Company</th>
              <th className="text-left px-5 py-3">Industry</th>
              <th className="text-left px-5 py-3">Location</th>
              <th className="text-left px-5 py-3">Contacts</th>
              <th className="text-left px-5 py-3">Deals</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                {search ? "No companies match your search." : "No companies yet — add your first one!"}
              </td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{c.website.replace(/^https?:\/\//, "")}</a>}
                </td>
                <td className="px-5 py-3 text-gray-500">{c.industry || "—"}</td>
                <td className="px-5 py-3 text-gray-500">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-5 py-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{c._contact_count}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{c._deal_count}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-xs text-gray-400 hover:text-[#2a3db4]">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-xs text-gray-300 hover:text-red-500">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-1">{selected ? "Edit Company" : "Add Company"} 🏢</h2>
            <p className="text-sm text-gray-400 mb-5">Build your organization network.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Acme Corporation"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Industry</label>
                  <input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                    placeholder="Nonprofit"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Size</label>
                  <select value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    <option value="">— pick —</option>
                    <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Website</label>
                <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">City</label>
                  <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">State</label>
                  <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Background, context, opportunities..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setSelected(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || saving} className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2d8a] disabled:opacity-50">
                {saving ? "Saving…" : selected ? "Update" : "Add Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
