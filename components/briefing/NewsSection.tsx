'use client';

import { useState, useRef } from 'react';
import type { NewsItem } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';

interface NewsData {
  us_news: NewsItem[];
  politics: NewsItem[];
  tech: NewsItem[];
  ai: NewsItem[];
  entertainment: NewsItem[];
  weird_news: NewsItem[];
  wisconsin: NewsItem[];
  til: NewsItem[];
}

interface NewsSectionProps {
  news?: NewsData | null;
}

type TabKey = 'all' | 'us' | 'politics' | 'tech' | 'entertainment' | 'weird' | 'wisconsin';

const tabs: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'all',           label: 'All',           emoji: '📰' },
  { key: 'us',            label: 'Top Stories',   emoji: '🇺🇸' },
  { key: 'politics',      label: 'Politics',      emoji: '🏛️' },
  { key: 'tech',          label: 'Tech & AI',     emoji: '⚡' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { key: 'weird',         label: 'Weird',         emoji: '🤯' },
  { key: 'wisconsin',     label: 'Wisconsin',     emoji: '🧀' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readingTime(text?: string | null): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

const SOURCE_COLORS: Record<string, string> = {
  'Axios':          'bg-[#ff4242]',  'Axios Politics': 'bg-[#ff4242]',
  'NPR News':       'bg-[#2e6da4]',  'NPR Politics':   'bg-[#2e6da4]',
  'PBS NewsHour':   'bg-[#00539b]',  'The Atlantic':   'bg-[#1a1a2e]',
  'The Hill':       'bg-[#083a5e]',  'The Guardian US':'bg-[#052962]',
  'Wired':          'bg-black',      'TechCrunch':     'bg-[#0a9f5e]',
  'The Verge':      'bg-[#fa4b17]',  'MIT Tech Review':'bg-[#a31f34]',
  'VentureBeat AI': 'bg-[#1b2750]',  'The Decoder':    'bg-[#6c47ff]',
  'Ars Technica':   'bg-[#d9281a]',  'AI Business':    'bg-[#0066cc]',
  'Hacker News':    'bg-[#ff6600]',  'Variety':        'bg-[#1a1a2e]',
  'Deadline':       'bg-[#c00]',     'Collider':       'bg-[#222]',
  'IGN':            'bg-[#c00]',     'Boing Boing':    'bg-[#e0262d]',
  'Oddity Central': 'bg-[#333]',
  'Wisconsin Public Radio': 'bg-[#004e7c]',
  'Urban Milwaukee': 'bg-[#003580]',
};

function SourceBadge({ source, logo }: { source: string; logo?: string | null }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const color = SOURCE_COLORS[source] ?? 'bg-slate-700';
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      <span className={`w-4 h-4 rounded-sm flex items-center justify-center overflow-hidden shrink-0 ${(!logo || !imgOk) ? color : ''}`}>
        {logo && imgOk ? (
          <img ref={imgRef} src={logo} alt={source} width={16} height={16}
            className="w-full h-full object-contain"
            onError={() => setImgOk(false)} />
        ) : (
          <span className="text-[8px] font-bold text-white">{source.charAt(0)}</span>
        )}
      </span>
      <span className="text-slate-400 text-[11px] font-semibold tracking-wide truncate max-w-[110px]">{source}</span>
    </span>
  );
}

// ─── Single story card (horizontal list-style) ───────────────────────────────

function StoryCard({ item, rank }: { item: NewsItem; rank: number }) {
  const thumbRef = useRef<HTMLImageElement>(null);
  const [thumbOk, setThumbOk] = useState(true);

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg border border-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.03] transition-all duration-150"
    >
      {/* Rank number */}
      <span className={`text-[11px] font-bold font-mono shrink-0 mt-0.5 w-5 text-center
        ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-400' : 'text-slate-600'}`}>
        {rank}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <SourceBadge source={item.source ?? ''} logo={item.logo} />
          {item.snippet && (
            <span className="ml-auto text-[10px] text-slate-700 shrink-0">{readingTime(item.snippet)}</span>
          )}
        </div>
        <p className="text-slate-200 text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {item.snippet && (
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-1 mt-0.5">
            {item.snippet}
          </p>
        )}
      </div>

      {/* Thumb */}
      {item.image && thumbOk && (
        <img
          ref={thumbRef}
          src={item.image}
          alt=""
          width={64}
          height={48}
          className="w-16 h-12 rounded-lg object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
          onError={() => { if (thumbRef.current) thumbRef.current.style.display = 'none'; setThumbOk(false); }}
        />
      )}
    </a>
  );
}

// ─── Featured story (top of each section) ────────────────────────────────────

