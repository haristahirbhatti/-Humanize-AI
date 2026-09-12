"use client";

import { HumanizeResponseBody } from "@/lib/types";

interface ResultsPanelProps {
  result: HumanizeResponseBody;
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  copied: boolean;
  regenerating: boolean;
}

const BREAKDOWN_LABELS: { key: keyof HumanizeResponseBody["scores"]; label: string }[] = [
  { key: "naturalness", label: "Naturalness" },
  { key: "readability", label: "Readability" },
  { key: "sentenceVariation", label: "Sentence variation" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "toneConsistency", label: "Tone consistency" },
  { key: "repetition", label: "Repetition" },
];

export function ResultsPanel({
  result,
  onCopy,
  onDownload,
  onRegenerate,
  copied,
  regenerating,
}: ResultsPanelProps) {
  const { scores } = result;

  return (
    <div className="space-y-5">
      {/* Score header */}
      <div className="grid gap-4 rounded-card border border-border bg-surface p-6 shadow-card sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-secondary">Naturalness score</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-primary-dark">
            {scores.naturalness}
            <span className="text-lg font-normal text-secondary"> / 100</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-secondary">Meaning preserved</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-text">
            {scores.meaningPreserved}
            <span className="text-lg font-normal text-secondary">%</span>
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <p className="mb-4 text-xs font-medium text-secondary">Score breakdown</p>
        <div className="space-y-3">
          {BREAKDOWN_LABELS.map(({ key, label }) => {
            const value = scores[key] as number;
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-text">{label}</span>
                  <span className="font-medium text-secondary">{value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Changes */}
      {result.changes.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <p className="mb-3 text-xs font-medium text-secondary">What changed</p>
          <ul className="space-y-2">
            {result.changes.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] text-text">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  className="mt-[3px] shrink-0"
                >
                  <path d="M5 12.5 9.5 17 19 7" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Protection summary */}
      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <p className="mb-3 text-xs font-medium text-secondary">Protection summary</p>
        <div className="grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
          <SummaryStat label="Facts tracked" value={result.analysis.facts.length} />
          <SummaryStat label="Numbers tracked" value={result.analysis.numbers.length} />
          <SummaryStat
            label="Citations"
            value={`${result.citationsPreserved.final}/${result.citationsPreserved.original}`}
          />
          <SummaryStat label="Grammar" value={`${scores.grammar}/100`} />
        </div>
        {scores.issues.length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-border pt-4">
            {scores.issues.map((issue, i) => (
              <p key={i} className="flex items-start gap-2 text-[13px] text-amber-700">
                <span className="mt-[3px]">&#9888;</span>
                {issue}
              </p>
            ))}
          </div>
        )}
        {result.revisions > 0 && (
          <p className="mt-3 text-[12px] text-secondary">
            Automatically revised {result.revisions} time
            {result.revisions > 1 ? "s" : ""} to improve meaning preservation.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCopy}
          className="rounded-control bg-primary px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {copied ? "Copied" : "Copy result"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="rounded-control border border-border px-4 py-2.5 text-[13.5px] font-medium text-text transition-colors hover:bg-primary/5 disabled:opacity-50"
        >
          {regenerating ? "Regenerating…" : "Regenerate"}
        </button>
        <button
          onClick={onDownload}
          className="rounded-control border border-border px-4 py-2.5 text-[13.5px] font-medium text-text transition-colors hover:bg-primary/5"
        >
          Download .txt
        </button>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-secondary">{label}</div>
      <div className="font-medium text-text">{value}</div>
    </div>
  );
}
