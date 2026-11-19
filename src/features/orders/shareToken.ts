import type { Order } from "@/domain/types";

/**
 * Share link: the whole order as base64url(UTF-8 JSON), so the rider screen works on another
 * device with no backend. Swap this module (and localOrders) for API calls if a server is added.
 */
export function encodeOrder(order: Order): string {
  const bytes = new TextEncoder().encode(JSON.stringify(order));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeOrder(token: string): Order | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))) as Order;
    const ok = o && typeof o.order_id === "string" && o.delivery_address?.address_id && o.rider_request && typeof o.rider_request.text === "string";
    return ok ? o : null;
  } catch {
    return null;
  }
}
