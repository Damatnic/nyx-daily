'use client';

import { useState } from 'react';
import WeatherCard, { WeatherDay } from '@/components/briefing/WeatherCard';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import DailyExtras from '@/components/briefing/DailyExtras';
import OnThisDay from '@/components/briefing/OnThisDay';
import NasaApod from '@/components/briefing/NasaApod';
import type { SchoolDeadline, WordOfDay, DailyFact, OnThisDayEvent, NasaApod as NasaApodType } from '@/lib/types';

interface SidebarTabsProps {
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

type TabKey = 'today' | 'school' | 'discover';

interface TabConfig {
  key: TabKey;
  label: string;
  emoji: string;
}

const TABS: TabConfig[] = [
  { key: 'today', label: 'Today', emoji: '🌤️' },
  { key: 'school', label: 'School', emoji: '📚' },
  { key: 'discover', label: 'Discover', emoji: '🌍' },
];

export default function SidebarTabs({
  weather,
  forecast,
  word,
  facts,
  deadlines,
  events,
  gmailSummary,
  onThisDay,
  apod,
}: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('today');

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex items-center rounded-xl border border-white/[0.06] bg-[#0d0d1a] overflow-hidden">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'text-slate-100 border-b-2 border-purple-500 bg-white/[0.04]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {/* Today tab: Weather + Calendar */}
        {activeTab === 'today' && (
          <div className="flex flex-col gap-4">
            {weather && (
              <WeatherCard weather={weather} forecast={forecast} />
            )}
            <CalendarCard events={events} gmailSummary={gmailSummary} />
          </div>
        )}

        {/* School tab: Deadlines */}
        {activeTab === 'school' && (
          <SchoolDeadlines deadlines={deadlines} />
        )}

        {/* Discover tab: Extras, OnThisDay, APOD */}
        {activeTab === 'discover' && (
          <div className="flex flex-col gap-4">
            <DailyExtras word={word} facts={facts} />
            {onThisDay && onThisDay.length > 0 && (
              <OnThisDay events={onThisDay} />
            )}
            {apod && (
              <NasaApod apod={apod} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

