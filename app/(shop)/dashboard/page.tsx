"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation"; // Added for toast listener
import { toast } from "sonner"; // Ensure sonner is installed
import { Package, Truck, CheckCircle, Clock, Sparkles } from "lucide-react";

export default function ClientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const supabase = createClient();
  
  // Hooks for toast listener
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Toast Listener for Unauthorized Access
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      toast.error("Access Denied", {
        description: "You do not have administrative permissions.",
        duration: 5000,
      });

      // Cleanup: Remove 'error' from URL without reloading the page
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      router.replace(newRelativePathQuery);
    }

    // 2. Original Dashboard Data Fetching
    async function getDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, orderRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      setProfile(profileRes.data);
      if (orderRes.data?.[0]) setRecentOrder(orderRes.data[0]);
    }

    getDashboardData();
  }, [searchParams, router, supabase]);

  return (
    <div className="space-y-10">
      {/* WELCOME HEADER */}
      <div className="bg-blue-950 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Hello, {profile?.full_name?.split(' ')[0] || "Chief"}!
          </h1>
          <p className="text-blue-200 font-medium mt-2">Ready to stay consistent with your growth routine today?</p>
        </div>
        <Sparkles className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/5 rotate-12" />
      </div>

      {/* ORDER STATUS TRACKER */}
      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-900 ml-2">Recent Order Status</h3>
        
        {recentOrder ? (
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                  <Package size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{recentOrder.id.slice(0,8)}</p>
                  <p className="text-lg font-black text-blue-950">Kirkland 6-Month Supply</p>
                </div>
              </div>

              {/* STEP TRACKER UI */}
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-blue-900/40">
                <span className="text-blue-600">Processing</span>
                <div className="h-[2px] w-8 bg-gray-100" />
                <span>Shipped</span>
                <div className="h-[2px] w-8 bg-gray-100" />
                <span>Delivered</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center">
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No orders yet. Your mane is waiting!</p>
          </div>
        )}
      </section>

      {/* QUICK INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">Default Shipping</h4>
          <p className="text-blue-950 font-bold leading-relaxed">
            {profile?.address || "No address saved yet."}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">Support</h4>
          <p className="text-blue-950 font-bold">Need help with your kit?</p>
          <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 underline mt-2">Chat with ManeF/x AI</button>
        </div>
      </div>
    </div>
  );
}