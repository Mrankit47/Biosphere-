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
        <main style={{ paddingTop: "64px", flex: 1 }}>
          <PageTransition>{children}</PageTransition>
        </main>
      </ErrorBoundary>
    </LenisProvider>
  );
}
