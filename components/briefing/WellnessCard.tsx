'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkoutExercise } from '@/lib/types';
import {
  Check, RotateCcw, Flame, Footprints, AlertTriangle,
  ChevronRight, CheckCircle2, Wind, Play, Square, Timer,
} from 'lucide-react';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { useWorkoutStreak } from '@/lib/useWorkoutStreak';

// ── Breathwork patterns keyed by session name ──────────────────────────────
interface Step { label: string; emoji: string; duration: number }

const BREATHWORK_PATTERNS: Record<string, { steps: Step[]; color: string }> = {
  'Box Breathing': {
    color: 'text-cyan-400',
    steps: [
      { label: 'Inhale',    emoji: '🫁', duration: 4 },
      { label: 'Hold',      emoji: '⏸',  duration: 4 },
      { label: 'Exhale',    emoji: '💨', duration: 4 },
      { label: 'Hold Out',  emoji: '⏸',  duration: 4 },
    ],
  },
  '4-7-8 Breathing': {
    color: 'text-violet-400',
    steps: [
      { label: 'Inhale',  emoji: '🫁', duration: 4 },
      { label: 'Hold',    emoji: '⏸',  duration: 7 },
      { label: 'Exhale',  emoji: '💨', duration: 8 },
    ],
  },
  'Diaphragmatic': {
    color: 'text-emerald-400',
    steps: [
      { label: 'Inhale (belly first)', emoji: '🫁', duration: 5 },
      { label: 'Exhale slowly',        emoji: '💨', duration: 7 },
    ],
  },
  'Power Breathing': {
    color: 'text-orange-400',
    steps: [
      { label: 'Quick deep breath', emoji: '🫁', duration: 2 },
      { label: 'Release',           emoji: '💨', duration: 1 },
    ],
  },
};

function getPattern(name: string) {
  for (const [key, val] of Object.entries(BREATHWORK_PATTERNS)) {
    if (name.includes(key.split(' ')[0])) return { key, ...val };
  }
  return { key: 'Box Breathing', ...BREATHWORK_PATTERNS['Box Breathing'] };
}

// ── Exercise form tips ─────────────────────────────────────────────────────
const EXERCISE_INFO: Record<string, { muscles: string; tip: string }> = {
  'Barbell Bench Press':           { muscles: 'Chest · Anterior Delt · Triceps',        tip: 'Feet flat, slight arch. Bar touches lower chest. Drive through heels on the press.' },
  'Dumbbell Overhead Press':       { muscles: 'Shoulders · Triceps · Upper Traps',      tip: 'Press directly overhead. Don\'t flare elbows forward. Control the descent.' },
  'Dumbbell Lateral Raises':       { muscles: 'Medial Deltoid',                         tip: 'Slight elbow bend, lead with the elbow. Stop at shoulder height.' },
  'Dumbbell Tricep Overhead Ext.': { muscles: 'Triceps (long head)',                    tip: 'Keep elbows close to ears. Lower behind head, extend fully up.' },
  'Push-Ups':                      { muscles: 'Chest · Shoulders · Triceps · Core',     tip: 'Straight line head to heels. Lower until chest nearly touches floor.' },
  'Pushups':                       { muscles: 'Chest · Shoulders · Triceps · Core',     tip: 'Straight line head to heels. Lower until chest nearly touches floor.' },
  'Barbell Bent-Over Row':         { muscles: 'Lats · Rhomboids · Biceps · Rear Delt',  tip: 'Hip hinge to ~45°. Pull to belly button. Squeeze shoulder blades at top.' },
  'Single-Arm Dumbbell Row':       { muscles: 'Lats · Rhomboids · Biceps',              tip: 'Brace on bench. Pull elbow past hip. No torso rotation.' },
  'Dumbbell Bicep Curl':           { muscles: 'Biceps Brachii',                         tip: 'Don\'t swing. Full extension at bottom. Pause at top and squeeze.' },
  'Dumbbell Hammer Curl':          { muscles: 'Biceps · Brachialis · Forearms',         tip: 'Neutral grip. Elbows stay by sides. Targets the thick brachialis.' },
  'Kettlebell Romanian Deadlift':  { muscles: 'Hamstrings · Glutes · Lower Back',       tip: 'Push hips back, not down. Feel the hamstring stretch then snap hips forward.' },
  'Barbell Squat':                 { muscles: 'Quads · Glutes · Hamstrings · Core',     tip: 'Bar on upper traps. Brace core, break at hips and knees simultaneously.' },
  'Kettlebell Sumo Squat':         { muscles: 'Glutes · Adductors · Quads',             tip: 'Wide stance, toes out ~45°. Push knees out on descent.' },
  'Dumbbell Reverse Lunge':        { muscles: 'Quads · Glutes · Hamstrings',            tip: 'Step back. Front knee stays over ankle. Drive through front heel to stand.' },
  'Calf Raises':                   { muscles: 'Gastrocnemius · Soleus',                 tip: 'Pause at the top. Slow on the way down — most growth is there.' },
  'Plank':                         { muscles: 'Core · Shoulders · Glutes',              tip: 'Hips level. Squeeze glutes and abs. Breathe steadily.' },
  'Kettlebell Swing':              { muscles: 'Glutes · Hamstrings · Core · Lats',      tip: 'Hip hinge, not squat. Power comes from the hip snap — arms are just a lever.' },
};

