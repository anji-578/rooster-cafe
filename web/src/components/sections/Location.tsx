"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Location() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      ref={ref}
      className="relative bg-white px-6 py-28 md:px-10 md:py-40"
      id="location"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 40, filter: "blur(8px)" }
          }
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-8 font-sans text-[10px] uppercase tracking-[0.4em] text-navy/40">
            Location
          </p>
          <h2 className="serif text-5xl font-medium tracking-tight text-navy md:text-6xl lg:text-7xl">
            Find us
          </h2>
          <div className="mt-10 space-y-2 font-sans text-base font-light leading-relaxed text-navy/75 md:text-lg">
            <p>Koramangala 1A Block</p>
            <p>Bangalore</p>
          </div>
          <p className="mt-12 serif text-3xl italic text-gold md:text-4xl">
            Opening Soon
          </p>
        </motion.div>

        <motion.div
          className="relative aspect-[4/3] overflow-hidden border border-navy/10 bg-white"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={
            inView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.96 }
          }
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Minimal stylized map — no clutter */}
          <iframe
            title="ROOSTER Cafe & Dine — Koramangala 1A Block, Bangalore"
            src="https://maps.google.com/maps?q=Koramangala%201A%20Block%20Bangalore&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 h-full w-full grayscale contrast-125 opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 border border-white/40" />
        </motion.div>
      </div>
    </section>
  );
}
