import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.roostercafe.in"),
  title: {
    default: "Rooster",
    template: "%s | Rooster",
  },
  description:
    "Rooster Cafe & Dine — Mediterranean vibes, great food, and good company in Koramangala.",
  openGraph: {
    title: "Rooster",
    description: "Food, drinks, and blue-sky vibes in Koramangala.",
    url: "https://www.roostercafe.in",
    siteName: "Rooster",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B6F9A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-[#F7FBFD] text-[#0E3A52] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
