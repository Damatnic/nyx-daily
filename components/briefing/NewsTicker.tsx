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
  us_news:       { label: 'US',       color: '#8b5cf6' },
  politics:      { label: 'POL',      color: '#ef4444' },
  tech:          { label: 'TECH',     color: '#06b6d4' },
  ai:            { label: 'AI',       color: '#10b981' },
  entertainment: { label: 'ENT',      color: '#f59e0b' },
  weird_news:    { label: 'WEIRD',    color: '#ec4899' },
  wisconsin:     { label: 'LOCAL',    color: '#8b5cf6' },
  til:           { label: 'TIL',      color: '#a3e635' },
};

export default function NewsTicker({ news }: NewsTickerProps) {
  if (!news) return null;

  const items: TickerItem[] = [];

  // Flatten all categories into one list, preserving order
  for (const [key, stories] of Object.entries(news)) {
    const cfg = CATEGORY_CONFIG[key] ?? { label: key.toUpperCase().slice(0, 5), color: '#8b5cf6' };
    for (const story of stories) {
      if (story.title) {
        items.push({ label: cfg.label, color: cfg.color, title: story.title, link: story.link });
      }
    }
  }

  if (items.length === 0) return null;

  // Duplicate for seamless infinite loop (translateX(-50%) brings us back to start)
  const doubled = [...items, ...items];

  // Speed: ~80px/sec feels natural — adjust via animation-duration below
  const durationSec = Math.max(40, items.length * 6);

  return (
    <div className="w-full bg-[#0a0a18] border-y border-white/[0.04] sticky top-14 z-30 overflow-hidden">
      <div className="flex items-center h-9">

        {/* Left anchor — "NEWS" badge */}
        <div
          className="shrink-0 flex items-center gap-2 pl-3 pr-4 h-full z-10 select-none"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0d0d1a' }}
        >
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-purple-500"
              style={{ animation: 'pulse 1.8s ease-in-out infinite' }}
            />
            <span className="text-[9px] font-black tracking-[0.18em] text-slate-500 uppercase">
              News
            </span>
          </span>
        </div>

        {/* Scrolling strip */}
        <div className="flex-1 overflow-hidden relative">
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
                className="inline-flex items-center gap-2 group pl-3 pr-6 flex-shrink-0"
                tabIndex={i >= items.length ? -1 : 0}
              >
                <span
                  className="text-[8.5px] font-black tracking-[0.1em] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    color: item.color,
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}28`,
                  }}
                >
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-slate-100 transition-colors duration-150 leading-none">
                  {item.title}
                </span>
                <span className="text-slate-700 text-xs flex-shrink-0" aria-hidden>·</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
