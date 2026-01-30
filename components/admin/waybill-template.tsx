"use client";

import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function WaybillTemplate({ order }: { order: any }) {
  return (
    <div id={`waybill-${order.id}`} className="hidden print:block p-10 bg-white text-black font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-blue-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-900">shop!ManeF/x</h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Original Kirkland Minoxidil • Ghana</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black uppercase">Order ID</p>
          <p className="text-lg font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Customer Details</h3>
          <p className="text-lg font-black">{order.customer_name}</p>
          <p className="text-md font-bold text-blue-800">{order.phone_number}</p>
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Delivery Address</h3>
          <p className="text-sm font-medium leading-relaxed">{order.delivery_address}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-gray-100 text-left">
            <th className="py-3 text-[10px] font-black uppercase">Product Item</th>
            <th className="py-3 text-[10px] font-black uppercase text-center">Qty</th>
            <th className="py-3 text-[10px] font-black uppercase text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="py-4 font-bold text-sm">{item.products.name}</td>
              <td className="py-4 text-center font-bold text-sm">{item.quantity}</td>
              <td className="py-4 text-right font-bold text-sm">GHS {item.price_at_purchase}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="py-6 text-right font-black uppercase text-xs">Total Amount Paid</td>
            <td className="py-6 text-right font-black text-xl text-blue-900">GHS {order.total_amount}</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer / Authenticity Stamp */}
      <div className="flex justify-between items-center border-t-2 border-gray-100 pt-8 mt-20">
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-2xl border border-blue-100">
          <CheckBadgeIcon className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-[10px] font-black uppercase text-blue-900 leading-none">Verified Authentic</p>
            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Kirkland Signature Batch Verified</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-gray-400">Thank you for choosing</p>
          <p className="text-sm font-black text-blue-950 uppercase italic">Your Growth Journey Starts Here</p>
        </div>
      </div>
    </div>
  );
}