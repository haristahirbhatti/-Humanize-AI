# Humanize AI

**Make AI writing sound like you.**

A Next.js web app that rewrites AI-generated or robotic text into natural, readable, personalized
writing — while protecting facts, numbers, names, and citations. No login, no accounts, no
database for this version; recent documents are kept in the browser's local storage only.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design tokens in `tailwind.config.ts` / `app/globals.css`)
- OpenAI API, called only from server-side API routes — the key never reaches the browser

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your OPENAI_API_KEY
npm run dev
```

Open http://localhost:3000.

## How the humanization pipeline works

`app/api/humanize/route.ts` runs a multi-stage pipeline per request:

1. **Analyze** — reads the input and extracts tone, repetitive patterns, generic phrases,
   technical terms, facts/numbers, and citations, without rewriting anything.
2. **Humanize** — rewrites the text using the chosen style, strength, optional personal writing
   profile, and (if enabled) meaning-preservation constraints.
3. **Quality check** — scores the rewrite on naturalness, readability, sentence variation,
   vocabulary, tone consistency, repetition, meaning preservation, and grammar, and flags any
   concrete issues (e.g. a changed number or dropped citation).
4. **Automatic revision** — if meaning preservation is too low or issues were flagged, the
   pipeline rewrites once more with that feedback folded in, then re-checks quality. Capped at one
   extra pass to control latency and API cost.

`app/api/style-profile/route.ts` powers "Write like me": it turns a pasted writing sample into a
compact style profile (formality, vocabulary, directness, personality, sentence length) that gets
passed into the humanize prompt.

Every score shown in the UI is Humanize AI's own model-based estimate of writing quality — not a
guarantee against any specific AI-detection tool.

## Project structure

```
app/
  page.tsx                  Landing page
  humanizer/page.tsx        Main tool (editor, controls, results)
  api/humanize/route.ts     Humanization pipeline
  api/style-profile/route.ts "Write like me" analysis
  globals.css               Design tokens (light/dark)
components/
  Navbar.tsx, Footer.tsx, ThemeToggle.tsx, ThemeProvider.tsx
  humanizer/                Editor, Controls, ProcessingState, ResultsPanel
lib/
  openai.ts                 Server-side OpenAI wrapper (JSON mode)
  prompts.ts                Prompt builders for each pipeline stage
  types.ts                  Shared TypeScript types
  storage.ts                localStorage helpers for recent documents
  rate-limit.ts             In-memory per-IP rate limiter
```

## Notes & limits (current scope)

- **No auth, no database.** Everything works anonymously; "recent documents" live in the
  browser's local storage on that device only.
- **Rate limiting** is in-memory and per-instance — fine for a single-server MVP deploy, but swap
  in a durable store (e.g. Upstash Redis) before running on multi-instance/serverless hosting at
  scale.
- **Max input length** is 8,000 characters per request (`MAX_TEXT_LENGTH` in
  `app/api/humanize/route.ts`); longer text should be processed in sections.
- **Not included yet** (see the product doc's Version 2/3 roadmap): PDF export, multiple rewrite
  versions side by side, sentence-level inline suggestions, and a credits/usage system.

## Environment variables

| Variable          | Required | Default         |
| ------------------ | -------- | --------------- |
| `OPENAI_API_KEY`   | Yes      | —               |
| `OPENAI_MODEL`     | No       | `gpt-4o-mini`   |

## Deploying

Any host that supports Next.js API routes (Vercel, Render, a Node server, etc.) works. Set
`OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) as environment variables on that host — never
commit them.
