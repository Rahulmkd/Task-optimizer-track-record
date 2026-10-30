"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DangerZoneCardProps {
  onOpenDeleteModal: () => void;
}

export function DangerZoneCard({ onOpenDeleteModal }: DangerZoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-red-500/25 bg-red-950/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-base sm:text-lg">Irreversible Danger Zone</h3>
            <p className="text-white/50 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Permanently delete your account and remove all personal records, daily tasks, weekly schedules, and AI journal entries. This action cannot be reversed.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="default"
          onClick={onOpenDeleteModal}
          className="shrink-0 self-start sm:self-auto font-semibold cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          <span>Delete Account</span>
        </Button>
      </div>
    </motion.div>
  );
}
