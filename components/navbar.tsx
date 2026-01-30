"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Sparkles, Home, Search, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useShopStore } from "@/store/use-shop";
import { createClient } from "@/lib/supabase/client"; // Ensure this path is correct
import CartDrawer from "./cart-drawer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const cart = useShopStore((state) => state.cart);
  const wishlist = useShopStore((state) => state.wishlist) || [];
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name: string; avatar_url?: string } | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setMounted(true);

    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setUserProfile(profile);
      }
    }
    getUserData();
  }, [supabase]);

  const firstName = userProfile?.full_name?.split(" ")[0] || "Profile";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ/AI Shop Assistant", href: "/faq", isSpecial: true },
  ];

  // Logic for Profile Link
  const profileLink = userProfile ? "/dashboard" : "/auth/login";

  const mobileBottomLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/shop", icon: Search },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Help/AI", href: "/faq", icon: HelpCircle },
    { label: firstName, href: profileLink, icon: User, isProfile: true },
  ];

  return (
    <>
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
               <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-red-500 transition-all hover:scale-110 group">
                  <Heart className={`w-5 h-5 ${mounted && wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px]">
                      {wishlistCount}
                    </span>
                  )}
               </Link>

               {/* DESKTOP DYNAMIC PROFILE */}
               <Link href={profileLink} className="p-1 ml-2 flex items-center gap-2 group">
                  {userProfile?.avatar_url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all">
                      <Image 
                        src={userProfile.avatar_url} 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-gray-50 rounded-full text-gray-700 group-hover:text-blue-900 transition-all">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  {userProfile && (
                    <span className="text-[11px] font-black text-blue-900 uppercase tracking-tight hidden xl:block">
                      {firstName}
                    </span>
                  )}
               </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
        {mobileBottomLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.label} href={link.href} className="flex flex-col items-center gap-1 relative group min-w-[60px]">
              <div className={`p-1 transition-all ${isActive ? 'text-blue-900 scale-110' : 'text-gray-400'}`}>
                {/* MOBILE DYNAMIC PROFILE ICON */}
                {link.isProfile && userProfile?.avatar_url ? (
                  <div className={`relative w-6 h-6 rounded-full overflow-hidden border ${isActive ? 'border-blue-900' : 'border-transparent'}`}>
                    <Image src={userProfile.avatar_url} alt="Profile" fill className="object-cover" />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 ${isActive && link.label === 'Wishlist' ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-900' : 'text-gray-400'}`}>
                {link.label}
              </span>
              
              {link.label === 'Wishlist' && mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[14px] flex items-center justify-center border-2 border-white">
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