'use client';

import { useEffect, useState } from 'react';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import type { SavePayload } from '@/components/ui/SaveButton';
import Link from 'next/link';

const STORAGE_KEY = 'nyx-saves';

const TYPE_EMOJI: Record<string, string> = {
  news: '📰', reddit: '🟠', product: '🚀', youtube: '▶️', video: '▶️',
  movie: '🎬', tv: '📺', game: '🎮', album: '🎵', gem: '💎', tool: '🔧', link: '🔗',
};

export default function RecentSaves() {
  const [saves, setSaves] = useState<(SavePayload & { savedAt?: string })[]>([]);

  useEffect(() => {
    const load = () => {
      try { setSaves(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
      catch { setSaves([]); }
    };
    load();
    window.addEventListener('storage', load);
    document.addEventListener('visibilitychange', load);
    const t = setInterval(load, 5000);
    return () => {
      window.removeEventListener('storage', load);
      document.removeEventListener('visibilitychange', load);
      clearInterval(t);
    };
  }, []);

  if (!saves.length) return null;

  const recent = [...saves].reverse().slice(0, 4);

  const remove = (url: string) => {
    const next = saves.filter(s => s.url !== url);
    setSaves(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    fetch('/api/saves', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }).catch(() => {});
  };

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Bookmark size={12} className="text-violet-400/60" />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Recent Saves</span>
        </div>
        <Link
          href="/saves"
          className="text-[10px] text-slate-700 hover:text-violet-400 transition-colors"
        >
          {saves.length} total →
        </Link>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {recent.map((save, i) => (
          <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 group hover:bg-white/[0.02] transition-colors">
            <span className="text-sm shrink-0 mt-0.5">{TYPE_EMOJI[save.type] ?? '🔗'}</span>
            <a
              href={save.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 group/link"
            >
              <p className="text-[12px] text-slate-400 group-hover/link:text-slate-200 leading-snug line-clamp-1 transition-colors">
                {save.title}
              </p>
              {save.source && (
                <p className="text-[10px] text-slate-700 mt-0.5">{save.source}</p>
              )}
            </a>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <a href={save.url} target="_blank" rel="noopener noreferrer"
                className="p-1 rounded text-slate-700 hover:text-slate-400 transition-colors">
                <ExternalLink size={10} />
              </a>
              <button onClick={() => remove(save.url)}
                className="p-1 rounded text-slate-700 hover:text-red-400 transition-colors">
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
