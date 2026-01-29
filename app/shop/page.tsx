import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ui/product-card";
import ShopFilters from "@/components/shop/Shop-filters";
import ShopSearch from "@/components/shop/Shop-search"; 

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const supabase = await createClient();
  const category = searchParams.category;
  const searchQuery = searchParams.q;

  let query = supabase.from("products").select("*");

  // Filter by Category
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  // Filter by Search Input
  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data: products } = await query.order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-blue-900 pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            The Growth Collection
          </h1>
          <p className="text-blue-100 max-w-xl mx-auto font-medium">
            Genuine Kirkland Minoxidil kits curated for the modern Ghanaian man.
          </p>
        </div>
      </div>

      {/* Search Bar - Floating between header and content */}
      <ShopSearch />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <ShopFilters currentCategory={category || "all"} />
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold uppercase tracking-widest">
                  {searchQuery ? `No results for "${searchQuery}"` : "No products found"}
                </p>
                <p className="text-sm text-gray-400 mt-2">Try checking your spelling or selecting a different category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}