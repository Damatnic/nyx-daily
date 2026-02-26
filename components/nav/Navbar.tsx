'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import CommandPalette from '@/components/ui/CommandPalette';

const navLinks = [
  { href: '/',        label: 'Home' },
  { href: '/archive', label: 'Archive' },
  { href: '/school',  label: 'School' },
  { href: '/tools',   label: 'Tools' },
];

function NavClock() {
  const [label, setLabel] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLabel(time);
    }
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  if (!label) return null;
  return (
    <span className="text-slate-600 text-xs font-mono hidden lg:block select-none tabular-nums">
      {label}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Listen for Cmd+K globally — open palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.05] bg-[#07070f]/90 backdrop-blur-md h-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-3">

            {/* Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-[#8b5cf6] transition-colors duration-200">
                  🌙 NYX
                </span>
              </Link>
              <NavClock />
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 h-full flex items-center text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-[#8b5cf6]'
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side: search + mobile toggle */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Cmd+K search button */}
              <button
                onClick={() => setPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] text-slate-500 hover:text-slate-300 transition-all duration-150 group"
                aria-label="Open command palette"
              >
                <Search size={13} />
                <span className="hidden sm:block text-xs">Search</span>
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-700 group-hover:text-slate-500 bg-white/[0.04] rounded px-1">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile menu toggle */}
              <button
                className="p-2 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/[0.04] transition-all duration-150 md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.05] bg-[#07070f]/97 backdrop-blur-md">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-[#8b5cf6] bg-purple-500/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Command palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
