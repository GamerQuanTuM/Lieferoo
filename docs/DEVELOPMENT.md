# Development guide

Audience: developers.

## 1. Setup
```bash
npm install
npm run dev        # http://localhost:5173
```
Node 20+ (developed on Node 24). No environment variables are required.

## 2. Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | TypeScript strict check, no output |
| `npm test` | Vitest: unit tests + the architecture test |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve `dist/` locally (use this to test the real build) |

Before every commit: `npm run typecheck && npm test && npm run build`.

## 3. Tests
| File | Covers |
|---|---|
| `features/address/addresses.test.ts` | Search rules (incl. Itaewon, Korean, numbers), wrong-building warning |
| `features/checkout/food.test.ts` | Moving food requests out of the rider note |
| `features/translation/translation.test.ts` | Clues, language detection, unit normalisation, pipeline, AI guard |
| `features/orders/orders.test.ts` | Order building, share-token round trip, Korea time |
| `test/sampleData.test.ts` | Sample data integrity |
| `test/architecture.test.ts` | Module rules from [ARCHITECTURE.md](ARCHITECTURE.md) |

Tests sit next to the code they test (`*.test.ts`). Shared sample data comes from `src/test/fixtures.ts`.

## 4. Conventions
- **Field names:** `snake_case` for data (from the data spec), `camelCase` for code.
- **Imports:** `@/…` outside the current folder, `./file` inside a feature. Cross-feature imports go through `index.ts` only.
- **URLs:** build them with `routes.*` from `shared/routes.ts`; never write `"#/…"` in a screen.
- **Storage:** only through `shared/storage.ts`.
- **Korean text on the rider screen** stays in the component (`lang="ko"`); fixed Korean labels for data values live in `features/translation/presets.ts`.
- **Never drop the customer's original text** when showing a translation.
- **Styling:** use the design tokens (`var(--oo-…)`) from `shared/styles/tokens.css`; no hard-coded colours.
- **Accessibility:** labels on inputs, `role="alert"/"status"` on messages, visible focus, 44px tap targets.
- Keep a function that touches the network or storage out of components when you can; put it in the feature's module.

### Android app (optional)
`npm run android:sync` (build + copy into `android/`), then `cd android && gradlew assembleDebug` with `JAVA_HOME` set to JDK 21. The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Full steps: README, "Run as an Android app". The "open on another device" link on the order-placed screen is web-only.

## 5. Optional AI translation
The pipeline already supports it; nothing is deployed yet.
1. Create a server function (e.g. Vercel Function) that takes `{ text, target: "ko" }` and returns `{ text_ko }`. **Keep the API key in the host's environment settings, never in the repo or the browser.**
2. Set `VITE_AI_ENDPOINT=https://<your-app>/api/translate` at build time.
3. The app rejects any AI answer that changes a door code and falls back to the rules, then to the original text.
4. Tell the PM first: notes (with door codes) leave the app. Record the decision in `docs/PROGRESS.md`.

## 6. Deploying (Vercel, static)
1. Push to the public GitHub repository.
2. Import the repo in Vercel. Framework: Vite. Build `npm run build`, output `dist`.
3. No rewrite rules are needed (hash routing).
4. Put the live URL into `README.md` and `HANDOFF.md`, and open it on a phone-sized screen.

## 7. Definition of done (brief §6)
- [ ] Public https link where the core flow runs
- [ ] Public GitHub repo, `README.md` with every template section filled in
- [ ] `HANDOFF.md` with the test link, commit, and steps
- [ ] Task List: core flow, empty/error states, sample data, mobile check, built/excluded scope, known bugs

## 8. Troubleshooting
| Symptom | Cause / fix |
|---|---|
| Blank screen, "Couldn't load the data" | `public/data/*.json` not served; check the network tab and `BASE_URL` |
| Architecture test fails | You made a deep cross-feature import or an import cycle; import from the other feature's `index.ts` |
| Rider link opens "주문 정보를 불러올 수 없어요" | The share token was cut off when copied; copy the whole link |
| "Delivered" is not shown on another device | By design: it is stored per device until a backend exists |
| Korean text looks wrong in tests | Make sure files are saved as UTF-8 |

## 9. Keeping docs current
After each step update [PROGRESS.md](PROGRESS.md). If you change data fields, update [DATA_MODEL.md](DATA_MODEL.md); if you change a rule between modules, update [ARCHITECTURE.md](ARCHITECTURE.md).
