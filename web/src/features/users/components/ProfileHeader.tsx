"use client";

import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-5 sm:p-7 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/25 via-white/[0.02] to-transparent backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <UserIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User Profile &amp; Security Controls
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-white/50 max-w-xl">
          Manage your identity records, contact parameters, session credentials, and data residency.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto shrink-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Account Active
        </span>
      </div>
    </motion.div>
  );
}
