'use client';

import type { YouTubeVideo } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';

interface YouTubeSectionProps {
  videos?: YouTubeVideo[] | null;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'bg-purple-500/80', text: 'text-white', border: 'border-purple-400/30' },
  news: { bg: 'bg-blue-500/80', text: 'text-white', border: 'border-blue-400/30' },
  entertainment: { bg: 'bg-amber-500/80', text: 'text-white', border: 'border-amber-400/30' },
  science: { bg: 'bg-emerald-500/80', text: 'text-white', border: 'border-emerald-400/30' },
  education: { bg: 'bg-cyan-500/80', text: 'text-white', border: 'border-cyan-400/30' },
};

function getCategoryStyle(category: string) {
  return categoryColors[category.toLowerCase()] || categoryColors.tech;
}

export default function YouTubeSection({ videos }: YouTubeSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="YouTube Picks" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.slice(0, 6).map((video) => {
          const style = getCategoryStyle(video.category);

          return (
            <a
              key={video.video_id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
            >
              {/* Thumbnail container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-slate-900/40">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Category badge */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} backdrop-blur-sm`}
                >
                  {video.category}
                </span>
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video info */}
              <div className="p-3 flex flex-col gap-1 flex-1">
                <h3 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-auto">
                  {video.channel}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
