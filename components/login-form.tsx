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
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Redirect to admin dashboard
      router.push("/admin");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-[400px] mx-auto", className)} {...props}>
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 relative overflow-hidden">
        
        {/* Subtle Brand Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-gold-500" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <ShieldCheck size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">
              Welcome <span className="text-blue-600">Back</span>
            </h1>
            <p className="text-balance text-sm font-medium text-gray-400">
              Access your ManeF/x account to manage your growth kit.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-xl bg-gray-50 border-none font-bold text-sm focus-visible:ring-2 focus-visible:ring-blue-100 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-12 rounded-xl bg-gray-50 border-none font-bold text-sm focus-visible:ring-2 focus-visible:ring-blue-100 transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-400">
              New to ManeF/x?{" "}
              <Link
                href="/auth/sign-up"
                className="text-blue-600 font-black hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-8 flex justify-center items-center gap-4 opacity-40 grayscale">
      </div>
    </div>
  );
}