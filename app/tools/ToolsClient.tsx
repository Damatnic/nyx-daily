'use client';

import { useState } from 'react';
import { AppOfTheDay } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const CATEGORIES = ['All', 'AI', 'Coding', 'Productivity', 'Cybersecurity', 'Data', 'Creative'];

interface ToolsClientProps {
  apps: Array<{ date: string; app: AppOfTheDay; isToday: boolean }>;
}

export default function ToolsClient({ apps }: ToolsClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  if (apps.length === 0) return null;

  const filtered =
    activeCategory === 'All'
      ? apps
      : apps.filter((a) =>
          a.app.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          All Featured Tools
        </p>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-purple-500/20 text-[#8b5cf6] border border-purple-500/30'
                  : 'text-slate-400 border border-white/[0.06] hover:text-slate-200 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No tools in the &ldquo;{activeCategory}&rdquo; category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ date, app, isToday }, i) => (
            <div
              key={i}
              className={`rounded-xl border bg-[#0d0d1a] p-5 hover:border-purple-500/20 transition-all duration-200 flex flex-col gap-3 ${
                isToday ? 'border-purple-500/20' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-100 truncate">{app.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isToday
                      ? 'Today'
                      : new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                  </p>
                </div>
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-500/20 text-slate-400 hover:text-[#8b5cf6] transition-all duration-200 shrink-0"
                  aria-label={`Open ${app.name}`}
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="purple">{app.category}</Badge>
                {app.free && <Badge variant="green">Free</Badge>}
                {app.freemium && !app.free && <Badge variant="cyan">Freemium</Badge>}
                {!app.free && !app.freemium && <Badge variant="gold">Paid</Badge>}
              </div>

              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{app.verdict}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
