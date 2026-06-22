/* -------------------------------------------------------------------------- */
/*                              EDIT TASK MODAL                               */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Backdrop } from "./Backdrop";
import { Pencil, X } from "lucide-react";
import { ModalPanel } from "./ModalPanel";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeInput } from "../components/TimeInput";
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                Edit Task
              </h3>
              <p className="text-white/40 text-xs mt-1 truncate max-w-[220px]">
                {task.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <FormField
            id="et-title"
            label="Task title"
            required
            error={error ?? undefined}
          >
            <Input
              ref={inputRef}
              id="et-title"
              placeholder="What did you do?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>

          <FormField id="et-time" label="Time">
            <TimeInput value={time} onChange={setTime} />
          </FormField>

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
              disabled={!title.trim() || isLoading}
              loading={isLoading}
            >
              Save changes
            </Button>
          </div>
        </div>
      </ModalPanel>
    </Backdrop>
  );
}
