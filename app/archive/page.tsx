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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Archive</h1>
          <p className="text-slate-400 mt-1">All past briefings — {dates.length} total</p>
        </div>

        <ArchiveSearch briefings={briefings} />
      </div>
    </>
  );
}
