import { nanoid } from "nanoid";
import { readStore, updateStore } from "./store";
import type {
  Bill,
  CafeStore,
  Order,
  OrderLine,
  Session,
  SnookerPlay,
} from "./types";

function now() {
  return new Date().toISOString();
}

function openSessionForTable(store: CafeStore, tableId: string): Session {
  const table = store.tables.find((t) => t.id === tableId);
  if (!table) throw new Error("Table not found");

  const existing = store.sessions.find(
    (s) => s.tableId === tableId && s.status !== "CLOSED"
  );
  if (existing) return existing;

  const session: Session = {
    id: nanoid(10),
    tableId: table.id,
    tableCode: table.code,
    status: "OPEN",
    openedAt: now(),
    closedAt: null,
    discountPercent: 0,
  };
  store.sessions.unshift(session);
  table.status = "OCCUPIED";
  return session;
}

export async function getBootstrap() {
  const store = await readStore();
  return {
    settings: store.settings,
    tables: store.tables.map(({ token, ...rest }) => ({
      ...rest,
      // hide full token list from kitchen; admin gets tokens separately
      hasToken: Boolean(token),
    })),
    menu: store.menu.filter((m) => m.available),
  };
}

export async function getTableByToken(token: string) {
  const store = await readStore();
  const table = store.tables.find((t) => t.token === token);
  if (!table) return null;

  const session = store.sessions.find(
    (s) => s.tableId === table.id && s.status !== "CLOSED"
  );
  const lastClosedSession =
    store.sessions.find(
      (s) => s.tableId === table.id && s.status === "CLOSED"
    ) ?? null;
  const orders = session
    ? store.orders.filter((o) => o.sessionId === session.id)
    : [];
  const activePlay = session
    ? store.snookerPlays.find(
        (p) => p.sessionId === session.id && !p.endedAt
      ) ?? null
    : null;

  return {
    table,
    session,
    lastClosedSession,
    orders,
    activePlay,
    settings: store.settings,
    menu: store.menu.filter((m) => m.available),
  };
}

export async function ensureSession(token: string) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === token);
    if (!table) throw new Error("Invalid table QR");
    openSessionForTable(store, table.id);
    return store;
  }).then(async () => getTableByToken(token));
}

export async function placeOrder(input: {
  token: string;
  items: { menuItemId: string; qty: number; notes?: string }[];
}) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === input.token);
    if (!table) throw new Error("Invalid table");
    const session = openSessionForTable(store, table.id);

    const lines: OrderLine[] = input.items.map((item) => {
      const menu = store.menu.find((m) => m.id === item.menuItemId);
      if (!menu || !menu.available) throw new Error("Item unavailable");
      const kind =
        menu.category === "Coffee" || menu.category === "Drinks"
          ? "DRINK"
          : "FOOD";
      return {
        id: nanoid(8),
        menuItemId: menu.id,
        name: menu.name,
        unitPrice: menu.price,
        qty: Math.max(1, item.qty),
        notes: item.notes,
        status: "NEW",
        kind,
      };
    });

    if (!lines.length) throw new Error("Empty order");

    const order: Order = {
      id: nanoid(10),
      sessionId: session.id,
      tableCode: table.code,
      status: "NEW",
      priority: Date.now(),
      createdAt: now(),
      updatedAt: now(),
      lines,
    };
    store.orders.unshift(order);
    table.status = "ORDERING";
    return store;
  });
}

export async function getKitchenQueue() {
  const store = await readStore();
  const open = store.orders.filter(
    (o) => !["SERVED", "CANCELLED"].includes(o.status)
  );
  open.sort((a, b) => a.priority - b.priority);
  return { orders: open, settings: store.settings };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
) {
  return updateStore((store) => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    order.updatedAt = now();
    order.lines = order.lines.map((l) => {
      if (l.status === "CANCELLED") return l;
      if (status === "PREPARING") return { ...l, status: "PREPARING" };
      if (status === "READY") return { ...l, status: "READY" };
      if (status === "SERVED") return { ...l, status: "SERVED" };
      if (status === "ACCEPTED") return { ...l, status: "PREPARING" };
      return l;
    });
    return store;
  });
}

export async function startSnooker(token: string) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === token);
    if (!table || table.kind !== "SNOOKER") {
      throw new Error("Snooker only on S1");
    }
    const session = openSessionForTable(store, table.id);
    const existing = store.snookerPlays.find(
      (p) => p.sessionId === session.id && !p.endedAt
    );
    if (existing) throw new Error("Play already in progress");

    const play: SnookerPlay = {
      id: nanoid(10),
      sessionId: session.id,
      startedAt: now(),
      endedAt: null,
      ratePerMinute: store.settings.snookerRatePerMinute,
    };
    store.snookerPlays.unshift(play);
    table.status = "OCCUPIED";
    return store;
  }).then(() => getTableByToken(token));
}

