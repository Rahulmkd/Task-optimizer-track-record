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
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white/30" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-white/40 text-sm max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
