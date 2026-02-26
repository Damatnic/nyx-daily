import { getAllDates, getBriefingByDate } from '@/lib/data';
import { AppOfTheDay } from '@/lib/types';
import Navbar from '@/components/nav/Navbar';
import Badge from '@/components/ui/Badge';
import { ExternalLink, Star, Zap, Lightbulb } from 'lucide-react';
import ToolsClient from './ToolsClient';

export const dynamic = 'force-dynamic';

export default async function ToolsPage() {
  const dates = await getAllDates();

  const apps: Array<{ date: string; app: AppOfTheDay; isToday: boolean }> = [];

  for (const date of dates) {
    const b = await getBriefingByDate(date);
    if (b?.app_of_the_day) {
      apps.push({ date, app: b.app_of_the_day, isToday: date === dates[0] });
    }
  }

  const featured = apps[0];
  const allApps = apps;

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-10 pb-8 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">🛠️ AI &amp; App Spotlight</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Every day, one standout tool gets the spotlight — handpicked for relevance, quality, and
              real-world usefulness. From AI assistants to coding tools, productivity apps, and beyond.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3">
            <span className="text-2xl font-bold text-slate-100">{allApps.length}</span>
            <span>tools featured</span>
          </div>
        </div>
      </div>

      {/* Featured app — large prominent card */}
      {featured && (
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            ⭐ Today&apos;s Featured Tool
          </p>

          <div className="rounded-2xl border border-purple-500/20 bg-[#0d0d1a] overflow-hidden shadow-lg shadow-purple-500/5">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border-b border-white/[0.06]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">{featured.app.name}</h2>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="purple">{featured.app.category}</Badge>
                    {featured.app.free && <Badge variant="green">Free</Badge>}
                    {featured.app.freemium && !featured.app.free && <Badge variant="cyan">Freemium</Badge>}
                    {!featured.app.free && !featured.app.freemium && <Badge variant="gold">Paid</Badge>}
                  </div>
                </div>
                <a
                  href={featured.app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8b5cf6] hover:bg-purple-400 text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 shrink-0"
                >
                  Open App <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-[#06b6d4]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">What it is</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.what}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb size={14} className="text-[#8b5cf6]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Why it matters</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.why}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-[#f59e0b]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Verdict</span>
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{featured.app.verdict}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All tools grid with client-side filtering */}
      <ToolsClient apps={allApps} />

      {apps.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🛠️</p>
          <p className="text-slate-300 font-semibold mb-2">No tools featured yet</p>
          <p className="text-slate-500 text-sm">
            A new tool gets spotlighted every day. Check back tomorrow — it&apos;s always something worth trying.
          </p>
        </div>
      )}
    </div>
    </>
  );
}
