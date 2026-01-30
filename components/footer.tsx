import Link from "next/link";
import { Twitter, Instagram, MessageCircle } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 mb-16">
          
          {/* Column 1: COMPANY */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">About Us</Link>
              <Link href="/subscribe" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Subscribe</Link>
              <Link href="/contact" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Contact Us</Link>
              <Link href="/events" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Adverse events</Link>
            </nav>
          </div>

          {/* Column 2: SHOP */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">Shop</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/shop" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">All Products</Link>
              <Link href="/shop?filter=bestsellers" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Bestsellers</Link>
              <Link href="/shop?filter=category" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">By Category</Link>
              <Link href="/shop?filter=concern" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Beard Concern</Link>
            </nav>
          </div>

          {/* Column 3: CUSTOMER CARE */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">Customer Care</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/faq" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">FAQ</Link>
              <Link href="/shipping" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Shipping</Link>
              <Link href="/returns" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Returns</Link>
              <Link href="/privacy" className="text-[14px] font-medium text-gray-500 hover:text-blue-600 transition-colors">Privacy</Link>
            </nav>
          </div>

          {/* Column 4: BRAND INFO & LOGO */}
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1 pt-8 md:pt-0 border-t border-gray-50 md:border-none relative">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[11px] font-black text-blue-950 uppercase tracking-widest mb-2">shop!ManeF/x Inc.</h4>
                <address className="not-italic text-[13px] text-gray-500 font-medium leading-relaxed">
                  Reginald Osei Gyasi<br />
                  Mpohor, Ghana <br />
                  <Link href="tel:+233535023614" className="text-blue-600 font-bold hover:underline">+233 53 502 3614</Link>
                </address>
              </div>
              
              {/* Circular Logo - Adjusted for mobile visibility */}
              <div className="w-12 h-12 border-2 border-blue-950 rounded-full flex items-center justify-center text-[9px] font-black leading-tight text-center shrink-0">
                MANE<br/>F/X
              </div>
            </div>
            
            <button className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all w-full md:w-fit shadow-lg shadow-blue-100">
              <span className="text-white">❤</span> Follow on shop
            </button>
          </div>
        </div>

        {/* Bottom Bar: Socials and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-8 text-gray-400">
            <Link href="https://twitter.com" className="hover:text-blue-600 transition-colors"><Twitter size={22} /></Link>
            <Link href="https://instagram.com" className="hover:text-blue-600 transition-colors"><Instagram size={22} /></Link>
            <Link href="https://wa.me/233535023614" className="hover:text-emerald-500 transition-colors"><MessageCircle size={22} /></Link> 
            <Link href="https://snapchat.com" className="hover:text-amber-400 transition-colors font-black text-[12px] uppercase tracking-tighter">SnapChat</Link> 
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">
              © 2026 - shop!ManeF/x 
            </p>
            <p className="text-[9px] text-gray-300 font-medium mt-1 uppercase">
              Powered by Gen116 Consult
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}