export async function endSnooker(token: string) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === token);
    if (!table) throw new Error("Invalid table");
    const session = store.sessions.find(
      (s) => s.tableId === table.id && s.status !== "CLOSED"
    );
    if (!session) throw new Error("No open session");
    const play = store.snookerPlays.find(
      (p) => p.sessionId === session.id && !p.endedAt
    );
    if (!play) throw new Error("No active snooker play");

    play.endedAt = now();
    const minutes = Math.max(
      1,
      Math.ceil(
        (new Date(play.endedAt).getTime() -
          new Date(play.startedAt).getTime()) /
          60000
      )
    );
    const amount = minutes * play.ratePerMinute;

    const order: Order = {
      id: nanoid(10),
      sessionId: session.id,
      tableCode: table.code,
      status: "SERVED",
      priority: Date.now(),
      createdAt: now(),
      updatedAt: now(),
      lines: [
        {
          id: nanoid(8),
          menuItemId: null,
          name: `Snooker play (${minutes} min @ ${store.settings.currency}${play.ratePerMinute}/min)`,
          unitPrice: amount,
          qty: 1,
          status: "SERVED",
          kind: "SNOOKER",
        },
      ],
    };
    store.orders.unshift(order);
    return store;
  }).then(() => getTableByToken(token));
}

export function computeSessionTotals(store: CafeStore, sessionId: string) {
  const orders = store.orders.filter(
    (o) => o.sessionId === sessionId && o.status !== "CANCELLED"
  );
  const lines = orders.flatMap((o) =>
    o.lines.filter((l) => l.status !== "CANCELLED")
  );
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const session = store.sessions.find((s) => s.id === sessionId);
  const discountPercent = session?.discountPercent ?? 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round((taxable * store.settings.gstPercent) / 100);
  const total = taxable + tax;
  return { subtotal, discount, tax, total, lines, orders };
}

export async function getPosFloor() {
  const store = await readStore();
  const openSessions = store.sessions.filter((s) => s.status !== "CLOSED");
  const floor = store.tables.map((table) => {
    const session = openSessions.find((s) => s.tableId === table.id) ?? null;
    const totals = session
      ? computeSessionTotals(store, session.id)
      : null;
    const activePlay = session
      ? store.snookerPlays.find(
          (p) => p.sessionId === session.id && !p.endedAt
        ) ?? null
      : null;
    return { table, session, totals, activePlay };
  });
  return { floor, settings: store.settings };
}

export async function getPosSession(sessionId: string) {
  const store = await readStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  const table = store.tables.find((t) => t.id === session.tableId)!;
  const totals = computeSessionTotals(store, sessionId);
  const activePlay =
    store.snookerPlays.find(
      (p) => p.sessionId === sessionId && !p.endedAt
    ) ?? null;
  const bill =
    store.bills.find((b) => b.sessionId === sessionId && !b.paidAt) ??
    store.bills.find((b) => b.sessionId === sessionId) ??
    null;
  return { session, table, totals, activePlay, bill, settings: store.settings };
}

export async function requestBill(token: string) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === token);
    if (!table) throw new Error("Invalid table");
    const session = store.sessions.find(
      (s) => s.tableId === table.id && s.status !== "CLOSED"
    );
    if (!session) throw new Error("No session");
    // end snooker if still running
    const play = store.snookerPlays.find(
      (p) => p.sessionId === session.id && !p.endedAt
    );
    if (play) {
      play.endedAt = now();
      const minutes = Math.max(
        1,
        Math.ceil(
          (new Date(play.endedAt).getTime() -
            new Date(play.startedAt).getTime()) /
            60000
        )
      );
      const amount = minutes * play.ratePerMinute;
      store.orders.unshift({
        id: nanoid(10),
        sessionId: session.id,
        tableCode: table.code,
        status: "SERVED",
        priority: Date.now(),
        createdAt: now(),
        updatedAt: now(),
        lines: [
          {
            id: nanoid(8),
            menuItemId: null,
            name: `Snooker play (${minutes} min)`,
            unitPrice: amount,
            qty: 1,
            status: "SERVED",
            kind: "SNOOKER",
          },
        ],
      });
    }
    session.status = "BILLING";
    table.status = "BILL_REQUESTED";
    return store;
  });
}

