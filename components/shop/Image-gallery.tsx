"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ mainImage, name }: { mainImage: string, name: string }) {
  const [activeImage, setActiveImage] = useState(mainImage);
  
  // Example thumbnails (You can pull these from DB later)
  const thumbnails = [mainImage, mainImage, mainImage]; 

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails Sidebar */}
      <div className="flex md:flex-col gap-3">
        {thumbnails.map((img, i) => (
          <button 
            key={i}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              activeImage === img ? "border-blue-600" : "border-gray-100 opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={name} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Large Image */}
      <div className="relative aspect-square md:aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl shadow-blue-900/5">
        <Image 
          src={activeImage} 
          alt={name} 
          fill 
          className="object-cover"
          priority 
        />
      </div>
    </div>
  );
}