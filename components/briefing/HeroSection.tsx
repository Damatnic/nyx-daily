import { DailyBriefing } from '@/lib/types';
import TimeGreeting from './TimeGreeting';

interface HeroSectionProps {
  briefing: DailyBriefing;
  weekNum: number;
  heroDateStr: string;
  dayOfYear: number;
  headlineCount: number;
  upcomingCount: number;
}

export default function HeroSection({
  briefing,
  weekNum,
  heroDateStr,
  dayOfYear,
  headlineCount,
  upcomingCount,
}: HeroSectionProps) {
  const year = new Date(briefing.date + 'T12:00:00').getFullYear();
  const totalDays = year % 4 === 0 ? 366 : 365;
  // Clean focus text for pill
  const focusClean = briefing.focus
    .replace(/\*\*/g, '')
    .replace(/^[🚨→]\s*/, '')
    .trim();
  const focusTrunc = focusClean.length > 60 ? focusClean.slice(0, 57) + '…' : focusClean;

  return (
    <section className="hero-shimmer relative overflow-hidden border-b border-white/[0.06] min-h-[220px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500">
              {heroDateStr}
            </span>
            <TimeGreeting />
          </div>
          <span className="text-xs text-slate-600">
            Week {weekNum} · Day {dayOfYear}/{totalDays}
          </span>
        </div>

        {/* Quote */}
        {briefing.quote && (
          <div className="mt-6 max-w-3xl">
            <p className="text-2xl sm:text-3xl font-light italic text-slate-100 leading-relaxed">
              &ldquo;{briefing.quote}&rdquo;
            </p>
            {briefing.author && (
              <p className="text-sm text-slate-500 mt-3">— {briefing.author}</p>
            )}
          </div>
        )}

        {/* Bottom row: Focus + stats */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {/* Focus pill */}
          <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm px-4 py-1.5 rounded-full">
            ⚡ {focusTrunc}
          </span>

          {/* Stats pills */}
          <span className="text-xs text-slate-500 font-mono">Wk {weekNum}</span>
          <span className="text-slate-700">|</span>
          <span className="text-xs text-slate-500 font-mono">Day {dayOfYear}</span>
          <span className="text-slate-700">|</span>
          <span className="text-xs text-slate-500 font-mono">{headlineCount} headlines</span>
          {upcomingCount > 0 && (
            <>
              <span className="text-slate-700">|</span>
              <span className="text-xs text-amber-400 font-mono">{upcomingCount} due</span>
            </>
          )}
        </div>
      </div>

      {/* Decorative bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </section>
  );
}
