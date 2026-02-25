# Nyx Daily — Full Build Brief

## Project
Build a premium personal dashboard website called **Nyx Daily** for Nick D'Amato.
This is a real production website deployed to Vercel. Do NOT cut corners on design or code quality.

## Tech Stack
- **Next.js 14** with App Router (TypeScript)
- **Tailwind CSS** with custom config
- **No external UI libraries** — custom components only (we want total design control)
- **No database** — reads from JSON files in `public/data/`
- `lucide-react` for icons only

## Design Aesthetic — READ THIS CAREFULLY
This must look like a premium product. Think: Linear.app meets a Bloomberg terminal with a space/cosmic vibe.

- Background: `#07070f` — very dark near-black with blue undertone
- Card bg: `#0d0d1a` with `border: 1px solid rgba(255,255,255,0.06)`
- Accent purple: `#8b5cf6`
- Accent cyan: `#06b6d4`
- Accent gold/amber: `#f59e0b`
- Accent emerald (for good/done): `#10b981`
- Accent red (for urgent): `#ef4444`
- Text primary: `#f1f5f9`
- Text secondary: `#94a3b8`
- Text muted: `#475569`
- Font: Geist (from next/font/google fallback to Inter)
- Subtle gradient on hero: `linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.04) 100%)`
- Cards have `backdrop-blur-sm` glass effect
- Smooth hover transitions on all interactive elements
- Section headers use thin separator lines
- Mobile responsive — must look great on phones

## File Structure
```
/
├── app/
│   ├── layout.tsx           # Root layout with nav
│   ├── page.tsx             # Today's briefing (home)
│   ├── globals.css
│   ├── archive/
│   │   └── page.tsx         # Archive grid
│   ├── day/[date]/
│   │   └── page.tsx         # Individual past day view
│   ├── school/
│   │   └── page.tsx         # School deadlines tracker
│   └── tools/
│       └── page.tsx         # AI/App of the day + history
├── components/
│   ├── nav/
│   │   └── Navbar.tsx
│   ├── briefing/
│   │   ├── WeatherBar.tsx
│   │   ├── FocusCard.tsx
│   │   ├── SchoolDeadlines.tsx
│   │   ├── CalendarCard.tsx
│   │   ├── NewsSection.tsx
│   │   ├── AppOfTheDay.tsx
│   │   ├── WorkoutCard.tsx
│   │   ├── WellnessBlock.tsx
│   │   └── QuoteCard.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── SectionHeader.tsx
├── lib/
│   ├── types.ts             # All TypeScript types
│   └── data.ts              # Data loading helpers
└── public/
    └── data/
        ├── index.json        # ["2026-02-24", "2026-02-23", ...]
        ├── school-deadlines.json  # (copy from below)
        └── 2026-02-24.json  # Sample briefing (copy from below)
```

## Data Types (`lib/types.ts`)

```typescript
export interface NewsItem {
  title: string;
  link: string;
}

export interface SchoolDeadline {
  course: string;
  desc: string;
  due_date: string;
  due_str: string;
  days: number;
  weight: 'critical' | 'high' | 'medium' | 'low';
  done: boolean;
}

export interface AppOfTheDay {
  name: string;
  category: string;
  what: string;
  why: string;
  verdict: string;
  link: string;
  free: boolean;
  freemium?: boolean;
}

export interface WorkoutExercise {
  name: string;
  reps: string;
  note?: string;
}

export interface DailyBriefing {
  generated_at: string;
  date: string;
  day: string;
  weather: string;          // pre-formatted string: "☁️ Waukesha · 32°F ..."
  quote: string | null;
  author: string | null;
  focus: string;
  school_deadlines: SchoolDeadline[];
  calendar: string[];       // list of event strings
  gmail_summary: string;    // e.g. "3 unread emails"
  news: {
    us_news: NewsItem[];
    politics: NewsItem[];
    tech: NewsItem[];
    ai: NewsItem[];
    entertainment: NewsItem[];
    weird_news: NewsItem[];
    wisconsin: NewsItem[];
    til: NewsItem[];
  };
  app_of_the_day: AppOfTheDay;
  workout: {
    name: string;
    exercises: WorkoutExercise[];
  };
  breathwork: {
    name: string;
    steps: string;
    rounds: number;
  };
  health_tip: string;
  life_hack: { category: string; tip: string };
  money_tip: { category: string; tip: string };
}
```

## Sample Data Files

