'use client';

import { useRef, useState } from 'react';
import { AppOfTheDay as AppType } from '@/lib/types';

interface AppOfTheDayProps {
  app: AppType;
}

function getPriceBadge(app: AppType) {
  if (app.free) {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
        Free
      </span>
    );
  }
  if (app.freemium) {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
        Freemium
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 rounded-full px-2 py-0.5">
      Paid
    </span>
  );
}

function AppLogo({ link, name }: { link: string; name: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  let domain = '';
  try {
    domain = new URL(link).hostname.replace('www.', '');
  } catch {
    domain = '';
  }

  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;
  const initial = name.charAt(0).toUpperCase();

  const fallbackColors = [
    'bg-violet-600', 'bg-cyan-600', 'bg-emerald-600',
    'bg-amber-600', 'bg-rose-600', 'bg-indigo-600',
  ];
  const colorIdx = name.charCodeAt(0) % fallbackColors.length;

  if (!logoUrl || showFallback) {
    return (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${fallbackColors[colorIdx]}`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={logoUrl}
      alt={name}
      width={40}
      height={40}
      className="w-10 h-10 rounded-lg object-contain bg-white/5"
      onError={() => setShowFallback(true)}
    />
  );
}

export default function AppOfTheDay({ app }: AppOfTheDayProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] overflow-hidden">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-violet-600/10 to-cyan-600/5 px-5 pt-5 pb-4 border-b border-white/[0.06]">
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            🛠️ App of the Day
          </span>
          {getPriceBadge(app)}
        </div>

        {/* App identity row */}
        <div className="flex items-center gap-3">
          <AppLogo link={app.link} name={app.name} />
          <div>
            <h3 className="text-slate-100 font-bold text-lg leading-tight">{app.name}</h3>
            <span className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold bg-violet-500/10 rounded px-1.5 py-0.5 mt-1 inline-block">
              {app.category}
            </span>
          </div>
        </div>
      </div>

      {/* Body sections */}
      <div className="p-5 flex flex-col gap-4">
        {/* What it is */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
            📌 What it is
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{app.what}</p>
        </div>

        {/* Why it matters */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
            ⚡ Why it matters
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{app.why}</p>
        </div>

        {/* The verdict */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
            ✅ The Verdict
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{app.verdict}</p>
        </div>

        {/* CTA button */}
        <div className="pt-1">
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Try it free →
          </a>
        </div>
      </div>
    </div>
  );
}
