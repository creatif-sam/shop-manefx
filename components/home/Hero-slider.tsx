"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>([]);
  const [messaging, setMessaging] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const supabase = createClient();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  useEffect(() => {
    async function getHeroData() {
      const [slidesRes, settingsRes] = await Promise.all([
        supabase.from("hero_slides").select("*").order("order_index", { ascending: true }),
        supabase.from("site_settings").select("*").eq("id", "hero_config").single()
      ]);

      if (slidesRes.data) setSlides(slidesRes.data);
      if (settingsRes.data) setMessaging(settingsRes.data);
      setLoading(false);
    }
    getHeroData();
  }, [supabase]);

  // Typing animation variants
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { delay: 0.5, staggerChildren: 0.04 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading || !messaging) return (
    <div className="w-full h-[500px] md:h-[650px] bg-[#004d4d] flex items-center justify-center">
      <Loader2 className="animate-spin text-cyan-300" size={40} />
    </div>
  );

  return (
    <>
      {/* Inline style for the blinking border animation */}
      <style jsx global>{`
        @keyframes border-blink {
          0% { border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 0 0px rgba(34, 211, 238, 0); }
          50% { border-color: rgba(34, 211, 238, 1); box-shadow: 0 0 15px rgba(34, 211, 238, 0.5); }
          100% { border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 0 0px rgba(34, 211, 238, 0); }
        }
        .blinking-border {
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: border-blink 2s infinite;
        }
      `}</style>

      <div className="relative w-full overflow-hidden bg-[#004d4d]" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-[550px] md:h-[680px]">
              {/* MEDIA */}
              {slide.media_type === "video" ? (
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
                  <source src={slide.media_url} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={slide.media_url || "/placeholder.jpg"}
                  alt=""
                  fill
                  className="object-cover opacity-60"
                  unoptimized
                  priority={index === 0}
                />
              )}
              
              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                <motion.span 
                  key={`badge-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] md:text-[10px] font-bold mb-5 border border-white/10 tracking-[0.4em] uppercase"
                >
                  {slide.badge_text || "Premium Quality"}
                </motion.span>

                {/* TYPING TITLE (Reduced Size) */}
                <motion.h1 
                  key={`title-${currentSlide}`}
                  variants={sentence}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-6xl font-black text-white mb-3 tracking-tighter uppercase leading-tight max-w-4xl drop-shadow-xl"
                >
                  {messaging.hero_title.split("").map((char: string, i: number) => (
                    <motion.span key={char + "-" + i} variants={letter}>{char}</motion.span>
                  ))}
                </motion.h1>

                {/* SUBTITLE (Reduced Size) */}
                <motion.p 
                  key={`sub-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-sm md:text-lg font-medium text-cyan-300 mb-10 uppercase tracking-[0.3em] max-w-xl"
                >
                  {messaging.hero_subtitle}
                </motion.p>

                {/* BLINKING BUTTON */}
                <motion.button 
                  key={`btn-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="blinking-border flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase transition-all active:scale-95 shadow-2xl group"
                >
                  {messaging.cta_text} 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}