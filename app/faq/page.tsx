"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X, Send, Sparkles, Loader2, MessageCircle } from "lucide-react";

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
    <main className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* Header Section */}
      <section className="bg-blue-900 py-24 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4"
        >
          How can we help?
        </motion.h1>
        <p className="text-blue-100 font-medium text-lg tracking-wide uppercase">
          Find answers or chat with our AI Growth Assistant
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto py-16 px-6">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className="font-black text-blue-950 uppercase tracking-tight">{faq.q}</span>
                <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  {openIndex === i ? <Minus className="text-blue-600 w-4 h-4" /> : <Plus className="text-gray-400 w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-8 pb-8 text-gray-600 leading-relaxed font-medium">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Launcher Button */}
      {!isChatOpen && (
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-110 transition-transform flex items-center gap-3 group z-[999]"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-gold-400" />
          <span className="font-black pr-2 hidden md:inline uppercase tracking-widest text-xs">Ask Assistant</span>
        </motion.button>
      )}

      {/* AI Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <AIChatWindow onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function AIChatWindow({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your ManeF/x Assistant. Ask me anything about beard growth or our kits!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    // AI Response Simulation
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "For authentic Kirkland Minoxidil, we recommend applying 1ml twice daily. Would you like me to show you our Starter Kit for Ghana?" }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95, transformOrigin: "bottom right" }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      // Z-INDEX set to 9999 to be above everything, bottom reduced to avoid cut-off
      className="fixed bottom-4 right-4 w-[95vw] md:w-[420px] h-[600px] max-h-[85vh] bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] z-[9999] flex flex-col border border-gray-100 overflow-hidden"
    >
      {/* Optimized Header: Fixed height and clear spacing */}
      <div className="bg-blue-900 px-6 py-5 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <span className="block font-black uppercase tracking-tighter text-sm">ManeF/x AI</span>
            <span className="block text-[10px] text-blue-300 font-bold uppercase tracking-widest">Always Online</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50/50 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                : 'bg-white shadow-sm text-blue-950 rounded-tl-none border border-gray-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="animate-spin text-blue-900 w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your growth question..."
          className="flex-grow bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-blue-950 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
        />
        <button 
          onClick={handleSend} 
          className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-90"
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
    </motion.div>
  );
}