'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Clock } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';

interface UrgencyBannerProps {
  deadlines?: SchoolDeadline[] | null;
}

export default function UrgencyBanner({ deadlines }: UrgencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (dismissed || !deadlines || deadlines.length === 0) return null;

  const urgent = deadlines.filter((d) => !d.done && d.days <= 1);
  if (urgent.length === 0) return null;

  const hasToday = urgent.some((d) => d.days === 0);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 250);
  };

  return (
    /* Floating bottom-right toast on desktop; full-width inline on mobile */
    <>
      {/* Mobile: inline banner between hero and ticker */}
      <div className="lg:hidden w-full bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-b border-red-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <AlertTriangle size={13} className="text-amber-400 shrink-0" />
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0">
            {urgent.map((item, i) => (
              <span key={i} className="text-xs text-amber-300 shrink-0 font-medium truncate">
                {item.days === 0 ? '🔴 TODAY' : '🟡 1d'} · {item.course.split(' ')[0]} · {item.desc}
                {i < urgent.length - 1 && <span className="text-slate-600 ml-2">·</span>}
              </span>
            ))}
          </div>
          <button onClick={handleDismiss} className="shrink-0 text-slate-600 hover:text-slate-300 transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Desktop: floating toast bottom-right */}
      <div
        className={`hidden lg:flex fixed bottom-6 right-6 z-50 flex-col gap-2 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className={`rounded-2xl border shadow-2xl shadow-black/60 overflow-hidden max-w-xs w-full backdrop-blur-sm ${
          hasToday
            ? 'bg-red-950/95 border-red-500/30'
            : 'bg-amber-950/95 border-amber-500/30'
        }`}>
          {/* Header */}
          <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${
            hasToday ? 'border-red-500/20' : 'border-amber-500/20'
          }`}>
            <AlertTriangle size={13} className={hasToday ? 'text-red-400' : 'text-amber-400'} />
            <span className={`text-xs font-black uppercase tracking-widest ${
              hasToday ? 'text-red-400' : 'text-amber-400'
            }`}>
              {hasToday ? '⚠ Due Today' : '⚠ Due Soon'}
            </span>
            <button
              onClick={handleDismiss}
              className="ml-auto text-slate-600 hover:text-slate-300 transition-colors p-0.5 rounded"
            >
              <X size={12} />
            </button>
          </div>

          {/* Items */}
          <div className="px-4 py-3 flex flex-col gap-2">
            {urgent.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Clock size={12} className={`mt-0.5 shrink-0 ${item.days === 0 ? 'text-red-400' : 'text-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-black uppercase ${item.days === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                      {item.days === 0 ? 'Today' : '1 day'}
                    </span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-500">{item.course.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug mt-0.5">{item.desc}</p>
                  {item.due_str && (
                    <p className="text-[10px] text-slate-600 mt-0.5">{item.due_str}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
