interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  gradient?: boolean;
  accent?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  className = '',
  gradient = false,
  accent = true,
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      {/* Accent bar */}
      {accent && (
        <div className="w-1 h-4 rounded-full bg-purple-500/60 shrink-0" />
      )}
      <span
        className={
          gradient
            ? 'bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent font-bold text-sm tracking-[0.1em] uppercase'
            : 'text-xs font-semibold tracking-widest uppercase text-slate-500'
        }
      >
        {title}
      </span>
      {subtitle && (
        <span className="text-xs text-slate-600">{subtitle}</span>
      )}
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}
