"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Users, 
  ShoppingBag, 
  Search, 
  MessageSquare,
  ArrowUpRight,
  History,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await supabase
        .from("orders")
        .select("customer_name, phone_number, total_amount, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        const grouped = data.reduce((acc: any, curr: any) => {
          const key = curr.phone_number;
          const orderDate = new Date(curr.created_at);
          
          if (!acc[key]) {
            acc[key] = { 
              name: curr.customer_name, 
              phone: curr.phone_number, 
              totalSpent: 0, 
              orderCount: 0,
              lastOrder: orderDate
            };
          }
          acc[key].totalSpent += Number(curr.total_amount);
          acc[key].orderCount += 1;
          // Ensure we always keep the most recent date
          if (orderDate > acc[key].lastOrder) acc[key].lastOrder = orderDate;
          return acc;
        }, {});
        
        setCustomers(Object.values(grouped));
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const getDaysSince = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Community</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Retention tracking for your 18-38 grower demographic.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Search by name or MoMo number..."
          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Grower</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Last Purchase</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Recency</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Value</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCustomers.map((customer, idx) => {
              const daysSince = getDaysSince(customer.lastOrder);
              const needsNudge = daysSince >= 30;

              return (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={customer.phone} 
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs uppercase">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-950 text-sm leading-tight">{customer.name}</span>
                        <span className="text-[10px] font-bold text-gray-400">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <History size={14} />
                      <span className="text-xs font-bold">{customer.lastOrder.toLocaleDateString('en-GB')}</span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${
                        needsNudge ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100'
                      }`}>
                        {daysSince} Days Ago
                      </span>
                      {needsNudge && <AlertCircle size={14} className="text-red-400 animate-pulse" />}
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-blue-900 italic">GHS {customer.totalSpent.toFixed(2)}</span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <a 
                      href={`https://wa.me/${customer.phone.replace(/\s+/g, '')}?text=Hello%20${customer.name},%20hope%20your%20growth%20journey%20is%20going%20well!%20Need%20a%20ManeF/x%20restock?`} 
                      target="_blank" 
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        needsNudge ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <MessageSquare size={14} />
                      {needsNudge ? "Nudge" : ""}
                    </a>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}