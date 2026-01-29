import Link from "next/link";
import { Twitter, Instagram, } from "lucide-react"; 





export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          
          {/* Column 1: COMPANY */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">About Us</Link>
              <Link href="/subscribe" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Subscribe Us</Link>
              <Link href="/contact" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Contact Us</Link>
              <Link href="/events" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Adverse events</Link>
            </nav>
          </div>

          {/* Column 2: SHOP */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Shop</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/shop" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">All</Link>
              <Link href="/shop?filter=bestsellers" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Bestsellers</Link>
              <Link href="/shop?filter=category" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">By Category</Link>
              <Link href="/shop?filter=concern" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">By Beard Concern</Link>
              <Link href="/shop?filter=ingredients" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">By Ingredients</Link>
            </nav>
          </div>

          {/* Column 3: CUSTOMER CARE */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer Care</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/faq" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">FAQ</Link>
              <Link href="/shipping" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Shipping Policy</Link>
              <Link href="/returns" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Return Policy</Link>
              <Link href="/privacy" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[14px] text-gray-600 hover:text-blue-900 transition-colors">Terms of Service</Link>
            </nav>
          </div>

          {/* Column 4: BRAND INFO & LOGO */}
          <div className="flex flex-col gap-4 relative">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">shop!ManeF/x Inc.</h4>
            <address className="not-italic text-[14px] text-gray-600 leading-relaxed max-w-[200px]">
              Reginald Osei Gyasi<br />
              Mpohor, Ghana <br />
              {/* Using the phone from your brief */}
              +233 53 502 3614 
            </address>
            
            <button className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-blue-700 transition-all w-fit">
              <span className="text-white">❤</span> Follow on shop
            </button>

            {/* Circular Logo Placeholder */}
            <div className="absolute top-0 right-0 w-12 h-12 border-2 border-black rounded-full flex items-center justify-center text-[10px] font-bold">
              MANE<br/>F/X
            </div>
          </div>
        </div>

        {/* Bottom Bar: Socials and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-8 border-t border-gray-50">
          <div className="flex gap-6 text-gray-400">
            <Link href="https://twitter.com" className="hover:text-black transition-colors"><Twitter size={20} /></Link>
            <Link href="https://instagram.com" className="hover:text-black transition-colors"><Instagram size={20} /></Link>
            <Link href="https://snapchat.com" className="hover:text-black transition-colors font-bold text-[18px]">SnapChat</Link> 
          </div>
          
          <p className="text-[11px] text-gray-400 font-medium">
            © 2026 - shop!ManeF/x Powered by Gen116 Consult 
          </p>
        </div>
      </div>
    </footer>
  );
}