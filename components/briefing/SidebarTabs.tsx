import WeatherCard, { WeatherDay } from '@/components/briefing/WeatherCard';
import AgendaCard from '@/components/briefing/AgendaCard';
import type { SchoolDeadline, OnThisDayEvent, NasaApod as NasaApodType, WordOfDay, DailyFact } from '@/lib/types';

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
  weather, forecast, deadlines, events, gmailSummary,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      {weather && <WeatherCard weather={weather} forecast={forecast} />}
      <AgendaCard deadlines={deadlines} events={events} gmailSummary={gmailSummary} />
    </div>
  );
}
