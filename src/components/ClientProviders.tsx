"use client";

import LenisProvider from "@/components/ui/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <ErrorBoundary>
        <main className="pt-16 flex-1 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
      </ErrorBoundary>
    </LenisProvider>
  );
}
