interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
        {title}
      </span>
      {subtitle && (
        <span className="text-xs text-slate-600">{subtitle}</span>
      )}
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}
