"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Large 404 Graphic */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <h1 className="text-[12rem] md:text-[15rem] font-black text-blue-50 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col justify-center pt-12">
            <h2 className="text-3xl md:text-5xl font-black text-blue-950 uppercase tracking-tighter leading-tight">
              Lost in the <br />
              <span className="text-blue-600">Growth Maze?</span>
            </h2>
            <p className="text-gray-400 font-medium mt-4 max-w-xs leading-relaxed">
              The page you are looking for has been trimmed or moved to a new location.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Quick Navigation Bento */}
        <div className="grid grid-cols-1 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/shop" className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-blue-600 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl group-hover:bg-blue-500 transition-colors">
                  <ShoppingBag className="text-blue-600 group-hover:text-white" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-100">Back to Shop</p>
                  <h3 className="text-lg font-bold text-blue-950 group-hover:text-white">Browse Kits</h3>
                </div>
              </div>
              <Search className="text-gray-300 group-hover:text-blue-200" size={20} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="group flex items-center justify-between p-6 border-2 border-gray-50 rounded-[2rem] hover:border-blue-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Home className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Entry</p>
                  <h3 className="text-lg font-bold text-blue-950">Return Home</h3>
                </div>
              </div>
              <ArrowLeft className="text-gray-300 group-hover:-translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-blue-950 rounded-[2rem] text-center"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Need Help?</p>
            <Link href="https://wa.me/233535023614" className="text-white font-bold hover:underline underline-offset-4">
              Chat with ManeF/x Support
            </Link>
          </motion.div>
        </div>

      </div>
    </main>
  );
}