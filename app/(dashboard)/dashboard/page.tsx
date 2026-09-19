import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function startOfWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];
  const weekStart = startOfWeek();

  const [
    { data: overdueDealRows },
    { data: openDeals },
    { data: wonDeals },
    { data: pipelines },
    { data: postsThisWeek },
    { data: lastPost },
    { data: lastSale },
    { data: totalSales },
    { data: goalRow },
    { data: transactions },
    { data: openTasks },
    { data: newInquiries },
    { data: recentActivities },
  ] = await Promise.all([
    supabase.from("deals").select("id, title, next_action, next_action_due, companies(name)")
      .eq("status", "open").not("next_action_due", "is", null).lte("next_action_due", today).order("next_action_due"),
    supabase.from("deals").select("id, pipeline_id, value").eq("status", "open"),
    supabase.from("deals").select("id").eq("status", "won"),
    supabase.from("pipelines").select("id, name, color, icon, key").neq("key", "software").order("sort_order"),
    supabase.from("linkedin_posts").select("id").eq("status", "posted").gte("posted_date", weekStart),
    supabase.from("linkedin_posts").select("posted_date").eq("status", "posted").order("posted_date", { ascending: false }).limit(1),
    supabase.from("book_sales").select("created_at").order("created_at", { ascending: false }).limit(1),
    supabase.from("book_sales").select("units_sold"),
    supabase.from("settings").select("value").eq("key", "annual_net_income_goal").single(),
    supabase.from("transactions").select("type, amount"),
    supabase.from("tasks").select("id, title, due_date, priority, deal_id, contact_id").eq("done", false).order("due_date"),
    supabase.from("contact_submissions").select("id, first_name, last_name, subject, created_at").eq("status", "new").order("created_at", { ascending: false }).limit(5),
    supabase.from("activities").select("id, type, subject, body, occurred_at, deals(title), companies(name), contacts(full_name)").order("occurred_at", { ascending: false }).limit(6),
  ]);

  // Finance
  const goal = Number(goalRow?.value || 25000);
  const netIncome = (transactions || []).reduce((s, t) => t.type === "income" ? s + Number(t.amount) : s - Number(t.amount), 0);
  const revenuePercent = Math.min(100, Math.max(0, Math.round((netIncome / goal) * 100)));
  const barColor = netIncome < 0 ? "bg-red-500" : revenuePercent >= 75 ? "bg-green-500" : "bg-[#2448d8]";

  // Pipeline
  const overdueDeals = overdueDealRows || [];
  const overdueCount = overdueDeals.length;
  const openCount = openDeals?.length || 0;
  const wonCount = wonDeals?.length || 0;
  const pipelineValue = (openDeals || []).reduce((s, d) => s + Number(d.value || 0), 0);

  const pipelineStats = (pipelines || []).map((p) => ({
    ...p,
    openCount: (openDeals || []).filter((d) => d.pipeline_id === p.id).length,
    value: (openDeals || []).filter((d) => d.pipeline_id === p.id).reduce((s, d) => s + Number(d.value || 0), 0),
  }));

  // LinkedIn
  const postsCount = postsThisWeek?.length || 0;
  const daysSincePost = lastPost?.[0]?.posted_date ? daysSince(lastPost[0].posted_date) : null;

  // Books
  const daysSinceSale = lastSale?.[0]?.created_at ? daysSince(lastSale[0].created_at) : null;
  const bookTotal = (totalSales || []).reduce((s, r) => s + Number(r.units_sold), 0);

  // Tasks
  const todayTasks = (openTasks || []).filter((t) => t.due_date && t.due_date <= today);
  const upcomingTasks = (openTasks || []).filter((t) => !t.due_date || t.due_date > today).slice(0, 3);
  const inquiryCount = newInquiries?.length || 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Command center hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#10213f] px-6 py-7 sm:px-8 sm:py-9 text-white shadow-[0_20px_60px_rgba(16,33,63,.16)]">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e86f51]/20 blur-3xl" />
        <div className="absolute right-20 bottom-[-90px] h-52 w-52 rounded-full bg-[#a7d8c8]/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.24em] text-[#f2a18c]">F&H Command Center</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">{greeting()}, Stephen.</h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-white/60">
              Keep Foundations &amp; Horizons moving while your attention stays on decisions, relationships, and client work.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 xl:w-[390px]">
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-3 sm:p-4">
              <p className="text-2xl font-bold">{overdueCount + inquiryCount}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">Need you</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-3 sm:p-4">
              <p className="text-2xl font-bold">{openCount}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">Active</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-3 sm:p-4">
              <p className="text-2xl font-bold">{openTasks?.length || 0}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">On radar</p>
            </div>
          </div>
        </div>
      </section>

      {inquiryCount > 0 && (
        <Link href="/dashboard/inquiries" className="group flex items-center justify-between gap-5 rounded-2xl border border-[#e86f51]/25 bg-[#fff8f5] p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e86f51] text-sm font-bold text-white">{inquiryCount}</span>
            <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e86f51]">New website conversation{inquiryCount === 1 ? "" : "s"}</p><p className="mt-1 font-serif text-lg text-[#10213f]">{inquiryCount === 1 ? `${newInquiries?.[0]?.first_name} ${newInquiries?.[0]?.last_name} reached out` : `${inquiryCount} people are waiting to hear from you`}</p></div>
          </div>
          <span className="text-[#10213f]/35 transition group-hover:translate-x-1">→</span>
        </Link>
      )}

      {/* Business pulse */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Link href="/dashboard/deals" className={`rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${overdueCount > 0 ? "bg-red-50 border-red-400" : openCount >= 10 ? "bg-green-50 border-green-400" : "bg-white border-[#2448d8]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Relationships</p>
            <span className="text-xl">🎯</span>
          </div>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-gray-900"}`}>
            {overdueCount > 0 ? overdueCount : openCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {overdueCount > 0 ? `overdue follow-up${overdueCount > 1 ? "s" : ""} 🔴` : `open · ${wonCount} won`}
          </p>
        </Link>

        <Link href="/dashboard/linkedin" className={`rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${postsCount >= 3 ? "bg-green-50 border-green-400" : "bg-white border-[#c026d3]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn</p>
            <span className="text-xl">💼</span>
          </div>
          <p className={`text-3xl font-bold ${postsCount >= 3 ? "text-green-600" : postsCount >= 1 ? "text-amber-500" : "text-gray-900"}`}>
            {postsCount}/3
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {postsCount >= 3 ? "Weekly goal crushed 🎉" : daysSincePost !== null ? `${daysSincePost}d since last post` : "No posts yet this week"}
          </p>
        </Link>

        <Link href="/dashboard/books" className={`rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${daysSinceSale !== null && daysSinceSale > 30 ? "bg-amber-50 border-amber-400" : "bg-white border-amber-400"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Book Sales</p>
            <span className="text-xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{bookTotal}</p>
          <p className="text-xs text-gray-400 mt-1">
            {daysSinceSale !== null ? `last logged ${daysSinceSale}d ago` : "No entries yet"}
            {daysSinceSale !== null && daysSinceSale > 14 ? " · check KDP 👀" : ""}
          </p>
        </Link>

        <Link href="/dashboard/finance" className={`rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${netIncome < 0 ? "bg-red-50 border-red-400" : netIncome >= goal * 0.75 ? "bg-green-50 border-green-400" : "bg-white border-green-500"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Net Income</p>
            <span className="text-xl">💰</span>
          </div>
          <p className={`text-3xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${netIncome.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{revenuePercent}% of ${goal.toLocaleString()} goal</p>
        </Link>
      </div>

      {/* Goal bar + Pipeline breakdown side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Link href="/dashboard/finance" className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Annual Net Income Goal</p>
              <p className="text-xs text-gray-400">
                {netIncome >= goal ? "Goal achieved! 🎉" : `$${Math.max(0, goal - netIncome).toLocaleString()} to go`}
              </p>
            </div>
            <span className={`text-2xl font-bold ${revenuePercent >= 100 ? "text-green-600" : revenuePercent >= 50 ? "text-[#2448d8]" : "text-gray-700"}`}>
              {revenuePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className={`h-4 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.max(2, revenuePercent)}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-400">${netIncome.toLocaleString()} earned</p>
            <p className="text-xs text-gray-400">Goal: ${goal.toLocaleString()}</p>
          </div>
        </Link>

        <Link href="/dashboard/deals" className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Relationship Pipeline</p>
            <p className="text-xs text-gray-400">{openCount} open · {pipelineValue > 0 ? `$${pipelineValue.toLocaleString()} value` : "no value logged"}</p>
          </div>
          <div className="space-y-3">
            {pipelineStats.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-medium text-gray-700">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.openCount} open{p.value > 0 ? ` · $${p.value.toLocaleString()}` : ""}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: openCount > 0 ? `${Math.round((p.openCount / openCount) * 100)}%` : "0%", background: p.color }} />
                  </div>
                </div>
              </div>
            ))}
            {pipelineStats.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No pipeline data yet</p>}
          </div>
        </Link>
      </div>

      {/* Decision queue: the work that actually needs Stephen */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Overdue deals */}
        <div className={`bg-white rounded-2xl shadow-sm border p-5 ${overdueCount > 0 ? "border-red-200" : "border-green-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span>{overdueCount > 0 ? "🔴" : "✅"}</span>
            <h2 className="text-sm font-bold text-gray-800">
              {overdueCount > 0 ? "Overdue Follow-ups" : "All Follow-ups Clear"}
            </h2>
          </div>
          {overdueCount > 0 ? (
            <div className="space-y-3">
              {overdueDeals.slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{deal.title}</p>
                    {deal.companies && !Array.isArray(deal.companies) && <p className="text-xs text-gray-400 truncate">{(deal.companies as unknown as { name: string }).name}</p>}
                    {deal.next_action && <p className="text-xs text-gray-400 truncate">→ {deal.next_action}</p>}
                  </div>
                  <span className="shrink-0 text-xs bg-red-100 text-red-700 font-medium rounded-full px-2 py-0.5">{deal.next_action_due}</span>
                </div>
              ))}
              {overdueCount > 5 && <p className="text-xs text-gray-400 text-center">+{overdueCount - 5} more</p>}
              <Link href="/dashboard/deals" className="block text-center text-xs text-[#2448d8] font-semibold hover:underline pt-1">Open Relationships →</Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">You're on top of it.</p>
              <p className="text-xs text-gray-400 mt-1">Nothing is asking for your judgment right now.</p>
              <Link href="/dashboard/deals" className="mt-3 inline-block text-xs text-[#2448d8] font-semibold hover:underline">View Relationships →</Link>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#2448d8]">Assistant Queue</p><h2 className="text-sm font-bold text-gray-800">Work already on the radar</h2></div>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-medium">{openTasks?.length || 0} open</span>
          </div>
          {todayTasks.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Due Today</p>
              <div className="space-y-2">
                {todayTasks.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <p className="text-sm text-gray-700 truncate">{t.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {upcomingTasks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Upcoming</p>
              <div className="space-y-2">
                {upcomingTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    <p className="text-sm text-gray-500 truncate">{t.title}</p>
                    {t.due_date && <span className="ml-auto text-xs text-gray-300 shrink-0">{t.due_date}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!todayTasks.length && !upcomingTasks.length && (
            <p className="text-sm text-gray-400 text-center py-4">No open tasks. The queue is clear.</p>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-[#10213f]/10 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a06b5b]">Activity</p><h2 className="mt-1 font-serif text-xl text-[#10213f]">What moved recently</h2></div>
          <p className="text-xs text-gray-400">Real CRM activity only</p>
        </div>
        {(recentActivities || []).length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {(recentActivities || []).map((a) => (
              <div key={a.id} className="rounded-xl border border-[#10213f]/[.07] bg-[#fcfbf8] p-4">
                <div className="flex items-start justify-between gap-3"><p className="text-sm font-bold text-[#10213f]">{a.subject || a.type}</p><span className="shrink-0 text-[10px] text-gray-300">{new Date(a.occurred_at).toLocaleDateString()}</span></div>
                {a.body && <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{a.body}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#f7f2e8]/60 px-5 py-7 text-center"><p className="text-sm font-medium text-[#10213f]/60">No activity logged yet.</p><p className="mt-1 text-xs text-gray-400">Emails, meetings, notes, and relationship moves will appear here as they happen.</p></div>
        )}
      </section>

      {/* Command center actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Move the business</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/deals" className="flex items-center gap-2 bg-[#2448d8] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#10213f] font-medium transition-colors">
            🎯 Relationship Pipeline
          </Link>
          <Link href="/dashboard/contacts" className="flex items-center gap-2 bg-white text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
            👤 People & Organizations
          </Link>
          <Link href="/dashboard/linkedin" className="flex items-center gap-2 bg-white text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
            💼 Log LinkedIn Post
          </Link>
          <Link href="/dashboard/books" className="flex items-center gap-2 bg-white text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
            📚 Log Book Sales
          </Link>
          <Link href="/dashboard/finance" className="flex items-center gap-2 bg-white text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
            💰 Log Transaction
          </Link>
        </div>
      </div>
    </div>
  );
}
