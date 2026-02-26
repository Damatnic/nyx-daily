'use client';

import { DailyBriefing } from '@/lib/types';

interface TickerItem { label: string; color: string; title: string; link: string; }

const CATS: Record<string, { label: string; color: string }> = {
  us_news:       { label: 'US',    color: '#a78bfa' },
  politics:      { label: 'POL',   color: '#f87171' },
  tech:          { label: 'TECH',  color: '#22d3ee' },
  ai:            { label: 'AI',    color: '#34d399' },
  entertainment: { label: 'ENT',   color: '#fbbf24' },
  weird_news:    { label: 'WEIRD', color: '#f472b6' },
  wisconsin:     { label: 'LOCAL', color: '#a78bfa' },
  til:           { label: 'TIL',   color: '#bef264' },
};

export default function NewsTicker({ news }: { news?: DailyBriefing['news'] }) {
  if (!news) return null;

  const items: TickerItem[] = [];
  for (const [key, stories] of Object.entries(news)) {
    const cfg = CATS[key] ?? { label: key.slice(0,5).toUpperCase(), color: '#7c3aed' };
    for (const s of stories) {
      if (s.title) items.push({ label: cfg.label, color: cfg.color, title: s.title, link: s.link });
    }
  }
  if (!items.length) return null;

  const doubled = [...items, ...items];
  const dur = Math.max(50, items.length * 6);

  return (
    <div className="w-full sticky top-12 z-30 border-b border-white/[0.04]" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center h-8 overflow-hidden">

        {/* LIVE */}
        <div className="shrink-0 flex items-center gap-2 pl-4 pr-3 h-full border-r border-white/[0.05] select-none"
          style={{ background: 'var(--card)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-black tracking-[0.2em] uppercase text-slate-600">Live</span>
        </div>

        {/* Track */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }} />

          <div className="ticker-track flex items-center whitespace-nowrap" style={{ animationDuration: `${dur}s` }}>
            {doubled.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group px-4 shrink-0"
                tabIndex={i >= items.length ? -1 : 0}
              >
                <span className="text-[7px] font-black tracking-wider px-1 py-0.5 rounded shrink-0 uppercase"
                  style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-600 group-hover:text-slate-300 transition-colors">
                  {item.title}
                </span>
                <span className="text-slate-800 text-xs shrink-0" aria-hidden>·</span>
              </a>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="shrink-0 flex items-center px-3 h-full border-l border-white/[0.05] select-none"
          style={{ background: 'var(--card)' }}>
          <span className="text-[8px] font-mono text-slate-700 tabular-nums">{items.length}</span>
        </div>
      </div>
    </div>
  );
}
