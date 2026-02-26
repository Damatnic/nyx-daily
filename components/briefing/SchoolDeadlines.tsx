import Link from 'next/link';
import { SchoolDeadline } from '@/lib/types';

interface Props {
  deadlines?: SchoolDeadline[] | null;
}

function dot(days: number): string {
  if (days === 0)  return 'bg-red-500';
  if (days <= 1)   return 'bg-red-400';
  if (days <= 3)   return 'bg-amber-400';
  if (days <= 7)   return 'bg-blue-400';
  return 'bg-slate-600';
}

function dayLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tmrw';
  return `${days}d`;
}

function courseShort(course: string): string {
  const l = course.toLowerCase();
  if (l.includes('sql'))   return 'SQL';
  if (l.includes('stat'))  return 'Stats';
  if (l.includes('visual') || l.includes('data viz')) return 'DataViz';
  return course.split(' ')[0];
}

export default function SchoolDeadlines({ deadlines }: Props) {
  const all = deadlines ?? [];
  const upcoming = all
    .filter(d => !d.done && d.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const total  = all.length;
  const done   = all.filter(d => d.done).length;
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="nyx-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600">School</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600">{done}/{total}</span>
          <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-xs text-slate-600 py-2">Nothing due soon. 🎉</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {upcoming.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot(item.days)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-300 truncate leading-snug">{item.desc}</p>
                <p className="text-[9px] text-slate-600">{courseShort(item.course)}</p>
              </div>
              <span className={`text-[9px] font-bold shrink-0 font-mono ${
                item.days === 0 ? 'text-red-400' : item.days <= 3 ? 'text-amber-400' : 'text-slate-600'
              }`}>
                {dayLabel(item.days)}
              </span>
            </div>
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <Link href="/school"
          className="block text-center text-[10px] text-slate-700 hover:text-violet-400 transition-colors mt-3 pt-3 border-t border-white/[0.04]">
          View all deadlines →
        </Link>
      )}
    </div>
  );
}
