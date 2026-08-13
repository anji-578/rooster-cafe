import { NextResponse } from "next/server";
import {
  attachGuest,
  createAndPayBill,
  endSnooker,
  ensureSession,
  getAdminTables,
  getKitchenQueue,
  getPosFloor,
  getPosSession,
  getTableByToken,
  placeOrder,
  regenerateTableToken,
  requestBill,
  resetDemoData,
  startSnooker,
  submitFeedback,
  updateOrderStatus,
  applyLoyaltyDiscount,
} from "@/lib/cafe/actions";

type Body = Record<string, unknown>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "table": {
        const token = searchParams.get("token") || "";
        const data = await getTableByToken(token);
        if (!data) {
          return NextResponse.json({ error: "Invalid QR" }, { status: 404 });
        }
        return NextResponse.json(data);
      }
      case "kitchen":
        return NextResponse.json(await getKitchenQueue());
      case "pos":
        return NextResponse.json(await getPosFloor());
      case "pos-session": {
        const id = searchParams.get("sessionId") || "";
        return NextResponse.json(await getPosSession(id));
      }
      case "admin-tables":
        return NextResponse.json(await getAdminTables());
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const action = String(body.action || "");

    switch (action) {
      case "ensure-session":
        return NextResponse.json(
          await ensureSession(String(body.token || ""))
        );
      case "attach-guest":
        return NextResponse.json(
          await attachGuest({
            token: String(body.token || ""),
            name: body.name ? String(body.name) : undefined,
            phone: body.phone ? String(body.phone) : undefined,
          })
        );
      case "place-order":
        await placeOrder({
          token: String(body.token || ""),
          items: (body.items as { menuItemId: string; qty: number; notes?: string }[]) || [],
        });
        return NextResponse.json(
          await getTableByToken(String(body.token || ""))
        );
      case "start-snooker":
        return NextResponse.json(await startSnooker(String(body.token || "")));
      case "end-snooker":
        return NextResponse.json(await endSnooker(String(body.token || "")));
      case "request-bill":
        await requestBill(String(body.token || ""));
        return NextResponse.json(
          await getTableByToken(String(body.token || ""))
        );
      case "update-order":
        await updateOrderStatus(
          String(body.orderId || ""),
          body.status as never
        );
        return NextResponse.json(await getKitchenQueue());
      case "pay-bill":
        await createAndPayBill({
          sessionId: String(body.sessionId || ""),
          paymentMethod: body.paymentMethod as "CASH" | "UPI" | "CARD",
          discountPercent:
            typeof body.discountPercent === "number"
              ? body.discountPercent
              : undefined,
        });
        return NextResponse.json(
          await getPosSession(String(body.sessionId || ""))
        );
      case "apply-discount":
        await applyLoyaltyDiscount(
          String(body.sessionId || ""),
          Number(body.percent || 0)
        );
        return NextResponse.json(
          await getPosSession(String(body.sessionId || ""))
        );
      case "feedback":
        return NextResponse.json(
          await submitFeedback({
            sessionId: String(body.sessionId || ""),
            rating: Number(body.rating || 5),
            food: Number(body.food || 5),
            service: Number(body.service || 5),
            message: String(body.message || ""),
            phone: body.phone ? String(body.phone) : undefined,
            name: body.name ? String(body.name) : undefined,
          })
        );
      case "regen-token":
        return NextResponse.json(
          await regenerateTableToken(String(body.tableId || ""))
        );
      case "reset-demo":
        await resetDemoData();
        return NextResponse.json({ ok: true });
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error" },
      { status: 400 }
    );
  }
}
