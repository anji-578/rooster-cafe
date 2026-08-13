"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        {product.badge && (
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-orange">
            {product.badge}
          </p>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="serif mt-1 text-2xl text-navy">{product.name}</h3>
        </Link>
        <p className="mt-1 font-sans text-sm text-muted">{product.subtitle}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-sans text-sm font-medium text-navy">
            {formatPrice(product.price)}
            <span className="font-normal text-muted"> · {product.weight}</span>
          </p>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-orange"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
