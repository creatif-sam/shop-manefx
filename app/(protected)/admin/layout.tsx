"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Star, 
  Tag, 
  Settings,
  LogOut,
  Search,
  User as UserIcon,
  Menu,
  Inbox,
  X,
  Mail // Added Mail Icon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Updated menu items to include the Mail System
const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Mail System", href: "/admin/mail", icon: Mail }, 
  { label: "Messages", href: "/admin/messages", icon: Inbox }, 
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [userName, setUserName] = useState<string>("Admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0];
        setUserName(name);
      }
    }
    getUserData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-blue-900 font-black text-xl uppercase tracking-tighter">
            ManeF/x <span className="text-gray-300">Admin</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                  isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-900"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 font-bold text-sm hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full min-w-0">
        
        {/* STATIC TOPBAR */}
        <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-4 md:px-10">
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-4 text-blue-900 lg:hidden bg-blue-50 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="relative w-64 md:w-96 group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                placeholder="Search analytics..." 
                className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            <div className="text-right flex flex-col justify-center">
              <p className="text-sm font-black text-blue-950 capitalize leading-tight">
                {userName}
              </p>
              <p className="text-[9px] text-blue-600 font-black uppercase tracking-[0.15em] mt-0.5">
                Store Owner
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 border-2 border-white shrink-0">
              <UserIcon size={18} />
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}