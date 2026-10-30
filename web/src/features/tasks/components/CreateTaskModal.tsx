/* -------------------------------------------------------------------------- */
/*                           QUICK ENTRY MODAL                                */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Backdrop } from "@/components/ui/Backdrop";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/ui/TimeInput";
import { CalendarCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalPanel } from "@/components/ui/ModalPanel";
import { useCreateTaskMutation } from "@/features/tasks/services/task.service";

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
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
      }).unwrap();

      onClose();
    } catch {
      setError("Couldn't save this task. Please try again.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0e0e16]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <CalendarCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-none">
                Create Daily Task
              </h3>
              <p className="text-white/45 text-xs mt-1">
                Schedule a focus block for today
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="h-8 w-8 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <FormField
            id="qa-details"
            label="Task Title / Details"
            required
            error={error ?? undefined}
          >
            <Input
              ref={inputRef}
              id="qa-details"
              placeholder="e.g. Implement user profile API endpoint"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>

          {/* Time picker */}
          <FormField id="qa-time" label="Scheduled Time (IST)">
            <TimeInput value={time} onChange={setTime} />
          </FormField>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              className="flex-1"
              onClick={handleSave}
              disabled={!details.trim() || isLoading}
              loading={isLoading}
            >
              Create Task
            </Button>
          </div>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
