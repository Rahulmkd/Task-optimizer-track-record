"use client";

import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";

export function TodayStoryEmpty() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No journal entries yet"
      description="Generate your first AI summary from the Dashboard to see entries here."
    />
  );
}
