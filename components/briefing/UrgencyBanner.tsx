'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';

interface UrgencyBannerProps {
  deadlines?: SchoolDeadline[] | null;
}

export default function UrgencyBanner({ deadlines }: UrgencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !deadlines || deadlines.length === 0) return null;

  const urgent = deadlines.filter((d) => !d.done && d.days <= 1);
  if (urgent.length === 0) return null;

  const hasToday = urgent.some((d) => d.days === 0);

  return (
    <div
      className={`w-full border-b backdrop-blur-sm overflow-hidden ${
        hasToday
          ? 'bg-gradient-to-r from-red-950/95 via-rose-950/90 to-red-950/95 border-red-500/20'
          : 'bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-amber-950/95 border-amber-500/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2">

          {/* Icon */}
          <AlertTriangle
            size={13}
            className={`shrink-0 ${hasToday ? 'text-red-400' : 'text-amber-400'}`}
          />

          {/* Label */}
          <span
            className={`text-[9px] font-black uppercase tracking-[0.18em] shrink-0 ${
              hasToday ? 'text-red-400' : 'text-amber-400'
            }`}
          >
            {hasToday ? 'Due Today' : 'Due Soon'}
          </span>

          <span className="text-slate-700 shrink-0">·</span>

          {/* Items */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-1 min-w-0">
            {urgent.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    item.days === 0
                      ? 'bg-red-500/20 text-red-300 border border-red-500/25'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/25'
                  }`}
                >
                  {item.days === 0 ? 'TODAY' : '1d'}
                </span>
                <span className="text-xs text-slate-300 truncate max-w-[200px]">
                  {item.course.split(' ').slice(0, 2).join(' ')} · {item.desc}
                </span>
                {i < urgent.length - 1 && (
                  <span className="text-slate-700 shrink-0">·</span>
                )}
              </div>
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all duration-150"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
