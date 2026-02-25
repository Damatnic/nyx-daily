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

type TabKey = 'us' | 'politics' | 'tech' | 'entertainment' | 'wisconsin';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'us', label: 'US News' },
  { key: 'politics', label: 'Politics' },
  { key: 'tech', label: 'Tech & AI' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'wisconsin', label: 'Wisconsin' },
];

// ─── Source Logo ────────────────────────────────────────────────────────────

function SourceLogo({ logo, source }: { logo?: string | null; source: string }) {
  const fallbackColors = [
    'bg-violet-600', 'bg-cyan-600', 'bg-emerald-600',
    'bg-amber-600', 'bg-rose-600', 'bg-indigo-600',
  ];
  const colorIdx = source.charCodeAt(0) % fallbackColors.length;
  const initial = source.charAt(0).toUpperCase();
  const imgRef = useRef<HTMLImageElement>(null);

  if (!logo) {
    return (
      <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold text-white shrink-0 ${fallbackColors[colorIdx]}`}>
        {initial}
      </span>
    );
  }

  return (
    <>
      <img
        ref={imgRef}
        src={logo}
        alt={source}
        width={16}
        height={16}
        className="w-4 h-4 rounded-sm object-contain shrink-0"
        onError={() => {
          if (imgRef.current) {
            imgRef.current.style.display = 'none';
            // Show fallback sibling
            const sib = imgRef.current.nextElementSibling as HTMLElement | null;
            if (sib) sib.style.display = 'flex';
          }
        }}
      />
      <span
        className={`w-4 h-4 rounded-sm items-center justify-center text-[8px] font-bold text-white shrink-0 ${fallbackColors[colorIdx]}`}
        style={{ display: 'none' }}
      >
        {initial}
      </span>
    </>
  );
}

// ─── Featured Card (first article, large) ───────────────────────────────────

function FeaturedCard({ item }: { item: NewsItem }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(true);

  const hasImage = item.image && imageLoaded;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden border border-white/[0.06] bg-[#0d0d1a] hover:border-white/[0.14] transition-all duration-200 cursor-pointer group"
    >
      {/* Full-width image */}
      {item.image && (
        <div className="w-full h-40 overflow-hidden bg-slate-900">
          <img
            ref={imgRef}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => {
              if (imgRef.current) imgRef.current.style.display = 'none';
              setImageLoaded(false);
            }}
          />
        </div>
      )}

      {/* Card body */}
      <div className={`p-4 ${!hasImage ? 'border-l-2 border-violet-500' : ''}`}>
        {/* Source row */}
        <div className="flex items-center gap-1.5 mb-2">
          <SourceLogo logo={item.logo} source={item.source ?? ''} />
          <span className="text-slate-400 text-xs font-medium">{item.source}</span>
          {item.domain && (
            <span className="ml-auto text-slate-600 text-[10px] bg-slate-800/50 rounded px-1.5 py-0.5">
              {item.domain}
            </span>
          )}
        </div>
        {/* Title */}
        <p className="text-slate-100 font-semibold text-base leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {/* Snippet */}
        {item.snippet && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mt-1.5">
            {item.snippet}
          </p>
        )}
      </div>
    </a>
  );
}

// ─── Regular Card ────────────────────────────────────────────────────────────

function NewsCard({ item }: { item: NewsItem }) {
  const thumbRef = useRef<HTMLImageElement>(null);
  const [thumbVisible, setThumbVisible] = useState(true);

  const showThumb = item.image && thumbVisible;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 items-start bg-[#0d0d1a] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all duration-200 cursor-pointer group"
    >
      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Source row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <SourceLogo logo={item.logo} source={item.source ?? ''} />
          <span className="text-slate-400 text-xs font-medium truncate">{item.source}</span>
          {item.domain && (
            <span className="ml-auto text-slate-600 text-[10px] bg-slate-800/50 rounded px-1.5 py-0.5 shrink-0">
              {item.domain}
            </span>
          )}
        </div>
        {/* Title */}
        <p className="text-slate-100 font-medium text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </p>
        {/* Snippet */}
        {item.snippet && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-1">
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
          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
          style={{ display: showThumb ? 'block' : 'none' }}
          onError={() => {
            if (thumbRef.current) thumbRef.current.style.display = 'none';
            setThumbVisible(false);
          }}
        />
      )}
    </a>
  );
}

// ─── Tab content helper ──────────────────────────────────────────────────────

function interleave<T>(a: T[], b: T[]): T[] {
  const result: T[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

function getTabItems(tab: TabKey, news: NewsData): NewsItem[] {
  switch (tab) {
    case 'us':            return news.us_news ?? [];
    case 'politics':      return news.politics ?? [];
    case 'tech':          return interleave(news.tech ?? [], news.ai ?? []);
    case 'entertainment': return news.entertainment ?? [];
    case 'wisconsin':     return news.wisconsin ?? [];
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NewsSection({ news }: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('us');
  if (!news) return null;
  const allItems = getTabItems(activeTab, news);
  const featured = allItems[0];
  const rest = allItems.slice(1, 4); // show up to 3 more

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="News" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] bg-white/[0.02] border border-white/[0.05]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {allItems.length === 0 ? (
        <p className="text-slate-500 text-sm py-4 text-center">No stories today.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Featured — first article, larger */}
          {featured && <FeaturedCard item={featured} />}

          {/* Regular cards */}
          {rest.map((item, i) => (
            <NewsCard key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
