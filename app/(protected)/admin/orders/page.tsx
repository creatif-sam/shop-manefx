"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Phone, 
  MapPin, 
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";
import WaybillTemplate from "@/components/admin/waybill-template";

const statusStyles: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600 border-orange-100",
  processing: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-purple-50 text-purple-600 border-purple-100",
  delivered: "bg-green-50 text-green-600 border-green-100",
  cancelled: "bg-gray-50 text-gray-400 border-gray-100",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*, products(name))`)
      .order("created_at", { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handlePrint = (orderId: string) => {
    const printContents = document.getElementById(`waybill-${orderId}`)?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Restores React state
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone_number.includes(searchQuery)
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Order Dispatch</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Real-time logistics management for ManeF/x Ghana.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none bg-blue-900 p-5 rounded-3xl text-white shadow-xl shadow-blue-100 min-w-[200px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Net Revenue</p>
            <p className="text-2xl font-black mt-1">GHS {orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + Number(o.total_amount), 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Order Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Items</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading Dispatches...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching orders found</p>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-blue-950 text-sm uppercase">{order.customer_name}</span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={12} />
                        <span className="text-xs font-bold">{order.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mt-1 max-w-[200px]">
                        <MapPin size={12} className="shrink-0" />
                        <span className="text-[10px] font-medium leading-tight line-clamp-1">{order.delivery_address}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2">
                      {order.order_items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
                           <span className="text-[10px] font-black text-blue-600">{item.quantity}x</span>
                           <span className="text-[10px] font-bold text-blue-900 truncate max-w-[100px]">{item.products?.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-blue-900 tracking-tight">GHS {Number(order.total_amount).toFixed(2)}</span>
                  </td>

                  <td className="px-6 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border-2 outline-none cursor-pointer transition-all ${statusStyles[order.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* Hidden Printing Div */}
                      <WaybillTemplate order={order} />
                      
                      <button 
                        onClick={() => handlePrint(order.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-900 transition-all active:scale-95 group/btn"
                      >
                        <Printer size={16} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden xl:inline">Waybill</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}