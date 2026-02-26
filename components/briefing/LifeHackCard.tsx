import Badge from '@/components/ui/Badge';
import { Lightbulb } from 'lucide-react';

interface LifeHackCardProps {
  lifeHack?: { category: string; tip: string } | null;
}

export default function LifeHackCard({ lifeHack }: LifeHackCardProps) {
  if (!lifeHack) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Subtle purple glow accent */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Lightbulb size={18} className="text-[#8b5cf6]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200">Life Hack</h3>
          </div>
          <Badge variant="purple">{lifeHack.category}</Badge>
        </div>

        {/* Tip content */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {lifeHack.tip}
        </p>
      </div>
    </div>
  );
}
