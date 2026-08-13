import { promises as fs } from "fs";
import path from "path";
import { createSeedStore } from "./seed";
import type { CafeStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "cafe-store.json");

let writeChain: Promise<void> = Promise.resolve();

async function ensureStore(): Promise<CafeStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as CafeStore;
  } catch {
    const seed = createSeedStore();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export async function readStore(): Promise<CafeStore> {
  return ensureStore();
}

export async function updateStore(
  mutator: (store: CafeStore) => void | CafeStore
): Promise<CafeStore> {
  const run = writeChain.then(async () => {
    const store = await ensureStore();
    const result = mutator(store) ?? store;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(result, null, 2), "utf8");
    return result;
  });
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export function formatMoney(n: number, currency = "₹") {
  return `${currency}${n.toLocaleString("en-IN")}`;
}
