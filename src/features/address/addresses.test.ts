import { describe, expect, it } from "vitest";
import { addressById, addresses } from "@/test/fixtures";
import { checkBuildingNumber, searchAddresses } from "./addresses";

describe("address search (B3 §4 plus customer-feedback fixes)", () => {
  it("matches the as-is screen: 'Hanbit' → 3 results", () => expect(searchAddresses(addresses, "Hanbit")).toHaveLength(3));
  it("is case-insensitive and multi-word", () => {
    expect(searchAddresses(addresses, "hanbit VILLAGE complex 2").map((a) => a.address_id)).toEqual(["ADR-002"]);
  });
  it("splits on commas and finds lot numbers", () => expect(searchAddresses(addresses, "Yeonnam-dong, 240-15")[0]?.address_id).toBe("ADR-002"));
  it("A5 #1: 'Itaewon' finds the three Itaewon-dong addresses (whole-word search found none)", () => {
    expect(searchAddresses(addresses, "Itaewon").map((a) => a.address_id).sort()).toEqual(["ADR-011", "ADR-015", "ADR-016"]);
  });
  it("matches word starts while typing", () => expect(searchAddresses(addresses, "Hanb")).toHaveLength(3));
  it("numbers match exactly, not by prefix", () => expect(searchAddresses(addresses, "Hanbit 1").map((a) => a.address_id)).toEqual(["ADR-001"]));
  it("A5 #4: a Korean query searches the Korean fields", () => {
    expect(searchAddresses(addresses, "한빛마을2단지").map((a) => a.address_id)).toEqual(["ADR-002"]);
  });
  it("every keyword must match", () => expect(searchAddresses(addresses, "Hanbit Itaewon")).toEqual([]));
  it("returns [] for blank and unknown", () => {
    expect(searchAddresses(addresses, "  ")).toEqual([]);
    expect(searchAddresses(addresses, "zzzz")).toEqual([]);
  });
});

describe("wrong building number", () => {
  it("warns when the building is not in sub_buildings", () => expect(checkBuildingNumber(addressById("ADR-002"), "1203, Bldg 105")).toMatch(/101, 102, 103/));
  it("accepts a valid building, Korean form, and empty detail", () => {
    expect(checkBuildingNumber(addressById("ADR-002"), "1203, Bldg 101")).toBeNull();
    expect(checkBuildingNumber(addressById("ADR-002"), "102동 1203호")).toBeNull();
    expect(checkBuildingNumber(addressById("ADR-002"), "")).toBeNull();
  });
  it("does not warn for buildings without sub_buildings", () => expect(checkBuildingNumber(addressById("ADR-003"), "Bldg 9")).toBeNull());
});
