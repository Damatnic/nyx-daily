import { getTodaysBriefing } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import NewsTicker from '@/components/briefing/NewsTicker';
import HeroSection from '@/components/briefing/HeroSection';
import UrgencyBanner from '@/components/briefing/UrgencyBanner';
import FocusCard from '@/components/briefing/FocusCard';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import SportsSection from '@/components/briefing/SportsSection';
import GithubTrending from '@/components/briefing/GithubTrending';
import RedditHot from '@/components/briefing/RedditHot';
import ProductHunt from '@/components/briefing/ProductHunt';
import YouTubeSection from '@/components/briefing/YouTubeSection';
import HiddenGemsSection from '@/components/briefing/HiddenGemsSection';
import WorkoutTracker from '@/components/briefing/WorkoutTracker';
import BreathworkCard from '@/components/briefing/BreathworkCard';
import SidebarTabs from '@/components/briefing/SidebarTabs';
import RevealCard from '@/components/ui/RevealCard';
import Link from 'next/link';
import RelativeTime from '@/components/ui/RelativeTime';

export const dynamic = 'force-dynamic';

function getWeekNumber(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((Math.floor(diff / 86_400_000) + jan1.getDay()) / 7);
}

function getDayOfYear(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

function formatHeroDate(dateStr: string, day: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  return `${day.toUpperCase()}, ${month} ${d.getDate()}, ${d.getFullYear()}`;
}

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
            <p className="text-5xl mb-4">🌙</p>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">No briefing yet</h1>
            <p className="text-slate-500 text-sm">Check back after 8 AM.</p>
          </div>
        </div>
      </>
    );
  }

  const weekNum       = getWeekNumber(briefing.date);
  const dayOfYear     = getDayOfYear(briefing.date);
  const heroDateStr   = formatHeroDate(briefing.date, briefing.day);
  const headlineCount = countHeadlines(briefing.news as Record<string, Array<unknown>>);
  const upcomingCount = (briefing.school_deadlines ?? []).filter(
    (d) => !d.done && d.days >= 0 && d.days <= 7
  ).length;

  const breathworkFallback = briefing.breathwork
    ? `${briefing.breathwork.name}: ${briefing.breathwork.steps} (${briefing.breathwork.rounds} rounds)`
    : undefined;

  return (
    <>
      <Navbar />

      <HeroSection
        briefing={briefing}
        weekNum={weekNum}
        heroDateStr={heroDateStr}
        dayOfYear={dayOfYear}
        headlineCount={headlineCount}
        upcomingCount={upcomingCount}
      />

      <UrgencyBanner deadlines={briefing.school_deadlines} />

      <NewsTicker news={briefing.news} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-w-0">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">

            <FocusCard focus={briefing.focus} />

            {/* News — full width, lead feature */}
            <div id="news" className="scroll-mt-20">
              <RevealCard delay={0}>
                <NewsSection news={briefing.news} />
              </RevealCard>
            </div>

            {/* GitHub + Reddit — side by side */}
            {(!!briefing.github_trending?.length || !!briefing.reddit_hot?.length) && (
              <div id="github" className={`grid gap-5 scroll-mt-20 ${briefing.github_trending?.length && briefing.reddit_hot?.length ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {!!briefing.github_trending?.length && (
                  <RevealCard delay={0}><GithubTrending repos={briefing.github_trending} /></RevealCard>
                )}
                {!!briefing.reddit_hot?.length && (
                  <div id="reddit"><RevealCard delay={1}><RedditHot posts={briefing.reddit_hot} /></RevealCard></div>
                )}
              </div>
            )}

            {/* YouTube + ProductHunt — side by side */}
            {(!!briefing.youtube_picks?.length || !!briefing.product_hunt?.length) && (
              <div id="youtube" className={`grid gap-5 scroll-mt-20 ${briefing.youtube_picks?.length && briefing.product_hunt?.length ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {!!briefing.youtube_picks?.length && (
                  <RevealCard delay={0}><YouTubeSection videos={briefing.youtube_picks} /></RevealCard>
                )}
                {!!briefing.product_hunt?.length && (
                  <div id="producthunt"><RevealCard delay={1}><ProductHunt posts={briefing.product_hunt} /></RevealCard></div>
                )}
              </div>
            )}

            {/* Sports + Hidden Gems — side by side */}
            {(!!briefing.sports?.length || !!briefing.hidden_gems?.length) && (
              <div id="sports" className={`grid gap-5 scroll-mt-20 ${briefing.sports?.length && briefing.hidden_gems?.length ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {!!briefing.sports?.length && (
                  <RevealCard delay={0}><SportsSection sports={briefing.sports} /></RevealCard>
                )}
                {!!briefing.hidden_gems?.length && (
                  <div id="gems"><RevealCard delay={1}><HiddenGemsSection gems={briefing.hidden_gems} /></RevealCard></div>
                )}
              </div>
            )}

            {/* Workout + Breathwork — side by side */}
            {(!!briefing.workout?.exercises?.length || briefing.breathwork_session) && (
              <div id="workout" className={`grid gap-5 scroll-mt-20 ${briefing.workout?.exercises?.length && briefing.breathwork_session ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {!!briefing.workout?.exercises?.length && (
                  <RevealCard delay={0}><WorkoutTracker workout={briefing.workout} date={briefing.date} /></RevealCard>
                )}
                {briefing.breathwork_session && (
                  <div id="breathwork"><RevealCard delay={1}><BreathworkCard session={briefing.breathwork_session} fallbackText={breathworkFallback} /></RevealCard></div>
                )}
              </div>
            )}

            <RevealCard delay={0}>
              <AppOfTheDay app={briefing.app_of_the_day} />
            </RevealCard>
          </div>

          {/* ── RIGHT RAIL — sticky ── */}
          <div
            id="weather"
            className="flex flex-col gap-4 min-w-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:scrollbar-none"
          >
            <div id="school" className="scroll-mt-28">
              <SidebarTabs
                weather={briefing.weather}
                forecast={briefing.forecast}
                word={briefing.word_of_the_day}
                facts={briefing.facts_of_the_day}
                deadlines={briefing.school_deadlines}
                events={briefing.calendar}
                gmailSummary={briefing.gmail_summary}
                onThisDay={briefing.on_this_day}
                apod={briefing.apod}
              />
            </div>
          </div>
        </div>

        <footer className="border-t border-white/[0.04] pt-5 mt-10 pb-20 lg:pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-700">🌙 Nyx Daily · 2026</span>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
              <span>Updated <RelativeTime timestamp={briefing.generated_at} /></span>
              <span>·</span>
              <span>{headlineCount} headlines</span>
            </div>
            <Link href="/archive" className="text-xs text-slate-600 hover:text-violet-400 transition-colors">
              Archive →
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
