"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: "⬡", exact: true },
  { href: "/dashboard/deals", label: "Deals", icon: "🎯" },
  { href: "/dashboard/companies", label: "Companies", icon: "🏢" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "👤" },
  { href: "/dashboard/linkedin", label: "LinkedIn", icon: "💼" },
  { href: "/dashboard/books", label: "Book Sales", icon: "📚" },
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
    <aside className="w-56 bg-[#1a2a8a] text-white flex flex-col shrink-0 min-h-screen">
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <p className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-0.5">F&H</p>
        <p className="text-base font-bold text-white leading-tight">Foundations &amp;</p>
        <p className="text-base font-bold text-blue-300 leading-tight">Horizons</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : (pathname === item.href || pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-white text-[#1a2a8a] font-bold shadow"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2a3db4]" />}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <span className="text-base w-5 text-center">→</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
