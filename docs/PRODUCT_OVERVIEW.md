# Product overview

Audience: PM, designer, marketer (no code needed). Technical detail is in [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. The problem and the idea
Lieferoo's app has an English version, but what a foreign customer types (address details and notes) reaches the Korean-speaking rider **exactly as typed**. Riders miss door codes, can't read English notes, and deliveries fail or run late.

**Our fix:** when the customer places the order, the rider screen shows what the rider needs **in Korean**, with the **door code first and large**, and always the customer's original text beside it.

## 2. Evidence: customer feedback samples (A5) → what we built
| A5 # | Complaint | What the product does now |
|---|---|---|
| 1 | Searched "Itaewon", nothing came up | Search matches word starts and neighbourhood names: "Itaewon" finds the 3 Itaewon-dong addresses |
| 2 | Rider went to a similarly named complex | Search results show name + road + lot address; rider sees the Korean name and both addresses |
| 3 | Didn't know 도로명 vs 지번 | Default 도로명 with a help line; the rider always sees both |
| 4 | Couldn't search in English, cancelled | Typing Korean searches the Korean address fields |
| 5, 7 | Door code in the note was missed (30 / 10 min delay) | The code is pulled out and shown in a large box above the note |
| 6 | Building with no sign | **Not solved**: no landmark/photo field in the data |
| 8 | Rider couldn't read a long English note | Korean translation + original; a warning when it could not be translated |
| 9, 10 | "No spicy" written in the rider note, shop never saw it | Checkout offers to move it to the store request |

## 3. Screens and flow
```
Customer (English)                                   Rider (Korean)
01 Search ─► 02 Address details ─► 03 Checkout ─► Order placed ─► [link] ─► 04 Rider order detail
 find the     도로명/지번 + unit     notes for store    shows the rider       what the rider reads,
 building     (+ wrong-building      and rider          link                  + call, navigate, delivered
              warning)
```
Also: a rider order list (the 24 sample orders + any order placed on this device), reachable from the first screen ("Open the rider app (demo)").

| Screen | Customer sees / does | PM check |
|---|---|---|
| 01 Search | Type a name, road, lot or neighbourhood; tips when empty; message when nothing matches | Search "Itaewon", "한빛마을", "zzzz" |
| 02 Details | Choose 도로명/지번, type unit (optional) | Unit "1203, Bldg 105" on Hanbit Village Complex 2 shows a warning |
| 03 Checkout | Store request, no-cutlery, 4 quick rider requests, rider note (200 chars) | Type "No spicy please. Gate code 1234#" in the rider note → hint to move it |
| 04 Rider | Korean address, unit in Korean (+ original), quick request, **door code box**, Korean note + original, notice if only partly translated, call / navigate / delivered | Open sample order HN-20261012-0004 (Japanese) → original shown + notice; code still highlighted |
| Pin on Maps | From search: tap the map to move the pin, nearest sample address is shown, Confirm Location | Search "zzzz" → Pin on Maps → tap → Confirm |
| Order Tracking | Progress (placed, accepted, pickup, delivered), rider name, the customer's rider request | After ordering, tap Track my order; mark delivered on the rider screen and reopen |
| Store order (Korean) | Items, price, customer's store request as typed, no-cutlery in Korean | After ordering, open the store order screen |

## 4. Quality bar (what "handled" means)
| Situation | Behaviour |
|---|---|
| Empty search / no results | Tips / helpful message |
| Wrong building number | Warning, can still continue |
| Empty note or empty unit | Valid; rider sees "요청사항 없음" or a call-the-customer hint |
| Note in another language | Original + notice; door code still extracted |
| Translation fails | Never blocks the order |
| Bad address or rider link | Clear message with a way back |

## 5. Built vs not built
**Built:** everything in section 3, translation of common English phrases, Korean unit formatting, door-code extraction, cross-device rider link, delivered status (per device), tests and a rule-enforcing architecture test.

**Not built (and why)**
| Item | Reason |
|---|---|
| Real map, location, address API, pin moving | Out of scope per brief |
| Menu, payment, shop choice | Out of scope; every new order uses one demo cart |
| Shop screen | Not a screen in the brief; the moved food request is stored but not displayed |
| Photos / landmarks (A5 #6), chat | Need new data and scope |
| AI translation | Hook exists; needs a team decision, an API key and a small server function |
| Customer sees "delivered" | Needs a backend |

## 6. Decisions and risks for the PM
1. **AI translation?** It would translate any language but sends notes (including door codes) to an outside service. Without it, Japanese/Chinese/Vietnamese notes show the original + a notice.
2. **Backend?** Only needed if the customer must see "delivered" or devices must share state.
3. **Marketer promises** must match this list: anything not built must not be promised on the live link.
4. **Designer screens:** styling follows the as-is layouts in the guide's orange; adjust when new screens arrive.

## 7. Terms
- **Rider**: the delivery person (라이더). **도로명**: road-name address. **지번**: lot-number address.
- **Clue**: a key fact pulled out of a note (door code, building, floor, "don't ring", "call me", underground entrance).
- **Door code**: the entrance password; it is copied exactly, never translated.
