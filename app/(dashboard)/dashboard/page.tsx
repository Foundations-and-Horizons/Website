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

function xpToLevel(xp: number): { level: number; label: string; nextXp: number; prevXp: number } {
  const thresholds = [0, 500, 1200, 2500, 5000, 10000, 20000];
  const labels = ["Beginner", "Builder", "Momentum", "Operator", "Leader", "Visionary", "Legend"];
  let i = thresholds.length - 1;
  while (i > 0 && xp < thresholds[i]) i--;
  return { level: i + 1, label: labels[i], nextXp: thresholds[i + 1] ?? thresholds[i], prevXp: thresholds[i] };
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
    { data: xpRows },
    { data: earnedAch },
    { data: allAch },
  ] = await Promise.all([
    supabase.from("deals").select("id, title, next_action, next_action_due, companies(name)")
      .eq("status", "open").not("next_action_due", "is", null).lte("next_action_due", today).order("next_action_due"),
    supabase.from("deals").select("id, pipeline_id, value").eq("status", "open"),
    supabase.from("deals").select("id").eq("status", "won"),
    supabase.from("pipelines").select("id, name, color, icon, key").order("sort_order"),
    supabase.from("linkedin_posts").select("id").eq("status", "posted").gte("posted_date", weekStart),
    supabase.from("linkedin_posts").select("posted_date").eq("status", "posted").order("posted_date", { ascending: false }).limit(1),
    supabase.from("book_sales").select("created_at").order("created_at", { ascending: false }).limit(1),
    supabase.from("book_sales").select("units_sold"),
    supabase.from("settings").select("value").eq("key", "annual_net_income_goal").single(),
    supabase.from("transactions").select("type, amount"),
    supabase.from("tasks").select("id, title, due_date, priority, deal_id, contact_id").eq("done", false).order("due_date"),
    supabase.from("xp_events").select("amount"),
    supabase.from("earned_achievements").select("achievement_key, earned_at"),
    supabase.from("achievements").select("key, name, icon, xp").order("sort_order"),
  ]);

  // Finance
  const goal = Number(goalRow?.value || 25000);
  const netIncome = (transactions || []).reduce((s, t) => t.type === "income" ? s + Number(t.amount) : s - Number(t.amount), 0);
  const revenuePercent = Math.min(100, Math.max(0, Math.round((netIncome / goal) * 100)));
  const barColor = netIncome < 0 ? "bg-red-500" : revenuePercent >= 75 ? "bg-green-500" : "bg-[#2a3db4]";

  // Deals
  const overdueDeals = overdueDealRows || [];
  const overdueCount = overdueDeals.length;
  const openCount = openDeals?.length || 0;
  const wonCount = wonDeals?.length || 0;
  const pipelineValue = (openDeals || []).reduce((s, d) => s + Number(d.value || 0), 0);

  // Per-pipeline open deal counts
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

  // XP & gamification
  const totalXp = (xpRows || []).reduce((s, r) => s + r.amount, 0);
  const { level, label: levelLabel, nextXp, prevXp } = xpToLevel(totalXp);
  const xpPercent = Math.min(100, Math.round(((totalXp - prevXp) / (nextXp - prevXp)) * 100));
  const earnedKeys = new Set((earnedAch || []).map((e) => e.achievement_key));
  const unearnedAch = (allAch || []).filter((a) => !earnedKeys.has(a.key));

  // Motivational line
  function motiveLine() {
    if (overdueCount > 0) return `${overdueCount} deal${overdueCount > 1 ? "s" : ""} waiting on you. Don't let momentum die.`;
    if (postsCount >= 3) return "LinkedIn goal hit this week. Systems are working. Keep going.";
    if (revenuePercent >= 75) return "In the final stretch on the annual goal. Push.";
    if (todayTasks.length > 0) return `${todayTasks.length} task${todayTasks.length > 1 ? "s" : ""} on deck today. Let's knock them out.`;
    return "Every day you show up compounds. Let's build.";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{greeting()}, Stephen. 👋</h1>
        <p className="text-gray-500 mt-1">{motiveLine()}</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Link href="/dashboard/deals" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${overdueCount > 0 ? "bg-red-50 border-red-400" : openCount >= 10 ? "bg-green-50 border-green-400" : "bg-white border-[#2a3db4]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Deals</p>
            <span className="text-xl">🎯</span>
          </div>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-gray-900"}`}>
            {overdueCount > 0 ? overdueCount : openCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {overdueCount > 0 ? `overdue follow-up${overdueCount > 1 ? "s" : ""} 🔴` : `open · ${wonCount} won`}
          </p>
        </Link>

        <Link href="/dashboard/linkedin" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${postsCount >= 3 ? "bg-green-50 border-green-400" : "bg-white border-[#c026d3]"}`}>
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

        <Link href="/dashboard/books" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${daysSinceSale !== null && daysSinceSale > 30 ? "bg-amber-50 border-amber-400" : "bg-white border-amber-400"}`}>
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

        <Link href="/dashboard/finance" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${netIncome < 0 ? "bg-red-50 border-red-400" : netIncome >= goal * 0.75 ? "bg-green-50 border-green-400" : "bg-white border-green-500"}`}>
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
        {/* Goal progress */}
        <Link href="/dashboard/finance" className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Annual Net Income Goal</p>
              <p className="text-xs text-gray-400">
                {netIncome >= goal ? "Goal achieved! 🎉" : `$${Math.max(0, goal - netIncome).toLocaleString()} to go`}
              </p>
            </div>
            <span className={`text-2xl font-bold ${revenuePercent >= 100 ? "text-green-600" : revenuePercent >= 50 ? "text-[#2a3db4]" : "text-gray-700"}`}>
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

        {/* Pipeline by type */}
        <Link href="/dashboard/deals" className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Pipeline Breakdown</p>
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

      {/* Middle row: Overdue / Tasks / XP */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Overdue deals */}
        <div className={`bg-white rounded-xl shadow-sm border p-5 ${overdueCount > 0 ? "border-red-200" : "border-green-200"}`}>
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
              <Link href="/dashboard/deals" className="block text-center text-xs text-[#2a3db4] font-semibold hover:underline pt-1">Open Deals Board →</Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">You're on top of it.</p>
              <p className="text-xs text-gray-400 mt-1">Keep deals moving forward.</p>
              <Link href="/dashboard/deals" className="mt-3 inline-block text-xs text-[#2a3db4] font-semibold hover:underline">View Deals →</Link>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="text-sm font-bold text-gray-800">Tasks</h2>
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
            <p className="text-sm text-gray-400 text-center py-4">No open tasks. Add one from the Deals page.</p>
          )}
        </div>

        {/* XP & Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span>⚡</span>
            <h2 className="text-sm font-bold text-gray-800">Your Progress</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-[#2a3db4]">{totalXp.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">XP earned</p>
            <div className="mt-2 inline-block bg-[#2a3db4]/10 text-[#2a3db4] text-xs font-bold px-3 py-1 rounded-full">
              Level {level} · {levelLabel}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{totalXp.toLocaleString()} XP</span>
              <span>{nextXp.toLocaleString()} XP next level</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-[#2a3db4] transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
          {earnedAch && earnedAch.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Achievements</p>
              <div className="flex flex-wrap gap-1">
                {(allAch || []).map((a) => (
                  <span key={a.key} className={`text-lg ${earnedKeys.has(a.key) ? "" : "opacity-20 grayscale"}`} title={a.name}>{a.icon}</span>
                ))}
              </div>
            </div>
          )}
          {(!earnedAch || earnedAch.length === 0) && unearnedAch.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Next achievements</p>
              <div className="space-y-1">
                {unearnedAch.slice(0, 3).map((a) => (
                  <div key={a.key} className="flex items-center gap-2 opacity-50">
                    <span className="text-sm">{a.icon}</span>
                    <p className="text-xs text-gray-500">{a.name} · {a.xp} XP</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/deals" className="flex items-center gap-2 bg-[#2a3db4] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1e2d8a] font-medium transition-colors">
            🎯 New Deal
          </Link>
          <Link href="/dashboard/contacts" className="flex items-center gap-2 bg-white text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium transition-colors">
            👤 Add Contact
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
