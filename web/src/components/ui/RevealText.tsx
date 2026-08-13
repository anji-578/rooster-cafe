"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type RevealTextProps = {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "p",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = children.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
              animate={
                inView
                  ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                  : { y: "110%", opacity: 0, filter: "blur(8px)" }
              }
              transition={{
                duration: 0.9,
                delay: delay + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
