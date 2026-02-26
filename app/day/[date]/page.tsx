import { getBriefingByDate, getAllDates } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/nav/Navbar';
import WeatherBar from '@/components/briefing/WeatherBar';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import WorkoutCard from '@/components/briefing/WorkoutCard';
import WellnessBlock from '@/components/briefing/WellnessBlock';
import QuoteCard from '@/components/briefing/QuoteCard';
import SportsSection from '@/components/briefing/SportsSection';
import GithubTrending from '@/components/briefing/GithubTrending';
import RedditHot from '@/components/briefing/RedditHot';
import ProductHunt from '@/components/briefing/ProductHunt';
import NasaApod from '@/components/briefing/NasaApod';
import OnThisDay from '@/components/briefing/OnThisDay';
import DailyExtras from '@/components/briefing/DailyExtras';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const dates = await getAllDates();
  return dates.map((date) => ({ date }));
}

interface PageProps {
  params: Promise<{ date: string }>;
}

export default async function DayPage({ params }: PageProps) {
  const { date } = await params;
  const briefing = await getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#8b5cf6] transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          Back to Archive
        </Link>
      </div>

      <WeatherBar weather={briefing.weather} date={briefing.date} day={briefing.day} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusCard focus={briefing.focus} />
            <NewsSection news={briefing.news} />

            {briefing.sports && briefing.sports.length > 0 && (
              <SportsSection sports={briefing.sports} />
            )}
            {briefing.github_trending && briefing.github_trending.length > 0 && (
              <GithubTrending repos={briefing.github_trending} />
            )}
            {briefing.reddit_hot && briefing.reddit_hot.length > 0 && (
              <RedditHot posts={briefing.reddit_hot} />
            )}
            {briefing.product_hunt && briefing.product_hunt.length > 0 && (
              <ProductHunt posts={briefing.product_hunt} />
            )}

            <AppOfTheDay app={briefing.app_of_the_day} />
            <WellnessBlock
              breathwork={briefing.breathwork}
              healthTip={briefing.health_tip}
              lifeHack={briefing.life_hack}
              moneyTip={briefing.money_tip}
            />
            <WorkoutCard workout={briefing.workout} />
          </div>

          {/* Right rail */}
          <div className="flex flex-col gap-6">
            <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />
            <SchoolDeadlines deadlines={briefing.school_deadlines} />
            <DailyExtras word={briefing.word_of_the_day} facts={briefing.facts_of_the_day} />
            {briefing.on_this_day && briefing.on_this_day.length > 0 && (
              <OnThisDay events={briefing.on_this_day} />
            )}
            {briefing.apod && <NasaApod apod={briefing.apod} />}
          </div>
        </div>

        <div className="mt-6">
          <QuoteCard quote={briefing.quote} author={briefing.author} />
        </div>

        <div className="mt-8 pb-8 flex items-center justify-between text-xs text-slate-600">
          <span>Generated at {new Date(briefing.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <Link href="/archive" className="hover:text-slate-400 transition-colors duration-200">
            ← All briefings
          </Link>
        </div>
      </div>
    </>
  );
}
