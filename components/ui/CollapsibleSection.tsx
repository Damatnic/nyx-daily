'use client';

import { useState, useEffect, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const ACCENT: Record<string, { text: string; dot: string }> = {
  cyan:    { text: 'text-cyan-500/70',    dot: 'bg-cyan-500/60' },
  amber:   { text: 'text-amber-500/70',   dot: 'bg-amber-500/60' },
  violet:  { text: 'text-violet-400/80',  dot: 'bg-violet-400/70' },
  emerald: { text: 'text-emerald-500/70', dot: 'bg-emerald-500/60' },
  rose:    { text: 'text-rose-400/80',    dot: 'bg-rose-400/70' },
  blue:    { text: 'text-blue-400/80',    dot: 'bg-blue-400/70' },
  slate:   { text: 'text-slate-500',      dot: 'bg-slate-600' },
};

interface Props {
  id: string;
  label: string;
  accent?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({ id, label, accent = 'slate', defaultOpen = true, children }: Props) {
  const storageKey = `nyx-section-${id}`;
  const [open, setOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);

  // Read localStorage on mount (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setOpen(saved === 'true');
  }, [storageKey]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (mounted) localStorage.setItem(storageKey, String(next));
  };

  const { text, dot } = ACCENT[accent] ?? ACCENT.slate;

  return (
    <div className="flex flex-col gap-4">
      {/* Section label — click to toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-2.5 group w-full text-left"
        aria-expanded={open}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] shrink-0 ${text}`}>
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.07] to-transparent" />
        <ChevronDown
          size={12}
          className={`shrink-0 text-slate-700 group-hover:text-slate-500 transition-all duration-200 ${open ? '' : '-rotate-90'}`}
        />
      </button>

      {/* Content */}
      {open && children}
    </div>
  );
}
