'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Archive, BookOpen, Wrench, Newspaper, Play, Gem, Dumbbell, Wind, TrendingUp, MessageSquare, ShoppingBag, Zap, X } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  badge?: string;
  badgeColor?: string;
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollTo = useCallback((id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, [onClose]);

  const navigate = useCallback((href: string) => {
    onClose();
    router.push(href);
  }, [onClose, router]);

  const ITEMS: CommandItem[] = [
    // Pages
    { id: 'home',    group: 'Pages',    label: 'Home',       description: "Today's briefing",     icon: <Home size={15} />,        action: () => navigate('/') },
    { id: 'archive', group: 'Pages',    label: 'Archive',    description: 'Past briefings',        icon: <Archive size={15} />,     action: () => navigate('/archive') },
    { id: 'school',  group: 'Pages',    label: 'School',     description: 'Deadlines & courses',  icon: <BookOpen size={15} />,    action: () => navigate('/school') },
    { id: 'tools',   group: 'Pages',    label: 'Tools',      description: 'Quick tools',          icon: <Wrench size={15} />,      action: () => navigate('/tools') },
    // Sections
    { id: 'jump-news',     group: 'Jump to', label: 'News',          description: 'Top headlines',        icon: <Newspaper size={15} />,   action: () => scrollTo('news'),     badge: '↓', badgeColor: 'text-violet-400' },
    { id: 'jump-youtube',  group: 'Jump to', label: 'YouTube Picks', description: 'Curated videos',       icon: <Play size={15} />,        action: () => scrollTo('youtube'),  badge: '↓', badgeColor: 'text-red-400' },
    { id: 'jump-gems',     group: 'Jump to', label: 'Hidden Gems',   description: 'Cool finds from HN',   icon: <Gem size={15} />,         action: () => scrollTo('gems'),     badge: '4', badgeColor: 'text-amber-400' },
    { id: 'jump-workout',  group: 'Jump to', label: 'Workout',       description: 'Track your exercises', icon: <Dumbbell size={15} />,    action: () => scrollTo('workout'),  badge: '↓', badgeColor: 'text-cyan-400' },
    { id: 'jump-breathwork', group: 'Jump to', label: 'Breathwork',  description: 'Guided breathing',     icon: <Wind size={15} />,        action: () => scrollTo('breathwork'), badge: '↓', badgeColor: 'text-emerald-400' },
    { id: 'jump-weather',  group: 'Jump to', label: 'Weather',       description: 'Forecast & conditions',icon: <Zap size={15} />,         action: () => scrollTo('weather'),  badge: '↓', badgeColor: 'text-sky-400' },
    { id: 'jump-school',   group: 'Jump to', label: 'School Sidebar',description: 'Upcoming deadlines',   icon: <BookOpen size={15} />,    action: () => scrollTo('school'),   badge: '↓', badgeColor: 'text-pink-400' },
    { id: 'jump-github',   group: 'Jump to', label: 'GitHub Trending',description: 'Trending repos',     icon: <TrendingUp size={15} />,  action: () => scrollTo('github'),   badge: '↓', badgeColor: 'text-slate-400' },
    { id: 'jump-reddit',   group: 'Jump to', label: 'Reddit Hot',    description: 'Hot posts',            icon: <MessageSquare size={15} />, action: () => scrollTo('reddit'), badge: '↓', badgeColor: 'text-orange-400' },
    { id: 'jump-ph',       group: 'Jump to', label: 'Product Hunt',  description: 'Products of the day', icon: <ShoppingBag size={15} />, action: () => scrollTo('producthunt'), badge: '↓', badgeColor: 'text-amber-400' },
  ];

  const filtered = query.trim()
    ? ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords?.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
    : ITEMS;

  // Group items
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatFiltered = filtered;

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, flatFiltered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); flatFiltered[selected]?.action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, selected, flatFiltered, onClose]);

  if (!open) return null;

  let itemIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-[var(--card)] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, sections..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-600 hover:text-slate-400 transition-colors">
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-600 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2 scrollbar-none">
          {flatFiltered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-600">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
                  {group}
                </div>
                {items.map((item) => {
                  const currentIdx = itemIndex++;
                  const isSelected = currentIdx === selected;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelected(currentIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${
                        isSelected
                          ? 'bg-violet-500/15 text-slate-100'
                          : 'text-slate-400 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={`shrink-0 ${isSelected ? 'text-violet-400' : 'text-slate-600'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-slate-600 block">{item.description}</span>
                        )}
                      </div>
                      {item.badge && (
                        <span className={`text-xs font-mono shrink-0 ${item.badgeColor ?? 'text-slate-600'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-3 text-[10px] text-slate-700">
          <span>↑↓ navigate</span>
          <span>·</span>
          <span>↵ select</span>
          <span>·</span>
          <span>ESC close</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse" />
            <span>Nyx Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
