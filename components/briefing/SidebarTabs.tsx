'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import WeatherCard, { WeatherDay } from '@/components/briefing/WeatherCard';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import DailyExtras from '@/components/briefing/DailyExtras';
import OnThisDay from '@/components/briefing/OnThisDay';
import NasaApod from '@/components/briefing/NasaApod';
import type { SchoolDeadline, WordOfDay, DailyFact, OnThisDayEvent, NasaApod as NasaApodType } from '@/lib/types';

interface SidebarProps {
  weather?: string | null;
  forecast?: WeatherDay[] | null;
  word?: WordOfDay | null;
  facts?: DailyFact[] | null;
  deadlines?: SchoolDeadline[] | null;
  events?: string[] | null;
  gmailSummary?: string | null;
  onThisDay?: OnThisDayEvent[] | null;
  apod?: NasaApodType | null;
}

function Collapsible({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="nyx-card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600">{label}</span>
        <ChevronDown
          size={12}
          className={`text-slate-700 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-white/[0.05]">{children}</div>}
    </div>
  );
}

export default function SidebarTabs({
  weather, forecast, word, facts, deadlines, events, gmailSummary, onThisDay, apod,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Weather — always visible */}
      {weather && <WeatherCard weather={weather} forecast={forecast} />}

      {/* School deadlines — always visible, high value */}
      <SchoolDeadlines deadlines={deadlines} />

      {/* Calendar / Gmail — only if data */}
      <CalendarCard events={events} gmailSummary={gmailSummary} />

      {/* Word of day + facts — collapsed by default (nice to have, not essential) */}
      {(word || facts?.length) && (
        <Collapsible label="Daily Extras">
          <div className="p-4">
            <DailyExtras word={word} facts={facts} />
          </div>
        </Collapsible>
      )}

      {/* On this day — collapsed by default */}
      {onThisDay && onThisDay.length > 0 && (
        <Collapsible label="On This Day">
          <div className="p-4">
            <OnThisDay events={onThisDay} />
          </div>
        </Collapsible>
      )}

      {/* NASA APOD — collapsed by default (image-heavy, nice to have) */}
      {apod && (
        <Collapsible label="NASA · Photo of the Day">
          <NasaApod apod={apod} />
        </Collapsible>
      )}
    </div>
  );
}
