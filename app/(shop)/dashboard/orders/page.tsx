"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, Truck, CheckCircle, ChevronRight, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";


export default function ClientOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setOrders(data);
      }
      setLoading(false);
    }
    fetchUserOrders();
  }, [supabase]);

  if (loading) return <div className="p-20 text-center font-black text-blue-900 animate-pulse">SYNCING YOUR MANE...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Order History</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Track your progress and shipments</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
          <input 
            placeholder="Search orders..." 
            className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? orders.map((order, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={order.id}
            className="group bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:border-blue-100 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-4 rounded-2xl",
                  order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {order.status === 'delivered' ? <CheckCircle size={24} /> : <Package size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                      order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-blue-950 font-black text-sm uppercase mt-1">Kirkland Signature Minoxidil</h4>
                  <p className="text-gray-400 text-[10px] font-bold mt-0.5">Purchased on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-lg font-black text-blue-900 tracking-tighter">GH₵{order.total_amount}</p>
                </div>
                <Link 
                  href={`/dashboard/orders/${order.id}`}
                  className="bg-gray-50 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-6">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Inbox className="text-gray-200" size={48} />
            </div>
            <h3 className="text-blue-950 font-black uppercase tracking-tighter text-lg">No orders found</h3>
            <p className="text-gray-400 text-sm font-medium mt-1 max-w-xs">Looks like you haven't started your journey yet. Explore our authentic kits!</p>
            <Link href="/shop" className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-950 transition-all">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}