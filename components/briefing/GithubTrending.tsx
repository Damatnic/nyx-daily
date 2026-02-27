'use client';

import { Star, TrendingUp, ExternalLink } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

export interface GitHubRepo {
  repo: string;
  url: string;
  description: string;
  language: string | null;
  stars: string;
  stars_today: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  C: '#888', Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF',
  PHP: '#4F5D95', Shell: '#89e051', Vue: '#41b883', HTML: '#e34c26',
  CSS: '#563d7c', Dart: '#00B4AB', Scala: '#c22d40', Elixir: '#6e4a7e',
  Zig: '#ec915c', 'C#': '#178600', Nix: '#7e7eff',
};

export default function GithubTrending({ repos }: { repos?: GitHubRepo[] | null }) {
  if (!repos?.length) return null;
  const top = repos.slice(0, 6);

  return (
    <div className="nyx-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">GitHub</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 bg-white/[0.04] border border-white/[0.06] rounded-full px-1.5 py-0.5">Trending</span>
        </div>
        <span className="text-[10px] text-slate-700 font-mono">{top.length} repos</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {top.map((repo, i) => {
          const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#8b949e' : null;
          return (
            <div key={repo.repo} className="story-row group flex items-start gap-3 px-5 py-3">
              {/* Rank */}
              <span className="text-[10px] font-mono text-slate-700 w-4 shrink-0 mt-1 tabular-nums">{i + 1}</span>

              {/* Clickable content */}
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-start gap-2 min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                    {repo.repo}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {langColor && repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                        <span className="text-[10px] text-slate-600">{repo.language}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-slate-600">
                      <Star size={9} className="text-amber-500/70" />
                      {repo.stars}
                    </span>
                    {repo.stars_today > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-500/80">
                        <TrendingUp size={9} />
                        +{repo.stars_today}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink size={11} className="shrink-0 text-slate-800 group-hover:text-violet-500 transition-colors mt-1" />
              </a>

              <SaveButton item={{ type: 'tool', title: repo.repo, url: repo.url, source: 'GitHub Trending', snippet: repo.description || undefined }} />
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-white/[0.05]">
        <a
          href="https://github.com/trending"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-700 hover:text-violet-400 transition-colors"
        >
          All trending repos →
        </a>
      </div>
    </div>
  );
}
