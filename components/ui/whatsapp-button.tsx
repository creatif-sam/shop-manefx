"use client";

import { MessageCircle } from "lucide-react";

interface WhatsappButtonProps {
  message?: string;
}

export function WhatsappButton({ 
  message = "Hello shop!ManeF/x, I have a question about the Kirkland Minoxidil kits." 
}: WhatsappButtonProps) {
  
  // Your specific WhatsApp number
  const phoneNumber = "+233535023614";

  const handleChat = () => {
    // Strips any non-numerical characters to ensure it works globally
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-3 group">
      {/* Label - Desktop only hover state */}
      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden md:block">
        <p className="text-[9px] font-black text-blue-950 uppercase tracking-widest whitespace-nowrap">Chat with us</p>
      </div>

      <button
        onClick={handleChat}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 active:scale-90"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 fill-white" />
        
        {/* Pulse Notification */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[#25D366]"></span>
        </span>
      </button>
    </div>
  );
}