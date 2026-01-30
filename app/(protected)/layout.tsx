import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, boot them to the sign-in page
  if (!user) {
    return redirect("/auth/login");
  }

  // Return children WITHOUT any sidebar or nav
  // The Admin sidebar lives only in app/(protected)/admin/layout.tsx
  return <>{children}</>;
}