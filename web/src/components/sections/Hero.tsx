"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PalmLogo } from "@/components/logo/PalmLogo";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 200),
      window.setTimeout(() => setPhase(2), 2200),
      window.setTimeout(() => setPhase(3), 3200),
      window.setTimeout(() => setPhase(4), 4200),
      window.setTimeout(() => setPhase(5), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              key="logo"
              className="mb-10 md:mb-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease }}
            >
              <PalmLogo className="mx-auto h-28 w-24 md:h-36 md:w-32" animate />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-hidden">
          <motion.h1
            className="serif text-[clamp(3.5rem,14vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.02em] text-navy"
            initial={{ y: "100%", opacity: 0, filter: "blur(12px)" }}
            animate={
              phase >= 2
                ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                : { y: "100%", opacity: 0, filter: "blur(12px)" }
            }
            transition={{ duration: 1.1, ease }}
          >
            ROOSTER
          </motion.h1>
        </div>

        <motion.div
          className="mt-4 flex items-center gap-4 md:mt-6 md:gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={
            phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.9, ease }}
        >
          <span className="hidden h-px w-10 bg-gold sm:block md:w-16" />
          <p className="font-sans text-[11px] uppercase tracking-[0.42em] text-navy md:text-xs">
            Cafe &amp; Dine
          </p>
          <span className="hidden h-px w-10 bg-gold sm:block md:w-16" />
        </motion.div>

        <motion.div
          className="mt-10 md:mt-14"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            phase >= 4
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{ duration: 1, ease }}
        >
          <p className="serif text-2xl font-normal italic leading-relaxed text-navy/80 md:text-3xl lg:text-4xl">
            Made with Soul.
            <br />
            Served with Love.
          </p>
        </motion.div>
      </div>

      <ScrollIndicator visible={phase >= 5} />
    </section>
  );
}
