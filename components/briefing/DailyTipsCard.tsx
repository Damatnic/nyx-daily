'use client';

import { useState } from 'react';
import { Lightbulb, DollarSign, Heart } from 'lucide-react';

interface TipData {
  category?: string;
  tip: string;
}

interface DailyTipsCardProps {
  lifeHack?: TipData | null;
  moneyTip?: TipData | null;
  healthTip?: string | null;
}

type TabKey = 'life' | 'money' | 'health';

interface TabConfig {
  key: TabKey;
  label: string;
  emoji: string;
  icon: typeof Lightbulb;
  iconColor: string;
  accentColor: string;
  glowColor: string;
}

const TABS: TabConfig[] = [
  {
    key: 'life',
    label: 'Life Hack',
    emoji: '💡',
    icon: Lightbulb,
    iconColor: 'text-[#8b5cf6]',
    accentColor: 'border-purple-500/40',
    glowColor: 'rgba(139,92,246,0.4)',
  },
  {
    key: 'money',
    label: 'Money',
    emoji: '💰',
    icon: DollarSign,
    iconColor: 'text-[#f59e0b]',
    accentColor: 'border-amber-500/40',
    glowColor: 'rgba(245,158,11,0.4)',
  },
  {
    key: 'health',
    label: 'Health',
    emoji: '❤️',
    icon: Heart,
    iconColor: 'text-[#10b981]',
    accentColor: 'border-emerald-500/40',
    glowColor: 'rgba(16,185,129,0.4)',
  },
];

export default function DailyTipsCard({ lifeHack, moneyTip, healthTip }: DailyTipsCardProps) {
  // Determine which tabs have content
  const availableTabs = TABS.filter((tab) => {
    if (tab.key === 'life') return !!lifeHack?.tip;
    if (tab.key === 'money') return !!moneyTip?.tip;
    if (tab.key === 'health') return !!healthTip;
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabKey>(availableTabs[0]?.key ?? 'life');

  // If nothing has content, don't render
  if (availableTabs.length === 0) return null;

  // Get the active tab config and content
  const activeConfig = availableTabs.find((t) => t.key === activeTab) ?? availableTabs[0];
  const Icon = activeConfig.icon;

  let tipContent: string | null = null;
  let category: string | undefined;

  if (activeConfig.key === 'life' && lifeHack) {
    tipContent = lifeHack.tip;
    category = lifeHack.category;
  } else if (activeConfig.key === 'money' && moneyTip) {
    tipContent = moneyTip.tip;
    category = moneyTip.category;
  } else if (activeConfig.key === 'health') {
    tipContent = healthTip ?? null;
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Subtle glow accent */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${activeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Tab bar - only show if more than one tab has content */}
        {availableTabs.length > 1 && (
          <div className="flex items-center gap-1 mb-5 pb-3 border-b border-white/[0.04]">
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'text-slate-100 bg-white/[0.08] border-b-2 border-purple-500'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Header for single tab */}
        {availableTabs.length === 1 && (
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]`}>
              <Icon size={18} className={activeConfig.iconColor} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">{activeConfig.label}</h3>
            {category && (
              <span className="ml-auto text-xs text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Tip content */}
        <div className={`border-l-2 ${activeConfig.accentColor} pl-4`}>
          {category && availableTabs.length > 1 && (
            <span className="text-xs text-slate-500 block mb-2 uppercase tracking-wider">
              {category}
            </span>
          )}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            {tipContent}
          </p>
        </div>
      </div>
    </div>
  );
}
