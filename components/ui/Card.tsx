import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function Card({ children, className = '', gradient = false }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-white/[0.06] bg-[#0d0d1a]
        ${gradient ? 'bg-gradient-to-br from-[#0d0d1a] to-[#0a0a18]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
