import { getAllDates, getBriefingByDate } from '@/lib/data';
import { AppOfTheDay } from '@/lib/types';
import Navbar from '@/components/nav/Navbar';
import { ExternalLink } from 'lucide-react';
import ToolsClient from './ToolsClient';

export const metadata = { title: 'Tools' };
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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Nyx Daily</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
            <span className="text-[10px] text-slate-700 font-mono">{apps.length} archived</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">App Spotlight</h1>
          <p className="text-slate-600 text-sm mt-1">One tool, curated daily. Worth your attention.</p>
        </div>

        {/* Today's featured — big card */}
        {featured && (
          <div className="mb-8 rounded-2xl border border-violet-500/15 bg-[#0b0b18] overflow-hidden">
            <div className="bg-gradient-to-r from-violet-950/60 to-transparent px-6 py-5 border-b border-white/[0.05]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-500/70 mb-1">Today's Pick</p>
                  <h2 className="text-2xl font-black text-slate-100">{featured.app.name}</h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded px-1.5 py-0.5">
                      {featured.app.category}
                    </span>
                    {featured.app.free && <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 rounded px-1.5 py-0.5">Free</span>}
                    {featured.app.freemium && !featured.app.free && <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/15 rounded px-1.5 py-0.5">Freemium</span>}
                    {!featured.app.free && !featured.app.freemium && <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-500/10 border border-slate-500/15 rounded px-1.5 py-0.5">Paid</span>}
                  </div>
                </div>
                <a
                  href={featured.app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors shrink-0"
                >
                  Open <ExternalLink size={13} />
                </a>
              </div>
            </div>
            <div className="px-6 py-5 grid sm:grid-cols-3 gap-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1.5">What it is</p>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.what}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1.5">Why it matters</p>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.why}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1.5">Verdict</p>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{featured.app.verdict}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <ToolsClient apps={apps} />

        {apps.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-sm">No apps archived yet. Check back tomorrow.</p>
          </div>
        )}
      </div>
    </>
  );
}
