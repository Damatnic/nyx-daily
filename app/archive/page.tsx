import { getAllDates, getBriefingByDate } from '@/lib/data';
import Navbar from '@/components/nav/Navbar';
import ArchiveSearch from '@/components/archive/ArchiveSearch';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const dates = await getAllDates();

  const briefings = await Promise.all(
    dates.map(async (date) => {
      const b = await getBriefingByDate(date);
      return { date, briefing: b };
    })
  );

  const validCount = briefings.filter((b) => b.briefing !== null).length;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Nyx Daily</span>
            <span className="h-px flex-1 bg-white/[0.04]" />
            <span className="text-[10px] text-slate-700 font-mono">{validCount} briefings</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Archive</h1>
          <p className="text-slate-500 text-sm mt-1">Every morning briefing on record.</p>
        </div>

        <ArchiveSearch briefings={briefings} />
      </div>
    </>
  );
}
