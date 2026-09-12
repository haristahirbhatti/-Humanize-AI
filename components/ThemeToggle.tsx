"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-9 w-9 items-center justify-center rounded-control border border-border text-text transition-colors hover:bg-primary/5"
    >
      {theme === "light" ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6" />
        </svg>
      )}
    </button>
  );
}
