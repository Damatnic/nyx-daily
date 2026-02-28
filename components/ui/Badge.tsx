import { ReactNode } from 'react';

type BadgeVariant = 'purple' | 'cyan' | 'gold' | 'red' | 'green' | 'slate' | 'amber' | 'blue' | 'yellow';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  gold: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
  green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
};

export default function Badge({ children, variant = 'slate', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        border transition-all duration-200
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
