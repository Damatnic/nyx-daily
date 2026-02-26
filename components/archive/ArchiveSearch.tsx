'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Search } from 'lucide-react';
import type { DailyBriefing, MarketItem } from '@/lib/types';

interface BriefingEntry {
  date: string;
  briefing: DailyBriefing | null;
}

interface ArchiveSearchProps {
  briefings: BriefingEntry[];
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

            // Build compact markets snapshot
            const markets = briefing.markets ?? [];
            const sp500 = markets.find((m: MarketItem) => m.symbol === '^GSPC');
            const btc = markets.find((m: MarketItem) => m.symbol === 'BTC-USD');

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className="group block rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 hover:border-purple-500/20 hover:bg-[#0f0f1e] transition-all duration-200"
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

                {/* Weather summary */}
                <p className="text-xs text-slate-400 mt-2 line-clamp-1">{briefing.weather}</p>

                {/* Markets snapshot */}
                {(sp500 || btc) && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04]">
                    {sp500 && (
                      <div className="flex items-center gap-1">
                        {sp500.up ? (
                          <TrendingUp size={11} className="text-emerald-400" />
                        ) : (
                          <TrendingDown size={11} className="text-red-400" />
                        )}
                        <span className="text-xs text-slate-500">S&amp;P</span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            sp500.up ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {sp500.up ? '+' : ''}{sp500.change_pct.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {btc && (
                      <div className="flex items-center gap-1">
                        {btc.up ? (
                          <TrendingUp size={11} className="text-emerald-400" />
                        ) : (
                          <TrendingDown size={11} className="text-red-400" />
                        )}
                        <span className="text-xs text-slate-500">BTC</span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            btc.up ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {btc.up ? '+' : ''}{btc.change_pct.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {briefing.focus && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 border-t border-white/[0.04] pt-2">
                    {briefing.focus}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
