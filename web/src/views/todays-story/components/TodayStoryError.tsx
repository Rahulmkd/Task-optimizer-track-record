"use client";

export function TodayStoryError() {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-center text-red-400 text-xs">
      Couldn&apos;t load journals. Please try again.
    </div>
  );
}
