interface GlanceRowProps {
  weather?: string | null;
  deadlineCount: number;
  headlineCount: number;
  focus?: string | null;
}

function parseTemp(weather: string): { temp: string; feels: string | null; emoji: string } {
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';
  const tempMatch = weather.match(/(\d+)°F/);
  const temp = tempMatch ? tempMatch[1] : '--';
  const feelsMatch = weather.match(/feels\s+(\d+)°F/);
  const feels = feelsMatch ? feelsMatch[1] : null;
  return { temp, feels, emoji };
}

function getDayProgress(): number {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return Math.round((minutes / 1440) * 100);
}

function cleanFocus(focus: string): string {
  return focus.replace(/\*\*/g, '').replace(/^[\p{Emoji}\p{Emoji_Component}]+\s*/u, '').trim();
}

export default function GlanceRow({ weather, deadlineCount, headlineCount, focus }: GlanceRowProps) {
  const parsed = weather ? parseTemp(weather) : null;
  const dayPct = getDayProgress();
  const cleanedFocus = focus ? cleanFocus(focus) : 'Stay focused';

  return (
    <div className="w-full bg-[#07070f] border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

          {/* Weather */}
          <div className="rounded-xl bg-[#0d0d1a]/80 border border-white/[0.05] px-3 py-2.5 flex items-center gap-2.5 group hover:border-cyan-500/20 transition-all duration-200">
            {parsed ? (
              <>
                <span className="text-2xl shrink-0 select-none">{parsed.emoji}</span>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-cyan-300 tabular-nums leading-none">{parsed.temp}°</span>
                    <span className="text-[10px] text-slate-600">F</span>
                  </div>
                  {parsed.feels && (
                    <span className="text-[10px] text-slate-600">feels {parsed.feels}°</span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm text-slate-600">No weather</span>
            )}
          </div>

          {/* Day progress */}
          <div className="rounded-xl bg-[#0d0d1a]/80 border border-white/[0.05] px-3 py-2.5 flex flex-col justify-center gap-1.5 hover:border-violet-500/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider">Day</span>
              <span className="text-[10px] font-mono text-slate-500 tabular-nums">{dayPct}%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${dayPct}%` }}
              />
            </div>
          </div>

          {/* Headlines */}
          <div className="rounded-xl bg-[#0d0d1a]/80 border border-white/[0.05] px-3 py-2.5 flex items-center gap-2.5 hover:border-violet-500/20 transition-all duration-200">
            <span className="text-lg shrink-0 select-none">📰</span>
            <div>
              <div className="text-lg font-black text-slate-100 tabular-nums leading-none">{headlineCount}</div>
              <div className="text-[10px] text-slate-600">headlines</div>
            </div>
          </div>

          {/* Deadlines */}
          <div className={`rounded-xl bg-[#0d0d1a]/80 border px-3 py-2.5 flex items-center gap-2.5 transition-all duration-200 ${
            deadlineCount > 0
              ? 'border-amber-500/20 hover:border-amber-500/40'
              : 'border-white/[0.05] hover:border-emerald-500/20'
          }`}>
            <span className="text-lg shrink-0 select-none">{deadlineCount > 0 ? '⚠️' : '✅'}</span>
            <div>
              <div className={`text-lg font-black tabular-nums leading-none ${
                deadlineCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>{deadlineCount}</div>
              <div className="text-[10px] text-slate-600">due this week</div>
            </div>
          </div>

        </div>

        {/* Focus strip — full width below */}
        {cleanedFocus && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-violet-500/[0.06] border border-violet-500/10 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-slate-600 shrink-0 hidden sm:block">Focus</span>
            <span className="text-xs text-violet-300 truncate">{cleanedFocus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
