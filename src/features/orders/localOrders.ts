import type { Order } from "@/domain/types";
import { localStore, readJson, writeJson } from "@/shared/storage";
import { decodeOrder } from "./shareToken";

const ORDERS_KEY = "lieferoo.orders.v2";
const DELIVERED_KEY = "lieferoo.delivered.v1";

/** Orders placed in this browser, newest first. */
export function listLocalOrders(): Order[] {
  const v = readJson<unknown>(localStore(), ORDERS_KEY, []);
  return Array.isArray(v) ? (v as Order[]) : [];
}

export function saveLocalOrder(order: Order): void {
  const next = [order, ...listLocalOrders().filter((o) => o.order_id !== order.order_id)].slice(0, 50);
  writeJson(localStore(), ORDERS_KEY, next);
}

/** "Delivered" taps are kept per device (the sample orders are read-only files). */
export function getDeliveredAt(orderId: string): string | null {
  return readJson<Record<string, string>>(localStore(), DELIVERED_KEY, {})[orderId] ?? null;
}

export function markDelivered(orderId: string, iso: string): void {
  const all = readJson<Record<string, string>>(localStore(), DELIVERED_KEY, {});
  all[orderId] = iso;
  writeJson(localStore(), DELIVERED_KEY, all);
}

/** The rider route param is a sample or local order id, or a share token. */
export function resolveOrder(param: string, samples: Order[]): Order | null {
  const found =
    samples.find((o) => o.order_id === param) ??
    listLocalOrders().find((o) => o.order_id === param) ??
    decodeOrder(param);
  if (!found) return null;
  const deliveredAt = found.delivered_at ?? getDeliveredAt(found.order_id);
  return deliveredAt ? { ...found, status: "delivered", delivered_at: deliveredAt } : found;
}
