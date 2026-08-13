import type { Metadata } from "next";
import Link from "next/link";
import { OfferingIcon } from "@/components/brand/OfferingIcon";

export const metadata: Metadata = {
  title: "Snooker",
  description:
    "Play snooker at rooster Cafe & Dine, Koramangala — food, coffee, and a frame with friends.",
};

export default function SnookerPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white text-navy">
        <OfferingIcon id="snooker" className="h-8 w-8" />
      </div>
      <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-navy/40">
        Snooker
      </p>
      <h1 className="serif mt-3 text-4xl font-semibold text-navy md:text-5xl">
        Eat. Play. Stay awhile.
      </h1>
      <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-muted">
        Pull up a cue between courses. rooster is where good food meets a
        friendly frame — perfect for evenings with friends.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Casual tables",
            copy: "Book a slot or walk in when free.",
          },
          {
            title: "Food on the side",
            copy: "Order coffee, Chinese, Italian or Indian while you play.",
          },
          {
            title: "Groups welcome",
            copy: "Hangouts, after-work frames, weekend chill.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-line bg-white/80 p-6"
          >
            <h2 className="serif text-xl text-navy">{card.title}</h2>
            <p className="mt-2 font-sans text-sm text-muted">{card.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-line bg-white px-6 py-10 text-center md:px-10">
        <p className="script text-3xl text-orange">See you at the table</p>
        <p className="mt-3 font-sans text-sm text-muted">
          Ask our team for table availability when you visit.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-primary">
            Find us
          </Link>
          <Link href="/menu" className="btn-ghost">
            View menu
          </Link>
        </div>
      </div>
    </main>
  );
}
