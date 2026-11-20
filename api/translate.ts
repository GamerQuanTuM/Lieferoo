/**
 * POST /api/translate — Vercel Function. The API key stays here (env), never in the browser.
 *
 * Request  { text: string, target: "ko", kind?: "rider" | "store" }
 * Response { text_ko: string }   (status 4xx/5xx on failure → the app falls back to the phrasebook, then the original)
 *
 * Free model, picked by which key is set in Vercel → Settings → Environment Variables:
 *   GEMINI_API_KEY (Google AI Studio free tier)  — model: GEMINI_MODEL (default gemini-2.5-flash)
 *   GROQ_API_KEY   (Groq free tier)              — model: GROQ_MODEL   (default llama-3.3-70b-versatile)
 * The client still checks that every door code survived (translation/pipeline.ts verifyCodes).
 */

const MAX_TEXT = 500;
const TIMEOUT_MS = 3500;

const INSTRUCTIONS: Record<"rider" | "store", string> = {
  rider:
    "You translate a food-delivery customer's note for a Korean delivery rider. Write natural, polite, short Korean " +
    "that a rider can read at a glance.",
  store:
    "You translate a food-delivery customer's request for a Korean restaurant kitchen (food and packing requests). " +
    "Write natural, polite, short Korean.",
};

const RULES =
  "Rules: copy door codes, passwords, numbers, building and unit numbers, floor numbers, phone numbers and symbols " +
  "like # and * exactly as written. Write romanized Korean place names in Hangul when you are sure. Do not add, drop " +
  "or explain anything. If part of the text is already Korean, keep it. Reply with the Korean text only.";

export async function POST(request: Request): Promise<Response> {
  let body: { text?: unknown; target?: unknown; kind?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const kind = body.kind === "store" ? "store" : "rider";
  if (!text || text.length > MAX_TEXT || (body.target ?? "ko") !== "ko") return json({ error: "invalid request" }, 400);

  const prompt = `${INSTRUCTIONS[kind]}\n${RULES}\n\nText:\n${text}`;
  try {
    const ko = process.env.GEMINI_API_KEY
      ? await gemini(prompt, process.env.GEMINI_API_KEY)
      : process.env.GROQ_API_KEY
        ? await groq(prompt, process.env.GROQ_API_KEY)
        : null;
    if (ko === null) return json({ error: "translation is not set up" }, 503);
    if (!ko.trim()) return json({ error: "empty translation" }, 502);
    return json({ text_ko: ko.trim() }, 200);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "translate failed" }, 502);
  }
}

async function gemini(prompt: string, key: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`gemini ${res.status}`);
  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
}

async function groq(prompt: string, key: string): Promise<string> {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.2, max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`groq ${res.status}`);
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
