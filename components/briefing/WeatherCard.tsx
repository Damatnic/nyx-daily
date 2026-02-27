export interface WeatherDay {
  date: string;
  high: number;
  low: number;
  precip_pct: number;
  condition: string;
  emoji: string;
}

interface Props {
  weather: string;
  forecast?: WeatherDay[] | null;
}

function parse(weather: string) {
  const emoji     = weather.match(/^(\S+)\s/)?.[1]         ?? '🌡️';
  const seg       = weather.split('·').map(s => s.trim());
  const location  = seg[0].replace(/^\S+\s*/, '').trim() || 'Waukesha';
  const tempStr   = seg[1] ?? '';
  const temp      = tempStr.match(/^(\d+)°F/)?.[1]         ?? '—';
  const feels     = tempStr.match(/feels\s+(\d+)°F/)?.[1]  ?? null;
  const condition = seg[2] ?? '';
  const high      = weather.match(/H:(\d+)/)?.[1]          ?? null;
  const low       = weather.match(/L:(\d+)/)?.[1]          ?? null;
  return { emoji, location, temp, feels, condition, high, low };
}

function tempGradient(temp: string): string {
  const n = parseInt(temp, 10);
  if (isNaN(n))  return 'from-slate-800/40 to-slate-900/20';
  if (n < 32)    return 'from-blue-950/60 to-cyan-950/30';
  if (n < 55)    return 'from-cyan-950/50 to-slate-900/20';
  if (n < 75)    return 'from-emerald-950/50 to-slate-900/20';
  if (n < 90)    return 'from-amber-950/50 to-slate-900/20';
  return 'from-red-950/50 to-orange-950/20';
}

function tempTextColor(temp: string): string {
  const n = parseInt(temp, 10);
  if (isNaN(n)) return 'text-slate-200';
  if (n < 32)  return 'text-blue-300';
  if (n < 55)  return 'text-cyan-300';
  if (n < 75)  return 'text-emerald-300';
  if (n < 90)  return 'text-amber-300';
  return 'text-red-300';
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const tmrw  = new Date(today); tmrw.setDate(tmrw.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tmrw.toDateString())  return 'Tmrw';
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function ForecastDay({ day }: { day: WeatherDay }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[48px]">
      <span className="text-[9px] text-slate-600 uppercase tracking-wide font-semibold">{getDayName(day.date)}</span>
      <span className="text-xl leading-none">{day.emoji}</span>
      <div className="flex items-center gap-0.5 text-[10px]">
        <span className="text-slate-300 font-semibold">{day.high}°</span>
        <span className="text-slate-700">/</span>
        <span className="text-slate-600">{day.low}°</span>
      </div>
      {day.precip_pct > 0 && (
        <div className="w-full h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div className="h-full bg-blue-400/50 rounded-full" style={{ width: `${Math.min(day.precip_pct, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

export default function WeatherCard({ weather, forecast }: Props) {
  const { emoji, location, temp, feels, condition, high, low } = parse(weather);
  const grad = tempGradient(temp);
  const cls  = tempTextColor(temp);

  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br ${grad} bg-[var(--card)] overflow-hidden`}>
      <div className="p-5">
        {/* Top: emoji + temp */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-5xl leading-none select-none">{emoji}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-5xl font-black leading-none tabular-nums ${cls}`}>{temp}°F</span>
            {feels && <span className="text-xs text-slate-600 mt-1">feels {feels}°F</span>}
          </div>
        </div>

        {/* Condition */}
        {condition && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600 mt-1">{condition}</p>
        )}

        {/* H/L */}
        {(high || low) && (
          <div className="flex items-center gap-2 mt-2">
            {high && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-amber-400/80">H:{high}°</span>}
            {low  && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/15 text-blue-400/80">L:{low}°</span>}
          </div>
        )}

        <p className="text-[9px] text-slate-700 uppercase tracking-widest mt-2">{location}</p>
      </div>

      {/* Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="border-t border-white/[0.05] px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-700 font-semibold mb-3">5-Day Forecast</p>
          <div className="flex items-start justify-between gap-1">
            {forecast.slice(0, 5).map(day => <ForecastDay key={day.date} day={day} />)}
          </div>
        </div>
      )}
    </div>
  );
}
