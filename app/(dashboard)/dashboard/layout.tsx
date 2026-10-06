import DashboardNav from "./DashboardNav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f6f7f9] md:flex">
      <DashboardNav />
      <div className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-[#10213f]/95 px-4 py-3 text-white backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">F&amp;H <span className="text-white/40">Command Center</span></Link>
          <Link href="/dashboard/inquiries" className="rounded-full bg-white/10 px-3 py-2 text-xs">Inquiries</Link>
        </div>
      </div>
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-10">{children}</div>
      </main>
    </div>
  );
}
