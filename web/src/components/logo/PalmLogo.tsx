"use client";

import { motion } from "framer-motion";

type PalmLogoProps = {
  className?: string;
  animate?: boolean;
};

export function PalmLogo({ className = "", animate = true }: PalmLogoProps) {
  return (
    <motion.svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      initial={animate ? { opacity: 0, scale: 0.92 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Sun */}
      <motion.circle
        cx="60"
        cy="78"
        r="28"
        fill="#F4B43A"
        initial={animate ? { cy: 110, opacity: 0 } : false}
        animate={animate ? { cy: 78, opacity: 1 } : undefined}
        transition={{ duration: 2.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Palm fronds */}
      <motion.g
        fill="#123A6D"
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <path d="M60 95 C58 70 42 48 22 36 C38 48 48 68 52 95 Z" />
        <path d="M60 95 C55 68 38 42 18 28 C36 42 48 65 50 95 Z" />
        <path d="M60 95 C62 68 78 42 98 28 C80 42 68 65 70 95 Z" />
        <path d="M60 95 C62 70 78 48 98 36 C82 48 72 68 68 95 Z" />
        <path d="M60 95 C58 72 50 52 40 38 C50 52 55 72 58 95 Z" />
        <path d="M60 95 C62 72 70 52 80 38 C70 52 65 72 62 95 Z" />
        <rect x="57.5" y="78" width="5" height="28" rx="2" />
      </motion.g>

      {/* Waves */}
      <motion.g
        stroke="#4EA3E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <motion.path
          d="M28 112 Q44 104 60 112 T92 112"
          animate={
            animate
              ? {
                  d: [
                    "M28 112 Q44 104 60 112 T92 112",
                    "M28 112 Q44 118 60 112 T92 112",
                    "M28 112 Q44 104 60 112 T92 112",
                  ],
                }
              : undefined
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M34 120 Q50 114 60 120 T86 120"
          animate={
            animate
              ? {
                  d: [
                    "M34 120 Q50 114 60 120 T86 120",
                    "M34 120 Q50 126 60 120 T86 120",
                    "M34 120 Q50 114 60 120 T86 120",
                  ],
                }
              : undefined
          }
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.path
          d="M40 128 Q52 124 60 128 T80 128"
          animate={
            animate
              ? {
                  d: [
                    "M40 128 Q52 124 60 128 T80 128",
                    "M40 128 Q52 132 60 128 T80 128",
                    "M40 128 Q52 124 60 128 T80 128",
                  ],
                }
              : undefined
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.55,
          }}
        />
      </motion.g>
    </motion.svg>
  );
}
