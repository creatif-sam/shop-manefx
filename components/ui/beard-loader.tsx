"use client";

import { motion } from "framer-motion";

export function BeardLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative">
        {/* Spinning Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="h-32 w-32 rounded-full border-t-2 border-r-2 border-blue-600/20 border-t-blue-600"
        />

        {/* Animated Beard SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-blue-950">
            <motion.path
              d="M7 11c0 4 3 7 5 7s5-3 5-7 M12 18v3 M9 18v2 M15 18v2 M5 7c0-2 2-3 4-3h6c2 0 4 1 4 3 0 3-2 5-4 5H9C7 12 5 10 5 7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0], 
                opacity: [0, 1, 1, 0] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </div>

      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-950">
          ManeF/x Intelligence
        </span>
        <div className="h-[1px] w-12 bg-blue-600" />
      </motion.div>
    </motion.div>
  );
}