interface FocusCardProps {
  focus?: string | null;
}

export default function FocusCard({ focus }: FocusCardProps) {
  if (!focus) return null;

  // Strip markdown bold markers for clean display
  const focusClean = focus.replace(/\*\*/g, '').replace(/^[→🚨]\s*/, '').trim();

  return (
    <div className="rounded-xl border border-white/[0.06] border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-500/[0.08] to-transparent p-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-500">
          Today&apos;s Priority
        </span>
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>

      {/* Content */}
      <div className="flex items-start gap-4 relative z-10">
        <span className="text-2xl text-violet-400 leading-none mt-0.5 shrink-0">⚡</span>
        <p className="text-lg font-medium text-slate-100 leading-relaxed">{focusClean}</p>
      </div>
    </div>
  );
}
