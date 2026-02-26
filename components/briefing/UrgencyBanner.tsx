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

  // Filter to urgent items: not done and due within 1 day
  const urgent = deadlines.filter((d) => !d.done && d.days <= 1);

  if (urgent.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-b border-red-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="shrink-0">
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
              {urgent.map((item, idx) => {
                const isToday = item.days === 0;
                const bgColor = isToday ? 'bg-red-500/20' : 'bg-amber-500/20';
                const borderColor = isToday ? 'border-red-500/30' : 'border-amber-500/30';
                const textColor = isToday ? 'text-red-300' : 'text-amber-300';
                const labelColor = isToday ? 'text-red-400' : 'text-amber-400';

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-2.5 py-1 rounded-lg ${bgColor} border ${borderColor}`}
                  >
                    <span className={`text-xs font-bold uppercase ${labelColor}`}>
                      {isToday ? 'TODAY' : '1 DAY'}
                    </span>
                    <span className={`text-xs font-medium ${textColor}`}>
                      {item.course}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {item.desc}
                    </span>
                    <span className="text-xs text-slate-500 hidden md:inline">
                      · {item.due_str}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
            aria-label="Dismiss urgent deadlines banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
