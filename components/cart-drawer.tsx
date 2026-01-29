"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useShopStore } from "@/store/use-shop";
import Image from "next/image";

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity } = useShopStore();
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-300" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Your Bag</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
              </p>
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </Dialog.Close>
          </div>

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <p className="text-gray-500 font-bold uppercase text-sm tracking-widest">Your cart is empty</p>
                <Dialog.Close className="text-blue-600 font-black text-xs underline uppercase decoration-2 underline-offset-4">
                  Go Shopping
                </Dialog.Close>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-6 items-start group">
                  <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image 
                      src={item.image_url || "/placeholder-product.jpg"} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-lg font-black text-blue-900 mt-1">
                      GHS {item.price.toFixed(2)}
                    </p>
                    
                    {/* Numeric Counter Section */}
                    <div className="flex items-center justify-between mt-4 bg-gray-50 rounded-lg p-1 w-fit border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-sm font-black text-blue-900 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout Section */}
          {cart.length > 0 && (
            <div className="p-8 border-t border-gray-100 bg-white space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                <span className="text-3xl font-black text-blue-900 tracking-tighter">
                  GHS {subtotal.toFixed(2)}
                </span>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]">
                Secure Checkout
              </button>

              <div className="flex items-center justify-center gap-2 py-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Authentic Kirkland Support Available
                </p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}