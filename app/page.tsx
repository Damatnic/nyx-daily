import { getTodaysBriefing, getBriefingStreak, getRecentPreviews } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/briefing/HeroSection';
import UrgencyBanner from '@/components/briefing/UrgencyBanner';
import NewsSection from '@/components/briefing/NewsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
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
import MobileQuickBar from '@/components/briefing/MobileQuickBar';
import ReleasesToday from '@/components/briefing/ReleasesToday';
import BriefingCarousel from '@/components/briefing/BriefingCarousel';
import HackerNewsCard from '@/components/briefing/HackerNewsCard';
import PersonalGitHubCard from '@/components/briefing/PersonalGitHubCard';
import RecentSaves from '@/components/briefing/RecentSaves';
import MetaBar from '@/components/briefing/MetaBar';
import ArchiveStrip from '@/components/briefing/ArchiveStrip';
import DailyWisdomCard from '@/components/briefing/DailyWisdomCard';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import ScrollToTop from '@/components/ui/ScrollToTop';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'America/Chicago' });
  return { title: `${today} · Nyx Daily` };
}

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

// ─── Section divider label ───────────────────────────────────────────────────
// SectionLabel replaced by CollapsibleSection (client component with localStorage toggle)

export default async function HomePage() {
  const [briefing, streak, recentPreviews] = await Promise.all([
    getTodaysBriefing(),
    getBriefingStreak(),
    getRecentPreviews(6),
  ]);

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

  const urgentDeadlines = (briefing.school_deadlines ?? []).filter(d => !d.done && d.days <= 1).length;

  const breathworkFallback = briefing.breathwork
    ? `${briefing.breathwork.name}: ${briefing.breathwork.steps} (${briefing.breathwork.rounds} rounds)`
    : undefined;

  return (
    <>
      <Navbar urgentCount={urgentDeadlines} />

      <HeroSection
        briefing={briefing}
        weekNum={weekNum}
        heroDateStr={heroDateStr}
        dayOfYear={dayOfYear}
        headlineCount={headlineCount}
        upcomingCount={upcomingCount}
        focus={briefing.focus}
        streak={streak}
      />

      <UrgencyBanner deadlines={briefing.school_deadlines} />

      {/* Mobile quick-access bar — weather + school on mobile before scrolling */}
      <MobileQuickBar
        weather={briefing.weather}
        deadlines={briefing.school_deadlines}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-8 min-w-0">

            {/* ── BRIEFING CAROUSEL ─────────────────────────────── */}
            <BriefingCarousel
              tldr={briefing.tldr}
              word={briefing.word_of_the_day}
              facts={briefing.facts_of_the_day}
              onThisDay={briefing.on_this_day}
              apod={briefing.apod}
            />

            {/* ── META BAR ─────────────────────────────────────── */}
            <MetaBar briefing={briefing} streak={streak} headlineCount={headlineCount} />

            {/* ── NEWS ─────────────────────────────────────────── */}
            <CollapsibleSection id="news" label="News" accent="blue" defaultOpen={true}>
              <div id="news" className="scroll-mt-16">
                <RevealCard delay={0}>
                  <NewsSection news={briefing.news} />
                </RevealCard>
              </div>
            </CollapsibleSection>

            {/* ── DEV ─────────────────────────────────────────── */}
            {(!!briefing.github_trending?.length || !!briefing.reddit_hot?.length || !!briefing.hacker_news?.length || !!briefing.personal_github?.repos?.length || !!briefing.personal_github?.prs?.length) && (
              <CollapsibleSection id="dev" label="Dev" accent="cyan">
                <div id="github" className={`grid gap-4 scroll-mt-16 items-start ${briefing.github_trending?.length && briefing.reddit_hot?.length ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {!!briefing.github_trending?.length && (
                    <RevealCard delay={0}><GithubTrending repos={briefing.github_trending} /></RevealCard>
                  )}
                  {!!briefing.reddit_hot?.length && (
                    <div id="reddit"><RevealCard delay={1}><RedditHot posts={briefing.reddit_hot} /></RevealCard></div>
                  )}
                </div>
                {(!!briefing.hacker_news?.length || !!briefing.personal_github?.repos?.length || !!briefing.personal_github?.prs?.length) && (
                  <div className={`grid gap-4 items-start ${briefing.hacker_news?.length && (briefing.personal_github?.repos?.length || briefing.personal_github?.prs?.length) ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {!!briefing.hacker_news?.length && (
                      <RevealCard delay={0}><HackerNewsCard items={briefing.hacker_news} /></RevealCard>
                    )}
                    {(!!briefing.personal_github?.repos?.length || !!briefing.personal_github?.prs?.length) && (
                      <RevealCard delay={1}><PersonalGitHubCard data={briefing.personal_github} /></RevealCard>
                    )}
                  </div>
                )}
              </CollapsibleSection>
            )}

            {/* ── DISCOVERY: ProductHunt + Hidden Gems + App of the Day + Tips ── */}
            {(!!briefing.product_hunt?.length || !!briefing.hidden_gems?.length || !!briefing.app_of_the_day || !!briefing.health_tip) && (
              <CollapsibleSection id="discovery" label="Discovery" accent="amber">
                <div id="producthunt" className={`grid gap-4 scroll-mt-16 items-start ${briefing.product_hunt?.length && briefing.hidden_gems?.length ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {!!briefing.product_hunt?.length && (
                    <RevealCard delay={0}><ProductHunt posts={briefing.product_hunt} /></RevealCard>
                  )}
                  {!!briefing.hidden_gems?.length && (
                    <RevealCard delay={1}><HiddenGemsSection gems={briefing.hidden_gems} /></RevealCard>
                  )}
                </div>
                {(briefing.app_of_the_day || briefing.health_tip) && (
                  <div className={`grid gap-4 items-start ${briefing.app_of_the_day && briefing.health_tip ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {briefing.app_of_the_day && (
                      <RevealCard delay={0}><AppOfTheDay app={briefing.app_of_the_day} /></RevealCard>
                    )}
                    {(briefing.health_tip || briefing.life_hack || briefing.money_tip) && (
                      <RevealCard delay={1}>
                        <DailyWisdomCard
                          health_tip={briefing.health_tip}
                          life_hack={briefing.life_hack}
                          money_tip={briefing.money_tip}
                        />
                      </RevealCard>
                    )}
                  </div>
                )}
              </CollapsibleSection>
            )}

            {/* ── WATCH: YouTube ─────────────────────────────── */}
            {!!briefing.youtube_picks?.length && (
              <CollapsibleSection id="watch" label="Watch" accent="violet">
                <div id="youtube">
                  <RevealCard delay={0}><YouTubeSection videos={briefing.youtube_picks} /></RevealCard>
                </div>
              </CollapsibleSection>
            )}

            {/* ── RELEASE RADAR ────────────────────────────────── */}
            {briefing.releases_today && (
              Object.values(briefing.releases_today).some(arr => arr.length > 0)
            ) && (
              <CollapsibleSection id="releases" label="Release Radar" accent="rose">
                <div id="releases">
                  <RevealCard delay={0}>
                    <ReleasesToday releases={briefing.releases_today} />
                  </RevealCard>
                </div>
              </CollapsibleSection>
            )}

            {/* ── WELLNESS: Workout + Breathwork ───────────────── */}
            {(!!briefing.workout?.exercises?.length || briefing.breathwork_session) && (
              <CollapsibleSection id="wellness" label="Wellness" accent="emerald">
                <div id="workout" className={`grid gap-4 scroll-mt-16 items-start ${briefing.workout?.exercises?.length && briefing.breathwork_session ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {!!briefing.workout?.exercises?.length && (
                    <RevealCard delay={0}><WorkoutTracker workout={briefing.workout} date={briefing.date} /></RevealCard>
                  )}
                  {briefing.breathwork_session && (
                    <div id="breathwork"><RevealCard delay={1}><BreathworkCard session={briefing.breathwork_session} fallbackText={breathworkFallback} /></RevealCard></div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* ── PREVIOUS BRIEFINGS ───────────────────────────── */}
            {recentPreviews.length > 0 && (
              <ArchiveStrip previews={recentPreviews} />
            )}
          </div>

          {/* ── RIGHT RAIL — sticky ── */}
          <div
            id="weather"
            className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:scrollbar-none"
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
            <RecentSaves />
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
