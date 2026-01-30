"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles } from "lucide-react";
import { AIChatWindow } from "@/components/shop/ai-chat-window"; // Import here

const faqs = [
  {
    q: "Is your Kirkland Minoxidil original?",
    a: "Yes, 100%. We source directly from authorized US distributors. Every batch comes with a serial number and a verifiable seal on the packaging.",
  },
  {
    q: "How long does delivery take in Ghana?",
    a: "We offer 24-48 hour delivery in Accra and Kumasi. Other regions take 3-5 business days via our local courier partners.",
  },
  {
    q: "When will I see beard growth results?",
    a: "Most men see vellus (thin) hair growth within 4-8 weeks. For full terminal hair, we recommend a consistent 6-month routine.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-blue-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">FAQ Center</h1>
        <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">Expert Help & AI Assistant</p>
      </section>

      <section className="max-w-3xl mx-auto py-12 px-6">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-7 text-left font-black text-blue-950 uppercase text-sm tracking-tight"
              >
                {faq.q}
                {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-7 pb-7 text-gray-500 font-medium text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Button */}
      {!isChatOpen && (
        <motion.button 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-2xl flex items-center gap-3 z-[999] hover:scale-105 transition-transform"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-black text-[10px] uppercase tracking-widest pr-2 hidden md:block">Ask AI</span>
        </motion.button>
      )}

      {/* AI Chat Window Overlay */}
      <AnimatePresence>
        {isChatOpen && <AIChatWindow onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}