import { NextRequest, NextResponse } from "next/server";
import { callOpenAIJson } from "@/lib/openai";
import {
  buildAnalysisPrompt,
  buildHumanizePrompt,
  buildQualityPrompt,
} from "@/lib/prompts";
import {
  AnalysisResult,
  HumanizeRequestBody,
  HumanizeResponseBody,
  QualityScores,
} from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 90000; // characters (~15,000 words)
const MIN_TEXT_LENGTH = 20;
const MAX_REVISIONS = 1; // additional rewrite attempts beyond the first pass
const MEANING_THRESHOLD = 90; // trigger a revision if meaningPreserved falls below this

const VALID_STYLES = [
  "natural",
  "professional",
  "academic",
  "conversational",
  "casual",
  "creative",
  "technical",
  "simple",
  "custom",
];
const VALID_STRENGTHS = ["light", "balanced", "strong", "custom"];

function countCitations(text: string): number {
  const matches = text.match(/\(([^()]*\d{4}[^()]*)\)|\[\d+\]/g);
  return matches ? matches.length : 0;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You've reached the current usage limit. Please try again later." },
      { status: 429 }
    );
  }

  let body: HumanizeRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();

  if (!text) {
    return NextResponse.json(
      { error: "Please paste some text before humanizing it." },
      { status: 400 }
    );
  }
  if (text.length < MIN_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "That text is too short to analyze meaningfully. Add a bit more." },
      { status: 400 }
    );
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      {
        error: `Your text is too long (${text.length.toLocaleString()} characters, limit 15,000 words / 90,000 characters). Try processing it in smaller sections.`,
      },
      { status: 400 }
    );
  }
  if (!VALID_STYLES.includes(body.style)) {
    return NextResponse.json({ error: "Invalid writing style." }, { status: 400 });
  }
  if (!VALID_STRENGTHS.includes(body.strength)) {
    return NextResponse.json({ error: "Invalid humanization strength." }, { status: 400 });
  }

  try {
    // Stage 1 — analyze
    const analysisPrompt = buildAnalysisPrompt(text);
    const analysis = await callOpenAIJson<AnalysisResult>(
      [
        { role: "system", content: analysisPrompt.system },
        { role: "user", content: analysisPrompt.user },
      ],
      { temperature: 0.2 }
    );

    // Stage 2 — humanize
    const humanizePrompt = buildHumanizePrompt(body, analysis);
    let result = await callOpenAIJson<{ humanizedText: string; changes: string[] }>(
      [
        { role: "system", content: humanizePrompt.system },
        { role: "user", content: humanizePrompt.user },
      ],
      { temperature: 0.75 }
    );

    // Stage 3 — quality check
    const qualityPrompt = buildQualityPrompt(text, result.humanizedText);
    let scores = await callOpenAIJson<QualityScores>(
      [
        { role: "system", content: qualityPrompt.system },
        { role: "user", content: qualityPrompt.user },
      ],
      { temperature: 0.1 }
    );

    // Stage 4 — automatic revision if meaning preservation is weak or issues were flagged
    let revisions = 0;
    while (
      revisions < MAX_REVISIONS &&
      body.preserveMeaning &&
      (scores.meaningPreserved < MEANING_THRESHOLD || scores.issues.length > 0)
    ) {
      revisions += 1;
      const feedback = scores.issues.join("; ") || "meaning preservation was too low";
      const retryPrompt = buildHumanizePrompt(body, analysis, feedback);
      result = await callOpenAIJson<{ humanizedText: string; changes: string[] }>(
        [
          { role: "system", content: retryPrompt.system },
          { role: "user", content: retryPrompt.user },
        ],
        { temperature: 0.6 }
      );

      const retryQualityPrompt = buildQualityPrompt(text, result.humanizedText);
      scores = await callOpenAIJson<QualityScores>(
        [
          { role: "system", content: retryQualityPrompt.system },
          { role: "user", content: retryQualityPrompt.user },
        ],
        { temperature: 0.1 }
      );
    }

    const response: HumanizeResponseBody = {
      humanizedText: result.humanizedText,
      changes: result.changes ?? [],
      scores,
      analysis,
      citationsPreserved: {
        original: countCitations(text),
        final: countCitations(result.humanizedText),
      },
      revisions,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("humanize pipeline error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing your text. Please try again." },
      { status: 500 }
    );
  }
}
