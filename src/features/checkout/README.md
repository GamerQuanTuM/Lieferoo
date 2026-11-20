# checkout

**What it does (PM view):** the customer writes notes for the store and the rider, places the order, and gets a link to see what the rider sees.
Screen 03 *Checkout · request notes* plus a short "Order placed" screen.

| Behaviour | Where |
|---|---|
| Store request, no-cutlery, 4 quick rider requests, rider note (max 200) | `CheckoutScreen.tsx` |
| "No spicy" typed into the rider note → offer to move it to the store request (A5 #9, #10) | `food.ts` → `splitFoodRequests` |
| Place order → builds the order, translates the rider note and the store request (at the same time), saves it, opens the confirmation. Button says "Translating for your rider…" while it waits | `CheckoutScreen.tsx` → `orders.buildOrder` |
| Translation fails or is slow → the order still goes through with the original text | `translation` pipeline (never throws, 4 s AI limit) |
| Confirmation + shareable rider link + how each note is delivered (translated / partly / original / already Korean) | `PlacedScreen.tsx` (`translation.deliveryStatus`) |
| Guard: no address chosen yet → asks to search first | `CheckoutScreen.tsx` |

**Public API** (`index.ts`): `CheckoutScreen`, `PlacedScreen`, `splitFoodRequests`.

**Depends on:** `address`, `orders`, `translation`, `shared`, `data`, `domain`.

**Rules to remember**
- Menu and payment are out of scope; amounts come from `orders/demoCart.ts`.
- Food-request detection only *suggests*; the customer decides.

**Tests:** `food.test.ts`
