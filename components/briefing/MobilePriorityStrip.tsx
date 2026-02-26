'use client';

import type { SchoolDeadline } from '@/lib/types';

interface MobilePriorityStripProps {
  school_deadlines?: SchoolDeadline[] | null;
  weather?: string | null;
}

function parseWeather(weather: string): { emoji: string; temp: string } | null {
  // Extract emoji (first non-whitespace characters before any letters/numbers)
  const emojiMatch = weather.match(/^[\p{Emoji}\u200d\uFE0F\s]+/u);
  const emoji = emojiMatch ? emojiMatch[0].trim() : '🌤️';

  // Extract temperature
  const tempMatch = weather.match(/(\d+)°F/);
  const temp = tempMatch ? `${tempMatch[1]}°` : null;

  if (!temp) return null;
  return { emoji, temp };
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + '…';
}

function getUrgencyColor(days: number): { bg: string; border: string; text: string } {
  if (days <= 1) {
    return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300' };
  }
  if (days <= 3) {
    return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-300' };
  }
  return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' };
}

function getShortCourse(course: string): string {
  // Shorten common course names
  const lower = course.toLowerCase();
  if (lower.includes('sql')) return 'SQL';
  if (lower.includes('stat')) return 'Stats';
  if (lower.includes('visual')) return 'Viz';
  if (lower.includes('security')) return 'Security';
  if (lower.includes('data')) return 'Data';
  // Return first word if no match
  return course.split(' ')[0];
}

export default function MobilePriorityStrip({ school_deadlines, weather }: MobilePriorityStripProps) {
  // Filter urgent deadlines (not done, days <= 7), sorted by days ascending
  const urgentDeadlines = (school_deadlines ?? [])
    .filter((d) => !d.done && d.days <= 7 && d.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const weatherData = weather ? parseWeather(weather) : null;

  // If no data to show, return null
  if (!weatherData && urgentDeadlines.length === 0) return null;

  return (
    <div className="lg:hidden overflow-x-auto scrollbar-none flex gap-2 px-4 py-3 bg-[#0a0a18] border-b border-white/[0.04]">
      {/* Weather pill */}
      {weatherData && (
        <div className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 flex items-center gap-1.5">
          <span>{weatherData.emoji}</span>
          <span>{weatherData.temp}</span>
        </div>
      )}

      {/* Urgent deadline pills */}
      {urgentDeadlines.map((deadline, idx) => {
        const color = getUrgencyColor(deadline.days);
        const shortCourse = getShortCourse(deadline.course);
        const shortDesc = truncate(deadline.desc, 25);

        return (
          <div
            key={idx}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${color.bg} border ${color.border} ${color.text} flex items-center gap-1.5`}
          >
            <span className="font-semibold">{shortCourse}</span>
            <span className="opacity-80">{shortDesc}</span>
            <span className="opacity-60">
              {deadline.days === 0 ? 'today' : `${deadline.days}d`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
