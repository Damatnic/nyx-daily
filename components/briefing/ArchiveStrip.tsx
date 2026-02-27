import Link from 'next/link';
import type { BriefingPreview } from '@/lib/data';

function parseWeatherEmoji(w: string) {
  return w.match(/^(\S+)\s/)?.[1] ?? '🌡️';
}
function parseTemp(w: string) {
  return w.match(/(\d+)°F/)?.[1] ?? '--';
}
function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ArchiveStrip({ previews }: { previews: BriefingPreview[] }) {
  if (!previews.length) return null;

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Previous Briefings</span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.07] to-transparent" />
        <Link href="/archive" className="text-[10px] text-slate-700 hover:text-violet-400 transition-colors shrink-0">
          All →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {previews.slice(0, 6).map(p => (
          <Link
            key={p.date}
            href={`/day/${p.date}`}
            className="group nyx-card p-3.5 hover:border-white/[0.12] transition-all duration-200 block"
          >
            {/* Date + weather */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400 transition-colors">
                {fmtDate(p.date)}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs leading-none">{parseWeatherEmoji(p.weather)}</span>
                <span className="text-[10px] font-mono text-slate-600">{parseTemp(p.weather)}°</span>
              </div>
            </div>

            {/* Day label */}
            <p className="text-[9px] uppercase tracking-wider text-slate-700 mb-1.5">{p.day}</p>

            {/* Top headline */}
            <p className="text-[11px] text-slate-500 group-hover:text-slate-400 line-clamp-3 leading-snug transition-colors">
              {p.topHeadline || 'View briefing'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
