"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("manefx-wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (product: any) => {
    const isExist = wishlist.find((item) => item.id === product.id);
    let updated;
    
    if (isExist) {
      updated = wishlist.filter((item) => item.id !== product.id);
      toast.info("Removed from wishlist");
    } else {
      updated = [...wishlist, product];
      toast.success("Added to wishlist");
    }
    
    setWishlist(updated);
    localStorage.setItem("manefx-wishlist", JSON.stringify(updated));
  };

  return { wishlist, toggleWishlist, isInWishlist: (id: string) => wishlist.some(i => i.id === id) };
}