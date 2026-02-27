interface FocusCardProps {
  focus?: string | null;
}

export default function FocusCard({ focus }: FocusCardProps) {
  if (!focus) return null;

  const clean = focus.replace(/\*\*/g, '').replace(/^[→🚨⚡]\s*/, '').trim();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/60 via-[var(--card)] to-[var(--card)]">
      {/* Ambient right glow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(124,58,237,0.06), transparent)' }}
      />

      <div className="relative flex items-center gap-4 px-5 py-4">
        {/* Icon ring */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-sm select-none">
          ⚡
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-500/70 mb-0.5">
            Today&apos;s Focus
          </p>
          <p className="text-[15px] font-semibold text-slate-100 leading-snug">{clean}</p>
        </div>

        {/* Pulse dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-soft-pulse shrink-0" />
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4), transparent)' }} />
    </div>
  );
}
