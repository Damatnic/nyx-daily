'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Check } from 'lucide-react';
import type { SchoolDeadline } from '@/lib/types';

// ── Helpers (same as SchoolDeadlines) ─────────────────────────────────────────
const STORAGE_KEY = 'nyx_done_assignments';
function makeKey(item: SchoolDeadline) { return `${item.course}::${item.desc}`; }
function loadDoneSet(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')); }
  catch { return new Set(); }
}
function saveDoneSet(s: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])); } catch {}
}
function courseShort(course: string) {
  const l = course.toLowerCase();
  if (l.includes('sql'))                         return 'SQL';
  if (l.includes('stat'))                        return 'Stats';
  if (l.includes('visual') || l.includes('viz')) return 'DataViz';
  return course.split(' ')[0];
}
function dayLabel(days: number) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tmrw';
  return `${days}d`;
}
function urgentCls(days: number) {
  if (days === 0) return 'text-red-400';
  if (days <= 1)  return 'text-red-400/70';
  if (days <= 3)  return 'text-amber-400';
  return 'text-slate-600';
}
function checkboxCls(days: number) {
  if (days <= 1) return 'border-red-500/60 hover:bg-red-500/15';
  if (days <= 3) return 'border-amber-400/50 hover:bg-amber-400/15';
  return 'border-white/[0.14] hover:bg-white/[0.04]';
}

// ── Calendar event parser ──────────────────────────────────────────────────────
function hasRealEvents(events?: string[] | null) {
  if (!events?.length) return false;
  return !events.every(e => !e.trim() || e.toLowerCase().includes('no events') || e.toLowerCase().includes('clear'));
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props {
  deadlines?: SchoolDeadline[] | null;
  events?: string[] | null;
  gmailSummary?: string | null;
}

export default function AgendaCard({ deadlines, events, gmailSummary }: Props) {
  const all = deadlines ?? [];
  const [localDone, setLocalDone] = useState<Set<string>>(new Set());
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  useEffect(() => { setLocalDone(loadDoneSet()); }, []);

  const isDone   = (item: SchoolDeadline) => item.done || localDone.has(makeKey(item));
  const isFading = (item: SchoolDeadline) => fadingOut.has(makeKey(item));

  const toggle = (item: SchoolDeadline) => {
    const key  = makeKey(item);
    const next = new Set(localDone);
    if (next.has(key)) {
      next.delete(key);
      setLocalDone(next); saveDoneSet(next);
      fetch('/api/deadlines/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: item.due_date, desc: item.desc, done: false }) }).catch(() => {});
    } else {
      next.add(key);
      setLocalDone(next); saveDoneSet(next);
      setFadingOut(prev => new Set([...prev, key]));
      setTimeout(() => setFadingOut(prev => { const s = new Set(prev); s.delete(key); return s; }), 400);
      fetch('/api/deadlines/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: item.due_date, desc: item.desc, done: true }) }).catch(() => {});
    }
  };

  const upcoming  = all
    .filter(d => (!isDone(d) || isFading(d)) && d.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const doneCount = all.filter(isDone).length;
  const total     = all.length;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const realEvents = hasRealEvents(events);

  if (!realEvents && !gmailSummary && upcoming.length === 0) return null;

  return (
    <div className="nyx-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-violet-400/60" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Agenda</span>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-700">{doneCount}/{total}</span>
            <div className="w-10 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Calendar events */}
      {(realEvents || gmailSummary) && (
        <div className="px-4 py-3 border-b border-white/[0.04] flex flex-col gap-1.5">
          {gmailSummary && (
            <p className="text-[11px] text-slate-500 leading-snug italic">{gmailSummary}</p>
          )}
          {realEvents && events!.filter(e => e.trim() && !e.toLowerCase().includes('no events')).map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[9px] text-violet-400/60 font-bold shrink-0 mt-0.5">▸</span>
              <span className="text-[12px] text-slate-400 leading-snug">{ev}</span>
            </div>
          ))}
        </div>
      )}

      {/* School deadlines */}
      {upcoming.length > 0 ? (
        <div className="flex flex-col divide-y divide-white/[0.03]">
          {upcoming.map(item => {
            const fading = isFading(item);
            return (
              <div
                key={makeKey(item)}
                className={`flex items-center gap-2.5 px-4 py-2.5 transition-all duration-300 ${
                  fading ? 'opacity-0 translate-x-1' : ''
                }`}
              >
                <button
                  onClick={() => toggle(item)}
                  className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-150 ${
                    fading ? 'bg-emerald-500/30 border-emerald-500/60' : checkboxCls(item.days)
                  }`}
                >
                  {fading && <Check size={8} className="text-emerald-400" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] truncate leading-snug ${fading ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                    {item.desc}
                  </p>
                  <p className="text-[9px] text-slate-700">{courseShort(item.course)}</p>
                </div>

                <span className={`text-[9px] font-bold shrink-0 font-mono ${urgentCls(item.days)}`}>
                  {dayLabel(item.days)}
                </span>
              </div>
            );
          })}
        </div>
      ) : realEvents || gmailSummary ? null : (
        <p className="text-[11px] text-slate-700 px-4 py-3">Nothing due soon 🎉</p>
      )}

      {upcoming.length > 0 && (
        <Link href="/school"
          className="block text-center text-[10px] text-slate-700 hover:text-violet-400 transition-colors px-4 py-2.5 border-t border-white/[0.04]">
          View all school →
        </Link>
      )}
    </div>
  );
}
