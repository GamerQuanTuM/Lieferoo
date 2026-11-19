import type { Order } from "@/domain/types";

/**
 * Menu, shop choice and payment are out of scope (brief §3), so every new order
 * carries the same demo cart. Values mirror sample order HN-20261012-0001.
 */
export const DEMO_STORE: Order["store"] = { store_id: "ST-01", name_ko: "연남 떡볶이", name_en: "Yeonnam Tteokbokki" };

export const DEMO_ITEMS: Order["items"] = [
  { name_ko: "로제 떡볶이 (2인분)", name_en: "Rose tteokbokki (for 2)", qty: 1, unit_price_krw: 16000 },
  { name_ko: "군만두", name_en: "Fried dumplings", qty: 1, unit_price_krw: 4500 },
];

export const DEMO_FEE = 3000;
export const DEMO_SUBTOTAL = DEMO_ITEMS.reduce((sum, i) => sum + i.qty * i.unit_price_krw, 0);
