'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface RevealCardProps {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
}

export default function RevealCard({ children, delay = 0, className = '' }: RevealCardProps) {
  const { ref, visible } = useScrollReveal();

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal min-w-0 ${visible ? 'visible' : ''} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
