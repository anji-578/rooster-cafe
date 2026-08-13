"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site";

const ratings = [1, 2, 3, 4, 5] as const;

export function ReviewExperience() {
  const params = useSearchParams();
  const source = params.get("src") || "app";
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );

  const googleReady = Boolean(siteConfig.googleReviewUrl);
  const googleHref = useMemo(() => siteConfig.googleReviewUrl, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Guest",
          rating,
          message: message.trim(),
          source,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      if (googleReady) {
        window.setTimeout(() => {
          window.open(googleHref, "_blank", "noopener,noreferrer");
        }, 500);
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[#222]">
        ← Rooster
      </Link>
      <h1 className="mt-10 text-3xl font-extrabold tracking-tight">
        Enjoyed your visit?
      </h1>
      <p className="mt-3 text-sm text-[#777]">
        Tell us about the food and service.
      </p>

      {status === "done" ? (
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xl font-bold">Thank you</p>
          <Link href="/" className="mt-6 inline-block text-sm text-[#777]">
            Back to app
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="flex gap-2">
            {ratings.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className={`h-11 w-11 rounded-full text-sm font-semibold ${
                  rating >= v
                    ? "bg-[#e26a2c] text-white"
                    : "bg-white text-[#aaa]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-sm outline-none"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Your review"
            className="w-full resize-none rounded-2xl border-0 bg-white px-4 py-3.5 text-sm outline-none"
          />
          {status === "error" && (
            <p className="text-sm text-red-600">Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-full bg-[#222] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
          >
            {status === "saving" ? "Sending…" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
