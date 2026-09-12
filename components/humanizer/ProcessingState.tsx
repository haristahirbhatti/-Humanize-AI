"use client";

interface ProcessingStateProps {
  stage: 0 | 1 | 2 | 3;
}

const STEPS = [
  "Analyzing structure",
  "Identifying patterns",
  "Humanizing text",
  "Checking quality",
];

export function ProcessingState({ stage }: ProcessingStateProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-card">
      <p className="mb-4 text-[13.5px] font-medium text-text">
        Analyzing your writing<span className="animate-pulse-soft">&hellip;</span>
      </p>
      <ul className="space-y-2.5">
        {STEPS.map((label, i) => {
          const state = i < stage ? "done" : i === stage ? "active" : "pending";
          return (
            <li key={label} className="flex items-center gap-2.5 text-[13.5px]">
              <StatusIcon state={state} />
              <span
                className={
                  state === "pending"
                    ? "text-secondary"
                    : state === "active"
                    ? "text-text"
                    : "text-secondary"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusIcon({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round">
        <path d="M5 12.5 9.5 17 19 7" />
      </svg>
    );
  }
  if (state === "active") {
    return <span className="h-[9px] w-[9px] animate-pulse-soft rounded-full bg-primary" />;
  }
  return <span className="h-[9px] w-[9px] rounded-full border border-border" />;
}
