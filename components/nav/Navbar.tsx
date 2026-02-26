'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketItem } from '@/lib/types';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/archive', label: 'Archive' },
  { href: '/school', label: 'School' },
  { href: '/tools', label: 'Tools' },
];

function NavClock() {
  const [label, setLabel] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setLabel(formatted);
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!label) return null;

  return (
    <span className="text-slate-500 text-xs font-mono hidden sm:block select-none">
      {label}
    </span>
  );
}

interface MiniMarketsProps {
  markets?: MarketItem[] | null;
}

function MiniMarkets({ markets }: MiniMarketsProps) {
  if (!markets || markets.length === 0) return null;

  // Show S&P 500, BTC, and ETH (max 3)
  const sp500 = markets.find((m) => m.symbol === '^GSPC');
  const btc = markets.find((m) => m.symbol === 'BTC-USD');
  const eth = markets.find((m) => m.symbol === 'ETH-USD');

  const displayMarkets = [sp500, btc, eth].filter(Boolean).slice(0, 3) as MarketItem[];

  if (displayMarkets.length === 0) return null;

  return (
    <div className="hidden lg:flex items-center gap-2.5">
      {displayMarkets.map((market, i) => {
        const isUp = market.up;
        const color = isUp ? 'text-emerald-400' : market.change_pct === 0 ? 'text-slate-400' : 'text-red-400';
        const sign = isUp ? '+' : '';

        return (
          <div key={market.symbol} className="flex items-center gap-1.5 tooltip-trigger relative">
            {i > 0 && <span className="text-slate-700 mr-1">·</span>}
            <span className="text-[10px] text-slate-500 font-medium">{market.label}</span>
            <span className={`text-[10px] font-mono font-medium ${color} flex items-center gap-0.5`}>
              {isUp ? (
                <TrendingUp size={9} className="shrink-0" />
              ) : market.change_pct !== 0 ? (
                <TrendingDown size={9} className="shrink-0" />
              ) : null}
              {sign}{market.change_pct.toFixed(2)}%
            </span>
            <span className="tooltip -bottom-7 left-1/2 -translate-x-1/2">
              {market.price}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface NavbarProps {
  markets?: MarketItem[] | null;
}

export default function Navbar({ markets }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.06] bg-[#07070f]/85 backdrop-blur-md h-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo + date */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-[#8b5cf6] transition-all duration-200">
                🌙 NYX DAILY
              </span>
            </Link>
            <NavClock />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-[#8b5cf6] bg-purple-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: mini markets + mobile menu */}
          <div className="flex items-center gap-4">
            <MiniMarkets markets={markets} />

            {/* Mobile menu button */}
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all duration-200 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#07070f]/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-[#8b5cf6] bg-purple-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
