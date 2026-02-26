'use client';

import { useState } from 'react';
import { NasaApod as NasaApodType } from '@/lib/types';

export default function NasaApod({ apod }: { apod: NasaApodType }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  if (apod.media_type === 'video') {
    return (
      <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer"
        className="nyx-card block overflow-hidden hover:border-violet-500/20 transition-all duration-200">
        <div className="h-32 bg-gradient-to-br from-violet-950/60 to-slate-900 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">🎥</span>
          <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">NASA APOD</p>
          <p className="text-xs text-slate-400 text-center px-4 line-clamp-2">{apod.title}</p>
        </div>
      </a>
    );
  }

  return (
    <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden relative group border border-white/[0.06]">
      <div className="relative" style={{ maxHeight: 320, overflow: 'hidden' }}>
        <img
          src={apod.url}
          alt={apod.title}
          className="w-full object-cover"
          style={{ maxHeight: 320, display: 'block' }}
          onError={() => setHidden(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1">🌌 NASA APOD</p>
          <p className="text-sm font-bold text-white line-clamp-1">{apod.title}</p>
          {apod.explanation && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{apod.explanation}</p>
          )}
        </div>
      </div>
    </a>
  );
}
