"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Interior() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        imageRef.current,
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 36, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=50%",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-white"
      aria-label="Interior"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/blue-cafe.jpg"
          alt="Soft sunlight across a blue and white Mediterranean café interior with plants"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-white px-6 py-12 md:px-16 md:py-16">
        <p
          ref={textRef}
          className="serif max-w-3xl text-4xl font-medium tracking-tight text-navy md:text-6xl lg:text-7xl will-change-transform"
        >
          Your everyday escape.
        </p>
      </div>
    </section>
  );
}
