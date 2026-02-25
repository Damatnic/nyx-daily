# 🌙 Nyx Daily

A premium personal morning briefing dashboard built with Next.js and Tailwind CSS.

## What it is

Nyx Daily is a private, auto-generated daily briefing website for Nick D'Amato. Every morning at 8 AM, a script generates a JSON file with the day's:

- 🌤️ Weather snapshot
- 🎯 Daily focus / priority
- 📰 News roundup (US, Politics, Tech/AI, Wisconsin)
- 📅 Calendar events + Gmail summary
- 🎓 School deadlines (color-coded by urgency)
- 💪 Workout of the day
- 🌀 Breathwork, health tip, life hack, money tip
- 📱 App of the Day spotlight
- 💬 Daily quote

## Data Flow

```
Morning cron script
  → generates YYYY-MM-DD.json
  → commits to GitHub repo
  → Vercel auto-deploys
  → Fresh briefing at nyx-daily.vercel.app
```

All data lives in `public/data/`. No database, no API keys required at runtime.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Today's briefing (home) |
| `/archive` | Grid of all past briefings |
| `/day/YYYY-MM-DD` | Individual past day view |
| `/school` | Full school deadlines tracker |
| `/tools` | App of the Day history |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Format

Each daily briefing is a JSON file at `public/data/YYYY-MM-DD.json`. See `lib/types.ts` for the full TypeScript interface.

The `public/data/index.json` file is an array of available dates (newest first):

```json
["2026-02-24", "2026-02-23", ...]
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (custom dark theme)
- **lucide-react** (icons only)
- No database, no external APIs at runtime

## Design

Dark space aesthetic: near-black `#07070f` background, `#0d0d1a` cards, purple/cyan/gold accents. Inspired by Linear.app meets a Bloomberg terminal.
