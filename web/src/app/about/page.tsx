import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 text-center md:px-8 md:py-20">
      <Image
        src="/brand/logo.png"
        alt=""
        width={140}
        height={140}
        className="mx-auto h-28 w-28 rounded-full"
      />
      <h1 className="serif mt-6 text-4xl font-semibold lowercase text-navy md:text-5xl">
        rooster
      </h1>
      <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-orange">
        Cafe &amp; Dine
      </p>
      <p className="script mt-6 text-3xl text-orange">
        A place to eat, sip &amp; play
      </p>
      <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-muted">
        We&apos;re a Koramangala cafe serving coffee, Italian, Chinese and Indian
        favourites — plus snooker for when you want to stay a little longer.
        Thanks for being part of our journey.
      </p>
      <p className="mt-6 font-sans text-sm text-navy">{siteConfig.location}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/menu" className="btn-primary">
          Menu
        </Link>
        <Link href="/review" className="btn-orange">
          Review us
        </Link>
      </div>
    </main>
  );
}
