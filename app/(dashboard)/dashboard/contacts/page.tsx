"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Contact = {
  id: string; company_id: string | null; first_name: string | null; last_name: string | null;
  full_name: string; title: string | null; email: string | null; phone: string | null;
  linkedin_url: string | null; tier: "A" | "B" | "C" | null; source: string | null;
  fit_notes: string | null; notes: string | null; created_at: string;
  companies?: { name: string } | null;
};
type Company = { id: string; name: string };

const EMPTY_FORM = {
  first_name: "", last_name: "", title: "", email: "", phone: "",
  linkedin_url: "", company_id: "", tier: "", source: "", fit_notes: "", notes: "",
};
const TIER_COLORS: Record<string, string> = { A: "bg-green-100 text-green-700", B: "bg-blue-100 text-blue-700", C: "bg-gray-100 text-gray-600" };

export default function ContactsPage() {
  const supabase = createClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [{ data: ctData }, { data: coData }] = await Promise.all([
      supabase.from("contacts").select("*, companies(name)").order("full_name"),
      supabase.from("companies").select("id, name").order("name"),
    ]);
    setContacts(ctData || []);
    setCompanies(coData || []);
  }, []);

  useEffect(() => { load(); }, []);

  function openNew() { setForm({ ...EMPTY_FORM }); setSelected(null); setShowForm(true); }
  function openEdit(c: Contact) {
    setForm({
      first_name: c.first_name || "", last_name: c.last_name || "", title: c.title || "",
      email: c.email || "", phone: c.phone || "", linkedin_url: c.linkedin_url || "",
      company_id: c.company_id || "", tier: c.tier || "", source: c.source || "",
      fit_notes: c.fit_notes || "", notes: c.notes || "",
    });
    setSelected(c); setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || form.email || "Unknown";
    const payload = {
      first_name: firstName || null, last_name: lastName || null, full_name: fullName,
      title: form.title || null, email: form.email || null, phone: form.phone || null,
      linkedin_url: form.linkedin_url || null, company_id: form.company_id || null,
      tier: (form.tier as "A" | "B" | "C") || null, source: form.source || null,
      fit_notes: form.fit_notes || null, notes: form.notes || null,
    };
    if (selected) {
      await supabase.from("contacts").update(payload).eq("id", selected.id);
    } else {
      await supabase.from("contacts").insert(payload);
    }
    setSaving(false); setShowForm(false); setSelected(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this contact?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    load();
  }

  const filtered = contacts.filter((c) => {
    const matchSearch = !search ||
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.companies?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchTier = !tierFilter || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const tierCounts = { A: contacts.filter((c) => c.tier === "A").length, B: contacts.filter((c) => c.tier === "B").length, C: contacts.filter((c) => c.tier === "C").length };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts 👤</h1>
          <p className="text-sm text-gray-400">The people behind every opportunity.</p>
        </div>
        <button onClick={openNew} className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] font-medium shadow transition-colors">
          + Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
        </div>
        {(["A", "B", "C"] as const).map((tier) => (
          <button key={tier} onClick={() => setTierFilter(tierFilter === tier ? "" : tier)}
            className={`rounded-xl border shadow-sm p-4 text-left transition-all ${tierFilter === tier ? "ring-2 ring-[#2a3db4]" : ""} ${tier === "A" ? "bg-green-50 border-green-200" : tier === "B" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${tier === "A" ? "text-green-600" : tier === "B" ? "text-blue-600" : "text-gray-500"}`}>Tier {tier}</p>
            <p className={`text-2xl font-bold mt-1 ${tier === "A" ? "text-green-700" : tier === "B" ? "text-blue-700" : "text-gray-700"}`}>{tierCounts[tier]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts by name, email, or company..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Company</th>
              <th className="text-left px-5 py-3">Contact</th>
              <th className="text-left px-5 py-3">Tier</th>
              <th className="text-left px-5 py-3">Source</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                {search || tierFilter ? "No contacts match." : "No contacts yet — add your first one!"}
              </td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-semibold text-gray-900">{c.full_name}</p>
                  {c.title && <p className="text-xs text-gray-400">{c.title}</p>}
                </td>
                <td className="px-5 py-3 text-gray-500">{c.companies?.name || "—"}</td>
                <td className="px-5 py-3">
                  {c.email && <a href={`mailto:${c.email}`} className="text-xs text-blue-500 hover:underline block">{c.email}</a>}
                  {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                </td>
                <td className="px-5 py-3">
                  {c.tier ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[c.tier]}`}>
                      {c.tier === "A" ? "⭐ A" : c.tier === "B" ? "🔵 B" : "⚪ C"}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-5 py-3 text-xs text-gray-400">{c.source || "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 items-center">
                    {c.linkedin_url && (
                      <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">in</a>
                    )}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-1">{selected ? "Edit Contact" : "Add Contact"} 👤</h2>
            <p className="text-sm text-gray-400 mb-5">People move opportunities forward.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">First Name</label>
                  <input value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Last Name</label>
                  <input value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title / Role</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Executive Director"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Company</label>
                  <select value={form.company_id} onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30">
                    <option value="">— none —</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">LinkedIn URL</label>
                <input value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Tier</label>
                  <div className="flex gap-2">
                    {(["A", "B", "C"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, tier: f.tier === t ? "" : t }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${form.tier === t ? (t === "A" ? "bg-green-500 text-white border-green-500" : t === "B" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-500 text-white border-gray-500") : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Source</label>
                  <input value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    placeholder="LinkedIn, referral..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Fit Notes</label>
                <input value={form.fit_notes} onChange={(e) => setForm((f) => ({ ...f, fit_notes: e.target.value }))}
                  placeholder="Why they're a good fit..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Context, background, history..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setSelected(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2d8a] disabled:opacity-50">
                {saving ? "Saving…" : selected ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
