import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const TMP_FILE     = '/tmp/nyx-saves.json';
const OBSIDIAN_LOG = '/Users/damato/Documents/Obsidian Vault/Inbox/Saved Links.md';

interface SavedItem {
  type: string;
  title: string;
  url: string;
  source?: string;
  snippet?: string;
  savedAt: string;
}

function loadSaves(): SavedItem[] {
  try {
    if (fs.existsSync(TMP_FILE)) return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
  } catch { /* ignore */ }
  return [];
}

function writeSaves(saves: SavedItem[]) {
  try { fs.writeFileSync(TMP_FILE, JSON.stringify(saves, null, 2)); } catch { /* ignore */ }
}

function appendToObsidian(item: SavedItem) {
  try {
    const date   = new Date(item.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const source = item.source ? ` · ${item.source}` : '';
    const snip   = item.snippet ? `\n  > ${item.snippet.slice(0, 200)}` : '';
    const line   = `\n- [${item.title}](${item.url}) _(${item.type}${source} · ${date})_${snip}\n`;
    if (!fs.existsSync(OBSIDIAN_LOG)) {
      fs.writeFileSync(OBSIDIAN_LOG, '# Saved Links\n\nItems saved from Nyx Daily.\n');
    }
    fs.appendFileSync(OBSIDIAN_LOG, line);
  } catch { /* ignore — Vercel can't reach Mac filesystem */ }
}

function removeFromObsidian(url: string) {
  try {
    if (!fs.existsSync(OBSIDIAN_LOG)) return;
    const lines = fs.readFileSync(OBSIDIAN_LOG, 'utf-8').split('\n');
    const filtered = lines.filter(l => !l.includes(url));
    fs.writeFileSync(OBSIDIAN_LOG, filtered.join('\n'));
  } catch { /* ignore */ }
}

// GET — return all saves
export async function GET() {
  return NextResponse.json(loadSaves());
}

// POST — add a save
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<SavedItem, 'savedAt'>;
    if (!body.url || !body.title) {
      return NextResponse.json({ error: 'url and title required' }, { status: 400 });
    }
    const saves = loadSaves();
    // Deduplicate by URL
    if (saves.some(s => s.url === body.url)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    const item: SavedItem = { ...body, savedAt: new Date().toISOString() };
    saves.unshift(item);
    writeSaves(saves);
    appendToObsidian(item);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE — remove a save by URL
export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });
    const saves = loadSaves().filter(s => s.url !== url);
    writeSaves(saves);
    removeFromObsidian(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
