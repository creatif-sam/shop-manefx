"use client";

import Navbar from "@/components/navbar"; // Adjust path if they are in @/components/ui
import Footer from "@/components/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Imported Shop Navbar */}
      <Navbar />

      {/* Main content for Shop, How It Works, Reviews, etc. */}
      <main className="flex-1">
        {children}
      </main>

      {/* Imported Shop Footer */}
      <Footer />
    </div>
  );
}