interface WeatherBarProps {
  weather: string;
  date: string;
  day: string;
}

export default function WeatherBar({ weather, date, day }: WeatherBarProps) {
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full border-b border-white/[0.06] bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              {day},{' '}
              <span className="text-[#8b5cf6]">{formatted}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Your morning briefing is ready.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2">
            <span>{weather}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
