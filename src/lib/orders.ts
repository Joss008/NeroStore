import type { CartItem } from "./cart";
import { generateOrderCode } from "./format";

export interface Order {
  code: string;
  user: { name: string; phone: string; countryCode: string; countryFlag: string };
  items: (CartItem & { subtotal: number })[];
  total: number;
  totalsByCurrency: Record<string, number>;
  currency: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = "blox-orders";

const API_ENDPOINTS = [
  "/api/orders",
  "/admin/api/orders",
  "http://localhost:3000/api/orders",
  "http://localhost:3001/admin/api/orders",
];

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

async function notifyOrdersChanged(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    const { getSyncBus } = await import("./sync");
    getSyncBus().send({
      type: "orders:changed",
      payload: { orders },
    });
  } catch {
    // ignore
  }
}

export function getOrders(phone?: string): Order[] {
  const all = readOrders();
  if (phone) return all.filter((o) => o.user.phone === phone);
  return all;
}

export async function fetchOrders(phone?: string): Promise<Order[]> {
  for (const ep of API_ENDPOINTS) {
    try {
      const url = phone ? `${ep}?phone=${encodeURIComponent(phone)}` : ep;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as Order[];
      }
    } catch {
      // probar siguiente
    }
  }
  return getOrders(phone);
}

export async function createOrder(
  user: { name: string; phone: string; countryCode: string; countryFlag: string },
  items: CartItem[],
  paymentMethod: string,
  notes: string
): Promise<Order> {
  const code = generateOrderCode();

  const totalsByCurrency: Record<string, number> = {};
  items.forEach((i) => {
    totalsByCurrency[i.currency] = (totalsByCurrency[i.currency] || 0) + i.price * i.quantity;
  });

  const order: Order = {
    code,
    user,
    items: items.map((i) => ({ ...i, subtotal: i.price * i.quantity })),
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    totalsByCurrency,
    currency: items[0]?.currency || "PEN",
    status: "pending",
    paymentMethod,
    notes,
    createdAt: new Date().toISOString(),
  };

  const existing = readOrders();
  const next = [order, ...existing];
  writeOrders(next);
  notifyOrdersChanged(next);

  for (const ep of API_ENDPOINTS) {
    try {
      const res = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (res.ok) break;
    } catch {
      // probar siguiente
    }
  }

  return order;
}

export async function updateOrderStatus(code: string, status: Order["status"]): Promise<void> {
  const all = readOrders();
  const updated = all.map((o) => (o.code === code ? { ...o, status } : o));
  writeOrders(updated);
  notifyOrdersChanged(updated);

  for (const ep of API_ENDPOINTS) {
    try {
      const res = await fetch(ep, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status }),
      });
      if (res.ok) break;
    } catch {
      // probar siguiente
    }
  }
}

export function getOrderByCode(code: string): Order | undefined {
  return readOrders().find((o) => o.code === code);
}

export function formatOrderDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export const statusLabels: Record<Order["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};
