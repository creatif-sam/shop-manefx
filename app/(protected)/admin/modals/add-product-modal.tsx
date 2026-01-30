"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Upload, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Kits",
    image_url: "",
    description: ""
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("products").insert([
      {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image_url: form.image_url,
        description: form.description,
      },
    ]);

    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert("Error adding product: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-blue-950/20 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">New Inventory</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Add a new product to shop!ManeF/x</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Product Name</label>
              <input 
                required
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="e.g. Kirkland 3-Month Kit"
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Price (GHS)</label>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="450.00"
                onChange={(e) => setForm({...form, price: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Category</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                onChange={(e) => setForm({...form, category: e.target.value})}
              >
                <option value="Kits">Full Kits</option>
                <option value="Single">Single Bottles</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Image URL</label>
              <input 
                required
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-100 transition-all text-blue-600 underline"
                placeholder="https://image-link.com/photo.jpg"
                onChange={(e) => setForm({...form, image_url: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Product Description</label>
            <textarea 
              rows={3}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-medium text-sm focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Describe the product benefits and authenticity proof..."
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              type="submit"
              className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Publish Product</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}