### `public/data/2026-02-24.json`
```json
{
  "generated_at": "2026-02-24T08:00:00",
  "date": "2026-02-24",
  "day": "Tuesday",
  "weather": "☁️ Waukesha · 32°F (feels 25°F) · Overcast · H:38° L:27°",
  "quote": "The question isn't who is going to let me; it's who is going to stop me.",
  "author": "Ayn Rand",
  "focus": "SQL Unit 1 Project due Thu — today's the day to push through it.",
  "school_deadlines": [
    { "course": "SQL", "desc": "Unit 1 Project", "due_date": "2026-02-26", "due_str": "Thu Feb 26", "days": 2, "weight": "high", "done": false },
    { "course": "Stats", "desc": "Homework 9 - Hypothesis Testing", "due_date": "2026-02-28", "due_str": "Sat Feb 28", "days": 4, "weight": "low", "done": false },
    { "course": "Stats", "desc": "CLS Hypothesis Testing", "due_date": "2026-03-01", "due_str": "Sun Mar 1", "days": 5, "weight": "medium", "done": false },
    { "course": "Stats", "desc": "Extra Quiz 5 - Hypothesis Testing", "due_date": "2026-03-01", "due_str": "Sun Mar 1", "days": 5, "weight": "medium", "done": false }
  ],
  "calendar": ["No events scheduled today"],
  "gmail_summary": "2 unread emails",
  "news": {
    "us_news": [
      { "title": "Senate passes bipartisan infrastructure amendment", "link": "https://axios.com" },
      { "title": "Federal Reserve signals rate decision coming next week", "link": "https://npr.org" }
    ],
    "politics": [
      { "title": "White House releases updated AI executive order framework", "link": "https://thehill.com" },
      { "title": "Congress debates social media platform accountability bill", "link": "https://cnn.com" }
    ],
    "tech": [
      { "title": "OpenAI announces GPT-5 availability expanding to all users", "link": "https://techcrunch.com" },
      { "title": "Apple Vision Pro gets major productivity update", "link": "https://techcrunch.com" },
      { "title": "GitHub Copilot adds autonomous PR review mode", "link": "https://news.ycombinator.com" }
    ],
    "ai": [
      { "title": "Google DeepMind releases new reasoning model beating o3", "link": "https://the-decoder.com" },
      { "title": "Anthropic Claude 3.7 adds real-time web browsing", "link": "https://venturebeat.com" }
    ],
    "entertainment": [
      { "title": "Dune 3 officially greenlit with original cast returning", "link": "https://variety.com" },
      { "title": "Netflix drops trailer for most expensive original series yet", "link": "https://collider.com" }
    ],
    "weird_news": [
      { "title": "Man discovers medieval sword while cleaning out grandfather's garage", "link": "https://odditycentral.com" }
    ],
    "wisconsin": [
      { "title": "Milwaukee Bucks trade deadline moves shake up playoff picture", "link": "https://urbanmilwaukee.com" }
    ],
    "til": [
      { "title": "TIL that octopuses have three hearts, two of which stop beating when they swim", "link": "https://reddit.com/r/todayilearned" }
    ]
  },
  "app_of_the_day": {
    "name": "Perplexity AI",
    "category": "AI Research",
    "what": "An AI-powered search engine that answers questions with cited sources in conversational format — no link lists, just answers.",
    "why": "When you need to research something fast, Perplexity cuts Google's 10-link scroll to a single sourced answer. Huge time saver for students and builders.",
    "verdict": "Replace your first Google search with this. Free tier is genuinely excellent.",
    "link": "https://perplexity.ai",
    "free": true,
    "freemium": true
  },
  "workout": {
    "name": "Upper Body",
    "exercises": [
      { "name": "Push-ups", "reps": "3 × 15", "note": "Wide grip — chest focus" },
      { "name": "Pike Push-ups", "reps": "3 × 10", "note": "Shoulder press alternative" },
      { "name": "Tricep Dips (chair)", "reps": "3 × 12", "note": "Keep elbows close" },
      { "name": "Superman Hold", "reps": "3 × 30s", "note": "Lower back + rear delts" },
      { "name": "Plank", "reps": "3 × 45s", "note": "Core stays tight" }
    ]
  },
  "breathwork": {
    "name": "Box Breathing",
    "steps": "In 4s → Hold 4s → Out 4s → Hold 4s",
    "rounds": 4
  },
  "health_tip": "Drink a full glass of water before your first coffee. Rehydrates and cuts false hunger signals.",
  "life_hack": {
    "category": "Productivity",
    "tip": "Write tomorrow's single most important task before you close your laptop. Eliminates morning decision fatigue completely."
  },
  "money_tip": {
    "category": "Budgeting",
    "tip": "Track every purchase for 30 days before trying to optimize anything. You can't cut what you haven't measured."
  }
}
```

### `public/data/index.json`
```json
["2026-02-24"]
```

### `public/data/school-deadlines.json`
Use the same structure as the briefing's school_deadlines array but covering all courses/assignments.

## Page Designs

