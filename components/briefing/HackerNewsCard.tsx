'use client';

import { MessageSquare, TrendingUp } from 'lucide-react';
import type { HackerNewsItem } from '@/lib/types';
import SaveButton from '@/components/ui/SaveButton';

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function HackerNewsCard({ items }: { items?: HackerNewsItem[] | null }) {
  if (!items?.length) return null;
  const top = items.slice(0, 8);

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Hacker News</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/15 text-orange-400/70 font-mono">
            front page
          </span>
        </div>
        <span className="text-[10px] text-slate-700 font-mono">{top.length} stories</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {top.map((item, i) => (
          <div key={i} className="story-row group flex items-start gap-3 px-5 py-3">
            {/* Score */}
            <div className="shrink-0 text-center w-8 pt-0.5">
              <div className="flex items-center gap-0.5 text-emerald-400/80">
                <TrendingUp size={9} />
                <p className="text-[11px] font-black tabular-nums leading-none">{fmt(item.score)}</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2 font-medium block"
              >
                {item.title}
              </a>
              <div className="flex items-center gap-3 mt-1">
                {item.domain && (
                  <span className="text-[10px] text-slate-600">{item.domain}</span>
                )}
                <a
                  href={item.hn_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-orange-400 transition-colors"
                >
                  <MessageSquare size={9} />
                  {fmt(item.num_comments)}
                </a>
              </div>
            </div>

            <SaveButton item={{ type: 'news', title: item.title, url: item.link, source: item.domain || 'Hacker News', snippet: undefined }} />
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-white/[0.05]">
        <a
          href="https://news.ycombinator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-700 hover:text-orange-400 transition-colors"
        >
          Open Hacker News →
        </a>
      </div>
    </div>
  );
}
