export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-secondary sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-primary text-xs font-semibold text-white">
            H
          </span>
          <span>Humanize AI</span>
        </div>
        <p className="max-w-md text-center sm:text-right">
          Writing-quality scores are Humanize AI&apos;s own estimate, not a guarantee against any
          specific detector.
        </p>
      </div>
    </footer>
  );
}
