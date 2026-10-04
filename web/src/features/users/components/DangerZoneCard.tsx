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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.16, ease: "easeOut" }}
      className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] backdrop-blur-xl p-6 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-400 font-semibold text-lg">Danger Zone</h3>
            <p className="text-white/40 text-sm mt-0.5 max-w-xl">
              Permanently delete your account and remove all personal records,
              tasks, actions, and weekly schedules. This action cannot be undone.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="default"
          onClick={onOpenDeleteModal}
          className="shrink-0 self-start sm:self-auto bg-red-600/90 hover:bg-red-600 border border-red-500/30"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete account
        </Button>
      </div>
    </motion.div>
  );
}
