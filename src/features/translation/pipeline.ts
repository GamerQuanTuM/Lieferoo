import type { Translation } from "@/domain/types";
import { extractClues } from "./clues";
import { detectLang } from "./lang";
import { translateWithRules } from "./rules";

/** Which box the text came from — the AI and the phrasebook word it for the rider or for the store. */
export type NoteKind = "rider" | "store";

/** Optional AI step: given the original note, return Korean. Injected, so the app works without it. */
export type AiTranslate = (text: string, kind?: NoteKind) => Promise<string>;

/**
 * How long checkout waits for the AI before falling back to the phrasebook (and then the original text).
 * Short on purpose: placing the order must never feel stuck because of translation.
 */
export const AI_TIMEOUT_MS = 4000;

/** Every door code in the original must survive unchanged in the AI output. */
export function verifyCodes(original: string, ko: string): boolean {
  return extractClues(original)
    .filter((c) => c.type === "door_code")
    .every((c) => ko.includes(c.value));
}

/** AI via a server endpoint (key stays server-side). Not used unless VITE_AI_ENDPOINT is set. */
export function createHttpTranslator(endpoint: string): AiTranslate {
  return async (text, kind = "rider") => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, target: "ko", kind }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
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
  return translateNote(text, "rider", ai);
}

/** Same pipeline for the "Request to the store" box (food and packing requests). Never throws. */
export async function translateStoreNote(text: string, ai: AiTranslate | undefined = defaultAi): Promise<Translation> {
  return translateNote(text, "store", ai);
}

async function translateNote(text: string, kind: NoteKind, ai: AiTranslate | undefined): Promise<Translation> {
  const t = text.trim();
  const lang = detectLang(t);
  const clues = extractClues(t);

  if (lang === "ko") return { source_lang: lang, text_ko: t, clues, engine: "rules", confidence: "high" };

  if (ai) {
    try {
      const ko = (await withTimeout(ai(t, kind), AI_TIMEOUT_MS)).trim();
      if (ko && verifyCodes(t, ko)) return { source_lang: lang, text_ko: ko, clues, engine: "ai", confidence: "high" };
    } catch {
      /* fall through to rules */
    }
  }
  if (lang === "en") {
    const r = translateWithRules(t, kind);
    return { source_lang: lang, text_ko: r.ko, clues, engine: "rules", confidence: r.allCovered ? "high" : "low" };
  }
  return { source_lang: lang, text_ko: "", clues, engine: "rules", confidence: "low" };
}

/** Rejects after ms — a slow AI must not hold the order (an injected translator may not have its own timeout). */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("translate timeout")), ms);
    p.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
  });
}

/** What the customer is told after placing the order, per box. */
export type DeliveryStatus = "translated" | "partial" | "original" | "korean" | "empty";

export function deliveryStatus(text: string, tr: Translation | undefined): DeliveryStatus {
  if (!text.trim()) return "empty";
  if (!tr) return "original";
  if (tr.source_lang === "ko") return "korean";
  if (!tr.text_ko) return "original";
  return tr.confidence === "high" ? "translated" : "partial";
}
