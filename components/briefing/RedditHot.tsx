import SectionHeader from '@/components/ui/SectionHeader';
import { MessageSquare, ExternalLink } from 'lucide-react';

export interface RedditPost {
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  score: number;
  num_comments: number;
  thumbnail: string | null;
}

interface RedditHotProps {
  posts?: RedditPost[] | null;
}

function formatScore(score: number): string {
  if (score >= 10000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return score.toString();
}

function PostRow({ post }: { post: RedditPost }) {
  const redditUrl = `https://reddit.com${post.permalink}`;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-orange-500/20 hover:bg-white/[0.04] transition-all duration-200 group">
      {/* Score */}
      <div className="shrink-0 flex flex-col items-center justify-center min-w-[40px]">
        <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
          {formatScore(post.score)}
        </span>
        <span className="text-[9px] text-slate-600 uppercase">pts</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-200 hover:text-white transition-colors line-clamp-2 leading-snug"
        >
          {post.title}
        </a>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Subreddit badge */}
          <a
            href={`https://reddit.com/r/${post.subreddit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold text-orange-400/80 hover:text-orange-400 transition-colors"
          >
            r/{post.subreddit}
          </a>

          {/* Comments */}
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <MessageSquare size={10} />
            {formatScore(post.num_comments)}
          </span>

          {/* Link to reddit thread */}
          <a
            href={redditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 transition-colors ml-auto"
          >
            <ExternalLink size={10} />
            thread
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RedditHot({ posts }: RedditHotProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="🔥 Reddit Hot" subtitle={`${posts.length} posts`} />

      <div className="flex flex-col gap-2">
        {posts.slice(0, 5).map((post, i) => (
          <PostRow key={`${post.subreddit}-${i}`} post={post} />
        ))}
      </div>
    </div>
  );
}
