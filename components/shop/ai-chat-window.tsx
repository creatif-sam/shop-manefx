"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2 } from "lucide-react";

export function AIChatWindow({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your ManeF/x Assistant. Ask me anything about our growth kits or shipping!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested questions to help user test the RAG
  const suggestions = ["What's your WhatsApp?", "Is the Minoxidil original?", "How long is delivery?"];

  // 1. Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        throw new Error("No response");
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "I'm having a quick sync with the lab. Please try again or WhatsApp us at +233535023614." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-[95vw] md:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] z-[9999] flex flex-col border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-blue-900 px-6 py-6 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="block font-black uppercase tracking-tighter text-sm">ManeF/x Intelligence</span>
            <span className="block text-[10px] text-blue-300 font-bold uppercase tracking-widest">Growth Specialist</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef} 
        className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50/50"
      >
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-blue-950 rounded-tl-none border border-gray-100'
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="animate-spin text-blue-900 w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {/* Quick Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {suggestions.map((s) => (
                <button 
                    key={s}
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border border-gray-100 transition-colors"
                >
                    {s}
                </button>
            ))}
        </div>

        <div className="flex gap-2 items-center">
            <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about beard growth..."
            className="flex-grow bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-blue-950 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
            />
            <button 
            onClick={() => handleSend()} 
            disabled={loading}
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50 shadow-lg shadow-blue-100"
            >
            <Send size={18} fill="currentColor" />
            </button>
        </div>
      </div>
    </motion.div>
  );
}