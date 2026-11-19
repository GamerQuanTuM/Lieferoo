# Data model

Source of truth for the sample data: `docs/resources/B3_data_spec.md`. Rule: **use B3 field names exactly; add fields, never rename or delete.** TypeScript types are in `src/domain/types.ts`.

## 1. Sample data (unchanged)
| File | Records | Used for |
|---|---|---|
| `public/data/B1_sample_addresses.json` | 30 addresses | Address search and the address copied into an order |
| `public/data/B2_sample_orders.json` | 24 orders (18 delivered, 6 delivering) | The rider list and the shape every new order follows |

Loaded at runtime by `src/data/DataProvider.tsx` (`fetch` from `${BASE_URL}data/…`). Tests read the same files via `src/test/fixtures.ts`.

## 2. How we use the fields
| Field | Used by |
|---|---|
| `building_name_en/ko`, `road_address_en/ko`, `jibun_address_en/ko` | Search (English fields; Korean fields when the query has Hangul), results, rider screen |
| `sub_buildings` | Wrong-building warning (e.g. Bldg 105 vs 101–103) |
| `delivery_address.address_type` (`road`/`jibun`) | Which address the rider screen shows first |
| `delivery_address.detail` | Shown to the rider as typed; also normalised to Korean (see §3) |
| `rider_request.preset` | Korean label from the data spec (`PRESET_LABEL_KO`) |
| `rider_request.text` | Translated, clues extracted, original always shown |
| `store_request.text/no_cutlery` | Stored on the order (no shop screen) |
| `customer.safe_number` | The rider's "call the customer" button (`tel:`) |
| `delivery_address.location` | The rider's "navigate" link |
| `status`, `delivered_at` | Rider status pill and the "delivered" button |

## 3. What we added (documented in the README → Data)
All optional, `snake_case`, only on orders created by the app:

```jsonc
"delivery_address": {
  "detail_ko": "101동 1203호"          // conservative Korean form of `detail`; absent if not fully understood
},
"rider_request": {
  "translation": {
    "source_lang": "en",                // en | ja | zh | vi | ko | other
    "text_ko": "벨은 누르지 말아주세요. 아기가 자고 있어요.",   // "" when nothing could be translated
    "clues": [
      { "type": "door_code", "value": "4826#", "label_ko": "출입 비밀번호" },   // value is verbatim
      { "type": "no_bell",   "value": "벨 누르지 않기", "label_ko": "주의" }
    ],
    "engine": "rules",                  // rules | ai
    "confidence": "high"                // high | low (low → rider screen asks to check the original)
  }
}
```
Clue types: `door_code`, `building`, `floor`, `no_bell`, `call_first`, `underground`.

New orders also use a fixed demo store, items, customer and rider (`features/orders/demoCart.ts`, `buildOrder.ts`) because menu and payment are out of scope.

## 4. An order created by the app (abridged)
```jsonc
{
  "order_id": "HN-20261119-5566", "status": "delivering", "app_language": "en",
  "ordered_at": "2026-11-19T22:45:28+09:00", "picked_up_at": "2026-11-19T22:45:28+09:00", "delivered_at": null,
  "store": { "store_id": "ST-01", "name_ko": "연남 떡볶이", "name_en": "Yeonnam Tteokbokki" },
  "delivery_address": { "address_id": "ADR-002", "address_type": "road", "detail": "1203, Bldg 101", "detail_ko": "101동 1203호", "…": "B1 copy" },
  "rider_request": { "preset": "LEAVE_AT_DOOR_NO_RING", "text": "Gate code is 4826#. …", "translation": { "…": "see §3" } },
  "store_request": { "text": "", "no_cutlery": false },
  "total_krw": 23500, "payment": { "method": "card", "status": "paid" }
}
```

## 5. Where data lives at runtime
| What | Where | Key | Notes |
|---|---|---|---|
| Address chosen before checkout | `sessionStorage` | `lieferoo.draft.v1` | Cleared when the tab closes |
| Orders placed on this device | `localStorage` | `lieferoo.orders.v2` | Newest first, max 50 |
| "Delivered" taps | `localStorage` | `lieferoo.delivered.v1` | `{ orderId: isoTime }`, per device |
| Order for another device | URL hash | `#/placed/<token>`, `#/rider/<token>` | base64url of the order JSON |

All storage goes through `src/shared/storage.ts`, which survives blocked or full storage.

## 6. Changing the model
1. Add the field to `src/domain/types.ts` (optional).
2. Fill it in `features/orders/buildOrder.ts` (and `features/translation` if it is derived from the note).
3. Update this file and the README "Data" section.
4. Add a test; if you rename or remove a B3 field, stop: other roles depend on it.
