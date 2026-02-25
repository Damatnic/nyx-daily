import { AppOfTheDay as AppType } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { ExternalLink, Zap, Lightbulb, Star } from 'lucide-react';

interface AppOfTheDayProps {
  app: AppType;
}

export default function AppOfTheDay({ app }: AppOfTheDayProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] overflow-hidden">
      {/* Header gradient */}
      <div className="p-5 bg-gradient-to-r from-purple-500/10 via-[#0d0d1a] to-cyan-500/10 border-b border-white/[0.06]">
        <SectionHeader title="App of the Day" className="mb-2" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">{app.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="purple">{app.category}</Badge>
              {app.free && <Badge variant="green">Free</Badge>}
              {app.freemium && !app.free && <Badge variant="cyan">Freemium</Badge>}
              {!app.free && !app.freemium && <Badge variant="gold">Paid</Badge>}
            </div>
          </div>
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-purple-400 text-white text-sm font-medium transition-all duration-200"
          >
            Try it <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mt-0.5 shrink-0">
            <Zap size={14} className="text-[#06b6d4]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">What it is</p>
            <p className="text-sm text-slate-300 leading-relaxed">{app.what}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 mt-0.5 shrink-0">
            <Lightbulb size={14} className="text-[#8b5cf6]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Why it matters</p>
            <p className="text-sm text-slate-300 leading-relaxed">{app.why}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-0.5 shrink-0">
            <Star size={14} className="text-[#f59e0b]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">The verdict</p>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">{app.verdict}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
