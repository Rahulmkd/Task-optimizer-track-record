"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetJournalsQuery } from "@/features/story/services/ai.service";

import { TodayStoryHeader } from "./TodayStoryHeader";
import { TodayStorySkeleton } from "./TodayStorySkeleton";
import { TodayStoryError } from "./TodayStoryError";
import { TodayStoryEmpty } from "./TodayStoryEmpty";
import { TodayStoryCard } from "./TodayStoryCard";
import { AIAssistanceModal } from "./AIAssistanceModal";

export function TodayStory() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery();
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <TodayStoryHeader
        isLoading={isLoading}
        entryCount={journals?.length ?? 0}
        onGenerateClick={() => setShowAIModal(true)}
      />

      {/* Loading State */}
      {isLoading && <TodayStorySkeleton />}

      {/* Error State */}
      {isError && <TodayStoryError />}

      {/* Empty State */}
      {!isLoading && !isError && (!journals || journals.length === 0) && (
        <TodayStoryEmpty onGenerateClick={() => setShowAIModal(true)} />
      )}

      {/* Cards Grid */}
      {!isLoading && !isError && journals && journals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          {journals.map((journal, i) => (
            <TodayStoryCard key={journal.id} journal={journal} index={i} />
          ))}
        </motion.div>
      )}

      {/* AI Story Generation Modal */}
      <AnimatePresence>
        {showAIModal && (
          <AIAssistanceModal onClose={() => setShowAIModal(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
