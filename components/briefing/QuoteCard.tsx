interface QuoteCardProps {
  quote: string | null;
  author: string | null;
}

export default function QuoteCard({ quote, author }: QuoteCardProps) {
  if (!quote) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-gradient-to-r from-purple-500/5 via-[#0d0d1a] to-cyan-500/5 p-8 text-center relative overflow-hidden">
      <div className="absolute top-4 left-8 text-6xl text-purple-500/20 font-serif leading-none select-none">
        &ldquo;
      </div>
      <div className="absolute bottom-4 right-8 text-6xl text-purple-500/20 font-serif leading-none select-none">
        &rdquo;
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-xl sm:text-2xl font-medium text-slate-100 italic leading-relaxed">
          {quote}
        </p>
        {author && (
          <p className="mt-4 text-sm font-semibold tracking-widest uppercase text-[#8b5cf6]">
            — {author}
          </p>
        )}
      </div>
    </div>
  );
}
