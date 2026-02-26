'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';

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

function getOverrideKey(item: SchoolDeadline): string {
  return `${item.due_date}:${item.desc}`;
}

function urgencyBadge(days: number, done: boolean) {
  if (done) return { variant: 'green' as const, label: 'Done' };
  if (days < 0) return { variant: 'red' as const, label: 'Overdue' };
  if (days <= 1) return { variant: 'red' as const, label: days === 0 ? 'Today' : '1d' };
  if (days <= 3) return { variant: 'amber' as const, label: `${days}d` };
  if (days <= 7) return { variant: 'blue' as const, label: `${days}d` };
  return { variant: 'slate' as const, label: `${days}d` };
}

function courseBg(course: string) {
  const l = course.toLowerCase();
  if (l.includes('sql')) return 'bg-cyan-500/5 border-cyan-500/10';
  if (l.includes('stat')) return 'bg-purple-500/5 border-purple-500/10';
  if (l.includes('visual')) return 'bg-amber-500/5 border-amber-500/10';
  if (l.includes('security')) return 'bg-orange-500/5 border-orange-500/10';
  if (l.includes('data')) return 'bg-amber-500/5 border-amber-500/10';
  return 'bg-white/[0.02] border-white/[0.04]';
}

interface DeadlineRowProps {
  item: SchoolDeadline;
  isChecked: boolean;
  onToggle: () => void;
}

function DeadlineRow({ item, isChecked, onToggle }: DeadlineRowProps) {
  const isDone = item.done || isChecked;
  const { variant, label } = urgencyBadge(item.days, isDone);

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
        ${isDone ? 'opacity-40 bg-white/[0.01] border-white/[0.02]' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'}
      `}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
        aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isDone ? (
          <CheckCircle2 size={15} className="text-emerald-500/60" />
        ) : (
          <Circle size={15} />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isDone ? 'line-through text-slate-600' : 'text-slate-200'}`}>
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

export default function SchoolPageClient({ courses, courseProgress }: SchoolPageClientProps) {
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [mounted, setMounted] = useState(false);

  // Load overrides from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOverrides(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  // Save overrides to localStorage when they change
  const saveOverrides = useCallback((newOverrides: OverrideMap) => {
    setOverrides(newOverrides);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOverrides));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleOverride = useCallback(
    (item: SchoolDeadline) => {
      const key = getOverrideKey(item);
      const newOverrides = { ...overrides };
      if (newOverrides[key]) {
        delete newOverrides[key];
      } else {
        newOverrides[key] = true;
      }
      saveOverrides(newOverrides);
    },
    [overrides, saveOverrides]
  );

  const isChecked = useCallback(
    (item: SchoolDeadline) => {
      const key = getOverrideKey(item);
      return overrides[key] === true;
    },
    [overrides]
  );

  // Calculate updated progress based on overrides
  const getUpdatedProgress = useCallback(
    (course: string, items: SchoolDeadline[]) => {
      const done = items.filter((d) => d.done || isChecked(d)).length;
      const total = items.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { done, total, pct };
    },
    [isChecked]
  );

  const courseNames = Object.keys(courses);

  return (
    <div className="flex flex-col gap-6">
      {courseNames.map((course) => {
        const items = courses[course];
        const { done, total, pct } = getUpdatedProgress(course, items);

        // Sort: active items first (by days), then completed
        const active = items
          .filter((d) => !d.done && !isChecked(d))
          .sort((a, b) => a.days - b.days);
        const completed = items.filter((d) => d.done || isChecked(d));

        return (
          <div key={course} className={`rounded-xl border p-5 ${courseBg(course)}`}>
            <SectionHeader title={course} subtitle={`${done}/${total} done`} />

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
                <DeadlineRow
                  key={`active-${i}`}
                  item={item}
                  isChecked={isChecked(item)}
                  onToggle={() => toggleOverride(item)}
                />
              ))}
              {/* Then completed */}
              {completed.map((item, i) => (
                <DeadlineRow
                  key={`done-${i}`}
                  item={item}
                  isChecked={isChecked(item)}
                  onToggle={() => toggleOverride(item)}
                />
              ))}
            </div>

            {/* Local storage note */}
            {mounted && (
              <p className="text-xs text-slate-600 mt-4 text-center">
                Checkmarks are saved locally in your browser
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
