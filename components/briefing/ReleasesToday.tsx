'use client';

import { useState } from 'react';
import type { ReleasesToday, ReleaseItem } from '@/lib/types';

interface Props {
  releases: ReleasesToday;
}

const TABS = [
  { key: 'movies', label: 'Movies',  emoji: '🎬' },
  { key: 'tv',     label: 'TV',      emoji: '📺' },
  { key: 'games',  label: 'Games',   emoji: '🎮' },
  { key: 'music',  label: 'Music',   emoji: '🎵' },
] as const;

type TabKey = typeof TABS[number]['key'];

function StarRating({ rating }: { rating: number }) {
  const pct = Math.min(100, (rating / 10) * 100);
  return (
    <span className="flex items-center gap-1">
      <span className="text-[10px] font-mono text-amber-400/80">{rating.toFixed(1)}</span>
      <span className="relative inline-block w-14 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <span className="absolute inset-y-0 left-0 rounded-full bg-amber-400/60" style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}

function PlatformPill({ name }: { name: string }) {
  const short = name.replace('PlayStation', 'PS').replace('Nintendo Switch', 'Switch').replace('Microsoft Windows', 'PC').replace('Xbox One', 'XB1').replace('Xbox Series', 'XS');
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-600 border border-white/[0.04]">
      {short}
    </span>
  );
}

function ReleaseRow({ item }: { item: ReleaseItem }) {
  const meta = (() => {
    if (item.type === 'movie') {
      return item.year ? <span className="text-slate-600 text-[10px]">{item.year}</span> : null;
    }
    if (item.type === 'tv') {
      return item.network
        ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/15 text-violet-400/70">{item.network}</span>
        : null;
    }
    if (item.type === 'game') {
      return item.platforms?.length
        ? <span className="flex gap-1 flex-wrap">{item.platforms.slice(0, 3).map(p => <PlatformPill key={p} name={p} />)}</span>
        : null;
    }
    if (item.type === 'album') {
      return item.artist
        ? <span className="text-slate-500 text-[10px]">{item.artist}</span>
        : null;
    }
    return null;
  })();

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="story-row flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-slate-200 group-hover:text-white transition-colors leading-snug truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {meta}
        </div>
      </div>
      {item.rating && item.rating > 0 ? (
        <StarRating rating={item.rating} />
      ) : null}
      <span className="text-slate-700 group-hover:text-slate-400 transition-colors text-xs shrink-0">↗</span>
    </a>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  const msgs: Record<TabKey, string> = {
    movies: 'No new US theater releases this week.',
    tv:     'Nothing new airing today — or set TMDB_API_KEY to enable.',
    games:  'No new Steam releases found this week.',
    music:  'No recent album reviews found.',
  };
  return <p className="text-xs text-slate-700 px-3 py-4">{msgs[tab]}</p>;
}

export default function ReleasesToday({ releases }: Props) {
  const counts: Record<TabKey, number> = {
    movies: releases.movies?.length ?? 0,
    tv:     releases.tv?.length ?? 0,
    games:  releases.games?.length ?? 0,
    music:  releases.music?.length ?? 0,
  };

  // Start on the first tab that has data, or default to movies
  const defaultTab = (TABS.find(t => counts[t.key] > 0)?.key ?? 'movies') as TabKey;
  const [active, setActive] = useState<TabKey>(defaultTab);

  const items: ReleaseItem[] = releases[active] ?? [];

  return (
    <div className="nyx-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600 mb-3">
          New This Week
        </p>

        {/* Tab bar */}
        <div className="flex gap-1">
          {TABS.map(tab => {
            const isActive = active === tab.key;
            const count    = counts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all
                  ${isActive
                    ? 'bg-white/[0.08] text-slate-200'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]'
                  }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`text-[9px] font-mono ml-0.5 ${isActive ? 'text-slate-400' : 'text-slate-700'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-white/[0.04] mx-4" />

      {/* Items */}
      <div className="px-1 py-1">
        {items.length === 0
          ? <EmptyState tab={active} />
          : items.map((item, i) => <ReleaseRow key={`${item.type}-${i}`} item={item} />)
        }
      </div>

      {/* Footer link */}
      <div className="px-4 pb-3 pt-1">
        <a
          href={
            active === 'movies' ? 'https://www.themoviedb.org/movie' :
            active === 'tv'     ? 'https://www.themoviedb.org/tv' :
            active === 'games'  ? 'https://store.steampowered.com/search/?sort_by=Released_DESC&os=win' :
                                  'https://pitchfork.com/reviews/albums/'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-700 hover:text-violet-400 transition-colors"
        >
          See all on {active === 'movies' || active === 'tv' ? 'TMDB' : active === 'games' ? 'Steam' : 'Pitchfork'} →
        </a>
      </div>
    </div>
  );
}
