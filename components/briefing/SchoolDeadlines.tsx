'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SchoolDeadline } from '@/lib/types';
import {
  makeDeadlineKey as makeKey,
  loadDoneSet, saveDoneSet,
  courseShort, dayLabel, checkboxCls,
} from '@/lib/deadlines';

export default function SchoolDeadlines({ deadlines }: { deadlines?: SchoolDeadline[] | null }) {
  const all = deadlines ?? [];
  const [localDone, setLocalDone] = useState<Set<string>>(new Set());
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  useEffect(() => { setLocalDone(loadDoneSet()); }, []);

  const isDone  = (item: SchoolDeadline) => item.done || localDone.has(makeKey(item));
  const isFading = (item: SchoolDeadline) => fadingOut.has(makeKey(item));

  const toggle = (item: SchoolDeadline) => {
    const key = makeKey(item);
    const next = new Set(localDone);
    if (next.has(key)) {
      // Un-mark: just remove from done, no animation needed
      next.delete(key);
      setLocalDone(next);
      saveDoneSet(next);
      // Persist server-side
      fetch('/api/deadlines/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: item.due_date, desc: item.desc, done: false }),
      }).catch(() => {});
    } else {
      // Mark done: animate out first, then remove
      next.add(key);
      setLocalDone(next);
      saveDoneSet(next);
      setFadingOut(prev => new Set([...prev, key]));
      setTimeout(() => {
        setFadingOut(prev => { const s = new Set(prev); s.delete(key); return s; });
      }, 400);
      // Persist server-side
      fetch('/api/deadlines/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: item.due_date, desc: item.desc, done: true }),
      }).catch(() => {});
    }
  };

  // Keep fading items visible during their exit animation
  const upcoming = all
    .filter(d => (!isDone(d) || isFading(d)) && d.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const doneCount = all.filter(isDone).length;
  const total     = all.length;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="nyx-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600">School</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600">{doneCount}/{total}</span>
          <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-xs text-slate-600 py-2">Nothing due soon. 🎉</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {upcoming.map((item) => {
            const fading = isFading(item);
            return (
              <div key={makeKey(item)}
                className={`flex items-center gap-2.5 py-1.5 transition-all duration-400 ${
                  fading ? 'opacity-0 translate-x-1 scale-98' : 'opacity-100'
                }`}
              >
                {/* Checkbox */}
                <button onClick={() => toggle(item)} title="Mark done"
                  className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center
                    transition-all duration-150 cursor-pointer ${checkboxCls(item.days)}
                    ${fading ? 'bg-emerald-500/30 border-emerald-500/60' : ''}`}
                >
                  {fading && (
                    <svg viewBox="0 0 10 10" className="w-2 h-2 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] truncate leading-snug transition-colors ${fading ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                    {item.desc}
                  </p>
                  <p className="text-[9px] text-slate-600">{courseShort(item.course)}</p>
                </div>

                <span className={`text-[9px] font-bold shrink-0 font-mono ${
                  item.days === 0 ? 'text-red-400' : item.days <= 3 ? 'text-amber-400' : 'text-slate-600'
                }`}>
                  {dayLabel(item.days)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {upcoming.length > 0 && (
        <Link href="/school"
          className="block text-center text-[10px] text-slate-700 hover:text-violet-400 transition-colors mt-3 pt-3 border-t border-white/[0.04]">
          View all →
        </Link>
      )}
    </div>
  );
}
