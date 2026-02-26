import SectionHeader from '@/components/ui/SectionHeader';

export interface SportGame {
  sport: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: 'final' | 'live' | 'scheduled';
  status_detail: string;
  winner: 'home' | 'away' | null;
}

interface SportsSectionProps {
  sports?: SportGame[] | null;
}

const SPORT_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  NBA: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  NHL: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  MLB: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  NFL: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  MLS: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

function getStatusStyle(status: SportGame['status']) {
  switch (status) {
    case 'live':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        dot: true,
      };
    case 'final':
      return {
        text: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/20',
        dot: false,
      };
    case 'scheduled':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: false,
      };
    default:
      return {
        text: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/20',
        dot: false,
      };
  }
}

function GameRow({ game }: { game: SportGame }) {
  const sportStyle = SPORT_CONFIG[game.sport] ?? {
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  };
  const statusStyle = getStatusStyle(game.status);
  const homeWins = game.winner === 'home';
  const awayWins = game.winner === 'away';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
      {/* Sport badge */}
      <span
        className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${sportStyle.color} ${sportStyle.bg} ${sportStyle.border}`}
      >
        {game.sport}
      </span>

      {/* Teams + scores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Away team */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className={`text-sm truncate ${awayWins ? 'font-semibold text-slate-100' : 'text-slate-400'}`}
              >
                {game.away_team}
              </span>
              <span
                className={`font-mono text-sm tabular-nums ${awayWins ? 'font-bold text-slate-100' : 'text-slate-500'}`}
              >
                {game.away_score}
              </span>
            </div>

            <span className="text-slate-700 text-xs">@</span>

            {/* Home team */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span
                className={`font-mono text-sm tabular-nums ${homeWins ? 'font-bold text-slate-100' : 'text-slate-500'}`}
              >
                {game.home_score}
              </span>
              <span
                className={`text-sm truncate ${homeWins ? 'font-semibold text-slate-100' : 'text-slate-400'}`}
              >
                {game.home_team}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${statusStyle.text} ${statusStyle.bg} ${statusStyle.border}`}
      >
        {statusStyle.dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
        {game.status === 'final' ? 'FINAL' : game.status_detail}
      </span>
    </div>
  );
}

export default function SportsSection({ sports }: SportsSectionProps) {
  if (!sports || sports.length === 0) return null;

  // Group by sport, maintaining order: NBA, NHL, MLB, then others
  const sportOrder = ['NBA', 'NHL', 'MLB', 'NFL', 'MLS'];
  const grouped = sports.reduce(
    (acc, game) => {
      if (!acc[game.sport]) acc[game.sport] = [];
      acc[game.sport].push(game);
      return acc;
    },
    {} as Record<string, SportGame[]>
  );

  const sortedSports = Object.keys(grouped).sort((a, b) => {
    const aIndex = sportOrder.indexOf(a);
    const bIndex = sportOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="🏆 Sports" subtitle={`${sports.length} games`} />

      <div className="flex flex-col gap-4">
        {sortedSports.map((sport) => (
          <div key={sport} className="flex flex-col gap-2">
            {grouped[sport].map((game, i) => (
              <GameRow key={`${game.away_team}-${game.home_team}-${i}`} game={game} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
