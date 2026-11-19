import { describe, expect, it } from "vitest";
import { samples } from "@/test/fixtures";
import { splitFoodRequests } from "./food";

describe("food requests in the rider note (A5 #9, #10)", () => {
  it("splits a food sentence from the rest", () => {
    expect(splitFoodRequests("No spicy please. Ivy Officetel, NOT Ivy Residence. Code 5050#")).toEqual({
      food: "No spicy please.", rest: "Ivy Officetel, NOT Ivy Residence. Code 5050#",
    });
  });
  it("finds the sample orders that made this mistake", () => {
    const hit = samples.filter((o) => splitFoodRequests(o.rider_request.text).food).map((o) => o.order_id);
    expect(hit).toEqual(expect.arrayContaining(["HN-20261012-0009", "HN-20261012-0012", "HN-20261012-0016"]));
  });
  it("leaves delivery-only notes alone", () => expect(splitFoodRequests("Gate code is 4826#. Please don't ring the bell").food).toBe(""));
});
