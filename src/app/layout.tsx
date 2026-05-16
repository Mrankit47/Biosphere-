import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

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
  openGraph: {
    title: "BioSphere — Interactive Biology Learning",
    description:
      "Explore the wonders of biology through interactive 3D experiences.",
    type: "website",
    siteName: "BioSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioSphere — Interactive Biology Learning",
    description:
      "Explore the wonders of biology through interactive 3D experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
