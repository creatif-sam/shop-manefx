"use client";

import { useShopStore } from "@/store/use-shop";
import ProductCard from "@/components/ui/product-card";
import { Heart, ShoppingBag, ArrowRight, Ghost } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { wishlist } = useShopStore();

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
            <Heart className="w-3 h-3 fill-current" />
            Curated Collection
          </div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">
            Your <span className="text-blue-600">Wishlist</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">
            Items you've saved for your future growth journey.
          </p>
        </div>

        {wishlist.length > 0 && (
          <Link 
            href="/shop" 
            className="group flex items-center gap-3 bg-white border border-gray-100 px-8 py-4 rounded-2xl text-blue-950 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* WISHLIST GRID */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {wishlist.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <Ghost className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter">Your wishlist is empty</h3>
              <p className="text-gray-400 text-sm max-w-xs mt-2 font-medium">
                See something you like? Tap the heart icon to save it here for later.
              </p>
              <Link 
                href="/shop" 
                className="mt-8 flex items-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore the Shop
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER INFO */}
      {wishlist.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-blue-900 font-bold text-sm">
            Ready to start? Add these items to your cart for same-day dispatch in Accra.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            <span>{wishlist.length} Items Saved</span>
          </div>
        </div>
      )}
    </div>
  );
}