"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { useShopStore } from "@/store/use-shop";

export default function ProductCard({ product }: { product: any }) {
  const { wishlistIds, toggleWishlist, addToCart } = useShopStore();
  const isWishlisted = wishlistIds.includes(product.id);

  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={product.image_url || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button 
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black text-blue-900">{formattedPrice}</p>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}