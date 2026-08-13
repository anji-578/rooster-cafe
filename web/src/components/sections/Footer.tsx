"use client";

import { PalmLogo } from "@/components/logo/PalmLogo";

export function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-white px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-12 md:flex-row md:items-end">
        <div>
          <PalmLogo className="h-16 w-14" animate={false} />
          <p className="serif mt-6 text-3xl font-medium tracking-tight text-navy md:text-4xl">
            ROOSTER
          </p>
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.35em] text-navy/50">
            Cafe &amp; Dine
          </p>
        </div>

        <div className="flex flex-col gap-6 font-sans text-sm font-light text-navy/70 md:flex-row md:gap-16">
          <a
            href="/review?src=site"
            className="transition-opacity hover:opacity-100 opacity-70"
          >
            Feedback
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-100 opacity-70"
          >
            Instagram
          </a>
          <a
            href="mailto:hello@roostercafe.in"
            className="transition-opacity hover:opacity-100 opacity-70"
          >
            Contact
          </a>
          <a
            href="#location"
            className="transition-opacity hover:opacity-100 opacity-70"
          >
            Location
          </a>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-2 border-t border-navy/8 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-xs font-light text-navy/40">
          © {new Date().getFullYear()} ROOSTER Cafe &amp; Dine
        </p>
        <p className="font-sans text-xs font-light italic text-navy/40">
          Made with Soul. Served with Love.
        </p>
      </div>
    </footer>
  );
}
