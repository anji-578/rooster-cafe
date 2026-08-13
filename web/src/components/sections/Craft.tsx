"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/ui/RevealText";

gsap.registerPlugin(ScrollTrigger);

export function Craft() {
  const sectionRef = useRef<HTMLElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        coffeeRef.current,
        { x: "-18%", opacity: 0, scale: 0.96, filter: "blur(10px)" },
        {
          x: "0%",
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            scrub: 1.2,
          },
        }
      );

      gsap.fromTo(
        foodRef.current,
        { x: "18%", opacity: 0, scale: 0.96, filter: "blur(10px)" },
        {
          x: "0%",
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "top 15%",
            scrub: 1.2,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white px-6 py-28 md:px-10 md:py-40 lg:py-52"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
        <div
          ref={coffeeRef}
          className="relative aspect-[4/5] overflow-hidden lg:col-span-5 will-change-transform"
        >
          <Image
            src="/images/espresso.jpg"
            alt="Freshly poured espresso at ROOSTER Cafe"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
            priority={false}
          />
        </div>

        <div className="flex flex-col justify-center lg:col-span-2 lg:px-2">
          <RevealText
            as="h2"
            className="serif text-3xl leading-tight text-navy md:text-4xl lg:text-[2.4rem] lg:leading-[1.15]"
          >
            Coffee crafted with care. Food made with soul. Everything served with love.
          </RevealText>
        </div>

        <div
          ref={foodRef}
          className="relative aspect-[4/5] overflow-hidden lg:col-span-5 will-change-transform"
        >
          <Image
            src="/images/food.jpg"
            alt="Honest, vibrant food plated with care"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
