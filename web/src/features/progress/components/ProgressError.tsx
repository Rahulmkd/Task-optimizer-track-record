"use client";

import { CircleAlert } from "lucide-react";

export function ProgressError() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.035] p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/10">
          <CircleAlert className="h-5 w-5 text-red-400" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-white">
          Unable to load progress
        </h3>

        <p className="mt-1 text-xs leading-5 text-white/35">
          Something went wrong while loading your productivity data. Please try
          again.
        </p>
      </div>
    </div>
  );
}
