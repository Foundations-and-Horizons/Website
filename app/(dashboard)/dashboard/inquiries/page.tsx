"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Inquiry = {
  id: string; first_name: string; last_name: string; email: string;
  subject: string; message: string; status: "new" | "reviewed" | "converted" | "closed";
  created_at: string;
};

export default function InquiriesPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("open");

  async function load() {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setItems((data || []) as Inquiry[]);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: Inquiry["status"]) {
    await supabase.from("contact_submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setSelected((s) => s?.id === id ? { ...s, status } : s);
    load();
  }

  const visible = items.filter((i) => filter === "all" ? true : filter === "open" ? i.status === "new" || i.status === "reviewed" : i.status === filter);
  const newCount = items.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-[#10213f] px-6 py-7 sm:px-8 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f2a18c]">Listen first</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="font-serif text-3xl sm:text-4xl">Website Inquiries</h1><p className="mt-2 text-sm text-white/55">People who raised their hand. Start with what they told you.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3"><span className="text-2xl font-bold">{newCount}</span><span className="ml-2 text-xs text-white/45">new</span></div>
        </div>
      </section>

      <div className="flex gap-2 flex-wrap">
        {["open","new","reviewed","converted","closed","all"].map((x) => <button key={x} onClick={() => setFilter(x)}
          className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${filter === x ? "bg-[#10213f] text-white" : "bg-white text-[#10213f]/60 border border-[#10213f]/10 hover:border-[#10213f]/25"}`}>{x}</button>)}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-2xl border border-[#10213f]/10 bg-white shadow-sm">
          {visible.length === 0 ? <div className="p-12 text-center"><p className="font-serif text-xl text-[#10213f]">Inbox clear.</p><p className="mt-2 text-sm text-gray-400">New website conversations will appear here automatically.</p></div> :
          visible.map((i) => <button key={i.id} onClick={() => { setSelected(i); if(i.status === "new") setStatus(i.id,"reviewed"); }}
            className={`block w-full border-b border-[#10213f]/[.07] p-5 text-left transition last:border-0 hover:bg-[#f7f2e8]/60 ${selected?.id === i.id ? "bg-[#f7f2e8]" : ""}`}>
            <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2">{i.status === "new" && <span className="h-2 w-2 rounded-full bg-[#e86f51]" />}<p className="font-bold text-[#10213f]">{i.first_name} {i.last_name}</p></div><p className="mt-1 text-sm font-medium text-gray-600">{i.subject}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{i.message}</p></div><p className="shrink-0 text-[10px] uppercase tracking-wider text-gray-300">{new Date(i.created_at).toLocaleDateString()}</p></div>
          </button>)}
        </div>

        <aside className="rounded-2xl border border-[#10213f]/10 bg-white p-6 shadow-sm h-fit">
          {!selected ? <div className="py-12 text-center"><p className="font-serif text-xl text-[#10213f]">Choose a conversation</p><p className="mt-2 text-sm text-gray-400">The full message and next actions will appear here.</p></div> :
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e86f51]">What they told you</p>
            <h2 className="mt-2 font-serif text-2xl text-[#10213f]">{selected.first_name} {selected.last_name}</h2>
            <a className="mt-1 block text-sm text-[#2448d8] hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-400">{selected.subject}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">{selected.message}</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + selected.subject)}`} className="rounded-xl bg-[#2448d8] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#10213f]">Reply</a>
              <button onClick={() => setStatus(selected.id,"converted")} className="rounded-xl border border-[#10213f]/10 px-4 py-3 text-sm font-bold text-[#10213f] hover:bg-[#f7f2e8]">Mark converted</button>
              <button onClick={() => setStatus(selected.id,"reviewed")} className="rounded-xl border border-[#10213f]/10 px-4 py-2 text-xs font-semibold text-gray-500">Keep open</button>
              <button onClick={() => setStatus(selected.id,"closed")} className="rounded-xl border border-[#10213f]/10 px-4 py-2 text-xs font-semibold text-gray-400">Close</button>
            </div>
          </div>}
        </aside>
      </div>
    </div>
  );
}
