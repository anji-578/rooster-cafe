import type { Bill, CafeSettings, Session } from "./types";

export type ReceiptLine = {
  name: string;
  qty: number;
  unitPrice: number;
  amount: number;
  kind?: string;
};

export type ReceiptPayload = {
  billId: string;
  sessionId: string;
  tableCode: string;
  cafeName: string;
  address: string;
  phone: string;
  gstPercent: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  paymentMethod: string | null;
  customerName?: string;
  lines: ReceiptLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  footer: string;
  text: string;
  escposBase64: string;
};

const WIDTH = 42;

function pad(left: string, right: string, width = WIDTH) {
  const gap = Math.max(1, width - left.length - right.length);
  return left.slice(0, width - right.length - 1) + " ".repeat(gap) + right;
}

function center(text: string, width = WIDTH) {
  const t = text.slice(0, width);
  const left = Math.floor((width - t.length) / 2);
  return " ".repeat(Math.max(0, left)) + t;
}

function money(n: number, currency = "₹") {
  return `${currency}${n.toLocaleString("en-IN")}`;
}

function lineWrap(name: string, qty: number, amount: number, currency: string) {
  const right = money(amount, currency);
  const left = `${qty}x ${name}`;
  if (left.length + right.length + 1 <= WIDTH) {
    return [pad(left, right)];
  }
  return [left.slice(0, WIDTH), pad("", right)];
}

/** Build plain 80mm-oriented text + ESC/POS bytes for thermal printers. */
export function buildReceipt(input: {
  bill: Bill;
  session: Session;
  settings: CafeSettings;
  lines: ReceiptLine[];
}): ReceiptPayload {
  const { bill, session, settings, lines } = input;
  const currency = settings.currency || "₹";
  const rows: string[] = [];

  rows.push(center(settings.cafeName.toUpperCase()));
  if (settings.address) rows.push(center(settings.address));
  if (settings.phone) rows.push(center(settings.phone));
  rows.push("-".repeat(WIDTH));
  rows.push(pad(`Table ${bill.tableCode}`, bill.id.slice(0, 8)));
  rows.push(
    pad(
      new Date(bill.paidAt || bill.createdAt).toLocaleString("en-IN", {
        hour12: true,
      }),
      bill.paymentMethod || "DUE"
    )
  );
  if (session.customerName) rows.push(`Guest: ${session.customerName}`);
  rows.push("-".repeat(WIDTH));

  for (const l of lines) {
    rows.push(...lineWrap(l.name, l.qty, l.amount, currency));
  }

  rows.push("-".repeat(WIDTH));
  rows.push(pad("Subtotal", money(bill.subtotal, currency)));
  if (bill.discount > 0) {
    rows.push(pad("Discount", `-${money(bill.discount, currency)}`));
  }
  rows.push(pad(`GST ${settings.gstPercent}%`, money(bill.tax, currency)));
  rows.push("=".repeat(WIDTH));
  rows.push(pad("TOTAL", money(bill.total, currency)));
  rows.push("=".repeat(WIDTH));
  rows.push("");
  rows.push(center(settings.receiptFooter || "Thank you · Visit again"));
  rows.push(center("Feedback via table QR"));
  rows.push("");
  rows.push("");

  const text = rows.join("\n");
  const escposBase64 = Buffer.from(buildEscPos(text)).toString("base64");

  return {
    billId: bill.id,
    sessionId: bill.sessionId,
    tableCode: bill.tableCode,
    cafeName: settings.cafeName,
    address: settings.address || "",
    phone: settings.phone || "",
    gstPercent: settings.gstPercent,
    currency,
    createdAt: bill.createdAt,
    paidAt: bill.paidAt,
    paymentMethod: bill.paymentMethod,
    customerName: session.customerName,
    lines,
    subtotal: bill.subtotal,
    discount: bill.discount,
    tax: bill.tax,
    total: bill.total,
    footer: settings.receiptFooter || "Thank you · Visit again",
    text,
    escposBase64,
  };
}

function buildEscPos(text: string): Uint8Array {
  const enc = new TextEncoder();
  const chunks: number[] = [];
  const push = (arr: number[] | Uint8Array) => {
    for (const b of arr) chunks.push(b);
  };

  // Init
  push([0x1b, 0x40]);
  // Code page PC437 (safe ASCII-ish); rupee may show as ?
  push([0x1b, 0x74, 0x00]);
  // Align left
  push([0x1b, 0x61, 0x00]);
  // Font A
  push([0x1b, 0x4d, 0x00]);

  for (const line of text.split("\n")) {
    // Prefer ASCII; map ₹ → Rs
    const safe = line.replaceAll("₹", "Rs");
    push(enc.encode(safe + "\n"));
  }

  // Feed + partial cut
  push([0x1b, 0x64, 0x03]);
  push([0x1d, 0x56, 0x01]);

  return Uint8Array.from(chunks);
}
