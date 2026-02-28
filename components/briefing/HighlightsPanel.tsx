'use client';

import type { DailyBriefing, SchoolDeadline } from '@/lib/types';
import { parseWeather } from '@/lib/weather';
import { useWorkoutStreak } from '@/lib/useWorkoutStreak';
import { useState, useEffect } from 'react';
import { Flame, Footprints, BookOpen, Lightbulb, DollarSign, AlertTriangle, ChevronRight } from 'lucide-react';

interface Props {
  briefing: DailyBriefing;
  streak: number;
}

function WalkStreak() {
  const [walkStreak, setWalkStreak] = useState(0);
  useEffect(() => {
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      try {
        const v = localStorage.getItem(`walk-${dateStr}`);
        if (v === '1') { s++; }
        else if (i > 0) { break; }
      } catch { break; }
    }
    setWalkStreak(s);
  }, []);
  return walkStreak > 0 ? (
    <span className="flex items-center gap-1">
      <Footprints size={11} className="text-cyan-400" />
      <span className="text-cyan-400 font-bold">{walkStreak}</span>
      <span className="text-slate-700">walk</span>
    </span>
  ) : null;
}

export default function HighlightsPanel({ briefing, streak }: Props) {
  const workoutStreak = useWorkoutStreak();
  const wx = briefing.weather ? parseWeather(briefing.weather) : null;

  const urgent = (briefing.school_deadlines ?? [])
    .filter(d => !d.done && d.days >= 0 && d.days <= 2)
    .sort((a, b) => a.days - b.days);

  const word = briefing.word_of_the_day;
  const health = briefing.health_tip;
  const hack = briefing.life_hack;
  const money = briefing.money_tip;

  return (
    <div className="nyx-card overflow-hidden flex flex-col h-full">
      <div className="px-5 py-3 border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Today</span>
      </div>

      <div className="flex-1 divide-y divide-white/[0.04]">

        {/* ── Urgent deadlines ──────────────────────────────────────────── */}
        {urgent.length > 0 && urgent.map((dl, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 bg-red-500/[0.04]">
            <AlertTriangle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-red-300/90 leading-snug line-clamp-2">{dl.desc}</p>
              <p className="text-[10px] text-red-500/50 mt-0.5">{dl.course} · {dl.due_str}</p>
            </div>
            <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${
              dl.days === 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/15 text-amber-400'
            }`}>
              {dl.days === 0 ? 'TODAY' : dl.days === 1 ? 'TMRW' : `${dl.days}d`}
            </span>
          </div>
        ))}

        {urgent.length === 0 && (
          <div className="flex items-center gap-2.5 px-5 py-3">
            <span className="text-base">✅</span>
            <p className="text-[12px] text-slate-600">No deadlines in the next 2 days</p>
          </div>
        )}

        {/* ── Streaks ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-5 py-3 flex-wrap">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Flame size={12} className="text-orange-400" />
              <span className="text-orange-400 font-bold">{streak}</span>
              <span className="text-slate-700">briefing</span>
            </span>
          )}
          {workoutStreak > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <span className="text-sm">💪</span>
              <span className="text-violet-400 font-bold">{workoutStreak}</span>
              <span className="text-slate-700">workout</span>
            </span>
          )}
          <WalkStreak />
        </div>

        {/* ── Weather ───────────────────────────────────────────────────── */}
        {wx && (
          <a href="https://wttr.in/Waukesha,WI" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group">
            <span className="text-xl shrink-0">{wx.emoji}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors">
                {wx.temp}° <span className="font-normal text-slate-500">{wx.condition}</span>
              </p>
              {wx.high && wx.low && (
                <p className="text-[10px] text-slate-700">H:{wx.high} · L:{wx.low} · Waukesha</p>
              )}
            </div>
            <ChevronRight size={12} className="text-slate-700 ml-auto shrink-0" />
          </a>
        )}

        {/* ── Word of the Day ───────────────────────────────────────────── */}
        {word && (
          <div className="px-5 py-3">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={11} className="text-violet-400/70" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">Word</span>
            </div>
            <p className="text-[13px] font-bold text-violet-300">{word.word}</p>
            {word.type && (
              <p className="text-[10px] text-slate-700 italic">{word.type}</p>
            )}
            {word.definition && (
              <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{word.definition}</p>
            )}
          </div>
        )}

        {/* ── Health Tip ────────────────────────────────────────────────── */}
        {health && (
          <div className="flex items-start gap-3 px-5 py-3">
            <div className="shrink-0 mt-0.5">
              <Lightbulb size={12} className="text-rose-400/70" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-rose-500/40 mb-1">Health</p>
              <p className="text-[11.5px] text-slate-400 leading-snug">{health}</p>
            </div>
          </div>
        )}

        {/* ── Life Hack ─────────────────────────────────────────────────── */}
        {hack && (
          <div className="flex items-start gap-3 px-5 py-3">
            <div className="shrink-0 mt-0.5">
              <span className="text-[11px]">⚡</span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-500/40 mb-1">
                {hack.category}
              </p>
              <p className="text-[11.5px] text-slate-400 leading-snug">{hack.tip}</p>
            </div>
          </div>
        )}

        {/* ── Money Tip ─────────────────────────────────────────────────── */}
        {money && (
          <div className="flex items-start gap-3 px-5 py-3">
            <div className="shrink-0 mt-0.5">
              <DollarSign size={12} className="text-emerald-400/60" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-500/40 mb-1">
                {money.category}
              </p>
              <p className="text-[11.5px] text-slate-400 leading-snug">{money.tip}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
