import { createClient } from "@/lib/supabase/server";

import HeroSlider from "@/components/home/Hero-slider";
import ProductCard from "@/components/ui/product-card";
import { WhatsappButton } from "@/components/ui/whatsapp-button";
import FeaturedProducts from "@/components/featured-products/Featured-products";
import Newsletter from "@/components/newsletter";
import PromotionsSection from "@/components/promotions/promotion-section";
import RecentProducts from "@/components/recent-products/recent-products";

export default async function Index() {
  const supabase = await createClient();

  // Fetch products for the shop section
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .limit(4);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* Hero Section: Focused on the core problem (Beard Growth) */}
      <HeroSlider />
      <RecentProducts/>
      <FeaturedProducts/>
      <PromotionsSection/>

      <main className="flex-1 flex flex-col gap-12 max-w-7xl px-4 w-full">
        <section id="shop">
          <h2 className="font-bold text-3xl mb-8 text-center text-blue-900">
            Authentic Kirkland Minoxidil & Kits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Section: Why Shop With Us? */}
        <section className="bg-blue-50 p-8 rounded-2xl border border-gold-200">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Guaranteed Authenticity</h3>
            <p className="text-gray-700">
              We understand the struggle of finding genuine products in Ghana. 
              Every bottle of Kirkland Signature Minoxidil we sell is 100% original.
            </p>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Button [cite: 54, 83] */}
      <WhatsappButton phoneNumber="+233535023614" />

      <Newsletter />
    </div>
  );
}