import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Your bag",
};

export default function CartPage() {
  return (
    <main>
      <CartView />
    </main>
  );
}
