"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Package, 
  MoreHorizontal 
} from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  pending: "text-orange-600 bg-orange-50 border-orange-100",
  processing: "text-blue-600 bg-blue-50 border-blue-100",
  shipped: "text-purple-600 bg-purple-50 border-purple-100",
  delivered: "text-green-600 bg-green-50 border-green-100",
};

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecent() {
      const { data } = await supabase
        .from("orders")
        .select(`id, customer_name, total_amount, status, created_at`)
        .order("created_at", { ascending: false })
        .limit(5); // Only show the last 5 for the dashboard

      if (data) setOrders(data);
      setLoading(false);
    }
    fetchRecent();
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Recent Dispatches</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Latest 5 growth kit orders</p>
        </div>
        <Link 
          href="/admin/orders" 
          className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6 bg-gray-50/30 h-16" />
                </tr>
              ))
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600">
                      {order.customer_name.charAt(0)}
                    </div>
                    <span className="font-bold text-blue-950 text-sm">{order.customer_name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-black text-gray-700 text-sm">
                  GHS {order.total_amount}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border-2 ${statusStyles[order.status] || "bg-gray-50 text-gray-400"}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}