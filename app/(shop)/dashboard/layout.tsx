"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, Heart, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="mb-8 px-4">
          <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">My Account</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ManeF/x Member</p>
        </div>
        
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-950"
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-3 px-6 py-4 w-full text-red-400 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all mt-4">
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}