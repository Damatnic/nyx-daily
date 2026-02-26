import Badge from '@/components/ui/Badge';
import { DollarSign } from 'lucide-react';

interface MoneyTipCardProps {
  moneyTip?: { category: string; tip: string } | null;
}

export default function MoneyTipCard({ moneyTip }: MoneyTipCardProps) {
  if (!moneyTip) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Subtle amber glow accent */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <DollarSign size={18} className="text-[#f59e0b]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200">Money Tip</h3>
          </div>
          <Badge variant="gold">{moneyTip.category}</Badge>
        </div>

        {/* Tip content */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {moneyTip.tip}
        </p>
      </div>
    </div>
  );
}
