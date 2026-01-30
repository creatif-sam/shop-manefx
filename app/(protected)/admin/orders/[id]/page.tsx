"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Package, Truck, CheckCircle, MapPin, 
  Phone, Calendar, ArrowLeft, Printer, Loader2 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminOrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase
        .from("orders")
        .select(`*, profiles(full_name, phone, address)`)
        .eq("id", params.id)
        .single();
      if (data) setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [params.id, supabase]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", params.id);

    if (!error) {
      setOrder({ ...order, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    }
    setUpdating(false);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Order...</div>;

  return (
    <div className="space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50">
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Order Info & Status Control */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-50 pb-8 mb-8">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Transaction Details</p>
                <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Order #{order.id.slice(0, 8)}</h2>
                <div className="flex items-center gap-4 mt-4 text-gray-400 text-xs font-bold">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> {order.payment_status}</div>
                </div>
              </div>
              <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current Status</p>
                <p className="text-lg font-black text-blue-900 uppercase tracking-tighter">{order.status}</p>
              </div>
            </div>

            {/* STATUS UPDATE BUTTONS */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Dispatch Stage</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    disabled={updating || order.status === status}
                    onClick={() => updateStatus(status)}
                    className={cn(
                      "py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                      order.status === status 
                        ? "bg-blue-950 text-white cursor-default" 
                        : "bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    {updating && order.status !== status ? "..." : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Client & Delivery Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MapPin size={14} /> Shipping Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Customer</p>
                <p className="font-bold text-blue-950">{order.profiles?.full_name || "Guest"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Phone</p>
                <p className="font-bold text-blue-950 flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Phone size={14} /> {order.profiles?.phone || "No phone provided"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Delivery Address</p>
                <p className="text-sm font-bold text-blue-950 leading-relaxed italic">
                  {order.profiles?.address || "Address not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}