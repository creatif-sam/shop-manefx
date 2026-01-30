"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ui/product-card";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RecentProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecent() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_new", true) 
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchRecent();
  }, [supabase]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-[0.4em]">
              <Sparkles className="w-4 h-4" />
              Fresh Batches
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-blue-950 uppercase tracking-tighter leading-none">
              New <span className="text-blue-600">Arrivals</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl">
              The latest authentic shipments from Kirkland Signature, 
              now available for same-day dispatch in Accra.
            </p>
          </div>

          <Link 
            href="/shop" 
            className="group flex items-center gap-3 bg-white border border-gray-100 px-8 py-4 rounded-2xl text-blue-950 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            Explore Catalog 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {products.map((product, index) => {
            const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
            const isOutOfStock = product.stock_quantity === 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* DYNAMIC STOCK BADGE - Pushed down to top-14 */}
                {(isLowStock || isOutOfStock) && (
                  <div className={`absolute top-14 left-4 z-30 px-3 py-1.5 rounded-xl border backdrop-blur-md flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-lg ${
                    isOutOfStock 
                    ? "bg-red-500/90 text-white border-red-400" 
                    : "bg-amber-400/90 text-blue-950 border-amber-300"
                  }`}>
                    {isOutOfStock ? "Sold Out" : <><AlertCircle size={12} /> Low Stock</>}
                  </div>
                )}

                <ProductCard 
                  product={{
                    ...product,
                    image_url: product.product_image_url || product.image_url
                  }} 
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}