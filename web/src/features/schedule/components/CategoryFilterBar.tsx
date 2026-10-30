"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CATEGORY_FILTERS,
  CategoryFilter,
} from "../utils/next-week-schedule.utils";

interface CategoryFilterBarProps {
  value: CategoryFilter;
  categories?: string[];
  onChange: (category: CategoryFilter) => void;
}

export function CategoryFilterBar({
  value,
  categories,
  onChange,
}: CategoryFilterBarProps) {
  const filterList = categories ?? CATEGORY_FILTERS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="flex items-center gap-2 flex-wrap"
    >
      {filterList.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer",
            value === cat
              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-900/30"
              : "border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:border-white/20",
          )}
        >
          {cat}
        </button>
      ))}
    </motion.div>
  );
}
