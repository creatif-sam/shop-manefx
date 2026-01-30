"use client";

import { Suspense } from "react"; // 1. Import Suspense
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// 2. Move the logic that uses searchParams into a sub-component
function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Unsubscribe</h1>
      <p className="text-gray-500">Removing {email} from our list...</p>
      {/* ... your unsubscribe button/logic here ... */}
    </div>
  );
}

// 3. Keep your main page export, but wrap the content in Suspense
export default function UnsubscribePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-blue-600" />
          <p className="text-sm text-gray-400">Loading preference...</p>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </main>
  );
}