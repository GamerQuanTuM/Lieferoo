# address

**What it does (PM view):** the customer finds their address and says exactly where to deliver.
Screens 01 *Delivery address search* and 02 *Address details* of the current app.

| Behaviour | Where |
|---|---|
| Search by building, road or lot address; finds "Itaewon"; Korean typing searches Korean fields | `addresses.ts` → `searchAddresses` |
| 도로명 / 지번 choice, optional unit, "Bldg 105 doesn't exist" warning | `DetailsScreen.tsx`, `addresses.ts` → `checkBuildingNumber` |
| Empty search tips and the "no results" message | `SearchScreen.tsx` |
| Remembers the choice until checkout (sessionStorage) | `draft.ts` |

**Public API** (`index.ts`): `SearchScreen`, `DetailsScreen`, `getAddress`, `searchAddresses`, `addressLineEn`, `checkBuildingNumber`, `toDeliveryAddress`, `loadDraft`, `saveDraft`.

**Depends on:** `domain`, `shared`, `data`. **Used by:** `checkout`, `orders`, `app`.

**Rules to remember**
- Field names come from `docs/resources/B3_data_spec.md`; never rename them.
- The search rule differs from the current service on purpose (customer feedback A5 #1, #4). If you change it, update `addresses.test.ts` and `docs/PRODUCT_OVERVIEW.md`.

**Tests:** `addresses.test.ts`
