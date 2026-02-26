import { getTodaysBriefing } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import NewsTicker from '@/components/briefing/NewsTicker';
import HeroSection from '@/components/briefing/HeroSection';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import NasaApod from '@/components/briefing/NasaApod';
import WeatherCard from '@/components/briefing/WeatherCard';
import DailyExtras from '@/components/briefing/DailyExtras';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import OnThisDay from '@/components/briefing/OnThisDay';
import ScrollToTop from '@/components/briefing/ScrollToTop';
import SportsSection from '@/components/briefing/SportsSection';
import GithubTrending from '@/components/briefing/GithubTrending';
import RedditHot from '@/components/briefing/RedditHot';
import ProductHunt from '@/components/briefing/ProductHunt';
import YouTubeSection from '@/components/briefing/YouTubeSection';
import HiddenGemsSection from '@/components/briefing/HiddenGemsSection';
import WorkoutTracker from '@/components/briefing/WorkoutTracker';
import BreathworkCard from '@/components/briefing/BreathworkCard';
import LifeHackCard from '@/components/briefing/LifeHackCard';
import MoneyTipCard from '@/components/briefing/MoneyTipCard';
import HealthTipCard from '@/components/briefing/HealthTipCard';
import Link from 'next/link';
import RelativeTime from '@/components/ui/RelativeTime';

export const dynamic = 'force-dynamic';

/** Returns ISO week number for a date string like "2026-02-24" */
function getWeekNumber(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const dayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / 86_400_000);
  };
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const jan1Day = jan1.getDay(); // 0=Sun
  return Math.ceil((dayOfYear(d) + jan1Day) / 7);
}

/** Returns the day of the year (1-indexed) */
function getDayOfYear(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

/** Format date like "WEDNESDAY, FEBRUARY 25, 2026" */
function formatHeroDate(dateStr: string, day: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const dom = d.getDate();
  const year = d.getFullYear();
  return `${day.toUpperCase()}, ${month} ${dom}, ${year}`;
}

/** Count total news headlines */
function countHeadlines(news: Record<string, Array<unknown>>): number {
  return Object.values(news).reduce((sum, arr) => sum + arr.length, 0);
}

export default async function HomePage() {
  const briefing = await getTodaysBriefing();

  if (!briefing) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🌙</p>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">No briefing yet</h1>
            <p className="text-slate-400">Today&apos;s briefing hasn&apos;t been generated. Check back soon.</p>
          </div>
        </div>
      </>
    );
  }

  const weekNum = getWeekNumber(briefing.date);
  const dayOfYear = getDayOfYear(briefing.date);
  const heroDateStr = formatHeroDate(briefing.date, briefing.day);
  const headlineCount = countHeadlines(briefing.news as Record<string, Array<unknown>>);
  // Generate breathwork fallback text from old format
  const breathworkFallback = briefing.breathwork
    ? `${briefing.breathwork.name}: ${briefing.breathwork.steps} (${briefing.breathwork.rounds} rounds)`
    : undefined;

  return (
    <>
      <Navbar />

      <ScrollToTop />

      {/* Full-width hero */}
      <HeroSection
        briefing={briefing}
        weekNum={weekNum}
        heroDateStr={heroDateStr}
        dayOfYear={dayOfYear}
      />

      {/* Full-width sticky news ticker */}
      <NewsTicker news={briefing.news} />

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT MAIN COLUMN — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Focus */}
            <FocusCard focus={briefing.focus} />

            {/* News Section */}
            <NewsSection news={briefing.news} />

            {/* YouTube Picks */}
            <YouTubeSection videos={briefing.youtube_picks} />

            {/* Hidden Gems */}
            <HiddenGemsSection gems={briefing.hidden_gems} />

            {/* Sports Section */}
            {briefing.sports && briefing.sports.length > 0 && (
              <SportsSection sports={briefing.sports} />
            )}

            {/* GitHub Trending */}
            {briefing.github_trending && briefing.github_trending.length > 0 && (
              <GithubTrending repos={briefing.github_trending} />
            )}

            {/* Reddit Hot */}
            {briefing.reddit_hot && briefing.reddit_hot.length > 0 && (
              <RedditHot posts={briefing.reddit_hot} />
            )}

            {/* Product Hunt */}
            {briefing.product_hunt && briefing.product_hunt.length > 0 && (
              <ProductHunt posts={briefing.product_hunt} />
            )}

            {/* App of the Day */}
            <AppOfTheDay app={briefing.app_of_the_day} />

            {/* Standalone Tip Cards */}
            <LifeHackCard lifeHack={briefing.life_hack} />
            <MoneyTipCard moneyTip={briefing.money_tip} />
            <HealthTipCard healthTip={briefing.health_tip} />

            {/* Workout Tracker */}
            <WorkoutTracker workout={briefing.workout} date={briefing.date} />

            {/* Breathwork Card */}
            <BreathworkCard
              session={briefing.breathwork_session}
              fallbackText={breathworkFallback}
            />
          </div>

          {/* RIGHT RAIL — 1/3 width, sticky on desktop */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-[7.5rem] lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:scrollbar-none">
            {/* Weather Card with 5-day forecast */}
            <WeatherCard weather={briefing.weather} forecast={briefing.forecast} />

            {/* Daily Extras (Word + Facts) */}
            <DailyExtras
              word={briefing.word_of_the_day}
              facts={briefing.facts_of_the_day}
            />

            {/* School Deadlines */}
            <SchoolDeadlines deadlines={briefing.school_deadlines} />

            {/* Calendar & Email */}
            <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />

            {/* On This Day */}
            {briefing.on_this_day && briefing.on_this_day.length > 0 && (
              <OnThisDay events={briefing.on_this_day} />
            )}

            {/* NASA APOD */}
            {briefing.apod && <NasaApod apod={briefing.apod} />}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-10 border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 inline-block" />
              Data generated <RelativeTime timestamp={briefing.generated_at} />
            </span>
            <span className="text-slate-700">·</span>
            <span>{headlineCount} headlines</span>
          </div>
          <Link
            href="/archive"
            className="hover:text-slate-400 transition-colors duration-200 flex items-center gap-1"
          >
            View archive →
          </Link>
        </footer>
      </div>
    </>
  );
}
