'use client';

import { DailyBriefing } from '@/lib/types';

interface NewsTickerProps {
  news?: DailyBriefing['news'];
}

interface TickerItem {
  label: string;
  color: string;
  title: string;
  link: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  us_news:       { label: 'US',    color: '#a78bfa' },
  politics:      { label: 'POL',   color: '#f87171' },
  tech:          { label: 'TECH',  color: '#22d3ee' },
  ai:            { label: 'AI',    color: '#34d399' },
  entertainment: { label: 'ENT',   color: '#fbbf24' },
  weird_news:    { label: 'WEIRD', color: '#f472b6' },
  wisconsin:     { label: 'LOCAL', color: '#a78bfa' },
  til:           { label: 'TIL',   color: '#bef264' },
};

export default function NewsTicker({ news }: NewsTickerProps) {
  if (!news) return null;

  const items: TickerItem[] = [];

  for (const [key, stories] of Object.entries(news)) {
    const cfg = CATEGORY_CONFIG[key] ?? { label: key.toUpperCase().slice(0, 5), color: '#8b5cf6' };
    for (const story of stories) {
      if (story.title) {
        items.push({ label: cfg.label, color: cfg.color, title: story.title, link: story.link });
      }
    }
  }

  if (items.length === 0) return null;

  const doubled = [...items, ...items];
  const durationSec = Math.max(50, items.length * 6);

  return (
    <div className="w-full bg-[#08080f] border-b border-white/[0.04] sticky top-14 z-30">
      <div className="flex items-center h-9 overflow-hidden">

        {/* LEFT: LIVE badge */}
        <div className="shrink-0 flex items-center gap-2 pl-4 pr-3 h-full border-r border-white/[0.05] bg-[#0a0a18] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">Live</span>
        </div>

        {/* TICKER TRACK */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          {/* Left fade mask */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#08080f] to-transparent z-10 pointer-events-none" />
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#08080f] to-transparent z-10 pointer-events-none" />

          <div
            className="ticker-track flex items-center whitespace-nowrap"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {doubled.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group px-4 shrink-0"
                tabIndex={i >= items.length ? -1 : 0}
              >
                {/* Category badge */}
                <span
                  className="text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded shrink-0 uppercase"
                  style={{
                    color: item.color,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}25`,
                  }}
                >
                  {item.label}
                </span>
                {/* Headline */}
                <span className="text-[11px] text-slate-500 group-hover:text-slate-200 transition-colors duration-150">
                  {item.title}
                </span>
                {/* Separator */}
                <span className="text-slate-800 text-xs shrink-0" aria-hidden>·</span>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: story count */}
        <div className="shrink-0 flex items-center px-3 h-full border-l border-white/[0.05] bg-[#0a0a18] select-none">
          <span className="text-[9px] font-mono text-slate-700 tabular-nums">{items.length}</span>
        </div>
      </div>
    </div>
  );
}
