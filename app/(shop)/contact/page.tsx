"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client"; // Ensure this path matches your project

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Save to Supabase 'contact_messages' table
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      });

    if (error) {
      console.error("Supabase Error:", error);
      toast.error("Could not send message. Please try WhatsApp support!");
    } else {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you shortly.");
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-blue-950 uppercase tracking-tighter leading-none mb-6"
          >
            Get In <span className="text-blue-600">Touch</span>
          </motion.h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Have questions about your beard growth routine or an order? 
            Our specialists are ready to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 bg-gray-50 rounded-[3rem] p-8 md:p-12">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      name="full_name"
                      type="text"
                      className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-blue-950 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      name="email"
                      type="email"
                      className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-blue-950 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subject</label>
                  <select 
                    name="subject"
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-blue-950 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option>Product Inquiry</option>
                    <option>Order Support</option>
                    <option>Wholesale/Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Your Message</label>
                  <textarea 
                    required
                    name="message"
                    rows={5}
                    className="w-full bg-white border-none rounded-3xl px-6 py-5 font-bold text-blue-950 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-blue-950 uppercase">Message Received</h3>
                <p className="text-gray-500 mt-2 font-medium">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest underline underline-offset-4"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Side: Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-[0.3em]">Support Channels</h3>
              
              <div className="flex gap-6 group">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 h-fit">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-black text-blue-950 uppercase text-sm mb-1">WhatsApp Support</h4>
                  <p className="text-gray-500 text-sm font-medium mb-3">Fastest response for order issues.</p>
                  <a href="https://wa.me/233535023614" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Chat Now</a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-400 h-fit">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-black text-blue-950 uppercase text-sm mb-1">Email Us</h4>
                  <p className="text-gray-500 text-sm font-medium mb-1">support@manefx.shop</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated response: 12h</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-400 h-fit">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-black text-blue-950 uppercase text-sm mb-1">HQ Location</h4>
                  <address className="not-italic text-gray-500 text-sm font-medium leading-relaxed">
                    Mpohor, Ghana <br />
                    Western Region
                  </address>
                </div>
              </div>
            </div>

            <div className="bg-blue-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <Clock className="absolute -right-4 -top-4 w-24 h-24 text-white/5" />
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Support Hours</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-blue-100">Mon — Fri</span>
                  <span className="font-black">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-blue-100">Saturday</span>
                  <span className="font-black">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-sm opacity-50">
                  <span className="font-medium text-blue-100">Sunday</span>
                  <span className="font-black">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}