'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BreathworkSession } from '@/lib/types';

import Badge from '@/components/ui/Badge';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Wind, Play, Square } from 'lucide-react';

const STEP_INFO: Record<string, string> = {
  'inhale':     'Breathe in slowly through your nose. Expand your belly first, then your chest. This activates the diaphragm and draws the most oxygen.',
  'hold':       'Hold without tension. Relax your shoulders and jaw. Holding after inhale increases CO₂ tolerance; holding after exhale activates the calming response.',
  'exhale':     'Breathe out slowly through your mouth or nose. A longer exhale than inhale directly activates the parasympathetic nervous system — your "rest and digest" mode.',
  'hold out':   'Empty lungs, held. This activates the vagus nerve and triggers a strong parasympathetic (calming) response. Don\'t strain.',
};

const SESSION_BENEFITS: Record<string, string> = {
  'Box Breathing':          'Used by Navy SEALs to regulate stress. Equal ratios create nervous system balance — sharpens focus and calms anxiety simultaneously.',
  '4-7-8 Breathing':       'Dr. Andrew Weil\'s technique. The extended exhale ratio is one of the fastest ways to lower heart rate and cortisol. Ideal before sleep or stressful situations.',
  'Diaphragmatic':          'Belly breathing rewires shallow chest breathing patterns. Increases oxygen efficiency, reduces tension, and lowers blood pressure over time.',
  'Physiological Sigh':    'The fastest known way to reduce acute stress — it\'s what your body does automatically when overwhelmed. Double inhale fully inflates lung sacs, the long exhale dumps CO₂.',
  'Alternate Nostril':      'From yoga (Nadi Shodhana). Balances the left and right hemispheres of the brain. Shown to reduce blood pressure and improve focus.',
  'Power Breathing':        'Based on Wim Hof Method. 30 rapid breaths create temporary alkalinity and a natural adrenaline boost — improves cold tolerance and mental resilience.',
  'Body Scan':              'Combines slow breathing with progressive relaxation. Activates the parasympathetic system and reduces cortisol — best before sleep or after intense work.',
};

function getStepExplanation(action: string): string {
  const key = action.toLowerCase();
  if (key.includes('hold out') || key.includes('hold empty')) return STEP_INFO['hold out'];
  if (key.includes('hold'))    return STEP_INFO['hold'];
  if (key.includes('inhale') || key.includes('sniff')) return STEP_INFO['inhale'];
  if (key.includes('exhale'))  return STEP_INFO['exhale'];
  return '';
}

interface BreathworkCardProps {
  session?: BreathworkSession | null;
  fallbackText?: string;
}

type SessionState = 'idle' | 'running' | 'done';

