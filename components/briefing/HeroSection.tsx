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

/** Parse weather for big display: emoji, temp, condition */
function parseWeatherHero(weather: string): { emoji: string; temp: string; condition: string } {
  // emoji is first non-space cluster
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';

  // temp is first \d+(?=°F)
  const tempMatch = weather.match(/(\d+)(?=°F)/);
  const temp = tempMatch ? tempMatch[1] : '--';

  // condition is segment after second dot-separator
  const segments = weather.split('·').map((s) => s.trim());
  const condition = segments[2] || 'Current';

  return { emoji, temp, condition };
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
  const { emoji, temp, condition } = parseWeatherHero(briefing.weather);

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

        {/* Middle: Quote + Weather */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-6">
          {/* Quote */}
          {briefing.quote && (
            <div className="flex-1">
              <p className="text-2xl sm:text-3xl font-light italic text-slate-100 max-w-2xl leading-relaxed">
                &ldquo;{briefing.quote}&rdquo;
              </p>
              {briefing.author && (
                <p className="text-sm text-slate-500 mt-3">— {briefing.author}</p>
              )}
            </div>
          )}

          {/* Big weather display - desktop only */}
          <div className="hidden lg:block shrink-0 text-right">
            <div className="text-6xl font-black bg-gradient-to-b from-cyan-300 to-purple-400 bg-clip-text text-transparent tabular-nums">
              {temp}°
            </div>
            <div className="text-2xl mt-1">{emoji}</div>
            <div className="text-xs uppercase tracking-widest text-cyan-400/70 mt-1">
              {condition}
            </div>
          </div>
        </div>

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
