/**
 * Shared deadline state helpers.
 * Used by AgendaCard and SchoolDeadlines — single source of truth.
 */
import type { SchoolDeadline } from './types';

export const DONE_STORAGE_KEY = 'nyx_done_assignments';

export function makeDeadlineKey(item: SchoolDeadline): string {
  return `${item.course}::${item.desc}`;
}

export function loadDoneSet(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_STORAGE_KEY) ?? '[]')); }
  catch { return new Set(); }
}

export function saveDoneSet(s: Set<string>): void {
  try { localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify([...s])); } catch {}
}

export function courseShort(course: string): string {
  const l = course.toLowerCase();
  if (l.includes('sql'))                         return 'SQL';
  if (l.includes('stat'))                        return 'Stats';
  if (l.includes('visual') || l.includes('viz')) return 'DataViz';
  return course.split(' ')[0];
}

export function dayLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tmrw';
  return `${days}d`;
}

export function urgentCls(days: number): string {
  if (days === 0) return 'text-red-400';
  if (days <= 1)  return 'text-red-400/70';
  if (days <= 3)  return 'text-amber-400';
  return 'text-slate-600';
}

export function checkboxCls(days: number): string {
  if (days <= 1) return 'border-red-500/60 hover:bg-red-500/15';
  if (days <= 3) return 'border-amber-400/50 hover:bg-amber-400/15';
  return 'border-white/[0.14] hover:bg-white/[0.04]';
}

export function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return ''; }
}
