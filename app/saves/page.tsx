'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/nav/Navbar';
import type { SavePayload } from '@/components/ui/SaveButton';

const STORAGE_KEY = 'nyx-saves';
const TYPE_LABELS: Record<string, string> = {
  news: '📰 News', reddit: '🟠 Reddit', product: '🚀 Product',
  youtube: '▶️ YouTube', movie: '🎬 Movie', tv: '📺 TV',
  game: '🎮 Game', album: '🎵 Music', gem: '💎 Gem', link: '🔗 Link',
};

function typeColor(type: string): string {
  const map: Record<string, string> = {
    news: 'bg-blue-500/10 text-blue-400/80 border-blue-500/15',
    reddit: 'bg-orange-500/10 text-orange-400/80 border-orange-500/15',
    product: 'bg-amber-500/10 text-amber-400/80 border-amber-500/15',
    youtube: 'bg-red-500/10 text-red-400/80 border-red-500/15',
    movie: 'bg-violet-500/10 text-violet-400/80 border-violet-500/15',
    tv: 'bg-violet-500/10 text-violet-400/80 border-violet-500/15',
    game: 'bg-green-500/10 text-green-400/80 border-green-500/15',
    album: 'bg-pink-500/10 text-pink-400/80 border-pink-500/15',
    gem: 'bg-cyan-500/10 text-cyan-400/80 border-cyan-500/15',
    link: 'bg-slate-500/10 text-slate-400/80 border-slate-500/15',
  };
  return map[type] ?? map.link;
}

function getLocalSaves(): (SavePayload & { savedAt?: string })[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function setLocalSaves(saves: SavePayload[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export default function SavesPage() {
  const [saves, setSaves] = useState<(SavePayload & { savedAt?: string })[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSaves(getLocalSaves());
    setLoaded(true);
  }, []);

  const remove = (url: string) => {
    const next = saves.filter(s => s.url !== url);
    setSaves(next);
    setLocalSaves(next);
    fetch('/api/saves', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    }).catch(() => {});
  };

  const types = ['all', ...Array.from(new Set(saves.map(s => s.type)))];
  const filtered = filter === 'all' ? saves : saves.filter(s => s.type === filter);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-400/80 mb-1">Saved</p>
          <h1 className="text-2xl font-black text-slate-100">Reading List</h1>
          <p className="text-sm text-slate-600 mt-1">
            {saves.length === 0 ? 'Nothing saved yet.' : `${saves.length} item${saves.length === 1 ? '' : 's'} saved`}
          </p>
        </div>

        {/* Type filter pills */}
        {saves.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  filter === t
                    ? 'bg-white/[0.08] border-white/[0.15] text-slate-200'
                    : 'border-white/[0.06] text-slate-600 hover:text-slate-400 hover:border-white/[0.1]'
                }`}
              >
                {t === 'all' ? `All (${saves.length})` : (TYPE_LABELS[t] ?? t)}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        {!loaded ? null : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-700">
            {saves.length === 0
              ? 'Start saving items by clicking the 🔖 on any article, post, or release.'
              : 'No items match this filter.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item, i) => (
              <div
                key={`${item.url}-${i}`}
                className="nyx-card group flex items-start gap-3 px-4 py-3 hover:border-white/[0.1] transition-colors"
              >
                {/* Type badge */}
                <span className={`mt-0.5 shrink-0 text-[9px] px-1.5 py-0.5 rounded border ${typeColor(item.type)} whitespace-nowrap`}>
                  {TYPE_LABELS[item.type] ?? item.type}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-slate-200 hover:text-white font-medium leading-snug line-clamp-2 transition-colors"
                  >
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {item.source && (
                      <span className="text-[10px] text-slate-600">{item.source}</span>
                    )}
                    {item.savedAt && (
                      <span className="text-[10px] text-slate-700">
                        {new Date(item.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {item.snippet && (
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.snippet}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-slate-300 transition-colors"
                    title="Open link"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <button
                    onClick={() => remove(item.url)}
                    title="Remove"
                    className="text-slate-700 hover:text-red-400 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Obsidian note link */}
        {saves.length > 0 && (
          <p className="text-[10px] text-slate-700 text-center mt-8">
            Also saved to Obsidian → <span className="text-slate-600">Inbox/Saved Links.md</span>
          </p>
        )}
      </main>
    </div>
  );
}
