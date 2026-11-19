import { describe, expect, it } from "vitest";
import { addresses, samples } from "./fixtures";

describe("sample data (B1, B2)", () => {
  it("has 30 addresses and 24 orders", () => {
    expect(addresses).toHaveLength(30);
    expect(samples).toHaveLength(24);
  });
  it("every order points at an existing address", () => {
    const ids = new Set(addresses.map((a) => a.address_id));
    for (const o of samples) expect(ids.has(o.delivery_address.address_id), o.order_id).toBe(true);
  });
});
