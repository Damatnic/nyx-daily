'use client';

import { useState, useEffect } from 'react';

interface RelativeTimeProps {
  timestamp: string;
}

function getRelative(ts: string): string {
  const then = new Date(ts).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RelativeTime({ timestamp }: RelativeTimeProps) {
  const [label, setLabel] = useState(() => getRelative(timestamp));

  useEffect(() => {
    const id = setInterval(() => setLabel(getRelative(timestamp)), 60_000);
    return () => clearInterval(id);
  }, [timestamp]);

  return <span suppressHydrationWarning>{label}</span>;
}
