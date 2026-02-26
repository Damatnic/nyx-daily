'use client';

import type { YouTubeVideo } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';

interface YouTubeSectionProps {
  videos?: YouTubeVideo[] | null;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; hoverBorder: string }> = {
  tech: { bg: 'bg-purple-500/80', text: 'text-white', border: 'border-purple-400/30', hoverBorder: 'hover:border-purple-400/60' },
  news: { bg: 'bg-blue-500/80', text: 'text-white', border: 'border-blue-400/30', hoverBorder: 'hover:border-blue-400/60' },
  entertainment: { bg: 'bg-amber-500/80', text: 'text-white', border: 'border-amber-400/30', hoverBorder: 'hover:border-amber-400/60' },
  science: { bg: 'bg-emerald-500/80', text: 'text-white', border: 'border-emerald-400/30', hoverBorder: 'hover:border-emerald-400/60' },
  education: { bg: 'bg-cyan-500/80', text: 'text-white', border: 'border-cyan-400/30', hoverBorder: 'hover:border-cyan-400/60' },
};

function getCategoryStyle(category: string) {
  return categoryColors[category.toLowerCase()] || categoryColors.tech;
}

export default function YouTubeSection({ videos }: YouTubeSectionProps) {
  if (!videos || videos.length === 0) return null;

  const featured = videos[0];
  const gridVideos = videos.slice(1, 6);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="YouTube Picks" gradient />

      {/* Featured hero card */}
      <a
        href={featured.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 mb-4"
      >
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-900/20 to-slate-900/40">
          <img
            src={featured.thumbnail}
            alt={featured.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          {/* Category badge */}
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-black/50 backdrop-blur-sm border border-white/10 text-white">
            {featured.category}
          </span>
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#0d0d1a]">
          <h3 className="text-base font-semibold text-slate-100 line-clamp-2 group-hover:text-white transition-colors">
            {featured.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <span>🎬</span>
            <span className="truncate">{featured.channel}</span>
          </p>
        </div>
      </a>

      {/* Grid cards */}
      {gridVideos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {gridVideos.map((video) => {
            const style = getCategoryStyle(video.category);

            return (
              <a
                key={video.video_id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-hover group flex flex-col rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] ${style.hoverBorder} transition-all duration-200`}
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
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  {/* Category badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-black/50 backdrop-blur-sm border border-white/10 text-white">
                    {video.category}
                  </span>
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-xs text-slate-500 truncate mt-auto flex items-center gap-1">
                    <span>🎬</span>
                    <span className="truncate">{video.channel}</span>
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
