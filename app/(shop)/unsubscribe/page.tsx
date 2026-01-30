"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { MailX, CheckCircle, Loader2, Home } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const supabase = createClient();

  useEffect(() => {
    async function unsubscribe() {
      if (!email) {
        setStatus('error');
        return;
      }

      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ status: 'unsubscribed' })
        .eq("email", email);

      if (error) setStatus('error');
      else setStatus('success');
    }

    unsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-xl text-center border border-gray-100"
      >
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
            <h1 className="text-xl font-black text-blue-950 uppercase tracking-tight">Processing...</h1>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter leading-none">Unsubscribed</h1>
              <p className="text-gray-400 font-medium mt-3 text-sm">
                We've removed <span className="text-blue-600 font-bold">{email}</span> from our marketing list. You won't receive further campaigns.
              </p>
            </div>
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-blue-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              <Home size={16} /> Return Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <MailX size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Something went wrong</h1>
              <p className="text-gray-400 font-medium mt-2 text-sm">We couldn't process your request. Please try again or contact support.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}