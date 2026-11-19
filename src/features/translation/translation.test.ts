import { describe, expect, it } from "vitest";
import { samples } from "@/test/fixtures";
import { extractClues } from "./clues";
import { normalizeDetail } from "./detail";
import { detectLang } from "./lang";
import { translateRiderNote, verifyCodes } from "./pipeline";
import { PRESET_LABEL_KO } from "./presets";

describe("presets (B3 §3 wording)", () => {
  it("uses the exact Korean labels", () => {
    expect(PRESET_LABEL_KO.LEAVE_AT_DOOR_RING).toBe("문 앞에 두고 벨 눌러주세요");
    expect(PRESET_LABEL_KO.CALL_ON_ARRIVAL).toBe("도착하면 전화주세요");
  });
});

describe("clue extraction", () => {
  it("keeps door codes verbatim", () => {
    const v = extractClues("Gate code is 4826#. Building 101 is first. Please don't ring the bell").map((c) => c.value);
    expect(v).toContain("4826#");
    expect(v).toContain("101동");
  });
  it("handles prefix, suffix and keyword codes", () => {
    expect(extractClues("Door pw *2580").map((c) => c.value)).toContain("*2580");
    expect(extractClues("Code #7788").map((c) => c.value)).toContain("#7788");
    expect(extractClues("Ivy Officetel. Code 5050#").map((c) => c.value)).toContain("5050#");
    expect(extractClues("password 3690").map((c) => c.value)).toContain("3690");
  });
  it("does not invent a building from 'building has'", () => {
    expect(extractClues("Building has no sign").some((c) => c.type === "building")).toBe(false);
  });
  it("finds the code in every sample note that has one (any language)", () => {
    const withCode = samples.filter((o) => /[#*]\d{3,}|\d{3,}[#*]/.test(o.rider_request.text));
    expect(withCode.length).toBeGreaterThan(5);
    for (const o of withCode) expect(extractClues(o.rider_request.text).some((c) => c.type === "door_code"), o.order_id).toBe(true);
  });
});

describe("language detection", () => {
  it("detects the sample languages", () => {
    expect(detectLang("Gate code is 4826#")).toBe("en");
    expect(detectLang("玄関の暗証番号は0415*です")).toBe("ja");
    expect(detectLang("大门密码1357#，放门口就行，谢谢")).toBe("zh");
    expect(detectLang("Để ở kệ giày tầng 3 giúp em nhé")).toBe("vi");
    expect(detectLang("공동현관 #3579* 입니다")).toBe("ko");
  });
});

describe("unit normalisation", () => {
  it.each([
    ["1203, Bldg 101", "101동 1203호"],
    ["Bldg 102, Apt 1501", "102동 1501호"],
    ["102-1501", "102동 1501호"],
    ["3F", "3층"],
    ["Room 812", "812호"],
    ["#715", "715호"],
    ["201号室", "201호"],
    ["Phòng 312", "312호"],
    ["rooftop", "옥상"],
    ["Building B, 201", "B동 201호"],
  ])("%s → %s", (input, expected) => expect(normalizeDetail(input)).toBe(expected));
  it.each(["Flat 2B", "8F, Nexus Labs", "2nd floor, green door", "B01", "", "101동 1203호"])("leaves %j alone", (input) =>
    expect(normalizeDetail(input)).toBeNull());
});

describe("translation pipeline", () => {
  it("translates the no-ring note and keeps the code as a clue", async () => {
    const t = await translateRiderNote("Gate code is 4826#. Please don't ring the bell, baby sleeping", undefined);
    expect(t.text_ko).toContain("벨은 누르지 말아주세요");
    expect(t.text_ko).toContain("아기가 자고 있어요");
    expect(t.clues.map((c) => c.value)).toContain("4826#");
    expect(t.confidence).toBe("high");
  });
  it("marks partial coverage as low confidence", async () => {
    const t = await translateRiderNote("Gate code is 4826#. The blue gate next to the florist.", undefined);
    expect(t.confidence).toBe("low");
  });
  it("passes Korean through and gives up gracefully on other languages", async () => {
    expect((await translateRiderNote("공동현관 #3579* 입니다", undefined)).text_ko).toBe("공동현관 #3579* 입니다");
    const ja = await translateRiderNote("玄関の暗証番号は0415*です", undefined);
    expect(ja.text_ko).toBe("");
    expect(ja.clues.map((c) => c.value)).toContain("0415*");
    expect(ja.confidence).toBe("low");
  });
  it("uses AI only when the codes survive; otherwise falls back to rules", async () => {
    const good = await translateRiderNote("Gate code is 4826#", async () => "출입문 비밀번호는 4826# 입니다");
    expect(good.engine).toBe("ai");
    const bad = await translateRiderNote("Gate code is 4826#", async () => "출입문 비밀번호는 4286# 입니다");
    expect(bad.engine).toBe("rules");
    const down = await translateRiderNote("Gate code is 4826#", async () => { throw new Error("down"); });
    expect(down.engine).toBe("rules");
  });
  it("verifyCodes checks every code", () => {
    expect(verifyCodes("codes 1234# and *5678", "1234# *5678")).toBe(true);
    expect(verifyCodes("codes 1234# and *5678", "1234#")).toBe(false);
  });
});
