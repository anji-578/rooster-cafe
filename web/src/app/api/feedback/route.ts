import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type Feedback = {
  id: string;
  name: string;
  rating: number;
  message: string;
  source: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "feedback.json");

async function readAll(): Promise<Feedback[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw) as Feedback[];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rating = Number(body.rating);
    const message = String(body.message || "").trim();
    const name = String(body.name || "Guest").trim().slice(0, 80);
    const source = String(body.source || "catering").trim().slice(0, 40);

    if (!message || message.length < 2) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const entry: Feedback = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      rating,
      message: message.slice(0, 2000),
      source,
      createdAt: new Date().toISOString(),
    };

    await mkdir(dataDir, { recursive: true });
    const all = await readAll();
    all.unshift(entry);
    await writeFile(dataFile, JSON.stringify(all, null, 2), "utf8");

    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
