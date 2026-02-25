import { MarketItem } from '@/lib/types';

interface MarketsBarProps {
  markets?: MarketItem[];
}

export default function MarketsBar({ markets }: MarketsBarProps) {
  if (!markets || markets.length === 0) return null;

  return (
    <div className="w-full bg-[#0a0a18] border-b border-white/[0.04]">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-0 min-w-max px-4 sm:px-6 lg:px-8 py-2.5">
          {markets.map((item, i) => {
            const changeColor = item.up
              ? 'text-emerald-400'
              : item.change_pct === 0
              ? 'text-slate-400'
              : 'text-red-400';
            const arrow = item.up ? '▲' : item.change_pct === 0 ? '' : '▼';
            const sign = item.up ? '+' : '';

            return (
              <div key={item.symbol} className="flex items-center">
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
                    {arrow && <span className="text-[10px]">{arrow}</span>}
                    <span>{sign}{item.change_pct.toFixed(2)}%</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
