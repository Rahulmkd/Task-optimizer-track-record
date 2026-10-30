"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]"
    >
      <div className="h-14 w-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-white/50 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="gradient" size="sm" onClick={onAction} className="cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
