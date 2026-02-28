'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface CourseProgress {
  course: string;
  total: number;
  done: number;
  percent: number;
}

interface SchoolPageClientProps {
  courses: Record<string, SchoolDeadline[]>;
  courseProgress: CourseProgress[];
}

const STORAGE_KEY = 'school-done-overrides';
type OverrideMap = Record<string, boolean>;

function getKey(item: SchoolDeadline): string {
  return `${item.due_date}:${item.desc}`;
}

function urgencyBadge(days: number, done: boolean) {
  if (done) return { variant: 'green' as const, label: 'Done' };
  if (days < 0) return { variant: 'red' as const, label: 'Overdue' };
  if (days === 0) return { variant: 'red' as const, label: 'Today' };
  if (days === 1) return { variant: 'amber' as const, label: '1d' };
  if (days <= 3) return { variant: 'yellow' as const, label: `${days}d` };
  if (days <= 7) return { variant: 'blue' as const, label: `${days}d` };
  return { variant: 'slate' as const, label: `${days}d` };
}

const COURSE_ACCENTS: Record<string, string> = {
  sql:     'from-cyan-500/10 border-cyan-500/15 [--accent:#22d3ee]',
  stat:    'from-violet-500/10 border-violet-500/15 [--accent:#a78bfa]',
  visual:  'from-amber-500/10 border-amber-500/15 [--accent:#fbbf24]',
  data:    'from-amber-500/10 border-amber-500/15 [--accent:#fbbf24]',
};

function getCourseAccent(course: string) {
  const l = course.toLowerCase();
  for (const [key, val] of Object.entries(COURSE_ACCENTS)) {
    if (l.includes(key)) return val;
  }
  return 'from-slate-500/10 border-slate-500/15 [--accent:#94a3b8]';
}

function CourseHeader({ course, done, total, pct, collapsed, onToggle }: {
  course: string; done: number; total: number; pct: number;
  collapsed: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
      aria-label={collapsed ? `Expand ${course}` : `Collapse ${course}`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate">
          {course}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden max-w-[120px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-600 font-mono shrink-0">{done}/{total}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pct === 100 && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            Complete
          </span>
        )}
        {collapsed ? <ChevronDown size={14} className="text-slate-600" /> : <ChevronUp size={14} className="text-slate-600" />}
      </div>
    </button>
  );
}

function DeadlineRow({ item, isDone, onToggle }: {
  item: SchoolDeadline; isDone: boolean; onToggle: () => void;
}) {
  const { variant, label } = urgencyBadge(item.days, isDone);

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
        isDone
          ? 'opacity-35'
          : 'hover:bg-white/[0.03] cursor-default'
      }`}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0 text-slate-700 hover:text-slate-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500/50 focus-visible:rounded"
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
      >
        {isDone
          ? <CheckCircle2 size={15} className="text-emerald-500/50" />
          : <Circle size={15} />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isDone ? 'line-through text-slate-600' : 'text-slate-200'}`}>
          {item.desc}
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">{item.due_str}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        {(item.weight === 'critical' || item.weight === 'high') && (
          <Badge variant={item.weight === 'critical' ? 'red' : 'amber'}>
            {item.weight === 'critical' ? '!' : 'H'}
          </Badge>
        )}
        <Badge variant={variant}>{label}</Badge>
      </div>
    </div>
  );
}

export default function SchoolPageClient({ courses }: SchoolPageClientProps) {
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setOverrides(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveOverrides = useCallback((next: OverrideMap) => {
    setOverrides(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const toggleItem = useCallback((item: SchoolDeadline) => {
    const k = getKey(item);
    const next = { ...overrides };
    const newDone = !next[k];
    newDone ? (next[k] = true) : delete next[k];
    saveOverrides(next);
    // Persist server-side (fire-and-forget)
    fetch('/api/deadlines/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ due_date: item.due_date, desc: item.desc, done: newDone }),
    }).catch(() => { /* localStorage is the fallback */ });
  }, [overrides, saveOverrides]);

  const isChecked = (item: SchoolDeadline) => overrides[getKey(item)] === true;
  const isDone    = (item: SchoolDeadline) => item.done || isChecked(item);

  const toggleCollapse = (course: string) =>
    setCollapsed((prev) => ({ ...prev, [course]: !prev[course] }));

  return (
    <div className="flex flex-col gap-4">
      {Object.keys(courses).map((course) => {
        const items = courses[course];
        const doneCount = items.filter(isDone).length;
        const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;
        const isCollapsed = collapsed[course] ?? false;
        const accent = getCourseAccent(course);

        const active    = items.filter((d) => !isDone(d)).sort((a, b) => a.days - b.days);
        const completed = items.filter(isDone);

        return (
          <div
            key={course}
            className={`rounded-2xl border bg-gradient-to-br ${accent} bg-[var(--card)] overflow-hidden`}
          >
            {/* Course header */}
            <div className="px-5 py-4">
              <CourseHeader
                course={course}
                done={doneCount}
                total={items.length}
                pct={pct}
                collapsed={isCollapsed}
                onToggle={() => toggleCollapse(course)}
              />
            </div>

            {/* Items */}
            {!isCollapsed && (
              <div className="px-3 pb-4 border-t border-white/[0.04]">
                <div className="mt-2 flex flex-col gap-0.5">
                  {active.map((item, i) => (
                    <DeadlineRow
                      key={`a-${i}`}
                      item={item}
                      isDone={isDone(item)}
                      onToggle={() => toggleItem(item)}
                    />
                  ))}
                  {completed.length > 0 && active.length > 0 && (
                    <div className="my-1 mx-3 h-px bg-white/[0.04]" />
                  )}
                  {completed.map((item, i) => (
                    <DeadlineRow
                      key={`d-${i}`}
                      item={item}
                      isDone={isDone(item)}
                      onToggle={() => toggleItem(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-[10px] text-slate-700 text-center pt-1">
        Check marks saved in your browser
      </p>
    </div>
  );
}
