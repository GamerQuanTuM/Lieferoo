# Lieferoo · The last 100 m

A mobile web flow that carries a foreign customer's address and delivery note (English) to the rider (Korean) on one screen, so deliveries stop failing at the door.

**Live demo:** TODO (deploy to Vercel) · keep it live after the project ends
**Figma:** TODO · **Team:** pilot team D · **My role:** Developer

## Problem and solution

- **Problem:** Foreign customers order in English, but the address and notes reach Korean-speaking riders exactly as typed. Door codes, entrances and "don't ring" requests get lost, so failed and late deliveries rise.
- **Solution:** (1) Customer searches an address and adds a unit + note in English. (2) The order is handed to the rider screen. (3) The rider sees the Korean address, a fixed Korean version of the quick request, door codes pulled out verbatim and highlighted, a Korean rendering of the note, and the customer's original text as a fallback.

## Screenshots

TODO: add 1–3 images or a GIF (customer search → note → rider screen).

## How to run

```bash
git clone https://github.com/GamerQuanTuM/Lieferoo.git
cd Lieferoo
npm install
npm run dev     # opens http://localhost:5173
```

Node 20+ (developed on Node 24). Environment variables: None. Other scripts: `npm test`, `npm run typecheck`, `npm run build`.

## Project structure

Feature-modular React + TypeScript. Each feature has its own `README.md`; module rules are enforced by a test.

```
src/
  app/          route table and shell
  domain/       data types (field names from the data spec)
  data/         loads the sample data
  shared/       UI parts, design tokens, routes, safe storage
  features/     address · checkout · orders · translation · rider
public/data/    sample addresses and orders
docs/           documentation and provided resources (start at docs/README.md)
```

Docs: [index](docs/README.md) · [product overview (PM)](docs/PRODUCT_OVERVIEW.md) · [architecture](docs/ARCHITECTURE.md) · [data model](docs/DATA_MODEL.md) · [development guide](docs/DEVELOPMENT.md)

## Scope

**Built**
- Address search (screen 01): every keyword must match; word starts and hyphen parts match (so "Itaewon" finds the 3 Itaewon-dong addresses — the current service's whole-word rule found none, customer inquiry A5 #1); Korean queries search the Korean fields; empty-state tips and a "no results" message
- Food-request hint (03): "No spicy please" typed into the rider note is offered a move to the store request (A5 #9, #10)
- Address details (02): 도로명/지번 choice, optional unit field, warning when the building number is not in the complex (e.g. Bldg 105 vs 101–103)
- Checkout notes (03): store request, no-cutlery, 4 rider presets, rider note (200 chars)
- Rider screen in Korean (04): Korean address of the type the customer chose, Korean unit (e.g. 101동 1203호) with the original, Korean preset, door codes highlighted, translated note, English original, call / navigate / delivered
- Rider list: the 24 sample orders plus every order placed in this browser
- Handoff with no backend: the order is in the link, so the rider screen opens on another device
- Hybrid translation pipeline: Korean passthrough → optional AI (only if VITE_AI_ENDPOINT is set, rejected if it changes a door code) → rules → original only

**Not built (and why)**
- Real map / address API, payment, sign-up, dispatch, shop/menu — out of scope per brief
- Pin dragging, "use my current location", Save as Home/Work/Other — no map/location API in scope
- Menu, payment, shop choice — every new order carries one fixed demo cart
- AI translation server function — the client hook exists, the endpoint is not deployed yet
- Live sync between devices — "delivered" taps are stored per device

## Data

- Sample data used: sample_addresses.json · sample_orders.json (in `public/data/`, unchanged, loaded with fetch)
- Data changes (additions only, snake_case, nothing renamed): `rider_request.translation {source_lang,text_ko,clues[],engine,confidence}` and `delivery_address.detail_ko` on new orders. New orders use a fixed demo store, items, customer and rider.

## Tech stack

| Area | Choice | Why |
|---|---|---|
| Language · framework | TypeScript, React 18 + Vite 5 | Fast setup, strict typing, easy Vercel deploy |
| Styling | Plain CSS with the provided design tokens | Tokens are already CSS variables; no extra dependency |
| Hosting | Vercel (planned) | Free https link, deploys from GitHub |

## Open-source libraries

| Library | Version | What we use it for | Why we chose it | Alternatives we considered |
|---|---|---|---|---|
| react / react-dom | 18.3.1 | UI | Team standard, widely supported | Svelte, Vue: no benefit for 3 screens |
| vite | 5.4.x | Dev server and build | Zero-config TS + React | CRA (deprecated), Next.js (SSR not needed) |
| vitest | 2.1.x | Unit tests | Shares Vite config | Jest: more setup |
| typescript | 5.6.3 | Type safety | Catches data-shape bugs | — |

## My role and contribution

- **Built:** TODO
- **Decisions:** Hash router instead of a router library (3 screens). Order carried in the URL instead of a backend, so the rider screen works on any device. Door codes are extracted and shown verbatim, never translated.
- **Hardest problem:** TODO

## AI usage

- Claude Code scaffolded the project structure and first drafts of the screens, translation layer and tests. TODO: list what you reviewed or rewrote yourself.

## Known issues

- Note translation is a small phrasebook, so many sentences only appear in English plus extracted codes — shown to the rider with a notice. Plan: optional AI translator through the existing `VITE_AI_ENDPOINT` hook (see docs/DEVELOPMENT.md).
- Notes in non-English languages (Japanese, Chinese, Vietnamese, romanized Korean in the sample data) are not translated yet; original text is shown.

## Team

| Role | Name | GitHub | What they built |
|---|---|---|---|
| Developer | TODO | TODO | App |
| Designer | TODO | — | TODO |
| PM | TODO | — | TODO |
| Marketer | TODO | — | TODO |
