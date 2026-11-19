import type { Clue } from "@/domain/types";

/**
 * Key-clue extraction from a free-text note. Door codes are the highest-stakes information
 * (wrong or missing code = failed delivery), so they are copied verbatim, never translated.
 */

// "4826#", "*2580", "#3579*", "0415*", "#7788"
const CODE_RE = /[#*]\d{3,8}[#*]?|\b\d{3,8}[#*]/g;
// "code 5050", "password 3690", "pw 1234" (no # or *)
const KEYWORD_CODE_RE = /\b(?:code|password|passcode|pw)\s*(?:is|:)?\s*([#*]?\d{3,8}[#*]?)/gi;

export function extractClues(note: string): Clue[] {
  const clues: Clue[] = [];
  const seen = new Set<string>();
  const add = (c: Clue) => {
    const key = c.type + c.value;
    if (!seen.has(key)) { seen.add(key); clues.push(c); }
  };

  for (const m of note.matchAll(CODE_RE)) add({ type: "door_code", value: m[0], label_ko: "출입 비밀번호" });
  for (const m of note.matchAll(KEYWORD_CODE_RE)) add({ type: "door_code", value: m[1], label_ko: "출입 비밀번호" });

  // Building: "Building 101", "Bldg B" (case-sensitive letter so "building has" is not a match)
  for (const m of note.matchAll(/\b(?:[Bb]ldg|[Bb]uilding)\.?\s*(\d{1,4}|[A-Z])\b/g)) {
    add({ type: "building", value: `${m[1]}동`, label_ko: "동" });
  }
  for (const m of note.matchAll(/\b(\d{1,2})\s*(?:F\b|(?:st|nd|rd|th)\s+floor\b)/gi)) {
    add({ type: "floor", value: `${m[1]}층`, label_ko: "층" });
  }
  if (/don'?t ring|do not ring|no bell|knock/i.test(note)) {
    add({ type: "no_bell", value: /knock/i.test(note) ? "노크 요청" : "벨 누르지 않기", label_ko: "주의" });
  }
  if (/\bcall me\b|\bphone\b/i.test(note)) add({ type: "call_first", value: "전화 요청", label_ko: "연락" });
  if (/underground|basement/i.test(note)) add({ type: "underground", value: "지하 진입/지하 호실", label_ko: "진입 경로" });
  return clues;
}
