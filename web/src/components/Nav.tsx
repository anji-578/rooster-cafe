"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function Nav() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setCompact(y > 80);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10"
      animate={{
        backgroundColor: compact ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        borderBottomColor: compact ? "rgba(18,58,109,0.08)" : "rgba(18,58,109,0)",
      }}
      style={{ borderBottomWidth: 1 }}
      transition={{ duration: 0.35 }}
    >
      <a href="#top" className="font-sans text-[10px] uppercase tracking-[0.35em] text-navy">
        ROOSTER
      </a>
      <nav className="hidden items-center gap-10 md:flex">
        {[
          { href: "#signature", label: "Menu" },
          { href: "#experience", label: "Experience" },
          { href: "#location", label: "Visit" },
          { href: "/review?src=site", label: "Review" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-sans text-[10px] uppercase tracking-[0.28em] text-navy/55 transition-colors hover:text-navy"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a
        href="/review?src=site"
        className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold"
      >
        Feedback
      </a>
    </motion.header>
  );
}
