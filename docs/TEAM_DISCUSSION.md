# Lieferoo · The last 100 m — Developer worksheet

Sources: Developer_brief v1.1, problem statement, as-is screens 01–05 + user flow, B1/B2 sample data, **B3 data spec v1.1**, Design Guide lite + tokens, UI Kit .fig (a kit of colors/type/components, not new screens).

---

# PART 1 · Understand the requirement and ask primary questions

## 1.1 The problem in one paragraph
Lieferoo's app is in English, but the address details and the notes the customer types go to the Korean rider exactly as typed. Foreign users report far more failed and late deliveries. We make **one flow** work: the customer enters an address and notes in English, and the rider sees what they need, in Korean, on one screen, until the delivery is done. Then the launch (marketer) tells users and riders about it, and everything promised must work on our live link.

## 1.2 What the rider app shows today (B3 §4) and where it breaks
| Rider screen item | Source field | Today | Problem for a Korean rider |
|---|---|---|---|
| Building name | `building_name_ko` | Korean | none |
| Address | `road_address_ko` **or** `jibun_address_ko`, per `delivery_address.address_type` the customer chose | Korean | none, but rider sees only the type chosen |
| Detail (unit/floor) | `delivery_address.detail` | exactly as typed | "1203, Bldg 101", "Flat 2B", "201号室", "Phòng 312" |
| Preset | `rider_request.preset` | Korean label | none |
| Free-text note | `rider_request.text` (max 200) | exactly as typed | door codes, entrance, "not that building", language the rider can't read |
| Buttons | `safe_number`, `location`, swipe 배달 완료 → `delivered` | work | — |

**Conclusion:** address and presets are solved by the data. The gap is `delivery_address.detail` and `rider_request.text`.

## 1.3 What real notes contain (B2, 24 orders)
- Door/gate codes: `4826#`, `*2580`, `#3579*`, `0415*`, `1234#`.
- "Not that building": "Green Ville 2 not Green Ville", "Saebom PARK, not Saebom Apt", "Ivy Officetel, NOT Ivy Residence".
- Route/entrance: underground entrance, outside stairs to rooftop, basement stairs on the right, between two cafes, glass door next to the pilates studio.
- Behaviour: don't ring (baby sleeping), call me, knock loudly, don't leave with the guard, riders can't enter office floors.
- Languages: English, Japanese, Chinese, Vietnamese, romanized Korean, Korean, and empty (`""`).
- Detail forms vary: `1203, Bldg 101`, `102-1501`, `#715`, `Room 812`, `8F, Nexus Labs`, `2nd floor, green door`, `rooftop`, `B01`, and sometimes empty.

## 1.3b Evidence: customer feedback samples (A5, 10 inquiries) → clue selection
Counts by type: can't find the address 4 · can't get into the building 3 · request didn't reach the right place 2 · can't reach the customer 1.

| A5 # | What happened | Clue / cause | What the app does now | Status |
|---|---|---|---|---|
| 1 | Typed "Itaewon", nothing came up | Whole-word search; 3 sample addresses are in "Itaewon-dong" | Word-start + hyphen-part matching; verified: "Itaewon" → ADR-011, -015, -016 | Done |
| 2 | Rider went to a similarly named complex | Names like Hanbit Village 1/2/Villa, Green Ville ×3, Saebom Apt/Park | Results show name + road + lot; rider sees Korean name + both addresses | Done |
| 3 | Didn't know 도로명 vs 지번 | Unexplained choice | Default 도로명, help text; rider always sees both | Done |
| 4 | Couldn't search in English, cancelled | English-only fields | A Korean query searches the Korean fields | Done |
| 5, 7 | Door code in the note was missed (30 / 10 min delay) | Code buried in free text | Code extracted verbatim and shown first, large, in its own box | Done |
| 6 | Officetel without a sign | No landmark field in the data | Note text is shown; no photo/landmark field | Left out |
| 8 | Rider couldn't read a long English note | No translation | Korean text + original; AI for other languages | Rules done, AI pending |
| 9, 10 | "No spicy" / "no cilantro" written in the rider note, shop never saw it | Customers mix up the two boxes (samples -0009, -0012, -0016) | Checkout detects it and offers to move it to the store request | Done (checkout side) |

Left out and why: in-app chat/calling, photos of the entrance, a shop screen (brief: not a screen). All need new data or scope.