function exerciseInfo(name: string) {
  return EXERCISE_INFO[name.replace(/\s*\(.*\)/, '').trim()] ?? null;
}

// ── Props ──────────────────────────────────────────────────────────────────
interface WorkoutData {
  name: string;
  exercises: WorkoutExercise[];
  cycle_type?: string;
  cycle_label?: string;
  missed_days?: number;
  next_label?: string;
  is_rest_day?: boolean;
}

interface BreathworkData {
  name: string;
  steps: string;   // description string from briefing
  rounds: number;
}

interface Props {
  workout?: WorkoutData | null;
  breathwork?: BreathworkData | null;
  date: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WellnessCard({ workout, breathwork, date }: Props) {
  // ── Workout state ──────────────────────────────────────────────────────
  const [done, setDone]           = useState<Set<number>>(new Set());
  const [mounted, setMounted]     = useState(false);
  const [walkDone, setWalkDone]   = useState(false);
  const [completed, setCompleted] = useState(false);
  const [skipping, setSkipping]   = useState(false);
  const workoutStreak = useWorkoutStreak();
  const workoutKey = `workout-${date}`;

  // ── Breathwork state ───────────────────────────────────────────────────
  type BwState = 'idle' | 'running' | 'done';
  const [bwState, setBwState]           = useState<BwState>('idle');
  const [bwRound, setBwRound]           = useState(1);
  const [bwStepIdx, setBwStepIdx]       = useState(0);
  const [bwCountdown, setBwCountdown]   = useState(0);
  const [bwExpanded, setBwExpanded]     = useState(false);
  const [bwDoneToday, setBwDoneToday]   = useState(false);
  const bwTimer = useRef<NodeJS.Timeout | null>(null);

  const bwSession  = breathwork ? getPattern(breathwork.name) : null;
  const bwRounds   = breathwork?.rounds ?? 4;
  const bwSteps    = bwSession?.steps ?? [];
  const bwColor    = bwSession?.color ?? 'text-cyan-400';

  // ── Load state ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(workoutKey);
      if (saved) setDone(new Set(JSON.parse(saved)));
      setWalkDone(localStorage.getItem(`walk-${date}`) === '1');
      setCompleted(localStorage.getItem(`workout-completed-${date}`) === '1');
      setBwDoneToday(localStorage.getItem(`breathwork-${date}`) === '1');
    } catch {}
  }, [workoutKey, date]);

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem(workoutKey, JSON.stringify([...done])); } catch {}
    }
  }, [done, workoutKey, mounted]);

  // ── Workout handlers ───────────────────────────────────────────────────
  const toggle = useCallback((i: number) => {
    setDone(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }, []);

  const reset = useCallback(() => {
    setDone(new Set());
    try { localStorage.removeItem(workoutKey); } catch {}
  }, [workoutKey]);

  const handleWalkToggle = async () => {
    const v = !walkDone; setWalkDone(v);
    localStorage.setItem(`walk-${date}`, v ? '1' : '0');
    await fetch('/api/workout/advance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'walk' }) }).catch(() => {});
  };

  const handleComplete = async () => {
    setCompleted(true);
    localStorage.setItem(`workout-completed-${date}`, '1');
    await fetch('/api/workout/advance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'complete' }) }).catch(() => {});
  };

  const handleSkip = async () => {
    setSkipping(true);
    await fetch('/api/workout/advance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'skip' }) }).catch(() => {});
    setTimeout(() => setSkipping(false), 1500);
  };

  // ── Breathwork timer ───────────────────────────────────────────────────
  const clearBwTimer = useCallback(() => {
    if (bwTimer.current) { clearInterval(bwTimer.current); bwTimer.current = null; }
  }, []);

  const startBw = useCallback(() => {
    if (!bwSteps.length) return;
    setBwExpanded(true); setBwState('running'); setBwRound(1); setBwStepIdx(0); setBwCountdown(bwSteps[0].duration);
  }, [bwSteps]);

  const stopBw = useCallback(() => {
    clearBwTimer(); setBwState('idle'); setBwRound(1); setBwStepIdx(0); setBwCountdown(0);
  }, [clearBwTimer]);

  const restartBw = useCallback(() => {
    clearBwTimer();
    setBwDoneToday(false);
    localStorage.removeItem(`breathwork-${date}`);
    setBwState('idle');
    setBwRound(1);
    setBwStepIdx(0);
    setBwCountdown(0);
  }, [clearBwTimer, date]);

  const completeBw = useCallback(async () => {
    setBwState('done'); setBwDoneToday(true);
    localStorage.setItem(`breathwork-${date}`, '1');
    await fetch('/api/workout/advance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'breathwork' }) }).catch(() => {});
  }, [date]);

  useEffect(() => {
    if (bwState !== 'running' || !bwSteps.length) return;
    bwTimer.current = setInterval(() => {
      setBwCountdown(prev => {
        if (prev <= 1) {
          const nextIdx = bwStepIdx + 1;
          if (nextIdx >= bwSteps.length) {
            const nextRound = bwRound + 1;
            if (nextRound > bwRounds) { clearBwTimer(); completeBw(); return 0; }
            setBwRound(nextRound); setBwStepIdx(0); return bwSteps[0].duration;
          }
          setBwStepIdx(nextIdx); return bwSteps[nextIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearBwTimer();
  }, [bwState, bwStepIdx, bwRound, bwRounds, bwSteps, clearBwTimer, completeBw]);

  // ── Derived workout values ────────────────────────────────────────────
  const exercises  = workout?.exercises ?? [];
  const total      = exercises.length;
  const doneCount  = done.size;
  const pct        = total > 0 ? (doneCount / total) * 100 : 0;
  const allDone    = total > 0 && doneCount === total;
  const isRestDay  = workout?.is_rest_day || workout?.cycle_type === 'rest' || workout?.cycle_type === 'active_rest';

  const accentCls = workout?.cycle_type === 'push' ? 'text-violet-400' :
                    workout?.cycle_type === 'pull' ? 'text-cyan-400' :
                    workout?.cycle_type === 'legs' ? 'text-emerald-400' : 'text-slate-400';
  const progressCls = workout?.cycle_type === 'push' ? 'bg-violet-500' :
                      workout?.cycle_type === 'pull' ? 'bg-cyan-500' :
                      workout?.cycle_type === 'legs' ? 'bg-emerald-500' : 'bg-slate-500';

  const currentBwStep = bwSteps[bwStepIdx];

  return (
    <div className={`nyx-card overflow-hidden ${allDone || completed ? 'border-emerald-500/20' : ''}`}>

      {/* ═══════════════════════════════════════════════════════════════════
          BREATHWORK SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.05]">

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wind size={13} className={bwColor} />
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Breathwork</span>
            {breathwork && (
              <span className={`text-[11px] font-semibold ${bwColor}`}>{breathwork.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {bwDoneToday && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> done
              </span>
            )}
            {breathwork && !bwDoneToday && bwState === 'idle' && (
              <button
                onClick={() => { setBwExpanded(e => !e); }}
                className={`text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded ${bwExpanded ? 'text-slate-500' : `${bwColor} hover:opacity-80`}`}
                aria-label={bwExpanded ? 'Collapse breathwork details' : 'Expand breathwork details'}
              >
                {bwExpanded ? 'collapse' : 'expand →'}
              </button>
            )}
          </div>
        </div>

        {/* Session info pills */}
        {breathwork && !bwDoneToday && bwState === 'idle' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded-full border border-white/[0.05] bg-white/[0.02]">
              {breathwork.rounds} rounds
            </span>
            <span className="text-[10px] text-slate-600 px-2 py-0.5 rounded-full border border-white/[0.05] bg-white/[0.02]">
              {breathwork.steps}
            </span>
            {!bwExpanded && (
              <button
                onClick={startBw}
                className={`ml-auto flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full
                            border transition-all duration-200 ${bwColor}
                            border-current/20 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50`}
                aria-label="Begin breathwork session"
              >
                <Play size={10} fill="currentColor" /> Begin
              </button>
            )}
          </div>
        )}

        {/* Expanded: step list + start */}
        {bwExpanded && bwState === 'idle' && !bwDoneToday && bwSteps.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {bwSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-sm">{step.emoji}</span>
                <span className="text-[12px] text-slate-400 flex-1">{step.label}</span>
                <span className={`text-[11px] font-mono ${bwColor}`}>{step.duration}s</span>
              </div>
            ))}
            <button
              onClick={startBw}
              className={`w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-lg
                         border text-[12px] font-semibold transition-all duration-200 ${bwColor}
                         bg-current/5 border-current/20 hover:bg-current/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50`}
              aria-label="Start breathwork session"
            >
              <Play size={12} fill="currentColor" /> Start Session
            </button>
          </div>
        )}

        {/* Running: compact inline timer */}
        {bwState === 'running' && currentBwStep && (
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xl">{currentBwStep.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${bwColor}`}>{currentBwStep.label}</p>
                <p className="text-[10px] text-slate-600">Round {bwRound}/{bwRounds}</p>
              </div>
            </div>
            <span className={`text-3xl font-mono font-bold tabular-nums ${bwColor}`}>{bwCountdown}</span>
            <button
              onClick={stopBw}
              className="text-slate-700 hover:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
              aria-label="Stop breathwork timer"
              title="Stop"
            >
              <Square size={14} />
            </button>
          </div>
        )}

        {/* Done state */}
        {(bwState === 'done' || bwDoneToday) && bwState !== 'running' && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base">🧘</span>
            <p className="text-[12px] text-emerald-400 font-semibold">Breathwork complete</p>
            <button
              onClick={restartBw}
              className="ml-auto text-[10px] text-slate-700 hover:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
              aria-label="Restart breathwork session"
            >
              again
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WORKOUT SECTION
      ═══════════════════════════════════════════════════════════════════ */}

      {/* Workout header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Workout</span>
            {workout && <span className={`text-[11px] font-bold ${accentCls}`}>{workout.name}</span>}
          </div>
          {workout?.cycle_label && (
            <p className="text-[9px] text-slate-700 mt-0.5">{workout.cycle_label}</p>
          )}
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {workoutStreak > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono" title={`${workoutStreak}-day streak`}>
              <Flame size={11} className="text-orange-400" /><span className="text-orange-400">{workoutStreak}</span>
            </span>
          )}
          {!isRestDay && total > 0 && (
            <span className="text-[10px] font-mono text-slate-600">{doneCount}/{total}</span>
          )}
          {doneCount > 0 && (
            <button
              onClick={reset}
              className="text-slate-700 hover:text-slate-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
              aria-label="Reset workout progress"
              title="Reset progress"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Missed day banner */}
      {(workout?.missed_days ?? 0) > 0 && !isRestDay && (
        <div className="flex items-center gap-3 px-5 py-2 bg-amber-500/[0.06] border-b border-amber-500/15">
          <AlertTriangle size={12} className="text-amber-400 shrink-0" />
          <p className="text-[11px] text-amber-300/70 flex-1">
            {workout!.missed_days} day{workout!.missed_days! > 1 ? 's' : ''} missed — complete today or skip.
          </p>
          <button
            onClick={handleSkip}
            className="text-[10px] text-amber-500/60 hover:text-amber-400 font-medium shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
            aria-label="Skip today's workout"
          >
            {skipping ? '✓ Skipped' : 'Skip'}
          </button>
        </div>
      )}

      {/* Rest day */}
      {isRestDay ? (
        <div className="px-5 py-4 text-center">
          <p className="text-xl mb-1">😌</p>
          <p className="text-sm font-semibold text-slate-400">{workout?.name ?? 'Rest Day'}</p>
          {workout?.next_label && (
            <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-slate-700">
              Next: <span className="text-slate-600">{workout.next_label}</span><ChevronRight size={10} />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Progress bar */}
          {total > 0 && (
            <div className="h-0.5 bg-white/[0.04]">
              <div className={`h-full transition-all duration-500 ${allDone || completed ? 'bg-emerald-500' : progressCls}`}
                   style={{ width: `${pct}%` }} />
            </div>
          )}

          {/* Exercise list */}
          <div className="divide-y divide-white/[0.04]">
            {exercises.map((ex, i) => {
              const isDone = done.has(i);
              const info   = exerciseInfo(ex.name);
              return (
                <div key={i} role="button" tabIndex={0}
                  onClick={() => toggle(i)}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') toggle(i); }}
                  aria-label={isDone ? `Mark ${ex.name} incomplete` : `Mark ${ex.name} complete`}
                  className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 ${
                    isDone ? 'opacity-40' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-emerald-500/50'
                  }`}>
                    {isDone && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`flex-1 text-[13px] transition-all ${isDone ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                    {ex.name}
                  </span>
                  {info && !isDone && (
                    <InfoTooltip side="top" content={
                      <><p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Muscles</p>
                      <p className="text-slate-400">{info.muscles}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-2 mb-1">Form Tip</p>
                      <p className="text-slate-300">{info.tip}</p></>
                    } />
                  )}
                  <span className={`shrink-0 text-[11px] font-mono flex items-center gap-1 ${isDone ? 'text-slate-700' : accentCls}`}>
                    {ex.note && <span className="text-slate-700 text-[10px]">{ex.note} ·</span>}
                    {ex.reps}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Complete / done footer */}
          {(allDone || completed) ? (
            <div className="px-5 py-3 border-t border-emerald-500/15 bg-emerald-500/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> Done 🎉
                </span>
                {workout?.next_label && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-600">
                    Next: <span className="text-slate-500">{workout.next_label}</span><ChevronRight size={9} />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="px-5 py-2.5 border-t border-white/[0.04]">
              <button
                onClick={handleComplete}
                disabled={doneCount === 0}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium
                           border border-white/[0.06] text-slate-600
                           hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400
                           disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50"
                aria-label="Mark workout complete and advance routine"
              >
                <Timer size={12} /> Mark complete + advance routine
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WALK TOGGLE
      ═══════════════════════════════════════════════════════════════════ */}
      {mounted && (
        <div className={`flex items-center gap-3 px-5 py-2.5 border-t ${walkDone ? 'border-cyan-500/15 bg-cyan-500/[0.03]' : 'border-white/[0.04]'}`}>
          <button
            onClick={handleWalkToggle}
            className={`flex items-center gap-2 text-[11px] font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded ${walkDone ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
            aria-label={walkDone ? 'Unmark walk as done' : 'Mark walk as done'}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${walkDone ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700'}`}>
              {walkDone && <Check size={10} className="text-white" />}
            </div>
            <Footprints size={12} />
            Walk today
          </button>
          {walkDone && <span className="text-[10px] text-cyan-500/40 ml-auto">✓ logged</span>}
        </div>
      )}
    </div>
  );
}
