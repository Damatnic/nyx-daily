import { DailyBriefing } from '@/lib/types';
import TimeGreeting from './TimeGreeting';
import { parseWeather, tempColor } from '@/lib/weather';

interface Props {
  briefing: DailyBriefing;
  weekNum: number;
  heroDateStr: string;
  dayOfYear: number;
  headlineCount: number;
  upcomingCount: number;
  focus?: string | null;
  streak?: number;
}

export default function HeroSection({ briefing, weekNum, heroDateStr, dayOfYear, headlineCount, upcomingCount, focus, streak }: Props) {
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
            <a href="https://wttr.in/Waukesha,WI" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 shrink-0 hover:opacity-75 transition-opacity">
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
            </a>
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
            {streak !== undefined && streak > 0 && (
              <span className="text-[10px] font-mono hidden sm:flex items-center gap-1" title={`${streak}-day briefing streak`}>
                <span className="text-orange-400 text-xs">🔥</span>
                <span className="text-slate-400 tabular-nums">{streak}</span>
              </span>
            )}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-soft-pulse" />
            </div>
          </div>
        </div>

        {/* ── Row 2: quote + focus ── */}
        {(briefing.quote || focus) && (
          <div className="pb-3 flex flex-col sm:flex-row gap-2 sm:gap-5 min-w-0">
            {briefing.quote && (
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-px self-stretch bg-violet-500/25 shrink-0 rounded-full" />
                <p className="text-sm italic text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-1 min-w-0">
                  &ldquo;{briefing.quote}&rdquo;
                  {briefing.author && (
                    <span className="not-italic text-slate-700 ml-1.5">— {briefing.author}</span>
                  )}
                </p>
              </div>
            )}
            {focus && (
              <div className="flex items-center gap-2 shrink-0 sm:border-l sm:border-white/[0.06] sm:pl-5">
                <span className="text-violet-400 text-xs select-none">⚡</span>
                <p className="text-[12px] text-slate-400 line-clamp-1 max-w-[280px]">
                  {focus.replace(/\*\*/g, '').replace(/^[→🚨⚡]\s*/, '').trim()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
