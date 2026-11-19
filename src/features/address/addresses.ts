import type { Address, AddressType, DeliveryAddress } from "@/domain/types";

/** Split by spaces and commas, case-insensitive (same as the current service, B3 §4). */
const words = (s: string): string[] => s.toLowerCase().split(/[\s,]+/).filter(Boolean);
/**
 * Words, plus useful parts of hyphenated words: "Itaewon-dong" → itaewon, dong · "17-gil" → gil, 17.
 * Lot numbers like "239-2" are NOT split, so a search for "2" cannot hit "239-2".
 */
const pieces = (s: string): string[] =>
  words(s).flatMap((w) => {
    if (!w.includes("-")) return [w];
    const parts = w.split("-").filter(Boolean);
    const out = [w, ...parts.filter((p) => /[a-z가-힣]/.test(p))];
    if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^[a-z가-힣]+$/.test(parts[1])) out.push(parts[0]);
    return out;
  });
const HANGUL = /[가-힣]/;

export function getAddress(addresses: Address[], id: string): Address | undefined {
  return addresses.find((a) => a.address_id === id);
}

/**
 * Differs from the current service on purpose (customer feedback A5 #1, #4):
 *  - whole-word matching returned NOTHING for "Itaewon" although three addresses are in "Itaewon-dong";
 *    we match word starts and hyphen parts instead, and every keyword must still match.
 *  - a query typed in Korean searches the Korean fields (English queries search English fields).
 */
export function searchAddresses(addresses: Address[], query: string): Address[] {
  const q = words(query);
  if (q.length === 0) return [];
  const korean = HANGUL.test(query);
  return addresses.filter((a) => {
    const fields = korean
      ? [a.building_name_ko, a.road_address_ko, a.jibun_address_ko]
      : [a.building_name_en, a.road_address_en, a.jibun_address_en];
    const bag = fields.filter((v): v is string => !!v).flatMap(pieces);
    // Numbers must match exactly ("2" must not match "24"); words may match by prefix.
    return q.every((w) => bag.some((t) => (/^\d+$/.test(w) ? t === w : t.startsWith(w))));
  });
}

/** English line for the chosen address type (road or lot). */
export function addressLineEn(a: Pick<Address, "road_address_en" | "jibun_address_en">, type: AddressType): string {
  return type === "road" ? a.road_address_en : a.jibun_address_en;
}

/**
 * "Wrong address" check: if the complex has numbered buildings (sub_buildings) and the unit
 * names a building that is not in the list (e.g. "Bldg 105" vs 101–104), return a warning.
 */
export function checkBuildingNumber(address: Address, detail: string): string | null {
  if (address.sub_buildings.length === 0) return null;
  const m = detail.match(/\b(?:Bldg|Building)\.?\s*(\d{1,4})\b/i) ?? detail.match(/(\d{1,4})\s*동/);
  if (!m) return null;
  const known = address.sub_buildings.map((s) => s.replace(/\D/g, ""));
  if (known.includes(m[1])) return null;
  return `This address has buildings ${known.join(", ")}. Please check the building number (${m[1]}).`;
}

export function toDeliveryAddress(a: Address, type: AddressType, detail: string, detailKo?: string): DeliveryAddress {
  return {
    address_id: a.address_id,
    address_type: type,
    building_name_ko: a.building_name_ko,
    building_name_en: a.building_name_en,
    road_address_ko: a.road_address_ko,
    road_address_en: a.road_address_en,
    jibun_address_ko: a.jibun_address_ko,
    jibun_address_en: a.jibun_address_en,
    detail,
    ...(detailKo ? { detail_ko: detailKo } : {}),
    location: a.location,
  };
}
