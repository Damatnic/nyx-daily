'use client';

import { useState } from 'react';
import { NasaApod as NasaApodType } from '@/lib/types';

interface NasaApodProps {
  apod: NasaApodType;
}

export default function NasaApod({ apod }: NasaApodProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  if (apod.media_type === 'video') {
    return (
      <a
        href="https://apod.nasa.gov"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-white/[0.06] bg-[#0d0d1a] overflow-hidden hover:border-purple-500/20 transition-all duration-200"
      >
        <div className="relative h-40 bg-gradient-to-br from-violet-900/30 via-slate-900 to-cyan-900/20 flex flex-col items-center justify-center gap-3">
          <span className="text-5xl">🎥</span>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              🌌 NASA — ASTRONOMY PICTURE OF THE DAY
            </p>
            <p className="text-slate-200 font-bold text-sm px-4">{apod.title}</p>
            <p className="text-slate-400 text-xs mt-1">Video — click to view on NASA APOD →</p>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href="https://apod.nasa.gov"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden relative group"
      style={{ maxHeight: '400px' }}
    >
      {/* Background image */}
      <div className="relative w-full" style={{ maxHeight: '400px', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={apod.url}
          alt={apod.title}
          className="w-full object-cover"
          style={{ maxHeight: '400px', display: 'block' }}
          onError={() => setHidden(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* View full image link — top right */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            View full image →
          </span>
        </div>

        {/* Text overlay — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            🌌 NASA — ASTRONOMY PICTURE OF THE DAY
          </p>
          <h3 className="text-xl font-bold text-white leading-tight mb-2">
            {apod.title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
            {apod.explanation}
          </p>
        </div>
      </div>
    </a>
  );
}
