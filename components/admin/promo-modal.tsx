"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, CheckCircle, Loader2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function PromoModal({ promo, onClose, onSuccess }: any) {
  const [form, setForm] = useState({
    discount: promo.discount_percent || 10,
    endsAt: promo.ends_at ? new Date(promo.ends_at).toISOString().slice(0, 16) : ""
  });
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSubmitting(true);
    const promoData = {
      product_id: promo.product_id,
      discount_percent: form.discount,
      ends_at: new Date(form.endsAt).toISOString(),
      is_active: true
    };
    const { error } = await supabase.from("promotions").upsert(promoData, { onConflict: 'product_id' });
    if (!error) {
      toast.success("Flash deal activated");
      onSuccess();
    }
    setSubmitting(false);
  };

  const handleStop = async () => {
    setSubmitting(true);
    await supabase.from("promotions").delete().eq("product_id", promo.product_id);
    toast.info("Promotion ended");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-blue-950/40 backdrop-blur-sm">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] p-8 md:p-10 shadow-2xl">
        <div className="flex justify-between items-start mb-8 text-blue-950">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Flash Sale</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target: {promo.product_name}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors"><X size={20}/></button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Discount %</label>
            <input type="number" value={form.discount} onChange={e => setForm({...form, discount: parseInt(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-black text-3xl text-red-600 outline-none focus:ring-2 focus:ring-red-100"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Expiry Date</label>
            <input type="datetime-local" value={form.endsAt} onChange={e => setForm({...form, endsAt: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100"/>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <button onClick={handleSave} disabled={submitting} className="w-full bg-red-600 text-white py-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-100 active:scale-95 transition-all">
              {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Push Deal Live"}
            </button>
            {promo.product_id && (
              <button onClick={handleStop} className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">
                Cancel Active Deal
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}