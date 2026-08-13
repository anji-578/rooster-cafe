"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/snooker", label: "Snooker" },
  { href: "/shop", label: "Shop" },
  { href: "/review", label: "Reviews" },
  { href: "/contact", label: "Visit" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/mark.png"
            alt=""
            width={48}
            height={48}
            className="h-11 w-11 rounded-full ring-1 ring-navy/10"
            priority
          />
          <div className="leading-none">
            <p className="font-sans text-[1.35rem] font-bold tracking-tight text-navy md:text-[1.5rem]">
              Rooster
            </p>
            <p className="mt-1 font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-orange">
              Cafe &amp; Dine
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative font-sans text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-navy" : "text-navy/45 hover:text-navy"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-orange" />
                )}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="rounded-full bg-navy px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
          >
            Bag{itemCount > 0 ? ` · ${itemCount}` : ""}
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/cart"
            className="rounded-full bg-navy px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
          >
            Bag{itemCount > 0 ? ` · ${itemCount}` : ""}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-white"
          >
            <span className="block h-0.5 w-4 bg-navy" />
            <span className="block h-0.5 w-3 bg-navy" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-navy/70"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
