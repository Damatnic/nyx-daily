interface FocusCardProps {
  focus?: string | null;
}

export default function FocusCard({ focus }: FocusCardProps) {
  if (!focus) return null;

  // Strip markdown bold markers and emoji prefixes for clean display
  const focusClean = focus.replace(/\*\*/g, '').replace(/^[→🚨⚡]\s*/, '').trim();

  return (
    <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-transparent p-5 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Top label row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-500">
            TODAY&apos;S PRIORITY
          </span>
        </div>

        {/* Main content */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0 text-[1.1rem]">
            ⚡
          </div>
          <p className="text-xl font-semibold text-slate-100 leading-relaxed">
            {focusClean}
          </p>
        </div>
      </div>
    </div>
  );
}
