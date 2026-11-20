# QA handoff note · V1 Build both screens and connect the sample data · v1

**Test link:** TODO — opens on a phone-sized screen
**Repository:** TODO · **Commit / tag:** TODO
**Tested on:** Chrome mobile view 390×844

## How to test the core flow

1. Open the test link.
2. Search "Hanbit" → pick "Hanbit Village Complex 2 Apt." (ADR-002).
3. Unit "1203, Bldg 101" → Save address.
4. Tap "Leave at door, don't ring" and type: "Gate code is 4826#. Building 101 is the first one on the left from the main gate. Please don't ring the bell, baby sleeping" → Place order.
5. Tap "See what the rider sees". Check: 한빛마을2단지아파트 + Korean road address, 101동 1203호, Korean preset, highlighted 출입 비밀번호 4826#, Korean translation, English original, and a notice that only part was translated.
6. Tap 배달 완료 → status turns 배달 완료. Open "Open the rider app" on the first screen to see all 24 sample orders (e.g. HN-20261012-0004 Japanese, -0007 Chinese, -0018 Vietnamese).

## Built

- Address search, unit + note form, rider screen in Korean — see steps above.

## Not built (and why)

- Map/address API, payment, dispatch — out of scope per brief.

## States handled

| State | Where | How to see it |
|---|---|---|
| Empty field | Details screen | Tap Place order with the unit field empty |
| No search results | Search screen | Search "zzzz" |
| Search by neighborhood / Korean | Search screen | Type "Itaewon" → 3 results; type "한빛마을" → Hanbit results |
| Food request in the rider note | Checkout | Type "No spicy please. Gate code 1234#" in the rider note → hint → "Move to Request to the store" |
| Wrong building number | Details screen | Pick Hanbit Village Complex 2 Apt., unit "1203, Bldg 105" → warning (buildings 101, 102, 103) |
| Unknown address / bad link | Details / rider | Open `#/address/ADR-999` or `#/rider/xyz` |
| Empty note / empty unit | Checkout / rider | Place an order with both empty → rider shows 요청사항 없음 and a call-the-customer hint |
| Translation not possible | Rider | Order HN-20261012-0004 (Japanese): original + notice, door code still highlighted |
| Translation not fully possible | Checkout → Order placed | Type a sentence the phrasebook doesn't know (e.g. "The blue gate next to the florist") → the order still places; "Order placed" says per note whether it went in Korean, partly, or as the original |
| Store request in English | Checkout → Order placed | Type "Not too spicy please, no cilantro" in Request to the store → "Request to the store: translated to Korean" (stored as `store_request.translation`) |

## Known bugs

- Partial note translation (phrasebook) — see README Known issues.
