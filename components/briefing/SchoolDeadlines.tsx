import { SchoolDeadline } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { BookOpen, CheckCircle2 } from 'lucide-react';

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

const COURSE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  SQL: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  Stats: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  Cybersecurity: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

function getCourseStyle(course: string) {
  return COURSE_COLORS[course] ?? { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
}

interface CourseProgress {
  course: string;
  total: number;
  done: number;
  percent: number;
}

function ProgressBar({ progress }: { progress: CourseProgress }) {
  const style = getCourseStyle(progress.course);
  let barColor = 'bg-emerald-500';
  if (progress.percent < 40) barColor = 'bg-red-500';
  else if (progress.percent < 70) barColor = 'bg-amber-500';

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold ${style.text} w-24 truncate`}>
        {progress.course}
      </span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <span className="flex items-center gap-1 text-[10px] text-slate-500 min-w-[48px] justify-end">
        <CheckCircle2 size={10} className="text-emerald-500" />
        {progress.done}/{progress.total}
      </span>
    </div>
  );
}

export default function SchoolDeadlines({ deadlines }: SchoolDeadlinesProps) {
  const all = deadlines ?? [];
  const active = all.filter((d) => !d.done).sort((a, b) => a.days - b.days);

  // Calculate per-course progress
  const courseMap = new Map<string, { total: number; done: number }>();
  for (const d of all) {
    const entry = courseMap.get(d.course) ?? { total: 0, done: 0 };
    entry.total++;
    if (d.done) entry.done++;
    courseMap.set(d.course, entry);
  }

  const courseProgress: CourseProgress[] = Array.from(courseMap.entries())
    .map(([course, { total, done }]) => ({
      course,
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    }))
    .sort((a, b) => a.percent - b.percent); // Show lowest progress first

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="School Deadlines" />

      {/* Course progress bars */}
      {courseProgress.length > 0 && (
        <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-white/[0.06]">
          {courseProgress.map((progress) => (
            <ProgressBar key={progress.course} progress={progress} />
          ))}
        </div>
      )}

      {active.length === 0 ? (
        <p className="text-slate-500 text-sm">No upcoming deadlines. 🎉</p>
      ) : (
        <div className="flex flex-col gap-2">
          {active.map((item, i) => {
            const { variant, label } = urgencyBadge(item.days, item.done);
            const style = getCourseStyle(item.course);
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
                <BookOpen size={14} className={`mt-0.5 shrink-0 ${style.text}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${style.text}`}>
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
