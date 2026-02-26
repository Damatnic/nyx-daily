import type { BreathworkSession } from '@/lib/types';
import BreathworkCard from './BreathworkCard';

interface WellnessBlockProps {
  breathwork?: {
    name: string;
    steps: string;
    rounds: number;
  } | null;
  breathworkSession?: BreathworkSession | null;
}

/**
 * WellnessBlock - simplified wrapper for BreathworkCard
 * Life hack, money tip, and health tip have been moved to standalone cards.
 */
export default function WellnessBlock({ breathwork, breathworkSession }: WellnessBlockProps) {
  // If we have a structured breathwork session, use that
  if (breathworkSession) {
    return <BreathworkCard session={breathworkSession} />;
  }

  // Otherwise, use the old-format breathwork as fallback text
  if (breathwork) {
    const fallbackText = `${breathwork.name}: ${breathwork.steps} (${breathwork.rounds} rounds)`;
    return <BreathworkCard session={null} fallbackText={fallbackText} />;
  }

  return null;
}
