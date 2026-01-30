"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ mainImage, name }: { mainImage: string, name: string }) {
  const [active, setActive] = useState(mainImage);
  const images = [mainImage, mainImage, mainImage]; // Placeholder for additional gallery images

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl shadow-blue-900/10 border border-gray-100">
        <Image src={active} alt={name} fill className="object-cover" priority />
      </div>
      <div className="flex gap-4 justify-center">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActive(img)}
            className={`w-20 h-20 rounded-2xl overflow-hidden border-4 transition-all ${active === img ? 'border-blue-600 scale-110' : 'border-transparent opacity-50'}`}
          >
            <Image src={img} alt={name} width={80} height={80} className="object-cover h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}