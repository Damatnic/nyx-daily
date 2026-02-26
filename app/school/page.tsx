import { getSchoolDeadlines } from '@/lib/data';
import { SchoolDeadline } from '@/lib/types';
import Navbar from '@/components/nav/Navbar';
import SchoolPageClient from '@/components/school/SchoolPageClient';

export const dynamic = 'force-dynamic';

const COURSE_STYLES: Record<string, { accent: string; bg: string; border: string; dot: string }> = {
  sql:     { accent: 'text-cyan-400',   bg: 'bg-cyan-500/8',   border: 'border-cyan-500/15',   dot: 'bg-cyan-500' },
  stat:    { accent: 'text-violet-400', bg: 'bg-violet-500/8', border: 'border-violet-500/15', dot: 'bg-violet-500' },
  visual:  { accent: 'text-amber-400',  bg: 'bg-amber-500/8',  border: 'border-amber-500/15',  dot: 'bg-amber-500' },
  data:    { accent: 'text-amber-400',  bg: 'bg-amber-500/8',  border: 'border-amber-500/15',  dot: 'bg-amber-500' },
  default: { accent: 'text-slate-400',  bg: 'bg-slate-500/8',  border: 'border-slate-500/15',  dot: 'bg-slate-500' },
};

function getCourseStyle(course: string) {
  const l = course.toLowerCase();
  for (const [key, val] of Object.entries(COURSE_STYLES)) {
    if (key !== 'default' && l.includes(key)) return val;
  }
  return COURSE_STYLES.default;
}

export default async function SchoolPage() {
  const all = await getSchoolDeadlines();
  const courses = Array.from(new Set(all.map((d: SchoolDeadline) => d.course)));

  const grouped = courses.reduce<Record<string, SchoolDeadline[]>>((acc, course) => {
    acc[course] = all.filter((d: SchoolDeadline) => d.course === course);
    return acc;
  }, {});

  const total   = all.length;
  const done    = all.filter((d) => d.done).length;
  const overdue = all.filter((d) => !d.done && d.days < 0).length;
  const urgent  = all.filter((d) => !d.done && d.days >= 0 && d.days <= 3).length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  // Next 5 upcoming items (undone, not overdue)
  const upNext = all
    .filter((d) => !d.done && d.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  const courseProgress = courses.map((course) => {
    const items = grouped[course];
    const courseDone = items.filter((d) => d.done).length;
    return {
      course,
      total: items.length,
      done: courseDone,
      percent: items.length > 0 ? Math.round((courseDone / items.length) * 100) : 0,
    };
  });

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-10">

        {/* ── Page header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              WCTC · Spring 2026
            </span>
            <span className="h-px flex-1 bg-white/[0.04]" />
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              overdue > 0 ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'
            }`}>
              {overdue > 0 ? `${overdue} overdue` : 'On track'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">School</h1>
        </div>

        {/* ── Semester stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',       value: total,   color: 'text-slate-200' },
            { label: 'Done',        value: done,    color: 'text-emerald-400' },
            { label: 'Due Soon',    value: urgent,  color: 'text-amber-400' },
            { label: 'Overdue',     value: overdue, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] px-4 py-3 flex flex-col gap-0.5">
              <span className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Overall progress ── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] px-5 py-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Semester Progress</span>
            <span className="text-xs font-bold text-slate-300 font-mono">{done}/{total} · {pct}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Per-course mini bars */}
          <div className="mt-3 flex flex-col gap-1.5">
            {courseProgress.map(({ course, done: cd, total: ct, percent }) => {
              const style = getCourseStyle(course);
              return (
                <div key={course} className="flex items-center gap-3">
                  <span className={`text-xs w-36 truncate font-medium ${style.accent}`}>{course}</span>
                  <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${style.dot}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono w-10 text-right">{cd}/{ct}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Up Next ── */}
        {upNext.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">Up Next</span>
              <span className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <div className="flex flex-col gap-2">
              {upNext.map((item, i) => {
                const style = getCourseStyle(item.course);
                const isToday = item.days === 0;
                const isTmrw  = item.days === 1;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${style.bg} ${style.border} transition-all duration-200`}
                  >
                    {/* Day badge */}
                    <div className="shrink-0 w-12 text-center">
                      {isToday ? (
                        <span className="text-[10px] font-black uppercase text-red-400 bg-red-500/15 border border-red-500/20 rounded px-1.5 py-0.5">Today</span>
                      ) : isTmrw ? (
                        <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/20 rounded px-1.5 py-0.5">Tmrw</span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">{item.days}d</span>
                      )}
                    </div>
                    {/* Divider dot */}
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium truncate">{item.desc}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{item.course}</p>
                    </div>
                    {/* Due time */}
                    <span className="text-xs text-slate-600 shrink-0 hidden sm:block">{item.due_str}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── By course — interactive checkoffs ── */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">All Assignments</span>
          <span className="h-px flex-1 bg-white/[0.04]" />
        </div>

        <SchoolPageClient courses={grouped} courseProgress={courseProgress} />
      </div>
    </>
  );
}
