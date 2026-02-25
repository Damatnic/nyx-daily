'use client';

import { useState } from 'react';

// ─── Brand gradients for fallback placeholders ───────────────────────────────
const SOURCE_GRADIENTS: Record<string, string> = {
  'Axios':                  'from-red-900/90 to-red-950',
  'Axios Politics':         'from-red-900/90 to-red-950',
  'NPR News':               'from-blue-900/90 to-blue-950',
  'NPR Politics':           'from-blue-900/90 to-blue-950',
  'PBS NewsHour':           'from-sky-900/90 to-sky-950',
  'The Atlantic':           'from-slate-700/90 to-slate-950',
  'The Hill':               'from-slate-800/90 to-blue-950',
  'The Guardian US':        'from-blue-950/90 to-slate-950',
  'Wired':                  'from-zinc-700/90 to-zinc-950',
  'TechCrunch':             'from-emerald-900/90 to-emerald-950',
  'The Verge':              'from-orange-900/90 to-orange-950',
  'MIT Tech Review':        'from-red-950/90 to-slate-950',
  'VentureBeat AI':         'from-indigo-900/90 to-indigo-950',
  'The Decoder':            'from-violet-900/90 to-violet-950',
  'Ars Technica':           'from-red-900/90 to-slate-950',
  'AI Business':            'from-blue-900/90 to-slate-950',
  'Hacker News':            'from-orange-900/90 to-orange-950',
  'Variety':                'from-slate-700/90 to-slate-950',
  'Deadline':               'from-red-900/90 to-slate-950',
  'Collider':               'from-zinc-700/90 to-zinc-950',
  'IGN':                    'from-red-950/90 to-zinc-950',
  'Boing Boing':            'from-rose-900/90 to-rose-950',
  'Oddity Central':         'from-zinc-700/90 to-zinc-950',
  'Wisconsin Public Radio': 'from-teal-900/90 to-teal-950',
  'Urban Milwaukee':        'from-blue-950/90 to-slate-950',
};

const DEFAULT_GRADIENT = 'from-slate-700/90 to-slate-950';

function getGradient(source: string) {
  return SOURCE_GRADIENTS[source] ?? DEFAULT_GRADIENT;
}

// ─── Fallback placeholder ────────────────────────────────────────────────────
function Placeholder({
  source,
  title,
  mode,
}: {
  source: string;
  title: string;
  mode: 'hero' | 'thumb';
}) {
  const grad = getGradient(source);
  if (mode === 'thumb') {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center rounded-lg overflow-hidden`}>
        <span className="text-white/40 text-xs font-bold text-center px-1 leading-tight line-clamp-2">
          {source.charAt(0)}
        </span>
      </div>
    );
  }
  // Hero
  return (
    <div className={`w-full h-full bg-gradient-to-br ${grad} flex flex-col items-center justify-center gap-2 p-5`}>
      <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{source}</span>
      <p className="text-white/40 text-sm text-center leading-snug line-clamp-3 max-w-xs">{title}</p>
    </div>
  );
}

// ─── NewsImage ───────────────────────────────────────────────────────────────
interface NewsImageProps {
  src?: string | null;
  alt: string;
  source: string;
  title: string;
  mode: 'hero' | 'thumb';
  className?: string;
}

export default function NewsImage({ src, alt, source, title, mode, className = '' }: NewsImageProps) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return <Placeholder source={source} title={title} mode={mode} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {/* Show placeholder behind until loaded */}
      {!loaded && (
        <div className="absolute inset-0">
          <Placeholder source={source} title={title} mode={mode} />
        </div>
      )}
    </div>
  );
}
