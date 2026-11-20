import type { Address, AddressType, Order, RiderPreset } from "@/domain/types";
import { toDeliveryAddress } from "@/features/address";
import { normalizeDetail, translateRiderNote, translateStoreNote } from "@/features/translation";
import { DEMO_FEE, DEMO_ITEMS, DEMO_STORE, DEMO_SUBTOTAL } from "./demoCart";
import { toKstIso } from "./kst";

export function newOrderId(now = new Date()): string {
  const ymd = toKstIso(now).slice(0, 10).replace(/-/g, "");
  return `HN-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`; // sample ids are 0001–0024, so no clash
}

export interface OrderInput {
  address: Address;
  addressType: AddressType;
  detail: string;
  preset: RiderPreset | null;
  riderText: string;
  storeText: string;
  noCutlery: boolean;
}

/**
 * Builds a B2-shaped order, including the translations (decided at placement).
 * Both notes are translated at the same time; translation never throws, and the original text is always kept,
 * so a failed or slow translation still places the order (the rider / store then see the original).
 */
export async function buildOrder(input: OrderInput, now = new Date()): Promise<Order> {
  const detail = input.detail.trim();
  const text = input.riderText.trim();
  const storeText = input.storeText.trim();
  const iso = toKstIso(now);
  const [translation, storeTranslation] = await Promise.all([
    text ? translateRiderNote(text) : undefined,
    storeText ? translateStoreNote(storeText) : undefined,
  ]);
  return {
    order_id: newOrderId(now),
    status: "delivering",
    app_language: "en",
    ordered_at: iso,
    picked_up_at: iso, // demo: no cooking step, the rider already has the food
    delivered_at: null,
    store: DEMO_STORE,
    customer: { customer_id: "CU-DEMO", display_name: "Demo customer", safe_number: "0504-0000-0000" },
    delivery_address: toDeliveryAddress(input.address, input.addressType, detail, normalizeDetail(detail) ?? undefined),
    rider_request: { preset: input.preset, text, ...(translation ? { translation } : {}) },
    store_request: {
      text: storeText,
      no_cutlery: input.noCutlery,
      ...(storeTranslation ? { translation: storeTranslation } : {}),
    },
    items: DEMO_ITEMS,
    subtotal_krw: DEMO_SUBTOTAL,
    delivery_fee_krw: DEMO_FEE,
    total_krw: DEMO_SUBTOTAL + DEMO_FEE,
    payment: { method: "card", status: "paid" },
    rider: { rider_id: "RD-DEMO", name_masked: "김*수" },
  };
}
