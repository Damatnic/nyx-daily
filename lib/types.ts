export interface WordOfDay {
  word: string;
  type: string;        // "noun", "adjective", etc.
  definition: string;
  use_it: string;      // example sentence
}

export interface DailyFact {
  category: string;    // "Space", "Science", "Psychology", etc.
  emoji: string;
  fact: string;
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

export interface GitHubRepo {
  repo: string;
  url: string;
  description: string;
  language: string | null;
  stars: string;
  stars_today: number;
}

export interface RedditPost {
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  score: number;
  num_comments: number;
  thumbnail: string | null;
}

export interface ProductHuntPost {
  name: string;
  tagline: string;
  url: string;
  votes: number;
}

export interface YouTubeVideo {
  title: string;
  url: string;
  video_id: string;
  channel: string;
  thumbnail: string;
  published: string;
  category: string; // "tech" | "science" | "news" | "entertainment" | "education"
}

export interface HiddenGem {
  title: string;
  url: string;
  description: string;
  points: number;
  source: string; // "hackernews" | "producthunt"
  date: string;
}

export interface BreathworkStep {
  action: string;   // "Inhale", "Hold", "Exhale", "Rest"
  duration: number; // seconds
  emoji: string;
}

export interface BreathworkSession {
  name: string;
  steps: BreathworkStep[];
  rounds: number;
  description: string;
}

export interface WeatherDay {
  date: string;
  high: number;
  low: number;
  precip_pct: number;
  condition: string;
  emoji: string;
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
  facts_of_the_day?: DailyFact[];
  github_trending?: GitHubRepo[];
  reddit_hot?: RedditPost[];
  product_hunt?: ProductHuntPost[];
  forecast?: WeatherDay[];
  youtube_picks?: YouTubeVideo[];
  hidden_gems?: HiddenGem[];
  breathwork_session?: BreathworkSession;
  releases_today?: ReleasesToday;
  hacker_news?: HackerNewsItem[];
  personal_github?: PersonalGitHub;
  tldr?: string;
}

export interface HackerNewsItem {
  title: string;
  link: string;
  source: string;
  domain?: string;
  score: number;
  num_comments: number;
  hn_url: string;
  snippet?: string | null;
}

export interface GitHubCommit {
  repo: string;
  message: string;
  date: string;
}

export interface GitHubPR {
  title: string;
  repo: string;
  url: string;
  state: string;
}

export interface GitHubRepoActivity {
  repo: string;
  full: string;
  pushes: number;
  url: string;
}

export interface PersonalGitHub {
  commits: GitHubCommit[];
  prs: GitHubPR[];
  repos?: GitHubRepoActivity[];
  summary: string;
}

export interface ReleaseItem {
  type: 'movie' | 'tv' | 'game' | 'album';
  title: string;
  url: string;
  rating?: number | null;
  // movie
  year?: string;
  // tv
  network?: string;
  // game
  platforms?: string[];
  released?: string;
  // album
  artist?: string;
}

export interface ReleasesToday {
  movies: ReleaseItem[];
  tv:     ReleaseItem[];
  games:  ReleaseItem[];
  music:  ReleaseItem[];
}
