import { getTodaysBriefing } from '@/lib/data';
import WeatherBar from '@/components/briefing/WeatherBar';
import MarketsBar from '@/components/briefing/MarketsBar';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import NasaApod from '@/components/briefing/NasaApod';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import OnThisDay from '@/components/briefing/OnThisDay';
import WorkoutCard from '@/components/briefing/WorkoutCard';
import WellnessBlock from '@/components/briefing/WellnessBlock';
import QuoteCard from '@/components/briefing/QuoteCard';
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

/** Format date like "TUESDAY, FEBRUARY 24" */
function formatHeroDate(dateStr: string, day: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const dom = d.getDate();
  return `${day.toUpperCase()}, ${month} ${dom}`;
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
  const heroDateStr = formatHeroDate(briefing.date, briefing.day);

  return (
    <>
      <WeatherBar weather={briefing.weather} date={briefing.date} day={briefing.day} />
      <MarketsBar markets={briefing.markets} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-600/[0.03] border-b border-white/[0.04] mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
            🌙 {heroDateStr}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Week {weekNum} of {new Date(briefing.date + 'T12:00:00').getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusCard focus={briefing.focus} />
            <NewsSection news={briefing.news} />
            <AppOfTheDay app={briefing.app_of_the_day} />
            {briefing.apod && <NasaApod apod={briefing.apod} />}
          </div>

          {/* RIGHT COLUMN — 1/3 width */}
          <div className="flex flex-col gap-6">
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

        {/* Quote — full width */}
        <div className="mt-6">
          <QuoteCard quote={briefing.quote} author={briefing.author} />
        </div>

        {/* Footer */}
        <div className="mt-8 pb-8 flex items-center justify-between text-xs text-slate-600">
          <span>
            Generated at{' '}
            {new Date(briefing.generated_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <Link href="/archive" className="hover:text-slate-400 transition-colors duration-200">
            View past briefings →
          </Link>
        </div>
      </div>
    </>
  );
}
