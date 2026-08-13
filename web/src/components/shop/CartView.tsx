"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, siteConfig } from "@/lib/site";

export function CartView() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();

  function orderOnWhatsApp() {
    if (!items.length) return;
    const lines = items.map(
      (i) =>
        `• ${i.product.name} × ${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`
    );
    const text = [
      `Hi ROOSTER! I'd like to order:`,
      "",
      ...lines,
      "",
      `Total: ${formatPrice(subtotal)}`,
      "",
      "Please confirm availability & pickup/delivery.",
    ].join("\n");

    const url = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center md:px-8">
        <h1 className="serif text-4xl text-navy">Your bag is empty</h1>
        <p className="mt-4 font-sans text-sm text-navy/55">
          Coffee beans and homemade pickles are waiting in the shop.
        </p>
        <Link href="/shop" className="btn-orange mt-10">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="serif text-4xl text-navy md:text-5xl">Your bag</h1>
      <ul className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-4 py-6">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-navy/[0.03]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <Link href={`/shop/${product.slug}`} className="serif text-xl text-navy">
                    {product.name}
                  </Link>
                  <p className="mt-1 font-sans text-xs text-navy/45">
                    {product.weight}
                  </p>
                </div>
                <p className="font-sans text-sm text-navy">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center border border-navy/15">
                  <button
                    type="button"
                    className="px-3 py-1.5"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center font-sans text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/40"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-end justify-between">
        <button
          type="button"
          onClick={clear}
          className="font-sans text-[10px] uppercase tracking-[0.22em] text-navy/40"
        >
          Clear bag
        </button>
        <div className="text-right">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-navy/40">
            Subtotal
          </p>
          <p className="serif mt-1 text-3xl text-navy">{formatPrice(subtotal)}</p>
        </div>
      </div>

      <button type="button" onClick={orderOnWhatsApp} className="btn-orange mt-10 w-full">
        Order on WhatsApp
      </button>
      <p className="mt-4 text-center font-sans text-xs text-navy/45">
        We’ll confirm stock, pickup or delivery, and payment on WhatsApp.
      </p>
    </div>
  );
}
