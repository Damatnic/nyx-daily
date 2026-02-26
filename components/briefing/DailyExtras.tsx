'use client';

import { useState } from 'react';
import { WordOfDay, DailyFact } from '@/lib/types';

interface Props { word?: WordOfDay | null; facts?: DailyFact[] | null; }

const FACT_COLORS: Record<string, string> = {
  Space: 'text-violet-400', Science: 'text-cyan-400', Psychology: 'text-amber-400',
  History: 'text-orange-400', Tech: 'text-emerald-400', Nature: 'text-green-400',
  Money: 'text-yellow-400', Weird: 'text-rose-400',
};

export default function DailyExtras({ word, facts }: Props) {
  const hasFacts = !!facts?.length;
  const hasWord  = !!word;
  const [tab, setTab] = useState<'facts' | 'word'>(hasFacts ? 'facts' : 'word');

  if (!hasFacts && !hasWord) return null;

  return (
    <div className="nyx-card p-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4">
        {hasFacts && (
          <button onClick={() => setTab('facts')}
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
              tab === 'facts' ? 'bg-violet-600/70 text-white' : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]'
            }`}
          >
            Facts
          </button>
        )}
        {hasWord && (
          <button onClick={() => setTab('word')}
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
              tab === 'word' ? 'bg-violet-600/70 text-white' : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]'
            }`}
          >
            Word
          </button>
        )}
      </div>

      {/* Facts */}
      {tab === 'facts' && hasFacts && (
        <div className="flex flex-col gap-3">
          {facts!.map((f, i) => {
            const color = FACT_COLORS[f.category] ?? 'text-slate-400';
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0 select-none">{f.emoji}</span>
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${color} block mb-0.5`}>{f.category}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.fact}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Word of the day */}
      {tab === 'word' && hasWord && (
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-black text-slate-100">{word!.word}</span>
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">{word!.type}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-3">{word!.definition}</p>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-600 mb-1">Use it</p>
            <p className="text-xs text-slate-500 italic leading-relaxed">&ldquo;{word!.use_it}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}
