import { nanoid } from "nanoid";
import type { CafeStore, CafeTable, MenuItem } from "./types";

function tableToken() {
  return nanoid(12);
}

function makeDiningTables(): CafeTable[] {
  const tables: CafeTable[] = [];
  for (let i = 1; i <= 25; i++) {
    const code = `T${String(i).padStart(2, "0")}`;
    tables.push({
      id: nanoid(8),
      code,
      name: `Table ${i}`,
      seats: i <= 10 ? 2 : i <= 20 ? 4 : 6,
      kind: "DINING",
      token: tableToken(),
      status: "FREE",
    });
  }
  tables.push({
    id: nanoid(8),
    code: "S1",
    name: "Snooker",
    seats: 4,
    kind: "SNOOKER",
    token: tableToken(),
    status: "FREE",
  });
  return tables;
}

const menuSeed: Omit<MenuItem, "id">[] = [
  {
    name: "House Coffee",
    category: "Coffee",
    price: 149,
    description: "Freshly pulled house brew",
    available: true,
    image: "/dishes/coffee.jpg",
  },
  {
    name: "Cappuccino",
    category: "Coffee",
    price: 169,
    description: "Espresso with silky foam",
    available: true,
    image: "/dishes/coffee.jpg",
  },
  {
    name: "Woodfire Pizza",
    category: "Italian",
    price: 349,
    description: "Crisp base, molten cheese",
    available: true,
    image: "/dishes/pizza.jpg",
  },
  {
    name: "Creamy Pasta",
    category: "Italian",
    price: 299,
    description: "Comfort pasta, herb finish",
    available: true,
    image: "/dishes/pasta.jpg",
  },
  {
    name: "Steamed Momos",
    category: "Asian",
    price: 199,
    description: "Hot juicy momos with chutney",
    available: true,
    image: "/dishes/momos.jpg",
  },
  {
    name: "Rooster Burger",
    category: "Grill",
    price: 279,
    description: "Stacked burger with house sauce",
    available: true,
    image: "/dishes/burger.jpg",
  },
  {
    name: "Hakka Noodles",
    category: "Asian",
    price: 249,
    description: "Wok-tossed classic",
    available: true,
  },
  {
    name: "French Fries",
    category: "Sides",
    price: 129,
    description: "Crispy salted fries",
    available: true,
  },
  {
    name: "Soft Drink",
    category: "Drinks",
    price: 79,
    description: "Chilled beverage",
    available: true,
  },
  {
    name: "Board Game Combo",
    category: "Combos",
    price: 399,
    description: "Coffee + fries + share plate",
    available: true,
  },
];

export function createSeedStore(): CafeStore {
  return {
    settings: {
      cafeName: "Rooster",
      address: "1A Block, Koramangala, Bengaluru",
      phone: "",
      receiptFooter: "Thank you · Visit again",
      snookerRatePerMinute: 5, // ₹5 / min → ₹300 / hour
      gstPercent: 5,
      reviewRewardPercent: 10,
      currency: "₹",
      printAgentUrl: "http://127.0.0.1:9101",
      printerMode: "agent",
      autoPrintOnPay: true,
    },
    tables: makeDiningTables(),
    menu: menuSeed.map((m) => ({ ...m, id: nanoid(8) })),
    sessions: [],
    orders: [],
    snookerPlays: [],
    bills: [],
    loyalty: [],
    feedback: [],
  };
}
