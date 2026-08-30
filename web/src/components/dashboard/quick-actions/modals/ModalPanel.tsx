import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ModelPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 18 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full max-w-md rounded-2xl overflow-hidden",
        "border border-white/10",
        "bg-[#0e0e16]",
        // outer glow
        "shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_24px_64px_rgba(0,0,0,0.7)]",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}
