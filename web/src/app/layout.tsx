import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.roostercafe.in"),
  title: {
    default: "Rooster",
    template: "%s | Rooster",
  },
  description: "Rooster — food, drinks, and good vibes in Koramangala.",
  openGraph: {
    title: "Rooster",
    description: "Scroll through our most loved dishes.",
    url: "https://www.roostercafe.in",
    siteName: "Rooster",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#ececec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="bg-[#ececec] text-[#222] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
