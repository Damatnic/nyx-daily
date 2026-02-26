import { Calendar, Mail } from 'lucide-react';

interface CalendarCardProps {
  events?: string[] | null;
  gmailSummary?: string | null;
}

function hasRealEvents(events?: string[] | null): boolean {
  if (!events || events.length === 0) return false;
  const allEmpty = events.every(
    (e) => !e.trim() || e.toLowerCase().includes('no events') || e.toLowerCase().includes('clear')
  );
  return !allEmpty;
}

export default function CalendarCard({ events, gmailSummary }: CalendarCardProps) {
  const realEvents = hasRealEvents(events);
  if (!realEvents && !gmailSummary) return null;

  return (
    <div className="nyx-card p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-3">
        Today
      </p>

      {gmailSummary && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 mb-2">
          <Mail size={13} className="text-cyan-500/70 mt-0.5 shrink-0" />
          <span className="text-sm text-slate-300 leading-snug">{gmailSummary}</span>
        </div>
      )}

      {realEvents && (
        <div className="flex flex-col gap-1.5">
          {(events ?? []).map((event, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <Calendar size={13} className="text-violet-400/70 mt-0.5 shrink-0" />
              <span className="text-sm text-slate-300 leading-snug">{event}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
