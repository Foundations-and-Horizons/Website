import DashboardNav from "./DashboardNav";
import { createClient } from "@/lib/supabase/server";
import { isDashboardPublic } from "@/lib/access";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isDashboardPublic()) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f7f2e8] flex">
      <DashboardNav />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-10">{children}</div>
      </main>
    </div>
  );
}
