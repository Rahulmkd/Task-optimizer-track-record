"use client";

/* -------------------------------------------------------------------------- */
/*                                CATEGORY CHIPS                              */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDeleteActionMutation,
  useGetActionsQuery,
} from "@/features/actions/services/action.service";
import { IAction } from "@/features/actions/types/action.types";
import { QuickAction } from "@/components/dashboard/quick-actions/types/quickActions.types";
import { actionStylePalette } from "@/components/dashboard/quick-actions/data/quickActionsData";
import { QuickEntryModal } from "@/components/dashboard/quick-actions/modals/QuickEntryModal";
import { NewActionModal } from "@/components/dashboard/quick-actions/modals/NewActionModal";

const toQuickAction = (action: IAction, index: number): QuickAction => {
  const style = actionStylePalette[index % actionStylePalette.length];
  return {
    id: action.id,
    label: action.actionName,
    taskCount: action.taskCount,
    isPreset: false,
    ...style,
  };
};

export function CategoryChips() {
  const { data: actionsData, isLoading } = useGetActionsQuery();
  const [deleteAction] = useDeleteActionMutation();

  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [showNewAction, setShowNewAction] = useState(false);

  const actions = (actionsData ?? []).map(toQuickAction);

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-20 rounded-full bg-zinc-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <CategoryChip
            key={action.id}
            action={action}
            onClick={() => setActiveAction(action)}
            onDelete={() => deleteAction(action.id)}
          />
        ))}

        <button
          type="button"
          onClick={() => setShowNewAction(true)}
          className={cn(
            "inline-flex items-center gap-1 h-7 px-3 rounded-full text-xs font-medium",
            "border border-dashed border-zinc-700 text-zinc-400",
            "hover:text-white hover:border-zinc-600 transition-colors duration-200",
          )}
        >
          <Plus className="h-3 w-3" />
          Category
        </button>
      </div>

      <AnimatePresence>
        {activeAction && (
          <QuickEntryModal
            action={activeAction}
            onClose={() => setActiveAction(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewAction && (
          <NewActionModal onClose={() => setShowNewAction(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function CategoryChip({
  action,
  onClick,
  onDelete,
}: {
  action: QuickAction;
  onClick: () => void;
  onDelete: () => void;
}) {
  const hasTasks = (action.taskCount ?? 0) > 0;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 h-7 pl-2.5 pr-3 rounded-full text-xs font-medium",
          "bg-zinc-800/70 border border-zinc-700/60 text-zinc-300",
          "hover:bg-zinc-800 hover:text-white transition-colors duration-200",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", action.accent)} />
        {action.label}
        {hasTasks && (
          <span className="text-zinc-500">· {action.taskCount}</span>
        )}
      </button>

      {!hasTasks && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete category"
          className={cn(
            "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center",
            "bg-zinc-900 border border-zinc-700 text-zinc-400",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "hover:text-red-400 hover:border-red-500/40 cursor-pointer",
          )}
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}
