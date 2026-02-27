'use client';
import { ChevronUp } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

export interface ProductHuntPost {
  name: string;
  tagline: string;
  url: string;
  votes: number;
}

export default function ProductHunt({ posts }: { posts?: ProductHuntPost[] | null }) {
  if (!posts?.length) return null;
  const top = posts.slice(0, 5);

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Product Hunt</span>
        <span className="text-[10px] text-slate-700 font-mono">Today's launches</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {top.map((post, i) => (
          <div key={i} className="story-row group flex items-center gap-3 px-5 py-3">
            <span className="text-[10px] font-mono text-slate-700 w-4 shrink-0 tabular-nums">{i + 1}</span>
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                {post.name}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{post.tagline}</p>
            </a>
            {post.votes > 0 && (
              <div className="shrink-0 flex items-center gap-0.5 text-[11px] font-bold text-orange-500/70">
                <ChevronUp size={12} />
                {post.votes}
              </div>
            )}
            <SaveButton item={{ type: 'product', title: post.name, url: post.url, snippet: post.tagline, source: 'Product Hunt' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
