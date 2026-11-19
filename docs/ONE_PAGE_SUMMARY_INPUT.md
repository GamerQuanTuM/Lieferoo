# Developer input for the C3 One Page Summary

The PM types the final summary (4 fields, ≤ 1,500 characters each, in the submission screen). This is the developer's draft input. **Check every statement against the live link and the PRD/QA report before it is used; update the bracketed items.**

## 1. Which problem, and why (evidence)
Foreign customers' addresses and notes reach Korean riders exactly as typed, so riders miss door codes and can't read notes. Evidence from the 10 customer inquiries (A5): 4 can't find the address, 3 can't get into the building (door code written in the note but missed, 30-min and 10-min delays), 2 requests in the wrong box, 1 rider couldn't read a long English note and hung up. In the 24 sample orders, notes hold door codes (`4826#`), "not that building" corrections, and entrances, in English, Japanese, Chinese, Vietnamese and romanized Korean. The as-is rider screen (screen 04) shows the unit and note raw in English.

## 2. How we solved it (what can be checked on the link)
[Live link] Customer: search address → 도로명/지번 + unit → checkout notes. Rider screen (Korean) shows the Korean address of the chosen type, the unit in Korean (101동 1203호) with the customer's original, the Korean preset, the door code in a large highlighted box above the note, a Korean translation, and the English original. Search now finds "Itaewon" (3 addresses; the old rule found 0) and accepts Korean queries. Checkout offers to move "no spicy"-type sentences from the rider note to the store request. [Marketer: add launch message, channel, timing, success metric from M2/M3, and only promises that work on the link.]

## 3. What we left out, and why
- Clues not chosen: entrance photos / landmarks for no-sign buildings (A5 #6) — no field in the data; in-app chat/calls.
- Scope cut: real map and address API, pin dragging, current location, menu/payment (out of scope per brief); every new order uses a fixed demo cart.
- Translation: rules cover common English phrases only; other languages show the original plus a notice [update if AI is added].
- Shop screen not built, so the moved food request is stored but not shown to a shop.
- NPC team lead's change notice: [PM to fill in: what changed, how it was handled, by when].

## 4. AI use (one line)
[Edit to the truth] Claude Code drafted the project scaffold, screens, translation rules and tests; the developer reviewed and ran them. In the product: [AI translation not used / used for notes, with door-code check].
