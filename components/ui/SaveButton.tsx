'use client';

import { useState, useEffect } from 'react';

export interface SavePayload {
  type: 'news' | 'reddit' | 'product' | 'youtube' | 'movie' | 'tv' | 'game' | 'album' | 'gem' | 'link';
  title: string;
  url: string;
  source?: string;
  snippet?: string;
}

const STORAGE_KEY = 'nyx-saves';

function getLocalSaves(): SavePayload[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function setLocalSaves(saves: SavePayload[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function isSaved(url: string): boolean {
  return getLocalSaves().some(s => s.url === url);
}

interface Props {
  item: SavePayload;
  className?: string;
}

export default function SaveButton({ item, className = '' }: Props) {
  const [saved, setSaved] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    setSaved(isSaved(item.url));
  }, [item.url]);

  const toggle = async () => {
    const saves = getLocalSaves();
    if (saved) {
      setLocalSaves(saves.filter(s => s.url !== item.url));
      setSaved(false);
      fetch('/api/saves', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url }),
      }).catch(() => {});
    } else {
      setLocalSaves([{ ...item, }, ...saves]);
      setSaved(true);
      setPop(true);
      setTimeout(() => setPop(false), 600);
      fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {});
    }
  };

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      aria-label={saved ? 'Remove save' : 'Save for later'}
      title={saved ? 'Saved — click to remove' : 'Save for later'}
      className={`shrink-0 transition-all duration-150 ${pop ? 'scale-125' : 'scale-100'} ${className}`}
    >
      {saved ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400">
          <path d="M5 3h14a1 1 0 0 1 1 1v17.5l-8-4.5-8 4.5V4a1 1 0 0 1 1-1z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-600 group-hover:text-slate-400 transition-colors">
          <path d="M5 3h14a1 1 0 0 1 1 1v17.5l-8-4.5-8 4.5V4a1 1 0 0 1 1-1z" />
        </svg>
      )}
    </button>
  );
}
