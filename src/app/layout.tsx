import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "BioSphere — Interactive Biology Learning",
  description:
    "Explore the wonders of biology through interactive 3D experiences. From cells to ecosystems, BioSphere makes learning biology immersive and fun.",
  keywords: [
    "biology",
    "learning",
    "3D",
    "interactive",
    "cells",
    "DNA",
    "ecosystems",
    "education",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main style={{ paddingTop: "64px", flex: 1 }}>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
