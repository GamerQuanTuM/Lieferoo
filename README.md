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

## Run as an Android app (build the APK)

The same web app is packaged for Android with [Capacitor](https://capacitorjs.com). The `android/` folder is the native project; the web build is copied into it.

**Requirements**
- Node 20+ and `npm install` done (see above)
- **JDK 21** (Android Studio's bundled JDK works: `C:\Program Files\Android\Android Studio\jbr`)
- **Android SDK** (install Android Studio, or the command-line tools with platform 35/36)
- Create `android/local.properties` with your SDK path (this file is git-ignored):
  ```
  sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk
  ```
  Linux/macOS example: `sdk.dir=/home/<you>/Android/Sdk`

**Build the debug APK**

Windows (PowerShell):
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
npm run android:sync          # builds the web app and copies it into android/
cd android
.\gradlew.bat assembleDebug
```

macOS / Linux:
```bash
export JAVA_HOME=/path/to/jdk-21
npm run android:sync
cd android && ./gradlew assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. The first build downloads Gradle and dependencies and can take 10+ minutes; later builds take under a minute.

**Install it**
- Phone: turn on *USB debugging*, plug it in, then `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`. Or copy the APK to the phone and open it (allow installs from unknown sources).
- Emulator: create a device in Android Studio (Device Manager), start it, then run the same `adb install` command.
- Or open the project in Android Studio with `npm run android:open` and press Run.

**Website only:** the "open the rider screen on another device" link on the order-placed screen is hidden in the Android app.

**After changing web code** (`src/`), run `npm run android:sync` again before `assembleDebug`, otherwise the APK keeps the old web bundle.

**Troubleshooting**
- `invalid source release: 21`: `JAVA_HOME` is not JDK 21 in this terminal.
- `SDK location not found`: missing or wrong `android/local.properties`.
- Gradle download timeout: retry, or check your network/proxy.
- This is a **debug** APK for testing. A Play Store release needs a signed build (Android Studio: *Build > Generate Signed Bundle / APK*).

## Project structure

Feature-modular React + TypeScript. Each feature has its own `README.md`; module rules are enforced by a test.

```
src/
  app/          route table and shell
  domain/       data types (field names from the data spec)
  data/         loads the sample data
  shared/       UI parts, design tokens, routes, safe storage
  features/     address · checkout · orders · translation · rider · store
public/data/    sample addresses and orders
android/        Capacitor Android project (see "Run as an Android app")
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
- Data changes (additions only, snake_case, nothing renamed): `rider_request.translation {source_lang,text_ko,clues[],engine,confidence}`, `store_request.translation` (same shape) and `delivery_address.detail_ko` on new orders. New orders use a fixed demo store, items, customer and rider.

## Tech stack

| Area | Choice | Why |
|---|---|---|
| Language · framework | TypeScript, React 18 + Vite 5 | Fast setup, strict typing, easy Vercel deploy |
| Styling | Plain CSS with the provided design tokens | Tokens are already CSS variables; no extra dependency |
| Mobile app | Capacitor 8 (Android) | Same code runs as an Android app; `android/` is the native project |
| Hosting | Vercel (planned) | Free https link, deploys from GitHub |

## Open-source libraries

| Library | Version | What we use it for | Why we chose it | Alternatives we considered |
|---|---|---|---|---|
| react / react-dom | 18.3.1 | UI | Team standard, widely supported | Svelte, Vue: no benefit for 3 screens |
| vite | 5.4.x | Dev server and build | Zero-config TS + React | CRA (deprecated), Next.js (SSR not needed) |
| vitest | 2.1.x | Unit tests | Shares Vite config | Jest: more setup |
| typescript | 5.6.3 | Type safety | Catches data-shape bugs | — |
| @capacitor/core, android, app, status-bar, splash-screen | 8.x | Packages the web app as an Android app (back button, status bar) | Reuses the web code with no rewrite | React Native / Flutter: full rewrite |

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
