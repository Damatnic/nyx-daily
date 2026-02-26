'use client';

import { useState, useEffect } from 'react';

export default function TimeGreeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    function getGreeting() {
      const hour = new Date().getHours();
      if (hour < 5)  return 'Still up, Nick?';
      if (hour < 12) return 'Good morning, Nick.';
      if (hour < 17) return 'Good afternoon, Nick.';
      if (hour < 21) return 'Good evening, Nick.';
      return 'Winding down, Nick?';
    }
    setGreeting(getGreeting());
  }, []);

  if (!greeting) return null;

  return (
    <span className="text-sm text-slate-500 font-normal">
      {greeting}
    </span>
  );
}
