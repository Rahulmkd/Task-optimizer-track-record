"use client";

import { motion } from "framer-motion";

import { DashboardShell } from "@/components/layouts/DashboardShell";

import { TodayStory } from "@/views/todays-story";

export default function JournalPage() {
  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
      >
        <TodayStory />
      </motion.div>
    </DashboardShell>
  );
}
