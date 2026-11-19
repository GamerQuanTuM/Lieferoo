# rider

**What it does (PM view):** the Korean screen the rider uses. It must show what the customer entered, so the rider can find the door and get in.
Screen 04 *Rider order detail* plus a demo order list.

| What the rider sees | Source |
|---|---|
| Building name and the address of the type the customer chose (도로명 or 지번); the other address as a small line | `delivery_address` |
| Unit in Korean (e.g. 101동 1203호) with the customer's original below | `translation.normalizeDetail` |
| Quick request in Korean | `translation.PRESET_LABEL_KO` |
| **Door code in a large box above the note** | `translation` clues |
| Korean translation of the note + the original text; a warning when only part (or none) could be translated | `translation.translateRiderNote` |
| Call the customer, navigate, mark delivered (status changes) | `RiderScreen.tsx`, `orders.markDelivered` |
| List of the 24 sample orders plus orders placed on this device | `RiderListScreen.tsx` |

**Public API** (`index.ts`): `RiderScreen`, `RiderListScreen`.

**Depends on:** `orders`, `translation`, `shared`, `data`, `domain`.

**Rules to remember**
- Never hide the customer's original text: a wrong translation must not be the only thing the rider sees.
- All user-visible strings on this screen are Korean (`lang="ko"`).

**Tests:** covered through `translation` and `orders` tests; screen behaviour is checked with the steps in `HANDOFF.md`.
