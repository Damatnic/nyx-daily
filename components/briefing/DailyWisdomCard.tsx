import SaveButton from '@/components/ui/SaveButton';

interface LifeTip { category: string; tip: string }
interface Props {
  health_tip?: string | null;
  life_hack?: LifeTip | null;
  money_tip?: LifeTip | null;
}

interface Row {
  icon: string;
  label: string;
  category?: string;
  text: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

export default function DailyWisdomCard({ health_tip, life_hack, money_tip }: Props) {
  if (!health_tip && !life_hack && !money_tip) return null;

  const rows: Row[] = [];

  if (health_tip) rows.push({
    icon: '🫀',
    label: 'Health',
    text: health_tip,
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-500/5',
    accentBorder: 'border-rose-500/10',
  });

  if (life_hack) rows.push({
    icon: '⚡',
    label: 'Life Hack',
    category: life_hack.category,
    text: life_hack.tip,
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/5',
    accentBorder: 'border-amber-500/10',
  });

  if (money_tip) rows.push({
    icon: '💰',
    label: 'Money',
    category: money_tip.category,
    text: money_tip.tip,
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/5',
    accentBorder: 'border-emerald-500/10',
  });

  if (!rows.length) return null;

  return (
    <div className="nyx-card overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Daily Wisdom
        </span>
      </div>

      <div className="flex flex-col divide-y divide-white/[0.04]">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-start gap-3 px-4 py-3.5 ${row.accentBg} group`}
          >
            <span className="text-base shrink-0 leading-none mt-0.5">{row.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${row.accentText}`}>
                  {row.label}
                </span>
                {row.category && (
                  <>
                    <span className="text-slate-800">·</span>
                    <span className="text-[9px] text-slate-700 uppercase tracking-wider">{row.category}</span>
                  </>
                )}
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-300 leading-relaxed">
                {row.text}
              </p>
            </div>
            <SaveButton
              item={{ type: 'gem', title: `${row.label}: ${row.text}`, url: '' }}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
