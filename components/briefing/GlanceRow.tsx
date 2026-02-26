import { AlertTriangle, Newspaper, Target, CloudSun } from 'lucide-react';

interface GlanceRowProps {
  weather?: string | null;
  deadlineCount: number;
  headlineCount: number;
  focus?: string | null;
}

/**
 * Parses weather string to extract emoji and temperature
 * Example: "☁️ Waukesha · 32°F (feels 25°F) · Overcast · H:38° L:27°"
 */
function parseWeatherForGlance(weather: string): { emoji: string; temp: string; feels: string | null } {
  // Get first emoji/grapheme
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';

  // Get temperature
  const tempMatch = weather.match(/(\d+)°F/);
  const temp = tempMatch ? tempMatch[1] : '--';

  // Get feels like
  const feelsMatch = weather.match(/feels\s+(\d+)°F/);
  const feels = feelsMatch ? feelsMatch[1] : null;

  return { emoji, temp, feels };
}

/**
 * Strips markdown bold (**) and leading emoji from focus text
 */
function cleanFocus(focus: string): string {
  // Remove ** markers
  let cleaned = focus.replace(/\*\*/g, '');
  // Remove leading emoji (first non-space grapheme cluster if it's an emoji)
  cleaned = cleaned.replace(/^[\p{Emoji}\p{Emoji_Component}]+\s*/u, '');
  return cleaned.trim();
}

export default function GlanceRow({ weather, deadlineCount, headlineCount, focus }: GlanceRowProps) {
  const parsed = weather ? parseWeatherForGlance(weather) : null;
  const cleanedFocus = focus ? cleanFocus(focus) : null;

  return (
    <div className="w-full bg-[#07070f] border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Weather Pill */}
          <div className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
            {parsed ? (
              <>
                <span className="text-2xl">{parsed.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-cyan-300">{parsed.temp}°</span>
                  {parsed.feels && (
                    <span className="text-xs text-slate-500">feels {parsed.feels}°</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <CloudSun size={24} className="text-slate-500" />
                <span className="text-sm text-slate-500">No weather</span>
              </>
            )}
          </div>

          {/* Deadlines Pill */}
          <div className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
            <AlertTriangle
              size={20}
              className={deadlineCount > 0 ? 'text-red-400' : 'text-emerald-400'}
            />
            <div className="flex flex-col">
              <span
                className={`text-2xl font-bold ${
                  deadlineCount > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {deadlineCount}
              </span>
              <span className="text-xs text-slate-500">due this week</span>
            </div>
          </div>

          {/* Headlines Pill */}
          <div className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
            <Newspaper size={20} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-100">{headlineCount}</span>
              <span className="text-xs text-slate-500">headlines today</span>
            </div>
          </div>

          {/* Focus Pill */}
          <div className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] px-4 py-3 flex flex-col justify-center">
            <span className="text-xs tracking-widest uppercase text-slate-500 mb-0.5 flex items-center gap-1.5">
              <Target size={10} />
              Today&apos;s Focus
            </span>
            <span className="text-sm text-violet-300 truncate">
              {cleanedFocus || 'Stay focused'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
