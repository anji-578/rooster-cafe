"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Dish } from "@/lib/dishes";

export function PlateVisual({
  dish,
  size = "lg",
}: {
  dish: Dish;
  size?: "lg" | "sm";
}) {
  const dim =
    size === "lg"
      ? "h-[min(58vw,340px)] w-[min(58vw,340px)] md:h-[380px] md:w-[380px]"
      : "h-14 w-14";

  return (
    <motion.div
      key={dish.id + size}
      className={`relative overflow-hidden rounded-full bg-white shadow-[0_20px_50px_rgba(30,74,140,0.18)] ring-4 ring-white ${dim}`}
      initial={size === "lg" ? { scale: 0.88, rotate: -6, opacity: 0 } : false}
      animate={size === "lg" ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes={size === "lg" ? "380px" : "56px"}
        className="object-cover"
        priority={size === "lg"}
      />
    </motion.div>
  );
}
