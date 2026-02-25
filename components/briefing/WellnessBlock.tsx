import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { Wind, Heart, Lightbulb, DollarSign } from 'lucide-react';

interface WellnessBlockProps {
  breathwork?: {
    name: string;
    steps: string;
    rounds: number;
  } | null;
  healthTip?: string | null;
  lifeHack?: { category: string; tip: string } | null;
  moneyTip?: { category: string; tip: string } | null;
}

export default function WellnessBlock({ breathwork, healthTip, lifeHack, moneyTip }: WellnessBlockProps) {
  if (!breathwork && !healthTip && !lifeHack && !moneyTip) return null;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="Wellness" />

      <div className="flex flex-col gap-3">
        {/* Breathwork */}
        {breathwork && (
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={13} className="text-[#06b6d4]" />
              <span className="text-xs font-semibold text-[#06b6d4] uppercase tracking-widest">Breathwork</span>
              <Badge variant="cyan" className="ml-auto">{breathwork.rounds} rounds</Badge>
            </div>
            <p className="text-sm font-medium text-slate-200">{breathwork.name}</p>
            <p className="text-xs text-slate-400 mt-1">{breathwork.steps}</p>
          </div>
        )}

        {/* Health tip */}
        {healthTip && (
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Heart size={13} className="text-[#10b981]" />
              <span className="text-xs font-semibold text-[#10b981] uppercase tracking-widest">Health Tip</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{healthTip}</p>
          </div>
        )}

        {/* Life hack */}
        {lifeHack && (
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb size={13} className="text-[#8b5cf6]" />
              <span className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-widest">Life Hack</span>
              <Badge variant="purple" className="ml-auto">{lifeHack.category}</Badge>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{lifeHack.tip}</p>
          </div>
        )}

        {/* Money tip */}
        {moneyTip && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign size={13} className="text-[#f59e0b]" />
              <span className="text-xs font-semibold text-[#f59e0b] uppercase tracking-widest">Money Tip</span>
              <Badge variant="gold" className="ml-auto">{moneyTip.category}</Badge>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{moneyTip.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
