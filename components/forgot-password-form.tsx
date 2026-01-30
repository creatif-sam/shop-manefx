"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  KeyRound, 
  MailCheck, 
  Loader2, 
  ArrowLeft, 
  SendHorizontal 
} from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000", className)} {...props}>
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.1)] border border-gray-100 relative overflow-hidden">
        
        {/* Top Brand Stripe */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />

        {success ? (
          <div className="flex flex-col gap-6 text-center py-4 animate-in zoom-in-95 duration-500">
            <div className="flex justify-center mb-2">
              <div className="bg-green-50 p-4 rounded-3xl text-green-600">
                <MailCheck size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Check Your Email</h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Instructions have been sent to <span className="text-blue-600 font-bold">{email}</span>. Please follow the link to reset your password.
              </p>
            </div>
            <Link href="/auth/login" className="mt-4 inline-flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <div className="flex justify-center mb-1">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <KeyRound size={24} strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">
                Reset <span className="text-blue-600">Access</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Secure Password Recovery
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Registered Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold text-sm focus-visible:ring-2 focus-visible:ring-blue-100 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <span className="flex items-center gap-2">
                    Send Reset Link <SendHorizontal size={14} strokeWidth={3} />
                  </span>
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Remembered it?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-black hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center opacity-30">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-900 text-center">
            shop!ManeF/x Ghana 
         </p>
      </div>
    </div>
  );
}