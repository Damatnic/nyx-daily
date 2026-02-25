import { getTodaysBriefing } from '@/lib/data';
import WeatherBar from '@/components/briefing/WeatherBar';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import WorkoutCard from '@/components/briefing/WorkoutCard';
import WellnessBlock from '@/components/briefing/WellnessBlock';
import QuoteCard from '@/components/briefing/QuoteCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const briefing = await getTodaysBriefing();

  if (!briefing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🌙</p>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">No briefing yet</h1>
          <p className="text-slate-400">Today's briefing hasn't been generated. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <WeatherBar weather={briefing.weather} date={briefing.date} day={briefing.day} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusCard focus={briefing.focus} />
            <NewsSection news={briefing.news} />
            <AppOfTheDay app={briefing.app_of_the_day} />
          </div>

          {/* RIGHT COLUMN — 1/3 width */}
          <div className="flex flex-col gap-6">
            <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />
            <SchoolDeadlines deadlines={briefing.school_deadlines} />
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
          <span>Generated at {new Date(briefing.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <Link href="/archive" className="hover:text-slate-400 transition-colors duration-200">
            View past briefings →
          </Link>
        </div>
      </div>
    </>
  );
}
