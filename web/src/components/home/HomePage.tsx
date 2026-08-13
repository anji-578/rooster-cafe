"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { offerings, siteConfig } from "@/lib/site";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { OfferingIcon } from "@/components/brand/OfferingIcon";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <>
      {/* Editorial hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[84svh] max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-12 md:gap-8 md:px-8 md:py-16">
          <motion.div
            className="md:col-span-5"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-orange"
            >
              Koramangala · Bengaluru
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.75 }}
              className="mt-5 font-sans text-5xl font-bold leading-[1.02] tracking-tight text-navy md:text-6xl lg:text-[4.4rem]"
            >
              Good food.
              <br />
              Great vibes.
              <br />
              <span className="text-orange">Stay awhile.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.75 }}
              className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted"
            >
              Coffee, Italian, Chinese, Indian — and a snooker table for when
              the evening stretches. Welcome to Rooster.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.75 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link href="/menu" className="btn-primary">
                View menu
              </Link>
              <Link href="/contact" className="btn-ghost">
                Find us
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.75 }}
              className="mt-10 flex items-center gap-3"
            >
              <Image
                src="/brand/mark.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full ring-1 ring-navy/10"
              />
              <div>
                <p className="font-sans text-sm font-semibold text-navy">
                  Rooster Cafe &amp; Dine
                </p>
                <p className="font-sans text-xs text-muted">
                  {siteConfig.instagramHandle}
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative md:col-span-7"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[5/4]">
              <Image
                src="/brand/hero.jpg"
                alt="Coffee and food at Rooster Cafe"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            {/* Floating badge — refined, not flyer dump */}
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-[0_20px_50px_rgba(21,35,58,0.12)] backdrop-blur md:left-auto md:right-8 md:bottom-8 md:w-56 md:p-5">
              <Image
                src="/brand/logo.png"
                alt="Rooster Cafe & Dine"
                width={160}
                height={160}
                className="mx-auto h-28 w-28 rounded-full md:h-32 md:w-32"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offerings */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-orange">
              The experience
            </p>
            <h2 className="serif mt-3 text-3xl font-semibold text-navy md:text-4xl">
              Five reasons to drop by
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {offerings.map((item, i) => (
              <Link
                key={item.id}
                href={item.href}
                className="group rounded-3xl border border-line bg-paper/80 p-6 transition-all hover:-translate-y-1 hover:border-orange/30 hover:bg-white hover:shadow-[0_16px_40px_rgba(28,77,150,0.08)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-navy transition-colors group-hover:bg-orange group-hover:text-white">
                  <OfferingIcon id={item.id} className="h-6 w-6" />
                </span>
                <p className="mt-5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/35">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-sans text-lg font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                  {item.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story + review */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div className="rounded-[2rem] bg-navy p-8 text-white md:p-12">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
            Our place
          </p>
          <h2 className="serif mt-4 text-3xl font-semibold md:text-4xl">
            A cafe that doesn&apos;t rush you
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-white/70">
            Come for the coffee. Stay for the plates. Challenge friends to a
            frame. Rooster is built for everyday hangouts in the middle of
            Koramangala.
          </p>
          <Link href="/about" className="btn-orange mt-8">
            Our story
          </Link>
        </div>

        <div className="rounded-[2rem] border border-line bg-white p-8 md:p-12">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-orange">
            Reviews
          </p>
          <h2 className="serif mt-4 text-3xl font-semibold text-navy md:text-4xl">
            Enjoyed your visit?
          </h2>
          <p className="script mt-3 text-3xl text-orange">
            Tell us how we did
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
            Your feedback helps us grow — food, service, and everything in
            between. Takes under a minute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/review" className="btn-primary">
              Leave a review
            </Link>
            {siteConfig.googleReviewUrl ? (
              <a
                href={siteConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Google
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="border-t border-line bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-orange">
                Take home
              </p>
              <h2 className="serif mt-3 text-3xl font-semibold text-navy md:text-4xl">
                From our shop
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-navy md:inline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto overflow-hidden rounded-[2rem] border border-line bg-white md:grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-orange">
              Visit
            </p>
            <h2 className="serif mt-3 text-3xl font-semibold text-navy md:text-4xl">
              Near Wipro Park
            </h2>
            <p className="mt-5 font-sans text-base leading-relaxed text-muted">
              {siteConfig.locationLine1}
              <br />
              {siteConfig.locationLine2}
            </p>
            <p className="mt-4 font-sans text-sm font-medium text-navy">
              {siteConfig.instagramHandle}
            </p>
            <Link href="/contact" className="btn-orange mt-8">
              Get directions
            </Link>
          </div>
          <div className="relative min-h-[280px] bg-soft">
            <iframe
              title="Rooster Cafe & Dine map"
              src="https://maps.google.com/maps?q=Wipro%20Park%20Koramangala%201A%20Block%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
