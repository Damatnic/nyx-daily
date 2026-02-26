'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BreathworkSession } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { Wind, Play, Square } from 'lucide-react';

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
      <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
        <SectionHeader title="Breathwork" />
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
    <div className={`rounded-xl border bg-[#0d0d1a] p-5 transition-all duration-500 ${state === 'done' ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/[0.06]'}`}>
      <SectionHeader title="Breathwork" />

      {/* Session name */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg border transition-colors ${state === 'running' ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
          <Wind size={14} className="text-[#06b6d4]" />
        </div>
        <span className="text-sm font-semibold text-slate-200">{session.name}</span>
        <Badge variant="cyan" className="ml-auto">{session.rounds} rounds</Badge>
      </div>

      {/* Idle state: show steps list */}
      {state === 'idle' && (
        <>
          <div className="flex flex-col gap-2 mb-4">
            {session.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <span className="text-lg">{step.emoji}</span>
                <span className="text-sm text-slate-300 flex-1">{step.action}</span>
                <span className="text-xs font-mono text-cyan-400">{step.duration}s</span>
              </div>
            ))}
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
            <span className="inline-block animate-bounce">
              <span role="img" aria-label="meditation">

              </span>
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

      <style jsx>{`
        @keyframes breathe-in {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes breathe-out {
          0%, 100% { transform: scale(1.15); }
          50% { transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-breathe-in {
          animation: breathe-in 4s ease-in-out infinite;
        }
        .animate-breathe-out {
          animation: breathe-out 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
