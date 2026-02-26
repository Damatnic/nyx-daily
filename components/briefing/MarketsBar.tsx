'use client';

import { MarketItem } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketsBarProps {
  markets?: MarketItem[];
}

export default function MarketsBar({ markets }: MarketsBarProps) {
  if (!markets || markets.length === 0) return null;

  // Filter out duplicates and ensure we have ETH
  const seen = new Set<string>();
  const uniqueMarkets: MarketItem[] = [];

  for (const item of markets) {
    if (!seen.has(item.symbol)) {
      seen.add(item.symbol);
      uniqueMarkets.push(item);
    }
  }

  return (
    <div className="w-full bg-[#0a0a18] border-y border-white/[0.04] sticky top-14 z-30">
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-0 min-w-max px-4 sm:px-6 lg:px-8 py-2.5">
          {uniqueMarkets.map((item, i) => {
            const changeColor = item.up
              ? 'text-emerald-400'
              : item.change_pct === 0
              ? 'text-slate-400'
              : 'text-red-400';
            const sign = item.up ? '+' : '';

            return (
              <div key={item.symbol} className="flex items-center tooltip-trigger relative group">
                {/* Divider between items */}
                {i > 0 && (
                  <span className="text-slate-700 mx-3 select-none">|</span>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs font-medium tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-slate-200 font-mono font-medium text-sm">
                    {item.price}
                  </span>
                  <span className={`text-xs font-medium ${changeColor} flex items-center gap-0.5`}>
                    {item.up ? (
                      <TrendingUp size={11} className="shrink-0" />
                    ) : item.change_pct !== 0 ? (
                      <TrendingDown size={11} className="shrink-0" />
                    ) : null}
                    <span>{sign}{item.change_pct.toFixed(2)}%</span>
                  </span>
                </div>

                {/* Tooltip */}
                <span className="tooltip -bottom-7 left-1/2 -translate-x-1/2">
                  Updated: {item.kind === 'crypto' ? '24h' : 'market hours'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
