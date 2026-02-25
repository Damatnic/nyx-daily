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

type TabKey = 'us' | 'politics' | 'tech' | 'entertainment' | 'weird' | 'wisconsin';

const tabs: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'us',            label: 'Top Stories',    emoji: '🇺🇸' },
  { key: 'politics',      label: 'Politics',        emoji: '🏛️' },
  { key: 'tech',          label: 'Tech & AI',       emoji: '⚡' },
  { key: 'entertainment', label: 'Entertainment',   emoji: '🎬' },
  { key: 'weird',         label: 'Weird & TIL',     emoji: '🤯' },
  { key: 'wisconsin',     label: 'Wisconsin',       emoji: '🧀' },
];

// ─── Reading time estimate ──────────────────────────────────────────────────

function readingTime(text?: string | null): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ─── Source Logo ────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  'Reuters':        'bg-[#ff8000]',
  'AP News':        'bg-[#d00]',
  'Axios':          'bg-[#ff4242]',
  'Axios Politics': 'bg-[#ff4242]',
  'NPR News':       'bg-[#2e6da4]',
  'NPR Politics':   'bg-[#2e6da4]',
  'PBS NewsHour':   'bg-[#00539b]',
  'The Atlantic':   'bg-[#1a1a2e]',
  'Politico':       'bg-[#273359]',
  'The Hill':       'bg-[#083a5e]',
  'The Guardian US':'bg-[#052962]',
  'Wired':          'bg-black',
  'TechCrunch':     'bg-[#0a9f5e]',
  'The Verge':      'bg-[#fa4b17]',
  'MIT Tech Review':'bg-[#a31f34]',
  'VentureBeat AI': 'bg-[#1b2750]',
  'The Decoder':    'bg-[#6c47ff]',
  'Ars Technica':   'bg-[#d9281a]',
  'AI Business':    'bg-[#0066cc]',
  'Hacker News':    'bg-[#ff6600]',
  'Variety':        'bg-[#1a1a2e]',
  'Deadline':       'bg-[#c00]',
  'Collider':       'bg-[#222]',
  'IGN':            'bg-[#c00]',
  'Boing Boing':    'bg-[#e0262d]',
  'Oddity Central': 'bg-[#333]',
  'Wisconsin Public Radio': 'bg-[#004e7c]',
  'Urban Milwaukee':'bg-[#003580]',
};

function SourceBadge({ source, logo }: { source: string; logo?: string | null }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const color = SOURCE_COLORS[source] ?? 'bg-slate-700';
  const initial = source.charAt(0).toUpperCase();

  return (
    <span className="flex items-center gap-1.5">
      {/* Logo circle */}
      <span className={`w-4 h-4 rounded-sm flex items-center justify-center overflow-hidden shrink-0 ${(!logo || !imgOk) ? color : ''}`}>
        {logo && imgOk ? (
          <img
            ref={imgRef}
            src={logo}
            alt={source}
            width={16}
            height={16}
            className="w-full h-full object-contain"
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="text-[8px] font-bold text-white">{initial}</span>
        )}
      </span>
      <span className="text-slate-400 text-[11px] font-semibold tracking-wide">{source}</span>
    </span>
  );
}

// ─── Rank Badge ─────────────────────────────────────────────────────────────

function RankBadge({ n }: { n: number }) {
  const colors = [
    'text-amber-400 border-amber-400/30',
    'text-slate-300 border-slate-500/30',
    'text-amber-600/80 border-amber-700/20',
  ];
  return (
    <span className={`text-[10px] font-bold font-mono border rounded px-1 py-0.5 shrink-0 leading-none ${colors[n] ?? 'text-slate-600 border-slate-700/20'}`}>
      {String(n + 1).padStart(2, '0')}
    </span>
  );
}

// ─── Featured Hero Card ──────────────────────────────────────────────────────

