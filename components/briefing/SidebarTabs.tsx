'use client';

import { useState } from 'react';
import { Sun, GraduationCap, Globe } from 'lucide-react';
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
  icon: typeof Sun;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}

const TABS: TabConfig[] = [
  {
    key: 'today',
    label: 'Today',
    icon: Sun,
    activeColor: 'text-cyan-400',
    activeBg: 'bg-cyan-500/10',
    activeBorder: 'border-b-cyan-500',
  },
  {
    key: 'school',
    label: 'School',
    icon: GraduationCap,
    activeColor: 'text-violet-400',
    activeBg: 'bg-violet-500/10',
    activeBorder: 'border-b-violet-500',
  },
  {
    key: 'discover',
    label: 'Discover',
    icon: Globe,
    activeColor: 'text-emerald-400',
    activeBg: 'bg-emerald-500/10',
    activeBorder: 'border-b-emerald-500',
  },
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
  const active = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Tab bar */}
      <div className="flex items-stretch rounded-xl border border-white/[0.06] bg-[#0a0a18] overflow-hidden">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all duration-150 border-b-2 ${
                isActive
                  ? `${tab.activeColor} ${tab.activeBg} ${tab.activeBorder}`
                  : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02] border-b-transparent'
              }`}
            >
              <Icon size={13} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content — keyed to force remount on tab change */}
      <div key={activeTab} className="animate-fade-up">
        {activeTab === 'today' && (
          <div className="flex flex-col gap-3">
            {weather && <WeatherCard weather={weather} forecast={forecast} />}
            <CalendarCard events={events} gmailSummary={gmailSummary} />
          </div>
        )}

        {activeTab === 'school' && (
          <SchoolDeadlines deadlines={deadlines} />
        )}

        {activeTab === 'discover' && (
          <div className="flex flex-col gap-3">
            <DailyExtras word={word} facts={facts} />
            {onThisDay && onThisDay.length > 0 && <OnThisDay events={onThisDay} />}
            {apod && <NasaApod apod={apod} />}
          </div>
        )}
      </div>
    </div>
  );
}
