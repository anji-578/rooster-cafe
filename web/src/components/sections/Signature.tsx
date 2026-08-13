"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  {
    src: "/images/dish-1.jpg",
    title: "Golden Stack",
    desc: "Soft clouds of batter, sun-gold honey, quiet mornings.",
  },
  {
    src: "/images/dish-2.jpg",
    title: "Garden Bowl",
    desc: "Crisp greens, honest ingredients, light on the soul.",
  },
  {
    src: "/images/dish-3.jpg",
    title: "Seasonal Plate",
    desc: "What the day offers — plated simply, served warmly.",
  },
  {
    src: "/images/dish-4.jpg",
    title: "All-Day Comfort",
    desc: "Familiar flavours, elevated with care and calm.",
  },
];

export function Signature() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const getScroll = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScroll() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="signature"
      className="relative h-[100svh] overflow-hidden bg-white"
      aria-label="Signature dishes"
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
      >
        {dishes.map((dish, i) => (
          <article
            key={dish.title}
            className="relative flex h-full w-screen shrink-0 flex-col bg-white"
          >
            <div className="relative min-h-0 flex-1">
              <Image
                src={dish.src}
                alt={dish.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            <div className="flex shrink-0 flex-col justify-between gap-6 bg-white px-6 py-8 md:flex-row md:items-end md:px-16 md:py-10">
              <div>
                <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.4em] text-navy/40">
                  {String(i + 1).padStart(2, "0")} — Signature
                </p>
                <h3 className="serif text-4xl font-medium tracking-tight text-navy md:text-6xl">
                  {dish.title}
                </h3>
              </div>
              <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-navy/65 md:text-right md:text-base">
                {dish.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
