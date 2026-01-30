"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle,
  CalendarDays,
  PackageSearch
} from "lucide-react";

export default function AnalyticsSummary() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newGrowers: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    todaySales: 0,
    lowStockItems: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAnalytics() {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("total_amount, created_at").neq("status", "cancelled"),
        supabase.from("products").select("name, stock_quantity").lt("stock_quantity", 5) // Low stock threshold
      ]);

      if (ordersRes.data) {
        const allOrders = ordersRes.data;
        const todayOrders = allOrders.filter(o => new Date(o.created_at) >= startOfToday);
        const thisWeekOrders = allOrders.filter(o => new Date(o.created_at) > lastWeek);
        const lastWeekOrders = allOrders.filter(o => {
          const d = new Date(o.created_at);
          return d <= lastWeek && d > twoWeeksAgo;
        });

        const thisWeekRev = thisWeekOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
        const lastWeekRev = lastWeekOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
        const todayRev = todayOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
        
        const revGrowth = lastWeekRev === 0 ? 100 : ((thisWeekRev - lastWeekRev) / lastWeekRev) * 100;

        setStats({
          totalRevenue: thisWeekRev,
          newGrowers: thisWeekOrders.length,
          revenueGrowth: Math.round(revGrowth),
          orderGrowth: thisWeekOrders.length - lastWeekOrders.length,
          todaySales: todayRev,
          lowStockItems: productsRes.data || []
        });
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [supabase]);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-pulse"><div className="h-40 bg-gray-100 rounded-[2.5rem] col-span-3" /></div>;

  return (
    <div className="space-y-6 mb-12">
      {/* PRIMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <CalendarDays className="absolute -right-4 -top-4 w-32 h-32 text-blue-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Today's Revenue</p>
          <h3 className="text-4xl font-black text-blue-950 tracking-tighter">GH₵{stats.todaySales.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <TrendingUp size={14} /> Live Sync
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <ShoppingBag className="absolute -right-4 -top-4 w-32 h-32 text-blue-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Weekly Volume</p>
          <h3 className="text-4xl font-black text-blue-950 tracking-tighter">{stats.newGrowers} Orders</h3>
          <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${stats.orderGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {stats.orderGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {stats.orderGrowth} vs last week
          </div>
        </div>

        {/* LOW STOCK ALERT CARD */}
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group ${stats.lowStockItems.length > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100'}`}>
          <AlertTriangle className={`absolute -right-4 -top-4 w-32 h-32 opacity-10 ${stats.lowStockItems.length > 0 ? 'text-amber-600' : 'text-gray-200'}`} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Inventory Health</p>
          <h3 className="text-4xl font-black text-blue-950 tracking-tighter">
            {stats.lowStockItems.length === 0 ? 'Optimal' : `${stats.lowStockItems.length} Low`}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {stats.lowStockItems.length > 0 ? (
              stats.lowStockItems.slice(0, 2).map((item, i) => (
                <span key={i} className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] font-black text-amber-700 uppercase border border-amber-200">
                  {item.name}: {item.stock_quantity} Left
                </span>
              ))
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                <PackageSearch size={14} /> All stock healthy
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}