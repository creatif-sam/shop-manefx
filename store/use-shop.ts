import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  product_image_url?: string | null; // Support for admin schema
  quantity: number;
}

interface ShopState {
  wishlist: any[]; // Changed from wishlistIds: string[]
  cart: CartItem[];
  toggleWishlist: (product: any) => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      wishlist: [],
      cart: [],

      toggleWishlist: (product) =>
        set((state) => {
          const isExist = state.wishlist.find((item) => item.id === product.id);
          
          if (isExist) {
            toast.info("Removed from wishlist");
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id),
            };
          } else {
            toast.success("Added to wishlist");
            return {
              wishlist: [...state.wishlist, product],
            };
          }
        }),

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          toast.success(`${product.name} added to bag`);
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          ),
        })),

      removeFromCart: (id) =>
        set((state) => {
          toast.error("Item removed from bag");
          return {
            cart: state.cart.filter((item) => item.id !== id),
          };
        }),

      clearCart: () => set({ cart: [] }),
    }),
    { 
      name: 'shop-storage',
      // Ensure we only persist client-side
      skipHydration: false 
    }
  )
);