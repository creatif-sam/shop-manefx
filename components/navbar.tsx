"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Sparkles, Home, Search, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useShopStore } from "@/store/use-shop";
import CartDrawer from "./cart-drawer";
import { motion } from "framer-motion"; 

export default function Navbar() {
  // Pull full wishlist array from store
  const cart = useShopStore((state) => state.cart);
  const wishlist = useShopStore((state) => state.wishlist) || []; 
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ/AI Shop Assistant", href: "/faq", isSpecial: true },
  ];

  const mobileBottomLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/shop", icon: Search },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Help/AI", href: "/faq", icon: HelpCircle },
    { label: "Profile", href: "/auth/login", icon: User },
  ];

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm relative">
          
          <div className="flex items-center font-bold text-blue-900 text-xl tracking-tighter z-10 hover:scale-105 transition-transform">
            <Link href="/">shop!ManeF/x</Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 text-[13px] font-bold text-gray-600 uppercase tracking-tight">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="relative group py-2 transition-colors hover:text-blue-900">
                <span className="flex items-center gap-1">
                  {link.isSpecial && <Sparkles className="w-3 h-3 text-gold-500 animate-pulse" />}
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 z-10">
            <CartDrawer>
              <button className="relative p-2 text-gray-700 hover:text-blue-900 hover:scale-110 transition-all group">
                <ShoppingCart className="w-6 h-6 lg:w-5 lg:h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                    {cartCount}
                  </span>
                )}
              </button>
            </CartDrawer>
            
            <div className="hidden lg:flex items-center gap-2">
               {/* DESKTOP WISHLIST ICON WITH COUNT */}
               <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-red-500 transition-all hover:scale-110 group">
                  <Heart className={`w-5 h-5 ${mounted && wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px] animate-in zoom-in">
                      {wishlistCount}
                    </span>
                  )}
               </Link>
               <Link href="/auth/login" className="p-2 text-gray-700 hover:text-blue-900 transition-all">
                  <User className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM TAB BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
        {mobileBottomLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.label} href={link.href} className="flex flex-col items-center gap-1 relative group">
              <div className={`p-1 transition-all ${isActive ? 'text-blue-900 scale-110' : 'text-gray-400'}`}>
                <Icon className={`w-6 h-6 ${isActive && link.label === 'Wishlist' ? 'fill-red-500 text-red-500' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-blue-900' : 'text-gray-400'}`}>
                {link.label}
              </span>
              
              {/* MOBILE COUNT BADGE */}
              {link.label === 'Wishlist' && mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[14px] flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}

              {isActive && (
                <motion.div layoutId="activeDot" className="absolute -bottom-1 w-1 h-1 bg-blue-900 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}