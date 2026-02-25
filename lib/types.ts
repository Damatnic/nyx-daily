export interface WordOfDay {
  word: string;
  type: string;        // "noun", "adjective", etc.
  definition: string;
  use_it: string;      // example sentence
}

export interface NewsItem {
  title: string;
  link: string;
  image?: string | null;      // article thumbnail URL (may be null)
  logo?: string | null;       // Clearbit logo URL: https://logo.clearbit.com/{domain}
  source: string;             // source name e.g. "TechCrunch"
  snippet?: string | null;    // 200-char description excerpt
  domain?: string;            // e.g. "techcrunch.com"
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

export interface MarketItem {
  label: string;      // "S&P 500", "NASDAQ", "BTC", "ETH"
  symbol: string;
  price: string;      // formatted: "6,890.07" or "$66,132"
  change_pct: number; // e.g. -0.28 or 3.25
  up: boolean;        // true if positive change
  kind: 'index' | 'crypto';
}

export interface NasaApod {
  title: string;
  explanation: string;  // 400-char excerpt
  url: string;          // image URL
  hdurl?: string;
  media_type: string;   // "image" or "video"
  date: string;
}

export interface OnThisDayEvent {
  year: number;
  text: string;
  link: string;
}

export interface DailyBriefing {
  generated_at: string;
  date: string;
  day: string;
  weather: string;
  quote: string | null;
  author: string | null;
  focus: string;
  school_deadlines: SchoolDeadline[];
  calendar: string[];
  gmail_summary: string;
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
  markets?: MarketItem[];
  apod?: NasaApod | null;
  on_this_day?: OnThisDayEvent[];
  word_of_the_day?: WordOfDay;
}
