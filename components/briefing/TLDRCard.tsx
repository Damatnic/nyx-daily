import type { TLDRBrief } from '@/lib/types';

export default function TLDRCard({ tldr }: { tldr?: TLDRBrief | null }) {
  if (!tldr?.summary) return null;

  const hasTopStory = !!tldr.top_story?.headline;
  const hasWatch    = !!tldr.watch?.length;
  const hasNyxTake  = !!tldr.nyx_take;

  return (
    <div className="px-5 py-4 space-y-4">
      {/* World Summary */}
      <p className="text-[14px] text-slate-200 leading-relaxed">
        {tldr.summary}
      </p>

      {/* Top Story */}
      {hasTopStory && (
        <div className="flex gap-3">
          <div className="w-0.5 shrink-0 rounded-full bg-violet-500/40 self-stretch" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-400/60 mb-1">
              Top Story
            </p>
            <p className="text-[13px] font-semibold text-slate-200 leading-snug">
              {tldr.top_story!.headline}
            </p>
            {tldr.top_story!.why && (
              <p className="text-[12px] text-slate-500 mt-1 leading-snug">
                {tldr.top_story!.why}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Watch list + Nyx Take — side by side when both exist */}
      {(hasWatch || hasNyxTake) && (
        <div className={`grid gap-3 ${hasWatch && hasNyxTake ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
          {hasWatch && (
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-2">
                Watch
              </p>
              <ul className="space-y-1.5">
                {tldr.watch!.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-violet-500/60 text-[10px] mt-0.5 shrink-0">→</span>
                    <span className="text-[12px] text-slate-400 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasNyxTake && (
            <div className="rounded-lg border border-violet-500/10 bg-violet-500/[0.04] px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-violet-400/50 mb-2">
                Nyx&apos;s Take 🌙
              </p>
              <p className="text-[12px] text-slate-300 leading-relaxed italic">
                {tldr.nyx_take}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
