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

/** Parse weather string into structured parts */
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
  const high = highMatch ? highMatch[1] : null;
  const low = lowMatch ? lowMatch[1] : null;
  return { emoji, temp, feels, condition, high, low };
}

/** Get time-based gradient colors for hero bg */
function getTimeColors(): { from: string; mid: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 10)  return { from: 'rgba(139,92,246,0.12)',  mid: 'rgba(251,146,60,0.06)' };  // morning — purple + orange
  if (h >= 10 && h < 17) return { from: 'rgba(6,182,212,0.08)',   mid: 'rgba(139,92,246,0.08)' };  // day — cyan + purple
  if (h >= 17 && h < 21) return { from: 'rgba(245,158,11,0.08)',  mid: 'rgba(139,92,246,0.10)' };  // evening — gold + purple
  return { from: 'rgba(139,92,246,0.10)', mid: 'rgba(6,182,212,0.05)' };                            // night — deep purple
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
  const progress = Math.round((dayOfYear / totalDays) * 100);
  const { emoji, temp, feels, condition, high, low } = parseWeather(briefing.weather);
  const { from, mid } = getTimeColors();

  const focusClean = briefing.focus
    ? briefing.focus.replace(/\*\*/g, '').replace(/^[🚨→⚡]\s*/, '').trim()
    : null;

  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.05]"
      style={{
        background: `linear-gradient(135deg, ${from} 0%, #07070f 40%, ${mid} 80%, #07070f 100%)`,
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute -top-24 -left-16 w-96 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-16 right-8 w-72 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.25) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── TOP ROW: date + time greeting ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="text-[11px] tracking-[0.18em] uppercase text-slate-600 font-medium shrink-0">
              {heroDateStr}
            </span>
            <TimeGreeting />
          </div>
          <span className="text-xs text-slate-700 font-mono shrink-0 ml-4 hidden sm:block">
            Wk {weekNum} · Day {dayOfYear}/{totalDays}
          </span>
        </div>

        {/* ── MAIN GRID: quote (left) + weather panel (right) ── */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">

          {/* LEFT: Quote */}
          <div className="flex-1 min-w-0">
            {briefing.quote ? (
              <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light italic text-slate-100 leading-snug tracking-tight">
                  &ldquo;{briefing.quote}&rdquo;
                </p>
                {briefing.author && (
                  <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                    <span className="w-6 h-px bg-slate-700 inline-block" />
                    {briefing.author}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-3xl font-bold text-slate-300">Good morning, Nick.</p>
            )}

            {/* Focus pill */}
            {focusClean && (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
                <span className="text-sm text-violet-300 truncate">{focusClean}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Weather panel */}
          <div className="w-full lg:w-auto lg:shrink-0">
            <div className="flex items-center gap-5 lg:flex-col lg:items-end">

              {/* Big temp */}
              <div className="flex items-start gap-3">
                <span className="text-5xl sm:text-6xl leading-none select-none">{emoji}</span>
                <div className="flex flex-col">
                  <span className="text-5xl sm:text-6xl font-black leading-none bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent tabular-nums">
                    {temp}°
                  </span>
                  {feels && (
                    <span className="text-xs text-slate-600 mt-1">feels {feels}°</span>
                  )}
                </div>
              </div>

              {/* Condition + H/L */}
              <div className="flex flex-col gap-1 lg:items-end">
                {condition && (
                  <span className="text-[11px] uppercase tracking-widest text-cyan-500/70 font-medium">
                    {condition}
                  </span>
                )}
                {(high || low) && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {high && <span className="text-amber-400/80">H:{high}°</span>}
                    <span className="text-slate-700">·</span>
                    {low && <span className="text-blue-400/80">L:{low}°</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STATS BAR ── */}
        <div className="mt-7 pt-5 border-t border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

            {/* Day progress */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-slate-600 shrink-0">Year</span>
              <div className="w-20 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-600 font-mono shrink-0">{progress}%</span>
            </div>

            <span className="text-slate-800">·</span>

            {/* Headlines */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">{headlineCount}</span>
              <span className="text-[10px] text-slate-600">headlines</span>
            </div>

            {/* Deadlines */}
            {upcomingCount > 0 && (
              <>
                <span className="text-slate-800">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-amber-400">{upcomingCount}</span>
                  <span className="text-[10px] text-slate-600">due this week</span>
                </div>
              </>
            )}

            {/* Live indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
              <span className="text-[10px] text-slate-700 hidden sm:block">Live</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </section>
  );
}
