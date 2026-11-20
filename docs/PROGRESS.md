# Progress log

Living record of what is done / next, so any session can resume. Update after every step.
Deadline: Saturday. Project final deadline is T0+49h; my task due is recommended T0+40h (PM may change it).

## Understanding (from Developer_brief.md v1.1)
- Build a **mobile web** flow: foreign customer (English) enters address + delivery notes → rider (Korean) sees them on one screen.
- Core evaluation: **what the customer enters must actually show up on the rider screen.**
- 2–3 screens are enough. Real map/address API, sign-up, payment, dispatch, branding are NOT evaluated. AI translation allowed, not required.
- Must restyle-plus: just restyling `current_app_screens` is not evaluated. Our insight: today the rider sees the English note untouched (see screen 04).
- Done = public https link + public GitHub repo with README (all template sections) + HANDOFF.md (QA note) + Task List checked.
- Exceeds: empty fields, "no search results", wrong addresses handled; reasons for chosen/dropped clues explained; mid-project change handled by due time with scope change recorded.

## Done
- [x] 2026-11-19 Read brief, templates, tokens, data, screens, flow diagram.
- [x] Board URL checked in headless Chrome: requires Koready login (team members only) — could not read tasks/Resources/Deploy guide. **User must paste board content (task list, deploy guide, Data Guide B3_data_spec.md, any PM change notices).**
- [x] Copied provided files into repo: data → `src/data/`, tokens → `src/styles/tokens.css`, everything else → `docs/resources/` (originals untouched in project root).
- [x] Scaffold: Vite + React 18 + TypeScript (strict) + Vitest; hash router; no other runtime deps.
- [x] Screens: Search (empty/no-result states) → Details+Notes (validation) → Placed → Rider (Korean).
- [x] Translation layer (now features/translation, optional AI hook `AiTranslate`): presets (fixed Korean), door-code clue extraction (verbatim), phrasebook; original English always shown as fallback.
- [x] Order handoff without backend: order encoded in URL hash (works across devices) + localStorage.

- [x] 2026-11-19 Read all 5 as-is screens + .fig (it is a UI kit, not screens; canvas.fig not parseable here). Wrote docs/TEAM_DISCUSSION.md (requirements, questions, data structure, approach options).
- [ ] Decisions pending from team: see TEAM_DISCUSSION §2 and §4. Current code does NOT yet follow the as-is layout (needs rebuild of screens 01-04).

- [x] 2026-11-19 Read B3_data_spec.md. Rewrote docs/TEAM_DISCUSSION.md as Part 1 (requirements + questions) and Part 2 (data structure + approach decisions).
- [x] 2026-11-19 Code aligned with B3 and rebuilt to match as-is screens 01–04 in orange tokens: whole-word search, exact preset labels, B2-shaped order, chosen address_type, JSON from public/data via fetch. 40 tests pass; full flow checked in Chrome 390×844 with no console errors.

- [x] 2026-11-19 Added A5 (customer feedback) and C3 (one-page summary guide) to docs/. Used A5 as evidence: fixed search (Itaewon, Korean query), food-request hint, 도로명/지번 help. Wrote docs/ONE_PAGE_SUMMARY_INPUT.md (draft for the PM). 47 tests pass.

- [x] 2026-11-19 Restructured into feature modules (address, checkout, orders, translation, rider) + app/shared/domain/data; central routes and storage helpers; removed duplicate root files (checksum-verified); resources moved to docs/resources; added docs/ (README index, ARCHITECTURE, PRODUCT_OVERVIEW, DATA_MODEL, DEVELOPMENT), per-feature READMEs and CLAUDE.md; architecture rules enforced by test. 56 tests pass; full flow re-verified in Chrome 390x844.

- [x] 2026-11-20 Task "User's View: Update the English checkout page to handle translated text": store request now translated too (`store_request.translation`, rule-based store phrasebook — pilot: no paid AI, no API key, static site); if a note can't be fully translated the rider/store get the original alongside and the order is never blocked; checkout button shows "Translating for your rider…"; Order placed screen tells per note how it reaches the rider/store. 63 tests pass; typecheck + build clean; flow checked at 390×844.

## Next (updated)
- [ ] Team fills Decision columns in docs/TEAM_DISCUSSION.md; get PM/designer/marketer answers (§1.6).
- [ ] Open question: is the designer's Figma different from as-is? Adjust styling once received.
- [x] AI translation: not used in the pilot (PM: no paid integrations; Vercel is a plain static site). Rule-based only.
- [ ] Store order view (designer screen): show `store_request.translation` (Korean + original) once that screen is on main.
- [ ] GitHub public repo + Vercel deploy + fill README/HANDOFF TODOs + screenshots.

## Older next-list (partly done)
- [x] Verified: typecheck clean, 12 tests pass, build OK (2026-11-19).
- [x] Core flow checked in headless Chrome 390×844 (search → note → rider). Fixed wrapping status pill. Still to eyeball: search + details screens.
- [ ] `git init`, create PUBLIC GitHub repo, push.
- [ ] Deploy to Vercel (early!) → paste live URL into README + HANDOFF.
- [ ] Decide on AI translation (optional): serverless function + env key; keep rule-based as fallback.
- [ ] Rider screen: add status "delivered" action, call customer / navigate buttons (non-functional ok, but anything marketer promises must work).
- [ ] If marketer exists: get launch assets and make every promise true on the live link.
- [ ] Fill README (template sections), HANDOFF.md, screenshots; add Data changes if any.
- [ ] Task List on board: tick all six items.

## Open questions for the user
1. Paste the board's task list / PM notes / marketer assets / Deploy guide.
2. Figma link + team member names/GitHub ids for README.
3. Want AI translation (needs an API key on the host) or rule-based only?

## Verification log
- 2026-11-19: e2e scenario passed — address, detail, preset (KO), code 4826# highlighted, KO phrasebook, EN original all on rider screen. Console: favicon 404 fixed. Gap: "Building 101 is the first one on the left…" not translated (phrasebook limit).
- npm audit: 6 vulns reported in dev tooling (vite5/vitest2/esbuild) — review before deploy (dev-only, not shipped).
- git init done; NO commit yet; no remote.
