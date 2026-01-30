"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, GripVertical, Play, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function HeroManager() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchSlides = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("order_index");
    if (data) setSlides(data);
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const deleteSlide = async (id: string) => {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Slide removed");
      fetchSlides();
    }
  };

  if (loading) return <Loader2 className="animate-spin text-blue-600 mx-auto" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">Active Slides</h3>
        <button className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
          + Add New Slide
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white border border-gray-100 p-4 rounded-[2rem] flex items-center gap-6 group">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
              {slide.media_type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-yellow-500">
                  <Play size={24} fill="currentColor" />
                </div>
              ) : (
                <Image src={slide.media_url} alt="" fill className="object-cover" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{slide.badge_text || "No Badge"}</span>
              <h4 className="font-black text-blue-950 truncate uppercase tracking-tighter">{slide.title}</h4>
              <p className="text-xs text-gray-400 font-medium truncate">{slide.subtitle}</p>
            </div>

            <button 
              onClick={() => deleteSlide(slide.id)}
              className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        
        {slides.length === 0 && (
          <div className="py-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300">
            <ImageIcon size={40} className="mb-2 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest">No slides configured</p>
          </div>
        )}
      </div>
    </div>
  );
}