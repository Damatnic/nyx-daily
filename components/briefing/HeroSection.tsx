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

function parseWeather(weather: string) {
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';
  const tempMatch = weather.match(/(\d+)°F/);
  const temp = tempMatch ? tempMatch[1] : '--';
  const feelsMatch = weather.match(/feels\s+(\d+)°F/);
  const feels = feelsMatch ? feelsMatch[1] : null;
  const segments = weather.split('·').map((s) => s.trim());
  const condition = segments[2] || '';
  const highMatch = weather.match(/H:(\d+)/);
  const lowMatch = weather.match(/L:(\d+)/);
  return {
    emoji, temp, feels, condition,
    high: highMatch ? highMatch[1] : null,
    low: lowMatch ? lowMatch[1] : null,
  };
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
  const yearProgress = Math.round((dayOfYear / totalDays) * 100);
  const { emoji, temp, feels, condition, high, low } = parseWeather(briefing.weather);

  return (
    <section className="relative overflow-hidden border-b border-white/[0.05]">
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 50%, rgba(139,92,246,0.09) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 80% at 90% 20%, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── Row 1: date label + greeting ── */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <span className="text-[11px] tracking-[0.2em] uppercase text-slate-600 font-medium shrink-0">
              {heroDateStr}
            </span>
            <TimeGreeting />
          </div>
          <span className="text-xs text-slate-700 font-mono shrink-0 hidden sm:block">
            Wk {weekNum}
          </span>
        </div>

        {/* ── Row 2: quote + weather ── */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">

          {/* Quote */}
          <div className="flex-1 min-w-0">
            {briefing.quote ? (
              <>
                <p className="text-2xl sm:text-3xl lg:text-[2.1rem] font-light italic text-slate-100 leading-snug">
                  &ldquo;{briefing.quote}&rdquo;
                </p>
                {briefing.author && (
                  <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                    <span className="w-5 h-px bg-slate-700 inline-block" />
                    {briefing.author}
                  </p>
                )}
              </>
            ) : (
              <p className="text-3xl font-light text-slate-300">Good morning, Nick.</p>
            )}
          </div>

          {/* Weather — right-aligned, desktop only */}
          <div className="hidden lg:flex flex-col items-end gap-1 shrink-0 select-none">
            <div className="flex items-start gap-3">
              <span className="text-4xl leading-none">{emoji}</span>
              <div>
                <div className="text-5xl font-black leading-none bg-gradient-to-b from-white to-cyan-300/80 bg-clip-text text-transparent tabular-nums">
                  {temp}°
                </div>
                {feels && <p className="text-xs text-slate-600 mt-1 text-right">feels {feels}°</p>}
              </div>
            </div>
            {condition && (
              <span className="text-[10px] uppercase tracking-widest text-cyan-500/60 mt-1">
                {condition}
              </span>
            )}
            {(high || low) && (
              <div className="flex items-center gap-1.5 text-xs mt-0.5">
                {high && <span className="text-amber-400/70">H:{high}°</span>}
                <span className="text-slate-700">·</span>
                {low && <span className="text-blue-400/70">L:{low}°</span>}
              </div>
            )}
          </div>

          {/* Weather — mobile inline below quote */}
          <div className="flex lg:hidden items-center gap-3 select-none">
            <span className="text-3xl">{emoji}</span>
            <span className="text-3xl font-black text-cyan-300 tabular-nums">{temp}°</span>
            {condition && <span className="text-xs text-slate-500">{condition}</span>}
          </div>
        </div>

        {/* ── Row 3: stats ── */}
        <div className="mt-7 pt-4 border-t border-white/[0.04] flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {/* Year progress */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                style={{ width: `${yearProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600 font-mono">{yearProgress}% of {year}</span>
          </div>

          <span className="text-slate-800 hidden sm:block">·</span>

          <span className="text-[11px] text-slate-500 font-mono">
            <span className="text-slate-300">{headlineCount}</span> headlines
          </span>

          {upcomingCount > 0 && (
            <>
              <span className="text-slate-800 hidden sm:block">·</span>
              <span className="text-[11px] font-mono">
                <span className="text-amber-400">{upcomingCount}</span>
                <span className="text-slate-600"> due this week</span>
              </span>
            </>
          )}

          <div className="ml-auto hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="text-[10px] text-slate-700">Live</span>
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
    </section>
  );
}
