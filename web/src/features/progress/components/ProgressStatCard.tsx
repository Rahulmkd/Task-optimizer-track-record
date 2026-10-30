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
      className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 shadow-lg transition-all hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl border border-white/10
            ${iconClassName}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-md">
          {label}
        </span>
      </div>

      <div className="mt-4">
        <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${valueClassName}`}>
          {value}
        </p>

        <p className="mt-1 text-xs text-white/50">{description}</p>
      </div>
    </motion.div>
  );
}
