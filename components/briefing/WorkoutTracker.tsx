'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkoutExercise } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import { Dumbbell, RotateCcw, Check } from 'lucide-react';

interface WorkoutTrackerProps {
  workout?: {
    name: string;
    exercises: WorkoutExercise[];
  } | null;
  date: string;
}

export default function WorkoutTracker({ workout, date }: WorkoutTrackerProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  const storageKey = `workout-${date}`;

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCompleted(new Set(parsed));
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [storageKey]);

  // Save to localStorage when completed changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify([...completed]));
    }
  }, [completed, storageKey, mounted]);

  const toggleExercise = useCallback((index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setCompleted(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  if (!workout) return null;

  const total = workout.exercises.length;
  const done = completed.size;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const allComplete = done === total && total > 0;

  return (
    <div className={`rounded-xl border bg-[#0d0d1a] p-5 transition-all duration-500 ${allComplete ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/[0.06]'}`}>
      <SectionHeader title="Workout" />

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${allComplete ? 'bg-emerald-500' : 'bg-purple-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">
            {done}/{total} completed
          </span>
          {done > 0 && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Workout header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg border transition-colors duration-300 ${allComplete ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
          <Dumbbell size={14} className="text-[#10b981]" />
        </div>
        <span className="text-sm font-semibold text-slate-200">{workout.name}</span>
        <span className="text-xs text-slate-500 ml-auto">{total} exercises</span>
      </div>

      {/* Completion celebration */}
      {allComplete && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
          <span className="text-sm font-medium text-emerald-400">
            Workout complete!
          </span>
        </div>
      )}

      {/* Exercise list */}
      <div className="flex flex-col gap-2">
        {workout.exercises.map((ex, i) => {
          const isComplete = completed.has(i);

          return (
            <button
              key={i}
              onClick={() => toggleExercise(i)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-300 ${
                isComplete
                  ? 'bg-white/[0.01] border-white/[0.02] opacity-60'
                  : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
              }`}
            >
              {/* Custom checkbox */}
              <div
                className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 mt-0.5 ${
                  isComplete
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-600 hover:border-emerald-500/50'
                }`}
              >
                {isComplete && <Check size={12} className="text-white" />}
              </div>

              {/* Exercise info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${
                      isComplete ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {ex.name}
                  </span>
                  <span
                    className={`text-xs font-mono shrink-0 transition-colors duration-300 ${
                      isComplete ? 'text-slate-600' : 'text-[#10b981]'
                    }`}
                  >
                    {ex.reps}
                  </span>
                </div>
                {ex.note && (
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${isComplete ? 'text-slate-600' : 'text-slate-500'}`}>
                    {ex.note}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
