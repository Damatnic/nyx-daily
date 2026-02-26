import { getSchoolDeadlines } from '@/lib/data';
import { SchoolDeadline } from '@/lib/types';
import Navbar from '@/components/nav/Navbar';
import SchoolPageClient from '@/components/school/SchoolPageClient';

export const dynamic = 'force-dynamic';

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
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
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

      {/* By course - interactive with localStorage checkoffs */}
      <SchoolPageClient
        courses={grouped}
        courseProgress={courses.map((course) => {
          const items = grouped[course];
          const courseDone = items.filter((d) => d.done).length;
          return {
            course,
            total: items.length,
            done: courseDone,
            percent: items.length > 0 ? Math.round((courseDone / items.length) * 100) : 0,
          };
        })}
      />
    </div>
    </>
  );
}
