import { Heart } from 'lucide-react';

interface HealthTipCardProps {
  healthTip?: string | null;
}

export default function HealthTipCard({ healthTip }: HealthTipCardProps) {
  if (!healthTip) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Subtle emerald glow accent */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Heart size={18} className="text-[#10b981]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200">Health Tip</h3>
          </div>
        </div>

        {/* Tip content */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {healthTip}
        </p>
      </div>
    </div>
  );
}
