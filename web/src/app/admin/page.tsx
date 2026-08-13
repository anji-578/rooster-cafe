"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";

type AdminTable = {
  id: string;
  code: string;
  name: string;
  kind: string;
  seats: number;
  status: string;
  token: string;
  qrUrl: string;
};

export default function AdminPage() {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<{
    snookerRatePerMinute: number;
    reviewRewardPercent: number;
  } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/cafe?action=admin-tables");
    const json = await res.json();
    if (!res.ok) return;
    setTables(json.tables || []);
    setSettings(json.settings);
    const entries = await Promise.all(
      (json.tables as AdminTable[]).map(async (t) => {
        const dataUrl = await QRCode.toDataURL(t.qrUrl, {
          margin: 1,
          width: 240,
          color: { dark: "#123A6D", light: "#FFFFFF" },
        });
        return [t.id, dataUrl] as const;
      })
    );
    setQrMap(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function regen(tableId: string) {
    await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regen-token", tableId }),
    });
    await load();
  }

  async function resetDemo() {
    if (!confirm("Reset all cafe data to demo seed?")) return;
    await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset-demo" }),
    });
    await load();
  }

  return (
    <main className="min-h-[100svh] bg-white text-[#123A6D]">
      <header className="flex items-center justify-between border-b border-[#123A6D]/10 px-6 py-4 print:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4EA3E5]">
            Admin
          </p>
          <h1 className="text-2xl font-bold">Tables & QR</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/kitchen">Kitchen</Link>
          <Link href="/pos">POS</Link>
          <button type="button" onClick={() => window.print()}>
            Print QRs
          </button>
          <button type="button" onClick={resetDemo} className="text-red-600">
            Reset demo
          </button>
        </div>
      </header>

      {settings && (
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-[#123A6D]/70 print:hidden">
          Snooker rate: <strong>₹{settings.snookerRatePerMinute}/min</strong> ·
          Review reward: <strong>{settings.reviewRewardPercent}% next visit</strong>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <article
            key={t.id}
            className="rounded-3xl border border-[#123A6D]/10 p-4 text-center"
          >
            <p className="text-xl font-bold">{t.code}</p>
            <p className="text-xs text-[#123A6D]/50">
              {t.name} · {t.kind === "SNOOKER" ? "Snooker + food" : `${t.seats} seats`}
            </p>
            {qrMap[t.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrMap[t.id]}
                alt={`QR ${t.code}`}
                className="mx-auto mt-3 h-40 w-40"
              />
            )}
            <p className="mt-2 break-all text-[9px] text-[#123A6D]/40">
              {t.qrUrl}
            </p>
            <button
              type="button"
              onClick={() => regen(t.id)}
              className="mt-3 text-xs text-[#4EA3E5] print:hidden"
            >
              Regenerate QR
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
