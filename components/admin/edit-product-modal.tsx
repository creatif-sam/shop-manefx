"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, CheckCircle, Loader2, Info, BookOpen, Package, Tag, Upload, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";

export function EditProductModal({ product, onClose, onSuccess }: any) {
  const [form, setForm] = useState({ 
    name: product.name, 
    price: product.price, 
    description: product.description || "",
    product_image_url: product.product_image_url,
    stock_quantity: product.stock_quantity || 0,
    authenticity_info: product.authenticity_info || "",
    usage_instructions: product.usage_instructions || "",
    category: product.category || "Beard Care"
  });
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 1. Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setForm({ ...form, product_image_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from("products")
      .update({
        ...form,
        price: parseFloat(form.price.toString()),
        stock_quantity: parseInt(form.stock_quantity.toString())
      })
      .eq("id", product.id);

    if (!error) {
      toast.success("Inventory updated");
      onSuccess();
    } else {
      toast.error(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-blue-950/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }} 
        className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-8 pb-4 text-blue-950">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Modify Item</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update visual and data assets</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full text-gray-400">
            <X size={20}/>
          </button>
        </div>

        {/* SCROLLABLE FORM */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6 scrollbar-hide">
          
          {/* IMAGE UPLOAD SLOT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Product Media</label>
            <div className="relative group aspect-video w-full rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center">
              {form.product_image_url ? (
                <>
                  <Image src={form.product_image_url} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label className="cursor-pointer bg-white text-blue-950 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Upload size={14} /> Change Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                     </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400">
                  {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={40} strokeWidth={1} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {/* DATA FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1"><Tag size={12} className="inline mr-1"/> Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1"><Package size={12} className="inline mr-1"/> Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100 appearance-none">
                <option value="Beard Care">Beard Care</option>
                <option value="Growth Kits">Growth Kits</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Price (GHS)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Stock</label>
              <input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1"><Info size={12} className="inline mr-1"/> Authenticity</label>
            <textarea rows={2} value={form.authenticity_info} onChange={e => setForm({...form, authenticity_info: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1"><BookOpen size={12} className="inline mr-1"/> Instructions</label>
            <textarea rows={3} value={form.usage_instructions} onChange={e => setForm({...form, usage_instructions: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 resize-none"/>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 pt-4">
          <button 
            onClick={handleUpdate} 
            disabled={submitting || uploading} 
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Update Inventory</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}