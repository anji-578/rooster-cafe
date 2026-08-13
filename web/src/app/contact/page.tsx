import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-14">
      <Link href="/" className="text-sm font-semibold">
        ← Rooster
      </Link>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight">Visit</h1>
      <p className="mt-4 text-[#777]">
        {siteConfig.locationLine1}
        <br />
        {siteConfig.locationLine2}
      </p>
      <a
        href={siteConfig.instagramUrl}
        className="mt-4 inline-block text-sm font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {siteConfig.instagramHandle}
      </a>
      <div className="relative mt-10 min-h-[280px] overflow-hidden rounded-3xl bg-white">
        <iframe
          title="Rooster map"
          src="https://maps.google.com/maps?q=Wipro%20Park%20Koramangala%201A%20Block%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    </main>
  );
}
