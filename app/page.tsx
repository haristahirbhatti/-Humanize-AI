import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const features = [
  {
    title: "AI Humanizer",
    body: "Rewrites stiff, AI-generated paragraphs into natural sentences while keeping your original meaning intact.",
  },
  {
    title: "Style matching",
    body: "Feed it a sample of your own writing and it learns your sentence length, tone, and vocabulary.",
  },
  {
    title: "Meaning preservation",
    body: "Facts, numbers, names, and citations are protected so the rewrite never drifts from the source.",
  },
  {
    title: "Naturalness score",
    body: "See a transparent breakdown \u2014 readability, sentence variation, vocabulary, tone \u2014 for every result.",
  },
];

const steps = [
  { n: "1", title: "Paste", body: "Drop in the AI-generated or robotic text you want to fix." },
  { n: "2", title: "Customize", body: "Pick a writing style, a rewrite strength, and whether to lock in your own voice." },
  { n: "3", title: "Humanize", body: "A multi-step pipeline rewrites, then checks itself for meaning and grammar." },
  { n: "4", title: "Review", body: "Compare original and rewritten side by side, then copy or download." },
];

const whyPoints = [
  { title: "Natural writing", body: "Varied sentence rhythm and everyday phrasing instead of uniform, templated sentences." },
  { title: "Meaning protection", body: "Numbers, dates, names, and citations stay exactly as you wrote them." },
  { title: "Personal style", body: "Optionally match your own writing sample instead of a generic \u201cnatural\u201d voice." },
  { title: "Quality analysis", body: "Every rewrite ships with a score breakdown, not just a single pass/fail number." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="animate-fade-up">
              <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-text sm:text-6xl">
                Make AI writing
                <br />
                sound like you.
              </h1>
              <p className="mt-6 max-w-prose text-lg leading-relaxed text-secondary">
                Paste anything that reads a little too stiff, a little too uniform, a little too
                AI. Humanize AI rewrites it into natural, readable writing &mdash; without losing
                what it actually says.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/humanizer"
                  className="rounded-control bg-primary px-6 py-3.5 text-[15px] font-medium text-white shadow-card transition-colors hover:bg-primary-dark"
                >
                  Humanize my text
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-[15px] font-medium text-secondary transition-colors hover:text-text"
                >
                  See how it works
                </Link>
              </div>
              <p className="mt-8 text-sm text-secondary">
                No account needed. Nothing saved to a server &mdash; recent documents stay on your
                device.
              </p>
            </div>

            {/* Characteristic hero visual: a live before/after snippet */}
            <div className="animate-fade-up rounded-card border border-border bg-surface p-2 shadow-card [animation-delay:120ms]">
              <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-5">
                  <p className="mb-3 text-xs font-medium text-secondary">Before</p>
                  <p className="text-[14.5px] leading-relaxed text-secondary">
                    In today&apos;s digital landscape, it is important to note that effective
                    communication plays a crucial role in achieving organizational success.
                  </p>
                </div>
                <div className="bg-primary/[0.04] p-5">
                  <p className="mb-3 text-xs font-medium text-primary-dark">After</p>
                  <p className="text-[14.5px] leading-relaxed text-text">
                    Good communication isn&apos;t a nice-to-have &mdash; it&apos;s usually the
                    difference between a team that ships and one that stalls.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <span className="text-xs text-secondary">Naturalness</span>
                <span className="text-sm font-semibold text-primary-dark">92 / 100</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-surface/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="max-w-md text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Everything the rewrite needs to earn your trust
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="border-l-2 border-border pl-5">
                  <h3 className="text-[15px] font-semibold text-text">{f.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-secondary">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="text-sm font-semibold text-primary">{s.n}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-text">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-secondary">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section id="why" className="border-t border-border bg-surface/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              Why Humanize AI
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {whyPoints.map((w) => (
                <div key={w.title} className="rounded-card border border-border bg-bg p-6">
                  <h3 className="text-[15px] font-semibold text-text">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-secondary">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Make your writing yours
          </h2>
          <div className="mt-8">
            <Link
              href="/humanizer"
              className="inline-block rounded-control bg-primary px-7 py-3.5 text-[15px] font-medium text-white shadow-card transition-colors hover:bg-primary-dark"
            >
              Start humanizing
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