export async function createAndPayBill(input: {
  sessionId: string;
  paymentMethod: "CASH" | "UPI" | "CARD";
  discountPercent?: number;
}) {
  return updateStore((store) => {
    const session = store.sessions.find((s) => s.id === input.sessionId);
    if (!session || session.status === "CLOSED") {
      throw new Error("Session not available");
    }
    // force-end snooker
    const play = store.snookerPlays.find(
      (p) => p.sessionId === session.id && !p.endedAt
    );
    if (play) {
      play.endedAt = now();
      const minutes = Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(play.startedAt).getTime()) / 60000
        )
      );
      store.orders.unshift({
        id: nanoid(10),
        sessionId: session.id,
        tableCode: session.tableCode,
        status: "SERVED",
        priority: Date.now(),
        createdAt: now(),
        updatedAt: now(),
        lines: [
          {
            id: nanoid(8),
            menuItemId: null,
            name: `Snooker play (${minutes} min)`,
            unitPrice: minutes * play.ratePerMinute,
            qty: 1,
            status: "SERVED",
            kind: "SNOOKER",
          },
        ],
      });
    }

    if (typeof input.discountPercent === "number") {
      session.discountPercent = Math.min(50, Math.max(0, input.discountPercent));
    }

    const totals = computeSessionTotals(store, session.id);
    const bill: Bill = {
      id: nanoid(10),
      sessionId: session.id,
      tableCode: session.tableCode,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: input.paymentMethod,
      paidAt: now(),
      printedAt: now(),
      createdAt: now(),
    };
    store.bills.unshift(bill);
    session.status = "CLOSED";
    session.closedAt = now();
    const table = store.tables.find((t) => t.id === session.tableId);
    if (table) table.status = "PAID";
    // free table after short logical close
    if (table) table.status = "FREE";

    // loyalty coins: 1 coin per ₹50
    if (session.customerPhone) {
      let member = store.loyalty.find((l) => l.phone === session.customerPhone);
      if (!member) {
        member = {
          id: nanoid(8),
          phone: session.customerPhone,
          name: session.customerName || "Guest",
          coins: 0,
          createdAt: now(),
        };
        store.loyalty.push(member);
      }
      member.coins += Math.floor(bill.total / 50);
    }

    return store;
  });
}

export async function submitFeedback(input: {
  sessionId: string;
  rating: number;
  food: number;
  service: number;
  message: string;
  phone?: string;
  name?: string;
}) {
  let reward = false;
  let rewardPercent = 10;

  await updateStore((store) => {
    const session = store.sessions.find((s) => s.id === input.sessionId);
    if (!session) throw new Error("Session not found");
    reward =
      input.rating >= 4 &&
      !store.feedback.some(
        (f) => f.sessionId === input.sessionId && f.rewardGranted
      );
    rewardPercent = store.settings.reviewRewardPercent;

    store.feedback.unshift({
      id: nanoid(10),
      sessionId: session.id,
      tableCode: session.tableCode,
      rating: input.rating,
      food: input.food,
      service: input.service,
      message: input.message,
      createdAt: now(),
      rewardGranted: reward,
    });

    if (reward && input.phone) {
      let member = store.loyalty.find((l) => l.phone === input.phone);
      if (!member) {
        member = {
          id: nanoid(8),
          phone: input.phone,
          name: input.name || "Guest",
          coins: 0,
          createdAt: now(),
        };
        store.loyalty.push(member);
      }
      member.coins += 20;
    }
  });

  return { reward, rewardPercent };
}

export async function getAdminTables() {
  const store = await readStore();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    settings: store.settings,
    tables: store.tables.map((t) => ({
      ...t,
      qrUrl: `${siteUrl.replace(/\/$/, "")}/t/${t.token}`,
    })),
  };
}

export async function regenerateTableToken(tableId: string) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.id === tableId);
    if (!table) throw new Error("Not found");
    table.token = nanoid(12);
    return store;
  }).then(() => getAdminTables());
}

export async function resetDemoData() {
  const { createSeedStore } = await import("./seed");
  return updateStore(() => createSeedStore());
}

export async function attachGuest(input: {
  token: string;
  name?: string;
  phone?: string;
}) {
  return updateStore((store) => {
    const table = store.tables.find((t) => t.token === input.token);
    if (!table) throw new Error("Invalid table");
    const session = openSessionForTable(store, table.id);
    if (input.name) session.customerName = input.name;
    if (input.phone) session.customerPhone = input.phone;
    return store;
  }).then(() => getTableByToken(input.token));
}

export async function applyLoyaltyDiscount(sessionId: string, percent: number) {
  return updateStore((store) => {
    const session = store.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");
    session.discountPercent = Math.min(50, Math.max(0, percent));
    return store;
  });
}
