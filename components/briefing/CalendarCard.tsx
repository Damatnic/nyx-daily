import { Calendar, Mail } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

interface CalendarCardProps {
  events?: string[] | null;
  gmailSummary?: string | null;
}

export default function CalendarCard({ events, gmailSummary }: CalendarCardProps) {
  if (!events && !gmailSummary) return null;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="Today" />

      {/* Gmail */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3">
        <div className="p-1.5 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20">
          <Mail size={14} className="text-[#06b6d4]" />
        </div>
        <span className="text-sm text-slate-300">{gmailSummary}</span>
      </div>

      {/* Calendar events */}
      <div className="flex flex-col gap-2">
        {!events || events.length === 0 || (events.length === 1 && events[0].toLowerCase().includes('no events')) ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Calendar size={14} className="text-[#8b5cf6]" />
            </div>
            <span className="text-sm text-slate-400">Clear calendar today</span>
          </div>
        ) : (
          (events ?? []).map((event, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 mt-0.5 shrink-0">
                <Calendar size={14} className="text-[#8b5cf6]" />
              </div>
              <span className="text-sm text-slate-200">{event}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
