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
  const emoji     = w.match(/^(\S+)\s/)?.[1]      ?? '🌡️';
  const temp      = w.match(/(\d+)°F/)?.[1]       ?? '--';
  const feels     = w.match(/feels\s+(\d+)°F/)?.[1] ?? null;
  const seg       = w.split('·').map(s => s.trim());
  const condition = seg[2] ?? '';
  const high      = w.match(/H:(\d+)/)?.[1] ?? null;
  const low       = w.match(/L:(\d+)/)?.[1] ?? null;
  return { emoji, temp, feels, condition, high, low };
}

/** Map temperature to a color — cold=blue, mild=green, hot=amber */
function tempColor(temp: string): string {
  const n = parseInt(temp, 10);
  if (isNaN(n)) return 'text-slate-200';
  if (n < 32)  return 'text-blue-300';
  if (n < 55)  return 'text-cyan-300';
  if (n < 75)  return 'text-emerald-300';
  if (n < 90)  return 'text-amber-300';
  return 'text-red-400';
}

export default function HeroSection({ briefing, weekNum, heroDateStr, dayOfYear, headlineCount, upcomingCount }: Props) {
  const year       = new Date(briefing.date + 'T12:00:00').getFullYear();
  const totalDays  = year % 4 === 0 ? 366 : 365;
  const pct        = Math.round((dayOfYear / totalDays) * 100);
  const wx         = parseWeather(briefing.weather);
  const tempCls    = tempColor(wx.temp);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow — left purple, right temperature-tinted */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-20 w-[500px] h-[300px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.5) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top meta row ── */}
        <div className="flex items-center justify-between pt-8 pb-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-slate-600 font-medium">
              {heroDateStr}
            </span>
            <span className="w-px h-3 bg-white/[0.1]" />
            <TimeGreeting />
          </div>
          <span className="text-[10px] text-slate-700 font-mono hidden sm:block">Wk {weekNum}</span>
        </div>

        {/* ── Main: Quote + Weather ── */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start">

          {/* Quote */}
          <div className="animate-quote">
            {briefing.quote ? (
              <div>
                <p className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.6rem] font-light italic leading-[1.2] text-slate-100 tracking-tight">
                  &ldquo;{briefing.quote}&rdquo;
                </p>
                {briefing.author && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/[0.15]" />
                    <span className="text-sm text-slate-500">{briefing.author}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-4xl font-light text-slate-300 italic">Good morning, Nick.</p>
            )}
          </div>

          {/* Weather — desktop: right column. Mobile: below quote */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-1 lg:pt-2 animate-num-pop">
            <div className="flex items-start gap-2 lg:gap-3">
              <span className="text-3xl lg:text-4xl leading-none select-none">{wx.emoji}</span>
              <div className="flex flex-col">
                <span className={`text-5xl lg:text-6xl font-black leading-none tabular-nums ${tempCls}`}>
                  {wx.temp}°
                </span>
                {wx.feels && (
                  <span className="text-[10px] text-slate-600 mt-1 lg:text-right">feels {wx.feels}°</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-0.5 pt-1">
              {wx.condition && (
                <span className="text-[10px] uppercase tracking-widest text-slate-600">{wx.condition}</span>
              )}
              {(wx.high || wx.low) && (
                <div className="flex items-center gap-1.5 text-xs">
                  {wx.high && <span className="text-amber-500/70">H:{wx.high}°</span>}
                  <span className="text-slate-800">·</span>
                  {wx.low  && <span className="text-blue-500/70">L:{wx.low}°</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="border-t border-white/[0.05] py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {/* Year progress */}
          <div className="flex items-center gap-2">
            <div className="relative w-20 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                }}
              />
            </div>
            <span className="text-[10px] text-slate-600 font-mono">{pct}%</span>
          </div>

          <span className="text-white/[0.08]">·</span>

          <span className="text-[11px] font-mono">
            <span className="text-slate-300">{headlineCount}</span>
            <span className="text-slate-600"> headlines</span>
          </span>

          {upcomingCount > 0 && (
            <>
              <span className="text-white/[0.08]">·</span>
              <span className="text-[11px] font-mono">
                <span className="text-amber-400">{upcomingCount}</span>
                <span className="text-slate-600"> due this week</span>
              </span>
            </>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-soft-pulse" />
            <span className="text-[10px] text-slate-700 font-mono hidden sm:block">live</span>
          </div>
        </div>
      </div>

      {/* Bottom edge line */}
      <div className="divider" />
    </section>
  );
}
