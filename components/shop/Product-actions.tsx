"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { useShopStore } from "@/store/use-shop";

export default function ProductActions({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const { addToCart, toggleWishlist, wishlistIds } = useShopStore();
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {/* Numeric Counter */}
        <div className="flex items-center bg-gray-100 p-2 rounded-2xl border border-gray-200">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="p-3 hover:bg-white rounded-xl transition-all"
          >
            <Minus size={20} />
          </button>
          <span className="w-12 text-center font-black text-xl text-blue-900">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            className="p-3 hover:bg-white rounded-xl transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`p-4 rounded-2xl border transition-all ${
            isWishlisted ? "border-red-500 bg-red-50" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Primary Buy Button */}
      <button 
        onClick={() => addToCart({ ...product, quantity: qty })}
        className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <ShoppingCart size={24} />
        Add to Shopping Bag
      </button>
    </div>
  );
}