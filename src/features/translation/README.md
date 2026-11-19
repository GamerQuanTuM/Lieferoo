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
| `pipeline.ts` | `translateRiderNote` (never throws), `verifyCodes`, optional HTTP AI translator |
| `clues.ts` | Finds door codes (`4826#`, `*2580`), building, floor, no-bell, call-me, underground |
| `rules.ts` | English phrase → Korean sentence; says whether every sentence was covered |
| `detail.ts` | Unit text → Korean (`1203, Bldg 101` → `101동 1203호`), `null` if not fully understood |
| `lang.ts` | Script-based language detection (en, ja, zh, vi, ko) |
| `presets.ts` | The 4 quick requests in English and the exact Korean labels from the data spec |

**Public API** (`index.ts`): `translateRiderNote`, `normalizeDetail`, `PRESETS`, `PRESET_LABEL_EN`, `PRESET_LABEL_KO`, type `AiTranslate`.

**Rules to remember**
- Door codes are copied, never translated or reformatted.
- `confidence: "low"` makes the rider screen show "check the original".
- To add AI: set `VITE_AI_ENDPOINT` to a server function that returns `{ text_ko }` (keep the API key on the server). The pipeline already falls back if it fails or alters a code.
- To add a phrase: add a line to `PHRASES` in `rules.ts` and a test in `translation.test.ts`.

**Tests:** `translation.test.ts`
