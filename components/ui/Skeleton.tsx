interface SkeletonCardProps {
  lines?: number;
  height?: string;
}

export function SkeletonCard({ lines = 3, height = 'h-4' }: SkeletonCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 animate-pulse">
      <div className="h-3 w-24 bg-white/[0.06] rounded mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-white/[0.04] rounded mb-2 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonNews() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 animate-pulse">
      <div className="h-3 w-20 bg-white/[0.06] rounded mb-4" />

      {/* Hero image placeholder */}
      <div className="w-full h-52 bg-white/[0.04] rounded-lg mb-4" />

      {/* Secondary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="w-full h-32 bg-white/[0.04] rounded-lg" />
            <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
            <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonWeather() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-white/[0.06] rounded-lg" />
        <div className="h-3 w-16 bg-white/[0.04] rounded" />
      </div>
      <div className="h-8 w-24 bg-white/[0.06] rounded mb-2" />
      <div className="h-3 w-20 bg-white/[0.04] rounded mb-4" />

      {/* Forecast strip */}
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-6 h-6 bg-white/[0.04] rounded" />
            <div className="h-2 w-8 bg-white/[0.04] rounded" />
            <div className="h-2 w-10 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5 animate-pulse">
      <div className="h-3 w-28 bg-white/[0.06] rounded mb-4" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/[0.04] rounded shrink-0" />
            <div className="flex-1">
              <div className="h-3 w-3/4 bg-white/[0.04] rounded mb-1.5" />
              <div className="h-2 w-1/2 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMarkets() {
  return (
    <div className="w-full bg-[#0a0a18] border-b border-white/[0.04] animate-pulse">
      <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-10 bg-white/[0.06] rounded" />
            <div className="h-3 w-14 bg-white/[0.04] rounded" />
            <div className="h-3 w-12 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
