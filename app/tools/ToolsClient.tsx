'use client';

import { useState } from 'react';
import { AppOfTheDay } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'Coding', 'Productivity', 'Data', 'Cybersecurity', 'Creative'];

const CAT_COLORS: Record<string, string> = {
  AI: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  Coding: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Productivity: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Data: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Cybersecurity: 'text-red-400 bg-red-500/10 border-red-500/20',
  Creative: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

function getCatStyle(cat: string) {
  for (const [key, val] of Object.entries(CAT_COLORS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}

function AppLogo({ link, name }: { link: string; name: string }) {
  const [err, setErr] = useState(false);
  let domain = '';
  try { domain = new URL(link).hostname.replace('www.', ''); } catch {}
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;
  const colors = ['bg-violet-700','bg-cyan-700','bg-emerald-700','bg-amber-700','bg-rose-700','bg-indigo-700'];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (!logoUrl || err) {
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base ${color} shrink-0`}>
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <img src={logoUrl} alt={name} width={40} height={40}
      className="w-10 h-10 rounded-xl object-contain bg-white/5 shrink-0"
      onError={() => setErr(true)} />
  );
}

interface ToolsClientProps {
  apps: Array<{ date: string; app: AppOfTheDay; isToday: boolean }>;
}

export default function ToolsClient({ apps }: ToolsClientProps) {
  const [cat, setCat] = useState('All');

  if (!apps.length) return (
    <div className="text-center py-20 text-slate-600">No tools archived yet.</div>
  );

  const filtered = cat === 'All'
    ? apps
    : apps.filter(a => a.app.category.toLowerCase().includes(cat.toLowerCase()));

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 border ${
              cat === c
                ? 'bg-violet-600/70 border-violet-500/40 text-white'
                : 'border-white/[0.06] text-slate-600 hover:text-slate-300 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-700 font-mono shrink-0">{filtered.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-600 text-sm">No {cat} tools yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(({ date, app, isToday }, i) => (
            <div
              key={i}
              className={`nyx-card flex flex-col gap-0 overflow-hidden card-lift ${isToday ? 'border-violet-500/15' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 p-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3 min-w-0">
                  <AppLogo link={app.link} name={app.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate">{app.name}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {isToday ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-1.5 rounded-lg text-slate-700 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-150"
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-black uppercase tracking-wider border rounded px-1.5 py-0.5 ${getCatStyle(app.category)}`}>
                    {app.category}
                  </span>
                  {app.free && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 rounded px-1.5 py-0.5 uppercase tracking-wider">Free</span>}
                  {app.freemium && !app.free && <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/15 rounded px-1.5 py-0.5 uppercase tracking-wider">Freemium</span>}
                  {!app.free && !app.freemium && <span className="text-[9px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/15 rounded px-1.5 py-0.5 uppercase tracking-wider">Paid</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">{app.verdict}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