## 1.3c C3 One Page Summary
The PM types 4 answers (≤ 1,500 characters each) on the final submission screen; they must match the PRD and QA report. The developer's inputs are in `docs/ONE_PAGE_SUMMARY_INPUT.md`.

## 1.4 What the brief requires
- Mobile web, 2–3 screens: customer screen(s) in English, rider screen in Korean. Test on a phone-sized screen.
- Core evaluation: **what the customer enters must actually show up on the rider screen.**
- Meets: core flow runs end to end. Exceeds: also handles empty fields, "no search results", wrong addresses; explains which clues were chosen and dropped; applies a mid-project change by its due time with the scope change recorded.
- Not built / not evaluated: sign-up, payment, shop/menu choice, real map/address API, dispatch, Lieferoo branding. Restyling the as-is screens alone is not evaluated. AI translation is allowed, not required.
- Done = public https link + public GitHub repo with README (all template sections) + `HANDOFF.md` + all 6 Task List items checked. Timing: task about 6 h, recommended due T0+40h (PM sets it), project end T0+49h (fixed).
- Data rules (B3 §5): you may add fields/records in `snake_case`; **never rename or delete existing fields**; write additions in the README "Data" section.

## 1.5 Answered already
| Question | Answer (source) |
|---|---|
| Where is the Data Guide? | B3_data_spec.md, now read |
| Scope of screens? | 2–3 screens; customer EN + rider KO (brief §2) |
| Is the shop a screen? | No. `store_request` is data only; optional |
| AI translation? | Allowed, not required, not evaluated (brief §3) |
| Does design come from us? | Designer hands screens + specs in both languages; dev may start before approval (brief §5) |
| Look and feel? | As-is screens are the grayscale version of the guide (Orange 600 → Neutral 800); the final look uses the orange tokens |

## 1.6 Primary questions still open
**To PM / designer (blocking)**
1. What is my exact task wording and due time on the board? Any scope-change notice yet?
2. Is there a marketer? What do their banner / push / social / rider notice promise? Each promise must work on the live link.
3. Are the designer's screens ready? If not, may I build on the as-is layout in orange tokens for now?
4. Clue priority for the rider. Proposal: (1) door/entrance code, (2) building + unit incl. "not that building", (3) entrance/route, (4) floor, (5) call/bell preference. What may we drop, and may the summary state why?
5. How does the PM test: one phone, or customer on one device and rider on another?

**To the dev team (decide in Part 2)**
6. Does the rider screen also need to show the existing 24 sample orders (delivering/delivered), or only the order just placed?
7. Do we implement "swipe 배달 완료" (sets `delivered`), call customer, navigate? The brief doesn't list them; marketer promises may.
8. What counts as a **wrong address** for the error state? (see 2.4)
9. Which GitHub and Vercel accounts host the public repo and live link?

---

# PART 2 · Discuss and decide: data structure and implementation approach

Fill the "Decision" column in the team meeting. "Rec." is my recommendation.

## 2.1 Data structure
**Principle:** keep B1/B2 field names exactly; the order we create must have the **same shape as a B2 order**, so the rider screen can render both sample orders and new ones with the same code.

New order (customer side), B2 shape:
```jsonc
{
  "order_id": "HN-20261119-0001", "status": "delivering", "app_language": "en",
  "ordered_at": "...+09:00",
  "delivery_address": {
    "address_id": "ADR-002", "address_type": "road",      // customer's 도로명/지번 choice
    /* building_name_*, road_/jibun_address_* copied from B1 */
    "detail": "1203, Bldg 101",                            // as typed, unchanged
    "location": { "lat": 0, "lng": 0 }
  },
  "rider_request": { "preset": "LEAVE_AT_DOOR_NO_RING", "text": "as typed, max 200" },
  "store_request": { "text": "", "no_cutlery": false }
}
```
Additions (snake_case, listed in README → Data):
```jsonc
"rider_request": {
  "translation": {                       // NEW, created at order time
    "source_lang": "en|ja|zh|vi|ko|other",
    "text_ko": "string",                 // best effort
    "clues": [ { "type": "door_code|building|unit|entrance|floor|call_first|no_bell",
                 "value": "4826#",       // codes verbatim, never translated
                 "label_ko": "출입 비밀번호" } ],
    "engine": "rules|ai",
    "confidence": "high|low"            // low → rider UI shows "원문을 확인해 주세요"
  }
},
"delivery_address": { "detail_ko": "101동 1203호" }   // NEW, optional normalised unit
```
Rules: original text always stored and shown; empty note and empty detail are valid; Korean input passes through; `rider_request.translation` absent = rider sees original only.

