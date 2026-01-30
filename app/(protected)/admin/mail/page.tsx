"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Mail, Send, Users, FileText, Plus, 
  Search, Loader2, CheckCircle, BarChart3, Clock
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Import the Modal Component
import { NewCampaignModal } from "@/components/admin/new-campaign-modal";

export default function MailSystem() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    activeSubscribers: 0, 
    totalCampaigns: 0, 
    emailsDelivered: 0,
    drafts: 0
  });
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  
  const supabase = createClient();

  const fetchMailData = async () => {
    setLoading(true);
    try {
      // Fetching subscribers and campaigns simultaneously
      const [subsRes, campaignsRes] = await Promise.all([
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("mail_campaigns")
          .select("*")
      ]);

      if (subsRes.error) throw subsRes.error;

      const allSubs = subsRes.data || [];
      
      // Resilient filtering: handles potential case sensitivity or nulls
      const activeCount = allSubs.filter(s => 
        s.status?.toLowerCase() === 'active' || !s.status
      ).length;

      const campaigns = campaignsRes.data || [];
      const totalSent = campaigns
        .filter(c => c.status === 'sent')
        .reduce((acc, curr) => acc + (curr.total_recipients || 0), 0);
      
      const draftsCount = campaigns.filter(c => c.status === 'draft').length;

      setSubscribers(allSubs);
      setStats({
        activeSubscribers: activeCount,
        totalCampaigns: campaigns.length,
        emailsDelivered: totalSent,
        drafts: draftsCount
      });
    } catch (err: any) {
      console.error("Database Error:", err);
      toast.error("Failed to sync mail data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMailData(); }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter">Mail System</h2>
          <p className="text-gray-400 text-sm font-medium">Broadcast marketing & subscriber management.</p>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> New Campaign
        </button>
      </div>

      {/* INFO BANNER (Matching your reference) */}
      <section className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] flex items-start gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm hidden sm:block">
          <Mail className="text-blue-600" size={32} />
        </div>
        <div>
          <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
            Email Campaign Management
          </h3>
          <p className="text-blue-700/70 text-sm font-medium max-w-2xl mt-1 leading-relaxed">
            Create and send email campaigns to your newsletter subscribers. Powered by Resend engine for 100% delivery rates to Accra and beyond.
          </p>
        </div>
      </section>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Campaigns", value: stats.totalCampaigns, icon: BarChart3, color: "text-blue-600" },
          { label: "Drafts", value: stats.drafts, icon: FileText, color: "text-amber-500" },
          { label: "Active Subs", value: stats.activeSubscribers, icon: Users, color: "text-emerald-500" },
          { label: "Total Sent", value: stats.emailsDelivered, icon: Send, color: "text-blue-900" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-blue-950">{stat.value}</p>
            </div>
            <stat.icon className={stat.color} size={24} />
          </div>
        ))}
      </div>

      {/* SUBSCRIBER TABLE */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h4 className="font-black text-blue-950 uppercase text-xs tracking-widest flex items-center gap-2">
            <Users size={16} /> Subscriber List
          </h4>
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              placeholder="Search by email..."
              className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                <th className="px-8 py-5">Recipient Email</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.length > 0 ? subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-blue-950 text-sm">{sub.email}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                      sub.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {sub.status || 'active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-[11px] text-gray-400 font-bold font-mono">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <Users size={40} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-widest">No subscribers found in database</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isComposing && (
          <NewCampaignModal 
            subscriberCount={stats.activeSubscribers}
            onClose={() => setIsComposing(false)}
            onSuccess={() => {
              fetchMailData();
              setIsComposing(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}