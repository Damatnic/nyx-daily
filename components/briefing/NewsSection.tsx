'use client';

import { useState, useRef } from 'react';
import type { NewsItem } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import NewsImage from '@/components/ui/NewsImage';

interface NewsData {
  us_news:       NewsItem[];
  politics:      NewsItem[];
  tech:          NewsItem[];
  ai:            NewsItem[];
  entertainment: NewsItem[];
  weird_news:    NewsItem[];
  wisconsin:     NewsItem[];
  til:           NewsItem[];
}

interface NewsSectionProps {
  news?: NewsData | null;
}

type TabKey = 'all' | 'us' | 'politics' | 'tech' | 'entertainment' | 'weird' | 'wisconsin';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'all',           label: 'All',           emoji: '📰' },
  { key: 'us',            label: 'Top Stories',   emoji: '🇺🇸' },
  { key: 'politics',      label: 'Politics',      emoji: '🏛️' },
  { key: 'tech',          label: 'Tech & AI',     emoji: '⚡' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { key: 'weird',         label: 'Weird & TIL',   emoji: '🤯' },
  { key: 'wisconsin',     label: 'Wisconsin',     emoji: '🧀' },
];

// ─── Brand colors (for source badge fallback) ────────────────────────────────
const SOURCE_COLORS: Record<string, string> = {
  'Axios':                  '#ff4242',
  'Axios Politics':         '#ff4242',
  'NPR News':               '#2e6da4',
  'NPR Politics':           '#2e6da4',
  'PBS NewsHour':           '#00539b',
  'The Atlantic':           '#4a5568',
  'The Hill':               '#083a5e',
  'The Guardian US':        '#052962',
  'Wired':                  '#3d3d3d',
  'TechCrunch':             '#0a9f5e',
  'The Verge':              '#fa4b17',
  'MIT Tech Review':        '#a31f34',
  'VentureBeat AI':         '#1b2750',
  'The Decoder':            '#6c47ff',
  'Ars Technica':           '#d9281a',
  'AI Business':            '#0066cc',
  'Hacker News':            '#ff6600',
  'Variety':                '#4a3728',
  'Deadline':               '#cc0000',
  'Collider':               '#3d3d3d',
  'IGN':                    '#cc0000',
  'Boing Boing':            '#e0262d',
  'Oddity Central':         '#4a4a4a',
  'Wisconsin Public Radio': '#004e7c',
  'Urban Milwaukee':        '#003580',
};

function readingTime(text?: string | null) {
  if (!text) return null;
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} min`;
}

// ─── Source badge (favicon + name) ──────────────────────────────────────────
function SourceBadge({ item, size = 'sm' }: { item: NewsItem; size?: 'sm' | 'xs' }) {
  const [logoOk, setLogoOk] = useState(true);
  const bg = SOURCE_COLORS[item.source ?? ''] ?? '#475569';
  const initial = (item.source ?? '?').charAt(0).toUpperCase();
  const nameClass = size === 'xs' ? 'text-[10px]' : 'text-[11px]';

  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span
        className="w-4 h-4 rounded-sm shrink-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: item.logo && logoOk ? 'transparent' : bg }}
      >
        {item.logo && logoOk ? (
          <img src={item.logo} alt="" width={16} height={16} className="w-full h-full object-contain"
            onError={() => setLogoOk(false)} />
        ) : (
          <span className="text-[8px] font-bold text-white">{initial}</span>
        )}
      </span>
      <span className={`${nameClass} font-semibold text-slate-400 truncate`}>{item.source}</span>
    </span>
  );
}

// ─── HERO CARD — story #1 ────────────────────────────────────────────────────
function HeroCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
    >
      {/* Image area — fixed 16:9-ish height */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-900">
        <NewsImage
          src={item.image}
          alt={item.title}
          source={item.source ?? ''}
          title={item.title}
          mode="hero"
        />
        {/* Gradient overlay bottom — darkens image for text legibility */}
        {item.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        )}
        {/* Rank badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold font-mono text-amber-400 bg-black/70 backdrop-blur-sm border border-amber-400/30 rounded px-1.5 py-0.5 leading-none z-10">
          01
        </span>
        {/* Domain chip */}
        {item.domain && (
          <span className="absolute top-3 right-3 text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 leading-none z-10">
            {item.domain}
          </span>
        )}
        {/* Headline + source overlay on image (only if image loaded) */}
        {item.image && (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="mb-1.5">
              <SourceBadge item={item} />
            </div>
            <p className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-slate-100 transition-colors">
              {item.title}
            </p>
            {item.snippet && (
              <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">{item.snippet}</p>
            )}
          </div>
        )}
      </div>

      {/* Text body — only shown if NO image (fallback placeholder used above) */}
      {!item.image && (
        <div className="p-4 border-l-2 border-violet-500/60 bg-[#0d0d1a]">
          <div className="flex items-center gap-2 mb-2">
            <SourceBadge item={item} />
            {readingTime(item.snippet) && (
              <span className="ml-auto text-[10px] text-slate-700">{readingTime(item.snippet)}</span>
            )}
          </div>
          <p className="text-slate-100 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {item.title}
          </p>
          {item.snippet && (
            <p className="text-slate-500 text-xs mt-1.5 line-clamp-3 leading-relaxed">{item.snippet}</p>
          )}
        </div>
      )}
    </a>
  );
}

// ─── SECONDARY CARD — stories #2 and #3 ─────────────────────────────────────
function SecondaryCard({ item, rank }: { item: NewsItem; rank: number }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.05] hover:border-white/[0.12] bg-[#0d0d1a] hover:bg-[#10101f] transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 overflow-hidden bg-slate-900 shrink-0">
        <NewsImage
          src={item.image}
          alt={item.title}
          source={item.source ?? ''}
          title={item.title}
          mode="hero"
        />
        {item.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        )}
        {/* Rank */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold font-mono border rounded px-1.5 py-0.5 leading-none bg-black/60 backdrop-blur-sm z-10
          ${rank === 2 ? 'text-slate-300 border-slate-500/40' : 'text-amber-700 border-amber-700/30'}`}>
          0{rank}
        </span>
      </div>

      {/* Text */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5">
          <SourceBadge item={item} size="xs" />
          {readingTime(item.snippet) && (
            <span className="ml-auto text-[10px] text-slate-700 shrink-0">{readingTime(item.snippet)}</span>
          )}
        </div>
        <p className="text-slate-200 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {item.snippet && (
          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2 mt-auto pt-1">
            {item.snippet}
          </p>
        )}
      </div>
    </a>
  );
}

