'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkoutExercise } from '@/lib/types';
import { Check, RotateCcw, Flame } from 'lucide-react';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { useWorkoutStreak } from '@/lib/useWorkoutStreak';

interface ExerciseInfo { muscles: string; tip: string; }

const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  'Pushups': {
    muscles: 'Chest · Shoulders · Triceps · Core',
    tip: 'Straight line from head to heels. Lower until chest nearly touches the floor, elbows at ~45°.',
  },
  'Rows': {
    muscles: 'Back · Biceps · Rear Delts',
    tip: 'Squeeze shoulder blades together at the top. Can use a table edge, barbell, or resistance band.',
  },
  'Shoulder Press': {
    muscles: 'Shoulders · Triceps · Upper Traps',
    tip: 'Press directly overhead — don\'t flare elbows forward. Control the descent.',
  },
  'Tricep Dips': {
    muscles: 'Triceps · Chest · Anterior Delt',
    tip: 'Hands behind you on a chair or bench. Keep torso upright to focus on triceps.',
  },
  'Squats': {
    muscles: 'Quads · Glutes · Hamstrings · Core',
    tip: 'Feet shoulder-width, toes slightly out. Chest up, knees track over toes. Hit parallel.',
  },
  'Lunges': {
    muscles: 'Quads · Glutes · Hamstrings · Balance',
    tip: 'Step far enough that your front knee stays over your ankle, not past your toes.',
  },
  'Calf Raises': {
    muscles: 'Gastrocnemius · Soleus',
    tip: 'Pause at the top for a full contraction. Go slow on the way down — most growth happens there.',
  },
  'Glute Bridges': {
    muscles: 'Glutes · Hamstrings · Lower Back',
    tip: 'Drive through your heels. Squeeze hard at the top for 1 second before lowering.',
  },
  'Plank': {
    muscles: 'Core · Shoulders · Glutes',
    tip: 'Hips level — not sagging or piked. Squeeze glutes and abs simultaneously. Breathe steadily.',
  },
  'Mountain Climbers': {
    muscles: 'Core · Hip Flexors · Shoulders · Cardio',
    tip: 'Keep hips low and level. Drive knees toward chest fast — the speed is the exercise.',
  },
  'Bicycle Crunches': {
    muscles: 'Obliques · Rectus Abdominis',
    tip: 'Rotate torso, not just elbows. Extend the opposite leg fully. Slow and controlled > fast and sloppy.',
  },
  'Jumping Jacks': {
    muscles: 'Full Body · Cardio',
    tip: 'Arms fully overhead at the top. Land softly on the balls of your feet.',
  },
};

function exerciseInfo(name: string): ExerciseInfo | null {
  const clean = name.replace(/\s*\(.*\)/, '').trim();
  return EXERCISE_INFO[clean] ?? null;
}

interface Props {
  workout?: { name: string; exercises: WorkoutExercise[] } | null;
  date: string;
}

export default function WorkoutTracker({ workout, date }: Props) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const key = `workout-${date}`;
  const workoutStreak = useWorkoutStreak();

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
          {workoutStreak > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono" title={`${workoutStreak}-day workout streak`}>
              <Flame size={11} className="text-orange-400" />
              <span className="text-orange-400 tabular-nums">{workoutStreak}</span>
              <span className="text-slate-700 hidden sm:inline">streak</span>
            </span>
          )}
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
          const info   = exerciseInfo(ex.name);
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => toggle(i)}
              onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') toggle(i); }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-150 cursor-pointer ${
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

              {/* Info tooltip */}
              {info && !isDone && (
                <InfoTooltip
                  side="top"
                  content={
                    <>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Muscles</p>
                      <p className="text-slate-400">{info.muscles}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-2 mb-1">Form Tip</p>
                      <p className="text-slate-300">{info.tip}</p>
                    </>
                  }
                />
              )}

              {/* Reps + Sets */}
              <span className={`shrink-0 text-[11px] font-mono transition-colors flex items-center gap-1.5 ${isDone ? 'text-slate-700' : 'text-emerald-500/80'}`}>
                {ex.note && (
                  <span className={`text-[10px] ${isDone ? 'text-slate-800' : 'text-slate-600'}`}>{ex.note} ·</span>
                )}
                {ex.reps}
              </span>
            </div>
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
