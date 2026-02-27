export default function TLDRCard({ tldr }: { tldr?: string | null }) {
  if (!tldr?.trim()) return null;

  return (
    <div className="relative px-4 py-3 rounded-xl border border-violet-500/10 bg-violet-500/[0.04] overflow-hidden">
      {/* Accent line */}
      <div className="absolute left-0 inset-y-0 w-[2px] rounded-l-xl bg-violet-500/40" />

      <div className="pl-3">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400/60 mb-1.5">
          AI Briefing
        </p>
        <p className="text-[13px] text-slate-300 leading-relaxed">
          {tldr}
        </p>
      </div>
    </div>
  );
}
