import Link from 'next/link';
import type { SchoolDeadline } from '@/lib/types';

interface Props {
  weather?: string | null;
  deadlines?: SchoolDeadline[] | null;
}

function parseWeatherShort(w: string) {
  const emoji = w.match(/^(\S+)\s/)?.[1] ?? '🌡️';
  const temp  = w.match(/(\d+)°F/)?.[1]  ?? '--';
  const cond  = w.split('·')[2]?.trim()  ?? '';
  return { emoji, temp, cond };
}

function tempColor(t: string) {
  const n = parseInt(t, 10);
  if (isNaN(n)) return 'text-slate-300';
  if (n < 32)   return 'text-blue-300';
  if (n < 55)   return 'text-cyan-300';
  if (n < 75)   return 'text-emerald-300';
  if (n < 90)   return 'text-amber-300';
  return 'text-red-400';
}

export default function MobileQuickBar({ weather, deadlines }: Props) {
  const upcoming = (deadlines ?? []).filter(d => !d.done && d.days >= 0 && d.days <= 7);
  const urgent   = upcoming.filter(d => d.days <= 1);

  // Always render — weather alone is worth showing
  if (!weather && upcoming.length === 0) return null;

  const wx      = weather ? parseWeatherShort(weather) : null;
  const tempCls = wx ? tempColor(wx.temp) : '';

  return (
    <div className="lg:hidden border-b border-white/[0.04] bg-[#06060e]">
      <div className="max-w-7xl mx-auto px-4 min-h-[44px] flex items-center gap-3">

        {/* Weather pill */}
        {wx && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm select-none leading-none">{wx.emoji}</span>
            <span className={`text-sm font-black tabular-nums leading-none ${tempCls}`}>{wx.temp}°</span>
            {wx.cond && (
              <span className="text-[9px] uppercase tracking-widest text-slate-700 hidden xs:block">{wx.cond}</span>
            )}
          </div>
        )}

        {wx && <span className="w-px h-3 bg-white/[0.07] shrink-0" />}

        {/* School status */}
        {upcoming.length === 0 ? (
          <span className="text-[11px] text-slate-700">Nothing due this week 🎉</span>
        ) : (
          <Link href="/school" className="flex items-center gap-1.5 min-w-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              urgent.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500/70'
            }`} />
            <span className={`text-[12px] font-semibold truncate ${
              urgent.length > 0 ? 'text-red-300' : 'text-amber-300'
            }`}>
              {urgent.length > 0
                ? `${urgent.length} urgent deadline${urgent.length > 1 ? 's' : ''}`
                : `${upcoming.length} due this week`}
            </span>
          </Link>
        )}

        {/* School shortcut */}
        <Link
          href="/school"
          className="ml-auto text-[10px] text-slate-700 hover:text-violet-400 transition-colors shrink-0 font-medium"
        >
          School →
        </Link>
      </div>
    </div>
  );
}
