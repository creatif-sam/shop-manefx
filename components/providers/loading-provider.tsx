"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BeardLoader } from "@/components/ui/beard-loader";

function LoadingListener({ setLoading }: { setLoading: (val: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This fires AFTER the navigation is finished
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  return null;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // We need to catch the "start" of a navigation.
  // In Next.js, the easiest way is to listen for clicks on <a> tags
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href && !anchor.href.includes("#") && anchor.target !== "_blank") {
        // Only show loader if we are actually leaving the current page
        if (anchor.href !== window.location.href) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <LoadingListener setLoading={setIsLoading} />
      </Suspense>
      
      {/* Ensure your loader has a high z-index and fixed position! */}
      {isLoading && <BeardLoader />}
      
      {children}
    </>
  );
}