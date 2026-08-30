"use client";

import { useGetJournalsQuery } from "@/features/story/services/ai.service";

import { TodayStoryHeader } from "./TodayStoryHeader";
import { TodayStorySkeleton } from "./TodayStorySkeleton";
import { TodayStoryError } from "./TodayStoryError";
import { TodayStoryEmpty } from "./TodayStoryEmpty";
import { TodayStoryCard } from "./TodayStoryCard";

/**
 * Root component: fetches the journals and wires the header, loading,
 * error, empty, and card-grid states together.
 */
export function TodayStory() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();

  return (
    <section className="space-y-3">
      {/* section header */}
      <TodayStoryHeader
        isLoading={isLoading}
        entryCount={journals?.length ?? 0}
      />

      {/* states */}
      {isLoading && <TodayStorySkeleton />}

      {isError && <TodayStoryError />}

      {!isLoading && !isError && (!journals || journals.length === 0) && (
        <TodayStoryEmpty />
      )}

      {/* card grid — 2 columns on md+ to keep cards compact */}
      {!isLoading && !isError && journals && journals.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {journals.map((journal, i) => (
            <TodayStoryCard key={journal.id} journal={journal} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
