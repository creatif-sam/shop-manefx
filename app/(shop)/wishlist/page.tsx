"use client";

import { useShopStore } from "@/store/use-shop";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ChevronRight, 
  ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShopStore();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* BRANDED HEADER */}
      <div className="bg-[#004d4d] pt-24 pb-20 px-6 md:px-10 rounded-b-[3.5rem] text-center shadow-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
            <Heart className="text-cyan-300 fill-cyan-300" size={32} />
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Your Favorites
          </h1>
          <p className="text-cyan-300 font-black uppercase tracking-[0.3em] mt-4 text-xs md:text-sm">
            Saved items for your beard journey
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <AnimatePresence mode="popLayout">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
                >
                  {/* PRODUCT IMAGE SECTION */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                      <Image
                        src={product.product_image_url || product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    </Link>
                    
                    {/* REMOVE BUTTON */}
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-5 right-5 p-3.5 bg-white/90 backdrop-blur-md rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* PRODUCT DETAILS SECTION */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">
                        {product.category || "Verified Kit"}
                      </p>
                      <h3 className="font-black text-blue-950 uppercase text-xl leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-8">
                      <p className="text-2xl font-black text-blue-900 tracking-tighter">
                        GHS {product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-auto grid grid-cols-5 gap-3">
                      <Link 
                        href={`/product/${product.id}`}
                        className="col-span-2 bg-gray-50 text-blue-950 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-center hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        Details
                      </Link>
                      <button 
                        onClick={() => addToCart(product)}
                        className="col-span-3 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                      >
                        <ShoppingBag size={16} /> Add to Bag
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="relative mb-10">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                  <Heart className="text-gray-200" size={56} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-lg border border-gray-50">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tight">
                Your wishlist is empty
              </h2>
              <p className="text-gray-400 font-medium max-w-sm mx-auto mt-3 mb-12 text-sm leading-relaxed">
                Start adding your favorite Kirkland kits and gear. We&apos;ll keep them safe for you right here.
              </p>
              
              <Link 
                href="/shop" 
                className="group flex items-center gap-3 bg-blue-600 text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Explore Shop <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION FOR MOBILE */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-50">
        <Link 
          href="/shop"
          className="flex items-center gap-2 bg-blue-950 text-white px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl backdrop-blur-md bg-opacity-90 border border-white/10"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>
    </div>
  );
}