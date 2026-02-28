import type { DailyBriefing } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface TrendingRow {
  source: string;
  emoji: string;
  accentClass: string;
  title: string;
  sub?: string;
  url: string;
}

function buildRows(briefing: DailyBriefing): TrendingRow[] {
  const rows: TrendingRow[] = [];

  // HackerNews
  const hn = briefing.hacker_news?.[0];
  if (hn?.title) rows.push({
    source: 'HN',
    emoji: '🟠',
    accentClass: 'border-orange-500/30 bg-orange-500/[0.04]',
    title: hn.title,
    sub: hn.score ? `${hn.score} pts · ${hn.num_comments ?? 0} comments` : undefined,
    url: hn.link || hn.hn_url || `https://news.ycombinator.com`,
  });

  // Reddit
  const reddit = briefing.reddit_hot?.[0];
  if (reddit?.title) {
    const redditUrl = reddit.permalink
      ? (reddit.permalink.startsWith('http') ? reddit.permalink : `https://reddit.com${reddit.permalink}`)
      : `https://reddit.com`;
    rows.push({
      source: 'Reddit',
      emoji: '🔴',
      accentClass: 'border-red-500/20 bg-red-500/[0.03]',
      title: reddit.title,
      sub: reddit.subreddit ? `r/${reddit.subreddit}` : undefined,
      url: redditUrl,
    });
  }

  // GitHub Trending
  const gh = briefing.github_trending?.[0];
  if (gh?.repo) rows.push({
    source: 'GitHub',
    emoji: '⚫',
    accentClass: 'border-slate-500/20 bg-slate-500/[0.03]',
    title: gh.repo,
    sub: [gh.stars_today ? `⭐ +${gh.stars_today} today` : null, gh.language || null].filter(Boolean).join(' · ') || gh.description || undefined,
    url: gh.url || `https://github.com/trending`,
  });

  // Product Hunt
  const ph = briefing.product_hunt?.[0];
  if (ph?.name) rows.push({
    source: 'PH',
    emoji: '🟡',
    accentClass: 'border-yellow-500/20 bg-yellow-500/[0.03]',
    title: ph.name,
    sub: ph.tagline || undefined,
    url: ph.url || `https://www.producthunt.com`,
  });

  // Tech news
  const tech = briefing.news?.tech?.[0] || briefing.news?.ai?.[0];
  if (tech?.title) rows.push({
    source: 'Tech',
    emoji: '💻',
    accentClass: 'border-cyan-500/20 bg-cyan-500/[0.03]',
    title: tech.title,
    sub: tech.source || undefined,
    url: tech.link || '#',
  });

  // AI news (only if different from the tech item used above)
  const ai = briefing.news?.ai?.[0];
  if (ai?.title && ai.link !== tech?.link) rows.push({
    source: 'AI',
    emoji: '🤖',
    accentClass: 'border-violet-500/20 bg-violet-500/[0.03]',
    title: ai.title,
    sub: ai.source || undefined,
    url: ai.link || '#',
  });

  // Releases — pick first across games → movies → tv
  const rt = briefing.releases_today;
  const rel = rt?.games?.[0] || rt?.movies?.[0] || rt?.tv?.[0];
  if (rel?.title) rows.push({
    source: 'Release',
    emoji: rel.type === 'game' ? '🎮' : rel.type === 'movie' ? '🎬' : '📺',
    accentClass: 'border-emerald-500/20 bg-emerald-500/[0.03]',
    title: rel.title,
    sub: rel.rating != null ? `⭐ ${rel.rating}` : rel.platforms?.join(' · ') || rel.network || undefined,
    url: rel.url || `https://www.themoviedb.org`,
  });

  // YouTube
  const yt = briefing.youtube_picks?.[0];
  if (yt?.title) rows.push({
    source: 'YouTube',
    emoji: '▶️',
    accentClass: 'border-red-500/20 bg-red-500/[0.03]',
    title: yt.title,
    sub: yt.channel || undefined,
    url: yt.url || `https://youtube.com`,
  });

  // Hidden Gems
  const gem = briefing.hidden_gems?.[0];
  if (gem?.title) rows.push({
    source: 'Gem',
    emoji: '💎',
    accentClass: 'border-pink-500/20 bg-pink-500/[0.03]',
    title: gem.title,
    sub: gem.description || gem.source || undefined,
    url: gem.url || '#',
  });

  return rows;
}

interface Props {
  briefing: DailyBriefing;
}

export default function TrendingStack({ briefing }: Props) {
  const rows = buildRows(briefing);

  return (
    <div className="nyx-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Trending</span>
        <span className="text-[10px] text-slate-700">{rows.length} sources</span>
      </div>

      {/* Rows */}
      <div className="flex-1 divide-y divide-white/[0.04]">
        {rows.length === 0 && (
          <div className="px-5 py-8 text-center text-[12px] text-slate-700">No data yet — check back after 8 AM</div>
        )}
        {rows.map((row, i) => (
          <a
            key={i}
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-start gap-3 px-4 py-3 border-l-2 transition-all duration-150
                        hover:bg-white/[0.025] group ${row.accentClass}`}
          >
            {/* Source badge */}
            <div className="shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
              <span className="text-sm leading-none">{row.emoji}</span>
              <span className="text-[8px] font-black uppercase tracking-wide text-slate-700 leading-none mt-0.5">
                {row.source}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-slate-300 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {row.title}
              </p>
              {row.sub && (
                <p className="text-[10px] text-slate-700 mt-0.5 truncate">{row.sub}</p>
              )}
            </div>

            {/* Link icon */}
            <ExternalLink
              size={10}
              className="shrink-0 text-slate-800 group-hover:text-slate-500 transition-colors mt-1"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
