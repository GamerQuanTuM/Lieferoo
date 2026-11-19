import type { Translation } from "@/domain/types";
import { extractClues } from "./clues";
import { detectLang } from "./lang";
import { translateWithRules } from "./rules";

/** Optional AI step: given the original note, return Korean. Injected, so the app works without it. */
export type AiTranslate = (text: string) => Promise<string>;

/** Every door code in the original must survive unchanged in the AI output. */
export function verifyCodes(original: string, ko: string): boolean {
  return extractClues(original)
    .filter((c) => c.type === "door_code")
    .every((c) => ko.includes(c.value));
}

/** AI via a server endpoint (key stays server-side). Not used unless VITE_AI_ENDPOINT is set. */
export function createHttpTranslator(endpoint: string): AiTranslate {
  return async (text) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, target: "ko" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`translate ${res.status}`);
    const json = (await res.json()) as { text_ko?: unknown };
    return typeof json.text_ko === "string" ? json.text_ko : "";
  };
}

const endpoint = import.meta.env?.VITE_AI_ENDPOINT as string | undefined;
export const defaultAi: AiTranslate | undefined = endpoint ? createHttpTranslator(endpoint) : undefined;

/**
 * Hybrid pipeline. Never throws:
 *  Korean → pass through · AI (verified) → rules → original only.
 */
export async function translateRiderNote(text: string, ai: AiTranslate | undefined = defaultAi): Promise<Translation> {
  const t = text.trim();
  const lang = detectLang(t);
  const clues = extractClues(t);

  if (lang === "ko") return { source_lang: lang, text_ko: t, clues, engine: "rules", confidence: "high" };

  if (ai) {
    try {
      const ko = (await ai(t)).trim();
      if (ko && verifyCodes(t, ko)) return { source_lang: lang, text_ko: ko, clues, engine: "ai", confidence: "high" };
    } catch {
      /* fall through to rules */
    }
  }
  if (lang === "en") {
    const r = translateWithRules(t);
    return { source_lang: lang, text_ko: r.ko, clues, engine: "rules", confidence: r.allCovered ? "high" : "low" };
  }
  return { source_lang: lang, text_ko: "", clues, engine: "rules", confidence: "low" };
}
