import { WordOfDay as WordOfDayType } from '@/lib/types';

interface WordOfDayProps {
  word: WordOfDayType;
}

export default function WordOfDay({ word }: WordOfDayProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-500">
          📖 Word of the Day
        </span>
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>

      {/* Word + type badge */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-slate-100">{word.word}</span>
        <span className="text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 rounded-full px-2 py-0.5 leading-none">
          {word.type}
        </span>
      </div>

      {/* Definition */}
      <p className="text-slate-300 text-sm leading-relaxed mt-3">
        {word.definition}
      </p>

      {/* Use it */}
      <div className="mt-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block mb-1">
          Use it
        </span>
        <p className="text-slate-400 text-sm italic">
          &ldquo;{word.use_it}&rdquo;
        </p>
      </div>
    </div>
  );
}