export default function BreathworkCard({ session, fallbackText }: BreathworkCardProps) {
  const [state, setState] = useState<SessionState>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSession = useCallback(() => {
    if (!session || session.steps.length === 0) return;

    setState('running');
    setCurrentRound(1);
    setCurrentStepIndex(0);
    setCountdown(session.steps[0].duration);
  }, [session]);

  const stopSession = useCallback(() => {
    clearTimer();
    setState('idle');
    setCurrentRound(1);
    setCurrentStepIndex(0);
    setCountdown(0);
  }, [clearTimer]);

  // Timer logic
  useEffect(() => {
    if (state !== 'running' || !session) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next step
          const nextStepIndex = currentStepIndex + 1;

          if (nextStepIndex >= session.steps.length) {
            // End of round
            const nextRound = currentRound + 1;

            if (nextRound > session.rounds) {
              // All rounds complete
              clearTimer();
              setState('done');
              return 0;
            }

            // Start next round
            setCurrentRound(nextRound);
            setCurrentStepIndex(0);
            return session.steps[0].duration;
          }

          // Move to next step in current round
          setCurrentStepIndex(nextStepIndex);
          return session.steps[nextStepIndex].duration;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [state, session, currentStepIndex, currentRound, clearTimer]);

  // No session data, show fallback
  if (!session) {
    if (!fallbackText) return null;

    return (
      <div className="nyx-card p-5">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600 mb-4">Breathwork</p>
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Wind size={13} className="text-[#06b6d4]" />
            <span className="text-xs font-semibold text-[#06b6d4] uppercase tracking-widest">Breathing</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{fallbackText}</p>
        </div>
      </div>
    );
  }

  const currentStep = session.steps[currentStepIndex];

  // Get animation class based on current action
  const getCircleAnimation = () => {
    if (state !== 'running') return '';
    const action = currentStep?.action?.toLowerCase() || '';
    if (action.includes('inhale')) return 'animate-breathe-in';
    if (action.includes('exhale')) return 'animate-breathe-out';
    return 'animate-pulse-slow';
  };

  return (
    <div className={`nyx-card p-5 transition-all duration-500 ${state === 'done' ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/[0.06]'}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600 mb-4">Breathwork</p>

      {/* Session name */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg border transition-colors ${state === 'running' ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
          <Wind size={14} className="text-[#06b6d4]" />
        </div>
        <span className="text-sm font-semibold text-slate-200">{session.name}</span>
        {SESSION_BENEFITS[session.name] && (
          <InfoTooltip
            side="bottom"
            content={
              <>
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400/60 mb-1.5">Why this works</p>
                <p className="text-slate-300">{SESSION_BENEFITS[session.name]}</p>
              </>
            }
          />
        )}
        <Badge variant="cyan" className="ml-auto">{session.rounds} rounds</Badge>
      </div>

      {/* Idle state: show steps list */}
      {state === 'idle' && (
        <>
          <div className="flex flex-col gap-2 mb-4">
            {session.steps.map((step, i) => {
              const stepExpl = getStepExplanation(step.action);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <span className="text-lg">{step.emoji}</span>
                  <span className="text-sm text-slate-300 flex-1">{step.action}</span>
                  {stepExpl && (
                    <InfoTooltip
                      side="top"
                      content={<p className="text-slate-300">{stepExpl}</p>}
                    />
                  )}
                  <span className="text-xs font-mono text-cyan-400">{step.duration}s</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={startSession}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 transition-all duration-200"
          >
            <Play size={16} />
            Start Session
          </button>
        </>
      )}

      {/* Running state: animated circle with countdown */}
      {state === 'running' && currentStep && (
        <div className="flex flex-col items-center py-6">
          {/* Breathing circle */}
          <div
            className={`relative w-36 h-36 rounded-full flex items-center justify-center ${getCircleAnimation()}`}
            style={{
              background: `radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.05) 70%, transparent 100%)`,
              boxShadow: '0 0 40px rgba(6,182,212,0.15)',
            }}
          >
            <div className="text-center">
              <p className="text-2xl mb-1">{currentStep.emoji}</p>
              <p className="text-lg font-semibold text-cyan-400">{currentStep.action}</p>
              <p className="text-3xl font-mono font-bold text-white mt-1">{countdown}</p>
            </div>
          </div>

          {/* Round indicator */}
          <p className="text-sm text-slate-400 mt-4">
            Round {currentRound}/{session.rounds}
          </p>

          {/* Stop button */}
          <button
            onClick={stopSession}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm hover:bg-slate-700/50 hover:text-slate-300 transition-all duration-200"
          >
            <Square size={14} />
            Stop
          </button>
        </div>
      )}

      {/* Done state: celebration */}
      {state === 'done' && (
        <div className="flex flex-col items-center py-8">
          <div className="text-5xl mb-4">
            <span className="inline-block animate-bounce" role="img" aria-label="meditation">
              🧘
            </span>
          </div>
          <p className="text-lg font-semibold text-emerald-400 mb-2">Session Complete!</p>
          <p className="text-sm text-slate-400 mb-4">Great job on your breathing practice</p>
          <button
            onClick={stopSession}
            className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all duration-200"
          >
            Start Again
          </button>
        </div>
      )}
    </div>
  );
}
