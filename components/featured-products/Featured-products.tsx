import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ui/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Remote images for featured kits to populate the site immediately
const FEATURED_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1626015565611-660c912e738c?auto=format&fit=crop&q=80&w=800", // Single Bottle
  "https://images.unsplash.com/photo-1559594864-bf674d292533?auto=format&fit=crop&q=80&w=800", // Kit with roller
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800", // 6-Month Supply
  "https://images.unsplash.com/photo-1590159763121-7c9ff3149e07?auto=format&fit=crop&q=80&w=800", // Beard Oil/Serum
];

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // Fetching the top 4 products
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(4)
    .order("created_at", { ascending: false });

  if (error || !products || products.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">Add products to your Supabase dashboard to see them here.</p>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-3">
              Premium Beard Growth
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tighter">
              Featured Kits
            </h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Verified original Kirkland Signature Minoxidil. We provide the authenticity 
              proof and local support you need for your growth journey.
            </p>
          </div>
          
          <Link 
            href="/shop" 
            className="group flex items-center gap-2 text-blue-800 font-bold hover:text-blue-600 transition-all border-b-2 border-transparent hover:border-blue-600 pb-1"
          >
            Explore Full Shop
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                // Use placeholder if image_url is missing in database
                image_url: product.image_url || FEATURED_PLACEHOLDERS[index % 4]
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}