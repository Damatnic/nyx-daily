import { getAllDates, getBriefingByDate } from '@/lib/data';
import { AppOfTheDay } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import { ExternalLink, Star, Zap, Lightbulb } from 'lucide-react';

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
  const past = apps.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Tools & Apps</h1>
        <p className="text-slate-400 mt-1">Daily featured apps and AI tools worth your time.</p>
      </div>

      {/* Featured app */}
      {featured && (
        <div className="mb-10">
          <SectionHeader title="Today's Featured App" />

          <div className="rounded-xl border border-purple-500/20 bg-[#0d0d1a] overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border-b border-white/[0.06]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{featured.app.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#8b5cf6] hover:bg-purple-400 text-white font-medium transition-all duration-200"
                >
                  Open App <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="p-6 grid sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#06b6d4]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">What it is</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.what}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Lightbulb size={14} className="text-[#8b5cf6]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Why it matters</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{featured.app.why}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-[#f59e0b]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Verdict</span>
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">{featured.app.verdict}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past apps */}
      {past.length > 0 && (
        <div>
          <SectionHeader title="Past Featured Apps" subtitle={`${past.length} total`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map(({ date, app }, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 hover:border-purple-500/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-100">{app.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-500/20 text-slate-400 hover:text-[#8b5cf6] transition-all duration-200"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="flex gap-1.5 mb-3">
                  <Badge variant="purple">{app.category}</Badge>
                  {app.free && <Badge variant="green">Free</Badge>}
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{app.verdict}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {apps.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🛠️</p>
          <p className="text-slate-400">No apps featured yet. Check back tomorrow.</p>
        </div>
      )}
    </div>
  );
}
