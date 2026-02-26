'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface QuickNavProps {
  hasYoutube?: boolean;
  hasSports?: boolean;
  hasWorkout?: boolean;
}

const SECTION_LINKS = [
  { label: '📰 News',       href: '#news' },
  { label: '🎬 YouTube',    href: '#youtube',   conditional: 'hasYoutube' },
  { label: '💡 Gems',       href: '#gems' },
  { label: '🏋️ Workout',   href: '#workout' },
  { label: '🌬️ Breathwork', href: '#breathwork' },
  { label: '🏈 Sports',     href: '#sports',    conditional: 'hasSports' },
  { label: '☀️ Weather',    href: '#weather' },
  { label: '📚 School',     href: '#school' },
] as const;

const PAGE_LINKS = [
  { label: 'Archive',  href: '/archive' },
  { label: 'School',   href: '/school' },
  { label: 'Tools',    href: '/tools' },
];

export default function QuickNav({ hasYoutube = true, hasSports = false, hasWorkout = true }: QuickNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const flags: Record<string, boolean> = { hasYoutube, hasSports, hasWorkout };

  const visibleSections = SECTION_LINKS.filter(
    (l) => !('conditional' in l) || flags[l.conditional as string]
  );

  return (
    <div className="w-full bg-[#0a0a14] border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">

          {/* On-page section anchors — home only */}
          {isHome && (
            <>
              {visibleSections.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="shrink-0 text-[11px] font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all duration-150 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}

              {/* Divider */}
              <span className="shrink-0 w-px h-3 bg-white/[0.08] mx-1" />
            </>
          )}

          {/* Cross-page links */}
          {PAGE_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}
