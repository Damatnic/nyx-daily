interface WeatherCardProps {
  weather: string;
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

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { emoji, location, temp, feels, condition, high, low } = parseWeather(weather);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Top row: emoji + location */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-4xl leading-none">{emoji}</span>
        <div className="text-right">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-500">
            {location}
          </span>
        </div>
      </div>

      {/* Temp + feels */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-100">{temp}°F</span>
        {feels && (
          <span className="text-slate-400 text-sm">feels {feels}°F</span>
        )}
      </div>

      {/* Condition */}
      {condition && (
        <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">
          {condition}
        </p>
      )}

      {/* High / Low bar */}
      {(high || low) && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="text-blue-400 font-medium">H: {high}°</span>
            <span className="text-amber-400 font-medium">L: {low}°</span>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500/30 to-amber-500/30 rounded-full" />
        </div>
      )}
    </div>
  );
}
