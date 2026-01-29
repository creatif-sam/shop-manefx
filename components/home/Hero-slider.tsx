"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const slides = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1626015565611-660c912e738c?q=80&w=1200",
      title: "100% ORIGINAL KIRKLAND",
      subtitle: "AUTHENTICITY GUARANTEED FOR GHANA",
      date: "LIMITED STOCK",
    },
    {
      type: "video",
      src: "https://player.vimeo.com/external/494252666.sd.mp4?s=9d009386663f721471714578848d6ca73d74c0e6&profile_id=165",
      title: "CLEAR USAGE GUIDANCE",
      subtitle: "LEARN HOW TO GROW YOUR BEARD RIGHT",
      date: "WATCH & LEARN",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200",
      title: "JOIN THE MANE F/X FAMILY",
      subtitle: "LOCAL SUPPORT VIA WHATSAPP & SNAPCHAT",
      date: "RESULTS DRIVEN",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="relative flex-[0_0_100%] min-w-0 h-[500px] md:h-[700px]">
            {slide.type === "video" ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover opacity-60"
                priority={index === 0}
              />
            )}
            
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
              <span className="bg-yellow-500 text-blue-950 px-4 py-1 rounded-full text-xs font-black mb-4 tracking-widest uppercase">
                {slide.date}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-3 drop-shadow-2xl tracking-tighter uppercase max-w-4xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl font-bold text-yellow-400 mb-10 uppercase tracking-[0.2em]">
                {slide.subtitle}
              </p>
              <button className="flex items-center gap-3 bg-white text-blue-950 px-10 py-5 rounded-full font-black text-sm uppercase hover:bg-yellow-400 transition-all active:scale-95 shadow-2xl">
                SHOP KITS NOW <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}