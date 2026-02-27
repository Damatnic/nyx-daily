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

const SWIPE_THRESHOLD = 50; // px

export default function BriefingCarousel({ tldr, word, facts, onThisDay, apod }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Build panel list — only include panels with real data
  const panels: Panel[] = [];

  if (tldr?.summary) {
    panels.push({
      id: 'tldr',
      label: 'AI Brief',
      icon: '🤖',
      content: <TLDRCard tldr={tldr} />,
    });
  }

  if (word || facts?.length) {
    panels.push({
      id: 'extras',
      label: 'Daily Extras',
      icon: '💡',
      content: (
        <div className="px-5 py-4">
          <DailyExtras word={word} facts={facts} />
        </div>
      ),
    });
  }

  if (onThisDay?.length) {
    panels.push({
      id: 'onthisday',
      label: 'On This Day',
      icon: '📅',
      content: (
        <div className="px-5 py-4">
          <OnThisDay events={onThisDay} />
        </div>
      ),
    });
  }

  if (apod) {
    panels.push({
      id: 'nasa',
      label: 'NASA',
      icon: '🔭',
      content: <NasaApod apod={apod} />,
    });
  }

  const count = panels.length;
  const safeCurrent = Math.min(current, count - 1);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(count - 1, c + 1)), [count]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  // Touch / pointer swipe
  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    setDragging(true);
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - startXRef.current;
    // Resist edges
    if ((safeCurrent === 0 && delta > 0) || (safeCurrent === count - 1 && delta < 0)) {
      setDragOffset(delta * 0.25);
    } else {
      setDragOffset(delta);
    }
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragOffset < -SWIPE_THRESHOLD) next();
    else if (dragOffset > SWIPE_THRESHOLD) prev();
    setDragOffset(0);
  };

  if (count === 0) return null;

  const translateX = -(safeCurrent * 100) + (count > 0 && trackRef.current ? (dragOffset / trackRef.current.offsetWidth) * 100 : 0);

  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-500/10 bg-gradient-to-br from-violet-950/20 via-[#06060e] to-[#06060e] select-none">
      {/* Ambient glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      {/* Panel label bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-400/70">
            {panels[safeCurrent]?.icon} {panels[safeCurrent]?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-slate-700 font-mono">{safeCurrent + 1}/{count}</span>
          <span className="text-[9px] text-slate-800 font-mono ml-1">AI · gpt-4o-mini</span>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={`flex ${dragging ? '' : 'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'}`}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {panels.map(panel => (
            <div key={panel.id} className="w-full shrink-0 min-w-0 pt-3 pb-2">
              {panel.content}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-violet-500/[0.07]">
        {/* Prev button */}
        <button
          onClick={prev}
          disabled={safeCurrent === 0}
          className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">{panels[safeCurrent - 1]?.label}</span>
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {panels.map((panel, i) => (
            <button
              key={panel.id}
              onClick={() => setCurrent(i)}
              title={panel.label}
              className={`rounded-full transition-all duration-200 ${
                i === safeCurrent
                  ? 'w-4 h-1.5 bg-violet-400'
                  : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          disabled={safeCurrent === count - 1}
          className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <span className="hidden sm:inline">{panels[safeCurrent + 1]?.label}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
