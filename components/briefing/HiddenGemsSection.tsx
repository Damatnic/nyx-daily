import type { HiddenGem } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import { ExternalLink } from 'lucide-react';

interface HiddenGemsSectionProps {
  gems?: HiddenGem[] | null;
}

const sourceConfig: Record<string, { label: string; color: string; bg: string }> = {
  hackernews: { label: 'HN', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  producthunt: { label: 'PH', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

function getSourceStyle(source: string) {
  return sourceConfig[source.toLowerCase()] || sourceConfig.hackernews;
}

export default function HiddenGemsSection({ gems }: HiddenGemsSectionProps) {
  if (!gems || gems.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="Sites You Didn't Know About" />

      <div className="flex flex-col gap-3">
        {gems.slice(0, 5).map((gem, index) => {
          const sourceStyle = getSourceStyle(gem.source);

          return (
            <a
              key={index}
              href={gem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] border-l-2 border-l-purple-500/40 hover:bg-white/[0.04] hover:border-l-purple-500/70 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-medium text-slate-200 group-hover:text-[#8b5cf6] transition-colors line-clamp-1">
                    {gem.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sourceStyle.bg} ${sourceStyle.color}`}
                  >
                    {sourceStyle.label}
                  </span>
                  {gem.points > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {gem.points} pts
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {gem.description}
                </p>
              </div>
              <ExternalLink
                size={14}
                className="shrink-0 text-slate-600 group-hover:text-purple-400 transition-colors mt-0.5"
              />
            </a>
          );
        })}
      </div>

      {/* Footer link */}
      <a
        href="https://news.ycombinator.com/show"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-purple-400 transition-colors py-2"
      >
        Discover more on Show HN
        <ExternalLink size={11} />
      </a>
    </div>
  );
}
