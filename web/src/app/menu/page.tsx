import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { dishes } from "@/lib/dishes";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Coffee, Italian, Chinese and Indian favourites at Rooster Cafe & Dine, Koramangala.",
};

const sections = [
  {
    id: "italian",
    title: "Italian",
    intro: "Pastas and comfort classics, plated fresh.",
    tags: ["Italian"],
  },
  {
    id: "chinese",
    title: "Chinese",
    intro: "Wok heat, big flavour, made to share.",
    tags: ["Chinese", "Combos", "Starters"],
  },
  {
    id: "indian",
    title: "Indian & Maggi",
    intro: "Homestyle gravy, soft roti, and loaded Maggi.",
    tags: ["Indian", "Maggi"],
  },
  {
    id: "drinks",
    title: "Drinks",
    intro: "Cold pours for warm Bengaluru afternoons.",
    tags: ["Drinks"],
  },
] as const;

export default function MenuPage() {
  return (
    <main className="min-h-[100svh] bg-foam text-ink">
      <header className="border-b border-navy/10 bg-sky-deep text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Rooster
          </Link>
          <Link
            href="/#visit"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85"
          >
            Visit us
          </Link>
        </div>
      </header>

      <div className="relative h-[42svh] min-h-[280px] overflow-hidden">
        <Image
          src="/food/cafe-interior.jpg"
          alt="Rooster Cafe"
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foam via-[#0E3A52]/25 to-[#0E3A52]/45" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-10 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
            Full menu
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Something for every mood
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-wrap gap-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="border border-navy/15 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy transition hover:border-sky-deep hover:text-sky-deep"
            >
              {s.title}
            </a>
          ))}
          <Link
            href="/snooker"
            className="border border-sky-deep/30 bg-sky/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-deep"
          >
            Snooker
          </Link>
        </div>

        <div className="mt-14 space-y-20">
          {sections.map((section) => {
            const items = dishes.filter((d) =>
              section.tags.some((t) => d.tag === t),
            );
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {section.intro}
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group relative aspect-[4/5] overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width:640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky">
                          {item.price}
                        </p>
                        <p className="font-display mt-1 text-xl font-bold text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-white/75">{item.blurb}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-20 bg-navy px-6 py-12 text-center text-white md:px-10">
          <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Hungry already?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Visit us in Koramangala — {siteConfig.locationLine1}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={siteConfig.whatsappUrl} className="btn-sky bg-white text-sky-deep">
              WhatsApp us
            </a>
            <Link href="/#visit" className="btn-ghost-light">
              Directions
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
