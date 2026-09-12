"use client";

interface EditorProps {
  original: string;
  onOriginalChange: (v: string) => void;
  humanized: string;
  editingHumanized: boolean;
  onHumanizedChange: (v: string) => void;
  disabled: boolean;
}

const MAX_LENGTH = 8000;

export function Editor({
  original,
  onOriginalChange,
  humanized,
  editingHumanized,
  onHumanizedChange,
  disabled,
}: EditorProps) {
  return (
    <div className="grid divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-card sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="text-xs font-medium text-secondary">Original</span>
          <span className="text-[11px] text-secondary">
            {original.length}/{MAX_LENGTH}
          </span>
        </div>
        <textarea
          value={original}
          onChange={(e) => onOriginalChange(e.target.value.slice(0, MAX_LENGTH))}
          disabled={disabled}
          placeholder="Paste your AI-generated or robotic text here..."
          className="editor-scroll h-64 w-full resize-none bg-transparent p-5 pt-3 text-[14.5px] leading-relaxed text-text placeholder:text-secondary/70 focus:outline-none disabled:opacity-60 sm:h-80"
        />
      </div>

      <div className="flex flex-col bg-primary/[0.03]">
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="text-xs font-medium text-primary-dark">Humanized</span>
        </div>
        <textarea
          value={humanized}
          onChange={(e) => onHumanizedChange(e.target.value)}
          readOnly={!editingHumanized}
          placeholder="Your result appears here..."
          className="editor-scroll h-64 w-full resize-none bg-transparent p-5 pt-3 text-[14.5px] leading-relaxed text-text placeholder:text-secondary/70 focus:outline-none sm:h-80"
        />
      </div>
    </div>
  );
}
