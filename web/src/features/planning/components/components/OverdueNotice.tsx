"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface OverdueNoticeProps {
  count: number;
}

export function OverdueNotice({ count }: OverdueNoticeProps) {
  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-red-400 text-xs"
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {count} task{count > 1 ? "s" : ""} overdue from earlier this week
    </motion.div>
  );
}
