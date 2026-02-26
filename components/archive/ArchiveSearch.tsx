'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Search, Newspaper, Cloud } from 'lucide-react';
import type { DailyBriefing } from '@/lib/types';

interface BriefingEntry {
  date: string;
  briefing: DailyBriefing | null;
}

interface ArchiveSearchProps {
  briefings: BriefingEntry[];
}

function parseWeather(weather: string): { emoji: string; temp: string } | null {
  // Extract emoji (first non-whitespace)
  const emojiMatch = weather.match(/^[\p{Emoji}\u200d\uFE0F\s]+/u);
  const emoji = emojiMatch ? emojiMatch[0].trim() : '🌤️';

  // Extract temperature
  const tempMatch = weather.match(/(\d+)°F/);
  const temp = tempMatch ? `${tempMatch[1]}°F` : null;

  if (!temp) return null;
  return { emoji, temp };
}

function cleanFocus(focus: string): string {
  // Remove markdown bold (**text**)
  let cleaned = focus.replace(/\*\*/g, '');
  // Truncate to 75 chars
  if (cleaned.length > 75) {
    cleaned = cleaned.slice(0, 75).trim() + '…';
  }
  return cleaned;
}

function countHeadlines(news: Record<string, Array<unknown>>): number {
  return Object.values(news).reduce((sum, arr) => sum + arr.length, 0);
}

export default function ArchiveSearch({ briefings }: ArchiveSearchProps) {
  const [search, setSearch] = useState('');

  const filteredBriefings = useMemo(() => {
    if (!search.trim()) return briefings;

    const query = search.toLowerCase();
    return briefings.filter(({ date, briefing }) => {
      if (!briefing) return false;

      // Search through date, day, weather, focus
      const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const searchable = [
        date,
        dateStr,
        briefing.day,
        briefing.weather,
        briefing.focus,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [briefings, search]);

  const validBriefings = filteredBriefings.filter(({ briefing }) => briefing !== null);

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search briefings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] bg-[#0d0d1a] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-slate-500 text-sm mb-4">
        {validBriefings.length} briefing{validBriefings.length !== 1 ? 's' : ''} found
        {search && <span className="text-slate-600"> for &ldquo;{search}&rdquo;</span>}
      </p>

      {/* Briefing grid */}
      {validBriefings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-slate-400">No briefings match your search.</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {validBriefings.map(({ date, briefing }) => {
            if (!briefing) return null;

            const weatherData = briefing.weather ? parseWeather(briefing.weather) : null;
            const headlineCount = countHeadlines(briefing.news as Record<string, Array<unknown>>);
            const cleanedFocus = briefing.focus ? cleanFocus(briefing.focus) : null;

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className="card-hover group block rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 hover:border-purple-500/20 hover:bg-[#0f0f1e] transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Calendar size={15} className="text-[#8b5cf6]" />
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-600 group-hover:text-[#8b5cf6] mt-1 transition-colors duration-200"
                  />
                </div>

                <p className="text-xs text-slate-500 mb-0.5">{briefing.day}</p>
                <p className="text-lg font-bold text-slate-100 group-hover:text-[#8b5cf6] transition-colors duration-200">
                  {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                {/* Weather line */}
                {weatherData && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                    <Cloud size={11} className="text-cyan-400" />
                    <span>{weatherData.emoji} {weatherData.temp}</span>
                  </div>
                )}

                {/* Focus text */}
                {cleanedFocus && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 border-t border-white/[0.04] pt-2">
                    {cleanedFocus}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
                  <Newspaper size={11} className="text-slate-500" />
                  <span className="text-xs text-slate-500">{headlineCount} headlines</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
