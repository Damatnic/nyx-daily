import { OnThisDayEvent } from '@/lib/types';

export default function OnThisDay({ events }: { events: OnThisDayEvent[] }) {
  if (!events?.length) return null;
  const top = events.slice(0, 3);

  return (
    <div className="nyx-card p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600 mb-3">On This Day</p>
      <div className="flex flex-col gap-2">
        {top.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-[11px] font-black text-amber-500/70 font-mono w-10 shrink-0 tabular-nums pt-0.5">
              {event.year}
            </span>
            {event.link ? (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors leading-relaxed"
              >
                {event.text}
              </a>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">{event.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
