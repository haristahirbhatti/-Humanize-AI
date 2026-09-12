import {
  HumanizeRequestBody,
  WritingStyle,
  HumanizationStrength,
  WritingProfile,
} from "./types";

const STYLE_DESCRIPTIONS: Record<WritingStyle, string> = {
  natural: "balanced, everyday writing that doesn't call attention to itself",
  professional: "clear, workplace-appropriate writing suited for business communication",
  academic: "structured and formal, but still readable \u2014 not needlessly dense",
  conversational: "relaxed and personal, like explaining something to a colleague",
  casual: "simple, informal, low-friction writing",
  creative: "more expressive and stylistic, with room for personality",
  technical: "precise and terminology-preserving, written for a technical reader",
  simple: "plain vocabulary and short, direct sentences (aim for general audience readability)",
  custom: "a custom style described by the user",
};

const STRENGTH_DESCRIPTIONS: Record<HumanizationStrength, string> = {
  light: "Make minimal changes. Preserve most of the original structure and wording; only fix the most obviously robotic phrasing.",
  balanced: "Rewrite for natural flow, varied sentence length, and better word choice, while keeping the overall structure recognizable.",
  strong: "Rewrite substantially. You may reorder sentences and restructure paragraphs, as long as every fact and claim is preserved.",
  custom: "Follow the user's custom instructions for how much to change.",
};

export function buildAnalysisPrompt(text: string) {
  const system = `You are a writing analyst. You examine text for signs of stiff, AI-generated, or repetitive writing WITHOUT rewriting it. Respond only with a single JSON object, no prose, no markdown fences.

JSON shape:
{
  "tone": string,
  "repetitivePatterns": string[],
  "genericPhrases": string[],
  "technicalTerms": string[],
  "facts": string[],
  "numbers": string[],
  "citations": string[],
  "sentenceLengthVariation": "low" | "medium" | "high"
}

Keep each array to at most 8 short items. "facts" and "numbers" should list the specific values found in the text (names, dates, statistics, figures) that must not change in a rewrite. "citations" should list any inline citations or reference markers found (e.g. "(Smith, 2025)", "[1]").`;

  const user = `Analyze this text:\n\n"""${text}"""`;

  return { system, user };
}

export function buildHumanizePrompt(
  body: HumanizeRequestBody,
  analysis: unknown,
  feedback?: string
) {
  const styleLine =
    body.style === "custom" && body.customStyle
      ? body.customStyle
      : STYLE_DESCRIPTIONS[body.style];

  const strengthLine = STRENGTH_DESCRIPTIONS[body.strength];

  const profileLine = body.writingProfile
    ? describeProfile(body.writingProfile)
    : null;

  const system = `You are a skilled human editor. You rewrite AI-generated or robotic text so it reads naturally, while preserving the original meaning. You never invent facts, numbers, names, or claims that were not in the source. You vary sentence length and avoid generic filler phrases and uniform sentence structure. Respond only with a single JSON object, no prose, no markdown fences.

JSON shape:
{
  "humanizedText": string,
  "changes": string[]
}

"changes" should be a short list (max 6) of plain-language bullet points describing what you changed (e.g. "Reduced repetitive wording", "Varied sentence length"). Do not include quotes from the text in "changes".`;

  const constraints: string[] = [
    `Target style: ${styleLine}.`,
    `Rewrite strength: ${strengthLine}`,
  ];

  if (profileLine) constraints.push(profileLine);
  if (body.customInstructions) {
    constraints.push(`Additional instructions from the user: ${body.customInstructions}`);
  }
  if (body.preserveMeaning) {
    constraints.push(
      "Meaning preservation is critical: keep every fact, number, date, name, technical term, citation, and URL exactly as given. Do not add unsupported claims."
    );
  }
  if (feedback) {
    constraints.push(
      `A quality check on your previous attempt found issues \u2014 fix them this time: ${feedback}`
    );
  }

  const user = `Source analysis (for context, do not repeat it back): ${JSON.stringify(
    analysis
  )}

Constraints:
${constraints.map((c) => `- ${c}`).join("\n")}

Original text to rewrite:
"""${body.text}"""`;

  return { system, user };
}

export function buildQualityPrompt(originalText: string, humanizedText: string) {
  const system = `You are a strict writing quality evaluator. Compare an original text to a rewritten version and score the rewrite. Respond only with a single JSON object, no prose, no markdown fences.

JSON shape:
{
  "naturalness": number,
  "readability": number,
  "sentenceVariation": number,
  "vocabulary": number,
  "toneConsistency": number,
  "repetition": number,
  "meaningPreserved": number,
  "grammar": number,
  "issues": string[]
}

All numeric fields are 0-100. "meaningPreserved" should specifically measure whether facts, numbers, names, and claims from the original survive in the rewrite \u2014 be strict here. "repetition" scores how well repetition was reduced (100 = no unwanted repetition). "issues" should list any concrete problems found (empty array if none), such as a changed number or a dropped citation.`;

  const user = `ORIGINAL:\n"""${originalText}"""\n\nREWRITE:\n"""${humanizedText}"""`;

  return { system, user };
}

export function buildStyleProfilePrompt(sample: string) {
  const system = `You analyze a writing sample and produce a compact style profile. Respond only with a single JSON object, no prose, no markdown fences.

JSON shape:
{
  "formality": number,
  "vocabulary": number,
  "directness": number,
  "personality": number,
  "sentenceLength": "short" | "medium" | "long",
  "summary": string
}

Numeric fields are 0-100. "summary" is one sentence describing the voice in plain language, written so it could be handed to another writer as a style brief.`;

  const user = `Writing sample:\n\n"""${sample}"""`;

  return { system, user };
}

function describeProfile(profile: WritingProfile) {
  return `Match this personal writing style \u2014 ${profile.summary} (formality ${profile.formality}/100, vocabulary level ${profile.vocabulary}/100, directness ${profile.directness}/100, personality ${profile.personality}/100, typically ${profile.sentenceLength} sentences).`;
}
