'use client';

import type { HiddenGem } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';
import { getDomain } from '@/lib/deadlines';

export default function HiddenGemsSection({ gems }: { gems?: HiddenGem[] | null }) {
  if (!gems?.length) return null;
  const top = gems.slice(0, 5);

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Hidden Gems</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 bg-white/[0.04] border border-white/[0.06] rounded-full px-1.5 py-0.5">Show HN</span>
        </div>
        <span className="text-[10px] text-slate-700 font-mono">{top.length}</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {top.map((gem, i) => (
          <div key={i} className="story-row group flex items-start gap-3 px-5 py-4">
            {/* Number */}
            <span className="text-[10px] font-mono text-slate-700 w-4 shrink-0 mt-0.5 tabular-nums">{i + 1}</span>

            {/* Accent bar */}
            <span className="w-0.5 self-stretch bg-amber-500/20 group-hover:bg-amber-500/50 rounded-full shrink-0 transition-colors duration-150" />

            {/* Clickable content area */}
            <a
              href={gem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-start gap-2 min-w-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-200 group-hover:text-amber-300 transition-colors leading-snug">
                  {gem.title}
                </p>
                {gem.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{gem.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600/70">HN</span>
                  {gem.points > 0 && (
                    <span className="text-[10px] text-slate-700 font-mono">{gem.points} pts</span>
                  )}
                  <span className="text-[10px] text-slate-700 truncate">{getDomain(gem.url)}</span>
                </div>
              </div>
              <ExternalLink size={11} className="shrink-0 text-slate-800 group-hover:text-amber-500/70 transition-colors mt-1" />
            </a>

            <SaveButton item={{ type: 'tool', title: gem.title, url: gem.url, source: 'Hidden Gems', snippet: gem.description || undefined }} />
          </div>
        ))}
      </div>

      <a
        href="https://news.ycombinator.com/show"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-3 border-t border-white/[0.04] text-[10px] text-slate-700 hover:text-amber-500/70 transition-colors"
      >
        More on Show HN <ExternalLink size={9} />
      </a>
    </div>
  );
}
