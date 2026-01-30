"use client";

import Link from "next/link";
import { MailCheck, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center p-6 md:p-10 bg-[#F9FAFB]">
      <div className="w-full max-w-[450px] animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.1)] border border-gray-100 relative overflow-hidden text-center">
          
          {/* Top Brand Stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
          
          {/* Floating Sparkle Decoration */}
          <Sparkles className="absolute right-6 top-8 text-blue-100 w-12 h-12 -rotate-12" />

          <div className="flex flex-col gap-8">
            {/* Icon Section */}
            <div className="flex justify-center">
              <div className="bg-blue-50 p-6 rounded-[2rem] text-blue-600 relative">
                <MailCheck size={40} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white animate-pulse" />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter leading-none">
                Check Your <span className="text-blue-600">Inbox</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Verification Required
              </p>
              <div className="h-px w-12 bg-blue-100 mx-auto my-4" />
              <p className="text-sm font-medium text-gray-500 leading-relaxed px-4">
                We've sent a secure confirmation link to your email. Click the link to activate your <span className="text-blue-950 font-bold">ManeF/x</span> growth profile.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                asChild
                className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  Go to Login <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </Button>
              
              <Link 
                href="/" 
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Security Footer Badge */}
        <div className="mt-8 flex flex-col items-center gap-3 opacity-30">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-900" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-900">
              Verified Ghanaian Merchant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}