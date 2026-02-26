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

function parseWeatherMini(weather: string): { emoji: string; temp: string; condition: string } {
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';
  const tempMatch = weather.match(/(\d+)(?=°F)/);
  const temp = tempMatch ? tempMatch[1] : '--';
  const segments = weather.split('·').map((s) => s.trim());
  const condition = segments[2] || '';
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
  const { emoji, temp, condition } = parseWeatherMini(briefing.weather);

  const focusClean = briefing.focus
    .replace(/\*\*/g, '')
    .replace(/^[🚨→]\s*/, '')
    .trim();
  const focusTrunc = focusClean.length > 60 ? focusClean.slice(0, 57) + '…' : focusClean;

  return (
    <section className="hero-shimmer relative overflow-hidden border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top row: date + week counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 shrink-0">
              {heroDateStr}
            </span>
            <TimeGreeting />
          </div>
          <span className="text-xs text-slate-600 shrink-0 ml-4">
            Week {weekNum} · Day {dayOfYear}/{totalDays}
          </span>
        </div>

        {/* Main row: quote (left) + weather (right) */}
        <div className="flex items-start justify-between gap-6 mt-6">

          {/* Quote */}
          <div className="flex-1 min-w-0">
            {briefing.quote && (
              <>
                <p className="text-xl sm:text-2xl lg:text-3xl font-light italic text-slate-100 leading-relaxed">
                  &ldquo;{briefing.quote}&rdquo;
                </p>
                {briefing.author && (
                  <p className="text-sm text-slate-500 mt-2">— {briefing.author}</p>
                )}
              </>
            )}
          </div>

          {/* Weather — desktop only, constrained size */}
          <div className="hidden lg:flex flex-col items-end shrink-0 gap-0.5 select-none">
            <div className="text-4xl font-black bg-gradient-to-b from-cyan-300 to-purple-400 bg-clip-text text-transparent tabular-nums leading-none">
              {temp}°
            </div>
            <div className="text-xl leading-none mt-1">{emoji}</div>
            {condition && (
              <div className="text-[10px] uppercase tracking-widest text-cyan-400/70 mt-1">
                {condition}
              </div>
            )}
          </div>

        </div>

        {/* Bottom row: focus pill + stats */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 min-w-0">
          <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm px-4 py-1.5 rounded-full max-w-full truncate">
            ⚡ {focusTrunc}
          </span>
          <span className="text-xs text-slate-500 font-mono shrink-0">Wk {weekNum}</span>
          <span className="text-slate-700 shrink-0">|</span>
          <span className="text-xs text-slate-500 font-mono shrink-0">Day {dayOfYear}</span>
          <span className="text-slate-700 shrink-0">|</span>
          <span className="text-xs text-slate-500 font-mono shrink-0">{headlineCount} headlines</span>
          {upcomingCount > 0 && (
            <>
              <span className="text-slate-700 shrink-0">|</span>
              <span className="text-xs text-amber-400 font-mono shrink-0">{upcomingCount} due</span>
            </>
          )}
        </div>

      </div>

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </section>
  );
}
