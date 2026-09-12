import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-sm font-semibold text-white">
            H
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-text">
            Humanize AI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-secondary md:flex">
          <Link href="/humanizer" className="transition-colors hover:text-text">
            Humanizer
          </Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-text">
            How it works
          </Link>
          <Link href="/#why" className="transition-colors hover:text-text">
            Why Humanize AI
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/humanizer"
            className="hidden rounded-control bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark sm:inline-block"
          >
            Try now
          </Link>
        </div>
      </div>
    </header>
  );
}
