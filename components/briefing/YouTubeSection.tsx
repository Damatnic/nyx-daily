'use client';

import { useState } from 'react';
import type { YouTubeVideo } from '@/lib/types';
import SaveButton from '@/components/ui/SaveButton';

const CATEGORY_DOT: Record<string, string> = {
  tech: 'bg-violet-500', news: 'bg-blue-500', entertainment: 'bg-amber-500',
  science: 'bg-emerald-500', education: 'bg-cyan-500', business: 'bg-orange-500',
};

function getCategoryDot(cat: string) {
  return CATEGORY_DOT[cat.toLowerCase()] ?? 'bg-violet-500';
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Thumbnail({ src, alt, onError }: { src: string; alt: string; onError: () => void }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover"
      onError={onError}
    />
  );
}

interface VideoCardProps {
  video: YouTubeVideo;
  featured?: boolean;
}

function VideoCard({ video, featured = false }: VideoCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const dot = getCategoryDot(video.category);
  const saveItem = { type: 'video' as const, title: video.title, url: video.url, source: video.channel };

  if (featured) {
    return (
      <div className="relative group">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-white/[0.05] hover:border-white/[0.12] transition-all duration-200 bg-[var(--card)]"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video w-full bg-black/50 overflow-hidden">
            {!imgErr && video.thumbnail ? (
              <Thumbnail src={video.thumbnail} alt={video.title} onError={() => setImgErr(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/60 to-slate-900">
                <span className="text-4xl opacity-30">▶</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-slate-900">
                <PlayIcon />
              </div>
            </div>
            {/* Category badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">{video.category}</span>
            </div>
          </div>
          {/* Meta */}
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {video.title}
            </p>
            <p className="text-xs text-slate-600 mt-1">{video.channel}</p>
          </div>
        </a>
        {/* Save button — floats outside the <a> in the top-right of the card */}
        <div className="absolute top-2 right-2 z-10">
          <SaveButton item={saveItem} />
        </div>
      </div>
    );
  }

  // Secondary card — horizontal layout
  return (
    <div className="story-row group flex items-center gap-3 px-5 py-3">
      {/* Thumbnail — small */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 w-20 h-12 rounded-lg overflow-hidden bg-black/50"
      >
        {!imgErr && video.thumbnail ? (
          <Thumbnail src={video.thumbnail} alt={video.title} onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-950/60 to-slate-900 flex items-center justify-center">
            <span className="text-slate-700 text-sm">▶</span>
          </div>
        )}
      </a>
      {/* Info */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <p className="text-[12px] font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
          {video.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-[10px] text-slate-600 truncate">{video.channel}</span>
        </div>
      </a>
      <SaveButton item={saveItem} />
    </div>
  );
}

export default function YouTubeSection({ videos }: { videos?: YouTubeVideo[] | null }) {
  if (!videos?.length) return null;
  const [featured, ...rest] = videos;

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">YouTube</span>
        <span className="text-[10px] text-slate-700 font-mono">{videos.length} picks</span>
      </div>

      {/* Featured */}
      <div className="p-4 border-b border-white/[0.04]">
        <VideoCard video={featured} featured />
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {rest.slice(0, 4).map(v => <VideoCard key={v.video_id} video={v} />)}
        </div>
      )}
    </div>
  );
}
