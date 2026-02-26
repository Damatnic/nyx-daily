'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, Archive, BookOpen, Zap } from 'lucide-react';

const tabs = [
  { href: '/',        label: 'Home',    icon: House },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/school',  label: 'School',  icon: BookOpen },
  { href: '/tools',   label: 'Tools',   icon: Zap },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#06060e]/95 backdrop-blur-xl border-t border-white/[0.05]">
      <div
        className="flex items-center justify-around px-1"
        style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))', paddingTop: '0.375rem' }}
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-150 min-h-[44px] justify-center ${
                active ? 'text-violet-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold ${active ? 'text-violet-400' : 'text-slate-700'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
