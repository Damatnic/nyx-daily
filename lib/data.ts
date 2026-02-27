import fs from 'fs';
import path from 'path';
import { DailyBriefing, SchoolDeadline } from './types';

const dataDir = path.join(process.cwd(), 'public', 'data');

export async function getTodaysBriefing(): Promise<DailyBriefing | null> {
  try {
    const dates = await getAllDates();
    if (dates.length === 0) return null;
    // Use the most recent date
    const latest = dates[0];
    return getBriefingByDate(latest);
  } catch {
    return null;
  }
}

export async function getBriefingByDate(date: string): Promise<DailyBriefing | null> {
  try {
    const filePath = path.join(dataDir, `${date}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as DailyBriefing;
  } catch {
    return null;
  }
}

export async function getAllDates(): Promise<string[]> {
  try {
    const filePath = path.join(dataDir, 'index.json');
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function getSchoolDeadlines(): Promise<SchoolDeadline[]> {
  try {
    const filePath = path.join(dataDir, 'school-deadlines.json');
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    const deadlines = JSON.parse(raw) as SchoolDeadline[];

    // Merge /tmp overrides — server-side persistence on Vercel warm instances
    try {
      const tmpFile = '/tmp/nyx-school-done.json';
      if (fs.existsSync(tmpFile)) {
        const overrides: Record<string, boolean> = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'));
        for (const d of deadlines) {
          const key = `${d.due_date}:${d.desc}`;
          if (key in overrides) d.done = overrides[key];
        }
      }
    } catch { /* ignore */ }

    return deadlines;
  } catch {
    return [];
  }
}
