import WeatherCard, { WeatherDay } from '@/components/briefing/WeatherCard';
import CalendarCard from '@/components/briefing/CalendarCard';
import SchoolDeadlines from '@/components/briefing/SchoolDeadlines';
import DailyExtras from '@/components/briefing/DailyExtras';
import OnThisDay from '@/components/briefing/OnThisDay';
import NasaApod from '@/components/briefing/NasaApod';
import type { SchoolDeadline, WordOfDay, DailyFact, OnThisDayEvent, NasaApod as NasaApodType } from '@/lib/types';

interface SidebarProps {
  weather?: string | null;
  forecast?: WeatherDay[] | null;
  word?: WordOfDay | null;
  facts?: DailyFact[] | null;
  deadlines?: SchoolDeadline[] | null;
  events?: string[] | null;
  gmailSummary?: string | null;
  onThisDay?: OnThisDayEvent[] | null;
  apod?: NasaApodType | null;
}

export default function SidebarTabs({
  weather,
  forecast,
  word,
  facts,
  deadlines,
  events,
  gmailSummary,
  onThisDay,
  apod,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Weather — always first */}
      {weather && <WeatherCard weather={weather} forecast={forecast} />}

      {/* Calendar / Gmail — only if data exists */}
      <CalendarCard events={events} gmailSummary={gmailSummary} />

      {/* School deadlines — upcoming only */}
      <SchoolDeadlines deadlines={deadlines} />

      {/* Word of day + daily facts */}
      <DailyExtras word={word} facts={facts} />

      {/* On this day */}
      {onThisDay && onThisDay.length > 0 && (
        <OnThisDay events={onThisDay} />
      )}

      {/* NASA APOD */}
      {apod && <NasaApod apod={apod} />}
    </div>
  );
}
