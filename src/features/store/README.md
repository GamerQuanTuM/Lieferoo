# store

**What it does (PM view):** the shop's Korean order screen (new page "Order (Store View)"). Shows the items, their prices, and the customer's request to the store.

| Shown | Source |
|---|---|
| Items, quantity, price | `order.items` |
| "No disposable cutlery" in Korean | `store_request.no_cutlery` |
| Quick requests (chips) with their fixed Korean label, e.g. "맵지 않음" | `store_request.presets` |
| Typed request in Korean (translated at checkout) | `store_request.translation.text_ko` |
| Customer's original text ("고객 원문"), always | `store_request.text` |
| Notice when only part (or nothing) could be translated | `store_request.translation.confidence` |

**Public API** (`index.ts`): `StoreOrderScreen`. **Route:** `#/store/:idOrToken`.

**Depends on:** `orders`, `translation` (Korean chip labels), `shared`, `data`, `domain`.

**Rule:** the customer's original text is never hidden.
