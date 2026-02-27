import type { PersonalGitHub, GitHubPR, GitHubRepoActivity } from '@/lib/types';
import { GitPullRequest, GitBranch, ExternalLink } from 'lucide-react';

function PRBadge({ state }: { state: string }) {
  const cls =
    state === 'merged'  ? 'bg-violet-500/10 text-violet-400/80 border-violet-500/15' :
    state === 'closed'  ? 'bg-red-500/10 text-red-400/80 border-red-500/15' :
                          'bg-emerald-500/10 text-emerald-400/80 border-emerald-500/15';
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${cls} font-mono uppercase shrink-0`}>
      {state}
    </span>
  );
}

export default function PersonalGitHubCard({ data }: { data?: PersonalGitHub | null }) {
  const repos = data?.repos ?? [];
  const prs   = data?.prs ?? [];
  if (!repos.length && !prs.length) return null;

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">My Activity</span>
        </div>
        {data?.summary && (
          <span className="text-[10px] text-slate-600 font-mono">{data.summary}</span>
        )}
      </div>

      {/* Active repos */}
      {repos.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {repos.map((r: GitHubRepoActivity) => (
            <a
              key={r.full}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors group"
            >
              <GitBranch size={12} className="shrink-0 text-emerald-500/60" />
              <span className="flex-1 text-[13px] text-slate-300 group-hover:text-white transition-colors font-medium">
                {r.repo}
              </span>
              <span className="text-[10px] text-slate-600 font-mono tabular-nums">
                {r.pushes} push{r.pushes !== 1 ? 'es' : ''}
              </span>
              <ExternalLink size={10} className="shrink-0 text-slate-700 group-hover:text-emerald-400 transition-colors" />
            </a>
          ))}
        </div>
      )}

      {/* Open PRs */}
      {prs.length > 0 && (
        <div className={`${repos.length ? 'border-t border-white/[0.05]' : ''} divide-y divide-white/[0.04]`}>
          {prs.map((pr: GitHubPR, i: number) => (
            <a
              key={i}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors group"
            >
              <GitPullRequest size={12} className="shrink-0 text-violet-500/60 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-300 group-hover:text-white leading-snug line-clamp-1 transition-colors">{pr.title}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{pr.repo}</p>
              </div>
              <PRBadge state={pr.state} />
            </a>
          ))}
        </div>
      )}

      <div className="px-5 py-3 border-t border-white/[0.05]">
        <a
          href="https://github.com/Damatnic"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-700 hover:text-emerald-400 transition-colors"
        >
          View all repos →
        </a>
      </div>
    </div>
  );
}
