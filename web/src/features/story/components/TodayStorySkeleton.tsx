"use client";

export function TodayStorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
        />
      ))}
    </div>
  );
}
