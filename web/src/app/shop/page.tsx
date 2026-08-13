"use client";

import { useMemo, useState } from "react";
import { products, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

const filters: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee" },
  { id: "pickles", label: "Pickles" },
];

export default function ShopPage() {
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const list = useMemo(
    () =>
      filter === "all" ? products : products.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-navy/40">
        Shop
      </p>
      <h1 className="serif mt-3 text-4xl font-semibold text-navy md:text-5xl">
        Take the taste home
      </h1>
      <p className="mt-4 max-w-xl font-sans text-sm text-muted">
        Premium coffee beans and homemade pickles — simple packs from rooster.
      </p>

      <div className="mt-10 flex gap-5 border-b border-line pb-4">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`font-sans text-[11px] font-semibold uppercase tracking-[0.2em] ${
              filter === f.id ? "text-orange" : "text-navy/35"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
