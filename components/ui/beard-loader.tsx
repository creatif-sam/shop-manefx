"use client";

import { motion } from "framer-motion";

export function BeardLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        {/* Increased size to h-32 (from h-20) for better visibility */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="h-32 w-32 rounded-full border-[3px] border-blue-600/10 border-t-blue-600"
        />

        {/* Center Logo centered perfectly within the larger ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <img 
              src="/images/loader.png" 
              alt="ManeF/x Logo" 
              className="h-16 w-16 object-contain" 
            />
          </motion.div>
        </div>
      </div>

      {/* Tagline with updated text and slightly larger font */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-blue-900/60 text-center">
          Glowing Your Beard Nicely
        </span>
        <motion.div 
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-[1.5px] w-16 bg-blue-600/30"
        />
      </motion.div>
    </motion.div>
  );
}