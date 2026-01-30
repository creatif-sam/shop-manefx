"use client";

import { useState } from "react";
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  MousePointerClick, 
  Ticket, 
  MoreHorizontal,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

const promoCodes = [
  { id: 1, code: "AKWAABA20", discount: "20%", usage: 45, status: "Active", expiry: "Feb 15, 2026", revenue: "GHS 4,200" },
  { id: 2, code: "BEARDGANG", discount: "GHS 50 OFF", usage: 128, status: "Active", expiry: "No Expiry", revenue: "GHS 12,800" },
  { id: 3, code: "FLASH50", discount: "50%", usage: 12, status: "Expired", expiry: "Jan 01, 2026", revenue: "GHS 850" },
];

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">
            <Flame size={14} className="fill-current text-orange-500" />
            Revenue Growth Engine
          </div>
          <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter">
            Promo <span className="text-blue-600">Codes</span>
          </h1>
        </div>
        
        <Button className="rounded-2xl bg-blue-600 h-14 px-8 font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          <Plus size={18} strokeWidth={3} /> Create New Coupon
        </Button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {promoCodes.map((promo) => (
          <div key={promo.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50">
            
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              promo.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {promo.status}
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600">
                <Ticket size={24} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-blue-950 tracking-tighter uppercase">{promo.code}</h3>
                <p className="text-sm font-bold text-blue-600">{promo.discount} Discount</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Revenue</p>
                  <p className="text-sm font-black text-blue-950">{promo.revenue}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Times Used</p>
                  <p className="text-sm font-black text-blue-950">{promo.usage}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Expires: {promo.expiry}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-blue-600 rounded-xl">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Create Card Placeholder */}
        <button className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 p-8 text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-all bg-gray-50/30 group">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Setup New Campaign</span>
        </button>
      </div>
    </div>
  );
}