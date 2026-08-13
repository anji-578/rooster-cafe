"use client";

import { motion } from "framer-motion";

export function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      aria-hidden={!visible}
    >
      <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-navy/50">
        Scroll
      </span>
      <span className="relative h-12 w-px overflow-hidden bg-navy/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-navy"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
