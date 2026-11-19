# orders

**What it does (PM view):** creates the order the customer places, stores it, and hands it to the rider screen. This is the "connection" between the English and Korean screens.

| Behaviour | Where |
|---|---|
| Build an order in the **same shape as the sample orders (B2)**, including the translation | `buildOrder.ts` |
| Fixed demo store, items and fee (menu/payment are out of scope) | `demoCart.ts` |
| Korea-time timestamps like the sample data | `kst.ts` |
| Order in the link (base64url JSON) so the rider screen opens on another device, no backend | `shareToken.ts` |
| Orders placed in this browser + "delivered" taps; finds an order by id or token | `localOrders.ts` |

**Public API** (`index.ts`): `buildOrder`, `newOrderId`, `DEMO_FEE`, `DEMO_SUBTOTAL`, `toKstIso`, `encodeOrder`, `decodeOrder`, `listLocalOrders`, `saveLocalOrder`, `getDeliveredAt`, `markDelivered`, `resolveOrder`, type `OrderInput`.

**Depends on:** `address` (address copy), `translation`, `shared/storage`, `domain`. **Used by:** `checkout`, `rider`.

**Adding a backend later:** replace `shareToken.ts` and `localOrders.ts` with API calls behind the same function names; nothing else changes.

**Known limits:** "delivered" is stored per device, so the customer does not see it.

**Tests:** `orders.test.ts`
