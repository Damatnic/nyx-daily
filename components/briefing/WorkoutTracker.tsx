'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkoutExercise } from '@/lib/types';
import { Check, RotateCcw } from 'lucide-react';

interface Props {
  workout?: { name: string; exercises: WorkoutExercise[] } | null;
  date: string;
}

export default function WorkoutTracker({ workout, date }: Props) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const key = `workout-${date}`;

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(key);
      if (saved) setDone(new Set(JSON.parse(saved)));
    } catch {}
  }, [key]);

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem(key, JSON.stringify([...done])); } catch {}
    }
  }, [done, key, mounted]);

  const toggle = useCallback((i: number) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setDone(new Set());
    try { localStorage.removeItem(key); } catch {}
  }, [key]);

  if (!workout?.exercises?.length) return null;

  const total    = workout.exercises.length;
  const doneCount = done.size;
  const pct      = total > 0 ? (doneCount / total) * 100 : 0;
  const complete  = doneCount === total;

  return (
    <div className={`nyx-card overflow-hidden transition-all duration-500 ${complete ? 'border-emerald-500/20' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Workout</span>
          <span className="text-[10px] text-slate-600 ml-2">{workout.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-600">{doneCount}/{total}</span>
          {doneCount > 0 && (
            <button onClick={reset} className="text-slate-700 hover:text-slate-400 transition-colors">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.04]">
        <div
          className={`h-full transition-all duration-500 ${complete ? 'bg-emerald-500' : 'bg-violet-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-white/[0.04]">
        {workout.exercises.map((ex, i) => {
          const isDone = done.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-150 ${
                isDone ? 'opacity-40' : 'hover:bg-white/[0.02]'
              }`}
            >
              {/* Checkbox */}
              <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-emerald-500/50'
              }`}>
                {isDone && <Check size={10} className="text-white" />}
              </div>

              {/* Name */}
              <span className={`flex-1 text-sm transition-all ${isDone ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                {ex.name}
              </span>

              {/* Reps */}
              <span className={`shrink-0 text-[11px] font-mono transition-colors ${isDone ? 'text-slate-700' : 'text-emerald-500/80'}`}>
                {ex.reps}
              </span>
            </button>
          );
        })}
      </div>

      {complete && (
        <div className="px-5 py-3 border-t border-emerald-500/15 bg-emerald-500/5 text-center">
          <span className="text-xs font-semibold text-emerald-400">Workout complete 🎉</span>
        </div>
      )}
    </div>
  );
}
