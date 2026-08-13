"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { dishes } from "@/lib/dishes";
import { PlateVisual } from "@/components/app/PlateVisual";
import { siteConfig } from "@/lib/site";

type Tab = "overview" | "ingredients";

export function RoosterApp() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const dish = dishes[index];

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return dishes.length - 1;
      if (next >= dishes.length) return 0;
      return next;
    });
    setTab("overview");
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-dish-scroll]")) return;
      if (Math.abs(e.deltaY) < 40) return;
      // only when near top interactive stage
      if (window.scrollY > 520) return;
      go(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  return (
    <div className="min-h-[100svh] bg-white text-[#123A6D]">
      {/* Nav — Pixel Café style, blue & white */}
      <header className="sticky top-0 z-50 border-b border-[#123A6D]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-lg font-bold tracking-tight text-[#123A6D]">
            Rooster
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#123A6D]/70 md:flex">
            <a href="#about" className="hover:text-[#123A6D]">About</a>
            <a href="#menu" className="hover:text-[#123A6D]">Menu</a>
            <a href="#signature" className="hover:text-[#123A6D]">Signature</a>
            <a href="#visit" className="hover:text-[#123A6D]">Visit</a>
            <Link href="/review" className="hover:text-[#123A6D]">Reviews</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.whatsappUrl}
              className="rounded-full bg-[#123A6D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Call / WhatsApp
            </a>
            <button
              type="button"
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-[#123A6D]" />
              <span className="mt-1 block h-0.5 w-4 bg-[#123A6D]" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-[#123A6D]/10 px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
              <a href="#signature" onClick={() => setMenuOpen(false)}>Signature</a>
              <a href="#visit" onClick={() => setMenuOpen(false)}>Visit</a>
              <Link href="/review" onClick={() => setMenuOpen(false)}>Reviews</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/dishes/hero.jpg"
            alt="Rooster cafe"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#123A6D]/55" />
        </div>
        <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col items-start justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Koramangala · Bengaluru
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Rooster
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/85">
            Coffee, pizza, pasta, momos &amp; burgers — warm flavours, modern
            comfort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#123A6D]"
            >
              Explore the menu
            </a>
            <a
              href="#visit"
              className="rounded-full border border-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Visit us
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white px-5 py-20 md:px-8" data-no-dish-scroll>
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4EA3E5]">
              About Rooster
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123A6D] md:text-4xl">
              A cosy spot for everyday cravings
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#123A6D]/70">
              Rooster is your neighbourhood café &amp; dine in Koramangala —
              built for morning coffee, late-night momos, pizza nights, and
              everything in between.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-[#123A6D]/80">
              {[
                "Signature coffee, freshly pulled",
                "Italian favourites — pizza & pasta",
                "Momos & burgers made to order",
                "Snooker & hangout vibes",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#4EA3E5]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#E8F3FC]">
            <Image
              src="/dishes/coffee.jpg"
              alt="Rooster coffee"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Menu grid — Pixel style cards */}
      <section id="menu" className="bg-[#F3F8FD] px-5 py-20 md:px-8" data-no-dish-scroll>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4EA3E5]">
              Menu preview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123A6D] md:text-4xl">
              Our signature dishes
            </h2>
            <p className="mt-4 text-[#123A6D]/65">
              Coffee · Pizza · Pasta · Momos · Burger
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(18,58,109,0.08)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-[#123A6D]">
                      {item.name}
                    </h3>
                    <p className="shrink-0 text-sm font-semibold text-[#4EA3E5]">
                      {item.price}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#123A6D]/65">
                    {item.overview}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive signature stage — video-app energy, blue/white */}
      <section id="signature" className="bg-white px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4EA3E5]">
              Signature
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#123A6D] md:text-4xl">
              Scroll through the favourites
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#123A6D]/10 bg-[#F3F8FD] px-4 py-8 shadow-sm md:px-10 md:py-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr_0.95fr]">
              <div className="flex justify-center md:justify-start">
                <AnimatePresence mode="wait">
                  <PlateVisual key={dish.id} dish={dish} size="lg" />
                </AnimatePresence>
              </div>

              <div className="text-center md:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-xs font-medium text-[#123A6D]/50">
                      #{dish.rank} Signature dish
                    </p>
                    <h3 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-[#123A6D] md:text-5xl">
                      {dish.name}
                    </h3>
                    <p className="mt-3 text-sm font-semibold text-[#4EA3E5]">
                      {dish.price}
                    </p>
                    <div className="mt-5 flex justify-center gap-5 text-sm text-[#123A6D]/70 md:justify-start">
                      <a href="#visit">Order food</a>
                      <Link href="/review">Leave review</Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <aside className="mx-auto w-full max-w-xs rounded-3xl bg-white p-5 shadow-[0_16px_40px_rgba(18,58,109,0.1)]">
                <div className="flex gap-4 border-b border-[#123A6D]/10 pb-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setTab("overview")}
                    className={
                      tab === "overview"
                        ? "font-semibold text-[#123A6D]"
                        : "text-[#123A6D]/40"
                    }
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("ingredients")}
                    className={
                      tab === "ingredients"
                        ? "font-semibold text-[#123A6D]"
                        : "text-[#123A6D]/40"
                    }
                  >
                    Ingredients
                  </button>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 rounded-xl bg-[#E8F3FC] px-3 py-2 text-2xl font-bold text-[#123A6D]">
                  {dish.rating.toFixed(1)}
                  <span className="text-base text-[#4EA3E5]">★</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-[#123A6D]">
                  {dish.chef}
                </p>
                <p className="text-xs text-[#123A6D]/45">{dish.chefNote}</p>
                <div className="mt-3 min-h-[72px] text-sm leading-relaxed text-[#123A6D]/70">
                  {tab === "overview" ? (
                    <p>{dish.overview}</p>
                  ) : (
                    <ul className="space-y-1">
                      {dish.ingredients.map((ing) => (
                        <li key={ing}>· {ing}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => go(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-[#123A6D] shadow-sm"
              >
                ‹
              </button>
              <div className="flex gap-4 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {dishes.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIndex(i);
                      setTab("overview");
                    }}
                    className="flex w-[72px] shrink-0 flex-col items-center gap-2"
                  >
                    <div
                      className={`rounded-full p-0.5 ${
                        i === index
                          ? "ring-2 ring-[#123A6D]"
                          : "opacity-70"
                      }`}
                    >
                      <PlateVisual dish={item} size="sm" />
                    </div>
                    <span className="text-center text-[10px] font-medium text-[#123A6D]/70">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Next"
                onClick={() => go(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-[#123A6D] shadow-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="bg-[#123A6D] px-5 py-20 text-white md:px-8" data-no-dish-scroll>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4EA3E5]">
              Visit us
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Find Rooster</h2>
            <div className="mt-8 space-y-5 text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Address
                </p>
                <p className="mt-1">
                  {siteConfig.locationLine1}
                  <br />
                  {siteConfig.locationLine2}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Connect
                </p>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[#A8D4F5]"
                >
                  {siteConfig.instagramHandle}
                </a>
                <a href={siteConfig.whatsappUrl} className="mt-1 block text-[#A8D4F5]">
                  WhatsApp / Call
                </a>
              </div>
            </div>
            <Link
              href="/review"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#123A6D]"
            >
              Leave a review
            </Link>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-white/10">
            <iframe
              title="Rooster location"
              src="https://maps.google.com/maps?q=Wipro%20Park%20Koramangala%201A%20Block%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#123A6D]/10 bg-white px-5 py-8 text-center text-sm text-[#123A6D]/55 md:px-8">
        Rooster © {new Date().getFullYear()} · Koramangala, Bengaluru ·{" "}
        <a href="https://www.roostercafe.in">www.roostercafe.in</a>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/admin" className="text-[#4EA3E5]">
            Admin / QR
          </Link>
          <Link href="/kitchen" className="text-[#4EA3E5]">
            Kitchen
          </Link>
          <Link href="/pos" className="text-[#4EA3E5]">
            POS / Biller
          </Link>
        </div>
      </footer>
    </div>
  );
}
