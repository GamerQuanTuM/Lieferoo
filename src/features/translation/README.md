# translation

**What it does (PM view):** turns the customer's English note into what a Korean rider needs, and never loses information. It is the heart of the product.

```
note ──► detectLang ──► Korean?  ─yes─► pass through
                          │no
                          ▼
                   AI step (optional, only if VITE_AI_ENDPOINT is set)
                          │ result must keep every door code, else rejected
                          ▼
                   rules (English phrasebook)  ─► high / low confidence
                          ▼
              other languages: no Korean text, original + notice
Door codes, buildings, floors: always extracted verbatim as "clues".
```

| File | Purpose |
|---|---|
| `pipeline.ts` | `translateRiderNote` · `translateStoreNote` (never throw; AI waits at most `AI_TIMEOUT_MS` = 4 s), `verifyCodes`, `deliveryStatus` (what the customer is told), optional HTTP AI translator |
| `clues.ts` | Finds door codes (`4826#`, `*2580`), building, floor, no-bell, call-me, underground |
| `rules.ts` | English phrase → Korean sentence (rider phrasebook + store phrasebook for food/packing requests); says whether every sentence was covered |
| `detail.ts` | Unit text → Korean (`1203, Bldg 101` → `101동 1203호`), `null` if not fully understood |
| `lang.ts` | Script-based language detection (en, ja, zh, vi, ko) |
| `presets.ts` | The 4 quick requests in English and the exact Korean labels from the data spec |

**Public API** (`index.ts`): `translateRiderNote`, `normalizeDetail`, `PRESETS`, `PRESET_LABEL_EN`, `PRESET_LABEL_KO`, type `AiTranslate`.

**Rules to remember**
- Door codes are copied, never translated or reformatted.
- `confidence: "low"` makes the rider screen show "check the original".
- AI: `api/translate.ts` (Vercel Function) answers `{ text_ko }` with a free Gemini or Groq key from env. Set `VITE_AI_ENDPOINT=/api/translate` at build time to use it. If it fails, is slower than 4 s, or alters a code, the pipeline falls back to the phrasebook, then the original — the order is never blocked.
- To add a phrase: add a line to `PHRASES` in `rules.ts` and a test in `translation.test.ts`.

**Tests:** `translation.test.ts`
