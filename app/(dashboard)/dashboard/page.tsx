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

function motiveLine(overdueCount: number, postsCount: number, revenuePercent: number) {
  if (overdueCount > 0) return `You have ${overdueCount} follow-up${overdueCount > 1 ? "s" : ""} waiting. Don't let momentum die.`;
  if (postsCount >= 3) return "LinkedIn goal hit this week. Systems are working. Keep going.";
  if (revenuePercent >= 75) return "You're in the final stretch on the annual goal. Push.";
  return "Every day you show up compounds. Let's build.";
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];
  const weekStart = startOfWeek();

  const [
    { data: overdue },
    { data: postsThisWeek },
    { data: lastPost },
    { data: lastSale },
    { data: totalSales },
    { data: goalRow },
    { data: transactions },
    { data: activeLeads },
    { data: wonLeads },
  ] = await Promise.all([
    supabase.from("leads").select("id, name, organization, next_action_due, stage")
      .lte("next_action_due", today).not("stage", "in", "(won,lost)").not("next_action_due", "is", null).order("next_action_due"),
    supabase.from("linkedin_posts").select("id").eq("status", "posted").gte("posted_date", weekStart),
    supabase.from("linkedin_posts").select("posted_date").eq("status", "posted").order("posted_date", { ascending: false }).limit(1),
    supabase.from("book_sales").select("created_at").order("created_at", { ascending: false }).limit(1),
    supabase.from("book_sales").select("units_sold"),
    supabase.from("settings").select("value").eq("key", "annual_net_income_goal").single(),
    supabase.from("transactions").select("type, amount"),
    supabase.from("leads").select("id").not("stage", "in", "(won,lost)"),
    supabase.from("leads").select("id").eq("stage", "won"),
  ]);

  const goal = Number(goalRow?.value || 25000);
  const netIncome = (transactions || []).reduce((s, t) => t.type === "income" ? s + Number(t.amount) : s - Number(t.amount), 0);
  const revenuePercent = Math.min(100, Math.max(0, Math.round((netIncome / goal) * 100)));

  const overdueCount = overdue?.length || 0;
  const postsCount = postsThisWeek?.length || 0;
  const daysSincePost = lastPost?.[0]?.posted_date ? daysSince(lastPost[0].posted_date) : null;
  const daysSinceSale = lastSale?.[0]?.created_at ? daysSince(lastSale[0].created_at) : null;
  const bookTotal = (totalSales || []).reduce((s, r) => s + Number(r.units_sold), 0);
  const pipelineCount = activeLeads?.length || 0;
  const closedCount = wonLeads?.length || 0;

  const barColor = netIncome < 0 ? "bg-red-500" : revenuePercent >= 75 ? "bg-green-500" : "bg-[#2a3db4]";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{greeting()}, Stephen. 👋</h1>
        <p className="text-gray-500 mt-1">{motiveLine(overdueCount, postsCount, revenuePercent)}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Link href="/dashboard/leads" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${overdueCount > 0 ? "bg-red-50 border-red-400" : "bg-white border-gray-100 hover:border-[#2a3db4]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pipeline</p>
            <span className="text-xl">🎯</span>
          </div>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-gray-900"}`}>
            {overdueCount > 0 ? overdueCount : pipelineCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {overdueCount > 0 ? `overdue follow-up${overdueCount > 1 ? "s" : ""} 🔴` : `active leads · ${closedCount} won`}
          </p>
        </Link>

        <Link href="/dashboard/linkedin" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${postsCount >= 3 ? "bg-green-50 border-green-400" : "bg-white border-gray-100 hover:border-[#2a3db4]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn</p>
            <span className="text-xl">💼</span>
          </div>
          <p className={`text-3xl font-bold ${postsCount >= 3 ? "text-green-600" : postsCount >= 1 ? "text-amber-500" : "text-gray-900"}`}>
            {postsCount}/3
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {postsCount >= 3 ? "Weekly goal crushed 🎉" : daysSincePost !== null ? `${daysSincePost}d since last post` : "No posts yet"}
          </p>
        </Link>

        <Link href="/dashboard/books" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${daysSinceSale !== null && daysSinceSale > 30 ? "bg-amber-50 border-amber-400" : "bg-white border-gray-100 hover:border-[#2a3db4]"}`}>
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

        <Link href="/dashboard/finance" className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border-t-4 ${netIncome < 0 ? "bg-red-50 border-red-400" : netIncome >= goal * 0.75 ? "bg-green-50 border-green-400" : "bg-white border-gray-100 hover:border-[#2a3db4]"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Net Income</p>
            <span className="text-xl">💰</span>
          </div>
          <p className={`text-3xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${netIncome.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">income − expenses</p>
        </Link>
      </div>

      {/* Goal progress bar */}
      <Link href="/dashboard/finance" className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 mb-6 border border-gray-100 hover:border-[#2a3db4]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-800">Annual Net Income Goal</p>
            <p className="text-xs text-gray-400">You need ${Math.max(0, goal - netIncome).toLocaleString()} more to hit ${goal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${revenuePercent >= 100 ? "text-green-600" : revenuePercent >= 50 ? "text-[#2a3db4]" : "text-gray-700"}`}>
              {revenuePercent}%
            </span>
            {revenuePercent >= 100 && <p className="text-xs text-green-500 font-semibold">Goal hit! 🎉</p>}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.max(2, revenuePercent)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-400">${netIncome.toLocaleString()} earned</p>
          <p className="text-xs text-gray-400">Goal: ${goal.toLocaleString()}</p>
        </div>
      </Link>

      {/* Overdue leads */}
      {overdueCount > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🔴</span>
            <h2 className="text-sm font-bold text-gray-800">Overdue Follow-ups — Don&apos;t Ghost These People</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {overdue!.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.organization} · {lead.stage}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 font-medium rounded-full px-3 py-1">
                  {lead.next_action_due}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/leads" className="mt-4 block text-center text-sm text-[#2a3db4] font-semibold hover:underline">
            Open Pipeline →
          </Link>
        </div>
      )}

      {/* All clear */}
      {overdueCount === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-sm font-semibold text-gray-700">No overdue follow-ups. You&apos;re on top of it.</p>
          <p className="text-xs text-gray-400 mt-1">Check the pipeline to keep leads moving forward.</p>
          <Link href="/dashboard/leads" className="mt-3 inline-block text-sm text-[#2a3db4] font-semibold hover:underline">View Pipeline →</Link>
        </div>
      )}
    </div>
  );
}