### `/` — Today's Briefing (Home)
Layout:
```
[NAVBAR]
[HERO: Date + Weather bar full-width, subtle gradient bg]
[TWO COLUMN GRID]
  LEFT (2/3 width):
    - FocusCard (purple accent border)
    - NewsSection (tabbed: US | Politics | Tech/AI | WI)
    - AppOfTheDay
  RIGHT (1/3 width):
    - CalendarCard (today's events + gmail)
    - SchoolDeadlines (color-coded by urgency)
    - WorkoutCard
    - WellnessBlock (breathwork + health tip)
[QUOTE — full width, centered, large italic text]
```

On mobile: single column, stacked in logical order.

### `/archive` — Past Briefings
- Grid of cards, one per day, newest first
- Each card: date, day of week, weather summary, focus snippet
- Click → goes to `/day/YYYY-MM-DD`
- Filter by month (dropdown or tabs)

### `/day/[date]` — Past Day View
- Same layout as home but for a past day
- "← Back to Archive" link at top
- Show the date prominently

### `/school` — School Deadlines
- Full deadlines list from school-deadlines.json
- Grouped by course
- Color-coded: 🔴 overdue/today, 🟡 this week, 📅 upcoming
- Toggle to show/hide completed
- Progress bar per course (X of Y complete)

### `/tools` — AI & App Spotlight
- Today's featured app (large card at top)
- Grid of past featured apps (if archive has them)
- Cards show: name, category, verdict, free/paid badge, link

## Navbar
- Left: 🌙 NYX DAILY (logo text)
- Right: Home | Archive | School | Tools
- Sticky, blurred background, thin bottom border
- Active route highlighted in purple
- Mobile: hamburger menu

## Key Components

### NewsSection
- Tabbed interface: US News | Politics | Tech & AI | Wisconsin
- Each tab shows 2-3 news items
- Each item: title (linked, opens new tab), source badge
- Compact, readable, not overwhelming

### AppOfTheDay
- Large feature card with purple/cyan gradient header
- App name + category badge
- Three sections: "What it is" | "Why it matters" | "The verdict"
- CTA button: "Try it →" (links to app)
- Free/Freemium/Paid badge

### SchoolDeadlines
- Each item: colored dot (red/yellow/green) + course + desc + due date
- "X days" countdown badge
- Strikethrough + muted styling for done items
- Urgency grows visually as deadline approaches

### WorkoutCard
- Exercise list with sets×reps
- Each exercise has a small note
- Clean, minimal — not a complex fitness app

### WeatherBar
- Full-width strip at top
- Shows: emoji + location + temp + feels like + high/low + condition
- Subtle gradient background

## Specific Styling Rules
- All cards: `rounded-xl border border-white/[0.06] bg-[#0d0d1a]`
- Section headers: uppercase tracking-widest text-xs text-slate-500 + thin line
- Links: always open in new tab, purple on hover
- Badges: small pill shapes, color-coded
- No Lorem Ipsum — use the real sample data
- Animations: `transition-all duration-200` on hover states
- No shadows — use borders instead (cleaner on dark)
- School deadline urgency colors:
  - 0-1 days: `text-red-400 bg-red-500/10 border-red-500/20`
  - 2-3 days: `text-amber-400 bg-amber-500/10 border-amber-500/20`
  - 4-7 days: `text-blue-400 bg-blue-500/10 border-blue-500/20`
  - 8+ days: `text-slate-400 bg-slate-500/10 border-slate-500/20`
  - done: `opacity-40 line-through`

## Data Loading (`lib/data.ts`)
```typescript
// All data loading is done server-side (Next.js server components)
// Read from public/data/ directory using fs.readFileSync
// Never expose private data — this site is for personal use

export async function getTodaysBriefing(): Promise<DailyBriefing | null>
export async function getBriefingByDate(date: string): Promise<DailyBriefing | null>
export async function getAllDates(): Promise<string[]>
export async function getSchoolDeadlines(): Promise<any>
```

Use `fs` module to read JSON files. This is a Next.js server component app — data is read at request time (dynamic, not static) so data stays fresh when files update.

## vercel.json
```json
{
  "framework": "nextjs"
}
```

## README.md
Write a clean README explaining:
- What it is
- How data flows (briefing script → JSON → GitHub → Vercel)
- How to run locally
- Data format reference

## After Building
1. Run `npm install` to verify deps install cleanly
2. Run `npm run build` and fix any TypeScript or build errors
3. Make sure `npm run dev` works
4. Commit everything: `git add -A && git commit -m "feat: initial Nyx Daily build"`
5. Push: `git push origin main`
6. Run: `openclaw system event --text "Nyx Daily build complete — ready to deploy on Vercel" --mode now`

## Quality Bar
This is a real website, not a demo. It should look good enough that a stranger would think it's a professional product. Every pixel should be intentional. No placeholder text, no broken layouts, no console errors.
