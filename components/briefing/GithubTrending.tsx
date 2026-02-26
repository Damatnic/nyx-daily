import SectionHeader from '@/components/ui/SectionHeader';
import { Star, TrendingUp } from 'lucide-react';

export interface GitHubRepo {
  repo: string;
  url: string;
  description: string;
  language: string | null;
  stars: string;
  stars_today: number;
}

interface GithubTrendingProps {
  repos?: GitHubRepo[] | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Lua: '#000080',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Zig: '#ec915c',
};

function RepoRow({ repo, rank }: { repo: GitHubRepo; rank: number }) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? '#8b949e' : null;

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-200"
    >
      {/* Rank */}
      <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-slate-800/60 text-[10px] font-bold font-mono text-slate-500 group-hover:text-purple-400 transition-colors">
        {String(rank).padStart(2, '0')}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
            {repo.repo}
          </span>
        </div>
        {repo.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {repo.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Language */}
          {repo.language && langColor && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span className="text-[10px] text-slate-400">{repo.language}</span>
            </span>
          )}

          {/* Stars */}
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Star size={10} className="text-amber-400" />
            {repo.stars}
          </span>

          {/* Stars today */}
          {repo.stars_today > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <TrendingUp size={10} />
              +{repo.stars_today} today
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function GithubTrending({ repos }: GithubTrendingProps) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="📈 GitHub Trending" subtitle={`${repos.length} repos`} />

      <div className="flex flex-col gap-2">
        {repos.slice(0, 8).map((repo, i) => (
          <RepoRow key={repo.repo} repo={repo} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
