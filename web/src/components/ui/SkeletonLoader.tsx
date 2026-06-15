"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/10",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
