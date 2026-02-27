'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TLDRBrief, WordOfDay, DailyFact, OnThisDayEvent, NasaApod as NasaApodType } from '@/lib/types';
import TLDRCard from './TLDRCard';
import DailyExtras from './DailyExtras';
import OnThisDay from './OnThisDay';
import NasaApod from './NasaApod';

interface CarouselProps {
  tldr?: TLDRBrief | null;
  word?: WordOfDay | null;
  facts?: DailyFact[] | null;
  onThisDay?: OnThisDayEvent[] | null;
  apod?: NasaApodType | null;
}

interface Panel {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

const SWIPE_THRESHOLD = 50;
const DRAG_START_THRESHOLD = 8; // px before we consider it a drag

export default function BriefingCarousel({ tldr, word, facts, onThisDay, apod }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const horizConfirmed = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Build panel list — only include panels with real data
  const panels: Panel[] = [];

  if (tldr?.summary) {
    panels.push({ id: 'tldr', label: 'AI Brief', icon: '🤖', content: <TLDRCard tldr={tldr} /> });
  }
  if (word || facts?.length) {
    panels.push({
      id: 'extras', label: 'Daily Extras', icon: '💡',
      content: <div className="px-5 py-4"><DailyExtras word={word} facts={facts} /></div>,
    });
  }
  if (onThisDay?.length) {
    panels.push({
      id: 'onthisday', label: 'On This Day', icon: '📅',
      content: <div className="px-5 py-4"><OnThisDay events={onThisDay} /></div>,
    });
  }
  if (apod) {
    panels.push({ id: 'nasa', label: 'NASA', icon: '🔭', content: <NasaApod apod={apod} /> });
  }

  const count = panels.length;
  const safe  = Math.min(current, Math.max(0, count - 1));

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(count - 1, c + 1)), [count]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prev, next]);

  // ── Pointer drag — threshold-based, no setPointerCapture ──────────────────
  // We don't use setPointerCapture because it prevents child button clicks.
  // Instead: wait for 8px horizontal movement before entering drag mode.
  // hasDragged ref blocks the click event via onClickCapture if we did drag.

  const onPointerDown = (e: React.PointerEvent) => {
    // Only primary button / single touch
    if (e.button !== undefined && e.button !== 0) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    isDragging.current = false;
    hasDragged.current = false;
    horizConfirmed.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (!horizConfirmed.current) {
      // Need threshold movement before engaging
      if (Math.abs(dx) < DRAG_START_THRESHOLD && Math.abs(dy) < DRAG_START_THRESHOLD) return;
      // If mostly vertical, bail out — let the browser scroll
      if (Math.abs(dy) > Math.abs(dx)) return;
      horizConfirmed.current = true;
    }

    isDragging.current = true;
    hasDragged.current = true;

    // Edge resistance
    const atStart = safe === 0 && dx > 0;
    const atEnd   = safe === count - 1 && dx < 0;
    setDragOffset(atStart || atEnd ? dx * 0.25 : dx);
  };

  const onPointerUp = () => {
    if (hasDragged.current) {
      if (dragOffset < -SWIPE_THRESHOLD) next();
      else if (dragOffset > SWIPE_THRESHOLD) prev();
    }
    isDragging.current = false;
    setDragOffset(0);
    // Reset hasDragged on next tick so our clickCapture handler fires first
    setTimeout(() => { hasDragged.current = false; }, 0);
  };

  // Block click events that result from a drag (so nav dots/arrows don't fire)
  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) e.stopPropagation();
  };

  if (count === 0) return null;

  const pct  = trackRef.current ? dragOffset / trackRef.current.offsetWidth * 100 : 0;
  const tx   = -(safe * 100) + pct;

  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-500/10 bg-gradient-to-br from-violet-950/20 via-[#06060e] to-[#06060e]">
      {/* Ambient glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      {/* Label bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-400/70">
            {panels[safe]?.icon}&nbsp;&nbsp;{panels[safe]?.label}
          </span>
        </div>
        <span className="text-[9px] text-slate-700 font-mono">{safe + 1}/{count}</span>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className={`overflow-hidden ${count > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onPointerDown={count > 1 ? onPointerDown : undefined}
        onPointerMove={count > 1 ? onPointerMove : undefined}
        onPointerUp={count > 1 ? onPointerUp : undefined}
        onPointerCancel={count > 1 ? onPointerUp : undefined}
        onClickCapture={count > 1 ? onClickCapture : undefined}
      >
        <div
          className={`flex ${isDragging.current ? '' : 'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'}`}
          style={{ transform: `translateX(${tx}%)` }}
        >
          {panels.map(panel => (
            <div key={panel.id} className="w-full shrink-0 min-w-0 pt-3 pb-2">
              {panel.content}
            </div>
          ))}
        </div>
      </div>

      {/* Nav bar — only shown if more than 1 panel */}
      {count > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-violet-500/[0.07]">
          <button
            onClick={prev}
            disabled={safe === 0}
            className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">{panels[safe - 1]?.label}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {panels.map((panel, i) => (
              <button
                key={panel.id}
                onClick={() => setCurrent(i)}
                title={panel.label}
                className={`rounded-full transition-all duration-200 ${
                  i === safe ? 'w-4 h-1.5 bg-violet-400' : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={safe === count - 1}
            className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <span className="hidden sm:inline">{panels[safe + 1]?.label}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
