"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity 
} from "lucide-react";

export default function AnalyticsSummary() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newGrowers: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAnalytics() {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const { data: allOrders } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .neq("status", "cancelled");

      if (allOrders) {
        const thisWeekOrders = allOrders.filter(o => new Date(o.created_at) > lastWeek);
        const lastWeekOrders = allOrders.filter(o => {
          const d = new Date(o.created_at);
          return d <= lastWeek && d > twoWeeksAgo;
        });

        const thisWeekRev = thisWeekOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
        const lastWeekRev = lastWeekOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);
        
        // Calculate Growth %
        const revGrowth = lastWeekRev === 0 ? 100 : ((thisWeekRev - lastWeekRev) / lastWeekRev) * 100;

        setStats({
          totalRevenue: allOrders.reduce((acc, o) => acc + Number(o.total_amount), 0),
          newGrowers: thisWeekOrders.length,
          avgOrderValue: allOrders.length > 0 ? allOrders.reduce((acc, o) => acc + Number(o.total_amount), 0) / allOrders.length : 0,
          revenueGrowth: Math.round(revGrowth),
          orderGrowth: thisWeekOrders.length - lastWeekOrders.length
        });
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  const cards = [
    { 
      label: "Total Revenue", 
      value: `GHS ${stats.totalRevenue.toLocaleString()}`, 
      growth: `${stats.revenueGrowth}%`, 
      isUp: stats.revenueGrowth >= 0,
      icon: DollarSign,
      color: "blue" 
    },
    { 
      label: "New Weekly Orders", 
      value: stats.newGrowers, 
      growth: `${stats.orderGrowth} orders`, 
      isUp: stats.orderGrowth >= 0,
      icon: ShoppingBag,
      color: "gold" 
    },
    { 
      label: "Avg. Ticket Size", 
      value: `GHS ${stats.avgOrderValue.toFixed(2)}`, 
      growth: "Lifetime", 
      isUp: true,
      icon: Activity,
      color: "green" 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className={`absolute top-0 right-0 p-8 opacity-5 text-${card.color}-600`}>
             <card.icon size={80} />
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{card.label}</p>
            <h3 className="text-3xl font-black text-blue-950 mb-4 tracking-tighter">{card.value}</h3>
            
            <div className={`flex items-center gap-2 font-bold text-xs ${card.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {card.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{card.growth} vs last week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}