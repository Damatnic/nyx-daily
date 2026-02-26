'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';

interface UrgencyBannerProps {
  deadlines?: SchoolDeadline[] | null;
}

export default function UrgencyBanner({ deadlines }: UrgencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!deadlines || deadlines.length === 0) return null;

  const urgent = deadlines.filter((d) => !d.done && d.days <= 1);
  if (urgent.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-b border-red-500/20 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5 min-w-0">

          {/* Icon */}
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />

          {/* Items — scrollable on mobile if too many */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0">
            {urgent.map((item, idx) => {
              const isToday = item.days === 0;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md shrink-0 ${
                    isToday
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-amber-500/20 border border-amber-500/30'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-wider shrink-0 ${isToday ? 'text-red-400' : 'text-amber-400'}`}>
                    {isToday ? 'TODAY' : '1d'}
                  </span>
                  {/* Course — short version */}
                  <span className={`text-xs font-semibold shrink-0 ${isToday ? 'text-red-300' : 'text-amber-300'}`}>
                    {item.course.split(' ')[0]}
                  </span>
                  {/* Desc — truncated */}
                  <span className="text-xs text-slate-400 hidden sm:block max-w-[160px] truncate">
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200 ml-auto"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>

        </div>
      </div>
    </div>
  );
}
