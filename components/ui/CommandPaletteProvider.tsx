'use client';

import { useEffect, useState } from 'react';
import CommandPalette from './CommandPalette';

export default function CommandPaletteProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
