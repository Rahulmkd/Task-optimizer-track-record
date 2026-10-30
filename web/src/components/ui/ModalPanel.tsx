"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ModalPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 14 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full max-w-md rounded-2xl overflow-hidden",
        "border border-white/10",
        "bg-[#0e0e16]",
        "shadow-[0_0_0_1px_rgba(139,92,246,0.1),0_24px_64px_rgba(0,0,0,0.8)]",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}
