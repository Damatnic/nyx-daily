import { getTodaysBriefing } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import NewsTicker from '@/components/briefing/NewsTicker';
import HeroSection from '@/components/briefing/HeroSection';
import UrgencyBanner from '@/components/briefing/UrgencyBanner';
import MobilePriorityStrip from '@/components/briefing/MobilePriorityStrip';
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
import RevealCard from '@/components/ui/RevealCard';
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

  // Count undone deadlines due within 7 days
  const upcomingCount = (briefing.school_deadlines ?? []).filter(
    (d) => !d.done && d.days >= 0 && d.days <= 7
  ).length;

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
        headlineCount={headlineCount}
        upcomingCount={upcomingCount}
      />

      {/* Urgency banner for critical deadlines */}
      <UrgencyBanner deadlines={briefing.school_deadlines} />

      {/* Full-width sticky news ticker */}
      <NewsTicker news={briefing.news} />

      {/* Mobile priority strip - weather + urgent deadlines */}
      <MobilePriorityStrip
        school_deadlines={briefing.school_deadlines}
        weather={briefing.weather}
      />

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* LEFT MAIN COLUMN — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
            {/* Focus */}
            <FocusCard focus={briefing.focus} />

            {/* News Section */}
            <RevealCard delay={0}>
              <NewsSection news={briefing.news} />
            </RevealCard>

            {/* YouTube Picks */}
            <RevealCard delay={1}>
              <YouTubeSection videos={briefing.youtube_picks} />
            </RevealCard>

            {/* Hidden Gems */}
            <RevealCard delay={2}>
              <HiddenGemsSection gems={briefing.hidden_gems} />
            </RevealCard>

            {/* Workout Tracker */}
            <RevealCard delay={3}>
              <WorkoutTracker workout={briefing.workout} date={briefing.date} />
            </RevealCard>

            {/* Breathwork Card */}
            <RevealCard delay={0}>
              <BreathworkCard
                session={briefing.breathwork_session}
                fallbackText={breathworkFallback}
              />
            </RevealCard>

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
            <RevealCard delay={1}>
              <AppOfTheDay app={briefing.app_of_the_day} />
            </RevealCard>

            {/* Standalone Tip Cards */}
            <RevealCard delay={2}>
              <LifeHackCard lifeHack={briefing.life_hack} />
            </RevealCard>
            <RevealCard delay={3}>
              <MoneyTipCard moneyTip={briefing.money_tip} />
            </RevealCard>
            <RevealCard delay={0}>
              <HealthTipCard healthTip={briefing.health_tip} />
            </RevealCard>
          </div>

          {/* RIGHT RAIL — 1/3 width, sticky on desktop */}
          <div className="flex flex-col gap-6 min-w-0 lg:sticky lg:top-[7.5rem] lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:scrollbar-none">
            {/* Weather Card with 5-day forecast */}
            <RevealCard delay={0}>
              <WeatherCard weather={briefing.weather} forecast={briefing.forecast} />
            </RevealCard>

            {/* Daily Extras (Word + Facts) */}
            <RevealCard delay={1}>
              <DailyExtras
                word={briefing.word_of_the_day}
                facts={briefing.facts_of_the_day}
              />
            </RevealCard>

            {/* School Deadlines */}
            <RevealCard delay={2}>
              <SchoolDeadlines deadlines={briefing.school_deadlines} />
            </RevealCard>

            {/* Calendar & Email */}
            <RevealCard delay={3}>
              <CalendarCard events={briefing.calendar} gmailSummary={briefing.gmail_summary} />
            </RevealCard>

            {/* On This Day */}
            {briefing.on_this_day && briefing.on_this_day.length > 0 && (
              <RevealCard delay={0}>
                <OnThisDay events={briefing.on_this_day} />
              </RevealCard>
            )}

            {/* NASA APOD */}
            {briefing.apod && (
              <RevealCard delay={1}>
                <NasaApod apod={briefing.apod} />
              </RevealCard>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] pt-6 mt-10 pb-20 lg:pb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left side: Branding */}
            <span className="text-sm text-slate-500">🌙 Nyx Daily · 2026</span>

            {/* Middle: Data freshness */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 inline-block animate-pulse" />
              <span>Data updated <RelativeTime timestamp={briefing.generated_at} /></span>
              <span className="text-slate-700">·</span>
              <span>{headlineCount} headlines</span>
            </div>

            {/* Right side: View Archive */}
            <Link
              href="/archive"
              className="text-xs text-slate-500 hover:text-[#8b5cf6] transition-colors duration-200"
            >
              View archive →
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
