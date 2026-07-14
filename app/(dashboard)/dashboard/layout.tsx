import DashboardNav from "./DashboardNav";
import { createClient } from "@/lib/supabase/server";
import { isDashboardPublic } from "@/lib/access";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Login page uses this layout too — don't show the sidebar there.
  // In public mode there's no user, but we still want the full shell.
  if (!user && !isDashboardPublic()) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardNav />
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
