import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8 md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/mark.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full ring-1 ring-white/20"
            />
            <div>
              <p className="font-sans text-xl font-bold tracking-tight">Rooster</p>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-orange">
                Cafe &amp; Dine
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-white/65">
            Coffee, Italian, Chinese, Indian &amp; Snooker in the heart of
            Koramangala.
          </p>
        </div>

        <div className="space-y-3 font-sans text-sm text-white/70">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
            Visit
          </p>
          <p>{siteConfig.locationLine1}</p>
          <p>{siteConfig.locationLine2}</p>
          <Link href="/contact" className="inline-block text-orange">
            Directions →
          </Link>
        </div>

        <div className="space-y-3 font-sans text-sm text-white/70">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
            Explore
          </p>
          <Link href="/menu" className="block hover:text-white">
            Menu
          </Link>
          <Link href="/shop" className="block hover:text-white">
            Shop
          </Link>
          <Link href="/review" className="block hover:text-white">
            Reviews
          </Link>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-white"
          >
            {siteConfig.instagramHandle}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center font-sans text-xs text-white/35 md:px-8">
        © {new Date().getFullYear()} Rooster Cafe &amp; Dine · Bengaluru
      </div>
    </footer>
  );
}
