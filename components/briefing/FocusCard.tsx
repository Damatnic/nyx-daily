interface FocusCardProps {
  focus?: string | null;
}

export default function FocusCard({ focus }: FocusCardProps) {
  if (!focus) return null;

  const focusClean = focus.replace(/\*\*/g, '').replace(/^[→🚨⚡]\s*/, '').trim();

  return (
    <div className="relative rounded-2xl overflow-hidden border border-violet-500/15 bg-[#0a0a18]">
      {/* Full background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-[#0a0a18] to-transparent pointer-events-none" />
      {/* Right glow orb */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-4 px-5 py-4">
        {/* Icon */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-base select-none">
          ⚡
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-slate-600">
              Today&apos;s Priority
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
            {focusClean}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </div>
  );
}
