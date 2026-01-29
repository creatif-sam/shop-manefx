"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      setStatus("error");
      setMessage(error.code === "23505" ? "You're already on the list!" : "Try again later.");
    } else {
      setStatus("success");
      setEmail("");
      setMessage("Welcome to the ManeF/x family!");
    }
  };

  return (
    <section className="w-full py-20 bg-blue-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-white p-8 md:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 border-b-8 border-gold-500"
        >
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tighter uppercase">
              Get Growth Tips
            </h2>
            <p className="mt-4 text-gray-600 font-medium leading-relaxed">
              Join 100+ men in Ghana receiving weekly beard routines and exclusive Kirkland kit restock alerts.
            </p>
          </div>

          <div className="w-full max-w-md">
            {status === "success" ? (
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100"
              >
                <CheckCircle2 className="text-green-600 w-6 h-6" />
                <p className="text-green-800 font-bold text-sm">{message}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-blue-950 font-bold"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-blue-900 text-white hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Join Now</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-xs font-bold ml-2 uppercase tracking-tighter">{message}</p>
                )}
              </form>
            )}
            <p className="mt-4 text-[10px] text-gray-400 text-center uppercase font-bold tracking-[0.2em]">
              No spam. Just growth. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}