"use client";

import { useState } from "react";
import { HumanizationStrength, WritingProfile, WritingStyle } from "@/lib/types";

const STYLES: { value: WritingStyle; label: string }[] = [
  { value: "natural", label: "Natural" },
  { value: "professional", label: "Professional" },
  { value: "academic", label: "Academic" },
  { value: "conversational", label: "Conversational" },
  { value: "casual", label: "Casual" },
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
  { value: "simple", label: "Simple English" },
  { value: "custom", label: "Custom" },
];

const STRENGTHS: { value: HumanizationStrength; label: string; hint: string }[] = [
  { value: "light", label: "Light", hint: "Minimal rewriting" },
  { value: "balanced", label: "Balanced", hint: "Recommended" },
  { value: "strong", label: "Strong", hint: "Substantial rewrite" },
  { value: "custom", label: "Custom", hint: "Your instructions" },
];

interface ControlsProps {
  style: WritingStyle;
  onStyleChange: (v: WritingStyle) => void;
  customStyle: string;
  onCustomStyleChange: (v: string) => void;
  strength: HumanizationStrength;
  onStrengthChange: (v: HumanizationStrength) => void;
  customInstructions: string;
  onCustomInstructionsChange: (v: string) => void;
  preserveMeaning: boolean;
  onPreserveMeaningChange: (v: boolean) => void;
  writingProfile: WritingProfile | null;
  onWritingProfileChange: (v: WritingProfile | null) => void;
}

export function Controls({
  style,
  onStyleChange,
  customStyle,
  onCustomStyleChange,
  strength,
  onStrengthChange,
  customInstructions,
  onCustomInstructionsChange,
  preserveMeaning,
  onPreserveMeaningChange,
  writingProfile,
  onWritingProfileChange,
}: ControlsProps) {
  const [writeLikeMeOpen, setWriteLikeMeOpen] = useState(false);
  const [sample, setSample] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  async function analyzeSample() {
    setAnalyzing(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/style-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sample }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not analyze your sample.");
      onWritingProfileChange(data as WritingProfile);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Style */}
      <div>
        <label className="mb-2 block text-xs font-medium text-secondary">Writing style</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStyleChange(s.value)}
              className={`rounded-control border px-3 py-1.5 text-[13px] transition-colors ${
                style === s.value
                  ? "border-primary bg-primary/10 font-medium text-primary-dark"
                  : "border-border text-secondary hover:text-text"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {style === "custom" && (
          <textarea
            value={customStyle}
            onChange={(e) => onCustomStyleChange(e.target.value)}
            placeholder="Describe the style you want, e.g. “Write like a university student who understands the topic but avoids jargon.”"
            className="mt-3 w-full resize-none rounded-control border border-border bg-bg p-3 text-[13.5px] text-text placeholder:text-secondary/70"
            rows={2}
          />
        )}
      </div>

      {/* Strength */}
      <div>
        <label className="mb-2 block text-xs font-medium text-secondary">
          Humanization strength
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STRENGTHS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStrengthChange(s.value)}
              className={`rounded-control border px-3 py-2.5 text-left transition-colors ${
                strength === s.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-secondary/40"
              }`}
            >
              <div
                className={`text-[13px] font-medium leading-snug ${
                  strength === s.value ? "text-primary-dark" : "text-text"
                }`}
              >
                {s.label}
              </div>
              <div className="mt-0.5 text-[11px] leading-tight text-secondary">{s.hint}</div>
            </button>
          ))}
        </div>
        {strength === "custom" && (
          <textarea
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            placeholder="How should we rewrite it? E.g. “Keep technical terminology, avoid overly formal vocabulary.”"
            className="mt-3 w-full resize-none rounded-control border border-border bg-bg p-3 text-[13.5px] text-text placeholder:text-secondary/70"
            rows={2}
          />
        )}
      </div>

      {/* Preserve meaning */}
      <label className="flex cursor-pointer items-start gap-3 rounded-control border border-border bg-bg p-3.5">
        <input
          type="checkbox"
          checked={preserveMeaning}
          onChange={(e) => onPreserveMeaningChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span>
          <span className="block text-[13.5px] font-medium text-text">Preserve meaning</span>
          <span className="block text-[12.5px] text-secondary">
            Locks in facts, numbers, names, technical terms, and citations while rewriting.
          </span>
        </span>
      </label>

      {/* Write like me */}
      <div className="rounded-control border border-border bg-bg p-3.5">
        <button
          type="button"
          onClick={() => setWriteLikeMeOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-[13.5px] font-medium text-text">Write like me</span>
          <span className="text-secondary">{writeLikeMeOpen ? "\u2212" : "+"}</span>
        </button>

        {writingProfile && !writeLikeMeOpen && (
          <p className="mt-1.5 text-[12.5px] text-secondary">
            Style profile active &mdash; {writingProfile.summary}
          </p>
        )}

        {writeLikeMeOpen && (
          <div className="mt-3 space-y-3">
            <textarea
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              placeholder="Paste a sample of your own writing here..."
              rows={4}
              className="w-full resize-none rounded-control border border-border bg-surface p-3 text-[13.5px] text-text placeholder:text-secondary/70"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={analyzeSample}
                disabled={analyzing || sample.trim().length < 40}
                className="rounded-control bg-primary px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {analyzing ? "Analyzing…" : "Analyze my style"}
              </button>
              {writingProfile && (
                <button
                  type="button"
                  onClick={() => onWritingProfileChange(null)}
                  className="text-[12.5px] text-secondary hover:text-text"
                >
                  Clear profile
                </button>
              )}
            </div>
            {profileError && <p className="text-[12.5px] text-red-600">{profileError}</p>}
            {writingProfile && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-control bg-surface p-3 text-[12.5px] sm:grid-cols-4">
                <StatRow label="Formality" value={writingProfile.formality} />
                <StatRow label="Vocabulary" value={writingProfile.vocabulary} />
                <StatRow label="Directness" value={writingProfile.directness} />
                <StatRow label="Personality" value={writingProfile.personality} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-secondary">{label}</div>
      <div className="font-medium text-text">{value}/100</div>
    </div>
  );
}
