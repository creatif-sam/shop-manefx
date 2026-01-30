"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, CheckCircle, Loader2, Upload, Package, Info } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function AddProductModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    category: "Beard Care", 
    description: "", 
    stock_quantity: "0" 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please upload a product image.");
    
    setSubmitting(true);
    try {
      // 1. Upload Image to 'product-images' bucket
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 2. Insert using your exact Schema Column Names
      const { error: dbError } = await supabase.from("products").insert([{
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        product_image_url: publicUrl, // Matched to your schema
        stock_quantity: parseInt(form.stock_quantity),
        category: form.category,
      }]);

      if (dbError) throw dbError;

      toast.success("Product added to catalog!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-blue-950/40 backdrop-blur-md">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-y-auto max-h-[95vh]"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Add to Inventory</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={20}/></button>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* IMAGE UPLOAD */}
          <label className="relative block w-full h-44 rounded-[2rem] border-2 border-dashed border-blue-100 bg-blue-50/30 overflow-hidden cursor-pointer group">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-blue-400 gap-2">
                <Upload size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest">Upload Product Photo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Product Name</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3.5 font-bold text-blue-950" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3.5 font-bold text-gray-600">
                <option value="Beard Care">Beard Care</option>
                <option value="Kits">Kits</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Price (GHS)</label>
              <input type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3.5 font-black text-blue-600" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Stock Quantity</label>
              <input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3.5 font-bold text-blue-950" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3.5 font-medium text-sm text-gray-600 resize-none" placeholder="Enter product details..." />
          </div>

          <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Save Product</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}