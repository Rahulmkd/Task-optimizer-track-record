"use client";

import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

interface TodayStoryEmptyProps {
  onGenerateClick?: () => void;
}

export function TodayStoryEmpty({ onGenerateClick }: TodayStoryEmptyProps) {
  return (
    <EmptyState
      icon={Sparkles}
      title="No story entries generated yet"
      description="Run the AI Coach to analyze today's completed and pending tasks, calculate your productivity score, and write your first story."
      actionLabel={onGenerateClick ? "Generate Today's Story" : undefined}
      onAction={onGenerateClick}
    />
  );
}
