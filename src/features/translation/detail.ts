/**
 * Conservative Korean normalisation of the unit field, e.g. "1203, Bldg 101" → "101동 1203호".
 * Returns null unless EVERY part of the text was understood; the original is always shown too,
 * so a null (or a wrong guess) can never hide what the customer typed.
 */
export function normalizeDetail(detail: string): string | null {
  const d = detail.trim();
  if (!d || /[가-힣]/.test(d)) return null;

  let rest = d;
  const p: { bld?: string; floor?: string; room?: string; roof?: boolean } = {};

  const dash = rest.match(/^(\d{2,4})-(\d{3,5})$/); // "102-1501"
  if (dash) return `${dash[1]}동 ${dash[2]}호`;

  rest = rest.replace(/\b(?:Bldg|Building)\.?\s*(\d{1,4}|[A-Z])\b/, (_m, b: string) => { p.bld = b; return " "; });
  rest = rest.replace(/\b(\d{1,2})\s*(?:F\b|(?:st|nd|rd|th)\s+floor\b)/i, (_m, f: string) => { p.floor = f; return " "; });
  rest = rest.replace(/\brooftop\b/i, () => { p.roof = true; return " "; });
  rest = rest.replace(/\b(?:Room|Rm|Apt|Unit|Phòng)\.?\s*#?(\d{1,5})\b|#(\d{1,5})\b|(\d{1,4})\s*号室?/i,
    (_m, a?: string, b?: string, c?: string) => { p.room = a ?? b ?? c; return " "; });

  const bare = rest.replace(/[\s,;·]+/g, " ").trim();
  if (!p.room && /^\d{2,5}$/.test(bare)) { p.room = bare; rest = ""; }
  if (rest.replace(/[\s,;·#]+/g, "") !== "") return null; // something not understood

  const out = [
    p.bld ? `${p.bld}동` : "",
    p.floor ? `${p.floor}층` : "",
    p.roof ? "옥상" : "",
    p.room ? `${p.room}호` : "",
  ].filter(Boolean);
  return out.length ? out.join(" ") : null;
}
