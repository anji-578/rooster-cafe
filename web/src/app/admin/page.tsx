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

type Settings = {
  cafeName: string;
  address?: string;
  phone?: string;
  receiptFooter?: string;
  snookerRatePerMinute: number;
  reviewRewardPercent: number;
  printAgentUrl: string;
  printerMode: "agent" | "browser";
  autoPrintOnPay: boolean;
};

export default function AdminPage() {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<Settings | null>(null);
  const [agentStatus, setAgentStatus] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function savePrinter() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-printer",
          printAgentUrl: settings.printAgentUrl,
          printerMode: settings.printerMode,
          autoPrintOnPay: settings.autoPrintOnPay,
          cafeName: settings.cafeName,
          address: settings.address,
          phone: settings.phone,
          receiptFooter: settings.receiptFooter,
        }),
      });
      const json = await res.json();
      if (res.ok) setSettings((s) => (s ? { ...s, ...json } : s));
    } finally {
      setSaving(false);
    }
  }

  async function pingAgent() {
    if (!settings?.printAgentUrl) return;
    setAgentStatus("Checking…");
    try {
      const url = settings.printAgentUrl.replace(/\/$/, "") + "/health";
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.ok) {
        setAgentStatus(
          json.mock
            ? "Online (MOCK — no physical printer yet)"
            : `Online → ${json.printer}`
        );
      } else {
        setAgentStatus("Agent responded with error");
      }
    } catch {
      setAgentStatus(
        "Unreachable from this device. Start print-agent and use cafe LAN IP."
      );
    }
  }

  return (
    <main className="min-h-[100svh] bg-white text-[#123A6D]">
      <header className="flex items-center justify-between border-b border-[#123A6D]/10 px-6 py-4 print:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4EA3E5]">
            Admin
          </p>
          <h1 className="text-2xl font-bold">Tables & Printer</h1>
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
        <section className="mx-auto max-w-6xl space-y-4 px-6 py-6 print:hidden">
          <div className="rounded-3xl border border-[#123A6D]/10 p-5">
            <h2 className="text-lg font-bold">Thermal printer (laptop + tablet)</h2>
            <p className="mt-1 text-sm text-[#123A6D]/55">
              Run the print agent on a cafe PC, point this URL at that machine’s
              LAN IP. Any device on Wi‑Fi can then print bills.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Print agent URL
                <input
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.printAgentUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, printAgentUrl: e.target.value })
                  }
                  placeholder="http://192.168.1.10:9101"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Mode
                <select
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.printerMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      printerMode: e.target.value as "agent" | "browser",
                    })
                  }
                >
                  <option value="agent">Thermal agent (recommended)</option>
                  <option value="browser">Browser print only</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={settings.autoPrintOnPay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoPrintOnPay: e.target.checked,
                    })
                  }
                />
                Auto-print after payment
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Cafe name on bill
                <input
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.cafeName}
                  onChange={(e) =>
                    setSettings({ ...settings, cafeName: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Address
                <input
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.address || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Phone
                <input
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.phone || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#123A6D]/45">
                Footer
                <input
                  className="mt-1 w-full rounded-xl bg-[#F3F8FD] px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none"
                  value={settings.receiptFooter || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, receiptFooter: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={savePrinter}
                disabled={saving}
                className="rounded-full bg-[#123A6D] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white"
              >
                {saving ? "Saving…" : "Save printer settings"}
              </button>
              <button
                type="button"
                onClick={pingAgent}
                className="rounded-full bg-[#E8F3FC] px-5 py-2 text-xs font-semibold uppercase tracking-wider"
              >
                Test agent
              </button>
              {agentStatus && (
                <span className="text-sm text-[#123A6D]/65">{agentStatus}</span>
              )}
            </div>
            <p className="mt-3 text-xs text-[#123A6D]/45">
              Start agent:{" "}
              <code className="rounded bg-[#F3F8FD] px-1">
                npm run print-agent
              </code>{" "}
              · Live printer:{" "}
              <code className="rounded bg-[#F3F8FD] px-1">
                PRINTER_HOST=192.168.x.x npm run print-agent
              </code>
            </p>
            <p className="mt-1 text-xs text-[#123A6D]/45">
              Snooker: ₹{settings.snookerRatePerMinute}/min · Review reward:{" "}
              {settings.reviewRewardPercent}%
            </p>
          </div>
        </section>
      )}

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <article
            key={t.id}
            className="rounded-3xl border border-[#123A6D]/10 p-4 text-center"
          >
            <p className="text-xl font-bold">{t.code}</p>
            <p className="text-xs text-[#123A6D]/50">
              {t.name} ·{" "}
              {t.kind === "SNOOKER" ? "Snooker + food" : `${t.seats} seats`}
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
