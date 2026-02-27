'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nyx-saves';

export default function SavesBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setCount(Array.isArray(saves) ? saves.length : 0);
      } catch { setCount(0); }
    };
    load();
    // Re-check when localStorage changes (cross-tab) or saves are added
    window.addEventListener('storage', load);
    // Also poll lightly since saves happen in same tab
    const interval = setInterval(load, 3000);
    return () => { window.removeEventListener('storage', load); clearInterval(interval); };
  }, []);

  if (count === 0) return null;
  return (
    <span className="ml-1 text-[9px] font-black tabular-nums px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300/80">
      {count}
    </span>
  );
}
