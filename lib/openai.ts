const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

/**
 * Calls the OpenAI Chat Completions API and expects a strict JSON object back.
 * Keeps the API key server-side only \u2014 this file must never be imported
 * from a client component.
 */
export async function callOpenAIJson<T>(
  messages: ChatMessage[],
  { temperature = 0.7 }: { temperature?: number } = {}
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env.local file (see .env.example)."
    );
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const raw: string | undefined = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("OpenAI returned a response that was not valid JSON.");
  }
}
