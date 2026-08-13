"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type FloorItem = {
  table: {
    id: string;
    code: string;
    name: string;
    kind: string;
    status: string;
    seats: number;
  };
  session: { id: string; status: string; discountPercent: number } | null;
  totals: { subtotal: number; discount: number; tax: number; total: number } | null;
  activePlay: { startedAt: string; ratePerMinute: number } | null;
};

type SessionDetail = {
  session: {
    id: string;
    tableCode: string;
    status: string;
    discountPercent: number;
    customerName?: string;
    customerPhone?: string;
  };
  table: { code: string; kind: string };
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    lines: { id: string; name: string; qty: number; unitPrice: number; kind: string }[];
  };
  activePlay: { startedAt: string; ratePerMinute: number } | null;
  bill: {
    id: string;
    total: number;
    paymentMethod: string | null;
    paidAt: string | null;
  } | null;
  settings: { gstPercent: number; currency: string; reviewRewardPercent: number };
};

export default function PosPage() {
  const [floor, setFloor] = useState<FloorItem[]>([]);
  const [selected, setSelected] = useState<SessionDetail | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/cafe?action=pos");
    const json = await res.json();
    if (res.ok) setFloor(json.floor || []);
  }, []);

  useEffect(() => {
    void load();
    const t = window.setInterval(load, 3000);
    return () => window.clearInterval(t);
  }, [load]);

  async function openSession(sessionId: string) {
    const res = await fetch(
      `/api/cafe?action=pos-session&sessionId=${sessionId}`
    );
    const json = await res.json();
    if (res.ok) {
      setSelected(json);
      setDiscount(json.session.discountPercent || 0);
    }
  }

  async function applyDiscount() {
    if (!selected) return;
    await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "apply-discount",
        sessionId: selected.session.id,
        percent: discount,
      }),
    });
    await openSession(selected.session.id);
  }

  async function pay(method: "CASH" | "UPI" | "CARD") {
    if (!selected) return;
    setPaying(true);
    try {
      const res = await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pay-bill",
          sessionId: selected.session.id,
          paymentMethod: method,
          discountPercent: discount,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSelected(json);
        window.print();
        await load();
      }
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-[#F3F8FD] text-[#123A6D]">
      <header className="flex items-center justify-between border-b border-[#123A6D]/10 bg-white px-6 py-4 print:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4EA3E5]">
            Biller
          </p>
          <h1 className="text-2xl font-bold">Rooster POS</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/kitchen">Kitchen</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[1.4fr_1fr] print:block">
        <section className="print:hidden">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#123A6D]/45">
            Floor · 25 tables + S1
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {floor.map((item) => {
              const busy = Boolean(item.session);
              const billReq = item.table.status === "BILL_REQUESTED";
              return (
                <button
                  key={item.table.id}
                  type="button"
                  onClick={() =>
                    item.session ? openSession(item.session.id) : undefined
                  }
                  className={`rounded-2xl p-3 text-left shadow-sm transition ${
                    billReq
                      ? "bg-amber-100 ring-2 ring-amber-400"
                      : busy
                        ? "bg-[#123A6D] text-white"
                        : "bg-white"
                  } ${item.table.kind === "SNOOKER" ? "col-span-2" : ""}`}
                >
                  <p className="text-lg font-bold">{item.table.code}</p>
                  <p className="text-[10px] opacity-70">
                    {item.table.kind === "SNOOKER" ? "Snooker" : `${item.table.seats} seats`}
                  </p>
                  {item.totals && (
                    <p className="mt-2 text-sm font-semibold">
                      ₹{item.totals.total}
                    </p>
                  )}
                  {item.activePlay && (
                    <p className="mt-1 text-[10px] text-[#4EA3E5]">Play live</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm print:shadow-none">
          {!selected ? (
            <p className="py-20 text-center text-sm text-[#123A6D]/45">
              Select an occupied table
            </p>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selected.session.tableCode}
                  </h2>
                  <p className="text-sm text-[#123A6D]/50">
                    {selected.session.status}
                    {selected.activePlay ? " · snooker running" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#123A6D]/45 print:hidden"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>

              <ul className="mt-5 max-h-64 space-y-2 overflow-auto border-y border-[#123A6D]/10 py-4 text-sm">
                {selected.totals.lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span>
                      {l.qty}× {l.name}
                      {l.kind === "SNOOKER" ? " 🎱" : ""}
                    </span>
                    <span>₹{l.unitPrice * l.qty}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selected.totals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-₹{selected.totals.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({selected.settings.gstPercent}%)</span>
                  <span>₹{selected.totals.tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{selected.totals.total}</span>
                </div>
              </div>

              <div className="mt-5 print:hidden">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                  Loyalty / review discount %
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 rounded-xl bg-[#F3F8FD] px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyDiscount}
                    className="rounded-full bg-[#E8F3FC] px-4 py-2 text-xs font-semibold"
                  >
                    Apply 5/10%
                  </button>
                </div>
              </div>

              {selected.bill?.paidAt ? (
                <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Paid via {selected.bill.paymentMethod} · Ask guest for feedback
                  (table QR or review link) · reward up to{" "}
                  {selected.settings.reviewRewardPercent}% next visit
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-3 gap-2 print:hidden">
                  {(["CASH", "UPI", "CARD"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={paying}
                      onClick={() => pay(m)}
                      className="rounded-full bg-[#123A6D] py-3 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 hidden print:block">
                <p className="text-center text-lg font-bold">Rooster Cafe & Dine</p>
                <p className="text-center text-xs">
                  Koramangala · Thank you · Scan table QR for feedback
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
