'use client';

import { usePathname } from 'next/navigation';
import {
  Newspaper,
  Youtube,
  Gem,
  Dumbbell,
  Wind,
  Trophy,
  CloudSun,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickNavProps {
  hasYoutube?: boolean;
  hasSports?: boolean;
  hasWorkout?: boolean;
}

interface SectionLink {
  label: string;
  href: string;
  icon: LucideIcon;
  conditional?: string;
}

const SECTION_LINKS: SectionLink[] = [
  { label: 'News',       href: '#news',       icon: Newspaper },
  { label: 'YouTube',    href: '#youtube',    icon: Youtube,   conditional: 'hasYoutube' },
  { label: 'Gems',       href: '#gems',       icon: Gem },
  { label: 'Workout',    href: '#workout',    icon: Dumbbell,  conditional: 'hasWorkout' },
  { label: 'Breathwork', href: '#breathwork', icon: Wind },
  { label: 'Sports',     href: '#sports',     icon: Trophy,    conditional: 'hasSports' },
  { label: 'Weather',    href: '#weather',    icon: CloudSun },
  { label: 'School',     href: '#school',     icon: BookOpen },
];

export default function QuickNav({ hasYoutube = true, hasSports = false, hasWorkout = true }: QuickNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Only show on home page — it's a section-jump bar, not page nav
  if (!isHome) return null;

  const flags: Record<string, boolean> = { hasYoutube, hasSports, hasWorkout };
  const visibleSections = SECTION_LINKS.filter((l) => !l.conditional || flags[l.conditional]);

  return (
    <div className="w-full bg-[#0a0a14] border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none py-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700 shrink-0 mr-2 hidden sm:block">
            Jump to
          </span>
          {visibleSections.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-200 hover:bg-white/[0.04] px-2.5 py-1 rounded-md transition-all duration-150 whitespace-nowrap"
              >
                <Icon size={11} className="shrink-0" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
