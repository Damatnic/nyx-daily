'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  content: React.ReactNode;
  side?: 'top' | 'bottom';
}

export default function InfoTooltip({ content, side = 'bottom' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const posClass = side === 'top'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  return (
    <div ref={ref} className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all duration-150 ${
          open
            ? 'border-violet-500/50 text-violet-400 bg-violet-500/10'
            : 'border-slate-700 text-slate-700 hover:border-slate-500 hover:text-slate-400'
        }`}
        aria-label="More info"
      >
        ?
      </button>

      {open && (
        <div
          className={`absolute ${posClass} right-0 z-50 w-56 rounded-lg border border-white/[0.08] bg-[#0f0f1e] shadow-xl shadow-black/40 p-3 text-left`}
          onClick={e => e.stopPropagation()}
        >
          <div className="text-[12px] text-slate-300 leading-relaxed space-y-1.5">
            {content}
          </div>
          {/* Arrow */}
          <div className={`absolute right-2 ${side === 'top' ? 'top-full border-t-white/[0.08] border-l-transparent border-r-transparent border-b-transparent border-[5px]' : 'bottom-full border-b-white/[0.08] border-l-transparent border-r-transparent border-t-transparent border-[5px]'}`} />
        </div>
      )}
    </div>
  );
}
