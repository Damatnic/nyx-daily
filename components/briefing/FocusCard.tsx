import { Target } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

interface FocusCardProps {
  focus: string;
}

export default function FocusCard({ focus }: FocusCardProps) {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Purple glow accent */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#8b5cf6] to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

      <SectionHeader title="Today's Focus" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 shrink-0">
          <Target size={16} className="text-[#8b5cf6]" />
        </div>
        <p className="text-slate-100 text-base font-medium leading-relaxed">{focus}</p>
      </div>
    </div>
  );
}
