"use client";

export function ProgressSkeleton() {
  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div className="h-7 w-44 animate-pulse rounded-lg bg-white/[0.06]" />

        <div className="h-4 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STAT CARDS                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]"
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CHART                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="h-[340px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />

      {/* ------------------------------------------------------------------ */}
      {/* SECONDARY CONTENT                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-[300px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />

        <div className="h-[300px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
      </div>
    </div>
  );
}
