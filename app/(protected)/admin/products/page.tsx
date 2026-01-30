"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, Tag, Trash2, Loader2, Edit3, Package, 
  Star, Sparkles, AlertTriangle, Search, Filter 
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Modals
import { AddProductModal } from "@/components/admin/add-product-modal";
import { EditProductModal } from "@/components/admin/edit-product-modal";
import { PromoModal } from "@/components/admin/promo-modal";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Quick Toggle (Featured / New)
  const toggleStatus = async (id: string, field: "is_featured" | "is_new", currentValue: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: !currentValue })
      .eq("id", id);

    if (!error) {
      toast.success("Status updated");
      // Update local state immediately for snappy UI
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !currentValue } : p));
    } else {
      toast.error("Failed to update status");
    }
  };

  // Filter Logic
  useEffect(() => {
    let result = products;
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (stockFilter === "low") result = result.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5);
    else if (stockFilter === "out") result = result.filter(p => p.stock_quantity === 0);
    setFilteredProducts(result);
  }, [searchQuery, stockFilter, products]);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter">Inventory</h2>
          <p className="text-gray-400 text-xs md:text-sm font-medium">Manage stock and storefront visibility.</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="bg-blue-600 text-white w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={18} strokeWidth={3} /> New Product
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search products..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold text-blue-950 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f} onClick={() => setStockFilter(f)}
              className={cn(
                "px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                stockFilter === f ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-gray-100 text-gray-400 hover:border-blue-200"
              )}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
              <th className="px-8 py-6">Product</th>
              <th className="px-6 py-6">Featured</th>
              <th className="px-6 py-6">Arrival</th>
              <th className="px-6 py-6">Stock</th>
              <th className="px-6 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border bg-gray-50">
                    <Image src={product.product_image_url || "/placeholder.jpg"} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-blue-950 text-sm truncate block max-w-[200px]">{product.name}</span>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">GHS {product.price}</p>
                  </div>
                </td>

                {/* FEATURED TOGGLE */}
                <td className="px-6 py-5">
                  <button 
                    onClick={() => toggleStatus(product.id, "is_featured", product.is_featured)}
                    className={cn(
                      "p-3 rounded-2xl transition-all border",
                      product.is_featured ? "bg-yellow-50 border-yellow-200 text-yellow-500 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-300 hover:border-yellow-200"
                    )}
                  >
                    <Star size={18} className={product.is_featured ? "fill-current" : ""} />
                  </button>
                </td>

                {/* NEW ARRIVAL TOGGLE */}
                <td className="px-6 py-5">
                  <button 
                    onClick={() => toggleStatus(product.id, "is_new", product.is_new)}
                    className={cn(
                      "p-3 rounded-2xl transition-all border",
                      product.is_new ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-300 hover:border-blue-200"
                    )}
                  >
                    <Sparkles size={18} />
                  </button>
                </td>

                <td className="px-6 py-5">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase",
                    product.stock_quantity <= 5 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    <Package size={12} /> {product.stock_quantity} Units
                  </div>
                </td>

                <td className="px-6 py-5 text-right flex justify-end gap-2">
                  <button onClick={() => setEditingProduct(product)} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => { if(confirm("Delete?")) fetchData(); }} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border">
                <Image src={product.product_image_url || "/placeholder.jpg"} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-blue-950 uppercase text-sm leading-tight mb-1">{product.name}</h4>
                <p className="font-black text-blue-600 text-xs">GHS {product.price}</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => toggleStatus(product.id, "is_featured", product.is_featured)}
                    className={cn("px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase flex items-center gap-1", product.is_featured ? "bg-yellow-50 border-yellow-200 text-yellow-600" : "bg-gray-50 text-gray-400")}
                  >
                    <Star size={10} fill={product.is_featured ? "currentColor" : "none"} /> Featured
                  </button>
                  <button 
                    onClick={() => toggleStatus(product.id, "is_new", product.is_new)}
                    className={cn("px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase flex items-center gap-1", product.is_new ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 text-gray-400")}
                  >
                    <Sparkles size={10} /> New
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProduct(product)} className="flex-1 bg-gray-50 py-3 rounded-xl font-black text-[10px] uppercase text-blue-950">Edit Item</button>
              <button className="flex-1 bg-red-50 py-3 rounded-xl font-black text-[10px] uppercase text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingProduct && <AddProductModal onClose={() => setIsAddingProduct(false)} onSuccess={() => { fetchData(); setIsAddingProduct(false); }} />}
        {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={() => { fetchData(); setEditingProduct(null); }} />}
      </AnimatePresence>
    </div>
  );
}