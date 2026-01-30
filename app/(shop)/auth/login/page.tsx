import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    // min-h-[calc(100vh-200px)] ensures the footer stays at the bottom 
    // even if the login form is short
    <div className="flex min-h-[70vh] w-full items-center justify-center py-20 px-6 bg-[#F9FAFB]">
      <LoginForm />
    </div>
  );
}