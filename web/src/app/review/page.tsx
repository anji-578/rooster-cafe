import type { Metadata } from "next";
import { Suspense } from "react";
import { ReviewExperience } from "@/components/review/ReviewExperience";

export const metadata: Metadata = {
  title: "Share your feedback",
  description:
    "Tell ROOSTER Cafe & Dine how your catering experience was. Made with Soul. Served with Love.",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <main className="bg-white text-navy">
      <Suspense
        fallback={
          <div className="flex min-h-[100svh] items-center justify-center font-sans text-sm text-navy/50">
            Loading…
          </div>
        }
      >
        <ReviewExperience />
      </Suspense>
    </main>
  );
}
