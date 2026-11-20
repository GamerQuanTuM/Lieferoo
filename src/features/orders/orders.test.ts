import { describe, expect, it } from "vitest";
import { addressById } from "@/test/fixtures";
import { buildOrder } from "./buildOrder";
import { toKstIso } from "./kst";
import { decodeOrder, encodeOrder } from "./shareToken";

describe("buildOrder", () => {
  it("builds a B2-shaped order with the customer's input", async () => {
    const o = await buildOrder({
      address: addressById("ADR-002"), addressType: "jibun", detail: " 1203, Bldg 101 ", preset: "LEAVE_AT_DOOR_NO_RING",
      riderText: "Gate code is 4826#", storeText: "Not too spicy", noCutlery: true,
    }, new Date("2026-11-19T08:00:00Z"));
    expect(o.order_id).toMatch(/^HN-20261119-\d{4}$/);
    expect(o.ordered_at).toBe("2026-11-19T17:00:00+09:00");
    expect(o.delivery_address).toMatchObject({ address_type: "jibun", detail: "1203, Bldg 101", detail_ko: "101동 1203호", building_name_ko: "한빛마을2단지아파트" });
    expect(o.rider_request.text).toBe("Gate code is 4826#");
    expect(o.rider_request.translation?.clues[0].value).toBe("4826#");
    expect(o.store_request).toMatchObject({ text: "Not too spicy", no_cutlery: true });
    expect(o.store_request.translation?.text_ko).toContain("덜 맵게");
    expect(o.total_krw).toBe(o.subtotal_krw + o.delivery_fee_krw);
  });
  it("allows an empty note and empty detail", async () => {
    const o = await buildOrder({ address: addressById("ADR-001"), addressType: "road", detail: "", preset: null, riderText: "", storeText: "", noCutlery: false });
    expect(o.rider_request).toEqual({ preset: null, text: "" });
    expect(o.delivery_address.detail).toBe("");
  });
});

describe("buildOrder translations", () => {
  it("translates the store request too and keeps the original", async () => {
    const o = await buildOrder({ address: addressById("ADR-001"), addressType: "road", detail: "", preset: null, riderText: "", storeText: "No onions please", noCutlery: true });
    expect(o.store_request.text).toBe("No onions please");
    expect(o.store_request.translation?.text_ko).toContain("양파는 빼주세요");
    expect(o.store_request.no_cutlery).toBe(true);
  });
  it("leaves the translation out when the store request is empty", async () => {
    const o = await buildOrder({ address: addressById("ADR-001"), addressType: "road", detail: "", preset: null, riderText: "", storeText: "  ", noCutlery: false });
    expect(o.store_request).toEqual({ text: "", no_cutlery: false });
  });
});

describe("share token", () => {
  it("round-trips Unicode and rejects garbage", async () => {
    const o = await buildOrder({ address: addressById("ADR-002"), addressType: "road", detail: "101동 1203호", preset: "HAND_TO_ME", riderText: "코드 #3579* 玄関 ñ", storeText: "", noCutlery: false });
    expect(decodeOrder(encodeOrder(o))).toEqual(o);
    expect(decodeOrder("not-a-token!!")).toBeNull();
  });
});

describe("toKstIso", () => {
  it("formats Korea time like the sample data", () => expect(toKstIso(new Date("2026-10-12T11:41:05Z"))).toBe("2026-10-12T20:41:05+09:00"));
});
