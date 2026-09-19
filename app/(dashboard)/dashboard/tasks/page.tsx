"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Task = { id:string; title:string; done:boolean; due_date:string|null; priority:"low"|"med"|"high"|null; created_at:string; deals?:{title:string}|null; contacts?:{full_name:string}|null };
export default function WorkQueuePage(){
  const supabase=createClient();
  const [tasks,setTasks]=useState<Task[]>([]);
  const [title,setTitle]=useState("");
  const [due,setDue]=useState("");
  const [priority,setPriority]=useState<"low"|"med"|"high">("med");
  const [showDone,setShowDone]=useState(false);
  async function load(){const {data}=await supabase.from("tasks").select("*, deals(title), contacts(full_name)").order("done").order("due_date",{ascending:true,nullsFirst:false}).order("created_at",{ascending:false});setTasks((data||[]) as Task[])}
  useEffect(()=>{load()},[]);
  async function add(){if(!title.trim())return;await supabase.from("tasks").insert({title:title.trim(),due_date:due||null,priority});setTitle("");setDue("");setPriority("med");load()}
  async function toggle(t:Task){await supabase.from("tasks").update({done:!t.done,completed_at:!t.done?new Date().toISOString():null}).eq("id",t.id);load()}
  const visible=tasks.filter(t=>showDone||!t.done);
  const dueNow=tasks.filter(t=>!t.done&&t.due_date&&t.due_date<=new Date().toISOString().split("T")[0]).length;
  return <div className="space-y-6">
    <section className="rounded-[28px] bg-[#10213f] px-6 py-7 sm:px-8 text-white">
      <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a7d8c8]">Keep it moving</p>
      <div className="mt-2 flex items-end justify-between gap-4"><div><h1 className="font-serif text-3xl sm:text-4xl">Work Queue</h1><p className="mt-2 text-sm text-white/55">One place for the next useful moves—without carrying them in your head.</p></div><div className="hidden sm:block text-right"><p className="text-2xl font-bold">{dueNow}</p><p className="text-[10px] uppercase tracking-wider text-white/40">due now</p></div></div>
    </section>
    <section className="rounded-2xl border border-[#10213f]/10 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e86f51]">Capture the next move</p>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_160px_130px_auto]">
        <input value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")add()}} placeholder="What needs to happen?" className="rounded-xl border border-[#10213f]/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2448d8]/20"/>
        <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="rounded-xl border border-[#10213f]/10 px-3 py-3 text-sm"/>
        <select value={priority} onChange={e=>setPriority(e.target.value as "low"|"med"|"high")} className="rounded-xl border border-[#10213f]/10 px-3 py-3 text-sm"><option value="low">Low</option><option value="med">Normal</option><option value="high">High</option></select>
        <button onClick={add} className="rounded-xl bg-[#2448d8] px-5 py-3 text-sm font-bold text-white hover:bg-[#10213f]">Add task</button>
      </div>
    </section>
    <section className="overflow-hidden rounded-2xl border border-[#10213f]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#10213f]/[.07] p-5"><div><p className="font-serif text-xl text-[#10213f]">On the radar</p><p className="mt-1 text-xs text-gray-400">{tasks.filter(t=>!t.done).length} open tasks</p></div><button onClick={()=>setShowDone(!showDone)} className="text-xs font-semibold text-[#2448d8]">{showDone?"Hide completed":"Show completed"}</button></div>
      {visible.length===0?<div className="p-12 text-center text-sm text-gray-400">Queue clear. Nothing needs carrying right now.</div>:visible.map(t=><div key={t.id} className={`flex items-start gap-4 border-b border-[#10213f]/[.06] p-5 last:border-0 ${t.done?"opacity-45":""}`}>
        <button onClick={()=>toggle(t)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${t.done?"border-[#a7d8c8] bg-[#a7d8c8] text-[#10213f]":"border-[#10213f]/20"}`}>{t.done?"✓":""}</button>
        <div className="min-w-0 flex-1"><p className={`text-sm font-semibold text-[#10213f] ${t.done?"line-through":""}`}>{t.title}</p>{(t.deals?.title||t.contacts?.full_name)&&<p className="mt-1 text-xs text-gray-400">{t.deals?.title||t.contacts?.full_name}</p>}</div>
        <div className="text-right"><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${t.priority==="high"?"bg-[#fff0eb] text-[#c85b40]":t.priority==="low"?"bg-[#eef7f4] text-[#4f8b77]":"bg-[#eef2ff] text-[#2448d8]"}`}>{t.priority||"normal"}</span>{t.due_date&&<p className="mt-2 text-[10px] text-gray-400">{t.due_date}</p>}</div>
      </div>)}
    </section>
  </div>
}
