/**
 * Domain types. Field names follow B3_data_spec.md exactly (snake_case, never renamed).
 * Fields marked NEW are our additions and are documented in README → Data.
 */

export type BuildingType =
  | "apartment" | "villa" | "officetel" | "house" | "mixed_use" | "office" | "goshiwon";

export interface Address {
  address_id: string;
  building_type: BuildingType;
  building_name_ko: string | null;
  building_name_en: string | null;
  sub_buildings: string[];
  road_address_ko: string;
  road_address_en: string;
  jibun_address_ko: string;
  jibun_address_en: string;
  district_ko: string;
  district_en: string;
  legal_dong_ko: string;
  legal_dong_en: string;
  zip_code: string;
  location: { lat: number; lng: number };
}

export type AddressType = "road" | "jibun";

export type RiderPreset =
  | "LEAVE_AT_DOOR_NO_RING"
  | "LEAVE_AT_DOOR_RING"
  | "HAND_TO_ME"
  | "CALL_ON_ARRIVAL";

export type SourceLang = "en" | "ja" | "zh" | "vi" | "ko" | "other";

export interface Clue {
  type: "door_code" | "building" | "floor" | "no_bell" | "call_first" | "underground";
  /** Verbatim for door codes (never translated). */
  value: string;
  label_ko: string;
}

/** NEW: produced once when the order is placed (or on the fly for the sample orders). */
export interface Translation {
  source_lang: SourceLang;
  text_ko: string;
  clues: Clue[];
  engine: "rules" | "ai";
  /** "low" makes the rider screen say "check the original". */
  confidence: "high" | "low";
}

export interface DeliveryAddress {
  address_id: string;
  address_type: AddressType;
  building_name_ko: string | null;
  building_name_en: string | null;
  road_address_ko: string;
  road_address_en: string;
  jibun_address_ko: string;
  jibun_address_en: string;
  /** As the customer typed it. */
  detail: string;
  /** NEW, optional: conservative Korean normalisation, e.g. "101동 1203호". */
  detail_ko?: string;
  location: { lat: number; lng: number };
}

export interface OrderItem {
  name_ko: string;
  name_en: string;
  qty: number;
  unit_price_krw: number;
}

/** Same shape as a B2 order, so sample and new orders share one renderer. */
export interface Order {
  order_id: string;
  status: "delivering" | "delivered";
  app_language: "en" | "ko";
  ordered_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
  store: { store_id: string; name_ko: string; name_en: string };
  customer: { customer_id: string; display_name: string; safe_number: string };
  delivery_address: DeliveryAddress;
  rider_request: { preset: RiderPreset | null; text: string; translation?: Translation };
  store_request: { text: string; no_cutlery: boolean };
  items: OrderItem[];
  subtotal_krw: number;
  delivery_fee_krw: number;
  total_krw: number;
  payment: { method: string; status: string };
  rider: { rider_id: string; name_masked: string };
}

export const NOTE_MAX_LENGTH = 200;
