"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Editor } from "@/components/humanizer/Editor";
import { Controls } from "@/components/humanizer/Controls";
import { ProcessingState } from "@/components/humanizer/ProcessingState";
import { ResultsPanel } from "@/components/humanizer/ResultsPanel";
import {
  HumanizationStrength,
  HumanizeResponseBody,
  WritingProfile,
  WritingStyle,
} from "@/lib/types";
import { saveRecentDocument } from "@/lib/storage";

export default function HumanizerPage() {
  const [original, setOriginal] = useState("");
  const [style, setStyle] = useState<WritingStyle>("natural");
  const [customStyle, setCustomStyle] = useState("");
  const [strength, setStrength] = useState<HumanizationStrength>("balanced");
  const [customInstructions, setCustomInstructions] = useState("");
  const [preserveMeaning, setPreserveMeaning] = useState(true);
  const [writingProfile, setWritingProfile] = useState<WritingProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HumanizeResponseBody | null>(null);

  const [editingHumanized, setEditingHumanized] = useState(false);
  const [humanizedDraft, setHumanizedDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, []);

  function startStageAnimation() {
    setStage(0);
    let current = 0;
    stageTimer.current = setInterval(() => {
      current = Math.min(current + 1, 3);
      setStage(current as 0 | 1 | 2 | 3);
      if (current >= 3 && stageTimer.current) {
        clearInterval(stageTimer.current);
      }
    }, 1100);
  }

  function stopStageAnimation() {
    if (stageTimer.current) clearInterval(stageTimer.current);
    setStage(3);
  }

  async function runHumanize(isRegenerate = false) {
    setError(null);

    if (!original.trim()) {
      setError("Please paste some text before humanizing it.");
      return;
    }

    if (isRegenerate) setRegenerating(true);
    else setLoading(true);

    startStageAnimation();

    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: original,
          style,
          customStyle: style === "custom" ? customStyle : undefined,
          strength,
          customInstructions: strength === "custom" ? customInstructions : undefined,
          preserveMeaning,
          writingProfile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong while processing your text.");
      }

      const typed = data as HumanizeResponseBody;
      setResult(typed);
      setHumanizedDraft(typed.humanizedText);
      setEditingHumanized(false);

      saveRecentDocument({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        originalText: original,
        humanizedText: typed.humanizedText,
        style,
        strength,
        naturalness: typed.scores.naturalness,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      stopStageAnimation();
      setLoading(false);
      setRegenerating(false);
    }
  }

  function handleCopy() {
    if (!humanizedDraft) return;
    navigator.clipboard.writeText(humanizedDraft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function handleDownload() {
    if (!humanizedDraft) return;
    const blob = new Blob([humanizedDraft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const isBusy = loading || regenerating;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Humanizer
            </h1>
            <p className="mt-2 max-w-prose text-[14.5px] text-secondary">
              Paste your text, choose how it should sound, and review the rewrite before you use
              it.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <Editor
                original={original}
                onOriginalChange={setOriginal}
                humanized={result ? humanizedDraft : ""}
                editingHumanized={editingHumanized}
                onHumanizedChange={setHumanizedDraft}
                disabled={isBusy}
              />

              {error && (
                <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => runHumanize(false)}
                  disabled={isBusy}
                  className="rounded-control bg-primary px-6 py-3 text-[14.5px] font-medium text-white shadow-card transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Humanizing…" : "\u2728 Humanize text"}
                </button>

                {result && (
                  <button
                    onClick={() => setEditingHumanized((v) => !v)}
                    className="text-[13.5px] font-medium text-secondary transition-colors hover:text-text"
                  >
                    {editingHumanized ? "Lock result" : "Edit result"}
                  </button>
                )}
              </div>

              {isBusy && <ProcessingState stage={stage} />}

              {result && !isBusy && (
                <div className="lg:hidden">
                  <ResultsPanel
                    result={result}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onRegenerate={() => runHumanize(true)}
                    copied={copied}
                    regenerating={regenerating}
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-card border border-border bg-surface p-5 shadow-card">
                <Controls
                  style={style}
                  onStyleChange={setStyle}
                  customStyle={customStyle}
                  onCustomStyleChange={setCustomStyle}
                  strength={strength}
                  onStrengthChange={setStrength}
                  customInstructions={customInstructions}
                  onCustomInstructionsChange={setCustomInstructions}
                  preserveMeaning={preserveMeaning}
                  onPreserveMeaningChange={setPreserveMeaning}
                  writingProfile={writingProfile}
                  onWritingProfileChange={setWritingProfile}
                />
              </div>

              {result && !isBusy && (
                <div className="hidden lg:block">
                  <ResultsPanel
                    result={result}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onRegenerate={() => runHumanize(true)}
                    copied={copied}
                    regenerating={regenerating}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
