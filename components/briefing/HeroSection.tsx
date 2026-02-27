import { DailyBriefing } from '@/lib/types';
import TimeGreeting from './TimeGreeting';

interface Props {
  briefing: DailyBriefing;
  weekNum: number;
  heroDateStr: string;
  dayOfYear: number;
  headlineCount: number;
  upcomingCount: number;
}

function parseWeather(w: string) {
  const emoji     = w.match(/^(\S+)\s/)?.[1]        ?? '🌡️';
  const temp      = w.match(/(\d+)°F/)?.[1]         ?? '--';
  const feels     = w.match(/feels\s+(\d+)°F/)?.[1] ?? null;
  const seg       = w.split('·').map(s => s.trim());
  const condition = seg[2] ?? '';
  const high      = w.match(/H:(\d+)/)?.[1]         ?? null;
  const low       = w.match(/L:(\d+)/)?.[1]         ?? null;
  return { emoji, temp, feels, condition, high, low };
}

function tempColor(t: string) {
  const n = parseInt(t, 10);
  if (isNaN(n)) return 'text-slate-200';
  if (n < 32)  return 'text-blue-300';
  if (n < 55)  return 'text-cyan-300';
  if (n < 75)  return 'text-emerald-300';
  if (n < 90)  return 'text-amber-300';
  return 'text-red-400';
}

export default function HeroSection({ briefing, weekNum, heroDateStr, dayOfYear, headlineCount, upcomingCount }: Props) {
  const year      = new Date(briefing.date + 'T12:00:00').getFullYear();
  const totalDays = year % 4 === 0 ? 366 : 365;
  const pct       = Math.round((dayOfYear / totalDays) * 100);
  const wx        = briefing.weather ? parseWeather(briefing.weather) : null;
  const tempCls   = wx ? tempColor(wx.temp) : 'text-slate-400';

  return (
    <section className="border-b border-white/[0.05]" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Row 1: weather · date · greeting · live ── */}
        <div className="flex items-center gap-4 h-12 min-w-0">

          {/* Weather pill */}
          {wx && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-base leading-none select-none">{wx.emoji}</span>
              <span className={`text-base font-black tabular-nums ${tempCls}`}>{wx.temp}°</span>
              {wx.condition && (
                <span className="text-[9px] uppercase tracking-widest text-slate-600 hidden sm:block">{wx.condition}</span>
              )}
              {wx.high && wx.low && (
                <span className="text-[9px] font-mono text-slate-700 hidden md:block">
                  H:{wx.high} L:{wx.low}
                </span>
              )}
            </div>
          )}

          <span className="w-px h-3.5 bg-white/[0.08] shrink-0" />

          {/* Date */}
          <span className="text-[10px] tracking-[0.22em] uppercase text-slate-600 font-medium shrink-0">
            {heroDateStr}
          </span>
          <span className="text-[9px] text-slate-800 font-mono shrink-0 hidden sm:block">Wk {weekNum}</span>

          <span className="w-px h-3.5 bg-white/[0.08] shrink-0" />

          {/* Greeting */}
          <TimeGreeting />

          {/* Stats — pushed to right */}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono hidden sm:flex items-center gap-1">
              <span className="text-slate-300">{headlineCount}</span>
              <span className="text-slate-700">headlines</span>
            </span>
            {upcomingCount > 0 && (
              <span className="text-[10px] font-mono flex items-center gap-1">
                <span className="text-amber-400">{upcomingCount}</span>
                <span className="text-slate-700 hidden sm:inline">due</span>
              </span>
            )}
            {/* Year progress */}
            <div className="hidden md:flex items-center gap-1.5">
              <div className="relative w-16 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
              </div>
              <span className="text-[9px] text-slate-700 font-mono">{pct}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-soft-pulse" />
            </div>
          </div>
        </div>

        {/* ── Row 2: quote strip ── */}
        {briefing.quote && (
          <div className="pb-3 flex items-start gap-3 min-w-0">
            <div className="w-px self-stretch bg-violet-500/30 shrink-0 rounded-full" />
            <p className="text-sm italic text-slate-500 leading-relaxed line-clamp-2 min-w-0">
              &ldquo;{briefing.quote}&rdquo;
              {briefing.author && (
                <span className="not-italic text-slate-700 ml-1.5">— {briefing.author}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
