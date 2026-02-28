import type { TLDRBrief } from '@/lib/types';

interface Props {
  tldr?: TLDRBrief | null;
  sourceCount?: number;
}

export default function TLDRCard({ tldr, sourceCount }: Props) {
  if (!tldr?.summary) return null;

  const hasTopStory = !!tldr.top_story?.headline;
  const hasWatch    = !!tldr.watch?.length;
  const hasNyxTake  = !!tldr.nyx_take;

  return (
    <div className="px-5 py-4 space-y-5">

      {/* ── World Summary ─────────────────────────────────────────────── */}
      <p className="text-[15px] text-slate-100 leading-[1.7] font-light tracking-[-0.01em]">
        {tldr.summary}
      </p>

      {/* ── Top Story ─────────────────────────────────────────────────── */}
      {hasTopStory && (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] overflow-hidden">
          <div className="flex items-center gap-2 px-3.5 pt-3 pb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400/60">Top Story</span>
            <div className="flex-1 h-px bg-violet-500/10" />
          </div>
          <div className="px-3.5 pb-3.5">
            <p className="text-[15px] font-bold text-slate-100 leading-snug">
              {tldr.top_story!.headline}
            </p>
            {tldr.top_story!.why && (
              <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed">
                {tldr.top_story!.why}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Watch list ────────────────────────────────────────────────── */}
      {hasWatch && (
        <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-3.5 py-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2.5">
            Watch
          </p>
          <ul className="space-y-2">
            {tldr.watch!.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-violet-500/50 text-[11px] mt-0.5 shrink-0 font-bold">→</span>
                <span className="text-[12.5px] text-slate-400 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Nyx's Take — FLAGSHIP callout ─────────────────────────────── */}
      {hasNyxTake && (
        <div className="relative rounded-xl overflow-hidden">
          {/* Ambient glow behind the box */}
          <div className="absolute inset-0 rounded-xl"
               style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.12), transparent 70%)' }}
               aria-hidden />
          <div className="relative border border-violet-400/20 rounded-xl px-4 py-3.5"
               style={{ background: 'linear-gradient(135deg, rgba(76,29,149,0.18) 0%, rgba(6,6,14,0.85) 100%)' }}>
            {/* Label */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-sm leading-none select-none">🌙</span>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-violet-300/60">
                Nyx&apos;s Take
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }} />
            </div>
            {/* Opinion */}
            <p className="text-[13px] text-violet-100/80 leading-relaxed italic font-light">
              {tldr.nyx_take}
            </p>
          </div>
        </div>
      )}

      {/* ── Source count footer ───────────────────────────────────────── */}
      {sourceCount && sourceCount > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(8, Math.ceil(sourceCount / 20)) }).map((_, i) => (
              <div key={i} className="w-3 h-0.5 rounded-full bg-violet-500/30" />
            ))}
          </div>
          <span className="text-[10px] text-slate-700">
            synthesized from {sourceCount} headlines
          </span>
        </div>
      )}
    </div>
  );
}
