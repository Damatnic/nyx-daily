'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, Archive, BookOpen, Zap } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/school', label: 'School', icon: BookOpen },
  { href: '/tools', label: 'Tools', icon: Zap },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#07070f]/90 backdrop-blur-lg border-t border-white/[0.06]"
    >
      <div
        className="flex items-center justify-around px-2 pt-2 pb-2"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-colors min-h-[44px] justify-center ${
                isActive ? 'text-[#8b5cf6]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-purple-500 mb-0.5" />
              )}
              <Icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
