"use client";

import { CheckCircle, Truck, Package, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils"; // Add this line at the top with other imports

export default function OrderDetails({ params }: { params: { id: string } }) {
  // Logic to fetch specific order by ID would go here
  
  const steps = [
    { label: "Confirmed", date: "Jan 28", icon: CheckCircle, active: true },
    { label: "Processing", date: "Jan 29", icon: Package, active: true },
    { label: "On the way", date: "Expected Today", icon: Truck, active: false },
    { label: "Delivered", date: "Soon", icon: MapPin, active: false },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter leading-none">Order Tracking</h2>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-2">ID: #{params.id.slice(0, 12)}</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
            <Clock className="text-blue-600" size={18} />
            <span className="text-xs font-black text-blue-900 uppercase">Est. Arrival: Today</span>
          </div>
        </div>

        {/* PROGRESS TIMELINE */}
        <div className="mt-16 relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 hidden md:block" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-4",
                  step.active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-300"
                )}>
                  <step.icon size={16} />
                </div>
                <p className={cn("text-[10px] font-black uppercase tracking-widest", step.active ? "text-blue-950" : "text-gray-400")}>{step.label}</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ITEMS SUMMARY & DELIVERY ADDRESS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-6 border-b border-gray-50 pb-4">Delivery Address</h4>
          <p className="text-sm font-bold text-blue-950 leading-relaxed">
            East Legon, Accra<br />
            Opposite the Shell Filling Station<br />
            +233 55 123 4567
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-6 border-b border-gray-50 pb-4">Order Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase">Subtotal</span>
              <span className="text-blue-950">GH₵820.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase">Delivery</span>
              <span className="text-blue-950">GH₵30.00</span>
            </div>
            <div className="flex justify-between text-base font-black border-t border-gray-50 pt-3">
              <span className="text-blue-950 uppercase">Total</span>
              <span className="text-blue-600 tracking-tighter font-black">GH₵850.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}