import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROGRESS_FILE = path.join(
  process.env.HOME || '/Users/damato',
  '.openclaw/workspace/data/workout-progress.json'
);

const ROUTINE_FILE = path.join(process.cwd(), 'public/data/workout-routine.json');

interface Progress {
  routine_start_date: string;
  cycle_position: number;
  completed_dates: string[];
  skipped_dates: string[];
  walk_dates: string[];
  breathwork_start_date: string;
  breathwork_completed_dates: string[];
}

function readProgress(): Progress {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {
      routine_start_date:          new Date().toISOString().slice(0, 10),
      cycle_position:              0,
      completed_dates:             [],
      skipped_dates:               [],
      walk_dates:                  [],
      breathwork_start_date:       new Date().toISOString().slice(0, 10),
      breathwork_completed_dates:  [],
    };
  }
}

function readCycleLength(): number {
  try {
    const r = JSON.parse(fs.readFileSync(ROUTINE_FILE, 'utf8'));
    return r.cycle?.length ?? 7;
  } catch { return 7; }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action: 'complete' | 'skip' | 'walk' | 'breathwork' = body.action ?? 'complete';
  const today = new Date().toISOString().slice(0, 10);

  const progress = readProgress();
  const cycleLen = readCycleLength();

  if (action === 'walk') {
    if (!progress.walk_dates.includes(today)) {
      progress.walk_dates.push(today);
    } else {
      // Toggle off
      progress.walk_dates = progress.walk_dates.filter(d => d !== today);
    }
  } else if (action === 'breathwork') {
    if (!progress.breathwork_completed_dates.includes(today)) {
      progress.breathwork_completed_dates.push(today);
    }
  } else if (action === 'complete') {
    if (!progress.completed_dates.includes(today)) {
      progress.completed_dates.push(today);
    }
    // Advance cycle only if today hasn't been advanced yet
    if (!progress.completed_dates.includes(today) || body.force_advance) {
      progress.cycle_position = (progress.cycle_position + 1) % cycleLen;
    } else {
      progress.cycle_position = (progress.cycle_position + 1) % cycleLen;
    }
  } else if (action === 'skip') {
    if (!progress.skipped_dates.includes(today)) {
      progress.skipped_dates.push(today);
    }
    progress.cycle_position = (progress.cycle_position + 1) % cycleLen;
  }

  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    action,
    cycle_position: progress.cycle_position,
    walk_today: progress.walk_dates.includes(today),
    breathwork_today: progress.breathwork_completed_dates.includes(today),
  });
}

export async function GET() {
  const progress = readProgress();
  const today    = new Date().toISOString().slice(0, 10);

  return NextResponse.json({
    cycle_position:    progress.cycle_position,
    walk_today:        progress.walk_dates.includes(today),
    breathwork_today:  progress.breathwork_completed_dates.includes(today),
    workout_today:     progress.completed_dates.includes(today),
    completed_dates:   progress.completed_dates,
    walk_streak:       calcStreak(progress.walk_dates),
  });
}

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const sorted = [...dates].sort().reverse();
  const today  = new Date().toISOString().slice(0, 10);
  let streak   = 0;
  let cursor   = new Date(today);

  for (let i = 0; i < 60; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (sorted.includes(d)) {
      streak++;
    } else if (i > 0) {
      break; // gap
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
