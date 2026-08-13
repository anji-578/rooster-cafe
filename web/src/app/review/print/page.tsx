import type { Metadata } from "next";
import Image from "next/image";
import { reviewPageUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Review QR card",
  robots: { index: false, follow: false },
};

export default function QrPrintPage() {
  const url = reviewPageUrl("flyer");

  return (
    <main className="min-h-[100svh] bg-paper px-6 py-10 print:p-0">
      <div className="mx-auto max-w-3xl">
        <p className="mb-8 font-sans text-[10px] uppercase tracking-[0.3em] text-muted print:hidden">
          Print · cut · place on tables
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((n) => (
            <article
              key={n}
              className="flex flex-col items-center rounded-3xl border border-line bg-white px-8 py-10 text-center"
            >
              <Image
                src="/brand/logo.png"
                alt=""
                width={96}
                height={96}
                className="h-20 w-20 rounded-full"
              />
              <h1 className="serif mt-4 text-3xl font-semibold lowercase text-navy">
                rooster
              </h1>
              <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-orange">
                Cafe &amp; Dine
              </p>
              <p className="serif mt-5 text-xl text-navy">Enjoyed the food?</p>
              <p className="script mt-2 text-2xl text-orange">
                We&apos;d love to hear from you!
              </p>
              <div className="relative mt-6 h-40 w-40">
                <Image
                  src="/qr/catering-review.png"
                  alt="Scan to review"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.25em] text-navy">
                Scan to review
              </p>
              <p className="mt-2 font-sans text-[9px] text-muted">
                {siteConfig.instagramHandle}
              </p>
              <p className="mt-1 max-w-[14rem] break-all font-sans text-[8px] text-muted/80 print:hidden">
                {url}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
