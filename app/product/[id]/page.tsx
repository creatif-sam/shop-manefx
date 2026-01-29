import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/shop/image-gallery";
import ProductActions from "@/components/shop/product-actions";
import { CheckBadgeIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/solid";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery (Matching Reference style) */}
          <div className="space-y-4">
            <ImageGallery 
              mainImage={product.image_url || "/placeholder-product.jpg"} 
              name={product.name} 
            />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Breadcrumbs */}
            <nav className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Home / {product.category} / <span className="text-blue-900">{product.name}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-black text-blue-950 uppercase tracking-tighter leading-none mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <p className="text-3xl font-black text-blue-700 tracking-tight">
                GHS {product.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-700 uppercase">In Stock</span>
              </div>
            </div>

            {/* Product Summary */}
            <p className="text-gray-600 font-medium leading-relaxed mb-10 text-lg">
              {product.description || "Start your beard journey with our premium, verified authentic Kirkland Signature Minoxidil. Formulated for maximum follicle stimulation and consistency."}
            </p>

            {/* Add to Cart & Counter */}
            <ProductActions product={product} />

            {/* Trust Signals (Core for shop!ManeF/x) */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
                <CheckBadgeIcon className="w-6 h-6 text-gold-500 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
                <TruckIcon className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">Accra Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
                <ShieldCheckIcon className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">Growth Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}