function FeaturedCard({ item }: { item: NewsItem }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const hasImg = item.image && imgOk;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden border border-white/[0.07] bg-[#0d0d1a] hover:border-violet-500/25 transition-all duration-200"
    >
      {/* Hero image */}
      {hasImg && (
        <div className="w-full h-44 overflow-hidden bg-slate-900 relative">
          <img
            ref={imgRef}
            src={item.image!}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={() => { if (imgRef.current) imgRef.current.style.display = 'none'; setImgOk(false); }}
          />
          {/* Gradient fade bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/80 via-transparent to-transparent pointer-events-none" />
          {/* #1 badge pinned top-left */}
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold font-mono bg-black/70 backdrop-blur-sm text-amber-400 border border-amber-400/30 rounded px-1.5 py-0.5 leading-none">
            01
          </span>
        </div>
      )}

      <div className={`p-4 ${!hasImg ? 'border-l-2 border-violet-500/70' : ''}`}>
        {!hasImg && (
          <span className="text-[10px] font-bold font-mono text-amber-400 border border-amber-400/30 rounded px-1 py-0.5 mr-2 leading-none">01</span>
        )}
        {/* Source + meta row */}
        <div className="flex items-center gap-2 mb-2.5">
          <SourceBadge source={item.source ?? ''} logo={item.logo} />
          {item.snippet && (
            <span className="ml-auto text-[10px] text-slate-600 shrink-0">{readingTime(item.snippet)}</span>
          )}
        </div>
        {/* Headline */}
        <p className="text-slate-100 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-white transition-colors mb-1.5">
          {item.title}
        </p>
        {/* Snippet */}
        {item.snippet && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
            {item.snippet}
          </p>
        )}
        {/* Domain chip */}
        {item.domain && (
          <span className="inline-block mt-2 text-[10px] text-slate-600 bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5">
            {item.domain}
          </span>
        )}
      </div>
    </a>
  );
}

// ─── List News Card ──────────────────────────────────────────────────────────

function NewsCard({ item, rank }: { item: NewsItem; rank: number }) {
  const thumbRef = useRef<HTMLImageElement>(null);
  const [thumbOk, setThumbOk] = useState(true);
  const showThumb = item.image && thumbOk;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 items-start rounded-xl border border-white/[0.05] hover:border-white/[0.10] bg-[#0d0d1a] hover:bg-[#10101f] p-4 transition-all duration-200"
    >
      {/* Rank */}
      <div className="pt-0.5 shrink-0">
        <RankBadge n={rank} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <SourceBadge source={item.source ?? ''} logo={item.logo} />
          {item.snippet && (
            <span className="ml-auto text-[10px] text-slate-700 shrink-0">{readingTime(item.snippet)}</span>
          )}
        </div>
        <p className="text-slate-200 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {item.snippet && (
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-1">
            {item.snippet}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      {item.image && (
        <img
          ref={thumbRef}
          src={item.image}
          alt={item.title}
          width={72}
          height={56}
          className="w-[72px] h-14 rounded-lg object-cover shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
          style={{ display: showThumb ? 'block' : 'none' }}
          onError={() => { if (thumbRef.current) thumbRef.current.style.display = 'none'; setThumbOk(false); }}
        />
      )}
    </a>
  );
}

// ─── Tab item getter ─────────────────────────────────────────────────────────

function getTabItems(tab: TabKey, news: NewsData): NewsItem[] {
  switch (tab) {
    case 'us':            return (news.us_news     ?? []).slice(0, 3);
    case 'politics':      return (news.politics    ?? []).slice(0, 3);
    case 'tech': {
      // Interleave tech + ai, dedupe by domain, take 3
      const tech = news.tech ?? [];
      const ai   = news.ai   ?? [];
      const seen = new Set<string>();
      const merged: NewsItem[] = [];
      const max = Math.max(tech.length, ai.length);
      for (let i = 0; i < max && merged.length < 3; i++) {
        if (i < tech.length) {
          const d = tech[i].domain ?? tech[i].link;
          if (!seen.has(d)) { seen.add(d); merged.push(tech[i]); }
        }
        if (i < ai.length && merged.length < 3) {
          const d = ai[i].domain ?? ai[i].link;
          if (!seen.has(d)) { seen.add(d); merged.push(ai[i]); }
        }
      }
      return merged;
    }
    case 'entertainment': return (news.entertainment ?? []).slice(0, 3);
    case 'weird': {
      const weird = news.weird_news ?? [];
      const til   = news.til        ?? [];
      const seen  = new Set<string>();
      const merged: NewsItem[] = [];
      for (const item of [...weird, ...til]) {
        const d = item.domain ?? item.link;
        if (!seen.has(d) && merged.length < 3) { seen.add(d); merged.push(item); }
      }
      return merged;
    }
    case 'wisconsin':     return (news.wisconsin   ?? []).slice(0, 3);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function NewsSection({ news }: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('us');
  if (!news) return null;

  const items   = getTabItems(activeTab, news);
  const featured = items[0];
  const rest     = items.slice(1);
  const totalToday = Object.values(news).reduce((s, arr) => s + (arr?.length ?? 0), 0);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title="News" />
        <span className="text-[10px] text-slate-600 font-mono">{totalToday} stories today</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
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
              <span className="text-base leading-none">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-600 text-sm">No stories for this category today.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {featured && <FeaturedCard item={featured} />}
          {rest.map((item, i) => (
            <NewsCard key={i} item={item} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
