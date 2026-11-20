# store

**What it does (PM view):** the shop's Korean order screen (new page "Order (Store View)"). Shows the items, their prices, and the customer's request to the store.

| Shown | Source |
|---|---|
| Items, quantity, price | `order.items` |
| "No disposable cutlery" in Korean | `store_request.no_cutlery` |
| Customer's request as typed (not translated) | `store_request.text` |

**Public API** (`index.ts`): `StoreOrderScreen`. **Route:** `#/store/:idOrToken`.

**Depends on:** `orders`, `shared`, `data`, `domain`.

**Rule:** the customer's original text is never hidden.
