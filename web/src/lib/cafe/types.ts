export type TableStatus =
  | "FREE"
  | "OCCUPIED"
  | "ORDERING"
  | "BILL_REQUESTED"
  | "PAID";

export type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
export type OrderItemStatus = "NEW" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
export type SessionStatus = "OPEN" | "BILLING" | "CLOSED";

export type CafeTable = {
  id: string;
  code: string; // T01, S1
  name: string;
  seats: number;
  kind: "DINING" | "SNOOKER";
  token: string; // QR token
  status: TableStatus;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number; // paise? no — INR whole rupees
  description: string;
  available: boolean;
  image?: string;
};

export type OrderLine = {
  id: string;
  menuItemId: string | null; // null for snooker time charge
  name: string;
  unitPrice: number;
  qty: number;
  notes?: string;
  status: OrderItemStatus;
  kind: "FOOD" | "DRINK" | "SNOOKER";
};

export type Order = {
  id: string;
  sessionId: string;
  tableCode: string;
  status: OrderStatus;
  priority: number;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
};

export type SnookerPlay = {
  id: string;
  sessionId: string;
  startedAt: string;
  endedAt: string | null;
  ratePerMinute: number;
};

export type Session = {
  id: string;
  tableId: string;
  tableCode: string;
  status: SessionStatus;
  openedAt: string;
  closedAt: string | null;
  customerName?: string;
  customerPhone?: string;
  loyaltyId?: string;
  discountPercent: number;
  notes?: string;
};

export type Bill = {
  id: string;
  sessionId: string;
  tableCode: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | null;
  paidAt: string | null;
  printedAt: string | null;
  createdAt: string;
};

export type LoyaltyMember = {
  id: string;
  phone: string;
  name: string;
  coins: number;
  createdAt: string;
};

export type Feedback = {
  id: string;
  sessionId: string;
  tableCode: string;
  rating: number;
  food: number;
  service: number;
  message: string;
  createdAt: string;
  rewardGranted: boolean;
};

export type CafeSettings = {
  cafeName: string;
  snookerRatePerMinute: number;
  gstPercent: number;
  reviewRewardPercent: number;
  currency: string;
};

export type CafeStore = {
  settings: CafeSettings;
  tables: CafeTable[];
  menu: MenuItem[];
  sessions: Session[];
  orders: Order[];
  snookerPlays: SnookerPlay[];
  bills: Bill[];
  loyalty: LoyaltyMember[];
  feedback: Feedback[];
};
