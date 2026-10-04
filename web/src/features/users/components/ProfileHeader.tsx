"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Sparkles } from "lucide-react";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-violet-400" />
          </div>
          Profile Settings
        </h1>
        <p className="text-white/40 text-sm mt-1.5">
          Manage your personal information, contact details, and account security.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="h-3 w-3" />
          Account Active
        </span>
      </div>
    </motion.div>
  );
}
