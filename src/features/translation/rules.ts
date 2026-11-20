import { extractClues } from "./clues";

/** English phrase → Korean sentence. Door codes are NOT here; they come from clues, verbatim. */
const PHRASES: Array<[RegExp, string]> = [
  [/(don'?t|do not) ring|no bell/i, "벨은 누르지 말아주세요."],
  [/baby sleeping/i, "아기가 자고 있어요."],
  [/(please\s*)?call me/i, "전화 주시면 내려갈게요."],
  [/leave (it )?(in front of|at) (the )?door|in front of \d+/i, "문 앞에 놓아주세요."],
  [/(do not|don'?t) leave (it )?with (the )?guard/i, "경비원에게 맡기지 말아주세요."],
  [/security guard/i, "입구에 경비원이 있어요."],
  [/underground (entrance|parking)|use the underground/i, "지하 입구(지하주차장)로 와주세요."],
  [/(bikes?|motorcycles?) can'?t enter/i, "오토바이는 지상 진입이 안 돼요."],
  [/rooftop|very top/i, "옥상 집이에요."],
  [/basement/i, "지하 호실이에요."],
  [/stairs on the right/i, "건물 오른쪽에 계단이 있어요."],
  [/outside stairs/i, "건물 바깥 계단으로 올라가세요."],
  [/knock loudly/i, "크게 노크해주세요."],
  [/phone is broken/i, "제 전화기가 고장 났어요."],
  [/in the back|at the back/i, "안쪽(뒤쪽) 건물이에요."],
  [/lobby door/i, "공동현관 문이에요."],
  [/call button/i, "호출 버튼을 눌러주세요."],
  [/i will open it|i'?ll open it|i'?ll come down|come down to the lobby/i, "제가 열어드리거나 내려갈게요."],
  [/can'?t go up to the office floors|can'?t go up/i, "배달원은 사무실 층에 올라갈 수 없어요."],
  [/(thank you|thanks)/i, "감사합니다."],
];

/** Store request phrases (food and packing) — the shop is Korean-only, like the rider. */
const STORE_PHRASES: Array<[RegExp, string]> = [
  [/(no|not|without|less|mild|not too) (very )?spicy|no chil+i/i, "덜 맵게(맵지 않게) 해주세요."],
  [/extra spicy|more spicy|very spicy/i, "아주 맵게 해주세요."],
  [/no cilantro|no coriander/i, "고수는 빼주세요."],
  [/no onions?/i, "양파는 빼주세요."],
  [/no garlic/i, "마늘은 빼주세요."],
  [/no (msg)/i, "MSG는 넣지 말아주세요."],
  [/no (pork)/i, "돼지고기는 빼주세요."],
  [/no (beef)/i, "소고기는 빼주세요."],
  [/(i'?m |i am )?vegetarian|no meat/i, "채식이에요. 고기는 빼주세요."],
  [/(peanut|nut)s? allerg|allergic to (peanuts?|nuts?)/i, "땅콩(견과류) 알레르기가 있어요."],
  [/allerg/i, "알레르기가 있어요. 원문을 확인해 주세요."],
  [/sauce on the side|separate (the )?sauce/i, "소스는 따로 담아주세요."],
  [/less salt|not too salty/i, "덜 짜게 해주세요."],
  [/less sugar|not too sweet/i, "덜 달게 해주세요."],
  [/no ice/i, "얼음은 빼주세요."],
  [/(well[- ]done|cook (it )?well)/i, "충분히 익혀주세요."],
  [/(pack|wrap) (it )?(well|tightly|carefully)|don'?t spill/i, "흘리지 않게 잘 포장해주세요."],
  [/extra (napkins|tissues)/i, "냅킨 더 주세요."],
  [/(thank you|thanks)/i, "감사합니다."],
];

export interface RulesResult {
  ko: string;
  /** True when every sentence was either translated or is only a door-code statement. */
  allCovered: boolean;
}

const isCodeOnly = (s: string) =>
  /^(?:\w+\s){0,2}(?:code|password|pw|passcode)\b/i.test(s) && extractClues(s).some((c) => c.type === "door_code");

/** kind = "rider" (delivery note, default) or "store" (food and packing request). */
export function translateWithRules(text: string, kind: "rider" | "store" = "rider"): RulesResult {
  const phrases = kind === "store" ? STORE_PHRASES : PHRASES;
  // store requests are short lists ("no onions, sauce on the side"), so commas split them too
  const splitter = kind === "store" ? /(?<=[.!?,])\s+|\n+/ : /(?<=[.!?])\s+|\n+/;
  const sentences = text.split(splitter).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  let covered = 0;
  for (const s of sentences) {
    const hits = phrases.filter(([re]) => re.test(s)).map(([, ko]) => ko).filter(Boolean);
    if (hits.length) { out.push(...hits); covered++; }
    else if (isCodeOnly(s)) covered++;
  }
  return { ko: [...new Set(out)].join(" "), allCovered: sentences.length > 0 && covered === sentences.length };
}
