/**
 * Customer feedback A5 #9/#10: "No spicy please" / "no cilantro" written in the RIDER note never
 * reached the shop. Sample orders -0009, -0012, -0016 show the same mistake.
 * We only detect and offer to move the sentence; the customer stays in control.
 */
const FOOD_RE =
  /\b(?:no|without|extra|less|not too)\s+(?:spicy|cilantro|pickles?|onions?|peanuts?|garlic|ice|sauce|cheese|mayo|wasabi)\b|\bspicy\b/i;

export function splitFoodRequests(note: string): { food: string; rest: string } {
  const parts = note.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const food = parts.filter((p) => FOOD_RE.test(p));
  const rest = parts.filter((p) => !FOOD_RE.test(p));
  return { food: food.join(" "), rest: rest.join(" ") };
}
