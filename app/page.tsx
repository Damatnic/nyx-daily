import { getTodaysBriefing, getBriefingStreak, getRecentPreviews } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/briefing/HeroSection';
import UrgencyBanner from '@/components/briefing/UrgencyBanner';
import SidebarTabs from '@/components/briefing/SidebarTabs';
import Link from 'next/link';
import RelativeTime from '@/components/ui/RelativeTime';
import MobileQuickBar from '@/components/briefing/MobileQuickBar';
import RecentSaves from '@/components/briefing/RecentSaves';
import WidgetGrid from '@/components/dashboard/WidgetGrid';

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
  const upcomingCount = (briefing.school_deadlines ?? []).filter(d => !d.done && d.days >= 0 && d.days <= 7).length;
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
      <MobileQuickBar weather={briefing.weather} deadlines={briefing.school_deadlines} />

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start min-w-0">

          {/* ── WIDGET GRID (left, draggable) ── */}
          <div className="min-w-0">
            <WidgetGrid
              briefing={briefing}
              streak={streak}
              headlineCount={headlineCount}
              recentPreviews={recentPreviews}
              breathworkFallback={breathworkFallback ?? ''}
            />
          </div>

          {/* ── RIGHT RAIL (sticky sidebar) ── */}
          <div
            id="weather"
            className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-16 lg:self-start
                       lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto lg:scrollbar-none"
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

        {/* ── Footer ── */}
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
