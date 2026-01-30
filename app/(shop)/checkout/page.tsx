"use client";

import { useState } from "react";
import { useShopStore } from "@/store/use-shop";
import { createClient } from "@/lib/supabase/client";
import { 
  Lock, 
  Truck, 
  CreditCard, 
  Smartphone, 
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart } = useShopStore();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Accra",
  });

  const supabase = createClient();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 30; // Standard Accra delivery
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create Order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        customer_name: form.name,
        phone_number: form.phone,
        delivery_address: `${form.address}, ${form.city}`,
        total_amount: total,
        status: "pending"
      }])
      .select()
      .single();

    if (orderError) {
      alert("Checkout Error. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Insert Order Items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    await supabase.from("order_items").insert(orderItems);

    // 3. Trigger Payment (Logic for Paystack/Flutterwave would go here)
    // For now, we simulate a successful payment for the flow
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Order Received!</h1>
          <p className="text-gray-500 font-medium">We've received your request. A ManeF/x agent will call you shortly to confirm delivery to {form.city}.</p>
          <Link href="/shop" className="block w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Delivery Details Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Checkout</h1>
            <p className="text-gray-400 font-medium mt-1 text-sm">Secure your growth kit in a few steps.</p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
                <Truck className="w-4 h-4" /> 1. Delivery Information
              </h2>
              
              <div className="space-y-4">
                <input required placeholder="Full Name" className="w-full bg-gray-50 border-none p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100" onChange={e => setForm({...form, name: e.target.value})} />
                <input required type="tel" placeholder="MTN / MoMo Number (054...)" className="w-full bg-gray-50 border-none p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100" onChange={e => setForm({...form, phone: e.target.value})} />
                <textarea required placeholder="House No, Street Name, Landmark" className="w-full bg-gray-50 border-none p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100" rows={3} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> 2. Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-blue-600 bg-blue-50 p-4 rounded-2xl flex flex-col items-center gap-2">
                  <Smartphone className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase">Mobile Money</span>
                </div>
                <div className="border-2 border-gray-100 p-4 rounded-2xl flex flex-col items-center gap-2 opacity-50">
                  <CreditCard className="text-gray-400" />
                  <span className="text-[10px] font-black uppercase text-gray-400">Card</span>
                </div>
              </div>
            </div>

            <button disabled={loading || cart.length === 0} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <>Pay GHS {total.toFixed(2)} <ChevronRight size={18} /></>}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-blue-950 text-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <Lock size={120} />
            </div>
            
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-white/10 overflow-hidden border border-white/10">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-tight">{item.name}</p>
                    <p className="text-[10px] font-black text-blue-400 uppercase">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black italic">GHS {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Subtotal</span>
                <span>GHS {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Delivery (Accra)</span>
                <span>GHS {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-2 text-gold-500">
                <span>Total</span>
                <span>GHS {total}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-green-50 rounded-2xl border border-green-100">
            <Lock className="w-4 h-4 text-green-600" />
            <p className="text-[10px] font-black uppercase text-green-700">Encrypted Secure Checkout</p>
          </div>
        </div>
      </div>
    </main>
  );
}