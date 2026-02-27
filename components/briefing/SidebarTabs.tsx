import WeatherCard, { WeatherDay } from '@/components/briefing/WeatherCard';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import type { SchoolDeadline, OnThisDayEvent, NasaApod as NasaApodType, WordOfDay, DailyFact } from '@/lib/types';

interface SidebarProps {
  weather?: string | null;
  forecast?: WeatherDay[] | null;
  word?: WordOfDay | null;
  facts?: DailyFact[] | null;
  deadlines?: SchoolDeadline[] | null;
  events?: string[] | null;
  gmailSummary?: string | null;
  // kept for prop compat — content lives in BriefingCarousel now
  onThisDay?: OnThisDayEvent[] | null;
  apod?: NasaApodType | null;
}

export default function SidebarTabs({
  weather, forecast, deadlines, events, gmailSummary,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Weather forecast */}
      {weather && <WeatherCard weather={weather} forecast={forecast} />}

      {/* School deadlines — high priority, always visible */}
      <SchoolDeadlines deadlines={deadlines} />

      {/* Calendar / Gmail */}
      <CalendarCard events={events} gmailSummary={gmailSummary} />

      {/* Daily Extras / On This Day / NASA APOD → now in BriefingCarousel (main column) */}
    </div>
  );
}
