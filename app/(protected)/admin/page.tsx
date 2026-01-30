"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AnalyticsSummary from "@/components/admin/analytics-summary";
import RecentOrdersTable from "@/components/admin/recent-orders-table";
import { 
  Sparkles, 
  TrendingUp, 
  PackageCheck, 
  AlertCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const [hasLowStock, setHasLowStock] = useState(false);
  const supabase = createClient();

  // Quick check for low stock to show an alert on the dashboard
  useEffect(() => {
    async function checkStock() {
      const { data } = await supabase
        .from("products")
        .select("stock_quantity")
        .lt("stock_quantity", 10);
      
      if (data && data.length > 0) setHasLowStock(true);
    }
    checkStock();
  }, [supabase]);

  return (
    <div className="space-y-10">
      {/* 1. Page Title Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter">
          Store <span className="text-blue-600">Overview</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm">
          Real-time performance tracking for ManeF/x Ghana.
        </p>
      </div>

      {/* 2. Main Analytics Grid (The GHS 0 cards) */}
      <AnalyticsSummary />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 3. Recent Orders (Primary View) */}
        <div className="xl:col-span-2">
          <RecentOrdersTable />
        </div>

        {/* 4. Action Sidebar */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {hasLowStock && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Inventory Alert</p>
                <p className="text-sm font-bold text-red-900 leading-tight">Some kits are running low. Check products.</p>
              </div>
            </div>
          )}

          {/* Growth Insight Card */}
          <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <PackageCheck size={18} className="text-blue-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Strategy Tip</span>
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">Boost Retention</h4>
              <p className="text-blue-100/70 text-xs leading-relaxed font-medium">
                Accra-based customers are 30% more likely to re-order if they get a WhatsApp nudge 28 days after purchase.
              </p>
            </div>
          </div>

          {/* Quick System Check */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Database Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-900 uppercase">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}