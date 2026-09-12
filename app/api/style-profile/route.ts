import { NextRequest, NextResponse } from "next/server";
import { callOpenAIJson } from "@/lib/openai";
import { buildStyleProfilePrompt } from "@/lib/prompts";
import { WritingProfile } from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_SAMPLE_LENGTH = 4000;
const MIN_SAMPLE_LENGTH = 40;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = checkRateLimit(`profile:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You've reached the current usage limit. Please try again later." },
      { status: 429 }
    );
  }

  let body: { sample?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const sample = (body.sample ?? "").trim();

  if (sample.length < MIN_SAMPLE_LENGTH) {
    return NextResponse.json(
      { error: "Paste a longer writing sample so we can pick up on your style." },
      { status: 400 }
    );
  }
  if (sample.length > MAX_SAMPLE_LENGTH) {
    return NextResponse.json(
      { error: `Your sample is too long (limit ${MAX_SAMPLE_LENGTH} characters).` },
      { status: 400 }
    );
  }

  try {
    const prompt = buildStyleProfilePrompt(sample);
    const profile = await callOpenAIJson<WritingProfile>(
      [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      { temperature: 0.2 }
    );
    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error("style-profile error:", err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing your sample. Please try again." },
      { status: 500 }
    );
  }
}
