import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ui/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURED_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1626015565611-660c912e738c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1559594864-bf674d292533?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1590159763121-7c9ff3149e07?auto=format&fit=crop&q=80&w=800",
];

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // Updated query to filter by is_featured = true
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true) // Only pick featured items
    .limit(4)
    .order("created_at", { ascending: false });

  if (error || !products || products.length === 0) {
    // If no featured items exist, we return null or a hidden section 
    // to keep the landing page clean
    return null;
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
              Premium Beard Growth
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-blue-950 tracking-tighter uppercase leading-none">
              Top Picks
            </h3>
            <p className="mt-4 text-gray-500 text-lg font-medium leading-relaxed">
              Our most recommended kits for consistent results. Verified original 
              Kirkland Signature Signature products with local GH support.
            </p>
          </div>
          
          <Link 
            href="/shop" 
            className="group flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            Full Catalog
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                // Ensures image_url is pulled correctly regardless of naming convention
                image_url: product.product_image_url || product.image_url || FEATURED_PLACEHOLDERS[index % 4]
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}