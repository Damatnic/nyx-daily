/**
 * Shared weather parsing utilities.
 * Used by HeroSection, MobileQuickBar, WeatherCard.
 */

export function tempColor(t: string): string {
  const n = parseInt(t, 10);
  if (isNaN(n)) return 'text-slate-200';
  if (n < 32)  return 'text-blue-300';
  if (n < 55)  return 'text-cyan-300';
  if (n < 75)  return 'text-emerald-300';
  if (n < 90)  return 'text-amber-300';
  return 'text-red-400';
}

export interface ParsedWeather {
  emoji: string;
  location: string;
  temp: string;
  feels: string | null;
  condition: string;
  high: string | null;
  low: string | null;
}

export function parseWeather(w: string): ParsedWeather {
  const seg       = w.split('·').map(s => s.trim());
  const emoji     = w.match(/^(\S+)\s/)?.[1]        ?? '🌡️';
  const location  = seg[0].replace(/^\S+\s*/, '').trim() || 'Waukesha';
  const tempStr   = seg[1] ?? '';
  const temp      = tempStr.match(/^(\d+)°F/)?.[1]  ?? '--';
  const feels     = tempStr.match(/feels\s+(\d+)°F/)?.[1] ?? null;
  const condition = seg[2] ?? '';
  const high      = w.match(/H:(\d+)/)?.[1]         ?? null;
  const low       = w.match(/L:(\d+)/)?.[1]         ?? null;
  return { emoji, location, temp, feels, condition, high, low };
}

export function parseTempGradient(temp: string): string {
  const n = parseInt(temp, 10);
  if (isNaN(n))  return 'from-slate-800/40 to-slate-900/20';
  if (n < 32)    return 'from-blue-950/60 to-cyan-950/30';
  if (n < 55)    return 'from-cyan-950/50 to-slate-900/20';
  if (n < 75)    return 'from-emerald-950/50 to-slate-900/20';
  if (n < 90)    return 'from-amber-950/50 to-slate-900/20';
  return 'from-red-950/50 to-orange-950/20';
}