// ─── CATEGORY SECTION ────────────────────────────────────────────────────────
interface Section { key: TabKey; emoji: string; label: string; items: NewsItem[] }

function CategorySection({ section }: { section: Section }) {
  const { emoji, label, items } = section;
  if (!items.length) return null;

  const [hero, ...rest] = items;
  const secondaries = rest.slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <span className="text-base leading-none">{emoji}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="text-[10px] text-slate-700 font-mono tabular-nums">{items.length} stories</span>
      </div>

      {/* Hero */}
      <HeroCard item={hero} />

      {/* Secondary grid */}
      {secondaries.length > 0 && (
        <div className={`grid gap-3 ${secondaries.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {secondaries.map((item, i) => (
            <SecondaryCard key={i} item={item} rank={i + 2} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Build sections from raw news data ──────────────────────────────────────
function buildSections(news: NewsData): Section[] {
  // Tech: interleave tech + ai, dedupe by domain, take 3
  const techItems: NewsItem[] = [];
  const tech = news.tech ?? [], ai = news.ai ?? [];
  const seenDomains = new Set<string>();
  const maxLen = Math.max(tech.length, ai.length);
  for (let i = 0; i < maxLen && techItems.length < 3; i++) {
    for (const src of [tech[i], ai[i]]) {
      if (!src || techItems.length >= 3) continue;
      const d = src.domain ?? src.link;
      if (!seenDomains.has(d)) { seenDomains.add(d); techItems.push(src); }
    }
  }

  // Weird: combine weird_news + til, dedupe, take 3
  const weirdItems: NewsItem[] = [];
  const weirdSeen = new Set<string>();
  for (const item of [...(news.weird_news ?? []), ...(news.til ?? [])]) {
    if (weirdItems.length >= 3) break;
    const d = item.domain ?? item.link;
    if (!weirdSeen.has(d)) { weirdSeen.add(d); weirdItems.push(item); }
  }

  return [
    { key: 'us',            emoji: '🇺🇸', label: 'Top Stories',   items: (news.us_news      ?? []).slice(0, 3) },
    { key: 'politics',      emoji: '🏛️',  label: 'Politics',      items: (news.politics     ?? []).slice(0, 3) },
    { key: 'tech',          emoji: '⚡',  label: 'Tech & AI',     items: techItems },
    { key: 'entertainment', emoji: '🎬',  label: 'Entertainment', items: (news.entertainment ?? []).slice(0, 3) },
    { key: 'weird',         emoji: '🤯',  label: 'Weird & TIL',   items: weirdItems },
    { key: 'wisconsin',     emoji: '🧀',  label: 'Wisconsin',     items: (news.wisconsin    ?? []).slice(0, 3) },
  ];
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function NewsSection({ news }: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  if (!news) return null;

  const sections = buildSections(news);
  const visibleSections = activeTab === 'all'
    ? sections
    : sections.filter((s) => s.key === activeTab);
  const totalStories = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title="News" />
        <span className="text-[10px] text-slate-700 font-mono">
          {totalStories} stories · {sections.length} categories
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {TABS.map(({ key, label, emoji }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150
                ${active
                  ? 'bg-violet-600/90 text-white shadow-md shadow-violet-900/40 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06]'
                }`}
            >
              <span className="text-sm leading-none">{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-10">
        {visibleSections.map((section) => (
          <CategorySection key={section.key} section={section} />
        ))}
      </div>
    </div>
  );
}
