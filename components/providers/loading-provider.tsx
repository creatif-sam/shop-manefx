"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BeardLoader } from "@/components/ui/beard-loader";

function LoadingListener({ setLoading }: { setLoading: (val: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the route changes, stop the loader
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  return null;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <LoadingListener setLoading={setIsLoading} />
      </Suspense>
      {isLoading && <BeardLoader />}
      {children}
    </>
  );
}