function FeaturedStory({ item }: { item: NewsItem }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgOk, setImgOk] = useState(true);

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 mb-1"
    >
      {item.image && imgOk && (
        <div className="relative w-full h-36 overflow-hidden bg-slate-900">
          <img
            ref={imgRef}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={() => { if (imgRef.current) imgRef.current.style.display = 'none'; setImgOk(false); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/85 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-2 left-2 text-[10px] font-bold font-mono text-amber-400 bg-black/60 backdrop-blur-sm border border-amber-400/30 rounded px-1.5 py-0.5">
            01
          </span>
        </div>
      )}
      <div className={`p-3 ${(!item.image || !imgOk) ? 'border-l-2 border-violet-500/60' : ''}`}>
        {(!item.image || !imgOk) && (
          <span className="text-[10px] font-bold font-mono text-amber-400 border border-amber-400/30 rounded px-1 py-0.5 mr-2">01</span>
        )}
        <div className="flex items-center gap-2 mb-1.5">
          <SourceBadge source={item.source ?? ''} logo={item.logo} />
          {item.snippet && <span className="ml-auto text-[10px] text-slate-700 shrink-0">{readingTime(item.snippet)}</span>}
        </div>
        <p className="text-slate-100 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {item.snippet && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-1">{item.snippet}</p>
        )}
      </div>
    </a>
  );
}

// ─── One category section ─────────────────────────────────────────────────────

function CategorySection({
  emoji, label, items,
}: {
  emoji: string;
  label: string;
  items: NewsItem[];
}) {
  if (!items || items.length === 0) return null;
  const [featured, ...rest] = items;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm">{emoji}</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        <span className="text-[10px] text-slate-700 font-mono">{items.length} stories</span>
      </div>

      {/* Featured */}
      <FeaturedStory item={featured} />

      {/* #2 and #3 */}
      {rest.map((item, i) => (
        <StoryCard key={i} item={item} rank={i + 2} />
      ))}
    </div>
  );
}

// ─── Tab data assembly ────────────────────────────────────────────────────────

interface Section { key: TabKey; emoji: string; label: string; items: NewsItem[] }

function buildSections(news: NewsData): Section[] {
  // Tech: interleave tech + ai, dedupe by domain, take 3
  const techItems = (() => {
    const tech = news.tech ?? [], ai = news.ai ?? [];
    const seen = new Set<string>(), merged: NewsItem[] = [];
    const max = Math.max(tech.length, ai.length);
    for (let i = 0; i < max && merged.length < 3; i++) {
      if (i < tech.length) { const d = tech[i].domain ?? tech[i].link; if (!seen.has(d)) { seen.add(d); merged.push(tech[i]); } }
      if (i < ai.length && merged.length < 3) { const d = ai[i].domain ?? ai[i].link; if (!seen.has(d)) { seen.add(d); merged.push(ai[i]); } }
    }
    return merged;
  })();

  // Weird: combine weird_news + til, dedupe, take 3
  const weirdItems = (() => {
    const weird = news.weird_news ?? [], til = news.til ?? [];
    const seen = new Set<string>(), merged: NewsItem[] = [];
    for (const item of [...weird, ...til]) {
      const d = item.domain ?? item.link;
      if (!seen.has(d) && merged.length < 3) { seen.add(d); merged.push(item); }
    }
    return merged;
  })();

  return [
    { key: 'us',            emoji: '🇺🇸', label: 'Top Stories',   items: (news.us_news     ?? []).slice(0, 3) },
    { key: 'politics',      emoji: '🏛️',  label: 'Politics',      items: (news.politics    ?? []).slice(0, 3) },
    { key: 'tech',          emoji: '⚡',  label: 'Tech & AI',     items: techItems },
    { key: 'entertainment', emoji: '🎬',  label: 'Entertainment', items: (news.entertainment ?? []).slice(0, 3) },
    { key: 'weird',         emoji: '🤯',  label: 'Weird & TIL',   items: weirdItems },
    { key: 'wisconsin',     emoji: '🧀',  label: 'Wisconsin',     items: (news.wisconsin   ?? []).slice(0, 3) },
  ];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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
        <span className="text-[10px] text-slate-600 font-mono">{totalStories} stories · {sections.length} categories</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-150
                ${active
                  ? 'bg-violet-600/90 text-white shadow-md shadow-violet-900/40 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06]'
                }
              `}
            >
              <span className="text-sm leading-none">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content — all sections or filtered single section */}
      <div className="flex flex-col gap-8">
        {visibleSections.map((section) => (
          <CategorySection
            key={section.key}
            emoji={section.emoji}
            label={section.label}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}
