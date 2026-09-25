export type ReceiptPayload = {
  billId: string;
  text: string;
  escposBase64: string;
  [key: string]: unknown;
};

export type PrinterConfig = {
  mode: "agent" | "browser";
  agentUrl: string;
  autoPrintOnPay?: boolean;
};

/**
 * Print from laptop or tablet:
 * 1) Prefer direct POST to LAN print agent (works when Next.js is in cloud)
 * 2) Else server already tried agent
 * 3) Else browser print fallback
 */
export async function printReceipt(opts: {
  billId?: string;
  sessionId?: string;
  forceBrowser?: boolean;
}): Promise<{ ok: boolean; message: string }> {
  const res = await fetch("/api/cafe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "print-bill",
      billId: opts.billId,
      sessionId: opts.sessionId,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, message: data.error || "Could not build receipt" };
  }

  const receipt = data.receipt as ReceiptPayload;
  const printer = data.printer as PrinterConfig;

  if (opts.forceBrowser || printer.mode === "browser") {
    openThermalPreview(receipt);
    return { ok: true, message: "Opened browser print preview" };
  }

  if (data.ok) {
    return { ok: true, message: "Sent to thermal printer" };
  }

  // Server couldn't reach agent (common when Next is localhost but agent on another PC,
  // or agent only reachable from browser on cafe Wi‑Fi) — try from the device.
  const agentUrl = (printer.agentUrl || "").replace(/\/$/, "");
  if (agentUrl) {
    try {
      const agentRes = await fetch(`${agentUrl}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId: receipt.billId,
          text: receipt.text,
          escposBase64: receipt.escposBase64,
        }),
      });
      if (agentRes.ok) {
        await fetch("/api/cafe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mark-printed",
            billId: receipt.billId,
          }),
        });
        return { ok: true, message: "Sent to thermal printer (via device)" };
      }
    } catch {
      // fall through
    }
  }

  openThermalPreview(receipt);
  return {
    ok: false,
    message:
      data.error ||
      "Print agent offline — opened browser preview. Start print-agent on cafe LAN.",
  };
}

function openThermalPreview(receipt: ReceiptPayload) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=420,height=720");
  if (!w) {
    window.print();
    return;
  }
  const safe = String(receipt.text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  w.document.write(`<!doctype html><html><head><title>Bill ${receipt.billId}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; margin: 0; padding: 8px; }
  pre { white-space: pre-wrap; word-break: break-word; margin: 0; }
  .actions { margin-bottom: 12px; }
  @media print { .actions { display: none; } }
</style></head><body>
<div class="actions"><button onclick="window.print()">Print</button></div>
<pre>${safe}</pre>
<script>setTimeout(()=>window.print(),300)</script>
</body></html>`);
  w.document.close();
}
