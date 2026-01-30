"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, FlaskConical, CheckCircle2, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Global Sourcing",
    highlight: "Direct from manufacturers",
    description: "Sourced directly from trusted distributors in Ghana and  the USA. We bypass middlemen to ensure original quality reaches Ghana.",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Batch Verification",
    highlight: "Lab Certified",
    description: "Every batch features a unique QR code linked to a laboratory certificate proving 100% original potency.",
    icon: FlaskConical,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Guaranteed Results",
    highlight: "100% Original",
    description: "Stop wasting money on fakes. Join 100+ Ghanaian men who have achieved real growth with ManeF/x.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
];

export default function AuthenticitySlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden relative">
        
        {/* Slim Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-50 flex">
          {slides.map((_, i) => (
            <div key={i} className="flex-1 h-full">
              {i === current && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="h-full bg-blue-600"
                />
              )}
              {i < current && <div className="h-full w-full bg-blue-600/20" />}
            </div>
          ))}
        </div>

        {/* Reduced height grid: min-h reduced from 450px to 280px */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[280px]">
          
          {/* Left Side: Visual (4 columns) */}
          <div className="md:col-span-4 bg-slate-50 flex items-center justify-center p-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className={`relative w-24 h-24 rounded-2xl ${slides[current].bg} flex items-center justify-center shadow-sm`}
              >
                <div className={slides[current].color}>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                    {(() => {
                      const Icon = slides[current].icon;
                      return <Icon size={40} strokeWidth={1.5} />;
                    })()}
                  </motion.div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-blue-50">
                  <CheckCircle2 className="text-blue-600" size={14} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Content (8 columns) */}
          <div className="md:col-span-8 p-8 md:p-10 flex flex-col justify-center bg-white relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${slides[current].color}`}>
                    {slides[current].highlight}
                </p>
                
                <h3 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tighter mb-2">
                  {slides[current].title}
                </h3>
                
                <p className="text-gray-500 font-medium leading-relaxed text-xs md:text-sm mb-4 max-w-md">
                  {slides[current].description}
                </p>

                <button 
                    onClick={() => setCurrent((current + 1) % slides.length)}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-900 group"
                >
                    Next Story <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots moved inside for height saving */}
            <div className="absolute bottom-4 right-8 flex gap-1.5">
              {slides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-blue-600" : "w-1 bg-gray-200"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}