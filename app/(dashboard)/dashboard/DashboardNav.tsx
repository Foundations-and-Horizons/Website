"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "⬡" },
  { href: "/dashboard/leads", label: "Pipeline", icon: "👥" },
  { href: "/dashboard/linkedin", label: "LinkedIn", icon: "💼" },
  { href: "/dashboard/books", label: "Book Sales", icon: "📚" },
  { href: "/dashboard/revenue", label: "Revenue Goal", icon: "🎯" },
  { href: "/dashboard/finance", label: "Finance", icon: "💰" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <aside className="w-56 bg-[#2a3db4] text-white flex flex-col shrink-0 min-h-screen">
      <div className="px-5 py-5 border-b border-[#3a4fc4]">
        <p className="text-xs font-semibold tracking-wider text-blue-200 uppercase">F&H Dashboard</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                active ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
