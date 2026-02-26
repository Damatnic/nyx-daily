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

const SPORT_META: Record<string, { label: string; color: string }> = {
  nba: { label: 'NBA', color: '#c88c2a' },
  nhl: { label: 'NHL', color: '#4da3e0' },
  mlb: { label: 'MLB', color: '#c0392b' },
  nfl: { label: 'NFL', color: '#2c7a34' },
  mls: { label: 'MLS', color: '#2ecc71' },
};

function Scoreboard({ game }: { game: SportGame }) {
  const homeW = game.winner === 'home';
  const awayW = game.winner === 'away';
  const isLive = game.status === 'live';
  const sport = SPORT_META[game.sport] ?? { label: game.sport.toUpperCase(), color: '#8b949e' };

  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04] last:border-0">
      {/* Sport badge */}
      <span
        className="shrink-0 text-[9px] font-black uppercase tracking-wider w-8 text-center"
        style={{ color: sport.color }}
      >
        {sport.label}
      </span>

      {/* Scoreboard */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Away team */}
        <div className={`flex items-center gap-2 justify-end ${awayW ? 'text-slate-100' : 'text-slate-500'}`}>
          <span className={`text-xs truncate text-right ${awayW ? 'font-semibold' : 'font-normal'}`}>
            {game.away_team}
          </span>
          <span className={`text-base font-black tabular-nums w-7 text-right ${awayW ? 'text-slate-100' : 'text-slate-500'}`}>
            {game.away_score}
          </span>
        </div>

        {/* Center */}
        <span className="text-[10px] text-slate-700 shrink-0">–</span>

        {/* Home team */}
        <div className={`flex items-center gap-2 ${homeW ? 'text-slate-100' : 'text-slate-500'}`}>
          <span className={`text-base font-black tabular-nums w-7 ${homeW ? 'text-slate-100' : 'text-slate-500'}`}>
            {game.home_score}
          </span>
          <span className={`text-xs truncate ${homeW ? 'font-semibold' : 'font-normal'}`}>
            {game.home_team}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="shrink-0 text-right min-w-[40px]">
        {isLive ? (
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        ) : game.status === 'final' ? (
          <span className="text-[9px] text-slate-700 uppercase font-semibold">Final</span>
        ) : (
          <span className="text-[9px] text-amber-500/70 font-mono">{game.status_detail}</span>
        )}
      </div>
    </div>
  );
}

export default function SportsSection({ sports }: { sports?: SportGame[] | null }) {
  if (!sports?.length) return null;

  const sportOrder = ['nba', 'nhl', 'mlb', 'nfl', 'mls'];
  const sorted = [...sports].sort((a, b) => {
    const ai = sportOrder.indexOf(a.sport);
    const bi = sportOrder.indexOf(b.sport);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="nyx-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-200">Scores</span>
        <span className="text-[10px] text-slate-700 font-mono">{sports.length} games</span>
      </div>
      <div>
        {sorted.map((game, i) => <Scoreboard key={i} game={game} />)}
      </div>
    </div>
  );
}
