import SectionHeader from '@/components/ui/SectionHeader';
import { ExternalLink, ChevronUp } from 'lucide-react';

export interface ProductHuntPost {
  name: string;
  tagline: string;
  url: string;
  votes: number;
}

interface ProductHuntProps {
  posts?: ProductHuntPost[] | null;
}

function ProductCard({ post, rank }: { post: ProductHuntPost; rank: number }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition-all duration-200"
    >
      {/* Rank */}
      <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold font-mono text-orange-400">
        {rank}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
            {post.name}
          </span>
          <ExternalLink
            size={11}
            className="shrink-0 text-slate-600 group-hover:text-orange-400 transition-colors"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {post.tagline}
        </p>
      </div>

      {/* Vote count — only show if we have real data */}
      {post.votes > 0 && (
        <div className="shrink-0 flex flex-col items-center justify-center px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
          <ChevronUp size={12} className="text-orange-400 -mb-0.5" />
          <span className="text-xs font-bold text-orange-400 tabular-nums">{post.votes}</span>
        </div>
      )}
    </a>
  );
}

export default function ProductHunt({ posts }: ProductHuntProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 relative overflow-hidden">
      {/* Subtle orange accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <SectionHeader title="🚀 Product Hunt" subtitle="Today's top products" />

      <div className="flex flex-col gap-2 relative z-10">
        {posts.slice(0, 5).map((post, i) => (
          <ProductCard key={`${post.name}-${i}`} post={post} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
