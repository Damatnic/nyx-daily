'use client';

import { useRef, useState } from 'react';
import { AppOfTheDay as AppType } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface Props { app: AppType; }

function AppLogo({ link, name }: { link: string; name: string }) {
  const [err, setErr] = useState(false);
  let domain = '';
  try { domain = new URL(link).hostname.replace('www.', ''); } catch {}
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;
  const initial = name.charAt(0).toUpperCase();
  const colors  = ['bg-violet-600','bg-cyan-600','bg-emerald-600','bg-amber-600','bg-rose-600','bg-indigo-600'];
  const color   = colors[name.charCodeAt(0) % colors.length];

  if (!logoUrl || err) {
    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${color} shrink-0`}>
        {initial}
      </div>
    );
  }
  return (
    <img src={logoUrl} alt={name} width={48} height={48}
      className="w-12 h-12 rounded-xl object-contain bg-white/[0.06] shrink-0"
      onError={() => setErr(true)} />
  );
}

function PriceBadge({ app }: { app: AppType }) {
  if (app.free)     return <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">Free</span>;
  if (app.freemium) return <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">Freemium</span>;
  return <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/20 rounded-full px-2 py-0.5">Paid</span>;
}

export default function AppOfTheDay({ app }: Props) {
  return (
    <div className="nyx-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600 mb-3">App of the Day</p>
        <div className="flex items-center gap-3">
          <AppLogo link={app.link} name={app.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-100">{app.name}</h3>
              <PriceBadge app={app} />
            </div>
            <span className="text-[10px] text-violet-400/80 font-semibold uppercase tracking-wider">
              {app.category}
            </span>
          </div>
          <a href={app.link} target="_blank" rel="noopener noreferrer"
            className="shrink-0 p-2 rounded-lg bg-white/[0.04] hover:bg-violet-500/15 text-slate-600 hover:text-violet-400 border border-white/[0.06] transition-all duration-150">
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Body — no section labels, just flowing text */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-sm text-slate-300 leading-relaxed">{app.what}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{app.why}</p>
        <div className="border-l-2 border-violet-500/30 pl-3 mt-1">
          <p className="text-sm text-slate-300 leading-relaxed italic">{app.verdict}</p>
        </div>
      </div>
    </div>
  );
}
