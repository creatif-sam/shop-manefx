"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Timer as TimerIcon, ArrowRight } from "lucide-react";

// Helper to calculate time left
const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) return null;

  return {
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

function CountdownTimer({ targetDate, onExpire }: { targetDate: string, onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      if (!remaining) {
        onExpire();
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2 mt-4">
      {[
        { label: 'H', val: timeLeft.hours },
        { label: 'M', val: timeLeft.minutes },
        { label: 'S', val: timeLeft.seconds }
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 border border-white/10 min-w-[45px]">
          <span className="text-lg font-black text-gold-500 leading-none">{String(unit.val).padStart(2, '0')}</span>
          <span className="text-[8px] font-bold text-white uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PromotionsSection() {
  const [promoItems, setPromoItems] = useState<any[]>([]);
  const supabase = createClient();

  const fetchPromos = async () => {
    const { data } = await supabase
      .from("promotions")
      .select(`
        id,
        discount_percent,
        ends_at,
        products (id, name, price, image_url)
      `)
      .eq("is_active", true)
      .gt("ends_at", new Date().toISOString())
      .limit(2);
    
    if (data) setPromoItems(data);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  if (promoItems.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-gold-600 font-black uppercase text-xs tracking-[0.3em] mb-2 block">Exclusive Offers</span>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tighter">
              Flash <span className="text-blue-600">Deals</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {promoItems.map((promo, idx) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative bg-slate-950 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden border border-white/5"
              >
                <div className="absolute top-8 left-8 z-20 bg-red-600 text-white font-black px-4 py-2 rounded-xl shadow-xl">
                  -{promo.discount_percent}%
                </div>

                <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                  <Image
                    src={promo.products.image_url || "/placeholder-product.jpg"}
                    alt={promo.products.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
                  />
                </div>

                <div className="flex flex-col text-center md:text-left flex-grow">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 line-clamp-1">
                    {promo.products.name}
                  </h3>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="text-gray-500 line-through text-sm font-bold">GHS {promo.products.price}</span>
                    <span className="text-2xl font-black text-gold-500">GHS {(promo.products.price * (1 - promo.discount_percent / 100)).toFixed(2)}</span>
                  </div>

                  {/* Timer Logic */}
                  <CountdownTimer 
                    targetDate={promo.ends_at} 
                    onExpire={() => setPromoItems(prev => prev.filter(p => p.id !== promo.id))} 
                  />

                  <Link
                    href={`/product/${promo.products.id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-blue-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gold-500 transition-all active:scale-95"
                  >
                    Claim <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}