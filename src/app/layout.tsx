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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
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
