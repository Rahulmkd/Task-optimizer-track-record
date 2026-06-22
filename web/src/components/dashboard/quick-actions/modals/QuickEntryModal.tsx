/* -------------------------------------------------------------------------- */
/*                           QUICK ENTRY MODAL                                */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { QuickAction } from "../types/quickActions.types";
import { Backdrop } from "./Backdrop";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { TimeInput } from "../components/TimeInput";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalPanel } from "./ModalPanel";
import { cn } from "@/lib/utils";
import { useCreateTaskMutation } from "@/features/tasks/services/task.service";

export function QuickEntryModal({
  action,
  onClose,
}: {
  action: QuickAction;
  onClose: () => void;
}) {
  const [details, setDetails] = useState("");
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSave = async () => {
    if (!details.trim()) return;

    setError(null);

    try {
      await createTask({
        title: details.trim(),
        time,
        actionId: action.isPreset ? undefined : action.id,
      }).unwrap();

      onClose();
    } catch {
      setError("Couldn't save this entry. Please try again.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel>
        {/* ── Gradient header ── */}
        <div
          className={cn(
            "relative flex items-center justify-between px-5 py-4",
            "bg-linear-to-r overflow-hidden",
            action.gradient,
          )}
        >
          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 border border-white/20 shadow-inner flex items-center justify-center">
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-none">
                {action.label}
              </h3>
              <p className="text-white/60 text-xs mt-1">Quick entry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative h-8 w-8 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-5 space-y-4">
          <FormField
            id="qa-details"
            label="Details"
            required
            error={error ?? undefined}
          >
            <Input
              ref={inputRef}
              id="qa-details"
              placeholder="What did you do?"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>

          {/* ── Premium time picker ── */}
          <FormField id="qa-time" label="Time">
            <TimeInput value={time} onChange={setTime} />
          </FormField>

          <p className="flex items-center gap-1.5 text-xs text-white/30">
            <Sparkles className="h-3 w-3 text-violet-400/60" />
            Head to the Tracker for full logging options.
          </p>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              className="flex-1 h-11"
              onClick={handleSave}
              disabled={!details.trim() || isLoading}
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
