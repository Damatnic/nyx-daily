import { getSchoolDeadlines } from '@/lib/data';
import { SchoolDeadline } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';

export const dynamic = 'force-dynamic';

function urgencyBadge(days: number, done: boolean) {
  if (done) return { variant: 'green' as const, label: 'Done' };
  if (days < 0) return { variant: 'red' as const, label: 'Overdue' };
  if (days <= 1) return { variant: 'red' as const, label: days === 0 ? 'Today' : '1d' };
  if (days <= 3) return { variant: 'amber' as const, label: `${days}d` };
  if (days <= 7) return { variant: 'blue' as const, label: `${days}d` };
  return { variant: 'slate' as const, label: `${days}d` };
}

function courseColor(course: string) {
  const map: Record<string, string> = {
    SQL: 'text-cyan-400',
    Stats: 'text-purple-400',
    Cybersecurity: 'text-amber-400',
  };
  return map[course] ?? 'text-slate-400';
}

function courseBg(course: string) {
  const map: Record<string, string> = {
    SQL: 'bg-cyan-500/5 border-cyan-500/10',
    Stats: 'bg-purple-500/5 border-purple-500/10',
    Cybersecurity: 'bg-amber-500/5 border-amber-500/10',
  };
  return map[course] ?? 'bg-white/[0.02] border-white/[0.04]';
}

function DeadlineRow({ item }: { item: SchoolDeadline }) {
  const { variant, label } = urgencyBadge(item.days, item.done);
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
        ${item.done ? 'opacity-40 bg-white/[0.01] border-white/[0.02]' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'}
      `}
    >
      <div className="mt-0.5 shrink-0 text-slate-600">
        {item.done
          ? <CheckCircle2 size={15} className="text-emerald-500/60" />
          : <Circle size={15} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${item.done ? 'line-through text-slate-600' : 'text-slate-200'}`}>
          {item.desc}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{item.due_str}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.weight === 'critical' && <Badge variant="red">Critical</Badge>}
        {item.weight === 'high' && <Badge variant="amber">High</Badge>}
        <Badge variant={variant}>{label}</Badge>
      </div>
    </div>
  );
}

export default async function SchoolPage() {
  const all = await getSchoolDeadlines();

  // Group by course
  const courses = Array.from(new Set(all.map((d: SchoolDeadline) => d.course)));

  const grouped = courses.reduce<Record<string, SchoolDeadline[]>>((acc, course) => {
    acc[course] = all.filter((d: SchoolDeadline) => d.course === course);
    return acc;
  }, {});

  // Stats
  const total = all.length;
  const done = all.filter((d: SchoolDeadline) => d.done).length;
  const overdue = all.filter((d: SchoolDeadline) => !d.done && d.days < 0).length;
  const urgent = all.filter((d: SchoolDeadline) => !d.done && d.days >= 0 && d.days <= 3).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">School Deadlines</h1>
        <p className="text-slate-400 mt-1">Track every assignment, quiz, and project.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: total, color: 'text-slate-300' },
          { label: 'Completed', value: done, color: 'text-emerald-400' },
          { label: 'Overdue', value: overdue, color: 'text-red-400' },
          { label: 'Due Soon (3d)', value: urgent, color: 'text-amber-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-4 text-center"
          >
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Overall Progress</span>
          <span className="text-sm font-bold text-slate-200">{done}/{total}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-500"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          {total > 0 ? Math.round((done / total) * 100) : 0}% complete
        </p>
      </div>

      {/* By course */}
      <div className="flex flex-col gap-6">
        {courses.map((course) => {
          const items = grouped[course] as SchoolDeadline[];
          const courseDone = items.filter((d) => d.done).length;
          const courseTotal = items.length;
          const pct = courseTotal > 0 ? Math.round((courseDone / courseTotal) * 100) : 0;
          const active = items.filter((d) => !d.done).sort((a, b) => a.days - b.days);
          const completed = items.filter((d) => d.done);

          return (
            <div key={course} className={`rounded-xl border p-5 ${courseBg(course)}`}>
              <SectionHeader
                title={course}
                subtitle={`${courseDone}/${courseTotal} done`}
              />

              {/* Course progress bar */}
              <div className="mb-4">
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* Active first */}
                {active.map((item, i) => (
                  <DeadlineRow key={`active-${i}`} item={item} />
                ))}
                {/* Then completed */}
                {completed.map((item, i) => (
                  <DeadlineRow key={`done-${i}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
