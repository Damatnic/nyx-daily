import { getTodaysBriefing } from '@/lib/data';
import MarketsBar from '@/components/briefing/MarketsBar';
import HeroSection from '@/components/briefing/HeroSection';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import NasaApod from '@/components/briefing/NasaApod';
import WeatherCard from '@/components/briefing/WeatherCard';
import WordOfDay from '@/components/briefing/WordOfDay';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import OnThisDay from '@/components/briefing/OnThisDay';
import WorkoutCard from '@/components/briefing/WorkoutCard';
import WellnessBlock from '@/components/briefing/WellnessBlock';
import ReadingProgress from '@/components/briefing/ReadingProgress';
import ScrollToTop from '@/components/briefing/ScrollToTop';
import Link from 'next/link';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🌙</p>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">No briefing yet</h1>
          <p className="text-slate-400">Today&apos;s briefing hasn&apos;t been generated. Check back soon.</p>
        </div>
      </div>
    );
  }

  const weekNum = getWeekNumber(briefing.date);
  const dayOfYear = getDayOfYear(briefing.date);
  const heroDateStr = formatHeroDate(briefing.date, briefing.day);
  const headlineCount = countHeadlines(briefing.news as Record<string, Array<unknown>>);
  const marketsLive = briefing.markets && briefing.markets.length > 0;

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />

      {/* Full-width hero */}
      <HeroSection
        briefing={briefing}
        weekNum={weekNum}
        heroDateStr={heroDateStr}
        dayOfYear={dayOfYear}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Markets bar */}
        <MarketsBar markets={briefing.markets} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT COLUMN — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusCard focus={briefing.focus} />
            <NewsSection news={briefing.news} />
            <AppOfTheDay app={briefing.app_of_the_day} />
            {briefing.apod && <NasaApod apod={briefing.apod} />}
          </div>

          {/* RIGHT COLUMN — 1/3 width */}
          <div className="flex flex-col gap-6">
            <WeatherCard weather={briefing.weather} />
            {briefing.word_of_the_day && (
              <WordOfDay word={briefing.word_of_the_day} />
            )}
            <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />
            <SchoolDeadlines deadlines={briefing.school_deadlines} />
            {briefing.on_this_day && briefing.on_this_day.length > 0 && (
              <OnThisDay events={briefing.on_this_day} />
            )}
            <WorkoutCard workout={briefing.workout} />
            <WellnessBlock
              breathwork={briefing.breathwork}
              healthTip={briefing.health_tip}
              lifeHack={briefing.life_hack}
              moneyTip={briefing.money_tip}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-10 border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Generated at{' '}
              {new Date(briefing.generated_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
            <span className="text-slate-700">·</span>
            <span>{headlineCount} headlines</span>
            {marketsLive && (
              <>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Markets live
                </span>
              </>
            )}
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
