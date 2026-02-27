import type { DailyBriefing } from '@/lib/types';

function fmtTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Chicago' });
  } catch { return ''; }
}

interface Props {
  briefing: DailyBriefing;
  streak: number;
  headlineCount: number;
}

function Chip({ label, value, color = 'text-slate-400' }: { label: string; value: string | number; color?: string }) {
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      <span className={`text-[12px] font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[11px] text-slate-700">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-slate-800 select-none">·</span>;
}

export default function MetaBar({ briefing, streak, headlineCount }: Props) {
  const hnCount   = briefing.hacker_news?.length ?? 0;
  const releases  = briefing.releases_today;
  const relCount  = releases
    ? (releases.movies?.length ?? 0) + (releases.tv?.length ?? 0) + (releases.games?.length ?? 0) + (releases.music?.length ?? 0)
    : 0;
  const ghCount   = briefing.github_trending?.length ?? 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/[0.04] bg-white/[0.015] overflow-x-auto scrollbar-none">
      {headlineCount > 0 && (
        <>
          <Chip value={headlineCount} label="headlines" color="text-slate-300" />
          <Sep />
        </>
      )}
      {hnCount > 0 && (
        <>
          <Chip value={hnCount} label="HN stories" color="text-orange-400/80" />
          <Sep />
        </>
      )}
      {ghCount > 0 && (
        <>
          <Chip value={ghCount} label="trending repos" color="text-emerald-400/80" />
          <Sep />
        </>
      )}
      {relCount > 0 && (
        <>
          <Chip value={relCount} label="releases today" color="text-rose-400/80" />
          <Sep />
        </>
      )}
      {briefing.generated_at && (
        <>
          <span className="text-slate-800 select-none ml-auto">·</span>
          <span className="text-[11px] text-slate-700 shrink-0" title={briefing.generated_at}>
            ↻ {fmtTime(briefing.generated_at)}
          </span>
        </>
      )}
      {streak > 0 && (
        <span className="flex items-center gap-1 shrink-0">
          <span className="text-[13px]">🔥</span>
          <span className="text-[12px] font-bold text-orange-400 tabular-nums">{streak}</span>
          <span className="text-[11px] text-slate-700">day streak</span>
        </span>
      )}
    </div>
  );
}
