"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "@/context/CartContext";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div>
        <Link
          href="/shop"
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-navy/40"
        >
          ← Shop
        </Link>
        {product.badge && (
          <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-orange">
            {product.badge}
          </p>
        )}
        <h1 className="serif mt-3 text-4xl font-semibold text-navy md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 font-sans text-sm text-muted">{product.subtitle}</p>
        <p className="mt-6 font-sans text-lg font-medium text-navy">
          {formatPrice(product.price)}
          <span className="font-normal text-muted"> · {product.weight}</span>
        </p>
        <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        {product.tasteNotes && (
          <div className="mt-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-navy/40">
              Taste notes
            </p>
            <p className="mt-2 font-sans text-sm text-navy">
              {product.tasteNotes.join(" · ")}
            </p>
          </div>
        )}

        {product.roastLevel && (
          <div className="mt-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-navy/40">
              Roast level
            </p>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full border border-navy/30 ${
                    i < product.roastLevel! ? "bg-navy" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {product.details && (
          <dl className="mt-8 space-y-2 border border-navy/10 p-5">
            {Object.entries(product.details).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 font-sans text-sm">
                <dt className="text-navy/40">{k}</dt>
                <dd className="text-right text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-navy/15">
            <button
              type="button"
              aria-label="Decrease"
              className="px-4 py-3 text-navy"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center font-sans text-sm">{qty}</span>
            <button
              type="button"
              aria-label="Increase"
              className="px-4 py-3 text-navy"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>
          <button type="button" onClick={onAdd} className="btn-orange px-8">
            {added ? "Added" : "Add to bag"}
          </button>
          <Link
            href="/cart"
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-navy/50"
          >
            View bag
          </Link>
        </div>
      </div>
    </div>
  );
}
