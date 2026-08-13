import type { Metadata } from "next";
import Link from "next/link";
import { OfferingIcon } from "@/components/brand/OfferingIcon";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Coffee, Italian, Chinese and Indian favourites at rooster Cafe & Dine, Koramangala.",
};

const menu = [
  {
    id: "coffee",
    title: "Coffee",
    intro: "Brewed for slow mornings and long conversations.",
    items: [
      { name: "Espresso", note: "Bold & clean" },
      { name: "Cappuccino", note: "Silky foam" },
      { name: "Filter coffee", note: "South Indian classic" },
      { name: "Cold coffee", note: "Chilled & creamy" },
    ],
  },
  {
    id: "italian",
    title: "Italian",
    intro: "Comfort classics — pizzas, pastas, done right.",
    items: [
      { name: "Margherita pizza", note: "Tomato, basil, mozzarella" },
      { name: "Farmhouse pizza", note: "Loaded veggies" },
      { name: "Arrabbiata pasta", note: "Spicy tomato" },
      { name: "Alfredo pasta", note: "Creamy & rich" },
    ],
  },
  {
    id: "chinese",
    title: "Chinese",
    intro: "Wok heat, big flavour, made to share.",
    items: [
      { name: "Veg fried rice", note: "Everyday favourite" },
      { name: "Hakka noodles", note: "Tossed fresh" },
      { name: "Manchurian", note: "Gravy or dry" },
      { name: "Chilli paneer", note: "Spicy classic" },
    ],
  },
  {
    id: "indian",
    title: "Indian",
    intro: "Homestyle plates with heart.",
    items: [
      { name: "Butter chicken / paneer", note: "Creamy & comforting" },
      { name: "Dal tadka", note: "Slow-cooked" },
      { name: "Biryani", note: "Aromatic & filling" },
      { name: "Thali specials", note: "Ask for today’s plate" },
    ],
  },
] as const;

export default function MenuPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-navy/40">
        Menu
      </p>
      <h1 className="serif mt-3 text-4xl font-semibold text-navy md:text-5xl">
        Something for every mood
      </h1>
      <p className="mt-4 max-w-xl font-sans text-sm text-muted">
        Coffee · Italian · Chinese · Indian. Full menu available in-house —
        here’s a taste of what we serve.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {menu.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-line bg-white px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-navy"
          >
            {s.title}
          </a>
        ))}
        <Link
          href="/snooker"
          className="rounded-full border border-orange/30 bg-orange/10 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-orange"
        >
          Snooker
        </Link>
      </div>

      <div className="mt-14 space-y-16">
        {menu.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-navy">
                <OfferingIcon id={section.id} className="h-6 w-6" />
              </span>
              <div>
                <h2 className="serif text-3xl font-semibold text-navy">
                  {section.title}
                </h2>
                <p className="mt-1 font-sans text-sm text-muted">
                  {section.intro}
                </p>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line bg-white/70">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-6 px-4 py-5 md:px-6"
                >
                  <div>
                    <p className="serif text-xl text-navy">{item.name}</p>
                    <p className="mt-1 font-sans text-sm text-muted">
                      {item.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-navy px-6 py-10 text-center text-white md:px-10">
        <p className="script text-3xl text-orange-soft">Hungry already?</p>
        <p className="mt-3 font-sans text-sm text-white/70">
          Visit us in Koramangala — or take home coffee &amp; pickles from the
          shop.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-orange">
            Visit us
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-white/25 px-6 py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-white"
          >
            Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
