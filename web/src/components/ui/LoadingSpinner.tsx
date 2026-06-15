"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ className, size = "md", label }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("relative", sizeMap[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-blue-400 animate-spin animation-delay-150" style={{ animationDelay: "0.15s" }} />
      </div>
      {label && (
        <p className="text-sm text-white/50 animate-pulse">{label}</p>
      )}
    </div>
  );
}
