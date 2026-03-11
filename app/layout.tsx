import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Momentum Tyres — Premium Tyres New Zealand",
    template: "%s | Momentum Tyres",
  },
  description:
    "Momentum Tyres — New Zealand's trusted tyre distributor. Premium passenger, SUV, truck and off-road tyres. Authorised dealer network across NZ.",
  keywords: ["tyres", "tires", "New Zealand", "NZ", "passenger tyres", "truck tyres", "SUV tyres", "momentum tyres"],
  authors: [{ name: "Momentum Tyres", url: "https://momentumtyres.co.nz" }],
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://momentumtyres.co.nz",
    siteName: "Momentum Tyres",
    title: "Momentum Tyres — Premium Tyres New Zealand",
    description: "New Zealand's trusted tyre distributor. Premium performance and commercial tyres.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ" className={inter.variable}>
      <body className="antialiased min-h-screen bg-white text-brand-navy font-sans">
        {children}
      </body>
    </html>
  );
}
