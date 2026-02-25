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
}
