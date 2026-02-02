"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ShoppingCartIcon, Heart } from "lucide-react";
import { useShopStore } from "@/store/use-shop";

export default function ProductCard({ product }: { product: any }) {
  // Use wishlist (the objects) instead of just wishlistIds
  const { wishlist, toggleWishlist, addToCart } = useShopStore();
  
  // Check if this product is in the wishlist array
  const isWishlisted = wishlist?.some((item: any) => item.id === product.id);

  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all hover:shadow-xl hover:border-blue-100">
      
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.product_image_url || product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Wishlist Button - Passes full product */}
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            toggleWishlist(product); 
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-sm"
        >
          <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>

        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-xl bg-blue-900/90 px-3 py-2 text-[9px] font-black text-white backdrop-blur-md border border-white/20 shadow-lg tracking-widest">
          <CheckBadgeIcon className="h-3.5 w-3.5 text-yellow-400" />
          VERIFIED
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/product/${product.id}`} className="flex-grow">
          <h3 className="text-base font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-700 transition-colors leading-tight uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Price</span>
            <p className="text-xl font-black text-blue-900 tracking-tighter">
              {formattedPrice}
            </p>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}