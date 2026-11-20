# Lieferoo · The last 100 m

Mobile web app: foreign customer (English) → rider (Korean). React 18 + Vite + TypeScript, no backend.

- **Start here:** `docs/README.md` (index), `docs/PROGRESS.md` (what is done / next), `docs/ARCHITECTURE.md` (rules).
- **Checks before finishing a task:** `npm run typecheck && npm test && npm run build`.
- **Module rules** (enforced by `src/test/architecture.test.ts`): features import each other only via `@/features/<name>` (index.ts); `shared` and `domain` import no features; build URLs with `shared/routes.ts`; storage only via `shared/storage.ts`.
- **Data:** use B3 field names exactly (`docs/resources/B3_data_spec.md`); never rename or delete; document additions in `docs/DATA_MODEL.md` and the README "Data" section.
- **Never** hide the customer's original text behind a translation; door codes are copied verbatim.
- Provided files in `docs/resources/` are read-only references. Sample data is `public/data/`.
- Update `docs/PROGRESS.md` after each step.
- **Android (Capacitor, optional):** `android/` is generated; native-only code lives in `src/shared/native.ts` (no-op in the browser). After editing `src/`, run `npm run android:sync` before `gradlew assembleDebug` (JDK 21). Never put `overflow-x:hidden` on `html`/`body`. See `docs/ARCHITECTURE.md` §7.
