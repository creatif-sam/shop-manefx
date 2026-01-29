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
    // Sanitize phone number (remove +, spaces, or dashes)
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleChat}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-2xl transition-all hover:scale-105 hover:bg-[#20ba5a] active:scale-95 sm:px-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 fill-current" />
      <span className="hidden font-bold sm:inline-block">Local Support</span>
      
      {/* Optional: "Online" pulse indicator to build trust */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </button>
  );
}