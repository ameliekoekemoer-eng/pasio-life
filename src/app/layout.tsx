import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display"
});

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pasio.life"),
  title: {
    default: "Pasio Life",
    template: "%s | Pasio Life"
  },
  description:
    "An adventure lifestyle brand: connect with horses, feel freedom, and live the life you dream of.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "https://pasio.life",
    siteName: "Pasio Life",
    title: "Pasio Life",
    description:
      "An adventure lifestyle brand: connect with horses, feel freedom, and live the life you dream of."
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasio Life",
    description:
      "An adventure lifestyle brand: connect with horses, feel freedom, and live the life you dream of."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="font-body min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(255,176,112,0.22),transparent_55%),radial-gradient(900px_500px_at_90%_0%,rgba(118,167,130,0.20),transparent_55%),linear-gradient(180deg,#fbf8f2 0%,#f6efdf 30%,#fbf8f2 100%)] text-ink-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sand-50 focus:px-3 focus:py-2 focus:text-ink-900"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}