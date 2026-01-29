"use client";

import { useRouter } from "next/navigation";

const categories = [
  { label: "All Products", id: "all" },
  { label: "Full Kits", id: "Kits" },
  { label: "Single Bottles", id: "Single" },
  { label: "Accessories", id: "Accessories" },
];

export default function ShopFilters({ currentCategory }: { currentCategory: string }) {
  const router = useRouter();

  return (
    <div className="space-y-8 sticky top-24">
      <div>
        <h3 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] mb-6">
          Categories
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/shop?category=${cat.id}`)}
              className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                currentCategory === cat.id
                  ? "bg-blue-900 text-white shadow-lg shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gold-50 rounded-2xl border border-gold-100">
        <h4 className="text-[10px] font-black text-gold-700 uppercase tracking-widest mb-2">
          Quality Check
        </h4>
        <p className="text-xs text-gold-800 leading-relaxed font-medium">
          Every shipment includes a batch-specific certificate of analysis. 
          Scan the QR code on your box to verify.
        </p>
      </div>
    </div>
  );
}