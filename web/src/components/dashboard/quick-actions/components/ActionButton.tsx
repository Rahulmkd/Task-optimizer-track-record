/* -------------------------------------------------------------------------- */
/*                            ACTION BUTTON CARD                              */
/* -------------------------------------------------------------------------- */
import { motion } from "framer-motion";
import { QuickAction } from "../types/quickActions.types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export function ActionButton({
  action,
  index,
  onClick,
  onDelete,
}: {
  action: QuickAction;
  index: number;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const hasTasks = (action.taskCount ?? 0) > 0;
  const canDelete = Boolean(onDelete) && !action.isPreset;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      <motion.button
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={cn(
          "relative flex flex-col gap-3 p-4 rounded-xl text-white text-sm overflow-hidden w-full",
          "bg-gradient-to-br transition-all duration-300",
          action.gradient,
        )}
        style={{
          boxShadow: `0 2px 12px rgba(0,0,0,0.3)`,
        }}
        onHoverStart={(e) => {
          (e.target as HTMLElement).style.boxShadow =
            `0 8px 32px ${action.glow}, 0 0 0 1px rgba(255,255,255,0.12)`;
        }}
        onHoverEnd={(e) => {
          (e.target as HTMLElement).style.boxShadow =
            `0 2px 12px rgba(0,0,0,0.3)`;
        }}
      >
        {/* Noise / shimmer sweep */}
        <span
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600",
            "bg-gradient-to-br from-white/0 via-white/8 to-white/0",
            "translate-y-4 group-hover:translate-y-0 transition-transform duration-500",
          )}
        />

        {/* Icon */}
        <div className="relative z-10 h-9 w-9 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center shadow-inner">
          <action.icon className="h-4 w-4 text-white" />
        </div>

        {/* Label + plus */}
        <div className="relative z-10 flex items-end justify-between">
          <span className="font-semibold leading-tight text-[13px] truncate pr-1">
            {action.label}
          </span>
          <Plus className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300 shrink-0" />
        </div>
      </motion.button>

      {/* ── Delete affordance ──────────────────────────────────────────── */}
      {canDelete && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          whileHover={hasTasks ? undefined : { scale: 1.1 }}
          whileTap={hasTasks ? undefined : { scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasTasks) onDelete?.();
          }}
          title={
            hasTasks
              ? `Can't delete — ${action.taskCount} task${action.taskCount === 1 ? "" : "s"} still attached`
              : "Delete action"
          }
          disabled={hasTasks}
          className={cn(
            "absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full flex items-center justify-center",
            "border backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20",
            hasTasks
              ? "bg-white/10 border-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/10 border-red-400/40 text-white hover:bg-red-500 shadow-lg shadow-red-900/40 cursor-pointer",
          )}
        >
          <Trash2 className="h-3 w-3" />
        </motion.button>
      )}
    </motion.div>
  );
}
