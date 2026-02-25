import { getAllDates, getBriefingByDate } from '@/lib/data';
import Link from 'next/link';
import { Calendar, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const dates = await getAllDates();

  const briefings = await Promise.all(
    dates.map(async (date) => {
      const b = await getBriefingByDate(date);
      return { date, briefing: b };
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Archive</h1>
        <p className="text-slate-400 mt-1">All past briefings — {dates.length} total</p>
      </div>

      {briefings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-slate-400">No past briefings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {briefings.map(({ date, briefing }) => {
            if (!briefing) return null;

            // Build compact markets snapshot
            const markets = briefing.markets ?? [];
            const sp500 = markets.find((m) => m.symbol === '^GSPC');
            const btc = markets.find((m) => m.symbol === 'BTC-USD');

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className="group block rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 hover:border-purple-500/20 hover:bg-[#0f0f1e] transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Calendar size={15} className="text-[#8b5cf6]" />
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-600 group-hover:text-[#8b5cf6] mt-1 transition-colors duration-200"
                  />
                </div>

                <p className="text-xs text-slate-500 mb-0.5">{briefing.day}</p>
                <p className="text-lg font-bold text-slate-100 group-hover:text-[#8b5cf6] transition-colors duration-200">
                  {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                {/* Weather summary */}
                <p className="text-xs text-slate-400 mt-2 line-clamp-1">{briefing.weather}</p>

                {/* Markets snapshot */}
                {(sp500 || btc) && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04]">
                    {sp500 && (
                      <div className="flex items-center gap-1">
                        {sp500.up ? (
                          <TrendingUp size={11} className="text-emerald-400" />
                        ) : (
                          <TrendingDown size={11} className="text-red-400" />
                        )}
                        <span className="text-xs text-slate-500">S&amp;P</span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            sp500.up ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {sp500.up ? '+' : ''}{sp500.change_pct.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {btc && (
                      <div className="flex items-center gap-1">
                        {btc.up ? (
                          <TrendingUp size={11} className="text-emerald-400" />
                        ) : (
                          <TrendingDown size={11} className="text-red-400" />
                        )}
                        <span className="text-xs text-slate-500">BTC</span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            btc.up ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {btc.up ? '+' : ''}{btc.change_pct.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {briefing.focus && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 border-t border-white/[0.04] pt-2">
                    {briefing.focus}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
