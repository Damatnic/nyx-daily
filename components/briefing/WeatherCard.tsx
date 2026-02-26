export interface WeatherDay {
  date: string;
  high: number;
  low: number;
  precip_pct: number;
  condition: string;
  emoji: string;
}

interface WeatherCardProps {
  weather: string;
  forecast?: WeatherDay[] | null;
}

/**
 * Parses a weather string like:
 *   "☁️ Waukesha · 32°F (feels 25°F) · Overcast · H:38° L:27°"
 * into structured fields.
 */
function parseWeather(weather: string) {
  // emoji is first grapheme cluster(s) before the first space
  const emojiMatch = weather.match(/^(\S+)\s/);
  const emoji = emojiMatch ? emojiMatch[1] : '🌡️';

  // Location: first segment after emoji, before ·
  const segments = weather.split('·').map((s) => s.trim());
  // segments[0] = "☁️ Waukesha", segments[1] = "32°F (feels 25°F)", etc.
  const location = segments[0].replace(/^\S+\s*/, '').trim() || 'Waukesha';

  // Temp + feels
  const tempStr = segments[1] || '';
  const tempMatch = tempStr.match(/^(\d+)°F/);
  const feelsMatch = tempStr.match(/feels\s+(\d+)°F/);
  const temp = tempMatch ? tempMatch[1] : '—';
  const feels = feelsMatch ? feelsMatch[1] : null;

  // Condition
  const condition = segments[2] || '';

  // High/Low
  const hlStr = segments[3] || '';
  const highMatch = hlStr.match(/H:(\d+)/);
  const lowMatch = hlStr.match(/L:(\d+)/);
  const high = highMatch ? highMatch[1] : null;
  const low = lowMatch ? lowMatch[1] : null;

  return { emoji, location, temp, feels, condition, high, low };
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tmrw';

  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function ForecastDay({ day }: { day: WeatherDay }) {
  const dayName = getDayName(day.date);

  return (
    <div className="flex flex-col items-center gap-1 min-w-[52px] py-2">
      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
        {dayName}
      </span>
      <span className="text-lg leading-none">{day.emoji}</span>
      <div className="flex items-center gap-1 text-[10px]">
        <span className="text-slate-300 font-medium">{day.high}°</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-500">{day.low}°</span>
      </div>
      {/* Precipitation bar */}
      {day.precip_pct > 0 && (
        <div className="w-full h-1 mt-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400/60 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(day.precip_pct, 100)}%` }}
          />
        </div>
      )}
      {day.precip_pct > 0 && (
        <span className="text-[9px] text-blue-400/70">{day.precip_pct}%</span>
      )}
    </div>
  );
}

export default function WeatherCard({ weather, forecast }: WeatherCardProps) {
  const { emoji, location, temp, feels, condition, high, low } = parseWeather(weather);

  return (
    <div className="rounded-xl relative overflow-hidden p-5 bg-gradient-to-br from-blue-950/50 via-[#0d0d1a] to-cyan-950/20 border border-white/[0.08]">
      {/* Decorative glow */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: emoji */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        <span className="text-5xl leading-none">{emoji}</span>
      </div>

      {/* Big temp + feels */}
      <div className="relative z-10 flex items-baseline gap-2">
        <span className="text-4xl font-black text-white">{temp}°F</span>
        {feels && (
          <span className="text-sm text-slate-400">feels {feels}°F</span>
        )}
      </div>

      {/* Condition */}
      {condition && (
        <p className="relative z-10 text-xs uppercase tracking-[0.15em] text-cyan-400/80 mt-1">
          {condition}
        </p>
      )}

      {/* High / Low pills */}
      {(high || low) && (
        <div className="relative z-10 flex items-center gap-2 mt-3">
          {high && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              H: {high}°
            </span>
          )}
          {low && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              L: {low}°
            </span>
          )}
        </div>
      )}

      {/* Location */}
      <p className="relative z-10 text-[10px] tracking-widest uppercase text-slate-600 mt-1">
        {location}
      </p>

      {/* 5-day forecast strip */}
      {forecast && forecast.length > 0 && (
        <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600">
              5-Day Forecast
            </span>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>
          <div className="flex items-start justify-between gap-1 overflow-x-auto scrollbar-none">
            {forecast.slice(0, 5).map((day) => (
              <ForecastDay key={day.date} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
