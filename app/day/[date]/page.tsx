import { getBriefingByDate, getAllDates } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/nav/Navbar';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import GithubTrending from '@/components/briefing/GithubTrending';
import RedditHot from '@/components/briefing/RedditHot';
import ProductHunt from '@/components/briefing/ProductHunt';
import NasaApod from '@/components/briefing/NasaApod';
import OnThisDay from '@/components/briefing/OnThisDay';
import DailyExtras from '@/components/briefing/DailyExtras';
import WeatherCard from '@/components/briefing/WeatherCard';
import YouTubeSection from '@/components/briefing/YouTubeSection';
import HiddenGemsSection from '@/components/briefing/HiddenGemsSection';
import WorkoutTracker from '@/components/briefing/WorkoutTracker';
import BreathworkCard from '@/components/briefing/BreathworkCard';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const dates = await getAllDates();
  return dates.map((date) => ({ date }));
}

interface PageProps {
  params: Promise<{ date: string }>;
}

function formatDate(dateStr: string, day: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${day}, ${month} ${d.getDate()}, ${d.getFullYear()}`;
}

export default async function DayPage({ params }: PageProps) {
  const { date } = await params;
  const briefing = await getBriefingByDate(date);
  if (!briefing) notFound();

  const breathworkFallback = briefing.breathwork
    ? `${briefing.breathwork.name}: ${briefing.breathwork.steps} (${briefing.breathwork.rounds} rounds)`
    : undefined;

  const fullDate = formatDate(date, briefing.day);

  return (
    <>
      <Navbar />

      {/* Archive page header */}
      <div className="border-b border-white/[0.05] bg-[#06060e]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link
            href="/archive"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-violet-400 transition-colors mb-4"
          >
            <ArrowLeft size={12} />
            Archive
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600 mb-1">
                {briefing.day}
              </p>
              <h1 className="text-2xl font-bold text-slate-100">{fullDate}</h1>
            </div>
            {briefing.weather && (
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5">
                {(() => {
                  const emojiMatch = briefing.weather.match(/^(\S+)\s/);
                  const tempMatch  = briefing.weather.match(/(\d+)°F/);
                  return (
                    <>
                      <span>{emojiMatch?.[1]}</span>
                      <span className="font-bold text-cyan-300 tabular-nums">{tempMatch?.[1]}°F</span>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          {briefing.quote && (
            <p className="mt-3 text-base italic text-slate-400 max-w-2xl">
              &ldquo;{briefing.quote}&rdquo;
              {briefing.author && <span className="text-slate-600 not-italic"> — {briefing.author}</span>}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <FocusCard focus={briefing.focus} />
            <NewsSection news={briefing.news} />

            {!!briefing.youtube_picks?.length && (
              <YouTubeSection videos={briefing.youtube_picks} />
            )}
            {!!briefing.hidden_gems?.length && (
              <HiddenGemsSection gems={briefing.hidden_gems} />
            )}
            {!!briefing.workout?.exercises?.length && (
              <WorkoutTracker workout={briefing.workout} date={briefing.date} />
            )}
            {!!briefing.github_trending?.length && (
              <GithubTrending repos={briefing.github_trending} />
            )}
            {!!briefing.reddit_hot?.length && (
              <RedditHot posts={briefing.reddit_hot} />
            )}
            {!!briefing.product_hunt?.length && (
              <ProductHunt posts={briefing.product_hunt} />
            )}

            <AppOfTheDay app={briefing.app_of_the_day} />

            {briefing.breathwork_session && (
              <BreathworkCard
                session={briefing.breathwork_session}
                fallbackText={breathworkFallback}
              />
            )}
          </div>

          {/* ── Right rail ── */}
          <div className="flex flex-col gap-4">
            <WeatherCard weather={briefing.weather} forecast={briefing.forecast} />
            <DailyExtras word={briefing.word_of_the_day} facts={briefing.facts_of_the_day} />
            <SchoolDeadlines deadlines={briefing.school_deadlines} />
            <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />
            {!!briefing.on_this_day?.length && (
              <OnThisDay events={briefing.on_this_day} />
            )}
            {briefing.apod && <NasaApod apod={briefing.apod} />}
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-700">
          <span>Generated {new Date(briefing.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <Link href="/archive" className="hover:text-violet-400 transition-colors">
            ← All briefings
          </Link>
        </div>
      </div>
    </>
  );
}
