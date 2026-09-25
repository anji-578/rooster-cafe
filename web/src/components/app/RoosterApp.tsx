"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/lib/dishes";
import { siteConfig } from "@/lib/site";

const foodDishes = dishes.filter((d) => d.category === "food");
const drinkDishes = dishes.filter((d) => d.category === "drinks");

export function RoosterApp() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  useEffect(() => {
    if (paused || foodDishes.length === 0) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % foodDishes.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, [paused]);

  const selectDish = (index: number) => {
    setActive(index);
    setPaused(true);
  };

  const featured = foodDishes[active] ?? foodDishes[0];

  return (
    <div className="min-h-[100svh] overflow-x-hidden bg-foam text-ink">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(14,58,82,0.45)]"
          >
            Rooster
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/90 md:flex">
            <a href="#plates" className="transition hover:text-white">
              Plates
            </a>
            <a href="#drinks" className="transition hover:text-white">
              Drinks
            </a>
            <a href="#space" className="transition hover:text-white">
              The space
            </a>
            <a href="#visit" className="transition hover:text-white">
              Visit
            </a>
            <Link href="/menu" className="transition hover:text-white">
              Full menu
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.whatsappUrl}
              className="hidden rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-deep sm:inline-flex"
            >
              Book a table
            </a>
            <button
              type="button"
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-white" />
              <span className="mt-1.5 block h-0.5 w-3.5 bg-white" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-white/15 bg-sky-deep/95 px-5 py-5 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium text-white">
              <a href="#plates" onClick={() => setMenuOpen(false)}>
                Plates
              </a>
              <a href="#drinks" onClick={() => setMenuOpen(false)}>
                Drinks
              </a>
              <a href="#space" onClick={() => setMenuOpen(false)}>
                The space
              </a>
              <a href="#visit" onClick={() => setMenuOpen(false)}>
                Visit
              </a>
              <Link href="/menu" onClick={() => setMenuOpen(false)}>
                Full menu
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero — brand + one line + CTA on full-bleed cafe */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/food/cafe-interior.jpg"
            alt="Rooster Cafe dining room"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E3A52]/80 via-[#0E3A52]/28 to-[#0E3A52]/35" />
        </motion.div>

        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-6xl"
          >
            <p className="font-display text-[clamp(3.8rem,14vw,9rem)] font-bold leading-[0.88] tracking-[-0.03em] text-white">
              Rooster
            </p>
            <p className="mt-5 max-w-md text-lg font-medium leading-snug text-white/90 md:text-xl">
              {siteConfig.tagline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#plates" className="btn-sky bg-white text-sky-deep hover:bg-foam">
                See the plates
              </a>
              <a href="#visit" className="btn-ghost-light">
                Find us
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55"
        >
          Scroll
        </motion.div>
      </section>

      {/* Interactive signature plates */}
      <section id="plates" className="marble-wash relative py-20 md:py-28">
        <div className="sky-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center md:gap-14 md:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-deep">
              Signature plates
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              Made to order.
              <br />
              <span className="text-sky-deep">Worth the wait.</span>
            </h2>

            <div className="mt-10 space-y-2">
              {foodDishes.map((dish, i) => (
                <button
                  key={dish.id}
                  type="button"
                  onClick={() => selectDish(i)}
                  className={`group relative flex w-full items-center justify-between border-b border-navy/10 py-3.5 text-left transition ${
                    i === active ? "opacity-100" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  {i === active && (
                    <motion.span
                      layoutId="plate-accent"
                      className="absolute -left-3 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-sky-deep md:-left-4"
                    />
                  )}
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-xl font-semibold text-navy md:text-2xl">
                      {dish.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-deep">
                      {dish.tag}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-navy/70">{dish.price}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                aria-label="Previous dish"
                onClick={() =>
                  selectDish((active - 1 + foodDishes.length) % foodDishes.length)
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-sky-deep hover:text-sky-deep"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next dish"
                onClick={() => selectDish((active + 1) % foodDishes.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-sky-deep hover:text-sky-deep"
              >
                →
              </button>
              <Link href="/menu" className="btn-sky ml-2">
                Full menu
              </Link>
            </div>
          </div>

          <div
            className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent p-6 pt-24">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    {featured.tag}
                  </p>
                  <p className="font-display mt-1 text-2xl font-bold text-white">
                    {featured.name}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                    {featured.blurb}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute right-4 top-4 flex flex-col gap-1.5">
              {foodDishes.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  aria-label={`Show ${d.name}`}
                  onClick={() => selectDish(i)}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === active ? "scale-125 bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Drinks strip */}
      <section id="drinks" className="bg-navy py-20 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky">
                Cold pours
              </p>
              <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Shakes, mojitos &amp; iced classics
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/65">
              Tall glasses, marble light, and drinks that cool the Koramangala
              afternoon.
            </p>
          </div>

          <div className="mt-12 flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {drinkDishes.map((drink, i) => (
              <motion.article
                key={drink.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="group relative h-[420px] w-[280px] shrink-0 overflow-hidden sm:w-[300px]"
              >
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky">
                    {drink.price}
                  </p>
                  <p className="font-display mt-1 text-2xl font-bold">{drink.name}</p>
                  <p className="mt-1 text-sm text-white/70">{drink.blurb}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* The space */}
      <section id="space" className="relative overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[70svh]">
            <Image
              src="/food/cafe-dining.jpg"
              alt="Rooster cafe seating"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center bg-[#E8F4FA] px-8 py-16 md:px-14 md:py-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-deep">
                The space
              </p>
              <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
                A little Santorini
                <br />
                in the city.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                Teal ceilings, white lattice chairs, hanging vines, and
                afternoon light. Come for the plates — stay for the mood.
              </p>
              <ul className="mt-8 space-y-3 text-sm font-medium text-navy/80">
                <li>— Italian, Chinese &amp; Indian favourites</li>
                <li>— Cold coffees, shakes &amp; mojitos</li>
                <li>— Snooker for long evenings</li>
              </ul>
              <Link href="/snooker" className="btn-sky mt-10 inline-flex">
                Snooker details
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu mosaic */}
      <section className="bg-foam py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-12 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-deep">
              From the kitchen
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              A taste of the menu
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {foodDishes.slice(0, 8).map((dish, i) => (
              <motion.a
                key={dish.id}
                href="/menu"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
                className={`group relative overflow-hidden ${
                  i === 0 || i === 5 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                }`}
              >
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-90 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg font-bold text-white md:text-xl">
                    {dish.name}
                  </p>
                  <p className="text-xs text-white/75">{dish.price}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section
        id="visit"
        className="relative overflow-hidden bg-sky-deep py-20 text-white md:py-28"
      >
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-sky/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
              Visit
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Koramangala
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              {siteConfig.locationLine1}
              <br />
              {siteConfig.locationLine2}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={siteConfig.whatsappUrl} className="btn-sky bg-white text-sky-deep">
                WhatsApp us
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-light"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 border-t border-white/15 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Hours
              </p>
              <p className="mt-2 text-base text-white/85">
                Open daily · Ask us for today&apos;s timing
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Also on site
              </p>
              <p className="mt-2 text-base text-white/85">
                Snooker table · Group tables · Feedback rewards
              </p>
            </div>
            <Link
              href="/review"
              className="text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              Leave a review →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-navy/10 bg-foam px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="font-display text-xl font-bold text-navy">Rooster</p>
          <p>© {new Date().getFullYear()} Rooster Cafe &amp; Dine · Koramangala</p>
          <div className="flex gap-5">
            <Link href="/kitchen" className="hover:text-navy">
              Kitchen
            </Link>
            <Link href="/pos" className="hover:text-navy">
              POS
            </Link>
            <Link href="/admin" className="hover:text-navy">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
