"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  UserPlus, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
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

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <div className="flex justify-center mb-1">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <UserPlus size={24} strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">
              Create <span className="text-blue-600">Account</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Join the Growth Community
            </p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Email Address
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

            {/* Password Field */}
            <div className="grid gap-1.5">
             <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Create Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold text-sm focus-visible:ring-2 focus-visible:ring-blue-100 transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Repeat Password Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="repeat-password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Confirm Password
              </Label>
              <Input
                id="repeat-password"
                type={showPassword ? "text" : "password"}
                required
                className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold text-sm focus-visible:ring-2 focus-visible:ring-blue-100 transition-all"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100 animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight size={14} strokeWidth={3} />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Already a member?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-black hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="mt-8 flex flex-col items-center gap-3 opacity-30">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-blue-900" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-900">
            Secure Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
}