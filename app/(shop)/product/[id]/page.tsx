import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/shop/Image-gallery";
import ProductActions from "@/components/shop/Product-actions";
import { CheckBadgeIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/solid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <ImageGallery 
            mainImage={product.image_url || "/placeholder-product.jpg"} 
            name={product.name} 
          />

          {/* Right: Details */}
          <div className="flex flex-col">
            <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Shop / {product.category} / <span className="text-blue-600">{product.name}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black text-blue-950 uppercase tracking-tighter leading-none mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <p className="text-4xl font-black text-blue-700 tracking-tight">
                GHS {product.price.toFixed(2)}
              </p>
              <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                In Stock & Authentic
              </span>
            </div>

            <p className="text-gray-600 font-medium leading-relaxed mb-10 text-lg border-l-4 border-blue-100 pl-6 italic">
              {product.description || "Achieve the beard you've always wanted with our original Kirkland kits. Results-driven grooming for the modern man."}
            </p>

            <ProductActions product={product} />

            {/* Verification Features */}
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                <CheckBadgeIcon className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Serial Verification</h4>
                  <p className="text-xs text-blue-700 mt-1 font-medium">Every bottle includes a unique batch code for authenticity check.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}