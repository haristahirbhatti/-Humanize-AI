export type WritingStyle =
  | "natural"
  | "professional"
  | "academic"
  | "conversational"
  | "casual"
  | "creative"
  | "technical"
  | "simple"
  | "custom";

export type HumanizationStrength = "light" | "balanced" | "strong" | "custom";

export interface HumanizeRequestBody {
  text: string;
  style: WritingStyle;
  customStyle?: string;
  strength: HumanizationStrength;
  customInstructions?: string;
  preserveMeaning: boolean;
  writingProfile?: WritingProfile | null;
}

export interface WritingProfile {
  formality: number;
  vocabulary: number;
  directness: number;
  personality: number;
  sentenceLength: "short" | "medium" | "long";
  summary: string;
}

export interface AnalysisResult {
  tone: string;
  repetitivePatterns: string[];
  genericPhrases: string[];
  technicalTerms: string[];
  facts: string[];
  numbers: string[];
  citations: string[];
  sentenceLengthVariation: "low" | "medium" | "high";
}

export interface QualityScores {
  naturalness: number;
  readability: number;
  sentenceVariation: number;
  vocabulary: number;
  toneConsistency: number;
  repetition: number;
  meaningPreserved: number;
  grammar: number;
  issues: string[];
}

export interface HumanizeResponseBody {
  humanizedText: string;
  changes: string[];
  scores: QualityScores;
  analysis: AnalysisResult;
  citationsPreserved: {
    original: number;
    final: number;
  };
  revisions: number;
}

export interface ApiErrorBody {
  error: string;
}
