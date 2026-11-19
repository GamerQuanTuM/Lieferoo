# Architecture

Audience: developers. Product behaviour is in [PRODUCT_OVERVIEW.md](PRODUCT_OVERVIEW.md); fields are in [DATA_MODEL.md](DATA_MODEL.md).

## 1. Shape of the codebase

A small, **feature-modular** React + TypeScript app. No backend: static files plus the browser.

```
src/
├─ main.tsx                 entry: mounts <App/> and loads the CSS
├─ app/                     the shell: route table + hash-route hook      (knows all features)
├─ domain/types.ts          data model, B3 field names                    (knows nothing)
├─ data/DataProvider.tsx    loads public/data/*.json, exposes useData()
├─ shared/                  code with no business rules
│  ├─ ui/                   TopBar, MapPlaceholder
│  ├─ styles/               tokens.css (design tokens), global.css
│  ├─ routes.ts             every URL in one place
│  └─ storage.ts            safe localStorage / sessionStorage
├─ features/                one folder per capability; each has index.ts + README.md
│  ├─ address/              search + address details       (screens 01, 02)
│  ├─ checkout/             notes, place order, confirmation (screen 03)
│  ├─ orders/               build, store, share and find orders
│  ├─ translation/          note → what the rider needs (clues, rules, optional AI)
│  └─ rider/                the Korean rider screens        (screen 04 + list)
└─ test/                    fixtures + the architecture test
public/data/                B1 addresses, B2 orders (sample data, unchanged)
docs/                       documentation and provided resources
```

## 2. Dependency rules (enforced by `src/test/architecture.test.ts`)

```
app ──► features ──► shared ──► domain
         │  ▲
         └──┘ only through each other's index.ts
```

1. `domain` imports nothing from the app.
2. `shared` may use `domain` only. It must not import `features`, `data`, or `app`.
3. `features` talk to each other **only through `@/features/<name>`** (the barrel `index.ts`). Never `@/features/orders/kst`.
4. A feature never reaches outside its folder with `../` and never imports `app`.
5. No import cycles between features. Today: `address` ← `orders` → `translation`; `checkout` → `address`, `orders`, `translation`; `rider` → `orders`, `translation`.

The test fails the build when a rule is broken, so the structure cannot rot silently.

**Import style:** `@/…` aliases (configured in `tsconfig.json` and `vite.config.ts`) for anything outside the current folder; `./file` inside a feature.

## 3. How an order moves through the system

```mermaid
sequenceDiagram
  participant C as Customer (English)
  participant A as address
  participant K as checkout
  participant O as orders
  participant T as translation
  participant R as rider (Korean)
  C->>A: search, pick address, 도로명/지번, unit
  A-->>K: draft (sessionStorage)
  C->>K: presets + notes, "Place order"
  K->>O: buildOrder(input)
  O->>T: translateRiderNote(note), normalizeDetail(unit)
  T-->>O: Korean text + clues (door codes verbatim)
  O-->>K: Order (same shape as sample orders)
  K->>O: saveLocalOrder, encodeOrder (share token)
  K-->>C: "Order placed" + rider link
  R->>O: resolveOrder(id or token)
  O-->>R: Order, shown in Korean with the original text
  R->>O: markDelivered
```

Key decisions:
- **Translate once, at placement.** The result is stored in the order, so the rider screen is instant and always shows the same text. Sample orders have no stored translation, so the rider screen computes it on the fly with the same function.
- **The order travels in the link** (base64url JSON, `orders/shareToken.ts`). That makes the rider screen work on a second device with no server. Trade-off: "delivered" is stored per device, not shared.
- **Hash routing** (`#/…`) works on any static host without rewrite rules.
- **Never lose the original.** The rider screen always shows the customer's text; a translation is an addition, not a replacement.

## 4. Where to change things

| I want to… | Edit |
|---|---|
| Add or change a Korean phrase | `features/translation/rules.ts` + a case in `translation.test.ts` |
| Recognise a new kind of clue (e.g. "elevator") | `features/translation/clues.ts`, show it in `features/rider/RiderScreen.tsx` |
| Turn on AI translation | set `VITE_AI_ENDPOINT` (see [DEVELOPMENT.md](DEVELOPMENT.md)); logic is in `translation/pipeline.ts` |
| Change the address search rule | `features/address/addresses.ts` + `addresses.test.ts` |
| Add a screen | create it in its feature, export it from that `index.ts`, add a builder to `shared/routes.ts` and a branch in `app/App.tsx` |
| Add a backend | replace `orders/shareToken.ts` and `orders/localOrders.ts` with API calls using the same function names |
| Change colours or spacing | `shared/styles/tokens.css` (values come from the design guide) |

## 5. Adding a new feature (checklist)

1. `src/features/<name>/` with the code, `index.ts` (public API only), `README.md`, and `<name>.test.ts`.
2. Depend on other features only via their `index.ts`.
3. Run `npm run typecheck && npm test`. The architecture test tells you if a rule broke.
4. Add the feature to the table in [PRODUCT_OVERVIEW.md](PRODUCT_OVERVIEW.md) and note the step in [PROGRESS.md](PROGRESS.md).

## 6. Known limits

- Translation covers common English phrases only; other languages show the original and a notice until AI is switched on.
- No shared state between devices (no backend), so the customer never sees "delivered".
- The map is an illustration; address search runs on the 30 sample addresses.
