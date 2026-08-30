"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface ProgressStatCardProps {
  icon: typeof Activity;
  label: string;
  value: string | number;
  description: string;
  iconClassName: string;
  valueClassName?: string;
}

export function ProgressStatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
  valueClassName = "text-white",
}: ProgressStatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="
        group rounded-2xl
        border border-white/[0.08]
        bg-white/[0.035]
        p-4
        transition-colors
        hover:border-white/[0.14]
        hover:bg-white/[0.05]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl border border-white/[0.06]
            ${iconClassName}
          `}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">
          {label}
        </span>
      </div>

      <div className="mt-4">
        <p className={`text-2xl font-black tracking-tight ${valueClassName}`}>
          {value}
        </p>

        <p className="mt-1 text-[11px] text-white/35">{description}</p>
      </div>
    </motion.div>
  );
}
