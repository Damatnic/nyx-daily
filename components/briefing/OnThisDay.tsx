import { OnThisDayEvent } from '@/lib/types';

interface OnThisDayProps {
  events: OnThisDayEvent[];
}

export default function OnThisDay({ events }: OnThisDayProps) {
  const displayEvents = events.slice(0, 3);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📅</span>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          On This Day
        </h2>
      </div>

      {/* Events */}
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {displayEvents.map((event, i) => (
          <div key={i} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              {/* Year */}
              <span className="text-amber-400 font-bold text-sm w-12 flex-shrink-0 tabular-nums">
                {event.year}
              </span>

              {/* Event text */}
              {event.link ? (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 text-sm leading-snug hover:text-slate-100 hover:underline transition-colors duration-150 underline-offset-2 decoration-slate-600"
                >
                  {event.text}
                </a>
              ) : (
                <p className="text-slate-300 text-sm leading-snug">
                  {event.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
