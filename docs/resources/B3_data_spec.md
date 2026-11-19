# Lieferoo sample data · Data spec

> Version 1.1 · 2026-11-09 (brand name updated to Lieferoo) · For PM, designers and developers
> Files: `B1_sample_addresses.json` (30 addresses) · `B2_sample_orders.json` (24 orders)

Use the same field names in your PRD, Figma files and code, so everyone on the team is talking about the same thing.

All data is fictional. Road names are real Seoul roads, but building names, building numbers, coordinates, people, phone numbers and notes are made up. Do not use this data for real deliveries or call the phone numbers.

---

## 1. Common rules

| Item | Rule |
|---|---|
| Encoding | UTF-8 |
| File shape | `{ "meta": { … }, "addresses": [ … ] }` and `{ "meta": { … }, "orders": [ … ] }` |
| Time | ISO 8601 in Korea time, e.g. `2026-10-12T20:41:00+09:00` |
| Coordinates | WGS84 decimal degrees, `{ "lat": 37.56342, "lng": 126.92405 }` |
| Money | Korean won, integer, no decimals |
| Empty values | `null` = no value · `""` = the user left the field empty · `[]` = no items |

---

## 2. Addresses (`B1_sample_addresses.json`)

The same records an address search API returns: one record per building.

| Field | Type | Example | Description |
|---|---|---|---|
| `address_id` | string | `"ADR-002"` | Unique ID |
| `building_type` | string | `"apartment"` | See the list below |
| `building_name_ko` | string \| null | `"한빛마을2단지아파트"` | Registered building name in Korean. `null` if the building has no registered name |
| `building_name_en` | string \| null | `"Hanbit Village Complex 2 Apt."` | English name shown in the English app. `null` if there is no name |
| `sub_buildings` | string[] | `["101동", "102동", "103동"]` | Buildings inside the same address (apartment complexes, villas with several buildings). `[]` if there is only one |
| `road_address_ko` | string | `"서울특별시 마포구 동교로51길 10"` | Road name address (도로명 주소), Korean |
| `road_address_en` | string | `"10, Donggyo-ro 51-gil, Mapo-gu, Seoul"` | Road name address, English |
| `jibun_address_ko` | string | `"서울특별시 마포구 연남동 240-15"` | Lot number address (지번 주소), Korean |
| `jibun_address_en` | string | `"240-15, Yeonnam-dong, Mapo-gu, Seoul"` | Lot number address, English |
| `district_ko` / `district_en` | string | `"마포구"` / `"Mapo-gu"` | District (구) |
| `legal_dong_ko` / `legal_dong_en` | string | `"연남동"` / `"Yeonnam-dong"` | Legal neighborhood (법정동) |
| `zip_code` | string | `"03981"` | 5-digit postal code |
| `location` | object | `{ "lat": 37.56342, "lng": 126.92405 }` | Building pin used by the map and the rider's navigation |

**`building_type` values**

| Value | Meaning |
|---|---|
| `apartment` | Apartment complex (아파트) |
| `villa` | Low-rise multi-unit building (빌라 · 다세대) |
| `officetel` | Studio-type office/residential building (오피스텔) |
| `house` | Detached house (단독주택), sometimes split into several homes |
| `mixed_use` | Shops on lower floors, homes above (주상복합) |
| `office` | Office building |
| `goshiwon` | Small single-room housing (고시원) |

---

## 3. Orders (`B2_sample_orders.json`)

Orders from one evening (2026-10-12), captured at `meta.snapshot_at` (21:00). Address fields are copied from B1 at the time of the order.

