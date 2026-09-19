import DashboardNav from "./DashboardNav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDashboardPublic } from "@/lib/access";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isDashboardPublic()) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f7f2e8] md:flex">
      <DashboardNav />
      <div className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-[#10213f]/95 px-4 py-3 text-white backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">F&amp;H <span className="text-white/40">Command Center</span></Link>
          <div className="flex gap-1 text-[10px] font-bold uppercase tracking-wider">\n            <Link href="/dashboard/prospecting" className="rounded-full bg-white/10 px-3 py-2">Prospects</Link>\n            <Link href="/dashboard/outreach" className="rounded-full bg-white/10 px-3 py-2">Review</Link>\n            <Link href="/dashboard/tasks" className="rounded-full bg-[#e86f51] px-3 py-2">Queue</Link>\n          </div>
        </div>
      </div>
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-10">{children}</div>
      </main>
    </div>
  );
}
