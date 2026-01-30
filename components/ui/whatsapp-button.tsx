"use client";

import { MessageCircle } from "lucide-react";

interface WhatsappButtonProps {
  phoneNumber: string; // e.g., "+233535023614"
  message?: string;
}

export function WhatsappButton({ 
  phoneNumber, 
  message = "Hello shop!ManeF/x, I have a question about the Kirkland Minoxidil kits." 
}: WhatsappButtonProps) {
  
  const handleChat = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-2">
      {/* Dynamic Label - disappears on scroll or small screens if you want */}
      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] font-black text-blue-950 uppercase tracking-widest">Chat Support</p>
      </div>

      <button
        onClick={handleChat}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] transition-all hover:scale-110 hover:rotate-6 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-white" />
        
        {/* Pulse Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-4 border-[#25D366]"></span>
        </span>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
      </button>
    </div>
  );
}