import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function startOfWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}

function startOfYear(): string {
  return new Date().getFullYear() + "-01-01";
}

export default async function DashboardHome() {
  const supabase = await createClient();

  // Overdue / due today leads
  const today = new Date().toISOString().split("T")[0];
  const { data: overdue } = await supabase
    .from("leads")
    .select("id, name, organization, next_action_due, stage")
    .lte("next_action_due", today)
    .not("stage", "in", "(won,lost)")
    .not("next_action_due", "is", null)
    .order("next_action_due");

  // LinkedIn cadence
  const weekStart = startOfWeek();
  const { data: postsThisWeek } = await supabase
    .from("linkedin_posts")
    .select("id")
    .eq("status", "posted")
    .gte("posted_date", weekStart);

  const { data: lastPost } = await supabase
    .from("linkedin_posts")
    .select("posted_date")
    .eq("status", "posted")
    .order("posted_date", { ascending: false })
    .limit(1);

  // Book sales
  const { data: lastSale } = await supabase
    .from("book_sales")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  // Revenue vs goal
  const yearStart = startOfYear();
  const { data: revenueRows } = await supabase
    .from("revenue_entries")
    .select("amount")
    .gte("date_received", yearStart);
  const { data: goalRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "annual_revenue_goal")
    .single();

  const totalRevenue = (revenueRows || []).reduce((s, r) => s + Number(r.amount), 0);
  const goal = Number(goalRow?.value || 25000);
  const revenuePercent = Math.min(100, Math.round((totalRevenue / goal) * 100));

  // Net income
  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount");
  const netIncome = (transactions || []).reduce((s, t) => {
    return t.type === "income" ? s + Number(t.amount) : s - Number(t.amount);
  }, 0);

  const overdueCount = overdue?.length || 0;
  const postsCount = postsThisWeek?.length || 0;
  const daysSincePost = lastPost?.[0]?.posted_date ? daysSince(lastPost[0].posted_date) : null;
  const daysSinceSale = lastSale?.[0]?.created_at ? daysSince(lastSale[0].created_at) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Good morning, Stephen</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/leads" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Follow-ups due</p>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-gray-900"}`}>
            {overdueCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">today or overdue</p>
        </Link>

        <Link href="/dashboard/linkedin" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Posts this week</p>
          <p className={`text-3xl font-bold ${postsCount >= 3 ? "text-green-600" : "text-yellow-600"}`}>
            {postsCount}/3
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {daysSincePost !== null ? `${daysSincePost}d since last post` : "No posts yet"}
          </p>
        </Link>

        <Link href="/dashboard/books" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Book sales</p>
          <p className={`text-3xl font-bold ${daysSinceSale !== null && daysSinceSale > 30 ? "text-yellow-600" : "text-gray-900"}`}>
            {daysSinceSale !== null ? `${daysSinceSale}d` : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">since last logged</p>
        </Link>

        <Link href="/dashboard/finance" className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net income</p>
          <p className={`text-3xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${netIncome.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">income − expenses</p>
        </Link>
      </div>

      {/* Revenue progress */}
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Revenue vs. Annual Goal</p>
          <p className="text-sm text-gray-500">${totalRevenue.toLocaleString()} / ${goal.toLocaleString()}</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-[#2a3db4] h-3 rounded-full transition-all"
            style={{ width: `${revenuePercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{revenuePercent}% of goal</p>
      </div>

      {/* Overdue leads list */}
      {overdueCount > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Overdue Follow-ups</h2>
          <div className="divide-y">
            {overdue!.map((lead) => (
              <div key={lead.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.organization}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 rounded px-2 py-0.5">
                  {lead.next_action_due}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
