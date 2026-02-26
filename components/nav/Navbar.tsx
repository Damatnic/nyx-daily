'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandPalette from '@/components/ui/CommandPalette';

const LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/archive', label: 'Archive' },
  { href: '/school',  label: 'School' },
  { href: '/tools',   label: 'Tools' },
];

function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-slate-600 text-[11px] font-mono tabular-nums hidden sm:block">{time}</span>;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(v => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-12 border-b border-white/[0.045] bg-[#06060e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-4">

          {/* Brand */}
          <Link href="/" className="text-slate-400 hover:text-slate-200 transition-colors text-[13px] font-semibold tracking-wide shrink-0">
            🌙 NYX
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5 h-full ml-2">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 h-full flex items-center text-[12px] font-medium transition-colors ${
                    active ? 'text-slate-200' : 'text-slate-600 hover:text-slate-300'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-px bg-violet-500/70 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            <LiveClock />
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-150 font-mono"
              aria-label="Open command palette"
            >
              <Search size={11} />
              <span className="hidden sm:block">⌘K</span>
            </button>
          </div>
        </div>
      </nav>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
