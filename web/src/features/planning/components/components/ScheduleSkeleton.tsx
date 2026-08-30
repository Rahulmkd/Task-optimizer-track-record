"use client";

export function ScheduleSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