| # | Decision | Options | Rec. | Decision |
|---|---|---|---|---|
| D1 | Order shape | own shape / B2 shape + additions | B2 shape + additions | |
| D2 | Where translation lives | in order record / computed on rider screen | in the order record, computed once at placement | |
| D3 | Rider address type | show both / show only chosen `address_type` | chosen type as the as-is app does, with the other as a small secondary line (helps a rider who navigates by lot number) | |
| D4 | Data loading | import JSON / fetch from `public/data/` | `public/data/` + fetch, as B3 suggests | |

## 2.2 Customer-side behaviour (match as-is, B3 §4)
- **Search:** split the keyword by spaces/commas; a building matches when **every word matches a whole word** in its name/address (case-insensitive). English app searches only the `_en` fields. (My first draft used substring match and both languages — to be corrected.)
- **Address details:** pick 도로명/지번 → saved as `address_type`; unit is one free-text field.
- **Checkout:** one preset (optional) + one rider note (≤ 200) + one store note + no-cutlery checkbox.

## 2.3 Implementation approach
| # | Decision | Options | Rec. | Decision |
|---|---|---|---|---|
| A1 | Stack | React + Vite + TS / Next.js | React + Vite + TS (static, quick to deploy) | |
| A2 | Screens (2–3) | Search+details / Checkout notes / Rider | Built as 4 screens matching the as-is flow: 01 Search, 02 Address details, 03 Checkout notes, 04 Rider (KO) (+ order-placed bridge and rider list). The brief says 2–3 are enough; 4 keeps the as-is flow familiar | |
| A3 | Translation | rules only / AI only / **hybrid** | Hybrid: rules extract codes and fixed preset text exactly; AI translates prose; on failure fall back to rules + original | |
| A4 | AI safety check | none / verify | After AI replies, every code found in the original must appear unchanged in the output, else `confidence: "low"` | |
| A5 | AI hosting | none / serverless proxy | Vercel serverless function; API key only in env vars, never in the repo | |
| A6 | Customer → rider handoff | order in link / localStorage / server store | Order in link (works across devices, no DB) unless the PM wants live sync, then add a small KV store | |
| A7 | Rider screen content | new order only / + sample orders | Both: a list of the 24 sample orders plus the new one, same renderer | |
| A8 | Rider actions | none / call + navigate + delivered | Implement delivered (updates status) and call (`tel:` safe_number); navigate opens a map link to `location` | |
| A9 | Styling | CSS tokens / Tailwind | Plain CSS with the design tokens (`src/shared/styles/tokens.css`, from B4) | |
| A10 | Tests | none / unit + manual QA | Vitest for search, clues, round-trip; manual QA from `HANDOFF.md` | |

## 2.4 States to handle ("Exceeds")
| State | Where | Behaviour |
|---|---|---|
| Empty search | Address | Show search tips, no error |
| No results | Address | Message + suggestions (road+number, dong+lot, building name) |
| Wrong/incomplete address | Address / details | Unit empty is allowed (field is optional in the as-is app) but warn if building has `sub_buildings` and the unit names a building not in the list (e.g. "Bldg 105" vs 101–104) |
| Empty note | Checkout / rider | Valid; rider shows 요청사항 없음 |
| Note over 200 | Checkout | Counter, hard limit |
| Translation fails | Rider | Show original + notice, never block the order |
| Unknown language | Rider | Show original + notice |
| Bad rider link / missing order | Rider | Korean error message |

## 2.5 Plan to Saturday
1. **Today:** get answers to 1.6; team fills the Decision columns; deploy a rough build to Vercel and create the public repo.
2. **Next:** align code with this document (B2 shape, spec search, spec preset labels); build the 3 screens in orange tokens; rider screen.
3. **Then:** hybrid translation + clue panel + states in 2.4; tests.
4. **Last:** README (all sections), `HANDOFF.md`, screenshots, tick the 6 Task List items; keep Saturday for submission only.
