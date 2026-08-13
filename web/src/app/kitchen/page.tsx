"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  tableCode: string;
  status: string;
  createdAt: string;
  lines: { id: string; name: string; qty: number; notes?: string; kind: string }[];
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/cafe?action=kitchen");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed");
      return;
    }
    setOrders(json.orders || []);
  }, []);

  useEffect(() => {
    void load();
    const t = window.setInterval(load, 2500);
    return () => window.clearInterval(t);
  }, [load]);

  async function setStatus(orderId: string, status: string) {
    await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-order", orderId, status }),
    });
    await load();
  }

  const columns: { key: string; label: string; next?: string }[] = [
    { key: "NEW", label: "New", next: "ACCEPTED" },
    { key: "ACCEPTED", label: "Accepted", next: "PREPARING" },
    { key: "PREPARING", label: "Preparing", next: "READY" },
    { key: "READY", label: "Ready", next: "SERVED" },
  ];

  return (
    <main className="min-h-[100svh] bg-[#0B1F3A] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4EA3E5]">
            Kitchen
          </p>
          <h1 className="text-2xl font-bold">Rooster KDS</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/pos" className="text-white/70 hover:text-white">
            POS
          </Link>
          <Link href="/admin" className="text-white/70 hover:text-white">
            Admin
          </Link>
        </div>
      </header>

      {error && <p className="px-6 pt-4 text-sm text-red-300">{error}</p>}

      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const list = orders.filter((o) => o.status === col.key);
          return (
            <section key={col.key} className="rounded-3xl bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A8D4F5]">
                  {col.label}
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {list.length}
                </span>
              </div>
              <div className="space-y-3">
                {list.map((order) => {
                  const waitMin = Math.floor(
                    (Date.now() - new Date(order.createdAt).getTime()) / 60000
                  );
                  return (
                    <article
                      key={order.id}
                      className={`rounded-2xl p-4 ${
                        waitMin >= 15
                          ? "bg-red-500/20 ring-1 ring-red-400/40"
                          : "bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">{order.tableCode}</p>
                        <p className="text-xs text-white/50">{waitMin}m</p>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-white/85">
                        {order.lines.map((l) => (
                          <li key={l.id}>
                            {l.qty}× {l.name}
                            {l.notes ? (
                              <span className="text-white/45"> — {l.notes}</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      {col.next && (
                        <button
                          type="button"
                          onClick={() => setStatus(order.id, col.next!)}
                          className="mt-3 w-full rounded-full bg-[#4EA3E5] py-2 text-xs font-semibold uppercase tracking-wider"
                        >
                          Mark {col.next.toLowerCase()}
                        </button>
                      )}
                    </article>
                  );
                })}
                {!list.length && (
                  <p className="py-8 text-center text-sm text-white/30">Empty</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
