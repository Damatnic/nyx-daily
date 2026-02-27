'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { NewsItem } from '@/lib/types';
import NewsImage from '@/components/ui/NewsImage';
import SaveButton from '@/components/ui/SaveButton';

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

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',           label: 'All' },
  { key: 'tech',          label: 'Tech & AI' },
  { key: 'entertainment', label: 'Culture' },
  { key: 'us',            label: 'US' },
  { key: 'politics',      label: 'Politics' },
  { key: 'weird',         label: 'Weird' },
  { key: 'wisconsin',     label: 'Local' },
];

// Per-category accent colors
const CATEGORY_ACCENT: Record<string, string> = {
  us:            'bg-violet-500',
  politics:      'bg-red-500',
  tech:          'bg-cyan-500',
  entertainment: 'bg-amber-500',
  weird:         'bg-pink-500',
  wisconsin:     'bg-indigo-500',
};

const CATEGORY_LABEL: Record<string, { emoji: string; label: string }> = {
  us:            { emoji: '🇺🇸', label: 'Top Stories' },
  politics:      { emoji: '🏛️',  label: 'Politics' },
  tech:          { emoji: '⚡',   label: 'Tech & AI' },
  entertainment: { emoji: '🎬',  label: 'Culture' },
  weird:         { emoji: '🤯',  label: 'Weird & TIL' },
  wisconsin:     { emoji: '🧀',  label: 'Local' },
};

