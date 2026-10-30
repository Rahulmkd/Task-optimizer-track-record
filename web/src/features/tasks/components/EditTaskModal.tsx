/* -------------------------------------------------------------------------- */
/*                              EDIT TASK MODAL                               */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Backdrop } from "@/components/ui/Backdrop";
import { Pencil, X } from "lucide-react";
import { ModalPanel } from "@/components/ui/ModalPanel";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeInput } from "@/components/ui/TimeInput";
import { useUpdateTaskMutation } from "@/features/tasks/services/task.service";
import { ITask } from "@/features/tasks/types/task.types";

export function EditTaskModal({
  task,
  onClose,
}: {
  task: ITask;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [time, setTime] = useState(() => {
    if (task.time) return task.time;
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

  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const handleSave = async () => {
    if (!title.trim()) return;
    setError(null);

    try {
      await updateTask({
        id: task.id,
        data: {
          title: title.trim(),
          time,
        },
      }).unwrap();

      onClose();
    } catch {
      setError("Couldn't update this task. Please try again.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0e0e16]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Pencil className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-none">
                Edit Task
              </h3>
              <p className="text-white/45 text-xs mt-1 truncate max-w-[220px]">
                {task.title}
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
            id="et-title"
            label="Task Title"
            required
            error={error ?? undefined}
          >
            <Input
              ref={inputRef}
              id="et-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>

          <FormField id="et-time" label="Scheduled Time (IST)">
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
              disabled={!title.trim() || isLoading}
              loading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
