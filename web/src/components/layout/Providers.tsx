"use client";

import { CartProvider } from "@/context/CartContext";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const appHome = pathname === "/";
  const cafeOps =
    pathname.startsWith("/t/") ||
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/pos") ||
    pathname.startsWith("/admin");
  const review = pathname.startsWith("/review");
  const bare = appHome || review || cafeOps;

  const body = (
    <CartProvider>
      {!bare && <SiteHeader />}
      {children}
      {!bare && <SiteFooter />}
    </CartProvider>
  );

  // App home uses wheel to switch dishes — skip Lenis there
  if (appHome || review) return body;

  return <SmoothScroll>{body}</SmoothScroll>;
}
