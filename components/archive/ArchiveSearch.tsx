'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ArrowUpRight } from 'lucide-react';
import type { DailyBriefing } from '@/lib/types';

interface BriefingEntry {
  date: string;
  briefing: DailyBriefing | null;
}

interface ArchiveSearchProps {
  briefings: BriefingEntry[];
}

function parseWeather(weather: string): { emoji: string; temp: string; condition: string } | null {
  const emojiMatch = weather.match(/^(\S+)\s/);
  const tempMatch  = weather.match(/(\d+)°F/);
  const segments   = weather.split('·').map((s) => s.trim());
  if (!tempMatch) return null;
  return {
    emoji:     emojiMatch ? emojiMatch[1] : '🌤️',
    temp:      tempMatch[1],
    condition: segments[2] || '',
  };
}

function countHeadlines(news: Record<string, Array<unknown>>): number {
  return Object.values(news).reduce((sum, arr) => sum + arr.length, 0);
}

function cleanFocus(focus: string): string {
  return focus.replace(/\*\*/g, '').replace(/^[→🚨⚡]\s*/, '').trim().slice(0, 80);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return {
    day:   d.toLocaleDateString('en-US', { weekday: 'short' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    num:   d.getDate(),
    year:  d.getFullYear(),
    full:  d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

function BriefingCard({ date, briefing }: { date: string; briefing: DailyBriefing }) {
  const weather = briefing.weather ? parseWeather(briefing.weather) : null;
  const headlines = countHeadlines(briefing.news as Record<string, Array<unknown>>);
  const focus = briefing.focus ? cleanFocus(briefing.focus) : null;
  const fmt = formatDate(date);

  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <Link
      href={`/day/${date}`}
      className={`group block rounded-2xl border bg-[var(--card)] overflow-hidden hover:border-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${
        isToday ? 'border-violet-500/20' : 'border-white/[0.06]'
      }`}
    >
      {/* Top band */}
      <div className={`px-4 pt-4 pb-3 ${isToday ? 'bg-gradient-to-r from-violet-500/8 to-transparent' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          {/* Date block */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center bg-white/[0.04] rounded-lg px-2.5 py-1.5 border border-white/[0.06] shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold leading-none">{fmt.month}</span>
              <span className="text-xl font-black text-slate-100 leading-tight tabular-nums">{fmt.num}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold leading-none">{fmt.day}</span>
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                {fmt.full}
              </p>
              {isToday && (
                <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5 mt-1 inline-block">
                  Today
                </span>
              )}
              {/* Weather */}
              {weather && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-sm">{weather.emoji}</span>
                  <span className="text-xs font-bold text-cyan-300 tabular-nums">{weather.temp}°F</span>
                  {weather.condition && (
                    <span className="text-[10px] text-slate-600">{weather.condition}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ArrowUpRight size={14} className="text-slate-700 group-hover:text-violet-400 transition-colors shrink-0 mt-1" />
        </div>
      </div>

      {/* Focus / snippet */}
      {focus && (
        <div className="px-4 pb-3 border-t border-white/[0.04]">
          <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
            {focus}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-3 flex items-center gap-3 border-t border-white/[0.04] mt-auto pt-2.5">
        <span className="text-[10px] text-slate-700 font-mono">{headlines} headlines</span>
        {briefing.app_of_the_day && (
          <>
            <span className="text-slate-800">·</span>
            <span className="text-[10px] text-slate-700 truncate">🛠 {briefing.app_of_the_day.name}</span>
          </>
        )}
      </div>
    </Link>
  );
}

export default function ArchiveSearch({ briefings }: ArchiveSearchProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return briefings.filter((b) => b.briefing !== null);
    const q = search.toLowerCase();
    return briefings.filter(({ date, briefing }) => {
      if (!briefing) return false;
      const text = [
        date,
        briefing.day,
        briefing.weather,
        briefing.focus,
        briefing.quote,
        briefing.author,
        briefing.app_of_the_day?.name,
      ].filter(Boolean).join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [briefings, search]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by date, focus, quote, app..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/[0.08] bg-[var(--card)] text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 focus:bg-[var(--card)] transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-600 mb-4 font-mono">
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {search && <span className="text-slate-700"> · &ldquo;{search}&rdquo;</span>}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-slate-500 text-sm">Nothing found for &ldquo;{search}&rdquo;</p>
          <button onClick={() => setSearch('')} className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ date, briefing }) =>
            briefing ? <BriefingCard key={date} date={date} briefing={briefing} /> : null
          )}
        </div>
      )}
    </div>
  );
}