// ─── LEAD STORY ─────────────────────────────────────────────────────────────
function LeadStory({ item, accent }: { item: NewsItem; accent: string }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="flex gap-4 items-start py-4">
        {/* Thumbnail — small, left side */}
        {item.image && (
          <div className="shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden bg-white/[0.04] hidden sm:block">
            <NewsImage
              src={item.image}
              alt={item.title}
              source={item.source ?? ''}
              title={item.title}
              mode="thumb"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {/* Source */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${accent} shrink-0`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {item.source}
            </span>
            {item.domain && (
              <span className="text-[10px] text-slate-700 hidden sm:block">· {item.domain}</span>
            )}
          </div>
          {/* Headline */}
          <p className="text-lg sm:text-xl font-bold text-slate-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {item.title}
          </p>
          {/* Snippet */}
          {item.snippet && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
              {item.snippet}
            </p>
          )}
        </div>
        {/* Arrow */}
        <ExternalLink size={13} className="shrink-0 text-slate-700 group-hover:text-violet-400 transition-colors mt-1" />
      </div>
    </a>
  );
}

// ─── STORY ROW ───────────────────────────────────────────────────────────────
function StoryRow({ item, accent, rank }: { item: NewsItem; accent: string; rank: number }) {
  return (
    <div className="story-row group flex items-start gap-3 px-3 py-2.5 rounded-lg -mx-3">
      <span className="text-[10px] font-mono text-slate-700 w-4 shrink-0 mt-0.5 tabular-nums">{rank}</span>
      <span className={`w-1 h-1 rounded-full ${accent} shrink-0 mt-[5px]`} />
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
        <p className="text-[13px] sm:text-sm text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-slate-600">{item.source}</span>
          {item.domain && <span className="text-[10px] text-slate-700 hidden sm:block">· {item.domain}</span>}
        </div>
      </a>
      <SaveButton item={{ type: 'news', title: item.title, url: item.link, source: item.source, snippet: item.snippet ?? undefined }} />
    </div>
  );
}

// ─── CATEGORY SECTION ────────────────────────────────────────────────────────
interface Section {
  key: TabKey;
  items: NewsItem[];
}

function CategorySection({ section }: { section: Section }) {
  const { key, items } = section;
  if (!items.length) return null;
  const accent = CATEGORY_ACCENT[key] ?? 'bg-violet-500';
  const meta   = CATEGORY_LABEL[key] ?? { emoji: '📰', label: key };
  const [lead, ...rest] = items;

  return (
    <div className="py-1">
      {/* Category header */}
      <div className="flex items-center gap-2.5 py-2">
        <span className="text-base leading-none select-none">{meta.emoji}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          {meta.label}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="text-[10px] text-slate-700 font-mono">{items.length}</span>
      </div>

      {/* Lead story */}
      <LeadStory item={lead} accent={accent} />

      {/* Remaining stories */}
      {rest.length > 0 && (
        <div className="border-t border-white/[0.04] pt-1">
          {rest.map((item, i) => (
            <StoryRow key={i} item={item} accent={accent} rank={i + 2} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BUILD SECTIONS ──────────────────────────────────────────────────────────
function buildSections(news: NewsData): Section[] {
  // Merge tech + AI, dedupe by domain, take 3
  const techItems: NewsItem[] = [];
  const seenDomains = new Set<string>();
  const maxLen = Math.max((news.tech ?? []).length, (news.ai ?? []).length);
  for (let i = 0; i < maxLen && techItems.length < 3; i++) {
    for (const src of [news.tech?.[i], news.ai?.[i]]) {
      if (!src || techItems.length >= 3) continue;
      const d = src.domain ?? src.link;
      if (!seenDomains.has(d)) { seenDomains.add(d); techItems.push(src); }
    }
  }

  // Merge weird + TIL, dedupe, take 3
  const weirdItems: NewsItem[] = [];
  const weirdSeen = new Set<string>();
  for (const item of [...(news.weird_news ?? []), ...(news.til ?? [])]) {
    if (weirdItems.length >= 3) break;
    const d = item.domain ?? item.link;
    if (!weirdSeen.has(d)) { weirdSeen.add(d); weirdItems.push(item); }
  }

  return ([
    { key: 'tech'          as TabKey, items: techItems },
    { key: 'entertainment' as TabKey, items: (news.entertainment ?? []).slice(0, 3) },
    { key: 'us'            as TabKey, items: (news.us_news      ?? []).slice(0, 2) },
    { key: 'weird'         as TabKey, items: weirdItems },
    { key: 'wisconsin'     as TabKey, items: (news.wisconsin    ?? []).slice(0, 2) },
    { key: 'politics'      as TabKey, items: (news.politics     ?? []).slice(0, 2) },
  ] as Section[]).filter(s => s.items.length > 0);
}

// ─── FLAT ROW (used in All tab) ──────────────────────────────────────────────
// Map bg-* accent class → a text color for the label
const ACCENT_TEXT: Record<string, string> = {
  'bg-blue-500': 'text-blue-500', 'bg-red-500': 'text-red-400',
  'bg-violet-500': 'text-violet-400', 'bg-purple-500': 'text-purple-400',
  'bg-amber-500': 'text-amber-400', 'bg-pink-500': 'text-pink-400',
  'bg-lime-500': 'text-lime-400', 'bg-emerald-500': 'text-emerald-400',
};

function FlatRow({ item, accent, label, rank }: { item: NewsItem; accent: string; label: string; rank: number }) {
  const catColor = ACCENT_TEXT[accent] ?? 'text-slate-600';
  return (
    <div className="story-row group flex items-start gap-3 px-3 py-2.5 rounded-lg -mx-3">
      <span className="text-[10px] font-mono text-slate-700 w-5 shrink-0 mt-0.5 tabular-nums">{rank}</span>
      <span className={`w-1 h-1 rounded-full ${accent} shrink-0 mt-[5px]`} />
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
        <p className="text-[13px] sm:text-sm text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-slate-600">{item.source}</span>
          <span className="text-[10px] text-slate-700">·</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${catColor}`}>{label}</span>
        </div>
      </a>
      <SaveButton item={{ type: 'news', title: item.title, url: item.link, source: item.source, snippet: item.snippet ?? undefined }} />
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function NewsSection({ news }: NewsSectionProps) {
  const [tab, setTab] = useState<TabKey>('all');
  if (!news) return null;

  const sections  = buildSections(news);
  const total     = sections.reduce((n, s) => n + s.items.length, 0);
  const hasKeys   = new Set(sections.map(s => s.key));
  const availableTabs = TABS.filter(t => t.key === 'all' || hasKeys.has(t.key));
  const activeTab = (tab === 'all' || hasKeys.has(tab)) ? tab : 'all';

  // "All" tab → flat ranked list; category tab → full CategorySection
  const allItems: { item: NewsItem; accent: string; label: string }[] = [];
  if (activeTab === 'all') {
    for (const s of sections) {
      const accent = CATEGORY_ACCENT[s.key] ?? 'bg-violet-500';
      const label  = CATEGORY_LABEL[s.key]?.label ?? s.key;
      for (const item of s.items) allItems.push({ item, accent, label });
    }
  }
  const visible = activeTab !== 'all' ? sections.filter(s => s.key === activeTab) : [];

  // Featured story — top US headline shown prominently above tabs
  const featuredStory = news.us_news?.[0] ?? news.politics?.[0] ?? null;

  return (
    <div className="nyx-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">News</span>
          <span className="text-[10px] text-slate-600 font-mono">{total} stories</span>
        </div>
      </div>

      {/* Featured story */}
      {featuredStory && (
        <div className="px-5 pb-4 border-b border-white/[0.06]">
          <LeadStory item={featuredStory} accent="bg-blue-500" />
        </div>
      )}

      {/* Tabs */}
      <div className="px-5 pt-4">
      <div className="flex gap-1 mb-1 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {availableTabs.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button key={key} onClick={() => setTab(key)}
              className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-100 ${
                active ? 'bg-violet-600/80 text-white' : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="divider mb-1" />

      {/* All tab: flat compact list */}
      {activeTab === 'all' ? (
        <div>
          {allItems.map(({ item, accent, label }, i) => (
            <FlatRow key={i} item={item} accent={accent} label={label} rank={i + 1} />
          ))}
        </div>
      ) : (
        /* Category tab: full lead story treatment */
        <div className="divide-y divide-white/[0.04]">
          {visible.map((section) => (
            <CategorySection key={section.key} section={section} />
          ))}
        </div>
      )}
      </div>{/* /px-5 pt-4 tabs wrapper */}
    </div>
  );
}