| Field | Type | Example | Description |
|---|---|---|---|
| `order_id` | string | `"HN-20261012-0001"` | Unique ID |
| `status` | string | `"delivering"` | `delivering` or `delivered` (see below) |
| `app_language` | string | `"en"` | Language of the customer's app when the order was placed: `en` or `ko` |
| `ordered_at` | string | `"2026-10-12T20:18:00+09:00"` | Order placed |
| `picked_up_at` | string | `"2026-10-12T20:41:00+09:00"` | Rider picked up the food |
| `delivered_at` | string \| null | `null` | Rider marked the order as delivered. `null` while delivering |
| `store.store_id` | string | `"ST-01"` | Store ID |
| `store.name_ko` / `store.name_en` | string | `"연남 떡볶이"` / `"Yeonnam Tteokbokki"` | Store name |
| `customer.customer_id` | string | `"CU-1042"` | Customer ID |
| `customer.display_name` | string | `"Maria G."` | Name shown in apps (shortened or masked) |
| `customer.safe_number` | string | `"0504-0000-0001"` | Virtual number the rider calls (안심번호). Dummy value |
| `delivery_address.address_id` | string | `"ADR-002"` | Link to B1 |
| `delivery_address.address_type` | string | `"road"` | Address type the customer chose when saving the address: `road` (도로명) or `jibun` (지번) |
| `delivery_address.building_name_ko` … `jibun_address_en` | string \| null | | Copies of the B1 fields |
| `delivery_address.detail` | string | `"1203, Bldg 101"` | Detailed address, exactly as the customer typed it |
| `delivery_address.location` | object | | Copy of the B1 pin |
| `rider_request.preset` | string \| null | `"LEAVE_AT_DOOR_NO_RING"` | Preset the customer picked. `null` if none |
| `rider_request.text` | string | `"Gate code is 1234#. …"` | Note to the rider, exactly as typed (max 200 characters). `""` if empty |
| `store_request.text` | string | `"Not too spicy please"` | Note to the store, exactly as typed |
| `store_request.no_cutlery` | boolean | `false` | "No disposable cutlery" checked |
| `items[]` | object[] | | `name_ko`, `name_en`, `qty`, `unit_price_krw` |
| `subtotal_krw` | number | `20500` | Sum of items |
| `delivery_fee_krw` | number | `3000` | Delivery fee |
| `total_krw` | number | `23500` | Paid amount |
| `payment.method` / `payment.status` | string | `"card"` / `"paid"` | All sample orders are paid in the app before delivery |
| `rider.rider_id` / `rider.name_masked` | string | `"RD-311"` / `"김*수"` | Assigned rider |

**`status` values**

| Value | When it is set |
|---|---|
| `delivering` | The rider picked up the food (`picked_up_at`) |
| `delivered` | The rider swiped "배달 완료" (Delivered) in the rider app (`delivered_at`) |

Earlier steps (order received, cooking) exist in the real service but are not in this sample.

**`rider_request.preset` values** (labels used in the current apps)

| Code | Customer app (English) | Rider app (Korean) |
|---|---|---|
| `LEAVE_AT_DOOR_NO_RING` | Leave at door, don't ring | 문 앞에 두고 벨은 누르지 말아주세요 |
| `LEAVE_AT_DOOR_RING` | Leave at door, ring bell | 문 앞에 두고 벨 눌러주세요 |
| `HAND_TO_ME` | Hand it to me | 직접 받을게요 |
| `CALL_ON_ARRIVAL` | Call me when you arrive | 도착하면 전화주세요 |

---

## 4. How the current service uses this data (as-is)

This is how Lieferoo works today. It matches the as-is screens (A2) and the as-is user flow (A3).

**Address search (customer app)**
- The keyword is split into words by spaces and commas. A building is a result when every word matches a whole word in its name or address (upper/lower case ignored).
- English app: searches `building_name_en`, `road_address_en`, `jibun_address_en`.
- Korean app: searches `building_name_ko`, `road_address_ko`, `jibun_address_ko`.
- Results show the building name, the road name address and the lot number address.

**Address details (customer app)**
- After picking a result, the customer moves the pin if needed and chooses the address type: 도로명 (`road`) or 지번 (`jibun`). The choice is saved in `delivery_address.address_type`.
- The detailed address is one free-text field (`delivery_address.detail`), saved as typed.

**Checkout (customer app)**
- One optional preset + one free-text note to the rider (`rider_request`), one note to the store (`store_request`). Saved as typed.

**Order detail (rider app, Korean)**
- Shows `building_name_ko`, the address of the type the customer chose (`road_address_ko` or `jibun_address_ko`), `delivery_address.detail` as typed, the Korean preset label and `rider_request.text` as typed.
- Buttons: call the customer (`safe_number`), navigate to `location`, swipe "배달 완료" (sets `delivered`).

---

## 5. Changing the data

- **You can add** fields or records. Use `snake_case` names.
- **Do not rename or delete** existing fields. Other roles on your team depend on them.
- Write down what you added: the PM in the PRD, developers in the README ("Data changes" section).

**Loading the files in a web app**

Put the JSON files in your public/static folder (e.g. `public/data/`) and fetch them:

```js
const { addresses } = await fetch('/data/B1_sample_addresses.json').then((r) => r.json());
const { orders } = await fetch('/data/B2_sample_orders.json').then((r) => r.json());
```
