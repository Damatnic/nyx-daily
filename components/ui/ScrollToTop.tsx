'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 w-9 h-9 rounded-full bg-[#0b0b18] border border-white/[0.1] text-slate-500 hover:text-violet-400 hover:border-violet-500/30 shadow-lg shadow-black/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
    >
      <ArrowUp size={15} />
    </button>
  );
}
