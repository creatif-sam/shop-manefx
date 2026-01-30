"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  User, MapPin, Phone, Save, Loader2, 
  ShieldCheck, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    email: ""
  });

  const supabase = createClient();

  // Load User and Profile Data
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            setProfile({
              full_name: data.full_name || "",
              phone: data.phone_number || "", // Maps from DB column
              address: data.shipping_address || "", // Maps from DB column
              email: user.email || ""
            });
          } else {
            setProfile(prev => ({ ...prev, email: user.email || "" }));
          }
        }
      } catch (err) {
        console.error("Initial load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication failed. Please log in again.");

      // UPSERT Logic: Matches your specific DB column names
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone_number: profile.phone, // Maps React state to DB column
          shipping_address: profile.address, // Maps React state to DB column
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      // FORCE REVEAL: This prevents the empty {} log by extracting strings manually
      const errorLog = {
        message: error?.message || "Unknown error",
        code: error?.code || "No code",
        details: error?.details || "No details",
        hint: error?.hint || "No hint"
      };
      
      console.error("CRITICAL SETTINGS ERROR:", errorLog);

      // User-friendly mapping for common Postgres errors
      let displayMessage = error?.message || "Failed to save profile";
      if (error?.code === '42501') displayMessage = "Permission denied (Check RLS Policies)";
      if (error?.code === '23502') displayMessage = "Missing required fields";

      toast.error(displayMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">
          Account <span className="text-blue-600">Settings</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.1em] font-bold">
          Manage your personal growth profile
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* IDENTITY CARD */}
        <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
              <User size={20} />
            </div>
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em]">Profile Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-blue-950 outline-none focus:border-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                placeholder="Samuel Gyasi"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email (Account ID)</label>
              <div className="relative group">
                <input 
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 font-bold text-gray-400 cursor-not-allowed"
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm">
                  +233
                </div>
                <input 
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-20 pr-6 py-4 font-bold text-blue-950 outline-none focus:border-blue-100 focus:bg-white transition-all"
                  placeholder="24 000 0000"
                />
              </div>
            </div>
          </div>
        </section>

        {/* LOGISTICS CARD */}
        <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
              <MapPin size={20} />
            </div>
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em]">Shipping Logistics</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Default Address (Ghana)</label>
            <textarea 
              rows={4}
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="w-full bg-gray-50 border-2 border-transparent rounded-3xl px-6 py-5 font-bold text-blue-950 outline-none focus:border-blue-100 focus:bg-white transition-all resize-none placeholder:text-gray-300"
              placeholder="Enter House No., Street, and Landmarks (e.g., Near the Osu Shell Station)"
            />
          </div>
        </section>

        {/* SAVE ACTION */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className={cn(
              "group px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl",
              saving 
                ? "bg-gray-100 text-gray-400 cursor-wait" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 active:scale-95"
            )}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}