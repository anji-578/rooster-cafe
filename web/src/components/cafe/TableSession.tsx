"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
};

type Line = {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  status: string;
  kind: string;
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  lines: Line[];
};

type Play = {
  id: string;
  startedAt: string;
  ratePerMinute: number;
};

type Payload = {
  table: {
    code: string;
    name: string;
    kind: "DINING" | "SNOOKER";
    status: string;
  };
  session: { id: string; status: string } | null;
  lastClosedSession: { id: string; status: string } | null;
  orders: Order[];
  activePlay: Play | null;
  settings: {
    snookerRatePerMinute: number;
    currency: string;
    gstPercent: number;
  };
  menu: MenuItem[];
};

export function TableSession({ token }: { token: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<string>("All");
  const [tick, setTick] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/cafe?action=table&token=${token}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Invalid table");
      return;
    }
    setData(json);
    setError("");
  }, [token]);

  useEffect(() => {
    void (async () => {
      await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ensure-session", token }),
      });
      await load();
    })();
    const t = window.setInterval(load, 4000);
    return () => window.clearInterval(t);
  }, [token, load]);

  useEffect(() => {
    if (!data?.activePlay) return;
    const t = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => window.clearInterval(t);
  }, [data?.activePlay]);

  const categories = useMemo(() => {
    if (!data) return [];
    return ["All", ...Array.from(new Set(data.menu.map((m) => m.category)))];
  }, [data]);

  const visible = useMemo(() => {
    if (!data) return [];
    return tab === "All"
      ? data.menu
      : data.menu.filter((m) => m.category === tab);
  }, [data, tab]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = useMemo(() => {
    if (!data) return 0;
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = data.menu.find((m) => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, data]);

  const playSeconds = useMemo(() => {
    if (!data?.activePlay) return 0;
    void tick;
    return Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(data.activePlay.startedAt).getTime()) / 1000
      )
    );
  }, [data?.activePlay, tick]);

  const playCost = data?.activePlay
    ? Math.max(1, Math.ceil(playSeconds / 60)) * data.activePlay.ratePerMinute
    : 0;

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (json.table) setData(json);
      else await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) {
    return (
      <main className="mx-auto flex min-h-[100svh] max-w-lg items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-[#123A6D]">Invalid QR</h1>
          <p className="mt-2 text-sm text-[#123A6D]/60">{error}</p>
          <Link href="/" className="mt-6 inline-block text-sm text-[#4EA3E5]">
            Back to Rooster
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center text-sm text-[#123A6D]/50">
        Opening your table…
      </main>
    );
  }

  const isSnooker = data.table.kind === "SNOOKER";

  return (
    <main className="mx-auto min-h-[100svh] max-w-lg bg-[#F3F8FD] pb-28 text-[#123A6D]">
      <header className="sticky top-0 z-20 border-b border-[#123A6D]/10 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4EA3E5]">
              Rooster
            </p>
            <h1 className="text-xl font-bold">
              {data.table.code} · {data.table.name}
            </h1>
          </div>
          <span className="rounded-full bg-[#E8F3FC] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
            {data.table.status.replaceAll("_", " ")}
          </span>
        </div>
      </header>

      {error && (
        <p className="mx-5 mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Snooker panel */}
      {isSnooker && (
        <section className="mx-5 mt-5 overflow-hidden rounded-3xl bg-[#123A6D] p-5 text-white shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8D4F5]">
            Snooker · Timed billing
          </p>
          <h2 className="mt-2 text-2xl font-bold">Table S1</h2>
          <p className="mt-1 text-sm text-white/70">
            ₹{data.settings.snookerRatePerMinute}/min · Food delivered here too
          </p>

          {data.activePlay ? (
            <div className="mt-6">
              <p className="font-mono text-4xl font-bold tabular-nums">
                {formatDuration(playSeconds)}
              </p>
              <p className="mt-2 text-sm text-[#A8D4F5]">
                Running charge ≈ ₹{playCost}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => post({ action: "end-snooker", token })}
                className="mt-5 w-full rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-wider text-[#123A6D]"
              >
                End play &amp; add to bill
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => post({ action: "start-snooker", token })}
              className="mt-6 w-full rounded-full bg-[#4EA3E5] py-3.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Start playing
            </button>
          )}
        </section>
      )}

      {/* Orders */}
      <section className="mx-5 mt-5 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#123A6D]/45">
          Your orders
        </h2>
        {!data.orders.length ? (
          <p className="mt-3 text-sm text-[#123A6D]/50">No orders yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.orders.map((o) => (
              <li key={o.id} className="rounded-2xl bg-[#F3F8FD] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{o.status}</span>
                  <span className="text-[#123A6D]/45">
                    {new Date(o.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {o.lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-3">
                      <span>
                        {l.qty}× {l.name}
                      </span>
                      <span>₹{l.unitPrice * l.qty}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => post({ action: "request-bill", token })}
          className="mt-4 w-full rounded-full border border-[#123A6D]/15 py-3 text-xs font-semibold uppercase tracking-wider"
        >
          Request bill
        </button>
        {(data.session?.status === "BILLING" ||
          data.lastClosedSession ||
          data.table.status === "BILL_REQUESTED") && (
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="mt-2 w-full text-xs text-[#4EA3E5]"
          >
            Leave feedback &amp; earn reward
          </button>
        )}
      </section>

      {/* Menu */}
      <section className="mx-5 mt-5">
        <h2 className="text-lg font-bold">Order food</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTab(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === c
                  ? "bg-[#123A6D] text-white"
                  : "bg-white text-[#123A6D]/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8F3FC]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="shrink-0 text-sm font-semibold text-[#4EA3E5]">
                    ₹{item.price}
                  </p>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-[#123A6D]/55">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-[#F3F8FD]"
                    onClick={() =>
                      setCart((c) => ({
                        ...c,
                        [item.id]: Math.max(0, (c[item.id] || 0) - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm">
                    {cart[item.id] || 0}
                  </span>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-[#123A6D] text-white"
                    onClick={() =>
                      setCart((c) => ({
                        ...c,
                        [item.id]: (c[item.id] || 0) + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#123A6D]/10 bg-white p-4">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-[#123A6D]/50">{cartCount} items</p>
              <p className="font-bold">₹{cartTotal}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const items = Object.entries(cart)
                  .filter(([, qty]) => qty > 0)
                  .map(([menuItemId, qty]) => ({ menuItemId, qty }));
                await post({ action: "place-order", token, items });
                setCart({});
              }}
              className="rounded-full bg-[#123A6D] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Send to kitchen
            </button>
          </div>
        </div>
      )}

      {feedbackOpen && (data.session || data.lastClosedSession) && (
        <FeedbackModal
          sessionId={(data.session || data.lastClosedSession)!.id}
          onClose={() => setFeedbackOpen(false)}
        />
      )}
    </main>
  );
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function FeedbackModal({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [food, setFood] = useState(5);
  const [service, setService] = useState(5);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<{ reward: boolean; rewardPercent: number } | null>(null);

  async function submit() {
    const res = await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "feedback",
        sessionId,
        rating,
        food,
        service,
        message,
        phone,
      }),
    });
    const json = await res.json();
    if (res.ok) setDone(json);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        {done ? (
          <div className="text-center">
            <p className="text-xl font-bold">Thank you!</p>
            {done.reward ? (
              <p className="mt-3 text-sm text-[#123A6D]/70">
                You unlocked {done.rewardPercent}% off on your next visit. Show
                this at the counter.
              </p>
            ) : (
              <p className="mt-3 text-sm text-[#123A6D]/70">
                We appreciate your feedback.
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#123A6D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold">How was Rooster?</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Overall", rating, setRating],
                ["Food", food, setFood],
                ["Service", service, setService],
              ].map(([label, value, setter]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <span>{label as string}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => (setter as (n: number) => void)(n)}
                        className={`h-8 w-8 rounded-full text-xs font-bold ${
                          (value as number) >= n
                            ? "bg-[#4EA3E5] text-white"
                            : "bg-[#F3F8FD]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone for loyalty reward"
                className="w-full rounded-xl bg-[#F3F8FD] px-3 py-3 outline-none"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Anything we should know?"
                rows={3}
                className="w-full resize-none rounded-xl bg-[#F3F8FD] px-3 py-3 outline-none"
              />
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-[#123A6D]/15 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                Later
              </button>
              <button
                type="button"
                onClick={submit}
                className="flex-1 rounded-full bg-[#123A6D] py-3 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
