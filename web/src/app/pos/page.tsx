"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { printReceipt } from "@/lib/cafe/print-client";

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
    printedAt?: string | null;
  } | null;
  settings: {
    gstPercent: number;
    currency: string;
    reviewRewardPercent: number;
    autoPrintOnPay?: boolean;
    printerMode?: string;
    printAgentUrl?: string;
  };
};

export default function PosPage() {
  const [floor, setFloor] = useState<FloorItem[]>([]);
  const [recentBills, setRecentBills] = useState<
    {
      id: string;
      sessionId: string;
      tableCode: string;
      total: number;
      paymentMethod: string | null;
      paidAt: string | null;
      printedAt: string | null;
    }[]
  >([]);
  const [selected, setSelected] = useState<SessionDetail | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paying, setPaying] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printMsg, setPrintMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/cafe?action=pos");
    const json = await res.json();
    if (res.ok) {
      setFloor(json.floor || []);
      setRecentBills(json.recentBills || []);
    }
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
      setPrintMsg("");
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

  async function runPrint(billId?: string, sessionId?: string) {
    setPrinting(true);
    setPrintMsg("Sending to printer…");
    try {
      const result = await printReceipt({ billId, sessionId });
      setPrintMsg(result.message);
      if (sessionId) await openSession(sessionId);
    } finally {
      setPrinting(false);
    }
  }

  async function pay(method: "CASH" | "UPI" | "CARD") {
    if (!selected) return;
    setPaying(true);
    setPrintMsg("");
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
        await load();
        const auto = json.settings?.autoPrintOnPay !== false;
        if (auto && json.bill?.id) {
          await runPrint(json.bill.id, json.session.id);
        }
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
          <Link href="/admin">Admin / Printer</Link>
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
                    {item.table.kind === "SNOOKER"
                      ? "Snooker"
                      : `${item.table.seats} seats`}
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

          {recentBills.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Recent bills · reprint
              </h2>
              <ul className="space-y-2">
                {recentBills.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        {b.tableCode} · ₹{b.total}
                      </p>
                      <p className="text-xs text-[#123A6D]/45">
                        {b.paymentMethod || "—"}
                        {b.printedAt ? " · printed" : " · not printed"}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={printing}
                      onClick={() => runPrint(b.id, b.sessionId)}
                      className="rounded-full bg-[#4EA3E5] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      Print
                    </button>
                  </li>
                ))}
              </ul>
              {printMsg && !selected && (
                <p className="mt-2 text-xs text-[#123A6D]/60">{printMsg}</p>
              )}
            </div>
          )}
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
                      {l.kind === "SNOOKER" ? " · time" : ""}
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
                    Apply
                  </button>
                </div>
              </div>

              {selected.bill?.paidAt ? (
                <div className="mt-6 space-y-3 print:hidden">
                  <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Paid via {selected.bill.paymentMethod}
                    {selected.bill.printedAt ? " · printed" : " · not printed yet"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={printing}
                      onClick={() =>
                        runPrint(selected.bill!.id, selected.session.id)
                      }
                      className="rounded-full bg-[#4EA3E5] py-3 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      {printing ? "Printing…" : "Print bill"}
                    </button>
                    <button
                      type="button"
                      disabled={printing}
                      onClick={() =>
                        printReceipt({
                          billId: selected.bill!.id,
                          forceBrowser: true,
                        }).then((r) => setPrintMsg(r.message))
                      }
                      className="rounded-full bg-[#123A6D] py-3 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      Browser preview
                    </button>
                  </div>
                  {printMsg && (
                    <p className="text-xs text-[#123A6D]/60">{printMsg}</p>
                  )}
                </div>
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
