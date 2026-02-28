'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WorkoutExercise } from '@/lib/types';
import { Check, RotateCcw, Flame, Footprints, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { useWorkoutStreak } from '@/lib/useWorkoutStreak';

const EXERCISE_INFO: Record<string, { muscles: string; tip: string }> = {
  'Pushups':                        { muscles: 'Chest · Shoulders · Triceps · Core',    tip: 'Straight line from head to heels. Lower until chest nearly touches floor. Elbows ~45°.' },
  'Push-Ups':                       { muscles: 'Chest · Shoulders · Triceps · Core',    tip: 'Straight line from head to heels. Lower until chest nearly touches floor. Elbows ~45°.' },
  'Rows':                           { muscles: 'Back · Biceps · Rear Delts',             tip: 'Squeeze shoulder blades at the top. Use a table, barbell, or resistance band.' },
  'Barbell Bench Press':            { muscles: 'Chest · Anterior Delt · Triceps',       tip: 'Feet flat, slight arch. Bar touches lower chest. Drive through your heels on the press.' },
  'Dumbbell Overhead Press':        { muscles: 'Shoulders · Triceps · Upper Traps',     tip: 'Press directly overhead — don\'t flare elbows forward. Control the descent.' },
  'Shoulder Press':                 { muscles: 'Shoulders · Triceps · Upper Traps',     tip: 'Press directly overhead — don\'t flare elbows forward. Control the descent.' },
  'Dumbbell Lateral Raises':        { muscles: 'Medial Deltoid',                        tip: 'Slight elbow bend, lead with the elbow not the wrist. Stop at shoulder height.' },
  'Dumbbell Tricep Overhead Ext.':  { muscles: 'Triceps (long head)',                   tip: 'Keep elbows close to ears. Full range: lower behind head, extend fully up.' },
  'Tricep Dips':                    { muscles: 'Triceps · Chest · Anterior Delt',       tip: 'Hands behind on a chair or bench. Keep torso upright to target triceps.' },
  'Barbell Bent-Over Row':          { muscles: 'Lats · Rhomboids · Biceps · Rear Delt', tip: 'Hip hinge to ~45°. Pull to your belly button. Squeeze shoulder blades at top.' },
  'Single-Arm Dumbbell Row':        { muscles: 'Lats · Rhomboids · Biceps',             tip: 'Brace on a bench. Pull elbow past hip. Squeeze hard at top. No torso rotation.' },
  'Dumbbell Bicep Curl':            { muscles: 'Biceps Brachii',                        tip: 'Don\'t swing. Full extension at bottom. Pause at top and squeeze.' },
  'Dumbbell Hammer Curl':           { muscles: 'Biceps · Brachialis · Forearms',        tip: 'Neutral grip (thumbs up). Elbows stay by sides. Targets the thick brachialis.' },
  'Kettlebell Romanian Deadlift':   { muscles: 'Hamstrings · Glutes · Lower Back',      tip: 'Soft knee bend. Push hips back, not down. Feel the hamstring stretch then drive hips forward.' },
  'Squats':                         { muscles: 'Quads · Glutes · Hamstrings · Core',    tip: 'Feet shoulder-width, toes slightly out. Chest up, knees track over toes. Hit parallel.' },
  'Barbell Squat':                  { muscles: 'Quads · Glutes · Hamstrings · Core',    tip: 'Bar on upper traps. Brace core, break at hips and knees simultaneously. Hit parallel.' },
  'Kettlebell Sumo Squat':          { muscles: 'Glutes · Adductors · Quads',            tip: 'Wide stance, toes out ~45°. Let the KB hang between legs. Push knees out on descent.' },
  'Dumbbell Reverse Lunge':         { muscles: 'Quads · Glutes · Hamstrings · Balance', tip: 'Step back, not forward. Front knee stays over ankle. Drive through front heel to stand.' },
  'Lunges':                         { muscles: 'Quads · Glutes · Hamstrings',           tip: 'Step far enough that front knee stays over ankle. Back knee lightly touches floor.' },
  'Calf Raises':                    { muscles: 'Gastrocnemius · Soleus',               tip: 'Pause at the top for a full contraction. Slow on the way down — most growth is there.' },
  'Glute Bridges':                  { muscles: 'Glutes · Hamstrings · Lower Back',      tip: 'Drive through heels. Squeeze hard at top for 1 second before lowering.' },
  'Kettlebell Swing':               { muscles: 'Glutes · Hamstrings · Core · Lats',     tip: 'Hip hinge, not squat. The power is in the hip snap — arms are just a lever.' },
  'Plank':                          { muscles: 'Core · Shoulders · Glutes',             tip: 'Hips level. Squeeze glutes and abs simultaneously. Breathe steadily.' },
  'Mountain Climbers':              { muscles: 'Core · Hip Flexors · Shoulders',        tip: 'Keep hips low. Drive knees toward chest fast — the speed is the exercise.' },
  'Bicycle Crunches':               { muscles: 'Obliques · Rectus Abdominis',           tip: 'Rotate torso, not just elbows. Extend opposite leg fully. Slow > fast.' },
};

function exerciseInfo(name: string) {
  return EXERCISE_INFO[name.replace(/\s*\(.*\)/, '').trim()] ?? null;
}

interface Props {
  workout?: {
    name: string;
    exercises: WorkoutExercise[];
    cycle_type?: string;
    cycle_label?: string;
    cycle_position?: number;
    missed_days?: number;
    next_label?: string;
    is_rest_day?: boolean;
  } | null;
  date: string;
}

export default function WorkoutTracker({ workout, date }: Props) {
  const [done, setDone]           = useState<Set<number>>(new Set());
  const [mounted, setMounted]     = useState(false);
  const [walkDone, setWalkDone]   = useState(false);
  const [completed, setCompleted] = useState(false);
  const [skipping, setSkipping]   = useState(false);
  const key = `workout-${date}`;
  const workoutStreak = useWorkoutStreak();

  // Load localStorage state on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(key);
      if (saved) setDone(new Set(JSON.parse(saved)));
    } catch {}
    // Load walk + completion state
    try {
      const wKey = `walk-${date}`;
      setWalkDone(localStorage.getItem(wKey) === '1');
      setCompleted(localStorage.getItem(`workout-completed-${date}`) === '1');
    } catch {}
  }, [key, date]);

  // Persist exercise done state
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

  const handleWalkToggle = async () => {
    const newVal = !walkDone;
    setWalkDone(newVal);
    try {
      localStorage.setItem(`walk-${date}`, newVal ? '1' : '0');
      await fetch('/api/workout/advance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'walk' }),
      });
    } catch {}
  };

  const handleComplete = async () => {
    setCompleted(true);
    try {
      localStorage.setItem(`workout-completed-${date}`, '1');
      await fetch('/api/workout/advance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      });
    } catch {}
  };

  const handleSkip = async () => {
    setSkipping(true);
    try {
      await fetch('/api/workout/advance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' }),
      });
    } catch {}
    setTimeout(() => setSkipping(false), 1500);
  };

  if (!workout?.exercises?.length && !workout?.is_rest_day) return null;

  const total      = workout.exercises?.length ?? 0;
  const doneCount  = done.size;
  const pct        = total > 0 ? (doneCount / total) * 100 : 0;
  const allDone    = total > 0 && doneCount === total;
  const isRestDay  = workout.is_rest_day || workout.cycle_type === 'rest' || workout.cycle_type === 'active_rest';
  const hasMissed  = (workout.missed_days ?? 0) > 0;

  // Accent color by workout type
  const accentClass = workout.cycle_type === 'push' ? 'text-violet-400' :
                      workout.cycle_type === 'pull' ? 'text-cyan-400' :
                      workout.cycle_type === 'legs' ? 'text-emerald-400' :
                      'text-slate-400';
  const progressClass = workout.cycle_type === 'push' ? 'bg-violet-500' :
                        workout.cycle_type === 'pull' ? 'bg-cyan-500' :
                        workout.cycle_type === 'legs' ? 'bg-emerald-500' :
                        'bg-slate-500';

  return (
    <div className={`nyx-card overflow-hidden transition-all duration-500 ${allDone || completed ? 'border-emerald-500/20' : ''}`}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Workout</span>
            <span className={`text-[11px] font-bold ${accentClass}`}>{workout.name}</span>
          </div>
          {workout.cycle_label && (
            <p className="text-[10px] text-slate-600 mt-0.5">{workout.cycle_label}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {workoutStreak > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono" title={`${workoutStreak}-day workout streak`}>
              <Flame size={11} className="text-orange-400" />
              <span className="text-orange-400 tabular-nums">{workoutStreak}</span>
            </span>
          )}
          {!isRestDay && (
            <span className="text-[10px] font-mono text-slate-600">{doneCount}/{total}</span>
          )}
          {doneCount > 0 && (
            <button onClick={reset} className="text-slate-700 hover:text-slate-400 transition-colors" title="Reset">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Missed Day Banner ────────────────────────────────────────────── */}
      {hasMissed && !isRestDay && (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/[0.06] border-b border-amber-500/15">
          <AlertTriangle size={13} className="text-amber-400 shrink-0" />
          <p className="text-[11px] text-amber-300/80 flex-1">
            {workout.missed_days} lift day{workout.missed_days! > 1 ? 's' : ''} missed.
            Complete today&apos;s workout or skip to stay on track.
          </p>
          <button
            onClick={handleSkip}
            className="text-[10px] text-amber-500/60 hover:text-amber-400 transition-colors shrink-0 font-medium"
          >
            {skipping ? 'Skipped ✓' : 'Skip'}
          </button>
        </div>
      )}

      {/* ── Rest Day ────────────────────────────────────────────────────── */}
      {isRestDay ? (
        <div className="px-5 py-5 text-center">
          <p className="text-2xl mb-2">😌</p>
          <p className="text-sm font-semibold text-slate-300">{workout.name}</p>
          <p className="text-[12px] text-slate-600 mt-1">{workout.exercises[0]?.name ?? 'Recovery + Walk'}</p>
          {workout.next_label && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-700">
              <span>Next up:</span>
              <span className="text-slate-500">{workout.next_label}</span>
              <ChevronRight size={10} />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Progress bar ─────────────────────────────────────────────── */}
          {total > 0 && (
            <div className="h-0.5 bg-white/[0.04]">
              <div className={`h-full transition-all duration-500 ${allDone || completed ? 'bg-emerald-500' : progressClass}`}
                   style={{ width: `${pct}%` }} />
            </div>
          )}

          {/* ── Exercise list ─────────────────────────────────────────────── */}
          <div className="divide-y divide-white/[0.04]">
            {workout.exercises.map((ex, i) => {
              const isDone = done.has(i);
              const info   = exerciseInfo(ex.name);
              return (
                <div
                  key={i}
                  role="button" tabIndex={0}
                  onClick={() => toggle(i)}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') toggle(i); }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-150 cursor-pointer ${
                    isDone ? 'opacity-40' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                    isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-emerald-500/50'
                  }`}>
                    {isDone && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`flex-1 text-sm transition-all ${isDone ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                    {ex.name}
                  </span>
                  {info && !isDone && (
                    <InfoTooltip side="top" content={
                      <>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Muscles</p>
                        <p className="text-slate-400">{info.muscles}</p>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-2 mb-1">Form Tip</p>
                        <p className="text-slate-300">{info.tip}</p>
                      </>
                    } />
                  )}
                  <span className={`shrink-0 text-[11px] font-mono flex items-center gap-1.5 ${isDone ? 'text-slate-700' : accentClass}`}>
                    {ex.note && <span className={`text-[10px] ${isDone ? 'text-slate-800' : 'text-slate-600'}`}>{ex.note} ·</span>}
                    {ex.reps}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Complete / Next workout row ───────────────────────────────── */}
          {(allDone || completed) ? (
            <div className="px-5 py-3 border-t border-emerald-500/15 bg-emerald-500/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Workout complete 🎉
                </span>
                {workout.next_label && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-600">
                    Next: <span className="text-slate-500">{workout.next_label}</span>
                    <ChevronRight size={10} />
                  </span>
                )}
              </div>
            </div>
          ) : allDone ? null : (
            <div className="px-5 py-3 border-t border-white/[0.04]">
              <button
                onClick={handleComplete}
                disabled={doneCount === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-semibold
                           bg-white/[0.03] border border-white/[0.06] text-slate-500
                           hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Check size={13} />
                Mark complete + advance routine
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Walk toggle — always visible ─────────────────────────────────── */}
      {mounted && (
        <div className={`flex items-center gap-3 px-5 py-3 border-t ${walkDone ? 'border-cyan-500/15 bg-cyan-500/[0.04]' : 'border-white/[0.04]'}`}>
          <button
            onClick={handleWalkToggle}
            className={`flex items-center gap-2 text-[11px] font-medium transition-all duration-200 ${
              walkDone ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              walkDone ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700'
            }`}>
              {walkDone && <Check size={10} className="text-white" />}
            </div>
            <Footprints size={13} />
            Walk today
          </button>
          {walkDone && <span className="text-[10px] text-cyan-500/50 ml-auto">logged ✓</span>}
        </div>
      )}
    </div>
  );
}
