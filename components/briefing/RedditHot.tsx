'use client';
import { ExternalLink, MessageCircle } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

export interface RedditPost {
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  score: number;
  num_comments: number;
  thumbnail: string | null;
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function RedditHot({ posts }: { posts?: RedditPost[] | null }) {
  if (!posts?.length) return null;
  const top = posts.slice(0, 5);

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Reddit</span>
        <span className="text-[10px] text-slate-700 font-mono">{top.length} hot</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {top.map((post, i) => (
          <div key={i} className="story-row flex items-start gap-3 px-5 py-3 group">
            {/* Score */}
            <div className="shrink-0 text-center w-9 pt-0.5">
              <p className="text-sm font-black text-amber-400 tabular-nums leading-none">{fmt(post.score)}</p>
              <p className="text-[8px] text-slate-700 uppercase tracking-wide mt-0.5">pts</p>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2 font-medium block"
              >
                {post.title}
              </a>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href={`https://reddit.com/r/${post.subreddit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-orange-500/70 hover:text-orange-400 transition-colors"
                >
                  r/{post.subreddit}
                </a>
                <span className="flex items-center gap-1 text-[10px] text-slate-600">
                  <MessageCircle size={9} />
                  {fmt(post.num_comments)}
                </span>
                <a
                  href={`https://reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[10px] text-slate-700 hover:text-slate-500 transition-colors flex items-center gap-0.5"
                >
                  thread <ExternalLink size={9} />
                </a>
              </div>
            </div>
            <SaveButton item={{ type: 'reddit', title: post.title, url: post.url, source: `r/${post.subreddit}` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
