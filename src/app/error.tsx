"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ds/ErrorState";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootError] Unhandled error:", error);
  }, [error]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[var(--ds-bg-primary)] overflow-hidden px-5 py-20 box-border">
      {/* DNA-ish decorative lines */}
      <div className="absolute left-[15%] top-[10%] w-[2px] h-[80%] bg-[var(--ds-gradient-fade-accent)] rounded-[1px]" />
      <div className="absolute right-[15%] top-[10%] w-[2px] h-[80%] bg-[var(--ds-gradient-fade-accent)] rounded-[1px]" />

      <ErrorState
        icon="🧬"
        title="Oops! Something went wrong"
        description="An unexpected error occurred in the application. Please try reloading or resetting the view."
        errorMessage={error.message}
        onRetry={reset}
        onAction={() => window.location.reload()}
        actionLabel="🔄 Reload Page"
      />
    </div>
  );
}
