"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const moments = [
  {
    title: "Morning coffee",
    copy: "The first pour. Soft light. A quiet beginning.",
    src: "/images/morning.jpg",
  },
  {
    title: "Lunch",
    copy: "Midday ease. Plates shared. Time that stretches.",
    src: "/images/lunch.jpg",
  },
  {
    title: "Evening conversations",
    copy: "Voices lower. Stories linger. Tables turn into rooms.",
    src: "/images/evening.jpg",
  },
  {
    title: "Dinner",
    copy: "Slow evenings. Honest flavours. The day, completed.",
    src: "/images/dinner.jpg",
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const panels = gsap.utils.toArray<HTMLElement>(".exp-panel");

      panels.forEach((panel, i) => {
        gsap.set(panel, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 1.04,
          filter: i === 0 ? "blur(0px)" : "blur(12px)",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * moments.length}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prev = panels[i - 1];
        tl.to(
          prev,
          {
            opacity: 0,
            scale: 0.98,
            filter: "blur(8px)",
            duration: 1,
            ease: "power2.inOut",
          },
          i
        ).to(
          panel,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.inOut",
          },
          i
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative h-[100svh] overflow-hidden bg-white"
      aria-label="The ROOSTER experience"
    >
      {moments.map((m, i) => (
        <div
          key={m.title}
          className="exp-panel absolute inset-0 flex flex-col will-change-transform"
        >
          <div className="relative min-h-0 flex-1">
            <Image
              src={m.src}
              alt={m.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
          <div className="shrink-0 bg-white px-6 py-10 md:px-16 md:py-14">
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.4em] text-navy/40">
              Experience
            </p>
            <h3 className="serif text-4xl font-medium text-navy md:text-6xl lg:text-7xl">
              {m.title}
            </h3>
            <p className="mt-4 max-w-md font-sans text-base font-light leading-relaxed text-navy/65 md:text-lg">
              {m.copy}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
