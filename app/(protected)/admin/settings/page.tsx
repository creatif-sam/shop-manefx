"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Save, Upload, Loader2, Type, 
  Film, Play, MousePointer2, Eye, X, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const [globalSettings, setGlobalSettings] = useState({
    hero_title: "",
    hero_subtitle: "",
    cta_text: ""
  });

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, slidesRes] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", "hero_config").single(),
        supabase.from("hero_slides").select("*").order("order_index", { ascending: true })
      ]);
      
      if (settingsRes.data) setGlobalSettings({
        hero_title: settingsRes.data.hero_title,
        hero_subtitle: settingsRes.data.hero_subtitle,
        cta_text: settingsRes.data.cta_text
      });
      
      if (slidesRes.data) setSlides(slidesRes.data);
    } catch (err) {
      toast.error("Error syncing settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle media upload for the 3 slots (2 Photos, 1 Video)
  const handleUpdateMedia = async (id: string, file: File, mediaType: string) => {
    setSaving(id);
    try {
      const fileName = `${id}-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("hero_slides")
        .update({ media_url: publicUrl, media_type: mediaType })
        .eq("id", id);

      if (dbError) throw dbError;
      toast.success(`${mediaType} slot updated!`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(null);
    }
  };

  const handleSaveGlobal = async () => {
    setSaving("global");
    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_title: globalSettings.hero_title,
        hero_subtitle: globalSettings.hero_subtitle,
        cta_text: globalSettings.cta_text,
        updated_at: new Date().toISOString()
      })
      .eq("id", "hero_config");

    if (!error) toast.success("Messaging published live!");
    else toast.error("Update failed");
    setSaving(null);
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-6xl space-y-12 pb-20 px-4 md:px-0">
      
      {/* SECTION: SITE MESSAGING (As seen in your screenshot) */}
      <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm relative">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Site Messaging</h2>
            <p className="text-gray-400 font-medium text-sm">Update the primary text shown on the home page.</p>
          </div>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all shadow-sm"
          >
            <Eye size={16} /> Live Preview
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1 flex items-center gap-2">
                <Type size={14} /> Main Title
              </label>
              <input 
                value={globalSettings.hero_title} 
                onChange={e => setGlobalSettings({...globalSettings, hero_title: e.target.value})} 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-blue-950 text-xl focus:ring-2 focus:ring-blue-100 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1 flex items-center gap-2">
                <MousePointer2 size={14} /> Button Text
              </label>
              <input 
                value={globalSettings.cta_text} 
                onChange={e => setGlobalSettings({...globalSettings, cta_text: e.target.value})} 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1 flex items-center gap-2">
              <Type size={14} /> Subtitle / Description
            </label>
            <textarea 
              rows={6} 
              value={globalSettings.hero_subtitle} 
              onChange={e => setGlobalSettings({...globalSettings, hero_subtitle: e.target.value})} 
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-medium text-gray-500 outline-none focus:ring-2 focus:ring-blue-100 resize-none" 
            />
          </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={handleSaveGlobal} 
            disabled={saving === "global"} 
            className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving === "global" ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Global Brand</>}
          </button>
        </div>
      </section>

      {/* SECTION: HERO MEDIA ASSETS (This is where you upload images/videos) */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter px-2">Hero Media Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          {slides.slice(0, 3).map((slide, index) => (
            <div key={slide.id} className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 flex flex-col group">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border-4 border-white shadow-inner">
                {slide.media_type === "video" ? (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-yellow-500 gap-2">
                    <Film size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Instructional Video</span>
                  </div>
                ) : (
                  <Image 
                    src={slide.media_url || "/placeholder.jpg"} 
                    alt="" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                )}
                
                {/* UPLOAD OVERLAY */}
                <label className="absolute inset-0 bg-blue-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
                  <Upload className="text-white mb-2" size={32} />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Slot</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={slide.media_type === "video" ? "video/mp4" : "image/*"} 
                    onChange={e => e.target.files?.[0] && handleUpdateMedia(slide.id, e.target.files[0], slide.media_type)} 
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                  {slide.media_type === "video" ? "Slide 3: Video Slot" : `Slide ${index + 1}: Image Slot`}
                </p>
                {saving === slide.id && <Loader2 className="animate-spin text-blue-600 mx-auto mt-3" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-blue-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video md:aspect-[16/7] bg-[#004d4d] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20"
            >
              <button onClick={() => setShowPreview(false)} className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
                <X size={24} />
              </button>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-none drop-shadow-2xl">
                  {globalSettings.hero_title}
                </h1>
                <p className="text-lg md:text-2xl font-bold text-cyan-300 mb-10 uppercase tracking-[0.2em] drop-shadow-md">
                  {globalSettings.hero_subtitle}
                </p>
                <button className="flex items-center gap-3 bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase shadow-xl">
                  {globalSettings.cta_text} <ChevronRight size={20} />
                </button>
              </div>
              {slides[0]?.media_url && (
                <Image src={slides[0].media_url} alt="" fill className="object-cover -z-20 opacity-60" unoptimized />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}