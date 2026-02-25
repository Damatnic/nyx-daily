'use client';

import { useState } from 'react';
import type { NewsItem } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import { ExternalLink } from 'lucide-react';

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
  news: NewsData;
}

type TabKey = 'us' | 'politics' | 'tech' | 'wisconsin' | 'more';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'us', label: 'US News' },
  { key: 'politics', label: 'Politics' },
  { key: 'tech', label: 'Tech & AI' },
  { key: 'wisconsin', label: 'Wisconsin' },
  { key: 'more', label: 'More' },
];

function NewsItemCard({ item }: { item: NewsItem }) {
  const domain = (() => {
    try {
      return new URL(item.link).hostname.replace('www.', '');
    } catch {
      return 'link';
    }
  })();

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-purple-500/20 transition-all duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 group-hover:text-slate-100 leading-snug line-clamp-2 transition-colors duration-200">
          {item.title}
        </p>
        <p className="text-xs text-slate-600 mt-1">{domain}</p>
      </div>
      <ExternalLink size={12} className="text-slate-600 group-hover:text-[#8b5cf6] shrink-0 mt-0.5 transition-colors duration-200" />
    </a>
  );
}

function getTabItems(tab: TabKey, news: NewsData): NewsItem[] {
  switch (tab) {
    case 'us': return news.us_news;
    case 'politics': return news.politics;
    case 'tech': return [...news.tech, ...news.ai];
    case 'wisconsin': return news.wisconsin;
    case 'more': return [...news.entertainment, ...news.weird_news, ...news.til];
  }
}

export default function NewsSection({ news }: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('us');
  const items = getTabItems(activeTab, news);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="News" />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'text-[#8b5cf6] bg-purple-500/10 border border-purple-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* News items */}
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">No stories today.</p>
        ) : (
          items.slice(0, 5).map((item, i) => (
            <NewsItemCard key={i} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
