import { DailyBriefing } from '@/lib/types';
import TimeGreeting from './TimeGreeting';

interface HeroSectionProps {
  briefing: DailyBriefing;
  weekNum: number;
  heroDateStr: string;
  dayOfYear: number;
}

/** Parse minimal info from weather string for a compact display */
function parseWeatherMini(weather: string): { emoji: string; temp: string } {
  const emojiMatch = weather.match(/^(\S+)\s/);
  const tempMatch = weather.match(/(\d+)°F/);
  return {
    emoji: emojiMatch ? emojiMatch[1] : '🌡️',
    temp: tempMatch ? `${tempMatch[1]}°F` : '',
  };
}

export default function HeroSection({ briefing, weekNum, heroDateStr, dayOfYear }: HeroSectionProps) {
  const year = new Date(briefing.date + 'T12:00:00').getFullYear();
  const totalDays = year % 4 === 0 ? 366 : 365;
  const { emoji, temp } = parseWeatherMini(briefing.weather);

  // Strip markdown bold from focus text for the hero pill
  const focusClean = briefing.focus.replace(/\*\*/g, '').replace(/^[🚨→]\s*/, '').trim();
  const focusTrunc = focusClean.length > 60 ? focusClean.slice(0, 57) + '…' : focusClean;

  return (
    <section className="hero-shimmer border-b border-white/[0.06] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Date line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
              {heroDateStr}
            </span>
            <TimeGreeting />
          </div>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-600">
            Week {weekNum} · Day {dayOfYear}/{totalDays}
          </span>
        </div>

        {/* Quote */}
        {briefing.quote && (
          <div className="mt-7 mb-1">
            <p className="text-2xl sm:text-3xl font-light italic text-slate-100 leading-relaxed max-w-4xl">
              &ldquo;{briefing.quote}&rdquo;
            </p>
            {briefing.author && (
              <p className="text-sm text-slate-500 mt-3">— {briefing.author}</p>
            )}
          </div>
        )}

        {/* Bottom row: weather + focus */}
        <div className="flex flex-wrap items-center gap-3 mt-7">
          {/* Weather mini */}
          <span className="text-slate-400 text-sm flex items-center gap-1.5">
            <span>{emoji}</span>
            <span>{temp}</span>
          </span>

          <span className="text-slate-700 text-xs">·</span>

          {/* Focus pill */}
          <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm px-4 py-1.5 rounded-full leading-tight">
            ⚡ {focusTrunc}
          </span>
        </div>
      </div>
    </section>
  );
}
