'use client';
import { useState, useEffect } from 'react';

/**
 * Reads localStorage keys `workout-YYYY-MM-DD` for the past 30 days.
 * A day counts if at least one exercise index was recorded as done.
 * Today is "pending" — if today has 0 done, we skip it and look at yesterday.
 */
export function useWorkoutStreak(): number {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date();
    let s = 0;
    let todaySkipped = false;

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-');

      try {
        const saved = localStorage.getItem(`workout-${dateStr}`);
        const done: number[] = saved ? JSON.parse(saved) : [];
        const count = Array.isArray(done) ? done.length : 0;

        if (count === 0) {
          if (i === 0 && !todaySkipped) {
            // Today not started yet — skip and check yesterday
            todaySkipped = true;
            continue;
          }
          break; // Gap found — streak ends
        }
        s++;
      } catch {
        break;
      }
    }

    setStreak(s);
  }, []);

  return streak;
}
