import type { SourceLang } from "@/domain/types";

/** Cheap script-based detection. Romanized Korean looks like English and cannot be told apart here. */
export function detectLang(text: string): SourceLang {
  if (/[가-힣]/.test(text)) return "ko";
  if (/[぀-ヿ]/.test(text)) return "ja"; // kana
  if (/[一-鿿]/.test(text)) return "zh"; // han without kana
  if (/[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(text)) return "vi";
  if (/[A-Za-z]/.test(text)) return "en";
  return "other";
}
