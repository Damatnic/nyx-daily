import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TMP_FILE  = '/tmp/nyx-school-done.json';
const SRC_FILE  = '/Users/damato/.openclaw/workspace/school-deadlines.json';
const PUB_FILE  = path.join(process.cwd(), 'public/data/school-deadlines.json');

function loadOverrides(): Record<string, boolean> {
  try {
    if (fs.existsSync(TMP_FILE)) return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
  } catch { /* ignore */ }
  return {};
}

function saveOverrides(data: Record<string, boolean>) {
  try { fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2)); } catch { /* ignore */ }
}

/** Patch the workspace source JSON (nested format) — works on Mac */
function patchSourceFile(due_date: string, desc: string, done: boolean) {
  try {
    if (!fs.existsSync(SRC_FILE)) return;
    const src = JSON.parse(fs.readFileSync(SRC_FILE, 'utf-8'));
    let changed = false;
    for (const courseKey of Object.keys(src.courses ?? {})) {
      const assignments: Array<{ date: string; desc: string; done: boolean }> =
        src.courses[courseKey].assignments ?? [];
      for (const a of assignments) {
        if (a.date === due_date && a.desc === desc) {
          a.done = done;
          changed = true;
        }
      }
    }
    if (changed) fs.writeFileSync(SRC_FILE, JSON.stringify(src, null, 2));
  } catch { /* ignore — Vercel can't write here */ }
}

/** Patch the flat public JSON — works locally, no-op on Vercel */
function patchPublicFile(due_date: string, desc: string, done: boolean) {
  try {
    if (!fs.existsSync(PUB_FILE)) return;
    const deadlines = JSON.parse(fs.readFileSync(PUB_FILE, 'utf-8')) as Array<{
      due_date: string; desc: string; done: boolean;
    }>;
    let changed = false;
    for (const d of deadlines) {
      if (d.due_date === due_date && d.desc === desc) {
        d.done = done;
        changed = true;
      }
    }
    if (changed) fs.writeFileSync(PUB_FILE, JSON.stringify(deadlines, null, 2));
  } catch { /* ignore — Vercel can't write here */ }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { due_date?: string; desc?: string; done?: boolean };
    const { due_date, desc, done } = body;

    if (!due_date || !desc || typeof done !== 'boolean') {
      return NextResponse.json({ error: 'Missing fields: due_date, desc, done' }, { status: 400 });
    }

    const key = `${due_date}:${desc}`;

    // 1. /tmp overrides — fast, works on Vercel within warm instances
    const overrides = loadOverrides();
    if (done) overrides[key] = true;
    else delete overrides[key];
    saveOverrides(overrides);

    // 2. Patch workspace source (permanent on Mac, no-op on Vercel)
    patchSourceFile(due_date, desc, done);

    // 3. Patch public flat JSON (works locally)
    patchPublicFile(due_date, desc, done);

    return NextResponse.json({ ok: true, key, done });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
