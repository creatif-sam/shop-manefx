"use client";
import { useState } from "react";
import { Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import { useShopStore } from "@/store/use-shop";

export default function ProductActions({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const { addToCart, toggleWishlist, wishlistIds } = useShopStore();
  const isWish = wishlistIds.includes(product.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-2">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-white rounded-xl transition-all"><Minus size={18}/></button>
          <span className="w-12 text-center font-black text-blue-900">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-white rounded-xl transition-all"><Plus size={18}/></button>
        </div>
        <button onClick={() => toggleWishlist(product.id)} className={`p-4 rounded-2xl border-2 transition-all ${isWish ? 'bg-red-50 border-red-500' : 'bg-white border-gray-100'}`}>
          <Heart className={`w-6 h-6 ${isWish ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
        </button>
      </div>
      <button 
        onClick={() => addToCart({ ...product, quantity: qty })}
        className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex justify-center gap-4 items-center"
      >
        <ShoppingBag size={24} strokeWidth={2.5} /> Add To Cart
      </button>
    </div>
  );
}