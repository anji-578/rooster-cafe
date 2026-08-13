"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  "Rooster isn't just a name.",
  "It's the beginning of something beautiful.",
  "Fresh food.",
  "Fresh coffee.",
  "Fresh conversations.",
  "Every single day.",
];

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const items = gsap.utils.toArray<HTMLElement>(".phil-line");

      gsap.set(items, { opacity: 0.12, y: 28, filter: "blur(6px)" });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "center 35%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white px-6 py-32 md:px-10 md:py-48 lg:py-56"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-16 font-sans text-[10px] uppercase tracking-[0.4em] text-navy/40 md:mb-24">
          Our Philosophy
        </p>

        <div className="space-y-4 md:space-y-6">
          {lines.map((line, i) => (
            <p
              key={line}
              className={`phil-line serif will-change-transform ${
                i < 2
                  ? "text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[1.1] tracking-tight text-navy"
                  : "text-[clamp(1.6rem,4.5vw,3.2rem)] font-normal leading-[1.2] text-navy/85"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
