import { SchoolDeadline } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { BookOpen } from 'lucide-react';

interface SchoolDeadlinesProps {
  deadlines?: SchoolDeadline[] | null;
}

function urgencyClasses(days: number, done: boolean): string {
  if (done) return 'opacity-40';
  if (days <= 1) return 'text-red-400';
  if (days <= 3) return 'text-amber-400';
  if (days <= 7) return 'text-blue-400';
  return 'text-slate-400';
}

function urgencyBadge(days: number, done: boolean): { variant: 'red' | 'amber' | 'blue' | 'slate' | 'green'; label: string } {
  if (done) return { variant: 'green', label: 'Done' };
  if (days <= 1) return { variant: 'red', label: days === 0 ? 'Today' : `${days}d` };
  if (days <= 3) return { variant: 'amber', label: `${days}d` };
  if (days <= 7) return { variant: 'blue', label: `${days}d` };
  return { variant: 'slate', label: `${days}d` };
}

function courseColor(course: string): string {
  const colors: Record<string, string> = {
    SQL: 'text-cyan-400',
    Stats: 'text-purple-400',
    Cybersecurity: 'text-amber-400',
  };
  return colors[course] ?? 'text-slate-400';
}

export default function SchoolDeadlines({ deadlines }: SchoolDeadlinesProps) {
  const active = (deadlines ?? []).filter((d) => !d.done).sort((a, b) => a.days - b.days);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="School Deadlines" />

      {active.length === 0 ? (
        <p className="text-slate-500 text-sm">No upcoming deadlines. 🎉</p>
      ) : (
        <div className="flex flex-col gap-2">
          {active.map((item, i) => {
            const { variant, label } = urgencyBadge(item.days, item.done);
            return (
              <div
                key={i}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
                  ${item.days <= 1 && !item.done ? 'bg-red-500/5 border-red-500/10' : ''}
                  ${item.days > 1 && item.days <= 3 && !item.done ? 'bg-amber-500/5 border-amber-500/10' : ''}
                  ${item.days > 3 && item.days <= 7 && !item.done ? 'bg-blue-500/5 border-blue-500/10' : ''}
                  ${item.days > 7 && !item.done ? 'bg-white/[0.02] border-white/[0.04]' : ''}
                  ${item.done ? 'bg-white/[0.01] border-white/[0.02] opacity-40' : ''}
                `}
              >
                <BookOpen size={14} className={`mt-0.5 shrink-0 ${courseColor(item.course)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${courseColor(item.course)}`}>
                      {item.course}
                    </span>
                    <span className={`text-sm ${item.done ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                      {item.desc}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${urgencyClasses(item.days, item.done)}`}>
                    {item.due_str}
                  </p>
                </div>
                <Badge variant={variant}>{label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
