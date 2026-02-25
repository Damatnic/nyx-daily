'use client';

import { useState } from 'react';
import { WordOfDay, DailyFact } from '@/lib/types';

interface DailyExtrasProps {
  word?: WordOfDay | null;
  facts?: DailyFact[] | null;
}

// ─── Category color map ──────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { ring: string; text: string; bg: string }> = {
  'Space':       { ring: 'border-violet-500/25', text: 'text-violet-400',  bg: 'bg-violet-500/8'  },
  'Science':     { ring: 'border-cyan-500/25',   text: 'text-cyan-400',    bg: 'bg-cyan-500/8'    },
  'Psychology':  { ring: 'border-amber-500/25',  text: 'text-amber-400',   bg: 'bg-amber-500/8'   },
  'History':     { ring: 'border-orange-500/25', text: 'text-orange-400',  bg: 'bg-orange-500/8'  },
  'Tech':        { ring: 'border-emerald-500/25',text: 'text-emerald-400', bg: 'bg-emerald-500/8' },
  'Nature':      { ring: 'border-green-500/25',  text: 'text-green-400',   bg: 'bg-green-500/8'   },
  'Money':       { ring: 'border-yellow-500/25', text: 'text-yellow-400',  bg: 'bg-yellow-500/8'  },
  'Weird':       { ring: 'border-rose-500/25',   text: 'text-rose-400',    bg: 'bg-rose-500/8'    },
};

const DEFAULT_STYLE = { ring: 'border-slate-600/25', text: 'text-slate-400', bg: 'bg-slate-500/8' };

function getCatStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? DEFAULT_STYLE;
}

// ─── Word of the Day Tab ─────────────────────────────────────────────────────
function WordTab({ word }: { word: WordOfDay }) {
  return (
    <div className="pt-1">
      {/* Word row */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-2xl font-bold text-white tracking-tight">{word.word}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 border border-cyan-500/25 bg-cyan-500/8 rounded-full px-2 py-0.5 leading-none">
          {word.type}
        </span>
      </div>

      {/* Definition */}
      <p className="text-slate-300 text-sm leading-relaxed mb-3">
        {word.definition}
      </p>

      {/* Use it */}
      <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
          Use it
        </span>
        <p className="text-slate-400 text-sm italic leading-relaxed">
          &ldquo;{word.use_it}&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Facts Tab ───────────────────────────────────────────────────────────────
function FactsTab({ facts }: { facts: DailyFact[] }) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      {facts.map((f, i) => {
        const style = getCatStyle(f.category);
        return (
          <div
            key={i}
            className={`rounded-lg border p-3.5 ${style.ring} ${style.bg}`}
          >
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base leading-none">{f.emoji}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${style.text}`}>
                {f.category}
              </span>
            </div>
            {/* Fact text */}
            <p className="text-slate-200 text-sm leading-relaxed">
              {f.fact}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DailyExtras({ word, facts }: DailyExtrasProps) {
  const [tab, setTab] = useState<'facts' | 'word'>(facts && facts.length > 0 ? 'facts' : 'word');

  if (!word && (!facts || facts.length === 0)) return null;

  const tabs = [
    facts && facts.length > 0 && { key: 'facts' as const, label: '💡 Facts' },
    word                       && { key: 'word'  as const, label: '📖 Word' },
  ].filter(Boolean) as { key: 'facts' | 'word'; label: string }[];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Tab header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                ${tab === t.key
                  ? 'bg-violet-600/90 text-white border border-violet-500/30 shadow-md shadow-violet-900/30'
                  : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06]'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] text-slate-700 font-mono">Daily rotation</span>
      </div>

      {/* Content */}
      {tab === 'facts' && facts && facts.length > 0 && <FactsTab facts={facts} />}
      {tab === 'word'  && word                        && <WordTab  word={word}   />}
    </div>
  );
}
